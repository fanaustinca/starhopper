// Low-poly vehicle / moving-object meshes. Each mesh's origin is its
// bottom-left corner in x/y (matching the sim's collider coordinates), z centred.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const matCache = new Map();
export function mat(color, opts = {}) {
  const key = color + JSON.stringify(opts);
  if (!matCache.has(key)) {
    const { physical, ...rest } = opts;
    const M = physical ? THREE.MeshPhysicalMaterial : THREE.MeshStandardMaterial;
    matCache.set(key, new M({ color, roughness: 0.45, metalness: 0.1, ...rest }));
  }
  return matCache.get(key);
}
const glassMat = () => mat(0x223348, { roughness: 0.1, metalness: 0.5, transparent: true, opacity: 0.55 });
const glowMat = (c) => mat(c, { emissive: c, emissiveIntensity: 2.2 });

function box(group, w, h, d, material, x, y, z, rounded = 0) {
  const geo = rounded ? new RoundedBoxGeometry(w, h, d, 2, rounded) : new THREE.BoxGeometry(w, h, d);
  const m = new THREE.Mesh(geo, material);
  m.position.set(x + w / 2, y + h / 2, z);
  m.castShadow = true; m.receiveShadow = true;
  group.add(m);
  return m;
}

function wheel(group, x, y, z, r = 0.38, width = 0.3) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, width, 16), mat(0x15161a, { roughness: 0.8 }));
  m.rotation.x = Math.PI / 2;
  m.position.set(x, y, z);
  m.castShadow = true;
  group.add(m);
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.45, r * 0.45, width + 0.02, 10), mat(0xb0b6c0, { metalness: 0.8, roughness: 0.3 }));
  hub.rotation.x = Math.PI / 2; hub.position.copy(m.position);
  group.add(hub);
  group.userData.wheels = group.userData.wheels || [];
  group.userData.wheels.push(m, hub);
  return m;
}

function bus(g, color = 0xd0201c) {
  const red = mat(color, { roughness: 0.35, metalness: 0.15 });
  const D = 2.5;
  // back wall + floors (cutaway: front side open so the robot is visible inside)
  box(g, 8, 4.6, 0.12, red, 0, 0, -D / 2);
  box(g, 7.8, 1.4, 0.06, glassMat(), 0.1, 0.75, -D / 2 + 0.1);
  box(g, 7.8, 1.4, 0.06, glassMat(), 0.1, 2.85, -D / 2 + 0.1);
  box(g, 8, 0.2, D, red, 0, 0.3, 0);             // lower deck floor (top 0.5)
  box(g, 8, 0.3, D, red, 0, 2.3, 0);             // upper deck floor (top 2.6)
  box(g, 8, 0.3, D, red, 0, 4.3, 0, 0.12);       // roof (top 4.6)
  box(g, 8, 0.5, 0.1, red, 0, 0, D / 2);         // front skirt
  box(g, 8, 0.35, 0.1, mat(0xf2e6c8), 0, 2.0, D / 2); // cream band
  box(g, 0.15, 4.6, D, red, 0, 0, 0);             // rear end
  box(g, 0.4, 4.4, D, red, 7.6, 0, 0, 0.1);       // front end
  box(g, 0.05, 1.3, D * 0.8, glassMat(), 7.98, 0.8, 0);
  for (let x = 0.15; x < 7.7; x += 1.9) {         // front pillars
    box(g, 0.1, 4.3, 0.1, red, x, 0, D / 2);
  }
  box(g, 0.25, 0.2, 0.3, glowMat(0xfff0b0), 7.8, 0.4, 0.8);
  box(g, 0.25, 0.2, 0.3, glowMat(0xfff0b0), 7.8, 0.4, -0.8);
  box(g, 0.1, 0.2, 0.3, glowMat(0xff2020), -0.05, 0.4, 0.8);
  box(g, 2, 0.35, 0.05, glowMat(0xffc040), 5.4, 4.0, D / 2 + 0.06); // route sign
  wheel(g, 1.4, 0.0, D / 2 - 0.1, 0.45); wheel(g, 1.4, 0, -D / 2 + 0.1, 0.45);
  wheel(g, 6.4, 0.0, D / 2 - 0.1, 0.45); wheel(g, 6.4, 0, -D / 2 + 0.1, 0.45);
}

function car(g, color, len = 4.2, taxi = false) {
  const body = mat(color, { roughness: 0.25, metalness: 0.4 });
  box(g, len, 0.75, 2.0, body, 0, 0.25, 0, 0.18);
  box(g, len * 0.55, 0.45, 1.8, body, len * 0.2, 0.9, 0, 0.12);
  box(g, len * 0.52, 0.36, 1.84, glassMat(), len * 0.215, 0.92, 0);
  if (taxi) box(g, 0.6, 0.18, 0.3, glowMat(0xffee88), len * 0.45, 1.35, 0);
  box(g, 0.08, 0.15, 0.4, glowMat(0xfff4c0), len - 0.04, 0.6, 0.6);
  box(g, 0.08, 0.15, 0.4, glowMat(0xfff4c0), len - 0.04, 0.6, -0.6);
  box(g, 0.08, 0.15, 0.4, glowMat(0xff2020), -0.04, 0.6, 0.6);
  wheel(g, 0.9, 0.0, 0.95, 0.34); wheel(g, len - 0.9, 0.0, 0.95, 0.34);
  wheel(g, 0.9, 0.0, -0.95, 0.34); wheel(g, len - 0.9, 0.0, -0.95, 0.34);
}

function truck(g, color) {
  box(g, 6.6, 2.5, 2.4, mat(0xe8eaee, { roughness: 0.5 }), 0, 0.7, 0, 0.08);
  box(g, 6.6, 0.25, 2.42, mat(color), 0, 1.4, 0);
  box(g, 2.2, 1.9, 2.3, mat(color, { metalness: 0.4, roughness: 0.3 }), 6.8, 0.6, 0, 0.15);
  box(g, 0.06, 0.8, 2.0, glassMat(), 8.96, 1.5, 0);
  box(g, 9, 0.25, 1.8, mat(0x333333), 0, 0.45, 0);
  for (const x of [1.0, 2.0, 5.2, 7.9]) { wheel(g, x, 0, 1.1, 0.42); wheel(g, x, 0, -1.1, 0.42); }
  box(g, 0.08, 0.15, 0.4, glowMat(0xfff4c0), 8.98, 0.9, 0.7);
}

function boat(g, color) {
  const hull = mat(color, { roughness: 0.4 });
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.4); shape.lineTo(0.4, -0.3); shape.lineTo(6.0, -0.3); shape.lineTo(7.0, 1.0); shape.lineTo(0, 1.0); shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, { depth: 2.6, bevelEnabled: false });
  geo.translate(0, 0, -1.3);
  const m = new THREE.Mesh(geo, hull); m.castShadow = true; g.add(m);
  box(g, 7.0, 0.08, 2.6, mat(0xd8c8a0), 0, 0.92, 0);
  box(g, 2.8, 1.5, 2.0, mat(0xf4f4f4), 2.0, 1.0, 0, 0.1);
  box(g, 2.82, 0.4, 2.02, glassMat(), 2.0, 1.8, 0);
  box(g, 0.3, 0.8, 0.3, mat(0x222222), 3.2, 2.6, 0);
}

function plane(g) {
  const white = mat(0xf2f4f8, { roughness: 0.3, metalness: 0.3 });
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.8, 9.2, 6, 16), white);
  body.rotation.z = Math.PI / 2; body.position.set(5.5, 0.8, 0); body.castShadow = true; g.add(body);
  const wing = box(g, 2.2, 0.15, 9, white, 4.4, 0.5, 0);
  wing.position.z = -1.8;
  box(g, 1.2, 1.8, 0.15, mat(0x1e5fd0), 0.3, 1.2, 0);
  box(g, 1.2, 0.12, 3.6, white, 0.2, 1.0, -0.3);
  for (let x = 2.5; x < 9; x += 0.7) box(g, 0.3, 0.25, 0.05, glassMat(), x, 1.0, 0.8);
  box(g, 0.2, 0.1, 0.1, glowMat(0xff3030), 0.1, 2.9, 0);
  const eng = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 1.2, 12), mat(0x9aa0aa, { metalness: 0.7 }));
  eng.rotation.z = Math.PI / 2; eng.position.set(5.2, 0.15, -2.2); g.add(eng);
}

function rover(g) {
  const body = mat(0xe8e2d4, { roughness: 0.5 });
  box(g, 4.6, 0.7, 2.2, body, 0.2, 1.3, 0, 0.1);
  box(g, 4.0, 0.12, 2.4, mat(0x2a3a6a, { metalness: 0.6, roughness: 0.2 }), 0.5, 1.95, -0.0); // solar deck
  box(g, 0.15, 1.1, 0.15, mat(0x888888), 3.9, 2.0, 0.6);
  box(g, 0.5, 0.35, 0.4, mat(0xdddddd), 3.7, 3.0, 0.6);
  box(g, 0.12, 0.12, 0.05, glowMat(0x40c0ff), 4.05, 3.1, 0.82);
  for (const x of [0.8, 2.5, 4.2]) { wheel(g, x, 0.45, 1.15, 0.45, 0.4); wheel(g, x, 0.45, -1.15, 0.45, 0.4); }
  box(g, 4.4, 0.12, 0.12, mat(0x777777), 0.4, 0.9, 1.15);
}

function rockGeo(w, h, d, seed = 1) {
  const geo = new THREE.IcosahedronGeometry(1, 2);
  const pos = geo.attributes.position;
  let s = seed * 9301 + 49297;
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const disp = new Map();
  for (let i = 0; i < pos.count; i++) {
    const key = `${pos.getX(i).toFixed(3)},${pos.getY(i).toFixed(3)},${pos.getZ(i).toFixed(3)}`;
    if (!disp.has(key)) disp.set(key, 0.8 + rnd() * 0.35);
    const k = disp.get(key);
    pos.setXYZ(i, pos.getX(i) * k * w / 2, pos.getY(i) * k * h / 2, pos.getZ(i) * k * d / 2);
  }
  geo.computeVertexNormals();
  return geo;
}

function asteroidMesh(g, w, h, color = 0x6a5e54, seed = 1) {
  const m = new THREE.Mesh(rockGeo(w * 1.05, h * 1.1, 3.0, seed), mat(color, { roughness: 0.95, flatShading: true }));
  m.position.set(w / 2, h / 2 - 0.1, 0);
  m.castShadow = true; m.receiveShadow = true;
  g.add(m);
  g.userData.spin = m;
  // flattened walkable cap so the top reads as a surface
  box(g, w * 0.92, 0.12, 2.2, mat(0x8a7e70, { roughness: 0.9 }), w * 0.04, h - 0.12, 0);
}

function ringChunk(g, w, h, seed) {
  const m = new THREE.Mesh(rockGeo(w * 1.05, h * 1.1, 2.2, seed), mat(0xe8e0d0, { roughness: 0.6, flatShading: true, emissive: 0x302820 }));
  m.position.set(w / 2, h / 2, 0); m.castShadow = true;
  g.add(m);
  g.userData.spin = m;
}

const CAR_COLORS = [0x2a6fd6, 0xe0e4ea, 0x1c1c22, 0xc03030, 0x3a9a5a, 0xe0a020];
const CITY_TAXI = { 'London': 0x111111, 'New York': 0xf5c518, 'Tokyo': 0x2a2a6a };

export function makeMoverMesh(def, world, location, seed = 0) {
  const g = new THREE.Group();
  const k = def.kind;
  if (k === 'bus') bus(g, location === 'Beijing' || location === 'Shanghai' ? 0x2a7ae0 : location === 'Berlin' ? 0xf2c200 : 0xd0201c);
  else if (k === 'car') car(g, CAR_COLORS[seed % CAR_COLORS.length], def.w);
  else if (k === 'taxi') car(g, CITY_TAXI[location] || 0xf5c518, def.w, true);
  else if (k === 'truck') truck(g, CAR_COLORS[(seed + 2) % CAR_COLORS.length]);
  else if (k === 'boat') boat(g, [0x1a3a6a, 0xc03030, 0x2a7a5a][seed % 3]);
  else if (k === 'plane') plane(g);
  else if (k === 'rover') rover(g);
  else if (k === 'ring') ringChunk(g, def.w, def.h, seed + 3);
  else if (k === 'asteroid') asteroidMesh(g, def.w, def.h, 0x6a5e54, seed + 7);
  else {
    // generic hover pad / lift / cog / prism / warp platform
    const top = world.platTop, accent = world.accent;
    let bodyCol = world.plat;
    let edge = accent;
    if (k === 'warp') edge = 0xffd86a;
    if (k === 'prism') { bodyCol = 0xc8b0ff; }
    const mBody = k === 'prism'
      ? mat(bodyCol, { physical: true, transmission: 0.6, roughness: 0.05, thickness: 0.5, transparent: true, opacity: 0.85 })
      : mat(bodyCol, { roughness: 0.4, metalness: k === 'cog' ? 0.8 : 0.3 });
    box(g, def.w, def.h, 2.6, mBody, 0, 0, 0, 0.12);
    box(g, def.w * 0.96, 0.06, 2.5, mat(top, { roughness: 0.3 }), def.w * 0.02, def.h - 0.02, 0);
    const strip = box(g, def.w * 0.9, 0.08, 0.06, glowMat(edge), def.w * 0.05, def.h * 0.45, 1.31);
    g.userData.strip = strip;
    if (k === 'shield' || k === 'pad' || k === 'lift' || k === 'warp') {
      // thruster glow underneath
      const glow = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.05, 0.6, 12, 1, true), new THREE.MeshBasicMaterial({ color: edge, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false }));
      glow.position.set(def.w / 2, -0.35, 0);
      g.add(glow);
      g.userData.thruster = glow;
    }
  }
  return g;
}

export function makeShip() {
  const g = new THREE.Group();
  const white = mat(0xf2f4f8, { physical: true, roughness: 0.2, clearcoat: 1, metalness: 0.2 });
  const blue = mat(0x1e7bff, { emissive: 0x0a3a90, emissiveIntensity: 0.6 });
  const hull = new THREE.Mesh(new THREE.CapsuleGeometry(0.9, 3.2, 8, 24), white);
  hull.rotation.z = -Math.PI / 2; hull.castShadow = true; g.add(hull);
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.9, 1.6, 24), white);
  nose.rotation.z = -Math.PI / 2; nose.position.x = 2.6; g.add(nose);
  // canopy on a hinge at its rear edge so it can swing open
  const hinge = new THREE.Group();
  hinge.position.set(-0.35, 0.6, 0);
  g.add(hinge);
  const canopy = new THREE.Mesh(new THREE.SphereGeometry(0.75, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), mat(0x66ccff, { physical: true, transmission: 0.5, roughness: 0.05, transparent: true, opacity: 0.7 }));
  canopy.position.set(1.05, 0, 0); canopy.scale.set(1.4, 0.9, 0.9); hinge.add(canopy);
  g.userData.hinge = hinge;
  for (const s of [-1, 1]) {           // landing legs
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 1.0, 8), mat(0x9aa0aa, { metalness: 0.8 }));
    leg.position.set(s * 1.2 - 0.3, -0.95, 0); leg.rotation.z = s * 0.25; g.add(leg);
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.08, 16), mat(0x9aa0aa, { metalness: 0.8 }));
    foot.position.set(s * 1.32 - 0.3, -1.42, 0); g.add(foot);
  }
  for (const s of [-1, 1]) {
    const wing = new THREE.Mesh(new RoundedBoxGeometry(1.8, 0.14, 2.2, 2, 0.06), white);
    wing.position.set(-0.8, -0.2, s * 1.4); wing.rotation.y = s * 0.3; g.add(wing);
    const tip = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.1, 0.12), blue);
    tip.position.set(-1.0, -0.15, s * 2.45); g.add(tip);
  }
  const fin = new THREE.Mesh(new RoundedBoxGeometry(1.2, 1.1, 0.12, 2, 0.05), white);
  fin.position.set(-1.9, 0.7, 0); g.add(fin);
  const stripe = new THREE.Mesh(new THREE.TorusGeometry(0.92, 0.06, 8, 32), blue);
  stripe.rotation.y = Math.PI / 2; stripe.position.x = 1.2; g.add(stripe);
  const flameMat = new THREE.MeshBasicMaterial({ color: 0x7fd0ff, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false });
  const flame = new THREE.Mesh(new THREE.ConeGeometry(0.6, 2.4, 16, 1, true), flameMat);
  flame.rotation.z = Math.PI / 2; flame.position.x = -3.4; g.add(flame);
  g.userData.flame = flame;
  return g;
}

export { rockGeo };

// ---------------------------------------------------------------------------
// The mothership: ~30 units long, three decks of windows, a bridge tower,
// five main engines, four VTOL landing thrusters, landing legs and a hangar
// ramp on the camera side. Nose points +x. Origin = hull centre; landed, the
// feet touch y = -LEG_DROP.
export const SHIP_LEG_DROP = 4.6;
export function makeMothership() {
  const outer = new THREE.Group();
  const inner = new THREE.Group();          // inner.rotation lets outer.lookAt() aim the nose
  outer.add(inner);
  const hullMat = mat(0xd8dde6, { physical: true, roughness: 0.32, metalness: 0.35, clearcoat: 0.7 });
  const darkMat = mat(0x3a4150, { metalness: 0.7, roughness: 0.35 });
  const accent = mat(0x1e7bff, { emissive: 0x1e5ad0, emissiveIntensity: 0.9 });
  const windowMat = mat(0xffe2a0, { emissive: 0xffc860, emissiveIntensity: 1.6 });
  const glassMat = mat(0x0a1a30, { physical: true, roughness: 0.05, metalness: 0.4, clearcoat: 1 });
  const add = (geo, m, x = 0, y = 0, z = 0, parent = inner) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; parent.add(o); return o; };

  // hull: a smooth lathe turned along +x
  const prof = [[0.01, 0], [2.6, 0.2], [3.4, 3], [3.8, 8], [3.9, 14], [3.6, 20], [2.8, 25], [1.5, 28.5], [0.3, 30]];
  const curve = new THREE.SplineCurve(prof.map(([r, y]) => new THREE.Vector2(r, y)));
  const hullGeo = new THREE.LatheGeometry(curve.getPoints(40), 48);
  hullGeo.rotateZ(-Math.PI / 2);
  hullGeo.translate(-15, 0, 0);
  const hull = add(hullGeo, hullMat);
  hull.scale.set(1, 0.72, 0.86);
  // accent stripe + belly plate
  const stripe = add(new THREE.TorusGeometry(3.25, 0.12, 8, 48), accent, 4, 0, 0); stripe.rotation.y = Math.PI / 2; stripe.scale.set(0.72, 0.86, 1); stripe.scale.set(1, 0.72 / 1, 0.86);
  stripe.scale.set(0.86, 0.72, 1);
  add(new RoundedBoxGeometry(20, 0.6, 4.6, 2, 0.25), darkMat, -2, -2.55, 0);
  // upper decks + bridge tower
  add(new RoundedBoxGeometry(14, 1.8, 4.6, 3, 0.6), hullMat, -4, 2.8, 0);
  add(new RoundedBoxGeometry(9, 1.4, 3.4, 3, 0.5), hullMat, -3, 4.2, 0);
  const bridge = add(new RoundedBoxGeometry(5, 1.6, 3.0, 3, 0.6), hullMat, 5.2, 3.4, 0);
  add(new RoundedBoxGeometry(4.6, 0.6, 3.05, 2, 0.25), glassMat, 5.6, 3.6, 0);
  add(new THREE.BoxGeometry(4.2, 0.08, 0.05), windowMat, 5.6, 3.62, 1.55);
  // rows of windows on three decks, both sides
  for (const side of [1, -1]) {
    for (const [y, x0, x1, zr] of [[-1.1, -11, 9, 3.15], [0.4, -12, 10, 3.3], [1.9, -10, 6, 2.95], [2.9, -10.5, 2.5, 2.32]]) {
      for (let x = x0; x <= x1; x += 0.9) add(new THREE.BoxGeometry(0.5, 0.32, 0.05), windowMat, x, y, side * zr);
    }
  }
  // dorsal fin + antenna dish
  const finShape = new THREE.Shape(); finShape.moveTo(0, 0); finShape.lineTo(5, 0); finShape.lineTo(1.5, 4); finShape.lineTo(0, 4); finShape.closePath();
  const fin = add(new THREE.ExtrudeGeometry(finShape, { depth: 0.35, bevelEnabled: true, bevelSize: 0.08, bevelThickness: 0.08 }), hullMat, -14, 4.6, -0.18);
  fin.scale.x = -1; fin.position.x = -9;
  const dish = add(new THREE.SphereGeometry(0.9, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2.4), darkMat, 0.5, 5.2, 0); dish.rotation.z = 0.5;
  // swept wings with nav lights
  const wingShape = new THREE.Shape(); wingShape.moveTo(0, 0); wingShape.lineTo(9, 0); wingShape.lineTo(3, 7.5); wingShape.lineTo(-1, 7.5); wingShape.closePath();
  const navLights = [];
  for (const side of [1, -1]) {
    const wing = add(new THREE.ExtrudeGeometry(wingShape, { depth: 0.45, bevelEnabled: true, bevelSize: 0.12, bevelThickness: 0.12 }), hullMat, -2, -0.9, side * 2.6);
    wing.rotation.x = side * Math.PI / 2; wing.scale.x = -1;
    const nl = add(new THREE.SphereGeometry(0.22, 12, 10), new THREE.MeshBasicMaterial({ color: side > 0 ? 0x30ff60 : 0xff3030 }), -4.5, -0.7, side * 10.2);
    navLights.push(nl);
    add(new THREE.BoxGeometry(6, 0.12, 0.15), accent, -5.5, -0.7, side * 9.9);
  }
  // main engines
  const flameMat = new THREE.MeshBasicMaterial({ color: 0x8ad8ff, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false });
  const mainFlames = [];
  for (const [y, z, r] of [[0, 0, 1.5], [1.3, 2.4, 1.0], [1.3, -2.4, 1.0], [-1.1, 2.0, 0.9], [-1.1, -2.0, 0.9]]) {
    const nac = add(new THREE.CylinderGeometry(r * 1.05, r * 1.2, 3.4, 24), darkMat, -15.2, y, z); nac.rotation.z = Math.PI / 2;
    const ring = add(new THREE.TorusGeometry(r * 0.95, 0.12, 8, 28), accent, -16.95, y, z); ring.rotation.y = Math.PI / 2;
    add(new THREE.CircleGeometry(r * 0.9, 24), new THREE.MeshBasicMaterial({ color: 0xbfeaff }), -16.98, y, z).rotation.y = -Math.PI / 2;
    const fl = new THREE.Mesh(new THREE.ConeGeometry(r * 0.85, r * 7, 20, 1, true), flameMat);
    fl.geometry.translate(0, -r * 3.5, 0);
    fl.rotation.z = -Math.PI / 2; fl.position.set(-17, y, z);
    inner.add(fl); mainFlames.push(fl);
  }
  // VTOL lift thrusters underneath
  const liftFlames = [];
  for (const [x, z] of [[-9, 2.2], [-9, -2.2], [7, 2.0], [7, -2.0]]) {
    add(new THREE.CylinderGeometry(0.75, 0.9, 0.7, 20), darkMat, x, -2.75, z);
    const fl = new THREE.Mesh(new THREE.ConeGeometry(0.65, 4, 16, 1, true), flameMat);
    fl.geometry.translate(0, -2, 0);
    fl.rotation.z = Math.PI; fl.position.set(x, -3.05, z);
    fl.rotation.set(Math.PI, 0, 0);
    inner.add(fl); liftFlames.push(fl);
  }
  // landing legs
  for (const [x, z] of [[-10, 2.6], [-10, -2.6], [8, 2.4], [8, -2.4]]) {
    const leg = add(new THREE.CylinderGeometry(0.22, 0.28, 2.4, 10), darkMat, x, -3.6, z);
    leg.rotation.x = Math.sign(z) * 0.25;
    add(new THREE.CylinderGeometry(0.7, 0.8, 0.2, 16), darkMat, x, -SHIP_LEG_DROP + 0.1, z + Math.sign(z) * 0.3);
  }
  // hangar bay + ramp on the +z (camera) side
  const bay = add(new RoundedBoxGeometry(4.2, 2.4, 0.4, 2, 0.15), mat(0xffd8a0, { emissive: 0xffb860, emissiveIntensity: 1.4 }), 3, -1.3, 2.55);
  const ramp = new THREE.Group();
  ramp.position.set(3, -2.5, 2.95);
  inner.add(ramp);
  const panel = add(new RoundedBoxGeometry(4.2, 5.2, 0.25, 2, 0.1), hullMat, 0, 2.6, 0, ramp);
  for (let k = 0; k < 6; k++) add(new THREE.BoxGeometry(3.8, 0.06, 0.06), accent, 0, 0.6 + k * 0.8, 0.14, ramp);
  void panel;
  outer.userData = { inner, mainFlames, liftFlames, navLights, ramp, bay, length: 32 };
  return outer;
}
