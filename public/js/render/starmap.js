// The level select: a draggable 3D model of the two star systems (Sol and
// Vesper) with every world in orbit, plus the black hole drifting between them.
// Drag to orbit, scroll / pinch to zoom, click a planet to fly to it.
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { WORLDS, SYSTEMS } from '../core/config.js';
import { makeRng } from '../core/rng.js';
import { makePlanet, starBody, asteroidBelt, tickPlanets } from './planets.js';
import { tickShaders } from './shaders.js';

// orbit radius and on-map size per world (index into WORLDS)
const LAYOUT = {
  sun: { r: 0, size: 6.5 },
  mercury: { r: 13, size: 1.0 }, venus: { r: 18.5, size: 1.55 }, earth: { r: 24.5, size: 1.65 }, mars: { r: 30.5, size: 1.2 },
  asteroids: { r: 37, size: 0.95 }, jupiter: { r: 47, size: 3.7 }, saturn: { r: 59, size: 3.0 }, uranus: { r: 69, size: 2.3 }, neptune: { r: 78, size: 2.25 },
  prismara: { r: 15, size: 1.9 }, mechanus: { r: 22, size: 1.7 }, biolumina: { r: 29.5, size: 1.9 }, chronos: { r: 37, size: 2.0 }, aerolis: { r: 45.5, size: 2.4 }, velocitar: { r: 54, size: 2.1 },
  blackhole: { r: 0, size: 3.6 },
};
const SYS_POS = { sol: new THREE.Vector3(0, 0, 0), vesper: new THREE.Vector3(240, 6, -70), void: new THREE.Vector3(122, 22, -150) };
const SYS_VIEW = { sol: { dist: 150, pitch: 0.62, yaw: 0.35 }, vesper: { dist: 118, pitch: 0.58, yaw: -0.3 }, void: { dist: 46, pitch: 0.32, yaw: 0.2 } };

export class StarMap {
  constructor(gl, opts = {}) {
    this.gl = gl;
    this.labelRoot = opts.labelRoot;            // HTML container for planet labels
    this.onPick = opts.onPick || (() => {});
    this.onHover = opts.onHover || (() => {});
    this.useBloom = opts.bloom !== false;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x010208);
    this.camera = new THREE.PerspectiveCamera(42, 16 / 9, 0.5, 6000);
    this.t = 0;
    this.bodies = [];          // { wi, world, group, hit, label, orbit, angle, speed, center, layout }
    this.focus = new THREE.Vector3();
    this.focusGoal = new THREE.Vector3();
    this.view = { yaw: 0.35, pitch: 0.6, dist: 150 };
    this.viewGoal = { ...this.view };
    this.follow = null;        // body the camera is tracking
    this.hover = null;
    this.selected = null;
    this.inset = { x: 0, y: 0 };
    this.insetGoal = { x: 0, y: 0 };
    this.build();
    this.composer = new EffectComposer(gl);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloom = new UnrealBloomPass(new THREE.Vector2(512, 512), 0.7, 0.45, 0.72);
    this.composer.addPass(this.bloom);
    this.composer.addPass(new OutputPass());
    this.raycaster = new THREE.Raycaster();
    this.resize();
  }

  // ------------------------------------------------------------- scene
  build() {
    const S = this.scene;
    S.add(new THREE.AmbientLight(0x8a9ac8, 0.22));
    const rng = makeRng(42);
    // deep-space backdrop: stars, a milky-way band, soft nebulae per system
    const N = 9000, pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const band = i < 4000;
      let x, y, z;
      if (band) { const a = rng.next() * Math.PI * 2; x = Math.cos(a); z = Math.sin(a); y = (rng.next() - 0.5) * 0.22; }
      else { const u = rng.next() * 2 - 1, a = rng.next() * Math.PI * 2, r = Math.sqrt(1 - u * u); x = Math.cos(a) * r; y = u; z = Math.sin(a) * r; }
      const v = new THREE.Vector3(x, y, z).normalize().multiplyScalar(2600);
      v.applyAxisAngle(new THREE.Vector3(1, 0, 0.3).normalize(), 0.5);
      pos.set([v.x, v.y, v.z], i * 3);
      const c = new THREE.Color().setHSL(band ? 0.62 + rng.next() * 0.2 : 0.55 + rng.next() * 0.15, band ? 0.5 : 0.3, 0.6 + rng.next() * 0.4);
      col.set([c.r, c.g, c.b], i * 3);
    }
    const sg = new THREE.BufferGeometry();
    sg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    sg.setAttribute('color', new THREE.BufferAttribute(col, 3));
    this.stars = new THREE.Points(sg, new THREE.PointsMaterial({ size: 1.6, sizeAttenuation: false, vertexColors: true, transparent: true, opacity: 0.9, depthWrite: false }));
    S.add(this.stars);
    const neb = (color, x, y, z, s, o) => { const sp = nebulaSprite(color, s, o); sp.position.set(x, y, z); S.add(sp); return sp; };
    neb(0x2a4aa0, -200, 60, -700, 900, 0.35);
    neb(0x6a1a8a, 420, 80, -800, 1000, 0.4);
    neb(0xa02a6a, 250, -120, -650, 600, 0.25);
    neb(0xff7a30, 122, 22, -320, 260, 0.18);

    // ---- systems
    for (const sys of SYSTEMS) {
      const C = SYS_POS[sys.id];
      const root = new THREE.Group();
      root.position.copy(C);
      S.add(root);
      if (sys.id === 'sol' || sys.id === 'vesper') {
        const light = new THREE.PointLight(sys.id === 'sol' ? 0xfff0d8 : 0xd8c8ff, 3.2, 0, 0);
        root.add(light);
      }
      if (sys.id === 'vesper') {
        // Vesper itself: a violet-white star (not a level, just the system's heart)
        const star = starBody(0xf4e8ff, 0x8a4aff, 0xb07aff);
        star.scale.setScalar(5.2);
        root.add(star);
        this.vesperStar = star;
      }
      for (const wi of sys.worlds) {
        const w = WORLDS[wi], L = LAYOUT[w.id];
        const g = makePlanet(w, { segs: w.id === 'sun' || w.planet.blackhole ? 48 : 56, lite: true });
        g.scale.setScalar(L.size);
        const holder = new THREE.Group();
        holder.add(g);
        root.add(holder);
        // generous invisible hit sphere so small planets are easy to click
        const hit = new THREE.Mesh(new THREE.SphereGeometry(Math.max(L.size * 1.5, 2.6), 12, 8), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, colorWrite: false }));
        hit.userData.wi = wi;
        holder.add(hit);
        let orbit = null;
        if (L.r > 0) {
          orbit = orbitLine(L.r, sys.id === 'sol' ? 0x6a8ac8 : 0xb08aff);
          root.add(orbit);
        }
        const speed = L.r > 0 ? 1.6 / Math.pow(L.r, 1.1) : 0;
        const angle = rng.next() * Math.PI * 2;
        this.bodies.push({ wi, world: w, group: g, holder, hit, orbit, angle, speed, root, layout: L, sys: sys.id, label: null });
      }
      if (sys.id === 'sol') {
        const belt = asteroidBelt(LAYOUT.asteroids.r - 3.2, LAYOUT.asteroids.r + 3.2, 700, 9);
        root.add(belt);
        this.belt = belt;
      }
    }
    // a faint jump-lane from Neptune out to Vesper, and to the black hole
    this.lanes = [];
    for (const [a, b, c] of [['sol', 'vesper', 0x8aa0ff], ['sol', 'void', 0xff8a40], ['vesper', 'void', 0xff8a40]]) {
      const pa = SYS_POS[a], pb = SYS_POS[b];
      const mid = pa.clone().add(pb).multiplyScalar(0.5).add(new THREE.Vector3(0, 30, -20));
      const curve = new THREE.QuadraticBezierCurve3(pa, mid, pb);
      const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(80));
      const line = new THREE.Line(geo, new THREE.LineDashedMaterial({ color: c, dashSize: 3, gapSize: 4, transparent: true, opacity: 0.22, depthWrite: false }));
      line.computeLineDistances();
      S.add(line);
      this.lanes.push(line);
    }
    this.hits = this.bodies.map((b) => b.hit);
  }

  // ------------------------------------------------------------- labels (HTML)
  setLabels(fn) {
    // fn(body) → { html, cls } ; rebuilt whenever progress changes
    if (!this.labelRoot) return;
    this.labelRoot.innerHTML = '';
    for (const b of this.bodies) {
      const el = document.createElement('button');
      el.className = 'map-label';
      el.dataset.world = b.wi;
      const { html, cls } = fn(b);
      el.innerHTML = html;
      b.labelW = 0;
      if (cls) el.classList.add(...cls.split(' ').filter(Boolean));
      el.addEventListener('click', (e) => { e.stopPropagation(); this.onPick(b.wi); });
      el.addEventListener('pointerenter', () => this.setHover(b));
      el.addEventListener('pointerleave', () => this.setHover(null));
      this.labelRoot.appendChild(el);
      b.label = el;
    }
    this.sysLabels = SYSTEMS.filter((s) => s.id !== 'void').map((s) => {
      const el = document.createElement('div');
      el.className = 'map-sys-label';
      el.textContent = s.name;
      this.labelRoot.appendChild(el);
      return { el, sys: s.id };
    });
  }

  setHover(b) {
    if (this.hover === b) return;
    if (this.hover && this.hover.label) this.hover.label.classList.remove('hover');
    this.hover = b;
    if (b && b.label) b.label.classList.add('hover');
    this.onHover(b ? b.wi : null);
  }

  // ------------------------------------------------------------- camera
  focusSystem(id, instant = false) {
    this.follow = null;
    this.selected = null;
    this.focusGoal.copy(SYS_POS[id]);
    Object.assign(this.viewGoal, SYS_VIEW[id]);
    this.viewGoal.yaw = this.nearestYaw(this.viewGoal.yaw);
    this.currentSystem = id;
    if (instant) { this.focus.copy(this.focusGoal); Object.assign(this.view, this.viewGoal); }
  }
  focusWorld(wi, instant = false) {
    const b = this.bodies.find((q) => q.wi === wi);
    if (!b) return;
    this.follow = b;
    this.selected = b;
    this.currentSystem = b.sys;
    const sz = b.layout.size * (b.world.planet.rings ? 2.0 : 1);
    this.viewGoal.dist = Math.max(9, sz * 5.2 + 5) * (this.camera.aspect < 1 ? 1.7 : 1);
    this.viewGoal.pitch = 0.28;
    if (instant) { this.updateBodies(0); this.focus.copy(this.worldPos(b)); Object.assign(this.view, this.viewGoal); }
  }
  nearestYaw(y) { const k = Math.round((this.view.yaw - y) / (Math.PI * 2)); return y + k * Math.PI * 2; }
  worldPos(b) { return b.holder.getWorldPosition(new THREE.Vector3()); }

  // screen-space room taken by the side panel (px): the view slides so the focus stays visible
  setInset(x, y = 0) { this.insetGoal.x = x; this.insetGoal.y = y; }

  // pointer helpers (called by the UI layer)
  drag(dx, dy) {
    this.viewGoal.yaw -= dx * 0.005;
    this.viewGoal.pitch = Math.max(0.05, Math.min(1.45, this.viewGoal.pitch + dy * 0.004));
  }
  zoom(f) {
    const min = this.follow ? 6 : 25, max = this.follow ? 90 : 420;
    this.viewGoal.dist = Math.max(min, Math.min(max, this.viewGoal.dist * f));
  }
  pick(nx, ny) {
    this.raycaster.setFromCamera(new THREE.Vector2(nx, ny), this.camera);
    const hit = this.raycaster.intersectObjects(this.hits, false)[0];
    return hit ? hit.object.userData.wi : null;
  }
  hoverAt(nx, ny) {
    const wi = this.pick(nx, ny);
    this.setHover(wi == null ? null : this.bodies.find((b) => b.wi === wi));
    return wi;
  }

  // ------------------------------------------------------------- frame
  updateBodies(dt) {
    for (const b of this.bodies) {
      if (b.speed) {
        // the focused planet slows to a crawl so it's easy to look at
        b.angle += dt * b.speed * (this.follow === b ? 0.15 : 1);
        b.holder.position.set(Math.cos(b.angle) * b.layout.r, 0, Math.sin(b.angle) * b.layout.r);
      }
    }
  }
  update(dt) {
    this.t += dt;
    tickPlanets(this.t);
    tickShaders(this.t);
    this.updateBodies(dt);
    for (const b of this.bodies) {
      b.group.userData.update && b.group.userData.update(this.t, this.camera);
      const hov = this.hover === b || this.selected === b;
      const k = hov ? 1.12 : 1;
      const s = b.group.scale.x / b.layout.size;
      b.group.scale.setScalar(b.layout.size * (s + (k - s) * Math.min(1, dt * 10)));
      if (b.orbit) b.orbit.material.opacity += ((hov ? 0.55 : this.currentSystem === b.sys ? 0.16 : 0.07) - b.orbit.material.opacity) * Math.min(1, dt * 6);
    }
    if (this.belt) this.belt.userData.update(this.t);
    if (this.vesperStar) this.vesperStar.rotation.y = this.t * 0.03;
    // camera easing
    if (this.follow) this.focusGoal.copy(this.worldPos(this.follow));
    const e = Math.min(1, dt * 4);
    this.focus.lerp(this.focusGoal, e);
    this.view.yaw += (this.viewGoal.yaw - this.view.yaw) * e;
    this.view.pitch += (this.viewGoal.pitch - this.view.pitch) * e;
    this.view.dist += (this.viewGoal.dist - this.view.dist) * e;
    const { yaw, pitch, dist } = this.view;
    this.camera.position.set(this.focus.x + Math.sin(yaw) * Math.cos(pitch) * dist, this.focus.y + Math.sin(pitch) * dist, this.focus.z + Math.cos(yaw) * Math.cos(pitch) * dist);
    this.camera.lookAt(this.focus);
    this.inset.x += (this.insetGoal.x - this.inset.x) * e;
    this.inset.y += (this.insetGoal.y - this.inset.y) * e;
    const c = this.gl.domElement, w = c.clientWidth || window.innerWidth, h = c.clientHeight || window.innerHeight;
    if (Math.abs(this.inset.x) > 0.5 || Math.abs(this.inset.y) > 0.5) this.camera.setViewOffset(w, h, this.inset.x / 2, this.inset.y / 2, w, h);
    else this.camera.clearViewOffset();
    this.placeLabels();
  }
  placeLabels() {
    if (!this.labelRoot || !this.labelRoot.clientWidth) return;
    const W = this.labelRoot.clientWidth, H = this.labelRoot.clientHeight;
    const v = new THREE.Vector3();
    for (const b of this.bodies) {
      if (!b.label) continue;
      const p = this.worldPos(b);
      // label sits just below the planet
      v.copy(p).add(new THREE.Vector3(0, -b.layout.size * (b.world.planet.rings ? 1.3 : 1.15), 0)).project(this.camera);
      const behind = v.z > 1;
      const x = (v.x * 0.5 + 0.5) * W, y = (-v.y * 0.5 + 0.5) * H;
      const dist = p.distanceTo(this.camera.position);
      // fade labels that are far away in the other system
      const far = this.follow ? (b === this.follow ? 1 : Math.max(0, 1 - dist / 140)) : Math.max(0, Math.min(1, 1.6 - dist / 260));
      b.sx = x; b.sy = y; b.vis = !behind && far >= 0.25; b.dist = dist;
      b.label.style.transform = `translate(-50%, 0) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      b.label.style.opacity = behind ? 0 : (b === this.hover || b === this.selected ? 1 : far).toFixed(2);
      b.label.style.pointerEvents = behind || far < 0.25 ? 'none' : 'auto';
      b.label.style.zIndex = String(1000 - Math.round(dist));
    }
    // nudge overlapping labels apart (nearest planet keeps its spot)
    const placed = [];
    for (const b of [...this.bodies].filter((q) => q.label && q.vis).sort((a, c) => a.dist - c.dist)) {
      const w = b.labelW || (b.labelW = b.label.offsetWidth || 90), hh = 24;
      let y = b.sy;
      for (let k = 0; k < 4; k++) {
        const hit = placed.find((r) => Math.abs(r.x - b.sx) < (r.w + w) / 2 + 4 && Math.abs(r.y - y) < hh);
        if (!hit) break;
        y = hit.y + hh;
      }
      placed.push({ x: b.sx, y, w });
      if (y !== b.sy) b.label.style.transform = `translate(-50%, 0) translate(${b.sx.toFixed(1)}px, ${y.toFixed(1)}px)`;
    }
    for (const s of this.sysLabels || []) {
      v.copy(SYS_POS[s.sys]).add(new THREE.Vector3(0, 16, 0)).project(this.camera);
      const x = (v.x * 0.5 + 0.5) * W, y = (-v.y * 0.5 + 0.5) * H;
      const show = !this.follow && v.z < 1;
      s.el.style.transform = `translate(-50%, -50%) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      s.el.style.opacity = show ? (this.currentSystem === s.sys ? 0.9 : 0.45) : 0;
    }
  }
  resize() {
    const c = this.gl.domElement;
    const w = c.clientWidth || window.innerWidth, h = c.clientHeight || window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.fov = w / h < 1 ? 60 : 42;          // portrait phones see the whole system
    this.camera.updateProjectionMatrix();
    this.composer.setPixelRatio(Math.min(1, this.gl.getPixelRatio()));
    this.composer.setSize(w, h);
  }
  render() {
    if (this.useBloom) this.composer.render();
    else this.gl.render(this.scene, this.camera);
  }
  compile() { try { this.gl.compile(this.scene, this.camera); } catch { /* best effort */ } }
}

function orbitLine(r, color) {
  const pts = [];
  for (let i = 0; i <= 160; i++) { const a = (i / 160) * Math.PI * 2; pts.push(new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r)); }
  return new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.16, depthWrite: false }));
}
function nebulaSprite(color, scale, opacity) {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const g = c.getContext('2d');
  const col = new THREE.Color(color), rgb = `${(col.r * 255) | 0},${(col.g * 255) | 0},${(col.b * 255) | 0}`;
  const rng = makeRng(Math.round(color / 977));
  for (let i = 0; i < 30; i++) {
    const x = 128 + (rng.next() - 0.5) * 120, y = 128 + (rng.next() - 0.5) * 120, r = 30 + rng.next() * 90;
    const grd = g.createRadialGradient(x, y, 0, x, y, r);
    grd.addColorStop(0, `rgba(${rgb},0.16)`); grd.addColorStop(1, `rgba(${rgb},0)`);
    g.fillStyle = grd; g.fillRect(0, 0, 256, 256);
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity }));
  s.scale.setScalar(scale);
  return s;
}
