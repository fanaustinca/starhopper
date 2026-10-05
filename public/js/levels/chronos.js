// WORLD 14 — CHRONOS. 30 hand-written levels. The final world.
// Floating clockwork over the void, gravity 1.0. Signature mechanics:
//   warp movers (normal → 2.6x → frozen → reverse, 2.4s each), erratic gravity
//   zones, ticking blink seconds, clock-hand ferris wheels, hourglass sand,
//   pendulums, past/future switch blocks.
// Units: single jump ≈ 2.45 high, double ≈ 4.4 high / ~10.5 far, run 8.5/s.
import { L } from './dsl.js';

// a pendulum: a pad swinging on an arc around a pivot (ping-pong loop)
function pendulum(b, px, py, R, o = {}) {
  const deg = o.deg ?? 55, steps = 6, pts = [];
  for (let i = 0; i <= steps; i++) {
    const a = ((-deg + (2 * deg * i) / steps) * Math.PI) / 180;
    pts.push([px + R * Math.sin(a), py - R * Math.cos(a)]);
  }
  b.loop(pts, { loop: false, speed: o.speed ?? 4, w: o.w ?? 3, phase: o.phase ?? 0, warp: !!o.warp });
}

export default [
  // 1 ── meet time's three tempos one at a time: a warp pad, ticking seconds, a light-gravity chasm
  L('First Tick', 'intro', (b) => {
    b.start(-6, 0, 12);
    b.plat(10, 0, 6);
    b.arc(6, 0, 10, 0, 2, 1.6);
    b.slide(21, 0, 31, 0, { T: 5, w: 3.2, warp: true });
    b.cells(20, 1.4, 32, 1.4, 4);
    b.shard(26, 5.4);
    b.plat(36, 0, 6);
    // ticking seconds: each tile holds for three beats of four
    for (let i = 0; i < 4; i++) b.blink(46 + i * 5, 1 + (i % 2) * 0.8, 2.6, { P: 4, on: 3, off: -i * 0.8 });
    b.cells(47, 2.6, 62, 2.6, 4);
    b.plat(66, 2, 7);
    b.checkpoint(69, 2);
    // the chasm is too wide in normal time: wait for the light phase
    b.grav(73, -4, 16, 18, { low: 0.45, high: 1.2, P: 4, lowFrac: 0.6 });
    b.arc(73, 2, 89, 3, 5, 5);
    b.shard(81, 8.5);
    b.plat(89, 3, 7);
    b.plat(100, 4, 6);
    b.lift(108, 4, 10, { T: 4.5, warp: true });
    b.cells(108, 6, 108, 10, 3);
    b.plat(112, 10, 10);
    b.pendulum(98, 13, 9, { amp: 30, T: 4 });                 // a grandfather pendulum over the last gap
    b.vine(64, 9, 6);                                         // a golden chain over the ticking gap
    b.goal(118, 10);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 2 ── tumble down through two stacked hourglasses: drop through each neck between falling grains of sand
  L('Hourglass Tumble', 'descent', (b) => {
    const glass = (cx, base, opts = {}) => {
      const Lx = cx - 9, Rx = cx + 8.2;
      b.plat(Lx, base, 18);                                   // bottom of the lower bulb
      b.wall(Lx, base, 18);                                   // left side, full height
      b.wall(Rx, base + 3, 15);                               // right side, a door at the bottom
      b.rect(Lx + 0.8, base + 9.2, 5.6, 0.8);                 // shoulders around the neck
      b.rect(cx + 2.6, base + 9.2, 5.6, 0.8);
      b.meteor(cx, base + 0.2, { style: 'drip', h: 17, P: opts.P ?? 1.6, off: opts.off ?? 0 });   // sand grains through the neck
      b.plat(cx + 3.5, base + 2, 3.5, { h: 2 });              // the sand pile in the lower bulb
      b.rect(Lx - 1, base + 18, 3, 0.6); b.rect(Rx - 1.2, base + 18, 3, 0.6);   // the frame's top rim
    };
    b.start(-6, 30, 12);
    glass(20, 13);
    b.crumble(13, 27, 3); b.crumble(23.5, 25, 3);           // loose sand ledges in the upper bulb
    b.cells(14, 28.4, 24.5, 26.4, 3);
    b.cells(20, 21, 20, 15, 3);
    b.plat(30, 13, 4);
    glass(45, -3, { P: 1.3, off: 0.5 });
    b.enemy('walker', 37, 7, { range: 4 });
    b.enemy('walker', 48, 7, { range: 4, speed: 2 });
    b.cells(45, 6, 45, -1, 3);
    b.checkpoint(39, -3);
    b.plat(55, -3, 5);
    // the third glass is broken open: a staircase of sand that crumbles down to the goal
    b.crumble(63, -5, 2.6); b.crumble(68, -7.5, 2.6); b.crumble(73, -10, 2.6);
    b.wall(77, -18, 4); b.wall(86.2, -18, 4);                 // the lower bulb of a cracked glass
    b.plat(77, -18, 10);
    b.cells(64, -3.6, 74, -8.6, 4);
    b.plat(90, -15, 10);
    b.pendulum(60.5, 3, 7, { amp: 35, T: 4.2 });              // a pendulum bob between the glasses
    b.wrecker(82, -8, 6.5, { amp: 50, T: 3.2 });              // a swinging blade in the cracked glass
    b.goal(96, -15);
    // shards: the upper bulb's top corner, under the second glass's shoulder, inside the cracked bulb
    b.thin(25.4, 29, 2.8); b.shard(26.8, 30.8);
    b.shard(51, 3.6);
    b.shard(82, -16.5);
  }),

  // 3 ── ride the hands of giant clocks: two-paddle ferris hands sweep you up and over
  L('Clockface Crossing', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.ferris(20, 4, 7, { n: 2, omega: 0.5, w: 4, a0: Math.PI });
    b.thin(17, -6, 6); b.shard(20, -4.4);                     // under the first clock, a hidden ledge
    b.plat(31, 8, 5);
    b.ferris(48, 10, 8, { n: 2, omega: -0.45, w: 4 });
    b.shard(48, 22.2);
    b.plat(58, 16, 6);
    b.checkpoint(61, 16);
    // hour and minute hands on one dial, turning against each other
    b.ferris(78, 15, 9, { n: 2, omega: 0.42, w: 4 });
    b.ferris(78, 15, 4.5, { n: 2, omega: -0.3, w: 3 });
    for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6; if (i % 3 === 0) b.cell(78 + 11 * Math.cos(a), 15 + 11 * Math.sin(a)); }
    b.shard(78, 15.5);
    b.plat(91, 18, 4);
    b.plat(98, 15, 10);
    b.wrecker(38, 17, 6, { amp: 50, T: 3.2 });                // a pendulum blade across the first gap
    b.pendulum(66.5, 23, 7, { amp: 30, T: 4 });
    b.goal(104, 15);
    b.arc(6, 0, 13, 4, 2, 2); b.cells(41, 11, 44, 12, 2);
  }),

  // 4 ── erratic gravity: chasms you can only leap while the zone is light, a column you float up, then a rolling wave of light
  L('Weightless Minute', 'gravity', (b) => {
    b.start(-6, 0, 12);
    b.plat(9, 0, 5);
    b.grav(14, -6, 18, 20, { low: 0.45, high: 1.3, P: 4, lowFrac: 0.55 });
    b.arc(14, 0, 31, 1, 5, 5);
    b.thin(21, -4, 3); b.shard(22.5, -2.4);                  // a ledge below the first chasm
    b.plat(31, 1, 5);
    // the float shaft: each ledge is a light-phase jump above the last
    b.plat(39.5, 1, 8);
    b.grav(39, 0, 23, 32, { low: 0.45, high: 1.4, P: 5, lowFrac: 0.6, off: 1 });
    b.wall(38.7, 4, 24);
    b.thin(46, 7, 5); b.thin(39.5, 13, 5); b.thin(46, 19, 5);
    b.thin(39.5, 25, 3); b.shard(41, 27.6);
    b.enemy('flyer', 45, 16, { ax: 3, ay: 0.6, T: 3 });
    b.cells(48.5, 9, 48.5, 18, 3); b.cells(42, 15, 42, 23, 3);
    b.plat(55, 25, 6);
    b.checkpoint(58, 25);
    // a rolling wave: each zone turns light a beat after the one before it
    b.grav(61, 14, 18, 22, { low: 0.45, high: 1.5, P: 4.5, lowFrac: 0.5, off: 0 });
    b.grav(79, 14, 18, 22, { low: 0.45, high: 1.5, P: 4.5, lowFrac: 0.5, off: -1.4 });
    b.grav(97, 14, 16, 22, { low: 0.45, high: 1.5, P: 4.5, lowFrac: 0.5, off: -2.8 });
    b.plat(76, 24, 3); b.plat(94, 23, 3);
    b.arc(61, 25, 76, 24, 4, 4.5); b.arc(79, 24, 94, 23, 4, 4.5); b.arc(97, 23, 112, 22, 4, 4.5);
    b.shard(86, 29.5);
    b.plat(112, 22, 10);
    b.pendulum(22.5, 9, 7, { amp: 35, T: 4.4 });
    b.pendulum(68, 33, 8, { amp: 30, T: 4.6 });
    b.pendulum(86.5, 32, 8, { amp: 30, T: 4.6, phase: 0.5 });
    b.goal(118, 22);
  }),

  // 5 ── a row of pendulums and vines: ride each bob through the bottom of its arc and leap at the apex
  L('Pendulum Row', 'ride', (b) => {
    b.start(-6, 0, 12);
    pendulum(b, 16, 10, 9, { phase: 0 });
    pendulum(b, 32, 10, 9, { phase: 1 });
    b.thin(14, -4, 4); b.shard(16, -1.6);                   // under the first bob
    b.cells(10, 4, 22, 4, 4); b.cells(26, 4, 38, 4, 4);
    b.plat(43, 3, 5);
    b.vine(55, 12, 6); b.vine(64, 12, 6);
    b.cells(55, 7, 64, 7, 3);
        b.plat(70, 3, 6);
    b.checkpoint(73, 3);
    b.crumble(79, 4, 2.4);
    // the grandfather pendulum
    pendulum(b, 90, 22, 16, { deg: 50, speed: 5 });
    b.cells(84, 8, 96, 8, 3);
    b.shard(102, 15.6);
    b.plat(104, 12, 4);
    b.enemy('flyer', 112, 14, { ax: 2, ay: 1.5, T: 3 }); b.shard(110, 16.8);
    pendulum(b, 116, 20, 8, { deg: 45, phase: 0.5 });
    b.plat(124, 12, 8);
    b.wrecker(49, 14, 6, { amp: 50, T: 3.2 });
    b.floater(98, 3, 3, { rise: 8, speed: 2.4 });
    b.goal(129, 12);
  }),

  // 6 ── twelve ticking tiles form a clock dial; run it with the second hand, then climb a dial that ticks backwards
  L('Dial of Seconds', 'timing', (b) => {
    b.start(-6, 0, 12);
    const cx = 30, cy = 9;
    b.plat(10, 0, 5);
    // clockwise from seven o'clock up the left side, over twelve, down to three
    const dial = [[-7, -6.9], [-12.3, -4], [-15.8, 0], [-12.3, 4], [-7, 6.9], [0, 8], [7, 6.9], [12.3, 4], [15, 0]];
    dial.forEach(([dx, dy], i) => b.blink(cx + dx - 1.2, cy + dy, 2.4, { P: 6, on: 2.6, off: -i * 0.55 }));
    b.plat(cx - 2, cy - 1, 4); b.spring(cx - 1.6, cy - 1, 9);   // the hub: shard and a spring back out
    b.shard(cx + 1.2, cy + 0.6);
    b.cells(cx - 7, cy - 4.5, cx - 13, cy + 2, 3); b.cells(cx - 5, cy + 9.5, cx + 5, cy + 9.5, 3);
    b.shard(cx, cy + 12.6);
    b.plat(48, 8, 6);
    b.checkpoint(51, 8);
    // a dial ticking in reverse: counter-clockwise up its right side
    const cx2 = 66, cy2 = 12;
    b.thin(57, 5.5, 3);
    const dial2 = [[0, -8], [7, -6.9], [12.3, -4], [15.8, 0], [12.3, 4], [7, 6.9], [0, 8]];
    dial2.forEach(([dx, dy], i) => b.blink(cx2 + dx - 1.2, cy2 + dy, 2.4, { P: 5, on: 2.3, off: -i * 0.55 }));
    b.plat(cx2 - 2, cy2 - 1, 4); b.spring(cx2 - 1.6, cy2 - 1, 9);
    b.shard(cx2 + 1.2, cy2 + 0.6);
    b.cells(cx2 + 7, cy2 - 5, cx2 + 13, cy2 + 2, 3);
    b.thin(62, 24, 8);
    b.plat(76, 23, 4);
    b.plat(84, 22, 8);
    b.pendulum(55.5, 14, 8, { amp: 30, T: 4.4 });
    b.vine(82, 30, 6);
    b.goal(89, 22);
  }),
  // 7 ── cuckoo-clock cannon pods: a single pod, a pod-to-pod chain under a swinging blade, a ticking pod, a rocking pod, a pod ladder, then pendulums home
  L('Cuckoo Cannons', 'pods', (b) => {
    b.start(-6, 0, 12);
    b.plat(9, 0, 5);
    b.barrel(13, 2.2, { angle: 40 });                       // pod 1: hop in, press jump
    b.plat(21, 1, 7);
    b.barrel(27, 3, { angle: 15 });                         // the chain: pod, pod, pod, no ground between
    b.barrel(33, 2.9, { angle: 15 });
    b.barrel(39, 2.7, { angle: 45 });
    b.wrecker(30, 14, 7.4, { amp: 35, T: 3.4 });            // a clock pendulum ticking across the chain
    b.plat(48, 1.5, 7);
    b.checkpoint(51, 1.5);
    b.barrel(58, 4.5, { spin: 100 });                       // a ticking pod: wait for the hand to point at the next ledge
    b.plat(62.5, -0.5, 2.5); b.shard(63.7, 1.5);            // fire it low for the sunken ledge
    b.plat(64, 7, 4);
    b.barrel(71, 9, { angle: 70, sweep: 35, spin: 100, power: 20 });   // a rocking pod
    b.plat(64.5, 14, 2.5); b.shard(65.7, 16);               // rocked all the way back, it reaches this perch
    b.plat(78, 12.5, 5);
    b.barrel(86, 15, { angle: 90, power: 22 });             // pod ladder up the bell tower
    b.barrel(86, 20.5, { angle: 90, power: 22 });
    b.barrel(86, 26, { spin: 90 });
    b.shard(86, 31);                                        // straight up out of the top pod
    b.plat(93, 23, 8);
    b.checkpoint(96, 23);
    b.pendulum(108, 32, 9, { amp: 38, T: 4.4 });            // grandfather pendulums carry you the last stretch
    b.pendulum(120, 32, 9, { amp: 38, T: 4.4, phase: 0.5 });
    b.plat(129, 23, 10);
    b.goal(135, 23);
    b.arc(3, 0, 11, 2, 2, 1); b.arc(13, 2.2, 23, 1.5, 3, 2); b.cells(29, 3, 37, 2.9, 3); b.arc(39, 2.7, 50, 2.5, 3, 2.5);
    b.cells(52, 2.5, 56, 3.5, 2); b.arc(59, 5, 65, 7.5, 2, 2); b.arc(72, 10, 79, 13.5, 3, 2.5); b.cells(86, 17.5, 86, 23.5, 3); b.arc(87, 26, 95, 24, 3, 1);
    b.cells(104, 26, 124, 26, 5);
  }),

  // 8 ── climb a clock tower: warp lifts that stall and reverse, a bell chimney, turrets ticking the hours
  L('Belfry of Hours', 'ascent', (b) => {
    b.start(-6, 0, 12);
    b.tower(6, -2, 56, 48);
    b.plat(8, 3, 5);
    b.lift(17, 3, 12, { T: 5, warp: true });
    b.plat(10.5, 10, 3); b.shard(12, 11.8);                 // a niche beside the first lift
    b.plat(21, 12, 8.5);
    // the bell chimney: duck under its left wall, wall-jump to the belfry floor
    b.wall(24, 15, 10); b.wall(27.6, 12, 13);
    b.cells(26.2, 14, 26.2, 23, 4);
    b.rect(33, 6, 1.4, 6.5); b.turret(33.7, 13.2, -1, { P: 2.4 });
    b.shard(33.7, 15.6);
    b.plat(29, 26, 5);
    b.checkpoint(31, 26);
    b.lift(37, 26, 35, { T: 4.5, warp: true });
    b.cells(37, 28, 37, 34, 3);
    b.plat(40, 35, 6);
    // the great bell wheel, a cannon ticking beneath it
    b.ferris(52, 39, 4.5, { n: 2, omega: 0.6, w: 3 });
    b.rect(56, 30, 1.4, 7); b.turret(56.7, 37.6, -1, { P: 2.6, off: 1 });
    b.shard(52, 47.5);
    b.plat(58, 44, 5);
    b.plat(66, 41, 4);
    b.plat(73, 38, 10);
    b.wrecker(61, 55, 6, { amp: 40, T: 3.2 });
    b.vine(63.5, 50, 6);
    b.goal(79, 38);
    b.arc(63, 44, 73, 38, 3, 1.5);
  }),

  // 9 ── one warp-pad, one long track: when time reverses it drags you back through the hazards you just dodged
  L('Eon Express', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.loop([[9, 0], [28, 0], [38, 7], [56, 7], [64, 2], [80, 2]], { loop: false, speed: 3.5, w: 3.2, warp: true });
    b.hazard('spark', 19.5, 0.3, 0.8, 1.3);                 // jump the spark as the pad carries you through
    b.hazard('spark', 44, 9.7, 4, 0.5);                     // ...and don't jump under this one
    b.beam('lightning', 60, 2, { P: 3.2, on: 0.8 });
    b.thin(31, 10.5, 3); b.shard(32.5, 12.3);
    b.thin(60, -1, 3); b.shard(61.5, 0.8);
    b.cells(12, 1.4, 26, 1.4, 4); b.cells(40, 8.4, 54, 8.4, 4); b.cells(66, 3.4, 78, 3.4, 3);
    b.plat(84, 2, 6);
    b.checkpoint(87, 2);
    b.loop([[95, 2], [95, 14], [110, 14], [110, 6], [122, 6]], { loop: false, speed: 3.5, w: 3, warp: true });
    b.enemy('flyer', 102, 17, { ax: 3, ay: 0.6, T: 3 });
    b.shard(102.5, 18.3);
    b.rect(126, 0, 1.4, 6.5); b.turret(126.7, 7.2, -1, { P: 2.2 });
    b.cells(96.4, 5, 96.4, 12, 3); b.cells(112, 7.4, 120, 7.4, 3);
    b.plat(129, 6, 8);
    b.wrecker(48, 17, 5, { amp: 40, T: 3.2 });
    b.wrecker(72, 12, 6, { amp: 40, T: 3, phase: 0.5 });
    b.goal(134, 6);
  }),

  // 10 ── the Time Rift opens: sand that crumbles behind you, springs, a chimney sprint, no waiting
  L('Rift Sprint', 'chase', (b) => {
    b.chase({ speed: 4.2 });
    b.start(-6, 0, 14);
    b.crumble(11, 0, 3); b.crumble(16.5, 1, 3); b.crumble(22, 2, 3);
    b.plat(27, 2, 6); b.spring(30, 2, 6);
    b.plat(34, 9, 6); b.enemy('walker', 35, 9, { range: 4 });
    b.plat(44, 5, 4);
    b.plat(51, 2, 12);
    b.checkpoint(53, 2);
    b.wall(57.8, 5, 11); b.wall(61.2, 2, 14);
    b.cells(59.9, 4, 59.9, 14, 4);
    b.shard(59.9, 18.6);
    b.plat(63.5, 14, 5);
    b.crumble(72, 12, 2.6); b.crumble(77, 10, 2.6); b.crumble(82, 8, 2.6);
    b.thin(77, 14, 3); b.shard(78.5, 15.8);
    b.plat(87, 7, 9); b.enemy('spiker', 88, 7, { range: 5, speed: 2 });
    b.spring(94, 7, 6);
    b.plat(99, 13, 5);
    b.plat(108, 10, 4); b.crumble(115, 10, 2.4);
    b.plat(120, 10, 12);
    b.vine(112, 17, 6);
    b.wrecker(70, 16, 6, { amp: 40, T: 3 });
    b.goal(128, 10);
    b.arc(6, 0, 27, 2, 5, 1.6); b.cells(100, 14.4, 103, 14.4, 2);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 11 ── inside the movement: meshing gears of different sizes turn against each other, and a warp chain stutters between them
  L('Gear Train', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.ferris(14, 2, 5, { n: 4, omega: 0.6 });
    b.shard(14, 10.5);
    b.ferris(26, 6, 3, { n: 3, omega: -1.0 });
    b.ferris(39, 6, 7, { n: 6, omega: 0.43 });
    b.plat(38, 6, 2); b.shard(39, 7.6);                      // the arbor at the big wheel's heart
    b.enemy('flyer', 39, 11, { ax: 2, ay: 1, T: 3.4 });
    b.plat(50, 8, 5);
    b.checkpoint(50, 8);
    b.ferris(62, 10, 4, { n: 4, omega: -0.75 });
    // the escapement: a stuttering warp chain
    b.loop([[69, 8], [69, 14], [77, 14], [77, 8]], { speed: 3, w: 2.4, warp: true });
    b.loop([[69, 8], [69, 14], [77, 14], [77, 8]], { speed: 3, w: 2.4, warp: true, phase: 0.5 });
    b.ferris(85, 10, 6, { n: 5, omega: -0.5 });
    b.thin(83, 1, 4); b.shard(85, 2.8);
    b.plat(95, 12, 8);
    b.wrecker(56, 16, 6, { amp: 45, T: 3.2 });
    b.vine(91, 18, 6);
    b.goal(100, 12);
    b.cells(26, 10, 26, 10, 1); b.cells(39, 14, 39, 14, 1); b.cells(62, 15, 62, 15, 1); b.cells(73, 15.5, 73, 15.5, 1); b.cells(85, 17, 85, 17, 1);
  }),

  // 12 ── golden chains and grandfather pendulums: swing vine to vine, ride the bobs, dodge a ticking wrecking pendulum, a clock hand under the chain
  L('Chain of Hours', 'swing', (b) => {
    b.start(-6, 2, 12);
    b.vine(11, 10, 6);
    b.plat(16, 2, 4);
    b.plat(23, -1, 3); b.shard(24.5, 0.6);                  // a sunken ledge under the pendulum
    b.pendulum(29, 12, 9, { amp: 40, T: 4.4 });
    b.plat(37, 3, 6);
    b.checkpoint(40, 3);
    b.vine(47, 12, 7); b.plat(54, 3, 4); b.vine(63, 12, 7); b.vine(72, 12, 7);   // the chain: no ground between
    b.wrecker(67.5, 25, 6.5, { amp: 45, T: 3.4, phase: 0.5 });
    b.sweeper(67.5, -0.5, 3, { omega: 70 });                   // a clock hand turning under the chain: don't let go early
    b.arc(58, 3, 76, 3, 6, 3);
    b.shard(67.5, 9.5);
    b.plat(78, 3, 4);
    b.pendulum(83, 15, 10, { amp: 40, T: 4.6 });
    b.pendulum(95, 18, 10, { amp: 40, T: 4.6, phase: 0.5 });
    b.plat(103, 8, 6);
    b.checkpoint(106, 8);
    b.vine(115, 18, 6);
    b.plat(120, 8, 4);
    b.vine(131, 20, 7);
    b.plat(137, 12, 10);
    b.goal(143, 12);
    b.cells(11, 6, 24, 7, 5); b.cells(78, 5.4, 100, 8, 5); b.cells(115, 13, 131, 14, 4);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 13 ── a clock tower with no stairs: ride wandering temporal vortices up through the dial, past a turning hand, and float out of the top
  L('Vortex Ascent', 'ascent', (b) => {
    b.start(-6, 0, 12);
    b.tower(8, 0, 56, 38);
    b.plat(8, 0, 22);
    b.tornado(14, 21, 0, { rise: 8, T: 5 });                // a temporal vortex wandering the floor
    b.shard(17, 12.5);                                      // ride it and double-jump at the top
    b.plat(24, 9, 5);
    b.plat(31, 9, 16);
    b.checkpoint(44, 9);
    b.tornado(34, 41, 9, { rise: 9, T: 5.5, phase: 0.4 });
    b.shard(38, 20.5);
    b.plat(50, 18, 18);
    b.tornado(53, 61, 18, { rise: 9, T: 6 });
    b.sweeper(57, 25, 3.2, { omega: 60, both: true });      // a clock hand turning across the vortex
    b.plat(72, 27, 5);
    // the last gap is a light-gravity band: float across
    b.grav(77, 20, 16, 18, { low: 0.45, high: 1.4, P: 4, lowFrac: 0.55 });
    b.arc(77, 28, 93, 29, 4, 5);
    b.plat(93, 29, 8);
    b.goal(98, 29);
    b.cells(14, 3, 17, 7, 3); b.cells(34, 12, 38, 19, 3); b.cells(54, 21, 60, 27, 3);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 14 ── a palindrome: the level reads the same both ways, so the climb to the summit replays in reverse on the way down
  L('Palindrome', 'mirror', (b) => {
    const M = 120;                                           // mirror line at x = 60
    const both = (fn) => { fn((x) => x, 1); fn((x) => M - x, -1); };
    b.start(-6, 0, 12);
    both((X, s) => {
      b.conveyor(s > 0 ? 10 : M - 16, 2, 6, 3 * s);
      b.slide(X(20), 4, X(28), 4, { T: 4, w: 3, warp: true, phase: s > 0 ? 0 : 0.5 });
      b.blink(s > 0 ? 32 : M - 35, 7, 3, { P: 3.2, on: 2.2, off: s > 0 ? 0 : 1.6 });
      b.plat(s > 0 ? 38 : M - 42, 6, 4); b.spring(s > 0 ? 39.1 : M - 40.9, 6, 7);
      b.plat(s > 0 ? 44 : M - 48, 14, 4);
      b.enemy('walker', s > 0 ? 44 : M - 47, 14, { range: 3 });
      b.crumble(s > 0 ? 50 : M - 52.6, 16, 2.6);
      b.thin(s > 0 ? 23 : M - 26, -1, 3);
      b.cells(X(12), 3.4, X(15), 3.4, 2); b.cells(X(39), 9, X(39), 13, 2); b.cells(X(45), 16.6, X(47), 16.6, 2);
    });
    b.plat(56, 18, 8);
    b.checkpoint(60, 18);
    b.shard(24.5, 0.8); b.shard(M - 24.5, 0.8);
    b.shard(60, 22.8);
    b.plat(M - 6, 0, 12);
    b.wrecker(13, 11, 6, { amp: 40, T: 3.2 });
    b.wrecker(M - 13, 11, 6, { amp: 40, T: 3.2, phase: 0.5 });
    b.sweeper(60, 27, 4, { omega: 70 });
    b.goal(M + 2, 0);
  }),

  // 15 ── the hourglass shore: sand slabs sink under your weight, time-bubbles float you up, and sand pours from above
  L('Hourglass Shore', 'swamp', (b) => {
    b.start(-6, 0, 12);
    b.sinker(9, 0, 3, { depth: 3 });                        // first slab: feel it go down
    b.sinker(15, 0.5, 3, { depth: 3.5 });
    b.shard(16.5, -1.6);                                    // only reached by riding a slab all the way under
    b.sinker(21, 0, 3, { depth: 3 });
    b.plat(27, 1, 5);
    b.floater(34, 1, 3, { rise: 9, speed: 2.2 });           // a time-bubble: stand on it and it floats you up
    b.cells(35.5, 3.5, 35.5, 8.5, 3);
    b.shard(35.5, 12.6);                                    // ride the bubble to the very top
    b.plat(40, 7, 5);
    b.checkpoint(42, 7);
    b.sinker(48, 6, 2.6, { depth: 3, speed: 2 });
    b.sinker(53.5, 5, 2.6, { depth: 3, speed: 2 });
    b.sinker(59, 4, 2.6, { depth: 3, speed: 2 });
    b.wrecker(54, 17, 6, { amp: 45, T: 3.2 });              // a pendulum blade ticking over the sand chain
    b.meteor(51, 5, { style: 'drip', h: 12, P: 2.4 });
    b.floater(65, 3, 3, { rise: 7, speed: 2.4 });
    b.plat(70, 9, 4);
    b.sinker(77, 8, 6, { depth: 5, speed: 0.9 });           // the great hourglass slab: slow, but don't dawdle
    b.plat(87, 6, 6);
    b.checkpoint(89, 6);
    b.pendulum(100, 16, 9, { amp: 38, T: 4.2 });
    b.floater(108, 5, 3, { rise: 8, speed: 2.4 });
    b.plat(113, 13, 8);
    b.goal(118, 13);
    b.arc(6, 0, 27, 1, 6, 1.6); b.cells(49, 7.2, 60, 5.2, 4); b.arc(68, 10, 70, 9, 1, 1); b.cells(78, 9.2, 82, 9.2, 3); b.cells(96, 8, 104, 8, 3);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 16 ── the rift rises as the sand drains: climb up through a giant hourglass, wall-jumping its narrow neck
  L('Inside the Hourglass', 'tide', (b) => {
    b.rise({ rate: 0.7, delay: 4 });
    b.start(-6, 0, 12);
    b.tower(5, -2, 24, 44);
    // lower bulb
    b.plat(6, 0, 22);
    b.wall(5.2, 3, 7); b.wall(28, 0, 10);
    b.rect(6, 10, 2, 6); b.rect(8, 12, 2, 4); b.rect(10, 14, 2.5, 2);
    b.rect(26, 10, 2, 6); b.rect(24, 12, 2, 4); b.rect(20, 14, 4, 2);
    b.thin(6.2, 3.8, 3.2);
    b.thin(22, 4, 3); b.shard(26.6, 9);
    // the neck: slip under its left wall and wall-jump up the chimney
    b.plat(10, 7.5, 8.4);
    b.wall(14, 10, 14); b.wall(17.6, 7.5, 16.5);
    b.cells(16.2, 11, 16.2, 22, 4);
    // upper bulb
    b.rect(8, 24, 6.8, 1); b.rect(17.6, 24, 8.4, 1);
    b.wall(5.2, 25, 15); b.wall(28, 25, 15);
    b.checkpoint(10, 25);
    b.lift(22, 25, 33, { T: 4.5, warp: true });
    b.thin(9, 33, 5);
    b.crumble(15, 37, 3);
    b.shard(7.5, 36.8);
    b.rect(6, 40, 9, 1); b.rect(19, 40, 9, 1);
    b.cells(12, 34.5, 16, 38.5, 3);
    b.shard(7, 43);
    b.sweeper(13, 29, 3, { omega: 50 });
    b.goal(25, 41);
  }),

  // 17 ── the grandfather works: wrecking pendulums sweep the factory floor, a clock hand blocks the aisle, then ride pendulum bobs up to the gear loft
  L('Grandfather Works', 'machine', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 28);
    b.wrecker(15, 9, 6.6, { amp: 50, T: 3.2 });
    b.wrecker(24, 9, 6.6, { amp: 50, T: 3.2, phase: 0.5 });
    b.sweeper(32, 4.4, 3.4, { omega: 55, both: true });     // a minute hand across the aisle: cross while it lies flat
    b.cells(10, 1.4, 34, 1.4, 6);
    b.thin(39, -3, 3); b.shard(40.5, -1.2);
    b.pendulum(42, 11, 8, { amp: 40, T: 4.4 });
    b.plat(48, 2, 8);
    b.checkpoint(51, 2);
    b.pendulum(61, 15, 9, { amp: 38, T: 4.6, phase: 0.3 });
    b.plat(68, 7, 4);
    b.pendulum(78, 20, 10, { amp: 40, T: 4.8 });
    b.plat(84, 11, 14);
    b.wrecker(90, 20, 7, { amp: 50, T: 3.4 });
    b.thin(86, 17, 4); b.shard(88, 18.8);
    b.sweeper(97, 15.2, 3.2, { omega: -60, both: true });
    b.pendulum(108, 24, 10, { amp: 40, T: 4.4, phase: 0.5 });
    b.plat(113, 14, 10);
    b.goal(119, 14);
    b.cells(60, 6, 64, 6, 3); b.cells(80, 12.5, 96, 12.5, 4); b.shard(70, 11.2);
  }),

  // 18 ── moments drift past like a river: ride ring-chunks along stacked time-streams of different speeds and hop between lanes
  L('Stream of Moments', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.stream('ring', 8, 38, -1, { speed: 3, spacing: 11 });
    b.stream('ring', 20, 52, 3.5, { speed: 4.2, spacing: 10 });
    b.thin(24, -4, 3); b.shard(25.5, -2.2);
    b.plat(41, 1, 4);
    b.cells(12, 1.4, 34, 1.4, 4); b.cells(24, 6, 48, 6, 4);
    b.plat(53, 5, 6);
    b.checkpoint(56, 5);
    b.stream('ring', 60, 96, 3, { speed: 3.4, spacing: 12 });
    b.stream('ring', 64, 100, 7.5, { speed: 5, spacing: 12 });
    b.stream('ring', 70, 104, 12, { speed: 2.6, spacing: 11 });
    b.enemy('flyer', 80, 10.6, { ax: 4, ay: 0.4, T: 3 });
    b.enemy('flyer', 90, 6.2, { ax: 3, ay: 0.3, T: 2.6 });
    b.plat(96.5, 4.8, 3); b.shard(98, 6.6);
    b.plat(100.5, 9.3, 3);
    b.shard(86, 17.5);
    b.cells(64, 5.4, 92, 5.4, 5); b.cells(70, 9.9, 96, 9.9, 5); b.cells(76, 14.4, 100, 14.4, 5);
    b.plat(104.5, 13.6, 8);
    b.wrecker(94, 26, 6, { amp: 45, T: 3.2 });
    b.sweeper(76, 22, 3, { omega: 60, both: true });
    b.goal(110, 13.6);
  }),

  // 19 ── hour hand and minute hand: three dials where two clock hands cross at different speeds, bridged by pendulum bobs and a rising time-bubble
  L('Crossed Hands', 'clock', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 12);
    b.sweeper(14, 4.2, 3.4, { omega: 70, both: true });
    b.sweeper(14, 4.2, 2.6, { omega: -35, a0: 45 });
    b.thin(23, -3, 3); b.shard(24.5, -1.2);
    b.pendulum(26, 11, 8, { amp: 38, T: 4.2 });
    b.plat(31, 2, 10);
    b.sweeper(36, 6.2, 3.4, { omega: -60, both: true });
    b.sweeper(36, 6.2, 3.0, { omega: 30 });
    b.checkpoint(39, 2);
    b.floater(46, 2, 3, { rise: 8, speed: 2.2 });           // a time-bubble to the third dial
    b.shard(47.5, 10.6);
    b.plat(52, 10, 12);
    b.sweeper(58, 14.2, 3.4, { omega: 75, both: true });
    b.sweeper(58, 14.2, 2.4, { omega: -40, a0: 120 });
    b.plat(66, 8, 3);
    b.pendulum(76, 21, 10, { amp: 40, T: 4.6 });
    b.plat(83, 11, 14);
    b.wrecker(90, 21, 7, { amp: 45, T: 3.4 });
    b.goal(93, 11);
    b.cells(10, 1.4, 20, 1.4, 4); b.cells(32, 3.4, 40, 3.4, 4); b.cells(54, 11.4, 63, 11.4, 4);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 20 ── the rift chases you down a collapsing clock tower and out along its fallen hands: a descent, a crawl, a chimney, a sprint
  L('Collapse of Ages', 'chase', (b) => {
    b.chase({ speed: 4.6 });
    b.start(-6, 24, 14);
    b.plat(12, 20, 5); b.crumble(20, 17, 3); b.crumble(26, 14, 3);
    b.plat(32, 11, 6); b.enemy('spiker', 33, 11, { range: 4 });
    // the crawl: a low gallery with a sand floor
    b.plat(42, 8, 4); b.crumble(46, 8, 4); b.crumble(50, 8, 4);
    b.rect(42, 10.4, 12, 1);
    b.plat(54, 8, 6);
    b.checkpoint(57, 8);
    // the fallen hands
    b.thin(64, 6, 8); b.thin(75, 4, 8);
    b.shard(79, 7.6);
    b.plat(86, 2, 4); b.spring(88, 2, 7);
    b.plat(92, 10, 8);
    b.wall(96, 13, 9); b.wall(99.4, 10, 12);
    b.shard(98.1, 25.6);
    b.plat(101, 20, 5);
    b.crumble(109, 18, 2.6); b.crumble(114, 16, 2.6);
    b.plat(120, 14, 12);
    b.wrecker(70, 16, 6, { amp: 40, T: 3 });
    b.vine(106, 26, 6);
    b.goal(128, 14);
    b.arc(8, 24, 12, 20, 2, 1); b.cells(43, 9.2, 53, 9.2, 4); b.cells(97.6, 12, 97.6, 20, 3); b.cells(66, 7.4, 82, 5.4, 5);
    b.plat(-14, 25.5, 3); b.shard(-12.5, 27.5);
  }),
  // 21 ── a cascade of short, fast warp pads: each one turns back on you, so jump to the next before it rewinds
  L('Rewind Rapids', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.slide(10, 0, 20, 0, { T: 2.4, w: 2.6, warp: true });
    b.slide(24, 1, 34, 1, { T: 2.2, w: 2.6, warp: true, phase: 0.5 });
    b.thin(27.5, 5, 3); b.shard(29, 6.8);
    b.slide(38, 2, 38, 8, { T: 2, w: 2.6, warp: true });
    b.cells(10, 1.4, 20, 1.4, 3); b.cells(24, 2.4, 34, 2.4, 3); b.cells(38, 4, 38, 8, 2);
    b.plat(42, 8, 4);
    b.checkpoint(44, 8);
    b.slide(50, 8, 62, 6, { T: 2.4, w: 2.6, warp: true });
    b.beam('lightning', 57, 6.5, { P: 3, on: 0.7 });
    b.thin(55, 1.5, 3); b.shard(56.5, 3.3);
    b.slide(66, 6, 78, 8, { T: 2, w: 2.6, warp: true, phase: 0.25 });
    b.beam('lightning', 72, 7.5, { P: 2.6, on: 0.7, off: 1.3 });
    b.enemy('flyer', 74, 12, { ax: 3, ay: 0.8, T: 2.4 });
    b.slide(82, 8, 82, 14, { T: 2.2, w: 2.6, warp: true });
    b.shard(82, 18.6);
    b.cells(50, 9.4, 62, 7.4, 4); b.cells(66, 7.4, 78, 9.4, 4);
    b.plat(86, 14, 8);
    b.sweeper(44, 14, 3.8, { omega: 50 });
    b.pendulum(82, 24, 8, { amp: 25, T: 4 });
    b.goal(91, 14);
  }),

  // 22 ── ancient geysers erupt on a timer; inside the light-gravity bands their plumes throw you twice as high
  L('Geyser of Ages', 'ascent', (b) => {
    b.start(-6, 0, 12);
    b.tower(6, -2, 26, 40);
    b.plat(8, 0, 8); b.vent(12, 0, 5, { P: 2.6, on: 1.2 });
    b.plat(18, 9, 6);
    b.grav(16, 9, 16, 16, { low: 0.5, high: 1.4, P: 4.4, lowFrac: 0.55 });
    b.vent(21, 9, 6, { P: 2.4, on: 1.1, off: 1 });
    b.thin(26.5, 18, 3); b.shard(28, 19.8);
    b.plat(8, 22, 6);
    b.rect(5.4, 20, 1.4, 6); b.turret(6.1, 26.6, 1, { P: 2.6 });
    b.vent(11, 22, 7, { P: 2.6, on: 1.2, off: 0.5 });
    b.plat(17, 31, 5);
    b.checkpoint(19, 31);
    b.cells(12, 3, 12, 8, 3); b.cells(21, 12, 21, 20, 3); b.cells(11, 25, 11, 30, 3);
    // a row of geysers over the void, each one a stepping stone while it erupts
    b.plat(26, 29, 4); b.vent(28.8, 29, 4, { P: 2.4, on: 1.2 });
    b.plat(34, 31, 4); b.vent(36.8, 31, 4, { P: 2.4, on: 1.2, off: 0.8 });
    b.grav(37, 26, 16, 18, { low: 0.45, high: 1.4, P: 4, lowFrac: 0.5, off: 2 });
    b.plat(42, 33, 4); b.vent(44.8, 33, 3, { P: 2.4, on: 1.2, off: 1.6 });
    b.shard(44.8, 41);
    b.plat(52, 35, 8);
    b.wrecker(31, 39, 6, { amp: 50, T: 3.2 });
    b.vine(49, 41, 6);
    b.goal(57, 35);
    b.arc(29, 32, 34, 33, 2, 2); b.arc(37, 34, 42, 35, 2, 2);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 23 ── your past and future selves: every gap is spanned by a mirrored pair of pads that meet in the middle only for a moment
  L('Mirror Epoch', 'timing', (b) => {
    b.start(-6, 0, 12);
    b.thin(-13, -3, 3); b.shard(-11.5, -1.2);
    let x = b.mirror(6, 0, 3, { w: 2.8, T: 4 });
    b.plat(x + 0.3, 0, 4); x += 4.3;
    b.cells(8, 1.4, 18, 1.4, 3);
    x = b.mirror(x, 2, 5, { w: 2.8, T: 4.4 });
    b.plat(x + 0.3, 2, 5);
    b.enemy('walker', x + 0.5, 2, { range: 4 });
    b.shard(x - 10.5, 6.2);
    x += 5.3;
    b.beam('flare', x + 9, 2, { P: 3, on: 0.8 });
    x = b.mirror(x, 2, 6, { w: 2.6, T: 4 });
    b.plat(x + 0.3, 4, 6);
    b.checkpoint(x + 3, 4);
    x += 6.3;
    // a long pair inside a light-gravity zone: leap from the meeting point to a ledge above
    b.grav(x, -2, 30, 20, { low: 0.45, high: 1.3, P: 4.6, lowFrac: 0.6 });
    const x0 = x;
    x = b.mirror(x, 4, 8, { w: 2.8, T: 5 });
    b.thin((x0 + x) / 2 - 1.5, 12, 3); b.shard((x0 + x) / 2, 13.8);
    b.plat(x + 0.3, 5, 4);
    x += 4.3;
    b.enemy('flyer', x + 6, 8, { ax: 3, ay: 1, T: 2.6 });
    x = b.mirror(x, 5, 4, { w: 2.4, T: 3.2, phase: 0.5 });
    b.plat(x + 0.3, 5, 10);
    b.wrecker(x + 5, 14, 6, { amp: 40, T: 3.2 });
    b.goal(x + 6, 5);
    b.cells(x + 2, 6.2, x + 5, 6.2, 3); b.cells(58, 5.2, 61, 5.2, 2);
  }),

  // 24 ── time-stream zip lines: slide down glowing streams, hop a pendulum blade, ride a time-bubble back up and slide again
  L('Time-Stream Zips', 'speed', (b) => {
    b.start(-6, 24, 12);
    b.thin(0, 28.2, 3); b.shard(1.5, 29.7);
    b.zip(7, 27, 25, 21);
    b.wrecker(16, 30, 5.4, { amp: 50, T: 3.2 });
    b.shard(20, 24.6);                                      // hop on the stream (you re-grab it) to snag this one
    b.plat(27, 18, 5);
    b.zip(33, 20, 55, 12);
    b.wrecker(44, 22, 5.4, { amp: 50, T: 3, phase: 0.5 });
    b.plat(56, 9, 6);
    b.checkpoint(59, 9);
    b.floater(66, 9, 3, { rise: 10, speed: 2.4 });          // a time-bubble carries you back up to the top
    b.cells(67.5, 11, 67.5, 18, 3);
    b.plat(71, 19, 5);
    b.vine(82, 28, 6);                                      // golden chain → time-stream
    b.zip(86, 22, 104, 15);
    b.plat(60.5, 24, 3); b.shard(61.7, 26);
    b.plat(105, 12, 5);
    b.zip(112, 15, 134, 8, { oneWay: true });
    b.wrecker(120, 25, 5.5, { amp: 55, T: 2.8 });
    b.wrecker(128, 23, 5.5, { amp: 55, T: 2.8, phase: 0.5 });
    b.plat(135, 5, 10);
    b.goal(141, 5);
    b.cells(9, 26, 23, 22, 5); b.cells(35, 19, 53, 13, 6); b.cells(88, 21, 102, 16, 5); b.cells(114, 14, 132, 9, 6);
  }),

  // 25 ── a clock-shaft whose gravity breathes in stacked bands, each a beat behind the one below: float from band to band as each turns light
  L('Tidal Clock', 'gravity', (b) => {
    b.start(-6, 0, 12);
    b.tower(8, -2, 18, 34);
    b.wall(7.2, 4, 30); b.wall(26, 0, 34);
    b.plat(8, 0, 8);
    for (let i = 0; i < 4; i++) b.grav(8, i * 7, 18, 7, { low: 0.45, high: 1.6, P: 4.8, lowFrac: 0.5, off: -i * 1.2 });
    b.thin(18, 6, 6); b.thin(8, 12, 6); b.thin(18, 18, 6); b.thin(8, 24, 6);
    b.thin(18, 30, 8);
    b.hazard('spark', 8, 15.5, 0.6, 3); b.hazard('spark', 25.4, 9, 0.6, 3); b.hazard('spark', 25.4, 21, 0.6, 3);
    b.enemy('flyer', 17, 15, { ax: 4, ay: 0.4, T: 3 });
    b.enemy('flyer', 17, 27, { ax: 4, ay: 0.4, T: 2.6 });
    b.cells(21, 8, 21, 16, 3); b.cells(11, 14, 11, 22, 3); b.cells(21, 20, 21, 28, 3);
    b.thin(8, 6, 2.4); b.shard(9.2, 7.8);
    b.shard(24.6, 25);
    b.plat(27, 34, 6);
    b.checkpoint(29, 34);
    // out over the void: three islands whose bands breathe out of step
    b.grav(33, 26, 44, 20, { low: 0.45, high: 1.6, P: 4, lowFrac: 0.55, off: 0 });
    b.plat(47, 32, 3); b.blink(60, 30, 3, { P: 4, on: 2.6, off: -1 }); b.plat(73, 31, 3);
    b.arc(33, 34, 47, 32, 4, 4); b.arc(50, 32, 60, 30, 3, 4); b.arc(63, 30, 73, 31, 3, 4);
    b.shard(55, 37.5);
    b.plat(80, 31, 8);
    b.sweeper(16, 21, 3, { omega: 40 });
    b.pendulum(66.5, 38, 8, { amp: 30, T: 4.4 });
    b.goal(85, 31);
  }),

  // 26 ── the cuckoo gauntlet: ticking, rocking cannon pods fling you between pendulum blades, then a pod ladder to the clock's crown
  L('Cuckoo Gauntlet', 'gauntlet', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 5);
    b.barrel(14, 2.4, { angle: 30, sweep: 25, spin: 80 });  // a rocking cuckoo
    b.plat(24, 1, 5);
    b.barrel(34, 4, { spin: 100 });                         // a ticking pod: wait for the hand
    b.wrecker(29, 15, 8, { amp: 40, T: 3 });
    b.plat(45, 2, 6);
    b.checkpoint(48, 2);
    b.thin(40, -2, 3); b.shard(41.5, -0.2);
    b.barrel(55, 3.4, { angle: 33 });
    b.barrel(61, 3.4, { angle: 33 });
    b.barrel(67, 3.4, { angle: 33 });
    b.barrel(73, 3.4, { angle: 45 });
    b.wrecker(64, 15.6, 7.4, { amp: 38, T: 3.2, phase: 0.5 });
    b.plat(82, 1.5, 7);
    b.barrel(93, 4, { angle: 90, power: 22 });              // pod ladder to the crown
    b.barrel(93, 9.5, { angle: 90, power: 22 });
    b.barrel(93, 15, { spin: 80 });
    b.shard(93, 20.5);
    b.plat(100, 12, 8);
    b.checkpoint(103, 12);
    b.pendulum(115, 25, 10, { amp: 38, T: 4.2 });
    b.plat(122, 11, 10);
    b.goal(128, 11);
    b.cells(16, 3, 26, 2, 3); b.cells(56, 4.5, 72, 4.2, 5); b.cells(93, 6.5, 93, 13, 3);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 27 ── a carousel of warp pads circles a void; then a figure-of-eight track where two trains cross at the middle
  L('Echo Loop', 'ride', (b) => {
    b.start(-6, 0, 12);
    const ring = [[10, 0], [40, 0], [40, 12], [10, 12]];
    for (let i = 0; i < 4; i++) b.loop(ring, { speed: 3.2, w: 2.6, warp: true, phase: i * 0.25 });
    b.plat(23.5, 6, 3); b.shard(25, 7.8);
    b.hazard('spark', 24.6, 9.6, 0.8, 2);
    b.enemy('flyer', 25, 2.5, { ax: 8, ay: 0.4, T: 4 });
    b.cells(14, 1.4, 36, 1.4, 4); b.cells(14, 13.4, 36, 13.4, 4);
    b.plat(44, 12, 5);
    b.checkpoint(41, 12);
    const eight = [[52, 12], [58, 18], [66, 12], [74, 6], [82, 12], [74, 18], [66, 12], [58, 6]];
    b.loop(eight, { speed: 3, w: 2.6, warp: true });
    b.loop(eight, { speed: 3, w: 2.6, warp: true, phase: 0.5 });
    b.plat(72.8, 12, 2.4); b.shard(74, 13.8);
    b.shard(58, 22.4);
    b.cells(58, 19.4, 58, 19.4, 1); b.cells(74, 19.4, 74, 19.4, 1); b.cells(58, 7.4, 74, 7.4, 2);
    b.plat(86, 12, 8);
    b.wrecker(46.5, 21, 6, { amp: 40, T: 3.2 });
    b.sweeper(90, 19, 4.5, { omega: 60 });
    b.goal(91, 12);
  }),

  // 28 ── orbit one colossal clock: the dial wheel turns slowly while its hands sweep through it; climb from six to the crown
  L('Clockwork Heart', 'ride', (b) => {
    b.start(-6, 0, 12);
    pendulum(b, 17, 10, 8, { deg: 45 });
    b.plat(26, 2, 4);
    b.ferris(42, 14, 12, { n: 8, omega: 0.25, w: 2.6 });
    b.ferris(42, 14, 7, { n: 2, omega: -0.6, w: 4 });
    b.plat(40.5, 14, 3); b.shard(42, 15.8);                  // the arbor
    b.thin(39, -4, 6); b.shard(42, -2.2);
    b.plat(39, 29, 6);
    b.checkpoint(42, 29);
    b.shard(42, 33.2);
    b.ferris(58, 26, 4, { n: 2, omega: 0.7, w: 3 });
    b.ferris(70, 22, 4, { n: 2, omega: -0.7, w: 3 });
    for (let i = 0; i < 3; i++) b.blink(78 + i * 5, 20 - i * 2, 2.4, { P: 3, on: 2, off: -i * 0.6 });
    b.plat(94, 15, 8);
    b.wrecker(86, 26, 6, { amp: 50, T: 3.2 });
    b.goal(99, 15);
    b.cells(30, 3.4, 36, 5, 3); b.cells(42, 27, 42, 27, 1); b.cells(58, 31.4, 58, 31.4, 1); b.cells(70, 27.4, 70, 27.4, 1);
  }),

  // 29 ── LEAP SECOND: every trick Chronos knows on one-second timing, on ledges barely wider than your feet
  L('Leap Second', 'precision', (b) => {
    b.start(-6, 0, 12);
    b.plat(10, 1, 1.6); b.plat(16, 3, 1.4);
    b.blink(21, 4, 1.6, { P: 2, on: 1.2 });
    b.slide(28, 4, 34, 7, { T: 3, w: 2, warp: true });
    b.thin(38, 8, 1.5);
    b.grav(39.5, 0, 17, 20, { low: 0.45, high: 1.6, P: 3.6, lowFrac: 0.45 });
    b.shard(48, 13.5);
    b.thin(56, 8, 1.5);
    b.plat(62, 8, 3);
    b.checkpoint(63.5, 8);
    b.crumble(68, 9, 1.6); b.crumble(72, 10, 1.6);
    b.rect(76, 4, 1.4, 6.6); b.turret(76.7, 11.2, -1, { P: 1.5, range: 14 });
    b.spring(80, 6, 6, 1.4); b.plat(79.6, 6, 2.2);
    b.thin(85, 14, 1.5);
    b.loop([[91, 14], [97, 18], [103, 14], [97, 10]], { speed: 4, w: 2, warp: true });
    b.hazard('spark', 96.6, 13.4, 0.8, 1.2);
    b.shard(97, 14);
    for (let i = 0; i < 4; i++) b.blink(107 + i * 4, 13 - i * 2, 1.6, { P: 2, on: 1.1, off: -i * 0.5 });
    b.plat(124, 5, 1.8); b.shard(125, 1.5); b.thin(123.8, -0.5, 2);
    b.plat(129, 6, 8);
    b.wrecker(70, 19, 7, { amp: 50, T: 3.2 });
    b.goal(134, 6);
    b.cells(10.8, 2.6, 16.7, 4.6, 2); b.cells(42, 12, 54, 12, 4); b.cells(68.8, 10.6, 72.8, 11.6, 2);
  }),

  // 30 ── FINALE: past/future bridges, a light-gravity chasm, the clock hands, the bell chimney — then the Time Rift, all the way home
  L('End of Time', 'finale', (b) => {
    b.start(-6, 0, 12);
    b.slide(12, 0, 22, 0, { T: 4, w: 3, warp: true });
    b.plat(26, 0, 6); b.switch(28, 0);
    b.blue(35, 2, 3); b.blue(41, 4, 3);
    b.red(38, 8, 3); b.shard(39.5, 9.8);
    b.plat(47, 4, 6); b.switch(51, 4);
    b.red(57, 6, 3);
    b.plat(62, 7, 5);
    b.grav(67, 0, 16, 20, { low: 0.45, high: 1.4, P: 4, lowFrac: 0.55 });
    b.plat(83, 8, 4);
    b.ferris(96, 12, 7, { n: 2, omega: 0.5, w: 4 });
    b.enemy('flyer', 96, 4, { ax: 2, ay: 0.6, T: 2.4 });
    b.shard(96, 23);
    b.plat(106, 18, 10);
    b.wall(110, 21, 10); b.wall(113.6, 18, 13);
    b.plat(115, 30, 6);
    b.checkpoint(117, 30);
    b.shard(112.2, 34.6);
    // the Time Rift: no waiting from here to the end
    b.chase({ speed: 4.6, trigger: 120, behind: 16 });
    b.crumble(124, 28, 2.6); b.crumble(129, 26, 2.6);
    b.plat(134, 24, 5); b.enemy('walker', 134.5, 24, { range: 2 });
    b.spring(137.2, 24, 6);
    b.plat(141, 31, 5);
    b.thin(150, 29, 6); b.thin(160, 27, 6);
    b.crumble(170, 25, 2.4); b.crumble(175, 24, 2.4);
    b.plat(180, 22, 5); b.spring(183, 22, 6);
    b.plat(188, 28, 4);
    b.plat(196, 26, 14);
    b.pendulum(148, 38, 8, { amp: 25, T: 4 });
    b.vine(122.5, 35, 6);
    b.wrecker(172.5, 36, 6, { amp: 50, T: 3.2 });
    b.goal(205, 26);
    b.cells(13, 1.4, 21, 1.4, 3); b.cells(36, 3.4, 42, 5.4, 2); b.arc(67, 7, 83, 8, 5, 5); b.cells(112.2, 21, 112.2, 29, 3);
    b.cells(125, 29.4, 130, 27.4, 2); b.cells(151, 30.4, 165, 28.4, 4); b.cells(171, 26.4, 176, 25.4, 2);
  }),
];
