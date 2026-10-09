// Screenshots of every screen at desktop + phone sizes for UI review: tools/shots/ui-*.png
import { chromium } from 'playwright';
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..', 'public');
const srv = http.createServer((q, r) => { const u = decodeURIComponent(q.url.split('?')[0]); const f = path.join(root, u === '/' ? 'index.html' : u); if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'Content-Type': { '.js': 'text/javascript', '.html': 'text/html', '.css': 'text/css' }[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });
await new Promise((r) => srv.listen(0, '127.0.0.1', r));
const b = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--use-gl=angle', '--use-angle=swiftshader', '--ignore-gpu-blocklist'] });
const errs = [];
for (const [tag, vw, vh, touch] of [['desk', 1280, 720, false], ['phone', 390, 844, true], ['land', 844, 390, true]]) {
  const ctx = await b.newContext({ viewport: { width: vw, height: vh }, hasTouch: touch, isMobile: touch });
  const p = await ctx.newPage();
  p.on('pageerror', (e) => errs.push(tag + ': ' + e.message)); p.on('console', (m) => { if (m.type() === 'error' && !/fonts/.test(m.text())) errs.push(tag + ': ' + m.text()); });
  await p.goto(`http://127.0.0.1:${srv.address().port}/?test&fresh&unlock=95`); await p.waitForFunction(() => window.SH && SH.ready, null, { timeout: 120000 });
  const snap = async (name, fn) => { await p.evaluate(fn); await p.waitForTimeout(500); await p.evaluate(() => SH.render()); await p.screenshot({ path: path.join(here, 'shots', `ui-${tag}-${name}.png`) }); };
  await snap('menu', () => { SH.game.show('menu'); SH.game.refreshMenu(); });
  await snap('map', () => SH.openSelect());
  await snap('panel', () => SH.selectPlanet(3));
  await snap('settings', () => { SH.game.backStack.push('menu'); SH.game.show('settings'); SH.game.refreshSettings(); });
  await snap('help', () => { SH.game.show('help'); });
  await snap('shop', () => { dev.cells(900); SH.game.openShop(); });
  await snap('hud', async () => { await SH.startLevel(95); SH.manual(true); SH.step(30, { right: true }); });
  await snap('pause', () => SH.pause());
  await snap('complete', () => { SH.resume(); SH.completeLevel(); });
  await ctx.close();
}
console.log('errors', errs);
await b.close(); srv.close();
