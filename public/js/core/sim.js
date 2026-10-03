// LevelSim: the deterministic runtime of one level (entities, hazards,
// pickups, goal). Pure logic, no rendering — the renderer just reads it.

import { PHYS, MAX_HEALTH } from './config.js';
import { createPlayer, stepPlayer } from './physics.js';

const WARP_MODES = [1, 2.6, 0, -1];       // normal, fast-forward, frozen, reverse
export const WARP_PERIOD = 2.4;

const TAU = Math.PI * 2;

export function phaseOf(pulse, t) {
  // returns 'idle' | 'warn' | 'on'
  const u = ((t + pulse.off) % pulse.P + pulse.P) % pulse.P;
  if (u < pulse.warn) return 'warn';
  if (u < pulse.warn + pulse.on) return 'on';
  return 'idle';
}

function boxHit(p, b, shrink = 0.1) {
  return p.x - p.w / 2 + shrink < b.x + b.w && p.x + p.w / 2 - shrink > b.x &&
    p.y + shrink < b.y + b.h && p.y + p.h - shrink > b.y;
}

export function moverPos(m, tau, lookup) {
  const P = m.path;
  switch (P.type) {
    case 'line': {
      const u = 0.5 - 0.5 * Math.cos(TAU * (tau / P.T + P.phase));
      return { x: P.x0 + (P.x1 - P.x0) * u, y: P.y0 + (P.y1 - P.y0) * u, alpha: 1 };
    }
    case 'circle': {
      const a = P.a0 + P.omega * tau;
      return { x: P.cx + P.r * Math.cos(a) - m.w / 2, y: P.cy + P.r * Math.sin(a) - m.h, alpha: 1, angle: a };
    }
    case 'bob': {
      const k = TAU * (tau / P.T + P.phase);
      return { x: P.x0 + P.ax * Math.sin(k), y: P.y0 + P.ay * Math.sin(k * 0.7 + 1), alpha: 1, angle: k * 0.15 };
    }
    case 'stream': {
      const d = (((tau * P.speed + P.offset) % P.span) + P.span) % P.span;
      const x = P.xStart - P.len + d;
      const fadeIn = Math.min(1, Math.max(0, (x - (P.xStart - P.len)) / 1.6));
      const fadeOut = Math.min(1, Math.max(0, (P.xEnd - (x + P.len)) / 1.6));
      const y = P.y + (P.bob ? Math.sin(tau * 2.1 + P.offset) * P.bob : 0);
      return { x, y, alpha: Math.min(fadeIn, fadeOut) };
    }
    case 'poly': {
      // multi-point path, looped or ping-pong, constant speed along its length
      const pts = P.pts;
      if (!P._len) {
        P._seg = [];
        let L = 0;
        const n = P.loop ? pts.length : pts.length - 1;
        for (let i = 0; i < n; i++) {
          const a = pts[i], b = pts[(i + 1) % pts.length];
          const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
          P._seg.push([L, l, a, b]); L += l;
        }
        P._len = L;
      }
      let d = tau * P.speed + (P.phase || 0) * P._len;
      if (P.loop) d = ((d % P._len) + P._len) % P._len;
      else { const per = P._len * 2; d = ((d % per) + per) % per; if (d > P._len) d = per - d; }
      for (const [L0, l, a, b] of P._seg) {
        if (d <= L0 + l || L0 + l >= P._len - 1e-9) {
          const u = l > 0 ? Math.min(1, (d - L0) / l) : 0;
          return { x: a[0] + (b[0] - a[0]) * u - m.w / 2, y: a[1] + (b[1] - a[1]) * u - m.h, alpha: 1 };
        }
      }
      return { x: pts[0][0] - m.w / 2, y: pts[0][1] - m.h, alpha: 1 };
    }
    case 'mirror': {
      const master = lookup(P.master);
      return { x: 2 * P.m - (master.x + m.w), y: master.y, alpha: 1 };
    }
    default: throw new Error('bad path ' + P.type);
  }
}

export class LevelSim {
  constructor(level) {
    this.L = level;
    this.t = 0;
    this.events = [];
    this.health = MAX_HEALTH;
    this.cells = 0;
    this.shards = 0;
    this.collected = new Set();
    this.checkpointReached = false;
    this.complete = false;
    this.completeT = 0;
    this.deaths = 0;
    this.hits = 0;
    this.invuln = 0;
    this.player = createPlayer(level.spawn.x, level.spawn.y);
    this.lastSafe = { x: level.spawn.x, y: level.spawn.y };
    this.colliders = [];
    this.byId = new Map();

    for (const s of level.solids) {
      const c = { ...s, active: true, oneWay: !!s.oneWay, dx: 0, dy: 0, static: true };
      if (s.crumble) { c.crumbleStart = -1; c.fallT = -1; }
      this.colliders.push(c);
      this.byId.set(s.id, c);
    }
    this.moverState = level.movers.map((m) => {
      const st = { def: m, id: m.id, tau: 0, x: 0, y: 0, alpha: 1, angle: 0, warpScale: 1, colliders: [] };
      const decks = m.decks || [[0, m.w, m.h]];
      for (const [ox, w, top] of decks) {
        const c = { id: m.id + ':' + ox, x: 0, y: 0, w, h: m.decks ? 0.3 : m.h, ox, oy: m.decks ? top - 0.3 : 0, oneWay: true, grab: !m.decks, active: true, dx: 0, dy: 0, mover: m.id };
        st.colliders.push(c);
        this.colliders.push(c);
      }
      return st;
    });
    this.moverById = new Map(this.moverState.map((s) => [s.id, s]));
    this.bridgeState = level.bridges.map((b) => {
      const c = { id: b.id, x: b.x, y: b.y, w: b.w, h: b.h, active: false, oneWay: false, dx: 0, dy: 0, bridge: true };
      this.colliders.push(c);
      return { def: b, c, litT: -1 };
    });
    this.doorState = level.doors.map((d) => {
      const c = { id: d.id, x: d.x, y: d.y, w: d.w, h: d.h, active: true, oneWay: false, dx: 0, dy: 0, door: true };
      this.colliders.push(c);
      return { def: d, c, open: 0 };
    });
    this.vines = level.vines.map((v) => ({ ...v, angle: 0, omega: 0, grabbed: false }));
    this.hazardState = level.hazards.map((h) => ({ def: h, x: h.x, y: h.y, state: h.pulse ? 'idle' : 'on' }));
    this.meteorState = level.meteors.map((m) => ({ def: m, x: m.x, y: m.y0, k: 0, falling: false }));
    this.launcherState = level.launchers.map((l) => ({ def: l, state: l.pulse ? 'idle' : 'on', cool: 0 }));
    this.windState = level.winds.map((w) => ({ def: w, state: 'idle' }));
    this.gravState = level.gravZones.map((z) => ({ def: z, low: true }));
    this.world = { colliders: this.colliders, vines: this.vines };
    this.crumbles = this.colliders.filter((c) => c.crumble);
    this.blinks = this.colliders.filter((c) => c.blink);
    this.onoffs = this.colliders.filter((c) => c.onoff);
    this.switchState = 0;
    this.applySwitch();
    this.enemies = (level.enemies || []).map((e) => ({ def: e, x: e.x, y: e.y, alive: true, dir: 1, deadT: 0 }));
    this.turrets = (level.turrets || []).map((t) => ({ def: t, lastShot: -1 }));
    this.shots = [];
    this.onButton = false;
    this.heats = this.colliders.filter((c) => c.heat);
    this.floorY = level.floor.y;
    this.chaser = level.chaser ? { ...level.chaser, active: false, x: -1e9 } : null;
    this.env = {
      gravityScale: level.gravity,
      windAt: (x, y) => this.windAt(x, y),
      gravAt: (x, y) => this.gravAt(x, y),
    };
    this.updateEntities(0);
  }

  windAt(x, y) {
    let v = 0;
    for (const w of this.windState) {
      const d = w.def;
      if (w.state === 'on' && x >= d.x && x <= d.x + d.w && y >= d.y && y <= d.y + d.h) v += d.vx;
    }
    if (this.L.globalWind) v += this.globalWindNow;
    return v;
  }

  gravAt(x, y) {
    for (const z of this.gravState) {
      const d = z.def;
      if (x >= d.x && x <= d.x + d.w && y >= d.y && y <= d.y + d.h) return z.low ? d.low : d.high;
    }
    return 1;
  }

  applySwitch() {
    for (const c of this.onoffs) c.active = (c.onoff === 'red') === (this.switchState === 0);
  }

  emit(type, data) { this.events.push({ type, t: this.t, ...data }); }

  updateEntities(dt) {
    const t = this.t;
    const lookup = (id) => this.moverById.get(id);
    for (const st of this.moverState) {
      const m = st.def;
      if (m.warp) {
        const idx = Math.floor((t + (st.def.path.phase || 0) * 7) / WARP_PERIOD) % WARP_MODES.length;
        st.warpScale = WARP_MODES[idx];
        st.warpMode = idx;
      }
      st.tau += dt * st.warpScale;
      const prevX = st.x, prevY = st.y;
      const pos = moverPos(m, st.tau, lookup);
      st.x = pos.x; st.y = pos.y; st.alpha = pos.alpha; st.angle = pos.angle || 0;
      let dx = st.x - prevX, dy = st.y - prevY;
      if (dt === 0 || Math.abs(dx) > 3) { dx = 0; dy = 0; }   // first tick or stream wrap
      for (const c of st.colliders) {
        c.x = st.x + c.ox; c.y = st.y + c.oy;
        c.dx = dx; c.dy = dy;
        c.active = st.alpha > 0.55;
      }
    }
    for (const c of this.blinks) {
      // solid for `on` seconds (flickering for the last 0.6s), then gone until the period wraps
      const B = c.blink, u = (((t + (B.off || 0)) % B.P) + B.P) % B.P;
      c.active = u < B.on;
      c.blinkPhase = !c.active ? 'gone' : u > B.on - 0.6 ? 'warn' : 'on';
    }
    for (const e of this.enemies) {
      const d = e.def;
      if (!e.alive) continue;
      if (d.type === 'flyer') {
        const k = (Math.PI * 2 * t) / (d.T || 4);
        e.x = d.x + Math.sin(k) * (d.ax ?? 3);
        e.y = d.y + Math.sin(k * 2) * (d.ay ?? 1);
      } else {
        // walkers / spikers patrol back and forth along their ledge
        const range = d.range || 4, sp = d.speed || 1.6;
        const u = ((t * sp) % (range * 2) + range * 2) % (range * 2);
        e.dir = u < range ? 1 : -1;
        e.x = d.x + (u < range ? u : range * 2 - u);
        e.y = d.y;
      }
    }
    for (const h of this.hazardState) {
      if (h.def.pulse) h.state = phaseOf(h.def.pulse, t);
      if (h.def.path) {
        const pos = moverPos(h.def, t, lookup);
        h.x = pos.x; h.y = pos.y;
      }
    }
    for (const m of this.meteorState) {
      const d = m.def;
      const u = (((t + d.off) % d.P) + d.P) % d.P;
      m.k = u / d.fall;
      m.falling = m.k < 1;
      const k = Math.min(1, m.k);
      m.x = d.x - d.drift * (1 - k);
      m.y = d.y0 + (d.y1 - d.y0) * k;
      m.warn = d.P - u < 1.0 || m.falling; // shadow marker shows before impact
    }
    for (const d of this.doorState) {
      const P = d.def.P;
      const u = (((t + d.def.off) % P) + P) % P;
      const openNow = u < P * d.def.openFrac;
      // jaws animate over ~0.25s at both ends of the open window
      const edge = Math.min(u, P * d.def.openFrac - u);
      d.open = openNow ? Math.min(1, edge / 0.25) : 0;
      d.c.active = !openNow || d.open < 0.6;
    }
    for (const l of this.launcherState) {
      if (l.def.pulse) l.state = phaseOf(l.def.pulse, t);
      l.cool = Math.max(0, l.cool - dt);
    }
    for (const w of this.windState) w.state = phaseOf(w.def.pulse, t);
    for (const z of this.gravState) {
      const d = z.def;
      const u = (((t + d.off) % d.P) + d.P) % d.P;
      z.low = u < d.P * d.lowFrac;
      z.u = u / d.P;
    }
    if (this.L.globalWind) {
      const gw = this.L.globalWind;
      this.globalWindNow = gw.amp * Math.sin((TAU * t) / gw.T);
    }
    for (const v of this.vines) {
      if (!v.grabbed) {
        const target = 0.32 * Math.sin(t * 1.5 + v.phase);
        v.omega = (target - v.angle) * 4;
        v.angle += v.omega * dt;
      }
    }
  }

  hurt(respawn, reason) {
    const p = this.player;
    if (this.complete) return;
    const damage = this.invuln <= 0 || respawn;
    if (damage && this.invuln <= 0) {
      this.health -= 1;
      this.hits++;
      this.invuln = 1.5;
      this.emit('hurt', { reason });
    }
    if (this.health <= 0) {
      this.deaths++;
      this.health = MAX_HEALTH;
      const cp = this.checkpointReached ? this.L.checkpoint : this.L.spawn;
      this.placePlayer(cp.x, cp.y);
      this.lastSafe = { x: cp.x, y: cp.y };
      this.relieve(cp.x, cp.y);
      for (const e of this.enemies) e.alive = true;
      this.emit('fail', {});
      return;
    }
    if (respawn) {
      this.placePlayer(this.lastSafe.x, this.lastSafe.y);
      this.relieve(this.lastSafe.x, this.lastSafe.y);
      this.emit('respawn', {});
    } else if (damage) {
      p.vy = 9; p.vx = -p.facing * 7; p.onGround = false;
      p.hang = null; p.climb = null;
      if (p.swing) { p.swing.vine.grabbed = false; p.swing = null; p.vineCooldown = 0.5; }
    }
  }

  // after a respawn push the chaser / tide back so the player gets a fair restart
  relieve(x, y) {
    if (this.chaser && this.chaser.active) this.chaser.x = Math.min(this.chaser.x, x - 12);
    if (this.L.tide) this.floorY = Math.min(this.floorY, y - 5);
  }

  placePlayer(x, y) {
    const p = this.player;
    p.x = x; p.y = y + 0.05; p.vx = 0; p.vy = 0; p.extVx = 0;
    p.hang = null; p.climb = null;
    if (p.swing) { p.swing.vine.grabbed = false; p.swing = null; }
    p.onGround = false; p.ground = null; p.jumps = 0;
  }

  teleport(x, y) { this.placePlayer(x, y); }

  step(input, dt = PHYS.dt) {
    if (this.complete) {
      this.completeT += dt;
      this.t += dt;
      this.updateEntities(dt);
      return;
    }
    this.t += dt;
    this.invuln = Math.max(0, this.invuln - dt);
    this.updateEntities(dt);
    const p = this.player;
    // crumbling platforms: shake 0.55s after first touch, fall, then re-form
    for (const c of this.crumbles) {
      if (c.fallT >= 0) {
        if (this.t - c.fallT > 2.6 && !(p.x + p.w / 2 > c.x && p.x - p.w / 2 < c.x + c.w && p.y < c.y + c.h + 0.1 && p.y + p.h > c.y)) {
          c.active = true; c.fallT = -1; c.crumbleStart = -1;
        }
      } else if (c.crumbleStart >= 0 && this.t - c.crumbleStart > 0.55) {
        c.active = false; c.fallT = this.t;
        if (p.ground === c) { p.onGround = false; p.ground = null; }
        this.emit('crumble', { id: c.id });
      }
    }
    // rising tide
    if (this.L.tide && this.t > this.L.tide.delay) {
      this.floorY = Math.min(this.L.goal.y - 3, this.floorY + this.L.tide.rate * dt);
    }
    const evs = stepPlayer(p, input, this.world, this.env, dt);
    for (const e of evs) this.emit(e, {});

    if (p.onGround && p.ground && p.ground.crumble && p.ground.crumbleStart < 0) {
      p.ground.crumbleStart = this.t;
      this.emit('crumbling', { id: p.ground.id });
    }
    if (p.onGround && p.ground && p.ground.heat && phaseOf(p.ground.heat, this.t) === 'on') this.hurt(false, 'heat');

    // remember the last solid, safe footing for respawns
    if (p.onGround && p.ground && p.ground.static && !p.ground.bounce && !p.ground.crumble && !p.ground.heat && !p.ground.oneWay && !p.ground.blink && !p.ground.onoff && !p.ground.button) {
      const g = p.ground;
      this.lastSafe = { x: Math.min(Math.max(p.x, g.x + 0.7), g.x + g.w - 0.7), y: g.y + g.h };
    }

    // launchers (vents / geysers / updrafts)
    for (const l of this.launcherState) {
      if (l.state !== 'on') continue;
      const d = l.def;
      if (boxHit(p, d, 0.15) && p.vy < d.power * 0.9) {
        if (p.hang || p.climb) continue;
        p.vy = d.power; p.onGround = false; p.ground = null; p.jumps = 1; p.jumpHeld = false;
        if (l.cool <= 0) { this.emit('launch', { kind: d.type }); l.cool = 0.4; }
      }
    }
    if (evs.includes('bounce')) this.emit('launch', { kind: 'mushroom' });

    // bridges of solid light
    for (const b of this.bridgeState) {
      if (!b.c.active && boxHit(p, b.def.trigger, 0)) {
        b.c.active = true; b.litT = this.t;
        this.emit('bridge', {});
      }
    }

    // hazards
    for (const h of this.hazardState) {
      const d = h.def;
      if (h.state !== 'on') continue;
      const box = { x: h.x, y: h.y, w: d.w, h: d.h };
      if (boxHit(p, box, d.type === 'acid' ? 0.3 : 0.12)) this.hurt(!!d.respawn, d.type);
    }
    for (const m of this.meteorState) {
      if (!m.falling) continue;
      const dx = p.x - m.x, dy = p.y + p.h / 2 - m.y;
      if (dx * dx + dy * dy < (m.def.r + 0.45) ** 2) this.hurt(false, 'meteor');
    }
    for (const d of this.doorState) {
      if (d.c.active) {
        const b = { x: d.c.x - 0.08, y: d.c.y, w: d.c.w + 0.16, h: d.c.h };
        if (boxHit(p, b, 0)) {
          this.hurt(false, 'plant');
          // squeeze out to the near side
          if (p.x < d.c.x + d.c.w / 2) p.x = Math.min(p.x, d.c.x - p.w / 2 - 0.05);
          else p.x = Math.max(p.x, d.c.x + d.c.w + p.w / 2 + 0.05);
        }
      }
    }

    // falling into the world floor / out of the level
    const F = this.L.floor;
    if ((F.lethal && p.y < this.floorY + 0.15) || p.y < this.L.killY) this.hurt(true, 'fall');

    // the chaser: a wall that sweeps in from the left
    const ch = this.chaser;
    if (ch) {
      if (!ch.active && p.x > ch.trigger) { ch.active = true; ch.x = ch.trigger - ch.behind; this.emit('chaser', {}); }
      if (ch.active) {
        const lead = p.x - ch.x;
        ch.x += ch.speed * (1 + Math.max(0, (lead - 30) / 25)) * dt;   // rubber-band so it stays a threat
        if (p.x - p.w / 2 < ch.x) this.hurt(true, 'chaser');
      }
    }

    // floor buttons flip red/blue blocks each time you land on them
    const onBtn = !!(p.onGround && p.ground && p.ground.button);
    if (onBtn && !this.onButton) {
      this.switchState = 1 - this.switchState;
      this.applySwitch();
      this.emit('switch', { state: this.switchState });
    }
    this.onButton = onBtn;

    // enemies: stomp from above (except spikers), otherwise they hurt
    for (const e of this.enemies) {
      if (!e.alive) continue;
      const hw = e.def.type === 'flyer' ? 0.55 : 0.5, hh = e.def.type === 'flyer' ? 0.7 : 0.9;
      const ey = e.def.type === 'flyer' ? e.y - hh / 2 : e.y;
      if (p.x + p.w / 2 > e.x - hw && p.x - p.w / 2 < e.x + hw && p.y < ey + hh && p.y + p.h > ey) {
        if (e.def.type !== 'spiker' && p.vy < 0 && p.y > ey + hh * 0.35) {
          e.alive = false; e.deadT = this.t;
          p.vy = 11; p.jumps = 1; p.onGround = false;
          this.cells++;
          this.emit('stomp', { x: e.x, y: ey + hh / 2 });
        } else this.hurt(false, 'enemy');
      }
    }
    // turrets fire glowing bolts on a rhythm
    for (const tu of this.turrets) {
      const d = tu.def, P = d.P || 2.5;
      const k = Math.floor((this.t + (d.off || 0)) / P);
      if (k !== tu.lastShot) {
        if (tu.lastShot >= 0) { this.shots.push({ x: d.x + d.dir * 0.8, y: d.y, vx: d.dir * (d.speed || 7), life: (d.range || 26) / (d.speed || 7) }); this.emit('shoot', { x: d.x, y: d.y }); }
        tu.lastShot = k;
      }
    }
    for (let i = this.shots.length - 1; i >= 0; i--) {
      const b = this.shots[i];
      b.x += b.vx * dt; b.life -= dt;
      let dead = b.life <= 0;
      if (!dead) for (const c of this.colliders) {
        if (c.active === false || c.oneWay || c.mover) continue;
        if (b.x > c.x && b.x < c.x + c.w && b.y > c.y && b.y < c.y + c.h) { dead = true; break; }
      }
      if (!dead && Math.abs(p.x - b.x) < p.w / 2 + 0.3 && b.y > p.y && b.y < p.y + p.h) { this.hurt(false, 'shot'); dead = true; }
      if (dead) this.shots.splice(i, 1);
    }

    // pickups
    for (const k of this.L.pickups) {
      if (this.collected.has(k.id)) continue;
      const dx = p.x - k.x, dy = p.y + p.h / 2 - k.y;
      if (dx * dx + dy * dy < 1.0) {
        this.collected.add(k.id);
        if (k.type === 'cell') { this.cells++; this.emit('cell', { id: k.id }); }
        else if (k.type === 'shard') { this.shards++; this.emit('shard', { id: k.id }); }
        else if (k.type === 'heart') { this.health = Math.min(MAX_HEALTH, this.health + 1); this.emit('heart', { id: k.id }); }
      }
    }

    const cp = this.L.checkpoint;
    if (cp && !this.checkpointReached && Math.abs(p.x - cp.x) < 1.2 && Math.abs(p.y - cp.y) < 2.5) {
      this.checkpointReached = true;
      this.emit('checkpoint', {});
    }

    const g = this.L.goal;
    if (Math.abs(p.x - g.x) < 1.2 && p.y + p.h > g.y && p.y < g.y + 3.2) {
      this.complete = true;
      this.completeT = 0;
      p.vx = 0; p.extVx = 0;
      this.emit('complete', {});
    }
  }

  score() {
    const par = 20 + this.L.goal.x / 7;
    const timeBonus = Math.max(0, Math.round((par - this.t) * 25));
    return this.cells * 100 + this.shards * 500 + this.health * 250 + timeBonus + Math.round(this.L.diff * 500) - this.deaths * 300;
  }
}
