// WORLD 7 — JUPITER. 30 hand-written levels over the cloud sea.
// Gravity 1.15: single jump ≈ 2.1 high, double jump ≈ 3.8 high / ~9 far, comfortable gaps 3–6.
// Signature: horizontal wind. Hazard winds pulse (time your jumps for the calm),
// gust winds carry you across gaps too wide to jump. Levels 25–30 are inside the Great Red Spot.
import { L } from './dsl.js';

// always-on jet stream (no pulse): for chases, where the player must never wait
const JET = { gust: true, P: 1, on: 1, warn: 0 };

export default [
  // 1 ── teach hopping between floating cloud slabs, then a first gentle gust carries you over
  L('Cloudtop Landing', 'intro', (b) => {
    b.start(-6, 0, 14);
    b.arc(8, 0, 12, 0, 2, 1.6);
    b.plat(12, 0, 5);
    b.plat(21, 1.5, 4);
    b.plat(29, 3, 4);
    b.thin(30, 6.5, 3); b.cells(30.5, 7.5, 32.5, 7.5, 3); b.shard(31.5, 9);
    b.plat(37, 1, 9);
    b.checkpoint(41, 1);
    b.wind(44, -4, 16, 13, 9, { gust: true, P: 3.6, on: 2 });
    b.arc(46, 1, 58, 1, 5, 3); b.shard(52, 5.6);
    b.plat(58, 1, 6);
    b.plat(68, 3, 3); b.plat(74, 5, 3);
    b.cells(69.5, 4.5, 75.5, 6.5, 3);
    b.plat(81, 4, 10);
    b.goal(87, 4);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 2 ── a descending terrace of ever-wider gust gaps, then a spring flings you into the jet stream
  L('Tailwind Terraces', 'wind', (b) => {
    b.start(-6, 4, 12);
    b.wind(5, -2, 13, 14, 9, { gust: true, P: 3.4, on: 1.8 });
    b.cells(8, 6.5, 15, 5.5, 4);
    b.plat(17, 3, 5);
    b.wind(21, -4, 16, 14, 10, { gust: true, P: 3.4, on: 1.8, off: 1.2 });
    b.cells(25, 5.5, 33, 3.5, 4); b.shard(28, 7.5);
    b.plat(36, 1, 6);
    b.checkpoint(37.5, 1);
    b.spring(40, 1, 8);
    b.wind(41, 5, 14, 9, 10, { gust: true, P: 3, on: 2 });
    b.cells(41, 10, 41, 13, 2); b.shard(44, 11.5);
    b.plat(53, 5, 5);
    b.wind(57, -3, 26, 13, 9, { gust: true, P: 4, on: 2.4 });
    b.crumble(69, 3, 2.5); b.cells(62, 7, 67, 5, 3);
    b.plat(76, 0, 2.5); b.shard(77.2, 2);
    b.plat(81, 3, 10);
    b.goal(87, 3);
  }),

  // 3 ── narrow pillars in a pulsing crosswind (overshoot!), then a headwind staircase, then a two-way windsock gap
  L('Crosswind Causeway', 'wind', (b) => {
    b.start(-6, 0, 12);
    b.pillarPlat(10, 0, 2.4); b.pillarPlat(16.5, 0.5, 2.4); b.pillarPlat(23, 1, 2.4); b.pillarPlat(29.5, 0.5, 2.4);
    b.wind(8, -3, 25, 10, 11, { P: 4, on: 1.6 });
    b.cells(11.2, 1.5, 30.7, 2, 4);
    b.plat(20, 4, 1.5); b.shard(20.7, 6);
    b.plat(35, 1, 6);
    b.checkpoint(38, 1);
    b.plat(46, 2, 3); b.plat(54, 3.5, 3); b.plat(62, 2, 3); b.plat(69, 3, 4);
    b.wind(41, -1, 28, 12, -10, { P: 3.6, on: 1.4 });
    b.arc(41, 1, 46, 2, 2, 2); b.arc(49, 2, 54, 3.5, 2, 2); b.arc(57, 3.5, 62, 2, 2, 2);
    b.thin(57, 7, 3); b.shard(58.5, 9);
    b.wind(73, -1, 7, 11, 10, { P: 4, on: 1.1 });
    b.wind(73, -1, 7, 11, -10, { P: 4, on: 1.1, off: 2 });
    b.cells(74, 4.5, 78, 4.5, 3);
    b.plat(79.5, 3, 10);
    b.goal(86, 3);
    b.plat(-10.5, -3.5, 3); b.shard(-9, -1.5);
  }),

  // 4 ── a long cloud boulevard under the thunderhead: dash from roof to roof between lightning strikes
  L('Thunderhead Boulevard', 'gauntlet', (b) => {
    b.start(-6, 0, 12);
    b.plat(9, 0, 40);
    for (let i = 0; i < 4; i++) {
      b.rect(9 + i * 10, 2.4, 4, 0.8);                                   // shelter roof
      b.beam('lightning', 16 + i * 10, 0, { w: 6, h: 14, P: 2.8, on: 0.9 });
      b.cells(14 + i * 10, 1, 18 + i * 10, 1, 2);
    }
    b.thin(30, 6.5, 3); b.shard(31.5, 8.5);
    b.cells(10, 4, 42, 4, 4);
    b.plat(53, 1.5, 6);
    b.checkpoint(56, 1.5);
    for (let i = 0; i < 4; i++) {
      b.plat(63 + i * 7, 2 + (i % 2), 3);
      b.beam('lightning', 64.5 + i * 7, 2 + (i % 2), { w: 2, h: 14, P: 2.4, on: 0.8, off: i * 0.6 });
    }
    b.cells(60, 3.5, 85, 4.5, 6);
    b.plat(73, -1, 2.5); b.shard(74.2, 1);
    b.plat(91, 3, 10);
    b.goal(97, 3);
    b.plat(-13, 3, 2.5); b.shard(-11.8, 5);
  }),

  // 5 ── storm clouds that blink in a wave: climb a zig-zag ladder of them, cross a ping-pong row, drop back down
  L('Nimbus Ladder', 'timing', (b) => {
    b.start(-6, 0, 12);
    b.tower(8, -2, 11, 26);
    for (let i = 0; i < 8; i++) b.blink(i % 2 ? 15 : 9, 2.8 + i * 2.8, 3, { P: 3.4, on: 2.2, off: -i * 0.45 });
    b.cells(12, 4, 15, 21, 6);
    b.plat(20, 24, 6);
    b.checkpoint(23, 24);
    b.plat(7, 25.5, 2.5); b.shard(8.2, 27.5);
    for (let i = 0; i < 6; i++) b.blink(30 + i * 5, 24, 3, { P: 3, on: 1.7, off: (i % 2) * 1.5 });
    b.cells(31, 25.2, 56, 25.2, 6);
    b.thin(42, 27.5, 3); b.shard(43.5, 29.5);
    b.plat(60, 24, 4);
    for (let i = 0; i < 5; i++) b.blink(67 + (i % 2) * 6, 20.5 - i * 3.5, 3, { P: 3.2, on: 2, off: -i * 0.4 });
    b.cells(68, 21, 74, 6, 5);
    b.plat(79, 4, 10);
    b.goal(86, 4);
    b.plat(-13, -2.5, 3); b.shard(-11.5, -0.5);
  }),

  // 6 ── a cloud-station elevator shaft: crosswinds sweep across the lift cars, hold your ground
  L('Ammonia Elevator', 'ascent', (b) => {
    b.start(-6, 0, 12);
    b.tower(7, -2, 52, 40);
    b.lift(10, 0, 9, { T: 5 });
    b.wind(6, 3.5, 10, 4, -8, { P: 4, on: 1.5 });
    b.plat(4, 5, 2.5); b.shard(5.2, 7);
    b.plat(14, 9, 5);
    b.lift(22, 9, 18, { T: 5 });
    b.wind(18, 12.5, 8, 4, 8, { P: 3.6, on: 1.4, off: 1 });
    b.cells(22, 10.5, 22, 17, 3);
    b.plat(26, 18, 5);
    b.checkpoint(28, 18);
    b.lift(35, 18, 27, { T: 4.5 });
    b.wind(31, 21.5, 9, 4, 9, { P: 3.4, on: 1.2 });
    b.shard(35, 31);
    b.plat(39, 27, 4);
    b.lift(47, 27, 38, { T: 4 });
    b.wind(43, 30, 8, 3.5, -9, { P: 3, on: 1 });
    b.wind(43, 34, 8, 3.5, 9, { P: 3, on: 1, off: 1.5 });
    b.cells(47, 29, 47, 37, 4);
    b.plat(51, 38, 10);
    b.goal(57, 38);
    b.plat(63, 35, 2.5); b.shard(64.2, 37);
  }),

  // 7 ── storm drones picket a crumbling arch: up the crumble stairs, over the summit, down and through the swarm
  L('Drone Picket', 'enemies', (b) => {
    b.start(-6, 0, 12);
    for (let i = 0; i < 4; i++) b.crumble(9 + i * 5.5, 1 + i * 1.5, 2.6);
    b.enemy('flyer', 12.8, 4.5, { ax: 0.4, ay: 1.6, T: 2.6 });
    b.enemy('flyer', 18.3, 6, { ax: 0.4, ay: 1.6, T: 2.2 });
    b.enemy('flyer', 23.8, 7.5, { ax: 0.4, ay: 1.6, T: 2.8 });
    b.arc(10, 2, 26, 6.5, 4, 2);
    b.plat(31, 7, 5);
    b.checkpoint(33.5, 7);
    b.thin(32, 10.5, 2.5); b.shard(33.2, 12.5);
    for (let i = 0; i < 3; i++) b.crumble(40 + i * 5.5, 5.5 - i * 1.5, 2.4);
    b.enemy('flyer', 43, 7.5, { ax: 2.5, ay: 0.4, T: 2.4 });
    b.enemy('flyer', 49, 6, { ax: 2.5, ay: 0.4, T: 3 });
    b.thin(56, 2, 24);
    b.enemy('flyer', 61, 4, { ax: 3, ay: 1, T: 2.2 });
    b.enemy('flyer', 68, 3.6, { ax: 2, ay: 1.4, T: 1.8 });
    b.enemy('flyer', 75, 4.2, { ax: 3, ay: 0.8, T: 2.6 });
    b.cells(57, 3, 79, 3, 8);
    b.plat(54.5, -1.5, 4); b.shard(57.5, 0.3);
    b.plat(84, 3, 10);
    b.goal(90, 3);
    b.plat(-12, -2.5, 3); b.shard(-10.5, -0.5);
  }),

  // 8 ── a junction of red and blue cloud banks: every button swaps which bank holds you up
  L('Belt Junction', 'puzzle', (b) => {
    b.start(-6, 0, 12);
    b.red(9, 0, 4);
    b.plat(16, 0, 4); b.switch(17.5, 0);
    b.blue(11, 3.3, 3); b.shard(12.5, 5.3);
    b.blue(23, 1.5, 4); b.blue(30, 3, 4);
    b.plat(37, 3, 5); b.switch(39, 3);
    b.checkpoint(40.5, 3);
    b.red(31, 6, 3); b.shard(32.5, 8);
    b.red(45, 5, 4); b.red(52, 3, 4);
    b.plat(58, 3, 6); b.switch(61, 3);
    b.redWall(64.5, 3, 6); b.rect(58, 9.5, 10, 0.8);
    b.blue(65, 3, 6);
    b.plat(68, 0, 3); b.shard(69.5, 2);
    b.plat(75, 4, 10);
    b.goal(81, 4);
    b.cells(10, 1.2, 12, 1.2, 2); b.cells(24, 2.7, 33, 4.2, 4); b.cells(46, 6.2, 55, 4.2, 4); b.cells(66, 4.2, 70, 4.2, 3);
  }),

  // 9 ── a chain of cyclone carousels, the last one tosses you into a gust
  L('Cyclone Carousel', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.ferris(14, 1, 4.5, { n: 4, omega: 0.7 });
    b.shard(14, 8);
    b.plat(22, 3, 4);
    b.ferris(34, 4, 5, { n: 5, omega: -0.6 });
    b.cells(34, 10.5, 34, 10.5, 1);
    b.plat(44, 6, 5);
    b.checkpoint(46.5, 6);
    b.ferris(60, 8, 7, { n: 6, omega: 0.45 });
    b.shard(60, 8);
    b.wind(66, 9, 13, 10, 9, { gust: true, P: 3, on: 1.6 });
    b.cells(68, 16, 76, 15, 4);
    b.plat(78, 12, 4);
    b.plat(86, 10, 10);
    b.goal(92, 10);
    b.plat(-14, 2, 3); b.shard(-12.5, 4);
  }),

  // 10 ── CHASE: the Storm Front rolls in; permanent jet streams and crumbling clouds keep you sprinting
  L('Storm Front', 'chase', (b) => {
    b.chase({ speed: 4.2 });
    b.start(-6, 0, 14);
    b.plat(12, 0, 4); b.plat(20, 1, 4);
    b.crumble(28, 1, 3); b.crumble(34, 2, 3);
    b.wind(37, -4, 15, 14, 10, JET);
    b.cells(39, 4, 49, 2, 4); b.shard(44, 6.5);
    b.plat(51, 0, 6);
    b.checkpoint(53, 0);
    b.spring(55, 0, 7);
    b.plat(60, 8, 5); b.shard(58.5, 11);
    b.crumble(69, 7, 2.5); b.crumble(74, 6, 2.5);
    b.plat(79, 5, 4);
    b.wind(83, -3, 16, 14, 11, JET);
    b.cells(85, 7, 96, 5, 4);
    b.plat(98, 3, 5);
    b.crumble(106, 3, 2.4); b.crumble(111, 4, 2.4);
    b.plat(117, 4, 12);
    b.goal(125, 4);
    b.arc(8, 0, 20, 1, 4, 2);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),
];
