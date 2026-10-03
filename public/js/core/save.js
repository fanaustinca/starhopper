// Progress persistence (localStorage, guarded so private mode still works).
import { TOTAL_LEVELS } from './config.js';

const KEY = 'starhopper.save.v1';

export function defaultSave() {
  return { unlocked: 1, best: {}, totalCells: 0, seenWorlds: [0], settings: { quality: 'high', sound: true, music: true } };
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

// Record a finished level; returns { newBest, unlockedNext }.
export function recordCompletion(save, level, result) {
  const prev = save.best[level];
  const newBest = !prev || result.score > prev.score;
  if (newBest) save.best[level] = { score: result.score, cells: result.cells, total: result.total, time: +result.time.toFixed(2) };
  else if (result.cells > (prev.cells || 0)) prev.cells = result.cells;
  const unlockedNext = level + 1 > save.unlocked && level < TOTAL_LEVELS;
  if (level + 1 > save.unlocked) save.unlocked = Math.min(TOTAL_LEVELS, level + 1);
  save.totalCells = Object.values(save.best).reduce((a, b) => a + (b.cells || 0), 0);
  return { newBest, unlockedNext };
}

export function totalScore(save) {
  return Object.values(save.best).reduce((a, b) => a + (b.score || 0), 0);
}
