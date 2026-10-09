// Fast Node-side tests for the pure game core (physics, generator, sim).
// Verifies every one of the 700 levels is generated and that every static
// jump on every critical path is clearable by the real controller.

import assert from 'node:assert/strict';
import { WORLDS, TOTAL_LEVELS, PHYS, worldOf, locationOf, MAX_HEALTH } from '../public/js/core/config.js';
import { createPlayer, stepPlayer, maxJumpHeight, maxGapFor } from '../public/js/core/physics.js';
import { getLevel as generateLevel } from '../public/js/levels/index.js';
import { solveLevel } from '../tools/solver.mjs';
import { buildLevel } from '../public/js/levels/build.js';
import fs from 'node:fs';
import { LevelSim } from '../public/js/core/sim.js';
import { CATEGORIES, ITEMS, buyOrEquip, normalizeCosmetics } from '../public/js/core/shop.js';
import { loadSave, defaultSave } from '../public/js/core/save.js';
import { SYSTEMS, systemOf } from '../public/js/core/config.js';

let passed = 0, failed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log('  ✓', name); }
  catch (e) { failed++; console.log('  ✗', name, '\n    ', e.message); }
}

const DT = PHYS.dt;
const solid = (x, y, w, h, extra = {}) => ({ x, y, w, h, active: true, oneWay: false, dx: 0, dy: 0, static: true, ...extra });
const idle = () => ({ left: false, right: false, jump: false, jumpPressed: false, up: false, down: false });

function run(p, world, ticks, inputFn, env = { gravityScale: 1 }) {
  for (let i = 0; i < ticks; i++) stepPlayer(p, inputFn(i), world, env, DT);
}

// Try to cross from platform A to platform B with the real controller.
function canCross(chk) {
  // leftward jumps (tower zig-zags) are mirrored into rightward ones
  if (chk.dir < 0) chk = { ...chk, dir: 1, ax: -chk.ax, bx: -chk.bx };
  const A = solid(chk.ax - 6, chk.ay - 1, 6, 1);
  const B = chk.tall ? solid(chk.bx, chk.by - 30, chk.bw, 30) : solid(chk.bx, chk.by - 1.2, chk.bw, 1.2);
  const world = { colliders: [A, B] };
  const env = { gravityScale: chk.gs, gravAt: () => chk.gMul || 1, windAt: () => chk.wind || 0 };
  const doubles = [null];
  for (let d = 0.1; d <= 1.6; d += 0.05) doubles.push(d);
  for (const back of [0, 1.5, 3]) for (const dAt of doubles) {
    const p = createPlayer(chk.ax - 5.5, chk.ay);
    p.onGround = true; p.ground = A;
    let jumped = false, jt = 0, doubled = false;
    for (let i = 0; i < 600; i++) {
      const inp = idle(); inp.jump = true;
      // run to the edge, then steer the landing toward a spot on B
      const target = chk.bx + Math.min(chk.bw / 2, 1.2);
      if (!jumped) inp.right = true;
      else if (p.x < target - 0.15) inp.right = true;
      else if (p.x > target + 0.15) inp.left = true;
      if (!jumped && p.x + p.w / 2 >= chk.ax - 0.05 - back) { inp.jumpPressed = true; jumped = true; }
      else if (jumped && !doubled && dAt != null && jt >= dAt) { inp.jumpPressed = true; doubled = true; }
      if (jumped) jt += DT;
      stepPlayer(p, inp, world, env, DT);
      if (p.hang && p.hang.plat === B) return true;   // ledge grab counts: climb is automatic
      if (p.onGround && p.ground === B) return true;
      if (p.y < Math.min(chk.ay, chk.by) - 12) break;
    }
  }
  return false;
}

console.log('\nPhysics');
test('runs right and stays on flat ground', () => {
  const ground = solid(-50, -1, 100, 1);
  const p = createPlayer(0, 0); p.onGround = true; p.ground = ground;
  run(p, { colliders: [ground] }, 240, () => ({ ...idle(), right: true }));
  assert.ok(p.x > 15, 'moved ' + p.x);
  assert.ok(Math.abs(p.y) < 1e-6, 'y drifted ' + p.y);
  assert.ok(p.onGround);
});
test('single jump apex matches analytic height', () => {
  const ground = solid(-50, -1, 100, 1);
  const p = createPlayer(0, 0); p.onGround = true; p.ground = ground;
  let maxY = 0;
  run(p, { colliders: [ground] }, 200, (i) => { maxY = Math.max(maxY, p.y); return { ...idle(), jump: true, jumpPressed: i === 0 }; });
  const expect = PHYS.jumpVel ** 2 / (2 * PHYS.gravity);
  assert.ok(Math.abs(maxY - expect) < 0.15, `apex ${maxY} vs ${expect}`);
  assert.ok(p.onGround, 'landed again');
});
test('double jump reaches higher than single', () => {
  const ground = solid(-50, -1, 100, 1);
  const p = createPlayer(0, 0); p.onGround = true; p.ground = ground;
  let maxY = 0;
  run(p, { colliders: [ground] }, 300, (i) => { maxY = Math.max(maxY, p.y); return { ...idle(), jump: true, jumpPressed: i === 0 || i === 40 }; });
  assert.ok(maxY > PHYS.jumpVel ** 2 / (2 * PHYS.gravity) + 1.2, 'double apex ' + maxY);
  assert.ok(maxY <= maxJumpHeight(1) + 0.1);
});
test('only one air jump after walking off a ledge', () => {
  const ground = solid(-10, -1, 10, 1);
  const p = createPlayer(-1, 0); p.onGround = true; p.ground = ground;
  const evs = [];
  for (let i = 0; i < 200; i++) {
    const inp = { ...idle(), right: true, jump: true, jumpPressed: i === 60 || i === 80 };
    evs.push(...stepPlayer(p, inp, { colliders: [ground] }, { gravityScale: 1 }, DT));
  }
  assert.equal(evs.filter((e) => e === 'doublejump').length, 1);
  assert.equal(evs.filter((e) => e === 'jump').length, 0);
});
test('wall blocks horizontal movement (no tunnelling)', () => {
  const ground = solid(-50, -1, 100, 1);
  const wall = solid(3, 0, 0.3, 10);
  const p = createPlayer(0, 0); p.onGround = true; p.ground = ground;
  run(p, { colliders: [ground, wall] }, 300, () => ({ ...idle(), right: true }));
  assert.ok(p.x + p.w / 2 <= 3 + 1e-6, 'went through wall: ' + p.x);
});
test('max-speed fall never passes through a thin platform', () => {
  const thin = solid(-5, -0.3, 10, 0.3);
  const p = createPlayer(0, 40);
  run(p, { colliders: [thin] }, 600, idle);
  assert.ok(Math.abs(p.y) < 1e-6 && p.onGround, 'y=' + p.y);
});
test('one-way platform: jump up through, land on top', () => {
  const ground = solid(-50, -1, 100, 1);
  const plat = solid(-2, 2, 4, 0.3, { oneWay: true });
  const p = createPlayer(0, 0); p.onGround = true; p.ground = ground;
  run(p, { colliders: [ground, plat] }, 200, (i) => ({ ...idle(), jump: true, jumpPressed: i === 0 }));
  assert.ok(p.onGround && p.ground === plat, 'stood on one-way, y=' + p.y);
});
test('ledge grab then climb onto the ledge', () => {
  const ledge = solid(2, -6, 6, 9);    // top at y=3
  const low = solid(-6, -1, 7.6, 1);   // floor below, ends 0.4 left of the wall
  const p = createPlayer(0, 0); p.onGround = true; p.ground = low;
  const world = { colliders: [ledge, low] };
  let grabbed = false;
  for (let i = 0; i < 400 && !grabbed; i++) {
    // jump straight up beside the wall, push into it while falling
    const inp = { ...idle(), right: i > 20, jump: i < 30, jumpPressed: i === 0 };
    stepPlayer(p, inp, world, { gravityScale: 1 }, DT);
    if (p.hang) grabbed = true;
  }
  assert.ok(grabbed, 'should grab ledge (y=' + p.y + ')');
  for (let i = 0; i < 80; i++) stepPlayer(p, { ...idle(), up: i < 5 }, world, { gravityScale: 1 }, DT);
  assert.ok(p.onGround && p.ground === ledge, 'climbed: y=' + p.y);
  assert.ok(Math.abs(p.y - 3) < 1e-6);
});
test('wall slide slows the fall; wall jump kicks away and up', () => {
  const wall = solid(2, -10, 1, 30);
  const p = createPlayer(1.55, 6);
  const world = { colliders: [wall] };
  for (let i = 0; i < 120; i++) stepPlayer(p, { ...idle(), right: true }, world, { gravityScale: 1 }, DT);
  assert.ok(p.state === 'wall' && p.vy >= -PHYS.wallSlide - 1e-6, 'sliding at ' + p.vy);
  stepPlayer(p, { ...idle(), right: true, jump: true, jumpPressed: true }, world, { gravityScale: 1 }, DT);
  assert.ok(p.vx < -5 && p.vy > 10, `kicked off: vx=${p.vx} vy=${p.vy}`);
});
test('rides a moving platform', () => {
  const plat = solid(0, -0.5, 3, 0.5, { oneWay: true });
  const p = createPlayer(1.5, 0); p.onGround = true; p.ground = plat;
  for (let i = 0; i < 120; i++) {
    plat.dx = 0.03; plat.x += plat.dx;
    stepPlayer(p, idle(), { colliders: [plat] }, { gravityScale: 1 }, DT);
  }
  assert.ok(Math.abs(p.x - (1.5 + 3.6)) < 0.05, 'carried to ' + p.x);
  assert.ok(p.onGround);
});

console.log('\nShop & star map');
test('shop catalogue: 7 categories, each with a free default and unique, priced items', () => {
  assert.equal(CATEGORIES.length, 7);
  for (const c of CATEGORIES.filter((q) => q.id !== 'skin')) {
    const list = ITEMS[c.id];
    assert.ok(list.length >= 6, c.id + ' has items');
    assert.equal(list[0].id, 'none'); assert.equal(list[0].price, 0);
    assert.equal(new Set(list.map((i) => i.id)).size, list.length, c.id + ' ids unique');
    for (const i of list.slice(1)) assert.ok(i.price > 0 && i.name, `${c.id}.${i.id} priced`);
  }
});
test('buying and equipping cosmetics spends cells once; old saves gain the new slots', () => {
  const s = { ...defaultSave(), wallet: 500 };
  assert.equal(buyOrEquip(s, 'hat', 'halo'), 'bought');
  assert.equal(s.wallet, 0); assert.equal(s.equip.hat, 'halo');
  assert.equal(buyOrEquip(s, 'hat', 'wizard'), 'poor');
  assert.equal(s.equip.hat, 'halo');
  assert.equal(buyOrEquip(s, 'hat', 'none'), 'equipped');
  assert.equal(buyOrEquip(s, 'hat', 'halo'), 'equipped');
  assert.equal(s.wallet, 0, 're-equipping is free');
  // a v2 save from before the shop expansion
  const store = { getItem: () => JSON.stringify({ unlocked: 50, wallet: 10, skins: ['classic', 'ninja'], skin: 'ninja' }), setItem() {} };
  const old = loadSave(store);
  assert.equal(old.skin, 'ninja');
  for (const c of Object.keys(ITEMS)) { assert.deepEqual(old.owned[c], ['none']); assert.equal(old.equip[c], 'none'); }
  // equipped-but-not-owned (tampered) falls back to the default
  const bad = normalizeCosmetics({ owned: { hat: ['none'] }, equip: { hat: 'halo' } });
  assert.equal(bad.equip.hat, 'none');
});
test('star map: Sol has the Sun + 9 bodies, Vesper the 6 alien worlds, the black hole sits alone', () => {
  assert.equal(SYSTEMS.length, 3);
  assert.deepEqual(SYSTEMS.map((q) => q.worlds.length), [10, 6, 1]);
  const all = SYSTEMS.flatMap((q) => q.worlds).sort((a, b) => a - b);
  assert.deepEqual(all, WORLDS.map((_, i) => i), 'every world in exactly one system');
  for (const wi of SYSTEMS[1].worlds) assert.ok(WORLDS[wi].alien, WORLDS[wi].id + ' is alien');
  assert.equal(systemOf(16).id, 'void');
});

console.log('\nCampaign structure');
test('16 worlds × 30 levels + the black hole bonus = 481', () => {
  assert.equal(WORLDS.length, 17);
  assert.equal(TOTAL_LEVELS, 481);
  assert.equal(worldOf(481).id, 'blackhole');
  assert.equal(worldOf(421).id, 'aerolis');
  assert.equal(worldOf(480).id, 'velocitar');
  assert.equal(worldOf(1).id, 'sun');
  assert.equal(worldOf(31).id, 'mercury');
  assert.equal(worldOf(92).id, 'earth');
  assert.equal(locationOf(92), 'London');
  assert.equal(locationOf(120), 'Tokyo');
  assert.equal(worldOf(205).id, 'jupiter');
  assert.equal(locationOf(205), 'Great Red Spot');
  assert.equal(locationOf(215), 'The Rings');
  assert.equal(locationOf(230), 'Gas Surface');
  assert.equal(worldOf(420).id, 'chronos');
});

const levels = [];
test('all 481 levels are hand-written and build to valid data', () => {
  const missing = [];
  for (let n = 1; n <= TOTAL_LEVELS; n++) {
    let L;
    try { L = generateLevel(n); } catch (e) { missing.push(`${n}: ${e.message}`); continue; }
    levels.push(L);
    assert.equal(L.index, n);
    const ids = new Set();
    for (const arr of [L.solids, L.movers, L.hazards, L.pickups, L.enemies]) for (const e of arr) {
      assert.ok(!ids.has(e.id), `L${n} dup id ${e.id}`); ids.add(e.id);
    }
    for (const s of L.solids) for (const k of ['x', 'y', 'w', 'h']) assert.ok(Number.isFinite(s[k]) && (k === 'x' || k === 'y' || s[k] > 0), `L${n} bad solid ${k}`);
    assert.ok(L.floor.y < L.goal.y, `L${n} floor above goal`);
  }
  assert.equal(missing.length, 0, `${missing.length} levels missing/broken:\n      ` + missing.slice(0, 8).join('\n      '));
});
test('level files contain no randomness or procedural generation', () => {
  for (const w of WORLDS) {
    const src = fs.readFileSync(new URL(`../public/js/levels/${w.id}.js`, import.meta.url), 'utf8');
    assert.ok(!/Math\.random|makeRng|hash32\(|\bseed\s*[=:(]/.test(src), `${w.id}.js uses randomness`);
  }
});
test('every level: a name, exactly 3 star shards, a checkpoint, cells', () => {
  for (const L of levels) {
    assert.ok(L.name && L.name.length > 3, `L${L.index} name`);
    assert.equal(L.totalShards, 3, `L${L.index} has ${L.totalShards} shards`);
    assert.ok(L.checkpoint, `L${L.index} checkpoint`);
    assert.ok(L.totalCells >= 5, `L${L.index} cells`);
  }
  for (let w = 0; w < WORLDS.length - 1; w++) {
    const names = levels.filter((l) => l.worldIndex === w).map((l) => l.name);
    assert.equal(new Set(names).size, names.length, `world ${w + 1} has duplicate level names`);
  }
});
test('the solver bot finishes every one of the 481 levels', () => {
  const bad = [];
  let sims = 0;
  for (const L of levels) {
    const r = solveLevel(L);
    sims += r.sims;
    if (!r.ok) bad.push(`L${L.index} ${L.name}: ${r.problems.join('; ')}`);
  }
  assert.equal(bad.length, 0, `${bad.length} unfinishable:\n      ` + bad.slice(0, 10).join('\n      '));
  console.log(`    (${levels.length} levels solved, ${sims} simulated attempts)`);
});
test('layouts differ: no two levels in a world share the same platform skeleton', () => {
  for (let w = 0; w < WORLDS.length - 1; w++) {
    const sigs = new Set();
    for (const L of levels.filter((l) => l.worldIndex === w)) {
      const sig = L.solids.map((s) => `${Math.round(s.x)},${Math.round(s.y + s.h)},${Math.round(s.w)}`).sort().join('|');
      assert.ok(!sigs.has(sig), `world ${w + 1}: level ${L.index} duplicates another layout`);
      sigs.add(sig);
    }
  }
});

test('THE END: a huge level inside the black hole that samples every world', () => {
  const L = levels[480];
  assert.equal(L.world, 'blackhole');
  assert.ok(L.goal.x - L.spawn.x > 700, 'super long: ' + (L.goal.x - L.spawn.x));
  assert.ok(L.checkpoints.length >= 6, 'checkpoints ' + L.checkpoints.length);
  const has = { vines: L.vines.length, streams: L.movers.some((m) => m.path.type === 'stream'), rovers: L.movers.some((m) => m.kind === 'rover'), buses: L.movers.some((m) => m.kind === 'bus'),
    gears: L.gears.length, bridges: L.bridges.length, doors: L.doors.length, zips: L.zips.length, barrels: L.barrels.length, chaser: !!L.chaser, warp: L.movers.some((m) => m.warp) };
  for (const [k, v] of Object.entries(has)) assert.ok(v, 'THE END is missing ' + k);
});

test('speed-run worlds are built around flow: rings and boost lanes in most levels', () => {
  for (const id of ['aerolis', 'velocitar']) {
    const ws = levels.filter((l) => l.world === id);
    assert.equal(ws.length, 30, id);
    const flow = ws.filter((l) => l.rings.length || l.solids.some((s) => s.style === 'boost'));
    assert.ok(flow.length >= 24, `${id}: only ${flow.length}/30 levels use rings or boost lanes`);
  }
});

console.log('\nLevel runtime');
test('teleporting onto the goal completes the level', () => {
  const sim = new LevelSim(generateLevel(1));
  for (let i = 0; i < 30; i++) sim.step(idle());
  assert.ok(sim.player.onGround, 'spawned on ground');
  sim.teleport(sim.L.goal.x, sim.L.goal.y);
  for (let i = 0; i < 10; i++) sim.step(idle());
  assert.ok(sim.complete);
  assert.ok(sim.score() >= 0);
});
test('falling out of the world costs health and respawns safely', () => {
  const sim = new LevelSim(generateLevel(3));
  for (let i = 0; i < 30; i++) sim.step(idle());
  sim.teleport(sim.L.goal.x - 200, -5);
  for (let i = 0; i < 400; i++) sim.step(idle());
  assert.equal(sim.health, MAX_HEALTH - 1);
  assert.ok(sim.player.y > sim.L.floor.y + 1);
});
test('losing all health returns to the checkpoint with full health', () => {
  const sim = new LevelSim(generateLevel(10));
  sim.checkpointReached = true;
  for (let k = 0; k < 3; k++) { sim.invuln = 0; sim.hurt(true, 'test'); }
  assert.equal(sim.health, MAX_HEALTH);
  assert.equal(sim.deaths, 1);
  assert.ok(Math.abs(sim.player.x - sim.L.checkpoint.x) < 0.01);
});
test('lava hazards damage the player (Sun)', () => {
  // find a Sun level with a pit pool
  const L = levels.slice(0, 30).find((l) => l.hazards.some((h) => h.type === 'fire'));
  if (!L) return;
  assert.ok(L, 'a sun level with fire pits');
  const sim = new LevelSim(generateLevel(L.index));
  const h = L.hazards.find((x) => x.type === 'fire');
  sim.teleport(h.x + h.w / 2, h.y + h.h - 0.3);
  sim.step(idle());
  assert.equal(sim.health, MAX_HEALTH - 1);
});
test('light bridges solidify on touch (Prismara)', () => {
  const L = levels.find((l) => l.bridges.length);
  const sim = new LevelSim(generateLevel(L.index));
  const b = L.bridges[0];
  assert.equal(sim.bridgeState[0].c.active, false);
  sim.teleport(b.x - 1, b.y + b.h);
  sim.step(idle());
  assert.equal(sim.bridgeState[0].c.active, true);
});
test('crumbling platforms give way after standing on them, then re-form', () => {
  const L = levels.find((l) => l.solids.some((s) => s.crumble));
  const sim = new LevelSim(generateLevel(L.index));
  const c = sim.crumbles[0];
  sim.teleport(c.x + c.w / 2, c.y + c.h);
  for (let i = 0; i < 40; i++) sim.step(idle());
  assert.ok(c.active && c.crumbleStart >= 0, 'started crumbling');
  for (let i = 0; i < 60; i++) sim.step(idle());
  assert.equal(c.active, false, 'gave way');
  sim.teleport(L.goal.x - 3, L.goal.y);
  for (let i = 0; i < 400; i++) sim.step(idle());
  assert.equal(c.active, true, 're-formed');
});
test('chase levels: the wall advances and catching you costs health', () => {
  const L = levels.find((l) => l.chaser && l.chaser.trigger < 10);
  const sim = new LevelSim(generateLevel(L.index));
  sim.teleport(L.chaser.trigger + 2, L.spawn.y);
  sim.step(idle());
  assert.ok(sim.chaser.active);
  const x0 = sim.chaser.x;
  for (let i = 0; i < 200; i++) sim.step(idle());
  assert.ok(sim.chaser.x > x0 + 5, 'advanced');
  for (let i = 0; i < 800; i++) sim.step(idle());
  assert.ok(sim.health < MAX_HEALTH, 'caught the idle robot');
});
test('tide levels: the floor rises over time', () => {
  const L = levels.find((l) => l.tide);
  const sim = new LevelSim(generateLevel(L.index));
  const y0 = sim.floorY;
  for (let i = 0; i < 1200; i++) sim.step(idle());
  assert.ok(sim.floorY > y0 + 2, `rose ${sim.floorY - y0}`);
});
test('switches swap red/blue blocks; enemies can be stomped; turrets fire', () => {
  const Ls = levels.find((l) => l.solids.some((s) => s.button));
  const sim = new LevelSim(generateLevel(Ls.index));
  const btn = sim.colliders.find((c) => c.button), red = sim.colliders.find((c) => c.onoff === 'red');
  assert.equal(red.active, true);
  sim.teleport(btn.x + btn.w / 2, btn.y + btn.h + 0.5);
  for (let i = 0; i < 40; i++) sim.step(idle());
  assert.equal(sim.switchState, 1); assert.equal(red.active, false);
  const Le = levels.find((l) => l.enemies.some((e) => e.type === 'walker'));
  const s2 = new LevelSim(generateLevel(Le.index));
  const en = s2.enemies.find((e) => e.def.type === 'walker');
  s2.step(idle());
  s2.teleport(en.x, en.y + 0.7); s2.player.vy = -5;
  s2.step(idle());
  assert.equal(en.alive, false, 'stomped');
  const Lt = levels.find((l) => l.turrets.length);
  const s3 = new LevelSim(generateLevel(Lt.index));
  for (let i = 0; i < 800 && !s3.shots.length; i++) s3.step(idle());
  assert.ok(s3.shots.length > 0, 'turret fired');
});
test('zip lines carry you along the cable; jumping lets go', () => {
  const z = { x0: 0, y0: 6, x1: 20, y1: 2 };
  const p = createPlayer(1, 6 - 1.6 * 0.95 - 0.1); p.vy = 1;
  const world = { colliders: [], zips: [z] };
  stepPlayer(p, idle(), world, { gravityScale: 1 }, DT);
  assert.ok(p.zip, 'grabbed the cable');
  for (let i = 0; i < 60; i++) stepPlayer(p, idle(), world, { gravityScale: 1 }, DT);
  assert.ok(p.x > 4 && p.zip, 'slid downhill to ' + p.x);
  stepPlayer(p, { ...idle(), jump: true, jumpPressed: true }, world, { gravityScale: 1 }, DT);
  assert.ok(!p.zip && p.vy > 5, 'let go with a hop');
});
test('launch barrels load you and blast you out along their aim', () => {
  const br = { x: 0, y: 2, angle: Math.PI / 4, spin: 0, power: 18 };
  const p = createPlayer(0, 1.2);
  const world = { colliders: [], barrels: [br], time: 0 };
  stepPlayer(p, idle(), world, { gravityScale: 1 }, DT);
  assert.equal(p.barrel, br, 'loaded');
  for (let i = 0; i < 20; i++) stepPlayer(p, idle(), world, { gravityScale: 1 }, DT);
  stepPlayer(p, { ...idle(), jump: true, jumpPressed: true }, world, { gravityScale: 1 }, DT);
  assert.ok(!p.barrel && p.vy > 10 && p.extVx > 10, `blasted vy=${p.vy} ext=${p.extVx}`);
  assert.equal(p.jumps, 1, 'double jump still available after a blast');
});
test('fling rings throw you along their arrow, keep your double jump, and do not re-catch instantly', () => {
  const r = { x: 0, y: 2, r: 1.1, vx: 14, vy: 10 };
  const p = createPlayer(0, 2 - 0.8);
  const world = { colliders: [], rings: [r], time: 0 };
  stepPlayer(p, idle(), world, { gravityScale: 1 }, DT);
  assert.ok(p.extVx === 14 && p.vy > 9, `flung ext=${p.extVx} vy=${p.vy}`);
  assert.equal(p.jumps, 1, 'double jump still available after a fling');
  const vy = p.vy;
  stepPlayer(p, idle(), world, { gravityScale: 1 }, DT);
  assert.ok(p.vy < vy, 'not re-caught by the same ring on the next tick');
  // after flying clear (or respawning) the same ring works again: no soft-lock on a retry
  for (let i = 0; i < 60; i++) stepPlayer(p, idle(), world, { gravityScale: 1 }, DT);
  p.x = 0; p.y = 2 - 0.8; p.vx = 0; p.vy = 0; p.extVx = 0;
  stepPlayer(p, idle(), world, { gravityScale: 1 }, DT);
  assert.ok(p.extVx === 14 && p.vy > 9, 'same ring catches you again on a retry');
});
test('boost lanes rush you forward without any input', () => {
  const def = { name: 't', kind: 't', build: (b) => { b.start(-6, 0, 12); b.boost(8, 0, 20, 14); b.plat(28, 0, 40); b.checkpoint(0, 0); b.goal(60, 0); } };
  const sim = new LevelSim(buildLevel(def, 2));
  sim.teleport(9, 0.1);
  for (let i = 0; i < 120; i++) sim.step(idle());
  assert.ok(sim.player.x > 9 + 10, 'carried to ' + sim.player.x);
});
test('pendulums swing, floaters rise under you, sinkers drop, sweepers hurt', () => {
  const def = { name: 't', kind: 't', build: (b) => { b.start(-6, 0, 12); b.floater(8, 0, 3, { rise: 6 }); b.sinker(14, 0, 3, { depth: 4 }); b.pendulum(25, 10, 8); b.sweeper(40, 2, 4, { omega: 90 }); b.plat(36, 0, 8); b.checkpoint(0, 0); b.goal(40, 0); } };
  const L = buildLevel(def, 2);
  const sim = new LevelSim(L);
  const fl = sim.moverState.find((m) => m.def.kind === 'floater'), sk = sim.moverState.find((m) => m.def.kind === 'sinker');
  sim.teleport(9.5, 0.1); for (let i = 0; i < 240; i++) sim.step(idle());
  assert.ok(fl.y > -0.8 + 3, 'floater rose to ' + fl.y);
  sim.teleport(15.5, 0.1); for (let i = 0; i < 240; i++) sim.step(idle());
  assert.ok(sk.y < -0.8 - 2, 'sinker sank to ' + sk.y);
  const pe = sim.moverState.find((m) => m.def.path.type === 'pendulum');
  const xs = new Set(); for (let i = 0; i < 480; i++) { sim.step(idle()); xs.add(Math.round(pe.x)); }
  assert.ok(xs.size > 5, 'pendulum swings');
  sim.invuln = 0; const h0 = sim.health;
  sim.teleport(40, 0.05);
  for (let i = 0; i < 500 && sim.health === h0; i++) sim.step(idle());
  assert.ok(sim.health < h0, 'sweeper beam hurts');
});
test('speed-run worlds: falling off respawns you back on the moving platform you last rode', () => {
  const L = levels.find((l) => l.world === 'aerolis' && l.movers.some((m) => m.path.type !== 'stream' && !m.warp));
  const m = L.movers.find((q) => q.path.type !== 'stream' && !q.warp);
  const sim = new LevelSim(generateLevel(L.index));
  const c = sim.moverById.get(m.id).colliders[0];
  sim.teleport(c.x + c.w / 2, c.y + c.h + 0.2);
  for (let i = 0; i < 30; i++) sim.step(idle());
  assert.equal(sim.player.ground, c, 'standing on the mover');
  sim.player.y = L.killY - 5; sim.step(idle());
  for (let i = 0; i < 5; i++) sim.step(idle());
  assert.equal(sim.player.ground, c, 'respawned riding the same mover');
  assert.ok(Math.abs(sim.player.x - (c.x + c.w / 2)) < c.w / 2, 'on its deck, wherever it moved to');
  // ordinary worlds keep the old rule: only fixed footing counts
  const Lo = levels.find((l) => l.world === 'jupiter' && l.movers.some((q) => q.path.type === 'line'));
  const mo = Lo.movers.find((q) => q.path.type === 'line');
  const so = new LevelSim(generateLevel(Lo.index));
  const co = so.moverById.get(mo.id).colliders[0];
  so.teleport(co.x + co.w / 2, co.y + co.h + 0.2);
  for (let i = 0; i < 30; i++) so.step(idle());
  assert.ok(!so.lastSafe.ground, 'non-speed-run worlds do not record movers');
});
test('blink platforms vanish and return', () => {
  const L = levels.find((l) => l.solids.some((s) => s.blink));
  const sim = new LevelSim(generateLevel(L.index));
  const c = sim.blinks[0];
  let on = 0, off = 0;
  for (let i = 0; i < 1200; i++) { sim.step(idle()); if (c.active) on++; else off++; }
  assert.ok(on > 100 && off > 100, `on ${on} off ${off}`);
});
test('all movers/vehicles produce finite positions over time', () => {
  for (const n of [5, 10, 18, 95, 130, 160, 220, 340, 400, 410]) {
    const sim = new LevelSim(generateLevel(n));
    for (let i = 0; i < 1200; i++) sim.step(idle());
    for (const m of sim.moverState) assert.ok(Number.isFinite(m.x) && Number.isFinite(m.y), `L${n} mover ${m.id}`);
  }
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
