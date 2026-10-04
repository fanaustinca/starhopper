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
  // 11 ── down a turret-lined well: zig-zag off ledge ends while bolts cross the shaft, out through a gap at the bottom
  L('Thunder Well', 'descent', (b) => {
    b.start(-6, 30, 12);
    b.rect(8.5, 3, 1.5, 23);                          // left wall of the well (open at the bottom)
    b.rect(30, 3, 1.5, 30);                           // right wall (exit underneath)
    b.tower(10, 0, 20, 30);
    b.plat(10, 25, 11); b.turret(30, 25.8, -1, { P: 2.4 });
    b.plat(18, 20, 12); b.turret(10, 20.8, 1, { P: 2.4, off: 0.8 });
    b.plat(10, 15, 11); b.turret(30, 15.8, -1, { P: 2.2, off: 1.2 });
    b.checkpoint(12, 15);
    b.plat(18, 10, 12); b.turret(10, 10.8, 1, { P: 2.2 });
    b.plat(10, 5, 11); b.turret(30, 5.8, -1, { P: 2, off: 0.6 });
    b.plat(14, 0, 22); b.plat(3, 0, 8.5);
    b.cells(14, 26, 26, 21, 4); b.cells(22, 16, 14, 11, 3); b.cells(22, 6, 34, 1, 4);
    b.shard(20, 29.5);
    b.shard(4.5, 1.5);
    b.plat(40, -2, 4); b.beam('lightning', 42, -2, { P: 2.6, on: 0.8, h: 14 });
    b.plat(47, -4, 4); b.beam('lightning', 49, -4, { P: 2.6, on: 0.8, h: 14, off: 1.3 });
    b.plat(51, -8.5, 2.5); b.shard(52.2, -6.5);
    b.plat(54, -6, 10);
    b.goal(60, -6);
  }),

  // 12 ── ride two cloud shuttles the whole way: crosswinds shove you, a low roof forbids jumping, drones dive
  L('Jet Stream Express', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.loop([[9.5, 0], [24, 0], [32, 5], [48, 5]], { speed: 3.2, loop: false, w: 3.2 });
    b.wind(16, -2, 14, 10, -9, { P: 3.5, on: 1.2 });
    b.enemy('flyer', 27, 6.5, { ax: 0.5, ay: 1.4, T: 2.4 });
    b.rect(35, 7.3, 7, 0.8); b.shard(38.5, 10);
    b.cells(12, 1.5, 22, 1.5, 4); b.cells(30, 5.5, 46, 6.5, 5);
    b.plat(50, 5, 5);
    b.checkpoint(52, 5);
    b.loop([[58.5, 5], [70, 10], [84, 10], [96, 4], [106, 4]], { speed: 3.6, loop: false, w: 3 });
    b.thin(64, 11, 2.5); b.shard(65.2, 13);
    b.rect(74, 12.3, 8, 0.8);
    b.enemy('flyer', 90, 9.5, { ax: 0.4, ay: 1.6, T: 2 });
    b.wind(86, 3, 12, 10, 9, { P: 3, on: 1 });
    b.cells(60, 6.5, 70, 11.5, 4); b.cells(72, 11.5, 84, 11.5, 5); b.cells(88, 10, 104, 5.5, 4);
    b.plat(110, 4, 10);
    b.goal(116, 4);
    b.plat(-13, -2, 3); b.shard(-11.5, 0);
  }),

  // 13 ── RISE: the ammonia sea climbs; scale two rung columns and let alternating gusts swap you between them
  L('Rising Ammonia', 'tide', (b) => {
    b.rise({ rate: 0.6, delay: 5 });
    b.start(-6, 0, 12);
    b.tower(0, -4, 30, 38);
    b.plat(6, 3, 3.5); b.plat(1, 6, 3.5); b.plat(6, 9, 3.5);
    b.plat(-4, 9, 2.5); b.shard(-2.8, 11);
    b.wind(9.5, 8, 11, 7, 9, { gust: true, P: 3, on: 2 });
    b.cells(11, 11, 18, 11, 3); b.shard(15, 13.2);
    b.plat(20, 9, 4);
    b.plat(25.5, 12, 3.5); b.plat(20, 15, 3.5); b.plat(25.5, 18, 3.5);
    b.checkpoint(27, 18);
    b.plat(31, 21, 2.5); b.shard(32.2, 23);
    b.plat(20, 21, 4);
    b.wind(10, 20, 10, 7, -9, { gust: true, P: 3, on: 2, off: 1.5 });
    b.cells(18, 23, 11, 23, 3);
    b.plat(6, 21, 4);
    b.plat(1, 24, 3.5); b.plat(6, 27, 3.5);
    b.wind(9.5, 26, 11, 7, 9, { gust: true, P: 3, on: 2 });
    b.cells(11, 29, 18, 29, 3);
    b.plat(20, 27, 4);
    b.plat(25.5, 30, 3.5); b.plat(19, 33, 3.5);
    b.cells(2, 7, 2, 25, 4);
    b.plat(25, 36, 8);
    b.goal(29, 36);
  }),

  // 14 ── springs toss you up into the jet-stream layer; then a headwind ceiling forces single hops only
  L('Sky Layers', 'bounce', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 5); b.spring(10.5, 0, 9);
    b.wind(12, 7, 15, 8, 9, { gust: true, P: 3.4, on: 2.4 });
    b.cells(11.3, 4, 11.3, 9, 3); b.shard(14, 11);
    b.cells(16, 10, 24, 8, 3);
    b.plat(26, 6, 5);
    b.plat(35, 3, 4); b.spring(37, 3, 8);
    b.wind(39, 9, 15, 8, 9, { gust: true, P: 3.4, on: 2.4, off: 1.7 });
    b.cells(43, 13, 52, 11, 3);
    b.plat(54, 9, 5);
    b.checkpoint(56, 9);
    for (let i = 0; i < 4; i++) b.plat(62 + i * 7.5, 5, 3.5);
    b.wind(60, 9.3, 32, 7, -12, { P: 3, on: 2.2 });
    b.cells(63, 6.5, 88, 6.5, 8);
    b.shard(73, 9.8);
    b.plat(92, 3, 4); b.spring(94, 3, 9);
    b.wind(96, 9, 17, 8, 10, { gust: true, P: 3, on: 2 });
    b.cells(100, 13, 110, 11, 3);
    b.plat(112, 8, 10);
    b.goal(118, 8);
    b.thin(-12, 3, 3); b.shard(-10.5, 5);
  }),

  // 15 ── lifts bob through fixed gust bands: leap only when your barge is level with the wind
  L('Europa Relay', 'timing', (b) => {
    b.start(-6, 0, 12);
    b.lift(12, -2, 6, { T: 4 });
    b.wind(13.5, 4, 13.5, 6, 10, JET);
    b.plat(19, -3, 2.5); b.shard(20.2, -1);
    b.cells(15, 7.5, 25, 6.5, 4);
    b.plat(27, 5, 4);
    b.lift(34, 1, 9, { T: 4 });
    b.wind(35.5, 7, 12.5, 6, 10, JET);
    b.cells(37, 10.5, 46, 9.5, 4); b.shard(41, 13.2);
    b.plat(48, 8, 5);
    b.checkpoint(50, 8);
    b.slide(57, 8, 69, 8, { T: 5, w: 3 });
    b.wind(70.5, 6, 13, 8, 10, { gust: true, P: 3, on: 1.7 });
    b.cells(57, 9.5, 69, 9.5, 4); b.cells(72, 10, 82, 8, 3);
    b.plat(83, 6, 4);
    b.lift(93, 2, 11, { T: 4 });
    b.wind(94.5, 8, 12.5, 6, 10, JET);
    b.cells(96, 11, 104, 10, 3);
    b.plat(107, 9, 10);
    b.goal(113, 9);
    b.thin(115, 12.5, 3); b.shard(116.5, 14.5);
  }),

  // 16 ── two routes to the lookout: crumbling low road or a spring-fed highwire, then a long gust dive off the overlook
  L('Io Overlook', 'branching', (b) => {
    b.start(-6, 0, 12);
    for (let i = 0; i < 4; i++) b.crumble(9 + i * 6, 0, 3);
    b.plat(18, -3.3, 2.5); b.shard(19.2, -1.3);
    b.spring(3, 0, 6);
    b.thin(8, 6, 3); b.thin(14, 7, 3); b.thin(20, 8, 3);
    b.plat(25, 10, 5); b.shard(27.5, 12.5);
    b.cells(9, 7, 22, 9, 5); b.cells(10, 1.2, 28, 1.2, 4);
    b.plat(33, 0, 6);
    b.checkpoint(36, 0);
    b.plat(42, 3, 3); b.plat(47, 6, 3); b.plat(42, 9, 3); b.plat(48, 12, 4);
    b.thin(49, 15.5, 2.5); b.shard(50.2, 17.5);
    b.wind(51, 0, 18, 16, 10, { gust: true, P: 3.6, on: 2.4 });
    b.arc(52, 12, 67, 4, 5, 2);
    b.plat(68, 4, 5);
    b.plat(77, 2, 3);
    b.plat(84, 2, 10);
    b.goal(90, 2);
  }),

  // 17 ── inside a thunderhead: lightning stabs through holes in the roof, blink floors, a tunnel and a wall-jump chimney out
  L('Inside the Thunderhead', 'cave', (b) => {
    b.start(-6, 0, 12);
    b.plat(6, 0, 14);
    b.rect(6, 6, 5, 2); b.rect(13, 6, 3.5, 2); b.rect(18.5, 6, 18.5, 2);
    b.beam('lightning', 12, 0, { w: 2, h: 8, P: 2.6, on: 0.8 });
    b.beam('lightning', 17.5, 0, { w: 2, h: 8, P: 2.6, on: 0.8, off: 1.3 });
    b.shard(17.5, 4.8);
    for (let i = 0; i < 3; i++) b.blink(22 + i * 5, 0, 3, { P: 3, on: 2, off: -i * 0.6 });
    b.plat(26.5, -3.4, 2.5); b.shard(27.7, -1.4);
    b.plat(37, 0, 19);
    b.checkpoint(40, 0);
    b.rect(43, 2.2, 10, 6);                           // tunnel roof
    b.wall(52.2, 8.2, 8);                             // chimney, left side
    b.wall(56, 0, 16);                                // chimney, right side
    b.cells(44, 1, 51, 1, 4); b.cells(54.6, 4, 54.6, 14, 4);
    b.shard(54.6, 17);
    b.plat(56.8, 16, 7);
    b.blink(67, 15, 3, { P: 3, on: 2 }); b.beam('lightning', 68.5, 15, { P: 3, on: 0.8, off: 1.5, h: 12 });
    b.blink(73, 14, 3, { P: 3, on: 2, off: 1 }); b.beam('lightning', 74.5, 14, { P: 3, on: 0.8, h: 12 });
    b.cells(58, 17, 75, 15.5, 5);
    b.plat(79, 13, 10);
    b.goal(85, 13);
  }),

  // 18 ── pneumatic belt: roofed gust tubes shoot you sideways between two scaffold towers
  L('Pneumatic Belt', 'maze', (b) => {
    b.start(-6, 0, 12);
    b.tower(0, -2, 14, 22); b.tower(24, -2, 14, 26);
    b.plat(8, 3, 4); b.plat(2, 6, 3.5); b.plat(8, 9, 4);
    b.rect(12, 12.8, 13, 0.8);                        // tube roof
    b.wind(12, 8, 13, 5, 12, { gust: true, P: 3.4, on: 2.2 });
    b.cells(14, 11, 22, 10.5, 3);
    b.plat(24, 8, 9.6);
    b.checkpoint(26, 8);
    b.wall(30, 10.4, 10); b.wall(33.6, 8, 14);
    b.cells(32.2, 11, 32.2, 19, 3);
    b.plat(34.4, 22, 4);
    b.rect(38.4, 25.3, 14, 0.8);
    b.wind(38.4, 21, 14, 4.5, 12, { gust: true, P: 3.4, on: 2.2, off: 1 });
    b.beam('lightning', 45, 21.5, { w: 1.4, h: 3.8, P: 2.4, on: 0.6 });
    b.cells(40, 23.5, 50, 23, 3);
    b.plat(52, 20, 5); b.shard(54.5, 24);
    b.thin(57, 16, 3); b.thin(52, 12.5, 3); b.thin(57, 9, 3);
    b.plat(46, 13, 2.5); b.shard(47.2, 15);
    b.cells(58, 15, 58, 10, 2);
    b.plat(64, 8, 10);
    b.goal(70, 8);
    b.plat(2, 11.5, 2); b.shard(3, 13.5);
  }),

  // 19 ── storm the floating weather station: ramparts, turret towers and a button that drops the gate
  L('Storm Station Siege', 'gauntlet', (b) => {
    b.start(-6, 0, 12);
    b.plat(10, 0, 50);
    b.wall(14, 0, 2.5, 1.2);
    b.rect(22, 0, 1.6, 3.4); b.turret(22.8, 0.8, -1, { P: 2.2 });
    b.plat(25, 4, 5); b.switch(27.5, 4);
    b.redWall(32, 0, 8); b.rect(28, 8, 10, 0.8);
    b.thin(30, 10.8, 4); b.shard(32, 12.8);
    b.checkpoint(40, 0);
    b.rect(44, 3, 6, 0.8); b.turret(47, 2.4, -1, { P: 2, off: 1 });   // hanging cannon: run under it
    b.thin(52, 3, 3);
    b.rect(58, 0, 1.6, 5); b.turret(58.8, 0.8, -1, { P: 2 }); b.turret(58.8, 3.6, -1, { P: 2, off: 1 });
    b.shard(58.8, 8);
    b.cells(16, 1, 30, 1, 5); b.cells(34, 1, 56, 1, 6);
    b.plat(61, -2.5, 2.5); b.shard(62.2, -0.5);
    b.plat(64, 3, 5);
    b.enemy('flyer', 73, 6, { ax: 1, ay: 2, T: 2.4 });
    b.wind(68, -2, 14, 13, 9, { gust: true, P: 3.4, on: 2 });
    b.cells(70, 5, 80, 4, 4);
    b.plat(82, 2, 10);
    b.goal(88, 2);
  }),

  // 20 ── CHASE: the Storm Front returns, faster; downhill through jet streams, lightning and a spring vault
  L('Thunder Run', 'chase', (b) => {
    b.chase({ speed: 4.5 });
    b.start(-6, 10, 14);
    b.plat(12, 9, 4); b.plat(20, 7, 4);
    b.crumble(27, 6, 3); b.plat(33, 4, 4);
    b.wind(36, -2, 14, 14, 10, JET);
    b.cells(38, 6, 48, 4, 4);
    b.plat(50, 2, 5);
    b.checkpoint(52, 2);
    b.spring(54, 2, 7); b.shard(58.5, 13);
    b.plat(60, 10, 4);
    b.crumble(67, 9, 2.5); b.crumble(72, 8, 2.5);
    b.plat(78, 6, 4);
    b.plat(84, 4, 4); b.beam('lightning', 86, 4, { P: 1.6, on: 0.4, warn: 0.5, h: 14 });
    b.wind(88, -4, 14, 14, 11, JET);
    b.cells(90, 6, 100, 3, 4); b.shard(95, 7);
    b.plat(102, 1, 5);
    b.crumble(110, 1, 2.4); b.crumble(115, 2, 2.4);
    b.plat(121, 2, 12);
    b.goal(129, 2);
    b.arc(8, 10, 20, 7, 4, 2);
    b.plat(-13, 7, 3); b.shard(-11.5, 9);
  }),
  // 21 ── a long plunge through stacked wind layers: each band shoves you sideways as you drop to the next ledge
  L('Metallic Plunge', 'descent', (b) => {
    b.start(-6, 40, 12);
    b.plat(10, 35, 4);
    b.wind(14, 31.5, 10, 3, 9, { P: 3.2, on: 1.2 });
    b.plat(3, 31, 2.5); b.shard(4.2, 33);
    b.plat(17, 31, 3);
    b.wind(8, 27.5, 13, 3, -9, { P: 3.2, on: 1.2, off: 1.6 });
    b.plat(11, 27, 3);
    b.wind(13, 23.5, 12, 3, 9, { P: 3, on: 1.1, off: 0.8 });
    b.plat(18, 23, 4);
    b.checkpoint(20, 23);
    b.blink(25, 19, 3, { P: 3, on: 2 });
    b.plat(30, 16, 2.5); b.shard(31.2, 18);
    b.blink(19, 15, 3, { P: 3, on: 2, off: 1.5 });
    b.enemy('flyer', 22.5, 17, { ax: 1.5, ay: 0.6, T: 2.4 });
    b.plat(25, 11, 3); b.beam('lightning', 26.5, 11, { P: 2.8, on: 0.8, h: 14 });
    b.wind(28, 6.5, 12, 4, -10, { P: 3.4, on: 1.2 });
    b.crumble(31, 8, 2.5); b.crumble(36, 5, 2.5);
    b.plat(41, 2, 4);
    b.cells(12, 36.5, 18, 32.5, 3); b.cells(12, 28.5, 19, 24.5, 3); b.cells(26, 20.5, 20, 16.5, 2); b.cells(32, 9.5, 42, 3.5, 3);
    b.plat(46, -5.4, 2.5); b.shard(47.2, -3.4);
    b.plat(50, -2, 10);
    b.goal(56, -2);
  }),

  // 22 ── lightning eats the storm clouds: every blink cloud is solid exactly while its bolt is quiet
  L('Thunderclap Relay', 'timing', (b) => {
    b.start(-6, 0, 12);
    for (let i = 0; i < 4; i++) {
      b.plat(8 + i * 11, 0, 3);
      b.blink(13.5 + i * 11, 1, 3, { P: 3, on: 1.8, off: 1.35 + i * 0.75 });
      b.beam('lightning', 15 + i * 11, 1, { w: 2.2, h: 14, P: 3, on: 0.9, off: i * 0.75 });
    }
    b.thin(30, 3.6, 3); b.shard(31.5, 5.6);
    b.cells(9, 1.5, 50, 1.5, 8);
    b.plat(52, 2, 6);
    b.checkpoint(55, 2);
    b.plat(63, -1, 2.5); b.shard(64.2, 1);
    for (let i = 0; i < 3; i++) {
      b.blink(61 + i * 5, 4.5 + i * 2.5, 3, { P: 3, on: 1.8, off: 1.35 + i });
      b.beam('lightning', 62.5 + i * 5, 4.5 + i * 2.5, { w: 2.2, h: 12, P: 3, on: 0.9, off: i });
    }
    b.plat(76, 11, 4);
    b.wind(80, 4, 15, 14, 10, { gust: true, P: 3, on: 1.6 });
    b.beam('lightning', 87, 4, { w: 1.6, h: 16, P: 3, on: 0.7, off: 1.4 });
    b.cells(80, 13, 92, 11, 4); b.shard(86, 13.5);
    b.plat(94, 9, 10);
    b.goal(100, 9);
  }),

  // 23 ── gondola spire: climb a stack of turning gondola rings, each handing you up to the next
  L('Gondola Spire', 'ascent', (b) => {
    b.start(-6, 0, 12);
    b.tower(2, -2, 24, 44);
    b.ferris(12, 4, 4, { n: 4, omega: 0.6 });
    b.plat(3, 9, 4);
    b.ferris(13, 14, 4.5, { n: 4, omega: -0.55 });
    b.wind(5, 12, 16, 4, 7, { P: 3.6, on: 1.2 });
    b.plat(20, 18, 4);
    b.plat(26, 15, 2.5); b.shard(27.2, 17);
    b.ferris(13, 24, 5, { n: 5, omega: 0.5 });
    b.shard(13, 24);
    b.plat(3, 28, 5);
    b.checkpoint(5, 28);
    b.ferris(14, 35, 5, { n: 4, omega: -0.7 });
    b.wind(6, 33, 18, 4, -7, { P: 3.4, on: 1.2, off: 1 });
    b.shard(14, 43);
    b.plat(21, 40, 9);
    b.goal(26, 40);
    b.cells(12, 9, 12, 9, 1); b.cells(13, 19.5, 13, 19.5, 1); b.cells(13, 30, 13, 30, 1); b.cells(4, 11, 7, 11, 2); b.cells(4, 30, 7, 30, 2);
  }),

  // 24 ── the Galilean highwire: tiny ledges in a pulsing crosswind, drones overhead, one blind gust leap
  L('Galilean Highwire', 'precision', (b) => {
    b.start(-6, 0, 12);
    b.thin(9, 2, 2); b.thin(15, 4, 1.6); b.thin(21, 6, 1.6); b.thin(27, 7, 1.6); b.thin(33, 6, 1.6); b.thin(39, 4, 2);
    b.wind(12, 0, 30, 12, 7, { P: 3.4, on: 1.2 });
    b.enemy('flyer', 24, 9.5, { ax: 2, ay: 0.5, T: 2.6 });
    b.enemy('flyer', 36, 8.5, { ax: 2, ay: 0.5, T: 2.2 });
    b.shard(27.8, 10.5);
    b.cells(10, 3, 40, 5, 6);
    b.plat(44, 4, 4);
    b.checkpoint(46, 4);
    b.wind(48, -2, 14, 14, 9, { gust: true, P: 3.2, on: 1.8 });
    b.shard(55, 7.5);
    b.thin(62, 3, 2);
    b.thin(68, 5, 1.6); b.thin(74, 7, 1.6); b.thin(80, 9, 1.6);
    b.wind(66, 3, 8, 8, -8, { P: 3, on: 1 });
    b.wind(72, 5, 8, 8, 8, { P: 3, on: 1, off: 1.5 });
    b.enemy('flyer', 77, 12, { ax: 0.5, ay: 1.2, T: 2 });
    b.cells(50, 6, 60, 5, 4); b.cells(69, 6.5, 81, 10.5, 3);
    b.plat(87, 8, 8);
    b.goal(92, 8);
    b.plat(-12, -3, 3); b.shard(-10.5, -1);
  }),

  // 25 ── RED SPOT: the edge of the storm, where two opposing winds slam back and forth across the stepping stones
  L('Edge of the Red Spot', 'wind', (b) => {
    b.start(-6, 0, 12);
    for (let i = 0; i < 6; i++) b.pillarPlat(9 + i * 6, (i % 2) * 1.5, 2.4);
    b.wind(7, -3, 37, 13, 11, { P: 2.4, on: 0.6 });
    b.wind(7, -3, 37, 13, -11, { P: 2.4, on: 0.6, off: 1.2 });
    b.beam('lightning', 28.2, 0, { w: 1.6, h: 16, P: 2.4, on: 0.5, off: 0.6 });
    b.plat(12, -3, 2); b.shard(13, -1);
    b.cells(10.2, 2, 40.2, 3, 6);
    b.plat(46, 2, 5);
    b.checkpoint(48, 2);
    b.plat(54, 5, 2.5); b.plat(50, 8.5, 2.5); b.plat(55, 12, 2.5); b.plat(50, 15.5, 2.5);
    b.wind(48, 6, 12, 4, 10, { P: 2.4, on: 0.7 });
    b.wind(48, 13, 12, 4, -10, { P: 2.4, on: 0.7, off: 1.2 });
    b.beam('lightning', 51.25, 8.5, { w: 1.6, h: 5, P: 2, on: 0.5 });
    b.plat(45, 12, 2); b.shard(46, 14);
    b.plat(56, 19, 4);
    b.wind(60, 14, 16, 10, 11, { gust: true, P: 2.4, on: 1.4 });
    b.shard(68, 20.5);
    b.cells(52, 7, 52, 17, 4); b.cells(62, 21, 74, 19, 4);
    b.plat(76, 16, 3);
    b.plat(83, 14, 8);
    b.goal(88, 14);
  }),

  // 26 ── vortex rings: nested pairs of counter-rotating rings; hop inward, hop outward, never stand still
  L('Vortex Rings', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.ferris(16, 3, 6, { n: 6, omega: -0.5 });
    b.ferris(16, 3, 3, { n: 3, omega: 0.9, w: 2 });
    b.shard(16, 3);
    b.plat(26, 5, 4);
    b.ferris(40, 7, 7, { n: 7, omega: 0.55 });
    b.ferris(40, 7, 3.5, { n: 4, omega: -1, w: 2 });
    b.beam('lightning', 40, 5, { w: 1.4, h: 4, P: 2.2, on: 0.6 });
    b.shard(40, 16.5);
    b.plat(50, 9, 4);
    b.checkpoint(52, 9);
    b.ferris(64, 10, 7.5, { n: 8, omega: -0.6 });
    b.ferris(64, 10, 4, { n: 4, omega: 0.8, w: 2 });
    b.wind(56, 4, 16, 14, 8, { P: 3, on: 0.9 });
    b.wind(56, 4, 16, 14, -8, { P: 3, on: 0.9, off: 1.5 });
    b.shard(64, 10);
    b.plat(74, 12, 4);
    b.plat(80, 10, 10);
    b.goal(86, 10);
    b.cells(16, 10, 16, 10, 1); b.cells(28, 6.5, 30, 6.5, 2); b.cells(52, 10.5, 54, 10.5, 2); b.cells(64, 18.5, 64, 18.5, 1);
  }),

  // 27 ── crimson maelstrom: a rolling wave of lightning sweeps the causeway, then gust leaps between struck islands
  L('Crimson Maelstrom', 'gauntlet', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 44);
    for (let i = 0; i < 10; i++) b.beam('lightning', 11 + i * 4.4, 0, { w: 2, h: 14, P: 2.2, on: 0.5, warn: 0.5, off: -i * 0.5 });
    b.thin(26, 3.6, 5); b.shard(28.5, 5.6);
    b.cells(10, 1, 50, 1, 10);
    b.plat(56, 2, 5);
    b.checkpoint(58, 2);
    b.wind(60, -3, 14, 14, 10, { gust: true, P: 2.8, on: 1.6 });
    b.plat(73, 2, 3); b.beam('lightning', 74.5, 2, { w: 2, h: 14, P: 2.8, on: 0.7, off: 1.2 });
    b.enemy('flyer', 67, 6, { ax: 1, ay: 1.5, T: 2 });
    b.wind(76, -2, 13, 14, 10, { gust: true, P: 2.8, on: 1.6, off: 1.4 });
    b.shard(81, 7);
    b.plat(88, 4, 3); b.beam('lightning', 89.5, 4, { w: 2, h: 14, P: 2.8, on: 0.7, off: 2.6 });
    b.enemy('flyer', 96, 7.5, { ax: 1.5, ay: 1, T: 2.4 });
    b.cells(62, 5, 71, 4, 3); b.cells(78, 6, 86, 6, 3); b.cells(92, 6, 100, 5, 3);
    b.plat(100, 3, 10);
    b.goal(106, 3);
    b.plat(-14, 2, 3); b.shard(-12.5, 4);
  }),

  // 28 ── RISE inside the vortex wall: chimney, wind-lashed zig-zag, then crumbling rungs under lightning
  L('Crimson Updraft', 'tide', (b) => {
    b.rise({ rate: 0.75, delay: 4 });
    b.start(-6, 0, 17.6);
    b.tower(6, -4, 26, 46);
    b.wall(8, 2.2, 12); b.wall(11.6, 0, 14);
    b.cells(10.2, 3, 10.2, 11, 3); b.shard(10.2, 13);
    b.plat(12.4, 14, 4);
    b.plat(20, 17, 3); b.plat(14, 20, 3); b.plat(20, 23, 3);
    b.wind(12, 16, 13, 10, 9, { P: 2.6, on: 0.8 });
    b.wind(12, 16, 13, 10, -9, { P: 2.6, on: 0.8, off: 1.3 });
    b.plat(26, 21, 2); b.shard(27, 23);
    b.plat(13, 26, 5);
    b.checkpoint(15, 26);
    b.crumble(20, 29, 2.5); b.crumble(14, 32, 2.5); b.crumble(20, 35, 2.5); b.crumble(14, 38, 2.5);
    b.beam('lightning', 21.25, 29, { w: 1.6, h: 3, P: 2.4, on: 0.5 });
    b.beam('lightning', 15.25, 32, { w: 1.6, h: 3, P: 2.4, on: 0.5, off: 1.2 });
    b.beam('lightning', 21.25, 35, { w: 1.6, h: 3, P: 2.4, on: 0.5 });
    b.cells(16, 27.5, 21, 39.5, 5);
    b.plat(19, 41, 4);
    b.plat(26, 44, 8);
    b.thin(31, 47.5, 3); b.shard(32.5, 49.5);
    b.goal(29, 44);
  }),

  // 29 ── the cyclone core: hop between counter-spinning diamond shuttles around lightning cores, then the ring, then the leap
  L('Cyclone Core', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.loop([[10, 0], [20, 6], [30, 0], [20, -6]], { speed: 4, w: 2.6 });
    b.beam('lightning', 20, -4.5, { w: 1.6, h: 9, P: 2, on: 0.6 });
    b.shard(20, 9);
    b.loop([[29, 2], [38, 8], [47, 2], [38, -4]], { speed: 4.4, w: 2.6, phase: 0.5 });
    b.beam('lightning', 38, -2.5, { w: 1.6, h: 9, P: 2, on: 0.6, off: 1 });
    b.plat(51, 4, 4);
    b.checkpoint(53, 4);
    b.ferris(64, 6, 5, { n: 4, omega: 1 });
    b.wind(57, 0, 14, 13, 9, { P: 2.6, on: 0.7 });
    b.wind(57, 0, 14, 13, -9, { P: 2.6, on: 0.7, off: 1.3 });
    b.shard(64, 6);
    b.plat(72, 8, 3);
    b.wind(75, 2, 15, 14, 10, { gust: true, P: 2.4, on: 1.4 });
    b.beam('lightning', 83, 2, { w: 1.6, h: 16, P: 2.4, on: 0.5, off: 1.2 });
    b.cells(77, 10, 88, 8, 4);
    b.plat(89, 6, 3);
    b.crumble(95, 7, 2);
    b.plat(100, 8, 8);
    b.thin(100.5, 11.5, 2.5); b.shard(101.7, 13.5);
    b.goal(105, 8);
    b.cells(12, 2, 28, 2, 4); b.cells(31, 4, 45, 4, 4);
  }),

  // 30 ── FINALE in the eye: roofs under lightning, wind-slammed pillars, a vortex ring, then the Storm Front chases you into the calm
  L('Eye of the Red Spot', 'finale', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 14);
    b.rect(13.5, 2.4, 3, 0.8);
    b.beam('lightning', 11, 0, { w: 4, h: 14, P: 2.4, on: 0.7 });
    b.beam('lightning', 19.5, 0, { w: 5, h: 14, P: 2.4, on: 0.7, off: 1.2 });
    b.shard(15, 5);
    b.pillarPlat(26, 1, 2.2); b.pillarPlat(31.5, 2, 2.2); b.pillarPlat(37, 1, 2.2);
    b.wind(24, -2, 16, 12, 11, { P: 2.4, on: 0.6 });
    b.wind(24, -2, 16, 12, -11, { P: 2.4, on: 0.6, off: 1.2 });
    b.ferris(48, 4, 4.5, { n: 4, omega: 0.8 });
    b.shard(48, 4);
    b.plat(56, 6, 6);
    b.checkpoint(58, 6);
    b.chase({ speed: 4.7, trigger: 61, behind: 16 });
    b.plat(66, 6, 4);
    b.wind(70, -2, 14, 14, 11, JET);
    b.plat(84, 4, 4);
    b.crumble(91, 5, 2.5); b.crumble(96, 6, 2.5);
    b.plat(101, 6, 4); b.spring(103, 6, 7);
    b.shard(106.5, 16.5);
    b.plat(108, 14, 4);
    b.crumble(116, 13, 2.4); b.crumble(121, 12, 2.4);
    b.wind(124, 4, 14, 14, 11, JET);
    b.plat(138, 10, 12);
    b.goal(146, 10);
    b.cells(9, 1, 21, 1, 4); b.cells(27, 3, 38, 3, 3); b.cells(67, 7, 82, 6, 5); b.cells(109, 15, 122, 13, 4); b.cells(126, 15, 136, 12, 4);
  }),
];
