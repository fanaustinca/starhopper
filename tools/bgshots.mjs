// Contact sheet of every world's three backdrop variants: tools/shots/bg-<world>.png
import { chromium } from 'playwright';
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..', 'public');
const srv = http.createServer((q, r) => { const u = decodeURIComponent(q.url.split('?')[0]); const f = path.join(root, u === '/' ? 'index.html' : u); if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'Content-Type': { '.js': 'text/javascript', '.html': 'text/html', '.css': 'text/css' }[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });
await new Promise((r) => srv.listen(0, '127.0.0.1', r));
const b = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--use-gl=angle', '--use-angle=swiftshader', '--ignore-gpu-blocklist'] });
const p = await (await b.newContext({ viewport: { width: 640, height: 360 } })).newPage();
const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => { if (m.type() === 'error' && !/fonts/.test(m.text())) errs.push(m.text()); });
await p.goto(`http://127.0.0.1:${srv.address().port}/?test&fresh&unlock=481`); await p.waitForFunction(() => window.SH && SH.ready, null, { timeout: 120000 });
await p.evaluate(() => SH.game.renderer.setQuality('high'));
const only = process.argv.slice(2);
const worlds = ['sun', 'mercury', 'venus', 'earth', 'mars', 'asteroids', 'jupiter', 'saturn', 'uranus', 'neptune', 'prismara', 'mechanus', 'biolumina', 'chronos', 'aerolis', 'velocitar'];
for (const [wi, w] of worlds.entries()) {
  if (only.length && !only.includes(w)) continue;
  const files = [];
  for (const v of [0, 1, 2]) {
    const n = wi * 30 + 2 + v * 10;
    await p.evaluate(async (n) => { SH.game.warmupInTests = false; await SH.startLevel(n); SH.manual(true); SH.step(60, { right: true }); for (let i = 0; i < 3; i++) SH.render(); }, n);
    const f = path.join(here, 'shots', `bg-${w}-${v}.png`);
    await p.screenshot({ path: f });
    files.push(f);
  }
  console.log(w, (await p.evaluate(() => SH.game.renderer.variantName)));
}
console.log('errors', errs.slice(0, 5));
await b.close(); srv.close();
