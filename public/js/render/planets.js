// Procedural 3D planets: real geometry, not a picture on a ball.
// Rocky worlds are cube-spheres displaced by noise, craters (with rims, floors
// and ejecta rays), canyons, volcanoes and terraces, coloured per vertex by
// height / slope / latitude. Gas giants use a lit shader with flowing bands,
// turbulence and storms. Extras: cloud shells, atmosphere glow, ring systems,
// crystal spires, gear rings, clock dials, neon grids, orbiting islands.
// Used by the star map, the ship cutscenes and the sky in levels.
import * as THREE from 'three';
import { makeRng } from '../core/rng.js';
import { NOISE } from './shaders.js';

// ---------------------------------------------------------------- JS 3D simplex noise (Gustavson)
const G3 = [1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0, 1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, -1, 0, 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1];
export function makeNoise3(seed = 1) {
  const rng = makeRng(seed * 7919 + 17);
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) { const j = Math.floor(rng.next() * (i + 1)); const t = p[i]; p[i] = p[j]; p[j] = t; }
  const perm = new Uint8Array(512), pm12 = new Uint8Array(512);
  for (let i = 0; i < 512; i++) { perm[i] = p[i & 255]; pm12[i] = perm[i] % 12; }
  const F3 = 1 / 3, G = 1 / 6;
  return function noise(x, y, z) {
    const s = (x + y + z) * F3;
    const i = Math.floor(x + s), j = Math.floor(y + s), k = Math.floor(z + s);
    const t = (i + j + k) * G;
    const x0 = x - (i - t), y0 = y - (j - t), z0 = z - (k - t);
    let i1, j1, k1, i2, j2, k2;
    if (x0 >= y0) {
      if (y0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0; } else if (x0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1; } else { i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1; }
    } else if (y0 < z0) { i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1; } else if (x0 < z0) { i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1; } else { i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
    const x1 = x0 - i1 + G, y1 = y0 - j1 + G, z1 = z0 - k1 + G;
    const x2 = x0 - i2 + 2 * G, y2 = y0 - j2 + 2 * G, z2 = z0 - k2 + 2 * G;
    const x3 = x0 - 1 + 3 * G, y3 = y0 - 1 + 3 * G, z3 = z0 - 1 + 3 * G;
    const ii = i & 255, jj = j & 255, kk = k & 255;
    let n = 0, tt, gi;
    tt = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
    if (tt > 0) { gi = pm12[ii + perm[jj + perm[kk]]] * 3; tt *= tt; n += tt * tt * (G3[gi] * x0 + G3[gi + 1] * y0 + G3[gi + 2] * z0); }
    tt = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
    if (tt > 0) { gi = pm12[ii + i1 + perm[jj + j1 + perm[kk + k1]]] * 3; tt *= tt; n += tt * tt * (G3[gi] * x1 + G3[gi + 1] * y1 + G3[gi + 2] * z1); }
    tt = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
    if (tt > 0) { gi = pm12[ii + i2 + perm[jj + j2 + perm[kk + k2]]] * 3; tt *= tt; n += tt * tt * (G3[gi] * x2 + G3[gi + 1] * y2 + G3[gi + 2] * z2); }
    tt = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
    if (tt > 0) { gi = pm12[ii + 1 + perm[jj + 1 + perm[kk + 1]]] * 3; tt *= tt; n += tt * tt * (G3[gi] * x3 + G3[gi + 1] * y3 + G3[gi + 2] * z3); }
    return 32 * n;
  };
}
function fbmJS(noise, x, y, z, oct = 5, lac = 2.03, gain = 0.5) {
  let a = 0.5, s = 0, f = 1;
  for (let i = 0; i < oct; i++) { s += a * noise(x * f + i * 17.3, y * f + i * 9.1, z * f + i * 3.7); f *= lac; a *= gain; }
  return s;
}
function ridgedJS(noise, x, y, z, oct = 5) {
  let a = 0.5, s = 0, f = 1;
  for (let i = 0; i < oct; i++) { const n = 1 - Math.abs(noise(x * f + i * 11.1, y * f, z * f)); s += a * n * n; f *= 2.05; a *= 0.5; }
  return s;
}
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const C = (hex) => new THREE.Color(hex);
const lerpC = (out, a, b, t) => { out.r = a.r + (b.r - a.r) * t; out.g = a.g + (b.g - a.g) * t; out.b = a.b + (b.b - a.b) * t; return out; };

// random unit vectors for crater centres etc.
function randDir(rng) {
  const u = rng.next() * 2 - 1, a = rng.next() * Math.PI * 2, r = Math.sqrt(1 - u * u);
  return [Math.cos(a) * r, u, Math.sin(a) * r];
}
function makeCraters(rng, n, rMin, rMax, depth) {
  const list = [];
  for (let i = 0; i < n; i++) {
    // power-law sizes: lots of small craters, a few huge basins
    const r = rMin + (rMax - rMin) * Math.pow(rng.next(), 3);
    const d = randDir(rng);
    list.push({ x: d[0], y: d[1], z: d[2], r, cosR: Math.cos(r * 1.6), depth: depth * (0.6 + rng.next() * 0.6) * Math.min(1, r / (rMax * 0.6) + 0.35), rays: rng.next() < 0.18 });
  }
  return list;
}
// crater profile: bowl, raised rim, flattened floor; returns height delta and a crater mask
function craterField(cr, x, y, z, out) {
  let h = 0, mask = 0, ray = 0;
  for (let i = 0; i < cr.length; i++) {
    const c = cr[i];
    const dt = x * c.x + y * c.y + z * c.z;
    if (dt < c.cosR) continue;
    const ang = Math.acos(Math.min(1, dt)) / c.r;     // 0 centre, 1 rim
    if (ang < 1) {
      const bowl = Math.max(ang * ang, 0.18) - 1;      // flat floor in the middle
      h += bowl * c.depth;
      mask = Math.max(mask, 1 - ang * 0.6);
    } else if (ang < 1.6) {
      const k = (ang - 1) / 0.6;
      h += c.depth * 0.35 * (1 - k) * (1 - k);         // rim
      if (c.rays) ray = Math.max(ray, (1 - k) * 0.6);
    }
  }
  out.crater = mask; out.ray = ray;
  return h;
}

// ---------------------------------------------------------------- per-world recipes
// height(d) returns displacement as a fraction of radius; color(d, f) fills f.col / f.rough / f.emit
const RECIPES = {
  mercury(seed) {
    const n = makeNoise3(seed), rng = makeRng(seed);
    const cr = makeCraters(rng, 260, 0.025, 0.42, 0.05);
    const lo = C(0x3e3b38), mid = C(0x85807a), hi = C(0xc4bfb8), rayC = C(0xe8e4dc);
    return {
      height(x, y, z, f) { return fbmJS(n, x * 2.2, y * 2.2, z * 2.2, 5) * 0.025 + craterField(cr, x, y, z, f); },
      color(x, y, z, h, f) {
        const t = smooth(-0.05, 0.03, h + fbmJS(n, x * 6, y * 6, z * 6, 3) * 0.02);
        lerpC(f.col, lo, mid, t);
        if (h > 0.01) lerpC(f.col, f.col, hi, smooth(0.01, 0.03, h));
        lerpC(f.col, f.col, rayC, f.ray * 0.8);
        f.rough = 0.95;
      },
    };
  },
  earth(seed) {
    const n = makeNoise3(seed);
    const deep = C(0x0a2a6a), shallow = C(0x1a6ab8), sand = C(0xd8c890), grass = C(0x3f8f3a), forest = C(0x24602c), desert = C(0xc8a060), rock = C(0x7a6a58), snow = C(0xf4f8ff);
    return {
      height(x, y, z, f) {
        const c = fbmJS(n, x * 1.4, y * 1.4, z * 1.4, 6) + 0.06;
        f.sea = c;
        if (c <= 0) return 0;                       // flat ocean surface
        return c * 0.05 + ridgedJS(n, x * 4, y * 4, z * 4, 4) * c * 0.06;
      },
      color(x, y, z, h, f) {
        const lat = Math.abs(y);
        if (f.sea <= 0) {
          lerpC(f.col, deep, shallow, smooth(-0.25, 0, f.sea));
          f.rough = 0.22;
        } else {
          const dry = smooth(0.1, 0.45, fbmJS(n, x * 3 + 40, y * 3, z * 3, 3) + (1 - Math.abs(lat - 0.28) * 4) * 0.25);
          lerpC(f.col, grass, forest, smooth(0, 0.5, fbmJS(n, x * 8, y * 8, z * 8, 2) + 0.2));
          lerpC(f.col, f.col, desert, dry * 0.85);
          if (f.sea < 0.03) lerpC(f.col, sand, f.col, smooth(0, 0.03, f.sea));
          lerpC(f.col, f.col, rock, smooth(0.02, 0.05, h));
          lerpC(f.col, f.col, snow, smooth(0.045, 0.06, h));
          f.rough = 0.9;
        }
        if (lat > 0.82) { lerpC(f.col, f.col, snow, smooth(0.82, 0.9, lat + fbmJS(n, x * 5, y * 5, z * 5, 2) * 0.05)); f.rough = 0.6; }
      },
    };
  },
  mars(seed) {
    const n = makeNoise3(seed), rng = makeRng(seed);
    const cr = makeCraters(rng, 90, 0.03, 0.3, 0.035);
    const dark = C(0x5a2414), rust = C(0xb24c2a), light = C(0xd88a5a), cap = C(0xf6f2ee);
    // Valles Marineris: a long canyon along the equator; Olympus Mons: a huge shield volcano
    const om = [Math.cos(2.2) * 0.94, 0.33, Math.sin(2.2) * 0.94];
    return {
      height(x, y, z, f) {
        let h = fbmJS(n, x * 1.8, y * 1.8, z * 1.8, 5) * 0.03 + craterField(cr, x, y, z, f);
        const lon = Math.atan2(z, x);
        const canyon = Math.exp(-Math.pow((y + 0.08 + Math.sin(lon * 3) * 0.02) / 0.035, 2)) * smooth(-0.6, -0.2, lon) * smooth(1.3, 0.8, lon);
        h -= canyon * 0.06 * (0.7 + 0.3 * fbmJS(n, x * 9, y * 9, z * 9, 2));
        f.canyon = canyon;
        const d = Math.acos(Math.min(1, x * om[0] + y * om[1] + z * om[2]));
        h += Math.max(0, 1 - d / 0.22) ** 1.6 * 0.07;
        return h;
      },
      color(x, y, z, h, f) {
        const alb = fbmJS(n, x * 2.5 + 7, y * 2.5, z * 2.5, 4);
        lerpC(f.col, rust, light, smooth(-0.2, 0.3, alb));
        lerpC(f.col, f.col, dark, smooth(0.15, 0.4, -alb) * 0.8 + f.canyon * 0.5);
        lerpC(f.col, f.col, dark, f.crater * 0.25);
        const lat = Math.abs(y);
        lerpC(f.col, f.col, cap, smooth(0.86, 0.92, lat + fbmJS(n, x * 6, y * 6, z * 6, 2) * 0.04));
        f.rough = 0.95;
      },
    };
  },
  asteroids(seed) {
    const n = makeNoise3(seed), rng = makeRng(seed);
    const cr = makeCraters(rng, 120, 0.04, 0.5, 0.07);
    const a = C(0x4a4038), b = C(0x7a6a5a), c = C(0x9a8a78);
    return {
      shape: [1.25, 0.82, 0.95],
      height(x, y, z, f) { return fbmJS(n, x * 1.1, y * 1.1, z * 1.1, 3) * 0.22 + fbmJS(n, x * 5, y * 5, z * 5, 3) * 0.03 + craterField(cr, x, y, z, f); },
      color(x, y, z, h, f) {
        lerpC(f.col, a, b, smooth(-0.15, 0.1, h));
        lerpC(f.col, f.col, c, smooth(0.3, 0.6, fbmJS(n, x * 7, y * 7, z * 7, 3)));
        f.rough = 1;
      },
    };
  },
  prismara(seed) {
    const n = makeNoise3(seed);
    const a = C(0x3a1a7a), b = C(0x8a5ae0), c = C(0xff9af0), d = C(0x7af0ff);
    return {
      facets: true,
      height(x, y, z) { return ridgedJS(n, x * 1.6, y * 1.6, z * 1.6, 3) * 0.08; },
      color(x, y, z, h, f) {
        const k = 0.5 + 0.5 * Math.sin((x * 3 + y * 5 + z * 2) * 2.2 + fbmJS(n, x * 2, y * 2, z * 2, 2) * 4);
        lerpC(f.col, a, b, smooth(0, 0.06, h));
        lerpC(f.col, f.col, k > 0.5 ? c : d, Math.abs(k - 0.5) * 0.9);
        f.rough = 0.12;
        const g = smooth(0.62, 0.7, ridgedJS(n, x * 5, y * 5, z * 5, 2));
        f.emit.setRGB(0.9 * g, 0.5 * g, 1.2 * g);
      },
    };
  },
  mechanus(seed) {
    const n = makeNoise3(seed);
    const plate = C(0x6a5232), plate2 = C(0x9a7a48), brass = C(0xc8a060), dark = C(0x2a2014);
    return {
      height(x, y, z, f) {
        // stepped plates: quantised noise at two scales → mesas and trenches
        const big = Math.floor((fbmJS(n, x * 1.1, y * 1.1, z * 1.1, 2) + 0.5) * 3) / 3;
        f.level = big;
        return big * 0.05 + fbmJS(n, x * 5, y * 5, z * 5, 2) * 0.004;
      },
      color(x, y, z, h, f) {
        lerpC(f.col, plate, plate2, smooth(0, 0.06, h));
        if (f.slope > 0.5) { lerpC(f.col, f.col, dark, 0.85); const g = Math.min(1, (f.slope - 0.5) * 2); f.emit.setRGB(1.0 * g, 0.48 * g, 0.1 * g); }
        lerpC(f.col, f.col, brass, smooth(0.25, 0.5, fbmJS(n, x * 3 + 5, y * 3, z * 3, 2)) * 0.5);
        f.rough = 0.38; f.metal = 0.85;
      },
    };
  },
  biolumina(seed) {
    const n = makeNoise3(seed);
    const sea = C(0x02201c), jungle = C(0x0e4a34), moss = C(0x1a7a4a), dark = C(0x072a1e);
    const glowA = new THREE.Color(0.2, 1.4, 1.0), glowB = new THREE.Color(1.3, 0.3, 1.0);
    return {
      height(x, y, z, f) {
        const c = fbmJS(n, x * 1.7, y * 1.7, z * 1.7, 5) + 0.12;
        f.sea = c;
        return c <= 0 ? 0 : c * 0.04 + fbmJS(n, x * 9, y * 9, z * 9, 2) * 0.012;
      },
      color(x, y, z, h, f) {
        if (f.sea <= 0) { lerpC(f.col, sea, dark, 0.5); f.rough = 0.25; const s = smooth(0.42, 0.55, fbmJS(n, x * 10, y * 10, z * 10, 2)); f.emit.copy(glowA).multiplyScalar(s * 0.4); return; }
        lerpC(f.col, jungle, moss, smooth(-0.2, 0.3, fbmJS(n, x * 6, y * 6, z * 6, 3)));
        f.rough = 0.85;
        const s = smooth(0.32, 0.45, fbmJS(n, x * 14, y * 14, z * 14, 2)) * smooth(0.0, 0.25, fbmJS(n, x * 2.5 + 9, y * 2.5, z * 2.5, 2));
        f.emit.copy(fbmJS(n, x * 3, y * 3, z * 3, 2) > 0 ? glowA : glowB).multiplyScalar(s * 1.1);
      },
    };
  },
  chronos(seed) {
    const n = makeNoise3(seed);
    const gold = C(0xc8a050), pale = C(0xe8d8a0), bronze = C(0x6a4a24);
    return {
      height(x, y, z, f) {
        // concentric terraces like a clock dial around the pole
        const a = Math.acos(Math.max(-1, Math.min(1, y)));
        const ring = Math.floor(a * 14 / Math.PI);
        f.ring = ring;
        return ((ring % 3) * 0.012) + fbmJS(n, x * 3, y * 3, z * 3, 3) * 0.012;
      },
      color(x, y, z, h, f) {
        lerpC(f.col, bronze, f.ring % 2 ? gold : pale, 0.8);
        const lon = Math.atan2(z, x);
        const tick = Math.abs(Math.sin(lon * 6));
        if (tick < 0.04) { lerpC(f.col, f.col, pale, 0.8); f.emit.setRGB(1.2, 0.85, 0.3); }
        if (f.slope > 0.25) f.emit.setRGB(0.9, 0.6, 0.15);
        f.rough = 0.35; f.metal = 0.7;
      },
    };
  },
  velocitar(seed) {
    const n = makeNoise3(seed);
    const a = C(0x0a0618), b = C(0x1a0a30);
    return {
      grid: true,
      height(x, y, z) { return Math.floor((fbmJS(n, x * 1.2, y * 1.2, z * 1.2, 2) + 0.5) * 3) / 3 * 0.025; },
      color(x, y, z, h, f) {
        lerpC(f.col, a, b, smooth(0, 0.03, h));
        if (f.slope > 0.7) f.emit.setRGB(0.9, 0.12, 0.7);
        f.rough = 0.3; f.metal = 0.6;
      },
    };
  },
  // ---- moons (seen in the sky of the background variants)
  moon(seed) {
    const n = makeNoise3(seed), rng = makeRng(seed);
    const cr = makeCraters(rng, 160, 0.03, 0.35, 0.035);
    const mare = C(0x5a5a5e), high = C(0xb8b8b4), rayC = C(0xeeeeea);
    return {
      height(x, y, z, f) { return fbmJS(n, x * 2, y * 2, z * 2, 4) * 0.015 + craterField(cr, x, y, z, f); },
      color(x, y, z, h, f) {
        lerpC(f.col, mare, high, smooth(-0.15, 0.2, fbmJS(n, x * 1.5 + 3, y * 1.5, z * 1.5, 3)));
        lerpC(f.col, f.col, rayC, f.ray * 0.7);
        f.rough = 0.95;
      },
    };
  },
  io(seed) {
    const n = makeNoise3(seed);
    const sulfur = C(0xe8d050), orange = C(0xd8802a), white = C(0xf4f0d0), black = C(0x2a1a10);
    return {
      height(x, y, z) { return fbmJS(n, x * 2, y * 2, z * 2, 4) * 0.012; },
      color(x, y, z, h, f) {
        const a = fbmJS(n, x * 2.4, y * 2.4, z * 2.4, 4);
        lerpC(f.col, sulfur, orange, smooth(-0.1, 0.35, a));
        lerpC(f.col, f.col, white, smooth(0.15, 0.4, fbmJS(n, x * 4 + 9, y * 4, z * 4, 3)) * 0.7);
        const v = smooth(0.42, 0.5, fbmJS(n, x * 7 + 2, y * 7, z * 7, 2));
        lerpC(f.col, f.col, black, v);
        f.emit.setRGB(1.6 * v * v, 0.4 * v * v, 0.05 * v * v);
        f.rough = 0.9;
      },
    };
  },
  triton(seed) {
    const n = makeNoise3(seed);
    const pink = C(0xe8c8c0), blue = C(0xb0c8d8), streak = C(0x5a4a48);
    return {
      height(x, y, z) { return fbmJS(n, x * 3, y * 3, z * 3, 4) * 0.012; },
      color(x, y, z, h, f) {
        lerpC(f.col, blue, pink, smooth(-0.3, 0.2, y + fbmJS(n, x * 2, y * 2, z * 2, 3) * 0.4));
        lerpC(f.col, f.col, streak, smooth(0.35, 0.5, fbmJS(n, x * 2 + 4, y * 12, z * 2, 2)) * 0.8);
        f.rough = 0.6;
      },
    };
  },
  miranda(seed) {
    const n = makeNoise3(seed);
    const ice = C(0xc8ccd0), dark = C(0x6a6e74);
    return {
      height(x, y, z, f) {
        // patchwork "coronae": terraced chevrons and giant cliffs
        const t = fbmJS(n, x * 1.4, y * 1.4, z * 1.4, 3);
        f.ter = Math.floor((t + 0.5) * 4) / 4;
        return f.ter * 0.06 + fbmJS(n, x * 6, y * 6, z * 6, 2) * 0.008;
      },
      color(x, y, z, h, f) { lerpC(f.col, dark, ice, smooth(0, 0.06, h)); if (f.slope > 0.5) lerpC(f.col, f.col, C(0xe8f0f4), 0.6); f.rough = 0.7; },
    };
  },
  phobos(seed) {
    const n = makeNoise3(seed), rng = makeRng(seed);
    const cr = makeCraters(rng, 70, 0.05, 0.5, 0.08);
    const a = C(0x4a3e36), b = C(0x7a685a);
    return {
      shape: [1.35, 0.85, 1.0],
      height(x, y, z, f) { return fbmJS(n, x * 1.2, y * 1.2, z * 1.2, 3) * 0.16 + craterField(cr, x, y, z, f); },
      color(x, y, z, h, f) { lerpC(f.col, a, b, smooth(-0.1, 0.1, h)); f.rough = 1; },
    };
  },
};

// Gas giants / cloud decks: lit shader with flowing bands, turbulence and storms
const GAS = {
  jupiter: { cols: [0xe8d4b0, 0xb87a4a, 0xf4ead8, 0x8a5a3a], bands: 9, turb: 0.9, spot: [0.6, -0.36, 0.33, 0.12], spotCol: 0xc0502a },
  saturn: { cols: [0xead8a8, 0xc8a870, 0xf6ecd0, 0xa88a58], bands: 11, turb: 0.4, spot: null },
  uranus: { cols: [0xa8e8ee, 0x8ad4dc, 0xc4f4f6, 0x78c0c8], bands: 5, turb: 0.15, spot: null },
  neptune: { cols: [0x3a5ee0, 0x2440b0, 0x6a8af0, 0xe8f0ff], bands: 7, turb: 0.6, spot: [2.4, -0.3, 0.3, 0.13], spotCol: 0x101850, streaks: 0.5 },
  venus: { cols: [0xf0d8a0, 0xd8b070, 0xfff0c8, 0xb8884a], bands: 4, turb: 1.6, spot: null },
  aerolis: { cols: [0xffc8e0, 0x9ad8ff, 0xfff4fa, 0xc8a8ff], bands: 8, turb: 1.0, spot: [1.0, 0.25, 0.28, 0.14], spotCol: 0xffffff, streaks: 0.3 },
  titan: { cols: [0xd8902a, 0xc07a20, 0xe8a848, 0xa86418], bands: 3, turb: 0.5, spot: null },
};

const shared = { uTime: { value: 0 } };
export function tickPlanets(t) { shared.uTime.value = t; }

const DETAIL_GLSL = /* glsl */`
${NOISE}
varying vec3 vObj; varying float vRough; varying float vMetal; varying vec3 vEmit;
uniform float uTime; uniform float uGrid; uniform float uDetail;
`;
function patchRock(material, opts) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = shared.uTime;
    shader.uniforms.uGrid = { value: opts.grid ? 1 : 0 };
    shader.uniforms.uDetail = { value: opts.detail ?? 18 };
    shader.vertexShader = 'attribute float aRough; attribute float aMetal; attribute vec3 aEmit;\nvarying vec3 vObj; varying float vRough; varying float vMetal; varying vec3 vEmit;\n' +
      shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n vObj = position; vRough = aRough; vMetal = aMetal; vEmit = aEmit;');
    shader.fragmentShader = DETAIL_GLSL + shader.fragmentShader
      .replace('#include <color_fragment>', `#include <color_fragment>
        vec3 dn = normalize(vObj);
        diffuseColor.rgb *= 0.86 + 0.28 * (0.5 + 0.5 * fbm3(dn * uDetail));`)
      .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\n roughnessFactor = vRough;')
      .replace('#include <metalnessmap_fragment>', '#include <metalnessmap_fragment>\n metalnessFactor = vMetal;')
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
        totalEmissiveRadiance += vEmit * (0.85 + 0.15 * sin(uTime * 2.0 + dn.x * 20.0));
        if (uGrid > 0.5) {
          float lat = asin(clamp(dn.y, -1.0, 1.0)), lon = atan(dn.z, dn.x);
          vec2 g = vec2(lon * 8.0 / 3.14159, lat * 8.0 / 3.14159);
          vec2 gw = abs(fract(g - 0.5) - 0.5) / max(fwidth(g), vec2(1e-4));
          float line = 1.0 - min(min(gw.x, gw.y), 1.0);
          float pulse = smoothstep(0.92, 1.0, sin(lon * 3.0 - uTime * 3.0 + floor(g.y) * 1.7));
          totalEmissiveRadiance += mix(vec3(1.0, 0.2, 0.85), vec3(0.2, 0.85, 1.0), 0.5 + 0.5 * sin(lat * 4.0)) * line * (0.9 + pulse * 2.5);
        }`);
  };
  material.customProgramCacheKey = () => 'planet-rock';
}
function gasMaterial(spec, seed) {
  const m = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9, metalness: 0 });
  const cols = spec.cols.map((c) => new THREE.Color(c));
  const uniforms = {
    uC0: { value: cols[0] }, uC1: { value: cols[1] }, uC2: { value: cols[2] }, uC3: { value: cols[3] },
    uBands: { value: spec.bands }, uTurb: { value: spec.turb }, uSeed: { value: seed * 1.37 },
    uSpot: { value: new THREE.Vector4(...(spec.spot || [0, 0, 0.0001, 0.0001])) }, uSpotOn: { value: spec.spot ? 1 : 0 },
    uSpotCol: { value: new THREE.Color(spec.spotCol || 0) }, uStreaks: { value: spec.streaks || 0 },
  };
  m.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms, { uTime: shared.uTime });
    shader.vertexShader = 'varying vec3 vObj;\n' + shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n vObj = position;');
    shader.fragmentShader = `${NOISE}
      varying vec3 vObj; uniform float uTime, uBands, uTurb, uSeed, uSpotOn, uStreaks; uniform vec3 uC0, uC1, uC2, uC3, uSpotCol; uniform vec4 uSpot;
      ` + shader.fragmentShader.replace('#include <color_fragment>', `#include <color_fragment>
        vec3 n = normalize(vObj);
        float lat = n.y;
        float lon = atan(n.z, n.x);
        float spd = sin(lat * 9.0) * 0.06 + 0.02;              // differential rotation per band
        float lo = lon + uTime * spd;
        vec3 q = vec3(cos(lo) * sqrt(1.0 - lat * lat), lat, sin(lo) * sqrt(1.0 - lat * lat));
        float w = fbm(vec3(q.x * 2.2, q.y * 7.0, q.z * 2.2) + uSeed);
        float w2 = fbm3(q * 9.0 + uSeed * 2.0 + vec3(0.0, 0.0, uTime * 0.01));
        float b = lat * uBands + w * uTurb + w2 * 0.15;
        float band = 0.5 + 0.5 * sin(b * 3.14159);
        float band2 = 0.5 + 0.5 * sin(b * 1.618 + 1.3);
        vec3 c = mix(uC0, uC1, smoothstep(0.25, 0.75, band));
        c = mix(c, uC2, smoothstep(0.6, 0.95, band2) * 0.75);
        c = mix(c, uC3, smoothstep(0.35, 0.7, w2) * 0.3);
        if (uStreaks > 0.0) c = mix(c, vec3(1.0), smoothstep(0.55, 0.75, fbm3(vec3(q.x * 3.0, q.y * 40.0, q.z * 3.0) + uSeed)) * uStreaks);
        if (uSpotOn > 0.5) {
          float dl = atan(sin(lon + uTime * 0.03 - uSpot.x), cos(lon + uTime * 0.03 - uSpot.x));
          float e = pow(dl / uSpot.z, 2.0) + pow((lat - uSpot.y) / uSpot.w, 2.0);
          float sw = fbm3(vec3(dl * 6.0, (lat - uSpot.y) * 12.0, uTime * 0.05 + uSeed));
          float spot = smoothstep(1.0, 0.25, e + sw * 0.35);
          c = mix(c, uSpotCol, spot * 0.9);
          c = mix(c, uC2, smoothstep(1.3, 1.0, e) * smoothstep(0.85, 1.0, e) * 0.5);
        }
        diffuseColor.rgb = c;`);
  };
  m.customProgramCacheKey = () => 'planet-gas';
  return m;
}

// ---------------------------------------------------------------- geometry
const geoCache = new Map();
// cube-sphere displaced by recipe.height; normals from finite differences (seamless)
function buildRockGeometry(recipe, segs) {
  const N = segs, verts = 6 * (N + 1) * (N + 1);
  const pos = new Float32Array(verts * 3), nor = new Float32Array(verts * 3), col = new Float32Array(verts * 3);
  const rough = new Float32Array(verts), metal = new Float32Array(verts), emit = new Float32Array(verts * 3);
  const idx = [];
  const faces = [[0, 1, 2, 1], [0, 1, 2, -1], [1, 2, 0, 1], [1, 2, 0, -1], [2, 0, 1, 1], [2, 0, 1, -1]];
  const f = { col: new THREE.Color(), emit: new THREE.Color(), rough: 0.9, metal: 0, crater: 0, ray: 0, slope: 0 };
  const tmp = { crater: 0, ray: 0 };
  const shape = recipe.shape || [1, 1, 1];
  const eps = 1.2 / N;
  const v = [0, 0, 0];
  let vi = 0;
  const H = (x, y, z, o) => recipe.height(x, y, z, o);
  for (const [a, b, c, s] of faces) {
    const base = vi;
    for (let j = 0; j <= N; j++) for (let i = 0; i <= N; i++) {
      const u = (i / N) * 2 - 1, w = (j / N) * 2 - 1;
      v[a] = u; v[b] = w; v[c] = s;
      // spherified cube: even vertex spacing
      const x2 = v[0] * v[0], y2 = v[1] * v[1], z2 = v[2] * v[2];
      let x = v[0] * Math.sqrt(1 - y2 / 2 - z2 / 2 + y2 * z2 / 3);
      let y = v[1] * Math.sqrt(1 - z2 / 2 - x2 / 2 + z2 * x2 / 3);
      let z = v[2] * Math.sqrt(1 - x2 / 2 - y2 / 2 + x2 * y2 / 3);
      const l = Math.hypot(x, y, z); x /= l; y /= l; z /= l;
      f.crater = 0; f.ray = 0; f.sea = 1; f.canyon = 0;
      const h0 = H(x, y, z, f);
      // tangent frame
      let tx = -z, ty = 0, tz = x;
      if (Math.abs(y) > 0.95) { tx = 1; ty = 0; tz = 0; }
      const tl = Math.hypot(tx, ty, tz); tx /= tl; ty /= tl; tz /= tl;
      const bx = y * tz - z * ty, by = z * tx - x * tz, bz = x * ty - y * tx;
      const p1 = [x + tx * eps, y + ty * eps, z + tz * eps], p2 = [x + bx * eps, y + by * eps, z + bz * eps];
      const l1 = Math.hypot(...p1), l2 = Math.hypot(...p2);
      for (let k = 0; k < 3; k++) { p1[k] /= l1; p2[k] /= l2; }
      const h1 = H(p1[0], p1[1], p1[2], tmp), h2 = H(p2[0], p2[1], p2[2], tmp);
      const P0 = [x * (1 + h0), y * (1 + h0), z * (1 + h0)];
      const A = [p1[0] * (1 + h1) - P0[0], p1[1] * (1 + h1) - P0[1], p1[2] * (1 + h1) - P0[2]];
      const B = [p2[0] * (1 + h2) - P0[0], p2[1] * (1 + h2) - P0[1], p2[2] * (1 + h2) - P0[2]];
      let nx = A[1] * B[2] - A[2] * B[1], ny = A[2] * B[0] - A[0] * B[2], nz = A[0] * B[1] - A[1] * B[0];
      const nl = Math.hypot(nx, ny, nz) || 1; nx /= nl; ny /= nl; nz /= nl;
      if (nx * x + ny * y + nz * z < 0) { nx = -nx; ny = -ny; nz = -nz; }
      f.slope = 1 - (nx * x + ny * y + nz * z);
      f.slope = Math.min(1, f.slope * 6);
      f.col.setRGB(0.5, 0.5, 0.5); f.emit.setRGB(0, 0, 0); f.rough = 0.9; f.metal = 0;
      recipe.color(x, y, z, h0, f);
      pos[vi * 3] = P0[0] * shape[0]; pos[vi * 3 + 1] = P0[1] * shape[1]; pos[vi * 3 + 2] = P0[2] * shape[2];
      nor[vi * 3] = nx; nor[vi * 3 + 1] = ny; nor[vi * 3 + 2] = nz;
      col[vi * 3] = f.col.r; col[vi * 3 + 1] = f.col.g; col[vi * 3 + 2] = f.col.b;
      emit[vi * 3] = f.emit.r; emit[vi * 3 + 1] = f.emit.g; emit[vi * 3 + 2] = f.emit.b;
      rough[vi] = f.rough; metal[vi] = f.metal;
      vi++;
    }
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
      const a0 = base + j * (N + 1) + i, a1 = a0 + 1, a2 = a0 + N + 1, a3 = a2 + 1;
      idx.push(a0, a1, a3, a0, a3, a2);
    }
  }
  // fix winding so every triangle faces outward
  for (let t = 0; t < idx.length; t += 3) {
    const i0 = idx[t] * 3, i1 = idx[t + 1] * 3, i2 = idx[t + 2] * 3;
    const ax = pos[i1] - pos[i0], ay = pos[i1 + 1] - pos[i0 + 1], az = pos[i1 + 2] - pos[i0 + 2];
    const bx = pos[i2] - pos[i0], by = pos[i2 + 1] - pos[i0 + 1], bz = pos[i2 + 2] - pos[i0 + 2];
    const cx = ay * bz - az * by, cy = az * bx - ax * bz, cz = ax * by - ay * bx;
    if (cx * pos[i0] + cy * pos[i0 + 1] + cz * pos[i0 + 2] < 0) { const k = idx[t + 1]; idx[t + 1] = idx[t + 2]; idx[t + 2] = k; }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  g.setAttribute('aRough', new THREE.BufferAttribute(rough, 1));
  g.setAttribute('aMetal', new THREE.BufferAttribute(metal, 1));
  g.setAttribute('aEmit', new THREE.BufferAttribute(emit, 3));
  g.setIndex(idx);
  g.computeBoundingSphere();
  return g;
}

function rockGeometry(id, segs, seed) {
  const key = `${id}:${segs}:${seed}`;
  if (!geoCache.has(key)) {
    const recipe = RECIPES[id](seed);
    let g = buildRockGeometry(recipe, segs);
    if (recipe.facets) { g = g.toNonIndexed(); g.computeVertexNormals(); }
    g.userData.shared = true;
    geoCache.set(key, g);
  }
  return geoCache.get(key);
}

// ---------------------------------------------------------------- extras
function atmosphere(color, scale = 1.12, power = 3.2, strength = 1.0) {
  const m = new THREE.ShaderMaterial({
    uniforms: { uCol: { value: new THREE.Color(color) }, uPow: { value: power }, uStr: { value: strength } },
    vertexShader: 'varying vec3 vN; varying vec3 vV; void main(){ vec4 wp = modelMatrix*vec4(position,1.0); vN = normalize(mat3(modelMatrix)*normal); vV = normalize(cameraPosition - wp.xyz); gl_Position = projectionMatrix*viewMatrix*wp; }',
    fragmentShader: 'uniform vec3 uCol; uniform float uPow, uStr; varying vec3 vN; varying vec3 vV; void main(){ float f = 1.0 - abs(dot(normalize(vN), normalize(vV))); float a = pow(f, uPow) * uStr; gl_FragColor = vec4(uCol * a, a); }',
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.BackSide, fog: false,
  });
  const s = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 32), m);
  s.scale.setScalar(scale);
  s.renderOrder = 2;
  return s;
}
function rim(color, power = 2.5, strength = 0.7) {
  // fresnel haze inside the silhouette (front faces)
  const m = new THREE.ShaderMaterial({
    uniforms: { uCol: { value: new THREE.Color(color) }, uPow: { value: power }, uStr: { value: strength } },
    vertexShader: 'varying vec3 vN; varying vec3 vV; void main(){ vec4 wp = modelMatrix*vec4(position,1.0); vN = normalize(mat3(modelMatrix)*normal); vV = normalize(cameraPosition - wp.xyz); gl_Position = projectionMatrix*viewMatrix*wp; }',
    fragmentShader: 'uniform vec3 uCol; uniform float uPow, uStr; varying vec3 vN; varying vec3 vV; void main(){ float f = 1.0 - max(dot(normalize(vN), normalize(vV)), 0.0); float a = pow(f, uPow) * uStr; gl_FragColor = vec4(uCol * a, a); }',
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false,
  });
  const s = new THREE.Mesh(new THREE.SphereGeometry(1.012, 48, 32), m);
  s.renderOrder = 2;
  return s;
}
function cloudShell(color, coverage = 0.5, opacity = 0.85, scale = 1.025) {
  const m = new THREE.MeshStandardMaterial({ color, transparent: true, opacity, depthWrite: false, roughness: 1 });
  m.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = shared.uTime;
    shader.uniforms.uCov = { value: coverage };
    shader.vertexShader = 'varying vec3 vObj;\n' + shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n vObj = position;');
    shader.fragmentShader = `${NOISE}\nvarying vec3 vObj; uniform float uTime, uCov;\n` + shader.fragmentShader.replace('#include <color_fragment>', `#include <color_fragment>
      vec3 n = normalize(vObj);
      float c = fbm(n * 3.2 + vec3(uTime * 0.012, 0.0, uTime * 0.006)) + fbm3(n * 11.0 - uTime * 0.01) * 0.25;
      diffuseColor.a *= smoothstep(0.5 - uCov, 0.85 - uCov, c + 0.25);`);
  };
  m.customProgramCacheKey = () => 'planet-clouds';
  const s = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 48), m);
  s.scale.setScalar(scale);
  s.renderOrder = 1;
  return s;
}
let ringTexCache = new Map();
function ringTexture(key, cols, gaps) {
  if (ringTexCache.has(key)) return ringTexCache.get(key);
  const W = 1024, c = document.createElement('canvas'); c.width = W; c.height = 4;
  const g = c.getContext('2d');
  const rng = makeRng(key.length * 31 + 7);
  for (let x = 0; x < W; x++) {
    const u = x / W;
    let a = 0.35 + 0.65 * Math.abs(Math.sin(u * 90 + Math.sin(u * 23) * 3)) * (0.6 + 0.4 * Math.sin(u * 13.7));
    a *= Math.min(1, u * 6) * Math.min(1, (1 - u) * 5);
    for (const [g0, g1, depth] of gaps) if (u > g0 && u < g1) a *= 1 - depth;
    a *= 0.85 + rng.next() * 0.3;
    const col = new THREE.Color(cols[0]).lerp(new THREE.Color(cols[1]), 0.5 + 0.5 * Math.sin(u * 17));
    g.fillStyle = `rgba(${(col.r * 255) | 0},${(col.g * 255) | 0},${(col.b * 255) | 0},${Math.max(0, Math.min(1, a)).toFixed(3)})`;
    g.fillRect(x, 0, 1, 4);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  ringTexCache.set(key, t);
  return t;
}
function rings(inner, outer, cols, gaps, opacity = 1, key = 'r') {
  const geo = new THREE.RingGeometry(inner, outer, 160, 1);
  const pos = geo.attributes.position, uv = geo.attributes.uv;
  for (let i = 0; i < pos.count; i++) uv.setXY(i, (Math.hypot(pos.getX(i), pos.getY(i)) - inner) / (outer - inner), 0.5);
  const m = new THREE.MeshStandardMaterial({ map: ringTexture(key, cols, gaps), transparent: true, opacity, side: THREE.DoubleSide, depthWrite: false, roughness: 0.8, emissive: 0x111111 });
  const mesh = new THREE.Mesh(geo, m);
  mesh.rotation.x = -Math.PI / 2;
  return mesh;
}
function glowSprite(color, scale, opacity = 1) {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d');
  const col = new THREE.Color(color);
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  const rgb = `${(col.r * 255) | 0},${(col.g * 255) | 0},${(col.b * 255) | 0}`;
  grd.addColorStop(0, `rgba(${rgb},1)`); grd.addColorStop(0.25, `rgba(${rgb},0.45)`); grd.addColorStop(0.6, `rgba(${rgb},0.1)`); grd.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = grd; g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity, fog: false }));
  s.scale.setScalar(scale);
  return s;
}

// a star with animated granulation and limb darkening; colours set per star
export function starBody(hot = 0xffd870, cool = 0xff6a10, glow = 0xffa030) {
  const m = new THREE.ShaderMaterial({
    uniforms: { uTime: shared.uTime, uHot: { value: new THREE.Color(hot) }, uCool: { value: new THREE.Color(cool) } }, fog: false,
    vertexShader: 'varying vec3 vP; varying vec3 vN; varying vec3 vV; void main(){ vP = position; vec4 wp = modelMatrix*vec4(position,1.0); vN = normalize(mat3(modelMatrix)*normal); vV = cameraPosition - wp.xyz; gl_Position = projectionMatrix*viewMatrix*wp; }',
    fragmentShader: `${NOISE}
      uniform float uTime; uniform vec3 uHot, uCool; varying vec3 vP; varying vec3 vN; varying vec3 vV;
      void main(){
        vec3 d = normalize(vP);
        float gran = fbm(d * 26.0 + vec3(0.0, uTime * 0.05, 0.0));
        float big = fbm3(d * 4.0 + uTime * 0.01);
        float spots = smoothstep(0.42, 0.58, fbm3(d * 2.6 + 9.0));
        float mu = max(dot(normalize(vN), normalize(vV)), 0.0);
        vec3 c = mix(uCool, uHot, smoothstep(-0.4, 0.5, gran)) * (0.8 + 0.4 * big);
        c = mix(c, uCool * 0.25, spots * 0.8);
        c *= 0.4 + 0.6 * pow(mu, 0.45);
        c += uCool * pow(1.0 - mu, 3.0) * 0.7;
        gl_FragColor = vec4(c * 1.7, 1.0);
      }`,
  });
  const g = new THREE.Group();
  const s = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 48), m);
  g.add(s);
  g.add(glowSprite(glow, 5.2, 0.9));
  g.add(glowSprite(hot, 2.6, 0.6));
  g.userData.body = s;
  return g;
}

// prominence loop: a glowing arc of plasma rooted on the surface
function prominenceLoop(rng, color) {
  const d = new THREE.Vector3(...randDir(rng)).normalize();
  const side = new THREE.Vector3(...randDir(rng)).cross(d).normalize();
  const span = rng.range(0.25, 0.5), height = rng.range(0.08, 0.2);
  const pts = [];
  for (let i = 0; i <= 16; i++) {
    const u = i / 16, a = (u - 0.5) * span;
    const p = d.clone().applyAxisAngle(side.clone().cross(d).normalize(), a).multiplyScalar(1 + Math.sin(u * Math.PI) * height);
    pts.push(p);
  }
  const m = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, rng.range(0.018, 0.035), 6),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
  return m;
}

export function blackHoleBody() {
  const g = new THREE.Group();
  const core = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 32), new THREE.MeshBasicMaterial({ color: 0x000000, fog: false }));
  core.renderOrder = 5;
  g.add(core);
  const diskMat = new THREE.ShaderMaterial({
    uniforms: { uTime: shared.uTime }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false,
    vertexShader: 'varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
    fragmentShader: `${NOISE}
      uniform float uTime; varying vec3 vP;
      void main(){
        float r = length(vP.xy), a = atan(vP.y, vP.x);
        float rr = (r - 1.3) / 2.4;
        float sw = a + uTime * 0.5 + 2.5 / (0.2 + rr);
        float n = fbm(vec3(cos(sw) * 2.0, sin(sw) * 2.0, rr * 3.0 + uTime * 0.05));
        float inner = exp(-rr * 3.0);
        vec3 c = mix(vec3(0.6, 0.1, 0.3), vec3(1.0, 0.55, 0.15), smoothstep(0.1, 0.7, inner + n * 0.3));
        c = mix(c, vec3(1.0, 0.95, 0.85), smoothstep(0.75, 1.0, inner));
        float al = clamp((0.35 + 0.65 * n) * (0.3 + inner) * smoothstep(0.0, 0.05, rr) * smoothstep(1.0, 0.7, rr), 0.0, 1.0);
        gl_FragColor = vec4(c * 2.0 * al, al);
      }`,
  });
  const disk = new THREE.Mesh(new THREE.RingGeometry(1.3, 3.7, 128, 6), diskMat);
  disk.rotation.x = -Math.PI / 2 + 0.25;
  g.add(disk);
  const photon = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.025, 12, 96), new THREE.MeshBasicMaterial({ color: 0xffc890, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
  g.add(photon);
  // the lensed far side of the disk, wrapped round the hole and always facing you
  const halo = new THREE.Mesh(new THREE.RingGeometry(1.14, 1.75, 96, 2), new THREE.ShaderMaterial({
    uniforms: { uTime: shared.uTime }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false,
    vertexShader: 'varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
    fragmentShader: `${NOISE}
      uniform float uTime; varying vec2 vP;
      void main(){ float r = length(vP), a = atan(vP.y, vP.x); float k = (r - 1.14) / 0.61;
        float n = fbm3(vec3(cos(a + uTime * 0.4) * 2.0, sin(a + uTime * 0.4) * 2.0, k * 2.0));
        float al = pow(1.0 - k, 3.0) * (0.45 + 0.55 * n) * (0.55 + 0.45 * max(0.0, sin(a))) * 0.7;
        gl_FragColor = vec4(vec3(1.0, 0.62, 0.3) * 1.3 * al, al); }`,
  }));
  g.add(halo);
  const gl = glowSprite(0xff7a30, 9, 0.28); gl.renderOrder = -1; g.add(gl);
  g.userData.body = core;
  g.userData.update = (t, camera) => { if (camera) { const wp = new THREE.Vector3(); g.getWorldPosition(wp); const look = camera.position.clone(); photon.lookAt(look); halo.lookAt(look); } };
  return g;
}

// ---------------------------------------------------------------- public: build a planet for a world
// opts: segs (geometry resolution), seed, fog (false for sky planets), lite (fewer extras)
export function makePlanet(world, opts = {}) {
  const id = world.id, segs = opts.segs || 64, seed = opts.seed ?? (world.planet.size * 100 | 0) + id.length;
  const g = new THREE.Group();
  const updates = [];
  let body;
  if (world.planet.blackhole) {
    const bh = blackHoleBody();
    bh.userData.planet = true;
    return bh;
  }
  if (id === 'sun') {
    const s = starBody(0xfff0a0, 0xff6a10, 0xffa030);
    g.add(s);
    body = s.userData.body;
    if (!opts.lite) {
      const rng = makeRng(seed);
      for (let i = 0; i < 7; i++) { const p = prominenceLoop(rng, i % 2 ? 0xff8a30 : 0xffc060); g.add(p); }
    }
  } else if (GAS[id]) {
    body = new THREE.Mesh(new THREE.SphereGeometry(1, Math.max(48, segs), Math.max(32, segs * 0.75)), gasMaterial(GAS[id], seed));
    g.add(body);
    if (id === 'venus') g.add(atmosphere(0xffd890, 1.08, 2.4, 1.1));
    else if (id === 'titan') g.add(atmosphere(0xffb050, 1.12, 2.2, 1.2));
    else if (id === 'aerolis') {
      g.add(atmosphere(0xffc8e8, 1.1, 2.6, 1.0));
      // a halo of tiny floating sky islands
      const isle = new THREE.InstancedMesh(new THREE.ConeGeometry(0.035, 0.07, 6), new THREE.MeshStandardMaterial({ color: 0x9a8aa8, flatShading: true }), 90);
      const top = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.035, 0.034, 0.012, 6), new THREE.MeshStandardMaterial({ color: 0x6ad890, flatShading: true }), 90);
      const rng = makeRng(seed), m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3();
      for (let i = 0; i < 90; i++) {
        const a = (i / 90) * Math.PI * 2 + rng.range(-0.03, 0.03), r = rng.range(1.35, 1.6), y = rng.range(-0.06, 0.06);
        const s = rng.range(0.6, 1.6);
        sc.setScalar(s);
        m4.compose(new THREE.Vector3(Math.cos(a) * r, y - 0.035 * s, Math.sin(a) * r), q.setFromEuler(new THREE.Euler(Math.PI, 0, 0)), sc);
        isle.setMatrixAt(i, m4);
        m4.compose(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r), q.identity(), sc);
        top.setMatrixAt(i, m4);
      }
      const halo = new THREE.Group(); halo.add(isle, top); halo.rotation.z = 0.25;
      g.add(halo);
      updates.push((t) => { halo.rotation.y = t * 0.05; });
    } else g.add(atmosphere(new THREE.Color(GAS[id].cols[2]).lerp(new THREE.Color(0x88aaff), 0.3), 1.06, 3.5, 0.7));
    if (id === 'saturn') {
      const r = rings(1.25, 2.35, [0xe8d4a0, 0xb8a070], [[0.55, 0.6, 0.85], [0.82, 0.84, 0.6], [0.2, 0.24, 0.4]], 1, 'saturn');
      r.rotation.x = -Math.PI / 2 + 0.42;
      g.add(r);
    }
    if (id === 'uranus') {
      const r = rings(1.5, 1.95, [0x8aa8b0, 0x5a7a88], [[0.1, 0.45, 0.9], [0.55, 0.85, 0.85]], 0.7, 'uranus');
      r.rotation.x = 0.1; r.rotation.z = Math.PI / 2 - 0.1;
      g.add(r);
      body.rotation.z = Math.PI / 2 - 0.1;
    }
  } else if (RECIPES[id]) {
    const recipe = RECIPES[id](seed);
    const geo = rockGeometry(id, recipe.facets ? Math.min(segs, 24) : segs, seed);
    const m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, metalness: 0, emissive: 0xffffff, emissiveIntensity: 1, flatShading: !!recipe.facets, fog: opts.fog ?? true });
    m.emissive.setRGB(0, 0, 0);
    patchRock(m, { grid: recipe.grid, detail: id === 'asteroids' ? 10 : 20 });
    body = new THREE.Mesh(geo, m);
    g.add(body);
    if (id === 'earth') {
      g.add(cloudShell(0xffffff, 0.12, 0.9, 1.022));
      g.add(rim(0x6ab0ff, 2.6, 0.9));
      g.add(atmosphere(0x4a90ff, 1.07, 3.0, 1.1));
    } else if (id === 'mars') {
      g.add(rim(0xffa070, 3.0, 0.45));
      g.add(atmosphere(0xff9060, 1.04, 4.0, 0.5));
    } else if (id === 'biolumina') {
      g.add(cloudShell(0x9affd8, -0.05, 0.5, 1.03));
      g.add(rim(0x3affc0, 2.2, 0.8));
      g.add(atmosphere(0x30ffc0, 1.09, 2.8, 1.0));
    } else if (id === 'prismara') {
      g.add(atmosphere(0xc08aff, 1.12, 2.4, 1.0));
      // crystal spires jutting out of the surface
      const rng = makeRng(seed + 3);
      const n = opts.lite ? 40 : 90;
      const sp = new THREE.InstancedMesh(new THREE.OctahedronGeometry(1, 0), new THREE.MeshPhysicalMaterial({ color: 0xe0c8ff, roughness: 0.05, metalness: 0.1, iridescence: 1, iridescenceIOR: 1.6, emissive: 0x4a1a8a, emissiveIntensity: 0.6, clearcoat: 1 }), n);
      const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0);
      for (let i = 0; i < n; i++) {
        const d = new THREE.Vector3(...randDir(rng));
        const len = rng.range(0.06, 0.22);
        q.setFromUnitVectors(up, d);
        m4.compose(d.clone().multiplyScalar(1.02 + len * 0.4), q, new THREE.Vector3(len * 0.22, len, len * 0.22));
        sp.setMatrixAt(i, m4);
      }
      g.add(sp);
    } else if (id === 'mechanus') {
      g.add(atmosphere(0xffb060, 1.05, 3.5, 0.5));
      // a toothed ring-gear spinning around the equator
      const gear = new THREE.Group();
      const brass = new THREE.MeshStandardMaterial({ color: 0xb08850, metalness: 0.9, roughness: 0.3 });
      gear.add(new THREE.Mesh(new THREE.TorusGeometry(1.45, 0.035, 8, 128), brass));
      const teeth = new THREE.InstancedMesh(new THREE.BoxGeometry(0.05, 0.06, 0.05), brass, 72);
      const m4 = new THREE.Matrix4();
      for (let i = 0; i < 72; i++) { const a = (i / 72) * Math.PI * 2; m4.makeRotationZ(a); m4.setPosition(Math.cos(a) * 1.5, Math.sin(a) * 1.5, 0); teeth.setMatrixAt(i, m4); }
      gear.add(teeth);
      gear.rotation.x = Math.PI / 2 - 0.3;
      g.add(gear);
      updates.push((t) => { gear.rotation.z = t * 0.12; });
    } else if (id === 'chronos') {
      g.add(atmosphere(0xffd870, 1.08, 3.0, 0.8));
      // a clock dial ring with hour ticks and a sweeping hand
      const dial = new THREE.Group();
      const gold = new THREE.MeshStandardMaterial({ color: 0xffd86a, metalness: 0.9, roughness: 0.2, emissive: 0x6a4a10 });
      dial.add(new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.02, 8, 128), gold));
      dial.add(new THREE.Mesh(new THREE.TorusGeometry(1.75, 0.01, 8, 128), gold));
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        const tk = new THREE.Mesh(new THREE.BoxGeometry(0.03, i % 3 ? 0.08 : 0.16, 0.03), gold);
        tk.position.set(Math.cos(a) * 1.68, Math.sin(a) * 1.68, 0); tk.rotation.z = a - Math.PI / 2;
        dial.add(tk);
      }
      const hand = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.6, 0.02), gold);
      hand.geometry.translate(0, 1.3, 0);
      dial.add(hand);
      dial.rotation.x = Math.PI / 2 - 0.5;
      g.add(dial);
      updates.push((t) => { hand.rotation.z = -t * 0.6; dial.rotation.z = t * 0.03; });
    } else if (id === 'velocitar') {
      g.add(atmosphere(0xff3ad8, 1.1, 2.6, 0.9));
      const ringMat = (c) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false, fog: false });
      const r1 = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.008, 6, 128), ringMat(0xff3ad8));
      const r2 = new THREE.Mesh(new THREE.TorusGeometry(1.55, 0.006, 6, 128), ringMat(0x3ad8ff));
      r1.rotation.x = Math.PI / 2 - 0.2; r2.rotation.x = Math.PI / 2 + 0.3;
      // light pulses racing round the speed rings
      const pulse = (r, c) => { const p = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 6), ringMat(c)); r.add(p); return p; };
      const p1 = pulse(r1, 0xffffff), p2 = pulse(r2, 0xffffff);
      g.add(r1, r2);
      updates.push((t) => { p1.position.set(Math.cos(t * 2.5) * 1.4, Math.sin(t * 2.5) * 1.4, 0); p2.position.set(Math.cos(-t * 3.1) * 1.55, Math.sin(-t * 3.1) * 1.55, 0); });
    } else if (id === 'mercury') {
      g.add(rim(0xb0a898, 4, 0.25));
    }
  }
  // gentle spin
  const spin = { sun: 0.03, jupiter: 0.09, saturn: 0.08, earth: 0.05, mars: 0.05, venus: -0.01 }[id] ?? 0.04;
  updates.push((t) => { if (body && id !== 'uranus') body.rotation.y = t * spin; });
  g.userData.body = body;
  g.userData.planet = true;
  g.userData.update = (t, camera) => { for (const u of updates) u(t, camera); };
  if (opts.fog === false) g.traverse((o) => { if (o.material && 'fog' in o.material) o.material.fog = false; });
  return g;
}

// a field of tumbling asteroid rocks along a ring (instanced)
export function asteroidBelt(r0, r1, count = 500, seed = 5) {
  const rng = makeRng(seed);
  const geo = new THREE.DodecahedronGeometry(1, 0);
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) p.setXYZ(i, p.getX(i) * rng.range(0.7, 1.2), p.getY(i) * rng.range(0.6, 1.1), p.getZ(i) * rng.range(0.7, 1.2));
  geo.computeVertexNormals();
  const mesh = new THREE.InstancedMesh(geo, new THREE.MeshStandardMaterial({ color: 0x8a7a68, roughness: 1, flatShading: true }), count);
  const data = [];
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
  for (let i = 0; i < count; i++) {
    const r = rng.range(r0, r1), a = rng.next() * Math.PI * 2, y = rng.range(-0.8, 0.8), s = Math.pow(rng.next(), 3) * 0.55 + 0.08;
    data.push({ r, a, y, s, sp: 0.4 / Math.pow(r, 1.5), rx: rng.next() * 6, ry: rng.next() * 6, tumble: rng.range(-1, 1) });
    const c = new THREE.Color(0x8a7a68).offsetHSL(0, 0, rng.range(-0.12, 0.08));
    mesh.setColorAt(i, c);
  }
  mesh.userData.update = (t) => {
    for (let i = 0; i < count; i++) {
      const d = data[i], a = d.a + t * d.sp;
      e.set(d.rx + t * d.tumble, d.ry + t * d.tumble * 0.7, 0);
      m4.compose(new THREE.Vector3(Math.cos(a) * d.r, d.y, Math.sin(a) * d.r), q.setFromEuler(e), new THREE.Vector3(d.s, d.s, d.s));
      mesh.setMatrixAt(i, m4);
    }
    mesh.instanceMatrix.needsUpdate = true;
  };
  mesh.userData.update(0);
  return mesh;
}
