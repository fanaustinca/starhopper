// Render side-view maps of levels to PNG so designers can see their layouts.
//   node tools/preview.mjs 1 2 3        → tools/previews/L001.png …
//   node tools/preview.mjs world sun    → every level of a world
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadLevel } from './load.mjs';
import { WORLDS, LEVELS_PER_WORLD } from '../public/js/core/config.js';
import { moverPos } from '../public/js/core/sim.js';

const outDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'previews');
fs.mkdirSync(outDir, { recursive: true });
let args = process.argv.slice(2);
if (args[0] === 'world') { const wi = WORLDS.findIndex((w) => w.id === args[1]); args = Array.from({ length: LEVELS_PER_WORLD }, (_, i) => String(wi * LEVELS_PER_WORLD + i + 1)); }
const levels = args.map(Number).filter(Boolean);

function svgFor(L) {
  const S = 14; // px per unit
  const ys = [L.floor.y];
  for (const s of L.solids) ys.push(s.y + s.h);
  for (const k of L.pickups) ys.push(k.y);
  const y0 = Math.min(...ys) - 3, y1 = Math.max(...ys) + 8;
  const x0 = L.bounds.minX + 8, x1 = L.bounds.maxX;
  const W = (x1 - x0) * S, H = (y1 - y0) * S;
  const X = (x) => (x - x0) * S, Y = (y) => (y1 - y) * S;
  const el = [];
  const rect = (x, y, w, h, fill, extra = '') => el.push(`<rect x="${X(x)}" y="${Y(y + h)}" width="${w * S}" height="${h * S}" fill="${fill}" ${extra}/>`);
  el.push(`<defs><marker id="ar" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#7af0ff"/></marker></defs><rect width="${W}" height="${H}" fill="#10131c"/>`);
  for (let gx = Math.ceil(x0 / 10) * 10; gx < x1; gx += 10) el.push(`<line x1="${X(gx)}" y1="0" x2="${X(gx)}" y2="${H}" stroke="#1e2433"/><text x="${X(gx) + 2}" y="12" fill="#5a6680" font-size="11">${gx}</text>`);
  for (let gy = Math.ceil(y0 / 5) * 5; gy < y1; gy += 5) el.push(`<line x1="0" y1="${Y(gy)}" x2="${W}" y2="${Y(gy)}" stroke="#1a2030"/><text x="2" y="${Y(gy) - 2}" fill="#5a6680" font-size="11">${gy}</text>`);
  rect(x0, L.floor.y - 2, x1 - x0, 2, L.floor.lethal ? '#6a1a10' : '#222');
  for (const t of L.towers) rect(t.x, t.y0, t.w, t.y1 - t.y0, '#1c2436');
  for (const z of L.gravZones) rect(z.x, z.y, z.w, z.h, 'rgba(90,160,255,0.15)');
  for (const w of L.winds) rect(w.x, w.y, w.w, w.h, w.gust ? 'rgba(120,255,200,0.12)' : 'rgba(255,255,255,0.08)');
  for (const s of L.solids) {
    const col = s.crumble ? '#a08060' : s.heat ? '#ff5a20' : s.ice ? '#9ae8ff' : s.blink ? '#c0a0ff' : s.onoff ? (s.onoff === 'red' ? '#e04040' : '#4060ff') : s.button ? '#ffe040' : s.bounce ? '#40ff90' : s.oneWay ? '#8090a0' : s.style === 'basin' ? '#333' : s.style === 'boost' ? '#ff3ad8' : s.conveyor ? '#d09030' : s.style === 'wall' ? '#6a7a90' : '#b8c0cc';
    rect(s.x, s.y, s.w, s.h, col);
  }
  for (const h of L.hazards) if (!h.hidden) rect(h.x, h.y, h.w, Math.min(h.h, 18), h.pulse ? 'rgba(255,80,40,0.35)' : h.path ? 'rgba(160,255,60,0.45)' : '#ff3010');
  for (const l of L.launchers) rect(l.x, l.y, l.w, l.h, 'rgba(255,200,80,0.25)');
  for (const b of L.bridges) rect(b.x, b.y, b.w, b.h, 'rgba(255,150,255,0.6)', 'stroke="#f9f" stroke-dasharray="4 3"');
  for (const d of L.doors) rect(d.x, d.y, d.w, d.h, '#2a8a3a');
  for (const m of L.movers) {
    const pts = [];
    const lookup = (id) => { const q = L.movers.find((z) => z.id === id); return moverPos(q, 0, () => null); };
    const period = m.path.type === 'line' ? m.path.T : m.path.type === 'circle' ? 6.283 / Math.abs(m.path.omega) : m.path.type === 'bob' ? m.path.T : m.path.type === 'poly' ? 60 : m.path.type === 'stream' ? m.path.span / m.path.speed : 4;
    for (let i = 0; i < 24; i++) { try { pts.push(moverPos(m, (period * i) / 24, lookup)); } catch { /* mirror */ } }
    const p0 = pts[0];
    if (!p0) continue;
    el.push(`<polyline points="${pts.map((q) => `${X(q.x + m.w / 2)},${Y(q.y + m.h)}`).join(' ')}" fill="none" stroke="#5fd8ff" stroke-dasharray="3 3"/>`);
    rect(p0.x, p0.y, m.w, m.h, 'rgba(95,216,255,0.7)');
  }
  for (const z of L.zips || []) el.push(`<line x1="${X(z.x0)}" y1="${Y(z.y0)}" x2="${X(z.x1)}" y2="${Y(z.y1)}" stroke="#ffffff" stroke-width="2"/><circle cx="${X(z.x0)}" cy="${Y(z.y0)}" r="4" fill="#fff"/>`);
  for (const br of L.barrels || []) {
    const ex = br.x + Math.cos(br.angle) * 3, ey = br.y + Math.sin(br.angle) * 3;
    el.push(`<circle cx="${X(br.x)}" cy="${Y(br.y)}" r="${0.9 * S}" fill="#c08030"/><line x1="${X(br.x)}" y1="${Y(br.y)}" x2="${X(ex)}" y2="${Y(ey)}" stroke="#ffd04a" stroke-width="3"/>` + (br.spin ? `<circle cx="${X(br.x)}" cy="${Y(br.y)}" r="${1.3 * S}" fill="none" stroke="#ffd04a" stroke-dasharray="3 3"/>` : ''));
  }
  for (const r of L.rings || []) {
    const ex = r.x + r.vx * 0.18, ey = r.y + r.vy * 0.18;
    el.push(`<circle cx="${X(r.x)}" cy="${Y(r.y)}" r="${r.r * S}" fill="none" stroke="#7af0ff" stroke-width="3"/><line x1="${X(r.x)}" y1="${Y(r.y)}" x2="${X(ex)}" y2="${Y(ey)}" stroke="#7af0ff" stroke-width="2" marker-end="url(#ar)"/>`);
  }
  for (const sw of L.sweepers || []) el.push(`<circle cx="${X(sw.cx)}" cy="${Y(sw.cy)}" r="${sw.len * S}" fill="rgba(255,60,60,0.12)" stroke="#ff4040" stroke-dasharray="4 3"/>`);
  for (const h of L.hazards) if (h.path && h.path.type === 'pendulum') {
    const P = h.path;
    el.push(`<path d="M ${X(P.px + Math.sin(-P.amp) * P.len)} ${Y(P.py - Math.cos(P.amp) * P.len)} A ${P.len * S} ${P.len * S} 0 0 0 ${X(P.px + Math.sin(P.amp) * P.len)} ${Y(P.py - Math.cos(P.amp) * P.len)}" fill="none" stroke="#ff6040" stroke-width="3"/><circle cx="${X(P.px)}" cy="${Y(P.py)}" r="3" fill="#ff6040"/>`);
  }
  for (const m of L.movers) if (m.rope) el.push(`<circle cx="${X(m.rope.px)}" cy="${Y(m.rope.py)}" r="3" fill="#5fd8ff"/>`);
  for (const v of L.vines) el.push(`<line x1="${X(v.ax)}" y1="${Y(v.ay)}" x2="${X(v.ax)}" y2="${Y(v.ay - v.len)}" stroke="#3aff90" stroke-width="3"/>`);
  for (const m of L.meteors) el.push(`<circle cx="${X(m.x)}" cy="${Y(m.y1)}" r="6" fill="none" stroke="#ff8030" stroke-width="2"/>`);
  for (const e of L.enemies) el.push(`<circle cx="${X(e.x)}" cy="${Y(e.y + 0.5)}" r="7" fill="${e.type === 'spiker' ? '#ff40a0' : '#ff9040'}"/>` + (e.type !== 'flyer' ? `<line x1="${X(e.x)}" y1="${Y(e.y) + 4}" x2="${X(e.x + e.range)}" y2="${Y(e.y) + 4}" stroke="#ff9040"/>` : ''));
  for (const t of L.turrets) el.push(`<rect x="${X(t.x) - 7}" y="${Y(t.y) - 7}" width="14" height="14" fill="#a0a0ff"/><line x1="${X(t.x)}" y1="${Y(t.y)}" x2="${X(t.x + t.dir * 3)}" y2="${Y(t.y)}" stroke="#a0a0ff" stroke-width="3"/>`);
  for (const k of L.pickups) el.push(k.type === 'shard' ? `<text x="${X(k.x) - 7}" y="${Y(k.y) + 6}" fill="#ffd84a" font-size="18">★</text>` : k.type === 'heart' ? `<text x="${X(k.x) - 6}" y="${Y(k.y) + 5}" fill="#ff4a6a" font-size="14">♥</text>` : `<circle cx="${X(k.x)}" cy="${Y(k.y)}" r="3" fill="#3affc0"/>`);
  el.push(`<rect x="${X(L.spawn.x) - 5}" y="${Y(L.spawn.y + 1.6)}" width="11" height="${1.6 * S}" fill="#fff"/>`);
  el.push(`<circle cx="${X(L.goal.x)}" cy="${Y(L.goal.y + 2)}" r="16" fill="none" stroke="#ffd84a" stroke-width="4"/>`);
  for (const c of (L.checkpoints && L.checkpoints.length ? L.checkpoints : L.checkpoint ? [L.checkpoint] : [])) el.push(`<line x1="${X(c.x)}" y1="${Y(c.y)}" x2="${X(c.x)}" y2="${Y(c.y + 3)}" stroke="#ff8a3a" stroke-width="3"/>`);
  el.push(`<text x="10" y="${H - 10}" fill="#fff" font-size="16">L${L.index} · ${L.name} (${L.archetype})${L.chaser ? ' · CHASE' : ''}${L.tide ? ' · TIDE' : ''}</text>`);
  return { svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${el.join('')}</svg>`, W, H };
}

const browser = await chromium.launch();
const page = await browser.newPage();
for (const n of levels) {
  const L = await loadLevel(n);
  const { svg, W, H } = svgFor(L);
  await page.setViewportSize({ width: Math.ceil(Math.min(W, 6000)), height: Math.ceil(H) });
  await page.setContent(`<html><body style="margin:0">${svg}</body></html>`);
  const file = path.join(outDir, `L${String(n).padStart(3, '0')}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.log(file);
}
await browser.close();
