// Game controller: state machine, main loop, UI wiring and the test API.
import { WORLDS, LEVELS_PER_WORLD, TOTAL_LEVELS, PHYS, MAX_HEALTH, worldIndexOf, subLevelOf, locationOf } from './core/config.js';
import { getLevel as generateLevel } from './levels/index.js';
import { LevelSim } from './core/sim.js';
import { loadSave, writeSave, recordCompletion, defaultSave, totalScore, totalShards, SHARD_BONUS } from './core/save.js';
import { SKINS, skinById } from './core/skins.js';
import { Input } from './core/input.js';
import { Audio } from './core/audio.js';
import { Renderer } from './render/renderer.js';
import { Cutscene } from './render/cutscene.js';

const params = new URLSearchParams(location.search);
const TEST = params.has('test');
const $ = (id) => document.getElementById(id);
const hex = (c) => '#' + c.toString(16).padStart(6, '0');
const fmtTime = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
const SCREENS = ['menu', 'select', 'shop', 'settings', 'help', 'pause', 'complete'];

class Game {
  constructor() {
    if (TEST && params.has('fresh')) { try { localStorage.clear(); } catch { /* ignore */ } }
    this.save = loadSave();
    if (TEST && params.has('unlock')) this.save.unlocked = Math.min(TOTAL_LEVELS, +params.get('unlock') || TOTAL_LEVELS);
    this.input = new Input();
    this.audio = new Audio();
    this.audio.enabled = !TEST && this.save.settings.sound;
    this.audio.musicOn = this.save.settings.music;
    this.renderer = new Renderer($('stage'), { test: TEST, quality: TEST ? 'low' : this.save.settings.quality, skin: this.save.skin });
    this.mode = 'menu';
    this.prevMode = 'menu';
    this.sim = null;
    this.levelNum = 1;
    this.manual = false;          // test harness drives the simulation tick-by-tick
    this.acc = 0;
    this.last = performance.now();
    this.cutscene = null;
    this.backStack = [];
    this.hudCache = {};
    this.errors = [];
    this.selectWorld = worldIndexOf(this.save.unlocked);
    this.bindUI();
    this.input.bindTouch(document);
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) document.body.classList.add('touch');
    this.loadPreview(this.save.unlocked);
    this.show('menu');
    this.refreshMenu();
    requestAnimationFrame((t) => this.frame(t));
    document.addEventListener('visibilitychange', () => { if (document.hidden && this.mode === 'playing' && !TEST) this.pause(); });
  }

  // ------------------------------------------------------------- screens
  show(name) {
    for (const s of SCREENS) $(s).classList.toggle('hidden', s !== name);
    const inGame = this.mode === 'playing' || this.mode === 'paused' || this.mode === 'complete';
    $('hud').classList.toggle('hidden', !inGame);
    $('touch').classList.toggle('hidden', !(this.mode === 'playing' && document.body.classList.contains('touch')));
    this.screen = name;
  }

  fade(fn) {
    const f = $('fade');
    if (TEST) { fn(); return Promise.resolve(); }
    return new Promise((res) => {
      f.classList.add('on');
      setTimeout(() => { fn(); requestAnimationFrame(() => { f.classList.remove('on'); res(); }); }, 340);
    });
  }

  bindUI() {
    const click = (id, fn) => $(id).addEventListener('click', () => { this.audio.play('ui'); fn(); });
    click('btn-play', () => this.play());
    click('btn-shop', () => this.openShop());
    click('btn-shop-action', () => this.shopAction());
    click('btn-select', () => this.openSelect());
    click('btn-settings', () => { this.backStack.push(this.screen); this.show('settings'); this.refreshSettings(); });
    click('btn-help', () => { this.backStack.push(this.screen); this.show('help'); });
    click('btn-pause', () => this.pause());
    click('btn-resume', () => this.resume());
    click('btn-restart', () => this.startLevel(this.levelNum));
    click('btn-pause-select', () => { this.mode = 'menu'; this.openSelect(true); });
    click('btn-quit', () => this.toMenu());
    click('btn-next', () => this.next());
    click('btn-replay', () => this.startLevel(this.levelNum));
    click('btn-complete-select', () => { this.mode = 'menu'; this.openSelect(true); });
    click('btn-reset', () => {
      if (!confirm('Reset all progress?')) return;
      const settings = this.save.settings;
      this.save = defaultSave(); this.save.settings = settings;
      writeSave(this.save);
      this.refreshMenu();
      this.toast('PROGRESS RESET');
    });
    document.querySelectorAll('[data-back]').forEach((b) => b.addEventListener('click', () => this.back()));
    const seg = (id, fn) => $(id).querySelectorAll('button').forEach((b) => b.addEventListener('click', () => { fn(b.dataset.v); this.refreshSettings(); writeSave(this.save); }));
    seg('set-quality', (v) => { this.save.settings.quality = v; this.renderer.setQuality(v); });
    seg('set-sound', (v) => { this.save.settings.sound = v === 'on'; this.audio.enabled = v === 'on'; if (v !== 'on') this.audio.stopMusic(); });
    seg('set-music', (v) => { this.save.settings.music = v === 'on'; this.audio.musicOn = v === 'on'; if (v === 'on') this.audio.music(worldIndexOf(this.levelNum)); else this.audio.stopMusic(); });

    this.input.onKey = (e) => {
      if (e.repeat) return;
      if ((e.code === 'Escape' || e.code === 'KeyP') && this.mode === 'playing') { this.pause(); return; }
      if ((e.code === 'Escape' || e.code === 'KeyP') && this.mode === 'paused') { this.resume(); return; }
      if (e.code === 'Escape' && ['select', 'settings', 'help'].includes(this.screen)) { this.back(); return; }
      if (this.mode === 'complete' && (e.code === 'Enter' || e.code === 'Space') && this.completeReadyAt < performance.now()) { this.next(); return; }
      if (this.mode === 'cutscene' && (e.code === 'Space' || e.code === 'Enter' || e.code === 'Escape')) this.cutscene.skip();
      if (this.mode === 'menu' && this.screen === 'menu' && e.code === 'Enter') this.play();
      if (e.code === 'Escape' && this.screen === 'shop') { this.back(); return; }
    };
    $('stage').addEventListener('pointerdown', () => { if (this.mode === 'cutscene') this.cutscene.skip(); this.audio.ensure(); });
  }

  play() {
    // first launch: watch the ship arrive at the Sun before level 1
    if (!this.save.introSeen && this.save.unlocked === 1) return this.playCutscene(null, 0);
    return this.startLevel(this.save.unlocked);
  }

  back() {
    if (this.screen === 'shop') { this.renderer.showcase = false; this.renderer.robot.setSkin(this.save.skin); }
    const prev = this.backStack.pop() || 'menu';
    if (prev === 'pause' || prev === 'complete') this.show(prev);
    else { this.mode = 'menu'; this.show(prev); if (prev === 'menu') this.refreshMenu(); }
  }

  refreshMenu() {
    const s = this.save;
    const done = Object.keys(s.best).length;
    $('btn-play').textContent = s.unlocked > 1 ? `Continue · Level ${s.unlocked}` : 'Play';
    $('menu-progress').innerHTML = `<b>${done}</b> / ${TOTAL_LEVELS} levels cleared · <b>${totalShards(s)}</b> / ${TOTAL_LEVELS * 3} star shards · <b>${totalScore(s).toLocaleString()}</b> total score`;
    $('menu-wallet').textContent = (s.wallet || 0).toLocaleString();
  }

  refreshSettings() {
    const mark = (id, v) => $(id).querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.dataset.v === v));
    mark('set-quality', this.save.settings.quality);
    mark('set-sound', this.save.settings.sound ? 'on' : 'off');
    mark('set-music', this.save.settings.music ? 'on' : 'off');
  }

  openSelect(fromGame = false) {
    if (fromGame) this.loadPreview(this.levelNum);
    this.backStack = ['menu'];
    this.mode = 'menu';
    this.selectWorld = worldIndexOf(fromGame ? this.levelNum : this.save.unlocked);
    this.show('select');
    this.renderSelect();
  }

  renderSelect() {
    const s = this.save;
    const tabs = $('world-tabs');
    tabs.innerHTML = '';
    WORLDS.forEach((w, i) => {
      const locked = i * LEVELS_PER_WORLD + 1 > s.unlocked;
      const b = document.createElement('button');
      b.className = 'world-tab' + (i === this.selectWorld ? ' active' : '') + (locked ? ' locked' : '');
      b.innerHTML = `<span class="dot" style="background:${hex(w.planet.color)}"></span>${i + 1}. ${w.short}`;
      b.dataset.world = i;
      b.addEventListener('click', () => { this.selectWorld = i; this.audio.play('ui'); this.renderSelect(); });
      tabs.appendChild(b);
    });
    const w = WORLDS[this.selectWorld];
    const first = this.selectWorld * LEVELS_PER_WORLD + 1;
    const cleared = Array.from({ length: LEVELS_PER_WORLD }, (_, k) => s.best[first + k]).filter(Boolean).length;
    $('world-banner').innerHTML = `<div class="planet" style="background:radial-gradient(circle at 35% 35%, ${hex(w.planet.color)}, ${hex(w.sky[0])});--glow:${hex(w.planet.color)}66"></div>
      <div><h3>World ${this.selectWorld + 1} · ${w.name}${w.alien ? ' <small style="color:var(--muted);font-size:12px">(alien)</small>' : ''}</h3><p>${w.blurb} Levels ${first}–${first + LEVELS_PER_WORLD - 1} · ${cleared}/${LEVELS_PER_WORLD} cleared</p></div>`;
    $('select-meta').textContent = `Unlocked: ${s.unlocked} / ${TOTAL_LEVELS}`;
    const grid = $('level-grid');
    grid.innerHTML = '';
    for (let k = 0; k < LEVELS_PER_WORLD; k++) {
      const n = first + k;
      const best = s.best[n];
      const locked = n > s.unlocked;
      const b = document.createElement('button');
      b.className = 'lvl' + (best ? ' done' : '') + (locked ? ' locked' : '') + (n === s.unlocked ? ' current' : '');
      b.dataset.level = n;
      const pct = best && best.total ? Math.round((best.cells / best.total) * 100) : 0;
      const sh = (s.shardIds[n] || []).length;
      const stars = best ? `<span class="stars">${[0, 1, 2].map((i) => `<i class="shard${i < sh ? ' on' : ''}"></i>`).join('')}</span>` : '';
      b.innerHTML = `<span class="n">${n}</span>${stars}<span class="s">${best ? best.score.toLocaleString() : locked ? '' : 'new'}</span>${best ? `<span class="bar"><i style="width:${pct}%"></i></span>` : ''}`;
      const L = locked ? null : generateLevel(n);
      b.title = locked ? 'Locked' : `Level ${n} · ${L.name}${L.location ? ' · ' + L.location : ''}`;
      if (!locked) b.addEventListener('click', () => { this.audio.play('ui'); this.startLevel(n); });
      grid.appendChild(b);
    }
  }

  // ------------------------------------------------------------- shop
  openShop() {
    this.backStack = ['menu'];
    this.mode = 'menu';
    this.shopSel = this.save.skin;
    this.renderer.showcase = true;
    this.show('shop');
    this.renderShop();
  }

  renderShop() {
    const s = this.save;
    $('shop-wallet').textContent = (s.wallet || 0).toLocaleString();
    const grid = $('skin-grid');
    grid.innerHTML = '';
    for (const sk of SKINS) {
      const owned = s.skins.includes(sk.id);
      const b = document.createElement('button');
      b.className = 'skin' + (sk.id === this.shopSel ? ' sel' : '') + (!owned && sk.price > (s.wallet || 0) ? ' locked' : '');
      b.dataset.skin = sk.id;
      const bg = sk.galaxy ? 'radial-gradient(circle at 30% 30%, #ff4ad0, #241650 60%, #0e2a6a)' : `radial-gradient(circle at 35% 30%, #fff 0%, ${hex(sk.body)} 35%, ${hex(sk.body)} 70%, ${hex(sk.accent)} 100%)`;
      const status = s.skin === sk.id ? '<span class="pr eq">Equipped</span>' : owned ? '<span class="pr owned">Owned</span>' : `<span class="pr">◆ ${sk.price.toLocaleString()}</span>`;
      b.innerHTML = `<div class="swatch" style="background:${bg};--eye:${hex(sk.eye)}"><i></i></div><div class="nm">${sk.name}</div>${status}`;
      b.addEventListener('click', () => { this.audio.play('ui'); this.shopSel = sk.id; this.renderer.robot.setSkin(sk.id); this.renderShop(); });
      grid.appendChild(b);
    }
    const sel = skinById(this.shopSel);
    const owned = s.skins.includes(sel.id);
    $('shop-name').textContent = sel.name;
    $('shop-price').textContent = owned ? (s.skin === sel.id ? 'Currently equipped' : 'Owned') : `${sel.price.toLocaleString()} cells`;
    const btn = $('btn-shop-action');
    btn.textContent = s.skin === sel.id ? 'Equipped' : owned ? 'Equip' : (s.wallet || 0) >= sel.price ? `Buy · ${sel.price.toLocaleString()}` : `Need ${(sel.price - (s.wallet || 0)).toLocaleString()} more`;
    btn.disabled = s.skin === sel.id || (!owned && (s.wallet || 0) < sel.price);
    btn.style.opacity = btn.disabled ? 0.55 : 1;
  }

  shopAction() {
    const s = this.save, sel = skinById(this.shopSel);
    if (!s.skins.includes(sel.id)) {
      if ((s.wallet || 0) < sel.price) return;
      s.wallet -= sel.price;
      s.skins.push(sel.id);
      this.audio.play('complete');
      this.toast(`UNLOCKED ${sel.name.toUpperCase()}`);
    }
    s.skin = sel.id;
    writeSave(s);
    this.renderShop();
  }

  toast(text, ms = 1400) {
    const t = $('toast');
    t.textContent = text;
    t.classList.add('show');
    clearTimeout(this.toastT);
    this.toastT = setTimeout(() => t.classList.remove('show'), ms);
  }

  // ------------------------------------------------------------- flow
  loadPreview(n) {
    const L = generateLevel(n);
    this.sim = new LevelSim(L);
    this.levelNum = n;
    this.renderer.loadLevel(L);
    for (let i = 0; i < 60; i++) this.sim.step(idleInput());
  }

  startLevel(n, opts = {}) {
    n = Math.max(1, Math.min(TOTAL_LEVELS, n));
    this.audio.ensure();
    return this.fade(() => {
      const L = generateLevel(n);
      this.levelNum = n;
      this.sim = new LevelSim(L);
      this.renderer.loadLevel(L);
      this.mode = 'playing';
      this.backStack = [];
      this.hudCache = {};
      this.show(null);
      this.updateHUD(true);
      this.acc = 0;
      const W = WORLDS[L.worldIndex];
      this.toast(`${L.name.toUpperCase()}${L.location ? ' · ' + L.location.toUpperCase() : ''}`, 2000);
      if (L.chaser) setTimeout(() => { if (this.sim && this.sim.L === L) this.toast(`RUN! THE ${L.chaser.name.toUpperCase()} IS COMING`, 1800); }, 2100);
      if (L.tide) setTimeout(() => { if (this.sim && this.sim.L === L) this.toast('THE FLOOR IS RISING — CLIMB!', 1800); }, 2100);
      if (this.musicWorld !== L.worldIndex || !this.audio.pad) { this.audio.music(L.worldIndex); this.musicWorld = L.worldIndex; }
    });
  }

  pause() {
    if (this.mode !== 'playing') return;
    this.mode = 'paused';
    this.show('pause');
  }
  resume() {
    if (this.mode !== 'paused') return;
    this.mode = 'playing';
    this.show(null);
    this.last = performance.now();
  }
  toMenu() {
    this.mode = 'menu';
    this.loadPreview(this.levelNum);
    this.show('menu');
    this.refreshMenu();
  }

  finishLevel() {
    const sim = this.sim;
    const shardIds = sim.L.pickups.filter((k) => k.type === 'shard' && sim.collected.has(k.id)).map((k) => k.id);
    const result = { score: Math.max(0, sim.score()), cells: sim.cells, total: sim.L.totalCells, time: sim.t, shardIds };
    const { newBest, earned, newShards } = recordCompletion(this.save, this.levelNum, result);
    if (!this.save.seenWorlds.includes(worldIndexOf(Math.min(TOTAL_LEVELS, this.levelNum + 1)))) this.save.seenWorlds.push(worldIndexOf(Math.min(TOTAL_LEVELS, this.levelNum + 1)));
    writeSave(this.save);
    this.mode = 'complete';
    this.completeReadyAt = performance.now() + 400;
    const n = this.levelNum;
    const worldDone = n % LEVELS_PER_WORLD === 0;
    $('complete-kicker').textContent = n === TOTAL_LEVELS ? 'JOURNEY COMPLETE' : worldDone ? 'WORLD COMPLETE' : 'LEVEL COMPLETE';
    $('complete-title').textContent = `Level ${n} · ${WORLDS[worldIndexOf(n)].short}`;
    $('c-score').textContent = result.score.toLocaleString();
    $('c-cells').textContent = `${result.cells}/${result.total}`;
    $('c-time').textContent = fmtTime(result.time);
    $('c-best').textContent = this.save.best[n].score.toLocaleString();
    $('c-newbest').classList.toggle('hidden', !newBest);
    $('c-shards').textContent = `${(this.save.shardIds[n] || []).length}/3`;
    $('c-earned').textContent = `+${earned}` + (newShards ? ` (${newShards}★)` : '');
    $('btn-next').textContent = n === TOTAL_LEVELS ? 'Finale' : worldDone ? `Fly to ${WORLDS[worldIndexOf(n + 1)].short} 🚀` : 'Next Level';
    this.show('complete');
    this.updateHUD(true);
  }

  next() {
    if (this.mode !== 'complete') return;
    const n = this.levelNum;
    if (n % LEVELS_PER_WORLD === 0) this.playCutscene(worldIndexOf(n), n < TOTAL_LEVELS ? worldIndexOf(n) + 1 : null);
    else this.startLevel(n + 1);
  }

  playCutscene(from, to) {
    return this.fade(() => {
      this.mode = 'cutscene';
      this.show(null);
      this.cutscene = new Cutscene(this.renderer.renderer, from, to, { skin: this.save.skin });
      this.cutsceneFrom = from;
      this.cutsceneTo = to;
      $('caption').classList.remove('hidden');
      this.audio.stopMusic();
      this.audio.play('ship');
    });
  }

  endCutscene() {
    const to = this.cutsceneTo;
    this.cutscene.dispose();
    this.cutscene = null;
    $('caption').classList.add('hidden');
    $('fade').style.opacity = '';
    if (this.cutsceneFrom == null) { this.save.introSeen = true; writeSave(this.save); }
    if (to == null) { this.toMenu(); this.toast('YOU CONQUERED ALL 14 WORLDS!', 3000); return; }
    this.startLevel(to * LEVELS_PER_WORLD + 1);
  }

  // ------------------------------------------------------------- loop
  frame(now) {
    requestAnimationFrame((t) => this.frame(t));
    let dt = (now - this.last) / 1000;
    this.last = now;
    if (!(dt > 0)) dt = 0;
    dt = Math.min(dt, 0.1);
    try {
      this.tick(dt);
    } catch (err) {
      this.errors.push(String(err && err.stack || err));
      console.error(err);
    }
    if (!this.booted) { this.booted = true; $('loading').classList.add('gone'); }
  }

  stepSim(input) {
    const sim = this.sim;
    sim.step(input);
    if (sim.events.length) {
      for (const e of sim.events) this.onEvent(e);
      this.renderer.handleEvents(sim.events, sim);
      sim.events.length = 0;
    }
  }

  onEvent(e) {
    this.audio.play(e.type);
    if (e.type === 'checkpoint') this.toast('CHECKPOINT');
    if (e.type === 'fail') this.toast('TRY AGAIN — HEALTH RESTORED');
    if (e.type === 'heart') this.toast('+1 HEALTH');
    if (e.type === 'shard') this.toast(`STAR SHARD ${this.sim.shards}/3 · +${SHARD_BONUS} CELLS`);
  }

  tick(dt) {
    if (this.mode === 'cutscene') {
      const done = this.cutscene.update(this.manual ? 0 : dt);
      this.cutscene.render();
      const cap = this.cutscene.caption();
      $('cap-big').textContent = cap ? cap.big : '';
      $('cap-small').textContent = cap ? cap.small : '';
      $('fade').style.opacity = String(this.cutscene.fade());
      if (done) this.endCutscene();
      return;
    }
    if (!this.sim) return;
    if (this.mode === 'playing' && !this.manual) {
      this.acc += dt;
      let n = 0;
      while (this.acc >= PHYS.dt && n < 24) {
        this.stepSim(this.input.sample());
        this.acc -= PHYS.dt;
        n++;
      }
      if (this.sim.complete && this.sim.completeT > 1.3) this.finishLevel();
    } else if (this.mode === 'menu' && !this.manual) {
      // attract mode: world keeps moving behind the menus
      this.acc += dt;
      while (this.acc >= PHYS.dt) { this.sim.step(idleInput()); this.sim.events.length = 0; this.acc -= PHYS.dt; }
    } else if (this.mode === 'complete' && !this.manual) {
      this.acc += dt;
      while (this.acc >= PHYS.dt) { this.stepSim(idleInput()); this.acc -= PHYS.dt; }
    }
    this.renderer.update(this.sim, this.mode === 'paused' ? 0 : dt);
    this.renderer.render();
    if (this.mode === 'playing' || this.mode === 'complete') this.updateHUD();
  }

  updateHUD(force = false) {
    const sim = this.sim, L = sim.L, W = WORLDS[L.worldIndex];
    const set = (id, v) => { if (force || this.hudCache[id] !== v) { this.hudCache[id] = v; $(id).textContent = v; } };
    set('hud-level', `Level ${L.index}`);
    set('hud-world', W.name + (L.location ? ` · ${L.location}` : ''));
    set('hud-sub', `World ${L.worldIndex + 1} · Stage ${L.sub} of ${LEVELS_PER_WORLD}`);
    set('hud-name', L.name);
    if (force || this.hudCache.sh !== sim.shards) {
      const gained = this.hudCache.sh !== undefined && sim.shards > this.hudCache.sh;
      this.hudCache.sh = sim.shards;
      $('hud-shards').innerHTML = [0, 1, 2].map((i) => `<i class="shard${i < sim.shards ? ' on' : ''}${gained && i === sim.shards - 1 ? ' pop' : ''}"></i>`).join('');
    }
    if (force) { $('hud-dot').style.background = `radial-gradient(circle at 35% 35%, ${hex(W.planet.color)}, ${hex(W.sky[0])})`; $('hud-dot').style.color = hex(W.planet.color); }
    set('hud-cells', `${sim.cells}/${L.totalCells}`);
    set('hud-time', fmtTime(sim.t));
    set('hud-score', Math.max(0, sim.cells * 100 + sim.health * 250 - sim.deaths * 300).toLocaleString());
    const best = this.save.best[L.index];
    set('hud-best', best ? best.score.toLocaleString() : '—');
    if (force || this.hudCache.hp !== sim.health) {
      const gained = this.hudCache.hp !== undefined && sim.health > this.hudCache.hp;
      this.hudCache.hp = sim.health;
      $('hud-hearts').innerHTML = Array.from({ length: MAX_HEALTH }, (_, i) => `<span class="heart${i < sim.health ? '' : ' empty'}${gained && i === sim.health - 1 ? ' pop' : ''}"></span>`).join('');
    }
  }

  // ------------------------------------------------------------- test API
  testState() {
    const sim = this.sim;
    const p = sim ? sim.player : null;
    return {
      mode: this.mode, screen: this.screen, level: this.levelNum,
      world: sim ? sim.L.world : null, worldIndex: sim ? sim.L.worldIndex : null,
      location: sim ? sim.L.location : null,
      player: p && { x: p.x, y: p.y, vx: p.vx, vy: p.vy, state: p.state, onGround: p.onGround, hanging: !!p.hang, jumps: p.jumps },
      health: sim && sim.health, cells: sim && sim.cells, totalCells: sim && sim.L.totalCells,
      complete: sim && sim.complete, t: sim && sim.t, deaths: sim && sim.deaths,
      shards: sim && sim.shards, name: sim && sim.L.name, archetype: sim && sim.L.archetype,
      wallet: this.save.wallet, skin: this.save.skin, skins: this.save.skins.slice(),
      unlocked: this.save.unlocked, best: this.save.best,
      cutscene: this.cutscene ? { t: this.cutscene.t, duration: this.cutscene.duration, to: this.cutsceneTo } : null,
      errors: this.errors.slice(),
    };
  }
}

function idleInput() { return { left: false, right: false, up: false, down: false, jump: false, jumpPressed: false }; }

let game;
try {
  game = new Game();
} catch (err) {
  document.getElementById('loading').innerHTML = `<div style="max-width:420px;text-align:center;padding:20px">Starhopper couldn't start: ${String(err.message || err)}<br><br>Your browser needs WebGL enabled.</div>`;
  throw err;
}

// Headless test hooks. Kept tiny and stable so tests read like gameplay.
window.SH = {
  ready: true,
  game,
  state: () => game.testState(),
  level: () => game.sim && game.sim.L,
  startLevel: async (n) => { await game.startLevel(n); return game.testState(); },
  manual: (on = true) => { game.manual = on; game.input.override = on ? idleInput() : null; return on; },
  setInput: (inp) => { game.input.override = { ...idleInput(), ...inp }; },
  step: (n = 1, inp) => {
    if (inp) game.input.override = { ...idleInput(), ...inp };
    for (let i = 0; i < n; i++) {
      if (game.mode === 'playing' || game.mode === 'complete') {
        game.stepSim(game.input.sample());
        if (game.mode === 'playing' && game.sim.complete && game.sim.completeT > 1.3) game.finishLevel();
      } else if (game.mode === 'cutscene') {
        game.cutscene.update(PHYS.dt);
        if (game.cutscene.done) { game.endCutscene(); break; }
      }
    }
    return game.testState();
  },
  render: () => { game.renderer.snapCamera(game.sim); game.renderer.update(game.sim, 1 / 60); game.renderer.render(); return true; },
  teleport: (x, y) => { game.sim.teleport(x, y); game.renderer.snapCamera(game.sim); return game.testState(); },
  goal: () => ({ ...game.sim.L.goal }),
  completeLevel: () => {
    const g = game.sim.L.goal;
    game.sim.teleport(g.x, g.y);
    for (let i = 0; i < 200 && game.mode === 'playing'; i++) window.SH.step(1);
    return game.testState();
  },
  next: () => { game.next(); return game.testState(); },
  skipCutscene: () => { if (game.cutscene) game.cutscene.skip(); return game.testState(); },
  pause: () => { game.pause(); return game.testState(); },
  resume: () => { game.resume(); return game.testState(); },
  openSelect: () => { game.openSelect(); return game.testState(); },
  resetSave: () => { game.save = defaultSave(); writeSave(game.save); return true; },
  generate: (n) => generateLevel(n),
};

// ---------------------------------------------------------------- dev console
// Open DevTools (F12) → Console and type dev.help()
window.dev = {
  help() {
    console.log([
      'Starhopper dev commands:',
      '  dev.unlockAll()        unlock every level in the level select',
      '  dev.skipAll()          unlock everything and jump to the final level',
      '  dev.level(n)           start level n right now',
      '  dev.world(w)           start the first level of world w (1-14)',
      '  dev.win()              finish the current level instantly',
      '  dev.cells(n = 5000)    add cells to your wallet for the shop',
      '  dev.allSkins()         own every skin',
      '  dev.intro()            replay the opening cutscene',
      '  dev.fly(w)             play the ship cutscene from world w to w+1',
      '  dev.reset()            wipe the save',
    ].join('\n'));
    return 'ok';
  },
  unlockAll() {
    game.save.unlocked = TOTAL_LEVELS;
    game.save.introSeen = true;
    writeSave(game.save); game.refreshMenu();
    if (game.screen === 'select') game.renderSelect();
    return `all ${TOTAL_LEVELS} levels unlocked`;
  },
  skipAll() { window.dev.unlockAll(); game.startLevel(TOTAL_LEVELS); return `skipped to level ${TOTAL_LEVELS}`; },
  level(n) { game.save.unlocked = Math.max(game.save.unlocked, n); writeSave(game.save); game.startLevel(n); return `starting level ${n}`; },
  world(w) { return window.dev.level((w - 1) * LEVELS_PER_WORLD + 1); },
  win() {
    if (game.mode !== 'playing') return 'not in a level';
    const g = game.sim.L.goal; game.sim.teleport(g.x, g.y); return 'level complete';
  },
  cells(n = 5000) { game.save.wallet = (game.save.wallet || 0) + n; writeSave(game.save); game.refreshMenu(); if (game.screen === 'shop') game.renderShop(); return `wallet: ${game.save.wallet}`; },
  allSkins() { game.save.skins = SKINS.map((k) => k.id); writeSave(game.save); if (game.screen === 'shop') game.renderShop(); return 'all skins owned'; },
  intro() { game.playCutscene(null, 0); return 'rolling intro'; },
  fly(w = 1) { game.playCutscene(w - 1, w < WORLDS.length ? w : null); return 'rolling cutscene'; },
  reset() { localStorage.removeItem('starhopper.save.v2'); location.reload(); },
};
if (!TEST) console.log('%c★ Starhopper%c  dev commands: type dev.help()', 'color:#5fd8ff;font-weight:bold;font-size:14px', 'color:#9aa8c4');
