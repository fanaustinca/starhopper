// Cutscenes with the mothership, built from three shots:
//   depart – in the finished world's real scenery: the robot runs up the
//            hangar ramp, the ramp closes, VTOL thrusters lift the ship and
//            the main engines carry it away nose-first
//   cruise – flight through space along a smooth curve; the ship always faces
//            its direction of travel and banks into turns
//   arrive – in the next world's scenery: the ship glides in, hovers, settles
//            on its legs, lowers the ramp, and the robot walks out and waves
// Kinds: 'intro' (cruise to the Sun + arrive), 'transfer' (depart → cruise →
// arrive), 'finale' (depart → cruise to a galaxy).
import * as THREE from 'three';
import { WORLDS, LEVELS_PER_WORLD, lastLevelOfWorld } from '../core/config.js';
import { getLevel } from '../levels/index.js';
import { Robot } from './robot.js';
import { makeMothership, SHIP_LEG_DROP, mat } from './vehicles.js';
import { planetTexture, ringTexture, glowTexture } from './textures.js';
import { buildBackdrop } from './decor.js';
import { tickShaders, plasmaMaterial, starMaterial, accretionMaterial } from './shaders.js';
import { makeRng } from '../core/rng.js';

const ease = (x) => (x < 0 ? 0 : x > 1 ? 1 : x * x * (3 - 2 * x));
const seg = (t, a, b) => ease((t - a) / (b - a));
const DEPART = 4.4, CRUISE = 4.0, ARRIVE = 6.2;
const UP = new THREE.Vector3(0, 1, 0);
const RAMP_OPEN = 2.03;   // radians: the ramp tip rests on the pad

function planet(world, radius, seed) {
  if (world.planet.blackhole) return blackHole(radius);
  const g = new THREE.Group();
  const m = world.planet.emissive ? starMaterial() : new THREE.MeshStandardMaterial({ map: planetTexture(world, seed), roughness: 0.85 });
  const s = new THREE.Mesh(new THREE.SphereGeometry(radius, 96, 64), m);
  g.add(s);
  g.userData.sphere = s;
  if (world.planet.rings) {
    const geo = new THREE.RingGeometry(radius * 1.35, radius * 2.3, 160, 1);
    const pos = geo.attributes.position, uv = geo.attributes.uv;
    for (let i = 0; i < pos.count; i++) uv.setXY(i, (Math.hypot(pos.getX(i), pos.getY(i)) - radius * 1.35) / (radius * 0.95), 0.5);
    const ring = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: ringTexture(world.planet.color), side: THREE.DoubleSide, transparent: true, depthWrite: false }));
    ring.rotation.x = Math.PI / 2 - 0.3;
    g.add(ring);
  }
  const atm = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(world.planet.emissive ? 0xffa030 : world.sky[1]), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: world.planet.emissive ? 1 : 0.5 }));
  atm.scale.setScalar(radius * (world.planet.emissive ? 4.2 : 2.5));
  g.add(atm);
  return g;
}

export function blackHole(radius) {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(new THREE.SphereGeometry(radius, 64, 40), new THREE.MeshBasicMaterial({ color: 0x000000 })));
  const disk = new THREE.Mesh(new THREE.RingGeometry(radius * 1.25, radius * 3.4, 128, 4), accretionMaterial());
  disk.rotation.x = Math.PI / 2 - 0.22;
  g.add(disk);
  const halo = new THREE.Mesh(new THREE.TorusGeometry(radius * 1.12, radius * 0.06, 16, 128), new THREE.MeshBasicMaterial({ color: 0xffc070, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }));
  g.add(halo);
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(0xff8a30), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.55 }));
  glow.scale.setScalar(radius * 7);
  g.add(glow);
  g.userData.sphere = disk;
  return g;
}

// Aim the ship's nose along `dir`, rolled by `bank` radians.
function orient(ship, dir, bank = 0) {
  ship.up.copy(UP);
  ship.lookAt(ship.position.clone().add(dir));
  ship.rotateZ(bank);
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
    this.fake = { x: 0, y: 0, vx: 0, vy: 0, facing: 1, state: 'idle' };
    this.ship = makeMothership();
    this.ship.userData.inner.rotation.y = -Math.PI / 2;    // nose → +z so lookAt() aims it
    if (this.kind === 'intro') this.shots = [['cruise', 0, CRUISE + 0.6], ['arrive', CRUISE + 0.6, CRUISE + 0.6 + ARRIVE]];
    else if (this.kind === 'transfer') this.shots = [['depart', 0, DEPART], ['cruise', DEPART, DEPART + CRUISE], ['arrive', DEPART + CRUISE, DEPART + CRUISE + ARRIVE]];
    else this.shots = [['depart', 0, DEPART], ['cruise', DEPART, DEPART + 5.2]];
    this.duration = this.shots[this.shots.length - 1][2];
    if (this.from) this.departScene = this.buildGround(lastLevelOfWorld(fromIdx), this.from);
    this.buildSpace(fromIdx, toIdx);
    if (this.to) this.arriveScene = this.buildGround(toIdx * LEVELS_PER_WORLD + 1, this.to);
    this.camera = new THREE.PerspectiveCamera(42, 16 / 9, 0.3, 40000);
    this.shotName = null;
    this.scene = null;
  }

  // ------------------------------------------------------------------ ground (depart / arrive)
  buildGround(levelIndex, W) {
    let level;
    try { level = getLevel(levelIndex); } catch { level = null; }
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(W.fog, W.fogDensity * 0.7);
    scene.environment = this.r.__env || null;
    scene.environmentIntensity = 0.3;
    scene.add(new THREE.HemisphereLight(W.light, W.id === 'sun' ? 0xff5a10 : W.ambient, 0.85));
    const key = new THREE.DirectionalLight(W.light, W.id === 'biolumina' ? 1.1 : 1.8);
    key.position.set(30, 60, 40);
    scene.add(key);
    if (W.id === 'sun') { const under = new THREE.DirectionalLight(0xff8a30, 1.6); under.position.set(0, -1, 0.4); scene.add(under); }
    const backdrop = level ? buildBackdrop(level) : { group: new THREE.Group(), update() {} };
    scene.add(backdrop.group);
    const pad = new THREE.Group();
    const padTop = new THREE.Mesh(new THREE.CylinderGeometry(19, 20, 0.8, 64), mat(new THREE.Color(W.platTop).multiplyScalar(0.7).getHex(), { metalness: 0.5, roughness: 0.4 }));
    padTop.position.y = -0.4; pad.add(padTop);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(15, 4, 10, 48), mat(W.plat, { metalness: 0.4, roughness: 0.5 }));
    base.position.y = -5.8; pad.add(base);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(17.5, 0.18, 8, 96), new THREE.MeshStandardMaterial({ color: W.accent, emissive: W.accent, emissiveIntensity: 1.6 }));
    ring.rotation.x = Math.PI / 2; ring.position.y = 0.03; pad.add(ring);
    const mark = new THREE.Mesh(new THREE.RingGeometry(9, 9.4, 64), new THREE.MeshBasicMaterial({ color: W.accent, transparent: true, opacity: 0.6 }));
    mark.rotation.x = -Math.PI / 2; mark.position.y = 0.04; pad.add(mark);
    scene.add(pad);
    const dust = [];
    const dustMat = new THREE.SpriteMaterial({ map: glowTexture(0xffffff), transparent: true, opacity: 0, depthWrite: false, color: W.id === 'sun' ? 0xffb060 : 0xd8d0c8 });
    for (let i = 0; i < 24; i++) { const d = new THREE.Sprite(dustMat.clone()); d.userData.a = (i / 24) * Math.PI * 2; d.visible = false; scene.add(d); dust.push(d); }
    return { scene, backdrop, ring, dust };
  }

  // ------------------------------------------------------------------ space
  buildSpace(fromIdx, toIdx) {
    const scene = this.space = new THREE.Scene();
    scene.background = new THREE.Color(0x01020a);
    scene.environment = this.r.__env || null;
    scene.environmentIntensity = 0.3;
    scene.add(new THREE.HemisphereLight(0xbfd8ff, 0x202030, 0.7));
    const key = new THREE.DirectionalLight(0xfff4e0, 2.2);
    key.position.set(-1, 1, 1);
    scene.add(key);
    const rng = makeRng((fromIdx ?? 99) * 13 + 1);
    const N = 5000, pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const u = rng.next() * 2 - 1, a = rng.next() * Math.PI * 2, r = Math.sqrt(1 - u * u);
      pos[i * 3] = Math.cos(a) * r * 18000; pos[i * 3 + 1] = u * 18000; pos[i * 3 + 2] = Math.sin(a) * r * 18000;
    }
    const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    scene.add(new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xffffff, size: 1.7, sizeAttenuation: false })));
    const pts = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(1200, 260, -500), new THREE.Vector3(2600, 120, -1600), new THREE.Vector3(3700, -260, -2700), new THREE.Vector3(4400, -520, -3500)];
    this.path = new THREE.CatmullRomCurve3(pts);
    if (this.from) {
      this.pA = planet(this.from, 900, fromIdx + 1);
      this.pA.position.set(-500, -1300, 900);
      scene.add(this.pA);
    }
    if (this.kind === 'intro') {
      this.pB = planet(WORLDS[0], 1500, 1);
      this.pB.position.set(6200, -1100, -5400);
      for (let i = 0; i < 8; i++) {
        const a = rng.range(-1.4, 1.4), r = 1505, span = rng.range(250, 600);
        const loop = [];
        for (let k = 0; k <= 12; k++) {
          const u = k / 12, ang = a + (u - 0.5) * span / r, lift = Math.sin(u * Math.PI) * span * 0.55;
          loop.push(new THREE.Vector3(Math.sin(ang) * (r + lift), Math.cos(ang) * (r + lift), rng.range(-30, 30)));
        }
        this.pB.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(loop), 60, rng.range(20, 45), 10), plasmaMaterial()));
      }
    } else if (this.to) {
      this.pB = planet(this.to, 1000, toIdx + 1);
      this.pB.position.set(6000, -1000, -5200);
    } else {
      const gN = 9000, gp = new Float32Array(gN * 3), gc = new Float32Array(gN * 3);
      for (let i = 0; i < gN; i++) {
        const arm = i % 3, r = Math.pow(rng.next(), 0.6) * 2400, a = r * 0.003 + (arm * Math.PI * 2) / 3 + rng.range(-0.3, 0.3);
        gp[i * 3] = Math.cos(a) * r; gp[i * 3 + 1] = rng.range(-60, 60) * (1 - r / 2700); gp[i * 3 + 2] = Math.sin(a) * r;
        const c = new THREE.Color().setHSL(0.6 - r / 6000, 0.8, 0.6 + (1 - r / 2400) * 0.3);
        gc[i * 3] = c.r; gc[i * 3 + 1] = c.g; gc[i * 3 + 2] = c.b;
      }
      const gg = new THREE.BufferGeometry();
      gg.setAttribute('position', new THREE.BufferAttribute(gp, 3));
      gg.setAttribute('color', new THREE.BufferAttribute(gc, 3));
      this.pB = new THREE.Points(gg, new THREE.PointsMaterial({ size: 2.2, sizeAttenuation: false, vertexColors: true, blending: THREE.AdditiveBlending, transparent: true }));
      this.pB.position.set(7000, -800, -6000);
      this.pB.rotation.x = 0.5;
    }
    scene.add(this.pB);
    this.streakSeeds = [];
    for (let i = 0; i < 400; i++) this.streakSeeds.push({ x: rng.range(-140, 140), y: rng.range(-70, 70), z: rng.range(-140, 140), l: rng.range(20, 70) });
    const stg = new THREE.BufferGeometry(); stg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(400 * 6), 3));
    this.streaks = new THREE.LineSegments(stg, new THREE.LineBasicMaterial({ color: 0x9ad0ff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending }));
    this.streaks.frustumCulled = false;
    scene.add(this.streaks);
  }

  skip() { this.t = this.duration; this.done = true; }

  currentShot() {
    for (const s of this.shots) if (this.t < s[2]) return s;
    return this.shots[this.shots.length - 1];
  }

  caption() {
    const [shot, a] = this.currentShot();
    const k = this.t - a;
    if (this.kind === 'intro' && shot === 'cruise' && k < 2.8) return { big: 'STARHOPPER', small: 'NOW APPROACHING · THE SUN' };
    if (shot === 'depart' && k < 1.8) return { big: this.from.name.toUpperCase(), small: 'WORLD COMPLETE' };
    if (shot === 'cruise' && this.to && this.kind !== 'intro' && k > 0.6) return { big: this.to.name.toUpperCase(), small: this.to.bonus ? 'NO TURNING BACK' : 'NEXT STOP' };
    if (shot === 'cruise' && !this.to && k > 2.2) return { big: 'THE END', small: 'YOU ESCAPED THE BLACK HOLE · ALL 421 LEVELS' };
    if (shot === 'arrive' && k > 3.8) return this.to.bonus ? { big: 'THE END', small: 'BONUS LEVEL · INSIDE THE BLACK HOLE' } : { big: this.to.name.toUpperCase(), small: `WORLD ${this.toIdx + 1}` };
    return null;
  }

  update(dt) {
    this.t = Math.min(this.duration, this.t + dt);
    tickShaders(this.t + 50);
    const [shot, a] = this.currentShot();
    if (shot !== this.shotName) this.enterShot(shot);
    const k = this.t - a;
    if (shot === 'depart') this.updateDepart(k, dt);
    else if (shot === 'cruise') this.updateCruise(k, dt);
    else this.updateArrive(k, dt);
    const blink = Math.sin(this.t * 6) > 0.6;
    for (const n of this.ship.userData.navLights) n.visible = blink;
    if (this.t >= this.duration) this.done = true;
    return this.done;
  }

  enterShot(name) {
    this.shotName = name;
    const host = name === 'depart' ? this.departScene.scene : name === 'cruise' ? this.space : this.arriveScene.scene;
    host.add(this.ship);
    this.board();
    this.camInit = false;
  }

  // the robot rides INSIDE the ship — parented to it, so it can never lag behind
  board() {
    const R = this.robot;
    this.ship.userData.inner.add(R.root);
    R.root.position.set(3, -2.2, 1.2);
    R.root.rotation.set(0, 0, 0);
    R.root.visible = false;
  }

  flames(main, lift) {
    const u = this.ship.userData;
    for (const f of u.mainFlames) { f.visible = main > 0.02; f.scale.set(1, Math.max(0.01, main) * (0.85 + Math.random() * 0.3), 1); }
    for (const f of u.liftFlames) { f.visible = lift > 0.02; f.scale.set(1, Math.max(0.01, lift) * (0.8 + Math.random() * 0.4), 1); }
  }

  walkRobot(scene, from, to, k, dt) {
    const R = this.robot;
    if (R.root.parent !== scene) { scene.add(R.root); R.root.visible = true; R.root.scale.setScalar(1); }
    R.root.position.copy(from.clone().lerp(to, k));
    const f = this.fake;
    f.state = k > 0 && k < 1 ? 'run' : 'idle';
    f.vx = f.state === 'run' ? 7 : 0;
    R.update(f, dt, this.t, {});
    R.root.rotation.y = Math.atan2(to.x - from.x, to.z - from.z);
  }

  updateDepart(k, dt) {
    const G = this.departScene, ship = this.ship, u = ship.userData;
    const landY = SHIP_LEG_DROP;
    const tip = new THREE.Vector3(3, 0, 7.6), door = new THREE.Vector3(3, 2.4, 3.2);
    if (k < 1.6) {
      u.ramp.rotation.x = RAMP_OPEN;
      if (k < 0.9) this.walkRobot(G.scene, new THREE.Vector3(-8, 0, 13), tip, seg(k, 0, 0.9), dt);
      else this.walkRobot(G.scene, tip, door, seg(k, 0.9, 1.6), dt);
    } else {
      if (this.robot.root.parent !== u.inner) this.board();
      u.ramp.rotation.x = RAMP_OPEN * (1 - seg(k, 1.6, 2.1));
    }
    const lift = seg(k, 2.1, 3.2);
    const go = seg(k, 3.0, DEPART);
    const pos = new THREE.Vector3(go * go * 160, landY + lift * 9 + go * go * 70, -go * go * 40);
    ship.position.copy(pos);
    orient(ship, new THREE.Vector3(1, 0.04 + go * 0.45, -go * 0.25).normalize());
    this.flames(go * 1.2, k > 2.0 ? (1 - go) : 0);
    G.ring.material.emissiveIntensity = 1.2 + Math.sin(this.t * 6) * 0.5;
    this.dust(G, k - 2.1, true);
    G.backdrop.update(this.t, 0, 0);
    this.camera.position.set(-26 + go * 10, 7 + go * 20, 44);
    this.camera.lookAt(pos.x * 0.6, 3 + pos.y * 0.6, pos.z * 0.6);
    this.scene = G.scene;
  }

  updateCruise(k, dt) {
    const dur = this.shots.find((s) => s[0] === 'cruise');
    const len = dur[2] - dur[1];
    const s = Math.min(0.999, ease(k / len) * 0.92 + 0.04);
    const ship = this.ship;
    const pos = this.path.getPointAt(s);
    const tan = this.path.getTangentAt(s);
    const ahead = this.path.getTangentAt(Math.min(1, s + 0.04));
    const turn = new THREE.Vector3().crossVectors(tan, ahead).y;   // sideways swing of the heading
    ship.position.copy(pos);
    orient(ship, tan, THREE.MathUtils.clamp(-turn * 18, -0.6, 0.6));
    this.flames(1.3, 0);
    if (this.pA && this.pA.userData.sphere) this.pA.userData.sphere.rotation.y = this.t * 0.01;
    if (this.pB.userData && this.pB.userData.sphere) this.pB.userData.sphere.rotation.y = this.t * 0.02; else this.pB.rotation.y = this.t * 0.05;
    const back = tan.clone().multiplyScalar(-58 + k * 4);
    const side = new THREE.Vector3().crossVectors(tan, UP).normalize().multiplyScalar(30 - k * 6);
    // lock to the ship's frame (a lagging camera would fall kilometres behind at cruise speed)
    const offset = back.add(side).add(new THREE.Vector3(0, 13, 0));
    if (!this.camInit) { this.camOffset = offset.clone(); this.camInit = true; }
    this.camOffset.lerp(offset, Math.min(1, dt * 3));
    this.camera.position.copy(pos).add(this.camOffset);
    this.camera.lookAt(pos.clone().add(tan.clone().multiplyScalar(30)));
    const cruise = seg(k, 0.3, 1.0) * (1 - seg(k, len - 1.0, len - 0.2));
    this.streaks.material.opacity = cruise * 0.7;
    const a = this.streaks.geometry.attributes.position;
    this.streakSeeds.forEach((q, i) => {
      q.z -= dt * 900 * cruise;
      if (q.z < -140) q.z += 280;
      const base = pos.clone().add(new THREE.Vector3(q.x, q.y, 0)).add(tan.clone().multiplyScalar(q.z));
      const end = base.clone().add(tan.clone().multiplyScalar(q.l * (0.3 + cruise)));
      a.setXYZ(i * 2, base.x, base.y, base.z);
      a.setXYZ(i * 2 + 1, end.x, end.y, end.z);
    });
    a.needsUpdate = true;
    this.scene = this.space;
  }

  updateArrive(k, dt) {
    const G = this.arriveScene, ship = this.ship, u = ship.userData;
    const landY = SHIP_LEG_DROP;
    const g = seg(k, 0, 2.8);
    const start = new THREE.Vector3(-260, 90, -140), ctrl = new THREE.Vector3(-90, 30, -30), hover = new THREE.Vector3(0, landY + 7, 0);
    const bez = (t) => start.clone().multiplyScalar((1 - t) * (1 - t)).add(ctrl.clone().multiplyScalar(2 * (1 - t) * t)).add(hover.clone().multiplyScalar(t * t));
    const settle = seg(k, 2.8, 3.6);
    const pos = k < 2.8 ? bez(g) : new THREE.Vector3(0, landY + 7 * (1 - settle), 0);
    const vel = k < 2.8 ? bez(Math.min(1, g + 0.02)).sub(bez(g)) : new THREE.Vector3(1, 0, 0);
    vel.y *= 0.35;
    if (vel.lengthSq() < 1e-6) vel.set(1, 0, 0);
    vel.normalize();
    const heading = vel.lerp(new THREE.Vector3(1, 0, 0), seg(k, 1.8, 2.8)).normalize();
    ship.position.copy(pos);
    orient(ship, heading, (1 - g) * 0.25);
    this.flames((1 - g) * 1.2, seg(k, 1.4, 2.4) * (1 - seg(k, 3.5, 3.9)) * 1.1);
    this.dust(G, k - 3.0, false);
    u.ramp.rotation.x = RAMP_OPEN * seg(k, 3.9, 4.5);
    const door = new THREE.Vector3(3, 2.4, 3.2), tip = new THREE.Vector3(3, 0, 7.6), out = new THREE.Vector3(-1, 0, 11);
    if (k > 4.5) {
      if (k < 5.0) this.walkRobot(G.scene, door, tip, seg(k, 4.5, 5.0), dt);
      else if (k < 5.4) this.walkRobot(G.scene, tip, out, seg(k, 5.0, 5.4), dt);
      else {
        const R = this.robot;
        if (R.root.parent !== G.scene) G.scene.add(R.root);
        R.root.visible = true; R.root.position.copy(out);
        R.update(this.fake, dt, this.t, { win: true });
      }
    }
    G.ring.material.emissiveIntensity = 1.2 + Math.sin(this.t * 6) * 0.5;
    G.backdrop.update(this.t, 0, 0);
    const c = seg(k, 3.6, 6.0);
    const follow = 1 - seg(k, 1.6, 3.2);
    const wide = new THREE.Vector3(-30 + c * 16, 8 - c * 4, 48 - c * 22);
    const chase = pos.clone().add(new THREE.Vector3(-40, 12, 36));
    this.camera.position.copy(wide.lerp(chase, follow));
    this.camera.lookAt(new THREE.Vector3(-c, 4 - c * 2.4, c * 9).lerp(pos, follow));
    this.scene = G.scene;
  }

  dust(G, t0, up) {
    for (const d of G.dust) {
      const on = t0 > 0 && t0 < 1.8;
      d.visible = on;
      if (!on) continue;
      const r = 4 + t0 * 12;
      d.position.set(Math.cos(d.userData.a) * r, 0.6 + t0 * (up ? 1.6 : 0.8), Math.sin(d.userData.a) * r * 0.7);
      d.scale.setScalar(4 + t0 * 6);
      d.material.opacity = 0.55 * (1 - t0 / 1.8);
    }
  }

  fade() {
    const t = this.t;
    let f = Math.max(1 - t / 0.5, seg(t, this.duration - 0.6, this.duration));
    for (let i = 1; i < this.shots.length; i++) {
      const c = this.shots[i][1];
      f = Math.max(f, seg(t, c - 0.4, c) * (1 - seg(t, c, c + 0.4)));
    }
    return f;
  }

  render() {
    const r = this.r;
    const w = r.domElement.clientWidth || window.innerWidth, h = r.domElement.clientHeight || window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    if (this.scene) r.render(this.scene, this.camera);
  }

  dispose() {
    for (const sc of [this.space, this.departScene && this.departScene.scene, this.arriveScene && this.arriveScene.scene]) {
      if (!sc) continue;
      sc.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material && o.material.map && !o.material.userData.shared) o.material.map.dispose();
      });
    }
  }
}
