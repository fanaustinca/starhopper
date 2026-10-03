// Procedural canvas textures: planets, sky gradients, glow sprites.
import * as THREE from 'three';
import { makeRng } from '../core/rng.js';

const hex = (c) => '#' + c.toString(16).padStart(6, '0');

function canvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return c;
}

function mix(a, b, t) {
  const ca = new THREE.Color(a), cb = new THREE.Color(b);
  return ca.lerp(cb, t);
}

export function glowTexture(color = 0xffffff) {
  const c = canvas(128, 128);
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  const col = new THREE.Color(color);
  const rgb = `${Math.round(col.r * 255)},${Math.round(col.g * 255)},${Math.round(col.b * 255)}`;
  grd.addColorStop(0, `rgba(${rgb},1)`);
  grd.addColorStop(0.25, `rgba(${rgb},0.55)`);
  grd.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// Equirectangular planet surface textures.
export function planetTexture(world, seed = 1) {
  const W = 512, H = 256;
  const c = canvas(W, H);
  const g = c.getContext('2d');
  const r = makeRng(seed * 977 + 3);
  const base = new THREE.Color(world.planet.color);
  g.fillStyle = hex(world.planet.color);
  g.fillRect(0, 0, W, H);
  const id = world.id;
  if (world.planet.bands) {
    for (let y = 0; y < H; y += 2) {
      const n = Math.sin(y * 0.09 + r.next()) * 0.5 + Math.sin(y * 0.031) * 0.5;
      const col = base.clone().offsetHSL(n * 0.02, n * 0.08, n * 0.12);
      g.fillStyle = col.getStyle();
      g.fillRect(0, y, W, 2);
    }
    // swirls
    for (let i = 0; i < 60; i++) {
      g.globalAlpha = 0.25;
      g.fillStyle = base.clone().offsetHSL(0, 0.1, r.range(-0.2, 0.2)).getStyle();
      g.beginPath();
      g.ellipse(r.range(0, W), r.range(0, H), r.range(10, 40), r.range(2, 6), 0, 0, Math.PI * 2);
      g.fill();
    }
    g.globalAlpha = 1;
    if (id === 'jupiter') {
      g.fillStyle = '#b4482a';
      g.beginPath(); g.ellipse(W * 0.62, H * 0.64, 34, 16, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#d0704a';
      g.beginPath(); g.ellipse(W * 0.62, H * 0.64, 22, 9, 0, 0, Math.PI * 2); g.fill();
    }
    if (id === 'neptune') {
      g.fillStyle = '#1a2a80';
      g.beginPath(); g.ellipse(W * 0.4, H * 0.4, 26, 12, 0, 0, Math.PI * 2); g.fill();
    }
  } else if (id === 'sun') {
    for (let i = 0; i < 1400; i++) {
      g.fillStyle = mix(0xffd040, 0xff5000, r.next()).getStyle();
      g.globalAlpha = 0.5;
      g.beginPath(); g.arc(r.range(0, W), r.range(0, H), r.range(1, 6), 0, Math.PI * 2); g.fill();
    }
    g.globalAlpha = 1;
  } else if (id === 'earth') {
    g.fillStyle = '#1d5fb8'; g.fillRect(0, 0, W, H);
    g.fillStyle = '#3f8f3a';
    for (let i = 0; i < 14; i++) {
      g.beginPath();
      const cx = r.range(0, W), cy = r.range(40, H - 40);
      for (let k = 0; k < 12; k++) {
        const a = (k / 12) * Math.PI * 2;
        const rr = r.range(15, 45);
        g.lineTo(cx + Math.cos(a) * rr * 1.4, cy + Math.sin(a) * rr);
      }
      g.fill();
    }
    g.fillStyle = 'rgba(255,255,255,0.8)';
    g.fillRect(0, 0, W, 12); g.fillRect(0, H - 12, W, 12);
    g.globalAlpha = 0.45;
    for (let i = 0; i < 40; i++) { g.beginPath(); g.ellipse(r.range(0, W), r.range(0, H), r.range(20, 60), r.range(3, 8), 0, 0, Math.PI * 2); g.fill(); }
    g.globalAlpha = 1;
  } else {
    // rocky / crystal / jungle / metal: noise blobs + craters
    for (let i = 0; i < 500; i++) {
      g.globalAlpha = 0.18;
      g.fillStyle = base.clone().offsetHSL(r.range(-0.03, 0.03), 0, r.range(-0.18, 0.18)).getStyle();
      g.beginPath(); g.arc(r.range(0, W), r.range(0, H), r.range(4, 30), 0, Math.PI * 2); g.fill();
    }
    g.globalAlpha = 1;
    const craters = id === 'mercury' || id === 'asteroids' ? 90 : id === 'mars' ? 30 : 0;
    for (let i = 0; i < craters; i++) {
      const x = r.range(0, W), y = r.range(0, H), rr = r.range(2, 12);
      g.fillStyle = base.clone().offsetHSL(0, 0, -0.15).getStyle();
      g.beginPath(); g.arc(x, y, rr, 0, Math.PI * 2); g.fill();
      g.fillStyle = base.clone().offsetHSL(0, 0, 0.1).getStyle();
      g.beginPath(); g.arc(x - rr * 0.2, y - rr * 0.2, rr * 0.7, 0, Math.PI * 2); g.fill();
    }
    if (world.planet.crystal || world.planet.metal || world.planet.clock) {
      g.strokeStyle = world.planet.metal ? 'rgba(255,220,150,0.5)' : 'rgba(255,255,255,0.45)';
      g.lineWidth = 1.5;
      for (let i = 0; i < 40; i++) {
        g.beginPath();
        let x = r.range(0, W), y = r.range(0, H);
        g.moveTo(x, y);
        for (let k = 0; k < 5; k++) { x += r.range(-30, 30); y += r.range(-20, 20); g.lineTo(x, y); }
        g.stroke();
      }
    }
    if (id === 'mars') { g.fillStyle = 'rgba(255,255,255,0.85)'; g.fillRect(0, 0, W, 8); }
    if (id === 'biolumina') {
      for (let i = 0; i < 120; i++) { g.fillStyle = `rgba(80,255,200,${r.range(0.2, 0.7)})`; g.beginPath(); g.arc(r.range(0, W), r.range(0, H), r.range(1, 3), 0, Math.PI * 2); g.fill(); }
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

export function ringTexture(color = 0xe6d29a) {
  const c = canvas(512, 8);
  const g = c.getContext('2d');
  const r = makeRng(42);
  const col = new THREE.Color(color);
  for (let x = 0; x < 512; x++) {
    const a = (0.25 + 0.75 * r.next()) * (x < 30 ? x / 30 : 1) * (Math.sin(x * 0.07) * 0.3 + 0.7);
    g.fillStyle = `rgba(${Math.round(col.r * 255)},${Math.round(col.g * 255)},${Math.round(col.b * 255)},${a})`;
    g.fillRect(x, 0, 1, 8);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// Simple diagonal stripe texture for warning surfaces / conveyors.
export function stripeTexture(a = '#ffcc00', b = '#222222') {
  const c = canvas(64, 64);
  const g = c.getContext('2d');
  g.fillStyle = b; g.fillRect(0, 0, 64, 64);
  g.fillStyle = a;
  for (let i = -64; i < 128; i += 32) {
    g.beginPath(); g.moveTo(i, 0); g.lineTo(i + 16, 0); g.lineTo(i + 16 + 64, 64); g.lineTo(i + 64, 64); g.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// Window grid for buildings.
export function windowTexture(lit = '#ffe7a0', wall = '#2a3140', seed = 1) {
  const c = canvas(64, 128);
  const g = c.getContext('2d');
  const r = makeRng(seed);
  g.fillStyle = wall; g.fillRect(0, 0, 64, 128);
  for (let y = 4; y < 128; y += 10) for (let x = 4; x < 64; x += 10) {
    g.fillStyle = r.chance(0.55) ? lit : 'rgba(255,255,255,0.08)';
    g.fillRect(x, y, 6, 6);
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
