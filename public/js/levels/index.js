// The campaign: 14 worlds × 30 hand-written levels. No procedural generation.
import { LEVELS_PER_WORLD, TOTAL_LEVELS, WORLDS, WORLD_FLAVOR, worldIndexOf, subLevelOf } from '../core/config.js';
import { buildLevel } from './build.js';
import sun from './sun.js';
import mercury from './mercury.js';
import venus from './venus.js';
import earth from './earth.js';
import mars from './mars.js';
import asteroids from './asteroids.js';
import jupiter from './jupiter.js';
import saturn from './saturn.js';
import uranus from './uranus.js';
import neptune from './neptune.js';
import prismara from './prismara.js';
import mechanus from './mechanus.js';
import biolumina from './biolumina.js';
import chronos from './chronos.js';
import blackhole from './blackhole.js';

export const CAMPAIGN = [sun, mercury, venus, earth, mars, asteroids, jupiter, saturn, uranus, neptune, prismara, mechanus, biolumina, chronos, blackhole];

export function levelDef(n) {
  const w = worldIndexOf(n), s = subLevelOf(n);
  const def = CAMPAIGN[w][s - 1];
  if (!def) throw new Error(`level ${n} (${WORLDS[w].id} #${s}) is not written yet`);
  return def;
}

const cache = new Map();
export function getLevel(n) {
  if (!Number.isInteger(n) || n < 1 || n > TOTAL_LEVELS) throw new Error('level out of range: ' + n);
  if (!cache.has(n)) {
    cache.set(n, JSON.stringify(buildLevel(levelDef(n), n)));
  }
  return JSON.parse(cache.get(n));
}

export { LEVELS_PER_WORLD };
