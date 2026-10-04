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
  // 371 ── spore turrets rake a walkway: duck behind stump cover, then climb a zig-zag of leaves through crossfire
  L('Thornshot Thicket', 'gauntlet', (b) => {
    b.start(-6, 0, 12);
    b.plat(9, 0, 30);
    b.wall(16, 0, 1.6, 1.4); b.wall(24, 0, 1.6, 1.4); b.wall(32, 0, 1.6, 1.4);   // stumps: hide on their left
    b.rect(39, 0, 1.6, 5.5); b.turret(39.8, 0.8, -1, { P: 2.2 });
    b.shard(37, 1);                                        // right at the turret's mouth
    b.cells(11, 1, 14, 1, 2); b.cells(19, 1, 22, 1, 2); b.cells(27, 1, 30, 1, 2);
    b.plat(44, 4, 6);
    b.checkpoint(46, 4);
    b.thin(51, 7.5, 4); b.thin(45, 11, 4); b.thin(51, 14.5, 4); b.thin(45, 18, 4);
    b.rect(57, 6, 1.4, 16); b.turret(57.7, 8.3, -1, { P: 2.4 }); b.turret(57.7, 15.3, -1, { P: 2.4, off: 1.2 });
    b.rect(41, 9, 1.4, 4); b.turret(41.7, 11.8, 1, { P: 2.6, off: 0.6 });
    b.shard(53, 10.2);                                     // hanging in the lower firing lane
    b.cells(53, 9, 47, 12.5, 3); b.cells(53, 16, 47, 19.5, 3);
    b.plat(51, 21.5, 6);
    b.plat(39, 22, 3); b.shard(40.5, 24);                  // a perch over the left cannon
    b.plat(62, 20, 4); b.plat(70, 17, 12);
    b.enemy('walker', 72, 17, { range: 6 });
    b.goal(79, 17);
  }),

  // 372 ── glowing buttons swap the roots: open a sealed gallery, then climb a tower where every floor's button grows the next step
  L('Glowroot Switchboard', 'puzzle', (b) => {
    b.start(-6, 0, 12);
    b.plat(9, 0, 12); b.switch(11, 0);
    b.redWall(18, 0, 7); b.rect(9, 7, 14, 1);
    b.blue(23, 0, 4);
    b.plat(30, 0, 8); b.switch(35, 0);
    b.red(31, 5, 3); b.shard(32.5, 7);                     // a red root that only grows back after the second button
    b.red(41, 1, 4); b.red(47, 2, 4);
    b.plat(53, 2, 8); b.switch(59, 2);
    b.checkpoint(55, 2);
    b.blue(63, 6, 3);
    b.plat(56, 10, 5); b.switch(56.3, 10);
    b.red(63, 14, 3);
    b.plat(56, 18, 5); b.switch(56.3, 18);
    b.blue(63, 22, 3);
    b.plat(56, 26, 8);
    b.plat(49, 29, 3); b.shard(50.5, 31);
    b.blue(68, 25, 4);
    b.plat(76, 23, 10);
    b.goal(82, 23);
    b.plat(64, -1, 3); b.shard(65.5, 0.6); b.enemy('spiker', 64.2, -1, { range: 2, speed: 1 });
    b.cells(24, 1, 26, 1, 2); b.cells(42, 2.5, 50, 3.5, 3); b.cells(64.5, 7.5, 64.5, 23.5, 5);
  }),

  // 373 ── no ground worth the name: every stump is too far or too high, so lone mushrooms planted in the bog carry you between them
  L('Trampoline Bog', 'bounce', (b) => {
    b.start(-6, 0, 12);
    b.plat(-11, -2, 2.5); b.shard(-9.8, -0.5);             // a drowned stump behind the start
    b.mushroom(7, -0.9, 6);
    b.plat(13, 7, 3);
    b.mushroom(17, 6.1, 6);
    b.shard(23, 13.5);                                     // only a full bounce reaches it
    b.plat(27, 7, 3);
    b.mushroom(31, 6.1, 1.5); b.rect(30, 12.5, 12, 1);     // a low branch: keep the bounce small
    b.plat(37, 7, 4);
    b.plat(45, 3, 6);
    b.checkpoint(48, 3);
    // a staircase of floating mushrooms out of the bog
    b.mushroom(51.5, 2.1, 8.5); b.plat(57, 12, 3);
    b.mushroom(60.5, 11.1, 8.5); b.plat(66, 21, 3);
    b.mushroom(69.5, 20.1, 7); b.plat(75, 28, 4);
    b.plat(63, 31, 3); b.shard(64.5, 33);
    b.plat(84, 25, 3); b.mushroom(88, 24.1, 4);
    b.plat(98, 23, 10);
    b.goal(104, 23);
    b.cells(8.1, 3, 8.1, 6, 2); b.cells(18.1, 9, 18.1, 12, 2); b.cells(32.1, 9, 32.1, 10.5, 2); b.cells(52.6, 5, 52.6, 10, 3);
    b.cells(61.6, 14, 61.6, 19, 2); b.cells(70.6, 23, 70.6, 27, 2); b.arc(90.2, 25, 98, 23, 3, 3);
  }),

  // 374 ── the swamp rises: scramble up a giant tree with a mushroom, a vine and a bark chimney before it swallows you
  L('Swamprise Spire', 'tide', (b) => {
    b.rise({ rate: 0.7, delay: 4 });
    b.start(-6, 0, 12);
    b.tower(6, -4, 26, 50);
    b.plat(8, 3, 4); b.plat(15, 6.5, 4); b.thin(8, 10, 5);
    b.plat(1, 12, 2.5); b.shard(2.2, 14);
    b.plat(16, 13, 6); b.mushroom(19, 13, 6);
    b.plat(8, 21, 5);
    b.checkpoint(10, 21);
    b.vine(16, 29, 5);
    b.shard(16, 28);
    b.plat(21, 25, 6.4);
    b.rect(23.8, 27, 0.8, 10); b.rect(27.4, 25, 0.8, 12);   // bark chimney: duck under the left side, climb between
    b.plat(17, 40, 3); b.shard(18.5, 42);
    b.plat(28.2, 38, 5);
    b.thin(31, 42, 3);
    b.plat(36, 45, 8);
    b.goal(41, 45);
    b.cells(10, 4.5, 17, 8, 3); b.cells(20.1, 16, 20.1, 20, 2); b.cells(26, 28, 26, 35, 3);
  }),

  // 375 ── ride a giant leaf through a row of snapping jaws: step back and forth on the leaf to slip through each one as it opens
  L('Jawline Express', 'ride', (b) => {
    b.start(-6, 1, 12);
    b.loop([[9, 1], [44, 1]], { speed: 3.4, loop: false, w: 4 });
    b.door(15, -1, { h: 8, P: 3, open: 0.55 });
    b.door(22, -1, { h: 8, P: 3.6, open: 0.5, off: 1.2 });
    b.door(26, -1, { h: 8, P: 3.6, open: 0.5, off: 0.2 });
    b.door(34, -1, { h: 8, P: 2.6, open: 0.5, off: 0.8 });
    b.shard(24, 4.6);                                      // jump for it between the twin jaws
    b.cells(12, 2.5, 42, 2.5, 8);
    b.plat(47, 1, 6);
    b.checkpoint(50, 1);
    b.loop([[57, 1], [75, 9], [95, 9]], { speed: 3.2, loop: false, w: 4 });
    b.door(66, 3, { h: 8, P: 3, open: 0.5 });
    b.door(72, 6, { h: 8, P: 3, open: 0.5, off: 1 });
    b.door(82, 8, { h: 7, P: 3.2, open: 0.45, off: 0.4 });
    b.door(89, 8, { h: 7, P: 3.2, open: 0.45, off: 2 });
    b.shard(78, 13);
    b.cells(60, 3.5, 94, 10.5, 9);
    b.plat(99, 9, 10);
    b.goal(105, 9);
    b.plat(7, -2.5, 2.5); b.shard(8.2, -1);                // a root ledge under the leaf's dock
  }),

  // 376 ── switchback down through the root cellar: four stacked tunnels, each running the other way with its own pest
  L('Rootcellar Descent', 'descent', (b) => {
    b.start(-6, 30, 12);
    b.plat(-13, 33, 3); b.shard(-11.5, 35);
    b.rect(7, 32.5, 28, 1);
    b.plat(9, 27, 22);                                     // tunnel 1 → beetles
    b.enemy('walker', 12, 27, { range: 6 }); b.enemy('walker', 21, 27, { range: 7, speed: 2 });
    b.plat(14, 21, 24);                                    // tunnel 2 ← thorn-balls
    b.enemy('spiker', 20, 21, { range: 8, speed: 2.4 }); b.enemy('spiker', 30, 21, { range: 5, speed: 1.6 });
    b.plat(4, 15, 24);                                     // tunnel 3 → a snapjaw
    b.rect(3, 15, 1, 5);
    b.checkpoint(14, 15);
    b.enemy('walker', 5, 15, { range: 4 }); b.shard(5.5, 16.5);   // dead end on the left, guarded
    b.door(22, 15, { h: 5, P: 3, open: 0.5 });
    b.plat(18, 9, 8); b.crumble(27, 9, 3); b.crumble(31, 9, 3); b.plat(35, 9, 9);   // tunnel 4 ← rotting floor
    b.shard(30, 6.6);
    b.plat(48, 5, 5);
    b.plat(56, 2, 10);
    b.goal(62, 2);
    b.cells(10, 28, 29, 28, 6); b.cells(16, 22, 36, 22, 6); b.cells(15, 16, 27, 16, 5); b.cells(20, 10, 42, 10, 6);
  }),

  // 377 ── thorn-balls roll along a gully floor: cross overhead on vines and leaves, dropping down only to snatch shards and bounce back out
  L('Thornball Gully', 'swing', (b) => {
    b.start(-6, 4, 12);
    b.plat(8, -2, 60);
    b.enemy('spiker', 10, -2, { range: 10, speed: 3 }); b.enemy('spiker', 24, -2, { range: 12, speed: 2.4 });
    b.enemy('spiker', 40, -2, { range: 10, speed: 3.2 }); b.enemy('spiker', 54, -2, { range: 12, speed: 2.6 });
    b.vine(12, 12, 6);
    b.thin(17, 5, 3);
    b.vine(25, 12, 6);
    b.thin(30, 6, 3);
    b.mushroom(36, -2, 7);                                 // escape mushroom from the gully floor
    b.plat(38, 6, 5);
    b.checkpoint(40, 6);
    b.vine(49, 13, 6); b.vine(57.5, 13, 6);
    b.mushroom(64, -2, 7);
    b.plat(63, 7, 4);
    b.plat(70, 5, 10);
    b.goal(76, 5);
    b.shard(28, -0.6); b.shard(60, -0.6);
    b.thin(44, 10.5, 3); b.shard(45.5, 12);
    b.cells(9, 7, 15, 6, 3); b.cells(21, 7, 28, 7, 3); b.arc(43, 6, 63, 7, 6, 3);
  }),

  // 378 ── a highwire through the treetops: vine chains that climb and dip, glow-moths drifting through the arcs, flickering spore rests
  L('Canopy Highwire', 'swing', (b) => {
    b.start(-6, 10, 10);
    b.vine(9, 18, 5); b.vine(17.5, 18, 5);
    b.enemy('flyer', 13, 16, { ax: 1, ay: 1.5, T: 3 });
    b.blink(23, 10, 3, { P: 3.4, on: 2.4 });
    b.vine(31, 19, 6);
    b.plat(36, 11, 5);
    b.checkpoint(38, 11);
    b.vine(46, 20, 6); b.vine(54.5, 21, 6);
    b.enemy('flyer', 50, 14, { ax: 1, ay: 2, T: 2.6 });
    b.plat(60, 13, 3);
    b.vine(69, 22, 6); b.enemy('flyer', 66, 17, { ax: 1, ay: 2, T: 3 });
    b.plat(74, 14, 4);
    b.blink(81, 13, 3, { P: 3, on: 2 });
    b.vine(89, 21, 7);
    b.plat(95, 12, 10);
    b.goal(101, 12);
    b.thin(30, 16.5, 2.5); b.shard(31.2, 18);
    b.shard(50.2, 11.5);
    b.plat(-14, 13, 3); b.shard(-12.5, 15);
    b.arc(4, 10, 23, 10, 5, 3); b.arc(41, 11, 60, 13, 5, 3); b.arc(63, 13, 74, 14, 3, 3); b.arc(84, 13, 95, 12, 3, 3);
  }),

  // 379 ── two hollow logs with low roofs: no high jumps, only short hops across glow-spore floor tiles and past beetles
  L('Glowworm Gallery', 'cave', (b) => {
    b.start(-6, 0, 12);
    b.rect(8, 4.2, 50, 1);
    b.plat(8, 0, 6);
    b.blink(16, 0, 3, { P: 3.2, on: 2 }); b.blink(21, 0, 3, { P: 3.2, on: 2, off: -0.6 });
    b.plat(26, 0, 5); b.enemy('walker', 26.5, 0, { range: 3.5 });
    b.blink(33, 0, 3, { P: 2.6, on: 1.6 }); b.blink(38, 0, 3, { P: 2.6, on: 1.6, off: 1.3 });
    b.plat(43, 0, 4);
    b.crumble(49, 0, 3); b.blink(54, 0, 3, { P: 3, on: 1.8, off: 0.5 });
    b.plat(59, 0, 6);
    b.checkpoint(61, 0);
    b.mushroom(59.2, 0, 7); b.shard(60.3, 11.5);
    b.rect(68, 7.2, 40, 1); b.rect(68, 8.2, 1, 7);
    b.plat(68, 3, 4);
    for (let i = 0; i < 4; i++) b.blink(74 + i * 4.5, 3, 2.6, { P: 2.4, on: 1.4, off: (i % 2) * 1.2 });
    b.plat(92, 3, 6); b.enemy('spiker', 92.5, 3, { range: 4.5, speed: 2 });
    b.crumble(100, 3, 2.5); b.crumble(104.5, 3, 2.5);
    b.plat(109, 3, 8);
    b.goal(114, 3);
    b.shard(28.5, 3);                                      // above the beetle's beat
    b.plat(-15, 1, 3); b.shard(-13.5, 3);
    b.cells(9, 1, 46, 1, 10); b.cells(69, 4, 106, 4, 9);
  }),

  // 380 ── the Swarm returns as you race DOWNHILL: drop down stump steps, bounce over a bark wall, swing twice to the valley floor
  L('Spore Avalanche', 'chase', (b) => {
    b.chase({ speed: 4.3 });
    b.start(-6, 24, 14);
    b.plat(-15, 26, 3); b.shard(-13.5, 28);
    b.plat(11, 22, 5); b.plat(19, 19, 5);
    b.crumble(27, 16, 3); b.crumble(32, 13, 3);
    b.plat(38, 11, 6); b.mushroom(41.6, 11, 6);
    b.rect(46, 6, 1.2, 12);
    b.shard(46.6, 21.5);
    b.plat(50, 13, 5);
    b.vine(61, 21, 6);
    b.plat(67, 11, 5);
    b.checkpoint(69, 11);
    b.crumble(75, 9, 2.6); b.crumble(80, 7, 2.6);
    b.plat(85, 5, 4);
    b.vine(94, 13, 6);
    b.shard(94, 4.5);
    b.plat(100, 4, 4);
    b.plat(107, 2, 12);
    b.goal(115, 2);
    b.cells(12, 23.5, 22, 20.5, 4); b.cells(28, 17.5, 33, 14.5, 2); b.arc(55, 13, 67, 11, 4, 3); b.cells(76, 10.5, 81, 8.5, 2); b.arc(89, 5, 100, 4, 3, 3);
  }),
  // 381 ── a hollow tree stacked with floors: each floor is guarded by snapjaws, and a mushroom at its far end pops you up to the next
  L('Bloomgate Ladder', 'ascent', (b) => {
    b.start(-6, 0, 12);
    b.plat(-14, 2, 3); b.shard(-12.5, 4);
    b.rect(8, 3, 1, 38); b.rect(26, 0, 1, 31); b.rect(8, 41, 19, 1);
    b.plat(8, 0, 19);                                      // floor 0 →
    b.door(16, 0, { P: 3.4, open: 0.5 });
    b.mushroom(23.5, 0, 7);
    b.plat(9, 8, 11);                                      // floor 1 ←
    b.door(15, 8, { P: 3.4, open: 0.5, off: 1.2 });
    b.mushroom(9.5, 8, 7);
    b.plat(14, 16, 12);                                    // floor 2 → twin jaws
    b.door(18, 16, { P: 3, open: 0.45 }); b.door(21, 16, { P: 3, open: 0.45, off: -0.45 });
    b.shard(19.5, 20.5);
    b.mushroom(23.5, 16, 7);
    b.plat(9, 24, 11);                                     // floor 3 ← a quick jaw
    b.checkpoint(18, 24);
    b.door(14.5, 24, { P: 2.6, open: 0.4 });
    b.mushroom(9.5, 24, 7);
    b.plat(14, 32, 13);                                    // floor 4 → out over the bark
    b.door(21, 32, { P: 3.2, open: 0.5, off: 0.8 });
    b.plat(29, 32, 6);
    b.vine(40, 39, 6);
    b.shard(40, 40.5);
    b.plat(46, 30, 4);
    b.plat(54, 28, 10);
    b.goal(60, 28);
    b.cells(10, 1, 22, 1, 5); b.cells(24.6, 4, 24.6, 8, 2); b.cells(11, 9, 19, 9, 4); b.cells(10.6, 12, 10.6, 16, 2);
    b.cells(15, 17, 25, 17, 4); b.cells(10, 25, 19, 25, 4); b.cells(15, 33, 26, 33, 5); b.arc(35, 32, 46, 30, 4, 3);
  }),

  // 382 ── a meadow of snapjaws, each with a mushroom in front: wait for the jaw to open, or vault clean over it
  L('Jawvault Meadow', 'doors', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 70);
    b.mushroom(10, 0, 6); b.door(16, 0, { P: 3.4, open: 0.5 });
    b.enemy('walker', 19, 0, { range: 3 });
    b.mushroom(23, 0, 8); b.door(28, 0, { P: 3, open: 0.4 }); b.door(31, 0, { P: 3, open: 0.4, off: -0.5 });
    b.shard(29.5, 11);                                     // above the twin jaws, at the top of a vault
    b.door(40, 0, { P: 3.6, open: 0.4, off: 1 }); b.rect(36, 6.5, 8, 1);   // this one has a roof: no vaulting
    b.mushroom(37, 0, 2);
    b.checkpoint(47, 0);
    b.enemy('spiker', 50, 0, { range: 5, speed: 2 });
    b.mushroom(56, 0, 9); b.door(62, 0, { P: 2.6, open: 0.35, h: 8 });
    b.thin(57, 12.5, 4); b.shard(59, 14);
    b.door(70, 0, { P: 3, open: 0.5, off: 1.5 }); b.mushroom(65, 0, 6);
    b.plat(81, 3, 6); b.door(85, 3, { P: 3, open: 0.5 }); b.mushroom(81.3, 3, 7);
    b.plat(92, 5, 10);
    b.goal(98, 5);
    b.cells(11.1, 4, 18, 6.5, 4); b.cells(24.1, 4, 33, 8, 4); b.cells(57.1, 5, 64, 9, 4); b.cells(66.1, 4, 72, 6.5, 3);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 383 ── a seed mill: hop between wheels by way of the vines strung between them, ending on a pair of counter-turning wheels
  L('Seedpod Mill', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.ferris(14, 3, 5, { n: 3, omega: 0.7 });
    b.vine(25, 13, 6);
    b.ferris(35, 6, 6, { n: 4, omega: -0.5 });
    b.shard(35, 15.5);
    b.plat(45, 8, 5);
    b.checkpoint(47, 8);
    b.ferris(57, 10, 5, { n: 4, omega: 0.6 });
    b.ferris(68.5, 10, 5, { n: 4, omega: -0.6 });
    b.shard(62.8, 10);                                     // where the two wheels nearly touch
    b.vine(79, 21, 6);
    b.plat(85, 12, 9);
    b.goal(91, 12);
    b.arc(6, 0, 19, 6, 3, 3); b.arc(19, 6, 30, 6, 3, 2); b.cells(57, 15.5, 68.5, 15.5, 3); b.arc(74, 12, 85, 12, 3, 3);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 384 ── up a hollow trunk on glow-spore steps that flicker in pairs, with rotting logs mixed in and a spore turret sweeping the middle
  L('Sporelight Tower', 'ascent', (b) => {
    b.start(-6, 0, 12);
    b.rect(8, 3, 1, 40); b.rect(24, 0, 1, 36); b.rect(8, 43, 17, 1);
    b.tower(9, 0, 15, 43);
    b.plat(8, 0, 17);
    b.blink(18, 3.5, 3, { P: 3, on: 2 }); b.blink(12, 7, 3, { P: 3, on: 2, off: 1.5 });
    b.blink(18, 10.5, 3, { P: 3, on: 2 }); b.crumble(12, 14, 3);
    b.blink(18, 17.5, 3, { P: 3, on: 2, off: 1.5 });
    b.turret(9.5, 12, 1, { P: 2.4 });
    b.plat(9, 21, 5);
    b.checkpoint(11, 21);
    b.blink(15.5, 24.5, 3, { P: 2.6, on: 1.6 }); b.blink(20.5, 28, 3, { P: 2.6, on: 1.6, off: 1.3 });
    b.crumble(14.5, 31.5, 3); b.blink(9.5, 35, 3, { P: 2.6, on: 1.6 });
    b.turret(23.4, 29.2, -1, { P: 2.2, off: 1 });
    b.thin(15, 38.5, 4);
    b.plat(20, 39, 2); b.shard(21, 41);                    // a knot above the right bark
    b.plat(26, 37, 5);
    b.slide(36, 36, 36, 22, { T: 6, w: 3 });
    b.plat(41, 20, 8);
    b.goal(46, 20);
    b.shard(22.5, 1.2);                                    // behind the first step
    b.plat(9, 14.5, 2); b.shard(10, 16.5);                 // a nook beside the rotting log
    b.cells(19.5, 5, 13.5, 8.5, 2); b.cells(19.5, 12, 19.5, 19, 2); b.cells(17, 26, 22, 29.5, 2); b.cells(16, 33, 11, 36.5, 2);
  }),

  // 385 ── a storm of drifting leaves, each tracing its own loop: box, diamond, tall oval; read the paths and hop between them
  L('Leafstorm', 'ride', (b) => {
    b.start(-6, 4, 12);
    b.loop([[10, 4], [20, 4], [20, 10], [10, 10]], { speed: 3, w: 3 });
    b.loop([[27, 10], [33, 4], [39, 10], [33, 16]], { speed: 3.2, w: 3 });
    b.shard(33, 10);                                       // in the eye of the diamond
    b.plat(44, 9, 5);
    b.checkpoint(46, 9);
    b.loop([[53, 3], [53, 17], [58, 17], [58, 3]], { speed: 3.4, w: 3 });
    b.loop([[64, 17], [78, 17]], { speed: 3, loop: false, w: 3 });
    b.loop([[84, 17], [92, 9], [84, 1]], { speed: 3, loop: false, w: 3 });
    b.thin(64, 22, 3); b.shard(65.5, 23.5);
    b.plat(96, 9, 10);
    b.goal(102, 9);
    b.cells(15, 11.5, 15, 11.5, 1); b.cells(48, 10.5, 48, 10.5, 1); b.cells(55.5, 6, 55.5, 15, 3); b.cells(66, 18.5, 76, 18.5, 4);
    b.plat(-14, 6, 3); b.shard(-12.5, 8);
  }),

  // 386 ── one fallen giant, three passes: run right through the hollow, press the glowroot, come back left on the upper deck, then out a knot-hole and along the bark
  L('Fallen Giant', 'maze', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 52);                                      // lower deck →
    b.plat(12, 5.4, 44);                                   // upper deck ←
    b.rect(8, 9.8, 4, 1); b.rect(16, 9.8, 45, 1);          // bark roof with a knot-hole at 12..16
    b.rect(8, 3, 1, 6.8);                                  // left bark (walk in under it)
    b.rect(60, 0, 1, 10.8);                                // right bark
    b.enemy('walker', 14, 0, { range: 8 });
    b.door(30, 0, { h: 4.4, P: 3, open: 0.5 });
    b.enemy('walker', 36, 0, { range: 8, speed: 2 });
    b.checkpoint(46, 0);
    b.switch(52, 0);
    b.blue(57.5, 2.8, 2.5);                                // grows once you press the glowroot
    b.enemy('spiker', 34, 5.4, { range: 12, speed: 2.4 });
    b.switch(22, 5.4);
    b.red(12.5, 8.1, 2);                                   // ...and this one when you press the second
    b.enemy('flyer', 30, 13, { ax: 4, ay: 0.8, T: 3 });
    b.enemy('walker', 40, 10.8, { range: 12, speed: 2.2 });
    b.plat(65, 9, 4);
    b.plat(72, 8, 10);
    b.goal(78, 8);
    b.shard(55, 6.8);                                      // dead end at the right of the upper deck
    b.shard(9.5, 12.3);                                    // on the roof, left of the knot-hole
    b.shard(10, 1);                                        // lower deck, past the entrance beetle... behind you
    b.cells(16, 1, 28, 1, 4); b.cells(32, 1, 50, 1, 5); b.cells(50, 6.5, 24, 6.5, 7); b.cells(18, 12, 58, 12, 8);
  }),

  // 387 ── spore pods on every landing fire across the swing lanes: jump the low bolts on the ground, time each swing between the high ones
  L('Sporeshot Swing', 'swing', (b) => {
    b.start(-6, 2, 10);
    b.vine(10, 11, 6);
    b.plat(16, 2, 7); b.rect(16, 2, 1.2, 3.4);
    b.turret(16.6, 2.8, 1, { P: 2.4 }); b.turret(16.6, 4.9, 1, { P: 2.4, off: 1.2 });
    b.vine(29, 12, 6);
    b.plat(35, 3, 7); b.rect(35, 3, 1.2, 3.4);
    b.turret(35.6, 3.8, 1, { P: 2 }); b.turret(35.6, 5.9, 1, { P: 2, off: 1 });
    b.checkpoint(40, 3);
    b.vine(48, 13, 6); b.vine(56.5, 13, 6);
    b.plat(62, 4, 6); b.rect(62, 4, 1.2, 3.4);
    b.turret(62.6, 4.8, 1, { P: 1.8 }); b.turret(62.6, 6.9, 1, { P: 1.8, off: 0.9 });
    b.vine(74, 15, 6);
    b.plat(80, 8, 10);
    b.goal(86, 8);
    b.shard(16.6, 7);                                      // perched on the first pod
    b.shard(52.2, 4.6);                                    // low between the chained vines
    b.plat(-14, 4, 3); b.shard(-12.5, 6);
    b.arc(4, 2, 16, 2, 3, 3); b.arc(23, 2, 35, 3, 3, 3); b.arc(42, 3, 62, 4, 5, 3); b.arc(68, 4, 80, 8, 3, 3);
  }),

  // 388 ── every jaw and spore tile opens in a rolling wave: run WITH the wave and everything parts before you
  L('Nightbloom Wave', 'timing', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 36); b.rect(10, 6.5, 32, 1);
    for (let k = 0; k < 9; k++) b.door(14 + k * 3, 0, { P: 3, open: 0.4, off: -k * 0.35 });
    b.cells(15.5, 1, 39.5, 1, 9);
    b.plat(48, 2, 5);
    b.checkpoint(50, 2);
    b.plat(51, 7, 2); b.shard(52, 9);                      // a roost above the checkpoint
    for (let k = 0; k < 10; k++) b.blink(54 + k * 3, 2, 3, { P: 3, on: 1.8, off: -k * 0.35 + 0.6 });
    for (let k = 0; k < 5; k++) b.door(55.5 + k * 6, 2, { P: 3, open: 0.4, off: -2 * k * 0.35 });
    b.rect(54, 8.5, 30, 1);
    b.shard(70, 6.5);                                      // under the roof, mid-wave
    b.cells(55, 3, 83, 3, 8);
    b.plat(87, 3, 4);
    for (let k = 0; k < 4; k++) { b.plat(94 + k * 7, 4 + k * 3, 3); b.door(95.5 + k * 7, 4 + k * 3, { P: 3, open: 0.4, off: -k * 0.8 }); }
    b.plat(122, 16, 10);
    b.goal(128, 16);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 389 ── THE TANGLE: rotting logs, chained vines, a jaw on a narrow stump, spore tiles, a mushroom to a high vine, turrets and thorn-balls — no rest
  L('The Tangle', 'hard', (b) => {
    b.start(-6, 0, 10);
    b.crumble(7, 0, 2.2); b.crumble(12, 1, 2.2);
    b.vine(20, 10, 6); b.vine(28.5, 10, 6);
    b.plat(34, 2, 3); b.door(35.5, 2, { P: 2.8, open: 0.4 });
    b.blink(40, 3, 2.4, { P: 2.6, on: 1.6 }); b.blink(45, 4, 2.4, { P: 2.6, on: 1.6, off: 1.3 });
    b.plat(50, 4, 6); b.mushroom(53.8, 4, 6);
    b.checkpoint(51.5, 4);
    b.vine(60, 20, 6);
    b.plat(66, 12, 4);
    b.rect(76, 6, 1.4, 4); b.turret(76.7, 13.2, -1, { P: 1.8 }); b.rect(76, 12.6, 1.4, 1.2);
    b.crumble(71, 12, 2); b.thin(75.5, 10.6, 2.4);
    b.plat(80, 9, 10); b.enemy('spiker', 80.5, 9, { range: 8.5, speed: 3 });
    b.vine(96, 17, 6); b.vine(104.5, 17, 6);
    b.enemy('flyer', 100, 12, { ax: 1.2, ay: 1.6, T: 2.4 });
    b.plat(110, 10, 3); b.crumble(116, 11, 2); b.crumble(121, 12, 2);
    b.plat(126, 12, 10);
    b.goal(132, 12);
    b.shard(24.2, 3.5);                                    // low between the first vines
    b.shard(60, 23.5);                                     // at the top of the mushroom launch
    b.shard(100.2, 6.5);
    b.cells(8, 1.5, 13, 2.5, 2); b.arc(14, 1, 34, 2, 5, 3); b.cells(41, 4.5, 46, 5.5, 2); b.arc(57, 10, 66, 12, 3, 4); b.arc(90, 9, 110, 10, 5, 3);
  }),

  // 390 ── FINALE: glowroot buttons unlock the Heart Tree, mushroom shelves and jaws carry you to its crown, then the Spore Swarm chases you home
  L('Heart of the Grove', 'finale', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 8); b.switch(13, 0);
    b.blue(19, 1, 4); b.red(19, 6, 4);
    b.plat(26, 0, 22);                                     // inside the Heart Tree
    b.rect(26, 3.5, 1, 30); b.rect(47, 0, 1, 26); b.rect(26, 33.5, 22, 1);
    b.door(34, 0, { P: 3, open: 0.5 });
    b.mushroom(43, 0, 7);
    b.plat(27, 8, 13); b.door(33, 8, { P: 3, open: 0.5, off: 1 });
    b.mushroom(27.5, 8, 7);
    b.plat(32, 16, 15); b.enemy('walker', 34, 16, { range: 6 });
    b.mushroom(43.5, 16, 7);
    b.plat(27, 24, 14); b.door(36, 24, { P: 2.8, open: 0.45, off: 0.5 });
    b.plat(32, 27.5, 3); b.shard(33.5, 29.5);              // a shelf above the last jaw
    b.thin(27, 28.5, 3);
    b.plat(35, 31, 16);                                    // crown, over the right bark
    b.checkpoint(49, 31);
    b.chase({ speed: 4.6, trigger: 50, behind: 16 });
    b.vine(60, 38, 6); b.vine(68.5, 38, 6);
    b.plat(74, 29, 4);
    b.crumble(81, 27, 2.4); b.crumble(86, 25, 2.4);
    b.plat(91, 23, 5); b.mushroom(94, 23, 6);
    b.rect(99, 20, 1.2, 11);
    b.plat(102, 24, 4);
    b.vine(112, 31, 6);
    b.plat(118, 22, 4); b.crumble(125, 20, 2.4); b.crumble(130, 18, 2.4);
    b.plat(136, 16, 12);
    b.goal(144, 16);
    b.shard(64.2, 30.5);                                   // low under the vine chain
    b.shard(99.6, 34);                                     // over the bark wall at the top of the vault
    b.cells(9, 1, 14, 1, 3); b.cells(28, 1, 41, 1, 5); b.cells(44.1, 4, 44.1, 8, 2); b.cells(29, 9, 38, 9, 4);
    b.cells(28.6, 12, 28.6, 16, 2); b.cells(34, 17, 42, 17, 4); b.cells(28, 25, 39, 25, 4);
    b.arc(51, 31, 74, 29, 6, 3); b.cells(82, 28.5, 87, 26.5, 2); b.arc(106, 24, 118, 22, 3, 4); b.cells(126, 21.5, 131, 19.5, 2);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),
];
