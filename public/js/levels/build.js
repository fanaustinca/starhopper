// Build a level's runtime data from its hand-written definition.
import { WORLDS, WORLD_FLAVOR, worldIndexOf, subLevelOf } from '../core/config.js';
import { LevelBuilder } from './dsl.js';

export function buildLevel(def, n) {
  const b = new LevelBuilder(n, worldIndexOf(n), subLevelOf(n));
  def.build(b);
  return b.finish(def, WORLD_FLAVOR[WORLDS[worldIndexOf(n)].id].chaser);
}
