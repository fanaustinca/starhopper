// The hero: a sleek, glossy robot built from smooth lathe/capsule shapes —
// egg-shaped torso, round helmet with a curved visor, capsule limbs with
// elbows and knees, ovoid boots — animated procedurally. Supports skins.
import * as THREE from 'three';
import { skinById } from '../core/skins.js';

function lathe(profile, segs = 40) {
  const curve = new THREE.SplineCurve(profile.map(([x, y]) => new THREE.Vector2(x, y)));
  return new THREE.LatheGeometry(curve.getPoints(24), segs);
}

let galaxyTex = null;
function galaxyTexture() {
  if (galaxyTex) return galaxyTex;
  const c = document.createElement('canvas'); c.width = 256; c.height = 128;
  const g = c.getContext('2d');
  const grd = g.createLinearGradient(0, 0, 256, 128);
  grd.addColorStop(0, '#1a0f4a'); grd.addColorStop(0.5, '#4a1a7a'); grd.addColorStop(1, '#0e2a6a');
  g.fillStyle = grd; g.fillRect(0, 0, 256, 128);
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * 256, y = Math.random() * 128, r = 10 + Math.random() * 30;
    const n = g.createRadialGradient(x, y, 0, x, y, r);
    n.addColorStop(0, `rgba(${Math.random() < 0.5 ? '255,80,200' : '80,160,255'},0.25)`); n.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = n; g.fillRect(x - r, y - r, r * 2, r * 2);
  }
  for (let i = 0; i < 220; i++) { g.fillStyle = `rgba(255,255,255,${Math.random()})`; g.fillRect(Math.random() * 256, Math.random() * 128, 1, 1); }
  galaxyTex = new THREE.CanvasTexture(c);
  galaxyTex.colorSpace = THREE.SRGBColorSpace;
  return galaxyTex;
}

export class Robot {
  constructor(skinId = 'classic') {
    this.root = new THREE.Group();
    this.root.name = 'robot';
    this.body = new THREE.Group();
    this.root.add(this.body);
    this.phase = 0; this.flip = 0; this.blinkT = 2; this.turn = 0.9; this.squash = 0; this.jetT = 0;
    this.setSkin(skinId);
  }

  setSkin(id) {
    const skin = skinById(id);
    this.skin = skin;
    // clear old parts
    while (this.body.children.length) this.body.remove(this.body.children[0]);
    this.build(skin);
  }

  build(S) {
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: S.body, roughness: S.rough ?? 0.32, metalness: S.metal ?? 0.05, clearcoat: 0.6, clearcoatRoughness: 0.2,
      emissive: S.bodyGlow ?? 0x000000, map: S.galaxy ? galaxyTexture() : null,
      transmission: S.glass ? 0.35 : 0, thickness: S.glass ? 0.4 : 0, ior: 1.4,
    });
    const jointMat = new THREE.MeshPhysicalMaterial({ color: S.joint, roughness: 0.3, metalness: 0.6, clearcoat: 0.6 });
    const accentMat = new THREE.MeshStandardMaterial({ color: S.accent, emissive: S.accent, emissiveIntensity: S.accentGlow ?? 0.6, roughness: 0.3 });
    const visorMat = new THREE.MeshPhysicalMaterial({ color: 0x04060b, roughness: 0.04, metalness: 0.3, clearcoat: 1, clearcoatRoughness: 0.02 });
    this.eyeMat = new THREE.MeshBasicMaterial({ color: S.eye });
    this.eyeColor = S.eye;
    this.jetMat = new THREE.MeshBasicMaterial({ color: S.eye, transparent: true, opacity: 0.85, depthWrite: false, blending: THREE.AdditiveBlending });

    const mesh = (parent, geo, material, x = 0, y = 0, z = 0) => {
      const m = new THREE.Mesh(geo, material);
      m.position.set(x, y, z);
      m.castShadow = true;
      parent.add(m);
      return m;
    };

    this.body.position.y = 0.47;

    // ---- torso: smooth egg (lathe) ----
    this.torso = new THREE.Group();
    this.body.add(this.torso);
    const torso = mesh(this.torso, lathe([[0.001, 0], [0.15, 0.015], [0.24, 0.09], [0.27, 0.21], [0.255, 0.33], [0.2, 0.43], [0.11, 0.49], [0.001, 0.5]]), bodyMat);
    torso.scale.z = 0.85;
    const belt = mesh(this.torso, new THREE.TorusGeometry(0.245, 0.018, 10, 48), accentMat, 0, 0.1, 0);
    belt.rotation.x = Math.PI / 2; belt.scale.y = 0.85;
    const chest = mesh(this.torso, new THREE.CircleGeometry(0.06, 32), accentMat, 0, 0.27, 0.226);
    chest.rotation.x = -0.1;
    mesh(this.torso, new THREE.TorusGeometry(0.075, 0.012, 8, 32), jointMat, 0, 0.27, 0.222).rotation.x = -0.1;

    // ---- head: round helmet + curved visor ----
    this.head = new THREE.Group();
    this.head.position.y = 0.5;
    this.torso.add(this.head);
    mesh(this.head, new THREE.CylinderGeometry(0.07, 0.09, 0.08, 20), jointMat, 0, 0.0, 0);
    const shell = mesh(this.head, new THREE.SphereGeometry(0.42, 56, 40), bodyMat, 0, 0.33, 0);
    shell.scale.set(1.1, 0.86, 0.96);
    const visor = mesh(this.head, new THREE.SphereGeometry(0.425, 56, 40, Math.PI / 2 - 1.05, 2.1, 0.92, 1.12), visorMat, 0, 0.33, 0.004);
    visor.scale.set(1.1, 0.86, 0.96);
    this.eyes = [];
    const eyeGeo = new THREE.CapsuleGeometry(0.045, 0.05, 6, 16);
    for (const ex of [-0.145, 0.145]) {
      const e = new THREE.Mesh(eyeGeo, this.eyeMat);
      e.position.set(ex, 0.34, 0.392);
      e.rotation.y = ex * 2.4;
      e.scale.z = 0.25;
      this.head.add(e);
      this.eyes.push(e);
    }
    // ear pods with glowing rings
    for (const s of [-1, 1]) {
      const pod = mesh(this.head, new THREE.SphereGeometry(0.11, 24, 16), jointMat, s * 0.44, 0.33, 0);
      pod.scale.set(0.55, 1, 1);
      const ring = mesh(this.head, new THREE.TorusGeometry(0.075, 0.016, 8, 24), accentMat, s * 0.497, 0.33, 0);
      ring.rotation.y = Math.PI / 2;
    }

    // ---- arms: shoulder → elbow → round hand ----
    this.arms = []; this.elbows = [];
    for (const side of [-1, 1]) {
      const sh = new THREE.Group();
      sh.position.set(side * 0.29, 0.37, 0);
      this.torso.add(sh);
      mesh(sh, new THREE.SphereGeometry(0.085, 20, 14), jointMat);
      mesh(sh, new THREE.CapsuleGeometry(0.07, 0.11, 8, 16), bodyMat, 0, -0.11, 0);
      const el = new THREE.Group();
      el.position.y = -0.21;
      sh.add(el);
      mesh(el, new THREE.SphereGeometry(0.06, 16, 12), jointMat);
      mesh(el, new THREE.CapsuleGeometry(0.068, 0.08, 8, 16), bodyMat, 0, -0.08, 0);
      const cuff = mesh(el, new THREE.TorusGeometry(0.066, 0.012, 8, 24), accentMat, 0, -0.13, 0);
      cuff.rotation.x = Math.PI / 2;
      mesh(el, new THREE.SphereGeometry(0.088, 24, 16), bodyMat, 0, -0.2, 0);
      this.arms.push(sh); this.elbows.push(el);
    }

    // ---- legs: hip → knee → ovoid boot ----
    this.legs = []; this.knees = []; this.jets = [];
    for (const side of [-1, 1]) {
      const hip = new THREE.Group();
      hip.position.set(side * 0.125, 0.02, 0);
      this.body.add(hip);
      mesh(hip, new THREE.SphereGeometry(0.075, 16, 12), jointMat);
      mesh(hip, new THREE.CapsuleGeometry(0.068, 0.06, 8, 16), jointMat, 0, -0.08, 0);
      const kn = new THREE.Group();
      kn.position.y = -0.16;
      hip.add(kn);
      mesh(kn, new THREE.SphereGeometry(0.07, 16, 12), jointMat);
      mesh(kn, new THREE.CapsuleGeometry(0.078, 0.06, 8, 16), bodyMat, 0, -0.07, 0);
      const boot = mesh(kn, new THREE.SphereGeometry(0.115, 32, 20), bodyMat, 0, -0.2, 0.035);
      boot.scale.set(1.0, 0.72, 1.45);
      const sole = mesh(kn, new THREE.TorusGeometry(0.1, 0.014, 8, 32), accentMat, 0, -0.245, 0.035);
      sole.rotation.x = Math.PI / 2; sole.scale.set(1, 1.42, 1);
      const jet = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.5, 16, 1, true), this.jetMat);
      jet.rotation.x = Math.PI;
      jet.position.set(0, -0.53, 0.035);
      jet.visible = false;
      kn.add(jet);
      this.jets.push(jet);
      this.legs.push(hip); this.knees.push(kn);
    }

    // ---- accessories ----
    this.scarfTail = null;
    if (S.acc === 'antenna') {
      mesh(this.head, new THREE.CylinderGeometry(0.012, 0.012, 0.22, 8), jointMat, 0, 0.78, 0);
      mesh(this.head, new THREE.SphereGeometry(0.045, 16, 12), accentMat, 0, 0.9, 0);
    } else if (S.acc === 'ears') {
      for (const s of [-1, 1]) {
        const ear = mesh(this.head, new THREE.ConeGeometry(0.1, 0.2, 20), bodyMat, s * 0.24, 0.67, -0.02);
        ear.rotation.z = -s * 0.35;
        const inner = mesh(this.head, new THREE.ConeGeometry(0.055, 0.12, 16), accentMat, s * 0.235, 0.66, 0.035);
        inner.rotation.z = -s * 0.35;
      }
    } else if (S.acc === 'crown') {
      const crownMat = new THREE.MeshStandardMaterial({ color: 0xffd34a, metalness: 1, roughness: 0.18, emissive: 0x402800 });
      const band = mesh(this.head, new THREE.CylinderGeometry(0.17, 0.19, 0.08, 32, 1, true), crownMat, 0, 0.7, 0);
      band.material.side = THREE.DoubleSide;
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        mesh(this.head, new THREE.ConeGeometry(0.035, 0.12, 12), crownMat, Math.sin(a) * 0.175, 0.79, Math.cos(a) * 0.175);
        mesh(this.head, new THREE.SphereGeometry(0.02, 8, 6), accentMat, Math.sin(a) * 0.19, 0.71, Math.cos(a) * 0.19);
      }
    } else if (S.acc === 'scarf') {
      const scarfMat = new THREE.MeshStandardMaterial({ color: S.accent, roughness: 0.7, side: THREE.DoubleSide });
      const ring = mesh(this.torso, new THREE.TorusGeometry(0.13, 0.045, 10, 32), scarfMat, 0, 0.5, 0);
      ring.rotation.x = Math.PI / 2;
      this.scarfTail = new THREE.Group();
      this.scarfTail.position.set(0.05, 0.5, -0.13);
      this.torso.add(this.scarfTail);
      const tail = mesh(this.scarfTail, new THREE.PlaneGeometry(0.1, 0.42, 1, 6), scarfMat, 0, -0.2, 0);
      tail.geometry.translate(0, 0, 0);
    } else if (S.acc === 'backpack') {
      const pack = mesh(this.torso, new THREE.CapsuleGeometry(0.13, 0.14, 8, 20), jointMat, 0, 0.27, -0.25);
      pack.scale.set(1.2, 1, 0.7);
      for (const s of [-1, 1]) {
        mesh(this.torso, new THREE.CylinderGeometry(0.05, 0.06, 0.12, 16), bodyMat, s * 0.09, 0.08, -0.27);
        mesh(this.torso, new THREE.CircleGeometry(0.04, 16), accentMat, s * 0.09, 0.019, -0.27).rotation.x = Math.PI / 2;
      }
    }
  }

  // Air tricks: every jump picks a random move. First jumps get lighter
  // moves, double jumps / springs / wall kicks get the big rotations.
  static TRICKS = {
    jump: ['starjump', 'tuck', 'superman', 'split', 'twirl', 'cheer', 'frontflip', 'scissor'],
    double: ['frontflip', 'backflip', 'cartwheel', 'corkscrew', 'doubleflip', 'sideflip', 'helicopter', 'twirl', 'cartwheel'],
    wall: ['backflip', 'sideflip', 'cartwheel'],
    launch: ['corkscrew', 'doubleflip', 'helicopter', 'cartwheel', 'backflip'],
  };
  startTrick(pool, dur) {
    const list = Robot.TRICKS[pool];
    let pick = list[Math.floor(Math.random() * list.length)];
    if (pick === this.lastTrick) pick = list[Math.floor(Math.random() * list.length)];
    this.lastTrick = pick;
    this.trick = { type: pick, t: 0, dur };
  }

  trigger(ev) {
    if (ev === 'jump') { this.squash = -0.6; this.startTrick('jump', 0.55); }
    if (ev === 'doublejump') { this.jetT = 0.45; this.startTrick('double', 0.46); }
    if (ev === 'walljump') { this.squash = -0.6; this.startTrick('wall', 0.45); }
    if (ev === 'launch') { this.jetT = 0.6; this.startTrick('launch', 0.7); }
    if (ev === 'land') { this.squash = 1; this.trick = null; }
  }

  update(p, dt, t, extra = {}) {
    const st = extra.win ? 'win' : extra.showcase ? 'showcase' : p.state;
    const speed = Math.abs(p.vx);
    const target = p.facing > 0 ? 0.9 : -0.9;
    let desired = st === 'hang' || st === 'climb' || st === 'wall' ? (p.facing > 0 ? 1.45 : -1.45) : target;
    if (st === 'win' || st === 'showcase') desired = 0;
    if (st === 'wall') desired = p.facing > 0 ? 1.57 : -1.57;
    this.turn += (desired - this.turn) * Math.min(1, dt * 12);
    this.root.rotation.y = this.turn;

    this.phase += dt * (st === 'run' ? 4 + speed * 1.15 : 2);
    const s = Math.sin(this.phase), c = Math.cos(this.phase);
    let bodyY = 0.43, lean = 0, headTilt = 0, headNod = 0;
    let armL = 0, armR = 0, spread = 0.12, elL = -0.25, elR = -0.25;
    let legL = 0, legR = 0, knL = 0, knR = 0;

    switch (st) {
      case 'idle': case 'showcase':
        bodyY = 0.43 + Math.sin(t * 2.4) * 0.012;
        armL = Math.sin(t * 2.4) * 0.08; armR = -armL;
        headTilt = Math.sin(t * 0.7) * 0.1;
        if (st === 'showcase') { armR = -0.3 + Math.sin(t * 3) * 0.15; elR = -1.2 - Math.sin(t * 6) * 0.4; spread = 0.25; }
        break;
      case 'run':
        legL = s * 0.9; legR = -s * 0.9;
        knL = Math.max(0, -s) * 1.3 + 0.15; knR = Math.max(0, s) * 1.3 + 0.15;
        armL = -s * 0.85; armR = s * 0.85; elL = elR = -1.0;
        bodyY = 0.42 + Math.abs(c) * 0.05;
        lean = 0.2; headNod = -0.12;
        break;
      case 'jump':
        legL = -0.7; knL = 1.1; legR = 0.25; knR = 0.3;
        armL = -2.4; armR = -0.5; elL = -0.3; elR = -0.8; spread = 0.4; lean = 0.1;
        break;
      case 'flip':
        legL = legR = -1.3; knL = knR = 1.8; armL = armR = -0.8; elL = elR = -1.4; spread = 0.5;
        break;
      case 'fall':
        legL = 0.2 + s * 0.12; legR = -0.2 - s * 0.12; knL = 0.3; knR = 0.5;
        armL = -2.5 + Math.sin(t * 16) * 0.25; armR = -2.5 - Math.sin(t * 16) * 0.25; elL = elR = -0.2; spread = 0.55;
        break;
      case 'hang': case 'swing':
        armL = armR = -3.0; elL = elR = 0; spread = 0.05;
        legL = Math.sin(t * 3) * 0.2; legR = -legL; knL = knR = 0.3;
        break;
      case 'climb':
        armL = armR = -2.0; elL = elR = -0.8; legL = -1.2; knL = 1.4; legR = 0.2; lean = 0.5;
        break;
      case 'wall':
        armL = -1.6; armR = -2.2; elL = elR = -0.5; legL = -0.5; knL = 0.9; legR = 0.2; knR = 0.4; lean = -0.15; spread = 0.35;
        break;
      case 'win':
        armL = -2.8 + Math.sin(t * 10) * 0.4; armR = -0.3; elL = -0.3; spread = 0.5;
        bodyY = 0.43 + Math.abs(Math.sin(t * 5)) * 0.12; knL = knR = Math.abs(Math.sin(t * 5)) * 0.4;
        break;
    }

    // ---- air trick overrides pose + adds a body rotation ----
    let rx = 0, ry = 0, rz = 0;
    const airborne = st === 'jump' || st === 'flip' || st === 'fall';
    if (this.trick && !airborne && st !== 'showcase') this.trick = null;
    if (this.trick) {
      const tr = this.trick;
      tr.t += dt;
      const k = Math.min(1, tr.t / tr.dur);
      const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;   // ease in-out
      const dirS = p.facing > 0 ? 1 : -1;
      const tuck = () => { legL = legR = -1.4; knL = knR = 2.0; armL = armR = -0.6; elL = elR = -1.6; spread = 0.3; };
      switch (tr.type) {
        case 'frontflip': tuck(); rx = e * Math.PI * 2; break;
        case 'backflip': tuck(); rx = -e * Math.PI * 2; break;
        case 'doubleflip': tuck(); rx = e * Math.PI * 4; break;
        case 'cartwheel':
          armL = armR = -0.2; spread = 1.6; elL = elR = 0; legL = legR = 0; knL = knR = 0;
          this.legs[0].rotation.z = 0.6; this.legs[1].rotation.z = -0.6;
          rz = -dirS * e * Math.PI * 2; break;
        case 'sideflip': tuck(); rz = dirS * e * Math.PI * 2; break;
        case 'corkscrew': tuck(); rx = e * Math.PI * 2; ry = e * Math.PI * 2; break;
        case 'helicopter': armL = armR = -0.1; spread = 1.5; elL = elR = 0; legL = 0.1; legR = -0.1; ry = e * Math.PI * 6; break;
        case 'twirl': armL = armR = -2.9; spread = 0.2; elL = elR = 0; legL = 0.3; knL = 0.8; ry = e * Math.PI * 2; break;
        case 'starjump': {
          const o = Math.sin(k * Math.PI);
          armL = armR = -0.4 * o; spread = 0.3 + 1.6 * o; elL = elR = 0;
          this.legs[0].rotation.z = 0.5 * o; this.legs[1].rotation.z = -0.5 * o; break;
        }
        case 'tuck': { const o = Math.sin(k * Math.PI); legL = legR = -1.4 * o; knL = knR = 2.0 * o; armL = armR = -0.5; elL = elR = -1.5 * o; break; }
        case 'superman': { const o = Math.sin(Math.min(1, k * 1.3) * Math.PI * 0.5); lean = 1.1 * o; armL = armR = -3.0; spread = 0.1; elL = elR = 0; legL = legR = 0.15; break; }
        case 'split': { const o = Math.sin(k * Math.PI); legL = -1.3 * o; legR = 1.1 * o; knL = knR = 0; armL = armR = -2.6; spread = 0.5; break; }
        case 'scissor': legL = Math.sin(k * 18) * 0.9; legR = -legL; knL = knR = 0.2; armL = -2.2; armR = -0.4; break;
        case 'cheer': armL = -3.0; armR = -3.0; spread = 0.45 + Math.sin(k * 20) * 0.15; elL = elR = 0; legL = -0.5; knL = 1.0; break;
      }
      if (k >= 1) this.trick = null;
    }
    if (!this.trick || (this.trick.type !== 'cartwheel' && this.trick.type !== 'starjump')) { this.legs[0].rotation.z = 0; this.legs[1].rotation.z = 0; }
    this.body.rotation.set(lean + rx, ry, rz);
    this.squash += (0 - this.squash) * Math.min(1, dt * 10);
    const sq = this.squash;
    this.body.scale.set(1 + sq * 0.12, 1 - sq * 0.15, 1 + sq * 0.12);
    this.body.position.y = bodyY;
    this.head.rotation.z = headTilt;
    this.head.rotation.x = headNod;
    this.arms[0].rotation.x = armL; this.arms[1].rotation.x = armR;
    this.arms[0].rotation.z = -spread; this.arms[1].rotation.z = spread;
    this.elbows[0].rotation.x = elL; this.elbows[1].rotation.x = elR;
    this.legs[0].rotation.x = legL; this.legs[1].rotation.x = legR;
    this.knees[0].rotation.x = knL; this.knees[1].rotation.x = knR;
    if (this.scarfTail) this.scarfTail.rotation.x = 0.6 + Math.min(1.2, speed * 0.12) + Math.sin(t * 14) * 0.12;

    this.jetT = Math.max(0, this.jetT - dt);
    for (const j of this.jets) {
      j.visible = this.jetT > 0;
      if (j.visible) j.scale.set(1, 0.6 + Math.random() * 0.6, 1);
    }
    this.blinkT -= dt;
    const blink = this.blinkT < 0.12 && this.blinkT > 0;
    if (this.blinkT < 0) this.blinkT = 2 + Math.random() * 3;
    for (const e of this.eyes) e.scale.y = blink ? 0.15 : 1;
    this.root.visible = !(extra.invuln > 0 && Math.floor(t * 20) % 2 === 0);
    this.eyeMat.color.setHex(extra.invuln > 0 ? 0xff5050 : this.eyeColor);
  }
}
