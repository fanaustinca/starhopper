// Browser render sweep: boots the real game in headless Chromium and, for every
// level, starts it, plays a few seconds, renders from the start, middle and goal,
// then flies every between-world cutscene, opens every planet on the star map and
// previews every shop item. Reports any page/console error.
//   node tools/rendersweep.mjs [from] [to]
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TOTAL_LEVELS, WORLDS, lastLevelOfWorld } from '../public/js/core/config.js';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.json': 'application/json', '.svg': 'image/svg+xml' };
const srv = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  const file = path.join(root, url === '/' ? 'index.html' : url);
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => srv.listen(0, '127.0.0.1', r));
const from = +(process.argv[2] || 1), to = +(process.argv[3] || TOTAL_LEVELS);

const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--use-gl=angle', '--use-angle=swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 960, height: 540 } })).newPage();
let errs = [];
page.on('console', (m) => { if (m.type() === 'error' && !/fonts\.(googleapis|gstatic)/.test(m.text())) errs.push(m.text()); });
page.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
await page.goto(`http://127.0.0.1:${srv.address().port}/?test&fresh&unlock=${TOTAL_LEVELS}`, { waitUntil: 'domcontentloaded', timeout: 120000 });
await page.waitForFunction(() => window.SH && SH.ready, null, { timeout: 120000 });

const bad = [];
const t0 = Date.now();
for (let n = from; n <= to; n++) {
  errs = [];
  try {
    await page.evaluate(async (n) => {
      await SH.startLevel(n); SH.manual(true);
      SH.step(240, { right: true }); SH.render();
      SH.step(30, { right: true, jump: true, jumpPressed: true }); SH.render();
      const L = SH.level(), g = L.goal;
      SH.teleport((L.spawn.x + g.x) / 2, g.y + 30); SH.step(60); SH.render();
      SH.teleport(g.x - 3, g.y + 0.5); SH.step(20); SH.render();
      const s = SH.state();
      if (!s.player || !Number.isFinite(s.player.x) || !Number.isFinite(s.player.y)) throw new Error('non-finite player');
    }, n);
  } catch (e) { errs.push('threw: ' + e.message.split('\n')[0]); }
  if (errs.length) bad.push(`L${n}: ${[...new Set(errs)].slice(0, 3).join(' | ')}`);
  if (n % 30 === 0) console.log(`  …L${n} (${((Date.now() - t0) / 1000).toFixed(0)}s, ${bad.length} bad)`);
}
// every between-world cutscene (depart + arrive), skipping nothing
if (from === 1 && to === TOTAL_LEVELS) for (let wi = 0; wi < WORLDS.length - 1; wi++) {
  errs = [];
  try {
    await page.evaluate(async (n) => {
      await SH.startLevel(n); SH.manual(true); SH.completeLevel(); SH.next();
      for (let k = 0; k < 40 && SH.state().mode === 'cutscene'; k++) { SH.step(90); SH.render(); }
      if (SH.state().mode === 'cutscene') throw new Error('cutscene never ended');
    }, lastLevelOfWorld(wi));
  } catch (e) { errs.push('threw: ' + e.message.split('\n')[0]); }
  if (errs.length) bad.push(`cutscene ${WORLDS[wi].id}→${WORLDS[wi + 1].id}: ${[...new Set(errs)].slice(0, 3).join(' | ')}`);
}
// the star map: open every planet's panel and render it; then every shop item's preview
if ((from === 1 && to === TOTAL_LEVELS) || process.env.SWEEP_UI) {
  errs = [];
  try {
    await page.evaluate(() => {
      SH.game.renderer.setQuality('high');
      SH.openSelect();
      for (let wi = 0; wi < 17; wi++) { SH.selectPlanet(wi); for (let i = 0; i < 10; i++) SH.game.map.update(0.05); SH.game.map.render(); if (!SH.game.panelOpen || SH.game.selectWorld !== wi) throw new Error('panel for world ' + wi); }
      for (const sys of ['sol', 'vesper', 'void']) { SH.game.closePanel(false); SH.game.map.focusSystem(sys); for (let i = 0; i < 10; i++) SH.game.map.update(0.05); SH.game.map.render(); }
      SH.game.map.drag(300, 80); SH.game.map.zoom(3); SH.game.map.zoom(0.1); SH.game.map.update(0.1); SH.game.map.render();
    });
  } catch (e) { errs.push('threw: ' + e.message.split('\n')[0]); }
  if (errs.length) bad.push(`star map: ${[...new Set(errs)].slice(0, 3).join(' | ')}`);
  errs = [];
  try {
    const n = await page.evaluate(() => {
      const g = SH.game; let k = 0;
      g.openShop();
      for (const cat of ['skin', 'hat', 'trail', 'jump', 'pet', 'dance', 'ship']) {
        g.shopCat = cat;
        g.renderShop();
        for (const el of [...document.querySelectorAll('#skin-grid .skin')]) {
          g.shopSel = el.dataset.skin || el.dataset.item; g.renderShop();
          for (let i = 0; i < 20; i++) { SH.step(1); g.renderer.update(g.sim, 1 / 30); }
          g.renderer.render(); k++;
        }
      }
      g.back();
      return k;
    });
    console.log(`  shop: ${n} items previewed`);
  } catch (e) { errs.push('threw: ' + e.message.split('\n')[0]); }
  if (errs.length) bad.push(`shop: ${[...new Set(errs)].slice(0, 3).join(' | ')}`);
}
await browser.close(); srv.close();
console.log(`${to - from + 1} levels rendered in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
console.log(bad.length ? bad.join('\n') : 'no render errors');
process.exit(bad.length ? 1 : 0);
