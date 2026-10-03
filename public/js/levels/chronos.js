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
    b.goal(89, 22);
  }),
];
