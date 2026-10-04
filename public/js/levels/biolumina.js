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

  // 365 ── lily pads sink under your weight and spore puffballs float you up: cross the mire without ever standing still
  L('Lilypad Mire', 'swamp', (b) => {
    b.start(-6, 0, 12);
    b.sinker(9, 0, 3, { depth: 3 });                       // first pad: feel it go down
    b.sinker(15, 0.5, 3, { depth: 3.5 });
    b.shard(16.5, -1.6);                                   // only reached by riding a pad all the way under
    b.sinker(21, 0, 3, { depth: 3 });
    b.plat(27, 1, 5);
    b.floater(34, 1, 3, { rise: 9, speed: 2.2 });          // a puffball: stand on it and it floats you up
    b.cells(35.5, 3.5, 35.5, 8.5, 3);
    b.shard(35.5, 12.6);                                   // ride the puffball to the very top
    b.plat(40, 7, 5);
    b.checkpoint(42, 7);
    b.sinker(48, 6, 2.6, { depth: 3, speed: 2 });
    b.sinker(53.5, 5, 2.6, { depth: 3, speed: 2 });
    b.sinker(59, 4, 2.6, { depth: 3, speed: 2 });
    b.enemy('flyer', 56.5, 8.5, { ax: 2.5, ay: 0.6, T: 3 });   // a glow-moth drifting over the pad chain
    b.thin(53, 10.5, 3.5); b.shard(54.7, 12);              // a leaf canopy above the moth lane
    b.floater(65, 3, 3, { rise: 7, speed: 2.4 });
    b.plat(70, 9, 4);
    b.sinker(77, 8, 6, { depth: 5, speed: 0.9 });          // the giant lily: slow, but don't dawdle
    b.plat(87, 6, 10);
    b.goal(93, 6);
    b.arc(6, 0, 27, 1, 6, 1.6); b.cells(49, 7.2, 60, 5.2, 4); b.arc(68, 10, 70, 9, 1, 1); b.cells(78, 9.2, 82, 9.2, 3);
  }),

  // 366 ── seed-pod cannons: one pod, then a pod-to-pod blast chain over the bog, a spinning pod, a rocking pod, and a pod ladder up a trunk
  L('Podcannon Canopy', 'pods', (b) => {
    b.start(-6, 0, 12);
    b.plat(9, 0, 5);
    b.barrel(13, 2.2, { angle: 40 });                      // pod 1: hop in, press jump
    b.plat(21, 1, 7);
    b.barrel(27, 3, { angle: 15 });                        // the chain: pod → pod → pod, no ground between
    b.barrel(33, 2.9, { angle: 15 });
    b.barrel(39, 2.7, { angle: 45 });
    b.plat(48, 1.5, 7);
    b.checkpoint(51, 1.5);
    b.barrel(58, 4.5, { spin: 100 });                      // a spinning pod: wait for it to face the next ledge
    b.plat(62.5, -0.5, 2.5); b.shard(63.7, 1.5);           // fire it low for a drowned stump
    b.plat(64, 7, 4);
    b.barrel(71, 9, { angle: 70, sweep: 35, spin: 100, power: 20 });   // a rocking pod
    b.plat(64.5, 14, 2.5); b.shard(65.7, 16);              // ...rocked all the way back, it reaches this perch
    b.plat(78, 12.5, 5);
    b.barrel(86, 15, { angle: 90, power: 22 });            // pod ladder up the trunk
    b.barrel(86, 20.5, { angle: 90, power: 22 });
    b.barrel(86, 26, { spin: 90 });
    b.shard(86, 31);                                       // straight up out of the top pod
    b.plat(93, 23, 9);
    b.goal(99, 23);
    b.arc(3, 0, 11, 2, 2, 1); b.arc(13, 2.2, 23, 1.5, 3, 2); b.cells(29, 3, 37, 2.9, 3); b.arc(39, 2.7, 50, 2.5, 3, 2.5);
    b.cells(52, 2.5, 56, 3.5, 2); b.arc(59, 5, 65, 7.5, 2, 2); b.arc(72, 10, 79, 13.5, 3, 2.5); b.cells(86, 17.5, 86, 23.5, 3); b.arc(87, 26, 95, 24, 3, 1);
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
    b.pendulum(23, 16.5, 4.5, { amp: 35, T: 3.2 });          // a hanging cocoon to cross the gap
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

  // 369 ── spider-silk zip lines carry you down the canopy past swinging thorn-pods: zip, hop, vine-to-silk, zip again
  L('Silkline Descent', 'speed', (b) => {
    b.start(-6, 30, 12);
    b.thin(0, 34.2, 3); b.shard(1.5, 35.7);                // a twig over the first silk anchor
    b.zip(7, 33, 25, 27);
    b.wrecker(16, 36, 5.4, { amp: 50, T: 3.2 });           // a thorn-pod swinging across the first silk
    b.shard(20, 30.6);                                     // hop on the silk (you re-grab it) to snag this one
    b.plat(27, 24, 5);
    b.zip(33, 26, 55, 18);
    b.wrecker(44, 28, 5.4, { amp: 50, T: 3, phase: 0.5 });
    b.plat(56, 15, 6);
    b.checkpoint(59, 15);
    b.vine(67, 22, 6);                                     // vine → silk: let go into the next zip line
    b.plat(59.5, 20.5, 2.5); b.shard(60.7, 22.5);          // ...or let go on the back-swing for a high knot
    b.zip(71, 17, 88, 10.5);
    b.plat(89, 8, 6);
    b.zip(95, 10.5, 117, 4.5, { oneWay: true });
    b.wrecker(102, 15, 5.5, { amp: 55, T: 2.8 });
    b.wrecker(110, 13, 5.5, { amp: 55, T: 2.8, phase: 0.5 });
    b.plat(118, 1, 10);
    b.goal(124, 1);
    b.cells(9, 31, 23, 26.6, 5); b.cells(35, 24, 53, 19, 6); b.arc(62, 15, 71, 16, 3, 3); b.cells(73, 14.8, 86, 10.3, 5); b.cells(97, 8.3, 115, 3.3, 6);
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
  // 371 ── spitting flower pods: a self-firing bloom spits you across, a rocking pod, a thorn bar to dash under, and a spinning pod over the thicket
  L('Flowerspit Thicket', 'gauntlet', (b) => {
    b.start(-6, 0, 12);
    b.plat(9, 0, 5);
    b.barrel(16, 2.2, { angle: 35, auto: true });          // the flower spits you out by itself
    b.plat(29, 4, 5);
    b.barrel(37, 5.6, { angle: 20, sweep: 25, spin: 70 }); // a rocking pod
    b.plat(50, 5, 5);
    b.checkpoint(52, 5);
    b.plat(58, 5, 3); b.sweeper(63, 8, 3.5, { omega: 90, both: true });   // a thorn bar: cross when it is vertical
    b.plat(68, 5, 4);
    b.barrel(76, 6.6, { angle: 55, auto: true });          // another flower spits you up the thicket
    b.plat(88, 12, 5);
    b.barrel(95, 14, { spin: 90 });                        // a spinning pod over the thorns
    b.plat(106, 10, 10);
    b.enemy('walker', 108, 10, { range: 5 });
    b.goal(113, 10);
    b.shard(60, 8.5);                                      // above the thorn bar
    b.shard(42, 9.5);                                       // at the top of the rocking pod's arc
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.arc(3, 0, 9, 1, 2, 1); b.arc(18, 3, 28, 5, 3, 2); b.cells(30, 5.2, 34, 5.2, 2); b.arc(51, 6, 58, 6, 2, 2); b.arc(78, 8, 88, 13, 3, 2);
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

  // 377 ── thorn-balls roll along a gully floor: cross overhead on vines and swaying hanging fruit, dropping down only to snatch shards and bounce back out
  L('Fruitfall Gully', 'swing', (b) => {
    b.start(-6, 4, 12);
    b.plat(8, -2, 60);
    b.enemy('spiker', 10, -2, { range: 10, speed: 3 }); b.enemy('spiker', 24, -2, { range: 12, speed: 2.4 });
    b.enemy('spiker', 40, -2, { range: 10, speed: 3.2 }); b.enemy('spiker', 54, -2, { range: 12, speed: 2.6 });
    b.vine(12, 12, 6);
    b.pendulum(18, 10, 5, { amp: 35, T: 3.2 });             // hanging fruit swaying over the gully
    b.vine(25, 12, 6);
    b.pendulum(31, 11, 5, { amp: 35, T: 3.4, phase: 0.5 });
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

  // 378 ── a highwire through the treetops: vine chains that climb and dip, glow-moths drifting through the arcs, swaying hanging-fruit rests
  L('Canopy Highwire', 'swing', (b) => {
    b.start(-6, 10, 10);
    b.vine(9, 18, 5); b.vine(17.5, 18, 5);
    b.enemy('flyer', 13, 16, { ax: 1, ay: 1.5, T: 3 });
    b.pendulum(23, 16, 6, { amp: 30, T: 3.4 });            // hanging fruit instead of a flicker
    b.vine(31, 19, 6);
    b.plat(36, 11, 5);
    b.checkpoint(38, 11);
    b.vine(46, 20, 6); b.vine(54.5, 21, 6);
    b.enemy('flyer', 50, 14, { ax: 1, ay: 2, T: 2.6 });
    b.plat(60, 13, 3);
    b.vine(69, 22, 6); b.enemy('flyer', 66, 17, { ax: 1, ay: 2, T: 3 });
    b.plat(74, 14, 4);
    b.pendulum(81, 19.5, 6.5, { amp: 30, T: 3.2, phase: 0.5 });
    b.vine(89, 21, 7);
    b.plat(95, 12, 10);
    b.goal(101, 12);
    b.thin(30, 16.5, 2.5); b.shard(31.2, 18);
    b.shard(50.2, 11.5);
    b.plat(-14, 13, 3); b.shard(-12.5, 15);
    b.arc(4, 10, 23, 10, 5, 3); b.arc(41, 11, 60, 13, 5, 3); b.arc(63, 13, 74, 14, 3, 3); b.arc(84, 13, 95, 12, 3, 3);
  }),

  // 379 ── a hive-hung hollow: beehive hammers swing through a low log, cross its pits on hanging cocoons, dash under turning thorn-vine wheels
  L('Hivehammer Hollow', 'cave', (b) => {
    b.start(-6, 0, 12);
    b.rect(8, 7, 42, 1);                                   // the hollow log's roof
    b.plat(8, 0, 10);
    b.wrecker(13, 7, 4.8, { amp: 55, T: 3 });              // a beehive hammer sweeping the floor
    b.pendulum(21.5, 7, 4.5, { amp: 35, T: 3.4 });         // hanging cocoons over the pit
    b.pendulum(26.5, 7, 4.5, { amp: 35, T: 3.4, phase: 0.5 });
    b.shard(24, 5.6);                                      // up between the cocoons, under the bark
    b.plat(30, 0, 18);
    b.sweeper(36, 3.5, 3, { omega: 70 });                  // a thorny vine wheel filling the chamber
    b.shard(36, 1.9);                                      // right under its hub
    b.wrecker(40.5, 7, 4.8, { amp: 55, T: 2.8, phase: 0.3 });
    b.checkpoint(46, 0);
    b.pendulum(53, 9.5, 6.5, { amp: 40, T: 3.6 });
    b.pendulum(61, 10.5, 6.5, { amp: 40, T: 3.6, phase: 0.5 });
    b.plat(69, 4, 10);
    b.sweeper(74, 7.5, 3, { omega: 50, both: true });      // a thorn bar turning over the ledge: duck under it when it lies flat
    b.vine(86, 14, 6);
    b.sweeper(86, 1, 4, { omega: -80 });                   // ...and a thorn wheel under the vine: don't let go early
    b.plat(79.5, 10, 2.5); b.shard(80.7, 12);              // let go on the back-swing for this knot
    b.plat(91, 5, 4);
    b.plat(99, 5, 14);
    b.wrecker(102.5, 12.2, 5, { amp: 55, T: 3 });
    b.wrecker(107.5, 12.2, 5, { amp: 55, T: 3, phase: 0.5 });
    b.goal(111, 5);
    b.cells(9, 1, 17, 1, 4); b.arc(18, 0, 30, 0, 3, 3); b.cells(31, 1, 34, 1, 2); b.cells(39, 1, 45, 1, 3);
    b.arc(48, 0, 69, 4, 5, 4); b.cells(70, 5, 78, 5, 4); b.arc(80, 6, 91, 5, 3, 3); b.cells(100, 6, 109, 6, 4);
  }),

  // 380 ── the Swarm returns as you race DOWNHILL: drop down stump steps, bounce over a bark wall, swing twice to the valley floor
  L('Spore Avalanche', 'chase', (b) => {
    b.chase({ speed: 4.3 });
    b.start(-6, 24, 14);
    b.plat(-15, 26, 3); b.shard(-13.5, 28);
    b.plat(11, 22, 5); b.plat(19, 19, 5);
    b.zip(24, 20.5, 36, 14.5);                             // spider silk: slide down, no waiting
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
    b.cells(12, 23.5, 22, 20.5, 4); b.cells(26, 19.4, 34, 15.4, 3); b.arc(55, 13, 67, 11, 4, 3); b.cells(76, 10.5, 81, 8.5, 2); b.arc(89, 5, 100, 4, 3, 3);
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
    b.shard(43.5, 35);
    b.plat(46, 30, 4);
    b.plat(54, 28, 10);
    b.goal(60, 28);
    b.cells(10, 1, 22, 1, 5); b.cells(24.6, 4, 24.6, 8, 2); b.cells(11, 9, 19, 9, 4); b.cells(10.6, 12, 10.6, 16, 2);
    b.cells(15, 17, 25, 17, 4); b.cells(10, 25, 19, 25, 4); b.cells(15, 33, 26, 33, 5); b.arc(35, 32, 46, 30, 4, 3);
  }),

  // 382 ── a meadow strung with spider silk: a mushroom throws you onto a long zip line, snapjaws guard the landing, hanging fruit carries you over a pit, then silk again
  L('Silkmeadow Run', 'doors', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 10);
    b.mushroom(14, 0, 8);
    b.zip(17, 7.5, 36, 2.5);                               // bounce up, grab the silk, slide down the meadow
    b.plat(38, 0, 10);
    b.door(43, 0, { P: 3.2, open: 0.45 });
    b.checkpoint(46, 0);
    b.pendulum(55, 9, 6, { amp: 35, T: 3.4 });             // hanging fruit over the pit
    b.pendulum(63, 9, 6, { amp: 35, T: 3.4, phase: 0.5 });
    b.pendulum(71, 9, 6, { amp: 35, T: 3.4 });
    b.plat(79, 3, 5);
    b.mushroom(83, 3, 8);
    b.zip(85, 10, 104, 5);
    b.plat(106, 4, 14);
    b.door(110, 4, { P: 3, open: 0.4 });
    b.door(113, 4, { P: 3, open: 0.4, off: -0.5 });
    b.goal(118, 4);
    b.shard(27, 7);                                        // hop on the silk (you re-grab it) to snag this one
    b.shard(95, 11);                                       // above the second silk
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.cells(9, 1, 17, 1, 3); b.cells(39, 1, 42, 1, 2); b.cells(47, 1, 51, 1, 2); b.arc(80, 4.5, 84, 4.5, 2, 1); b.cells(107, 5, 109, 5, 2);
  }),

  // 383 ── a seed mill: wheels and vines carry you up, then spinning and rocking seed-pod cannons fling you across the mill yard to a last vine
  L('Podwheel Mill', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.ferris(14, 3, 5, { n: 3, omega: 0.7 });
    b.vine(25, 13, 6);
    b.ferris(35, 6, 6, { n: 4, omega: -0.5 });
    b.shard(35, 15.5);
    b.plat(45, 8, 5);
    b.checkpoint(47, 8);
    b.barrel(55, 9.6, { spin: 90 });                       // a spinning pod: wait for the ledge
    b.plat(64, 9, 3);
    b.barrel(70, 10.5, { angle: 20, sweep: 25, spin: 80 }); // a rocking pod
    b.shard(64.5, 14);                                     // over the middle knot
    b.vine(79, 21, 6);
    b.plat(85, 12, 9);
    b.goal(91, 12);
    b.arc(6, 0, 19, 6, 3, 3); b.arc(19, 6, 30, 6, 3, 2); b.arc(56, 12, 64, 10.5, 2, 2); b.arc(74, 12, 85, 12, 3, 3);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 384 ── up a hollow trunk on pollen: a whirlwind, a spore puffball, a second whirlwind past a turning thorn bar, a rocking pod out the top, then silk down
  L('Pollen Updraft', 'ascent', (b) => {
    b.start(-6, 0, 12);
    b.rect(8, 3, 1, 40); b.rect(26, 0, 1, 36); b.rect(8, 43, 19, 1);
    b.tower(9, 0, 17, 43);
    b.plat(8, 0, 18);
    b.tornado(12, 16, 0, { rise: 7, T: 4 });               // a pollen whirlwind wandering the floor
    b.shard(12, 12.5);                                     // ride it and double-jump at the top
    b.plat(18, 8, 8);
    b.floater(10, 8, 3, { rise: 9, speed: 2.2 });          // a spore puffball lifts you to the middle floor
    b.plat(15, 17, 11);
    b.checkpoint(23, 17);
    b.tornado(18, 24, 17, { rise: 8, T: 5 });
    b.sweeper(16, 25, 2.5, { omega: 70, both: true });     // a thorn bar turning across the drift to the left ledge
    b.plat(9, 27, 5);
    b.barrel(19, 31, { angle: 75, sweep: 40, spin: 100, power: 20 });   // a rocking pod fires you out over the bark
    b.plat(9, 35, 2.5); b.shard(10.2, 37);                 // rock it all the way back for the high nook
    b.plat(26, 37, 5);
    b.zip(32, 39.5, 52, 27);
    b.shard(42, 35.1);                                     // hop on the silk to snag it
    b.plat(53, 24, 8);
    b.goal(58, 24);
    b.cells(14, 3, 14, 7, 2); b.cells(19, 9.5, 24, 9.5, 3); b.cells(11.5, 11, 11.5, 16, 3); b.cells(20, 20, 20, 25, 3);
    b.cells(10, 28.5, 13, 28.5, 2); b.arc(19, 31, 28, 38.5, 3, 2); b.cells(34, 37.4, 50, 28.6, 5);
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
    b.thin(64, 21, 3); b.shard(65.5, 22.5);
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

  // 387 ── vine → pod → vine: swing out, get caught by a seed-pod cannon, fired to the next vine, over a thorn wheel, and a spinning pod throws you home
  L('Podvine Relay', 'swing', (b) => {
    b.start(-6, 2, 10);
    b.vine(10, 11, 6);
    b.plat(16, 2, 5);
    b.barrel(24, 3.8, { angle: 30 });                      // pod: hop in, press jump
    b.plat(34, 3, 3); b.vine(40, 14, 6);              // the blast lands on a knot; the vine carries on
    b.plat(45, 4, 4);
    b.checkpoint(47, 4);
    b.vine(55, 14, 7); b.vine(63.5, 14, 7);
    b.sweeper(59.5, 3, 3, { omega: 75 });                  // a thorn wheel turning under the vine chain
    b.plat(70, 5, 4);
    b.barrel(78, 7, { spin: 80 });                         // a spinning pod: wait for the far vine
    b.vine(92, 16, 6);
    b.plat(98, 8, 10);
    b.goal(104, 8);
    b.shard(32, 7);                                       // up on the arc of the first blast
    b.shard(59.5, 7.8);                                    // hanging over the thorn wheel
    b.plat(-14, 4, 3); b.shard(-12.5, 6);
    b.arc(4, 2, 16, 2, 3, 3); b.arc(26, 5, 38, 7, 3, 3); b.arc(47, 4, 70, 5, 5, 3); b.arc(80, 9, 92, 10, 3, 3);
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
    b.sweeper(100.2, 7.5, 3, { omega: 80, both: true });   // a thorn bar turning under the vine chain
    b.enemy('flyer', 100, 12, { ax: 1.2, ay: 1.6, T: 2.4 });
    b.plat(110, 10, 3); b.crumble(116, 11, 2); b.crumble(121, 12, 2);
    b.plat(126, 12, 10);
    b.goal(132, 12);
    b.shard(24.2, 3.5);                                    // low between the first vines
    b.shard(57, 15.5);                                     // at the top of the mushroom launch
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
    b.barrel(82, 29.6, { angle: -10, auto: true });         // a flower pod spits you on down the slope
    b.plat(89, 25, 2);
    b.plat(91, 23, 5); b.mushroom(94, 23, 6);
    b.rect(99, 20, 1.2, 11);
    b.plat(102, 24, 4);
    b.vine(112, 31, 6);
    b.plat(118, 22, 4); b.barrel(125, 23.6, { angle: -12, auto: true });
    b.plat(136, 16, 12);
    b.goal(144, 16);
    b.shard(64.2, 30.5);                                   // low under the vine chain
    b.shard(99.6, 34);                                     // over the bark wall at the top of the vault
    b.cells(9, 1, 14, 1, 3); b.cells(28, 1, 41, 1, 5); b.cells(44.1, 4, 44.1, 8, 2); b.cells(29, 9, 38, 9, 4);
    b.cells(28.6, 12, 28.6, 16, 2); b.cells(34, 17, 42, 17, 4); b.cells(28, 25, 39, 25, 4);
    b.arc(51, 31, 74, 29, 6, 3); b.cells(82, 28.5, 87, 26.5, 2); b.arc(106, 24, 118, 22, 3, 4); b.cells(126, 21.5, 131, 19.5, 2);
  }),
];
