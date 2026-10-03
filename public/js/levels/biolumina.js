// WORLD 13 — BIO-LUMINA. 30 hand-written levels (361–390).
// A bioluminescent alien jungle over a toxic swamp. Gravity 0.95:
// single jump ≈ 2.6 high, double jump ≈ 4.6 high / ~11 far.
// Signature toys: mushroom pads, swinging vines, snapjaw plant doors,
// glow-spore blinkers, drifting leaves, seed-pod wheels, rotting logs.
// Every level has its own idea; see the comment above each one.
import { L } from './dsl.js';

export default [
  // 361 ── a gentle stroll that shows each jungle toy exactly once: a stump hop, a mushroom pad, a vine, a beetle
  L('Glowcap Grove', 'intro', (b) => {
    b.start(-6, 0, 14);
    b.arc(8, 0, 12, 0, 2, 1.6);
    b.plat(12, 0, 5);
    b.plat(21, 1.5, 5);
    b.cells(22, 2.6, 25, 2.6, 3);
    b.plat(30, 0, 9);
    b.mushroom(35, 0, 6);
    b.cells(36.1, 3.5, 36.1, 8, 3);
    b.plat(38.5, 7, 7);
    b.shard(36.1, 12.2);
    b.plat(49, 3, 8);
    b.checkpoint(52, 3);
    b.vine(63, 10, 6);
    b.arc(57, 3, 69, 3, 4, 2.5);
    b.plat(69, 3, 7);
    b.thin(71, 8, 3); b.shard(72.5, 9.5);
    b.plat(80, 4, 4);
    b.plat(88, 4, 12); b.enemy('walker', 91, 4, { range: 5 });
    b.cells(81, 5.2, 83, 5.2, 2);
    b.goal(97, 4);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 362 ── a lake crossed only by vines: the gaps keep widening until two vines must be chained mid-air, then vines lift you up a cliff
  L('Lantern Vines', 'swing', (b) => {
    b.start(-6, 2, 12);
    b.vine(11, 10, 6);
    b.plat(16, 2, 4);
    b.plat(23, -1, 3); b.shard(24.5, 0.6);              // a sunken stump under the second vine
    b.vine(26, 11, 6);
    b.plat(32, 3, 6);
    b.checkpoint(35, 3);
    b.vine(45, 12, 7);
    b.plat(52, 3, 4);
    b.vine(61, 13, 6); b.vine(70, 13, 6);                // the chain: no ground between
    b.arc(56, 3, 76, 3, 6, 3);
    b.shard(65.5, 8);
    b.plat(76, 3, 5);
    b.vine(86, 13, 6);                                   // vine up the cliff
    b.plat(91, 9, 4);
    b.plat(100, 10, 9);
    b.goal(105, 10);
    b.cells(11, 6, 26, 7, 5);
    b.vine(-9, 12, 5); b.plat(-17, 7, 3); b.shard(-15.5, 9);   // a vine behind the start swings to a perch
  }),

  // 363 ── snapjaw doors guard a hollow log: one jaw, then a pair a beat apart, then a jaw that barely opens, then jaws up a stump stair
  L('Snapjaw Gate', 'doors', (b) => {
    b.start(-6, 0, 12);
    b.plat(9, 0, 38);
    b.rect(13, 6.5, 30, 1);                              // the hollow log's roof
    b.door(18, 0, { P: 3.4, open: 0.5 });
    b.door(27, 0, { P: 3, open: 0.4 });
    b.door(30, 0, { P: 3, open: 0.4, off: -0.45 });
    b.shard(28.5, 5.2);                                  // up in the window between the twin jaws
    b.door(39, 0, { P: 4, open: 0.3 });
    b.cells(10, 1, 16, 1, 3); b.cells(20, 1, 25, 1, 3); b.cells(32, 1, 37, 1, 3); b.cells(41, 1, 46, 1, 3);
    b.plat(51, 2, 6);
    b.checkpoint(54, 2);
    b.plat(61, 4, 6); b.door(64.5, 4, { P: 3.2, open: 0.45 });
    b.plat(71, 6, 6); b.door(74.5, 6, { P: 3.2, open: 0.45, off: -1.07 });
    b.plat(81, 8, 6); b.door(84.5, 8, { P: 3.2, open: 0.45, off: -2.13 });
    b.shard(74, 3.4);                                    // tucked under the middle stump
    b.cells(62, 5, 66.5, 5, 2); b.cells(72, 7, 76.5, 7, 2); b.cells(82, 9, 86.5, 9, 2);
    b.plat(91, 8, 10);
    b.goal(97, 8);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 364 ── climb the inside of a hollow giant tree by ricocheting between mushroom shelves on alternate walls, then ride a leaf down outside
  L('Bouncecap Hollow', 'ascent', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 18);
    b.rect(9, 3.5, 1, 34);                               // left bark wall (walk in under it)
    b.rect(25, 0, 1, 30);                                // right bark wall (exit over it at the top)
    b.rect(9, 37.5, 17, 1);                              // crown
    b.mushroom(20, 0, 7);
    b.plat(10, 8, 5); b.mushroom(11.5, 8, 7);
    b.plat(19, 16, 6); b.mushroom(21, 16, 7);
    b.plat(10, 24, 6); b.mushroom(13.5, 24, 6.5);
    b.checkpoint(11, 24);
    b.plat(10, 31, 3); b.shard(11.5, 33);                // secret shelf above the checkpoint
    b.plat(19, 32, 6);
    b.cells(21.1, 3, 21.1, 9, 3); b.cells(12.6, 11, 12.6, 17, 3); b.cells(22.1, 19, 22.1, 25, 3); b.cells(14.6, 27, 14.6, 31, 2);
    b.plat(28, 32, 5);
    b.slide(37, 31, 37, 18, { T: 6, w: 3 });             // a giant leaf sinks to the understorey
    b.shard(37, 35.4);
    b.plat(41, 17, 4);
    b.crumble(49, 14, 2.5); b.crumble(54, 11, 2.5); b.crumble(59, 8, 2.5);
    b.cells(50, 15.5, 60, 9.5, 4);
    b.plat(64, 6, 10);
    b.goal(70, 6);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 365 ── a lake of lily stumps patrolled by glow-moths drifting in figure-eights over every gap; time each hop between their loops
  L('Mothlight Mere', 'enemies', (b) => {
    b.start(-6, 0, 12);
    b.plat(10, 0, 3); b.enemy('flyer', 8, 2.5, { ax: 1.2, ay: 1.4, T: 3 });
    b.plat(17, 1, 3); b.enemy('flyer', 15, 3, { ax: 0.6, ay: 2, T: 2.6 });
    b.plat(24, 0, 3); b.enemy('flyer', 22, 2.5, { ax: 1.6, ay: 1, T: 3.4 });
    b.crumble(31, 0.5, 3);
    b.plat(38, 1, 7); b.enemy('walker', 39, 1, { range: 4 });
    b.checkpoint(43, 1);
    b.plat(49, 2, 2.5); b.plat(55, 3.5, 2.5); b.plat(61, 2, 2.5);
    b.enemy('flyer', 53, 5, { ax: 3.5, ay: 0.8, T: 3 });
    b.enemy('flyer', 59, 5.5, { ax: 3, ay: 1, T: 2.4 });
    b.thin(54, 7.8, 4.5); b.shard(56.2, 9.2);              // a leaf canopy above the moth lane
    b.vine(70, 10, 6); b.enemy('flyer', 70, 8, { ax: 2, ay: 0.5, T: 2.8 });
    b.plat(76, 3, 4);
    b.plat(83, 4, 12);
    b.goal(91, 4);
    b.arc(13, 0, 17, 1, 2, 1.6); b.arc(20, 1, 24, 0, 2, 1.6); b.arc(27, 0, 31, 0.5, 2, 1.6);
    b.cells(50, 3.6, 62, 3.6, 5);
    b.plat(30.5, -2.6, 2); b.shard(31.5, -1);             // a sunken stump under the rotting log
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 366 ── glow-spore pads breathe: first all together (wait, then dash), then in alternating pairs up a slope, then as a wave down
  L('Sporelight Pulse', 'timing', (b) => {
    b.start(-6, 0, 12);
    b.plat(9, 0, 3);
    for (let i = 0; i < 3; i++) b.blink(15 + i * 5, 0, 3, { P: 4, on: 2.6 });
    b.plat(30, 1, 3);
    for (let i = 0; i < 3; i++) b.blink(36 + i * 5, 1 + (i % 2), 3, { P: 4, on: 2.6, off: 2 });
    b.plat(51, 2, 6);
    b.checkpoint(54, 2);
    // alternating pairs: A on while B rests
    for (let i = 0; i < 6; i++) b.blink(60 + i * 4.5, 4 + i * 1.8, 2.6, { P: 3, on: 1.7, off: (i % 2) * 1.5 });
    b.plat(87, 15, 5);
    b.thin(80, 19.5, 3); b.shard(81.5, 21);               // above the top of the slope
    // wave down
    for (let i = 0; i < 5; i++) b.blink(96 + i * 5, 13 - i * 2.2, 3, { P: 3.4, on: 2, off: -i * 0.45 });
    b.plat(121, 3, 10);
    b.goal(127, 3);
    b.cells(10, 2, 29, 2, 6); b.cells(37, 3, 49, 3, 4); b.cells(61, 6, 84, 14, 6); b.cells(97, 14.5, 117, 6, 5);
    b.shard(40.5, -0.8);                                   // low beneath the second set of spores
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 367 ── a staircase of seed-pod wheels: transfer pod-to-pod up three wheels, swing down a vine, then dive through the hub of a giant one
  L('Seedpod Spiral', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.ferris(14, 4, 5, { n: 4, omega: 0.6 });
    b.ferris(26, 10, 5, { n: 4, omega: -0.6 });
    b.ferris(38, 16, 5, { n: 5, omega: 0.5 });
    b.shard(26, 19.5);
    b.plat(46, 21, 6);
    b.checkpoint(49, 21);
    b.vine(57, 27, 6);
    b.plat(63, 18, 4);
    b.ferris(76, 14, 7, { n: 6, omega: -0.4 });
    b.shard(76, 14.6);                                     // in the giant wheel's hub
    b.plat(87, 12, 10);
    b.goal(93, 12);
    b.cells(14, 10, 14, 10, 1); b.cells(26, 16, 26, 16, 1); b.cells(38, 22, 38, 22, 1);
    b.arc(52, 21, 63, 18, 4, 2);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 368 ── a grove of hollow trunks: wall-jump up one chimney, cross the canopy, drop into the next trunk and climb out, each taller
  L('Trunkwalker', 'chimney', (b) => {
    b.start(-6, 0, 12);
    // trunk 1: walk in underneath, climb out the top
    b.plat(8, 0, 8);
    b.rect(10, 3, 0.8, 10);
    b.rect(13.6, 0, 0.8, 11); b.plat(13.6, 12, 6);
    b.cells(12.2, 3, 12.2, 10, 3);
    // canopy hop to trunk 2: drop in from the top, climb out the far side
    b.thin(23, 12, 3);
    b.rect(28, -3, 0.8, 16);                               // trunk 2 outer bark (top 13)
    b.plat(28.8, -3, 10);                                  // trunk 2 floor
    b.rect(35.2, 0.6, 0.8, 16.4);                          // inner bark: duck under it into the chimney
    b.rect(38.8, -3, 0.8, 18);                             // outer bark, chimney between 36..38.8
    b.plat(39.6, 15, 6);
    b.checkpoint(42, 15);
    b.cells(32, -1.5, 32, 10, 4); b.cells(37.4, 0, 37.4, 13, 4);
    b.shard(32, -1.4);                                     // at the bottom of the drop
    // trunk 3: the tallest — climb, then a door at the crown
    b.plat(50, 12, 11.4);
    b.rect(57, 15, 0.8, 14); b.rect(60.6, 12, 0.8, 14);
    b.plat(60.6, 27, 6); b.door(64, 27, { P: 3, open: 0.5, h: 4 }); b.rect(60.6, 31, 6, 0.8);
    b.cells(59.2, 14, 59.2, 26, 4);
    b.plat(70, 24, 4); b.plat(78, 20, 4); b.plat(86, 16, 10);
    b.goal(92, 16);
    b.shard(59.2, 32.5);                                   // over the crown of trunk 3
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 369 ── rotting logs crumble, so hop from log to drifting leaf to log without stopping: a river run through the bog
  L('Rotlog Rapids', 'speed', (b) => {
    b.start(-6, 0, 12);
    b.crumble(9, 0, 3); b.crumble(15, 0.5, 3);
    b.slide(24, 1, 34, 1, { T: 3.2, w: 3 });
    b.crumble(38, 1, 3); b.crumble(44, 1.5, 3);
    b.slide(53, 2, 53, 7, { T: 3, w: 3 });
    b.plat(57, 7, 5);
    b.checkpoint(59, 7);
    b.crumble(66, 6, 2.5); b.crumble(71, 5, 2.5);
    b.slide(79, 5, 89, 7, { T: 3, w: 2.8, phase: 0.5 });
    b.crumble(93, 7, 2.5); b.crumble(98, 8, 2.5); b.crumble(103, 7, 2.5);
    b.plat(109, 6, 10);
    b.goal(115, 6);
    b.cells(10, 1.5, 46, 3, 10); b.cells(67, 7.5, 104, 8.5, 9);
    b.thin(51, 11, 3); b.shard(52.5, 12.5);                 // above the leaf lift
    b.shard(84, 1.6);                                       // dip under the drifting leaf
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 370 ── the Spore Swarm wakes: a sprint over stumps, mushrooms and two vines with no time to think
  L('Spore Swarm', 'chase', (b) => {
    b.chase({ speed: 3.9 });
    b.start(-6, 0, 14);
    b.plat(12, 0, 5); b.plat(21, 1, 4);
    b.plat(29, 0, 6); b.mushroom(32.5, 0, 5);
    b.plat(38, 7, 6);
    b.vine(50, 14, 6);
    b.plat(56, 6, 6);
    b.checkpoint(59, 6);
    b.crumble(66, 6, 2.6); b.crumble(71.5, 6.5, 2.6); b.crumble(77, 7, 2.6);
    b.plat(83, 5, 4); b.mushroom(84, 5, 4);
    b.plat(90, 9, 4);
    b.vine(100, 16, 6);
    b.plat(106, 8, 4);
    b.plat(113, 6, 12);
    b.goal(121, 6);
    b.arc(12, 0, 29, 0, 6, 2); b.cells(39, 8, 43, 8, 3); b.arc(44, 7, 56, 6, 4, 2.4); b.cells(67, 8, 78, 9, 4);
    b.shard(41, 11.5);
    b.shard(100, 6.2);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),
];
