// Game controller: state machine, main loop, UI wiring and the test API.
import { WORLDS, LEVELS_PER_WORLD, TOTAL_LEVELS, PHYS, MAX_HEALTH, worldIndexOf, subLevelOf, locationOf, levelsInWorld, lastLevelOfWorld, BONUS_WORLD, systemOf } from './core/config.js';
import { getLevel as generateLevel } from './levels/index.js';
import { LevelSim } from './core/sim.js';
import { loadSave, writeSave, recordCompletion, defaultSave, totalScore, totalShards, SHARD_BONUS, BOLTS } from './core/save.js';
import { SKINS, skinById } from './core/skins.js';
import { CATEGORIES, ITEMS, itemById, buyOrEquip, normalizeCosmetics } from './core/shop.js';
import { Input } from './core/input.js';
import { Audio } from './core/audio.js';
import { Renderer } from './render/renderer.js';
import { Cutscene } from './render/cutscene.js';
import { StarMap } from './render/starmap.js';

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
    this.renderer.setCosmetics(this.save.equip);
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
      this.renderer.robot.setSkin(this.save.skin); this.renderer.setCosmetics(this.save.equip);
      writeSave(this.save);
      this.refreshMenu();
      this.toast('PROGRESS RESET');
    });
    document.querySelectorAll('[data-back]').forEach((b) => b.addEventListener('click', () => this.back()));
    const seg = (id, fn) => $(id).querySelectorAll('button').forEach((b) => b.addEventListener('click', () => { fn(b.dataset.v); this.refreshSettings(); writeSave(this.save); }));
    seg('set-quality', (v) => { this.save.settings.quality = v; this.renderer.setQuality(v); if (this.map) { this.map.useBloom = this.renderer.useBloom; this.map.resize(); } });
    seg('set-sound', (v) => { this.save.settings.sound = v === 'on'; this.audio.enabled = v === 'on'; if (v !== 'on') this.audio.stopMusic(); });
    seg('set-music', (v) => { this.save.settings.music = v === 'on'; this.audio.musicOn = v === 'on'; if (v === 'on') this.audio.music(worldIndexOf(this.levelNum)); else this.audio.stopMusic(); });

    this.input.onKey = (e) => {
      if (e.repeat) return;
      if ((e.code === 'Escape' || e.code === 'KeyP') && this.mode === 'playing') { this.pause(); return; }
      if ((e.code === 'Escape' || e.code === 'KeyP') && this.mode === 'paused') { this.resume(); return; }
      if (e.code === 'Escape' && this.screen === 'select' && this.panelOpen) { this.closePanel(); return; }
      if (e.code === 'Escape' && ['select', 'settings', 'help'].includes(this.screen)) { this.back(); return; }
      if (this.screen === 'select' && this.map && (e.code === 'ArrowLeft' || e.code === 'ArrowRight')) { this.cyclePlanet(e.code === 'ArrowRight' ? 1 : -1); return; }
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
    if (this.screen === 'shop') { this.renderer.showcase = false; this.renderer.showcaseDemo = null; this.renderer.robot.setSkin(this.save.skin); this.renderer.setCosmetics(this.save.equip); }
    const prev = this.backStack.pop() || 'menu';
    if (prev === 'pause' || prev === 'complete') this.show(prev);
    else { this.mode = 'menu'; this.show(prev); if (prev === 'menu') this.refreshMenu(); }
  }

  refreshMenu() {
    const s = this.save;
    const done = Object.keys(s.best).length;
    $('btn-play').textContent = s.unlocked > 1 ? `Continue · Level ${s.unlocked}` : 'Play';
    $('menu-progress').innerHTML = `<b>${done}</b> / ${TOTAL_LEVELS} levels cleared · <b>${totalShards(s)}</b> / ${TOTAL_LEVELS * 3} star shards · <b>${totalScore(s).toLocaleString()}</b> total score`;
    $('menu-wallet').innerHTML = `<span class="bolt-icon small"></span>${(s.wallet || 0).toLocaleString()}`;
  }

  refreshSettings() {
    const mark = (id, v) => $(id).querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.dataset.v === v));
    mark('set-quality', this.save.settings.quality);
    mark('set-sound', this.save.settings.sound ? 'on' : 'off');
    mark('set-music', this.save.settings.music ? 'on' : 'off');
  }

  // ------------------------------------------------------------- star map (level select)
  ensureMap() {
    if (this.map) return this.map;
    this.map = new StarMap(this.renderer.renderer, {
      labelRoot: $('map-labels'),
      bloom: this.renderer.useBloom,
      onPick: (wi) => { this.audio.play('ui'); this.selectPlanet(wi); },
      onHover: (wi) => { $('select').style.cursor = wi == null ? '' : 'pointer'; },
    });
    this.map.compile();
    window.addEventListener('resize', () => { if (this.map) { this.map.resize(); this.updateMapInset(); } });
    this.bindMapControls();
    return this.map;
  }

  bindMapControls() {
    const el = $('select'), map = this.map;
    const pts = new Map();
    let moved = 0, pinch = 0;
    const isUI = (e) => e.target.closest && e.target.closest('button, .planet-panel, .map-top');
    const ndc = (e) => { const r = el.getBoundingClientRect(); return [((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1]; };
    el.addEventListener('pointerdown', (e) => {
      if (isUI(e)) return;
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      moved = 0;
      if (pts.size === 2) { const [a, b] = [...pts.values()]; pinch = Math.hypot(a.x - b.x, a.y - b.y); }
      el.setPointerCapture?.(e.pointerId);
      el.classList.add('dragging');
    });
    el.addEventListener('pointermove', (e) => {
      const p = pts.get(e.pointerId);
      if (!p) { if (!isUI(e) && e.pointerType === 'mouse') map.hoverAt(...ndc(e)); return; }
      const dx = e.clientX - p.x, dy = e.clientY - p.y;
      p.x = e.clientX; p.y = e.clientY;
      moved += Math.abs(dx) + Math.abs(dy);
      if (pts.size === 2) {
        const [a, b] = [...pts.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (pinch) map.zoom(pinch / d);
        pinch = d;
      } else map.drag(dx, dy);
      if (moved > 8) $('map-hint').classList.add('gone');
    });
    const up = (e) => {
      if (!pts.has(e.pointerId)) return;
      pts.delete(e.pointerId);
      if (!pts.size) el.classList.remove('dragging');
      if (moved < 8 && !pts.size) {
        const wi = map.pick(...ndc(e));
        if (wi != null) { this.audio.play('ui'); this.selectPlanet(wi); } else if (this.panelOpen) this.closePanel();
      }
    };
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', (e) => { pts.delete(e.pointerId); el.classList.remove('dragging'); });
    el.addEventListener('wheel', (e) => { if (e.target.closest('.planet-panel')) return; e.preventDefault(); map.zoom(Math.exp(e.deltaY * 0.0012)); $('map-hint').classList.add('gone'); }, { passive: false });
    $('map-systems').querySelectorAll('button').forEach((b) => b.addEventListener('click', () => {
      this.audio.play('ui');
      if (b.dataset.sys === 'void') { this.selectPlanet(BONUS_WORLD); return; }
      this.closePanel(false);
      map.focusSystem(b.dataset.sys);
      this.markSystem(b.dataset.sys);
    }));
    $('panel-close').addEventListener('click', () => { this.audio.play('ui'); this.closePanel(); });
    $('map-continue').addEventListener('click', () => { this.audio.play('ui'); this.startLevel(this.save.unlocked); });
    $('panel-play').addEventListener('click', () => { const n = +$('panel-play').dataset.level; if (n) { this.audio.play('ui'); this.startLevel(n); } });
  }

  cyclePlanet(dir) {
    const order = WORLDS.map((_, i) => i);
    const i = order.indexOf(this.panelOpen ? this.selectWorld : worldIndexOf(this.save.unlocked) - dir);
    this.audio.play('ui');
    this.selectPlanet(order[(i + dir + order.length) % order.length]);
  }

  updateMapInset() {
    if (!this.map) return;
    if (!this.panelOpen) { this.map.setInset(0, 0); return; }
    const narrow = window.innerWidth <= 760;
    const panel = $('planet-panel');
    if (narrow) {
      // centre the planet in the gap between the top bar and the bottom sheet
      const H = window.innerHeight, top = document.querySelector('.map-top').getBoundingClientRect().bottom;
      const sheet = Math.min(H * 0.62, panel.offsetHeight || H * 0.5) + 8;
      this.map.setInset(0, 2 * (H / 2 - (top + H - sheet) / 2));
    } else this.map.setInset((panel.offsetWidth || 400) + 28, 0);
  }

  markSystem(id) { $('map-systems').querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.dataset.sys === id)); }

  openSelect(fromGame = false) {
    if (fromGame) this.loadPreview(this.levelNum);
    this.backStack = ['menu'];
    this.mode = 'menu';
    const map = this.ensureMap();
    this.show('select');
    map.resize();
    this.refreshMapLabels();
    const wi = worldIndexOf(fromGame ? this.levelNum : this.save.unlocked);
    this.selectWorld = wi;
    $('select-meta').textContent = `${Object.keys(this.save.best).length} / ${TOTAL_LEVELS} cleared · ${totalShards(this.save)} ★`;
    $('map-continue').textContent = this.save.unlocked > 1 ? `Continue · Level ${this.save.unlocked}` : 'Start · Level 1';
    $('map-hint').classList.remove('gone');
    if (fromGame) this.selectPlanet(wi, true);
    else { this.closePanel(false); map.focusSystem(systemOf(wi).id, !this.mapOpened); this.markSystem(systemOf(wi).id); }
    this.mapOpened = true;
  }

  worldProgress(wi) {
    const s = this.save, first = wi * LEVELS_PER_WORLD + 1, n = levelsInWorld(wi);
    let cleared = 0, shards = 0, score = 0;
    for (let k = 0; k < n; k++) { const b = s.best[first + k]; if (b) { cleared++; score += b.score || 0; } shards += (s.shardIds[first + k] || []).length; }
    return { first, n, cleared, shards, score, locked: first > s.unlocked, current: s.unlocked >= first && s.unlocked < first + n };
  }

  refreshMapLabels() {
    this.map.setLabels((b) => {
      const w = b.world, P = this.worldProgress(b.wi);
      const pct = Math.round((P.cleared / P.n) * 100);
      const cls = [P.locked ? 'locked' : '', P.cleared === P.n ? 'done' : '', P.current ? 'current' : '', w.bonus ? 'bonus' : ''].join(' ');
      const html = w.bonus ? `<span class="ring" style="--p:${pct}"></span><span class="nm">THE END</span>${P.locked ? '<span class="pg"></span>' : ''}`
        : `<span class="ring" style="--p:${pct}"></span><span class="nm">${w.short}</span><span class="pg">${P.cleared}/${P.n}</span>`;
      return { html, cls };
    });
  }

  selectPlanet(wi, instant = false) {
    this.selectWorld = wi;
    this.map.focusWorld(wi, instant);
    this.markSystem(systemOf(wi).id);
    this.renderSelect();
    const panel = $('planet-panel');
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    this.panelOpen = true;
    this.updateMapInset();
    $('map-hint').classList.add('gone');
  }

  closePanel(refocus = true) {
    const panel = $('planet-panel');
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    this.panelOpen = false;
    this.updateMapInset();
    if (refocus && this.map) this.map.focusSystem(this.map.currentSystem || 'sol');
  }

  // the planet panel: name, story, progress and its 30 levels
  renderSelect() {
    const s = this.save, wi = this.selectWorld, w = WORLDS[wi];
    const P = this.worldProgress(wi), sys = systemOf(wi);
    const panel = $('planet-panel');
    panel.classList.toggle('bonus', !!w.bonus);
    $('world-banner').innerHTML = w.bonus
      ? `<div class="pp-kicker">Bonus · Between the stars</div><h3>The Black Hole</h3><p>${w.blurb}</p>`
      : `<div class="pp-kicker">${sys.name} · World ${wi + 1}${w.speedrun ? ' · Speed-run' : ''}</div><h3>${w.name}</h3><p>${w.blurb}</p>`;
    $('panel-stats').innerHTML = `<div><span>Cleared</span><b>${P.cleared}/${P.n}</b></div><div><span>Shards</span><b>${P.shards}/${P.n * 3}</b></div><div><span>Score</span><b>${P.score >= 10000 ? Math.round(P.score / 1000) + 'k' : P.score.toLocaleString()}</b></div>`;
    // play: the next unbeaten unlocked level in this world, else the first
    let next = P.first;
    for (let k = 0; k < P.n; k++) { const n = P.first + k; if (n <= s.unlocked && !s.best[n]) { next = n; break; } }
    const play = $('panel-play');
    play.disabled = P.locked;
    play.dataset.level = P.locked ? '' : next;
    play.textContent = P.locked ? `🔒 Reach level ${P.first} to unlock` : w.bonus ? (s.best[next] ? 'Enter the black hole again' : '▶ Enter the black hole') : P.cleared === P.n ? `Replay · Level ${next}` : `▶ Play · Level ${next}`;
    const grid = $('level-grid');
    grid.innerHTML = '';
    for (let k = 0; k < P.n; k++) {
      const n = P.first + k;
      const best = s.best[n];
      const locked = n > s.unlocked;
      const b = document.createElement('button');
      b.className = 'lvl' + (best ? ' done' : '') + (locked ? ' locked' : '') + (n === s.unlocked ? ' current' : '') + (w.bonus ? ' lvl-end' : '');
      b.dataset.level = n;
      const pct = best && best.total ? Math.round((best.cells / best.total) * 100) : 0;
      const sh = (s.shardIds[n] || []).length;
      const stars = best ? `<span class="stars">${[0, 1, 2].map((i) => `<i class="shard${i < sh ? ' on' : ''}"></i>`).join('')}</span>` : '';
      if (w.bonus) b.innerHTML = `<span class="n">THE END</span><span class="s">${locked ? 'Clear all 16 worlds to enter' : best ? 'Best ' + best.score.toLocaleString() : `Level ${TOTAL_LEVELS} · ~860 units · 7 checkpoints`}</span>${stars}`;
      else b.innerHTML = `<span class="n">${n}</span>${stars}<span class="s">${best ? best.score.toLocaleString() : locked ? '' : 'new'}</span>${best ? `<span class="bar"><i style="width:${pct}%"></i></span>` : ''}`;
      const L = locked ? null : generateLevel(n);
      b.title = locked ? `Level ${n} · locked` : `Level ${n} · ${L.name}${L.location ? ' · ' + L.location : ''}`;
      b.setAttribute('aria-label', b.title);
      if (locked) b.setAttribute('aria-disabled', 'true');
      else b.addEventListener('click', () => { this.audio.play('ui'); this.startLevel(n); });
      grid.appendChild(b);
    }
  }

  // ------------------------------------------------------------- shop
  openShop() {
    this.backStack = ['menu'];
    this.mode = 'menu';
    this.shopCat = this.shopCat || 'skin';
    this.shopSel = this.shopCat === 'skin' ? this.save.skin : this.save.equip[this.shopCat];
    this.renderer.showcase = true;
    this.show('shop');
    this.renderShop();
  }

  // what an item looks like in its tile
  shopSwatch(cat, it) {
    const GLYPH = {
      hat: { none: '🚫', party: '🥳', cap: '🧢', chef: '👨‍🍳', propeller: '🌀', headphones: '🎧', tophat: '🎩', viking: '⚔️', wizard: '🧙', halo: '😇', astro: '👨‍🚀' },
      jump: { none: '💨', confetti: '🎉', stars: '⭐', hearts: '💖', ring: '💫', notes: '🎵', lightning: '⚡' },
      pet: { none: '🚫', orb: '🔵', satellite: '🛰️', comet: '☄️', ufo: '🛸', cat: '🐱', jelly: '🪼' },
      dance: { none: '💪', spin: '🌀', robot: '🤖', floss: '🕺', backflip: '🤸', moonwalk: '🌙', breakdance: '🌪️' },
    };
    if (cat === 'skin') {
      const bg = it.galaxy ? 'radial-gradient(circle at 30% 30%, #ff4ad0, #241650 60%, #0e2a6a)' : `radial-gradient(circle at 35% 30%, #fff 0%, ${hex(it.body)} 35%, ${hex(it.body)} 70%, ${hex(it.accent)} 100%)`;
      return `<div class="swatch" style="background:${bg};--eye:${hex(it.eye)}"><i></i></div>`;
    }
    if (cat === 'trail') return `<div class="swatch trail" style="background:${it.colors ? `linear-gradient(135deg, ${it.colors.map(hex).join(', ')})` : 'rgba(255,255,255,0.06)'}">${it.colors ? '' : '<b>🚫</b>'}</div>`;
    if (cat === 'ship') return `<div class="swatch ship" style="background:${it.galaxy ? 'radial-gradient(circle at 30% 30%, #7af0ff, #2a1a6a 55%, #140a3a)' : `linear-gradient(135deg, ${hex(it.hull)} 0 55%, ${hex(it.accent)} 55% 70%, ${hex(it.trim)} 70%)`}"><b>🚀</b></div>`;
    return `<div class="swatch glyph"><b>${(GLYPH[cat] || {})[it.id] || '✨'}</b></div>`;
  }

  // preview the selection on the showcase robot without equipping it
  previewShop() {
    const cat = this.shopCat, id = this.shopSel, R = this.renderer, eq = { ...this.save.equip };
    if (cat !== 'skin') eq[cat] = id;
    R.robot.setSkin(cat === 'skin' ? id : this.save.skin);
    R.setCosmetics(eq);
    R.showcaseDemo = cat;
    R.equipPreview = eq.ship;
  }

  renderShop() {
    const s = this.save;
    normalizeCosmetics(s);
    $('shop-wallet').textContent = (s.wallet || 0).toLocaleString();
    const tabs = $('shop-tabs');
    tabs.innerHTML = '';
    for (const c of CATEGORIES) {
      const b = document.createElement('button');
      b.className = 'shop-tab' + (c.id === this.shopCat ? ' on' : '');
      b.dataset.cat = c.id;
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-selected', c.id === this.shopCat ? 'true' : 'false');
      b.innerHTML = `<span>${c.icon}</span>${c.name}`;
      b.addEventListener('click', () => {
        this.audio.play('ui');
        this.shopCat = c.id;
        this.shopSel = c.id === 'skin' ? s.skin : s.equip[c.id];
        this.renderShop();
      });
      tabs.appendChild(b);
    }
    const cat = this.shopCat, C = CATEGORIES.find((c) => c.id === cat);
    $('shop-hint').textContent = `${C.blurb} Earn Bolts by finishing levels: every run pays, replays included, plus a bonus for first clears and new Star Shards.`;
    const list = cat === 'skin' ? SKINS : ITEMS[cat];
    const owns = (id) => (cat === 'skin' ? s.skins.includes(id) : s.owned[cat].includes(id));
    const equipped = cat === 'skin' ? s.skin : s.equip[cat];
    const grid = $('skin-grid');
    grid.innerHTML = '';
    for (const it of list) {
      const owned = owns(it.id);
      const b = document.createElement('button');
      b.className = 'skin' + (it.id === this.shopSel ? ' sel' : '') + (!owned && it.price > (s.wallet || 0) ? ' locked' : '');
      if (cat === 'skin') b.dataset.skin = it.id; else b.dataset.item = it.id;
      const status = equipped === it.id ? '<span class="pr eq">Equipped</span>' : owned ? '<span class="pr owned">Owned</span>' : `<span class="pr"><span class="bolt-icon small"></span>${it.price.toLocaleString()}</span>`;
      b.innerHTML = `${this.shopSwatch(cat, it)}<div class="nm">${it.name}</div>${status}`;
      b.addEventListener('click', () => { this.audio.play('ui'); this.shopSel = it.id; this.renderShop(); });
      grid.appendChild(b);
    }
    const sel = cat === 'skin' ? skinById(this.shopSel) : itemById(cat, this.shopSel);
    const owned = owns(sel.id);
    $('shop-name').textContent = sel.name;
    $('shop-price').textContent = owned ? (equipped === sel.id ? 'Currently equipped' : 'Owned') : `${sel.price.toLocaleString()} bolts`;
    const btn = $('btn-shop-action');
    btn.textContent = equipped === sel.id ? 'Equipped' : owned ? 'Equip' : (s.wallet || 0) >= sel.price ? `Buy · ${sel.price.toLocaleString()}` : `Need ${(sel.price - (s.wallet || 0)).toLocaleString()} more`;
    btn.disabled = equipped === sel.id || (!owned && (s.wallet || 0) < sel.price);
    btn.style.opacity = btn.disabled ? 0.55 : 1;
    this.previewShop();
  }

  shopAction() {
    const s = this.save, cat = this.shopCat;
    if (cat === 'skin') {
      const sel = skinById(this.shopSel);
      if (!s.skins.includes(sel.id)) {
        if ((s.wallet || 0) < sel.price) return;
        s.wallet -= sel.price;
        s.skins.push(sel.id);
        this.audio.play('complete');
        this.toast(`UNLOCKED ${sel.name.toUpperCase()}`);
      }
      s.skin = sel.id;
    } else {
      const r = buyOrEquip(s, cat, this.shopSel);
      if (r === 'poor') return;
      if (r === 'bought') { this.audio.play('complete'); this.toast(`UNLOCKED ${itemById(cat, this.shopSel).name.toUpperCase()}`); }
    }
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
      this.renderer.update(this.sim, 0);
      if (!TEST || this.warmupInTests) this.renderer.warmup();
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
    const firstClear = !this.save.best[this.levelNum];
    this.lastResult = result;
    const { newBest, earned, newShards } = recordCompletion(this.save, this.levelNum, result);
    if (!this.save.seenWorlds.includes(worldIndexOf(Math.min(TOTAL_LEVELS, this.levelNum + 1)))) this.save.seenWorlds.push(worldIndexOf(Math.min(TOTAL_LEVELS, this.levelNum + 1)));
    writeSave(this.save);
    this.mode = 'complete';
    this.completeReadyAt = performance.now() + 400;
    const n = this.levelNum;
    const worldDone = n === lastLevelOfWorld(worldIndexOf(n));
    $('complete-kicker').textContent = n === TOTAL_LEVELS ? 'YOU ESCAPED THE BLACK HOLE' : worldDone ? 'WORLD COMPLETE' : 'LEVEL COMPLETE';
    $('complete-title').textContent = `Level ${n} · ${WORLDS[worldIndexOf(n)].short}`;
    $('c-score').textContent = result.score.toLocaleString();
    $('c-cells').textContent = `${result.cells}/${result.total}`;
    $('c-time').textContent = fmtTime(result.time);
    $('c-best').textContent = this.save.best[n].score.toLocaleString();
    $('c-newbest').classList.toggle('hidden', !newBest);
    $('c-shards').textContent = `${(this.save.shardIds[n] || []).length}/3`;
    $('c-earned').innerHTML = `<span class="bolt-icon"></span>+${earned}`;
    $('c-earned').title = `${BOLTS.base} for finishing + ${result.cells * BOLTS.perCell} for cells + ${Math.floor(result.score / BOLTS.scoreDiv)} for score${firstClear ? ` + ${BOLTS.firstClear} first clear` : ''}${newShards ? ` + ${newShards * BOLTS.perShard} for new shards` : ''}`;
    $('btn-next').textContent = n === TOTAL_LEVELS ? 'Finale' : worldDone ? (worldIndexOf(n + 1) === BONUS_WORLD ? 'Enter the Black Hole 🕳️' : `Fly to ${WORLDS[worldIndexOf(n + 1)].short} 🚀`) : 'Next Level';
    this.show('complete');
    this.updateHUD(true);
  }

  next() {
    if (this.mode !== 'complete') return;
    const n = this.levelNum;
    if (n === lastLevelOfWorld(worldIndexOf(n))) this.playCutscene(worldIndexOf(n), n < TOTAL_LEVELS ? worldIndexOf(n) + 1 : null);
    else this.startLevel(n + 1);
  }

  playCutscene(from, to) {
    return this.fade(() => {
      this.mode = 'cutscene';
      this.show(null);
      this.cutscene = new Cutscene(this.renderer.renderer, from, to, { skin: this.save.skin, hat: this.save.equip.hat, livery: itemById('ship', this.save.equip.ship) });
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
    if (to == null) { this.toMenu(); this.toast('YOU ESCAPED THE BLACK HOLE — THE END', 3500); return; }
    this.startLevel(to * LEVELS_PER_WORLD + 1);
  }

  // ------------------------------------------------------------- loop
  frame(now) {
    requestAnimationFrame((t) => this.frame(t));
    let dt = (now - this.last) / 1000;
    this.last = now;
    if (!(dt > 0)) dt = 0;
    this.governor(dt);
    dt = Math.min(dt, 0.1);
    try {
      this.tick(dt);
    } catch (err) {
      this.errors.push(String(err && err.stack || err));
      console.error(err);
    }
    if (!this.booted) { this.booted = true; $('loading').classList.add('gone'); }
  }

  // Frame-rate governor: watch real frame times while playing and trade render resolution
  // for smoothness (down fast when slow, back up slowly when there's headroom).
  governor(dt) {
    const g = this.gov || (this.gov = { ema: 1 / 60, t: 0, good: 0 });
    if (TEST || (this.mode !== 'playing' && this.screen !== 'select') || !(dt > 0) || dt > 0.25) return;   // ignore tab switches and load hitches
    g.ema += (dt - g.ema) * 0.05;
    g.t += dt;
    if (g.t < 1) return;
    g.t = 0;
    const R = this.renderer;
    const before = R.dynScale;
    if (g.ema > 1 / 48) { g.good = 0; R.setDynScale(R.dynScale - 0.15); }
    else if (g.ema < 1 / 57) { if (++g.good >= 4) { g.good = 0; R.setDynScale(R.dynScale + 0.1); } }
    else g.good = 0;
    if (this.map && R.dynScale !== before) this.map.resize();     // the star map shares the canvas
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
    if (e.type === 'shard') { const known = (this.save.shardIds[this.levelNum] || []).includes(e.id); this.toast(`STAR SHARD ${this.sim.shards}/3${known ? ' · FOUND BEFORE' : ` · +${SHARD_BONUS} BOLTS ON FINISH`}`); }
  }

  tick(dt) {
    // when the test harness drives the sim tick-by-tick, only render on request (keeps slow CI responsive)
    const idleRender = !(TEST && this.manual);
    if (this.mode === 'cutscene') {
      const done = this.cutscene.update(this.manual ? 0 : dt);
      if (idleRender) this.cutscene.render();
      const cap = this.cutscene.caption();
      $('cap-big').textContent = cap ? cap.big : '';
      $('cap-small').textContent = cap ? cap.small : '';
      $('fade').style.opacity = String(this.cutscene.fade());
      if (done) this.endCutscene();
      return;
    }
    if (this.screen === 'select' && this.map) {
      this.map.update(dt);
      if (idleRender) this.map.render();
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
    if (!idleRender) { if (this.mode === 'playing' || this.mode === 'complete') this.updateHUD(); return; }
    this.renderer.update(this.sim, this.mode === 'paused' ? 0 : dt);
    this.renderer.render();
    if (this.mode === 'playing' || this.mode === 'complete') this.updateHUD();
  }

  updateHUD(force = false) {
    const sim = this.sim, L = sim.L, W = WORLDS[L.worldIndex];
    const set = (id, v) => { if (force || this.hudCache[id] !== v) { this.hudCache[id] = v; $(id).textContent = v; } };
    set('hud-level', `Level ${L.index}`);
    set('hud-world', W.name + (L.location ? ` · ${L.location}` : ''));
    set('hud-sub', L.worldIndex === BONUS_WORLD ? 'Bonus · The Black Hole' : `World ${L.worldIndex + 1} · Stage ${L.sub} of ${LEVELS_PER_WORLD}${this.renderer.variantName ? ' · ' + this.renderer.variantName : ''}`);
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
      wallet: this.save.wallet, skin: this.save.skin, skins: this.save.skins.slice(), equip: { ...this.save.equip }, owned: JSON.parse(JSON.stringify(this.save.owned)),
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
  render: () => { if (game.mode === 'cutscene') { game.cutscene.render(); return true; } if (game.screen === 'select' && game.map) { game.map.update(1 / 60); game.map.render(); return true; } game.renderer.snapCamera(game.sim); game.renderer.update(game.sim, 1 / 60); game.renderer.render(); return true; },
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
  selectPlanet: (wi) => { game.selectPlanet(wi, true); return game.testState(); },
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
      '  dev.world(w)           start the first level of world w (1-16; 17 = THE END)',
      '  dev.win()              finish the current level instantly',
      '  dev.bolts(n = 5000)    add Bolts to spend in the shop (dev.cells works too)',
      '  dev.allSkins()         own everything in the shop',
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
    if (game.screen === 'select') { game.refreshMapLabels(); if (game.panelOpen) game.renderSelect(); }
    return `all ${TOTAL_LEVELS} levels unlocked`;
  },
  skipAll() { window.dev.unlockAll(); game.startLevel(TOTAL_LEVELS); return `skipped to level ${TOTAL_LEVELS}`; },
  level(n) { game.save.unlocked = Math.max(game.save.unlocked, n); writeSave(game.save); game.startLevel(n); return `starting level ${n}`; },
  world(w) { return window.dev.level((w - 1) * LEVELS_PER_WORLD + 1); },
  win() {
    if (game.mode !== 'playing') return 'not in a level';
    const g = game.sim.L.goal; game.sim.teleport(g.x, g.y); return 'level complete';
  },
  bolts(n = 5000) { game.save.wallet = (game.save.wallet || 0) + n; writeSave(game.save); game.refreshMenu(); if (game.screen === 'shop') game.renderShop(); return `bolts: ${game.save.wallet}`; },
  cells(n = 5000) { return window.dev.bolts(n); },
  allSkins() { game.save.skins = SKINS.map((k) => k.id); for (const c of Object.keys(ITEMS)) game.save.owned[c] = ITEMS[c].map((i) => i.id); writeSave(game.save); if (game.screen === 'shop') game.renderShop(); return 'everything in the shop owned'; },
  intro() { game.playCutscene(null, 0); return 'rolling intro'; },
  fly(w = 1) { game.playCutscene(w - 1, w < WORLDS.length ? w : null); return 'rolling cutscene'; },
  reset() { localStorage.removeItem('starhopper.save.v2'); location.reload(); },
};
if (!TEST) console.log('%c★ Starhopper%c  dev commands: type dev.help()', 'color:#5fd8ff;font-weight:bold;font-size:14px', 'color:#9aa8c4');
