// Level solver bot: proves a hand-authored level can be finished with the real
// player controller. Breadth-first search over standable surfaces; every edge
// is a simulated attempt (run, jump, double jump, steer, springs, vents, vines,
// wall-climbs, rides on sampled mover positions).

import { createPlayer, stepPlayer, maxGapFor, maxJumpHeight, barrelAngle } from '../public/js/core/physics.js';
import { PHYS } from '../public/js/core/config.js';
import { moverPos } from '../public/js/core/sim.js';

const DT = PHYS.dt;
const top = (c) => c.y + c.h;

function moverSamples(L) {
  // snapshot each mover at several moments; returns [{moverId, sample, colliders:[...]}]
  const out = [];
  const byId = new Map();
  const lookup = (id) => byId.get(id);
  for (const m of L.movers) {
    const P = m.path;
    let period, n;
    if (P.type === 'line') { period = P.T; n = 10; }
    else if (P.type === 'poly') { period = 1; n = 0; }
    else if (P.type === 'circle') { period = (Math.PI * 2) / Math.abs(P.omega); n = 12; }
    else if (P.type === 'bob') { period = P.T / 0.7 * 1.0; n = 10; }
    else if (P.type === 'stream') { period = P.span / P.speed; n = Math.max(6, Math.ceil((P.xEnd - P.xStart) / 2.5)); }
    else if (P.type === 'pendulum') { period = P.T; n = 12; }
    else if (P.type === 'weight') { period = 1; n = 0; }
    else if (P.type === 'mirror') { continue; }
    const samples = [];
    if (P.type === 'poly') {
      // sample along the path's length
      const tmp = { ...m, path: { ...P } };
      moverPos(tmp, 0, lookup);
      const len = tmp.path._len, cnt = Math.max(8, Math.ceil(len / 2.5));
      for (let i = 0; i < cnt; i++) samples.push(moverPos(tmp, (len * i / cnt) / P.speed, lookup));
    } else if (P.type === 'weight') {
      for (const k of [0, 0.25, 0.5, 0.75, 1]) samples.push({ x: P.x0, y: P.y0 + P.dir * P.range * k, alpha: 1 });
    } else if (P.type === 'stream') {
      for (let i = 0; i < n; i++) {
        const x = P.xStart - P.len + (P.xEnd - P.xStart + P.len) * (i + 0.5) / n;
        samples.push({ x, y: P.y, alpha: 1 });
      }
    } else {
      for (let i = 0; i < n; i++) samples.push(moverPos(m, period * i / n, lookup));
    }
    byId.set(m.id, samples[0]);
    const decks = m.decks || [[0, m.w, m.h]];
    samples.forEach((pos, i) => {
      if (pos.alpha !== undefined && pos.alpha < 0.6) return;
      out.push({ moverId: m.id, i, colliders: decks.map(([ox, w, t]) => ({ x: pos.x + ox, y: pos.y + (m.decks ? t - 0.3 : 0), w, h: m.decks ? 0.3 : m.h, oneWay: true, grab: !m.decks, active: true, dx: 0, dy: 0, mover: m.id })) });
    });
  }
  // mirror partners: mirror of each master sample
  for (const m of L.movers) {
    if (m.path.type !== 'mirror') continue;
    const master = L.movers.find((q) => q.id === m.path.master);
    const mp = master.path;
    for (let i = 0; i < 10; i++) {
      const pos = moverPos(master, mp.T * i / 10, lookup);
      out.push({ moverId: m.id, i, colliders: [{ x: 2 * m.path.m - (pos.x + m.w), y: pos.y, w: m.w, h: m.h, oneWay: true, grab: true, active: true, dx: 0, dy: 0, mover: m.id }] });
    }
  }
  return out;
}

export function solveLevel(L, opts = {}) {
  const gs = L.gravity;
  const maxH = maxJumpHeight(gs);
  const statics = [];
  for (const s of L.solids) {
    const c = { ...s, active: true, dx: 0, dy: 0, oneWay: !!s.oneWay, static: true };
    statics.push(c);
  }
  for (const b of L.bridges) statics.push({ id: b.id, x: b.x, y: b.y, w: b.w, h: b.h, active: true, oneWay: false, dx: 0, dy: 0, bridge: true });
  const hasSwitch = statics.some((c) => c.onoff);
  const lethal = L.hazards.filter((h) => h.respawn);
  const launchers = [];
  for (const l of L.launchers) {
    if (!l.path) { launchers.push(l); continue; }
    for (let i = 0; i <= 4; i++) launchers.push({ ...l, x: l.path.x0 + (l.path.x1 - l.path.x0) * i / 4 });
  }
  const zips = L.zips || [], barrels = L.barrels || [], rings = L.rings || [];
  const floorLethal = L.floor.lethal ? L.floor.y + 0.15 : -Infinity;

  // nodes: standable surfaces
  const nodes = [];
  for (const c of statics) {
    if (c.style === 'basin' || c.bounce || c.style === 'spring') continue;
    nodes.push({ key: c.id, cols: [c], col: c, kind: c.button ? 'button' : 'static' });
  }
  for (const sm of moverSamples(L)) {
    for (const c of sm.colliders) nodes.push({ key: `${sm.moverId}#${sm.i}:${c.x.toFixed(1)}`, cols: [c], col: c, kind: 'mover', mover: sm.moverId });
  }
  for (const rg of rings) nodes.push({ key: rg.id, kind: 'ring', ring: rg, col: { x: rg.x - 0.5, y: rg.y - 1.4, w: 1, h: 0.01, oneWay: true, active: false, dx: 0, dy: 0 } });
  for (const br of barrels) nodes.push({ key: br.id, kind: 'barrel', barrel: br, col: { x: br.x - 0.5, y: br.y - 1.4, w: 1, h: 0.01, oneWay: true, active: false, dx: 0, dy: 0 } });
  const bouncers = statics.filter((c) => c.bounce);
  const colliderSet = (sw, extra) => {
    const out = [];
    for (const c of statics) {
      if (c.onoff && ((c.onoff === 'red') !== (sw === 0))) continue;
      out.push(c);
    }
    for (const e of extra) if (!out.includes(e)) out.push(e);
    return out;
  };
  const vines = L.vines.map((v) => ({ ...v, angle: 0, omega: 0, grabbed: false }));
  const env = {
    gravityScale: gs,
    gravAt: (x, y) => { for (const z of L.gravZones) if (x >= z.x && x <= z.x + z.w && y >= z.y && y <= z.y + z.h) return z.low; return 1; },
    windAt: (x, y) => { let v = 0; for (const w of L.winds) if (w.gust && x >= w.x && x <= w.x + w.w && y >= w.y && y <= w.y + w.h) v += w.vx; return v; },
  };

  function attempt(A, B, sw, strat) {
    const cols = colliderSet(sw, [A.col, B.col].filter((c) => c.mover));
    const world = { colliders: cols, vines: vines.map((v) => ({ ...v })), zips, barrels, rings, time: strat.t0 || 0 };
    const a = A.col, b = B.col;
    const p = createPlayer(0, top(a));
    const bx = b.x + b.w / 2;
    const dir = strat.dir;
    // start position on A
    const takeoff = strat.takeoff;
    let sx = takeoff - dir * strat.runup;
    sx = Math.min(Math.max(sx, a.x + 0.42), a.x + a.w - 0.42);
    p.x = sx; p.y = top(a); p.onGround = true; p.ground = a;
    let jumped = false, jt = 0, doubled = false, phase = strat.via ? 0 : 1, pressedWall = 0, prevVy = 0, holdDir = strat.dir;
    if (A.kind === 'barrel') { p.x = A.barrel.x; p.y = A.barrel.y - p.h / 2; p.onGround = false; p.ground = null; p.barrel = A.barrel; p.barrelT = 0; jumped = true; }
    let wasBarrel = !!p.barrel;
    if (A.kind === 'ring') {           // start mid-fling, just past the hoop
      const rg = A.ring;
      p.x = rg.x; p.y = rg.y - p.h / 2; p.onGround = false; p.ground = null;
      p.extVx = rg.vx; p.vy = rg.vy; p.jumps = 1; p.ringCool = 0.3; p.lastRing = rg; jumped = true;
    }
    const target = () => (phase === 0 ? strat.via.x : B.kind === 'barrel' ? B.barrel.x : B.kind === 'ring' ? B.ring.x : Math.min(Math.max(strat.aim ?? bx, b.x + 0.5), b.x + b.w - 0.5));
    for (let i = 0; i < 720; i++) {
      const inp = { left: false, right: false, jump: true, jumpPressed: false, up: false, down: false };
      const tx = target();
      world.time += DT;
      if (p.barrel) {
        // fire when the barrel points the way we want (fixed barrels: straight away)
        const br = p.barrel;
        const want = Math.atan2((strat.aimY ?? top(b) + 2) - br.y, tx - br.x) + (strat.aimBias || 0);
        const ang = barrelAngle(br, world.time);
        const diff = Math.atan2(Math.sin(ang - want), Math.cos(ang - want));
        if (!br.spin || Math.abs(diff) < 0.12) inp.jumpPressed = p.barrelT > 0.09;
      } else if (p.zip) {
        const d = p.zip.dir;
        if ((d > 0 && p.x >= tx - 0.6) || (d < 0 && p.x <= tx + 0.6)) inp.jumpPressed = true;
      } else if (!jumped) {
        if (strat.via && strat.via.walk) { inp[tx > p.x ? 'right' : 'left'] = Math.abs(tx - p.x) > 0.2; if (Math.abs(tx - p.x) < 0.3 || !p.onGround) jumped = true; }
        else {
          inp[dir > 0 ? 'right' : 'left'] = true;
          if ((dir > 0 && p.x >= takeoff - 0.05) || (dir < 0 && p.x <= takeoff + 0.05) || Math.abs(p.x - takeoff) < 0.06 || !p.onGround || (i > 12 && Math.abs(p.vx) < 0.5)) { inp.jumpPressed = p.onGround; jumped = true; }
        }
      } else {
        jt += DT;
        if (p.swing) {
          // pump toward the target and let go on the forward swing
          const want = tx > p.swing.vine.ax ? 1 : -1;
          inp[want > 0 ? 'right' : 'left'] = true;
          const v = p.swing.vine;
          if (v.angle * want > 0.45 && v.omega * want > 0) inp.jumpPressed = true;
        } else if (strat.wall && p.y < top(b) - 0.3) {
          if (p.wall && pressedWall <= 0) { inp.jumpPressed = true; pressedWall = 0.12; holdDir = -p.wall; }
          pressedWall -= DT;
          inp[holdDir > 0 ? 'right' : 'left'] = true;
          if (!doubled && p.vy < -2 && !p.wall && p.jumps < 2) { inp.jumpPressed = true; doubled = true; }
        } else {
          if (p.x < tx - 0.15) inp.right = true; else if (p.x > tx + 0.15) inp.left = true;
          if (!doubled && strat.dbl != null && phase === 1 && (strat.dbl === 'apex' ? p.vy <= 0 : jt >= strat.dbl)) { inp.jumpPressed = true; doubled = true; }
        }
      }
      stepPlayer(p, inp, world, env, DT);
      if (B.kind === 'barrel' && p.barrel === B.barrel) return true;
      if (B.kind === 'ring' && p.flungBy === B.ring) return true;
      if (p.flungBy && B.kind !== 'ring' && A.kind !== 'ring' && p.flungBy !== strat.viaRing) return false;
      if (wasBarrel && !p.barrel) { phase = 1; jt = 0; jumped = true; }
      wasBarrel = !!p.barrel;
      if (p.barrel && B.kind !== 'barrel' && A.kind !== 'barrel' && p.barrel !== strat.viaBarrel) return false;
      // launchers (vents/geysers/updrafts) — assume they're firing when we need them
      for (const l of launchers) {
        if (p.x + p.w / 2 > l.x && p.x - p.w / 2 < l.x + l.w && p.y < l.y + l.h && p.y + p.h > l.y && p.vy < l.power * 0.9) {
          p.vy = l.power; p.onGround = false; p.ground = null; p.jumps = 1;
        }
      }
      if (phase === 0 && p.vy - prevVy > 5 && (jt > 0.03 || strat.via.walk)) { phase = 1; jt = 0; }   // bounced / launched → head for B
      prevVy = p.vy;
      if (strat.touch) { const dx = p.x - strat.touch.x, dy = p.y + p.h / 2 - strat.touch.y; if (dx * dx + dy * dy < 1.0) return true; }
      else if ((p.onGround && p.ground === b) || (p.hang && p.hang.plat === b)) return true;
      if (p.y < floorLethal || p.y < L.killY) return false;
      for (const h of lethal) if (p.x + p.w / 2 - 0.1 > h.x && p.x - p.w / 2 + 0.1 < h.x + h.w && p.y + 0.1 < h.y + h.h && p.y + p.h - 0.1 > h.y) return false;
      if (jumped && p.onGround && p.ground !== a && p.ground !== b && jt > 0.2 && !(strat.via && phase === 0)) return false;   // landed somewhere else
    }
    return false;
  }

  function strategies(A, B) {
    const a = A.col, b = B.col;
    const out = [];
    if (A.kind === 'ring') {
      const dist = Math.hypot(b.x + b.w / 2 - A.ring.x, top(b) - A.ring.y);
      if (dist > 40) return out;
      return [{ dir: 1, takeoff: A.ring.x, runup: 0, dbl: null }, { dir: 1, takeoff: A.ring.x, runup: 0, dbl: 'apex' }, { dir: 1, takeoff: A.ring.x, runup: 0, dbl: 0.25 }];
    }
    if (A.kind === 'barrel') {
      const br = A.barrel;
      const dist = Math.hypot(b.x + b.w / 2 - br.x, top(b) - br.y);
      if (dist > (br.power || 18) * 2.2) return out;
      if (!br.spin) return [{ dir: 1, takeoff: br.x, runup: 0, dbl: null }, { dir: 1, takeoff: br.x, runup: 0, dbl: 'apex' }];
      for (const bias of [0.35, 0.15, 0.6, 0, 0.85]) out.push({ dir: 1, takeoff: br.x, runup: 0, dbl: null, aimBias: bias, aimY: top(b) });
      for (const bias of [0.35, 0.6]) out.push({ dir: 1, takeoff: br.x, runup: 0, dbl: 'apex', aimBias: bias, aimY: top(b) });
      return out;
    }
    const ta = top(a), tb = top(b);
    const dy = tb - ta;
    const gapR = b.x - (a.x + a.w), gapL = a.x - (b.x + b.w);
    const gx = Math.max(0, gapR, gapL);
    const dirs = gapR >= -0.01 ? [1] : gapL >= -0.01 ? [-1] : [1, -1];
    const nearA = (o, r) => o.x < a.x + a.w + r && o.x + (o.w || 0) > a.x - r;
    const boostReach = a.conveyor ? Math.max(0, a.conveyor * (gapR >= 0 ? 1 : -1)) * 1.4 : 0;   // boost lanes carry speed into the jump
    const reachable = dy <= maxH + 0.4 && gx <= maxGapFor(Math.max(-12, dy), gs) + 0.6 + boostReach;
    const dbls = [null, 'apex', 0.25, 0.45, 0.65, 0.9];
    if (reachable) {
      for (const dir of dirs) {
        const edge = dir > 0 ? a.x + a.w - 0.4 : a.x + 0.4;
        const overlap = gapR < 0 && gapL < 0;
        const near = dir > 0 ? b.x - 0.3 : b.x + b.w + 0.3;
        const takeoffs = overlap ? [near, near - dir * 1.5, near - dir * 2.6, near - dir * 3.6, edge] : [edge, a.x + a.w / 2];
        for (const tk of takeoffs) for (const dbl of dbls) out.push({ dir, takeoff: tk, runup: 3, dbl });
      }
    }
    // springs / mushrooms / vents near A
    for (const s of bouncers) if (nearA(s, 6) && top(s) >= ta - 0.1 && top(s) <= ta + maxH) {
      const dir = s.x + s.w / 2 > a.x + a.w / 2 ? 1 : -1;
      out.push({ dir, takeoff: s.x + s.w / 2 - dir * 0.5, runup: 2, via: { x: s.x + s.w / 2 }, dbl: 'apex' });
      out.push({ dir, takeoff: s.x + s.w / 2 - dir * 0.5, runup: 2, via: { x: s.x + s.w / 2 }, dbl: null });
    }
    for (const l of launchers) if (nearA(l, 4) && Math.abs(l.y - ta) < 1.5) {
      const dir = l.x + l.w / 2 > a.x + a.w / 2 ? 1 : -1;
      out.push({ dir, takeoff: l.x + l.w / 2, runup: 2, via: { x: l.x + l.w / 2, walk: true }, dbl: 'apex' });
      out.push({ dir, takeoff: l.x + l.w / 2, runup: 2, via: { x: l.x + l.w / 2, walk: true }, dbl: null });
    }
    // vines / gusts / gravity zones / wall shafts: try long jumps that pure envelopes would reject
    const special = L.vines.length || L.winds.some((w) => w.gust) || L.gravZones.length || zips.length;
    if (!reachable && special && gx < (zips.length ? 45 : 26) && dy < maxH + 2) {
      for (const dir of dirs) {
        const edge = dir > 0 ? a.x + a.w - 0.4 : a.x + 0.4;
        for (const dbl of [null, 'apex', 0.5, 0.8]) out.push({ dir, takeoff: edge, runup: 3, dbl });
      }
    }
    if (dy > 1.5 && gx < 4 && dy < 24) {
      for (const dir of [1, -1]) out.push({ dir, takeoff: dir > 0 ? a.x + a.w - 0.4 : a.x + 0.4, runup: 2, wall: true, dbl: null });
    }
    return out;
  }

  // can the robot touch point k from some reached surface? (simulated)
  function shardReachable(k) {
    const reachedNodes = [...seen].map((s) => [nodes.find((n) => n.key === s.split('|')[0]), +s.split('|')[1]]).filter(([n]) => n);
    for (const [A, sw] of reachedNodes) {
      const a = A.col;
      if (k.x < a.x - 14 || k.x > a.x + a.w + 14 || k.y < top(a) - 12 || k.y > top(a) + maxH + 9) continue;
      // standing on the surface already touches it?
      if (k.x > a.x - 0.5 && k.x < a.x + a.w + 0.5 && k.y > top(a) && k.y < top(a) + 2.2) return true;
      const fake = { col: { x: k.x - 0.5, y: k.y - 0.5, w: 1, h: 0.01, oneWay: true, active: false, dx: 0, dy: 0 } };
      for (const st of strategies(A, fake)) {
        st.touch = k;
        if (attempt(A, fake, sw, st)) return true;
      }
    }
    return false;
  }

  // ---- BFS ----
  const spawnNode = nodes.find((n) => n.kind !== 'mover' && L.spawn.x >= n.col.x && L.spawn.x <= n.col.x + n.col.w && Math.abs(top(n.col) - L.spawn.y) < 0.05);
  const goalNode = nodes.filter((n) => n.kind !== 'mover' && L.goal.x >= n.col.x - 0.5 && L.goal.x <= n.col.x + n.col.w + 0.5 && Math.abs(top(n.col) - L.goal.y) < 0.05);
  const problems = [];
  if (!spawnNode) problems.push('spawn is not on a platform');
  if (!goalNode.length) problems.push('goal is not on a platform');
  if (problems.length) return { ok: false, problems, reached: 0, nodes: nodes.length };
  const seen = new Set();
  const key = (n, sw) => n.key + '|' + sw;
  const queue = [[spawnNode, 0]];
  seen.add(key(spawnNode, 0));
  const parent = new Map();
  let goalHit = null, sims = 0;
  const budget = opts.budget ?? 60000;
  while (queue.length && sims < budget) {
    const [A, sw] = queue.shift();
    if (goalNode.includes(A)) { goalHit = [A, sw]; if (!opts.full) break; }
    for (const B of nodes) {
      if (B === A) continue;
      const nsw = B.kind === 'button' ? (hasSwitch ? 1 - sw : sw) : sw;
      if (seen.has(key(B, nsw))) continue;
      if (B.col.onoff && ((B.col.onoff === 'red') !== (sw === 0))) continue;
      if (A.mover && B.mover === A.mover) { seen.add(key(B, nsw)); parent.set(key(B, nsw), key(A, sw)); queue.push([B, nsw]); continue; }   // riding
      const strats = strategies(A, B);
      for (const st of strats) {
        sims++;
        if (attempt(A, B, sw, st)) {
          seen.add(key(B, nsw)); parent.set(key(B, nsw), key(A, sw)); queue.push([B, nsw]);
          break;
        }
      }
    }
  }
  // shards: heuristic — within jump reach above/around a reached surface
  const reachedCols = [...seen].map((k) => nodes.find((n) => n.key === k.split('|')[0])).filter(Boolean).map((n) => n.col);
  const shards = L.pickups.filter((k) => k.type === 'shard');
  const missingShards = opts.full ? shards.filter((k) => !shardReachable(k)) : [];
  if (!goalHit) problems.push(sims >= budget ? 'search budget exhausted before reaching the goal' : 'goal unreachable');
  const fmt = (c) => `${c.style || 'm'}@${c.x.toFixed(1)},${top(c).toFixed(1)}w${c.w.toFixed(1)}`;
  const reachedSet = new Set(reachedCols);
  const unreached = nodes.filter((n) => n.kind !== 'mover' && !reachedSet.has(n.col)).map((n) => fmt(n.col));
  return { ok: !!goalHit, problems, reached: seen.size, nodes: nodes.length, sims, missingShards: missingShards.map((k) => [k.x, k.y]), unreached, reachedList: reachedCols.filter((c) => !c.mover).map(fmt) };
}
