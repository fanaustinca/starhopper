// Load levels for the tools without importing every world (so one world's
// work-in-progress file can't break validation of another).
import { WORLDS, LEVELS_PER_WORLD } from '../public/js/core/config.js';
import { buildLevel } from '../public/js/levels/build.js';
const worldCache = new Map();
export async function worldDefs(wi) {
  if (!worldCache.has(wi)) worldCache.set(wi, (await import(`../public/js/levels/${WORLDS[wi].id}.js`)).default);
  return worldCache.get(wi);
}
export async function loadLevel(n) {
  const wi = Math.floor((n - 1) / LEVELS_PER_WORLD);
  const defs = await worldDefs(wi);
  const def = defs[(n - 1) % LEVELS_PER_WORLD];
  if (!def) throw new Error(`level ${n} not written`);
  return buildLevel(def, n);
}
