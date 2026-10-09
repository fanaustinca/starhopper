// 3D builders for shop cosmetics: hats (parented to the robot's head) and
// companions (little buddies that follow the robot around).
import * as THREE from 'three';
import { itemById } from '../core/shop.js';

const std = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: o.rough ?? 0.45, metalness: o.metal ?? 0.1, emissive: o.emissive ?? 0x000000, emissiveIntensity: o.ei ?? 1, transparent: !!o.opacity, opacity: o.opacity ?? 1, side: o.side ?? THREE.FrontSide });
const glowM = (c, i = 2) => std(c, { emissive: c, ei: i });
function put(parent, geo, material, x = 0, y = 0, z = 0) { const m = new THREE.Mesh(geo, material); m.position.set(x, y, z); m.castShadow = true; parent.add(m); return m; }

// the top of the helmet sits at y ≈ 0.69 in head space
const TOP = 0.66;

export function makeHat(id) {
  const it = itemById('hat', id);
  const g = new THREE.Group();
  g.name = 'hat';
  g.userData.spin = null;
  if (it.id === 'none') return g;
  const C = std(it.color), A = std(it.accent);
  switch (it.id) {
    case 'party': {
      const cone = put(g, new THREE.ConeGeometry(0.16, 0.42, 24), C, 0.04, TOP + 0.19, 0); cone.rotation.z = -0.15;
      put(g, new THREE.SphereGeometry(0.05, 12, 8), A, 0.07, TOP + 0.42, 0);
      for (let i = 0; i < 3; i++) { const r = put(g, new THREE.TorusGeometry(0.13 - i * 0.035, 0.012, 6, 24), A, 0.04 + i * 0.012, TOP + 0.06 + i * 0.1, 0); r.rotation.x = Math.PI / 2; }
      break;
    }
    case 'cap': {
      put(g, new THREE.SphereGeometry(0.3, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2), C, 0, TOP - 0.1, 0).scale.set(1.15, 0.7, 1.05);
      const brim = put(g, new THREE.CylinderGeometry(0.22, 0.22, 0.02, 28, 1, false, -Math.PI / 2, Math.PI), C, 0, TOP - 0.09, 0.2); brim.scale.z = 1.3;
      put(g, new THREE.SphereGeometry(0.035, 10, 8), A, 0, TOP + 0.12, 0);
      break;
    }
    case 'chef': {
      put(g, new THREE.CylinderGeometry(0.24, 0.24, 0.16, 24), C, 0, TOP + 0.02, 0);
      for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI * 2; put(g, new THREE.SphereGeometry(0.14, 14, 10), C, Math.cos(a) * 0.13, TOP + 0.17, Math.sin(a) * 0.13); }
      put(g, new THREE.SphereGeometry(0.16, 14, 10), C, 0, TOP + 0.24, 0);
      break;
    }
    case 'propeller': {
      put(g, new THREE.SphereGeometry(0.28, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), C, 0, TOP - 0.08, 0).scale.set(1.1, 0.6, 1.0);
      put(g, new THREE.CylinderGeometry(0.015, 0.015, 0.12, 8), std(0x888888), 0, TOP + 0.13, 0);
      const prop = new THREE.Group(); prop.position.set(0, TOP + 0.19, 0); g.add(prop);
      for (const s of [-1, 1]) { const b = put(prop, new THREE.BoxGeometry(0.34, 0.012, 0.06), s > 0 ? A : std(0x3a8aff), s * 0.17, 0, 0); b.rotation.x = 0.25 * s; }
      g.userData.spin = prop;
      break;
    }
    case 'headphones': {
      const band = put(g, new THREE.TorusGeometry(0.43, 0.03, 8, 32, Math.PI), C, 0, 0.33, 0); band.rotation.y = Math.PI / 2; band.scale.set(1, 0.92, 1);
      for (const s of [-1, 1]) { const cup = put(g, new THREE.CylinderGeometry(0.13, 0.13, 0.09, 20), C, s * 0.47, 0.33, 0); cup.rotation.z = Math.PI / 2; const ring = put(g, new THREE.TorusGeometry(0.1, 0.018, 6, 20), glowM(it.accent, 1.5), s * 0.52, 0.33, 0); ring.rotation.y = Math.PI / 2; }
      break;
    }
    case 'tophat': {
      put(g, new THREE.CylinderGeometry(0.3, 0.3, 0.025, 28), C, 0, TOP - 0.02, 0);
      put(g, new THREE.CylinderGeometry(0.19, 0.2, 0.34, 28), C, 0, TOP + 0.16, 0);
      put(g, new THREE.CylinderGeometry(0.202, 0.202, 0.06, 28), A, 0, TOP + 0.03, 0);
      g.rotation.z = -0.08;
      break;
    }
    case 'viking': {
      put(g, new THREE.SphereGeometry(0.33, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), std(it.color, { metal: 0.8, rough: 0.3 }), 0, TOP - 0.13, 0).scale.set(1.12, 0.8, 1.05);
      for (const s of [-1, 1]) {
        const horn = put(g, new THREE.ConeGeometry(0.06, 0.32, 14), A, s * 0.32, TOP + 0.06, 0);
        horn.rotation.z = -s * 1.0;
      }
      put(g, new THREE.TorusGeometry(0.34, 0.025, 6, 32), std(0xc8a050, { metal: 0.8 }), 0, TOP - 0.1, 0).rotation.x = Math.PI / 2;
      break;
    }
    case 'wizard': {
      const cone = put(g, new THREE.ConeGeometry(0.24, 0.62, 28), C, 0.06, TOP + 0.26, -0.02); cone.rotation.z = -0.25;
      put(g, new THREE.CylinderGeometry(0.4, 0.4, 0.025, 32), C, 0, TOP - 0.03, 0);
      for (let i = 0; i < 6; i++) put(g, new THREE.OctahedronGeometry(0.03, 0), glowM(it.accent, 1.6), 0.02 + Math.sin(i * 1.7) * 0.13, TOP + 0.08 + i * 0.07, 0.15 - i * 0.018);
      break;
    }
    case 'halo': {
      const h = put(g, new THREE.TorusGeometry(0.24, 0.035, 10, 40), glowM(it.color, 2.2), 0, TOP + 0.2, 0); h.rotation.x = Math.PI / 2;
      g.userData.bob = h;
      break;
    }
    case 'astro': {
      put(g, new THREE.SphereGeometry(0.62, 32, 20), std(it.color, { opacity: 0.22, rough: 0.02, metal: 0.2 }), 0, 0.34, 0);
      const ring = put(g, new THREE.TorusGeometry(0.42, 0.04, 8, 32), A, 0, -0.08, 0); ring.rotation.x = Math.PI / 2;
      put(g, new THREE.CylinderGeometry(0.012, 0.012, 0.24, 6), std(0xcccccc), 0.25, 0.98, 0);
      put(g, new THREE.SphereGeometry(0.035, 10, 8), glowM(0xff3a3a, 2), 0.25, 1.11, 0);
      break;
    }
  }
  return g;
}

// ---------------------------------------------------------------- companions
export function makePet(id) {
  const it = itemById('pet', id);
  const g = new THREE.Group();
  g.name = 'pet';
  g.userData.parts = {};
  if (it.id === 'none') { g.visible = false; return g; }
  const C = std(it.color, { metal: 0.4, rough: 0.3 }), G = glowM(it.accent, 2);
  const P = g.userData.parts;
  switch (it.id) {
    case 'orb': {
      put(g, new THREE.SphereGeometry(0.2, 24, 16), C);
      put(g, new THREE.SphereGeometry(0.07, 12, 8), G, 0, 0, 0.17);
      P.ring = put(g, new THREE.TorusGeometry(0.28, 0.02, 6, 32), G); P.ring.rotation.x = Math.PI / 2;
      break;
    }
    case 'satellite': {
      put(g, new THREE.BoxGeometry(0.2, 0.2, 0.24), C);
      for (const s of [-1, 1]) put(g, new THREE.BoxGeometry(0.34, 0.01, 0.16), std(0x2a4aa0, { metal: 0.6, rough: 0.2, emissive: 0x0a1a4a }), s * 0.29, 0, 0);
      P.dish = put(g, new THREE.SphereGeometry(0.1, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2.5), C, 0, 0.14, 0);
      put(g, new THREE.SphereGeometry(0.025, 8, 6), G, 0, 0.2, 0);
      break;
    }
    case 'comet': {
      put(g, new THREE.SphereGeometry(0.13, 16, 12), glowM(it.accent, 2.5));
      const tail = put(g, new THREE.ConeGeometry(0.12, 0.6, 16, 1, true), new THREE.MeshBasicMaterial({ color: it.color, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }), -0.3, 0, 0);
      tail.rotation.z = Math.PI / 2;
      P.tail = tail;
      break;
    }
    case 'ufo': {
      const disc = put(g, new THREE.SphereGeometry(0.26, 24, 12), C); disc.scale.y = 0.28;
      put(g, new THREE.SphereGeometry(0.12, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2), std(0x9af0ff, { opacity: 0.6, rough: 0.05 }), 0, 0.04, 0);
      P.lights = [];
      for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; P.lights.push(put(g, new THREE.SphereGeometry(0.025, 8, 6), G.clone(), Math.cos(a) * 0.22, -0.02, Math.sin(a) * 0.22)); }
      const beam = put(g, new THREE.ConeGeometry(0.16, 0.5, 16, 1, true), new THREE.MeshBasicMaterial({ color: it.accent, transparent: true, opacity: 0.18, blending: THREE.AdditiveBlending, depthWrite: false }), 0, -0.3, 0);
      P.beam = beam;
      break;
    }
    case 'cat': {
      const body = put(g, new THREE.SphereGeometry(0.19, 22, 16), std(it.color, { rough: 0.35 })); body.scale.set(1.1, 0.95, 1);
      put(g, new THREE.SphereGeometry(0.13, 18, 12), std(0x05070c, { rough: 0.05 }), 0, 0.02, 0.1).scale.set(1.1, 0.6, 0.6);
      for (const s of [-1, 1]) { put(g, new THREE.CapsuleGeometry(0.02, 0.025, 4, 8), glowM(0x5fd8ff, 2), s * 0.055, 0.03, 0.17); const ear = put(g, new THREE.ConeGeometry(0.06, 0.12, 12), std(it.color), s * 0.1, 0.19, 0); ear.rotation.z = -s * 0.3; }
      P.tail = put(g, new THREE.CapsuleGeometry(0.025, 0.2, 4, 8), std(it.accent), 0, 0, -0.2); P.tail.rotation.x = -0.9;
      break;
    }
    case 'jelly': {
      const bell = put(g, new THREE.SphereGeometry(0.2, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), std(it.color, { emissive: it.color, ei: 0.7, opacity: 0.6, side: THREE.DoubleSide })); P.bell = bell;
      P.tent = [];
      for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI * 2; P.tent.push(put(g, new THREE.CapsuleGeometry(0.012, 0.22, 4, 6), glowM(i % 2 ? it.accent : it.color, 1.4), Math.cos(a) * 0.1, -0.14, Math.sin(a) * 0.1)); }
      break;
    }
  }
  return g;
}

// per-frame idle animation for a companion (follow motion is done by the renderer)
export function animatePet(pet, t, dt) {
  const P = pet.userData.parts;
  if (!P) return;
  if (P.ring) P.ring.rotation.z = t * 3;
  if (P.dish) P.dish.rotation.y = t * 2;
  if (P.tail && P.tail.isMesh && P.tail.geometry.type === 'ConeGeometry') P.tail.scale.x = 0.8 + Math.sin(t * 12) * 0.2;
  if (P.tail && P.tail.geometry.type === 'CapsuleGeometry') P.tail.rotation.z = Math.sin(t * 4) * 0.5;
  if (P.lights) P.lights.forEach((l, i) => { l.material.emissiveIntensity = 1 + Math.max(0, Math.sin(t * 6 - i)) * 2; });
  if (P.beam) P.beam.material.opacity = 0.12 + Math.abs(Math.sin(t * 2)) * 0.12;
  if (P.bell) { const k = Math.sin(t * 3); P.bell.scale.set(1 + k * 0.1, 1 - k * 0.12, 1 + k * 0.1); P.tent.forEach((tt, i) => { tt.rotation.x = Math.sin(t * 3 + i) * 0.3; }); }
}
