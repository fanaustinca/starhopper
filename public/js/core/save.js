// Progress persistence (localStorage, guarded so private mode still works).
import { TOTAL_LEVELS } from './config.js';

const KEY = 'starhopper.save.v2';

export function defaultSave() {
  return { unlocked: 1, best: {}, totalCells: 0, seenWorlds: [0], wallet: 0, skins: ['classic'], skin: 'classic', shardIds: {}, introSeen: false, settings: { quality: 'high', sound: true, music: true } };
}

export function loadSave(storage = globalThis.localStorage) {
  try {
    const raw = storage && storage.getItem(KEY);
    if (!raw) return defaultSave();
    const s = { ...defaultSave(), ...JSON.parse(raw) };
    s.unlocked = Math.max(1, Math.min(TOTAL_LEVELS, s.unlocked | 0));
    return s;
  } catch {
    return defaultSave();
  }
}

export function writeSave(save, storage = globalThis.localStorage) {
  try { storage && storage.setItem(KEY, JSON.stringify(save)); } catch { /* storage unavailable */ }
}

export const SHARD_BONUS = 50;

// Record a finished level; returns { newBest, unlockedNext, earned, newShards }.
export function recordCompletion(save, level, result) {
  const prev = save.best[level];
  // shards are remembered individually so each pays out only once
  const known = new Set(save.shardIds[level] || []);
  let newShards = 0;
  for (const id of result.shardIds || []) if (!known.has(id)) { known.add(id); newShards++; }
  save.shardIds[level] = [...known];
  const earned = result.cells + newShards * SHARD_BONUS;
  save.wallet = (save.wallet || 0) + earned;
  const newBest = !prev || result.score > prev.score;
  if (newBest) save.best[level] = { score: result.score, cells: Math.max(result.cells, prev ? prev.cells || 0 : 0), total: result.total, time: +result.time.toFixed(2) };
  else if (result.cells > (prev.cells || 0)) prev.cells = result.cells;
  save.best[level].shards = known.size;
  const unlockedNext = level + 1 > save.unlocked && level < TOTAL_LEVELS;
  if (level + 1 > save.unlocked) save.unlocked = Math.min(TOTAL_LEVELS, level + 1);
  save.totalCells = Object.values(save.best).reduce((a, b) => a + (b.cells || 0), 0);
  return { newBest, unlockedNext, earned, newShards };
}

export function totalShards(save) {
  return Object.values(save.shardIds || {}).reduce((a, b) => a + b.length, 0);
}

export function totalScore(save) {
  return Object.values(save.best).reduce((a, b) => a + (b.score || 0), 0);
}
