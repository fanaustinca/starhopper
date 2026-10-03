// Cutscenes, built from three shots:
//   depart  – the robot runs to its ship on the finished planet and lifts off
//   cruise  – warp-streaked flight through space (or the approach to the Sun)
//   arrive  – the ship descends onto a landing pad in the next world's real
//             backdrop, the canopy swings open and the robot hops out
// Kinds: 'intro' (approach + land at the Sun), 'transfer' (depart → cruise →
// arrive), 'finale' (depart → cruise to a galaxy).
import * as THREE from 'three';
import { WORLDS, LEVELS_PER_WORLD } from '../core/config.js';
import { generateLevel } from '../core/levelgen.js';
import { Robot } from './robot.js';
import { makeShip, mat } from './vehicles.js';
import { planetTexture, ringTexture, glowTexture } from './textures.js';
import { buildBackdrop } from './decor.js';
import { tickShaders, plasmaMaterial, starMaterial } from './shaders.js';
import { makeRng } from '../core/rng.js';

const ease = (x) => (x < 0 ? 0 : x > 1 ? 1 : x * x * (3 - 2 * x));
const seg = (t, a, b) => ease((t - a) / (b - a));
const DEPART = 3.4, CRUISE = 3.4, APPROACH = 4.2, ARRIVE = 5.8;

function planet(world, radius, seed) {
  const g = new THREE.Group();
  const tex = planetTexture(world, seed);
  const m = world.planet.emissive ? starMaterial() : new THREE.MeshStandardMaterial({ map: tex, roughness: 0.85 });
  const s = new THREE.Mesh(new THREE.SphereGeometry(radius, 64, 40), m);
  g.add(s);
  g.userData.sphere = s;
  if (world.planet.rings) {
    const geo = new THREE.RingGeometry(radius * 1.35, radius * 2.3, 128, 1);
    const pos = geo.attributes.position, uv = geo.attributes.uv;
    for (let i = 0; i < pos.count; i++) uv.setXY(i, (Math.hypot(pos.getX(i), pos.getY(i)) - radius * 1.35) / (radius * 0.95), 0.5);
    const ring = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: ringTexture(world.planet.color), side: THREE.DoubleSide, transparent: true, depthWrite: false }));
    ring.rotation.x = Math.PI / 2 - 0.3;
    g.add(ring);
  }
  const atm = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(world.planet.emissive ? 0xffa030 : world.sky[1]), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: world.planet.emissive ? 1 : 0.55 }));
  atm.scale.setScalar(radius * (world.planet.emissive ? 4.5 : 2.6));
  g.add(atm);
  return g;
}

export class Cutscene {
  constructor(renderer, fromIdx, toIdx, opts = {}) {
    this.r = renderer;
    this.t = 0;
    this.kind = fromIdx == null ? 'intro' : toIdx == null ? 'finale' : 'transfer';
    this.from = fromIdx != null ? WORLDS[fromIdx] : null;
    this.to = toIdx != null ? WORLDS[toIdx] : null;
    this.toIdx = toIdx;
    this.done = false;
    this.robot = new Robot(opts.skin || 'classic');
    this.fake = { x: -7, y: 0, vx: 0, vy: 0, facing: 1, state: 'idle' };
    if (this.kind === 'intro') { this.tSpace = APPROACH; this.duration = APPROACH + ARRIVE; }
    else if (this.kind === 'transfer') { this.tSpace = DEPART + CRUISE; this.duration = DEPART + CRUISE + ARRIVE; }
    else { this.tSpace = 9.5; this.duration = 9.5; }
    this.buildSpace(fromIdx, toIdx);
    if (this.to) this.buildArrival(toIdx);
  }

  // ------------------------------------------------------------------ space shot
  buildSpace(fromIdx, toIdx) {
    const scene = this.space = new THREE.Scene();
    scene.background = new THREE.Color(0x02030a);
    this.spaceCam = new THREE.PerspectiveCamera(45, 16 / 9, 0.1, 6000);
    scene.add(new THREE.HemisphereLight(0xbfd8ff, 0x202030, 0.9));
    const key = new THREE.DirectionalLight(0xffffff, 2.8);
    key.position.set(-30, 40, 30);
    scene.add(key);
    const rng = makeRng((fromIdx ?? 99) * 13 + 1);
    const N = 3000, pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) { pos[i * 3] = rng.range(-800, 1800); pos[i * 3 + 1] = rng.range(-500, 500); pos[i * 3 + 2] = rng.range(-1200, -80); }
    const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    scene.add(new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xffffff, size: 1.6, sizeAttenuation: false })));
    const streakN = 300;
    this.streakSeeds = [];
    for (let i = 0; i < streakN; i++) this.streakSeeds.push({ x: rng.range(-60, 60), y: rng.range(-30, 30), z: rng.range(-40, 10), l: rng.range(2, 8) });
    const stg = new THREE.BufferGeometry(); stg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(streakN * 6), 3));
    this.streaks = new THREE.LineSegments(stg, new THREE.LineBasicMaterial({ color: 0x9ad0ff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending }));
    this.streaks.frustumCulled = false;
    scene.add(this.streaks);

    this.ship = makeShip();
    scene.add(this.ship);

    if (this.kind === 'intro') {
      // the Sun fills the view as we approach, prominences licking off the limb
      this.sunBall = planet(WORLDS[0], 260, 1);
      this.sunBall.position.set(700, -120, -900);
      scene.add(this.sunBall);
      for (let i = 0; i < 6; i++) {
        const a = rng.range(-1.2, 1.2), r = 262, span = rng.range(60, 140);
        const pts = [];
        for (let k = 0; k <= 12; k++) {
          const u = k / 12, ang = a + (u - 0.5) * span / r;
          const lift = Math.sin(u * Math.PI) * span * 0.6;
          pts.push(new THREE.Vector3(Math.sin(ang) * (r + lift), Math.cos(ang) * (r + lift), rng.range(-10, 10)));
        }
        const tube = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 60, rng.range(5, 12), 10), plasmaMaterial());
        this.sunBall.add(tube);
      }
      this.ship.position.set(-40, 10, 0);
      this.robot.root.scale.setScalar(0.55);
      scene.add(this.robot.root);
      return;
    }
    // depart: origin planet + launch pad
    this.pA = planet(this.from, 70, fromIdx + 1);
    this.pA.position.set(0, -71.5, -10);
    scene.add(this.pA);
    const pad = new THREE.Group();
    const padTop = new THREE.Mesh(new THREE.CylinderGeometry(5, 5.5, 0.6, 40), mat(0xd8dde6, { metalness: 0.6, roughness: 0.25 }));
    padTop.position.y = -0.3; pad.add(padTop);
    const padRing = new THREE.Mesh(new THREE.TorusGeometry(4.4, 0.08, 8, 64), mat(0x5ad8ff, { emissive: 0x5ad8ff, emissiveIntensity: 2 }));
    padRing.rotation.x = Math.PI / 2; padRing.position.y = 0.02; pad.add(padRing);
    scene.add(pad);
    if (this.to) {
      this.pB = planet(this.to, 60, toIdx + 1);
    } else {
      const gN = 6000, gp = new Float32Array(gN * 3), gc = new Float32Array(gN * 3);
      for (let i = 0; i < gN; i++) {
        const arm = i % 3, r = Math.pow(rng.next(), 0.6) * 160, a = r * 0.045 + (arm * Math.PI * 2) / 3 + rng.range(-0.3, 0.3);
        gp[i * 3] = Math.cos(a) * r; gp[i * 3 + 1] = rng.range(-4, 4) * (1 - r / 180); gp[i * 3 + 2] = Math.sin(a) * r;
        const c = new THREE.Color().setHSL(0.6 - r / 400, 0.8, 0.6 + (1 - r / 160) * 0.3);
        gc[i * 3] = c.r; gc[i * 3 + 1] = c.g; gc[i * 3 + 2] = c.b;
      }
      const gg = new THREE.BufferGeometry();
      gg.setAttribute('position', new THREE.BufferAttribute(gp, 3));
      gg.setAttribute('color', new THREE.BufferAttribute(gc, 3));
      this.pB = new THREE.Points(gg, new THREE.PointsMaterial({ size: 2, sizeAttenuation: false, vertexColors: true, blending: THREE.AdditiveBlending, transparent: true }));
      this.pB.rotation.x = 0.5;
    }
    this.pB.position.set(900, -20, -400);
    scene.add(this.pB);
    this.ship.position.set(1.5, 1.46, 0);
    this.robot.root.position.set(-7, 0, 0);
    scene.add(this.robot.root);
  }

  // ------------------------------------------------------------------ arrival shot
  buildArrival(toIdx) {
    const W = this.to;
    const level = generateLevel(toIdx * LEVELS_PER_WORLD + 1);
    const scene = this.land = new THREE.Scene();
    scene.fog = new THREE.FogExp2(W.fog, W.fogDensity * 0.8);
    scene.environment = this.r.__env || null;
    this.landCam = new THREE.PerspectiveCamera(40, 16 / 9, 0.3, 4000);
    const hemi = new THREE.HemisphereLight(W.light, W.id === 'sun' ? 0xff5a10 : W.ambient, W.id === 'sun' ? 1.3 : 1.1);
    scene.add(hemi);
    const key = new THREE.DirectionalLight(W.light, W.id === 'biolumina' ? 1.4 : 2.4);
    key.position.set(12, 30, 18);
    scene.add(key);
    if (W.id === 'sun') { const under = new THREE.DirectionalLight(0xff8a30, 2.4); under.position.set(0, -1, 0.4); scene.add(under); }
    this.landBackdrop = buildBackdrop(level);
    scene.add(this.landBackdrop.group);
    // landing pad: a sleek platform with a lit ring
    const pad = new THREE.Group();
    const top = new THREE.Mesh(new THREE.CylinderGeometry(4.5, 4.8, 0.5, 48), mat(W.platTop, { metalness: 0.5, roughness: 0.25 }));
    top.position.y = -0.25; pad.add(top);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 1.2, 4, 32), mat(W.plat, { metalness: 0.4, roughness: 0.5 }));
    base.position.y = -2.5; pad.add(base);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(4.0, 0.07, 8, 64), mat(W.accent, { emissive: W.accent, emissiveIntensity: 2.4 }));
    ring.rotation.x = Math.PI / 2; ring.position.y = 0.02; pad.add(ring);
    this.landRing = ring;
    scene.add(pad);
    this.landShip = makeShip();
    scene.add(this.landShip);
    this.landDust = [];
    const dustMat = new THREE.SpriteMaterial({ map: glowTexture(0xffffff), transparent: true, opacity: 0, depthWrite: false, color: W.id === 'sun' ? 0xffb060 : 0xd8d0c8 });
    for (let i = 0; i < 18; i++) {
      const d = new THREE.Sprite(dustMat.clone());
      d.userData.a = (i / 18) * Math.PI * 2;
      scene.add(d);
      this.landDust.push(d);
    }
  }

  skip() { this.t = this.duration; this.done = true; }

  caption() {
    const t = this.t;
    if (this.kind === 'intro') {
      if (t < 2.6) return { big: 'STARHOPPER', small: 'NOW APPROACHING · THE SUN' };
      if (t > APPROACH + 2.6) return { big: 'THE SUN', small: 'WORLD 1' };
      return null;
    }
    if (t < 1.5) return { big: this.from.name.toUpperCase(), small: 'WORLD COMPLETE' };
    if (this.to && t > DEPART + 0.6 && t < this.tSpace - 0.4) return { big: this.to.name.toUpperCase(), small: 'NEXT STOP' };
    if (this.to && t > this.tSpace + 2.6) return { big: this.to.name.toUpperCase(), small: `WORLD ${this.toIdx + 1}` };
    if (!this.to && t > 6.2) return { big: 'THE END', small: 'ALL 420 LEVELS CLEARED' };
    return null;
  }

  update(dt) {
    this.t = Math.min(this.duration, this.t + dt);
    tickShaders(this.t + 50);
    if (this.t < this.tSpace) this.updateSpace(dt); else this.updateArrival(dt);
    if (this.t >= this.duration) this.done = true;
    return this.done;
  }

  updateSpace(dt) {
    const t = this.t, R = this.robot, f = this.fake, ship = this.ship;
    if (this.space.children.indexOf(R.root) < 0) this.space.add(R.root);
    let cruise;
    if (this.kind === 'intro') {
      // fly toward the Sun, banking as it grows
      const k = seg(t, 0, APPROACH);
      ship.position.set(-40 + k * 120, 10 - k * 14 + Math.sin(t * 1.5) * 0.4, -k * 30);
      ship.rotation.set(0, -0.25 + k * 0.1, Math.sin(t) * 0.05 - 0.05);
      this.sunBall.position.set(700 - k * 280, -120 + k * 40, -900 + k * 380);
      this.sunBall.rotation.z = t * 0.02;
      cruise = seg(t, 0.2, 1.0) * (1 - seg(t, APPROACH - 1.2, APPROACH - 0.2));
      ship.userData.flame.visible = true;
      ship.userData.flame.scale.set(1, 1.4 * (0.85 + Math.random() * 0.3), 1);
      R.update(f, dt, t, {});
      R.root.position.copy(ship.localToWorld(new THREE.Vector3(0.6, 0.15, 0)));
      R.root.rotation.y = Math.PI / 2;
      const cam = this.spaceCam;
      cam.position.set(ship.position.x - 12 + k * 2, ship.position.y + 3, ship.position.z + 14);
      cam.lookAt(ship.position.x + 10, ship.position.y - 2 - k * 4, ship.position.z - 20);
    } else {
      if (t < 1.2) { f.x = -7 + seg(t, 0.1, 1.2) * 5.0; f.y = 0; f.vx = 8; f.state = t > 0.1 ? 'run' : 'idle'; }
      else if (t < 1.9) {
        const k = (t - 1.2) / 0.7;
        f.x = -2 + k * 4.2; f.y = Math.sin(k * Math.PI) * 3.0 + k * 1.3; f.vx = 6; f.state = k < 0.5 ? 'jump' : 'fall';
        if (k > 0.05 && !this._flipped) { R.trigger('doublejump'); this._flipped = true; }
      } else { f.state = 'idle'; f.vx = 0; }
      R.update(f, dt, t, {});
      if (t < 1.9) { R.root.position.set(f.x, f.y, 0); R.root.scale.setScalar(1); }
      else { R.root.scale.setScalar(0.55); R.root.position.copy(ship.localToWorld(new THREE.Vector3(0.6, 0.15, 0))); R.root.rotation.y = Math.PI / 2; }
      const end = this.kind === 'transfer' ? this.tSpace : 8.6;
      const lift = seg(t, 2.0, DEPART);
      const travel = seg(t, DEPART - 0.4, end);
      ship.position.x = 1.5 + travel * 880;
      ship.position.y = 1.46 + lift * 18 + Math.sin(t * 2) * 0.2 * lift - seg(t, end - 1, end) * 10;
      ship.position.z = -travel * 380;
      ship.rotation.z = lift * 0.35 * (1 - travel) + Math.sin(t * 1.5) * 0.04;
      ship.rotation.y = -travel * 0.35;
      ship.userData.flame.visible = t > 1.95;
      ship.userData.flame.scale.set(1, (t > 3 ? 1.6 : 0.6 + lift) * (0.85 + Math.random() * 0.3), 1);
      ship.userData.hinge.rotation.z = t < 1.9 ? 0.9 * (1 - seg(t, 1.7, 1.95)) : 0;
      cruise = seg(t, DEPART, DEPART + 0.8) * (1 - seg(t, end - 1.4, end - 0.4));
      if (this.pA.userData.sphere) this.pA.userData.sphere.rotation.y = t * 0.03;
      if (this.pB.userData && this.pB.userData.sphere) this.pB.userData.sphere.rotation.y = t * 0.05; else this.pB.rotation.y = t * 0.1;
      const cam = this.spaceCam;
      if (t < 2.6) {
        cam.position.set(-1 + t * 0.6, 3 + lift * 6, 17 - t * 0.5);
        cam.lookAt(-1 + t * 0.8, 1.5 + lift * 10, 0);
      } else if (this.kind === 'finale' && t > 6.6) {
        const k = seg(t, 6.6, 9.5);
        cam.position.set(ship.position.x - 20 + k * 6, ship.position.y + 6 + k * 4, ship.position.z + 24 - k * 4);
        cam.lookAt(this.pB.position.x * (0.4 + k * 0.6) + ship.position.x * (0.6 - k * 0.6), ship.position.y - k * 10, this.pB.position.z * k + ship.position.z * (1 - k));
      } else {
        const k = seg(t, 2.6, 3.6);
        cam.position.copy(ship.position).add(new THREE.Vector3(-14 + k * 2, 4, 12 - k * 2));
        cam.lookAt(ship.position.x + 6, ship.position.y, ship.position.z);
      }
    }
    this.streaks.material.opacity = cruise * 0.8;
    const a = this.streaks.geometry.attributes.position;
    this.streakSeeds.forEach((s, i) => {
      s.x -= dt * 160 * cruise;
      if (s.x < -60) s.x += 120;
      const bx = ship.position.x + s.x, by = ship.position.y + s.y, bz = ship.position.z + s.z;
      a.setXYZ(i * 2, bx, by, bz);
      a.setXYZ(i * 2 + 1, bx + s.l * (1 + cruise * 3), by, bz);
    });
    a.needsUpdate = true;
  }

  updateArrival(dt) {
    const T = this.t - this.tSpace;
    const R = this.robot, f = this.fake, ship = this.landShip;
    if (this.land.children.indexOf(R.root) < 0) this.land.add(R.root);
    // 0–2.4s: descend and touch down
    const k = seg(T, 0, 2.4);
    const landY = 1.46;
    ship.position.set(-26 * (1 - k) * (1 - k), landY + 34 * Math.pow(1 - k, 2), -6 * (1 - k));
    ship.rotation.set(0, -0.3 * (1 - k), 0.35 * (1 - k) - 0.25 * (1 - k) * (1 - k));
    ship.userData.flame.visible = T < 2.6;
    ship.userData.flame.rotation.z = Math.PI / 2 + (1 - k) * 0.2 + k * 1.2;   // swing the jet downward for landing
    ship.userData.flame.scale.set(1, (0.7 + (1 - k)) * (0.85 + Math.random() * 0.3), 1);
    // touchdown dust ring
    const dustT = T - 2.2;
    for (const d of this.landDust) {
      const on = dustT > 0 && dustT < 1.6;
      d.visible = on;
      if (on) {
        const r = 1.5 + dustT * 5;
        d.position.set(Math.cos(d.userData.a) * r, 0.4 + dustT * 0.6, Math.sin(d.userData.a) * r * 0.6);
        d.scale.setScalar(1.5 + dustT * 2.5);
        d.material.opacity = 0.6 * (1 - dustT / 1.6);
      }
    }
    // 2.6–3.1s: canopy opens
    ship.userData.hinge.rotation.z = seg(T, 2.6, 3.1) * 1.1;
    // robot: seated → hops out with a flip → lands on the pad → waves
    if (T < 3.15) {
      R.root.scale.setScalar(0.55);
      R.root.position.copy(ship.localToWorld(new THREE.Vector3(0.6, 0.15, 0)));
      R.root.rotation.y = Math.PI / 2;
      f.state = 'idle';
      R.update(f, dt, this.t, {});
    } else if (T < 3.9) {
      const u = (T - 3.15) / 0.75;
      if (!this._hop) { this._hop = true; R.trigger('doublejump'); }
      R.root.scale.setScalar(0.55 + 0.45 * ease(u * 2));
      f.facing = -1; f.state = u < 0.5 ? 'jump' : 'fall';
      R.update(f, dt, this.t, {});
      R.root.position.set(0.9 - u * 3.6, 1.7 + Math.sin(u * Math.PI) * 2.4 - u * 1.7, 0.6 * u);
    } else {
      if (!this._landed) { this._landed = true; R.trigger('land'); }
      R.root.scale.setScalar(1);
      R.root.position.set(-2.7, 0, 0.6);
      R.update(f, dt, this.t, { win: T > 4.1 });
    }
    this.landRing.material.emissiveIntensity = 1.5 + Math.sin(this.t * 6) * 0.8;
    this.landBackdrop.update(this.t, 0, 0);
    // camera: wide establishing → push in on the robot
    const cam = this.landCam;
    const c = seg(T, 2.0, 5.2);
    const follow = 1 - seg(T, 0.6, 2.4);         // track the descending ship, then settle on the pad
    cam.position.set(-1 + c * -1.5 - follow * 6, 4.5 - c * 2.6 + follow * 6, 20 - c * 11 + follow * 6);
    cam.lookAt((-1 - c * 1.6) * (1 - follow) + ship.position.x * follow, (1.8 - c * 0.7) * (1 - follow) + ship.position.y * follow, ship.position.z * follow);
  }

  fade() {
    const t = this.t;
    let f = Math.max(1 - t / 0.5, seg(t, this.duration - 0.6, this.duration));
    if (this.to) f = Math.max(f, seg(t, this.tSpace - 0.45, this.tSpace) * (1 - seg(t, this.tSpace, this.tSpace + 0.45)));
    return f;
  }

  render() {
    const r = this.r;
    const w = r.domElement.clientWidth || window.innerWidth, h = r.domElement.clientHeight || window.innerHeight;
    const arrival = this.to && this.t >= this.tSpace;
    const cam = arrival ? this.landCam : this.spaceCam;
    cam.aspect = w / h;
    cam.updateProjectionMatrix();
    r.render(arrival ? this.land : this.space, cam);
  }

  dispose() {
    for (const sc of [this.space, this.land]) {
      if (!sc) continue;
      sc.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material && o.material.map && !o.material.userData.shared) o.material.map.dispose();
      });
    }
  }
}
