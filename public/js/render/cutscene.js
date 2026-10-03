// Between-world cutscene: the robot runs to its ship, jumps in, launches from
// the finished planet and flies through space to the next world.
import * as THREE from 'three';
import { WORLDS } from '../core/config.js';
import { Robot } from './robot.js';
import { makeShip, mat } from './vehicles.js';
import { planetTexture, ringTexture, glowTexture } from './textures.js';
import { makeRng } from '../core/rng.js';

export const CUTSCENE_DURATION = 9.5;

const ease = (x) => (x < 0 ? 0 : x > 1 ? 1 : x * x * (3 - 2 * x));
const seg = (t, a, b) => ease((t - a) / (b - a));

function planet(world, radius, seed) {
  const g = new THREE.Group();
  const tex = planetTexture(world, seed);
  const m = world.planet.emissive ? new THREE.MeshBasicMaterial({ map: tex }) : new THREE.MeshStandardMaterial({ map: tex, roughness: 0.85 });
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
  // atmosphere rim
  const atm = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(world.planet.emissive ? 0xffa030 : world.sky[1]), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: world.planet.emissive ? 1 : 0.55 }));
  atm.scale.setScalar(radius * (world.planet.emissive ? 4 : 2.6));
  g.add(atm);
  return g;
}

export class Cutscene {
  constructor(renderer, fromIdx, toIdx) {
    this.r = renderer;
    this.t = 0;
    this.duration = CUTSCENE_DURATION;
    this.done = false;
    this.from = WORLDS[fromIdx];
    this.to = toIdx != null ? WORLDS[toIdx] : null;
    const scene = this.scene = new THREE.Scene();
    scene.background = new THREE.Color(0x02030a);
    this.camera = new THREE.PerspectiveCamera(45, 16 / 9, 0.1, 5000);

    scene.add(new THREE.HemisphereLight(0xbfd8ff, 0x202030, 0.9));
    const key = new THREE.DirectionalLight(0xffffff, 2.8);
    key.position.set(-30, 40, 30);
    scene.add(key);

    // starfield + warp streaks
    const rng = makeRng(fromIdx * 13 + 1);
    const N = 2500;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      pos[i * 3] = rng.range(-600, 1600);
      pos[i * 3 + 1] = rng.range(-400, 400);
      pos[i * 3 + 2] = rng.range(-900, -60);
    }
    const sg = new THREE.BufferGeometry();
    sg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.stars = new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xffffff, size: 1.6, sizeAttenuation: false }));
    scene.add(this.stars);
    const streakN = 300;
    const sp = new Float32Array(streakN * 6);
    this.streakSeeds = [];
    for (let i = 0; i < streakN; i++) this.streakSeeds.push({ x: rng.range(-60, 60), y: rng.range(-30, 30), z: rng.range(-40, 10), l: rng.range(2, 8) });
    const stg = new THREE.BufferGeometry();
    stg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
    this.streaks = new THREE.LineSegments(stg, new THREE.LineBasicMaterial({ color: 0x9ad0ff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending }));
    this.streaks.frustumCulled = false;
    scene.add(this.streaks);

    // origin planet with a launch pad on top
    this.pA = planet(this.from, 70, fromIdx + 1);
    this.pA.position.set(0, -71.5, -10);
    scene.add(this.pA);
    const pad = new THREE.Group();
    const padTop = new THREE.Mesh(new THREE.CylinderGeometry(5, 5.5, 0.6, 40), mat(0xd8dde6, { metalness: 0.6, roughness: 0.25 }));
    padTop.position.y = -0.3;
    pad.add(padTop);
    const padRing = new THREE.Mesh(new THREE.TorusGeometry(4.4, 0.08, 8, 64), mat(0x5ad8ff, { emissive: 0x5ad8ff, emissiveIntensity: 2 }));
    padRing.rotation.x = Math.PI / 2; padRing.position.y = 0.02;
    pad.add(padRing);
    scene.add(pad);

    // destination planet far ahead
    if (this.to) {
      this.pB = planet(this.to, 60, toIdx + 1);
      this.pB.position.set(900, -20, -400);
      scene.add(this.pB);
    } else {
      // finale: a spiral galaxy
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
      this.pB.position.set(900, -20, -400);
      this.pB.rotation.x = 0.5;
      scene.add(this.pB);
    }

    this.ship = makeShip();
    this.ship.position.set(1.5, 1.25, 0);
    scene.add(this.ship);

    this.robot = new Robot();
    this.robot.root.position.set(-7, 0, 0);
    scene.add(this.robot.root);
    this.fake = { x: -7, y: 0, vx: 0, vy: 0, facing: 1, state: 'idle' };
  }

  skip() { this.t = this.duration; this.done = true; }

  // Title card text for the HUD overlay; null when hidden.
  caption() {
    const t = this.t;
    if (t < 1.5) return { big: this.from.name.toUpperCase(), small: 'WORLD COMPLETE' };
    if (this.to && t > 6.2) return { big: this.to.name.toUpperCase(), small: `WORLD ${WORLDS.indexOf(this.to) + 1}` };
    if (!this.to && t > 6.2) return { big: 'THE END', small: 'ALL 700 LEVELS CLEARED' };
    return null;
  }

  update(dt) {
    this.t = Math.min(this.duration, this.t + dt);
    const t = this.t;
    const R = this.robot, f = this.fake, ship = this.ship;

    // --- robot runs to ship and jumps into the cockpit
    if (t < 1.2) {
      f.x = -7 + seg(t, 0.1, 1.2) * 5.0; f.y = 0; f.vx = 8; f.state = t > 0.1 ? 'run' : 'idle';
    } else if (t < 1.9) {
      const k = (t - 1.2) / 0.7;
      f.x = -2 + k * 4.2; f.y = Math.sin(k * Math.PI) * 3.0 + k * 1.3; f.vx = 6; f.state = k < 0.5 ? 'jump' : 'fall';
      if (k > 0.05 && !this._flipped) { R.trigger('doublejump'); this._flipped = true; }
    } else {
      f.state = 'idle'; f.vx = 0;
    }
    R.update(f, dt, t, {});
    if (t < 1.9) { R.root.position.set(f.x, f.y, 0); R.root.scale.setScalar(1); }
    else {
      // seated in the canopy
      R.root.scale.setScalar(0.55);
      const local = new THREE.Vector3(0.6, 0.15, 0);
      ship.localToWorld(local);
      R.root.position.copy(local);
      R.root.rotation.y = Math.PI / 2;
    }

    // --- launch then travel
    const lift = seg(t, 2.0, 3.4);
    const travel = seg(t, 3.0, 8.6);
    const startX = 1.5;
    ship.position.x = startX + travel * 880;
    ship.position.y = 1.25 + lift * 18 + Math.sin(t * 2) * 0.2 * lift - seg(t, 7.6, 9.5) * 10;
    ship.position.z = -seg(t, 3.0, 8.6) * 380;
    ship.rotation.z = lift * 0.35 * (1 - travel) + Math.sin(t * 1.5) * 0.04;
    ship.rotation.y = -travel * 0.35;
    const flame = ship.userData.flame;
    flame.visible = t > 1.95;
    flame.scale.set(1, (t > 3 ? 1.6 : 0.6 + lift) * (0.85 + Math.random() * 0.3), 1);

    // warp streaks while cruising
    const cruise = seg(t, 3.4, 4.2) * (1 - seg(t, 7.2, 8.2));
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

    this.pA.userData.sphere && (this.pA.userData.sphere.rotation.y = t * 0.03);
    if (this.pB.userData && this.pB.userData.sphere) this.pB.userData.sphere.rotation.y = t * 0.05;
    else this.pB.rotation.y = t * 0.1;

    // --- camera direction: side shot → chase cam → arrival wide shot
    const cam = this.camera;
    if (t < 2.6) {
      cam.position.set(-1 + t * 0.6, 3 + lift * 6, 17 - t * 0.5);
      cam.lookAt(-1 + t * 0.8, 1.5 + lift * 10, 0);
    } else if (t < 6.6) {
      const k = seg(t, 2.6, 3.6);
      const off = new THREE.Vector3(-14 + k * 2, 4, 12 - k * 2);
      cam.position.copy(ship.position).add(off);
      cam.lookAt(ship.position.x + 6, ship.position.y, ship.position.z);
    } else {
      const k = seg(t, 6.6, 9.5);
      cam.position.set(ship.position.x - 20 + k * 6, ship.position.y + 6 + k * 4, ship.position.z + 24 - k * 4);
      cam.lookAt(this.pB.position.x * (0.4 + k * 0.6) + ship.position.x * (0.6 - k * 0.6), ship.position.y - k * 10, this.pB.position.z * k + ship.position.z * (1 - k));
    }
    if (t >= this.duration) this.done = true;
    return this.done;
  }

  fade() {
    // 0 = clear, 1 = black: fade in at start, out at end
    const t = this.t;
    return Math.max(1 - t / 0.5, seg(t, this.duration - 0.6, this.duration));
  }

  render() {
    const r = this.r;
    const w = r.domElement.clientWidth || window.innerWidth, h = r.domElement.clientHeight || window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    r.render(this.scene, this.camera);
  }

  dispose() {
    this.scene.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material && o.material.map) o.material.map.dispose();
    });
  }
}
