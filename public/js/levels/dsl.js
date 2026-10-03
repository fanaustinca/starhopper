// Level authoring DSL. Every level in the game is written by hand with these
// calls (absolute world units: x → right, y → up, `top` = walkable surface).
// Nothing here is random: a level is exactly what its author wrote.
//
//   L('Name', 'kind', (b) => { b.start(0, 0, 12); b.plat(15, 1, 4); ... b.goal(90, 2); })
//
// See levels/README.md for the full reference.

import { WORLDS, PHYS, locationOf } from '../core/config.js';

export const VEHICLES = {
  bus:   { len: 8.0, height: 4.6, decks: [[0.2, 7.6, 0.5], [0.2, 7.6, 2.6], [0.0, 8.0, 4.6]] },
  car:   { len: 4.2, height: 1.35, decks: [[0.2, 3.8, 1.35]] },
  taxi:  { len: 4.4, height: 1.4, decks: [[0.2, 4.0, 1.4]] },
  truck: { len: 9.0, height: 3.2, decks: [[0.0, 6.6, 3.2], [6.8, 2.2, 2.5]] },
  boat:  { len: 7.0, height: 2.6, decks: [[0.0, 7.0, 1.0], [2.0, 2.8, 2.6]] },
  plane: { len: 11.0, height: 1.6, decks: [[1.0, 9.0, 1.6]] },
  rover: { len: 5.0, height: 2.0, decks: [[0.2, 4.6, 2.0]] },
  ring:  { len: 2.4, height: 1.0, decks: [[0.0, 2.4, 1.0]] },
};

export function L(name, kind, build) { return { name, kind, build }; }

const pulse = (o, d) => ({ P: o.P ?? d.P, on: o.on ?? d.on, warn: o.warn ?? d.warn ?? 0.7, off: o.off ?? 0 });

export class LevelBuilder {
  constructor(index, worldIndex, sub) {
    this.index = index; this.worldIndex = worldIndex; this.sub = sub;
    this.W = WORLDS[worldIndex];
    this.n = 0;
    this.solids = []; this.movers = []; this.hazards = []; this.launchers = [];
    this.winds = []; this.gravZones = []; this.vines = []; this.bridges = [];
    this.doors = []; this.meteors = []; this.pickups = []; this.roads = [];
    this.gears = []; this.mirrors = []; this.towers = []; this.enemies = []; this.turrets = [];
    this.spawn = null; this.goalPos = null; this.checkpointPos = null;
    this.chaser = null; this.tide = null; this.globalWind = null;
  }
  id(p) { return `${p}${this.n++}`; }

  // ---------------------------------------------------------------- platforms
  solid(x, y, w, h, o = {}) {
    const s = { id: this.id('s'), x, y, w, h, style: o.style || 'block', slab: o.ground ? false : true,
      ice: !!o.ice, conveyor: o.conveyor || 0, bounce: o.bounce || 0, noPillar: o.pillar ? false : true };
    for (const k of ['crumble', 'heat', 'blink', 'oneWay', 'button', 'onoff', 'noWall']) if (o[k] !== undefined) s[k] = o[k];
    if (o.ground) { s.grounded = true; s.noPillar = true; }
    this.solids.push(s);
    return s;
  }
  plat(x, top, w, o = {}) { return this.solid(x, top - (o.h || 1), w, o.h || 1, o); }
  start(x, top, w = 12, o = {}) { const s = this.plat(x, top, w, { h: 1.2, ...o }); this.spawn = { x: x + 2, y: top }; return s; }
  block(x, top, w, o = {}) { return this.plat(x, top, w, { ...o, ground: true, h: 1 }); }
  pillarPlat(x, top, w, o = {}) { return this.plat(x, top, w, { ...o, pillar: true }); }
  rect(x, y, w, h, o = {}) { return this.solid(x, y, w, h, { style: 'wall', ...o }); }
  wall(x, y, h, w = 0.8, o = {}) { return this.solid(x, y, w, h, { style: 'wall', ...o }); }
  thin(x, top, w) { return this.plat(x, top, w, { h: 0.3, oneWay: true, style: 'thin' }); }
  crumble(x, top, w) { return this.plat(x, top, w, { h: 0.7, crumble: true, style: 'crumble' }); }
  ice(x, top, w, o = {}) { return this.plat(x, top, w, { ice: true, style: 'ice', ...o }); }
  heat(x, top, w, o = {}) { return this.plat(x, top, w, { heat: pulse(o, { P: 3, on: 1.2 }), style: 'heat', noWall: true, h: o.h || 1 }); }
  conveyor(x, top, w, speed) { return this.plat(x, top, w, { conveyor: speed, style: 'conveyor' }); }
  bonus(x, top, w) { return this.plat(x, top, w, { h: 0.6, style: 'bonus' }); }
  blink(x, top, w, o = {}) { return this.plat(x, top, w, { h: 0.6, blink: pulse(o, { P: 3, on: 1.8, warn: 0.6 }), style: 'blink' }); }
  // blink uses the pulse shape: [0,warn) flicker, [warn,warn+on) solid … but we want solid then vanish:
  spring(x, top, rise, w = 1.8) {
    const power = Math.sqrt(2 * PHYS.gravity * this.W.gravity * (rise + 1.6));
    return this.plat(x, top + 0.5, w, { h: 0.5, bounce: power, style: 'spring', oneWay: true });
  }
  mushroom(x, top, rise, w = 2.2) {
    const power = Math.sqrt(2 * PHYS.gravity * this.W.gravity * (rise + 1.6));
    return this.plat(x, top + 0.9, w, { h: 0.9, bounce: power, style: 'mushroom' });
  }
  switch(x, top) { return this.plat(x, top + 0.3, 1.4, { h: 0.3, button: true, style: 'button', noWall: true }); }
  red(x, top, w, h = 1) { return this.plat(x, top, w, { h, onoff: 'red', style: 'onoff' }); }
  blue(x, top, w, h = 1) { return this.plat(x, top, w, { h, onoff: 'blue', style: 'onoff' }); }
  redWall(x, y, h, w = 0.8) { return this.solid(x, y, w, h, { onoff: 'red', style: 'onoff' }); }
  blueWall(x, y, h, w = 0.8) { return this.solid(x, y, w, h, { onoff: 'blue', style: 'onoff' }); }
  tower(x, y0, w, y1) { this.towers.push({ x, w, y0, y1 }); }

  // ---------------------------------------------------------------- movers
  mover(o) {
    const w = o.w ?? 3, h = o.h ?? 0.6;
    const m = { id: this.id('m'), kind: o.kind || (this.W.id === 'sun' ? 'shield' : 'pad'), w, h, warp: !!o.warp };
    if (o.from) {
      m.path = { type: 'line', x0: o.from[0] - w / 2, y0: o.from[1] - h, x1: o.to[0] - w / 2, y1: o.to[1] - h, T: o.T ?? 4, phase: o.phase ?? 0 };
    } else if (o.pts) {
      m.path = { type: 'poly', pts: o.pts, speed: o.speed ?? 3, loop: o.loop !== false, phase: o.phase ?? 0 };
    }
    this.movers.push(m);
    return m;
  }
  // a platform sliding between two points (given as top-centre positions)
  slide(x0, y0, x1, y1, o = {}) { return this.mover({ from: [x0, y0], to: [x1, y1], ...o }); }
  lift(x, y0, y1, o = {}) { return this.mover({ from: [x, y0], to: [x, y1], kind: this.W.id === 'earth' ? 'elevator' : 'lift', T: o.T ?? 5, ...o }); }
  loop(pts, o = {}) { return this.mover({ pts, ...o }); }
  ferris(cx, cy, r, o = {}) {
    const n = o.n ?? 4, omega = o.omega ?? 0.6, w = o.w ?? 2.4;
    const gid = this.id('g');
    for (let i = 0; i < n; i++) {
      this.movers.push({ id: this.id('m'), kind: 'cog', gear: gid, w, h: 0.5, path: { type: 'circle', cx, cy, r, omega, a0: (o.a0 ?? 0) + (i * Math.PI * 2) / n } });
    }
    this.gears.push({ id: gid, x: cx, y: cy, r, omega });
  }
  bob(x, top, o = {}) {
    const w = o.w ?? 3, h = o.h ?? 1.4;
    this.movers.push({ id: this.id('a'), kind: o.kind || 'asteroid', w, h, path: { type: 'bob', x0: x - w / 2, y0: top - h, ax: o.ax ?? 0.6, ay: o.ay ?? 0.6, T: o.T ?? 4, phase: o.phase ?? 0 } });
  }
  mirror(x0, top, R, o = {}) {
    const mw = o.w ?? 2.8, T = o.T ?? 4;
    const m = x0 + R + mw;
    const masterId = this.id('m');
    this.movers.push({ id: masterId, kind: 'prism', w: mw, h: 0.6, path: { type: 'line', x0, y0: top - 0.6, x1: m - mw, y1: top - 0.6, T, phase: o.phase ?? 0 } });
    this.movers.push({ id: this.id('m'), kind: 'prism', mirrorOf: masterId, w: mw, h: 0.6, path: { type: 'mirror', master: masterId, m } });
    this.mirrors.push({ x: m, y: top });
    return 2 * m - x0;   // far edge
  }
  // vehicles / rovers / ring chunks streaming left→right between xStart..xEnd; laneY = vehicle bottom
  stream(kind, xStart, xEnd, laneY, o = {}) {
    const V = VEHICLES[kind];
    const speed = o.speed ?? 3.5;
    const spacing = o.spacing ?? V.len + 5;
    const span = Math.ceil((xEnd - xStart + V.len) / spacing) * spacing;
    const count = Math.round(span / spacing);
    for (let i = 0; i < count; i++) {
      this.movers.push({ id: this.id('v'), kind, w: V.len, h: V.height, decks: V.decks,
        path: { type: 'stream', xStart, xEnd, y: laneY, speed, offset: (o.offset ?? 0) + i * spacing, span, len: V.len, bob: kind === 'plane' || kind === 'boat' || kind === 'ring' ? 0.15 : 0 } });
    }
    if (o.road !== false && kind !== 'ring' && kind !== 'plane') {
      const type = kind === 'boat' ? 'water' : kind === 'rover' ? 'canyon' : 'road';
      this.roads.push({ id: this.id('r'), type, x: xStart, x1: xEnd, y: laneY });
      this.hazards.push({ id: this.id('h'), type: kind === 'boat' ? 'water' : 'traffic', x: xStart, y: laneY - 1.2, w: xEnd - xStart, h: 1.0, respawn: true, hidden: true });
    }
    return Math.max(...V.decks.map((d) => d[2])) + laneY;   // top deck height
  }

  // ---------------------------------------------------------------- hazards
  pool(x, top, w, type) {
    const t = type || ({ sun: 'fire', mercury: 'mercury', mars: 'lava' }[this.W.id] || 'lava');
    this.hazards.push({ id: this.id('h'), type: t, x, y: top - 1.3, w, h: 0.9, respawn: true });
    this.plat(x - 0.2, top - 1.3, w + 0.4, { h: 0.4, style: 'basin' });
  }
  hazard(type, x, y, w, h, o = {}) { this.hazards.push({ id: this.id('h'), type, x, y, w, h, respawn: o.respawn ?? true, hidden: !!o.hidden }); }
  // vertical pulsing column. sky types (flare, lightning, piston) hang down from y+h; floor types rise from y.
  beam(type, x, y, o = {}) {
    const sky = type === 'flare' || type === 'lightning' || type === 'piston';
    const w = o.w ?? (type === 'lightning' ? 1.4 : type === 'piston' ? 2.4 : 2);
    this.hazards.push({ id: this.id('h'), type, x: x - w / 2, y, w, h: o.h ?? (type === 'piston' ? 9 : sky ? 18 : 5.5), pulse: pulse(o, { P: 3, on: 0.9, warn: 0.75 }) });
  }
  cloud(x, y0, y1, o = {}) {
    const w = o.w ?? 2.8, h = o.h ?? 2.6;
    this.hazards.push({ id: this.id('h'), type: 'acid', w, h, x: x - w / 2, y: y0,
      path: { type: 'line', x0: x - w / 2 + (o.dx0 ?? 0), y0, x1: x - w / 2 + (o.dx ?? 0), y1, T: o.T ?? 4, phase: o.phase ?? 0 } });
  }
  meteor(x, y1, o = {}) {
    const drip = o.style === 'drip';
    this.meteors.push({ id: this.id('h'), style: o.style || 'meteor', x, y0: y1 + (o.h ?? (drip ? 14 : 18)), y1, drift: o.drift ?? (drip ? 0 : -5), P: o.P ?? 3, fall: o.fall ?? (drip ? 0.8 : 1), r: o.r ?? (drip ? 0.45 : 0.8), off: o.off ?? 0 });
  }
  vent(x, y, rise, o = {}) {
    const type = o.type || ({ mercury: 'vent', uranus: 'geyser', saturn: 'updraft' }[this.W.id] || 'vent');
    const power = Math.sqrt(2 * PHYS.gravity * this.W.gravity * (rise + 1.6));
    this.launchers.push({ id: this.id('l'), type, x: x - 0.8, y, w: 1.6, h: rise + 2.5, power,
      pulse: type === 'updraft' || o.always ? null : pulse(o, { P: 2.6, on: 1.1, warn: 0.5 }) });
  }
  wind(x, y, w, h, vx, o = {}) {
    this.winds.push({ id: this.id('w'), x, y, w, h, vx, pulse: pulse(o, { P: 4, on: 2, warn: 0.6 }), gust: !!o.gust });
  }
  grav(x, y, w, h, o = {}) {
    this.gravZones.push({ id: this.id('z'), x, y, w, h, low: o.low ?? 0.45, high: o.high ?? 1.5, P: o.P ?? 5, lowFrac: o.lowFrac ?? 0.6, off: o.off ?? 0 });
  }
  vine(ax, ay, len = 6) { this.vines.push({ id: this.id('v'), ax, ay, len, phase: (ax * 0.37) % 6.28 }); }
  bridge(x, top, w) { this.bridges.push({ id: this.id('b'), x, y: top - 0.4, w, h: 0.4, trigger: { x: x - 2.2, y: top - 1, w: w + 2.2, h: 4 } }); }
  door(x, top, o = {}) { this.doors.push({ id: this.id('d'), x: x - 0.6, y: top, w: 1.2, h: o.h ?? 6.5, P: o.P ?? 3.4, openFrac: o.open ?? 0.5, off: o.off ?? 0 }); }
  enemy(type, x, y, o = {}) { this.enemies.push({ id: this.id('e'), type, x, y, range: o.range ?? 4, speed: o.speed ?? 1.6, ax: o.ax, ay: o.ay, T: o.T }); }
  turret(x, y, dir, o = {}) { this.turrets.push({ id: this.id('t'), x, y, dir, P: o.P ?? 2.5, speed: o.speed ?? 7, off: o.off ?? 0, range: o.range ?? 26 }); }

  // ---------------------------------------------------------------- pickups & flow
  cell(x, y) { this.pickups.push({ id: this.id('c'), type: 'cell', x, y }); }
  cells(x0, y0, x1, y1, n = 3) { for (let i = 0; i < n; i++) { const t = n === 1 ? 0.5 : i / (n - 1); this.cell(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t); } }
  arc(x0, y0, x1, y1, n = 3, h = 2.4) { for (let i = 1; i <= n; i++) { const t = i / (n + 1); this.cell(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t + Math.sin(t * Math.PI) * h); } }
  shard(x, y) { this.pickups.push({ id: this.id('k'), type: 'shard', x, y }); }
  heart(x, y) { this.pickups.push({ id: this.id('c'), type: 'heart', x, y }); }
  checkpoint(x, top) { this.checkpointPos = { x, y: top }; }
  goal(x, top) { this.goalPos = { x, y: top }; }
  chase(o = {}) { this.chaser = { trigger: o.trigger ?? 4, behind: o.behind ?? 14, speed: o.speed ?? 4, name: o.name }; }
  rise(o = {}) { this.tide = { rate: o.rate ?? 0.7, delay: o.delay ?? 4 }; }
  sideWind(amp = 4, T = 7) { this.globalWind = { amp, T }; }

  // ---------------------------------------------------------------- finalize
  finish(def, flavorChaser) {
    const W = this.W;
    if (!this.spawn) throw new Error(`${def.name}: no start()`);
    if (!this.goalPos) throw new Error(`${def.name}: no goal()`);
    let minTop = Infinity, maxX = -Infinity, maxY = 30;
    for (const s of this.solids) {
      if (s.style !== 'basin') minTop = Math.min(minTop, s.y + s.h);
      maxX = Math.max(maxX, s.x + s.w);
      maxY = Math.max(maxY, s.y + s.h + 20);
    }
    for (const m of this.movers) {
      const P = m.path;
      if (P.type === 'stream') minTop = Math.min(minTop, P.y);
      if (P.type === 'line') minTop = Math.min(minTop, P.y0 + m.h, P.y1 + m.h);
      if (P.type === 'poly') for (const [, y] of P.pts) minTop = Math.min(minTop, y);
      if (P.type === 'circle') minTop = Math.min(minTop, P.cy - P.r);
    }
    const floorY = minTop - (W.floating ? 7 : 4);
    for (const s of this.solids) {
      if (s.grounded) { const top = s.y + s.h; s.y = floorY - 3; s.h = top - s.y; }
    }
    if (this.chaser && !this.chaser.name) this.chaser.name = flavorChaser;
    const floor = { type: this.tide && W.floor === 'void' ? 'rift' : W.floor, y: floorY, lethal: W.floor !== 'void' || !!this.tide };
    return {
      index: this.index, worldIndex: this.worldIndex, world: W.id, sub: this.sub,
      worldName: W.name, location: locationOf(this.index), archetype: def.kind, name: def.name,
      diff: Math.min(1, 0.1 + (this.sub - 1) / 32 + this.worldIndex * 0.02),
      gravity: W.gravity,
      spawn: this.spawn, goal: this.goalPos, checkpoint: this.checkpointPos,
      floor, killY: floorY - (W.floor === 'void' ? 8 : 1.5),
      bounds: { minX: Math.min(-24, this.spawn.x - 30), maxX: Math.max(maxX, this.goalPos.x) + 12, minY: floorY - 10, maxY },
      globalWind: this.globalWind, dust: !!W.dust, redSpot: W.id === 'jupiter' && this.sub >= 25,
      chaser: this.chaser, tide: this.tide,
      solids: this.solids, movers: this.movers, hazards: this.hazards, launchers: this.launchers,
      winds: this.winds, gravZones: this.gravZones, vines: this.vines, bridges: this.bridges,
      doors: this.doors, meteors: this.meteors, pickups: this.pickups, roads: this.roads,
      gears: this.gears, mirrors: this.mirrors, towers: this.towers, enemies: this.enemies, turrets: this.turrets,
      totalCells: this.pickups.filter((p) => p.type === 'cell').length,
      totalShards: this.pickups.filter((p) => p.type === 'shard').length,
    };
  }
}
