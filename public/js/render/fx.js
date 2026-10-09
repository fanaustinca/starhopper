// Pooled particle effects + ambient weather particles.
import * as THREE from 'three';
import { glowTexture } from './textures.js';

// little shape sprites for shop trails / jump bursts
const shapeCache = new Map();
function shapeTexture(kind) {
  if (shapeCache.has(kind)) return shapeCache.get(kind);
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const g = c.getContext('2d');
  g.fillStyle = '#fff'; g.strokeStyle = '#fff';
  g.shadowColor = '#fff'; g.shadowBlur = 6;
  if (kind === 'star') { g.beginPath(); for (let i = 0; i < 10; i++) { const r = i % 2 ? 12 : 28, a = -Math.PI / 2 + (i * Math.PI) / 5; g.lineTo(32 + Math.cos(a) * r, 32 + Math.sin(a) * r); } g.closePath(); g.fill(); }
  else if (kind === 'heart') { g.beginPath(); g.moveTo(32, 54); g.bezierCurveTo(4, 34, 10, 8, 32, 22); g.bezierCurveTo(54, 8, 60, 34, 32, 54); g.fill(); }
  else if (kind === 'note') { g.fillRect(36, 10, 6, 34); g.beginPath(); g.ellipse(30, 46, 11, 8, -0.4, 0, Math.PI * 2); g.fill(); g.fillRect(36, 10, 18, 7); }
  else if (kind === 'square') { g.shadowBlur = 0; g.fillRect(14, 14, 36, 36); }
  else if (kind === 'leaf') { g.beginPath(); g.ellipse(32, 32, 26, 11, 0.6, 0, Math.PI * 2); g.fill(); }
  else if (kind === 'bubble') { g.lineWidth = 4; g.beginPath(); g.arc(32, 32, 22, 0, Math.PI * 2); g.stroke(); g.globalAlpha = 0.25; g.fill(); g.globalAlpha = 1; g.beginPath(); g.arc(24, 24, 5, 0, Math.PI * 2); g.fill(); }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  shapeCache.set(kind, t);
  return t;
}
const TRAIL_SHAPE = { pixels: 'square', leaves: 'leaf', bubbles: 'bubble', stardust: 'star' };

export class FX {
  constructor(scene) {
    this.scene = scene;
    this.tex = glowTexture(0xffffff);
    this.pool = [];
    this.live = [];
    this.rings = [];
    this.group = new THREE.Group();
    scene.add(this.group);
    for (let i = 0; i < 260; i++) {
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.tex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
      s.visible = false;
      this.group.add(s);
      this.pool.push(s);
    }
    this.ringGeo = new THREE.TorusGeometry(0.6, 0.06, 6, 32);
  }

  spawn(x, y, z, vx, vy, vz, life, size, color, opts = {}) {
    const s = this.pool.pop();
    if (!s) return;
    s.visible = true;
    s.position.set(x, y, z);
    s.material.color.setHex(color);
    s.material.map = opts.shape ? shapeTexture(opts.shape) : this.tex;
    s.material.rotation = opts.spin ? Math.random() * 6.28 : 0;
    s.material.blending = opts.normal ? THREE.NormalBlending : THREE.AdditiveBlending;
    s.material.opacity = 1;
    s.scale.setScalar(size);
    this.live.push({ s, vx, vy, vz, life, max: life, size, grav: opts.grav ?? 0, grow: opts.grow ?? 0 });
  }

  burst(type, x, y, color = 0xffffff) {
    const R = Math.random;
    switch (type) {
      case 'dust':
        for (let i = 0; i < 8; i++) this.spawn(x + (R() - 0.5) * 0.6, y + 0.1, (R() - 0.5) * 0.8, (R() - 0.5) * 3, R() * 1.2, (R() - 0.5), 0.45, 0.45, 0xb8b0a8, { normal: true, grow: 1.5 });
        break;
      case 'ring': {
        const m = new THREE.Mesh(this.ringGeo, new THREE.MeshBasicMaterial({ color: 0x7fe0ff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
        m.position.set(x, y, 0); m.rotation.x = Math.PI / 2;
        this.group.add(m);
        this.rings.push({ m, life: 0.35 });
        for (let i = 0; i < 10; i++) this.spawn(x, y, 0, (R() - 0.5) * 4, -R() * 3, (R() - 0.5) * 2, 0.35, 0.3, 0x7fe0ff);
        break;
      }
      case 'sparkle':
        for (let i = 0; i < 14; i++) { const a = R() * 6.28; this.spawn(x, y, 0, Math.cos(a) * 4, Math.sin(a) * 4, (R() - 0.5) * 2, 0.5, 0.35, color); }
        break;
      case 'hurt':
        for (let i = 0; i < 18; i++) { const a = R() * 6.28; this.spawn(x, y, 0, Math.cos(a) * 6, Math.sin(a) * 6, 0, 0.5, 0.5, 0xff4040); }
        break;
      case 'launch':
        for (let i = 0; i < 20; i++) this.spawn(x + (R() - 0.5), y, (R() - 0.5), (R() - 0.5) * 2, -R() * 6, 0, 0.6, 0.5, color);
        break;
      case 'flash':
        for (let i = 0; i < 24; i++) { const a = R() * 6.28; this.spawn(x + (R() - 0.5) * 3, y, 0, Math.cos(a) * 3, Math.sin(a) * 3, 0, 0.7, 0.6, color); }
        break;
      case 'confetti':
        for (let i = 0; i < 60; i++) this.spawn(x, y + 1, 0, (R() - 0.5) * 10, R() * 12, (R() - 0.5) * 6, 1.6, 0.35, [0xff5a8a, 0x5ad0ff, 0xffe05a, 0x7aff8a][i % 4], { grav: -14 });
        break;
      // ---- shop jump bursts
      case 'confettiS':
        for (let i = 0; i < 22; i++) this.spawn(x, y + 0.6, 0, (R() - 0.5) * 6, R() * 6 + 2, (R() - 0.5) * 3, 1.0, 0.26, [0xff5a8a, 0x5ad0ff, 0xffe05a, 0x7aff8a][i % 4], { grav: -14, shape: 'square', spin: true });
        break;
      case 'stars':
        for (let i = 0; i < 12; i++) { const a = (i / 12) * 6.28; this.spawn(x, y + 0.2, 0, Math.cos(a) * 4.5, Math.sin(a) * 3 + 2, (R() - 0.5) * 2, 0.6, 0.42, color, { shape: 'star', grav: -6, spin: true }); }
        break;
      case 'hearts':
        for (let i = 0; i < 8; i++) this.spawn(x + (R() - 0.5) * 0.8, y + 0.3, (R() - 0.5), (R() - 0.5) * 2.5, R() * 3 + 2, 0, 0.8, 0.45, color, { shape: 'heart', normal: true });
        break;
      case 'notes':
        for (let i = 0; i < 7; i++) this.spawn(x + (R() - 0.5), y + 0.4, 0, (R() - 0.5) * 3, R() * 2.5 + 2, 0, 0.9, 0.42, [0xff5a8a, 0x5ad0ff, 0xffe05a, 0x7aff8a][i % 4], { shape: 'note', normal: true });
        break;
      case 'lightning':
        for (let i = 0; i < 6; i++) { const a = R() * 6.28; for (let k = 1; k < 5; k++) this.spawn(x + Math.cos(a) * k * 0.35 + (R() - 0.5) * 0.15, y + Math.sin(a) * k * 0.35, 0, 0, 0, 0, 0.18 + k * 0.03, 0.22, color); }
        this.burst('ring', x, y);
        break;
      case 'impact':
        for (let i = 0; i < 16; i++) { const a = R() * 3.14; this.spawn(x, y + 0.2, 0, Math.cos(a) * 6, Math.sin(a) * 6, (R() - 0.5) * 3, 0.5, 0.6, 0xff8030, { grav: -20 }); }
        break;
    }
  }

  // continuous shop trail behind the robot (cfg from core/shop.js ITEMS.trail)
  trail(cfg, x, y, dt, t) {
    if (!cfg || cfg.id === 'none') return;
    this.trailAcc = (this.trailAcc || 0) + dt * cfg.rate;
    const R = Math.random;
    while (this.trailAcc >= 1) {
      this.trailAcc -= 1;
      const col = cfg.cycle ? cfg.colors[Math.floor(t * 12) % cfg.colors.length] : cfg.colors[Math.floor(R() * cfg.colors.length)];
      this.spawn(x + (R() - 0.5) * 0.35, y + (R() - 0.5) * 0.35, (R() - 0.5) * 0.4, (R() - 0.5) * 0.6, cfg.rise + (R() - 0.5) * 0.5, (R() - 0.5) * 0.3, cfg.life, cfg.size, col,
        { normal: !!cfg.normal, shape: TRAIL_SHAPE[cfg.id], grow: cfg.id === 'fire' ? 1.2 : cfg.id === 'bubbles' ? 0.5 : 0, spin: cfg.id === 'leaves' || cfg.id === 'stardust' });
    }
  }

  update(dt) {
    for (let i = this.live.length - 1; i >= 0; i--) {
      const p = this.live[i];
      p.life -= dt;
      if (p.life <= 0) {
        p.s.visible = false;
        this.pool.push(p.s);
        this.live.splice(i, 1);
        continue;
      }
      p.vy += p.grav * dt;
      p.s.position.x += p.vx * dt; p.s.position.y += p.vy * dt; p.s.position.z += p.vz * dt;
      const k = p.life / p.max;
      p.s.material.opacity = k;
      p.s.scale.setScalar(p.size * (1 + (1 - k) * p.grow));
    }
    for (let i = this.rings.length - 1; i >= 0; i--) {
      const r = this.rings[i];
      r.life -= dt;
      const k = 1 - r.life / 0.35;
      r.m.scale.setScalar(1 + k * 2.5);
      r.m.material.opacity = 1 - k;
      if (r.life <= 0) { this.group.remove(r.m); r.m.material.dispose(); this.rings.splice(i, 1); }
    }
  }

  clear() {
    for (const p of this.live) { p.s.visible = false; this.pool.push(p.s); }
    this.live.length = 0;
    for (const r of this.rings) { this.group.remove(r.m); r.m.material.dispose(); }
    this.rings.length = 0;
  }
}

// Ambient particles that wrap around the camera (embers, dust storms, rain, spores…)
export class Weather {
  constructor(scene) {
    this.scene = scene;
    this.points = null;
  }
  set(worldId, opts = {}) {
    if (this.points) { this.scene.remove(this.points); this.points.geometry.dispose(); this.points.material.dispose(); this.points = null; }
    const cfg = {
      sun: { n: 300, color: 0xffa040, size: 3, vx: 0.3, vy: 2.5, add: true },
      mercury: { n: 80, color: 0xffffff, size: 1.5, vx: 0, vy: 0.1, add: true },
      venus: { n: 400, color: 0xffc080, size: 2.5, vx: 1.5, vy: -0.3 },
      earth: { n: 60, color: 0xffffff, size: 1.8, vx: 0.4, vy: 0.2 },
      mars: { n: 700, color: 0xd88a5a, size: 2.6, vx: 7, vy: 0.5 },
      asteroids: { n: 200, color: 0xb0a090, size: 1.8, vx: -0.5, vy: 0 },
      jupiter: { n: 500, color: 0xfff0e0, size: 2, vx: 10, vy: 0, add: true },
      saturn: { n: 400, color: 0xfff0d0, size: 2.2, vx: 4, vy: 0, add: true },
      uranus: { n: 600, color: 0xffffff, size: 2.4, vx: 3, vy: -2 },
      neptune: { n: 900, color: 0xb0d0ff, size: 2.0, vx: 5, vy: -14, add: true },
      prismara: { n: 300, color: 0xff9af8, size: 2.6, vx: 0.2, vy: 0.6, add: true },
      mechanus: { n: 200, color: 0xffc070, size: 2, vx: 0.4, vy: 1.4, add: true },
      biolumina: { n: 500, color: 0x6affd0, size: 3, vx: 0.3, vy: 0.5, add: true },
      chronos: { n: 300, color: 0xffe08a, size: 2.4, vx: -0.6, vy: 0.3, add: true },
      aerolis: { n: 400, color: 0xffd8f0, size: 2.4, vx: 5, vy: 0.6, add: true },
      velocitar: { n: 500, color: 0x3ad8ff, size: 2.0, vx: -14, vy: 0, add: true },
      blackhole: { n: 700, color: 0xffb070, size: 2.2, vx: 6, vy: 1.5, add: true },
    }[worldId];
    if (!cfg) return;
    if (opts.redSpot) { cfg.n = 900; cfg.vx = 18; cfg.color = 0xffb090; }
    const pos = new Float32Array(cfg.n * 3);
    for (let i = 0; i < cfg.n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 2] = Math.random() * -40 + 12;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.points = new THREE.Points(geo, new THREE.PointsMaterial({
      color: cfg.color, size: cfg.size, sizeAttenuation: false, transparent: true, opacity: 0.7, depthWrite: false,
      blending: cfg.add ? THREE.AdditiveBlending : THREE.NormalBlending,
    }));
    this.points.frustumCulled = false;
    this.cfg = cfg;
    this.scene.add(this.points);
  }
  update(dt, camX, camY, windBoost = 0) {
    if (!this.points) return;
    const a = this.points.geometry.attributes.position;
    const c = this.cfg;
    for (let i = 0; i < a.count; i++) {
      let x = a.getX(i) + (c.vx + windBoost) * dt, y = a.getY(i) + c.vy * dt;
      // wrap inside a box around the camera
      if (x - camX > 40) x -= 80; else if (x - camX < -40) x += 80;
      if (y - camY > 25) y -= 50; else if (y - camY < -25) y += 50;
      a.setXY(i, x, y);
    }
    a.needsUpdate = true;
  }
}
