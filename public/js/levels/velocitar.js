// WORLD 16 — VELOCITAR. 30 hand-written speed-run levels (451–480).
// A neon synthwave planet over a glowing grid, gravity 1.0. Falling = respawn.
// Signature toys: boost lanes, fling rings, neon rails, cannons, loop tracks, laser gates.
import { L } from './dsl.js';

export default [
  // 451 ── a boost lane into a three-ring chain, a touch-down, a second boost and a neon rail down to the goal
  L('Ignition Strip', 'intro', (b) => {
    b.start(-6, 0, 12);
    b.boost(8, 0, 10, 12);
    b.ring(26, 3, { angle: 30 }); b.ring(34, 4, { angle: 30 }); b.ring(42, 5, { angle: 30 });
    b.plat(52, 4, 7);
    b.checkpoint(55, 4);
    b.boost(62, 4, 10, 14);
    b.zip(81, 8.5, 99, 4.6);
    b.plat(98, 3, 12);
    b.goal(104, 3);
    b.cells(9, 1.2, 17, 1.2, 4); b.arc(19, 1.5, 52, 5.5, 8, 3); b.cells(63, 5.2, 71, 5.2, 4); b.cells(82, 7.5, 96, 5, 6);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.shard(34, 6.5);
    b.shard(68, 8.2);
  }),

  // 452 ── a laser slalom on a boost lane: duck under the spinning bars at full speed, jump the gap, then fling out over the grid
  L('Neon Slalom', 'boost', (b) => {
    b.start(-6, 0, 12);
    b.boost(8, 0, 24, 12);
    b.sweeper(15, 4.4, 2.4, { omega: 120, both: true });
    b.sweeper(24, 4.4, 2.4, { omega: -120, both: true });
    b.plat(44, 0, 5);
    b.checkpoint(46, 0);
    b.boost(54, 0, 16, 14);
    b.sweeper(60, 4.4, 2.4, { omega: 140, both: true });
    b.sweeper(67, 4.4, 2.4, { omega: -140, both: true });
    b.plat(82, 0, 7);
    b.ring(95, 3, { angle: 30 }); b.ring(104, 3, { angle: 30 });
    b.plat(116, 2, 10);
    b.goal(122, 2);
    b.cells(9, 1.2, 31, 1.2, 8); b.cells(55, 1.2, 69, 1.2, 6); b.arc(86, 1.5, 116, 3.5, 8, 4);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.thin(36, 4.2, 4); b.shard(38, 5.8);
    b.thin(74, 4.2, 4); b.shard(76, 5.8);
  }),

  // 453 ── an auto-firing cannon relay across the grid: blast, blast, blast, then a ring to the pad
  L('Cannon Relay', 'cannons', (b) => {
    b.start(-6, 0, 12);
    b.boost(8, 0, 8, 12);
    b.barrel(26, 2.5, { angle: 28, auto: true });
    b.barrel(42, 4, { angle: 28, auto: true });
    b.barrel(58, 5, { angle: 28, auto: true });
    b.plat(70, 4, 6);
    b.checkpoint(72, 4);
    b.boost(77, 4, 8, 14);
    b.ring(95, 7, { angle: 25 });
    b.barrel(108, 8, { angle: 20, auto: true });
    b.plat(124, 7, 10);
    b.goal(130, 7);
    b.arc(27, 3.5, 41, 5, 5, 3); b.arc(43, 5, 57, 6, 5, 3); b.arc(59, 6, 69, 5.5, 4, 2);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.shard(12, 4.2); b.shard(70, 8);
  }),

  // 454 ── rail junctions: neon cables chained mid-air, a spring back up, then a ring pair onto the finish
  L('Rail Junction', 'rails', (b) => {
    b.start(-6, 0, 12);
    b.zip(8, 4.4, 26, 2.4);
    b.zip(28, 4.6, 46, 2.6);
    b.plat(48, 1, 6);
    b.checkpoint(50, 1);
    b.zip(53, 4.3, 74, 2.2);
    b.zip(76, 4, 91, 1.5);
    b.plat(92, 0, 4);
    b.ring(100, 3, { angle: 30 }); b.ring(109, 3, { angle: 30 });
    b.plat(120, 2, 10);
    b.goal(126, 2);
    b.cells(9, 3.6, 25, 1.6, 6); b.cells(29, 3.8, 45, 1.8, 6); b.cells(54, 3.4, 73, 1.4, 6); b.cells(77, 3.2, 90, 1, 5);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.shard(50.5, 5.2);
    b.shard(94, 4);
  }),

  // 455 ── the hyperlane: a vertical zig-zag climb by steep fling rings and a spring while the floor chases you up
  L('Hyperlane Climb', 'ascent', (b) => {
    b.rise({ rate: 0.7, delay: 5 });
    b.start(-6, 0, 12);
    b.plat(7, 0, 5); b.spring(10, 0, 9);
    b.ring(13, 9, { angle: 75, speed: 26 }); b.ring(17, 17, { angle: 75, speed: 26 }); b.ring(21, 25, { angle: 75, speed: 26 });
    b.plat(24, 27, 6);
    b.checkpoint(26, 27);
    b.spring(29, 27, 8);
    b.ring(25, 36, { angle: 105, speed: 26 }); b.ring(21, 44, { angle: 105, speed: 26 });
    b.plat(11, 45, 6);
    b.ring(16, 53, { angle: 75, speed: 26 }); b.ring(20, 61, { angle: 75, speed: 26 });
    b.plat(23, 63, 9);
    b.goal(29, 63);
    b.cells(13, 11, 13.5, 15, 3); b.cells(17, 19, 17.5, 23, 3); b.cells(25.3, 38, 21.3, 42, 3); b.cells(16.5, 55, 16.5, 59, 3);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.shard(19, 19.5);
    b.shard(26, 31);
  }),

  // 456 ── a drag strip: three boost lanes with long jumps between, a turret and laser to blast past
  L('Drag Strip', 'boost', (b) => {
    b.start(-6, 0, 12);
    b.boost(8, 0, 12, 14);
    b.boost(33, 0, 10, 16);
    b.plat(56, 0, 4);
    b.checkpoint(61, 2.2);
    b.rect(60, 0, 2, 2.2); b.turret(60.5, 1.5, -1, { P: 1.6, speed: 12 });
    b.boost(66, 0, 12, 16);
    b.boost(92, 1, 12, 16);
    b.plat(118, 2, 10);
    b.goal(124, 2);
    b.cells(9, 1.2, 19, 1.2, 5); b.arc(21, 1.5, 33, 1.5, 5, 3); b.cells(34, 1.2, 42, 1.2, 4); b.arc(66, 1.4, 92, 2.4, 8, 3);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.shard(14, 4.2); b.shard(100, 4.6);
  }),

  // 457 ── racing-loop tracks: hop between fast circuit pads, a spring and a ring to leave the circuit
  L('Circuit Racers', 'loops', (b) => {
    b.start(-6, 0, 12);
    b.slide(12, 1, 24, 1, { T: 3, w: 4 });
    b.loop([[34, 3], [42, 3], [42, 6], [34, 6]], { speed: 8, w: 4 });
    b.plat(52, 4, 4);
    b.checkpoint(54, 4);
    b.slide(62, 4, 62, 10, { T: 3, w: 4 });
    b.slide(70, 10, 82, 10, { T: 3, w: 4 });
    b.plat(88, 9, 4);
    b.spring(91, 9, 7);
    b.ring(96, 13, { angle: 30 }); b.ring(105, 14, { angle: 30 });
    b.plat(116, 12, 10);
    b.goal(122, 12);
    b.cells(10, 2.6, 24, 2.6, 5); b.cells(33, 7.5, 43, 7.5, 5); b.cells(62, 6, 62, 11, 4); b.cells(71, 11.5, 82, 11.5, 5);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.shard(54, 7.5); b.shard(76, 13);
  }),

  // 458 ── neon cables: a chain of swings, a zip and a pair of pendulums, always in motion
  L('Cable Chain', 'swing', (b) => {
    b.start(-6, 0, 12);
    b.vine(11, 8, 6); b.vine(20, 8, 6); b.vine(29, 8, 6);
    b.plat(36, 1, 4);
    b.checkpoint(38, 1);
    b.zip(44, 5.2, 61, 2.4);
    b.plat(62, 1.5, 3);
    b.pendulum(72, 11, 8, { amp: 40, T: 2.4, w: 3.5 });
    b.pendulum(81, 11, 8, { amp: 40, T: 2.4, w: 3.5, phase: 0.5 });
    b.plat(91, 3, 7);
    b.ring(103, 5, { angle: 30 });
    b.plat(114, 4, 10);
    b.goal(120, 4);
    b.cells(11, 2.5, 29, 2.5, 8); b.cells(45, 4.5, 60, 2.2, 6); b.cells(72, 4.5, 82, 4.5, 5);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.shard(38, 5.2);
    b.shard(94, 7);
  }),

  // 459 ── laser gates: wreckers and sweepers across a ring tunnel, boost out of the last gate
  L('Laser Gate', 'gates', (b) => {
    b.start(-6, 0, 12);
    b.boost(8, 0, 10, 12);
    b.ring(26, 3, { angle: 30 });
    b.sweeper(33, 6.5, 3, { omega: 110, both: true });
    b.ring(35, 4, { angle: 30 });
    b.plat(48, 3, 5);
    b.checkpoint(50, 3);
    b.wrecker(60, 11, 7, { amp: 40, T: 2 });
    b.boost(56, 3, 10, 14);
    b.plat(78, 2, 5);
    b.sweeper(86, 6, 3, { omega: -130, both: true });
    b.ring(88, 4, { angle: 30 }); b.ring(97, 4, { angle: 30 });
    b.boost(108, 4, 10, 14);
    b.plat(128, 3, 10);
    b.goal(134, 3);
    b.cells(9, 1.2, 17, 1.2, 4); b.cells(57, 4.2, 65, 4.2, 4); b.cells(109, 5.2, 117, 5.2, 4);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.shard(34, 6.5); b.shard(112, 8.2);
  }),

  // 460 ── OVERDRIVE WAVE: the grid collapses behind you, so boost, ring, cannon, rail and never stop
  L('Overdrive Wave', 'chase', (b) => {
    b.chase({ speed: 3.8 });
    b.start(-6, 0, 14);
    b.boost(10, 0, 8, 12);
    b.ring(26, 3, { angle: 30 }); b.ring(34, 4, { angle: 30 });
    b.plat(44, 3, 5);
    b.barrel(55, 5.5, { angle: 25, auto: true });
    b.plat(68, 5, 5);
    b.checkpoint(70, 5);
    b.zip(76, 9, 96, 5);
    b.boost(98, 4, 10, 14);
    b.ring(119, 6, { angle: 30 }); b.ring(128, 7, { angle: 30 });
    b.plat(140, 6, 12);
    b.goal(146, 6);
    b.arc(10, 1.2, 40, 4, 8, 3); b.cells(77, 8, 95, 5, 6); b.cells(99, 5.2, 107, 5.2, 4);
    b.shard(-12, 3.5); b.plat(-14, 1.5, 3);
    b.shard(34, 6.5); b.shard(104, 8.2);
  }),
  // 461 ── alternating boost lanes and ring pairs: every straight launches the next fling, climbing a step at a time
  L('Grid Runner', 'boost', (b) => {
    b.start(-6, 0, 12);
    b.boost(8, 0, 10, 12);
    b.ring(26, 3, { angle: 30 }); b.ring(34, 3, { angle: 30 });
    b.boost(44, 2, 14, 14);
    b.ring(66, 5.4, { angle: 30 }); b.ring(74, 5.4, { angle: 30 }); b.ring(82, 6.4, { angle: 30 });
    b.plat(93, 5, 6);
    b.checkpoint(95, 5);
    b.boost(99, 5, 12, 15);
    b.ring(120, 8, { angle: 30 }); b.ring(128, 8, { angle: 30 });
    b.plat(139, 7, 10);
    b.goal(145, 7);
    b.arc(10, 1.2, 40, 3.2, 8, 3); b.cells(45, 3.2, 57, 3.2, 5); b.cells(100, 6.2, 110, 6.2, 5);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.shard(34, 5.5);
    b.shard(74, 7.9);
  }),

  // 462 ── a staircase of auto cannons climbing the grid, a rail down and a closing ring pair
  L('Pulse Barrels', 'cannons', (b) => {
    b.start(-6, 0, 12);
    b.boost(8, 0, 8, 12);
    b.barrel(24, 2.5, { angle: 35, auto: true });
    b.barrel(37, 4.5, { angle: 35, auto: true });
    b.barrel(50, 6.5, { angle: 35, auto: true });
    b.barrel(63, 8.5, { angle: 35, auto: true });
    b.plat(74, 7, 6);
    b.checkpoint(76, 7);
    b.zip(80, 10.5, 98, 7);
    b.ring(104, 8.5, { angle: 30 }); b.ring(112, 8.5, { angle: 30 });
    b.barrel(120, 8.5, { angle: 15, auto: true });
    b.plat(134, 8, 10);
    b.goal(140, 8);
    b.cells(25, 3.6, 36, 5, 4); b.cells(38, 5.6, 49, 7, 4); b.cells(51, 7.6, 62, 9, 4); b.cells(81, 9.6, 97, 7.2, 6);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.shard(76, 11);
    b.shard(112, 10.5);
  }),

  // 463 ── a descent: fling down a stairway of rings and cables into the glowing grid, boosting out at the bottom
  L('Gridfall', 'descent', (b) => {
    b.start(-6, 30, 12);
    b.boost(8, 30, 10, 12);
    b.ring(28, 33, { angle: 30 }); b.ring(40, 31, { angle: 30 }); b.ring(52, 29, { angle: 30 });
    b.plat(62, 28, 5);
    b.checkpoint(64, 28);
    b.zip(66, 31.5, 84, 22);
    b.plat(85, 19, 4);
    b.ring(93, 22.4, { angle: 30 }); b.ring(101, 22.4, { angle: 30 });
    b.boost(110, 21, 10, 14);
    b.plat(132, 17, 10);
    b.goal(138, 17);
    b.arc(10, 31.2, 54, 29, 8, 3); b.cells(67, 30.6, 83, 22.8, 6); b.cells(111, 22.2, 119, 22.2, 4);
    b.plat(-14, 31.5, 3); b.shard(-12.5, 33.5);
    b.shard(28, 35.5);
    b.shard(101, 24.9);
  }),

  // 464 ── speed tunnels: boost lanes under low ceilings with tiny gaps, a ring tunnel between them
  L('Turbine Tunnel', 'tunnel', (b) => {
    b.start(-6, 0, 12);
    b.rect(8, 4.6, 46, 1);
    b.boost(8, 0, 10, 12); b.boost(22, 0, 10, 14); b.boost(36, 0, 12, 14);
    b.ring(58, 3.4, { angle: 30 }); b.ring(66, 3.4, { angle: 30 });
    b.plat(76, 2, 5);
    b.checkpoint(78, 2);
    b.rect(81, 6.6, 30, 1);
    b.boost(81, 2, 10, 14); b.boost(95, 2, 16, 15);
    b.ring(120, 5.4, { angle: 30 }); b.ring(128, 5.4, { angle: 30 });
    b.plat(139, 4, 10);
    b.goal(145, 4);
    b.cells(9, 1.2, 46, 1.2, 12); b.cells(82, 3.2, 110, 3.2, 8);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.shard(28, 4);
    b.shard(66, 5.9);
  }),

  // 465 ── a disco of swinging pads: pendulums in counter-phase between ring pairs, then a rail finish
  L('Pendulum Disco', 'swing', (b) => {
    b.start(-6, 0, 12);
    b.boost(8, 0, 8, 12);
    b.ring(24, 3.4, { angle: 30 }); b.ring(32, 3.4, { angle: 30 });
    b.plat(42, 2, 3);
    b.pendulum(52, 11, 8, { amp: 40, T: 2.4, w: 3.5 });
    b.pendulum(61, 11, 8, { amp: 40, T: 2.4, w: 3.5, phase: 0.5 });
    b.pendulum(70, 11, 8, { amp: 40, T: 2.4, w: 3.5 });
    b.plat(79, 2, 4);
    b.checkpoint(81, 2);
    b.zip(84, 5.3, 102, 2);
    b.plat(103, 0, 4);
    b.ring(111, 3, { angle: 30 }); b.ring(120, 3, { angle: 30 });
    b.plat(131, 2, 10);
    b.goal(137, 2);
    b.cells(52, 4.5, 71, 4.5, 8); b.cells(85, 4.5, 101, 2.3, 6);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.shard(32, 5.9);
    b.shard(81, 6);
  }),

  // 466 ── double helix: ride a fast lift and a spinning racing loop up, hop a slider, then rings and a long rail
  L('Double Helix', 'loops', (b) => {
    b.start(-6, 0, 12);
    b.slide(12, 1, 12, 9, { T: 2.4, w: 4 });
    b.plat(18, 9, 4);
    b.loop([[30, 9], [36, 9], [36, 13], [30, 13]], { speed: 8, w: 4 });
    b.plat(44, 12, 4);
    b.slide(52, 12, 64, 12, { T: 2.6, w: 4 });
    b.ring(74, 15.4, { angle: 30 }); b.ring(82, 15.4, { angle: 30 });
    b.plat(92, 14, 6);
    b.checkpoint(94, 14);
    b.zip(98, 17.4, 116, 12);
    b.plat(117, 10.5, 8);
    b.goal(122, 10.5);
    b.cells(12, 3, 12, 8, 4); b.cells(29, 14.5, 37, 14.5, 4); b.cells(99, 16.4, 115, 12.8, 6);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.shard(46, 16);
    b.shard(82, 17.9);
  }),

  // 467 ── wrecker alley: swinging hammers above a boost lane; read the beat and keep your speed
  L('Wrecker Alley', 'gates', (b) => {
    b.start(-6, 0, 12);
    b.boost(8, 0, 26, 12);
    b.wrecker(17, 9, 7, { amp: 50, T: 2.2 });
    b.wrecker(26, 9, 7, { amp: 50, T: 2.2, phase: 0.5 });
    b.plat(46, 0, 5);
    b.checkpoint(48, 0);
    b.boost(54, 0, 22, 14);
    b.wrecker(64, 9, 7, { amp: 50, T: 2 });
    b.wrecker(72, 9, 7, { amp: 50, T: 2, phase: 0.5 });
    b.ring(90, 3, { angle: 30 }); b.ring(98, 3, { angle: 30 });
    b.plat(109, 2, 10);
    b.goal(115, 2);
    b.cells(9, 1.2, 33, 1.2, 8); b.cells(55, 1.2, 75, 1.2, 8);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.shard(40, 3.5);
    b.shard(98, 5.5);
  }),

  // 468 ── spring skyline: spring pad after spring pad up a neon tower, then a monster rail and ring pair back down
  L('Spring Skyline', 'ascent', (b) => {
    b.start(-6, 0, 12);
    b.plat(7, 0, 5); b.spring(10, 0, 8);
    b.plat(14, 7, 6); b.spring(18, 7, 8);
    b.plat(24, 14, 6); b.spring(28, 14, 8);
    b.plat(34, 21, 6);
    b.checkpoint(36, 21);
    b.zip(40, 24.5, 68, 12);
    b.plat(69, 10, 4);
    b.ring(77, 13.4, { angle: 30 }); b.ring(85, 13.4, { angle: 30 });
    b.plat(96, 12, 10);
    b.goal(102, 12);
    b.cells(10.5, 2, 10.5, 7, 3); b.cells(18.5, 9, 18.5, 14, 3); b.cells(41, 23.6, 67, 12.4, 8);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.shard(24, 20);
    b.shard(85, 15.9);
  }),

  // 469 ── twister lift: a tornado carries you up to a boost lane, then a second one to a high rail
  L('Twister Lift', 'lift', (b) => {
    b.start(-6, 0, 12);
    b.plat(10, 0, 10);
    b.tornado(13, 17, 0, { rise: 9, T: 2.5 });
    b.plat(24, 8, 5);
    b.boost(29, 8, 10, 14);
    b.ring(48, 11.4, { angle: 30 }); b.ring(56, 11.4, { angle: 30 });
    b.plat(66, 6, 10);
    b.checkpoint(68, 6);
    b.tornado(70, 74, 6, { rise: 10, T: 2.5 });
    b.plat(82, 14, 5);
    b.zip(86, 17.5, 108, 8);
    b.plat(109, 6, 10);
    b.goal(115, 6);
    b.cells(11, 1.2, 19, 1.2, 4); b.cells(30, 9.2, 38, 9.2, 4); b.cells(87, 16.5, 107, 8.8, 7);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.shard(56, 13.9);
    b.shard(85, 18.5);
  }),

  // 470 ── OVERDRIVE WAVE II: faster, longer: a boost, a ring pair, loop pad, cannon, rail and a final boost under the wave
  L('Overdrive Surge', 'chase', (b) => {
    b.chase({ speed: 4.2 });
    b.start(-6, 0, 14);
    b.boost(10, 0, 8, 12);
    b.ring(26, 3, { angle: 30 }); b.ring(34, 3, { angle: 30 });
    b.slide(40, 2, 52, 2, { T: 2.2, w: 4 });
    b.barrel(63, 4.5, { angle: 28, auto: true });
    b.plat(77, 4, 5);
    b.checkpoint(79, 4);
    b.zip(83, 7.5, 103, 3);
    b.plat(104, 1, 4);
    b.boost(108, 1, 10, 15);
    b.ring(128, 4.4, { angle: 30 }); b.ring(136, 4.4, { angle: 30 }); b.ring(144, 5.4, { angle: 30 });
    b.boost(156, 4, 12, 15);
    b.plat(180, 4, 12);
    b.goal(186, 4);
    b.cells(10, 1.2, 18, 1.2, 4); b.cells(84, 6.5, 102, 3.2, 6); b.cells(109, 2.2, 117, 2.2, 4); b.cells(157, 5.2, 167, 5.2, 5);
    b.shard(-12, 3.5); b.plat(-14, 1.5, 3);
    b.shard(34, 5.5);
    b.shard(136, 6.9);
  }),
  // 471 ── the ring tunnel: six fling rings back to back, a boost, then three more and a rail to the goal
  L('Ring Tunnel', 'rings', (b) => {
    b.start(-6, 0, 12);
    b.boost(8, 0, 10, 12);
    b.ring(26, 3, { angle: 30 }); b.ring(34, 3, { angle: 30 }); b.ring(42, 4, { angle: 30 });
    b.ring(50, 4, { angle: 30 }); b.ring(58, 5, { angle: 30 }); b.ring(66, 5, { angle: 30 });
    b.plat(76, 4, 5);
    b.checkpoint(78, 4);
    b.boost(81, 4, 10, 14);
    b.ring(99, 7.4, { angle: 30 }); b.ring(107, 7.4, { angle: 30 }); b.ring(115, 8.4, { angle: 30 });
    b.zip(123, 12, 141, 7);
    b.plat(142, 5, 10);
    b.goal(148, 5);
    b.arc(10, 1.2, 70, 6, 12, 2); b.cells(82, 5.2, 90, 5.2, 4); b.cells(124, 11, 140, 7.4, 6);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.shard(50, 6.5);
    b.shard(107, 9.9);
  }),

  // 472 ── slingshot skyway: cannon, touch-down, cannon, rail, rings, cannon, boost, rings
  L('Slingshot Skyway', 'cannons', (b) => {
    b.start(-6, 0, 12);
    b.barrel(12, 2.5, { angle: 40, auto: true });
    b.plat(24, 3, 4);
    b.barrel(31, 5.2, { angle: 30, auto: true });
    b.plat(46, 5, 4);
    b.checkpoint(48, 5);
    b.zip(51, 8.5, 69, 4.2);
    b.plat(70, 3, 3);
    b.ring(78, 6.4, { angle: 30 }); b.ring(86, 6.4, { angle: 30 });
    b.barrel(94, 7, { angle: 20, auto: true });
    b.boost(110, 7, 10, 14);
    b.ring(129, 10.4, { angle: 30 }); b.ring(137, 10.4, { angle: 30 });
    b.plat(148, 9, 8);
    b.goal(153, 9);
    b.cells(13, 3.6, 23, 4.2, 4); b.cells(32, 6.2, 45, 6.8, 5); b.cells(52, 7.5, 68, 4.6, 6); b.cells(111, 8.2, 119, 8.2, 4);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.shard(26, 7.5);
    b.shard(86, 8.9);
  }),

  // 473 ── hyperlane II: blast up a shaft by vertical auto cannons and steep rings, with the floor rising fast
  L('Hyperlane Surge', 'ascent', (b) => {
    b.rise({ rate: 0.8, delay: 4 });
    b.start(-6, 0, 12);
    b.plat(7, 0, 5); b.spring(10, 0, 9);
    b.barrel(13, 9, { angle: 80, power: 28, auto: true });
    b.barrel(16, 18, { angle: 80, power: 28, auto: true });
    b.barrel(19, 27, { angle: 80, power: 28, auto: true });
    b.barrel(22, 36, { angle: 68, power: 28, auto: true });
    b.plat(27, 42, 9);
    b.checkpoint(30, 42);
    b.ring(33, 45.4, { angle: 75, speed: 26 }); b.ring(37, 53.4, { angle: 75, speed: 26 });
    b.plat(40, 55, 5);
    b.ring(46, 58.4, { angle: 40, speed: 22 });
    b.plat(57, 58, 10);
    b.goal(63, 58);
    b.cells(13.5, 11, 15, 16, 3); b.cells(16.5, 20, 18, 25, 3); b.cells(19.5, 29, 21, 34, 3); b.cells(33.5, 47, 36, 52, 3);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.shard(32, 45);
    b.shard(37, 55.9);
  }),

  // 474 ── laser maze: sweepers slice every straight and every ring flight, so ride the beat
  L('Laser Maze', 'gates', (b) => {
    b.start(-6, 0, 12);
    b.boost(8, 0, 14, 12);
    b.sweeper(14, 4.6, 2.6, { omega: 120, both: true });
    b.sweeper(21, 4.6, 2.6, { omega: -120, both: true });
    b.ring(30, 3.4, { angle: 30 });
    b.sweeper(35, 7, 3, { omega: 130, both: true });
    b.ring(38, 3.4, { angle: 30 });
    b.plat(48, 2, 4);
    b.checkpoint(50, 2);
    b.boost(54, 2, 14, 14);
    b.sweeper(60, 6.6, 2.6, { omega: 140, both: true });
    b.sweeper(67, 6.6, 2.6, { omega: -140, both: true });
    b.ring(82, 5.4, { angle: 30 });
    b.sweeper(86, 9, 3, { omega: -110, both: true });
    b.ring(90, 5.4, { angle: 30 });
    b.plat(100, 4, 4);
    b.zip(104, 7.3, 120, 3);
    b.plat(121, 2, 10);
    b.goal(127, 2);
    b.cells(9, 1.2, 21, 1.2, 6); b.cells(55, 3.2, 67, 3.2, 6); b.cells(105, 6.3, 119, 3.4, 6);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.shard(30, 5);
    b.shard(90, 7.9);
  }),

  // 475 ── a spinning ferris wheel of pads lifts you between racing slides and a ring pair
  L('Circuit Overpass', 'loops', (b) => {
    b.start(-6, 0, 12);
    b.slide(11, 1, 23, 1, { T: 2.2, w: 4 });
    b.ferris(34, 7, 6, { n: 6, omega: 1.1, w: 3 });
    b.plat(44, 10, 4);
    b.slide(50, 10, 50, 16, { T: 1.8, w: 4 });
    b.plat(56, 16, 4);
    b.slide(62, 16, 76, 16, { T: 2.4, w: 4 });
    b.ring(86, 19.4, { angle: 30 }); b.ring(94, 19.4, { angle: 30 });
    b.plat(104, 18, 5);
    b.checkpoint(106, 18);
    b.zip(110, 21.5, 128, 14);
    b.plat(129, 12.5, 10);
    b.goal(135, 12.5);
    b.cells(12, 2.6, 22, 2.6, 5); b.cells(63, 17.6, 75, 17.6, 5); b.cells(111, 20.5, 127, 14.4, 6);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.shard(46, 14);
    b.shard(94, 21.9);
  }),

  // 476 ── spiker sprint: boost straights broken by static decks patrolled by spikers; jump them at full speed
  L('Spiker Sprint', 'boost', (b) => {
    b.start(-6, 0, 12);
    b.boost(8, 0, 12, 14);
    b.plat(34, 0, 14); b.enemy('spiker', 38, 0, { range: 6, speed: 2.5 });
    b.boost(60, 0, 10, 15);
    b.plat(84, 0, 4); b.checkpoint(86, 0);
    b.enemy('flyer', 98, 5, { ax: 3, ay: 0.6, T: 2.4 });
    b.ring(95, 3, { angle: 30 }); b.ring(103, 3, { angle: 30 });
    b.plat(114, 2, 14); b.enemy('spiker', 118, 2, { range: 6, speed: 2.5 });
    b.boost(140, 2, 12, 15);
    b.plat(166, 2, 10);
    b.goal(172, 2);
    b.cells(9, 1.2, 19, 1.2, 5); b.cells(21, 2, 33, 2, 4); b.cells(61, 1.2, 69, 1.2, 4); b.cells(141, 3.2, 151, 3.2, 5);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.shard(42, 4);
    b.shard(118, 6);
  }),

  // 477 ── rail grind: cables down a long slope with touch-downs, a steep ring back up into another cable and a ring pair
  L('Rail Grind', 'rails', (b) => {
    b.start(-6, 12, 12);
    b.zip(8, 15.4, 28, 10);
    b.plat(30, 8.5, 4);
    b.zip(36, 12, 56, 6);
    b.plat(58, 4.5, 5);
    b.checkpoint(60, 4.5);
    b.zip(62, 8, 80, 2.5);
    b.plat(81, 0.5, 4);
    b.ring(86, 3.9, { angle: 65, speed: 24 });
    b.zip(90, 10, 108, 4);
    b.plat(109, 2, 4);
    b.ring(117, 5.4, { angle: 30 }); b.ring(125, 5.4, { angle: 30 });
    b.plat(136, 4, 10);
    b.goal(142, 4);
    b.cells(9, 14.4, 27, 10.4, 6); b.cells(37, 11, 55, 6.4, 6); b.cells(63, 7, 79, 3, 6); b.cells(91, 9, 107, 4.4, 6);
    b.plat(-14, 13.5, 3); b.shard(-12.5, 15.5);
    b.shard(60, 8.5);
    b.shard(125, 7.9);
  }),

  // 478 ── twin towers: a tornado, steep rings, a second tornado, a boost across and a long rail down
  L('Neon Cathedral', 'ascent', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 8);
    b.tornado(10, 14, 0, { rise: 10, T: 2.5 });
    b.plat(20, 9, 5);
    b.ring(25, 13, { angle: 75, speed: 26 }); b.ring(29, 21, { angle: 75, speed: 26 });
    b.plat(32, 23, 8);
    b.checkpoint(34, 23);
    b.tornado(36, 40, 23, { rise: 9, T: 2.5 });
    b.plat(46, 31, 5);
    b.boost(51, 31, 10, 14);
    b.ring(70, 34.4, { angle: 30 }); b.ring(78, 34.4, { angle: 30 });
    b.zip(86, 38, 106, 28);
    b.plat(107, 26, 10);
    b.goal(113, 26);
    b.cells(11, 1.2, 15, 1.2, 3); b.cells(52, 32.2, 60, 32.2, 4); b.cells(87, 37, 105, 28.4, 6);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.shard(29, 23.5);
    b.shard(78, 36.9);
  }),

  // 479 ── REDLINE: lasers across a ring tunnel, a cannon, a wrecker over a rail, a steep ring shaft and a last boost through the beams
  L('Redline', 'gauntlet', (b) => {
    b.start(-6, 0, 12);
    b.boost(8, 0, 10, 14);
    b.ring(26, 3.4, { angle: 30 }); b.ring(34, 3.4, { angle: 30 }); b.ring(42, 3.4, { angle: 30 });
    b.sweeper(30, 7, 3, { omega: 130, both: true });
    b.sweeper(38, 7, 3, { omega: -130, both: true });
    b.plat(52, 2, 3);
    b.barrel(60, 5, { angle: 30, auto: true });
    b.plat(74, 5, 4);
    b.checkpoint(76, 5);
    b.zip(78, 8.5, 98, 3.5);
    b.wrecker(88, 14, 7, { amp: 40, T: 1.8 });
    b.plat(99, 1, 4);
    b.ring(104, 4.4, { angle: 75, speed: 26 }); b.ring(108, 12.4, { angle: 75, speed: 26 }); b.ring(112, 20.4, { angle: 75, speed: 26 });
    b.plat(115, 22, 5);
    b.checkpoint(117, 22);
    b.boost(120, 22, 10, 15);
    b.ring(139, 25.4, { angle: 30 }); b.ring(147, 25.4, { angle: 30 });
    b.sweeper(143, 29, 3, { omega: 140, both: true });
    b.plat(158, 24, 10);
    b.goal(164, 24);
    b.arc(9, 1.2, 41, 4, 8, 3); b.cells(79, 7.5, 97, 3.8, 6); b.cells(121, 23.2, 129, 23.2, 4);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.shard(112, 22.9);
    b.shard(147, 27.9);
  }),

  // 480 ── VELOCITAR FINALE: everything at once, ending with the wave on your heels: boost, rings, cannon, rail, slider, steep rings, boost, rings, cannon
  L('Velocitar Prime', 'chase', (b) => {
    b.chase({ speed: 4.4 });
    b.start(-6, 0, 14);
    b.boost(10, 0, 8, 14);
    b.ring(26, 3.4, { angle: 30 }); b.ring(34, 3.4, { angle: 30 }); b.ring(42, 3.4, { angle: 30 });
    b.plat(52, 2, 3);
    b.barrel(60, 5, { angle: 30, auto: true });
    b.plat(74, 4, 4);
    b.checkpoint(76, 4);
    b.zip(78, 7.4, 98, 2.5);
    b.plat(99, 0, 4);
    b.slide(105, 1, 119, 1, { T: 2, w: 4 });
    b.ring(128, 4.4, { angle: 30 }); b.ring(136, 4.4, { angle: 30 });
    b.plat(147, 3, 3);
    b.ring(152, 6.4, { angle: 75, speed: 26 }); b.ring(156, 14.4, { angle: 75, speed: 26 }); b.ring(160, 22.4, { angle: 75, speed: 26 });
    b.plat(163, 24, 5);
    b.checkpoint(165, 24);
    b.boost(168, 24, 10, 15);
    b.ring(187, 27.4, { angle: 30 }); b.ring(195, 27.4, { angle: 30 }); b.ring(203, 28.4, { angle: 30 });
    b.plat(214, 27, 3);
    b.barrel(222, 30, { angle: 20, auto: true });
    b.plat(238, 28, 12);
    b.goal(244, 28);
    b.arc(10, 1.2, 42, 4, 9, 3); b.cells(79, 6.4, 97, 2.8, 6); b.cells(169, 25.2, 177, 25.2, 4);
    b.shard(-12, 3.5); b.plat(-14, 1.5, 3);
    b.shard(34, 5.9);
    b.shard(156, 16.9);
  }),
];
