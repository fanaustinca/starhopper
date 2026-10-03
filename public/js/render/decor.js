// World backdrops: shader skies, celestial bodies, animated hazard floors,
// procedural terrain and 3D scenery (Earth landmarks, solar prominences,
// Martian mesas, gears, crystals...).
import * as THREE from 'three';
import { makeRng } from '../core/rng.js';
import { WORLDS } from '../core/config.js';
import { mat, makeMoverMesh, rockGeo } from './vehicles.js';
import { planetTexture, ringTexture, glowTexture, windowTexture } from './textures.js';
import { skyMaterial, sunSurfaceMaterial, plasmaMaterial, liquidMaterial, flickerMaterial, starMaterial } from './shaders.js';
import { makeTerrain, cloudSprite } from './terrain.js';

const glow = (c, i = 2) => mat(c, { emissive: c, emissiveIntensity: i });

// Sky look per world (see shaders.skyMaterial)
const SKY = {
  sun: { top: 0x0a0100, horizon: 0xc8380a, ground: 0xd0400a, stars: 0.5, corona: 0.65, sunHalo: 0, sunSize: 0.0001 },
  mercury: { top: 0x000003, horizon: 0x18181e, stars: 1.1, neb: 0.25, nebA: 0x203060, nebB: 0x502040, sunDir: [-0.55, 0.28, -1], sunSize: 0.1, sunColor: 0xfff2dc, sunHalo: 1.6 },
  venus: { top: 0x3a1806, horizon: 0xd88a40, clouds: 0.85, cloudColor: 0xa85a28, cloudScale: 0.5, sunSize: 0.03, sunColor: 0xffd8a0, sunHalo: 0.6 },
  earth: { top: 0x1858c0, horizon: 0xc4e0f8, clouds: 0.75, cloudColor: 0xffffff, sunSize: 0.022, sunColor: 0xfff4d8, sunHalo: 1 },
  mars: { top: 0x5a3020, horizon: 0xd8a070, clouds: 0.25, cloudColor: 0xd09060, sunDir: [0.4, 0.22, -1], sunSize: 0.012, sunColor: 0xdfeaff, sunHalo: 1.3 },
  asteroids: { top: 0x000002, horizon: 0x04040a, stars: 1.3, neb: 0.9, nebA: 0x2a1060, nebB: 0x0e5a8a, sunSize: 0.008, sunHalo: 0.8 },
  jupiter: { top: 0x24160c, horizon: 0xe0b888, clouds: 0.45, cloudColor: 0xf0d8b0, stars: 0.2, sunSize: 0.006, sunHalo: 0.5 },
  saturn: { top: 0x241c0e, horizon: 0xf0e0b8, clouds: 0.35, cloudColor: 0xfff0d0, stars: 0.2, sunSize: 0.005, sunHalo: 0.5 },
  uranus: { top: 0x062c3c, horizon: 0x6ac4d4, clouds: 0.3, cloudColor: 0xe8ffff, aurora: 0.35, sunSize: 0.004, sunHalo: 0.4 },
  neptune: { top: 0x020722, horizon: 0x3a6ae0, clouds: 0.55, cloudColor: 0x24348a, stars: 0.3, sunSize: 0.003, sunHalo: 0.3 },
  prismara: { top: 0x08031c, horizon: 0xb07ae0, neb: 1.0, nebA: 0xff40c0, nebB: 0x4080ff, stars: 0.9, sunSize: 0.015, sunColor: 0xffe0ff },
  mechanus: { top: 0x160e05, horizon: 0x9a7040, clouds: 0.55, cloudColor: 0x6a4a28, cloudScale: 0.7, sunSize: 0.02, sunColor: 0xffc070, sunHalo: 0.8 },
  biolumina: { top: 0x010308, horizon: 0x0a3a34, stars: 0.9, aurora: 1.0, neb: 0.2, nebA: 0x104060, nebB: 0x30a080, sunSize: 0.0001, sunHalo: 0 },
  chronos: { top: 0x04020d, horizon: 0x3a2a70, neb: 1.0, nebA: 0xffc040, nebB: 0x6030c0, stars: 1.0, sunSize: 0.01, sunColor: 0xffe8a0 },
};

const TERRAIN = {
  mercury: ['craters', -30], venus: ['volcanic', -45], earth: ['hills', -210], mars: ['mesa', -40],
  uranus: ['ice', -40], prismara: ['crystal', -70], mechanus: ['brass', -70], biolumina: ['jungle', -45],
};

function skyDome(worldId) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(1500, 48, 24), skyMaterial(SKY[worldId]));
  mesh.renderOrder = -10;
  mesh.frustumCulled = false;
  return mesh;
}
function planetMesh(world, radius, seed) {
  const g = new THREE.Group();
  const tex = planetTexture(world, seed);
  const m = world.planet.emissive
    ? starMaterial()
    : new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9, fog: false });
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(radius, 48, 32), m);
  g.add(sphere);
  g.userData.sphere = sphere;
  if (world.planet.rings) {
    const rt = ringTexture(world.planet.color);
    const ringGeo = new THREE.RingGeometry(radius * 1.35, radius * 2.3, 96, 1);
    // map texture radially
    const pos = ringGeo.attributes.position, uv = ringGeo.attributes.uv;
    for (let i = 0; i < pos.count; i++) {
      const r = Math.hypot(pos.getX(i), pos.getY(i));
      uv.setXY(i, (r - radius * 1.35) / (radius * 0.95), 0.5);
    }
    const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ map: rt, side: THREE.DoubleSide, transparent: true, fog: false, depthWrite: false }));
    ring.rotation.x = Math.PI / 2 - 0.35;
    if (world.planet.tilt) ring.rotation.y = world.planet.tilt * 0.6;
    g.add(ring);
  }
  if (world.planet.emissive) {
    const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(0xffa030), blending: THREE.AdditiveBlending, fog: false, depthWrite: false }));
    spr.scale.setScalar(radius * 4);
    g.add(spr);
  }
  return g;
}

function sunGlow(size, color = 0xfff2d0) {
  const g = new THREE.Group();
  const core = new THREE.Mesh(new THREE.SphereGeometry(size * 0.25, 24, 16), new THREE.MeshBasicMaterial({ color, fog: false }));
  g.add(core);
  const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(color), blending: THREE.AdditiveBlending, fog: false, depthWrite: false }));
  spr.scale.setScalar(size * 2.2);
  g.add(spr);
  return g;
}


// ---------------------------------------------------------------- floors
export function floorMaterial(type, W, level) {
  switch (type) {
    case 'sun': return sunSurfaceMaterial();
    case 'lava': return liquidMaterial('lava', { a: 0xc82400, b: 0xffb030 });
    case 'acid': return liquidMaterial('acid', { a: 0x3a3a06, b: 0xc8d030, sky: 0xb07038, sun: 0xffd8a0 });
    case 'water': return liquidMaterial('water', { a: 0x041640, b: 0x16409a, sky: 0x4a78e0, sun: 0xd0e0ff });
    case 'swamp': return liquidMaterial('swamp', { a: 0x02140f, b: 0x30ffc0 });
    case 'rift': return liquidMaterial('rift', { a: 0x3a18b0, b: 0xffc860 });
    case 'gas': {
      const cols = { jupiter: [0xc89868, 0xf0dcc0, 0xfff4e4], saturn: [0xd8c088, 0xf6ead0, 0xfffaf0], uranus: [0x8ad8e0, 0xc8f4f4, 0xffffff], neptune: [0x2a48c0, 0x5a80f0, 0x9ab8ff] }[W.id] || [0xc89868, 0xf0dcc0, 0xffffff];
      const red = level && level.redSpot;
      return liquidMaterial('gas', { a: cols[0], b: cols[1], sky: cols[2], swirl: red ? [(level.bounds.minX + level.bounds.maxX) / 2, -160] : [0, 0], swirlR: red ? 140 : 0 });
    }
    case 'mercury': return new THREE.MeshStandardMaterial({ color: 0x9aa2ac, metalness: 1, roughness: 0.1, envMapIntensity: 0.35 });
    case 'street': return new THREE.MeshStandardMaterial({ color: 0x2e3238, roughness: 0.92 });
    case 'ice': return new THREE.MeshStandardMaterial({ color: 0xbff0ff, roughness: 0.12, metalness: 0.25 });
    case 'crystal': return new THREE.MeshStandardMaterial({ color: 0x6a4ac8, roughness: 0.06, metalness: 0.6, emissive: 0x24104a });
    default: return null;
  }
}

function floorMesh(level, W, x0, x1) {
  let type = level.floor.type;
  if (W.id === 'sun') type = 'sun';
  const m = floorMaterial(type, W, level);
  if (!m) return null;
  const geo = new THREE.PlaneGeometry(x1 - x0 + 900, 700, 1, 1);
  geo.rotateX(-Math.PI / 2);
  const mesh = new THREE.Mesh(geo, m);
  mesh.position.set((x0 + x1) / 2, level.floor.y, -320);
  mesh.receiveShadow = !(m instanceof THREE.ShaderMaterial);
  mesh.userData.isFloor = true;
  return mesh;
}

// Solar prominence: a twisted tube of flowing plasma between two foot-points.
function prominence(rng, x, y, z, span, height, thick) {
  const pts = [];
  const tilt = rng.range(-0.5, 0.5), twist = rng.range(-0.25, 0.25);
  for (let i = 0; i <= 14; i++) {
    const u = i / 14, a = u * Math.PI;
    pts.push(new THREE.Vector3(
      x + (u - 0.5) * span + Math.sin(a * 3 + span) * span * 0.04,
      y + Math.sin(a) * height * (1 + Math.sin(a * 2.3) * 0.08),
      z + Math.sin(a) * span * tilt + (u - 0.5) * span * twist));
  }
  const geo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 90, thick, 12, false);
  return new THREE.Mesh(geo, plasmaMaterial(rng.next() < 0.2 ? 0.4 : 0));
}
// ---------------------------------------------------------------- Earth landmarks
function bigBen(g) {
  const stone = mat(0xc8b088, { roughness: 0.8 });
  const t = new THREE.Group();
  add(t, new THREE.BoxGeometry(6, 40, 6), stone, 0, 20, 0);
  add(t, new THREE.BoxGeometry(7, 7, 7), stone, 0, 43, 0);
  for (const z of [3.55]) add(t, new THREE.CircleGeometry(2.6, 32), glow(0xfff2c0, 0.8), 0, 43, z);
  add(t, new THREE.ConeGeometry(5, 14, 4), mat(0x3a4a3a), 0, 53.5, 0).rotation.y = Math.PI / 4;
  add(t, new THREE.BoxGeometry(0.5, 4, 0.5), mat(0xd0b060, { metalness: 0.8 }), 0, 62, 0);
  g.add(t);
  // London Eye
  const eye = new THREE.Group();
  eye.position.set(28, 30, -10);
  add(eye, new THREE.TorusGeometry(24, 0.5, 8, 64), mat(0xe8ecf2, { metalness: 0.6 }), 0, 0, 0);
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const sp = add(eye, new THREE.CylinderGeometry(0.12, 0.12, 24, 4), mat(0xcfd6e0), Math.cos(a) * 12, Math.sin(a) * 12, 0);
    sp.rotation.z = a + Math.PI / 2;
    add(eye, new THREE.SphereGeometry(1.0, 10, 8), glass(), Math.cos(a) * 24.5, Math.sin(a) * 24.5, 1.2);
  }
  g.add(eye);
  g.userData.spinner = eye;
}
function empireState(g) {
  const s = mat(0xb8b0a0, { roughness: 0.7 });
  const t = new THREE.Group();
  const tex = windowTexture('#ffeab0', '#8a8478', 7);
  tex.repeat.set(2, 10);
  const wm = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.7, emissive: 0x332a10, emissiveMap: tex, emissiveIntensity: 0.5 });
  add(t, new THREE.BoxGeometry(14, 50, 10), wm, 0, 25, 0);
  add(t, new THREE.BoxGeometry(10, 14, 8), wm, 0, 57, 0);
  add(t, new THREE.BoxGeometry(6, 8, 5), s, 0, 68, 0);
  add(t, new THREE.CylinderGeometry(1.4, 2.4, 6, 8), s, 0, 75, 0);
  add(t, new THREE.CylinderGeometry(0.2, 0.6, 12, 6), mat(0xdddddd, { metalness: 0.9 }), 0, 84, 0);
  g.add(t);
  // Lady Liberty
  const lib = new THREE.Group();
  lib.position.set(-34, 0, 15);
  const green = mat(0x6fb39a, { roughness: 0.6 });
  add(lib, new THREE.BoxGeometry(8, 10, 8), mat(0xa89a80), 0, 5, 0);
  add(lib, new THREE.CylinderGeometry(1.6, 2.8, 14, 10), green, 0, 17, 0);
  add(lib, new THREE.SphereGeometry(1.4, 12, 10), green, 0, 25, 0);
  add(lib, new THREE.ConeGeometry(1.8, 1.2, 7), green, 0, 26.4, 0);
  const arm = add(lib, new THREE.CylinderGeometry(0.4, 0.5, 7, 6), green, 1.6, 26.5, 0);
  arm.rotation.z = -0.2;
  add(lib, new THREE.ConeGeometry(0.6, 1.6, 8), glow(0xffc040, 3), 2.3, 30.6, 0);
  g.add(lib);
}
function goldenGate(g) {
  const red = mat(0xc0362c, { roughness: 0.6 });
  const tw = [-30, 30];
  for (const x of tw) {
    add(g, new THREE.BoxGeometry(2, 60, 2), red, x, 30, -3);
    add(g, new THREE.BoxGeometry(2, 60, 2), red, x, 30, 3);
    for (const y of [22, 40, 56]) add(g, new THREE.BoxGeometry(2, 2, 8), red, x, y, 0);
  }
  add(g, new THREE.BoxGeometry(150, 2, 8), red, 0, 16, 0);
  // catenary cables
  for (const z of [-3, 3]) {
    const pts = [];
    for (let i = 0; i <= 40; i++) {
      const x = -75 + (150 * i) / 40;
      let y;
      if (x < -30) y = 58 - ((x + 30) / -45) * 40;
      else if (x > 30) y = 58 - ((x - 30) / 45) * 40;
      else y = 18 + 40 * ((x / 30) ** 2);
      pts.push(new THREE.Vector3(x, y, z));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    add(g, new THREE.TubeGeometry(curve, 80, 0.35, 6), red, 0, 0, 0);
  }
}
function hollywood(g) {
  const hill = add(g, new THREE.SphereGeometry(50, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), mat(0x8a7a50, { roughness: 1 }), 0, -10, -20);
  hill.scale.set(1.6, 0.6, 0.5);
  const c = document.createElement('canvas'); c.width = 1024; c.height = 128;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#fff'; ctx.font = 'bold 120px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('HOLLYWOOD', 512, 70);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(64, 8), new THREE.MeshStandardMaterial({ map: tex, transparent: true, alphaTest: 0.5, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 0.3 }));
  sign.position.set(0, 20, 2); sign.rotation.x = -0.15;
  g.add(sign);
  for (let i = 0; i < 6; i++) palm(g, -40 + i * 16, 0, 20 + (i % 2) * 6);
}
function palm(g, x, y, z) {
  const trunk = add(g, new THREE.CylinderGeometry(0.4, 0.6, 14, 6), mat(0x8a6a40), x, y + 7, z);
  trunk.rotation.z = 0.08;
  for (let i = 0; i < 6; i++) {
    const leaf = add(g, new THREE.ConeGeometry(0.8, 7, 4), mat(0x3a8a3a), x + Math.cos(i) * 2.6, y + 14, z + Math.sin(i) * 2.6);
    leaf.rotation.z = Math.cos(i) * 1.6; leaf.rotation.x = Math.sin(i) * 1.6;
  }
}
function pearlTower(g) {
  const pink = mat(0xd04080, { roughness: 0.25, metalness: 0.3 });
  const grey = mat(0xc0c4cc, { metalness: 0.5 });
  for (const a of [0, 2.09, 4.18]) {
    const leg = add(g, new THREE.CylinderGeometry(0.8, 1.2, 30, 8), grey, Math.cos(a) * 3, 15, Math.sin(a) * 3);
    leg.rotation.z = Math.cos(a) * 0.1; leg.rotation.x = -Math.sin(a) * 0.1;
  }
  add(g, new THREE.CylinderGeometry(1.4, 1.4, 70, 10), grey, 0, 40, 0);
  add(g, new THREE.SphereGeometry(7, 24, 16), pink, 0, 26, 0);
  add(g, new THREE.SphereGeometry(5, 24, 16), pink, 0, 56, 0);
  add(g, new THREE.SphereGeometry(2, 16, 12), pink, 0, 72, 0);
  add(g, new THREE.CylinderGeometry(0.2, 0.5, 16, 6), grey, 0, 82, 0);
  // Shanghai Tower: twisted glass
  const st = add(g, new THREE.CylinderGeometry(4, 7, 100, 9, 10), glass(0x8ab0c8), 30, 50, -20);
  const pos = st.geometry.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i), a = (y + 50) / 100 * 2.0;
    const x = pos.getX(i), z = pos.getZ(i);
    pos.setXZ(i, x * Math.cos(a) - z * Math.sin(a), x * Math.sin(a) + z * Math.cos(a));
  }
  st.geometry.computeVertexNormals();
}
function templeOfHeaven(g) {
  const red = mat(0xb02a20), blue = mat(0x1e3a8a, { roughness: 0.4 }), white = mat(0xf0ece0);
  add(g, new THREE.CylinderGeometry(26, 28, 3, 32), white, 0, 1.5, 0);
  add(g, new THREE.CylinderGeometry(22, 24, 3, 32), white, 0, 4.5, 0);
  let y = 6;
  for (const [r, h] of [[14, 8], [11, 6], [8, 6]]) {
    add(g, new THREE.CylinderGeometry(r * 0.75, r * 0.75, h, 24), red, 0, y + h / 2, 0);
    add(g, new THREE.ConeGeometry(r * 1.1, 4, 32), blue, 0, y + h + 2, 0);
    y += h + 3;
  }
  add(g, new THREE.SphereGeometry(1.4, 12, 10), mat(0xd8b040, { metalness: 0.9, roughness: 0.2 }), 0, y + 1, 0);
}
function operaHouse(g) {
  const white = mat(0xf6f4ee, { roughness: 0.3 });
  add(g, new THREE.BoxGeometry(60, 4, 22), mat(0xc8a888), 0, 2, 0);
  for (let i = 0; i < 5; i++) {
    const shell = add(g, new THREE.SphereGeometry(10 - i * 1.2, 16, 12, 0, Math.PI, 0, Math.PI / 2), white, -18 + i * 9, 4, 0);
    shell.rotation.set(0, -Math.PI / 2, -0.5);
    shell.scale.set(1, 1.5, 0.7);
  }
  // Harbour Bridge arch
  const arch = new THREE.Group(); arch.position.set(60, 0, -30);
  const steel = mat(0x6a7078, { metalness: 0.7 });
  const pts = [];
  for (let i = 0; i <= 30; i++) { const x = -40 + (80 * i) / 30; pts.push(new THREE.Vector3(x, 34 - (x / 40) ** 2 * 26, 0)); }
  add(arch, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 60, 1.2, 6), steel, 0, 0, 0);
  add(arch, new THREE.BoxGeometry(84, 1.5, 8), steel, 0, 14, 0);
  for (const x of [-42, 42]) add(arch, new THREE.BoxGeometry(6, 22, 8), mat(0xb8a080), x, 11, 0);
  g.add(arch);
}
function brandenburg(g) {
  const stone = mat(0xd8ccb0, { roughness: 0.8 });
  add(g, new THREE.BoxGeometry(44, 3, 10), stone, 0, 1.5, 0);
  for (let i = 0; i < 6; i++) add(g, new THREE.CylinderGeometry(1, 1.1, 18, 12), stone, -18 + i * 7.2, 12, 0);
  add(g, new THREE.BoxGeometry(46, 4, 11), stone, 0, 23, 0);
  add(g, new THREE.BoxGeometry(20, 3, 9), stone, 0, 26.5, 0);
  add(g, new THREE.BoxGeometry(6, 4, 3), mat(0x4a7a5a, { metalness: 0.6 }), 0, 30, 0);
  // TV Tower
  const tv = new THREE.Group(); tv.position.set(45, 0, -40);
  add(tv, new THREE.CylinderGeometry(1.5, 3.5, 80, 12), mat(0xd8dce0), 0, 40, 0);
  add(tv, new THREE.SphereGeometry(7, 24, 16), mat(0x9aa4b0, { metalness: 0.8, roughness: 0.2 }), 0, 82, 0);
  add(tv, new THREE.CylinderGeometry(0.4, 0.8, 26, 8), mat(0xe03030), 0, 100, 0);
  g.add(tv);
}
function stBasils(g) {
  const cols = [0xd03a2a, 0x2a8a4a, 0x2a5ad0, 0xe0b030, 0x9a3ad0, 0x30a0b0];
  add(g, new THREE.BoxGeometry(40, 14, 16), mat(0xb84030), 0, 7, 0);
  const towers = [[0, 34, 4], [-12, 22, 3], [12, 22, 3], [-6, 26, 3.2], [6, 26, 3.2], [-17, 18, 2.6], [17, 18, 2.6]];
  towers.forEach(([x, h, r], i) => {
    add(g, new THREE.CylinderGeometry(r * 0.8, r, h, 12), mat(0xd8c8a0), x, h / 2, 0);
    const dome = add(g, new THREE.SphereGeometry(r * 1.25, 16, 12), mat(cols[i % cols.length], { roughness: 0.4 }), x, h + r * 0.8, 0);
    dome.scale.y = 1.2;
    add(g, new THREE.ConeGeometry(r * 0.5, r * 2.2, 12), mat(cols[(i + 2) % cols.length]), x, h + r * 2.5, 0);
  });
  const kt = new THREE.Group(); kt.position.set(-45, 0, -15);
  add(kt, new THREE.BoxGeometry(8, 30, 8), mat(0xa83020), 0, 15, 0);
  add(kt, new THREE.ConeGeometry(5, 18, 4), mat(0x2a6a3a), 0, 39, 0).rotation.y = Math.PI / 4;
  add(kt, new THREE.OctahedronGeometry(1.6), glow(0xff2020, 3), 0, 50, 0);
  g.add(kt);
}
function tokyoTower(g) {
  const red = mat(0xe0401a), white = mat(0xf2f2f2);
  const t = new THREE.Group();
  const levels = 10;
  for (let i = 0; i < levels; i++) {
    const r0 = 12 * (1 - i / levels) ** 1.5 + 1, r1 = 12 * (1 - (i + 1) / levels) ** 1.5 + 1;
    const seg = add(t, new THREE.CylinderGeometry(r1, r0, 8, 4, 1, true), i % 2 ? white : red, 0, i * 8 + 4, 0);
    seg.material = (i % 2 ? white : red).clone(); seg.material.wireframe = true;
    seg.rotation.y = Math.PI / 4;
  }
  add(t, new THREE.BoxGeometry(10, 2.4, 10), red, 0, 26, 0);
  add(t, new THREE.BoxGeometry(5, 2, 5), white, 0, 50, 0);
  add(t, new THREE.CylinderGeometry(0.2, 0.6, 16, 6), red, 0, 88, 0);
  g.add(t);
  const fuji = new THREE.Group(); fuji.position.set(60, -5, -200);
  add(fuji, new THREE.ConeGeometry(110, 70, 32), mat(0x5a6a9a, { roughness: 1 }), 0, 35, 0);
  add(fuji, new THREE.ConeGeometry(36, 23, 32), mat(0xffffff, { roughness: 0.8 }), 0, 59, 0);
  g.add(fuji);
}

function add(parent, geo, material, x, y, z) {
  const m = new THREE.Mesh(geo, material);
  m.position.set(x, y, z);
  parent.add(m);
  return m;
}
function glass(c = 0x9ac8ff) { return mat(c, { roughness: 0.08, metalness: 0.6, transparent: true, opacity: 0.85 }); }

const LANDMARKS = {
  'London': bigBen, 'New York': empireState, 'San Francisco': goldenGate, 'Los Angeles': hollywood,
  'Shanghai': pearlTower, 'Beijing': templeOfHeaven, 'Sydney': operaHouse, 'Berlin': brandenburg,
  'Moscow': stBasils, 'Tokyo': tokyoTower,
};

function skyline(group, x0, x1, baseY, rng, z0 = -40, z1 = -110, tint = '#2a3140') {
  const n = Math.floor((x1 - x0) / 7);
  const tex = windowTexture('#ffe7a0', tint, rng.int(1, 999));
  const geo = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ map: tex, emissive: 0x8a7040, emissiveMap: tex, emissiveIntensity: 0.15, roughness: 0.8 });
  const inst = new THREE.InstancedMesh(geo, material, n);
  const m4 = new THREE.Matrix4();
  for (let i = 0; i < n; i++) {
    const w = rng.range(6, 14), h = rng.range(10, 55), d = rng.range(6, 12);
    const x = x0 + (i / n) * (x1 - x0) + rng.range(-3, 3);
    const z = rng.range(z0, z1);
    m4.compose(new THREE.Vector3(x, baseY + h / 2, z), new THREE.Quaternion(), new THREE.Vector3(w, h, d));
    inst.setMatrixAt(i, m4);
  }
  tex.repeat.set(1, 3);
  group.add(inst);
}


// ---------------------------------------------------------------- main
export function buildBackdrop(level) {
  const W = WORLDS[level.worldIndex];
  const rng = makeRng(level.index * 31 + 7);
  const group = new THREE.Group();
  const animated = [];
  const x0 = level.bounds.minX - 60, x1 = level.bounds.maxX + 60;
  const fy = level.floor.y;
  const span = x1 - x0;
  const spread = (n, fn) => { for (let i = 0; i < n; i++) fn(x0 + (i + rng.next() * 0.8) * (span / n), i); };

  group.add(skyDome(W.id));

  // celestial objects, parallax-locked to the camera
  const sky = new THREE.Group();
  group.add(sky);
  if (W.id === 'sun') {
    const next = planetMesh(WORLDS[1], 26, 2);
    next.position.set(240, 260, -900);
    sky.add(next);
  } else if (W.alien) {
    const host = planetMesh({ ...W, planet: { ...W.planet, rings: W.id !== 'biolumina', size: 2 } }, 150, level.worldIndex);
    host.position.set(280, 210, -1000);
    sky.add(host);
    animated.push((t) => { host.userData.sphere.rotation.y = t * 0.02; });
    const moon = planetMesh({ ...WORLDS[1], planet: { color: W.accent, size: 0.3 } }, 30, 9);
    moon.position.set(-330, 360, -950);
    sky.add(moon);
  } else if (['jupiter', 'saturn', 'uranus', 'neptune'].includes(W.id)) {
    if (W.planet.rings) {
      const rings = planetMesh(W, 220, 4);
      rings.userData.sphere.visible = false;
      rings.position.set(0, 160, -1100);
      rings.rotation.z = W.planet.tilt ? 1.0 : 0.12;
      sky.add(rings);
    }
    const moon = planetMesh(WORLDS[5], 36, 3);
    moon.position.set(320, 330, -1000);
    sky.add(moon);
  } else if (W.id === 'earth') {
    const moon = planetMesh(WORLDS[1], 20, 5);
    moon.position.set(330, 380, -1000);
    sky.add(moon);
  } else if (W.id === 'mars') {
    const ph = planetMesh(WORLDS[5], 14, 6);
    ph.position.set(260, 300, -1000);
    sky.add(ph);
  } else if (W.id === 'asteroids') {
    const jup = planetMesh(WORLDS[6], 130, 7);
    jup.position.set(360, 160, -1100);
    sky.add(jup);
  }

  const floor = floorMesh(level, W, x0, x1);
  if (floor) group.add(floor);

  const ter = TERRAIN[W.id];
  if (ter) group.add(makeTerrain(ter[0], x0 - 150, x1 + 150, fy, level.worldIndex * 13 + 5, { zNear: ter[1], emissive: W.id === 'prismara' ? 0x140830 : W.id === 'biolumina' ? 0x01100a : 0x000000, roughness: W.id === 'uranus' || W.id === 'prismara' ? 0.35 : 0.95 }));

  const scen = new THREE.Group();
  group.add(scen);
  const clouds = (n, cols, y0, y1, z0, z1, s0, s1, op = 0.85) => spread(n, (x) => {
    const c = cloudSprite(cols[Math.floor(rng.next() * cols.length)], rng.range(s0, s1), op);
    c.position.set(x, rng.range(y0, y1), rng.range(z0, z1));
    scen.add(c);
    const sp = rng.range(0.3, 1.2);
    animated.push((t) => { c.position.x = x + Math.sin(t * 0.02 * sp + x) * 10 + t * 0.4 * sp % 1; });
  });

  switch (W.id) {
    case 'sun': {
      // giant plasma loops at every depth, plus a few colossal far ones
      spread(Math.ceil(span / 40) + 4, (x) => {
        const z = rng.range(-45, -300);
        const s = rng.range(18, 70) * (1 - z / 400);
        scen.add(prominence(rng, x, fy - 2, z, s, s * rng.range(0.45, 0.9), rng.range(0.8, 2.6) * (s / 40)));
      });
      for (let i = 0; i < 2; i++) scen.add(prominence(rng, x0 + rng.next() * span, fy - 30, -900, rng.range(300, 450), rng.range(120, 200), rng.range(10, 16)));
      // spicules: flickering jets dancing on the surface near the play area
      const spMat = flickerMaterial(0xffa040);
      spread(Math.ceil(span / 3), (x) => {
        const h = rng.range(2, 9);
        const m = new THREE.Mesh(new THREE.ConeGeometry(rng.range(0.25, 0.7), h, 6, 1, true), spMat);
        m.position.set(x, fy + h / 2 - 0.2, rng.range(-8, -70));
        scen.add(m);
        const ph = rng.range(0, 6), sp = rng.range(0.8, 2.2);
        animated.push((t) => { m.scale.y = 0.4 + Math.abs(Math.sin(t * sp + ph)) * 0.9; m.position.y = fy + h * m.scale.y / 2 - 0.2; });
      });
      // hot glow pooled on the surface
      spread(Math.ceil(span / 30), (x) => {
        const g = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(0xffb040), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.5 }));
        g.position.set(x, fy + 2, rng.range(-20, -120));
        g.scale.set(40, 14, 1);
        scen.add(g);
      });
      break;
    }
    case 'mercury': {
      spread(Math.ceil(span / 30), (x) => {
        const s = rng.range(1, 4);
        const m = new THREE.Mesh(rockGeo(s * 2, s, s * 2, rng.int(1, 99)), mat(0x6e6a64, { roughness: 1, flatShading: true }));
        m.position.set(x, fy + s * 0.2, rng.range(-12, -40));
        scen.add(m);
      });
      break;
    }
    case 'venus': {
      clouds(Math.ceil(span / 14), [0xe8a060, 0xd08a48, 0xf0b878], fy + 8, fy + 40, -40, -200, 20, 50, 0.7);
      // occasional lightning glow inside the clouds
      const flash = new THREE.PointLight(0xffe0a0, 0, 300, 1.5);
      flash.position.set(0, fy + 40, -80);
      scen.add(flash);
      animated.push((t, camX) => { const k = Math.sin(t * 0.7) > 0.985 ? 1 : 0; flash.intensity = k * 4000; flash.position.x = camX + 20; });
      break;
    }
    case 'earth': {
      const city = level.location;
      skyline(scen, x0, x1, fy, rng, -75, -150, city === 'Tokyo' || city === 'Shanghai' ? '#1a2440' : '#2a3140');
      skyline(scen, x0, x1, fy, rng, -170, -260, '#3a4250');
      const lm = LANDMARKS[city];
      for (let x = x0 + 80; x < x1; x += 160) {
        const g = new THREE.Group();
        lm(g);
        g.position.set(x + rng.range(-20, 20), fy, -95);
        scen.add(g);
        if (g.userData.spinner) animated.push((t) => { g.userData.spinner.rotation.z = t * 0.05; });
      }
      spread(Math.ceil(span / 9), (x) => {
        if (rng.chance(0.5)) {
          add(scen, new THREE.CylinderGeometry(0.3, 0.4, 5, 6), mat(0x6a4a2a), x, fy + 2.5, -20);
          add(scen, new THREE.SphereGeometry(2.0, 10, 8), mat(0x3a8a3a, { flatShading: true }), x, fy + 5.6, -20);
        } else {
          add(scen, new THREE.CylinderGeometry(0.12, 0.15, 7, 6), mat(0x30343a, { metalness: 0.7 }), x, fy + 3.5, -16);
          add(scen, new THREE.SphereGeometry(0.4, 8, 6), glow(0xfff0c0, 1.5), x, fy + 7.1, -16);
        }
      });
      const pl = makeMoverMesh({ kind: 'plane', w: 11, h: 1.6 }, W, city, 1);
      pl.scale.setScalar(1.5);
      scen.add(pl);
      animated.push((t) => { pl.position.set(x0 + ((t * 8) % span), 60, -170); });
      break;
    }
    case 'mars': {
      for (let i = 0; i < 3; i++) {
        const rv = makeMoverMesh({ kind: 'rover', w: 5, h: 2 }, W, null, i);
        rv.scale.setScalar(1.4);
        const z = -24 - i * 10, speed = rng.range(1, 2.5) * (rng.chance(0.5) ? 1 : -1), off = rng.range(0, span);
        rv.position.set(0, fy, z);
        if (speed < 0) rv.rotation.y = Math.PI;
        scen.add(rv);
        animated.push((t) => { rv.position.x = x0 + ((((off + t * speed) % span) + span) % span); });
      }
      // dust devils
      const dMat = flickerMaterial(0xc88050);
      spread(Math.ceil(span / 60), (x) => {
        const h = rng.range(15, 35);
        const dv = new THREE.Mesh(new THREE.CylinderGeometry(h * 0.18, 0.6, h, 12, 1, true), dMat);
        const z = rng.range(-50, -140);
        dv.position.set(x, fy + h / 2, z);
        scen.add(dv);
        const sp = rng.range(-2, 2);
        animated.push((t) => { dv.rotation.y = t * 3; dv.position.x = x + Math.sin(t * 0.1 + x) * 25 + t * sp % 1; });
      });
      break;
    }
    case 'asteroids': {
      spread(Math.ceil(span / 5), (x) => {
        const s = rng.range(1, 7);
        const m = new THREE.Mesh(rockGeo(s, s * rng.range(0.6, 1), s, rng.int(1, 99)), mat(rng.chance(0.5) ? 0x5a5048 : 0x7a6a5a, { roughness: 1, flatShading: true }));
        m.position.set(x, rng.range(fy - 10, 45), rng.range(-12, -220));
        const sp = rng.range(-0.5, 0.5), sp2 = rng.range(-0.3, 0.3);
        scen.add(m);
        animated.push((t) => { m.rotation.set(t * sp, t * sp2, 0); });
      });
      break;
    }
    case 'jupiter': case 'saturn': case 'neptune': case 'uranus': {
      const cols = { jupiter: [0xf0dcc0, 0xd8b088, 0xfff0e0], saturn: [0xfff0d0, 0xe8d8a8, 0xffffff], neptune: [0x5a78e0, 0x2a40a0, 0x8aa0f0], uranus: [0xe8ffff, 0xb0eef0, 0xffffff] }[W.id];
      clouds(Math.ceil(span / 10), cols, fy - 2, fy + 24, -30, -220, 14, 40, 0.9);
      if (W.id === 'uranus') {
        spread(Math.ceil(span / 12), (x) => {
          const h = rng.range(8, 30);
          const sp = add(scen, new THREE.ConeGeometry(rng.range(1.5, 4), h, 5), mat(0xd8ffff, { roughness: 0.1, metalness: 0.3, transparent: true, opacity: 0.85, emissive: 0x206070 }), x, fy + h / 2, rng.range(-35, -90));
          sp.rotation.z = 0.25;
        });
      }
      if (W.id === 'neptune' || level.redSpot) {
        const flash = new THREE.PointLight(0xc8d8ff, 0, 400, 1.2);
        scen.add(flash);
        animated.push((t, camX) => { const k = Math.sin(t * 1.3) > 0.97 ? 1 : 0; flash.intensity = k * 6000; flash.position.set(camX + Math.sin(t) * 40, fy + 30, -90); });
      }
      break;
    }
    case 'prismara': {
      spread(Math.ceil(span / 8), (x) => {
        const s = rng.range(2, 9);
        const c = [0xff7af0, 0x8ab0ff, 0xb08aff, 0x7affe0][rng.int(0, 3)];
        const m = add(scen, new THREE.OctahedronGeometry(s, 0), mat(c, { roughness: 0.03, metalness: 0.6, emissive: c, emissiveIntensity: 0.3, transparent: true, opacity: 0.82 }), x, fy + rng.range(0, 25), rng.range(-40, -150));
        m.scale.y = rng.range(1.5, 3);
        const sp = rng.range(-0.3, 0.3);
        animated.push((t) => { m.rotation.y = t * sp; });
      });
      break;
    }
    case 'mechanus': {
      spread(Math.ceil(span / 24), (x) => {
        const r = rng.range(6, 22);
        const gear = gearMesh(r, mat(0x8a6a3a, { metalness: 0.85, roughness: 0.3 }));
        gear.position.set(x, fy + rng.range(0, 30), rng.range(-35, -120));
        const sp = rng.range(0.1, 0.4) * (rng.chance(0.5) ? 1 : -1);
        scen.add(gear);
        animated.push((t) => { gear.rotation.z = t * sp; });
      });
      spread(Math.ceil(span / 30), (x) => {
        add(scen, new THREE.CylinderGeometry(rng.range(2, 5), rng.range(3, 6), 70, 12), mat(0x5a4020, { metalness: 0.8, roughness: 0.35 }), x, fy + 35, rng.range(-40, -120));
      });
      clouds(Math.ceil(span / 25), [0x8a6a40, 0x6a5030], fy + 10, fy + 40, -60, -200, 20, 50, 0.5);
      break;
    }
    case 'biolumina': {
      spread(Math.ceil(span / 10), (x) => {
        const h = rng.range(6, 24);
        const z = rng.range(-25, -100);
        add(scen, new THREE.CylinderGeometry(0.6, 1.2, h, 8), mat(0x1a4a3a), x, fy + h / 2, z);
        const c = [0x3affc0, 0xff5ad0, 0x5ab0ff, 0xc0ff5a][rng.int(0, 3)];
        const cap = add(scen, new THREE.SphereGeometry(rng.range(3, 8), 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), mat(c, { emissive: c, emissiveIntensity: 0.9, roughness: 0.5 }), x, fy + h, z);
        cap.scale.y = 0.6;
      });
      spread(Math.ceil(span / 14), (x) => {
        const h = rng.range(20, 50);
        add(scen, new THREE.CylinderGeometry(1.5, 3, h, 7), mat(0x0e2a24, { roughness: 1 }), x, fy + h / 2, rng.range(-40, -120));
      });
      break;
    }
    case 'chronos': {
      spread(Math.ceil(span / 30), (x) => {
        const clock = clockMesh(rng.range(5, 12));
        clock.position.set(x, fy + rng.range(8, 34), rng.range(-60, -150));
        clock.rotation.y = rng.range(-0.4, 0.4);
        scen.add(clock);
        const sp = rng.range(-2, 2);
        animated.push((t) => { clock.userData.hand.rotation.z = -t * sp; clock.userData.hand2.rotation.z = -t * sp / 12; });
      });
      spread(Math.ceil(span / 40), (x) => {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(rng.range(8, 16), 0.4, 6, 48), glow(0xffd86a, 1.2));
        ring.position.set(x, fy + rng.range(10, 30), rng.range(-60, -140));
        scen.add(ring);
        const sp = rng.range(0.2, 0.6);
        animated.push((t) => { ring.rotation.x = t * sp; ring.rotation.y = t * sp * 0.6; });
      });
      break;
    }
  }

  return {
    group,
    sky,
    floor,
    update(t, camX, camY) {
      sky.position.set(camX * 0.95, camY * 0.6, 0);
      for (const f of animated) f(t, camX, camY);
    },
  };
}

export function gearMesh(r, material, teeth = 0) {
  const g = new THREE.Group();
  const n = teeth || Math.max(8, Math.round(r * 2.2));
  const shape = new THREE.Shape();
  for (let i = 0; i < n * 2; i++) {
    const a = (i / (n * 2)) * Math.PI * 2;
    const rr = i % 2 ? r : r * 0.86;
    const a2 = a + Math.PI / (n * 2);
    if (i === 0) shape.moveTo(Math.cos(a) * rr, Math.sin(a) * rr);
    else shape.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
    shape.lineTo(Math.cos(a2) * rr, Math.sin(a2) * rr);
  }
  const hole = new THREE.Path();
  hole.absarc(0, 0, r * 0.3, 0, Math.PI * 2, true);
  shape.holes.push(hole);
  const geo = new THREE.ExtrudeGeometry(shape, { depth: Math.max(0.6, r * 0.12), bevelEnabled: true, bevelSize: 0.1, bevelThickness: 0.1, bevelSegments: 1, curveSegments: 4 });
  const m = new THREE.Mesh(geo, material);
  m.castShadow = true;
  g.add(m);
  return g;
}

function clockMesh(r) {
  const g = new THREE.Group();
  add(g, new THREE.CylinderGeometry(r, r, 0.6, 48), mat(0xf0e8d0, { roughness: 0.4, emissive: 0x302810 }), 0, 0, 0).rotation.x = Math.PI / 2;
  add(g, new THREE.TorusGeometry(r, 0.5, 8, 48), mat(0xd8b040, { metalness: 0.9, roughness: 0.2 }), 0, 0, 0.3);
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    add(g, new THREE.BoxGeometry(0.3, r * 0.15, 0.1), mat(0x222222), Math.sin(a) * r * 0.82, Math.cos(a) * r * 0.82, 0.35).rotation.z = -a;
  }
  const hand = new THREE.Group(); hand.position.z = 0.4; g.add(hand);
  add(hand, new THREE.BoxGeometry(0.25, r * 0.8, 0.1), mat(0x222222), 0, r * 0.4, 0);
  const hand2 = new THREE.Group(); hand2.position.z = 0.45; g.add(hand2);
  add(hand2, new THREE.BoxGeometry(0.4, r * 0.55, 0.1), mat(0x222222), 0, r * 0.27, 0);
  g.userData.hand = hand; g.userData.hand2 = hand2;
  return g;
}
