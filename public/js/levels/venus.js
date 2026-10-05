// WORLD 3 — VENUS. 30 hand-written levels. Gravity 0.9.
// Units at g 0.9: single jump ≈ 2.7 high / 6.6 far, double jump ≈ 4.9 high / 11 far, run 8.5/s.
// Signature: drifting acid clouds, steam vents, acid rain (drips), acid pools, lava domes.
// Every level has its own idea; see the comment above each one.
import { L } from './dsl.js';

export default [
  // 61 ── touchdown on Ishtar Terra: meet one pool, one slow cloud and one steam vent, each on its own stage
  L('Ishtar Landing', 'intro', (b) => {
    b.start(-6, 0, 14);
    b.plat(12, 0, 6);
    b.arc(8, 0, 12, 0, 2, 1.6);
    b.plat(22, 1.5, 5);
    b.block(31, 0, 8); b.pool(39, 0, 5, 'acid'); b.block(44, 0, 8);
    b.arc(38, 0, 45, 0, 3, 2.4);
    b.checkpoint(48, 0);
    // the first cloud: it breathes up and down; walk under it while it is high
    b.plat(56, 1, 11);
    b.cloud(61.5, 1.8, 7.5, { T: 5 });
    b.cells(57, 2, 66, 2, 4);
    // the first vent: wait for the hiss to stop
    b.plat(71, 1, 10);
    b.beam('steam', 76, 1, { P: 3, on: 1.1 });
    b.plat(85, 4, 4);
    b.plat(92, 7, 4);
    b.cells(86, 5.4, 94, 8.4, 3);
    b.shard(94, 11.6);
    b.plat(100, 3, 12);
    b.goal(107, 3);
    b.shard(41.5, 2.4);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 62 ── AEROSTAT ASCENT: board balloon pads that float up through the toxic cloud deck, then zip down the cable between cities
  L('Aerostat Ascent', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 4);
    b.floater(15, 0.5, 3, { rise: 8, speed: 2.2 });        // first aerostat: step on and float up
    b.cells(16.5, 3, 16.5, 8.5, 3);
    b.plat(21, 8, 5);
    b.cloud(28, 3, 11, { T: 5 });                          // toxic cloud drifting under the cable
    b.zip(26, 10.5, 45, 5);                                // zip between aerostats
    b.thin(33, 11, 3); b.shard(34.5, 12.6);                // a ledge above the cable: hop up from the zip
    b.plat(46, 3.5, 6);
    b.checkpoint(49, 3.5);
    b.floater(56, 3, 3, { rise: 9, speed: 2.4 });
    b.shard(56, 16.2);                                     // ride the balloon to the very top and jump
    b.plat(61.5, 11.5, 4);
    b.floater(68.5, 6, 3, { rise: 7, speed: 2.4 });
    b.plat(74.5, 12.5, 4);
    b.cloud(66, 16, 10, { T: 4, dx: 3 });
    b.cells(62, 13, 76, 14, 5);
    b.zip(79, 15, 98, 8);
    b.plat(99, 6, 10);
    b.goal(105, 6);
    b.arc(26, 9.5, 45, 5.5, 4, 1);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 63 ── PENDULUM GONDOLAS: hop between towers on gondolas swinging from the underside of a floating city, then a slag bucket guards the end
  L('Gondola Run', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.pendulum(13, 8, 7, { amp: 40, T: 4 });
    b.plat(20, 1, 4);
    b.pendulum(29, 11, 7, { amp: 40, T: 4, phase: 0.5 });
    b.plat(36, 4, 6);
    b.checkpoint(39, 4);
    b.shard(29, 9);                                        // above the second gondola
    b.pendulum(48, 14, 7, { amp: 38, T: 3.6 });
    b.pendulum(55, 16, 7, { amp: 38, T: 3.6, phase: 0.5 });
    b.shard(51.5, 12.4);
    b.plat(62, 9, 6);
    b.vine(72, 18, 7);                                     // chain hanging from the city above: swing across
    b.plat(79, 10, 4);
    b.plat(82, 10, 14);
    b.wrecker(89, 17, 4.6, { amp: 45, T: 3 });             // a slag bucket on the landing deck
    b.goal(93, 10);
    b.cells(7, 2, 16, 3, 4); b.cells(22, 3, 28, 5, 3); b.cells(42, 7, 52, 8, 4); b.cells(64, 10.4, 76, 11, 4);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 64 ── an S-bend of three vapour shafts: up the first, down the second, up the third, clouds patrolling each
  L('Vapor Shafts', 'ascent', (b) => {
    b.start(-6, 0, 12);
    b.tower(7, -2, 32, 30);
    // shaft A: climb
    [[8, 2.5], [13, 5], [8, 7.5], [13, 10], [8, 12.5], [13, 15], [8, 17.5]].forEach(([x, y]) => b.plat(x, y, 3));
    b.plat(13, 20, 4);
    b.cloud(12, 1, 17, { T: 8 });
    b.rect(17.2, -2, 1, 21);
    b.cells(9.5, 4, 9.5, 19, 5);
    b.shard(9, 21.5);
    // shaft B: descend
    [[19.5, 17], [24.5, 14], [19.5, 11], [24.5, 8], [19.5, 5]].forEach(([x, y]) => b.plat(x, y, 3));
    b.cloud(23.3, 15.5, 3, { T: 7 });
    b.plat(20, 2, 14);
    b.checkpoint(21.5, 2);
    b.cells(21, 15, 26, 9, 4);
    // shaft C: climb again (squeeze under the dividing wall)
    b.rect(28.4, 4.6, 1, 22);
    [[31, 5], [35.5, 8], [31, 11], [35.5, 14], [31, 17], [35.5, 20], [31, 23]].forEach(([x, y]) => b.plat(x, y, 3));
    b.cloud(34.2, 4, 21, { T: 6, phase: 0.5 });
    b.cells(37, 9.5, 37, 21.5, 4);
    b.plat(39, 26, 12);
    b.goal(46, 26);
    b.plat(36, 0.8, 3); b.shard(37.5, 2.8);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 65 ── ferries across the acid lake while clouds slant down across the water
  L('Caustic Ferry', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.block(6, 0, 2); b.pool(8, 0, 20, 'acid'); b.block(28, 0, 4);
    b.slide(10.5, 0.8, 25.5, 0.8, { T: 6, w: 3 });
    b.cloud(14, 7, 1, { dx: 8, T: 5 });
    b.cells(11, 2, 25, 2, 5);
    b.checkpoint(30, 0);
    b.pool(32, 0, 20, 'acid'); b.block(52, 0, 4);
    b.slide(34.5, 0.8, 49.5, 0.8, { T: 5, w: 3, phase: 0.5 });
    b.cloud(46, 7, 1, { dx: -9, T: 4.4 });
    b.cloud(38, 1, 7, { dx: 6, T: 4.4 });
    b.thin(40, 5.4, 4); b.shard(42, 7);
    b.cells(35, 2, 49, 2, 5);
    // the last crossing: up a ramp ferry, over to a ferry back down
    b.pool(56, 0, 22, 'acid'); b.block(78, 0, 10);
    b.slide(58.5, 0.8, 65, 5.5, { T: 4.5, w: 3 });
    b.slide(69, 5.5, 75.5, 0.8, { T: 4.5, w: 3, phase: 0.5 });
    b.cloud(67, 9, 2, { T: 3.6 });
    b.plat(65.5, 10, 2.2); b.shard(66.6, 11.6);
    b.cells(60, 2.5, 75, 2.5, 6);
    b.goal(84, 0);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 66 ── PRESSURE CANNONS: volcanic cannons blast you across lava from dome to dome: single shots, a chain, a spinner, a rocker and a tower ladder
  L('Pressure Cannons', 'pods', (b) => {
    b.start(-6, 0, 12);
    b.plat(9, 0, 5);
    b.barrel(13, 2.2, { angle: 40 });                      // cannon 1: hop in, press jump
    b.plat(21, 1, 7);
    b.pool(28, 1, 26, 'lava');
    b.barrel(33, 3, { angle: 15 });                        // the chain: cannon to cannon over the lava
    b.barrel(39, 2.9, { angle: 15 });
    b.barrel(45, 2.7, { angle: 45 });
    b.plat(54, 1.5, 7);
    b.checkpoint(57, 1.5);
    b.barrel(66, 4.5, { spin: 100 });                      // a spinning cannon: wait for it to face the next dome
    b.plat(70.5, -0.5, 2.5); b.shard(71.7, 1.5);           // fire it low for the cooled stump
    b.plat(72, 7, 4);
    b.barrel(79, 9, { angle: 70, sweep: 35, spin: 100, power: 20 });   // a rocking cannon
    b.plat(72.5, 14, 2.5); b.shard(73.7, 16);              // rocked all the way back it reaches this perch
    b.plat(86, 12.5, 5);
    b.barrel(94, 15, { angle: 90, power: 22 });            // cannon ladder up the tower
    b.barrel(94, 20.5, { angle: 90, power: 22 });
    b.barrel(94, 26, { spin: 90 });
    b.shard(94, 31);
    b.plat(101, 23, 9);
    b.goal(107, 23);
    b.arc(3, 0, 11, 2, 2, 1); b.arc(13, 2.2, 23, 1.5, 3, 2); b.cells(33, 3, 45, 2.7, 3); b.arc(45, 2.7, 56, 2.5, 3, 2.5);
    b.arc(67, 5, 73, 7.5, 2, 2); b.arc(80, 10, 87, 13.5, 3, 2.5); b.cells(94, 17.5, 94, 23.5, 3);
  }),

  // 67 ── a switchback descent through the crust: every tier is a crumbling bridge, steam rising from below
  L('Crust Collapse', 'descent', (b) => {
    b.start(-6, 24, 12);
    // tier 1 → right
    b.crumble(8, 24, 2.4); b.crumble(12.6, 24, 2.4); b.crumble(17.2, 24, 2.4);
    b.plat(22, 24, 5);
    b.cells(9, 25.2, 21, 25.2, 4);
    // tier 2 ← left
    b.plat(20, 18, 12);
    b.crumble(15, 18, 2.4); b.crumble(10.4, 18, 2.4); b.crumble(5.8, 18, 2.4);
    b.plat(-2, 18, 6);
    b.beam('steam', 12, 12, { P: 3, on: 1, h: 7.6 });
    b.cells(17, 19.2, 1, 19.2, 5);
    b.shard(29, 21.4);
    // tier 3 → right
    b.plat(-8, 12, 9);
    b.checkpoint(-4, 12);
    b.crumble(3, 12, 2.2); b.crumble(7.4, 12, 2.2); b.crumble(11.8, 12, 2.2); b.crumble(16.2, 12, 2.2);
    b.plat(21, 12, 8);
    b.beam('steam', 9.5, 6, { P: 2.6, on: 0.9, off: 1.3, h: 7.6 });
    b.beam('steam', 18.5, 6, { P: 2.6, on: 0.9, h: 7.6 });
    b.cells(4, 13.2, 18, 13.2, 4);
    // tier 4 ← left, then out the bottom
    b.plat(23, 6, 10);
    b.crumble(18, 6, 2.4); b.crumble(13, 6, 2.4);
    b.plat(4, 6, 6);
    b.meteor(15.5, 6, { style: 'drip', P: 1.8 });
    b.plat(-3, 2, 4);
    b.shard(-1, 4.2);
    b.crumble(3, -1, 2.2); b.crumble(9, -2, 2.2); b.crumble(15, -3, 2.2);
    b.plat(21, -3, 12);
    b.goal(29, -3);
    b.plat(-14, 25.5, 3); b.shard(-12.5, 27.5);
  }),

  // 68 ── SLAG FOUNDRY: swinging slag buckets sweep the floor, hanging cradles carry you over the melt pits, a sulfur wheel turns in the middle
  L('Slag Foundry', 'cave', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 10);
    b.wrecker(13, 7, 4.8, { amp: 55, T: 3 });
    b.pendulum(25, 9, 7, { amp: 35, T: 3.4 });
    b.pendulum(31, 9, 7, { amp: 35, T: 3.4, phase: 0.5 });
    b.shard(28, 7.6);                                      // up between the cradles
    b.plat(36, 0, 18);
    b.sweeper(43, 3.5, 3, { omega: 70 });                  // sulfur-jet wheel
    b.shard(43, 1.9);                                      // right under its hub
    b.wrecker(48, 7, 4.8, { amp: 55, T: 2.8, phase: 0.3 });
    b.checkpoint(53, 0);
    b.pendulum(61, 10.5, 7, { amp: 40, T: 3.6 });
    b.pendulum(69, 11.5, 7, { amp: 40, T: 3.6, phase: 0.5 });
    b.plat(77, 4, 10);
    b.sweeper(82, 7.5, 3, { omega: 50, both: true });
    b.vine(94, 14, 6);
    b.plat(87.5, 10, 2.5); b.shard(88.7, 12);
    b.plat(99, 5, 4);
    b.plat(107, 5, 14);
    b.wrecker(110.5, 12.2, 5, { amp: 55, T: 3 });
    b.wrecker(115.5, 12.2, 5, { amp: 55, T: 3, phase: 0.5 });
    b.goal(119, 5);
    b.cells(9, 1, 17, 1, 4); b.arc(18, 0, 36, 0, 3, 3); b.cells(38, 1, 41, 1, 2); b.cells(46, 1, 52, 1, 3);
    b.arc(56, 0, 77, 4, 4, 4); b.cells(79, 5, 86, 5, 3); b.cells(108, 6, 117, 6, 4);
  }),

  // 69 ── crawl through a wrecked lander: every button you press reshapes the hull around you
  L("Venera's Grave", 'puzzle', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 6); b.switch(11, 0);
    // hull: roof over the whole wreck
    b.rect(14, 8.5, 44, 1);
    b.red(16, 0, 4); b.blue(22, 0, 4);
    b.redWall(27, 0, 5.4); b.plat(26, 0, 6); b.switch(29.5, 0);
    b.blue(16, 4, 4); b.thin(22, 4.6, 4);
    b.blue(34, 2, 3); b.red(39, 4, 3); b.plat(44, 4, 6); b.switch(47, 4);
    b.blueWall(50.5, 4, 4.5); b.plat(50, 4, 8);
    b.checkpoint(54, 4);
    b.cells(9, 1, 28, 1, 6); b.cells(35, 3, 46, 5, 4);
    b.shard(18, 6);
    // outside: a hanging bridge of blocks that flips with every press
    b.plat(62, 4, 4); b.switch(63.5, 4);
    b.red(69, 5, 3); b.blue(74, 6, 3); b.red(79, 7, 3); b.blue(84, 8, 3);
    b.plat(88, 7, 4); b.switch(89.5, 7);
    b.red(94, 6, 3); b.blue(94, 10, 3);
    b.plat(99, 6, 10);
    b.goal(105, 6);
    b.shard(95.5, 12.5);
    b.cells(70, 6.5, 85, 9.5, 4);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 70 ── CHASE: the Acid Fog rolls in over Lada Terra; sprint over pools, crust and rain
  L('Lada Fog Sprint', 'chase', (b) => {
    b.chase({ speed: 4 });
    b.start(-6, 0, 14);
    b.block(12, 0, 6); b.pool(18, 0, 4, 'acid'); b.block(22, 0, 6); b.pool(28, 0, 4, 'acid'); b.block(32, 0, 5);
    b.crumble(41, 1.5, 2.6); b.crumble(46, 3, 2.6); b.crumble(51, 4.5, 2.6);
    b.plat(56, 4.5, 8);
    b.checkpoint(60, 4.5);
    b.meteor(66.5, 2, { style: 'drip', P: 1.2 });
    b.plat(65, 2, 4); b.plat(73, 2, 4); b.spring(75, 2, 6);
    b.meteor(74, 2, { style: 'drip', P: 1.2, off: 0.6 });
    b.plat(80, 9, 5);
    b.crumble(89, 7, 2.4); b.crumble(94, 5, 2.4); b.crumble(99, 3, 2.4);
    b.block(105, 1, 6); b.pool(111, 1, 4, 'acid'); b.block(115, 1, 10);
    b.goal(121, 1);
    b.arc(12, 0, 32, 0, 6, 2); b.cells(42, 3, 52, 6, 4); b.cells(90, 8.5, 100, 4.5, 4);
    b.shard(82.5, 12.5); b.shard(113, 3.6);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 71 ── TIDE: acid floods the Aphrodite well; climb a lean-right stair, crumble back left, wall-jump the flue
  L('Aphrodite Flood', 'tide', (b) => {
    b.rise({ rate: 0.6, delay: 5 });
    b.start(-6, 0, 12);
    b.tower(-4, -4, 32, 46);
    b.plat(8, 3, 3); b.plat(13, 5.5, 3); b.plat(18, 8, 3); b.plat(23, 10.5, 3);
    b.cloud(16, 15, 4, { T: 6 });
    b.cells(9.5, 4.4, 24.5, 11.9, 4);
    b.shard(26.5, 14.6);
    b.crumble(18, 13, 2.4); b.crumble(13, 15.5, 2.4); b.crumble(8, 18, 2.4);
    b.cells(19, 14.4, 9, 19.4, 3);
    b.plat(-2, 20, 5);
    b.checkpoint(0, 20);
    // the flue: wall-jump up between two chimney walls
    b.wall(-2.6, 20, 13); b.wall(1.2, 22.6, 10.4);
    b.cells(-0.3, 23, -0.3, 31, 4);
    b.plat(-7.5, 31, 3); b.shard(-6, 33);
    b.plat(2, 33, 5); b.spring(5, 33, 6);
    b.cloud(9, 36, 42, { T: 4, dx: 4 });
    b.plat(10, 40, 4);
    b.plat(17, 42, 9);
    b.goal(22, 42);
    b.cells(5.9, 36, 5.9, 40, 3);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 72 ── down into a caldera and out again, under the crossfire of a turret pillar in the middle
  L('Sapas Caldera', 'gauntlet', (b) => {
    b.start(-6, 12, 14);
    b.block(8, 9, 8); b.block(16, 6, 6); b.block(22, 3, 6);
    b.block(28, 0, 4); b.pool(32, 0, 3, 'acid');
    b.block(35, 4.5, 4);
    b.turret(35, 1.2, -1, { P: 2.4 }); b.turret(39, 1.2, 1, { P: 2.4, off: 1.2 });
    b.pool(39, 0, 3, 'acid'); b.block(42, 0, 4);
    b.checkpoint(37, 4.5);
    b.block(50, 3, 6); b.block(56, 6, 6); b.block(62, 9, 6);
    b.block(68, 12, 12);
    b.rect(78, 12, 1.6, 4); b.turret(78.8, 12.8, -1, { P: 2.6 }); b.turret(78.8, 14.9, -1, { P: 2.6, off: 1.3 });
    b.enemy('flyer', 47, 5, { ax: 1.5, ay: 2, T: 3 });
    b.cells(11, 11, 24, 5, 4); b.cells(29, 1, 45, 1, 5); b.cells(51, 5, 64, 11, 4);
    b.thin(35.5, 9.2, 3); b.shard(37, 10.8);
    b.plat(46.5, -2.5, 3); b.shard(48, -0.8);
    b.shard(78.8, 19.6);
    b.plat(83, 14, 10);
    b.goal(89, 14);
  }),

  // 73 ── PUMICE RAFTS: floating pumice sinks into the acid under your weight, balloon pads lift you out: never stand still
  L('Pumice Rafts', 'swamp', (b) => {
    b.start(-6, 0, 12);
    b.pool(6, 0, 50, 'acid');
    b.sinker(9.5, 0.5, 3, { depth: 2.5 });                 // first raft: feel it sink
    b.sinker(15.5, 1, 3, { depth: 2.5 });
    b.sinker(21.5, 1.5, 3, { depth: 2.5 });
    b.floater(28, 1.5, 3, { rise: 7, speed: 2.2 });
    b.cells(29.5, 4, 29.5, 8.5, 3);
    b.shard(28, 12.2);                                     // ride the balloon to the top
    b.plat(34, 8, 4);
    b.sinker(41, 7, 2.6, { depth: 3, speed: 1.8 });
    b.sinker(46.5, 6, 2.6, { depth: 3, speed: 1.8 });
    b.sinker(52, 5, 2.6, { depth: 3, speed: 1.8 });
    b.block(56, 0, 8);
    b.checkpoint(59, 0);
    b.pool(64, 0, 32, 'acid');
    b.sinker(67.5, 0.5, 3, { depth: 2.5 });
    b.sinker(73.5, 1, 3, { depth: 2.5 });
    b.pendulum(81, 10, 8.5, { amp: 38, T: 3.8 });          // a gondola over the last of the acid
    b.floater(91, 0.5, 3, { rise: 7, speed: 2.4 });
    b.shard(91, 11);
    b.plat(96, 7, 4);
    b.plat(100, 6, 12);
    b.goal(107, 6);
    b.cells(10, 2, 24, 3, 5); b.cells(41, 8.5, 53, 6.5, 4); b.cells(68, 2, 76, 3, 3); b.cells(98, 8.5, 104, 7.5, 3);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 74 ── three ferris wheels of the superrotating winds; steam blasts the bottom of each wheel
  L('Superrotation Wheels', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.ferris(14, 3, 4.5, { n: 4, omega: 0.7 });
    b.beam('steam', 14, -3, { P: 3, on: 1, h: 4.4 });
    b.plat(22, 4, 4);
    b.cells(14, 9, 14, 9, 1);
    b.ferris(35, 6, 7, { n: 6, omega: -0.5 });
    b.beam('steam', 35, -3, { P: 3.4, on: 1.2, off: 1, h: 7 });
    b.cloud(35, 6, 6, { dx: 0, T: 4 });
    b.shard(35, 14.2);
    b.plat(45, 8, 5);
    b.checkpoint(47, 8);
    b.cloud(54, 14, 4, { T: 5 });
    b.ferris(60, 9, 5.5, { n: 5, omega: 0.75 });
    b.ferris(75, 12, 4.5, { n: 4, omega: -0.85 });
    b.beam('steam', 60, 0, { P: 2.8, on: 1, h: 5 });
    b.cells(60, 16, 75, 18, 4);
    b.shard(67.5, 20);
    b.plat(83, 13, 10);
    b.goal(89, 13);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 75 ── climb Maxwell Montes: up the slope while clouds roll downhill, a crevasse chimney, then the summit
  L('Maxwell Montes', 'ascent', (b) => {
    b.start(-6, 0, 12);
    b.block(8, 2, 7); b.block(15, 4.5, 6); b.block(21, 7, 7);
    b.block(28, 9, 9);
    b.cloud(30, 15, 3, { dx: -20, T: 6 });
    b.meteor(18, 4.5, { style: 'drip', P: 1.8 });
    b.cells(9, 3.4, 27, 10, 5);
    // the crevasse: walk under the overhang, then wall-jump up
    b.rect(33.2, 11.5, 0.8, 8);
    b.block(37, 21, 8);
    b.cells(35.5, 12, 35.5, 19, 4);
    b.shard(33.6, 21.4);
    b.checkpoint(41, 21);
    b.block(45, 23.5, 6);
    b.wrecker(48, 32, 5, { amp: 50, T: 3 });   // slag bucket on the ridge
    b.block(51, 26, 6);
    b.block(57, 28, 8);
    b.cloud(62, 30, 22, { dx: -18, T: 7 });
    b.cells(48, 25, 61, 29.5, 4);
    b.shard(62, 33);
    // the steep east face
    b.crumble(68, 25, 2.4); b.crumble(73, 22, 2.4);
    b.plat(78, 19, 4);
    b.meteor(80, 19, { style: 'drip', P: 2 });
    b.lift(85, 18, 6, { T: 5 });
    b.block(90, 4, 6);
    b.block(99, 2, 10);
    b.goal(105, 2);
    b.cells(69, 26.4, 79, 20.4, 3);
    b.plat(-12, -2, 3); b.shard(-10.5, -0.2);
  }),

  // 76 ── a lava tube: rolling steam under the roof, then choose the crawlway or the spiker gallery above it
  L('Lava Tube', 'maze', (b) => {
    b.start(-6, 0, 12);
    b.plat(6, 0, 40);
    b.rect(8, 4.2, 38, 1);
    [14, 22, 30, 38].forEach((x, i) => b.beam('steam', x, 0, { P: 2.4, on: 0.8, off: i * 0.45, h: 4.2 }));
    b.enemy('walker', 16, 0, { range: 4 });
    b.cells(10, 1, 44, 1, 8);
    b.plat(46, 0, 4);
    b.checkpoint(48, 0);
    // lower crawlway (no jumping!) vs upper gallery
    b.plat(50, 0, 30);
    b.rect(50, 2.2, 30, 0.8);
    [56, 64, 72].forEach((x, i) => b.beam('steam', x, 0, { P: 2.2, on: 0.7, off: i * 0.7, h: 2.2, w: 1.6 }));
    b.rect(50, 7.2, 30, 1);
    b.enemy('spiker', 53, 3, { range: 10, speed: 2 }); b.enemy('spiker', 66, 3, { range: 10, speed: 2.4 });
    b.cells(52, 1, 78, 1, 6); b.cells(52, 4, 78, 4, 6);
    b.shard(77, 4.2);
    // up the exit flue under the dripping vent holes
    b.plat(80, 0, 8);
    b.rect(84, 4.2, 4, 1);
    b.wall(88, 0, 10); b.plat(91, 3, 3); b.plat(85, 7, 3);
    b.meteor(92.5, 3, { style: 'drip', P: 2 });
    b.plat(91, 11, 4); b.plat(98, 12, 10);
    b.goal(104, 12);
    b.shard(86.5, 9.2);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 77 ── CLOUD CITY CHAINS: swing on chains and zip down cables between floating cloud cities, past swinging slag buckets
  L('Cloud City Chains', 'speed', (b) => {
    b.start(-6, 20, 12);
    b.vine(11, 27, 6.5);                                   // chain from the city above
    b.plat(18, 19, 4);
    b.zip(23, 22, 45, 15);
    b.shard(34, 21.8);                                     // hop off the cable for this one
    b.plat(46, 13, 6);
    b.checkpoint(49, 13);
    b.vine(57, 21, 7);
    b.plat(63.5, 12, 3); b.shard(64.7, 14);
    b.plat(66.5, 11, 4);
    b.zip(70, 15, 90, 8);
    b.wrecker(80, 18.5, 5, { amp: 50, T: 3 });
    b.plat(91, 6, 7);
    b.zip(99, 10.5, 121, 4.5, { oneWay: true });
    b.wrecker(107, 17, 5.5, { amp: 55, T: 2.8 });
    b.wrecker(115, 15, 5.5, { amp: 55, T: 2.8, phase: 0.5 });
    b.plat(122, 1, 10);
    b.goal(128, 1);
    b.cells(25, 21, 43, 15.6, 5); b.cells(72, 14, 88, 8.6, 5); b.cells(101, 9.5, 119, 4.5, 6);
    b.plat(-14, 21.5, 3); b.shard(-12.5, 23.5);
  }),

  // 78 ── pancake domes with springs, but acid clouds slide across the sky above each pad: bounce in the gaps
  L('Pancake Domes', 'bounce', (b) => {
    b.start(-6, 0, 12);
    b.pillarPlat(9, 2, 9); b.spring(15, 2, 7);
    b.cloud(16, 8, 8, { dx: 8, T: 3.6 });
    b.pillarPlat(22, 8, 7); b.spring(27, 8, 6);
    b.cloud(28, 13, 13, { dx: -8, T: 3.2 });
    b.pillarPlat(33, 12, 5);
    b.cells(16, 5, 23, 10, 3); b.cells(28, 11, 34, 14, 3);
    b.checkpoint(35, 12);
    b.pillarPlat(43, 9, 4); b.spring(45, 9, 7);
    b.cloud(46, 15, 15, { dx: 6, T: 3 });
    b.pillarPlat(51, 15, 3);
    b.crumble(58, 14, 2.4); b.crumble(63, 13, 2.4);
    b.pillarPlat(69, 10, 3); b.spring(70, 10, 9);
    b.cloud(70.5, 15, 15, { dx: -6, T: 2.8 });
    b.shard(70.5, 22);
    b.pillarPlat(77, 18, 2.4);
    b.shard(78.2, 21.6);
    b.plat(84, 14, 4); b.plat(91, 10, 10);
    b.goal(97, 10);
    b.cells(52, 16.5, 64, 14.5, 4);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 79 ── down the Hephaestus fissure: steam blasts the whole shaft, so hide in the wall notches between bursts
  L('Hephaestus Fissure', 'descent', (b) => {
    b.start(-6, 30, 14);
    b.rect(8, 6, 2, 22); b.rect(16, 6, 2, 26);
    b.beam('steam', 13, 2, { P: 3.2, on: 1, h: 30, w: 2 });
    const ledges = [[10, 25, 0], [14, 21, 1], [10, 17, 0], [14, 13, 1], [10, 9, 0]];
    for (const [x, y] of ledges) b.plat(x, y, 2);
    b.cells(11, 26.2, 11, 10.2, 6);
    b.plat(16, 32, 4); b.shard(18, 34);
    b.plat(9, 4, 9);
    b.checkpoint(10, 4);
    b.shard(15, 22.4);
    // the fissure floor: an acid river with rain
    b.block(20, 0, 4); b.pool(24, 0, 5, 'acid'); b.block(29, 0, 3); b.pool(32, 0, 5, 'acid'); b.block(37, 0, 3);
    b.pool(40, 0, 5, 'acid'); b.block(45, 0, 8);
    [26.5, 34.5, 42.5].forEach((x, i) => b.meteor(x, 0, { style: 'drip', P: 1.4, off: i * 0.45 }));
    b.cells(21, 1, 50, 1, 7);
    b.plat(56, 3, 4); b.plat(62, 6, 4);
    b.plat(69, 6, 9);
    b.goal(74, 6);
    b.plat(-14, 31.5, 3); b.shard(-12.5, 33.5);
  }),

  // 80 ── CHASE: the superrotating gale drives the Acid Fog: vents, springs and crust, never stop
  L('Superrotation Gale', 'chase', (b) => {
    b.chase({ speed: 4.4 });
    b.start(-6, 0, 14);
    b.plat(12, 1, 5); b.plat(21, 2, 4);
    b.block(28, 0, 4); b.vent(30, 0, 7, { always: true });
    b.plat(34, 8, 6);
    b.crumble(44, 7, 2.4); b.crumble(49, 6, 2.4); b.crumble(54, 5, 2.4);
    b.cloud(51, 12, 7, { T: 3 });
    b.plat(59, 4, 7);
    b.checkpoint(62, 4);
    b.plat(70, 2, 4); b.spring(72, 2, 7);
    b.plat(77, 10, 4); b.plat(85, 8, 3);
    b.block(92, 3, 4); b.vent(94, 3, 8, { always: true });
    b.plat(98, 12, 5);
    b.crumble(107, 10, 2.2); b.crumble(112, 8, 2.2); b.crumble(117, 6, 2.2);
    b.plat(122, 5, 12);
    b.goal(130, 5);
    b.cells(13, 2.4, 24, 3.4, 3); b.cells(30, 3, 30, 7, 3); b.cells(45, 8.4, 55, 6.4, 4); b.cells(108, 11.4, 118, 7.4, 4);
    b.shard(36.5, 12); b.shard(80, 13.6);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 81 ── counter-rising lifts with steam geysers between them: cross each geyser while it sleeps
  L('Danu Geyser Lifts', 'timing', (b) => {
    b.start(-6, 0, 12);
    b.lift(10, 0, 10, { T: 5 });
    b.beam('steam', 13.8, -2, { P: 3, on: 1, h: 16 });
    b.lift(17.6, 10, 0, { T: 5 });
    b.plat(23, 9, 5);
    b.cells(10, 5, 17.6, 5, 3);
    b.lift(32, 4, 16, { T: 6 });
    b.beam('steam', 36, -2, { P: 3.2, on: 1.1, h: 21 });
    b.lift(40, 16, 6, { T: 6 });
    b.beam('steam', 44, -2, { P: 3.2, on: 1.1, off: 1.6, h: 21 });
    b.lift(48, 6, 18, { T: 6.5 });
    b.shard(36, 20.5);
    b.plat(52, 16, 6);
    b.checkpoint(55, 16);
    b.plat(54, 8, 3); b.shard(55.5, 10);
    b.lift(62, 14, 2, { T: 5 });
    b.beam('steam', 66, -2, { P: 2.8, on: 1, h: 13 });
    b.plat(69, 4, 4);
    b.lift(77, 4, 14, { T: 5 });
    b.beam('steam', 81, -2, { P: 2.8, on: 1, off: 1.4, h: 16 });
    b.plat(84, 12, 10);
    b.goal(90, 12);
    b.cells(32, 11, 48, 11, 5); b.cells(62, 9, 77, 9, 4);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 82 ── a switchyard where every button is required: each press opens the way ahead and drops the way back
  L('Magellan Switchyard', 'puzzle', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 10); b.switch(14, 0);
    b.blue(21, 0, 4); b.blue(27, 0, 4);
    b.plat(33, 0, 12); b.switch(35, 0);
    b.rect(33, 4.8, 14, 0.8); b.blueWall(41, 0, 4.8);
    b.shard(39, 7.4);
    b.red(48, 1, 4); b.red(54, 2, 4);
    b.cloud(51, 8, 1.6, { T: 4 });
    b.plat(60, 3, 10); b.switch(66, 3);
    b.checkpoint(62, 3);
    b.meteor(64, 3, { style: 'drip', P: 2 });
    b.blue(71, 6, 3);
    b.shard(72.5, 10.4);
    b.rect(77, 3, 1, 7);
    b.plat(78, 6, 6); b.switch(81, 6);
    b.red(87, 8, 3); b.red(92, 10, 3);
    b.cloud(91, 16, 11, { T: 3.4 });
    b.plat(97, 10, 8);
    b.goal(102, 10);
    b.cells(9, 1, 30, 1, 6); b.cells(34, 1, 44, 1, 4); b.cells(49, 2.4, 57, 3.4, 3); b.cells(88, 9.4, 94, 11.4, 3);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 83 ── SULFUR JET SWEEPERS: rotating jets of burning sulfur sweep the foundry floor, then a vent to a gallery of turning beams
  L('Sulfur Jet Sweepers', 'gauntlet', (b) => {
    b.start(-6, 0, 12);
    b.block(6, 0, 56);
    b.sweeper(16, 4, 3.5, { omega: 60 });
    b.sweeper(27, 4.5, 3.6, { omega: 50, both: true });
    b.checkpoint(32, 0);
    b.sweeper(38, 4, 3, { omega: 75 });
    b.sweeper(44, 4, 3, { omega: -75 });
    b.shard(41, 1.8);                                      // between the counter-rotating jets
    b.vent(54, 0, 11, { P: 2.4, on: 1.2 });
    b.cells(54, 4, 54, 11, 3);
    b.plat(58, 11, 5);
    b.plat(66, 13, 3); b.sweeper(66, 17, 3, { omega: 60 });
    b.plat(74, 14, 3); b.sweeper(74, 18, 2.8, { omega: -60, both: true });
    b.shard(60.5, 15);
    b.plat(82, 12, 3); b.sweeper(82, 16, 3, { omega: 70 });
    b.plat(90, 10, 10);
    b.goal(96, 10);
    b.cells(8, 1, 36, 1, 8); b.cells(66, 14.6, 83, 13.4, 5);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 84 ── SUPERROTATION UPDRAFTS: travelling tornadoes lift you across a bottomless chasm, then a cable carries you down to the next gale
  L('Gale Updrafts', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.tornado(8.5, 13, 0, { rise: 8, T: 4 });
    b.plat(22, 7, 5);
    b.shard(13, 11.5);                                     // top of the first gale
    b.tornado(28.5, 34, 7, { rise: 8, T: 4.5, phase: 0.5 });
    b.plat(45, 14, 5);
    b.checkpoint(48, 14);
    b.cloud(29, 20, 12, { T: 4, dx: 3 });
    b.zip(51, 17, 71, 8);
    b.plat(72, 6, 5);
    b.tornado(78.5, 84, 6, { rise: 10, T: 4.5 });
    b.plat(93, 15, 4);
    b.shard(83, 18);
    b.tornado(98.5, 102, 15, { rise: 3, T: 3.6, phase: 0.5 });
    b.plat(108, 17, 10);
    b.goal(114, 17);
    b.cells(8, 2, 21, 8, 5); b.cells(25, 9, 44, 15, 5); b.cells(53, 17, 69, 9, 5); b.cells(95, 16, 107, 18, 4);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 85 ── a cavern of rotating carousels: ride each conveyor-loop round and leap to the next
  L('Haze Carousel', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.rect(8, 13, 60, 1);
    b.loop([[10, 1], [28, 1], [28, 9], [10, 9]], { speed: 3, w: 3 });
    b.loop([[10, 1], [28, 1], [28, 9], [10, 9]], { speed: 3, w: 3, phase: 0.5 });
    b.meteor(19, 1, { style: 'drip', P: 2 });
    b.cells(12, 2.4, 26, 2.4, 4); b.shard(19, 11.4);
    b.plat(32, 9, 4);
    b.loop([[40, 10], [58, 10], [58, 3], [40, 3]], { speed: 3.2, w: 3 });
    b.loop([[40, 10], [58, 10], [58, 3], [40, 3]], { speed: 3.2, w: 3, phase: 0.5 });
    b.cloud(49, 4, 6.8, { T: 4 });
    b.cells(42, 11.4, 56, 11.4, 4);
    b.plat(62, 3, 5);
    b.checkpoint(64, 3);
    b.plat(66, 7, 2); b.shard(67, 8.8);
    b.loop([[72, 3], [80, 11], [88, 3], [80, -5]], { speed: 3.5, w: 3 });
    b.loop([[72, 3], [80, 11], [88, 3], [80, -5]], { speed: 3.5, w: 3, phase: 0.5 });
    b.meteor(80, 11, { style: 'drip', P: 2.4 });
    b.cells(74, 6, 86, 6, 4);
    b.plat(92, 4, 8);
    b.goal(97, 4);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 86 ── a two-storey labyrinth: the lower hall is barred, so climb up, flip the gate, and drop back through the hole
  L('Lakshmi Labyrinth', 'maze', (b) => {
    b.start(-6, 0, 12);
    b.plat(6, 0, 70);
    b.rect(6, 14, 60, 1); b.rect(70, 14, 8, 1);
    b.rect(12, 6.5, 22, 0.8); b.rect(37, 6.5, 25, 0.8);
    b.thin(7, 3.8, 4);
    b.redWall(40, 0, 6.5);
    [20, 28].forEach((x, i) => b.beam('steam', x, 0, { P: 2.6, on: 0.9, off: i * 1.3, h: 6.5 }));
    b.enemy('walker', 14, 0, { range: 10 });
    b.switch(30, 7.3);
    b.enemy('spiker', 14, 7.3, { range: 12, speed: 1.8 });
    b.blueWall(45, 7.3, 6.7);
    b.checkpoint(38, 0);
    b.enemy('walker', 46, 0, { range: 12, speed: 2 });
    b.beam('steam', 56, 0, { P: 2.4, on: 0.8, h: 6.5 });
    b.thin(63, 3.8, 3);
    b.shard(55, 9);
    b.plat(66, 10.5, 4);
    b.plat(78, 15, 8);
    b.goal(83, 15);
    b.shard(20, 16.6);
    b.cells(8, 1, 38, 1, 6); b.cells(13, 8.5, 31, 8.5, 5); b.cells(42, 1, 62, 1, 5);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 87 ── tessera crust: a rippling wave of crumbling tiles under a ceiling of crosswind clouds, then a blinking valley
  L('Tessera Shatter', 'precision', (b) => {
    b.start(-6, 0, 12);
    [[9, 1], [13, 2.5], [17, 4], [21, 2.5], [25, 1], [29, 2.5], [33, 4], [37, 5.5]].forEach(([x, t]) => { b.crumble(x, t, 2); b.cell(x + 1, t + 1.2); });
    b.cloud(13, 6.8, 6.8, { dx: 10, T: 4 }); b.cloud(33, 8, 8, { dx: -8, T: 3.4 });
    b.shard(38, 9.6);
    b.plat(42, 5, 4);
    b.checkpoint(44, 5);
    b.blink(49, 3.5, 2.4, { P: 2.4, on: 1.5 }); b.crumble(53.5, 2, 2);
    b.blink(58, 0.5, 2.4, { P: 2.4, on: 1.5, off: 0.8 }); b.crumble(62.5, -1, 2);
    b.plat(60, -4, 3); b.shard(61.5, -2.2);
    b.wrecker(60, 9, 5, { amp: 40, T: 3 });
    b.crumble(67, 1, 2); b.blink(71.5, 3, 2.4, { P: 2.4, on: 1.5, off: 1.6 }); b.crumble(76, 5, 2);
    [55.5, 64.5, 73.5].forEach((x, i) => b.meteor(x, 0, { style: 'drip', P: 1.6, off: i * 0.5 }));
    b.cells(50, 5, 77, 6.4, 7);
    b.plat(81, 6, 8);
    b.goal(86, 6);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 88 ── Baltis Vallis, the longest lava channel in the system: one long rhythmic run of pools, ferries and eruptions
  L('Baltis Vallis', 'classic', (b) => {
    b.start(-6, 0, 12);
    b.block(6, 0, 8); b.pool(14, 0, 4, 'lava'); b.block(18, 0, 6); b.pool(24, 0, 5, 'lava'); b.block(29, 0, 5);
    b.pool(34, 0, 6, 'lava'); b.block(40, 0, 6); b.enemy('spiker', 41, 0, { range: 4 });
    b.pool(46, 0, 14, 'lava');
    b.slide(49, 0.8, 57, 0.8, { T: 3, w: 3 });
    b.thin(51, 4.6, 4); b.shard(53, 6.2);
    b.block(60, 0, 8);
    b.meteor(62, 0, { style: 'drip', P: 1.4 }); b.meteor(66, 0, { style: 'drip', P: 1.4, off: 0.7 });
    b.pool(68, 0, 5, 'lava'); b.block(73, 0, 10);
    b.checkpoint(77, 0);
    b.vent(81, 0, 7.5, { P: 2.4, on: 1.2 });
    b.plat(84, 7, 6);
    b.shard(87, 11.4);
    b.block(94, 0, 6);
    b.wrecker(103, 8, 4.5, { amp: 45, T: 3, phase: 0.3 });
    b.pool(100, 0, 6, 'lava'); b.block(106, 0, 4); b.pool(110, 0, 6, 'lava');
    b.block(116, 0, 4); b.pool(120, 0, 6, 'lava'); b.block(126, 0, 6);
    b.enemy('walker', 126.5, 0, { range: 4.5 }); b.shard(129, 4.5);
    b.pool(132, 0, 16, 'lava');
    b.slide(135, 0.8, 140, 0.8, { T: 2.4, w: 2.6 }); b.slide(141, 2.5, 146, 2.5, { T: 2.4, w: 2.6, phase: 0.5 });
    b.block(148, 0, 12);
    b.goal(156, 0);
    b.arc(12, 0, 18, 0, 2, 2); b.arc(23, 0, 29, 0, 2, 2); b.arc(33, 0, 40, 0, 2, 2.4);
    b.cells(61, 1, 81, 1, 5); b.arc(98, 0, 106, 0, 2, 2.4); b.arc(108, 0, 116, 0, 2, 2.4); b.arc(118, 0, 126, 0, 2, 2.4);
  }),

  // 89 ── the Alpha Regio gauntlet: chimney, steam-blink descent, turret corridor, rain ladder: no breather
  L('Alpha Regio Gauntlet', 'gauntlet', (b) => {
    b.start(-6, 0, 12);
    b.plat(6, 0, 5.8);
    b.wall(8, 2.6, 10); b.wall(11.8, 0, 14);
    b.plat(3, 14, 5); b.shard(5, 16);
    b.plat(12.6, 14, 5);
    b.cloud(10, 15, 15, { dx: 6, T: 3 });
    b.cells(10.3, 3, 10.3, 12, 4);
    b.blink(21, 12, 2.4, { P: 2.8, on: 1.6 }); b.blink(25.5, 10, 2.4, { P: 2.8, on: 1.6, off: 0.7 });
    b.blink(30, 8, 2.4, { P: 2.8, on: 1.6, off: 1.4 }); b.blink(34.5, 6, 2.4, { P: 2.8, on: 1.6, off: 2.1 });
    b.beam('steam', 27.8, 0, { P: 2.4, on: 0.8, h: 10 }); b.beam('steam', 32.3, 0, { P: 2.4, on: 0.8, off: 1.2, h: 8 });
    b.plat(29.5, 2, 2); b.shard(30.5, 3.8);
    b.plat(38, 5, 5);
    b.checkpoint(40, 5);
    b.plat(46, 5, 4);
    b.rect(44, 9.5, 28, 0.8);
    b.crumble(51, 5, 2.4); b.crumble(56, 5, 2.4); b.crumble(61, 5, 2.4);
    b.rect(67.2, 7, 1.4, 2.5); b.turret(67.2, 7.5, -1, { P: 1.8 });
    b.enemy('flyer', 58, 7.6, { ax: 3, ay: 0.4, T: 2.6 });
    b.plat(66, 5, 6);
    b.thin(76, 8, 3); b.thin(81, 11, 3); b.thin(76, 14, 3); b.thin(81, 17, 3);
    b.meteor(77.5, 8, { style: 'drip', P: 1.6 }); b.meteor(82.5, 11, { style: 'drip', P: 1.6, off: 0.8 });
    b.shard(77.5, 18.6);
    b.plat(87, 19, 8);
    b.goal(92, 19);
    b.cells(22, 13.4, 36, 7.4, 4); b.cells(52, 6.4, 62, 6.4, 3); b.cells(77.5, 9.4, 82.5, 18.4, 4);
  }),

  // 90 ── FINALE: steam organ, switch bridge, cloud ferry, then the Acid Fog chases you over vents and crust to the end
  L('Heart of Venus', 'finale', (b) => {
    b.start(-6, 0, 12);
    b.block(8, 1, 2.4); b.beam('steam', 9.2, 1, { P: 2.6, on: 0.9, h: 3.2, w: 1.6 });
    b.block(12.6, 3, 2.4); b.beam('steam', 13.8, 3, { P: 2.6, on: 0.9, off: 0.5, h: 3.2, w: 1.6 });
    b.block(17.2, 5, 2.4); b.beam('steam', 18.4, 5, { P: 2.6, on: 0.9, off: 1, h: 3.2, w: 1.6 });
    b.thin(14.5, 9.4, 3); b.shard(16, 11);
    b.plat(22, 5, 6); b.switch(25, 5);
    b.blue(31, 6, 3); b.blue(36, 7, 3);
    b.plat(41, 7, 5);
    b.pool(46, 7, 18, 'acid');
    b.slide(49, 6.8, 61, 6.8, { T: 4.5, w: 3 });
    b.cloud(55, 13, 7.5, { dx: 4, T: 3.6 });
    b.shard(55, 10.4);
    b.plat(64, 7, 6);
    b.checkpoint(67, 7);
    b.chase({ speed: 4.6, trigger: 69, behind: 16 });
    b.crumble(74, 6, 2.4); b.crumble(79, 5, 2.4);
    b.wrecker(77, 12, 5, { amp: 45, T: 2.8 });
    b.block(84, 2, 4); b.vent(86, 2, 8, { always: true });
    b.plat(90, 11, 5);
    b.meteor(92.5, 11, { style: 'drip', P: 1.2 });
    b.plat(99, 8, 4); b.spring(101, 8, 6);
    b.plat(106, 15, 5); b.shard(108.5, 19.4);
    b.crumble(115, 13, 2.2); b.crumble(120, 11, 2.2); b.crumble(125, 9, 2.2);
    b.block(130, 7, 4); b.pool(134, 7, 4, 'acid'); b.block(138, 7, 12);
    b.goal(146, 7);
    b.cells(9.2, 2.4, 18.4, 6.4, 3); b.cells(32, 7.4, 37, 8.4, 2); b.cells(50, 8.2, 60, 8.2, 4);
    b.cells(75, 7.4, 80, 6.4, 2); b.cells(86, 5, 86, 10, 3); b.cells(116, 14.4, 126, 10.4, 3);
  }),
];
