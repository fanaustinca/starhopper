// Deterministic procedural level generator.
// generateLevel(n) returns plain data (no classes) describing one of 700 levels.
// Every static jump is sized against the real controller's jump envelope
// (physics.maxGapFor) so levels are always beatable; tests re-verify by simulation.

import {
  WORLDS, LEVELS_PER_WORLD, TOTAL_LEVELS, PHYS,
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

class Builder {
  constructor(level) {
    this.n = level;
    this.wi = worldIndexOf(level);
    this.W = WORLDS[this.wi];
    this.sub = subLevelOf(level);
    this.rng = makeRng(hash32(level * 7919 + 13));
    const D = (this.sub - 1) / (LEVELS_PER_WORLD - 1);
    const G = (level - 1) / (TOTAL_LEVELS - 1);
    let diff = 0.08 + 0.6 * D + 0.32 * G;
    this.redSpot = this.W.id === 'jupiter' && this.sub >= 41;
    if (this.redSpot) diff += 0.15;
    this.diff = clamp(diff, 0, 1);
    this.gs = this.W.gravity;
    this.maxH = maxJumpHeight(this.gs);
    this.id = 0;
    this.cx = 0; this.cy = 0;
    this.solids = []; this.movers = []; this.hazards = []; this.launchers = [];
    this.winds = []; this.gravZones = []; this.vines = []; this.bridges = [];
    this.doors = []; this.meteors = []; this.pickups = []; this.checks = [];
    this.roads = []; this.path = [];
    this.last = null;
  }

  nid(prefix) { return `${prefix}${this.id++}`; }

  // fraction of the max jump envelope we allow at this difficulty
  gapFrac() { return 0.3 + 0.36 * this.diff; }

  platWidth() {
    const base = this.W.floating ? lerp(6.5, 2.8, this.diff) : lerp(7.5, 3.2, this.diff);
    return Math.max(2.6, base * this.rng.range(0.8, 1.25));
  }

  // Static platform; `top` is the walkable surface.
  plat(x, top, w, opts = {}) {
    const s = {
      id: this.nid('s'), x, y: top - (opts.h || 1.2), w, h: opts.h || 1.2,
      style: opts.style || 'block', slab: !!opts.slab,
      ice: !!opts.ice, conveyor: opts.conveyor || 0, bounce: opts.bounce || 0,
    };
    this.solids.push(s);
    if (!opts.noPath) this.path.push(s.id);
    return s;
  }

  // Advance cursor to a new platform after a jumpable gap; records a check.
  jumpTo(g, dy, w, opts = {}) {
    const fromX = this.cx, fromTop = this.cy;
    const top = this.cy + dy;
    const s = this.plat(this.cx + g, top, w, opts);
    this.checks.push({ type: 'jump', ax: fromX, ay: fromTop, bx: s.x, by: top, bw: w, tall: !this.W.floating && !opts.slab, gs: this.gs, gMul: opts.gMul || 1, wind: opts.wind || 0 });
    this.cx = s.x + w; this.cy = top; this.last = s;
    return s;
  }

  dyRange(lo, hi) {
    let dy = this.rng.range(lo, hi);
    // keep the course inside a vertical band
    if (this.cy + dy > 9) dy = -Math.abs(dy);
    if (this.cy + dy < -5) dy = Math.abs(dy);
    return dy;
  }

  safeGap(dy, frac = this.gapFrac()) {
    const reach = maxGapFor(dy, this.gs) - PHYS.w;
    return Math.max(1.6, reach * frac * this.rng.range(0.75, 1.0));
  }

  cellsArc(x0, y0, x1, y1, n = 3, lift = 2.4) {
    for (let i = 1; i <= n; i++) {
      const t = i / (n + 1);
      this.pickups.push({ id: this.nid('c'), type: 'cell', x: lerp(x0, x1, t), y: lerp(y0, y1, t) + 1.0 + Math.sin(t * Math.PI) * lift });
    }
  }
  cellsRow(x0, x1, y, n = 3) {
    for (let i = 0; i < n; i++) {
      this.pickups.push({ id: this.nid('c'), type: 'cell', x: lerp(x0, x1, (i + 0.5) / n), y: y + 1.0 });
    }
  }

  pulse(P, on, warn, off) { return { P, on, warn, off }; }

  // ------------------------------------------------------------------ segments
  seg_gap(opts = {}) {
    const dy = this.dyRange(this.W.floating ? -2.8 : -2.2, this.W.floating ? 2.4 : 2.0);
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
    this.pickups.push({ id: this.nid('c'), type: 'cell', x: s.x + 0.6, y: s.y + s.h + 1 });
  }

  seg_ice() {
    const s = this.seg_gap({ ice: true, w: this.platWidth() + 3, style: 'ice' });
    // two in a row: a slick run-up then a jump
    if (this.rng.chance(0.6)) this.seg_gap({ ice: true, w: this.platWidth() + 2, style: 'ice' });
    return s;
  }

  seg_pit() {
    // a long walkway broken by a pool of the world's hazard
    const g = this.rng.range(1.8, 2.6 + this.diff * 1.4);
    const top = this.cy;
    const type = { sun: 'fire', mercury: 'mercury', mars: 'lava' }[this.W.id] || 'lava';
    this.hazards.push({ id: this.nid('h'), type, x: this.cx, y: top - 1.3, w: g, h: 0.9, respawn: true });
    this.plat(this.cx - 0.2, top - 1.3, g + 0.4, { h: 0.4, style: 'basin', noPath: true });
    const x0 = this.cx;
    const s = this.jumpTo(g, 0, this.platWidth() + 1.5);
    this.cellsArc(x0, top, s.x, top, 2, 2.0);
  }

  seg_moverH(opts = {}) {
    const mw = opts.w || (3.2 - this.diff * 0.8);
    const e1 = this.rng.range(1.2, 2.0);
    const R = 4 + this.diff * 6 + this.rng.range(0, 2.5);
    const my = this.cy + this.rng.range(-1.0, 0.8);
    const x0 = this.cx + e1, x1 = x0 + R;
    const v = 2.2 + this.diff * 2.4;
    const T = (2 * R / v) * 1.3;
    const m = {
      id: this.nid('m'), kind: opts.kind || 'pad', w: mw, h: 0.6,
      path: { type: 'line', x0, y0: my - 0.6, x1, y1: my - 0.6, T, phase: this.rng.next() },
      warp: !!opts.warp,
    };
    this.movers.push(m);
    this.checks.push({ type: 'mover', ay: this.cy, my, gapA: e1, gs: this.gs });
    this.cellsRow(x0, x1 + mw, my, 3);
    const e2 = this.rng.range(1.2, 2.0);
    this.cx = x1 + mw; this.cy = my;
    const dy = this.rng.range(-0.5, 1.2);
    this.jumpTo(e2, dy, this.platWidth());
  }

  seg_moverV(opts = {}) {
    const rise = this.maxH + this.rng.range(1.5, 3.0);
    const lw = 2.8;
    const lx = this.cx + 1.2;
    const yLow = this.cy - 0.6 - 0.4, yHigh = this.cy + rise - 0.6 - 0.3;
    const v = 2.0 + this.diff * 1.6;
    const T = (2 * rise / v) * 1.3;
    this.movers.push({
      id: this.nid('m'), kind: opts.kind || 'lift', w: lw, h: 0.6,
      path: { type: 'line', x0: lx, y0: yLow, x1: lx, y1: yHigh, T, phase: this.rng.next() },
      warp: !!opts.warp,
    });
    this.pickups.push({ id: this.nid('c'), type: 'cell', x: lx + lw / 2, y: this.cy + rise * 0.6 });
    this.cx = lx + lw; this.cy = yHigh + 0.6;
    const top = this.cy + 0.3;
    const s = this.plat(this.cx + 1.2, top, this.platWidth() + 1);
    this.checks.push({ type: 'lift', top, liftTop: yHigh + 0.6, gs: this.gs });
    this.cx = s.x + s.w; this.cy = top; this.last = s;
  }

  // Long platform with periodically firing vertical columns.
  seg_pulse(type) {
    const w = 12 + this.diff * 8;
    const dy = this.dyRange(-1.5, 1.5);
    const s = this.jumpTo(this.safeGap(dy, 0.4), dy, w);
    const n = 1 + Math.floor(this.diff * 2.4 + this.rng.next() * 0.8);
    const P = this.rng.range(2.8, 3.4) - this.diff * 0.6;
    const on = 0.7 + this.diff * 0.35;
    const fromSky = type === 'flare' || type === 'lightning';
    for (let i = 0; i < n; i++) {
      const cxp = s.x + w * (i + 1) / (n + 1);
      const cw = type === 'lightning' ? 1.4 : 2.0;
      const h = fromSky ? 18 : 5.5;
      this.hazards.push({
        id: this.nid('h'), type, x: cxp - cw / 2, y: s.y + s.h, w: cw, h,
        pulse: this.pulse(P, on, 0.75, (i * P) / n + this.rng.range(0, 0.3)),
      });
    }
    this.cellsRow(s.x + 1, s.x + w - 1, s.y + s.h, Math.min(5, n + 2));
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

  seg_launch(style) {
    // base platform, launcher near its end, then a ledge far above
    const dy0 = this.dyRange(-1, 1);
    const baseW = 6 + this.rng.range(0, 2);
    const base = this.jumpTo(this.safeGap(dy0, 0.4), dy0, baseW);
    const top = base.y + base.h;
    const rise = this.maxH + this.rng.range(1.2, 3.2);
    const g = PHYS.gravity * this.gs;
    const power = Math.sqrt(2 * g * (rise + 1.6));
    const lx = base.x + baseW - 2.2;
    if (style === 'mushroom') {
      // bouncy cap sitting on the platform
      this.plat(lx - 0.2, top + 0.9, 2.0, { h: 0.9, bounce: power, style: 'mushroom', noPath: true });
    } else {
      const always = style === 'updraft';
      this.launchers.push({
        id: this.nid('l'), type: style, x: lx, y: top, w: 1.6, h: rise + 2.5, power,
        pulse: always ? null : this.pulse(2.6 - this.diff * 0.5, 1.1, 0.5, this.rng.range(0, 2)),
      });
    }
    this.pickups.push({ id: this.nid('c'), type: 'cell', x: lx + 0.8, y: top + rise * 0.7 });
    const B = this.plat(base.x + baseW + 1.6, top + rise, this.platWidth() + 1);
    this.checks.push({ type: 'launch', rise, power, gs: this.gs });
    this.cx = B.x + B.w; this.cy = top + rise; this.last = B;
  }

  seg_wind(gust) {
    const dy = this.dyRange(-1.2, 1.0);
    let g;
    let vx;
    if (gust) {
      // a gap too wide to jump: the gust must carry you
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
      pulse: this.pulse(P, P * 0.5, 0.6, this.rng.range(0, P)),
      gust: !!gust,
    });
    const s = this.jumpTo(g, dy, this.platWidth() + (gust ? 1.5 : 0), { wind: gust ? vx : 0 });
    if (gust) this.checks[this.checks.length - 1].type = 'gust';
    this.cellsArc(x0, y0, s.x, s.y + s.h, 4, 1.6);
  }

  seg_stream(kind) {
    // vehicles/rovers/ring chunks driving left→right under two overpass slabs
    let vtype = kind;
    if (kind === 'vehicle') {
      const city = EARTH_CITIES[Math.floor((this.sub - 1) / 5)];
      vtype = this.rng.pick(CITY_TRAFFIC[city]);
    }
    const V = VEHICLES[vtype];
    const deckTop = Math.max(...V.decks.map((d) => d[2]));
    // A: current platform must be a slab wide enough for the vehicle to emerge from
    const A = this.plat(this.cx + this.safeGap(0, 0.35), this.cy, 6, { slab: true, style: vtype === 'plane' ? 'helipad' : 'slab' });
    this.checks.push({ type: 'jump', ax: this.cx, ay: this.cy, bx: A.x, by: this.cy, bw: 6, gs: this.gs, gMul: 1, wind: 0 });
    this.cx = A.x + A.w;
    const top = this.cy;
    const laneY = top - 1.35 - deckTop;           // vehicle bottom
    const S = 12 + this.diff * 10 + this.rng.range(0, 4);
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
    if (kind !== 'ring' && kind !== 'asteroid') {
      this.roads.push({ id: this.nid('r'), type: vtype === 'boat' ? 'water' : vtype === 'plane' ? 'sky' : (kind === 'rover' ? 'canyon' : 'road'), x: xStart, x1: xEnd, y: laneY });
      if (vtype !== 'plane') {
        this.hazards.push({ id: this.nid('h'), type: vtype === 'boat' ? 'water' : 'traffic', x: A.x + A.w, y: laneY - 1.2, w: S, h: 1.0, respawn: true, hidden: true });
      }
    }
    this.cellsRow(this.cx + 1, this.cx + S - 1, laneY + deckTop, 4);
    const bTop = laneY + deckTop + this.rng.range(0.6, 1.1);
    const B = this.plat(this.cx + S, bTop, 6, { slab: true, style: vtype === 'plane' ? 'helipad' : 'slab' });
    this.checks.push({ type: 'stream', aTop: top, deckTop: laneY + deckTop, bTop, gs: this.gs });
    this.cx = B.x + B.w; this.cy = bTop; this.last = B;
  }

  seg_asteroid() {
    const n = 2 + (this.diff > 0.45 ? 1 : 0);
    let x = this.cx, y = this.cy;
    for (let i = 0; i < n; i++) {
      const dy = this.rng.range(-1.2, 1.2);
      const g = this.safeGap(dy, 0.32 + this.diff * 0.15);
      const w = 3.0 - this.diff * 0.4;
      const ax = 0.4 + this.diff * 0.6, ay = 0.5 + this.diff * 0.5;
      // keep the worst-case distance within the envelope
      const x0 = x + g + ax;
      this.movers.push({
        id: this.nid('a'), kind: 'asteroid', w, h: 1.4,
        path: { type: 'bob', x0, y0: y + dy - 1.4, ax, ay, T: 3.5 + this.rng.range(0, 2), phase: this.rng.next() },
      });
      this.checks.push({ type: 'mover', ay: y, my: y + dy + ay, gapA: g + 2 * ax, gs: this.gs });
      this.pickups.push({ id: this.nid('c'), type: 'cell', x: x0 + w / 2, y: y + dy + 1.6 });
      x = x0 + w + ax; y = y + dy - ay;
    }
    this.cx = x; this.cy = y;
    this.jumpTo(this.safeGap(0.5, 0.4), 0.5, this.platWidth() + 1, { style: 'rock' });
  }

  seg_meteor() {
    const w = 12 + this.diff * 6;
    const dy = this.dyRange(-1, 1);
    const s = this.jumpTo(this.safeGap(dy, 0.4), dy, w, { style: this.W.id === 'asteroids' ? 'rock' : 'block' });
    const top = s.y + s.h;
    const n = 1 + Math.floor(this.diff * 2.5);
    for (let i = 0; i < n; i++) {
      const ix = s.x + w * (i + 1) / (n + 1);
      this.meteors.push({ id: this.nid('h'), x: ix, y0: top + 18, y1: top, drift: -5, P: 3.2 - this.diff * 0.8, fall: 1.0, r: 0.8, off: this.rng.range(0, 3) });
    }
    this.cellsRow(s.x + 1, s.x + w - 1, top, 4);
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
    const m = x0 + R + mw;                     // mirror line
    const y = this.cy - 0.6 + this.rng.range(-0.5, 0.5);
    const T = (2 * R / (2.2 + this.diff * 1.8)) * 1.3;
    const masterId = this.nid('m');
    this.movers.push({ id: masterId, kind: 'prism', w: mw, h: 0.6, path: { type: 'line', x0, y0: y, x1: m - mw, y1: y, T, phase: this.rng.next() } });
    this.movers.push({ id: this.nid('m'), kind: 'prism', mirrorOf: masterId, w: mw, h: 0.6, path: { type: 'mirror', master: masterId, m } });
    this.decorMirror = this.decorMirror || [];
    this.decorMirror.push({ x: m, y: y + 0.6 });
    this.cellsRow(x0, 2 * m - x0, y + 0.6, 4);
    const farEnd = 2 * m - x0;                  // mirror's far right edge
    this.checks.push({ type: 'mover', ay: this.cy, my: y + 0.6, gapA: e, gs: this.gs });
    this.cx = farEnd; this.cy = y + 0.6;
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
    this.gears = this.gears || [];
    this.gears.push({ id: gid, x: ccx, y: ccy, r, omega });
    this.pickups.push({ id: this.nid('c'), type: 'cell', x: ccx, y: ccy + r + 1.2 });
    this.checks.push({ type: 'gear', r });
    this.cx = ccx + r + 1.5 - 0.0; this.cy = ccy + 0.3;
    this.jumpTo(0.2, this.rng.range(-0.3, 1.0), this.platWidth() + 1);
  }

  seg_conveyor() {
    const dy = this.dyRange(-1, 1);
    const sp = (2.5 + this.diff * 3) * (this.rng.chance(0.55) ? 1 : -1);
    const s = this.jumpTo(this.safeGap(dy, 0.4), dy, 10 + this.diff * 5, { conveyor: sp, style: 'conveyor' });
    this.cellsRow(s.x + 1, s.x + s.w - 1, s.y + s.h, 3);
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
    const g = (maxGapFor(0, this.gs) - PHYS.w) * this.rng.range(1.05, 1.3);
    const n = g > 12.5 ? 2 : 1;
    const top = this.cy;
    for (let i = 0; i < n; i++) {
      const ax = this.cx + g * (i + 1) / (n + 1);
      this.vines.push({ id: this.nid('v'), ax, ay: top + 7.8, len: 6.0, phase: this.rng.next() * 6.28 });
      this.pickups.push({ id: this.nid('c'), type: 'cell', x: ax, y: top + 1.0 });
    }
    const s = this.plat(this.cx + g, top + this.rng.range(-0.5, 0.8), this.platWidth() + 1);
    this.checks.push({ type: 'vine', g });
    this.cx = s.x + s.w; this.cy = s.y + s.h; this.last = s;
  }

  seg_gravity() {
    // the gap is only crossable during the zone's low-gravity phase
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

  // ------------------------------------------------------------------ driver
  run(type) {
    switch (type) {
      case 'gap': return this.seg_gap();
      case 'climb': return this.seg_climb();
      case 'ice': return this.seg_ice();
      case 'pit': return this.seg_pit();
      case 'moverH': return this.seg_moverH({ kind: this.W.id === 'sun' ? 'shield' : 'pad' });
      case 'moverV': return this.seg_moverV();
      case 'flare': case 'steam': case 'lightning': case 'exhaust': return this.seg_pulse(type);
      case 'cloud': return this.seg_cloud();
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
      case 'meteor': return this.seg_meteor();
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

  build() {
    const W = this.W;
    const r = this.rng;
    const startStyle = W.id === 'asteroids' ? 'rock' : 'block';
    const start = this.plat(-6, 0, 14, { style: startStyle });
    this.cx = start.x + start.w; this.cy = 0; this.last = start;

    let pool = W.pool;
    if (W.id === 'saturn' && this.sub > 25) pool = W.poolLate;
    if (this.redSpot) pool = { wind: 6, lightning: 3, moverH: 2, gap: 1 };
    let signature = W.signature;
    if (W.id === 'saturn' && this.sub > 25) signature = 'updraft';

    const nSeg = 6 + Math.round(this.diff * 10) + r.int(0, 2);
    const sequence = [];
    for (let i = 0; i < nSeg; i++) {
      let t = r.weighted(pool);
      // first segments of the very first levels stay gentle
      if (this.n <= 2 && i < 2) t = 'gap';
      if (i > 0 && t === sequence[i - 1] && r.chance(0.5)) t = r.weighted(pool);
      sequence.push(t);
    }
    // guarantee the world's signature mechanic shows up at least twice
    let sig = sequence.filter((t) => t === signature).length;
    for (let i = 2; sig < 2 && i < sequence.length; i += 3) {
      if (sequence[i] !== signature) { sequence[i] = signature; sig++; }
    }
    if (this.n === 1) sequence[0] = 'gap';

    const cpAt = Math.floor(nSeg / 2);
    let checkpoint = null;
    for (let i = 0; i < sequence.length; i++) {
      this.run(sequence[i]);
      if (i === cpAt - 1) {
        // a calm rest platform with the checkpoint beacon
        const s = this.seg_gap({ w: 7 });
        checkpoint = { x: s.x + s.w / 2, y: s.y + s.h };
        if (this.diff > 0.35 && r.chance(0.6)) this.pickups.push({ id: this.nid('c'), type: 'heart', x: s.x + s.w / 2 + 1.6, y: s.y + s.h + 1.2 });
      }
    }
    const end = this.seg_gap({ w: 10 });
    const goal = { x: end.x + end.w / 2 + 1, y: end.y + end.h };

    // ---- finalize vertical layout ----
    let minTop = Infinity;
    for (const s of this.solids) if (s.style !== 'basin') minTop = Math.min(minTop, s.y + s.h);
    for (const m of this.movers) {
      if (m.path.type === 'stream') minTop = Math.min(minTop, m.path.y);
    }
    const floorY = minTop - (W.floating ? 7 : 3);
    if (!W.floating) {
      for (const s of this.solids) {
        if (s.slab || s.style === 'basin' || s.style === 'mushroom') continue;
        const top = s.y + s.h;
        s.y = floorY - 3; s.h = top - s.y;
      }
    }
    // pit pools in grounded worlds sit inside the blocks; nothing else to do
    const maxX = this.cx + 12;
    const level = {
      index: this.n, worldIndex: this.wi, world: W.id, sub: this.sub,
      worldName: W.name, location: locationOf(this.n),
      diff: +this.diff.toFixed(3),
      gravity: this.gs,
      spawn: { x: -2, y: 0 },
      goal, checkpoint,
      floor: { type: W.floor, y: floorY, lethal: W.floor !== 'void' },
      killY: floorY - (W.floor === 'void' ? 8 : 1.5),
      bounds: { minX: -14, maxX, minY: floorY - 10, maxY: 30 },
      globalWind: W.sideWind ? { amp: 3 + this.diff * 3, T: 7 } : (this.redSpot ? { amp: 2.5, T: 3 } : null),
      dust: !!W.dust,
      redSpot: this.redSpot,
      solids: this.solids, movers: this.movers, hazards: this.hazards,
      launchers: this.launchers, winds: this.winds, gravZones: this.gravZones,
      vines: this.vines, bridges: this.bridges, doors: this.doors,
      meteors: this.meteors, pickups: this.pickups, roads: this.roads,
      gears: this.gears || [], mirrors: this.decorMirror || [],
      checks: this.checks, path: this.path, sequence,
      totalCells: this.pickups.filter((p) => p.type === 'cell').length,
    };
    return level;
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
