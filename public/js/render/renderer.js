// Three.js renderer for gameplay: builds meshes for a level and syncs them to
// the LevelSim every frame. Fixed side-view perspective camera (2.5D).
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { WORLDS } from '../core/config.js';
import { Robot } from './robot.js';
import { FX, Weather } from './fx.js';
import { mat, makeMoverMesh, rockGeo } from './vehicles.js';
import { buildBackdrop, gearMesh } from './decor.js';
import { glowTexture, stripeTexture, windowTexture } from './textures.js';
import { tickShaders, releaseShader, chaserMaterial } from './shaders.js';
import { phaseOf } from '../core/sim.js';

const CHASER_COLORS = {
  sun: [0xff3a00, 0xffd060], mercury: [0xffffff, 0xffe8b0], venus: [0x7aff20, 0xe0ff80], earth: [0xff3030, 0xffd040],
  mars: [0xb04a20, 0xffa060], asteroids: [0x8a6a50, 0xffa060], jupiter: [0xc06030, 0xffd0a0], saturn: [0xe0c080, 0xffffff],
  uranus: [0x60e0ff, 0xffffff], neptune: [0x3060ff, 0xb0e0ff], prismara: [0xff40d0, 0x80c0ff], mechanus: [0xff8a20, 0xffe0a0],
  biolumina: [0x30ffa0, 0xff60e0], chronos: [0x8040ff, 0xffd060], blackhole: [0x200030, 0xff7a20], aerolis: [0x7af0ff, 0xffffff], velocitar: [0xff3ad8, 0x3ad8ff],
};

const DEPTH = 3;
const WARP_COLORS = [0xffffff, 0x5aff8a, 0x6ad8ff, 0xff5ad8];

const glowMat = (c, i = 2) => mat(c, { emissive: c, emissiveIntensity: i });
const addMesh = (parent, geo, material, x = 0, y = 0, z = 0, shadow = true) => {
  const m = new THREE.Mesh(geo, material);
  m.position.set(x, y, z);
  m.castShadow = shadow; m.receiveShadow = true;
  parent.add(m);
  return m;
};
const additive = (color, opacity = 0.8) => new THREE.MeshBasicMaterial({ color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false });

export class Renderer {
  constructor(container, opts = {}) {
    this.container = container;
    this.opts = opts;
    const r = this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: !!opts.test });
    r.toneMapping = THREE.ACESFilmicToneMapping;
    r.toneMappingExposure = 0.8;
    r.outputColorSpace = THREE.SRGBColorSpace;
    r.shadowMap.enabled = true;
    r.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(r.domElement);
    r.domElement.id = 'game-canvas';

    this.scene = new THREE.Scene();
    // soft studio reflections so glossy/metal surfaces (robot, mercury, ice) read well
    const pmrem = new THREE.PMREMGenerator(r);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    r.__env = this.scene.environment;   // shared with cutscene scenes
    this.scene.environmentIntensity = 0.28;
    this.camera = new THREE.PerspectiveCamera(38, 16 / 9, 0.5, 2500);
    this.hemi = new THREE.HemisphereLight(0xffffff, 0x404040, 1.1);
    this.scene.add(this.hemi);
    this.sun = new THREE.DirectionalLight(0xffffff, 2.6);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(2048, 2048);
    const sc = this.sun.shadow.camera;
    sc.left = -30; sc.right = 30; sc.top = 22; sc.bottom = -22; sc.near = 1; sc.far = 120;
    this.sun.shadow.bias = -0.0004;
    this.sun.shadow.normalBias = 0.03;
    this.scene.add(this.sun, this.sun.target);
    // under-light: the glow of lava / plasma below lighting platforms from beneath
    this.under = new THREE.DirectionalLight(0xff7a20, 0);
    this.under.position.set(0, -1, 0.4);
    this.scene.add(this.under);
    this.rim = new THREE.DirectionalLight(0x88aaff, 0.8);
    this.rim.position.set(-20, 10, -20);
    this.scene.add(this.rim);
    // a soft light that travels with the hero so it always pops
    this.heroLight = new THREE.PointLight(0xffffff, 1.6, 7, 2);
    this.scene.add(this.heroLight);

    this.robot = new Robot(opts.skin || 'classic');
    this.scene.add(this.robot.root);
    this.fx = new FX(this.scene);
    this.weather = new Weather(this.scene);
    this.blob = new THREE.Mesh(new THREE.CircleGeometry(0.5, 24), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.3, depthWrite: false }));
    this.blob.rotation.x = -Math.PI / 2;
    this.scene.add(this.blob);

    this.composer = new EffectComposer(r);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloom = new UnrealBloomPass(new THREE.Vector2(512, 512), 0.35, 0.5, 0.92);
    this.composer.addPass(this.bloom);
    this.composer.addPass(new OutputPass());

    this.level = null;
    this.levelGroup = null;
    this.cam = { x: 0, y: 0 };
    this.shake = 0;
    this.quality = 'high';
    this.setQuality(opts.quality || 'high');
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  setQuality(q) {
    this.quality = q;
    const pr = q === 'low' ? 1 : Math.min(window.devicePixelRatio || 1, q === 'high' ? 2 : 1.5);
    this.renderer.setPixelRatio(pr);
    this.renderer.shadowMap.enabled = q !== 'low';
    this.sun.shadow.mapSize.set(q === 'high' ? 2048 : 1024, q === 'high' ? 2048 : 1024);
    if (this.sun.shadow.map) { this.sun.shadow.map.dispose(); this.sun.shadow.map = null; }
    this.useBloom = q !== 'low';
    this.resize();
  }

  resize() {
    const w = this.container.clientWidth || window.innerWidth, h = this.container.clientHeight || window.innerHeight;
    this.renderer.setSize(w, h);
    this.composer.setSize(w, h);
    this.camera.aspect = w / h;
    // pull the camera back on narrow/portrait screens so ~20 units stay visible
    this.camera.fov = 38;
    const halfTan = Math.tan(THREE.MathUtils.degToRad(19));
    this.camDist = Math.min(46, Math.max(18.5, 20 / (2 * halfTan * this.camera.aspect)));
    this.camera.updateProjectionMatrix();
  }

  // ------------------------------------------------------------------ build
  disposeLevel() {
    if (!this.levelGroup) return;
    this.scene.remove(this.levelGroup);
    this.levelGroup.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
      for (const m of mats) {
        releaseShader(m);
        if (m.userData.shared) continue;
        if (m.map) m.map.dispose();
        if (m.emissiveMap && m.emissiveMap !== m.map) m.emissiveMap.dispose();
      }
    });
    this.levelGroup = null;
    this.fx.clear();
  }

  loadLevel(level) {
    this.disposeLevel();
    this.level = level;
    const W = this.W = WORLDS[level.worldIndex];
    const G = this.levelGroup = new THREE.Group();
    this.scene.add(G);

    this.scene.fog = new THREE.FogExp2(W.fog, W.fogDensity);
    this.baseFog = W.fogDensity;
    this.hemi.color.setHex(W.light); this.hemi.groundColor.setHex(W.ambient);
    this.sun.color.setHex(W.light);
    this.sun.intensity = W.id === 'biolumina' ? 1.1 : 1.9;
    this.hemi.intensity = W.id === 'biolumina' || W.id === 'chronos' ? 0.65 : 0.85;
    this.bloom.strength = W.id === 'sun' ? 0.6 : ['biolumina', 'prismara', 'chronos', 'blackhole', 'velocitar'].includes(W.id) ? 0.75 : 0.45;
    const underLight = { sun: [0xff8a30, 1.6], mars: [0xff6a20, 0.5], venus: [0xa0ff40, 0.4], biolumina: [0x30ffc0, 0.8], mercury: [0xd0d8e0, 0.4] }[W.id];
    this.under.color.setHex(underLight ? underLight[0] : 0xffffff);
    this.under.intensity = underLight ? underLight[1] : 0;
    if (W.id === 'sun') { this.hemi.groundColor.setHex(0xff5a10); this.hemi.intensity = 0.95; this.sun.intensity = 1.5; }

    this.backdrop = buildBackdrop(level);
    G.add(this.backdrop.group);
    this.weather.set(W.id, { redSpot: level.redSpot });

    this.solidMeshes = level.solids.map((s) => this.makeSolid(s, W, level));
    for (const m of this.solidMeshes) G.add(m);

    this.moverMeshes = level.movers.map((m, i) => {
      const g = makeMoverMesh(m, W, level.location, i);
      G.add(g);
      return g;
    });
    this.gearMeshes = level.gears.map((gd) => {
      const g = new THREE.Group();
      g.position.set(gd.x, gd.y, -1.9);
      const gear = gearMesh(gd.r * 0.55, mat(0x9a7a40, { metalness: 0.85, roughness: 0.3 }));
      gear.position.z = -0.4;
      g.add(gear);
      const n = 4;
      for (let i = 0; i < n; i++) {
        const arm = addMesh(g, new THREE.BoxGeometry(gd.r, 0.25, 0.25), mat(0x6a5030, { metalness: 0.8 }), 0, 0, 0);
        arm.geometry.translate(gd.r / 2, 0, 0);
        arm.userData.base = (i * Math.PI * 2) / n;
      }
      G.add(g);
      return g;
    });
    this.mirrorMeshes = level.mirrors.map((mm) => {
      const g = new THREE.Group();
      addMesh(g, new THREE.BoxGeometry(0.08, 9, DEPTH + 0.4), additive(0xe0d0ff, 0.35), mm.x, mm.y + 1, 0, false);
      addMesh(g, new THREE.OctahedronGeometry(0.5), glowMat(0xff7af0), mm.x, mm.y + 5.8, 0);
      addMesh(g, new THREE.OctahedronGeometry(0.5), glowMat(0xff7af0), mm.x, mm.y - 3.6, 0);
      G.add(g);
      return g;
    });

    // tower backdrops: a tall themed wall behind zig-zag climbs
    for (const tw of level.towers) {
      // open scaffold: two pillars + cross beams + a faint tinted glass panel
      const h = tw.y1 - tw.y0;
      const beam = mat(W.plat, { roughness: 0.4, metalness: 0.6 });
      for (const px of [tw.x, tw.x + tw.w]) addMesh(G, new RoundedBoxGeometry(0.6, h, 0.6, 2, 0.2), beam, px, tw.y0 + h / 2, -2.4);
      for (let y = tw.y0 + 3; y < tw.y1; y += 3.2) {
        addMesh(G, new THREE.BoxGeometry(tw.w, 0.18, 0.25), beam, tw.x + tw.w / 2, y, -2.4, false);
        addMesh(G, new THREE.BoxGeometry(tw.w, 0.05, 0.05), glowMat(W.accent, 1.4), tw.x + tw.w / 2, y + 0.12, -2.25, false);
      }
      addMesh(G, new THREE.PlaneGeometry(tw.w, h), new THREE.MeshBasicMaterial({ color: W.accent, transparent: true, opacity: 0.06, depthWrite: false }), tw.x + tw.w / 2, tw.y0 + h / 2, -2.6, false);
    }
    // chaser wall
    if (level.chaser) {
      const [a, b] = CHASER_COLORS[W.id];
      const g = new THREE.Group();
      const H = level.bounds.maxY - level.floor.y + 40;
      const plane = new THREE.Mesh(new THREE.PlaneGeometry(26, H, 1, 1), chaserMaterial(a, b));
      plane.position.set(-13, H / 2 - 10, 0.5);
      g.add(plane);
      const plane2 = plane.clone(); plane2.position.z = -3; plane2.scale.x = 1.2; g.add(plane2);
      const light = new THREE.PointLight(b, 30, 30, 1.6);
      light.position.set(-2, 0, 3);
      g.add(light);
      g.userData = { light };
      g.position.y = level.floor.y;
      g.visible = false;
      G.add(g);
      this.chaserMesh = g;
    } else this.chaserMesh = null;
    this.hazardMeshes = level.hazards.map((h) => {
      const m = this.makeHazard(h, W);
      if (m) G.add(m);
      return m;
    });
    this.meteorMeshes = level.meteors.map((md) => {
      const g = new THREE.Group();
      const drip = md.style === 'drip';
      const rock = drip
        ? addMesh(g, new THREE.SphereGeometry(md.r, 16, 12), mat(0x9aff30, { emissive: 0x6ac010, emissiveIntensity: 1.5, transparent: true, opacity: 0.85 }))
        : addMesh(g, rockGeo(md.r * 2, md.r * 2, md.r * 2, 3), mat(0x5a3a2a, { emissive: 0xff4010, emissiveIntensity: 0.6, flatShading: true }));
      if (drip) rock.scale.y = 1.5;
      const trail = addMesh(g, new THREE.ConeGeometry(md.r * 0.9, drip ? 2 : 5, 12, 1, true), additive(drip ? 0x9aff30 : 0xff8030, drip ? 0.4 : 0.7), 0, 0, 0, false);
      trail.geometry.translate(0, 2.5, 0);
      trail.rotation.z = Math.atan2(md.drift, md.y0 - md.y1);
      const marker = addMesh(G, new THREE.RingGeometry(0.6, 0.9, 24), additive(drip ? 0x9aff30 : 0xff3020, 0.8), md.x, md.y1 + 0.03, 0, false);
      marker.rotation.x = -Math.PI / 2;
      g.userData = { rock, marker };
      G.add(g);
      return g;
    });
    this.launcherMeshes = level.launchers.map((l) => this.makeLauncher(l, W));
    for (const m of this.launcherMeshes) G.add(m);
    this.windMeshes = level.winds.map((w) => this.makeWind(w));
    for (const m of this.windMeshes) G.add(m);
    this.gravMeshes = level.gravZones.map((z) => {
      const m = addMesh(G, new THREE.BoxGeometry(z.w, z.h, 0.1), new THREE.MeshBasicMaterial({ color: 0x5aa0ff, transparent: true, opacity: 0.12, depthWrite: false }), z.x + z.w / 2, z.y + z.h / 2, -1.7, false);
      const pts = new Float32Array(60 * 3);
      for (let i = 0; i < 60; i++) { pts[i * 3] = z.x + Math.random() * z.w; pts[i * 3 + 1] = z.y + Math.random() * z.h; pts[i * 3 + 2] = (Math.random() - 0.5) * 3; }
      const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pts, 3));
      const p = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0x9ad0ff, size: 4, sizeAttenuation: false, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false }));
      G.add(p);
      m.userData.points = p;
      return m;
    });
    // swing ropes: Bio-Lumina vines, plus a themed rope in every other world
    const ROPE = {
      sun: { rope: 0xff7a20, glow: 1.6, knob: 0xffc040, tip: 0xfff0a0, deco: 'sparks' },
      mercury: { rope: 0x9aa0a8, metal: true, knob: 0x6a6e76, tip: 0xffd04a, deco: 'hook' },
      venus: { rope: 0xb07a3a, metal: true, knob: 0x6a4020, tip: 0xc8d030, deco: 'chain' },
      earth: { rope: 0x30343a, metal: true, knob: 0xf2c200, tip: 0xf2c200, deco: 'hook' },
      mars: { rope: 0x8a8a90, metal: true, knob: 0xe8e2d4, tip: 0xff8a40, deco: 'hook' },
      asteroids: { rope: 0x5ad8ff, glow: 1.2, knob: 0xd8dde6, tip: 0x5ad8ff, deco: 'sat' },
      jupiter: { rope: 0xf0dcc0, knob: 0xd8b088, tip: 0xffffff, deco: 'cloud' },
      saturn: { rope: 0xcfe8ff, glow: 0.5, knob: 0xe8e0d0, tip: 0xffffff, deco: 'ice' },
      uranus: { rope: 0x8ae8f0, glow: 0.4, knob: 0xc8f8ff, tip: 0xe8ffff, deco: 'ice' },
      neptune: { rope: 0x2a5ad0, glow: 0.8, knob: 0x1a2a6a, tip: 0x9ac8ff, deco: 'sparks' },
      prismara: { rope: 0xff7af0, glow: 1.8, knob: 0xc8b0ff, tip: 0xffffff, deco: 'crystal' },
      mechanus: { rope: 0x9a7a40, metal: true, knob: 0x6a5030, tip: 0xffb040, deco: 'chain' },
      biolumina: { rope: 0x2a8a4a, knob: 0x1a4a2a, tip: 0xff5ad0, deco: 'leaves' },
      chronos: { rope: 0xd8b040, metal: true, knob: 0xf0e8d0, tip: 0xffd86a, deco: 'chain' },
      blackhole: { rope: 0xb08aff, glow: 1.6, knob: 0x2a1a4a, tip: 0xffb040, deco: 'sparks' },
      aerolis: { rope: 0xff9ad8, glow: 1.0, knob: 0xf0f4ff, tip: 0x7af0ff, deco: 'crystal' },
      velocitar: { rope: 0xff3ad8, glow: 2.0, knob: 0x1a1a3a, tip: 0x3ad8ff, deco: 'sparks' },
    };
    const RS = ROPE[W.id] || ROPE.biolumina;
    this.vineMeshes = level.vines.map((v) => {
      const g = new THREE.Group();
      g.position.set(v.ax, v.ay, 0);
      addMesh(G, new THREE.SphereGeometry(0.55, 14, 10), mat(RS.knob, { roughness: RS.metal ? 0.3 : 1, metalness: RS.metal ? 0.8 : 0 }), v.ax, v.ay, 0);
      const ropeMat = RS.glow ? glowMat(RS.rope, RS.glow) : mat(RS.rope, { roughness: RS.metal ? 0.35 : 0.8, metalness: RS.metal ? 0.8 : 0 });
      if (RS.deco === 'chain') {
        for (let k = 0; k < Math.floor(v.len / 0.42); k++) {
          const link = addMesh(g, new THREE.TorusGeometry(0.16, 0.05, 6, 12), ropeMat, 0, -0.25 - k * 0.42, 0);
          link.rotation.y = k % 2 ? Math.PI / 2 : 0;
          link.scale.y = 1.5;
        }
      } else {
        addMesh(g, new THREE.CylinderGeometry(RS.glow ? 0.07 : 0.09, RS.glow ? 0.07 : 0.12, v.len, 8), ropeMat, 0, -v.len / 2, 0).castShadow = true;
      }
      if (RS.deco === 'leaves') for (let k = 1; k < 6; k++) addMesh(g, new THREE.SphereGeometry(0.22, 6, 4), glowMat(0x3affa0, 0.6), (k % 2 ? 0.18 : -0.18), -v.len * (k / 6), 0).scale.set(1.6, 0.6, 0.8);
      if (RS.deco === 'sparks' || RS.deco === 'crystal') for (let k = 1; k < 5; k++) addMesh(g, RS.deco === 'crystal' ? new THREE.OctahedronGeometry(0.16) : new THREE.SphereGeometry(0.1, 6, 4), glowMat(RS.tip, 2.5), 0, -v.len * (k / 5), 0);
      if (RS.deco === 'ice') for (let k = 1; k < 5; k++) addMesh(g, new THREE.ConeGeometry(0.08, 0.35, 5), glowMat(RS.tip, 0.6), 0.1, -v.len * (k / 5), 0).rotation.z = Math.PI;
      if (RS.deco === 'hook') {
        const hook = addMesh(g, new THREE.TorusGeometry(0.28, 0.07, 8, 16, Math.PI * 1.4), mat(0xd0b040, { metalness: 0.9, roughness: 0.25 }), 0, -v.len - 0.25, 0);
        hook.rotation.z = Math.PI * 0.8;
      } else if (RS.deco === 'sat') {
        addMesh(g, new THREE.BoxGeometry(0.5, 0.4, 0.4), mat(0xd8dde6, { metalness: 0.7 }), 0, -v.len, 0);
        addMesh(g, new THREE.BoxGeometry(1.4, 0.04, 0.5), mat(0x2a3a8a, { metalness: 0.6 }), 0, -v.len, 0);
      } else addMesh(g, new THREE.SphereGeometry(0.25, 10, 8), glowMat(RS.tip, 2), 0, -v.len, 0);
      G.add(g);
      return g;
    });
    // zip lines: a taut cable with posts at both ends
    this.zipMeshes = (level.zips || []).map((z) => {
      const g = new THREE.Group();
      const len = Math.hypot(z.x1 - z.x0, z.y1 - z.y0);
      const cable = addMesh(g, new THREE.CylinderGeometry(0.05, 0.05, len, 6), RS.glow ? glowMat(RS.rope, 1.2) : mat(0x2a2e36, { metalness: 0.8, roughness: 0.3 }), (z.x0 + z.x1) / 2, (z.y0 + z.y1) / 2, 0, false);
      cable.rotation.z = Math.atan2(z.y1 - z.y0, z.x1 - z.x0) - Math.PI / 2;
      for (const [x, y] of [[z.x0, z.y0], [z.x1, z.y1]]) {
        addMesh(g, new THREE.CylinderGeometry(0.12, 0.16, 1.2, 8), mat(0x6a7078, { metalness: 0.7 }), x, y + 0.2, -0.3);
        addMesh(g, new THREE.SphereGeometry(0.2, 10, 8), glowMat(W.accent, 1.5), x, y + 0.85, -0.3);
      }
      const trolley = addMesh(g, new THREE.TorusGeometry(0.22, 0.07, 8, 16), mat(0xd0d6e0, { metalness: 0.9 }), z.x0, z.y0, 0);
      g.userData = { trolley, z };
      G.add(g);
      return g;
    });
    // launch barrels / pods, themed per world
    this.barrelMeshes = (level.barrels || []).map((br) => {
      const g = new THREE.Group();
      g.position.set(br.x, br.y, 0);
      const aim = new THREE.Group(); g.add(aim);
      const bodyCol = { biolumina: 0x3a8a4a, mechanus: 0x8a6a3a, sun: 0x3a3f4a, earth: 0xd0201c, prismara: 0xb08aff }[W.id] || 0x5a6070;
      const body = addMesh(aim, new THREE.CylinderGeometry(0.75, 0.9, 1.9, 24, 1, true), mat(bodyCol, { metalness: 0.5, roughness: 0.35, side: THREE.DoubleSide }), 0.35, 0, 0);
      body.rotation.z = -Math.PI / 2;
      addMesh(aim, new THREE.TorusGeometry(0.78, 0.09, 8, 28), glowMat(W.accent, 2), 1.3, 0, 0).rotation.y = Math.PI / 2;
      addMesh(aim, new THREE.TorusGeometry(0.92, 0.08, 8, 28), mat(0x2a2e36, { metalness: 0.8 }), -0.55, 0, 0).rotation.y = Math.PI / 2;
      addMesh(aim, new THREE.CircleGeometry(0.85, 24), mat(0x1a1d24), -0.6, 0, 0).rotation.y = Math.PI / 2;
      const arrow = addMesh(aim, new THREE.ConeGeometry(0.25, 0.5, 12), glowMat(0xffffff, 1.5), 1.9, 0, 0);
      arrow.rotation.z = -Math.PI / 2;
      addMesh(g, new THREE.SphereGeometry(0.4, 12, 10), mat(0x3a3f4a, { metalness: 0.8 }), 0, 0, -0.8);
      g.userData = { aim, def: br };
      G.add(g);
      return g;
    });
    // fling rings: glowing hoops with an arrow showing the launch direction
    this.ringMeshes = (level.rings || []).map((rg) => {
      const g = new THREE.Group();
      g.position.set(rg.x, rg.y, 0);
      const hoop = addMesh(g, new THREE.TorusGeometry(rg.r, 0.14, 12, 40), glowMat(W.id === 'velocitar' ? 0x3ad8ff : 0x7af0ff, 2.2), 0, 0, 0, false);
      const inner = addMesh(g, new THREE.CircleGeometry(rg.r * 0.95, 32), additive(0xffffff, 0.12), 0, 0, 0, false);
      const arrow = new THREE.Group(); arrow.rotation.z = rg.angle; g.add(arrow);
      for (let k = 0; k < 3; k++) { const c = addMesh(arrow, new THREE.ConeGeometry(0.22, 0.45, 10), glowMat(0xffffff, 2), 0.2 + k * 0.45, 0, 0, false); c.rotation.z = -Math.PI / 2; }
      g.userData = { hoop, inner, def: rg };
      G.add(g);
      return g;
    });
    // wrecking balls / swinging hammers
    this.wreckerMeshes = level.hazards.map((h) => {
      if (h.type !== 'wrecker') return null;
      const g = new THREE.Group();
      const r = h.w / 2;
      const ball = addMesh(g, new THREE.SphereGeometry(r, 24, 16), mat(0x2a2e36, { metalness: 0.85, roughness: 0.3 }), 0, 0, 0);
      for (let k = 0; k < 10; k++) {
        const v = new THREE.Vector3(Math.sin(k * 2.4) * Math.cos(k), Math.cos(k * 1.7), Math.sin(k)).normalize();
        const sp = addMesh(ball, new THREE.ConeGeometry(r * 0.22, r * 0.6, 8), mat(0x8a909a, { metalness: 0.9 }), v.x * r, v.y * r, v.z * r);
        sp.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), v);
      }
      addMesh(G, new THREE.SphereGeometry(0.4, 12, 10), mat(0x3a3f4a, { metalness: 0.8 }), h.rope.px, h.rope.py, 0);
      const chain = addMesh(G, new THREE.CylinderGeometry(0.07, 0.07, 1, 6), mat(0x6a6e76, { metalness: 0.8 }), 0, 0, 0, false);
      g.userData = { chain, def: h };
      G.add(g);
      return g;
    });
    // pendulum platform ropes
    this.ropeMeshes = level.movers.map((m) => {
      if (!m.rope) return null;
      addMesh(G, new THREE.SphereGeometry(0.4, 12, 10), mat(RS.knob, { metalness: 0.6 }), m.rope.px, m.rope.py, 0);
      const line = addMesh(G, new THREE.CylinderGeometry(0.06, 0.06, 1, 6), RS.glow ? glowMat(RS.rope, 1.2) : mat(RS.rope, { metalness: RS.metal ? 0.8 : 0, roughness: 0.4 }), 0, 0, 0, false);
      return line;
    });
    // rotating beams
    this.sweepMeshes = (level.sweepers || []).map((d) => {
      const g = new THREE.Group();
      g.position.set(d.cx, d.cy, 0);
      addMesh(G, new THREE.CylinderGeometry(0.6, 0.6, 1.2, 20), mat(0x3a3f4a, { metalness: 0.8 }), d.cx, d.cy, -0.4).rotation.x = Math.PI / 2;
      const lo = d.both ? -d.len : 0;
      const beam = addMesh(g, new THREE.CylinderGeometry(d.width / 2, d.width / 2, d.len - lo, 12, 1, true), additive(W.id === 'prismara' ? 0xff7af0 : 0xff5a3a, 0.85), (d.len + lo) / 2, 0, 0, false);
      beam.rotation.z = Math.PI / 2;
      const core = addMesh(g, new THREE.CylinderGeometry(d.width / 5, d.width / 5, d.len - lo, 8, 1, true), additive(0xffffff, 1), (d.len + lo) / 2, 0, 0, false);
      core.rotation.z = Math.PI / 2;
      G.add(g);
      return g;
    });
    this.bridgeMeshes = level.bridges.map((b) => {
      const g = new THREE.Group();
      const ghost = addMesh(g, new THREE.BoxGeometry(b.w, b.h, DEPTH * 0.8), additive(0xffb0ff, 0.25), b.x + b.w / 2, b.y + b.h / 2, 0, false);
      const solid = addMesh(g, new THREE.BoxGeometry(b.w, b.h, DEPTH * 0.8), new THREE.MeshPhysicalMaterial({ color: 0xffd0ff, emissive: 0xff60f0, emissiveIntensity: 0.9, roughness: 0.05, transmission: 0.4, transparent: true, opacity: 0.9 }), b.x + b.w / 2, b.y + b.h / 2, 0);
      solid.visible = false;
      addMesh(g, new THREE.OctahedronGeometry(0.45), glowMat(0xff7af0, 3), b.x - 0.4, b.y + b.h + 0.9, 0);
      g.userData = { ghost, solid };
      G.add(g);
      return g;
    });
    this.enemyMeshes = (level.enemies || []).map((e) => { const m = this.makeEnemy(e, W); G.add(m); return m; });
    this.turretMeshes = (level.turrets || []).map((t) => {
      const g = new THREE.Group();
      g.position.set(t.x, t.y, 0.4);
      const body = addMesh(g, new THREE.SphereGeometry(0.55, 20, 14), mat(0x3a3f50, { metalness: 0.8, roughness: 0.3 }), 0, 0, 0);
      body.scale.set(1, 0.85, 1);
      const barrel = addMesh(g, new THREE.CylinderGeometry(0.18, 0.24, 0.9, 14), mat(0x5a6070, { metalness: 0.9, roughness: 0.25 }), t.dir * 0.55, 0, 0);
      barrel.rotation.z = Math.PI / 2;
      const ring = addMesh(g, new THREE.TorusGeometry(0.2, 0.05, 8, 20), glowMat(0xff4a3a, 2), t.dir * 1.0, 0, 0);
      ring.rotation.y = Math.PI / 2;
      const eye = addMesh(g, new THREE.SphereGeometry(0.14, 12, 10), glowMat(0xff4a3a, 2.5), t.dir * 0.2, 0.18, 0.45);
      g.userData = { ring, eye };
      G.add(g);
      return g;
    });
    this.shotPool = [];
    for (let i = 0; i < 24; i++) {
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 10), glowMat(0xff6a3a, 3));
      const trail = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.01, 1.2, 8, 1, true), additive(0xff8a4a, 0.6));
      trail.rotation.z = Math.PI / 2; trail.position.x = -0.6;
      m.add(trail);
      m.visible = false; m.userData.trail = trail;
      G.add(m);
      this.shotPool.push(m);
    }
    this.doorMeshes = level.doors.map((d) => this.makeDoor(d));
    for (const m of this.doorMeshes) G.add(m);
    this.roadMeshes = level.roads.map((rd) => this.makeRoad(rd, W));
    for (const m of this.roadMeshes) if (m) G.add(m);

    // pickups
    const cellGeo = new THREE.OctahedronGeometry(0.32, 0);
    const cellMat = glowMat(W.id === 'sun' ? 0x5ad8ff : 0x7affd8, 2.2);
    const halo = new THREE.SpriteMaterial({ map: glowTexture(0x7affd8), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.6 });
    halo.userData.shared = false;
    this.pickupMeshes = new Map();
    for (const p of level.pickups) {
      const g = new THREE.Group();
      g.position.set(p.x, p.y, 0);
      if (p.type === 'shard') {
        const star = new THREE.Shape();
        for (let k = 0; k < 10; k++) {
          const a = (k / 10) * Math.PI * 2 + Math.PI / 2, r = k % 2 ? 0.22 : 0.5;
          if (k === 0) star.moveTo(Math.cos(a) * r, Math.sin(a) * r); else star.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        }
        const geo = new THREE.ExtrudeGeometry(star, { depth: 0.16, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05, bevelSegments: 2 });
        geo.center();
        addMesh(g, geo, mat(0xffd84a, { metalness: 0.9, roughness: 0.15, emissive: 0xffa010, emissiveIntensity: 0.8 }), 0, 0, 0);
        const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(0xffd84a), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.8 }));
        s.scale.setScalar(2.4); g.add(s);
        g.userData.shard = true;
      } else if (p.type === 'cell') {
        const m = addMesh(g, cellGeo, cellMat, 0, 0, 0);
        m.scale.y = 1.5;
        const s = new THREE.Sprite(halo); s.scale.setScalar(1.6); g.add(s);
      } else {
        const red = glowMat(0xff3a5a, 1.5);
        addMesh(g, new THREE.SphereGeometry(0.28, 12, 10), red, -0.2, 0.1, 0);
        addMesh(g, new THREE.SphereGeometry(0.28, 12, 10), red, 0.2, 0.1, 0);
        const c = addMesh(g, new THREE.ConeGeometry(0.4, 0.55, 16), red, 0, -0.22, 0);
        c.rotation.z = Math.PI;
      }
      g.userData.baseY = p.y;
      G.add(g);
      this.pickupMeshes.set(p.id, g);
    }

    // checkpoint + goal
    const cpList = level.checkpoints && level.checkpoints.length ? level.checkpoints : (level.checkpoint ? [level.checkpoint] : []);
    this.checkpointMeshes = cpList.map((c) => {
      const cp = new THREE.Group();
      cp.position.set(c.x, c.y, -0.8);
      addMesh(cp, new THREE.CylinderGeometry(0.08, 0.1, 3, 8), mat(0xd0d6e0, { metalness: 0.7 }), 0, 1.5, 0);
      const orb = addMesh(cp, new THREE.SphereGeometry(0.3, 16, 12), glowMat(0xff8a3a, 2), 0, 3.1, 0);
      const ring = addMesh(cp, new THREE.TorusGeometry(0.55, 0.05, 8, 32), glowMat(0xff8a3a, 2), 0, 3.1, 0);
      cp.userData = { orb, ring };
      G.add(cp);
      return cp;
    });
    this.checkpointMesh = this.checkpointMeshes[0] || null;
    const goal = new THREE.Group();
    goal.position.set(level.goal.x, level.goal.y, 0);
    addMesh(goal, new THREE.CylinderGeometry(1.6, 1.8, 0.3, 32), mat(0xe8ecf2, { metalness: 0.6, roughness: 0.2 }), 0, 0.15, 0);
    const ringG = addMesh(goal, new THREE.TorusGeometry(1.5, 0.16, 12, 48), glowMat(0xffd84a, 2.4), 0, 2.0, 0);
    const disc = addMesh(goal, new THREE.CircleGeometry(1.4, 48), new THREE.MeshBasicMaterial({ map: this.portalTexture(), transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }), 0, 2.0, 0, false);
    const beam = addMesh(goal, new THREE.CylinderGeometry(1.2, 1.2, 30, 24, 1, true), additive(0xffe080, 0.12), 0, 15, 0, false);
    goal.userData = { ringG, disc, beam };
    G.add(goal);
    this.goalMesh = goal;

    this.cam.x = level.spawn.x + 4;
    this.cam.y = level.spawn.y + 1;
    this.shake = 0;
  }

  portalTexture() {
    const c = document.createElement('canvas'); c.width = c.height = 128;
    const g = c.getContext('2d');
    const grd = g.createRadialGradient(64, 64, 4, 64, 64, 64);
    grd.addColorStop(0, '#ffffff'); grd.addColorStop(0.3, '#ffe27a'); grd.addColorStop(0.7, '#ff7a3a'); grd.addColorStop(1, 'rgba(255,80,40,0)');
    g.fillStyle = grd; g.fillRect(0, 0, 128, 128);
    g.strokeStyle = 'rgba(255,255,255,0.6)'; g.lineWidth = 3;
    for (let i = 0; i < 5; i++) { g.beginPath(); g.arc(64, 64, 12 + i * 10, i, i + 3.5); g.stroke(); }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }

  makeSolid(s, W, level) {
    const g = new THREE.Group();
    const top = s.y + s.h;
    const cx = s.x + s.w / 2;
    if (s.style === 'mushroom') {
      addMesh(g, new THREE.CylinderGeometry(0.35, 0.5, s.h, 10), mat(0xe8f0e0), cx, s.y + s.h / 2 - 0.3, 0);
      const cap = addMesh(g, new THREE.SphereGeometry(s.w * 0.62, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), mat(0xff4ad0, { emissive: 0xc02090, emissiveIntensity: 0.8, roughness: 0.4 }), cx, top - 0.35, 0);
      cap.scale.y = 0.7;
      for (let i = 0; i < 5; i++) addMesh(g, new THREE.SphereGeometry(0.12, 6, 4), glowMat(0xffffff, 1.5), cx + Math.cos(i * 1.3) * s.w * 0.4, top - 0.1, Math.sin(i * 1.3) * 0.6);
      g.userData.bouncy = cap;
      return g;
    }
    if (s.style === 'spring') {
      addMesh(g, new THREE.CylinderGeometry(s.w * 0.42, s.w * 0.48, 0.18, 24), mat(0x8a909a, { metalness: 0.8, roughness: 0.3 }), cx, s.y + 0.09, 0);
      const coil = addMesh(g, new THREE.TorusGeometry(s.w * 0.3, 0.05, 8, 24), mat(0xc0c6d0, { metalness: 0.9 }), cx, s.y + 0.25, 0);
      coil.rotation.x = Math.PI / 2;
      const pad = addMesh(g, new THREE.CylinderGeometry(s.w * 0.45, s.w * 0.45, 0.14, 24), glowMat(W.accent, 1.6), cx, top - 0.07, 0);
      g.userData.spring = pad;
      return g;
    }
    if (s.style === 'thin') {
      addMesh(g, new RoundedBoxGeometry(s.w, 0.3, DEPTH * 0.8, 2, 0.1), mat(new THREE.Color(W.plat).multiplyScalar(1.2).getHex(), { roughness: 0.4, metalness: 0.5 }), cx, top - 0.15, 0);
      addMesh(g, new THREE.BoxGeometry(s.w * 0.96, 0.05, 0.05), glowMat(W.accent, 1.0), cx, top - 0.05, DEPTH * 0.4 + 0.02, false);
      return g;
    }
    if (s.style === 'blink') {
      const m = new THREE.MeshPhysicalMaterial({ color: W.accent, emissive: W.accent, emissiveIntensity: 0.5, roughness: 0.1, transmission: 0.3, transparent: true, opacity: 0.85 });
      addMesh(g, new RoundedBoxGeometry(s.w, s.h, DEPTH * 0.85, 2, 0.12), m, cx, s.y + s.h / 2, 0);
      g.userData.blinkMat = m;
      return g;
    }
    if (s.style === 'onoff') {
      const c = s.onoff === 'red' ? 0xff3a4a : 0x3a7aff;
      const solidM = mat(c, { roughness: 0.35, metalness: 0.2, emissive: c, emissiveIntensity: 0.25 });
      const solid = addMesh(g, new RoundedBoxGeometry(s.w, s.h, DEPTH * 0.9, 2, Math.min(0.15, s.w / 5, s.h / 5)), solidM, cx, s.y + s.h / 2, 0);
      const ghost = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(s.w, s.h, DEPTH * 0.9)), new THREE.LineBasicMaterial({ color: c, transparent: true, opacity: 0.55 }));
      ghost.position.set(cx, s.y + s.h / 2, 0);
      g.add(ghost);
      g.userData.onoff = { solid, ghost };
      return g;
    }
    if (s.style === 'button') {
      addMesh(g, new THREE.CylinderGeometry(0.75, 0.85, 0.16, 24), mat(0x3a3f4a, { metalness: 0.7 }), cx, s.y + 0.08, 0);
      const cap = addMesh(g, new THREE.CylinderGeometry(0.55, 0.6, 0.18, 24), glowMat(0xff3a4a, 1.6), cx, s.y + 0.24, 0);
      g.userData.button = cap;
      return g;
    }
    if (s.style === 'wall') {
      addMesh(g, new RoundedBoxGeometry(s.w, s.h, DEPTH, 2, 0.12), mat(W.plat, { roughness: 0.5, metalness: 0.4 }), cx, s.y + s.h / 2, 0);
      addMesh(g, new THREE.BoxGeometry(0.06, s.h * 0.9, 0.04), glowMat(0xffd84a, 1.4), cx, s.y + s.h / 2, DEPTH / 2 + 0.02, false);
      return g;
    }
    if (s.style === 'basin') {
      addMesh(g, new THREE.BoxGeometry(s.w, s.h, DEPTH), mat(0x2a2a30, { roughness: 0.8 }), cx, s.y + s.h / 2, 0);
      return g;
    }
    if (s.style === 'rock' || (W.id === 'asteroids' && s.style === 'block')) {
      const rock = addMesh(g, rockGeo(s.w * 1.08, Math.max(s.h, 2.4), DEPTH + 0.6, Math.round(s.x * 10)), mat(0x5e544a, { roughness: 0.95, flatShading: true }), cx, top - Math.max(s.h, 2.4) / 2, 0);
      rock.scale.y = 1;
      addMesh(g, new THREE.BoxGeometry(s.w, 0.14, DEPTH * 0.9), mat(0x948676, { roughness: 0.9 }), cx, top - 0.07, 0);
      addMesh(g, new THREE.BoxGeometry(s.w * 0.9, 0.06, 0.06), glowMat(W.accent, 1.5), cx, top - 0.25, DEPTH * 0.48, false);
      return g;
    }
    const slab = s.slab;
    const bodyH = s.h;
    let bodyMat;
    if (s.crumble) bodyMat = mat(0x8a7a6a, { roughness: 0.9, flatShading: true });
    else if (s.heat) bodyMat = new THREE.MeshStandardMaterial({ color: 0x2a1a14, roughness: 0.7, emissive: 0xff3a00, emissiveIntensity: 0 });
    else if (s.style === 'bonus') bodyMat = mat(W.accent, { roughness: 0.15, metalness: 0.4, transparent: true, opacity: 0.85, emissive: W.accent, emissiveIntensity: 0.25 });
    else if (s.ice) bodyMat = mat(0xa8ecff, { physical: true, roughness: 0.08, transmission: 0.35, thickness: 1, transparent: true, opacity: 0.9, emissive: 0x104050 });
    else if (W.id === 'earth' && !slab && bodyH > 3) {
      const tex = windowTexture('#ffe7a0', '#3a4252', Math.round(s.x));
      tex.repeat.set(Math.max(1, Math.round(s.w / 3)), Math.max(1, Math.round(bodyH / 6)));
      bodyMat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.6, emissive: 0x403010, emissiveMap: tex, emissiveIntensity: 0.4 });
    } else bodyMat = mat(W.plat, { roughness: 0.55, metalness: W.id === 'mechanus' ? 0.6 : 0.15 });
    const body = addMesh(g, new RoundedBoxGeometry(s.w, bodyH - 0.1, DEPTH, 2, Math.min(0.18, s.w / 6)), bodyMat, cx, s.y + (bodyH - 0.1) / 2, 0);
    body.castShadow = bodyH < 12;
    // top surface + accent strip (the Astro-style "sleek" read)
    // tops are toned down from the palette's near-white so platforms never glare
    const topCol = new THREE.Color(s.ice ? 0xbfe6ee : W.platTop).lerp(new THREE.Color(W.plat), 0.35).multiplyScalar(0.78);
    let topMat = mat(topCol.getHex(), { roughness: s.ice ? 0.1 : 0.55, metalness: s.ice ? 0.3 : 0.05 });
    if (s.style === 'conveyor' || s.style === 'boost') {
      const tex = s.style === 'boost' ? stripeTexture('#ff3ad8', '#10061e') : stripeTexture('#ffb040', '#2a2018');
      tex.repeat.set(s.w / 2, 1);
      topMat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.6 });
      g.userData.belt = tex;
      g.userData.beltSpeed = s.conveyor;
      for (const ex of [s.x + 0.3, s.x + s.w - 0.3]) {
        const roller = addMesh(g, new THREE.CylinderGeometry(0.35, 0.35, DEPTH + 0.1, 12), mat(0x8a8a90, { metalness: 0.9 }), ex, top - 0.35, 0);
        roller.rotation.x = Math.PI / 2;
      }
    }
    addMesh(g, new RoundedBoxGeometry(s.w + 0.06, 0.2, DEPTH + 0.06, 2, 0.07), topMat, cx, top - 0.1, 0);
    addMesh(g, new THREE.BoxGeometry(Math.max(0.2, s.w - 0.4), 0.07, 0.04), glowMat(s.style === 'conveyor' ? 0xffb040 : s.style === 'boost' ? 0x3ad8ff : W.accent, s.style === 'boost' ? 2.2 : 1.0), cx, top - 0.32, DEPTH / 2 + 0.02, false);
    if (!slab && bodyH > 4 && W.id !== 'earth') {
      for (let y = top - 3; y > s.y + 1; y -= 3) addMesh(g, new THREE.BoxGeometry(s.w + 0.02, 0.12, DEPTH + 0.02), mat(0x000000, { transparent: true, opacity: 0.18 }), cx, y, 0, false);
    }
    if (s.style === 'helipad') {
      addMesh(g, new THREE.RingGeometry(1.0, 1.25, 32), glowMat(0xffd23a, 1.2), cx, top + 0.01, 0, false).rotation.x = -Math.PI / 2;
    }
    if (s.crumble) {
      // cracks across the face so the danger reads instantly
      for (let k = 0; k < 3; k++) addMesh(g, new THREE.BoxGeometry(0.05, s.h * 0.7, 0.03), mat(0x2a2018), s.x + s.w * (0.25 + k * 0.25), s.y + s.h * 0.45, DEPTH / 2 + 0.02, false).rotation.z = (k - 1) * 0.5;
      g.userData.crumble = true;
    }
    if (s.heat) g.userData.heatMat = bodyMat;
    if (slab && !s.noPillar) {
      // support pillars behind the vehicle lane
      const floorY = level.floor.y;
      for (const px of [s.x + 0.6, s.x + s.w - 0.6]) {
        const ph = s.y - floorY;
        if (ph > 0.5) addMesh(g, new THREE.BoxGeometry(0.5, ph, 0.3), mat(0x6a7078, { metalness: 0.5 }), px, floorY + ph / 2, -DEPTH / 2 + 0.1);
      }
    }
    return g;
  }

  makeHazard(h, W) {
    if (h.hidden) return null;
    const g = new THREE.Group();
    const cx = h.x + h.w / 2;
    if (h.respawn) {
      const col = { fire: 0xff5010, lava: 0xff4a10, mercury: 0xd0d8e0, water: 0x2a5ad0, acid: 0x9ad020 }[h.type] || 0xff4a10;
      const liquid = h.type === 'mercury'
        ? mat(0xdfe6ee, { metalness: 1, roughness: 0.08 })
        : mat(col, { emissive: col, emissiveIntensity: 1.6, roughness: 0.6 });
      addMesh(g, new THREE.BoxGeometry(h.w + 0.3, h.h, DEPTH - 0.1), liquid, cx, h.y + h.h / 2, 0, false);
      if (h.type === 'fire' || h.type === 'lava') {
        const flames = [];
        for (let i = 0; i < Math.ceil(h.w * 1.5); i++) {
          const f = addMesh(g, new THREE.ConeGeometry(0.28, 1.2, 8, 1, true), additive(i % 2 ? 0xffb030 : 0xff5010, 0.75), h.x + 0.2 + (i / (h.w * 1.5)) * h.w, h.y + h.h + 0.4, (Math.random() - 0.5) * 2, false);
          flames.push(f);
        }
        g.userData.flames = flames;
      }
      return g;
    }
    if (h.pulse && h.type === 'piston') {
      const rod = addMesh(g, new THREE.CylinderGeometry(0.25, 0.25, h.h, 12), mat(0x9a8a6a, { metalness: 0.9, roughness: 0.25 }), cx, h.y + h.h * 1.5, -0.4);
      const head = addMesh(g, new RoundedBoxGeometry(h.w, 1.2, DEPTH - 0.2, 2, 0.15), mat(0x6a5030, { metalness: 0.8, roughness: 0.35 }), cx, h.y + h.h, 0);
      addMesh(head, new THREE.BoxGeometry(h.w * 0.9, 0.14, 0.05), additive(0xff6020, 0.9), 0, -0.45, (DEPTH - 0.2) / 2 + 0.02, false);
      const mark = addMesh(g, new THREE.RingGeometry(h.w * 0.35, h.w * 0.5, 24), additive(0xff6020, 0.7), cx, h.y + 0.03, 0, false);
      mark.rotation.x = -Math.PI / 2;
      g.userData = { piston: head, rod, mark, h };
      return g;
    }
    if (h.pulse) {
      const fromSky = h.type === 'flare' || h.type === 'lightning';
      const colors = { flare: 0xffb030, lightning: 0xb8d8ff, steam: 0xf0f4ff, exhaust: 0xffe0b0 };
      const col = colors[h.type];
      // ground marker / vent
      if (fromSky) {
        const mark = addMesh(g, new THREE.RingGeometry(h.w * 0.35, h.w * 0.55, 24), additive(h.type === 'flare' ? 0xff4020 : 0x80b0ff, 0.9), cx, h.y + 0.03, 0, false);
        mark.rotation.x = -Math.PI / 2;
        g.userData.mark = mark;
      } else {
        addMesh(g, new THREE.CylinderGeometry(h.w * 0.5, h.w * 0.55, 0.25, 16), mat(0x3a3a40, { metalness: 0.7 }), cx, h.y + 0.1, 0);
        addMesh(g, new THREE.CylinderGeometry(h.w * 0.35, h.w * 0.35, 0.27, 16), glowMat(h.type === 'exhaust' ? 0xff8a20 : 0xff5a30, 1.2), cx, h.y + 0.12, 0, false);
      }
      const warn = addMesh(g, new THREE.CylinderGeometry(0.08, 0.08, h.h, 6, 1, true), additive(fromSky ? 0xff3030 : 0xffffff, 0.5), cx, h.y + h.h / 2, 0, false);
      const beamMat = fromSky ? additive(col, 0.85) : new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.55, depthWrite: false });
      const beam = addMesh(g, new THREE.CylinderGeometry(h.w * 0.45, h.w * (fromSky ? 0.55 : 0.3), h.h, 16, 1, true), beamMat, cx, h.y + h.h / 2, 0, false);
      const core = fromSky ? addMesh(g, new THREE.CylinderGeometry(h.w * 0.15, h.w * 0.2, h.h, 8, 1, true), additive(0xffffff, 1), cx, h.y + h.h / 2, 0, false) : null;
      if (h.type === 'lightning') {
        // jagged bolt
        const pts = [];
        for (let i = 0; i <= 14; i++) pts.push(new THREE.Vector3(cx + (Math.random() - 0.5) * 1.4, h.y + h.h * (1 - i / 14), 0));
        pts[pts.length - 1].x = cx;
        const bolt = addMesh(g, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0), 40, 0.12, 5), additive(0xeef6ff, 1), 0, 0, 0, false);
        g.userData.bolt = bolt;
        beam.material.opacity = 0.3;
        const cloud = addMesh(g, new THREE.SphereGeometry(2.4, 12, 8), mat(0x2a3048, { roughness: 1, emissive: 0x101830 }), cx, h.y + h.h, -1, false);
        cloud.scale.set(1.6, 0.6, 1);
        g.userData.cloud = cloud;
      }
      if (h.type === 'flare') {
        const src = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(0xffa030), blending: THREE.AdditiveBlending, depthWrite: false }));
        src.position.set(cx, h.y + h.h, 0); src.scale.setScalar(5);
        g.add(src);
      }
      g.userData.warn = warn; g.userData.beam = beam; g.userData.core = core;
      return g;
    }
    if (h.type === 'acid') {
      const cl = new THREE.Group();
      for (let i = 0; i < 7; i++) {
        addMesh(cl, new THREE.SphereGeometry(0.8 + Math.random() * 0.5, 12, 8), mat(0x9aff30, { emissive: 0x4a9a10, emissiveIntensity: 0.9, transparent: true, opacity: 0.6, roughness: 1 }), h.w / 2 + (Math.random() - 0.5) * h.w * 0.6, h.h / 2 + (Math.random() - 0.5) * h.h * 0.5, (Math.random() - 0.5) * 1.5, false);
      }
      g.add(cl);
      g.userData.cloud = cl;
      return g;
    }
    return g;
  }

  makeEnemy(e, W) {
    const g = new THREE.Group();
    if (e.type === 'walker') {
      // a round little beetle-bot with a glowing eye and scuttling legs
      const shell = addMesh(g, new THREE.SphereGeometry(0.55, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), mat(0xe8603a, { roughness: 0.3, metalness: 0.2, clearcoat: 1, physical: true }), 0, 0.25, 0);
      shell.scale.set(1, 0.9, 0.85);
      addMesh(g, new THREE.CylinderGeometry(0.55, 0.5, 0.18, 24), mat(0x2a2a34), 0, 0.22, 0).scale.z = 0.85;
      addMesh(g, new THREE.SphereGeometry(0.13, 12, 10), glowMat(0xfff08a, 2.5), 0.42, 0.42, 0);
      const legs = [];
      for (let k = 0; k < 6; k++) {
        const leg = addMesh(g, new THREE.CylinderGeometry(0.04, 0.03, 0.4, 6), mat(0x2a2a34), -0.3 + (k % 3) * 0.3, 0.1, k < 3 ? 0.35 : -0.35);
        legs.push(leg);
      }
      g.userData = { legs, turn: 0 };
    } else if (e.type === 'spiker') {
      const spin = new THREE.Group();
      spin.position.y = 0.5;
      g.add(spin);
      addMesh(spin, new THREE.IcosahedronGeometry(0.42, 1), mat(0x6a1a5a, { roughness: 0.4, metalness: 0.4 }), 0, 0, 0);
      const spikeM = mat(0xff4ab0, { emissive: 0xc0207a, emissiveIntensity: 0.9 });
      const ico = new THREE.IcosahedronGeometry(1, 0).attributes.position;
      const seen = new Set();
      for (let k = 0; k < ico.count; k++) {
        const v = new THREE.Vector3(ico.getX(k), ico.getY(k), ico.getZ(k)).normalize();
        const key = v.toArray().map((q) => q.toFixed(2)).join();
        if (seen.has(key)) continue; seen.add(key);
        const sp = addMesh(spin, new THREE.ConeGeometry(0.1, 0.36, 8), spikeM, v.x * 0.5, v.y * 0.5, v.z * 0.5);
        sp.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), v);
      }
      g.userData = { spin };
    } else {
      // flyer: a hovering drone with a spinning rotor
      addMesh(g, new THREE.SphereGeometry(0.42, 20, 14), mat(0x3a4a6a, { metalness: 0.7, roughness: 0.25 }), 0, 0, 0).scale.y = 0.7;
      addMesh(g, new THREE.SphereGeometry(0.16, 12, 10), glowMat(0xff3a4a, 2.5), 0, -0.05, 0.36);
      const prop = new THREE.Group(); prop.position.y = 0.42; g.add(prop);
      addMesh(prop, new THREE.BoxGeometry(1.4, 0.04, 0.14), mat(0xc0c8d8, { metalness: 0.8 }), 0, 0, 0);
      addMesh(prop, new THREE.BoxGeometry(0.14, 0.04, 1.4), mat(0xc0c8d8, { metalness: 0.8 }), 0, 0, 0);
      addMesh(g, new THREE.CylinderGeometry(0.03, 0.03, 0.3, 6), mat(0x888888), 0, 0.28, 0);
      g.userData = { prop };
    }
    return g;
  }

  makeLauncher(l, W) {
    const g = new THREE.Group();
    const cx = l.x + l.w / 2;
    const col = { vent: 0xff9a40, geyser: 0xd8ffff, updraft: 0x9ae0ff }[l.type] || 0xffffff;
    const ringMat = l.type === 'geyser' ? mat(0xc8f8ff, { roughness: 0.1, metalness: 0.3 }) : mat(0x5a5048, { roughness: 1, flatShading: true });
    const ring = addMesh(g, new THREE.TorusGeometry(l.w * 0.6, 0.25, 8, 20), ringMat, cx, l.y + 0.1, 0);
    ring.rotation.x = Math.PI / 2;
    const core = addMesh(g, new THREE.CircleGeometry(l.w * 0.5, 20), glowMat(col, 1.5), cx, l.y + 0.05, 0, false);
    core.rotation.x = -Math.PI / 2;
    const column = addMesh(g, new THREE.CylinderGeometry(l.w * 0.45, l.w * 0.3, l.h, 16, 1, true), additive(col, l.type === 'updraft' ? 0.18 : 0.4), cx, l.y + l.h / 2, 0, false);
    if (l.type === 'tornado') {
      ring.visible = false; core.visible = false;
      column.geometry.dispose();
      column.geometry = new THREE.CylinderGeometry(l.w * 1.3, l.w * 0.3, l.h, 20, 6, true);
      column.material = additive({ mars: 0xd8a070, jupiter: 0xf0dcc0, neptune: 0x9ac8ff }[W.id] || 0xd8d0c8, 0.32);
      for (let k = 0; k < 3; k++) {
        const band = addMesh(g, new THREE.TorusGeometry(l.w * (0.5 + k * 0.35), 0.08, 6, 24), additive(0xffffff, 0.35), cx, l.y + l.h * (0.25 + k * 0.25), 0, false);
        band.rotation.x = Math.PI / 2;
      }
    }
    g.userData = { column, core, tornado: l.type === 'tornado', baseX: cx };
    return g;
  }

  makeWind(w) {
    const n = 40;
    const pos = new Float32Array(n * 6);
    const seeds = [];
    for (let i = 0; i < n; i++) seeds.push({ x: Math.random() * w.w, y: Math.random() * w.h, z: (Math.random() - 0.5) * 4, len: 0.8 + Math.random() * 1.6 });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const lines = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.0, depthWrite: false }));
    lines.frustumCulled = false;
    lines.userData = { seeds, def: w };
    return lines;
  }

  makeDoor(d) {
    const g = new THREE.Group();
    const cx = d.x + d.w / 2;
    const half = d.h / 2;
    const jawMat = mat(0x2a6a3a, { roughness: 0.6, emissive: 0x0a2a10 });
    const lipMat = glowMat(0xff3ab0, 1.4);
    const tooth = new THREE.ConeGeometry(0.16, 0.5, 6);
    const mkJaw = (dir) => {
      const j = new THREE.Group();
      addMesh(j, new RoundedBoxGeometry(d.w + 0.6, half, DEPTH * 0.8, 3, 0.4), jawMat, 0, dir * half / 2, 0);
      addMesh(j, new THREE.BoxGeometry(d.w + 0.7, 0.14, DEPTH * 0.82), lipMat, 0, 0.0, 0, false);
      for (let i = 0; i < 5; i++) {
        const t = addMesh(j, tooth, mat(0xf8f4e0), 0, -dir * 0.2, -1 + i * 0.5, false);
        if (dir > 0) t.rotation.z = Math.PI;
      }
      return j;
    };
    const upper = mkJaw(1); const lower = mkJaw(-1);
    upper.position.set(cx, d.y + half, 0);
    lower.position.set(cx, d.y + half, 0);
    g.add(upper, lower);
    // leafy collar at the base
    for (let i = 0; i < 6; i++) {
      const leaf = addMesh(g, new THREE.ConeGeometry(0.4, 1.8, 4), mat(0x1a5a2a), cx + Math.cos(i) * 1.0, d.y + 0.4, Math.sin(i) * 0.8);
      leaf.rotation.z = Math.cos(i) * 0.9; leaf.rotation.x = Math.sin(i) * 0.9;
    }
    g.userData = { upper, lower, half, base: d.y + half };
    return g;
  }

  makeRoad(rd, W) {
    if (rd.type === 'sky') return null;
    const g = new THREE.Group();
    const w = rd.x1 - rd.x;
    const cx = (rd.x + rd.x1) / 2;
    if (rd.type === 'water') {
      const water = addMesh(g, new THREE.BoxGeometry(w, 1.2, 8), mat(0x1a4a8a, { roughness: 0.1, metalness: 0.5, transparent: true, opacity: 0.85 }), cx, rd.y - 0.6, -1.5, false);
      water.receiveShadow = true;
      g.userData.water = water;
    } else {
      const col = rd.type === 'canyon' ? 0x8a4a2a : 0x2e3238;
      addMesh(g, new THREE.BoxGeometry(w, 0.4, 7), mat(col, { roughness: 0.9 }), cx, rd.y - 0.2, -1.0, false);
      if (rd.type === 'road') {
        for (let x = rd.x + 1; x < rd.x1 - 1; x += 3) addMesh(g, new THREE.BoxGeometry(1.4, 0.02, 0.15), mat(0xf0f0f0, { emissive: 0x404040 }), x, rd.y + 0.01, 1.4, false);
        addMesh(g, new THREE.BoxGeometry(w, 0.8, 0.2), mat(0x8a9098, { metalness: 0.6 }), cx, rd.y + 0.2, -4.5, false);
      }
    }
    return g;
  }

  // ------------------------------------------------------------------ per-frame
  handleEvents(events, sim) {
    const p = sim.player;
    for (const e of events) {
      switch (e.type) {
        case 'jump': this.robot.trigger('jump'); this.fx.burst('dust', p.x, p.y); break;
        case 'doublejump': this.robot.trigger('doublejump'); this.fx.burst('ring', p.x, p.y); break;
        case 'land': this.robot.trigger('land'); this.fx.burst('dust', p.x, p.y); break;
        case 'shard': {
          const m = this.pickupMeshes.get(e.id);
          if (m) this.fx.burst('flash', m.position.x, m.position.y, 0xffd84a);
          this.shake = 0.15;
          break;
        }
        case 'blast': this.robot.trigger('launch'); this.fx.burst('launch', p.x, p.y, 0xffd04a); this.shake = 0.15; break;
        case 'barrel': this.fx.burst('sparkle', p.x, p.y + 0.8, 0xffffff); break;
        case 'zip': this.fx.burst('sparkle', p.x, p.y + 1.6, 0xffffff); break;
        case 'fling': this.robot.trigger('launch'); this.fx.burst('ring', p.x, p.y + 0.8); this.fx.burst('launch', p.x, p.y, 0x7af0ff); break;
        case 'stomp': this.fx.burst('sparkle', e.x, e.y, 0xffd84a); this.robot.trigger('launch'); break;
        case 'switch': this.fx.burst('flash', p.x, p.y, e.state ? 0x3a7aff : 0xff3a4a); this.shake = 0.12; break;
        case 'walljump': this.robot.trigger('walljump'); this.fx.burst('dust', p.x + p.facing * -0.4, p.y + 0.8); break;
        case 'crumble': this.fx.burst('dust', p.x, p.y); break;
        case 'cell': {
          const m = this.pickupMeshes.get(e.id);
          if (m) { this.fx.burst('sparkle', m.position.x, m.position.y, 0x7affd8); }
          break;
        }
        case 'heart': this.fx.burst('sparkle', p.x, p.y + 1, 0xff5a7a); break;
        case 'hurt': this.fx.burst('hurt', p.x, p.y + 0.8); this.shake = 0.35; break;
        case 'launch': this.robot.trigger('launch'); this.fx.burst('launch', p.x, p.y, 0x9ae0ff); break;
        case 'bridge': this.fx.burst('flash', p.x + 2, p.y, 0xff9af8); break;
        case 'checkpoint': this.fx.burst('flash', p.x, p.y + 2, 0x7aff8a); break;
        case 'complete': this.fx.burst('confetti', p.x, p.y); break;
        case 'respawn': case 'fail': this.snapCamera(sim); this.fx.burst('flash', p.x, p.y + 0.8, 0xffffff); break;
      }
    }
  }

  update(sim, dt) {
    const L = this.level, t = sim.t, p = sim.player;
    const W = this.W;

    // movers
    sim.moverState.forEach((st, i) => {
      const m = this.moverMeshes[i];
      m.visible = st.alpha > 0.02;
      m.position.set(st.x, st.y, 0);
      if (st.def.path.type === 'stream') {
        const s = 0.4 + 0.6 * Math.min(1, st.alpha);
        m.scale.set(1, s, s);
        if (m.userData.wheels) for (const wh of m.userData.wheels) wh.rotation.y = -st.x / 0.4;
      }
      if (m.userData.spin) m.userData.spin.rotation.set(st.angle * 0.6 + t * 0.2, t * 0.15, st.angle);
      if (m.userData.thruster) m.userData.thruster.scale.y = 0.8 + Math.sin(t * 30 + i) * 0.2;
      if (st.def.warp && m.userData.strip) m.userData.strip.material = glowMat(WARP_COLORS[st.warpMode || 0], 2.4);
    });
    this.gearMeshes.forEach((g, i) => {
      const gd = L.gears[i];
      const st = sim.moverState.find((s) => s.def.gear === gd.id);
      const a = st ? st.def.path.omega * st.tau : 0;
      g.children[0].rotation.z = a;
      const a0 = st ? st.def.path.a0 : 0;
      for (let k = 1; k < g.children.length; k++) g.children[k].rotation.z = a0 + a + g.children[k].userData.base;
    });
    // solids
    this.time = (this.time || 0) + dt;
    tickShaders(this.time);
    for (let i = 0; i < this.solidMeshes.length; i++) {
      const sm = this.solidMeshes[i], col = sim.colliders[i];
      const u = sm.userData;
      if (u.blinkMat) {
        sm.visible = col.active || false;
        const fl = col.blinkPhase === 'warn' ? (Math.sin(t * 40) > 0 ? 0.25 : 0.85) : 0.85;
        u.blinkMat.opacity = fl;
      }
      if (u.onoff) { u.onoff.solid.visible = col.active; u.onoff.ghost.visible = !col.active; }
      if (u.button) u.button.material = glowMat(sim.switchState ? 0x3a7aff : 0xff3a4a, 1.6);
      if (sm.userData.crumble) {
        if (col.fallT >= 0) {
          const k = t - col.fallT;
          sm.position.set(0, -k * k * 7, 0);
          sm.visible = k < 1.1;
        } else {
          sm.visible = true;
          sm.position.set(col.crumbleStart >= 0 ? (Math.random() - 0.5) * 0.1 : 0, 0, 0);
        }
      }
      if (sm.userData.heatMat) {
        const ph = phaseOf(col.heat, t);
        sm.userData.heatMat.emissiveIntensity = ph === 'on' ? 2.6 : ph === 'warn' ? 0.4 + 0.5 * Math.abs(Math.sin(t * 18)) : 0.04;
      }
      if (sm.userData.spring) sm.userData.spring.position.y = col.y + col.h - 0.07 + Math.sin(t * 6) * 0.02;
    }
    for (const sm of this.solidMeshes) {
      if (sm.userData.belt) sm.userData.belt.offset.x -= sm.userData.beltSpeed * dt * 0.5;
      if (sm.userData.bouncy) sm.userData.bouncy.scale.y = 0.7 + Math.sin(t * 4) * 0.04;
    }
    // hazards
    sim.hazardState.forEach((h, i) => {
      const m = this.hazardMeshes[i];
      if (!m) return;
      const u = m.userData;
      if (u.piston) {
        const H = u.h;
        const target = h.state === 'on' ? H.y + 0.6 : H.y + H.h - 0.6;
        const cur = u.piston.position.y;
        u.piston.position.y = cur + (target - cur) * Math.min(1, dt * (h.state === 'on' ? 30 : 4));
        u.piston.position.x = H.x + H.w / 2 + (h.state === 'warn' ? (Math.random() - 0.5) * 0.12 : 0);
        u.rod.position.y = u.piston.position.y + H.h / 2 + 0.5;
        u.mark.material.opacity = h.state === 'idle' ? 0.2 : 0.5 + 0.5 * Math.abs(Math.sin(t * 20));
        if (h.state === 'on' && !u.slammed) { u.slammed = true; this.fx.burst('dust', H.x + H.w / 2, H.y); }
        if (h.state !== 'on') u.slammed = false;
        return;
      }
      if (u.flames) u.flames.forEach((f, k) => { f.scale.y = 0.7 + Math.abs(Math.sin(t * 9 + k * 1.7)) * 0.8; });
      if (u.beam) {
        const on = h.state === 'on', warn = h.state === 'warn';
        u.beam.visible = on;
        if (u.core) u.core.visible = on;
        u.warn.visible = warn;
        if (warn) u.warn.material.opacity = 0.3 + 0.4 * Math.abs(Math.sin(t * 20));
        if (u.mark) { u.mark.material.opacity = on ? 1 : warn ? 0.5 + 0.5 * Math.sin(t * 25) : 0.25; u.mark.scale.setScalar(on ? 1.3 : 1); }
        if (u.bolt) { u.bolt.visible = on && Math.sin(t * 60) > -0.3; }
        if (u.cloud && u.cloud.material) u.cloud.material.emissive.setHex(on ? 0x8ab0ff : warn ? 0x304070 : 0x101830);
        if (on && h.def.type !== 'steam' && h.def.type !== 'exhaust') u.beam.scale.x = u.beam.scale.z = 0.8 + Math.random() * 0.4;
      }
      if (u.cloud && h.def.type === 'acid') {
        m.position.set(h.x - h.def.x, h.y - h.def.y, 0);
        u.cloud.position.set(h.def.x, h.def.y, 0);
        u.cloud.rotation.z = Math.sin(t) * 0.1;
      }
    });
    sim.meteorState.forEach((ms, i) => {
      const g = this.meteorMeshes[i];
      g.visible = ms.falling;
      g.position.set(ms.x, ms.y, 0);
      g.userData.rock.rotation.set(t * 3, t * 2, 0);
      g.userData.marker.visible = ms.warn;
      g.userData.marker.material.opacity = 0.4 + 0.5 * Math.abs(Math.sin(t * 12));
      if (ms.falling && ms.k > 0.97 && !ms._boom) { ms._boom = true; this.fx.burst('impact', ms.def.x, ms.def.y1); }
      if (!ms.falling) ms._boom = false;
    });
    sim.launcherState.forEach((l, i) => {
      const lm = this.launcherMeshes[i];
      const u = lm.userData;
      if (u.tornado) { lm.position.x = l.def.x + l.def.w / 2 - u.baseX; lm.rotation.y = t * 4; return; }
      const on = l.state === 'on';
      u.column.visible = on || l.def.type === 'updraft';
      u.column.material.opacity = (l.def.type === 'updraft' ? 0.15 : 0.45) + Math.sin(t * 20) * 0.05;
      u.core.material = glowMat(on ? 0xffffff : (l.state === 'warn' ? 0xffd080 : 0x806040), on ? 2.5 : 1);
    });
    sim.windState.forEach((w, i) => {
      const lines = this.windMeshes[i];
      const { seeds, def } = lines.userData;
      const on = w.state === 'on';
      lines.material.opacity += ((on ? 0.7 : w.state === 'warn' ? 0.2 : 0.0) - lines.material.opacity) * Math.min(1, dt * 6);
      const a = lines.geometry.attributes.position;
      seeds.forEach((s, k) => {
        s.x += (on ? def.vx * 2.2 : def.vx * 0.3) * dt;
        if (s.x > def.w) s.x -= def.w; if (s.x < 0) s.x += def.w;
        const x = def.x + s.x, y = def.y + s.y;
        a.setXYZ(k * 2, x, y, s.z);
        a.setXYZ(k * 2 + 1, x - Math.sign(def.vx) * s.len, y, s.z);
      });
      a.needsUpdate = true;
    });
    sim.gravState.forEach((z, i) => {
      const m = this.gravMeshes[i];
      m.material.color.setHex(z.low ? 0x5aa0ff : 0xff5a5a);
      m.material.opacity = 0.1 + 0.05 * Math.sin(t * 3);
      const pts = m.userData.points;
      pts.material.color.setHex(z.low ? 0x9ad0ff : 0xff9a9a);
      const a = pts.geometry.attributes.position;
      const d = z.def;
      for (let k = 0; k < a.count; k++) {
        let y = a.getY(k) + (z.low ? 1.5 : -4) * dt;
        if (y > d.y + d.h) y -= d.h; if (y < d.y) y += d.h;
        a.setY(k, y);
      }
      a.needsUpdate = true;
    });
    sim.vines.forEach((v, i) => { this.vineMeshes[i].rotation.z = v.angle; });
    sim.bridgeState.forEach((b, i) => {
      const u = this.bridgeMeshes[i].userData;
      u.solid.visible = b.c.active;
      u.ghost.visible = !b.c.active;
      if (!b.c.active) u.ghost.material.opacity = 0.15 + 0.12 * Math.abs(Math.sin(t * 5));
    });
    sim.doorState.forEach((d, i) => {
      const u = this.doorMeshes[i].userData;
      const o = d.open;
      u.upper.position.y = u.base + o * (u.half + 0.8);
      u.lower.position.y = u.base - o * (u.half + 0.3);
      u.upper.rotation.z = Math.sin(t * 6) * 0.03 * (1 - o);
    });
    for (const [id, m] of this.pickupMeshes) {
      if (sim.collected.has(id)) { m.visible = false; continue; }
      m.rotation.y = t * 2.5;
      m.position.y = m.userData.baseY + Math.sin(t * 3 + m.position.x) * 0.12;
    }
    this.checkpointMeshes.forEach((cm, i) => {
      const c = i <= (sim.checkpointIdx ?? -1) ? 0x5aff8a : 0xff8a3a;
      cm.userData.orb.material = glowMat(c, 2);
      cm.userData.ring.material = glowMat(c, 2);
      cm.userData.ring.rotation.y = t * 2;
    });
    const gu = this.goalMesh.userData;
    gu.disc.rotation.z = -t * 1.5;
    gu.ringG.rotation.y = Math.sin(t) * 0.3;
    gu.beam.material.opacity = 0.08 + 0.05 * Math.sin(t * 2);

    this.zipMeshes.forEach((zm) => {
      const z = zm.userData.z, p = sim.player;
      const riding = p.zip && p.zip.line === z;
      const x = riding ? p.x : z.x0 + (z.x1 - z.x0) * (0.5 + 0.5 * Math.sin(t * 0.8));
      zm.userData.trolley.position.set(x, z.y0 + (z.y1 - z.y0) * (x - z.x0) / (z.x1 - z.x0), 0);
    });
    this.barrelMeshes.forEach((bm) => {
      const d = bm.userData.def;
      const a = d.spin ? (d.sweep ? d.angle + Math.sin(sim.t * d.spin) * d.sweep : d.angle + d.spin * sim.t) : d.angle;
      bm.userData.aim.rotation.z = a;
      const inside = sim.player.barrel === d;
      bm.scale.setScalar(inside ? 1.08 + Math.sin(t * 20) * 0.03 : 1);
    });
    sim.hazardState.forEach((h, i) => {
      const wm = this.wreckerMeshes[i];
      if (!wm) return;
      const r = h.def.w / 2;
      const cx = h.x + r, cy = h.y + r;
      wm.position.set(cx, cy, 0);
      wm.rotation.z += dt * 2;
      const { px, py } = h.def.rope;
      const ch = wm.userData.chain;
      const len = Math.hypot(cx - px, cy + r - py);
      ch.position.set((cx + px) / 2, (cy + r + py) / 2, 0);
      ch.scale.y = len;
      ch.rotation.z = Math.atan2(cy + r - py, cx - px) - Math.PI / 2;
    });
    sim.moverState.forEach((st, i) => {
      const line = this.ropeMeshes[i];
      if (!line) return;
      const { px, py } = st.def.rope;
      const ex = st.x + st.def.w / 2, ey = st.y + st.def.h;
      line.position.set((px + ex) / 2, (py + ey) / 2, 0);
      line.scale.y = Math.hypot(ex - px, ey - py);
      line.rotation.z = Math.atan2(ey - py, ex - px) - Math.PI / 2;
    });
    sim.sweepState.forEach((sw, i) => { this.sweepMeshes[i].rotation.z = sw.a; });
    this.ringMeshes.forEach((rm, i) => { const k = 1 + Math.sin(t * 5 + i) * 0.06; rm.userData.hoop.scale.setScalar(k); rm.userData.inner.material.opacity = 0.08 + Math.abs(Math.sin(t * 3 + i)) * 0.1; });
    if (this.chaserMesh) {
      const ch = sim.chaser;
      this.chaserMesh.visible = !!(ch && ch.active);
      if (ch && ch.active) {
        this.chaserMesh.position.x = ch.x;
        this.chaserMesh.userData.light.intensity = 25 + Math.sin(t * 13) * 8;
      }
    }
    if (L.tide && this.backdrop.floor) this.backdrop.floor.position.y = sim.floorY;

    sim.enemies.forEach((e, i) => {
      const m = this.enemyMeshes[i];
      m.visible = e.alive;
      m.position.set(e.x, e.y, 0);
      const ud = m.userData;
      if (ud.legs) ud.legs.forEach((l, k) => { l.rotation.x = Math.sin(t * 14 + k * 1.7) * 0.6; });
      if (ud.turn !== undefined) m.rotation.y = e.dir > 0 ? 0.6 : Math.PI - 0.6;
      if (ud.spin) ud.spin.rotation.z -= dt * 6 * e.dir;
      if (ud.prop) ud.prop.rotation.y += dt * 30;
    });
    sim.turrets.forEach((tu, i) => {
      const u = this.turretMeshes[i].userData;
      const P = tu.def.P || 2.5;
      const ph = ((sim.t + (tu.def.off || 0)) % P) / P;
      u.ring.material = glowMat(ph > 0.75 ? 0xffd04a : 0xff4a3a, ph > 0.75 ? 3.5 : 1.5);
    });
    this.shotPool.forEach((m, i) => {
      const b = sim.shots[i];
      m.visible = !!b;
      if (b) { m.position.set(b.x, b.y, 0); m.userData.trail.position.x = -Math.sign(b.vx) * 0.6; }
    });

    // hero
    this.robot.root.position.set(p.x, p.y, 0);
    this.robot.update(p, dt, t, { invuln: sim.invuln, win: sim.complete, showcase: this.showcase });
    if (p.barrel) this.robot.root.visible = false;
    this.heroLight.position.set(p.x + 1, p.y + 2.5, 3);
    // blob shadow on whatever is below
    let below = L.floor.y;
    for (const c of sim.colliders) {
      if (c.active === false) continue;
      if (p.x > c.x && p.x < c.x + c.w && c.y + c.h <= p.y + 0.05 && c.y + c.h > below) below = c.y + c.h;
    }
    this.blob.position.set(p.x, below + 0.02, 0);
    const hgt = p.y - below;
    this.blob.scale.setScalar(Math.max(0.3, 1 - hgt * 0.08));
    this.blob.material.opacity = Math.max(0, 0.35 - hgt * 0.03);

    // camera: smooth follow with look-ahead
    const lookX = p.x + p.facing * 2.2 + p.vx * 0.12;
    const tx = Math.max(L.bounds.minX + 10, Math.min(L.bounds.maxX - 6, lookX));
    this.cam.x += (tx - this.cam.x) * Math.min(1, dt * 3.5);
    const ty = Math.max(L.floor.y + 4, p.y + 1.2);
    const ky = p.vy < -12 ? 6 : 2.6;
    this.cam.y += (ty - this.cam.y) * Math.min(1, dt * ky);
    this.shake = Math.max(0, this.shake - dt);
    const sx = this.shake > 0 ? (Math.random() - 0.5) * this.shake : 0;
    const sy = this.shake > 0 ? (Math.random() - 0.5) * this.shake : 0;
    if (this.showcase) {
      // shop close-up: slow orbit around the robot, framed to the left of the panel
      const a = Math.sin(this.time * 0.4) * 0.5;
      const narrow = this.camera.aspect < 1;
      const r = narrow ? 7 : 5.2;
      this.camera.position.set(p.x + Math.sin(a) * r + (narrow ? 0 : 1.6), p.y + 1.6, Math.cos(a) * r);
      this.camera.lookAt(p.x + (narrow ? 0 : 1.6), p.y + (narrow ? 1.6 : 0.85), 0);
    } else {
      this.camera.position.set(this.cam.x + sx, this.cam.y + 3.2 + sy, this.camDist || 18.5);
      this.camera.lookAt(this.cam.x, this.cam.y + 0.7, 0);
    }

    this.sun.position.set(this.cam.x + 12, this.cam.y + 30, 18);
    this.sun.target.position.set(this.cam.x, this.cam.y, 0);

    // atmosphere: dust storms on Mars thicken and thin out
    if (L.dust) {
      const storm = Math.max(0, Math.sin(t * 0.35)) ** 2;
      this.scene.fog.density = this.baseFog * (1 + storm * 5);
      this.stormLevel = storm;
    } else this.stormLevel = 0;

    this.backdrop.update(t, this.cam.x, this.cam.y);
    this.weather.update(dt, this.cam.x, this.cam.y, (sim.globalWindNow || 0) + (L.dust ? this.stormLevel * 12 : 0));
    this.fx.update(dt);
  }

  snapCamera(sim) {
    const p = sim.player, L = this.level;
    this.cam.x = Math.max(L.bounds.minX + 10, Math.min(L.bounds.maxX - 6, p.x + p.facing * 2.2));
    this.cam.y = Math.max(L.floor.y + 4, p.y + 1.2);
  }

  render() {
    if (this.useBloom) this.composer.render();
    else this.renderer.render(this.scene, this.camera);
  }
}
