// Three backdrop variants per world (levels 1-10 / 11-20 / 21-30): same planet,
// different hour, weather and sky. Each variant can override the sky shader,
// re-light the scene and add animated set pieces (moons, comets, volcanoes,
// aerostats, leviathans, orreries, eclipses, hyperloops...).
import * as THREE from 'three';
import { makePlanet } from './planets.js';
import { mat } from './vehicles.js';
import { glowTexture } from './textures.js';
import { flickerMaterial, plasmaMaterial } from './shaders.js';
import { cloudSprite } from './terrain.js';
import { WORLDS } from '../core/config.js';
const WORLD = (id) => WORLDS.find((w) => w.id === id);

const glow = (c, i = 2) => mat(c, { emissive: c, emissiveIntensity: i });
const additive = (c, o = 0.8) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, blending: THREE.AdditiveBlending, depthWrite: false, fog: false });
function put(parent, geo, material, x, y, z) { const m = new THREE.Mesh(geo, material); m.position.set(x, y, z); parent.add(m); return m; }
function glowSpr(color, scale, opacity = 0.8) {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(color), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity, fog: false }));
  s.scale.setScalar(scale);
  return s;
}
const moonWorld = (id) => ({ id, planet: { size: 1 } });
function skyBody(ctx, id, radius, x, y, z, segs = 64) {
  const p = makePlanet(typeof id === 'string' ? moonWorld(id) : id, { segs, fog: false, lite: true });
  p.scale.setScalar(radius);
  p.position.set(x, y, z);
  ctx.sky.add(p);
  ctx.animated.push((t) => p.userData.update(t));
  return p;
}

// ---------------------------------------------------------------- set pieces
const P = {
  // jagged lightning bolts that flash inside the clouds (and flash the sky)
  lightning(ctx, { color = 0xd8e4ff, rate = 1, y0 = 30, y1 = 80, z = -160 } = {}) {
    const bolts = [];
    for (let k = 0; k < 3; k++) {
      const pts = [];
      let x = 0, y = y1;
      while (y > y0) { pts.push(new THREE.Vector3(x, y, 0)); x += ctx.rng.range(-5, 5); y -= ctx.rng.range(3, 7); }
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
      line.position.z = z - k * 30;
      ctx.scen.add(line);
      bolts.push({ line, next: ctx.rng.range(1, 6) / rate, t: -1 });
    }
    ctx.animated.push((t, camX) => {
      let fl = 0;
      for (const b of bolts) {
        if (t > b.next) { b.t = t; b.next = t + ctx.rng.range(2, 7) / rate; b.line.position.x = camX + ctx.rng.range(-60, 60); }
        const age = t - b.t;
        const on = age >= 0 && age < 0.35 ? (Math.sin(age * 60) > -0.3 ? 1 : 0.2) * (1 - age / 0.35) : 0;
        b.line.material.opacity = on;
        fl = Math.max(fl, on);
      }
      if (ctx.skyMat) ctx.skyMat.uniforms.flash.value = fl * 0.45;
    });
  },
  // a comet with a long glowing tail drifting across the sky
  comet(ctx, { color = 0x9ae8ff, x = -200, y = 300, z = -950, dir = 1 } = {}) {
    const g = new THREE.Group();
    g.add(glowSpr(0xffffff, 26, 1));
    g.add(glowSpr(color, 60, 0.6));
    const tailGeo = new THREE.ConeGeometry(14, 260, 24, 1, true);
    tailGeo.translate(0, -130, 0);
    const tail = new THREE.Mesh(tailGeo, new THREE.ShaderMaterial({
      uniforms: { c: { value: new THREE.Color(color) } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false,
      vertexShader: 'varying float vY; void main(){ vY = -position.y / 260.0; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
      fragmentShader: 'uniform vec3 c; varying float vY; void main(){ float a = pow(1.0 - vY, 2.0) * 0.55; gl_FragColor = vec4(c * a, a); }',
    }));
    tail.rotation.z = dir > 0 ? Math.PI / 2 + 0.25 : -Math.PI / 2 - 0.25;
    g.add(tail);
    g.position.set(x, y, z);
    ctx.sky.add(g);
    ctx.animated.push((t) => { g.position.x = x + ((t * 4 * dir) % 900); });
  },
  // giant volcanoes erupting on the horizon: glowing lava streaks + rising smoke
  eruption(ctx, { n = 2, color = 0xff5a10 } = {}) {
    for (let i = 0; i < n; i++) {
      const x = ctx.x0 + ctx.span * (i + 0.5) / n + ctx.rng.range(-30, 30), z = ctx.rng.range(-170, -230), h = ctx.rng.range(55, 85);
      const cone = put(ctx.scen, new THREE.ConeGeometry(h * 0.9, h, 9), mat(0x3a1a10, { roughness: 1, flatShading: true }), x, ctx.fy + h / 2 - 6, z);
      for (let k = 0; k < 5; k++) {
        const lava = put(ctx.scen, new THREE.BoxGeometry(1.4, h * 0.7, 0.6), glow(color, 2.2), x + ctx.rng.range(-h * 0.25, h * 0.25), ctx.fy + h * 0.45, z + h * 0.4);
        lava.rotation.z = ctx.rng.range(-0.45, 0.45);
      }
      const crater = glowSpr(0xff8a30, h * 1.2, 0.9);
      crater.position.set(x, ctx.fy + h - 4, z);
      ctx.scen.add(crater);
      const puffs = [];
      for (let k = 0; k < 10; k++) {
        const c = cloudSprite(k % 2 ? 0x4a3a34 : 0x6a5048, ctx.rng.range(20, 40), 0.75);
        ctx.scen.add(c);
        puffs.push({ c, ph: k / 10 });
      }
      ctx.animated.push((t) => {
        crater.material.opacity = 0.7 + Math.sin(t * 5 + i) * 0.25;
        for (const p of puffs) {
          const u = (t * 0.05 + p.ph) % 1;
          p.c.position.set(x + Math.sin(u * 3 + i) * 12 + u * 40, ctx.fy + h + u * 90, z - 5);
          p.c.material.opacity = 0.8 * (1 - u);
          p.c.scale.setScalar(20 + u * 60);
        }
      });
      cone.castShadow = false;
    }
  },
  // floating cloud cities: domes on balloon clusters with twinkling lights
  aerostats(ctx) {
    const n = Math.max(3, Math.ceil(ctx.span / 90));
    for (let i = 0; i < n; i++) {
      const g = new THREE.Group();
      const s = ctx.rng.range(0.7, 1.4);
      put(g, new THREE.CylinderGeometry(9, 7, 2.4, 20), mat(0xd8d0c0, { metalness: 0.6, roughness: 0.3 }), 0, 0, 0);
      put(g, new THREE.SphereGeometry(8.6, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), mat(0xbfe8ff, { roughness: 0.05, metalness: 0.3, transparent: true, opacity: 0.45 }), 0, 1.2, 0);
      for (let k = 0; k < 5; k++) put(g, new THREE.BoxGeometry(1.4, ctx.rng.range(3, 8), 1.4), mat(0xf0e8d8), ctx.rng.range(-5, 5), 3, ctx.rng.range(-4, 4));
      for (let k = 0; k < 3; k++) {
        const a = (k / 3) * Math.PI * 2;
        put(g, new THREE.SphereGeometry(5.5, 18, 12), mat(0xffe0b0, { roughness: 0.6 }), Math.cos(a) * 7, 16, Math.sin(a) * 7).scale.y = 1.25;
      }
      for (let k = 0; k < 10; k++) { const a = (k / 10) * Math.PI * 2; put(g, new THREE.SphereGeometry(0.35, 6, 4), glow(0xffe8a0, 3), Math.cos(a) * 9, -0.6, Math.sin(a) * 9); }
      g.scale.setScalar(s);
      const x = ctx.x0 + (i + 0.5) * ctx.span / n, y = ctx.fy + ctx.rng.range(28, 60), z = ctx.rng.range(-120, -220);
      g.position.set(x, y, z);
      ctx.scen.add(g);
      const ph = ctx.rng.next() * 6;
      ctx.animated.push((t) => { g.position.y = y + Math.sin(t * 0.3 + ph) * 2; g.rotation.y = t * 0.03; });
    }
  },
  // a wall of dust rolling across the horizon
  stormWall(ctx, color = 0xb06a30) {
    const walls = [];
    for (let i = 0; i < Math.ceil(ctx.span / 18); i++) {
      const c = cloudSprite(i % 2 ? color : 0x8a4a20, ctx.rng.range(60, 110), 0.85);
      const x = ctx.x0 + i * 18, y = ctx.fy + ctx.rng.range(10, 50), z = ctx.rng.range(-150, -200);
      c.position.set(x, y, z);
      ctx.scen.add(c);
      walls.push({ c, x, y, ph: ctx.rng.next() * 6 });
    }
    ctx.animated.push((t) => { for (const w of walls) { w.c.position.x = w.x + Math.sin(t * 0.07 + w.ph) * 14; w.c.position.y = w.y + Math.sin(t * 0.11 + w.ph) * 5; } });
  },
  // glowing magnetic field lines arching over the surface of the sun
  magneticArcs(ctx) {
    spreadAt(ctx, Math.ceil(ctx.span / 14), (x) => {
      const span = ctx.rng.range(20, 60), h = span * ctx.rng.range(0.5, 1.1), z = ctx.rng.range(-50, -220);
      const pts = [];
      for (let i = 0; i <= 24; i++) { const u = i / 24; pts.push(new THREE.Vector3(x + (u - 0.5) * span, ctx.fy + Math.sin(u * Math.PI) * h, z + Math.sin(u * Math.PI) * span * 0.2)); }
      const tube = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 48, ctx.rng.range(0.15, 0.5), 5), additive(ctx.rng.chance(0.5) ? 0xff5ac8 : 0xffa040, 0.55));
      ctx.scen.add(tube);
      const ph = ctx.rng.next() * 6;
      ctx.animated.push((t) => { tube.material.opacity = 0.35 + 0.3 * Math.sin(t * 2 + ph); });
    });
    for (let i = 0; i < 2; i++) {
      // a coronal mass ejection: a vast plasma bubble far away
      const cme = new THREE.Mesh(new THREE.SphereGeometry(140, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), plasmaMaterial(0.5));
      cme.position.set(ctx.x0 + ctx.span * (0.3 + i * 0.4), ctx.fy - 20, -950);
      ctx.scen.add(cme);
      ctx.animated.push((t) => { const k = 0.8 + ((t * 0.04 + i * 0.5) % 1) * 0.6; cme.scale.set(k, k * 0.9, k * 0.5); });
    }
  },
  // glinting ice in permanently shadowed craters
  iceGlints(ctx) {
    spreadAt(ctx, Math.ceil(ctx.span / 8), (x) => {
      const m = put(ctx.scen, new THREE.CircleGeometry(ctx.rng.range(1.5, 5), 12), mat(0x9ad8ff, { emissive: 0x3a8aff, emissiveIntensity: 0.9, roughness: 0.05, metalness: 0.3 }), x, ctx.fy + 0.05, ctx.rng.range(-14, -60));
      m.rotation.x = -Math.PI / 2;
      const ph = ctx.rng.next() * 6;
      ctx.animated.push((t) => { m.material.emissiveIntensity = 0.6 + Math.max(0, Math.sin(t * 1.5 + ph)) * 0.9; });
    });
  },
  // a crater rim of mountains ringing the horizon
  craterRim(ctx, color = 0x6a645c) {
    spreadAt(ctx, Math.ceil(ctx.span / 12), (x) => {
      const h = ctx.rng.range(25, 70);
      const m = put(ctx.scen, new THREE.ConeGeometry(h * 0.9, h, 6), mat(color, { roughness: 1, flatShading: true }), x, ctx.fy + h / 2 - 3, ctx.rng.range(-200, -260));
      m.rotation.y = ctx.rng.next() * 3;
    });
  },
  // searchlights sweeping a night sky
  searchlights(ctx, colors = [0xbfd8ff, 0xffe0a0]) {
    for (let i = 0; i < 4; i++) {
      const geo = new THREE.ConeGeometry(6, 160, 16, 1, true); geo.translate(0, 80, 0);
      const beam = new THREE.Mesh(geo, new THREE.ShaderMaterial({
        uniforms: { c: { value: new THREE.Color(colors[i % colors.length]) } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false,
        vertexShader: 'varying float vY; void main(){ vY = position.y / 160.0; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
        fragmentShader: 'uniform vec3 c; varying float vY; void main(){ float a = (1.0 - vY) * 0.16; gl_FragColor = vec4(c * a, a); }',
      }));
      const x = ctx.x0 + ctx.span * (i + 0.5) / 4;
      beam.position.set(x, ctx.fy, -140);
      ctx.scen.add(beam);
      ctx.animated.push((t) => { beam.rotation.z = Math.sin(t * 0.3 + i * 1.7) * 0.5; beam.position.x = x; });
    }
  },
  // fireworks popping over the skyline
  fireworks(ctx) {
    const bursts = [];
    for (let i = 0; i < 4; i++) {
      const pts = new Float32Array(60 * 3);
      const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pts, 3));
      const m = new THREE.Points(geo, new THREE.PointsMaterial({ color: [0xff5a8a, 0x5ad0ff, 0xffe05a, 0x7aff8a][i], size: 3, sizeAttenuation: false, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
      m.frustumCulled = false;
      ctx.scen.add(m);
      const dirs = Array.from({ length: 60 }, () => { const a = ctx.rng.next() * 6.28, b = ctx.rng.next() * 3.14; return [Math.cos(a) * Math.sin(b), Math.cos(b), Math.sin(a) * Math.sin(b)]; });
      bursts.push({ m, dirs, t0: i * 1.7, cx: 0, cy: 0 });
    }
    ctx.animated.push((t, camX) => {
      for (const b of bursts) {
        const u = ((t - b.t0) % 6) / 6 * 3;
        if (u < 0.05) { b.cx = camX + ctx.rng.range(-50, 50); b.cy = ctx.fy + ctx.rng.range(40, 70); }
        const a = b.m.geometry.attributes.position;
        const r = Math.min(1, u) * 14;
        for (let k = 0; k < 60; k++) a.setXYZ(k, b.cx + b.dirs[k][0] * r, b.cy + b.dirs[k][1] * r - u * u * 2, -150 + b.dirs[k][2] * r);
        a.needsUpdate = true;
        b.m.material.opacity = u < 1.6 ? 1 - u / 1.6 : 0;
      }
    });
  },
  // mining rigs bolted to big asteroids: lit decks and a drill beam
  miningRigs(ctx) {
    spreadAt(ctx, Math.ceil(ctx.span / 70), (x) => {
      const g = new THREE.Group();
      const rock = put(g, new THREE.DodecahedronGeometry(14, 1), mat(0x5a4e44, { roughness: 1, flatShading: true }), 0, 0, 0);
      rock.scale.set(1.3, 0.8, 1);
      put(g, new THREE.BoxGeometry(14, 1.2, 8), mat(0x8a9098, { metalness: 0.8, roughness: 0.4 }), 0, 11, 0);
      put(g, new THREE.BoxGeometry(3, 10, 3), mat(0x6a7078, { metalness: 0.8 }), -4, 16, 0);
      for (let k = 0; k < 6; k++) put(g, new THREE.SphereGeometry(0.4, 6, 4), glow(k % 2 ? 0xff5a3a : 0xfff0a0, 3), -6 + k * 2.4, 11.8, 4);
      const beam = put(g, new THREE.CylinderGeometry(0.6, 0.6, 30, 8, 1, true), additive(0x5affd8, 0.5), 6, -10, 0);
      g.position.set(x, ctx.fy + ctx.rng.range(20, 50), ctx.rng.range(-110, -190));
      ctx.scen.add(g);
      const sp = ctx.rng.range(-0.05, 0.05);
      ctx.animated.push((t) => { g.rotation.y = t * sp; beam.material.opacity = 0.3 + Math.abs(Math.sin(t * 6)) * 0.4; });
    });
    for (let i = 0; i < 5; i++) {
      const d = put(ctx.scen, new THREE.BoxGeometry(3, 1, 1.4), mat(0xd8dce4, { metalness: 0.6 }), 0, 0, 0);
      const l = glowSpr(0xff8a40, 4, 0.9); d.add(l); l.position.x = -2;
      const y = ctx.fy + ctx.rng.range(25, 60), z = ctx.rng.range(-80, -160), sp = ctx.rng.range(6, 14), off = ctx.rng.range(0, ctx.span);
      ctx.animated.push((t) => { d.position.set(ctx.x0 + ((off + t * sp) % ctx.span), y, z); });
    }
  },
  icyRocks(ctx) {
    spreadAt(ctx, Math.ceil(ctx.span / 9), (x) => {
      const s = ctx.rng.range(1.5, 6);
      const m = put(ctx.scen, new THREE.DodecahedronGeometry(s, 0), mat(0xbfe8ff, { roughness: 0.15, metalness: 0.2, emissive: 0x1a4a6a, emissiveIntensity: 0.6, flatShading: true }), x, ctx.rng.range(ctx.fy - 5, 45), ctx.rng.range(-20, -200));
      const sp = ctx.rng.range(-0.4, 0.4);
      ctx.animated.push((t) => { m.rotation.set(t * sp, t * sp * 0.6, 0); });
    });
  },
  // plumes of nitrogen / water ice shooting into the sky
  geysers(ctx, color = 0xe8f0ff) {
    const m = flickerMaterial(color);
    spreadAt(ctx, Math.ceil(ctx.span / 45), (x) => {
      const h = ctx.rng.range(50, 110);
      const g = put(ctx.scen, new THREE.CylinderGeometry(h * 0.12, 1.2, h, 12, 1, true), m, x, ctx.fy + h / 2, ctx.rng.range(-120, -200));
      const ph = ctx.rng.next() * 6;
      ctx.animated.push((t) => { g.scale.y = 0.7 + Math.abs(Math.sin(t * 0.4 + ph)) * 0.4; g.position.y = ctx.fy + h * g.scale.y / 2; });
    });
  },
  // sweeping rainbow searchlights and tall prism towers
  spectrum(ctx) {
    spreadAt(ctx, Math.ceil(ctx.span / 35), (x) => {
      const h = ctx.rng.range(40, 90);
      const tw = put(ctx.scen, new THREE.CylinderGeometry(0.1, 5, h, 3), mat(0xe8d8ff, { roughness: 0.02, metalness: 0.4, transparent: true, opacity: 0.75, emissive: 0x4a2a8a, emissiveIntensity: 0.6 }), x, ctx.fy + h / 2, ctx.rng.range(-90, -180));
      const geo = new THREE.ConeGeometry(4, 180, 12, 1, true); geo.translate(0, 90, 0);
      const beam = new THREE.Mesh(geo, new THREE.ShaderMaterial({
        uniforms: { t: { value: 0 }, ph: { value: ctx.rng.next() } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false,
        vertexShader: 'varying float vY; varying float vA; void main(){ vY = position.y / 180.0; vA = atan(position.x, position.z); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
        fragmentShader: 'uniform float t, ph; varying float vY; varying float vA; void main(){ vec3 c = 0.5 + 0.5 * cos(6.2831 * (vY * 1.5 + ph + t * 0.1 + vec3(0.0, 0.33, 0.67))); float a = (1.0 - vY) * 0.22; gl_FragColor = vec4(c * a, a); }',
      }));
      beam.position.set(x, ctx.fy + h, tw.position.z);
      ctx.scen.add(beam);
      const ph = ctx.rng.next() * 6;
      ctx.animated.push((t) => { beam.material.uniforms.t.value = t; beam.rotation.z = Math.sin(t * 0.25 + ph) * 0.6; beam.rotation.x = Math.cos(t * 0.2 + ph) * 0.3; });
    });
  },
  // a shattered crystal moon: big glowing shards orbiting a cracked core
  shardMoon(ctx) {
    const g = new THREE.Group();
    put(g, new THREE.IcosahedronGeometry(50, 0), mat(0x8a5ae0, { roughness: 0.1, metalness: 0.5, emissive: 0x3a1a8a, emissiveIntensity: 0.7, flatShading: true }), 0, 0, 0);
    g.add(glowSpr(0xc08aff, 260, 0.5));
    const shards = [];
    for (let i = 0; i < 26; i++) {
      const s = ctx.rng.range(6, 22);
      const m = put(g, new THREE.OctahedronGeometry(s, 0), mat([0xff9af0, 0x9ad8ff, 0xc8a8ff][i % 3], { roughness: 0.05, metalness: 0.4, emissive: 0x4a2a8a, emissiveIntensity: 0.5, flatShading: true }), 0, 0, 0);
      m.scale.y = ctx.rng.range(1.4, 2.6);
      shards.push({ m, r: ctx.rng.range(70, 150), a: ctx.rng.next() * 6.28, y: ctx.rng.range(-40, 40), sp: ctx.rng.range(0.02, 0.06) });
    }
    g.position.set(-200, 190, -1000);
    ctx.sky.add(g);
    ctx.animated.push((t) => { for (const s of shards) { const a = s.a + t * s.sp; s.m.position.set(Math.cos(a) * s.r, s.y + Math.sin(a * 2) * 6, Math.sin(a) * s.r * 0.4); s.m.rotation.set(t * s.sp * 4, t * s.sp * 3, 0); } });
  },
  // rivers of molten brass, smokestacks breathing fire
  furnace(ctx) {
    spreadAt(ctx, Math.ceil(ctx.span / 40), (x) => {
      const r = put(ctx.scen, new THREE.PlaneGeometry(ctx.rng.range(20, 40), 3), mat(0xff6a10, { emissive: 0xff4a00, emissiveIntensity: 2.2 }), x, ctx.fy + 0.06, ctx.rng.range(-20, -60));
      r.rotation.x = -Math.PI / 2;
      const ph = ctx.rng.next() * 6;
      ctx.animated.push((t) => { r.material.emissiveIntensity = 1.8 + Math.sin(t * 3 + ph) * 0.5; });
    });
    const fire = flickerMaterial(0xff7a20);
    spreadAt(ctx, Math.ceil(ctx.span / 28), (x) => {
      const h = ctx.rng.range(40, 80), z = ctx.rng.range(-70, -150);
      put(ctx.scen, new THREE.CylinderGeometry(3, 4, h, 12), mat(0x3a2a1a, { metalness: 0.7, roughness: 0.5 }), x, ctx.fy + h / 2, z);
      put(ctx.scen, new THREE.TorusGeometry(3.4, 0.5, 6, 16), mat(0xb08850, { metalness: 0.9 }), x, ctx.fy + h * 0.7, z).rotation.x = Math.PI / 2;
      const f = put(ctx.scen, new THREE.ConeGeometry(2.6, 14, 8, 1, true), fire, x, ctx.fy + h + 6, z);
      const ph = ctx.rng.next() * 6;
      ctx.animated.push((t) => { f.scale.y = 0.6 + Math.abs(Math.sin(t * 4 + ph)) * 0.8; });
    });
  },
  // a planetary orrery the size of the sky
  orrery(ctx) {
    const g = new THREE.Group();
    const brass = mat(0xd0a050, { metalness: 0.95, roughness: 0.25 });
    put(g, new THREE.SphereGeometry(28, 32, 20), glow(0xffc060, 1.4), 0, 0, 0);
    g.add(glowSpr(0xffb040, 220, 0.6));
    const arms = [];
    for (let i = 0; i < 5; i++) {
      const r = 60 + i * 38;
      const ring = put(g, new THREE.TorusGeometry(r, 1.2, 6, 96), brass, 0, 0, 0);
      ring.rotation.x = Math.PI / 2 + (i - 2) * 0.12;
      const arm = new THREE.Group(); g.add(arm);
      put(arm, new THREE.BoxGeometry(r, 1.5, 1.5), brass, r / 2, 0, 0);
      put(arm, new THREE.SphereGeometry(8 + (i % 3) * 4, 20, 14), mat([0x8ad0ff, 0xff8a5a, 0xd8c070, 0x9aff8a, 0xc08aff][i], { metalness: 0.5, roughness: 0.4 }), r, 0, 0);
      arm.rotation.x = (i - 2) * 0.12;
      arms.push({ arm, sp: 0.25 / (i + 1) });
    }
    g.position.set(120, 120, -1050);
    g.rotation.x = 0.35;
    ctx.sky.add(g);
    ctx.animated.push((t) => { for (const a of arms) a.arm.rotation.y = t * a.sp; });
  },
  // towering glowing flowers and a drifting haze of spores
  bloom(ctx) {
    spreadAt(ctx, Math.ceil(ctx.span / 22), (x) => {
      const h = ctx.rng.range(18, 45), z = ctx.rng.range(-50, -130);
      put(ctx.scen, new THREE.CylinderGeometry(0.6, 1.4, h, 8), mat(0x1a5a3a), x, ctx.fy + h / 2, z);
      const head = new THREE.Group(); head.position.set(x, ctx.fy + h, z); ctx.scen.add(head);
      const c = [0xff5ad0, 0x5ad0ff, 0xffd05a, 0xb05aff][ctx.rng.int(0, 3)];
      for (let k = 0; k < 7; k++) { const p = put(head, new THREE.SphereGeometry(3.5, 12, 8), mat(c, { emissive: c, emissiveIntensity: 0.9, roughness: 0.5 }), Math.cos(k * 0.9) * 4, 0, Math.sin(k * 0.9) * 4); p.scale.set(1.3, 0.35, 0.8); p.rotation.y = -k * 0.9; }
      put(head, new THREE.SphereGeometry(2, 12, 8), glow(0xfff0a0, 2), 0, 0.5, 0);
      const ph = ctx.rng.next() * 6;
      ctx.animated.push((t) => { head.rotation.y = t * 0.2 + ph; head.rotation.z = Math.sin(t * 0.6 + ph) * 0.1; });
    });
    const N = 500, pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) pos.set([ctx.x0 + ctx.rng.next() * ctx.span, ctx.fy + ctx.rng.range(0, 60), ctx.rng.range(-10, -120)], i * 3);
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const spores = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xff9ae8, size: 2.6, sizeAttenuation: false, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false }));
    ctx.scen.add(spores);
    ctx.animated.push((t) => { spores.position.y = Math.sin(t * 0.2) * 3; spores.position.x = Math.sin(t * 0.1) * 6; });
  },
  // vast glowing jellyfish drifting through the sky
  leviathans(ctx) {
    for (let i = 0; i < Math.max(3, Math.ceil(ctx.span / 80)); i++) {
      const g = new THREE.Group();
      const c = [0x5affd8, 0xff7ae8, 0x7ab0ff][i % 3];
      const bell = put(g, new THREE.SphereGeometry(10, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), mat(c, { emissive: c, emissiveIntensity: 0.6, transparent: true, opacity: 0.55, roughness: 0.2, side: THREE.DoubleSide }), 0, 0, 0);
      bell.scale.y = 0.75;
      g.add(glowSpr(c, 50, 0.4));
      const tent = [];
      for (let k = 0; k < 8; k++) {
        const pts = []; const a = (k / 8) * Math.PI * 2;
        for (let j = 0; j <= 10; j++) pts.push(new THREE.Vector3(Math.cos(a) * 6, -j * 3, Math.sin(a) * 6));
        const tl = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: c, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending }));
        g.add(tl); tent.push(tl);
      }
      const x = ctx.x0 + (i + 0.5) * ctx.span / Math.max(3, Math.ceil(ctx.span / 80)), y = ctx.fy + ctx.rng.range(40, 75), z = ctx.rng.range(-110, -200);
      g.position.set(x, y, z);
      g.scale.setScalar(ctx.rng.range(0.8, 1.6));
      ctx.scen.add(g);
      const ph = ctx.rng.next() * 6;
      ctx.animated.push((t) => {
        const pulse = Math.sin(t * 1.2 + ph);
        bell.scale.set(1 + pulse * 0.08, 0.75 - pulse * 0.08, 1 + pulse * 0.08);
        g.position.set(x + Math.sin(t * 0.05 + ph) * 20, y + Math.sin(t * 0.3 + ph) * 4, z);
        tent.forEach((tl, k) => { tl.rotation.x = Math.sin(t * 1.2 + ph + k) * 0.15; tl.rotation.z = Math.cos(t + k) * 0.1; });
      });
    }
  },
  // broken clock faces tumbling and sand falling *up*
  shatteredClocks(ctx) {
    const gold = mat(0xd8b060, { metalness: 0.9, roughness: 0.25, emissive: 0x3a2a08 });
    spreadAt(ctx, Math.ceil(ctx.span / 20), (x) => {
      const g = new THREE.Group();
      const r = ctx.rng.range(4, 10), start = ctx.rng.next() * 6, len = ctx.rng.range(1.5, 4.5);
      put(g, new THREE.CircleGeometry(r, 32, start, len), mat(0xf4ecd8, { side: THREE.DoubleSide, emissive: 0x2a2010 }), 0, 0, 0);
      put(g, new THREE.TorusGeometry(r, 0.3, 6, 32, len), gold, 0, 0, 0.1).rotation.z = start;
      const hand = put(g, new THREE.BoxGeometry(0.25, r * 0.8, 0.2), mat(0x2a1a10), 0, r * 0.35, 0.3);
      hand.geometry.translate(0, 0, 0);
      g.position.set(x, ctx.fy + ctx.rng.range(10, 50), ctx.rng.range(-50, -170));
      ctx.scen.add(g);
      const sp = new THREE.Vector3(ctx.rng.range(-0.2, 0.2), ctx.rng.range(-0.3, 0.3), ctx.rng.range(-0.15, 0.15));
      ctx.animated.push((t) => { g.rotation.set(t * sp.x, t * sp.y, t * sp.z); hand.rotation.z = -t * 2; });
    });
    const N = 400, pos = new Float32Array(N * 3), base = [];
    for (let i = 0; i < N; i++) { const p = [ctx.x0 + ctx.rng.next() * ctx.span, ctx.fy + ctx.rng.range(0, 70), ctx.rng.range(-10, -100)]; base.push(p); pos.set(p, i * 3); }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const sand = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xffd880, size: 2, sizeAttenuation: false, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false }));
    sand.frustumCulled = false;
    ctx.scen.add(sand);
    ctx.animated.push((t) => { const a = sand.geometry.attributes.position; for (let i = 0; i < N; i++) a.setY(i, ctx.fy + ((base[i][1] - ctx.fy + t * 3) % 70)); a.needsUpdate = true; });
  },
  // a total eclipse framed by a colossal clock face
  eclipse(ctx) {
    const g = new THREE.Group();
    put(g, new THREE.CircleGeometry(90, 64), new THREE.MeshBasicMaterial({ color: 0x000000, fog: false }), 0, 0, 1);
    g.add(glowSpr(0xffd060, 420, 0.85));
    const corona = put(g, new THREE.RingGeometry(92, 150, 96), new THREE.ShaderMaterial({
      uniforms: { t: { value: 0 } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false,
      vertexShader: 'varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
      fragmentShader: 'uniform float t; varying vec2 vP; void main(){ float r = length(vP), a = atan(vP.y, vP.x); float k = (r - 92.0) / 58.0; float s = 0.5 + 0.5 * sin(a * 24.0 + sin(a * 7.0 + t * 0.3) * 3.0); float al = pow(1.0 - k, 2.0) * (0.4 + 0.6 * s); gl_FragColor = vec4(vec3(1.0, 0.85, 0.5) * al * 1.4, al); }',
    }), 0, 0, 0);
    const dial = new THREE.Group(); g.add(dial);
    const gold = mat(0xe8c070, { metalness: 0.9, roughness: 0.2, emissive: 0x4a3008 });
    put(dial, new THREE.TorusGeometry(230, 2.5, 6, 128), gold, 0, 0, -5);
    for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; const tk = put(dial, new THREE.BoxGeometry(4, i % 3 ? 18 : 34, 2), gold, Math.cos(a) * 210, Math.sin(a) * 210, -5); tk.rotation.z = a - Math.PI / 2; }
    const hand = put(dial, new THREE.BoxGeometry(5, 190, 2), gold, 0, 95, -4); hand.geometry.translate(0, 0, 0);
    const handPivot = new THREE.Group(); dial.add(handPivot); dial.remove(hand); handPivot.add(hand);
    g.position.set(60, 170, -1100);
    ctx.sky.add(g);
    ctx.animated.push((t) => { corona.material.uniforms.t.value = t; handPivot.rotation.z = -t * 0.05; dial.rotation.z = Math.sin(t * 0.05) * 0.02; });
  },
  // kites and flocks of birds in the evening wind
  kites(ctx) {
    for (let i = 0; i < 6; i++) {
      const c = [0xff5a8a, 0x5ad0ff, 0xffd05a][i % 3];
      const k = put(ctx.scen, new THREE.OctahedronGeometry(2.2, 0), mat(c, { flatShading: true, side: THREE.DoubleSide }), 0, 0, 0);
      k.scale.set(1, 1.4, 0.15);
      const tail = new THREE.Line(new THREE.BufferGeometry().setFromPoints(Array.from({ length: 8 }, (_, j) => new THREE.Vector3(-j * 1.2, -2 - j * 1.4, 0))), new THREE.LineBasicMaterial({ color: c }));
      k.add(tail);
      const x = ctx.x0 + ctx.rng.next() * ctx.span, y = ctx.fy + ctx.rng.range(25, 50), z = ctx.rng.range(-40, -110), ph = ctx.rng.next() * 6;
      ctx.animated.push((t) => { k.position.set(x + Math.sin(t * 0.3 + ph) * 8, y + Math.sin(t * 0.9 + ph) * 3, z); k.rotation.z = Math.sin(t * 1.3 + ph) * 0.3; });
    }
    for (let f = 0; f < 3; f++) {
      const flock = new THREE.Group();
      for (let b = 0; b < 9; b++) {
        const bird = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-1, 0.4, 0), new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0.4, 0)]), new THREE.LineBasicMaterial({ color: 0x3a2a3a }));
        bird.position.set(-b * 2.2, -Math.abs(b - 4) * 1.4 + (b % 2) * 0.6, 0);
        flock.add(bird);
      }
      const y = ctx.fy + ctx.rng.range(35, 60), z = ctx.rng.range(-80, -160), sp = ctx.rng.range(5, 9), off = ctx.rng.range(0, ctx.span);
      ctx.scen.add(flock);
      ctx.animated.push((t) => { flock.position.set(ctx.x0 + ((off + t * sp) % ctx.span), y + Math.sin(t * 0.5 + f) * 2, z); flock.children.forEach((b, i) => { b.scale.y = Math.sin(t * 8 + i) > 0 ? 1 : -0.6; }); });
    }
  },
  rainbow(ctx) {
    const arc = new THREE.Mesh(new THREE.TorusGeometry(380, 14, 8, 96, Math.PI), new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false,
      vertexShader: 'varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
      fragmentShader: 'varying vec3 vP; void main(){ float r = (length(vP.xy) - 366.0) / 28.0; vec3 c = 0.5 + 0.5 * cos(6.2831 * (r + vec3(0.0, 0.33, 0.67))); gl_FragColor = vec4(c * 0.35, 0.35); }',
    }));
    arc.position.set(0, -60, -1000);
    ctx.sky.add(arc);
  },
  windmills(ctx) {
    spreadAt(ctx, Math.ceil(ctx.span / 50), (x) => {
      const z = ctx.rng.range(-50, -120), h = ctx.rng.range(14, 24), y = ctx.fy + ctx.rng.range(8, 30);
      put(ctx.scen, new THREE.CylinderGeometry(0.6, 1, h, 8), mat(0xf4f0f8), x, y + h / 2, z);
      const rotor = new THREE.Group(); rotor.position.set(x, y + h, z + 1); ctx.scen.add(rotor);
      for (let k = 0; k < 3; k++) { const b = put(rotor, new THREE.BoxGeometry(0.8, 9, 0.2), mat(0xffffff), 0, 4.5, 0); b.geometry.translate(0, 0, 0); const piv = new THREE.Group(); piv.rotation.z = (k / 3) * Math.PI * 2; rotor.add(piv); rotor.remove(b); piv.add(b); }
      const sp = ctx.rng.range(0.8, 1.6);
      ctx.animated.push((t) => { rotor.rotation.z = t * sp; });
    });
  },
  // a synthwave sunset: striped sun + neon wireframe mountains
  synthSun(ctx) {
    const sun = new THREE.Mesh(new THREE.CircleGeometry(170, 64), new THREE.ShaderMaterial({
      uniforms: { t: { value: 0 } }, transparent: true, depthWrite: false, fog: false,
      vertexShader: 'varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
      fragmentShader: 'uniform float t; varying vec2 vP; void main(){ float y = vP.y / 170.0; vec3 c = mix(vec3(1.0, 0.15, 0.55), vec3(1.0, 0.85, 0.2), y * 0.5 + 0.5); float stripe = y < 0.1 ? step(0.5, fract(y * 9.0 - t * 0.2 + y * y * 6.0)) : 1.0; gl_FragColor = vec4(c * 1.6, stripe); }',
    }));
    sun.position.set(0, 90, -1150);
    ctx.sky.add(sun);
    const halo = glowSpr(0xff3ad8, 620, 0.55); halo.position.copy(sun.position); ctx.sky.add(halo);
    ctx.animated.push((t) => { sun.material.uniforms.t.value = t; });
    for (let row = 0; row < 2; row++) {
      const w = 1600, segs = 40;
      const geo = new THREE.PlaneGeometry(w, 260, segs, 8);
      const p = geo.attributes.position;
      for (let i = 0; i < p.count; i++) {
        const x = p.getX(i), y = p.getY(i);
        const ridge = Math.max(0, Math.sin(x * 0.008 + row) * 0.5 + Math.sin(x * 0.021 + row * 2) * 0.35 + 0.5);
        p.setZ(i, 0); p.setY(i, y < 0 ? y : y * ridge * (1 - Math.abs(x) / w));
      }
      const mtn = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: row ? 0x3ad8ff : 0xff3ad8, wireframe: true, transparent: true, opacity: 0.55, fog: false }));
      mtn.position.set(0, -20 - row * 10, -1000 + row * 60);
      ctx.sky.add(mtn);
    }
  },
  // glass tubes with pods screaming through them
  hyperloop(ctx) {
    for (let k = 0; k < 3; k++) {
      const y = ctx.fy + 14 + k * 14, z = -60 - k * 35;
      const tube = put(ctx.scen, new THREE.CylinderGeometry(2.2, 2.2, ctx.span + 200, 16, 1, true), mat(0x9ad8ff, { transparent: true, opacity: 0.18, roughness: 0.05, metalness: 0.3, side: THREE.DoubleSide, emissive: 0x1a2a6a }), ctx.x0 + ctx.span / 2, y, z);
      tube.rotation.z = Math.PI / 2;
      for (const s of [-1, 1]) { const l = put(ctx.scen, new THREE.BoxGeometry(ctx.span + 200, 0.12, 0.12), glow(k % 2 ? 0x3ad8ff : 0xff3ad8, 2.5), ctx.x0 + ctx.span / 2, y + s * 2.2, z); l.castShadow = false; }
      for (let i = 0; i < 2; i++) {
        const pod = put(ctx.scen, new THREE.CapsuleGeometry(1.5, 6, 6, 12), mat(0xf4f6fa, { metalness: 0.6, roughness: 0.2, emissive: 0x2a3a6a }), 0, y, z);
        pod.rotation.z = Math.PI / 2;
        const trail = glowSpr(k % 2 ? 0x3ad8ff : 0xff3ad8, 14, 0.8); pod.add(trail); trail.position.y = -6;
        const sp = (60 + k * 25) * (k % 2 ? -1 : 1), off = i * ctx.span / 2;
        ctx.animated.push((t) => { pod.position.x = ctx.x0 + ((((off + t * sp) % ctx.span) + ctx.span) % ctx.span); });
      }
    }
  },
};

function spreadAt(ctx, n, fn) { for (let i = 0; i < n; i++) fn(ctx.x0 + (i + ctx.rng.next() * 0.8) * (ctx.span / n), i); }

// ---------------------------------------------------------------- the variants
// name · sky overrides · lighting overrides · set pieces
export const VARIANTS = {
  sun: [
    { name: 'Photosphere' },
    { name: 'Coronal Storm', sky: { top: 0x0a0004, horizon: 0x9a1a40, ground: 0xa02010, corona: 1.1, rays: 0.5, rayColor: 0xff7ab0, sunSize: 0.0001, sunHalo: 0 }, floor: { tint: 0xff3a7a, tintMix: 0.55 }, light: { light: 0xffa0b8, fog: 0x7a1a30 }, extras: (c) => P.magneticArcs(c) },
    { name: 'Sunspot Abyss', sky: { top: 0x000000, horizon: 0x5a1802, corona: 0.5, vortex: 1.1, vortexDir: [0.15, 0.22, -1], vortexCol: 0x0c0100, vortexSize: 0.5 }, floor: { spots: 0.34, tint: 0xd8380a, tintMix: 0.6 }, light: { light: 0xffc090, sunI: 1.2, fog: 0x3a0a02, fogDensity: 0.006 } },
  ],
  mercury: [
    { name: 'Dawn Terminator', sky: { sunDir: [-0.4, 0.12, -1], sunSize: 0.15, sunHalo: 2.2, rays: 0.35 } },
    { name: 'Caloris Basin', sky: { horizon: 0x3a2414, sunDir: [0.5, 0.12, -1], sunSize: 0.12, sunColor: 0xffe8c8, sunHalo: 1.8 }, floor: { color: 0xb8a88a }, light: { light: 0xffe0c0, fog: 0x1a120c }, extras: (c) => { P.craterRim(c); skyBody(c, WORLD('venus'), 12, -260, 170, -950); skyBody(c, WORLD('earth'), 9, 300, 200, -950); } },
    { name: 'Polar Night', sky: { top: 0x000005, horizon: 0x080a14, stars: 1.7, neb: 0.8, nebA: 0x2040a0, nebB: 0x6040a0, sunSize: 0.0001, sunHalo: 0 }, floor: { color: 0x4a5a78 }, light: { light: 0x9ab0ff, sunI: 1.2, hemiI: 0.6, fog: 0x05060c }, extras: (c) => { P.iceGlints(c); P.comet(c, { x: -300, y: 190 }); } },
  ],
  venus: [
    { name: 'Sulfur Skies' },
    { name: 'Maat Mons', sky: { top: 0x2a0804, horizon: 0xc04a20, clouds: 0.7, cloudColor: 0x803018, flashColor: 0xffd0a0 }, floor: { a: 0x2a0804, b: 0xd84a10, sky: 0x8a2a10 }, light: { light: 0xffa070, fog: 0x8a2a10, under: [0xff4a10, 0.7] }, extras: (c) => { P.eruption(c, { n: 3 }); P.lightning(c, { color: 0xffe0b0, rate: 0.7 }); } },
    { name: 'Cloud Cities', sky: { top: 0x4a2a10, horizon: 0xffd890, clouds: 0.95, cloudColor: 0xffe0a8, sunSize: 0.05, sunHalo: 1.6, rays: 0.4 }, floor: { a: 0x8a6a2a, b: 0xffe8a8, sky: 0xfff0c8 }, light: { light: 0xffe0a8, fog: 0xe8c890 }, extras: (c) => P.aerostats(c) },
  ],
  earth: [
    { name: 'Daylight' },
    { name: 'Golden Hour', sky: { top: 0x2a3a8a, horizon: 0xff9a5a, cloudColor: 0xffb090, sunDir: [0.6, 0.06, -1], sunSize: 0.04, sunColor: 0xffb070, sunHalo: 2.2, rays: 0.35 }, floor: { color: 0x4a3a3a }, light: { light: 0xffbe90, fog: 0xe0a07a, sunI: 1.7 } },
    { name: 'City Nights', sky: { top: 0x020614, horizon: 0x1a2a50, clouds: 0.25, cloudColor: 0x2a3550, stars: 1.0, sunSize: 0.0001, sunHalo: 0 }, floor: { color: 0x14181f, rough: 0.35, metal: 0.4 }, light: { light: 0x9ab0ff, sunI: 1.0, hemiI: 0.6, fog: 0x0a1226, fogDensity: 0.0055, windows: 2.4 }, extras: (c) => { skyBody(c, 'moon', 42, 300, 190, -950); P.searchlights(c); P.fireworks(c); } },
  ],
  mars: [
    { name: 'Red Canyons' },
    { name: 'Blue Sunset', sky: { top: 0x140c1c, horizon: 0x7aa0d0, ground: 0x8a5a40, sunDir: [0.3, 0.05, -1], sunSize: 0.012, sunColor: 0xd8f0ff, sunHalo: 2.6, clouds: 0.2, cloudColor: 0x8a90b0, stars: 0.6 }, floor: { a: 0x8a1a30, b: 0xff7a5a }, light: { light: 0xc8d0ff, fog: 0x4a5070, sunI: 1.5 }, extras: (c) => { skyBody(c, 'phobos', 34, 260, 180, -950); skyBody(c, 'phobos', 16, -300, 230, -1000, 48); } },
    { name: 'Global Dust Storm', sky: { top: 0x5a2a10, horizon: 0xd08040, clouds: 0.9, cloudColor: 0xb06a30, sunSize: 0.02, sunHalo: 0.4 }, floor: { a: 0x5a2a14, b: 0xb06a38 }, light: { fogDensity: 0.02, light: 0xffc090, fog: 0xc8844a, sunI: 1.4 }, extras: (c) => P.stormWall(c) },
  ],
  asteroids: [
    { name: 'The Drift' },
    { name: 'Mining Colony', sky: { nebA: 0x6a2a10, nebB: 0x1a5a8a, neb: 1.0 }, light: { light: 0xffe0c0, fog: 0x140a06 }, extras: (c) => P.miningRigs(c) },
    { name: 'Comet Pass', sky: { neb: 1.2, nebA: 0x1a6ab0, nebB: 0x40e0ff, stars: 1.5 }, light: { light: 0xc0e8ff, fog: 0x061420 }, extras: (c) => { P.comet(c, { x: -380, y: 180, color: 0x7af0ff }); P.icyRocks(c); } },
  ],
  jupiter: [
    { name: 'Cloud Tops' },
    { name: 'Io Rising', sky: { aurora: 0.8, top: 0x1a0e08, horizon: 0xe8b070 }, floor: { cols: [0xd8a060, 0xf4d8a8, 0xffe8b0] }, light: { fog: 0xe0a868, light: 0xfff0c8 }, extras: (c) => skyBody(c, 'io', 70, 240, 170, -950, 80) },
    { name: 'Storm Deep', sky: { top: 0x1a0a06, horizon: 0xa05a30, clouds: 0.8, cloudColor: 0x8a4a2a, vortex: 0.9, vortexDir: [-0.3, 0.22, -1], vortexCol: 0x8a2a14, vortexSize: 0.45, flashColor: 0xffe0c0 }, floor: { cols: [0x6a2a14, 0xa85a30, 0xc8845a] }, light: { light: 0xffb090, fog: 0x8a4a28, fogDensity: 0.008 }, extras: (c) => P.lightning(c, { color: 0xfff0d8 }) },
  ],
  saturn: [
    { name: 'Ring Plane', sky: { ringArc: 1.1, top: 0x101830, horizon: 0xe8e0c8 }, floor: { cols: [0xc8b890, 0xf0e6cc, 0xffffff] }, light: { fog: 0xd8d4c8 } },
    { name: 'Titan Haze', sky: { top: 0x4a2a08, horizon: 0xe0a050, clouds: 0.6, cloudColor: 0xd09040 }, floor: { cols: [0xc07a20, 0xe0a050, 0xffc878] }, light: { fog: 0xc08a40, light: 0xffc080 }, extras: (c) => skyBody(c, 'titan', 80, -240, 170, -950, 64) },
    { name: 'Ring Shadow', sky: { top: 0x020308, horizon: 0x2a3040, stars: 1.2, ringArc: 1.5, ringColor: 0xffe8c0, sunSize: 0.0001, sunHalo: 0, clouds: 0.2, cloudColor: 0x3a4050 }, floor: { cols: [0x1a2030, 0x3a4458, 0x7a8498] }, light: { light: 0xa8b4d0, sunI: 1.2, hemiI: 0.6, fog: 0x1a1e28 } },
  ],
  uranus: [
    { name: 'Sideways Winds' },
    { name: 'Polar Aurora', sky: { aurora: 1.7, top: 0x01101a, horizon: 0x1a5a6a, stars: 1.0, clouds: 0.15 }, floor: { color: 0x3a8a9a, emissive: 0x0a3a3a }, light: { light: 0xa0ffe0, hemiI: 0.65, fog: 0x123a44 } },
    { name: 'Miranda Cliffs', sky: { horizon: 0xb0f0f8, rays: 0.3 }, floor: { color: 0xe0f4ff }, light: { fog: 0x9ad8e8 }, extras: (c) => skyBody(c, 'miranda', 70, 240, 170, -950, 80) },
  ],
  neptune: [
    { name: 'Supersonic Storms' },
    { name: 'Great Dark Spot', sky: { vortex: 1.2, vortexDir: [-0.2, 0.25, -1], vortexCol: 0x050a30, vortexSize: 0.5 }, floor: { a: 0x010414, b: 0x0a1a5a, sky: 0x1a2a6a }, light: { fog: 0x0e1a5a, light: 0xb0c0ff }, extras: (c) => P.lightning(c, { color: 0xc8d8ff, rate: 1.3 }) },
    { name: 'Triton Geysers', sky: { top: 0x1a1030, horizon: 0x8a7ab8, stars: 0.6 }, floor: { a: 0x1a1040, b: 0x6a5aa8, sky: 0xc8a8e8 }, light: { light: 0xe0d0ff, fog: 0x4a3a7a }, extras: (c) => { skyBody(c, 'triton', 60, -240, 180, -950, 72); P.geysers(c); } },
  ],
  prismara: [
    { name: 'Crystal Fields' },
    { name: 'Spectrum Falls', sky: { rays: 1.0, rainbow: 1, horizon: 0x7ab0ff }, floor: { color: 0x3a6ad8, emissive: 0x0a2a6a }, light: { fog: 0x5a7ae0, light: 0xd8e8ff }, extras: (c) => P.spectrum(c) },
    { name: 'Shattered Moon', sky: { neb: 1.3, stars: 1.4, top: 0x020008, horizon: 0x2a0a3a }, floor: { color: 0x2a0a4a, emissive: 0x5a1a8a, env: 0.12 }, light: { fog: 0x14081e, fogDensity: 0.009, light: 0xc8a8ff, hemiI: 0.6, sunI: 1.3 }, extras: (c) => P.shardMoon(c) },
  ],
  mechanus: [
    { name: 'Clockwork Plains' },
    { name: 'The Furnace', sky: { top: 0x1a0402, horizon: 0xc04010, clouds: 0.6, cloudColor: 0x401008 }, light: { light: 0xffa060, fog: 0x6a1a08, under: [0xff5010, 1.0] }, extras: (c) => P.furnace(c) },
    { name: 'Grand Orrery', sky: { top: 0x020101, horizon: 0x3a2a1a, stars: 1.1, clouds: 0.15 }, light: { fog: 0x120c06, fogDensity: 0.013, light: 0xd8c8a8, hemiI: 0.55, sunI: 1.4, env: 0.3 }, extras: (c) => P.orrery(c) },
  ],
  biolumina: [
    { name: 'Glowing Jungle' },
    { name: 'Spore Bloom', sky: { aurora: 0.7, neb: 0.5, nebA: 0xff40c0, horizon: 0x3a0a3a }, floor: { a: 0x14020f, b: 0xff40c0 }, light: { fog: 0x2a0a2a, light: 0xffc8f0 }, extras: (c) => P.bloom(c) },
    { name: 'Leviathan Sky', sky: { stars: 1.3, aurora: 0.5, horizon: 0x0a2a4a }, floor: { a: 0x020a1a, b: 0x40a0ff }, light: { fog: 0x061a30, light: 0xb0d8ff }, extras: (c) => P.leviathans(c) },
  ],
  chronos: [
    { name: 'Time Fields' },
    { name: 'Shattered Hour', sky: { nebA: 0xff8040, nebB: 0x8040c0, horizon: 0x6a3a2a }, light: { fog: 0x3a2018, light: 0xffd8b0 }, extras: (c) => P.shatteredClocks(c) },
    { name: 'Clockwork Eclipse', sky: { top: 0x010006, horizon: 0x2a1a4a, sunSize: 0.0001, sunHalo: 0 }, light: { light: 0xffd8a0, hemiI: 0.55, fog: 0x0e0820 }, extras: (c) => P.eclipse(c) },
  ],
  aerolis: [
    { name: 'Sky Islands' },
    { name: 'Golden Hour', sky: { top: 0x6a3a8a, horizon: 0xffb060, sunDir: [0.4, 0.05, -1], sunSize: 0.06, sunColor: 0xffc070, sunHalo: 2.6, cloudColor: 0xffd0a0, rays: 0.5 }, floor: { cols: [0xffa060, 0xffd8a0, 0xfff0d0] }, light: { light: 0xffc890, fog: 0xf0b890 }, extras: (c) => P.kites(c) },
    { name: 'Thunderhead', sky: { top: 0x2a3a6a, horizon: 0x8aa0c8, clouds: 0.85, cloudColor: 0x8a90a8, sunSize: 0.02, sunHalo: 0.6 }, floor: { cols: [0x5a6a8a, 0x9aa8c8, 0xd8e0f0] }, light: { light: 0xd0d8f0, fog: 0x8a94b0 }, extras: (c) => { P.lightning(c, { y0: 20, y1: 70 }); P.rainbow(c); P.windmills(c); } },
  ],
  velocitar: [
    { name: 'Neon Speedway' },
    { name: 'Hyperloop', sky: { nebA: 0x3ad8ff, nebB: 0x2a40ff, horizon: 0x1a3a8a }, floor: { a: 0x3ad8ff, b: 0x4a6aff }, light: { fog: 0x0a1440, light: 0xb0e0ff }, extras: (c) => P.hyperloop(c) },
    { name: 'Outrun Sunset', sky: { top: 0x0a0018, horizon: 0xff3a8a, sunSize: 0.0001, sunHalo: 0, neb: 0.3 }, floor: { a: 0xff7a1a, b: 0xff3ad8 }, light: { light: 0xffa0d8, fog: 0x4a0a3a }, extras: (c) => P.synthSun(c) },
  ],
  blackhole: [{ name: 'Event Horizon' }],
};

export function variantOf(level) {
  const list = VARIANTS[level.world] || [{ name: '' }];
  if (list.length === 1) return { index: 0, ...list[0] };
  const i = Math.min(list.length - 1, Math.floor(((level.sub || 1) - 1) / 10));
  return { index: i, ...list[i] };
}
