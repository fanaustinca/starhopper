// Distant procedural landscapes (heightfield meshes with vertex colours)
// and soft billboard clouds.
import * as THREE from 'three';
import { makeRng } from '../core/rng.js';

// --- small 2D simplex noise (Gustavson) ---
function makeNoise(seed) {
  const rng = makeRng(seed);
  const p = new Uint8Array(512);
  const perm = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) { const j = Math.floor(rng.next() * (i + 1)); [perm[i], perm[j]] = [perm[j], perm[i]]; }
  for (let i = 0; i < 512; i++) p[i] = perm[i & 255];
  const g = [[1, 1], [-1, 1], [1, -1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1]];
  const F2 = 0.5 * (Math.sqrt(3) - 1), G2 = (3 - Math.sqrt(3)) / 6;
  return (x, y) => {
    const s = (x + y) * F2;
    const i = Math.floor(x + s), j = Math.floor(y + s);
    const t = (i + j) * G2;
    const x0 = x - (i - t), y0 = y - (j - t);
    const i1 = x0 > y0 ? 1 : 0, j1 = x0 > y0 ? 0 : 1;
    const x1 = x0 - i1 + G2, y1 = y0 - j1 + G2, x2 = x0 - 1 + 2 * G2, y2 = y0 - 1 + 2 * G2;
    const ii = i & 255, jj = j & 255;
    let n = 0;
    const c = (gx, gy, xx, yy) => { let tt = 0.5 - xx * xx - yy * yy; if (tt < 0) return 0; tt *= tt; return tt * tt * (g[gx][0] * xx + g[gx][1] * yy); };
    n += c(p[ii + p[jj]] & 7, 0, x0, y0);
    n += c(p[ii + i1 + p[jj + j1]] & 7, 0, x1, y1);
    n += c(p[ii + 1 + p[jj + 1]] & 7, 0, x2, y2);
    return 70 * n;
  };
}

const STYLES = {
  // colours: low, high, accent (peaks/snow)
  craters: { amp: 26, freq: 0.012, ridged: 0.3, cols: [0x4a4744, 0x8e8880, 0xb8b2a8], craters: 26 },
  volcanic: { amp: 34, freq: 0.01, ridged: 0.7, cols: [0x3a1a10, 0x8a4a2a, 0xd08a50], cones: 5 },
  mesa: { amp: 40, freq: 0.009, ridged: 0.2, cols: [0x6a2a14, 0xb8582c, 0xe0a070], terrace: 7 },
  dunes: { amp: 12, freq: 0.02, ridged: 0, cols: [0x8a3a1a, 0xc8703a, 0xe8a060], dunes: true },
  ice: { amp: 38, freq: 0.011, ridged: 0.9, cols: [0x2a6078, 0x7ab8cc, 0xd8f4fc] },
  hills: { amp: 22, freq: 0.008, ridged: 0.1, cols: [0x2a5a2a, 0x5a8a3a, 0x9ab070] },
  jungle: { amp: 28, freq: 0.012, ridged: 0.4, cols: [0x061a14, 0x0e3a2a, 0x1a6a4a] },
  crystal: { amp: 30, freq: 0.014, ridged: 1.0, cols: [0x3a2a7a, 0x8a6ae0, 0xffc8ff] },
  brass: { amp: 30, freq: 0.01, ridged: 0.5, cols: [0x2a1a0a, 0x6a4a20, 0xb08840], terrace: 10 },
};

export function makeTerrain(styleName, x0, x1, baseY, seed, opts = {}) {
  const st = STYLES[styleName];
  const noise = makeNoise(seed);
  const rng = makeRng(seed + 99);
  const zNear = opts.zNear ?? -30, zFar = opts.zFar ?? -520;
  const w = x1 - x0, d = zNear - zFar;
  const segX = Math.min(260, Math.ceil(w / 3)), segZ = 80;
  const geo = new THREE.PlaneGeometry(w, d, segX, segZ);
  geo.rotateX(-Math.PI / 2);
  geo.translate((x0 + x1) / 2, 0, (zNear + zFar) / 2);
  const pos = geo.attributes.position;
  const craters = [];
  for (let i = 0; i < (st.craters || 0); i++) craters.push({ x: x0 + rng.next() * w, z: zFar + rng.next() * d * 0.85, r: 8 + rng.next() * 30 });
  const cones = [];
  for (let i = 0; i < (st.cones || 0); i++) cones.push({ x: x0 + rng.next() * w, z: zFar + rng.next() * d * 0.6, r: 40 + rng.next() * 50, h: 40 + rng.next() * 50 });
  const heights = new Float32Array(pos.count);
  let hMax = 1;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i);
    const far = Math.min(1, Math.max(0, (zNear - z) / 110));       // flatten near the playfield
    let f = st.freq, a = 1, h = 0;
    for (let o = 0; o < 5; o++) {
      let n = noise(x * f, z * f);
      if (st.ridged) n = (1 - st.ridged) * n + st.ridged * (1 - Math.abs(n) * 2);
      h += n * a; f *= 2.1; a *= 0.48;
    }
    h = (h * 0.5 + 0.5) * st.amp;
    if (st.dunes) h += Math.sin(x * 0.05 + noise(x * 0.004, z * 0.004) * 4) * 5 + 5;
    if (st.terrace) h = Math.floor(h / st.terrace) * st.terrace + Math.pow((h % st.terrace) / st.terrace, 6) * st.terrace;
    for (const c of craters) {
      const r = Math.hypot(x - c.x, z - c.z) / c.r;
      if (r < 1.4) h += r < 1 ? -(1 - r * r) * c.r * 0.35 : Math.sin((r - 1) / 0.4 * Math.PI) * c.r * 0.12;
    }
    for (const c of cones) {
      const r = Math.hypot(x - c.x, z - c.z) / c.r;
      if (r < 1) h += (1 - r) * c.h - (r < 0.12 ? (0.12 - r) * c.h * 2 : 0);
    }
    h *= far;
    heights[i] = h;
    hMax = Math.max(hMax, h);
    pos.setY(i, baseY + h - 0.5);
  }
  geo.computeVertexNormals();
  const nor = geo.attributes.normal;
  const cols = new Float32Array(pos.count * 3);
  const cLo = new THREE.Color(st.cols[0]), cHi = new THREE.Color(st.cols[1]), cAc = new THREE.Color(st.cols[2]);
  const tmp = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const k = heights[i] / hMax;
    const slope = 1 - nor.getY(i);
    tmp.copy(cLo).lerp(cHi, Math.min(1, k * 1.6));
    if (k > 0.6) tmp.lerp(cAc, (k - 0.6) / 0.4);
    tmp.multiplyScalar(1 - slope * 0.55 + (noise(pos.getX(i) * 0.2, pos.getZ(i) * 0.2) * 0.06));
    cols[i * 3] = tmp.r; cols[i * 3 + 1] = tmp.g; cols[i * 3 + 2] = tmp.b;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(cols, 3));
  const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: opts.roughness ?? 0.95, metalness: opts.metalness ?? 0, emissive: opts.emissive ?? 0x000000 }));
  m.receiveShadow = false;
  return m;
}

// ---------------------------------------------------------------- clouds
let cloudTex = null;
export function cloudTexture() {
  if (cloudTex) return cloudTex;
  const c = document.createElement('canvas');
  c.width = 256; c.height = 128;
  const g = c.getContext('2d');
  const rng = makeRng(7);
  for (let i = 0; i < 70; i++) {
    const x = 40 + rng.next() * 176, y = 50 + rng.next() * 50 - Math.abs(x - 128) * 0.15;
    const r = 14 + rng.next() * 30;
    const grd = g.createRadialGradient(x, y, 0, x, y, r);
    grd.addColorStop(0, 'rgba(255,255,255,0.35)');
    grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd;
    g.fillRect(x - r, y - r, r * 2, r * 2);
  }
  // shade the underside so the puff reads as volume
  const shade = g.createLinearGradient(0, 30, 0, 128);
  shade.addColorStop(0, 'rgba(0,0,0,0)'); shade.addColorStop(1, 'rgba(60,70,90,0.55)');
  g.globalCompositeOperation = 'source-atop';
  g.fillStyle = shade; g.fillRect(0, 0, 256, 128);
  cloudTex = new THREE.CanvasTexture(c);
  cloudTex.colorSpace = THREE.SRGBColorSpace;
  return cloudTex;
}

export function cloudSprite(color, scale, opacity = 0.85) {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: cloudTexture(), color, transparent: true, opacity, depthWrite: false, fog: true }));
  s.material.userData.shared = true;
  s.scale.set(scale * 2, scale, 1);
  return s;
}
