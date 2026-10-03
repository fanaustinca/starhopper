// The hero: a small, glossy white robot with a black visor and glowing eyes,
// built from primitives and animated procedurally.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export class Robot {
  constructor() {
    this.root = new THREE.Group();
    this.root.name = 'robot';
    const white = new THREE.MeshPhysicalMaterial({ color: 0xf4f6fa, roughness: 0.22, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.15 });
    const grey = new THREE.MeshStandardMaterial({ color: 0x9aa3b2, roughness: 0.4, metalness: 0.6 });
    const blue = new THREE.MeshStandardMaterial({ color: 0x1e7bff, roughness: 0.3, metalness: 0.3, emissive: 0x0a3a90, emissiveIntensity: 0.6 });
    const visor = new THREE.MeshPhysicalMaterial({ color: 0x05070c, roughness: 0.05, metalness: 0.2, clearcoat: 1 });
    this.eyeMat = new THREE.MeshBasicMaterial({ color: 0x5fd8ff });
    this.jetMat = new THREE.MeshBasicMaterial({ color: 0x7fe0ff, transparent: true, opacity: 0.9, depthWrite: false, blending: THREE.AdditiveBlending });
    this.materials = [white, grey, blue, visor];

    const add = (parent, geo, mat, x = 0, y = 0, z = 0) => {
      const m = new THREE.Mesh(geo, mat);
      m.position.set(x, y, z);
      m.castShadow = true;
      parent.add(m);
      return m;
    };

    // pelvis pivot sits at hip height; everything hangs off it
    this.body = new THREE.Group();
    this.body.position.y = 0.5;
    this.root.add(this.body);

    // torso
    this.torso = new THREE.Group();
    this.body.add(this.torso);
    add(this.torso, new RoundedBoxGeometry(0.52, 0.44, 0.42, 4, 0.14), white, 0, 0.22, 0);
    add(this.torso, new RoundedBoxGeometry(0.3, 0.16, 0.05, 2, 0.04), blue, 0, 0.24, 0.205);

    // head
    this.head = new THREE.Group();
    this.head.position.y = 0.48;
    this.torso.add(this.head);
    add(this.head, new RoundedBoxGeometry(0.78, 0.6, 0.66, 5, 0.24), white, 0, 0.3, 0);
    add(this.head, new RoundedBoxGeometry(0.64, 0.4, 0.1, 4, 0.12), visor, 0, 0.3, 0.29);
    const eyeGeo = new THREE.CircleGeometry(0.07, 20);
    this.eyes = [];
    for (const ex of [-0.14, 0.14]) {
      const e = new THREE.Mesh(eyeGeo, this.eyeMat);
      e.position.set(ex, 0.31, 0.345);
      e.scale.set(0.9, 1.25, 1);
      this.head.add(e);
      this.eyes.push(e);
    }
    // little ear lights + antenna
    add(this.head, new THREE.CylinderGeometry(0.09, 0.09, 0.06, 16), blue, 0.4, 0.3, 0).rotation.z = Math.PI / 2;
    add(this.head, new THREE.CylinderGeometry(0.09, 0.09, 0.06, 16), blue, -0.4, 0.3, 0).rotation.z = Math.PI / 2;
    add(this.head, new THREE.CylinderGeometry(0.015, 0.015, 0.18, 6), grey, 0.12, 0.66, -0.05);
    this.antennaTip = add(this.head, new THREE.SphereGeometry(0.04, 10, 8), this.eyeMat, 0.12, 0.76, -0.05);

    // arms
    this.arms = [];
    for (const side of [-1, 1]) {
      const shoulder = new THREE.Group();
      shoulder.position.set(side * 0.33, 0.36, 0);
      this.torso.add(shoulder);
      add(shoulder, new THREE.SphereGeometry(0.09, 12, 10), grey, 0, 0, 0);
      const upper = add(shoulder, new THREE.CapsuleGeometry(0.075, 0.16, 4, 8), white, 0, -0.14, 0);
      upper.castShadow = true;
      add(shoulder, new THREE.SphereGeometry(0.095, 12, 10), white, 0, -0.3, 0);
      this.arms.push(shoulder);
    }

    // legs
    this.legs = [];
    this.jets = [];
    for (const side of [-1, 1]) {
      const hip = new THREE.Group();
      hip.position.set(side * 0.14, 0.02, 0);
      this.body.add(hip);
      add(hip, new THREE.CapsuleGeometry(0.08, 0.14, 4, 8), grey, 0, -0.14, 0);
      add(hip, new RoundedBoxGeometry(0.2, 0.18, 0.3, 3, 0.07), white, 0, -0.36, 0.03);
      add(hip, new RoundedBoxGeometry(0.16, 0.04, 0.2, 2, 0.015), blue, 0, -0.455, 0.03);
      const jet = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.5, 12, 1, true), this.jetMat);
      jet.rotation.x = Math.PI;
      jet.position.set(0, -0.72, 0.03);
      jet.visible = false;
      hip.add(jet);
      this.jets.push(jet);
      this.legs.push(hip);
    }

    // soft blob shadow (helps read height on top of real shadows)
    this.phase = 0;
    this.flip = 0;
    this.blinkT = 2;
    this.turn = Math.PI / 2;
    this.squash = 0;
    this.jetT = 0;
  }

  trigger(ev) {
    if (ev === 'doublejump') { this.flip = 1; this.jetT = 0.45; }
    if (ev === 'land') this.squash = 1;
    if (ev === 'jump') this.squash = -0.6;
    if (ev === 'launch') this.jetT = 0.6;
  }

  // p: physics player; t: time; dt: frame dt
  update(p, dt, t, extra = {}) {
    const st = extra.win ? 'win' : p.state;
    const speed = Math.abs(p.vx);
    // turn toward facing direction, keeping a 3/4 view toward the camera
    const target = p.facing > 0 ? 0.9 : -0.9;
    const desired = st === 'hang' || st === 'climb' ? (p.facing > 0 ? 1.45 : -1.45) : (st === 'win' ? 0 : target);
    this.turn += (desired - this.turn) * Math.min(1, dt * 12);
    this.root.rotation.y = this.turn;

    this.phase += dt * (st === 'run' ? 4 + speed * 1.15 : 2);
    const s = Math.sin(this.phase), c = Math.cos(this.phase);
    const L = this.legs, A = this.arms;
    let bodyY = 0.5, lean = 0, headTilt = 0;
    let armL = 0, armR = 0, armSpread = 0.15, legL = 0, legR = 0;

    switch (st) {
      case 'idle':
        bodyY = 0.5 + Math.sin(t * 2.4) * 0.015;
        armL = Math.sin(t * 2.4) * 0.08; armR = -armL;
        headTilt = Math.sin(t * 0.7) * 0.08;
        break;
      case 'run':
        legL = s * 0.95; legR = -s * 0.95;
        armL = -s * 0.9; armR = s * 0.9;
        bodyY = 0.5 + Math.abs(c) * 0.06;
        lean = 0.22;
        break;
      case 'jump':
        legL = -0.6; legR = 0.3; armL = -2.4; armR = -0.4; armSpread = 0.4; lean = 0.1;
        break;
      case 'flip':
        legL = -1.2; legR = -1.2; armL = -1.0; armR = -1.0; armSpread = 0.6;
        break;
      case 'fall':
        legL = 0.25 + s * 0.15; legR = -0.15 - s * 0.15;
        armL = -2.6 + Math.sin(t * 18) * 0.25; armR = -2.6 - Math.sin(t * 18) * 0.25; armSpread = 0.55;
        break;
      case 'hang':
      case 'swing':
        armL = -3.0; armR = -3.0; armSpread = 0.05;
        legL = Math.sin(t * 3) * 0.2; legR = -legL;
        bodyY = 0.5;
        break;
      case 'climb':
        armL = -2.0; armR = -2.0; legL = -1.2; legR = 0.2; lean = 0.5;
        break;
      case 'win':
        armL = -2.8 + Math.sin(t * 10) * 0.4; armR = -0.3; armSpread = 0.5;
        bodyY = 0.5 + Math.abs(Math.sin(t * 5)) * 0.12;
        break;
    }

    // double-jump flip spins the whole body in the screen plane
    if (this.flip > 0) {
      this.flip = Math.max(0, this.flip - dt / 0.38);
    }
    const flipAngle = (1 - this.flip) * Math.PI * 2 * (this.flip > 0 ? 1 : 0);
    this.body.rotation.x = lean + (this.flip > 0 ? flipAngle : 0);

    // landing squash & stretch
    this.squash += (0 - this.squash) * Math.min(1, dt * 10);
    const sq = this.squash;
    this.body.scale.set(1 + sq * 0.12, 1 - sq * 0.15, 1 + sq * 0.12);

    this.body.position.y = bodyY;
    this.head.rotation.z = headTilt;
    this.head.rotation.x = st === 'run' ? -0.15 : 0;
    A[0].rotation.x = armL; A[1].rotation.x = armR;
    A[0].rotation.z = -armSpread; A[1].rotation.z = armSpread;
    L[0].rotation.x = legL; L[1].rotation.x = legR;

    // jets on double jump / launches
    this.jetT = Math.max(0, this.jetT - dt);
    const jetOn = this.jetT > 0;
    for (const j of this.jets) {
      j.visible = jetOn;
      if (jetOn) j.scale.set(1, 0.6 + Math.random() * 0.6, 1);
    }

    // blinking eyes
    this.blinkT -= dt;
    const blink = this.blinkT < 0.12 && this.blinkT > 0;
    if (this.blinkT < 0) this.blinkT = 2 + Math.random() * 3;
    for (const e of this.eyes) e.scale.y = blink ? 0.15 : 1.25;
    // hurt flashing
    this.root.visible = !(extra.invuln > 0 && Math.floor(t * 20) % 2 === 0);
    this.eyeMat.color.setHex(extra.invuln > 0 ? 0xff5050 : 0x5fd8ff);
  }
}
