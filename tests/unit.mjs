// Fast Node-side tests for the pure game core (physics, generator, sim).
// Verifies every one of the 700 levels is generated and that every static
// jump on every critical path is clearable by the real controller.

import assert from 'node:assert/strict';
import { WORLDS, TOTAL_LEVELS, PHYS, worldOf, locationOf, MAX_HEALTH } from '../public/js/core/config.js';
import { createPlayer, stepPlayer, maxJumpHeight, maxGapFor } from '../public/js/core/physics.js';
import { generateLevel } from '../public/js/core/levelgen.js';
import { LevelSim } from '../public/js/core/sim.js';

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

console.log('\nCampaign structure');
test('14 worlds × 30 levels = 420', () => {
  assert.equal(WORLDS.length, 14);
  assert.equal(TOTAL_LEVELS, 420);
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
test('all 420 levels generate deterministically with sane data', () => {
  for (let n = 1; n <= TOTAL_LEVELS; n++) {
    const L = generateLevel(n);
    levels.push(L);
    assert.equal(L.index, n);
    assert.ok(L.solids.length >= 3, `L${n} too few solids`);
    assert.ok(L.goal.x > 20, `L${n} goal too close`);
    const ids = new Set();
    for (const arr of [L.solids, L.movers, L.hazards, L.pickups]) for (const e of arr) {
      assert.ok(!ids.has(e.id), `L${n} dup id ${e.id}`); ids.add(e.id);
    }
    for (const s of L.solids) for (const k of ['x', 'y', 'w', 'h']) assert.ok(Number.isFinite(s[k]) && (k === 'x' || k === 'y' || s[k] > 0), `L${n} bad solid ${k}`);
    assert.ok(L.floor.y < L.goal.y && L.floor.y < 0, `L${n} floor above course`);
    assert.ok(L.totalCells > 0);
  }
  const a = JSON.stringify(generateLevel(221)), b = JSON.stringify(generateLevel(221));
  assert.equal(a, b);
});
test('signature mechanics appear in every world', () => {
  const need = { sun: 'flare', mercury: 'vent', venus: 'cloud', earth: 'vehicle', mars: 'rover', asteroids: 'asteroid', jupiter: 'wind', saturn: 'ring', uranus: 'geyser', neptune: 'gust', prismara: 'bridge', mechanus: 'gear', biolumina: 'vine', chronos: 'warp' };
  for (const L of levels) {
    let sig = need[L.world];
    if (L.world === 'saturn' && L.sub > 15) sig = 'updraft';
    if (['chase', 'tide', 'precision', 'gauntlet', 'ride', 'ascent', 'descent'].includes(L.archetype)) continue;
    assert.ok(L.sequence.includes(sig), `L${L.index} (${L.world}) missing ${sig}`);
  }
});
test('every static jump on every level is clearable by simulation', () => {
  let n = 0;
  const bad = [];
  for (const L of levels) for (const c of L.checks) {
    if (c.type !== 'jump' && c.type !== 'gust') continue;
    n++;
    if (!canCross(c)) bad.push(`L${L.index} gap=${(c.bx - c.ax).toFixed(2)} dy=${(c.by - c.ay).toFixed(2)} gs=${c.gs} gMul=${c.gMul} wind=${c.wind}`);
  }
  assert.equal(bad.length, 0, `${bad.length}/${n} impossible jumps:\n      ` + bad.slice(0, 10).join('\n      '));
  console.log(`    (${n} jumps verified)`);
});
test('vehicle/stream, lift and launcher geometry is reachable', () => {
  for (const L of levels) for (const c of L.checks) {
    const H = maxJumpHeight(c.gs);
    if (c.type === 'stream') {
      assert.ok(c.aTop > c.deckTop, `L${L.index} deck above takeoff`);
      assert.ok(c.bTop - c.deckTop < H - 0.8, `L${L.index} B too high from deck`);
    } else if (c.type === 'lift') {
      assert.ok(c.top - c.liftTop < H - 1, `L${L.index} lift too low`);
    } else if (c.type === 'launch') {
      const v = c.power;
      const h = v * v / (2 * PHYS.gravity * c.gs);
      assert.ok(h > c.rise + 0.5, `L${L.index} launcher too weak`);
    } else if (c.type === 'mover') {
      assert.ok(c.gapA < (maxGapFor(c.my - c.ay, c.gs) - PHYS.w) * 0.8, `L${L.index} mover too far ${c.gapA}`);
    }
  }
});

test('archetypes vary: no repeats back-to-back, ≥7 kinds per world, chase+finale present', () => {
  for (let w = 0; w < 14; w++) {
    const arch = levels.slice(w * 30, w * 30 + 30).map((l) => l.archetype);
    for (let i = 1; i < 30; i++) assert.notEqual(arch[i], arch[i - 1], `world ${w + 1} repeats ${arch[i]} at ${i + 1}`);
    assert.ok(new Set(arch).size >= 7, `world ${w + 1} only ${new Set(arch).size} archetypes`);
    assert.equal(arch[0], 'intro'); assert.equal(arch[29], 'finale');
    assert.ok(arch.includes('ascent') && arch.includes('chase') && arch.includes('tide'));
  }
});
test('every level has a name and exactly 3 star shards', () => {
  for (const L of levels) {
    assert.ok(L.name && L.name.length > 3, `L${L.index} name`);
    assert.equal(L.totalShards, 3, `L${L.index} shards ${L.totalShards}`);
  }
  const names = new Set(levels.slice(0, 30).map((l) => l.name));
  assert.ok(names.size >= 25, 'names mostly unique within a world: ' + names.size);
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
  const L = levels.find((l) => l.archetype === 'chase');
  const sim = new LevelSim(generateLevel(L.index));
  sim.teleport(6, 0);
  sim.step(idle());
  assert.ok(sim.chaser.active);
  const x0 = sim.chaser.x;
  for (let i = 0; i < 200; i++) sim.step(idle());
  assert.ok(sim.chaser.x > x0 + 5, 'advanced');
  for (let i = 0; i < 800; i++) sim.step(idle());
  assert.ok(sim.health < MAX_HEALTH, 'caught the idle robot');
});
test('tide levels: the floor rises over time', () => {
  const L = levels.find((l) => l.archetype === 'tide');
  const sim = new LevelSim(generateLevel(L.index));
  const y0 = sim.floorY;
  for (let i = 0; i < 1200; i++) sim.step(idle());
  assert.ok(sim.floorY > y0 + 2, `rose ${sim.floorY - y0}`);
});
test('all movers/vehicles produce finite positions over time', () => {
  for (const n of [5, 100, 110, 130, 160, 220, 340, 400, 410]) {
    const sim = new LevelSim(generateLevel(n));
    for (let i = 0; i < 1200; i++) sim.step(idle());
    for (const m of sim.moverState) assert.ok(Number.isFinite(m.x) && Number.isFinite(m.y), `L${n} mover ${m.id}`);
  }
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
