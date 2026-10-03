// Validate hand-written levels with the solver bot.
//   node tools/validate.mjs            → all written levels
//   node tools/validate.mjs sun        → one world
//   node tools/validate.mjs 5 6 7      → specific levels
import { WORLDS, LEVELS_PER_WORLD } from '../public/js/core/config.js';
import { loadLevel, worldDefs } from './load.mjs';
import { solveLevel } from './solver.mjs';

const args = process.argv.slice(2);
let list = [];
if (!args.length) { for (let wi = 0; wi < WORLDS.length; wi++) (await worldDefs(wi)).forEach((_, i) => list.push(wi * LEVELS_PER_WORLD + i + 1)); }
else if (isNaN(+args[0])) { const wi = WORLDS.findIndex((w) => w.id === args[0]); list = (await worldDefs(wi)).map((_, i) => wi * LEVELS_PER_WORLD + i + 1); }
else list = args.map(Number);
let bad = 0;
for (const n of list) {
  const t0 = Date.now();
  let L, r;
  try { L = await loadLevel(n); r = solveLevel(L, { full: true }); }
  catch (e) { bad++; console.log(`✗ L${n}: ${e.message}`); continue; }
  const ms = Date.now() - t0;
  const warn = [];
  if (L.totalShards !== 3) warn.push(`${L.totalShards} shards (want 3)`);
  if (r.missingShards && r.missingShards.length) warn.push(`shards maybe unreachable at ${r.missingShards.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' ; ')}`);
  if (!L.checkpoint) warn.push('no checkpoint');
  if (r.ok) console.log(`✓ L${n} ${L.name.padEnd(26)} [${L.archetype}] surfaces ${r.reached}/${r.nodes}, ${r.sims} sims, ${ms}ms${warn.length ? '  ⚠ ' + warn.join(' | ') : ''}`);
  else { bad++; console.log(`✗ L${n} ${L.name}: ${r.problems.join('; ')} (reached ${r.reached}/${r.nodes} surfaces, ${r.sims} sims)${warn.length ? '  ⚠ ' + warn.join(' | ') : ''}`); if (process.env.V) console.log('   reached:', r.reachedList.join(' '), '\n   NOT reached:', r.unreached.join(' ')); }
}
console.log(`\n${list.length - bad}/${list.length} levels completable`);
process.exit(bad ? 1 : 0);
