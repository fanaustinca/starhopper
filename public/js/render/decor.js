// World backdrops: sky dome, celestial bodies, the hazard floor, and
// 3D parallax scenery (Earth landmarks, Martian mesas, gears, crystals...).
import * as THREE from 'three';
import { makeRng } from '../core/rng.js';
import { WORLDS } from '../core/config.js';
import { mat, makeMoverMesh, rockGeo } from './vehicles.js';
import { planetTexture, ringTexture, glowTexture, windowTexture } from './textures.js';

const glow = (c, i = 2) => mat(c, { emissive: c, emissiveIntensity: i });

function skyDome(top, horizon) {
  const geo = new THREE.SphereGeometry(900, 32, 16);
  const m = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { top: { value: new THREE.Color(top) }, horizon: { value: new THREE.Color(horizon) } },
    vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: 'uniform vec3 top; uniform vec3 horizon; varying vec3 vP; void main(){ float h = clamp(vP.y*1.6+0.25,0.0,1.0); gl_FragColor = vec4(mix(horizon, top, pow(h,0.8)),1.0); }',
  });
  const mesh = new THREE.Mesh(geo, m);
  mesh.renderOrder = -10;
  mesh.frustumCulled = false;
  return mesh;
}

function stars(count, radius, color = 0xffffff, size = 1.6, rng) {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const u = rng.next() * 2 - 1, a = rng.next() * Math.PI * 2;
    const r = Math.sqrt(1 - u * u);
    pos[i * 3] = Math.cos(a) * r * radius;
    pos[i * 3 + 1] = Math.abs(u) * radius * 0.9 + 20;
    pos[i * 3 + 2] = Math.sin(a) * r * radius - radius * 0.3;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const p = new THREE.Points(geo, new THREE.PointsMaterial({ color, size, sizeAttenuation: false, fog: false, transparent: true, opacity: 0.9, depthWrite: false }));
  p.frustumCulled = false;
  return p;
}

function planetMesh(world, radius, seed) {
  const g = new THREE.Group();
  const tex = planetTexture(world, seed);
  const m = world.planet.emissive
    ? new THREE.MeshBasicMaterial({ map: tex, fog: false })
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
function floorMesh(type, y, x0, x1, worldDef) {
  if (type === 'void') return null;
  const w = x1 - x0 + 600;
  const geo = new THREE.PlaneGeometry(w, 400, 1, 1);
  geo.rotateX(-Math.PI / 2);
  let m;
  let animated = false;
  if (type === 'lava' || type === 'acid' || type === 'swamp') {
    const c1 = { lava: [0xd02800, 0xffb030], acid: [0x3a6a10, 0xb8e030], swamp: [0x06302a, 0x20d8a0] }[type];
    m = new THREE.ShaderMaterial({
      fog: true,
      uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, { t: { value: 0 }, k: { value: { lava: 1.25, acid: 0.75, swamp: 0.55 }[type] }, a: { value: new THREE.Color(c1[0]) }, b: { value: new THREE.Color(c1[1]) } }]),
      vertexShader: '#include <fog_pars_vertex>\nvarying vec2 vW; void main(){ vec4 wp = modelMatrix*vec4(position,1.0); vW = wp.xz; vec4 mvPosition = viewMatrix*wp; gl_Position = projectionMatrix*mvPosition;\n#include <fog_vertex>\n}',
      fragmentShader: '#include <fog_pars_fragment>\nuniform float t; uniform vec3 a; uniform vec3 b; varying vec2 vW;\nfloat n(vec2 p){ return sin(p.x*0.35+t*0.8)*sin(p.y*0.5-t*0.6)+sin((p.x+p.y)*0.21+t*1.3)*0.6; }\nuniform float k; void main(){ float v = n(vW)*0.5+0.5; v = pow(v, 2.0); vec3 c = mix(a*0.35, b, v); gl_FragColor = vec4(c*k,1.0);\n#include <fog_fragment>\n}',
    });
    animated = true;
  } else {
    const params = {
      mercury: { color: 0xd8dde4, metalness: 1, roughness: 0.12 },
      street: { color: 0x3a4048, roughness: 0.9 },
      gas: { color: worldDef.fog, roughness: 1, transparent: true, opacity: 0.85 },
      ice: { color: 0xc8f4ff, roughness: 0.15, metalness: 0.2 },
      water: { color: 0x10306a, roughness: 0.1, metalness: 0.6, transparent: true, opacity: 0.9 },
      crystal: { color: 0x7a5ad0, roughness: 0.08, metalness: 0.5, emissive: 0x2a1060 },
    }[type] || { color: 0x333333 };
    m = new THREE.MeshStandardMaterial(params);
  }
  const mesh = new THREE.Mesh(geo, m);
  mesh.position.set((x0 + x1) / 2, y, -150);
  mesh.receiveShadow = type !== 'gas';
  mesh.userData.animated = animated;
  return mesh;
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
  const x0 = level.bounds.minX - 40, x1 = level.bounds.maxX + 40;
  const fy = level.floor.y;

  group.add(skyDome(W.sky[0], W.sky[1]));
  const dark = ['asteroids', 'mercury', 'chronos', 'prismara', 'biolumina', 'neptune', 'sun'].includes(W.id);
  if (dark) group.add(stars(1600, 700, 0xffffff, 1.5, rng));

  // celestial objects (fixed relative to camera horizontally, see update)
  const sky = new THREE.Group();
  group.add(sky);
  const sunSizes = { mercury: 160, venus: 110, earth: 70, mars: 55, asteroids: 40, jupiter: 30, saturn: 24, uranus: 16, neptune: 12 };
  if (sunSizes[W.id]) {
    const s = sunGlow(sunSizes[W.id]);
    s.position.set(-180, 260, -700);
    sky.add(s);
  }
  if (W.id === 'sun') {
    const next = planetMesh(WORLDS[1], 22, 2);
    next.position.set(200, 220, -650);
    sky.add(next);
  } else if (W.alien) {
    // alien systems: a big ringed host world + a moon
    const host = planetMesh({ ...W, planet: { ...W.planet, rings: W.id !== 'biolumina', size: 2 } }, 120, level.worldIndex);
    host.position.set(220, 180, -720);
    sky.add(host);
    animated.push((t) => { host.userData.sphere.rotation.y = t * 0.02; });
    const moon = planetMesh({ ...WORLDS[1], planet: { color: W.accent, size: 0.3 } }, 26, 9);
    moon.position.set(-260, 300, -680);
    sky.add(moon);
  } else if (['jupiter', 'saturn', 'uranus', 'neptune'].includes(W.id)) {
    // you're in the clouds: the planet's moons and rings hang overhead
    if (W.planet.rings) {
      const rings = planetMesh(W, 160, 4);
      rings.userData.sphere.visible = false;
      rings.position.set(0, 120, -800);
      rings.rotation.z = W.planet.tilt ? 1.0 : 0.12;
      sky.add(rings);
    }
    const moon = planetMesh(WORLDS[5], 30, 3);
    moon.position.set(240, 260, -700);
    sky.add(moon);
  } else if (W.id === 'earth') {
    const moon = planetMesh(WORLDS[1], 18, 5);
    moon.position.set(260, 280, -700);
    sky.add(moon);
  } else if (W.id === 'mars') {
    const ph = planetMesh(WORLDS[5], 12, 6);
    ph.position.set(200, 240, -700);
    sky.add(ph);
  } else if (W.id === 'asteroids') {
    const jup = planetMesh(WORLDS[6], 90, 7);
    jup.position.set(260, 120, -760);
    sky.add(jup);
  }

  const floor = floorMesh(level.floor.type, fy, x0, x1, W);
  if (floor) {
    group.add(floor);
    if (floor.userData.animated) animated.push((t) => { floor.material.uniforms.t.value = t; });
  }

  // ---- scenery per world ----
  const scen = new THREE.Group();
  group.add(scen);
  const span = x1 - x0;
  const spread = (n, fn) => { for (let i = 0; i < n; i++) fn(x0 + (i + rng.next() * 0.8) * (span / n), i); };

  switch (W.id) {
    case 'sun': {
      spread(Math.ceil(span / 60), (x) => {
        const r = rng.range(15, 35);
        const arc = new THREE.Mesh(new THREE.TorusGeometry(r, rng.range(1.2, 2.6), 10, 40, Math.PI), glow(rng.chance(0.5) ? 0xff5a10 : 0xff8a20, 1.1));
        arc.position.set(x, fy, rng.range(-60, -140));
        arc.rotation.y = rng.range(-0.4, 0.4);
        scen.add(arc);
        animated.push((t) => { arc.scale.setScalar(1 + Math.sin(t * 0.7 + x) * 0.05); });
      });
      break;
    }
    case 'mercury': case 'mars': case 'venus': {
      const col = { mercury: 0x6b6862, mars: 0x9a4a2a, venus: 0x8a4a2a }[W.id];
      spread(Math.ceil(span / 22), (x) => {
        const h = rng.range(8, W.id === 'mars' ? 40 : 22);
        let geo;
        if (W.id === 'mars') geo = new THREE.CylinderGeometry(rng.range(8, 16), rng.range(14, 24), h, 7);
        else if (W.id === 'venus' && rng.chance(0.4)) geo = new THREE.ConeGeometry(rng.range(14, 26), h * 1.6, 9);
        else geo = new THREE.ConeGeometry(rng.range(10, 22), h, 6);
        const m = new THREE.Mesh(geo, mat(col, { roughness: 1, flatShading: true }));
        m.position.set(x, fy + h / 2 - 1, rng.range(-30, -120));
        m.rotation.y = rng.next() * 3;
        scen.add(m);
      });
      if (W.id === 'mercury') {
        spread(Math.ceil(span / 40), (x) => {
          const ring = new THREE.Mesh(new THREE.TorusGeometry(rng.range(6, 12), 1.4, 6, 18), mat(0x7a766e, { roughness: 1, flatShading: true }));
          ring.rotation.x = Math.PI / 2; ring.position.set(x, fy + 0.5, rng.range(-20, -60));
          scen.add(ring);
        });
      }
      if (W.id === 'mars') {
        // background rovers trundling along
        for (let i = 0; i < 3; i++) {
          const rv = makeMoverMesh({ kind: 'rover', w: 5, h: 2 }, W, null, i);
          rv.scale.setScalar(1.4);
          const z = -28 - i * 14, speed = rng.range(1, 2.5) * (rng.chance(0.5) ? 1 : -1), off = rng.range(0, span);
          rv.position.set(0, fy, z);
          if (speed < 0) rv.rotation.y = Math.PI;
          scen.add(rv);
          animated.push((t) => { rv.position.x = x0 + ((((off + t * speed) % span) + span) % span); });
        }
      }
      if (W.id === 'venus') {
        spread(Math.ceil(span / 30), (x) => {
          const cl = new THREE.Mesh(new THREE.SphereGeometry(rng.range(8, 16), 12, 8), mat(0xe8a060, { roughness: 1, transparent: true, opacity: 0.55 }));
          cl.scale.y = 0.35; cl.position.set(x, rng.range(14, 30), rng.range(-40, -90));
          scen.add(cl);
          animated.push((t) => { cl.position.x = x + Math.sin(t * 0.1 + x) * 6; });
        });
      }
      break;
    }
    case 'earth': {
      const city = level.location;
      skyline(scen, x0, x1, fy, rng, -75, -150, city === 'Tokyo' || city === 'Shanghai' ? '#1a2440' : '#2a3140');
      skyline(scen, x0, x1, fy, rng, -170, -260, '#3a4250');
      const lm = LANDMARKS[city];
      for (let x = x0 + 60; x < x1; x += 150) {
        const g = new THREE.Group();
        lm(g);
        g.position.set(x + rng.range(-20, 20), fy, -95);
        scen.add(g);
        if (g.userData.spinner) animated.push((t) => { g.userData.spinner.rotation.z = t * 0.05; });
      }
      // street trees / lamp posts in the near background
      spread(Math.ceil(span / 9), (x) => {
        if (rng.chance(0.5)) {
          add(scen, new THREE.CylinderGeometry(0.3, 0.4, 5, 6), mat(0x6a4a2a), x, fy + 2.5, -20);
          add(scen, new THREE.SphereGeometry(2.0, 8, 6), mat(0x3a8a3a, { flatShading: true }), x, fy + 5.6, -20);
        } else {
          add(scen, new THREE.CylinderGeometry(0.12, 0.15, 7, 6), mat(0x30343a, { metalness: 0.7 }), x, fy + 3.5, -16);
          add(scen, new THREE.SphereGeometry(0.4, 8, 6), glow(0xfff0c0, 1.5), x, fy + 7.1, -16);
        }
      });
      // a plane cruising far away
      const pl = makeMoverMesh({ kind: 'plane', w: 11, h: 1.6 }, W, city, 1);
      pl.scale.setScalar(1.5);
      scen.add(pl);
      animated.push((t) => { pl.position.set(x0 + ((t * 8) % span), 55, -160); });
      break;
    }
    case 'asteroids': {
      spread(Math.ceil(span / 6), (x) => {
        const s = rng.range(1, 6);
        const m = new THREE.Mesh(rockGeo(s, s * rng.range(0.6, 1), s, rng.int(1, 99)), mat(rng.chance(0.5) ? 0x5a5048 : 0x7a6a5a, { roughness: 1, flatShading: true }));
        m.position.set(x, rng.range(fy, 40), rng.range(-12, -150));
        const sp = rng.range(-0.5, 0.5), sp2 = rng.range(-0.3, 0.3);
        scen.add(m);
        animated.push((t) => { m.rotation.set(t * sp, t * sp2, 0); });
      });
      break;
    }
    case 'jupiter': case 'saturn': case 'neptune': case 'uranus': {
      const cols = { jupiter: [0xe8c090, 0xc08050, 0xf0e0c0], saturn: [0xf0e0b0, 0xd8c088, 0xfff0d0], neptune: [0x3a5ee0, 0x2a40a0, 0x6a8af0], uranus: [0xb0f0f0, 0x80d8e0, 0xe0ffff] }[W.id];
      for (let i = 0; i < 6; i++) {
        const band = new THREE.Mesh(new THREE.PlaneGeometry(span + 800, 60), mat(cols[i % 3], { roughness: 1, transparent: true, opacity: 0.55, side: THREE.DoubleSide }));
        band.rotation.x = -Math.PI / 2;
        band.position.set((x0 + x1) / 2, fy - 2 + i * 1.2, -40 - i * 55);
        scen.add(band);
        animated.push((t) => { band.position.x = (x0 + x1) / 2 + Math.sin(t * 0.05 + i) * 20; });
      }
      spread(Math.ceil(span / 25), (x) => {
        const cl = new THREE.Group();
        for (let k = 0; k < 4; k++) add(cl, new THREE.SphereGeometry(rng.range(3, 7), 12, 8), mat(cols[k % 3], { roughness: 1, transparent: true, opacity: 0.6 }), k * 4, rng.range(-1, 1), rng.range(-2, 2)).scale.y = 0.6;
        cl.position.set(x, fy + rng.range(-2, 14), rng.range(-45, -130));
        scen.add(cl);
        const sp = rng.range(0.5, 2);
        animated.push((t) => { cl.position.x = x + Math.sin(t * 0.1 * sp) * 8; });
      });
      if (W.id === 'uranus') {
        spread(Math.ceil(span / 12), (x) => {
          const h = rng.range(8, 30);
          const sp = add(scen, new THREE.ConeGeometry(rng.range(1.5, 4), h, 5), mat(0xd8ffff, { roughness: 0.1, metalness: 0.3, transparent: true, opacity: 0.85, emissive: 0x206070 }), x, fy + h / 2, rng.range(-15, -70));
          sp.rotation.z = 0.25;
          sp.position.z -= 20;
        });
      }
      if (level.redSpot) {
        const vortex = new THREE.Mesh(new THREE.TorusGeometry(80, 18, 12, 48), mat(0xc0402a, { roughness: 1, transparent: true, opacity: 0.6 }));
        vortex.rotation.x = Math.PI / 2; vortex.position.set((x0 + x1) / 2, fy + 2, -160);
        scen.add(vortex);
        animated.push((t) => { vortex.rotation.z = t * 0.3; });
      }
      break;
    }
    case 'prismara': {
      spread(Math.ceil(span / 8), (x) => {
        const s = rng.range(2, 9);
        const c = [0xff7af0, 0x8ab0ff, 0xb08aff, 0x7affe0][rng.int(0, 3)];
        const m = add(scen, new THREE.OctahedronGeometry(s, 0), mat(c, { roughness: 0.05, metalness: 0.4, emissive: c, emissiveIntensity: 0.35, transparent: true, opacity: 0.8 }), x, fy + rng.range(0, 25), rng.range(-40, -140));
        m.scale.y = rng.range(1.5, 3);
        const sp = rng.range(-0.3, 0.3);
        animated.push((t) => { m.rotation.y = t * sp; });
      });
      break;
    }
    case 'mechanus': {
      spread(Math.ceil(span / 26), (x) => {
        const r = rng.range(6, 20);
        const gear = gearMesh(r, mat(0x8a6a3a, { metalness: 0.8, roughness: 0.35 }));
        gear.position.set(x, fy + rng.range(0, 30), rng.range(-35, -110));
        const sp = rng.range(0.1, 0.4) * (rng.chance(0.5) ? 1 : -1);
        scen.add(gear);
        animated.push((t) => { gear.rotation.z = t * sp; });
      });
      spread(Math.ceil(span / 30), (x) => {
        add(scen, new THREE.CylinderGeometry(rng.range(2, 5), rng.range(3, 6), 60, 8), mat(0x5a4020, { metalness: 0.7 }), x, fy + 30, rng.range(-40, -120));
      });
      break;
    }
    case 'biolumina': {
      spread(Math.ceil(span / 10), (x) => {
        const h = rng.range(6, 24);
        const z = rng.range(-25, -100);
        add(scen, new THREE.CylinderGeometry(0.6, 1.2, h, 8), mat(0x1a4a3a), x, fy + h / 2, z);
        const c = [0x3affc0, 0xff5ad0, 0x5ab0ff, 0xc0ff5a][rng.int(0, 3)];
        const cap = add(scen, new THREE.SphereGeometry(rng.range(3, 8), 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), mat(c, { emissive: c, emissiveIntensity: 0.9, roughness: 0.5 }), x, fy + h, z);
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
    update(t, camX, camY) {
      sky.position.set(camX * 0.92, camY * 0.5, 0);
      for (const f of animated) f(t);
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
