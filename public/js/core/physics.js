// Player controller + swept AABB collision.
// Player position: x = centre, y = feet. Colliders: x,y = bottom-left corner.
//
// Collider fields: { x, y, w, h, oneWay, active, dx, dy, ice, conveyor, bounce, grab }
//   oneWay   – can be jumped through from below (moving platforms, vehicle decks)
//   dx/dy    – how far the collider moved this tick (used to carry the player)
//   bounce   – launch velocity applied on landing (mushrooms, launch pads)

import { PHYS } from './config.js';

const EPS = 0.02;

export function createPlayer(x, y) {
  return {
    x, y, vx: 0, vy: 0, extVx: 0,
    w: PHYS.w, h: PHYS.h,
    onGround: false, ground: null,
    jumps: 0, coyote: 0, buffer: 0, jumpHeld: false,
    facing: 1, state: 'idle',
    hang: null, climb: null, swing: null,
    regrab: 0, vineCooldown: 0, dropT: 0,
    airTime: 0,
  };
}

function approach(v, target, amount) {
  if (v < target) return Math.min(v + amount, target);
  if (v > target) return Math.max(v - amount, target);
  return v;
}

function overlaps(p, c) {
  return p.x - p.w / 2 < c.x + c.w - 1e-6 && p.x + p.w / 2 > c.x + 1e-6 &&
    p.y < c.y + c.h - 1e-6 && p.y + p.h > c.y + 1e-6;
}

// Returns a list of event names produced this tick (jump, doublejump, land, grab, climb, bounce, swing, release).
export function stepPlayer(p, input, world, env, dt) {
  const ev = [];
  const colliders = world.colliders;

  if (input.jumpPressed) p.buffer = PHYS.jumpBuffer;
  else p.buffer = Math.max(0, p.buffer - dt);
  p.regrab = Math.max(0, p.regrab - dt);
  p.vineCooldown = Math.max(0, p.vineCooldown - dt);
  p.dropT = Math.max(0, p.dropT - dt);

  // ---- Climbing up a ledge (short scripted tween) ----
  if (p.climb) {
    const c = p.climb;
    c.t += dt / PHYS.climbTime;
    const plat = c.plat;
    c.ex += plat.dx || 0; c.ey += plat.dy || 0;
    c.sx += plat.dx || 0; c.sy += plat.dy || 0;
    const k = Math.min(1, c.t);
    // rise first, then step over
    const ky = Math.min(1, k * 1.6);
    const kx = Math.max(0, (k - 0.35) / 0.65);
    p.x = c.sx + (c.ex - c.sx) * kx;
    p.y = c.sy + (c.ey - c.sy) * ky;
    p.vx = 0; p.vy = 0;
    p.state = 'climb';
    if (c.t >= 1) {
      p.climb = null;
      p.onGround = true; p.ground = plat;
      p.jumps = 0; p.coyote = PHYS.coyote;
      p.state = 'idle';
    }
    return ev;
  }

  // ---- Hanging from a ledge ----
  if (p.hang) {
    const h = p.hang;
    const plat = h.plat;
    if (plat.active === false) {
      p.hang = null; p.regrab = 0.3;
    } else {
      p.x += plat.dx || 0;
      p.y += plat.dy || 0;
      p.vx = 0; p.vy = 0; p.extVx = 0;
      p.state = 'hang';
      const away = (input.right && h.side < 0) || (input.left && h.side > 0);
      if (input.down || away) {
        p.hang = null; p.regrab = 0.35; p.jumps = 1;
        p.x -= h.side * -0.05;
      } else if (p.buffer > 0 || input.up) {
        p.buffer = 0;
        const top = plat.y + plat.h;
        const ex = h.side < 0 ? plat.x + 0.5 : plat.x + plat.w - 0.5;
        p.hang = null;
        p.climb = { t: 0, plat, sx: p.x, sy: p.y, ex, ey: top };
        ev.push('climb');
      }
      if (p.hang) return ev;
    }
  }

  // ---- Swinging on a vine ----
  if (p.swing) {
    const v = p.swing.vine;
    const g = PHYS.gravity * env.gravityScale;
    const L = p.swing.len;
    const dir = (input.right ? 1 : 0) - (input.left ? 1 : 0);
    if (dir) p.facing = dir;
    v.omega += (-(g / L) * Math.sin(v.angle) + dir * 2.2) * dt;
    v.omega *= 1 - 0.15 * dt;
    v.omega = Math.max(-3.2, Math.min(3.2, v.omega));
    v.angle += v.omega * dt;
    v.angle = Math.max(-1.25, Math.min(1.25, v.angle));
    p.x = v.ax + Math.sin(v.angle) * L;
    p.y = v.ay - Math.cos(v.angle) * L - p.h * 0.75;
    p.state = 'swing';
    if (p.buffer > 0) {
      p.buffer = 0;
      const tv = v.omega * L;
      p.vx = tv * Math.cos(v.angle);
      p.vy = tv * Math.sin(v.angle) + 9;
      p.extVx = 0;
      p.jumps = 1;
      p.swing = null;
      v.grabbed = false;
      p.vineCooldown = 0.45;
      p.jumpHeld = false;
      ev.push('release');
    } else {
      return ev;
    }
  }

  // ---- Horizontal control ----
  const dir = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  if (dir) p.facing = dir;
  const ice = p.onGround && p.ground && p.ground.ice;
  let accel;
  if (p.onGround) accel = dir ? PHYS.accelGround * (ice ? PHYS.iceAccel : 1) : PHYS.decelGround * (ice ? PHYS.iceDecel : 1);
  else accel = PHYS.accelAir;
  // turning around on ice is also sluggish
  if (p.onGround && dir && Math.sign(p.vx) === -dir) accel = (ice ? PHYS.iceAccel : 1) * PHYS.decelGround;
  p.vx = approach(p.vx, dir * PHYS.runSpeed, accel * dt);

  // external velocity: conveyors + wind (smoothed so gusts feel physical)
  const conveyor = p.onGround && p.ground && p.ground.conveyor ? p.ground.conveyor : 0;
  const wind = env.windAt ? env.windAt(p.x, p.y + p.h / 2) : 0;
  // grounded robots grip the floor: wind only nudges them
  p.extVx = approach(p.extVx, conveyor + wind * (p.onGround ? 0.3 : 1), (p.onGround ? 30 : 9) * dt);

  // ---- Jumping ----
  if (p.buffer > 0 && (p.onGround || p.coyote > 0)) {
    if (input.down && p.onGround && p.ground && p.ground.oneWay) {
      p.dropT = 0.25; p.buffer = 0; p.onGround = false; p.ground = null; p.jumps = 1;
      ev.push('drop');
    } else {
      p.vy = PHYS.jumpVel;
      p.jumps = 1;
      p.onGround = false; p.ground = null;
      p.coyote = 0; p.buffer = 0; p.jumpHeld = true;
      ev.push('jump');
    }
  } else if (input.jumpPressed && !p.onGround && p.jumps < 2) {
    p.vy = PHYS.doubleJumpVel;
    p.jumps = 2; p.buffer = 0; p.jumpHeld = false;
    ev.push('doublejump');
  }
  if (p.jumpHeld && !input.jump) {
    if (p.vy > 0) p.vy *= PHYS.jumpCut;
    p.jumpHeld = false;
  }
  if (p.vy <= 0) p.jumpHeld = false;

  // ---- Gravity ----
  const gMul = env.gravAt ? env.gravAt(p.x, p.y + p.h / 2) : 1;
  p.vy = Math.max(p.vy - PHYS.gravity * env.gravityScale * gMul * dt, -PHYS.maxFall);

  // ---- Ride the platform we stand on ----
  if (p.onGround && p.ground) {
    p.x += p.ground.dx || 0;
    p.y += p.ground.dy || 0;
  }

  // ---- Move X, resolve against solid colliders ----
  const prevL = p.x - p.w / 2, prevR = p.x + p.w / 2;
  p.x += (p.vx + p.extVx) * dt;
  for (const c of colliders) {
    if (c.oneWay || c.active === false) continue;
    if (!overlaps(p, c)) continue;
    // ignore if we're basically standing on it (seams)
    if (p.y >= c.y + c.h - EPS) continue;
    const cdx = c.dx || 0;
    if (prevR <= c.x - cdx + EPS) { p.x = c.x - p.w / 2; if (p.vx > 0) p.vx = 0; if (p.extVx > 0) p.extVx = 0; }
    else if (prevL >= c.x + c.w - cdx - EPS) { p.x = c.x + c.w + p.w / 2; if (p.vx < 0) p.vx = 0; if (p.extVx < 0) p.extVx = 0; }
    else {
      // penetration from a moving/toggled solid: push out along the cheaper side
      const pushL = (p.x + p.w / 2) - c.x, pushR = (c.x + c.w) - (p.x - p.w / 2);
      if (pushL < pushR) p.x -= pushL; else p.x += pushR;
      ev.push('squeeze');
    }
  }

  // ---- Move Y ----
  const prevBottom = p.y, prevTop = p.y + p.h;
  const wasGround = p.onGround;
  p.y += p.vy * dt;
  p.onGround = false; p.ground = null;
  let landedOn = null;
  for (const c of colliders) {
    if (c.active === false) continue;
    if (c.oneWay && p.dropT > 0) continue;
    if (!overlaps(p, c)) continue;
    const top = c.y + c.h;
    const tol = EPS + Math.max(0, c.dy || 0) + Math.max(0, -(p.vy * dt));
    if (p.vy <= 0 && prevBottom >= top - tol) {
      p.y = top; p.vy = 0;
      landedOn = c;
    } else if (!c.oneWay && p.vy > 0 && prevTop <= c.y + EPS + Math.abs(c.dy || 0)) {
      p.y = c.y - p.h; p.vy = 0;
      ev.push('bonk');
    }
  }
  if (landedOn) {
    if (landedOn.bounce) {
      p.vy = landedOn.bounce; p.jumps = 1; p.jumpHeld = false;
      ev.push('bounce');
    } else {
      p.onGround = true; p.ground = landedOn;
      if (!wasGround) ev.push('land');
    }
  }

  if (p.onGround) {
    p.jumps = 0; p.coyote = PHYS.coyote; p.airTime = 0;
  } else {
    p.coyote = Math.max(0, p.coyote - dt);
    p.airTime += dt;
    if (p.coyote <= 0 && p.jumps === 0) p.jumps = 1; // walked off: only the air jump remains
  }

  // ---- Ledge grab ----
  if (!p.onGround && p.vy < 0 && !input.down && p.regrab <= 0) {
    const hand = p.y + p.h * 0.9;
    for (const c of colliders) {
      if (c.active === false) continue;
      if (c.oneWay && !c.grab) continue;
      const top = c.y + c.h;
      if (hand < top - PHYS.grabWindow || hand > top + 0.12) continue;
      let side = 0;
      const r = p.x + p.w / 2, l = p.x - p.w / 2;
      if (r >= c.x - 0.28 && r <= c.x + 0.06 && (dir > 0 || (dir === 0 && p.facing > 0))) side = -1;
      else if (l <= c.x + c.w + 0.28 && l >= c.x + c.w - 0.06 && (dir < 0 || (dir === 0 && p.facing < 0))) side = 1;
      if (!side) continue;
      // need head-room above the ledge to climb
      const probe = { x: side < 0 ? c.x + 0.5 : c.x + c.w - 0.5, y: top + 0.05, w: p.w, h: p.h };
      if (colliders.some((o) => o !== c && o.active !== false && !o.oneWay && overlaps(probe, o))) continue;
      p.hang = { plat: c, side };
      p.x = side < 0 ? c.x - p.w / 2 - 0.01 : c.x + c.w + p.w / 2 + 0.01;
      p.y = top - p.h * 0.9;
      p.vx = 0; p.vy = 0; p.extVx = 0; p.jumps = 0;
      p.facing = side < 0 ? 1 : -1;
      p.state = 'hang';
      ev.push('grab');
      return ev;
    }
  }

  // ---- Vine catch ----
  if (!p.onGround && world.vines && p.vineCooldown <= 0) {
    for (const v of world.vines) {
      const tipX = v.ax + Math.sin(v.angle) * v.len;
      const tipY = v.ay - Math.cos(v.angle) * v.len;
      const cx = p.x, cy = p.y + p.h * 0.75;
      // grab anywhere along the lower 60% of the vine
      for (let k = 0.4; k <= 1.0001; k += 0.15) {
        const vx = v.ax + (tipX - v.ax) * k, vy = v.ay + (tipY - v.ay) * k;
        if (Math.abs(vx - cx) < 0.7 && Math.abs(vy - cy) < 0.8) {
          const L = v.len * k;
          v.grabbed = true;
          v.omega = (p.vx * Math.cos(v.angle) + p.vy * Math.sin(v.angle)) / L;
          p.swing = { vine: v, len: L };
          p.vx = 0; p.vy = 0; p.jumps = 0;
          ev.push('swing');
          return ev;
        }
      }
    }
  }

  // ---- Animation state ----
  if (p.onGround) p.state = Math.abs(p.vx) > 0.5 ? 'run' : 'idle';
  else p.state = p.vy > 0 ? (p.jumps >= 2 ? 'flip' : 'jump') : 'fall';
  return ev;
}

// ----------------------------------------------------------------------------
// Jump envelope: simulate the real controller to learn how far the robot can
// clear for a given height difference. Used by the generator and by tests.
// ----------------------------------------------------------------------------

const reachCache = new Map();

export function simulateJump(gravityScale, doubleAt, maxT = 3) {
  const p = createPlayer(0, 0);
  const ground = { x: -40, y: -1, w: 40.0, h: 1, active: true };
  p.vx = PHYS.runSpeed; p.onGround = true; p.ground = ground;
  const world = { colliders: [] };
  const env = { gravityScale };
  const pts = [];
  let t = 0, jumped = false, doubled = false;
  while (t < maxT) {
    const input = { right: true, jump: true, jumpPressed: false };
    if (!jumped) { input.jumpPressed = true; jumped = true; }
    else if (!doubled && doubleAt != null && t >= doubleAt) { input.jumpPressed = true; doubled = true; }
    stepPlayer(p, input, world, env, PHYS.dt);
    t += PHYS.dt;
    pts.push([p.x, p.y, p.vy]);
    if (p.y < -14) break;
  }
  return pts;
}

// For a height difference dy (target top minus takeoff top), the furthest
// horizontal distance from takeoff edge at which the player's leading edge can
// still arrive above the target top.
export function maxGapFor(dy, gravityScale = 1) {
  const key = gravityScale.toFixed(3);
  let table = reachCache.get(key);
  if (!table) {
    table = buildReachTable(gravityScale);
    reachCache.set(key, table);
  }
  const i = Math.round((dy + 12) / 0.25);
  if (i < 0) return table[0];
  if (i >= table.length) return 0;
  return table[i];
}

export function maxJumpHeight(gravityScale = 1) {
  const g = PHYS.gravity * gravityScale;
  const h1 = PHYS.jumpVel ** 2 / (2 * g);
  const h2 = PHYS.doubleJumpVel ** 2 / (2 * g);
  return h1 + h2;
}

function buildReachTable(gs) {
  const trajectories = [];
  for (let d = 0.15; d <= 1.6; d += 0.05) trajectories.push(simulateJump(gs, d / Math.sqrt(gs)));
  const table = [];
  for (let dy = -12; dy <= 6.0001; dy += 0.25) {
    let best = 0;
    for (const pts of trajectories) {
      // furthest x (player leading edge) while feet still above dy
      for (const [x, y] of pts) {
        if (y >= dy) best = Math.max(best, x + PHYS.w / 2);
      }
    }
    table.push(best);
  }
  return table;
}
