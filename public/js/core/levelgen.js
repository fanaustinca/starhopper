// Deterministic procedural level generator.
// generateLevel(n) returns plain data (no classes) describing one of 420 levels.
//
// Every level gets an ARCHETYPE so neighbouring levels play differently:
//   intro · classic · ascent (tower climb) · descent · gauntlet · ride ·
//   precision · branch (secret upper routes) · chase (a wall hunts you) ·
//   tide (the floor rises while you climb) · finale (world climax + chase)
// Each world schedules its 30 levels so the same archetype never repeats back
// to back. Static jumps are sized from the real controller's jump envelope
// (physics.maxGapFor) and re-verified by simulation in the tests.

import {
  WORLDS, LEVELS_PER_WORLD, TOTAL_LEVELS, PHYS, WORLD_FLAVOR,
  RED_SPOT_FROM, SATURN_RINGS_UNTIL,
  worldIndexOf, subLevelOf, locationOf, EARTH_CITIES,
} from './config.js';
import { makeRng, hash32, clamp, lerp } from './rng.js';
import { maxGapFor, maxJumpHeight } from './physics.js';

// Vehicle / stream platform shapes. Deck tops are relative to vehicle bottom.
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

const CITY_TRAFFIC = {
  'London': ['bus', 'bus', 'taxi', 'boat'],
  'New York': ['taxi', 'taxi', 'truck', 'boat'],
  'San Francisco': ['car', 'boat', 'truck', 'plane'],
  'Los Angeles': ['car', 'car', 'truck', 'plane'],
  'Shanghai': ['boat', 'car', 'bus', 'plane'],
  'Beijing': ['bus', 'car', 'truck', 'plane'],
  'Sydney': ['boat', 'boat', 'bus', 'plane'],
  'Berlin': ['car', 'truck', 'bus', 'plane'],
  'Moscow': ['truck', 'bus', 'car', 'plane'],
  'Tokyo': ['taxi', 'bus', 'boat', 'plane'],
};

export const ARCHETYPES = ['intro', 'classic', 'ascent', 'descent', 'gauntlet', 'ride', 'precision', 'branch', 'chase', 'tide', 'finale'];

const ARCH_NOUNS = {
  intro: ['Arrival'],
  classic: ['Run', 'Crossing', 'Path', 'Way', 'Trail', 'Passage'],
  ascent: ['Spire', 'Ascent', 'Tower', 'Climb', 'Summit'],
  descent: ['Plunge', 'Descent', 'Freefall', 'Drop'],
  gauntlet: ['Gauntlet', 'Barrage', 'Trial', 'Inferno'],
  ride: ['Express', 'Cruise', 'Drift', 'Ride', 'Shuttle'],
  precision: ['Needles', 'Steps', 'Tightrope', 'Pinpoint'],
  branch: ['Fork', 'Secrets', 'Divide', 'Hideaway'],
  chase: ['Escape', 'Pursuit', 'Getaway', 'Outrun'],
  tide: ['Rising Tide', 'Flood', 'Upwell', 'Surge'],
  finale: ['Finale'],
};

// Per world: which segments are hazards, which are "rides", what a pulse looks like.
const WORLD_ROLES = {
  sun: { hazard: ['flare', 'heat', 'pit'], ride: ['moverH', 'longRide'], pulse: 'flare' },
  mercury: { hazard: ['pit', 'vent', 'crumble'], ride: ['moverH', 'longRide'], pulse: null },
  venus: { hazard: ['cloud', 'steam', 'drip'], ride: ['moverH', 'longRide'], pulse: 'steam' },
  earth: { hazard: ['crumble', 'climb'], ride: ['vehicle', 'vehicle', 'moverV'], pulse: null },
  mars: { hazard: ['pit', 'crumble', 'meteor'], ride: ['rover', 'rover', 'longRide'], pulse: null },
  asteroids: { hazard: ['meteor', 'crumble'], ride: ['asteroid', 'asteroid', 'longRide'], pulse: null },
  jupiter: { hazard: ['wind', 'lightning'], ride: ['moverH', 'longRide', 'wind'], pulse: 'lightning' },
  saturn: { hazard: ['crumble', 'ice'], ride: ['ring', 'ring', 'longRide'], pulse: null },
  uranus: { hazard: ['geyser', 'ice', 'crumble'], ride: ['moverH', 'longRide'], pulse: null },
  neptune: { hazard: ['lightning', 'gust'], ride: ['gust', 'longRide'], pulse: 'lightning' },
  prismara: { hazard: ['crumble', 'bridge'], ride: ['mirror', 'mirror', 'longRide'], pulse: null },
  mechanus: { hazard: ['piston', 'exhaust', 'conveyor'], ride: ['gear', 'gear', 'conveyor'], pulse: 'exhaust' },
  biolumina: { hazard: ['door', 'crumble'], ride: ['vine', 'vine', 'mushroom'], pulse: null },
  chronos: { hazard: ['gravity', 'crumble'], ride: ['warp', 'warp', 'longRide'], pulse: null },
};

// Segments that never make you wait — safe to use while something chases you.
const CHASE_SAFE = { gap: 4, climb: 2, crumble: 3, pit: 2, springUp: 2, drop: 1 };

// 30-slot schedule per world: fixed beats + a shuffled bag, no back-to-back repeats.
function worldSchedule(wi) {
  for (let attempt = 0; attempt < 200; attempt++) {
    const rng = makeRng(hash32(wi * 104729 + 7 + attempt * 31));
    const bag = [];
    const add = (k, n) => { for (let i = 0; i < n; i++) bag.push(k); };
    add('classic', 6); add('ascent', 4); add('descent', 3); add('gauntlet', 3);
    add('ride', 3); add('precision', 2); add('branch', 2); add('tide', 2); add('classic', 1);
    for (let i = bag.length - 1; i > 0; i--) { const j = Math.floor(rng.next() * (i + 1)); [bag[i], bag[j]] = [bag[j], bag[i]]; }
    const out = new Array(LEVELS_PER_WORLD);
    out[0] = 'intro'; out[9] = 'chase'; out[19] = 'chase'; out[29] = 'finale';
    let k = 0;
    for (let i = 0; i < out.length; i++) if (!out[i]) out[i] = bag[k++];
    let ok = true;
    for (let i = 1; i < out.length; i++) if (out[i] === out[i - 1]) ok = false;
    if (ok) return out;
  }
  throw new Error('no schedule for world ' + wi);
}
const SCHEDULES = WORLDS.map((_, i) => worldSchedule(i));

export function archetypeOf(level) {
  return SCHEDULES[worldIndexOf(level)][subLevelOf(level) - 1];
}

class Builder {
  constructor(level) {
    this.n = level;
    this.wi = worldIndexOf(level);
    this.W = WORLDS[this.wi];
    this.sub = subLevelOf(level);
    this.arch = archetypeOf(level);
    this.rng = makeRng(hash32(level * 7919 + 13));
    const D = (this.sub - 1) / (LEVELS_PER_WORLD - 1);
    const G = (level - 1) / (TOTAL_LEVELS - 1);
    let diff = 0.08 + 0.6 * D + 0.32 * G;
    this.redSpot = this.W.id === 'jupiter' && this.sub >= RED_SPOT_FROM;
    if (this.redSpot) diff += 0.12;
    if (this.arch === 'intro') diff *= 0.6;
    if (this.arch === 'finale') diff += 0.08;
    this.diff = clamp(diff, 0, 1);
    this.gs = this.W.gravity;
    this.maxH = maxJumpHeight(this.gs);
    this.roles = WORLD_ROLES[this.W.id];
    this.id = 0;
    this.cx = 0; this.cy = 0;
    this.slabMode = false;
    this.band = [-5, 9];
    this.solids = []; this.movers = []; this.hazards = []; this.launchers = [];
    this.winds = []; this.gravZones = []; this.vines = []; this.bridges = [];
    this.doors = []; this.meteors = []; this.pickups = []; this.checks = [];
    this.roads = []; this.path = []; this.towers = []; this.gears = []; this.mirrors = [];
    this.sequence = [];
    this.last = null;
    this.chaser = null; this.tide = null;
    this.precision = this.arch === 'precision';
  }

  nid(prefix) { return `${prefix}${this.id++}`; }

  gapFrac() { return 0.3 + 0.36 * this.diff + (this.precision ? 0.1 : 0); }

  platWidth() {
    if (this.precision) return this.rng.range(2.0, 2.9);
    const base = this.W.floating ? lerp(6.5, 2.8, this.diff) : lerp(7.5, 3.2, this.diff);
    return Math.max(2.6, base * this.rng.range(0.8, 1.25));
  }

  // Static platform; `top` is the walkable surface.
  plat(x, top, w, opts = {}) {
    const s = {
      id: this.nid('s'), x, y: top - (opts.h || 1.2), w, h: opts.h || 1.2,
      style: opts.style || 'block', slab: !!(opts.slab || this.slabMode),
      ice: !!opts.ice, conveyor: opts.conveyor || 0, bounce: opts.bounce || 0,
    };
    if (opts.crumble) s.crumble = true;
    if (opts.heat) s.heat = opts.heat;
    if (opts.noPillar || this.slabMode) s.noPillar = true;
    if (opts.noWall) s.noWall = true;
    if (opts.oneWay) s.oneWay = true;
    this.solids.push(s);
    if (!opts.noPath) this.path.push(s.id);
    return s;
  }

  // Advance cursor to a new platform after a jumpable gap; records a check.
  jumpTo(g, dy, w, opts = {}) {
    const fromX = this.cx, fromTop = this.cy;
    const top = this.cy + dy;
    const s = this.plat(this.cx + g, top, w, opts);
    this.checks.push({ type: 'jump', ax: fromX, ay: fromTop, bx: s.x, by: top, bw: w, tall: !this.W.floating && !s.slab, gs: this.gs, gMul: opts.gMul || 1, wind: opts.wind || 0 });
    this.cx = s.x + w; this.cy = top; this.last = s;
    return s;
  }

  dyRange(lo, hi) {
    let dy = this.rng.range(lo, hi);
    if (this.cy + dy > this.band[1]) dy = -Math.abs(dy);
    if (this.cy + dy < this.band[0]) dy = Math.abs(dy);
    return dy;
  }

  safeGap(dy, frac = this.gapFrac()) {
    const reach = maxGapFor(dy, this.gs) - PHYS.w;
    return Math.max(1.6, reach * frac * this.rng.range(0.75, 1.0));
  }

  cell(x, y) { this.pickups.push({ id: this.nid('c'), type: 'cell', x, y }); }
  cellsArc(x0, y0, x1, y1, n = 3, lift = 2.4) {
    for (let i = 1; i <= n; i++) {
      const t = i / (n + 1);
      this.cell(lerp(x0, x1, t), lerp(y0, y1, t) + 1.0 + Math.sin(t * Math.PI) * lift);
    }
  }
  cellsRow(x0, x1, y, n = 3) {
    for (let i = 0; i < n; i++) this.cell(lerp(x0, x1, (i + 0.5) / n), y + 1.0);
  }
  shard(x, y, where) { this.pickups.push({ id: this.nid('k'), type: 'shard', x, y, where }); }

  pulse(P, on, warn, off) { return { P, on, warn, off }; }

  // ------------------------------------------------------------------ basic segments
  seg_gap(opts = {}) {
    const dy = opts.dy ?? this.dyRange(this.W.floating ? -2.8 : -2.2, this.W.floating ? 2.4 : 2.0);
    const g = this.safeGap(dy);
    const x0 = this.cx, y0 = this.cy;
    const s = this.jumpTo(g, dy, opts.w || this.platWidth(), opts);
    this.cellsArc(x0, y0, s.x, s.y + s.h, 3);
    return s;
  }

  seg_climb() {
    const dy = clamp(this.rng.range(2.4, this.maxH * 0.86), 2.2, this.maxH - 0.5);
    const g = this.rng.range(1.4, 2.6);
    const s = this.jumpTo(g, dy, this.platWidth() + 1);
    this.cell(s.x + 0.6, s.y + s.h + 1);
  }

  seg_drop() {
    // a big leap down with a column of cells to steer through
    const dy = -this.rng.range(4.5, 8);
    const x0 = this.cx, y0 = this.cy;
    const s = this.jumpTo(this.safeGap(dy, 0.35), dy, this.platWidth() + 1.5);
    for (let i = 0; i < 4; i++) this.cell(lerp(x0 + 1, s.x + 1, 0.6 + i * 0.1), y0 - i * (-dy / 4) + 0.5);
  }

  seg_ice() {
    const s = this.seg_gap({ ice: true, w: this.platWidth() + 3, style: 'ice' });
    if (this.rng.chance(0.6)) this.seg_gap({ ice: true, w: this.platWidth() + 2, style: 'ice' });
    return s;
  }

  seg_crumble() {
    // a chain of crumbling platforms: keep moving!
    const n = 2 + Math.round(this.diff * 2);
    for (let i = 0; i < n; i++) {
      const dy = this.dyRange(-1.2, 1.2);
      const x0 = this.cx, y0 = this.cy;
      const s = this.jumpTo(this.safeGap(dy, 0.32 + this.diff * 0.2), dy, this.rng.range(1.8, 2.6), { crumble: true, style: 'crumble', slab: true, h: 0.7, noPillar: true });
      this.cellsArc(x0, y0, s.x, s.y + s.h, 1, 1.8);
    }
    this.seg_gap({ w: this.platWidth() });
  }

  seg_pit() {
    const g = this.rng.range(1.8, 2.6 + this.diff * 1.4);
    const top = this.cy;
    const type = { sun: 'fire', mercury: 'mercury', mars: 'lava' }[this.W.id] || 'lava';
    this.hazards.push({ id: this.nid('h'), type, x: this.cx, y: top - 1.3, w: g, h: 0.9, respawn: true });
    this.plat(this.cx - 0.2, top - 1.3, g + 0.4, { h: 0.4, style: 'basin', noPath: true, slab: true, noPillar: true });
    const x0 = this.cx;
    const s = this.jumpTo(g, 0, this.platWidth() + 1.5);
    this.cellsArc(x0, top, s.x, top, 2, 2.0);
  }

  seg_springUp() {
    // a world-styled spring pad launches you to a ledge far above
    const base = this.jumpTo(this.safeGap(0, 0.35), 0, 6);
    const top = base.y + base.h;
    const rise = this.maxH + this.rng.range(1.5, 3.5);
    const power = Math.sqrt(2 * PHYS.gravity * this.gs * (rise + 1.6));
    this.plat(base.x + base.w - 2.3, top + 0.5, 1.8, { h: 0.5, bounce: power, style: 'spring', noPath: true, slab: true, noPillar: true, oneWay: true });
    this.cell(base.x + base.w - 1.4, top + rise * 0.6);
    const B = this.plat(base.x + base.w + 1.6, top + rise, this.platWidth() + 1);
    this.checks.push({ type: 'launch', rise, power, gs: this.gs });
    this.cx = B.x + B.w; this.cy = top + rise; this.last = B;
  }

  seg_moverH(opts = {}) {
    const mw = opts.w || (3.2 - this.diff * 0.8);
    const e1 = this.rng.range(1.2, 2.0);
    const R = opts.R || (4 + this.diff * 6 + this.rng.range(0, 2.5));
    const my = this.cy + this.rng.range(-1.0, 0.8);
    const x0 = this.cx + e1, x1 = x0 + R;
    const v = opts.speed || (2.2 + this.diff * 2.4);
    const T = (2 * R / v) * 1.3;
    const m = {
      id: this.nid('m'), kind: opts.kind || (this.W.id === 'sun' ? 'shield' : 'pad'), w: mw, h: 0.6,
      path: { type: 'line', x0, y0: my - 0.6, x1, y1: my - 0.6, T, phase: this.rng.next() },
      warp: !!opts.warp,
    };
    this.movers.push(m);
    this.checks.push({ type: 'mover', ay: this.cy, my, gapA: e1, gs: this.gs });
    this.cellsRow(x0, x1 + mw, my, Math.max(3, Math.round(R / 3)));
    // hazards along the ride: things to dodge while you're on board
    if (opts.hazards && this.roles.pulse) {
      const n = Math.max(1, Math.floor(R / 8));
      for (let i = 0; i < n; i++) {
        const hx = x0 + mw + (R - mw) * (i + 0.5) / n;
        this.addPulse(this.roles.pulse, hx, my, 2.0, i, n, true);
      }
    } else if (opts.hazards && this.W.id === 'asteroids') {
      for (let i = 0; i < Math.max(1, Math.floor(R / 9)); i++) this.meteors.push({ id: this.nid('h'), x: x0 + R * (i + 0.6) / Math.max(1, Math.floor(R / 9)), y0: my + 18, y1: my, drift: -5, P: 3.6, fall: 1.0, r: 0.8, off: this.rng.range(0, 3) });
    }
    const e2 = this.rng.range(1.2, 2.0);
    this.cx = x1 + mw; this.cy = my;
    const dy = this.rng.range(-0.5, 1.2);
    this.jumpTo(e2, dy, this.platWidth());
  }

  seg_longRide() {
    // one long trip on a platform with obstacles to dodge on the way
    this.seg_moverH({ R: 18 + this.diff * 16, w: 3.4, speed: 3.0 + this.diff * 1.2, hazards: true, kind: this.W.id === 'sun' ? 'shield' : this.W.id === 'chronos' ? 'warp' : 'pad' });
  }

  seg_moverV(opts = {}) {
    const rise = this.maxH + this.rng.range(1.5, 3.0);
    const lw = 2.8;
    const lx = this.cx + 1.2;
    const yLow = this.cy - 0.6 - 0.4, yHigh = this.cy + rise - 0.6 - 0.3;
    const v = 2.0 + this.diff * 1.6;
    const T = (2 * rise / v) * 1.3;
    this.movers.push({
      id: this.nid('m'), kind: opts.kind || (this.W.id === 'earth' ? 'elevator' : 'lift'), w: lw, h: 0.6,
      path: { type: 'line', x0: lx, y0: yLow, x1: lx, y1: yHigh, T, phase: this.rng.next() },
      warp: !!opts.warp,
    });
    this.cell(lx + lw / 2, this.cy + rise * 0.6);
    this.cx = lx + lw; this.cy = yHigh + 0.6;
    const top = this.cy + 0.3;
    const s = this.plat(this.cx + 1.2, top, this.platWidth() + 1);
    this.checks.push({ type: 'lift', top, liftTop: yHigh + 0.6, gs: this.gs });
    this.cx = s.x + s.w; this.cy = top; this.last = s;
  }

  addPulse(type, cx, top, cw, i, n, ride = false) {
    const P = this.rng.range(2.8, 3.4) - this.diff * 0.6;
    const on = 0.7 + this.diff * 0.35;
    const fromSky = type === 'flare' || type === 'lightning' || type === 'piston';
    const w = type === 'lightning' ? 1.4 : type === 'piston' ? 2.4 : cw;
    this.hazards.push({
      id: this.nid('h'), type, x: cx - w / 2, y: ride ? top - 0.6 : top, w, h: fromSky ? (type === 'piston' ? 9 : 18) : 5.5,
      pulse: this.pulse(ride ? P + 0.8 : P, on, 0.75, (i * P) / n + this.rng.range(0, 0.3)),
    });
  }

  // Long platform with periodically firing columns (flares, steam, lightning, pistons).
  seg_pulse(type) {
    const w = 12 + this.diff * 8;
    const dy = this.dyRange(-1.5, 1.5);
    const s = this.jumpTo(this.safeGap(dy, 0.4), dy, w);
    const n = 1 + Math.floor(this.diff * 2.4 + this.rng.next() * 0.8);
    for (let i = 0; i < n; i++) this.addPulse(type, s.x + w * (i + 1) / (n + 1), s.y + s.h, 2.0, i, n);
    this.cellsRow(s.x + 1, s.x + w - 1, s.y + s.h, Math.min(5, n + 2));
  }

  seg_heat() {
    // sunspot tiles that cool and re-ignite in a rolling wave
    const n = 3 + Math.round(this.diff * 2);
    const tw = 2.6;
    const dy = this.dyRange(-1, 1);
    const P = 3.2 - this.diff * 0.6;
    const first = this.jumpTo(this.safeGap(dy, 0.4), dy, 3, {});
    const top = first.y + first.h;
    for (let i = 0; i < n; i++) {
      this.plat(this.cx, top, tw, { style: 'heat', heat: this.pulse(P, P * 0.4, 0.8, i * 0.55), noWall: true });
      this.cell(this.cx + tw / 2, top + 1);
      this.cx += tw;
    }
    this.plat(this.cx, top, 3, { noWall: true });
    this.cx += 3;
  }

  seg_cloud() {
    const w = 10 + this.diff * 6;
    const dy = this.dyRange(-1.2, 1.2);
    const s = this.jumpTo(this.safeGap(dy, 0.4), dy, w);
    const top = s.y + s.h;
    const n = this.diff > 0.5 ? 2 : 1;
    for (let i = 0; i < n; i++) {
      const cx = s.x + w * (i + 1) / (n + 1);
      this.hazards.push({
        id: this.nid('h'), type: 'acid', w: 2.8, h: 2.6, x: cx - 1.4, y: top,
        path: { type: 'line', x0: cx - 1.4, y0: top - 0.4, x1: cx - 1.4, y1: top + 6.2, T: 4.2 - this.diff * 1.2, phase: this.rng.next() },
      });
    }
    this.cellsRow(s.x + 1, s.x + w - 1, top, 3);
  }

  seg_rain(style) {
    // meteors (asteroids, mars) or sulfuric acid drips (venus) on a long platform
    const w = 12 + this.diff * 6;
    const dy = this.dyRange(-1, 1);
    const s = this.jumpTo(this.safeGap(dy, 0.4), dy, w, { style: this.W.id === 'asteroids' ? 'rock' : 'block' });
    const top = s.y + s.h;
    const drip = style === 'drip';
    const n = (drip ? 2 : 1) + Math.floor(this.diff * 2.5);
    for (let i = 0; i < n; i++) {
      const ix = s.x + w * (i + 1) / (n + 1);
      this.meteors.push({ id: this.nid('h'), style: drip ? 'drip' : 'meteor', x: ix, y0: top + (drip ? 14 : 18), y1: top, drift: drip ? 0 : -5, P: (drip ? 2.2 : 3.2) - this.diff * 0.7, fall: drip ? 0.8 : 1.0, r: drip ? 0.45 : 0.8, off: this.rng.range(0, 3) });
    }
    this.cellsRow(s.x + 1, s.x + w - 1, top, 4);
  }

  seg_launch(style) {
    const dy0 = this.dyRange(-1, 1);
    const baseW = 6 + this.rng.range(0, 2);
    const base = this.jumpTo(this.safeGap(dy0, 0.4), dy0, baseW);
    const top = base.y + base.h;
    const rise = this.maxH + this.rng.range(1.2, 3.2);
    const g = PHYS.gravity * this.gs;
    const power = Math.sqrt(2 * g * (rise + 1.6));
    const lx = base.x + baseW - 2.2;
    if (style === 'mushroom') {
      this.plat(lx - 0.2, top + 0.9, 2.0, { h: 0.9, bounce: power, style: 'mushroom', noPath: true, slab: true, noPillar: true });
    } else {
      const always = style === 'updraft';
      this.launchers.push({
        id: this.nid('l'), type: style, x: lx, y: top, w: 1.6, h: rise + 2.5, power,
        pulse: always ? null : this.pulse(2.6 - this.diff * 0.5, 1.1, 0.5, this.rng.range(0, 2)),
      });
    }
    this.cell(lx + 0.8, top + rise * 0.7);
    const B = this.plat(base.x + baseW + 1.6, top + rise, this.platWidth() + 1);
    this.checks.push({ type: 'launch', rise, power, gs: this.gs });
    this.cx = B.x + B.w; this.cy = top + rise; this.last = B;
  }

  seg_wind(gust) {
    const dy = this.dyRange(-1.2, 1.0);
    let g, vx;
    if (gust) {
      vx = 9 + this.diff * 3;
      g = Math.max(maxGapFor(dy, this.gs) - PHYS.w + 1.5, 6) * this.rng.range(0.95, 1.1);
    } else {
      vx = (this.rng.chance(0.5) ? 1 : -1) * (this.redSpot ? 9 : 5 + this.diff * 3);
      g = this.safeGap(dy, this.gapFrac() * 0.85);
    }
    const x0 = this.cx, y0 = this.cy;
    const P = this.redSpot ? 2.2 : 4.0;
    this.winds.push({
      id: this.nid('w'), x: x0 - 1, y: Math.min(y0, y0 + dy) - 7, w: g + 2, h: 18, vx,
      pulse: this.pulse(P, P * 0.5, 0.6, this.rng.range(0, P)), gust: !!gust,
    });
    const s = this.jumpTo(g, dy, this.platWidth() + (gust ? 1.5 : 0), { wind: gust ? vx : 0 });
    if (gust) this.checks[this.checks.length - 1].type = 'gust';
    this.cellsArc(x0, y0, s.x, s.y + s.h, 4, 1.6);
  }

  seg_stream(kind) {
    let vtype = kind;
    if (kind === 'vehicle') {
      const city = EARTH_CITIES[Math.floor((this.sub - 1) / 3)];
      vtype = this.rng.pick(CITY_TRAFFIC[city]);
    }
    const V = VEHICLES[vtype];
    const deckTop = Math.max(...V.decks.map((d) => d[2]));
    const A = this.plat(this.cx + this.safeGap(0, 0.35), this.cy, 6, { slab: true, style: vtype === 'plane' ? 'helipad' : 'slab' });
    this.checks.push({ type: 'jump', ax: this.cx, ay: this.cy, bx: A.x, by: this.cy, bw: 6, gs: this.gs, gMul: 1, wind: 0 });
    this.cx = A.x + A.w;
    const top = this.cy;
    const laneY = top - 1.35 - deckTop;
    const S = 12 + this.diff * 10 + this.rng.range(0, 4) + (this.arch === 'ride' ? 10 : 0);
    const speed = (vtype === 'ring' ? 5.5 : vtype === 'plane' ? 4.5 : 3.2) + this.diff * (vtype === 'ring' ? 3.5 : 2.2);
    const spacing = V.len + this.rng.range(3.0, 6.0) - (vtype === 'ring' ? 1.5 : 0);
    const xStart = A.x - 1, xEnd = this.cx + S + 7;
    const span = Math.ceil((xEnd - xStart + V.len) / spacing) * spacing;
    const count = Math.round(span / spacing);
    const base = this.rng.range(0, spacing);
    for (let i = 0; i < count; i++) {
      this.movers.push({
        id: this.nid('v'), kind: vtype, w: V.len, h: V.height, decks: V.decks,
        path: { type: 'stream', xStart, xEnd, y: laneY, speed, offset: base + i * spacing, span, len: V.len, bob: vtype === 'plane' || vtype === 'boat' || vtype === 'ring' ? 0.15 : 0 },
      });
    }
    if (kind !== 'ring') {
      this.roads.push({ id: this.nid('r'), type: vtype === 'boat' ? 'water' : vtype === 'plane' ? 'sky' : (kind === 'rover' ? 'canyon' : 'road'), x: xStart, x1: xEnd, y: laneY });
      if (vtype !== 'plane') {
        this.hazards.push({ id: this.nid('h'), type: vtype === 'boat' ? 'water' : 'traffic', x: A.x + A.w, y: laneY - 1.2, w: S, h: 1.0, respawn: true, hidden: true });
      }
    }
    this.cellsRow(this.cx + 1, this.cx + S - 1, laneY + deckTop, 4 + (this.arch === 'ride' ? 3 : 0));
    // meteors / dust during long rover rides keep you hopping between decks
    if (this.arch === 'ride' && (kind === 'rover' || kind === 'ring')) {
      for (let i = 0; i < 2; i++) this.meteors.push({ id: this.nid('h'), style: 'meteor', x: this.cx + S * (i + 1) / 3, y0: laneY + deckTop + 16, y1: laneY + deckTop, drift: -4, P: 3.4, fall: 1.0, r: 0.7, off: this.rng.range(0, 3) });
    }
    const bTop = laneY + deckTop + this.rng.range(0.6, 1.1);
    const B = this.plat(this.cx + S, bTop, 6, { slab: true, style: vtype === 'plane' ? 'helipad' : 'slab' });
    this.checks.push({ type: 'stream', aTop: top, deckTop: laneY + deckTop, bTop, gs: this.gs });
    this.cx = B.x + B.w; this.cy = bTop; this.last = B;
  }

  seg_asteroid() {
    const n = 2 + (this.diff > 0.45 ? 1 : 0) + (this.arch === 'ride' ? 2 : 0);
    let x = this.cx, y = this.cy;
    for (let i = 0; i < n; i++) {
      const dy = this.rng.range(-1.2, 1.2);
      const g = this.safeGap(dy, 0.32 + this.diff * 0.15);
      const w = 3.0 - this.diff * 0.4;
      const ax = 0.4 + this.diff * 0.6, ay = 0.5 + this.diff * 0.5;
      const x0 = x + g + ax;
      this.movers.push({
        id: this.nid('a'), kind: 'asteroid', w, h: 1.4,
        path: { type: 'bob', x0, y0: y + dy - 1.4, ax, ay, T: 3.5 + this.rng.range(0, 2), phase: this.rng.next() },
      });
      this.checks.push({ type: 'mover', ay: y, my: y + dy + ay, gapA: g + 2 * ax, gs: this.gs });
      this.cell(x0 + w / 2, y + dy + 1.6);
      x = x0 + w + ax; y = y + dy - ay;
    }
    this.cx = x; this.cy = y;
    this.jumpTo(this.safeGap(0.5, 0.4), 0.5, this.platWidth() + 1, { style: 'rock' });
  }

  seg_bridge() {
    const g = (maxGapFor(0, this.gs) - PHYS.w) * this.rng.range(1.1, 1.35);
    const top = this.cy;
    this.bridges.push({ id: this.nid('b'), x: this.cx, y: top - 0.4, w: g, h: 0.4, trigger: { x: this.cx - 2.2, y: top - 1, w: g + 2.2, h: 4 } });
    this.cellsRow(this.cx + 1, this.cx + g - 1, top, 4);
    const s = this.plat(this.cx + g, top, this.platWidth() + 1);
    this.checks.push({ type: 'bridge', g });
    this.cx = s.x + s.w; this.last = s;
  }

  seg_mirror() {
    const mw = 2.8;
    const R = 3.5 + this.diff * 3;
    const e = 1.3;
    const x0 = this.cx + e;
    const m = x0 + R + mw;
    const y = this.cy - 0.6 + this.rng.range(-0.5, 0.5);
    const T = (2 * R / (2.2 + this.diff * 1.8)) * 1.3;
    const masterId = this.nid('m');
    this.movers.push({ id: masterId, kind: 'prism', w: mw, h: 0.6, path: { type: 'line', x0, y0: y, x1: m - mw, y1: y, T, phase: this.rng.next() } });
    this.movers.push({ id: this.nid('m'), kind: 'prism', mirrorOf: masterId, w: mw, h: 0.6, path: { type: 'mirror', master: masterId, m } });
    this.mirrors.push({ x: m, y: y + 0.6 });
    this.cellsRow(x0, 2 * m - x0, y + 0.6, 4);
    this.checks.push({ type: 'mover', ay: this.cy, my: y + 0.6, gapA: e, gs: this.gs });
    this.cx = 2 * m - x0; this.cy = y + 0.6;
    this.jumpTo(e, this.rng.range(0, 1), this.platWidth());
  }

  seg_gear() {
    const r = 3.2 + this.diff * 1.6;
    const n = 4;
    const ccx = this.cx + r + 1.5;
    const ccy = this.cy - 0.3;
    const omega = (0.45 + this.diff * 0.45) * (this.rng.chance(0.5) ? 1 : -1);
    const a0 = this.rng.next() * Math.PI * 2;
    const gid = this.nid('g');
    for (let i = 0; i < n; i++) {
      this.movers.push({ id: this.nid('m'), kind: 'cog', gear: gid, w: 2.4, h: 0.5, path: { type: 'circle', cx: ccx, cy: ccy, r, omega, a0: a0 + (i * Math.PI * 2) / n } });
    }
    this.gears.push({ id: gid, x: ccx, y: ccy, r, omega });
    this.cell(ccx, ccy + r + 1.2);
    this.checks.push({ type: 'gear', r });
    this.cx = ccx + r + 1.5; this.cy = ccy + 0.3;
    this.jumpTo(0.2, this.rng.range(-0.3, 1.0), this.platWidth() + 1);
  }

  seg_conveyor() {
    const dy = this.dyRange(-1, 1);
    const sp = (2.5 + this.diff * 3) * (this.rng.chance(0.55) ? 1 : -1);
    const s = this.jumpTo(this.safeGap(dy, 0.4), dy, 10 + this.diff * 5, { conveyor: sp, style: 'conveyor' });
    this.cellsRow(s.x + 1, s.x + s.w - 1, s.y + s.h, 3);
    if (this.W.id === 'mechanus' && this.diff > 0.3) this.addPulse('piston', s.x + s.w * 0.6, s.y + s.h, 2.4, 0, 1);
  }

  seg_door() {
    const w = 12;
    const dy = this.dyRange(-1, 1);
    const s = this.jumpTo(this.safeGap(dy, 0.4), dy, w);
    const top = s.y + s.h;
    const P = 3.4 - this.diff * 0.9;
    this.doors.push({ id: this.nid('d'), x: s.x + w / 2 - 0.6, y: top, w: 1.2, h: 6.5, P, openFrac: 0.5 - this.diff * 0.1, off: this.rng.range(0, P) });
    this.cellsRow(s.x + 1, s.x + w - 1, top, 3);
  }

  seg_vine() {
    const g = (maxGapFor(0, this.gs) - PHYS.w) * this.rng.range(1.05, 1.3) + (this.arch === 'ride' ? 8 : 0);
    const n = g > 20 ? 3 : g > 12.5 ? 2 : 1;
    const top = this.cy;
    for (let i = 0; i < n; i++) {
      const ax = this.cx + g * (i + 1) / (n + 1);
      this.vines.push({ id: this.nid('v'), ax, ay: top + 7.8, len: 6.0, phase: this.rng.next() * 6.28 });
      this.cell(ax, top + 1.0);
    }
    const s = this.plat(this.cx + g, top + this.rng.range(-0.5, 0.8), this.platWidth() + 1);
    this.checks.push({ type: 'vine', g });
    this.cx = s.x + s.w; this.cy = s.y + s.h; this.last = s;
  }

  seg_gravity() {
    const dy = this.dyRange(-0.8, 0.8);
    const low = 0.45;
    const reachLow = maxGapFor(dy, this.gs * low) - PHYS.w;
    const reachNorm = maxGapFor(dy, this.gs) - PHYS.w;
    const g = clamp(reachLow * this.rng.range(0.55, 0.68), reachNorm * 0.7, reachLow * 0.8);
    const x0 = this.cx, y0 = this.cy;
    const P = 5.5 - this.diff;
    this.gravZones.push({ id: this.nid('z'), x: x0 - 2, y: Math.min(y0, y0 + dy) - 6, w: g + 4, h: 18, low, high: 1.5, P, lowFrac: 0.6, off: this.rng.range(0, P) });
    const s = this.jumpTo(g, dy, this.platWidth() + 1, { gMul: low });
    this.cellsArc(x0, y0, s.x, s.y + s.h, 4, 3.5);
  }

  seg_warp() {
    if (this.rng.chance(0.7)) this.seg_moverH({ warp: true, kind: 'warp' });
    else this.seg_moverV({ warp: true, kind: 'warp' });
  }

  // ------------------------------------------------------------------ set pieces
  // Zig-zag tower: ledges alternate left/right as you climb.
  seg_tower(steps, opts = {}) {
    steps |= 1; // odd number of steps: always finish on the right-hand column
    const prevSlab = this.slabMode;
    this.slabMode = true;
    const colW = this.rng.range(3.0, 4.2) - (this.precision ? 0.6 : 0);
    const gapX = this.rng.range(1.6, 2.8);
    const xL = this.cx + this.rng.range(1.6, 2.4);
    const xR = xL + colW + gapX;
    let side = 0; // 0 = left column next, 1 = right
    const y0 = this.cy;
    // first ledge: left column, a hop up from where we stand
    let cur = this.jumpTo(xL - this.cx, this.rng.range(0.5, 1.5), colW, { h: 0.8 });
    side = 1;
    for (let i = 0; i < steps; i++) {
      const roll = this.rng.next();
      const dy = this.rng.range(2.2, Math.min(3.4, this.maxH * 0.72));
      const top = this.cy + dy;
      const nx = side ? xR : xL;
      const opt = { h: 0.8 };
      if (!opts.noWait && roll < 0.15 && i > 0) opt.crumble = true, opt.style = 'crumble';
      if (roll > 0.85 && this.W.id === 'sun') opt.heat = this.pulse(3.2, 1.0, 0.8, this.rng.range(0, 3)), opt.style = 'heat';
      if (roll > 0.85 && (this.W.id === 'uranus' || this.W.id === 'saturn')) opt.ice = true, opt.style = 'ice';
      const s = this.plat(nx, top, colW, opt);
      // record the check in the direction of travel
      if (side) this.checks.push({ type: 'jump', ax: cur.x + cur.w, ay: this.cy, bx: s.x, by: top, bw: colW, gs: this.gs, gMul: 1, wind: 0 });
      else this.checks.push({ type: 'jump', dir: -1, ax: cur.x, ay: this.cy, bx: s.x + s.w, by: top, bw: colW, gs: this.gs, gMul: 1, wind: 0 });
      if (i % 2 === 0) this.cell(lerp(cur.x + cur.w / 2, s.x + s.w / 2, 0.5), (this.cy + top) / 2 + 2);
      // occasional hazard on a ledge (world-themed pulse from above)
      if (!opts.noWait && this.roles.pulse && this.rng.chance(0.18 + this.diff * 0.15) && i > 1) {
        this.addPulse(this.roles.pulse === 'flare' ? 'flare' : this.roles.pulse, s.x + colW / 2, top, 1.6, 0, 1);
      }
      cur = s; this.cy = top; side = 1 - side;
    }
    this.towers.push({ x: xL - 1, w: xR + colW - xL + 2, y0: y0 - 4, y1: this.cy + 3 });
    // exit: continue to the right from the top of the right column
    this.cx = cur.x + cur.w;
    this.slabMode = prevSlab;
    const dyE = this.rng.range(-0.5, 0.5);
    this.jumpTo(this.safeGap(dyE, 0.3), dyE, this.platWidth() + 2, { slab: true, noPillar: true });
  }

  seg_descent(steps) {
    const prev = this.slabMode;
    this.slabMode = true;
    for (let i = 0; i < steps; i++) {
      const r = this.rng.next();
      if (r < 0.2) { this.seg_drop(); continue; }
      const dy = -this.rng.range(1.8, 4.2);
      const x0 = this.cx, y0 = this.cy;
      const opts = { h: 0.9 };
      if (r > 0.75) opts.crumble = true, opts.style = 'crumble';
      const s = this.jumpTo(this.safeGap(dy), dy, this.platWidth(), opts);
      this.cellsArc(x0, y0, s.x, s.y + s.h, 2, 1.2);
      // falling hazards keep the descent lively
      if (this.rng.chance(0.3 + this.diff * 0.2)) {
        if (this.roles.pulse) this.addPulse(this.roles.pulse, s.x + s.w / 2, s.y + s.h, 1.8, 0, 1);
        else if (s.w > 3) this.meteors.push({ id: this.nid('h'), style: this.W.id === 'venus' ? 'drip' : 'meteor', x: s.x + s.w / 2, y0: s.y + s.h + 16, y1: s.y + s.h, drift: -4, P: 3.4, fall: 1.0, r: 0.7, off: this.rng.range(0, 3) });
      }
    }
    this.slabMode = prev;
  }

  // Optional upper route: a spring pad to floating platforms full of cells (+ a shard).
  bonusUp(on, withShard) {
    const top = on.y + on.h;
    const rise = this.maxH + this.rng.range(1.6, 2.6);
    const box = { x: on.x - 1, y: top + 1.5, w: 24, h: rise + 5 };
    if (!this.regionFree(box)) return false;
    const power = Math.sqrt(2 * PHYS.gravity * this.gs * (rise + 1.6));
    this.plat(on.x + 0.6, top + 0.5, 1.6, { h: 0.5, bounce: power, style: 'spring', noPath: true, slab: true, noPillar: true, oneWay: true });
    const n = 2 + this.rng.int(0, 1);
    let x = on.x + 2.6, y = top + rise;
    for (let i = 0; i < n; i++) {
      const w = this.rng.range(2.2, 3.2);
      this.plat(x, y, w, { noPath: true, slab: true, noPillar: true, h: 0.6, style: 'bonus' });
      this.cellsRow(x, x + w, y, 2);
      if (withShard && i === n - 1) this.shard(x + w / 2, y + 1.4, 'up');
      x += w + this.rng.range(1.6, 2.8);
      y += this.rng.range(-0.6, 1.2);
    }
    return true;
  }

  regionFree(b) {
    const hit = (o) => o.x < b.x + b.w && o.x + o.w > b.x && o.y < b.y + b.h && o.y + o.h > b.y;
    for (const s of this.solids) if (hit(s)) return false;
    for (const h of this.hazards) if (hit(h)) return false;
    for (const m of this.movers) {
      const P = m.path;
      const bb = P.type === 'line' ? { x: Math.min(P.x0, P.x1), y: Math.min(P.y0, P.y1), w: Math.abs(P.x1 - P.x0) + m.w, h: Math.abs(P.y1 - P.y0) + m.h + 2 }
        : P.type === 'circle' ? { x: P.cx - P.r - 2, y: P.cy - P.r - 1, w: 2 * P.r + 4, h: 2 * P.r + 3 }
          : P.type === 'stream' ? { x: P.xStart, y: P.y, w: P.xEnd - P.xStart, h: m.h + 2 }
            : { x: (P.x0 || 0) - 3, y: (P.y0 || 0) - 2, w: m.w + 6, h: 6 };
      if (hit(bb)) return false;
    }
    for (const l of this.launchers) if (hit(l)) return false;
    for (const v of this.vines) if (hit({ x: v.ax - 3, y: v.ay - v.len - 1, w: 6, h: v.len + 2 })) return false;
    return true;
  }

  // ------------------------------------------------------------------ driver
  run(type) {
    this.sequence.push(type);
    switch (type) {
      case 'gap': return this.seg_gap();
      case 'climb': return this.seg_climb();
      case 'drop': return this.seg_drop();
      case 'ice': return this.seg_ice();
      case 'pit': return this.seg_pit();
      case 'crumble': return this.seg_crumble();
      case 'springUp': return this.seg_springUp();
      case 'moverH': return this.seg_moverH();
      case 'longRide': return this.seg_longRide();
      case 'moverV': return this.seg_moverV();
      case 'flare': case 'steam': case 'lightning': case 'exhaust': case 'piston': return this.seg_pulse(type);
      case 'heat': return this.W.id === 'sun' ? this.seg_heat() : this.seg_gap();
      case 'cloud': return this.seg_cloud();
      case 'drip': return this.seg_rain('drip');
      case 'meteor': return this.seg_rain('meteor');
      case 'vent': return this.seg_launch('vent');
      case 'geyser': return this.seg_launch('geyser');
      case 'updraft': return this.seg_launch('updraft');
      case 'mushroom': return this.seg_launch('mushroom');
      case 'wind': return this.seg_wind(false);
      case 'gust': return this.seg_wind(true);
      case 'vehicle': return this.seg_stream('vehicle');
      case 'rover': return this.seg_stream('rover');
      case 'ring': return this.seg_stream('ring');
      case 'asteroid': return this.seg_asteroid();
      case 'bridge': return this.seg_bridge();
      case 'mirror': return this.seg_mirror();
      case 'gear': return this.seg_gear();
      case 'conveyor': return this.seg_conveyor();
      case 'door': return this.seg_door();
      case 'vine': return this.seg_vine();
      case 'gravity': return this.seg_gravity();
      case 'warp': return this.seg_warp();
      default: throw new Error('unknown segment ' + type);
    }
  }

  worldPool() {
    const W = this.W;
    if (W.id === 'saturn' && this.sub > SATURN_RINGS_UNTIL) return W.poolLate;
    if (this.redSpot) return { wind: 6, lightning: 3, moverH: 2, gap: 1 };
    return W.pool;
  }
  signature() {
    if (this.W.id === 'saturn' && this.sub > SATURN_RINGS_UNTIL) return 'updraft';
    return this.W.signature;
  }

  // run `n` segments from a pool, never the same twice in a row
  runPool(pool, n, opts = {}) {
    let prev = null;
    for (let i = 0; i < n; i++) {
      let t = this.rng.weighted(pool);
      for (let k = 0; k < 3 && t === prev; k++) t = this.rng.weighted(pool);
      this.run(t);
      prev = t;
      if (opts.afterEach) opts.afterEach(i);
    }
  }

  restPlatform() {
    const s = this.seg_gap({ w: 7, dy: this.rng.range(-0.5, 0.5) });
    return s;
  }

  build() {
    const W = this.W, r = this.rng, A = this.arch;
    const start = this.plat(-6, 0, 14, { style: W.id === 'asteroids' ? 'rock' : 'block' });
    this.cx = start.x + start.w; this.cy = 0; this.last = start;
    const pool = this.worldPool();
    const sig = this.signature();
    const hazardPool = Object.fromEntries(this.roles.hazard.map((h) => [h, 3]));
    hazardPool.gap = 1;
    const ridePool = Object.fromEntries(this.roles.ride.map((h) => [h, 3]));
    if (W.id === 'saturn' && this.sub > SATURN_RINGS_UNTIL) { ridePool.ring = 0; ridePool.updraft = 2; ridePool.moverH = 2; }
    if (W.id === 'earth' || W.id === 'mars') ridePool.gap = 1;
    let checkpoint = null;
    const cp = () => {
      const s = this.restPlatform();
      checkpoint = { x: s.x + s.w / 2, y: s.y + s.h };
      if (this.diff > 0.3 && r.chance(0.6)) this.pickups.push({ id: this.nid('c'), type: 'heart', x: s.x + s.w / 2 + 1.6, y: s.y + s.h + 1.2 });
      return s;
    };
    const len = 6 + Math.round(this.diff * 8);

    switch (A) {
      case 'intro': {
        this.run('gap');
        this.run(sig);
        this.runPool(pool, 2);
        cp();
        this.run(sig);
        this.runPool(pool, 2);
        break;
      }
      case 'classic': case 'branch': {
        const half = Math.ceil(len / 2);
        this.runPool(pool, half);
        if (!this.sequence.includes(sig)) this.run(sig);
        cp();
        this.runPool(pool, len - half);
        if (this.sequence.filter((t) => t === sig).length < 2) this.run(sig);
        break;
      }
      case 'gauntlet': {
        this.runPool(hazardPool, 3 + Math.round(this.diff * 2));
        cp();
        this.runPool(hazardPool, 3 + Math.round(this.diff * 3));
        this.run(sig);
        break;
      }
      case 'ride': {
        this.runPool(ridePool, 3);
        cp();
        this.runPool(ridePool, 3 + Math.round(this.diff * 2));
        break;
      }
      case 'precision': {
        const pp = { gap: 4, crumble: 3, climb: 2 };
        pp[sig] = 1;
        this.runPool(pp, 4 + Math.round(this.diff * 2));
        cp();
        this.runPool(pp, 4 + Math.round(this.diff * 3));
        break;
      }
      case 'ascent': {
        this.runPool(pool, 1);
        this.seg_tower(5 + Math.round(this.diff * 4));
        cp();
        this.run(sig);
        this.seg_tower(5 + Math.round(this.diff * 5));
        this.runPool(pool, 1);
        break;
      }
      case 'descent': {
        // start on a high perch: raise the start platform's world so we go down
        this.runPool(pool, 1);
        this.seg_springUp(); this.seg_springUp();
        this.seg_descent(4 + Math.round(this.diff * 3));
        cp();
        this.run(sig);
        this.seg_descent(4 + Math.round(this.diff * 3));
        break;
      }
      case 'chase': {
        this.chaser = { trigger: 4, behind: 14, speed: 3.4 + this.diff * 1.4, name: WORLD_FLAVOR[W.id].chaser };
        this.runPool(CHASE_SAFE, 4 + Math.round(this.diff * 2));
        cp();
        this.runPool(CHASE_SAFE, 4 + Math.round(this.diff * 3));
        break;
      }
      case 'tide': {
        this.run('gap');
        this.seg_tower(6 + Math.round(this.diff * 4), { noWait: true });
        cp();
        this.seg_tower(6 + Math.round(this.diff * 4), { noWait: true });
        this.tide = { rate: 0.55 + this.diff * 0.35, delay: 4 };
        break;
      }
      case 'finale': {
        this.run(sig);
        this.runPool(hazardPool, 2);
        this.run(sig);
        this.runPool(pool, 2);
        const s = cp();
        this.chaser = { trigger: s.x + s.w - 1, behind: 16, speed: 3.6 + this.diff * 1.2, name: WORLD_FLAVOR[W.id].chaser };
        this.runPool(CHASE_SAFE, 6 + Math.round(this.diff * 2));
        break;
      }
    }
    const end = this.seg_gap({ w: 10, dy: this.rng.range(-1, 1) });
    const goal = { x: end.x + end.w / 2 + 1, y: end.y + end.h };

    // ---- star shards (3 per level) ----
    this.placeShards(start);

    // ---- finalize vertical layout ----
    let minTop = Infinity;
    for (const s of this.solids) if (s.style !== 'basin') minTop = Math.min(minTop, s.y + s.h);
    for (const m of this.movers) if (m.path.type === 'stream') minTop = Math.min(minTop, m.path.y);
    const floorY = minTop - (W.floating ? 7 : 3);
    if (!W.floating) {
      for (const s of this.solids) {
        if (s.slab || s.style === 'basin' || s.style === 'mushroom' || s.style === 'spring' || s.style === 'bonus') continue;
        const top = s.y + s.h;
        s.y = floorY - 3; s.h = top - s.y;
      }
    }
    const words = WORLD_FLAVOR[W.id].words;
    let name;
    if (A === 'intro') name = `${W.short} Arrival`;
    else if (A === 'finale') name = `${W.short} Finale: ${WORLD_FLAVOR[W.id].chaser}`;
    else name = `${r.pick(words)} ${r.pick(ARCH_NOUNS[A])}`;
    let maxY = 30;
    for (const s of this.solids) maxY = Math.max(maxY, s.y + s.h + 20);
    const level = {
      index: this.n, worldIndex: this.wi, world: W.id, sub: this.sub,
      worldName: W.name, location: locationOf(this.n), archetype: A, name,
      diff: +this.diff.toFixed(3),
      gravity: this.gs,
      spawn: { x: -2, y: 0 },
      goal, checkpoint,
      floor: { type: this.tide && W.floor === 'void' ? 'rift' : W.floor, y: floorY, lethal: W.floor !== 'void' || !!this.tide },
      killY: floorY - (W.floor === 'void' ? 8 : 1.5),
      bounds: { minX: -24, maxX: this.cx + 12, minY: floorY - 10, maxY },
      globalWind: W.sideWind ? { amp: 3 + this.diff * 3, T: 7 } : (this.redSpot ? { amp: 2.5, T: 3 } : null),
      dust: !!W.dust,
      redSpot: this.redSpot,
      chaser: this.chaser, tide: this.tide,
      solids: this.solids, movers: this.movers, hazards: this.hazards,
      launchers: this.launchers, winds: this.winds, gravZones: this.gravZones,
      vines: this.vines, bridges: this.bridges, doors: this.doors,
      meteors: this.meteors, pickups: this.pickups, roads: this.roads,
      gears: this.gears, mirrors: this.mirrors, towers: this.towers,
      checks: this.checks, path: this.path, sequence: this.sequence,
      totalCells: this.pickups.filter((p) => p.type === 'cell').length,
      totalShards: this.pickups.filter((p) => p.type === 'shard').length,
    };
    return level;
  }

  placeShards(start) {
    const r = this.rng;
    // 1) upper secret route above a wide path platform
    const pathSolids = this.path.map((id) => this.solids.find((s) => s.id === id)).filter((s) => s && s.w >= 4.5 && s !== start && !s.crumble && !s.heat);
    const order = pathSolids.map((s) => [r.next(), s]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
    let upDone = 0;
    const wantUp = this.arch === 'branch' ? 3 : 1;
    for (const s of order) {
      if (upDone >= wantUp) break;
      if (this.bonusUp(s, upDone === 0)) upDone++;
    }
    // 2) behind the start: a hidden ledge, or a wall-jump shaft
    const baseTop = 0;
    if (r.chance(0.5)) {
      const b = this.plat(-14.5, baseTop, 4.5, { noPath: true, slab: true, noPillar: true, h: 0.8 });
      const wallH = 10;
      this.plat(b.x, baseTop + wallH, 0.7, { noPath: true, slab: true, noPillar: true, h: wallH, style: 'wall' });
      this.plat(b.x + b.w - 0.7, baseTop + wallH, 0.7, { noPath: true, slab: true, noPillar: true, h: wallH - 2.4, style: 'wall' });
      for (let i = 1; i <= 3; i++) this.cell(b.x + b.w / 2, baseTop + 2 + i * 2.2);
      this.shard(b.x + b.w / 2, baseTop + wallH - 0.8, 'shaft');
    } else {
      const b = this.plat(-13.5, baseTop + this.rng.range(1.5, 3), 2.6, { noPath: true, slab: true, noPillar: true, h: 0.7, style: 'bonus' });
      this.shard(b.x + b.w / 2, b.y + b.h + 1.3, 'behind');
    }
    // 3) a risky one: low in the middle of a wide jump, or high over a climb
    const jumps = this.checks.filter((c) => c.type === 'jump' && !c.dir && c.bx - c.ax > 3.2 && c.ax > 8);
    if (jumps.length) {
      const c = r.pick(jumps);
      const mx = (c.ax + c.bx) / 2;
      this.shard(mx, Math.max(c.ay, c.by) + 3.6, 'risky');
    } else {
      const s = order[0] || this.last;
      this.shard(s.x + s.w / 2, s.y + s.h + 4.2, 'risky');
    }
  }
}

const cache = new Map();

export function generateLevel(n) {
  if (!Number.isInteger(n) || n < 1 || n > TOTAL_LEVELS) throw new Error('level out of range: ' + n);
  if (cache.has(n)) return JSON.parse(cache.get(n));
  const lvl = new Builder(n).build();
  const json = JSON.stringify(lvl);
  if (cache.size > 40) cache.clear();
  cache.set(n, json);
  return JSON.parse(json);
}
