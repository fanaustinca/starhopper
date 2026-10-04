// Headless-browser end-to-end tests (Playwright + Chromium/SwiftShader).
// Drives the real game through window.SH: boots, plays movement by input,
// verifies collision, hazards, level progression, saves, cutscenes and UI.
//
//   npm run test:e2e              (serves ./public on a random port)
//   BASE_URL=https://… npm run test:e2e   (test a deployed build)

import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public');
const shots = path.join(path.dirname(fileURLToPath(import.meta.url)), 'screenshots');
fs.mkdirSync(shots, { recursive: true });

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.json': 'application/json', '.svg': 'image/svg+xml' };
function serve() {
  return new Promise((resolve) => {
    const srv = http.createServer((req, res) => {
      const url = decodeURIComponent(req.url.split('?')[0]);
      let file = path.join(root, url === '/' ? 'index.html' : url);
      if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end(); return; }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
      fs.createReadStream(file).pipe(res);
    });
    srv.listen(0, '127.0.0.1', () => resolve(srv));
  });
}

let passed = 0, failed = 0;
const failures = [];
async function test(name, fn) {
  const t0 = Date.now();
  try { await fn(); passed++; console.log(`  ✓ ${name} (${Date.now() - t0}ms)`); }
  catch (e) { failed++; failures.push(name); console.log(`  ✗ ${name}\n      ${e.message.split('\n').join('\n      ')}`); }
}
function assert(cond, msg) { if (!cond) throw new Error(msg || 'assertion failed'); }

const server = process.env.BASE_URL ? null : await serve();
const BASE = process.env.BASE_URL || `http://127.0.0.1:${server.address().port}/`;
const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--use-gl=angle', '--use-angle=swiftshader', '--ignore-gpu-blocklist'] });
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await context.newPage();
const consoleErrors = [];
page.on('console', (m) => { if (m.type() === 'error' && !/fonts\.(googleapis|gstatic)/.test(m.text())) consoleErrors.push(m.text()); });
page.on('pageerror', (e) => consoleErrors.push('pageerror: ' + e.message));

async function boot(query = 'test&fresh') {
  await page.goto(BASE + '?' + query, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForFunction(() => window.SH && window.SH.ready, null, { timeout: 120000 });
}
const S = (fn, arg) => page.evaluate(fn, arg);
// screenshots are evidence, not assertions: never fail a test because a slow runner took too long
async function shot(p, file) {
  try { await p.evaluate(() => window.SH && SH.render()); await p.screenshot({ path: path.join(shots, file), timeout: 90000 }); }
  catch (e) { console.log(`      (screenshot ${file} skipped: ${e.message.split('\n')[0]})`); }
}

console.log(`\nStarhopper e2e against ${BASE}\n`);

await test('boots to the main menu with WebGL and no errors', async () => {
  await boot();
  const st = await S(() => SH.state());
  assert(st.mode === 'menu' && st.screen === 'menu', 'expected menu, got ' + st.mode);
  assert(await page.isVisible('#menu .logo'), 'logo visible');
  const gl = await S(() => !!document.querySelector('#game-canvas').getContext('webgl2'));
  assert(gl, 'webgl2 context');
  await page.waitForTimeout(400);
  await shot(page, '00-menu.png');
  assert(consoleErrors.length === 0, 'console errors: ' + consoleErrors.join(' | '));
});

await test('first Play shows the ship arriving at the Sun, then starts level 1', async () => {
  await page.click('#btn-play');
  await page.waitForFunction(() => SH.state().mode === 'cutscene');
  let st = await S(() => SH.state());
  assert(st.cutscene.to === 0, 'intro lands on world 1');
  await S(() => { SH.manual(true); SH.step(780); });   // into the landing shot
  await S(() => SH.game.cutscene.render());
  await shot(page, '00b-intro-landing.png');
  st = await S(() => SH.step(800));
  await page.waitForFunction(() => SH.state().mode === 'playing');
  await S(() => SH.manual(false));
  st = await S(() => SH.state());
  assert(st.level === 1 && st.world === 'sun');
  assert(st.name && st.name.length > 3, 'level has a name');
  assert((await page.textContent('#hud-name')).trim() === st.name, 'HUD shows the level name');
  assert((await page.textContent('#hud-level')).trim() === 'Level 1');
  assert((await page.textContent('#hud-world')).includes('The Sun'));
  assert(await page.isVisible('#hud'), 'HUD visible');
  await S(() => SH.manual(true));
});

await test('robot settles on the start platform and stays put (no sinking)', async () => {
  const a = await S(() => SH.step(120));
  assert(a.player.onGround, 'on ground after spawn');
  const b = await S(() => SH.step(600));
  assert(Math.abs(a.player.y - b.player.y) < 1e-6, `y drifted ${a.player.y} → ${b.player.y}`);
  assert(Math.abs(a.player.x - b.player.x) < 1e-6, 'x drifted');
});

await test('running right accelerates to run speed', async () => {
  const a = await S(() => SH.state());
  const b = await S(() => SH.step(60, { right: true }));
  assert(b.player.x - a.player.x > 3.5, `moved only ${b.player.x - a.player.x}`);
  assert(Math.abs(b.player.vx - 8.5) < 0.01, 'vx ' + b.player.vx);
  assert(b.player.state === 'run');
  await S(() => SH.step(60));
});

await test('jump rises ~2.45 and lands again; double jump goes higher', async () => {
  await S(() => { SH.teleport(0, 0); SH.step(60); });
  const y0 = (await S(() => SH.state())).player.y;
  let maxY = y0;
  await S(() => SH.step(1, { jump: true, jumpPressed: true }));
  for (let i = 0; i < 90; i++) maxY = Math.max(maxY, (await S(() => SH.step(1, { jump: true }))).player.y);
  assert(Math.abs(maxY - y0 - 2.45) < 0.15, 'single apex ' + (maxY - y0));
  const landed = await S(() => SH.step(60));
  assert(landed.player.onGround && Math.abs(landed.player.y - y0) < 1e-6, 'landed back');
  let maxY2 = y0;
  await S(() => SH.step(1, { jump: true, jumpPressed: true }));
  for (let i = 0; i < 150; i++) {
    const press = i === 30;
    maxY2 = Math.max(maxY2, (await S((p) => SH.step(1, { jump: true, jumpPressed: p }), press)).player.y);
  }
  assert(maxY2 - y0 > 3.6, 'double apex ' + (maxY2 - y0));
});

await test('ledge grab: falling beside a ledge grabs it, ↑ climbs on top', async () => {
  const L = await S(() => SH.level());
  const start = L.solids[0];
  const top = start.y + start.h;
  // fall just right of the start platform, pushing left into it
  await S(([x, y]) => SH.teleport(x, y), [start.x + start.w + 0.45, top - 0.9]);
  let st;
  for (let i = 0; i < 60; i++) { st = await S(() => SH.step(1, { left: true })); if (st.player.hanging) break; }
  assert(st.player.hanging, 'should be hanging; y=' + st.player.y);
  st = await S(() => SH.step(5, { up: true, jump: true, jumpPressed: true }));
  st = await S(() => SH.step(60));
  assert(st.player.onGround && Math.abs(st.player.y - top) < 1e-6, 'climbed onto ledge, y=' + st.player.y);
});

await test('real input clears the opening jumps of level 1 (no teleporting)', async () => {
  const L = await S(() => SH.level());
  await S(() => { SH.teleport(-2, 0); SH.step(60); });
  // play: run, jump at each platform edge, steer toward the next platform
  for (let k = 1; k <= 2; k++) {
    const A = L.solids[k - 1];
    const B = L.solids[k];
    let st = await S(() => SH.state());
    let jumped = false, dbl = false, t = 0;
    for (let i = 0; i < 600; i++) {
      const edge = A.x + A.w;
      const target = B.x + Math.min(B.w / 2, 1.5);
      const inp = { jump: true };
      if (!jumped) { inp.right = true; if (st.player.x + 0.4 >= edge - 0.1) { inp.jumpPressed = true; jumped = true; } }
      else {
        t++;
        if (st.player.x < target - 0.2) inp.right = true; else if (st.player.x > target + 0.2) inp.left = true;
        if (!dbl && st.player.vy < 0 && st.player.x < B.x) { inp.jumpPressed = true; dbl = true; }
      }
      st = await S((i) => SH.step(1, i), inp);
      if (jumped && st.player.onGround && st.player.y > B.y + B.h - 0.01 && st.player.x > B.x) break;
      if (st.health < 3) break;
    }
    assert(st.player.onGround && Math.abs(st.player.y - (B.y + B.h)) < 0.01 && st.player.x > B.x, `landed on platform ${k}: ${JSON.stringify(st.player)}`);
    assert(st.health === 3, 'no damage taken');
  }
  await S(() => SH.render());
  await shot(page, '01-level1-play.png');
});

await test('falling into the lava sea costs 1 health and respawns on safe ground', async () => {
  const before = await S(() => SH.state());
  const L = await S(() => SH.level());
  await S(([x, y]) => SH.teleport(x, y), [L.solids[0].x - 3, L.floor.y + 3]);
  const st = await S(() => SH.step(120));
  assert(st.health === before.health - 1, `health ${before.health} → ${st.health}`);
  assert(st.player.y > L.floor.y + 2, 'respawned above floor');
});

await test('completing level 1 unlocks level 2, saves best score, Next starts level 2', async () => {
  const st = await S(() => SH.completeLevel());
  assert(st.mode === 'complete', 'mode ' + st.mode);
  assert(st.unlocked === 2, 'unlocked ' + st.unlocked);
  assert(st.best[1] && st.best[1].score > 0, 'best score saved');
  assert(await page.isVisible('#complete'), 'complete panel visible');
  await shot(page, '02-complete.png');
  await page.click('#btn-next');
  await page.waitForFunction(() => SH.state().mode === 'playing' && SH.state().level === 2);
  await S(() => SH.manual(true));
});

await test('progress persists across a reload', async () => {
  await boot('test');
  const st = await S(() => SH.state());
  assert(st.unlocked === 2 && st.best[1], 'save survived reload: unlocked=' + st.unlocked);
  assert((await page.textContent('#btn-play')).includes('Level 2'));
});

await test('pause with Escape, resume with Escape', async () => {
  await S(() => SH.startLevel(2));
  await page.keyboard.press('Escape');
  assert((await S(() => SH.state())).mode === 'paused');
  assert(await page.isVisible('#pause'));
  await page.keyboard.press('Escape');
  assert((await S(() => SH.state())).mode === 'playing');
});

await test('level select: only unlocked levels can be launched', async () => {
  await S(() => { SH.game.mode = 'menu'; SH.openSelect(); });
  assert(await page.isVisible('#select'));
  const locked = await page.$('.lvl[data-level="3"]');
  assert(await locked.evaluate((e) => e.classList.contains('locked')), 'level 3 locked');
  await locked.click({ force: true });
  assert((await S(() => SH.state())).mode === 'menu', 'locked level did not start');
  await page.click('.lvl[data-level="2"]');
  await page.waitForFunction(() => SH.state().mode === 'playing' && SH.state().level === 2);
});

await test('finishing a world plays the ship cutscene and lands on the next planet', async () => {
  await boot('test&fresh&unlock=30');
  await S(() => SH.startLevel(30));
  await S(() => SH.manual(true));
  let st = await S(() => SH.completeLevel());
  assert(st.mode === 'complete');
  assert((await page.textContent('#complete-kicker')).includes('WORLD COMPLETE'));
  await page.click('#btn-next');
  await page.waitForFunction(() => SH.state().mode === 'cutscene');
  st = await S(() => SH.step(500));
  assert(st.mode === 'cutscene' && st.cutscene.t > 4, 'cutscene running t=' + (st.cutscene && st.cutscene.t));
  await page.waitForTimeout(150);
  await shot(page, '03-cutscene.png');
  st = await S(() => SH.step(500));
  await S(() => SH.game.cutscene.render());
  await shot(page, '03b-arrival.png');
  st = await S(() => SH.step(2000));
  await page.waitForFunction(() => SH.state().mode === 'playing' && SH.state().level === 31);
  st = await S(() => SH.state());
  assert(st.world === 'mercury', 'arrived on ' + st.world);
  assert((await page.textContent('#hud-world')).includes('Mercury'));
});

await test('cutscene can be skipped with Space', async () => {
  await S(() => SH.startLevel(60));
  await S(() => SH.manual(true));
  await S(() => SH.completeLevel());
  await S(() => SH.next());
  await page.waitForFunction(() => SH.state().mode === 'cutscene');
  await S(() => SH.manual(false));
  await page.keyboard.press('Space');
  await page.waitForFunction(() => SH.state().mode === 'playing' && SH.state().level === 61, null, { timeout: 15000 });
  assert((await S(() => SH.state())).world === 'venus');
});

await test('Earth levels show city location; vehicles move and carry the robot', async () => {
  await S(() => { const n = Array.from({ length: 30 }, (_, i) => 91 + i).find((k) => SH.generate(k).movers.some((m) => m.path.type === 'stream')); return SH.startLevel(n); });
  await S(() => SH.manual(true));
  const st0 = await S(() => SH.state());
  assert(st0.location, 'Earth level has a city: ' + st0.location);
  assert((await page.textContent('#hud-world')).includes(st0.location));
  const res = await S(() => {
    const sim = SH.game.sim;
    const veh = sim.moverState.find((m) => m.def.path.type === 'stream' && m.alpha > 0.9 && m.x > m.def.path.xStart + 2 && m.x + m.def.w < m.def.path.xEnd - 6);
    if (!veh) return { skip: true };
    const deck = veh.colliders.reduce((a, c) => (c.y > a.y ? c : a));
    SH.teleport(deck.x + deck.w / 2, deck.y + deck.h);
    SH.step(10);
    const x0 = sim.player.x, onIt = sim.player.ground && sim.player.ground.mover === veh.id;
    SH.step(60);
    return { onIt, moved: sim.player.x - x0, speed: veh.def.path.speed };
  });
  assert(!res.skip, 'no vehicle found');
  assert(res.onIt, 'standing on the vehicle');
  assert(Math.abs(res.moved - res.speed * 0.5) < 0.2, `carried ${res.moved} (expected ${res.speed * 0.5})`);
  await S(() => SH.render());
  await shot(page, '04-earth-vehicle.png');
});

await test('every world renders its first level without errors', async () => {
  consoleErrors.length = 0;
  await boot('test&fresh&unlock=420');
  for (let w = 0; w < 14; w++) {
    const n = w * 30 + 2;
    await S((n) => SH.startLevel(n), n);
    await S(() => { SH.manual(true); SH.step(30); SH.render(); });
    const st = await S(() => SH.state());
    assert(st.mode === 'playing' && st.level === n && st.errors.length === 0, `world ${w + 1}: ${JSON.stringify(st.errors)}`);
    await page.screenshot({ path: path.join(shots, `10-world-${String(w + 1).padStart(2, '0')}-${st.world}.png`) });
  }
  assert(consoleErrors.length === 0, 'console errors: ' + consoleErrors.slice(0, 3).join(' | '));
});

await test('signature mechanics behave in-browser (bridge, gravity zone, door, vine)', async () => {
  // light bridge
  await S(() => { const n = Array.from({ length: 30 }, (_, i) => 301 + i).find((k) => SH.generate(k).bridges.length); return SH.startLevel(n); });
  let res = await S(() => {
    SH.manual(true);
    const sim = SH.game.sim, b = sim.bridgeState[0];
    if (!b) return { skip: 'no bridge' };
    const before = b.c.active;
    SH.teleport(b.def.x - 0.6, b.def.y + b.def.h);
    SH.step(2);
    return { before, after: b.c.active };
  });
  assert(!res.skip && res.before === false && res.after === true, 'bridge: ' + JSON.stringify(res));
  // carnivorous door blocks when closed
  await S(() => { const n = Array.from({ length: 30 }, (_, i) => 361 + i).find((k) => SH.generate(k).doors.length && SH.generate(k).vines.length); return SH.startLevel(n); });
  res = await S(() => {
    SH.manual(true);
    const sim = SH.game.sim, d = sim.doorState[0];
    if (!d) return { skip: 'no door' };
    let sawClosed = false, sawOpen = false;
    for (let i = 0; i < 1200; i++) { SH.step(1); if (d.c.active) sawClosed = true; else sawOpen = true; }
    return { sawClosed, sawOpen };
  });
  assert(!res.skip && res.sawClosed && res.sawOpen, 'door cycles: ' + JSON.stringify(res));
  // vine: falling onto a vine grabs it
  res = await S(() => {
    const sim = SH.game.sim, v = sim.vines[0];
    if (!v) return { skip: 'no vine' };
    const tx = v.ax + Math.sin(v.angle) * v.len, ty = v.ay - Math.cos(v.angle) * v.len;
    SH.teleport(tx, ty - 0.6);
    SH.step(2);
    const swinging = SH.state().player.state === 'swing';
    // pumping + jump releases with momentum
    SH.step(90, { right: true });
    SH.step(1, { jump: true, jumpPressed: true });
    return { swinging, released: SH.state().player.state !== 'swing' };
  });
  assert(res.skip || (res.swinging && res.released), 'vine grab: ' + JSON.stringify(res));
});

await test('hand-written set pieces run: tower climb, chase wall and rising tide', async () => {
  const r = { chase: [5], tide: [15], ascent: [6] };   // Sun: Solar Wave, Rising Plasma, Corona Spire
  // chase: wall appears and advances
  await S((n) => SH.startLevel(n), r.chase[0]);
  let res = await S(() => { SH.manual(true); SH.teleport(6, 0); SH.step(240); return { active: SH.game.sim.chaser.active, x: SH.game.sim.chaser.x }; });
  assert(res.active, 'chaser active');
  await S(() => SH.render());
  await shot(page, '06-chase.png');
  // tide: floor rises
  await S((n) => SH.startLevel(n), r.tide[0]);
  res = await S(() => { SH.manual(true); const y0 = SH.game.sim.floorY; SH.step(1200); return SH.game.sim.floorY - y0; });
  assert(res > 2, 'tide rose ' + res);
  // ascent: tower ledges exist and climb well above the start
  await S((n) => SH.startLevel(n), r.ascent[0]);
  res = await S(() => { const L = SH.level(); return { towers: L.towers.length, top: Math.max(...L.solids.map((s) => s.y + s.h)) }; });
  assert(res.towers >= 1 && res.top > 15, 'tower ' + JSON.stringify(res));
  await S(() => { SH.manual(true); const L = SH.level(); const t = L.towers[0]; SH.teleport(t.x + 3, t.y0 + 12); SH.step(120); SH.render(); });
  await shot(page, '07-tower.png');
});

await test('wall jump in-browser: slide down a wall, kick off it', async () => {
  const res = await S(() => {
    SH.manual(true);
    const sim = SH.game.sim;
    const wall = sim.colliders.find((c) => c.static && !c.oneWay && c.h > 6);
    if (!wall) return { skip: true };
    SH.teleport(wall.x - 0.45, wall.y + wall.h - 3);
    let slid = false;
    for (let i = 0; i < 40; i++) { const st = SH.step(1, { right: true }); if (st.player.state === 'wall') slid = true; }
    const st = SH.step(2, { right: true, jump: true, jumpPressed: true });
    return { slid, vx: st.player.vx, vy: st.player.vy };
  });
  assert(res.skip || (res.slid && res.vx < -3 && res.vy > 8), 'wall jump: ' + JSON.stringify(res));
});

await test('star shards: collecting one pays the shard bonus on completion', async () => {
  await boot('test&fresh&unlock=5');
  await S(() => SH.startLevel(3));
  const res = await S(() => {
    SH.manual(true);
    const sim = SH.game.sim;
    const k = sim.L.pickups.find((p) => p.type === 'shard');
    SH.teleport(k.x, k.y - 0.8);
    SH.step(2);
    const shards = sim.shards;
    const before = SH.state().wallet;
    SH.completeLevel();
    return { shards, before, after: SH.state().wallet, cells: sim.cells };
  });
  assert(res.shards === 1, 'picked up a shard');
  assert(res.after - res.before === res.cells + 50, `wallet ${res.before} → ${res.after} (cells ${res.cells})`);
  assert((await page.textContent('#c-shards')).startsWith('1/3'));
});

await test('robot shop: buy and equip a skin with cells; skin persists', async () => {
  await S(() => { dev.cells(1000); SH.game.mode = 'menu'; SH.game.show('menu'); });
  await page.click('#btn-shop');
  assert(await page.isVisible('#shop'), 'shop open');
  await page.click('.skin[data-skin="ninja"]');
  assert((await page.textContent('#btn-shop-action')).includes('Buy'), 'buy button');
  await page.click('#btn-shop-action');
  let st = await S(() => SH.state());
  assert(st.skins.includes('ninja') && st.skin === 'ninja', 'bought + equipped');
  assert(st.wallet === st.wallet, '');
  await page.waitForTimeout(300);
  await shot(page, '08-shop.png');
  await boot('test');
  st = await S(() => SH.state());
  assert(st.skin === 'ninja', 'skin persisted');
  assert(await S(() => SH.game.renderer.robot.skin.id === 'ninja'), 'robot wears it');
});

await test('dev console: dev.unlockAll() and dev.level(n) skip ahead', async () => {
  await boot('test&fresh');
  const msg = await S(() => dev.unlockAll());
  assert(/420/.test(msg));
  assert((await S(() => SH.state())).unlocked === 420);
  await S(() => dev.level(250));
  await page.waitForFunction(() => SH.state().mode === 'playing' && SH.state().level === 250);
  await S(() => { SH.manual(true); dev.win(); SH.step(200); });
  assert((await S(() => SH.state())).mode === 'complete', 'dev.win completes');
});

await test('mobile viewport: HUD fits and touch controls appear', async () => {
  await page.close();   // free the desktop page's GPU work on slow CI runners
  const m = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const p2 = await m.newPage();
  await p2.goto(BASE + '?test&fresh', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p2.waitForFunction(() => window.SH && window.SH.ready, null, { timeout: 120000 });
  await p2.evaluate(() => SH.startLevel(2));
  await p2.waitForFunction(() => SH.state().mode === 'playing');
  assert(await p2.isVisible('#touch'), 'touch controls visible');
  const overflow = await p2.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  assert(!overflow, 'no horizontal overflow');
  await shot(p2, '05-mobile.png');
  await m.close();
});

await browser.close();
if (server) server.close();
console.log(`\n${passed} passed, ${failed} failed${failed ? ' — ' + failures.join(', ') : ''}`);
process.exit(failed ? 1 : 0);
