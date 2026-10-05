// Bug sweep: run every built level in the real simulation under scripted
// chaotic input and report crashes, NaNs and impossible states.
import { WORLDS, LEVELS_PER_WORLD, TOTAL_LEVELS, PHYS } from '../public/js/core/config.js';
import { LevelSim } from '../public/js/core/sim.js';
import { loadLevel } from './load.mjs';

// optional: `node tools/sweep.mjs <worldId>` sweeps just that world
const only = process.argv[2] ? WORLDS.findIndex((w) => w.id === process.argv[2]) : -1;
const bad = [];
let ran = 0;
for (let n = 1; n <= TOTAL_LEVELS; n++) {
  if (only >= 0 && Math.min(Math.floor((n - 1) / LEVELS_PER_WORLD), WORLDS.length - 1) !== only) continue;
  let L;
  try { L = await loadLevel(n); } catch (e) { if (!/not written/.test(e.message)) bad.push(`L${n} build: ${e.message}`); continue; }
  ran++;
  try {
    const sim = new LevelSim(L);
    let seed = n * 7919;
    const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
    let inp = {}, hold = 0;
    for (let i = 0; i < 40 * 120; i++) {
      if (--hold <= 0) {
        const r = rnd();
        inp = { right: r < 0.75, left: r > 0.88, jump: rnd() < 0.5, down: rnd() < 0.05, up: rnd() < 0.05, jumpPressed: rnd() < 0.35 };
        hold = 10 + Math.floor(rnd() * 50);
      } else inp.jumpPressed = false;
      sim.step(inp);
      const p = sim.player;
      if (!Number.isFinite(p.x) || !Number.isFinite(p.y) || !Number.isFinite(p.vx) || !Number.isFinite(p.vy) || !Number.isFinite(p.extVx)) { bad.push(`L${n} NaN player at tick ${i}`); break; }
      if (p.y < L.killY - 40) { bad.push(`L${n} fell through kill plane (y=${p.y.toFixed(1)}) at tick ${i}`); break; }
      if (Math.abs(p.extVx) > 40 || p.vy > 60) { bad.push(`L${n} runaway velocity ext=${p.extVx.toFixed(1)} vy=${p.vy.toFixed(1)}`); break; }
      if (sim.health < 0 || sim.health > 3) { bad.push(`L${n} health out of range ${sim.health}`); break; }
      for (const m of sim.moverState) if (!Number.isFinite(m.x) || !Number.isFinite(m.y)) { bad.push(`L${n} NaN mover ${m.id}`); i = 1e9; break; }
      if (sim.complete) break;
    }
    // respawn from every checkpoint must land on solid footing
    for (const cp of (L.checkpoints && L.checkpoints.length ? L.checkpoints : [L.checkpoint, L.spawn])) {
      if (!cp) continue;
      const s2 = new LevelSim(L);
      s2.teleport(cp.x, cp.y);
      let hurtAt = -1;
      for (let i = 0; i < 90; i++) s2.step({});
      if (!s2.player.onGround && !s2.player.hang) bad.push(`L${n} checkpoint/spawn at (${cp.x},${cp.y}) is not on solid ground`);
      // ...and standing still there for 4s must not get you hurt (no respawning into a hazard)
      if (!L.chaser && !L.tide) for (let i = 0; i < 480 && hurtAt < 0; i++) { s2.step({}); if (s2.health < 3) hurtAt = i; }
      if (hurtAt >= 0) bad.push(`L${n} checkpoint at (${cp.x},${cp.y}) gets hurt standing still after ${((hurtAt + 90) / 120).toFixed(1)}s`);
    }
  } catch (e) { bad.push(`L${n} crash: ${e.stack.split('\n').slice(0, 2).join(' | ')}`); }
}
console.log(`${ran} levels swept`);
console.log(bad.length ? bad.join('\n') : 'no problems found');
process.exit(bad.length ? 1 : 0);
