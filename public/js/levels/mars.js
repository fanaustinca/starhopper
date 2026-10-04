// WORLD 5 — MARS. 30 hand-written levels (121–150).
// Gravity 0.75: single jump ≈ 3.3 high, double ≈ 5.9 high, same-height gaps up to ~15 (comfortable 5–10).
// Rovers: b.stream('rover', x0, x1, laneY) → deck = laneY + 2. Board from a slab ~1.35 above the deck,
// hop off onto a slab 0.6–1.1 above it. The canyon floor under a rover lane is deadly.
// Every level has its own idea; see the comment above each one.
import { L } from './dsl.js';

export default [
  // 121 ── intro: the dried river delta. Floaty jumps over lava channels between mesas.
  L('Jezero Delta', 'intro', (b) => {
    b.start(-6, 0, 14);
    b.pool(8, 0, 5);
    b.block(13, 0, 6);
    b.arc(6, 0, 15, 0, 3, 2.6);
    b.block(24, 1.5, 5);
    b.block(33, 3, 4);
    b.arc(37, 3, 44, 3, 3, 3);
    b.block(44, 3, 8);
    b.checkpoint(48, 3);
    b.block(56, 7.5, 4);                       // the first double-jump mesa
    b.cells(57, 9, 59, 9, 2);
    b.thin(57, 11.5, 2); b.shard(58, 13.2);    // a ledge only Mars gravity lets you reach
    b.block(64, 4, 6);
    b.pool(70, 4, 6);
    b.block(76, 4, 5);
    b.arc(81, 4, 90, 2, 4, 3.4);
    b.shard(85.5, 7.4);                        // high in the long floaty leap
    b.plat(90, 2, 10);
    b.goal(96, 2);
    b.plat(-13, -2.5, 3); b.shard(-11.5, -1);  // tucked under the start lip
  }),

  // 122 ── first rovers: wait on the overpass, drop onto a passing rover, ride it over canyons too wide to jump
  L('Valles Ferry', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 5);                           // overpass
    b.stream('rover', 10, 44, -3.35, { speed: 3, spacing: 11 });   // deck -1.35
    b.cells(16, 0, 40, 0, 6);
    b.shard(27, 3.6);                          // jump off the moving deck to grab it
    b.plat(44, -0.6, 5);
    b.plat(53, 1.5, 7);
    b.checkpoint(56, 1.5);
    b.stream('rover', 58, 80, -1.85, { speed: 4, spacing: 12 });   // deck 0.15
    b.cells(64, 1.6, 76, 1.6, 4);
    b.block(80, 1, 4);                         // a mesa splits the canyon: change rovers
    b.stream('rover', 84, 106, -1.85, { speed: 4, spacing: 12 });
    b.thin(95, 5, 3); b.shard(96.5, 6.6);
    b.cells(88, 1.6, 102, 1.6, 4);
    b.plat(106, 1, 4);
    b.plat(114, 3, 10);
    b.goal(120, 3);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 123 ── a rising skyline of mesas, then a slot canyon you escape by wall-jumping its chimney
  L('Ascraeus Mesas', 'classic', (b) => {
    b.start(-6, 0, 12);
    b.block(9, 2, 4);
    b.block(17, 5, 3);
    b.block(24, 3, 4);
    b.thin(25.5, 8.2, 2); b.shard(26.5, 9.8);
    b.block(32, 7, 3);
    b.block(39, 4, 5);
    b.checkpoint(41, 4);
    b.arc(6, 0, 39, 4, 9, 2);
    // the slot canyon: drop in, duck under the hanging fin, climb the chimney
    b.block(44, -3, 8);
    b.shard(45.2, -1.6);
    b.wall(48.4, -0.6, 11.6);
    b.rect(52, -3, 5, 12);
    b.cells(50.6, 0, 50.6, 8, 4);
    b.block(61, 7, 5);
    b.pool(66, 7, 6);
    b.block(72, 7, 8);
    b.arc(57, 9, 72, 7, 5, 2.4);
    b.goal(77, 7);
    b.plat(-13, 3.5, 3); b.shard(-11.5, 5.5);
  }),

  // 124 ── three layers: crumbling ledges under a cliff overhang, meteors on top of it, rovers below as a safety net
  L('Coprates Rim', 'precision', (b) => {
    b.start(-6, 0, 12);
    b.stream('rover', 6, 60, -7, { speed: 3, spacing: 12 });   // deck -5: the safety net
    b.rect(8, 6, 30, 2); b.rect(42, 6, 20, 2);               // the overhang, with a gap to climb through
    const xs = [9, 14.5, 20, 25.5, 31, 36.5, 43, 48.5, 54, 59.5];
    xs.forEach((x, i) => b.crumble(x, (i % 2) * 0.8, 2.4));
    b.crumble(38.8, 3.6, 2.4);                                // step up into the gap
    b.cells(10, 2, 60, 2, 10);
    b.meteor(20, 8, { P: 2.6 }); b.meteor(52, 8, { P: 2.2, off: 1 });
    b.cells(46, 9.5, 58, 9.5, 4);
    b.shard(20, 10);                                          // up on the bombarded overhang
    b.shard(30, -2.5);                                        // only if you fall to the rovers
    b.plat(60, -4.2, 3); b.plat(63.5, -1.6, 2.5);             // climb back up from the net
    b.plat(67, 1, 6);
    b.checkpoint(70, 1);
    b.stream('rover', 71, 102, -2.35, { speed: 3.5, spacing: 11 });   // deck -0.35
    b.enemy('flyer', 82, 2.6, { ax: 2, ay: 1, T: 3 });
    b.enemy('flyer', 93, 2.2, { ax: 1.5, ay: 1.2, T: 2.4 });
    b.thin(95, 4.5, 2); b.shard(96, 6);
    b.plat(102, 0.5, 4);
    b.plat(109, 2.5, 8);
    b.goal(114, 2.5);
  }),

  // 125 ── dust devils: their gusts fling you over gaps too wide to jump; a sideways squall guards the ledges
  L('Amazonis Dust Devils', 'wind', (b) => {
    b.start(-6, 0, 12);
    b.wind(5, -4, 19, 14, 8, { gust: true, P: 3.6, on: 1.8 });
    b.cells(9, 3, 21, 3, 5);
    b.block(24, 0, 5);
    b.thin(33, 1.5, 2.5); b.thin(39, 2.5, 2.5); b.thin(45, 1.5, 2.5);
    b.wind(31, 0, 17, 8, -7, { P: 4, on: 2 });                // headwind squall: cross in the calm
    b.thin(39, 6.2, 2.5); b.shard(40.2, 7.8);
    b.block(51, 2, 6);
    b.checkpoint(54, 2);
    b.wind(57, 0, 20, 12, 9, { gust: true, P: 3.4, on: 1.7 });
    b.cells(60, 5, 73, 5, 5);
    b.shard(66, 8.5);
    b.block(76, 3, 3);
    b.wind(79, 1, 19, 12, 9, { gust: true, P: 3.4, on: 1.7, off: 1.2 });
    b.cells(82, 6, 95, 6, 5);
    b.block(98, 4, 3);
    b.plat(105, 4, 8);
    b.goal(110, 4);
    b.plat(-14, -1.5, 3); b.shard(-12.5, 0.5);
  }),

  // 126 ── a meteor shower rakes the open plain: dash between rock shelters in the gaps between impacts
  L('Arcadia Impact', 'gauntlet', (b) => {
    b.start(-6, 0, 12);
    b.plat(6, 0, 24);
    b.rect(15, 3.2, 6, 0.8);                                  // shelter
    b.meteor(11, 0, { P: 2.4 }); b.meteor(25, 0, { P: 2.4, off: 1.2 }); b.meteor(18, 4, { P: 2.6, off: 0.6 });
    b.shard(18, 6.4);                                         // on the roof, where the rocks land
    b.cells(8, 1, 28, 1, 6);
    b.pool(30, 0, 4);
    b.shard(32, 1.4);
    b.plat(34, 0, 22);
    b.rect(40, 3.2, 5, 0.8);
    b.meteor(37, 0, { P: 2.2, off: 0.4 }); b.meteor(48, 0, { P: 2.2, off: 1.5 });
    b.checkpoint(42, 0);
    b.rect(51, 0, 2, 5);                                      // spire
    b.shard(52, 7.6);
    b.pool(56, 0, 5);
    b.plat(61, 0, 8);
    b.rect(63, 3.2, 4, 0.8);
    b.meteor(61.5, 0, { P: 2, off: 0.8 }); b.meteor(68, 0, { P: 2, off: 1.8 });
    b.cells(36, 1, 66, 1, 8);
    b.block(73, 2, 4); b.meteor(75, 2, { P: 2.3 });
    b.block(81, 4, 4); b.meteor(83, 4, { P: 2.3, off: 1.1 });
    b.block(89, 2.5, 3);
    b.arc(77, 2, 89, 2.5, 4, 3);
    b.plat(96, 2, 10);
    b.goal(102, 2);
  }),

  // 127 ── a research station: every module's door is a red/blue block, find the button that opens the way on
  L('Ares Station', 'puzzle', (b) => {
    b.start(-6, 0, 12);
    b.plat(6, 0, 16); b.plat(22, 0, 23);                      // module floors
    b.rect(6, 6.5, 30, 0.8); b.rect(40, 6.5, 6, 0.8);         // roof, with a hatch at 36..40
    b.rect(45, 0, 1, 6.5);
    // module 1: the button opens the airlock and lights a storage shelf
    b.switch(14, 0);
    b.blue(16, 3.5, 3); b.shard(17.5, 5.4);
    b.redWall(22, 0, 6.5);
    // module 2: press again for the red step under the hatch
    b.switch(26, 0);
    b.red(36, 3, 4);
    b.cells(8, 1, 20, 1, 4); b.cells(24, 1, 34, 1, 4);
    // the roof: antenna, and a button for the skybridge
    b.thin(10, 11.4, 2); b.shard(11, 13);
    b.switch(42.5, 7.3);
    b.blue(49, 7.3, 4); b.blue(57, 7.3, 4);
    b.plat(65, 7.3, 12);
    b.checkpoint(70, 7.3);
    // the lab: two button islands flip the stepping blocks
    b.blue(81, 6, 3); b.blue(88, 5, 3);
    b.plat(95, 5, 3); b.switch(95.8, 5);
    b.red(102, 4, 3); b.red(109, 4.5, 3);
    b.shard(107, 2.4);                                        // dip below the blocks for it
    b.plat(116, 5, 3); b.switch(116.8, 5);
    b.blue(123, 6, 3); b.blue(130, 6.5, 3);
    b.cells(82, 7.5, 131, 8, 10);
    b.plat(137, 7, 8);
    b.goal(142, 7);
  }),

  // 128 ── a lava tube: the low ceiling clips your floaty jumps, magma drips from above; then up a skylight
  L('Arsia Lava Tube', 'cave', (b) => {
    b.start(-6, 0, 12);
    b.rect(-10, 4.2, 60, 2);                                  // tube ceiling
    b.pool(6, 0, 4); b.plat(10, 0, 5); b.pool(15, 0, 5); b.plat(20, 0, 4); b.pool(24, 0, 6); b.plat(30, 0, 6);
    b.meteor(12.5, 0, { style: 'drip', h: 4.1, P: 2.2 });
    b.meteor(22, 0, { style: 'drip', h: 4.1, P: 2.2, off: 1.1 });
    b.meteor(33, 0, { style: 'drip', h: 4.1, P: 2, off: 0.5 });
    b.cells(11, 1, 34, 1, 6);
    // the crawl: walk-only, drips on a beat
    b.plat(36, 0, 14); b.rect(36, 2.2, 14, 2);
    b.meteor(40, 0, { style: 'drip', h: 2.1, P: 1.8 });
    b.meteor(45, 0, { style: 'drip', h: 2.1, P: 1.8, off: 0.9 });
    b.shard(45, 0.9);
    b.cells(38, 1, 48, 1, 4);
    // the skylight chamber
    b.plat(50, 0, 16);
    b.checkpoint(53, 0);
    b.crumble(59, 3, 2.4); b.crumble(53, 6, 2.4); b.crumble(59, 9, 2.4);
    b.shard(30, 7.6);                                         // on top of the tube, back over the crawl
    b.cells(60, 4.5, 60, 10.5, 3);
    // the upper tube
    b.rect(62, 16.2, 48, 2);
    b.block(66, 12, 10); b.pool(76, 12, 5); b.block(81, 12, 8); b.pool(89, 12, 6); b.block(95, 12, 12);
    b.enemy('walker', 82, 12, { range: 5 });
    b.meteor(85, 12, { style: 'drip', h: 4.1, P: 2.4 });
    b.shard(92, 14.6);
    b.cells(68, 13, 104, 13, 8);
    b.goal(103, 12);
  }),

  // 129 ── a relay of three rover canyons, each faster than the last; the final one runs a turret crossfire
  L('Coprates Relay', 'ride', (b) => {
    b.start(-6, 2, 12);
    b.stream('rover', 4, 36, -1.35, { speed: 2.5, spacing: 10 });   // deck 0.65
    b.thin(18, 5.6, 2.5); b.shard(19.2, 7);
    b.cells(10, 1.8, 32, 1.8, 5);
    b.block(36, 1.4, 5);
    b.stream('rover', 41, 75, -1.95, { speed: 4, spacing: 12 });    // deck 0.05
    b.shard(58, 4.8);
    b.cells(46, 1.2, 70, 1.2, 5);
    b.block(75, 0.8, 5);
    b.checkpoint(77, 0.8);
    b.turret(80, 0.3, 1, { P: 2.6, speed: 8 });                     // fires along the lane from behind
    b.stream('rover', 80, 118, -2.55, { speed: 5.5, spacing: 14 }); // deck -0.55
    b.cells(85, 0.6, 113, 0.6, 6);
    b.plat(118, 0.2, 4);
    b.rect(126, -4, 2, 9); b.turret(126, 0.3, -1, { P: 2.4, off: 1.2 });   // ...and from the front
    b.plat(131, 3, 8);
    b.goal(136, 3);
    b.plat(-13, 5, 3); b.shard(-11.5, 7);
  }),

  // 130 ── the first Dust Storm: sprint over dunes and crumbling ledges, spring up a mesa, then a long floaty descent
  L('Chryse Dust Storm', 'chase', (b) => {
    b.chase({ speed: 4 });
    b.start(-6, 0, 14);
    b.thin(-2, 5.5, 3); b.shard(-0.5, 7);
    b.block(13, 1, 5);
    b.crumble(22, 2.5, 3); b.crumble(28.5, 3.5, 3);
    b.block(35, 3, 5);
    b.pool(40, 3, 6);
    b.block(46, 3, 4);
    b.spring(47.5, 3, 7);
    b.block(53, 10, 6);
    b.checkpoint(56, 10);
    b.thin(55, 14.5, 3); b.shard(56.5, 16);
    b.plat(65, 8, 4); b.crumble(73, 6, 3); b.plat(80, 4, 4);
    b.shard(76.5, 3.2);
    b.enemy('flyer', 85, 6.5, { ax: 1.5, ay: 1, T: 2.6 });
    b.crumble(88, 2.5, 3); b.block(95, 1, 5);
    b.pool(100, 1, 5); b.block(105, 1, 4);
    b.block(113, 2, 4);
    b.plat(121, 3, 10);
    b.goal(127, 3);
    b.arc(8, 0, 22, 2.5, 4, 2.5); b.cells(48.4, 6, 48.4, 10, 3); b.cells(60, 10, 104, 2, 10);
  }),

  // 131 ── up the volcano's terraced flank: lava channels, flaring crust bridges and a crane lift to the upper slopes
  L('Olympus Foothills', 'ascent', (b) => {
    b.start(-6, 0, 12);
    b.block(9, 2, 6);
    b.heat(15, 2, 4, { P: 3, on: 1 });                       // cooling crust: cross while it's dark
    b.block(19, 2, 5);
    b.block(28, 5, 5);
    b.pool(33, 5, 5); b.shard(35.5, 6.6);
    b.block(38, 5, 4);
    b.block(46, 8.5, 5);
    b.heat(51, 8.5, 3, { P: 2.6, on: 1 }); b.heat(54, 8.5, 3, { P: 2.6, on: 1, off: 1.3 });
    b.shard(17, 5.8);                                        // hanging over the flaring crust
    b.block(57, 8.5, 5);
    b.checkpoint(59, 8.5);
    b.lift(65, 8.5, 15, { T: 5 });
    b.thin(59.5, 18.5, 2); b.shard(60.5, 20);
    b.block(69, 15, 5);
    b.pool(74, 15, 6);
    b.block(80, 15, 4);
    b.block(88, 19, 4); b.meteor(90, 19, { P: 2.4 });
    b.block(96, 22, 4); b.meteor(98, 22, { P: 2.4, off: 1.2 });
    b.plat(104, 24, 10);
    b.goal(110, 24);
    b.arc(6, 0, 28, 5, 8, 2); b.cells(39, 6.5, 46, 9.5, 3); b.cells(65, 10, 65, 15, 3); b.arc(84, 15, 104, 24, 6, 2.4);
  }),

  // 132 ── rover-arm cranes swing pads across a lava lake in L and U paths; change cranes in mid-air
  L('Utopia Crane Yard', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.loop([[9, 0], [9, 6], [24, 6]], { speed: 3, loop: false, w: 3 });
    b.shard(16, 10.5);                                       // leap off the arm at the top
    b.plat(28, 6, 4);
    b.plat(29, 2, 2); b.shard(30, 3.4);                      // a nook under the landing
    b.loop([[36, 6], [48, 6], [48, 1], [58, 1]], { speed: 3.2, loop: false, w: 3 });
    b.plat(62, 1, 6);
    b.checkpoint(65, 1);
    b.loop([[72, 1], [72, 9], [86, 9]], { speed: 3, loop: false, w: 2.8 });
    b.slide(92, 9, 100, 12, { T: 4.4, w: 2.8 });
    b.shard(79, 13.2);
    b.plat(104, 12, 8);
    b.goal(109, 12);
    b.cells(9, 2, 9, 5, 2); b.cells(12, 7.5, 22, 7.5, 4); b.cells(38, 7.5, 47, 7.5, 3); b.cells(50, 2.5, 56, 2.5, 3);
    b.cells(72, 3, 72, 8, 3); b.cells(75, 10.5, 85, 10.5, 4);
  }),

  // 133 ── a swarm of survey drones guards a slalom up and down the canyon; slip between their orbits
  L('Nirgal Drones', 'enemies', (b) => {
    b.start(-6, 0, 12);
    b.thin(9, 3, 3); b.enemy('flyer', 13.5, 5, { ax: 0.5, ay: 2, T: 2.4 });
    b.thin(16, 6, 3);
    b.thin(23, 9, 3); b.enemy('flyer', 21, 10.5, { ax: 2, ay: 0.5, T: 2.6 });
    b.rect(28, 12, 8, 1); b.shard(32, 14.6);                 // on top of the rock fin
    b.thin(30, 6, 3); b.enemy('flyer', 33, 8.5, { ax: 1.5, ay: 1, T: 2.2 });
    b.thin(37, 3, 3);
    b.plat(40.5, -2, 2); b.shard(41.5, -0.5);
    b.plat(43, 1, 6);
    b.checkpoint(46, 1);
    // drone gates: each gap has a drone sweeping up and down
    const steps = [[54, 3], [62, 5], [70, 3], [78, 5]];
    steps.forEach(([x, y], i) => { b.plat(x, y, 3); b.enemy('flyer', x - 2.5, 4.5, { ax: 0.3, ay: 3, T: 2.2 + i * 0.3 }); });
    b.thin(78, 9.5, 2); b.shard(79, 11);
    b.plat(86, 3, 10);
    b.goal(92, 3);
    b.cells(10, 4.5, 24, 10.5, 5); b.cells(31, 7.5, 38, 4.5, 3); b.cells(50, 4, 84, 4, 8);
  }),

  // 134 ── storm a walled outpost: climb its face between bolt volleys, find the gate switch, then a turret shaft
  L('Outpost Kasei', 'gauntlet', (b) => {
    b.start(-6, 0, 12);
    b.thin(-14, 4, 3); b.shard(-12.5, 5.6);
    b.plat(6, 0, 24);
    b.rect(30, 0, 4, 10);                                    // the outer wall
    b.turret(30, 0.8, -1, { P: 2.4 }); b.turret(30, 7.2, -1, { P: 2.4, off: 1.2 });
    b.thin(26, 3.2, 3); b.thin(21, 6.4, 3);
    // the courtyard
    b.plat(34, 0, 20);
    b.rect(39, 0, 3, 4); b.turret(42, 0.8, 1, { P: 2.2 });
    b.shard(36, 1.2);
    b.switch(48, 0);
    b.redWall(54, 0, 3, 4); b.rect(54, 3, 4, 7);             // the gate
    b.plat(58, 0, 14);
    b.checkpoint(62, 0);
    // the turret shaft
    b.rect(70, 2.4, 2, 16);
    b.plat(72, 0, 20);
    b.rect(92, 0, 2, 14);
    b.plat(75, 3.5, 4); b.plat(84, 7, 4); b.plat(75, 10.5, 4); b.plat(84, 14, 4);
    b.turret(72, 4.3, 1, { P: 2.6 }); b.turret(72, 11.3, 1, { P: 2.6, off: 1.3 }); b.turret(92, 7.8, -1, { P: 2.4, off: 0.6 });
    b.shard(80, 17);
    b.plat(98, 12, 8);
    b.goal(103, 12);
    b.cells(8, 1, 24, 1, 5); b.cells(22, 7.8, 32, 11, 3); b.cells(44, 1, 52, 1, 3); b.cells(77, 5, 86, 15.5, 5);
  }),

  // 135 ── climb out of the great canyon: offset wall-jump chimneys, crumbling ledges and a crane to the rim
  L('Marineris Chimneys', 'ascent', (b) => {
    b.start(-6, 0, 20);
    b.tower(6, 0, 20, 42);
    b.wall(10, 2.2, 10); b.wall(13.6, 0, 12);                // chimney 1
    b.cells(12.2, 3, 12.2, 10, 3);
    b.plat(6.5, 13, 2.5); b.shard(7.7, 14.6);                // pocket left of the top
    b.plat(14.4, 12, 12.2);
    b.wall(23, 14.2, 11); b.wall(26.6, 12, 13);              // chimney 2
    b.cells(25.2, 15, 25.2, 23, 3);
    b.plat(27.4, 25, 4);
    b.checkpoint(29, 25);
    b.shard(20, 29);                                         // leap off the chimney top
    b.crumble(34.5, 28, 2.4); b.crumble(29, 31, 2.4);
    b.enemy('flyer', 33, 33.5, { ax: 2, ay: 1, T: 3 });
    b.thin(34, 34.5, 3);
    b.shard(35.5, 37);
    b.lift(40, 34.5, 42, { T: 5 });
    b.plat(44, 42, 10);
    b.goal(50, 42);
  }),

  // 136 ── a three-tier labyrinth: holes link the floors, the gate's switch hides at the far end of the top tier
  L('Noctis Labyrinthus', 'maze', (b) => {
    b.start(-6, 0, 12);
    b.rect(8, 2.4, 2, 14.1);                                 // entrance arch
    b.plat(6, 0, 24);                                        // tier 0
    b.rect(30, 0, 1, 4.6);
    b.enemy('walker', 12, 0, { range: 12 });
    b.rect(10, 4.6, 16, 0.9); b.rect(30, 4.6, 20, 0.9);      // tier 1 (hole at 26..30)
    b.thin(26.5, 2.8, 3);
    b.shard(11, 7);
    b.enemy('spiker', 32, 5.5, { range: 8, speed: 2 });
    b.checkpoint(40, 5.5);
    b.plat(31, 0, 14); b.pool(45, 0, 6); b.plat(51, 0, 13);  // the lower right chamber
    b.shard(48, 1.6);
    b.thin(44.5, 8.3, 3);
    b.rect(14, 10.1, 30, 0.9); b.rect(48, 10.1, 18, 0.9);    // tier 2 (hole at 44..48)
    b.rect(14, 15.6, 52, 0.9);                               // roof
    b.switch(17, 11); b.shard(15, 13);
    b.redWall(58, 11, 4.6);
    b.rect(64, 0, 2, 10.1); b.rect(64, 13.5, 2, 2.1);        // the exit door
    b.plat(70, 9, 5); b.plat(79, 12, 4); b.plat(86, 9, 10);
    b.goal(92, 9);
    b.cells(12, 1, 28, 1, 5); b.cells(32, 6.5, 48, 6.5, 5); b.cells(20, 12, 40, 12, 5); b.cells(50, 12, 62, 12, 4);
  }),

  // 137 ── rising magma in a lava tube shaft: climb ledges, a chimney and a side niche before it catches you
  L('Pavonis Magma Tube', 'tide', (b) => {
    b.rise({ rate: 0.7, delay: 4 });
    b.start(-6, 0, 28);
    b.rect(4, 2.4, 2, 18.6); b.rect(4, 24.5, 2, 26);         // left tube wall (niche at 21..24.5)
    b.rect(22, -4, 2, 54);                                   // right tube wall
    b.plat(15, 3, 5); b.plat(8, 6, 5); b.crumble(15, 9, 3); b.thin(8, 12, 6);
    b.plat(15, 15, 7);
    b.checkpoint(16, 15);
    b.thin(7, 18.4, 3); b.shard(5, 22.6);                    // the niche
    b.wall(18.4, 17.2, 11);                                  // chimney against the right wall
    b.cells(20.6, 18, 20.6, 27, 3);
    b.shard(20.6, 30.5);
    b.plat(13, 28.5, 5);
    b.plat(8, 31.5, 4); b.plat(15, 34.5, 4); b.crumble(9, 37.5, 3);
    b.shard(11, 40.5);
    b.thin(14, 40.5, 6); b.plat(8, 43.5, 5);
    b.plat(10, 46.5, 10);
    b.goal(15, 46.5);
    b.cells(17, 4.5, 10, 13.5, 4); b.cells(10, 33, 17, 42, 4);
  }),

  // 138 ── one long canyon express: hop forward along the convoy to dodge meteors and a gusting headwind
  L('Ius Chasma Express', 'ride', (b) => {
    b.start(-6, 2, 12);
    b.stream('rover', 4, 56, -1.35, { speed: 4, spacing: 7.5 });     // deck 0.65
    [18, 28, 38, 48].forEach((x, i) => b.meteor(x, 0.65, { P: 2.2, off: i * 0.55 }));
    b.rect(40, 4.5, 6, 1); b.shard(43, 7);                   // on the rock arch over the lane
    b.cells(8, 2, 52, 2, 9);
    b.block(56, 1.4, 5);
    b.checkpoint(58, 1.4);
    b.stream('rover', 61, 112, -1.95, { speed: 4.5, spacing: 8 });   // deck 0.05
    b.wind(70, 0, 20, 6, -5, { P: 4, on: 2 });               // headwind blows you toward the convoy's tail
    b.enemy('flyer', 98, 3, { ax: 2.5, ay: 1, T: 2.6 });
    b.meteor(104, 0.05, { P: 2 });
    b.shard(95, 5);
    b.cells(64, 1.4, 108, 1.4, 9);
    b.plat(112, 0.8, 4);
    b.plat(119, 2.5, 8);
    b.goal(124, 2.5);
    b.plat(-12, 6.5, 3); b.shard(-10.5, 8.5);
  }),

  // 139 ── a solar farm: cleaning belts drag you, panels tilt away on a timer, a mast hides the best view
  L('Meridiani Array', 'timing', (b) => {
    b.start(-6, 0, 12);
    b.conveyor(8, 0, 12, -3);                                // belt against you, under a panel roof
    b.rect(10, 3.4, 8, 0.6);
    b.blink(23, 2.5, 3, { P: 3, on: 2 }); b.blink(29, 5, 3, { P: 3, on: 2, off: 1 }); b.blink(23, 7.5, 3, { P: 3, on: 2, off: 2 });
    b.shard(14, 5.4);                                        // on the roof
    b.plat(30, 9.5, 6);
    b.checkpoint(33, 9.5);
    b.thin(33, 14.5, 2); b.shard(34, 16);                    // the mast
    for (let i = 0; i < 5; i++) b.blink(40 + i * 6, 9 + (i % 2) * 1.5, 3, { P: 2.6, on: 1.6, off: -i * 0.5 });
    b.shard(52, 6.2);                                        // under the tilting row
    b.conveyor(70, 9, 8, 3);                                 // a belt that helps
    b.blink(82, 8, 3, { P: 2.4, on: 1.5 }); b.blink(88, 7, 3, { P: 2.4, on: 1.5, off: 1.2 });
    b.plat(94, 6, 8);
    b.goal(99, 6);
    b.cells(9, 1, 19, 1, 4); b.cells(24, 4, 30, 10, 3); b.cells(41, 11, 67, 11, 5); b.cells(71, 10, 90, 8.5, 5);
  }),

  // 140 ── the Great Dust Storm: plunge into a canyon, catch a fast rover across it, then scramble up the far wall
  L('Great Dust Storm', 'chase', (b) => {
    b.chase({ speed: 4.4 });
    b.start(-6, 6, 14);
    b.plat(-4, 10.5, 3); b.shard(-2.5, 12);
    b.block(13, 6, 4); b.crumble(21, 5, 3); b.block(28, 3, 4);
    b.plat(36, 0, 4);
    b.plat(44, 0, 6);
    b.stream('rover', 48, 76, -3.35, { speed: 6.5, spacing: 7 });   // deck -1.35
    b.shard(62, 2.6);
    b.plat(76, -0.6, 4);
    b.checkpoint(78, -0.6);
    b.block(84, 2, 3); b.block(89, 5, 3); b.spring(90, 5, 6);
    b.block(96, 12, 5);
    b.crumble(105, 11, 3); b.crumble(112, 10, 3);
    b.shard(113.5, 14);
    b.block(119, 9, 4); b.pool(123, 9, 5); b.block(128, 9, 3);
    b.plat(135, 8, 10);
    b.goal(141, 8);
    b.cells(14, 7.5, 38, 1.5, 6); b.cells(52, 0, 72, 0, 5); b.cells(90.9, 8, 90.9, 12, 3); b.cells(102, 13, 130, 10.5, 7);
  }),

  // 141 ── plunge into the deepest basin on Mars: a long one-way drop of ledges, a lift under a rock lid, lava at the bottom
  L('Hellas Plunge', 'descent', (b) => {
    b.start(-6, 40, 12);
    b.plat(-13, 43, 3); b.shard(-11.5, 45);
    b.plat(10, 36, 5);
    b.crumble(19, 32, 3);
    b.rect(24, 33, 12, 1); b.shard(33, 35.6);                // on top of the overhang
    b.plat(26, 28, 5);
    b.plat(36, 24, 4);
    b.heat(42, 21, 4, { P: 3, on: 1 });
    b.plat(48, 18, 6);
    b.checkpoint(51, 18);
    b.lift(58, 18, 8, { T: 5 });                             // ride it down under the lid
    b.rect(60, 11, 14, 2);
    b.plat(62, 8, 5);
    b.meteor(69, 5, { style: 'drip', h: 5.9, P: 2.2 });
    b.crumble(71, 5, 3); b.crumble(77, 2, 3);
    b.plat(83, -1, 5);
    b.pool(88, -1, 6); b.shard(91, 0.6);
    b.plat(94, -1, 10);
    b.goal(100, -1);
    b.cells(7, 39, 12, 37.5, 3); b.cells(20, 33.5, 28, 29.5, 3); b.cells(37, 25.5, 52, 19.5, 5); b.cells(58, 16, 58, 10, 3); b.cells(72, 6.5, 86, 0.5, 5);
  }),

  // 142 ── a strip mine: ride bucket-wheel excavators (rotating pad rings) linked by cleaning belts
  L('Aram Chaos Mine', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.conveyor(8, 0, 10, 3);
    b.ferris(26, 4, 6, { n: 5, omega: 0.55 });
    b.shard(26, 12.6);                                       // over the top of the first wheel
    b.plat(35, 6, 4);
    b.conveyor(42, 6, 12, -2.5);
    b.plat(46, 1.5, 4); b.shard(48, 3);                      // ore pocket under the belt
    b.ferris(62, 8, 7, { n: 6, omega: -0.45 });
    b.shard(62, 8);                                          // the hub of the big wheel
    b.plat(72, 10, 6);
    b.checkpoint(75, 10);
    b.conveyor(81, 10, 14, 3.5);
    b.rect(83, 19, 14, 1);
    b.beam('piston', 86, 10, { h: 9, P: 2.4, on: 0.8 }); b.beam('piston', 92, 10, { h: 9, P: 2.4, on: 0.8, off: 1.2 });
    b.ferris(104, 10, 5, { n: 4, omega: 0.7 });
    b.plat(112, 12, 8);
    b.goal(117, 12);
    b.cells(9, 1, 17, 1, 3); b.cells(43, 7.5, 53, 7.5, 4); b.cells(82, 11.5, 94, 11.5, 5);
  }),

  // 143 ── the polar cap: slick ice shelves, crevasses, and dry-ice geysers that blast you up the scarps
  L('Planum Boreum', 'ice', (b) => {
    b.start(-6, 0, 12);
    b.ice(8, 0, 12);
    b.shard(22.5, -0.6);                                     // dip into the first crevasse
    b.ice(25, 1.5, 8);
    b.plat(36, 0, 8);
    b.vent(40, 0, 12);
    b.rect(44, 0, 4, 10); b.ice(44, 11, 14);
    b.checkpoint(50, 11);
    b.plat(54, 5, 3); b.shard(55.5, 6.6);                    // a crevasse ledge under the shelf
    b.ice(62, 9, 4); b.ice(70, 7, 4);
    b.plat(77, 3, 6);
    b.vent(80, 3, 13);
    b.shard(80, 19.5);
    b.ice(84, 17, 10);
    b.enemy('walker', 86, 17, { range: 6 });
    b.ice(98, 15, 3);
    b.plat(105, 13, 8);
    b.goal(110, 13);
    b.cells(9, 1, 19, 1, 4); b.cells(40, 3, 40, 9, 3); b.cells(46, 12, 57, 12, 4); b.cells(63, 10.5, 82, 4.5, 5); b.cells(86, 18.5, 100, 16.5, 5);
  }),

  // 144 ── a crater in profile: tumble down the inner rim, ride up Mount Sharp in the middle, climb out the far side
  L('Gale Crater', 'classic', (b) => {
    b.start(-6, 14, 12);
    b.block(9, 11, 4); b.block(16, 8, 4); b.block(23, 5, 4);
    b.block(30, 2, 5);
    b.pool(35, 2, 5); b.shard(37.5, 3.6);
    b.block(40, 2, 4);
    b.meteor(32, 2, { P: 2.4 }); b.meteor(42, 2, { P: 2.4, off: 1.2 });
    b.block(47, 6, 4); b.block(54, 10, 3);
    b.lift(60, 10, 20, { T: 6 });
    b.block(64, 22, 5);
    b.checkpoint(66, 22);
    b.thin(65, 26.5, 2); b.shard(66, 28);                    // Mount Sharp's summit cairn
    b.block(72, 17, 3); b.block(78, 12, 3); b.block(84, 7, 3);
    b.block(90, 2, 5);
    b.pool(95, 2, 5);
    b.block(100, 2, 4);
    b.meteor(92, 2, { P: 2.2, off: 0.6 });
    b.crumble(107, 5.5, 2.5); b.crumble(112, 9, 2.5);
    b.shard(110, 12.5);
    b.plat(117, 14, 10);
    b.goal(123, 14);
    b.cells(8, 13, 32, 3.5, 6); b.cells(48, 7.5, 55, 11.5, 3); b.cells(60, 12, 60, 18, 3); b.cells(70, 20, 92, 3.5, 6);
  }),

  // 145 ── toll gates hang over the rover canyon: hop off at each mesa to flip the switch, or the gate sweeps you off
  L('Kasei Toll Gates', 'puzzle', (b) => {
    b.start(-6, 2, 12);
    b.thin(-12, 5.5, 3); b.shard(-10.5, 7);
    b.stream('rover', 4, 40, -1.35, { speed: 3.5, spacing: 11 });   // deck 0.65
    b.blueWall(22, 1.65, 10);                                // a ghost gate: blue is open for now
    b.shard(30, 5);
    b.block(40, 1.4, 5); b.switch(42.5, 1.4);
    b.checkpoint(40.8, 1.4);
    b.stream('rover', 45, 80, -1.95, { speed: 4, spacing: 12 });    // deck 0.05
    b.redWall(62, 1.05, 10);                                 // closed until you flipped the switch
    b.block(80, 0.8, 5); b.switch(82, 0.8);
    b.stream('rover', 85, 122, -2.55, { speed: 4.5, spacing: 13 }); // deck -0.55
    b.blueWall(108, 0.45, 10);
    b.plat(95, 3, 3); b.switch(95.8, 3); b.shard(96.5, 5);  // greedy: the shard sits on a switch
    b.plat(122, 0.3, 4);
    b.plat(129, 2, 8);
    b.goal(134, 2);
    b.cells(8, 2, 36, 2, 6); b.cells(48, 1.4, 76, 1.4, 6); b.cells(88, 0.8, 118, 0.8, 7);
  }),

  // 146 ── an electrified storm: lightning marches across the mesas in sequence, then strikes a rod you can climb
  L('Static Storm', 'timing', (b) => {
    b.start(-6, 0, 12);
    b.plat(-14, 3, 3); b.shard(-12.5, 5);
    for (let i = 0; i < 6; i++) {
      b.block(9 + i * 7, (i % 3) * 1.5, 4);
      b.beam('lightning', 11 + i * 7, (i % 3) * 1.5, { P: 3, on: 0.8, off: i * 0.5 });
    }
    b.shard(20.5, -1.2);
    b.plat(52, 2, 6);
    b.checkpoint(55, 2);
    b.plat(62, 2, 30);
    b.thin(62, 6, 3);
    b.rect(66, 2, 1, 8); b.beam('lightning', 66.5, 10, { P: 2.5, on: 0.7 });   // the lightning rod
    b.shard(66.5, 12);
    [70, 76, 82, 88].forEach((x, i) => b.beam('lightning', x, 2, { P: 2.6, on: 0.8, off: (3 - i) * 0.5 }));
    b.wind(68, 2, 24, 6, -6, { P: 3.6, on: 1.4, off: 1 });
    b.plat(98, 4, 8);
    b.goal(103, 4);
    b.cells(10, 2, 46, 5, 8); b.cells(64, 3.5, 90, 3.5, 7);
  }),

  // 147 ── an underground drill rig: piston hammers stamp the conveyor belts to a beat; then up the shaft to the rig deck
  L('Medusae Drill Site', 'gauntlet', (b) => {
    b.start(-6, 0, 12);
    b.rect(-8, 8, 78, 1);                                    // the mine roof
    b.plat(6, -3, 10); b.shard(14, -2);                      // a pocket under the belt
    b.conveyor(9.5, 0, 20.5, 2.5);
    [14, 20.5, 27].forEach((x, i) => b.beam('piston', x, 0, { h: 8, P: 2.4, on: 0.8, off: i * 0.8 }));
    b.plat(34, 1.5, 5);
    b.heat(39, 1.5, 3, { P: 2.8, on: 1 });
    b.conveyor(42, 1.5, 20, -2.5);
    [47, 53, 59].forEach((x, i) => b.beam('piston', x, 1.5, { h: 6.5, P: 2.2, on: 0.7, off: (2 - i) * 0.7 }));
    b.plat(64, 1.5, 8);
    b.checkpoint(67, 1.5);
    b.lift(76, 1.5, 12, { T: 4.5 });
    b.shard(60, 10.6);                                       // walk back along the roof
    b.plat(80, 12, 5);
    b.conveyor(88, 12, 14, 3);
    b.rect(90, 20, 10, 1);
    b.beam('piston', 93, 12, { h: 8, P: 2.4, on: 0.8 }); b.shard(95.5, 13.4); b.beam('piston', 98, 12, { h: 8, P: 2.4, on: 0.8, off: 1.2 });
    b.plat(105, 13, 8);
    b.goal(110, 13);
    b.cells(9, 1, 29, 1, 6); b.cells(43, 2.5, 61, 2.5, 6); b.cells(76, 4, 76, 10, 3); b.cells(89, 13, 101, 13, 5);
  }),

  // 148 ── the canyon is collapsing: a crumbling cascade under meteors, a chimney with crumbling exits, a squall, a sniper
  L('Candor Collapse', 'precision', (b) => {
    b.start(-6, 8, 12);
    b.crumble(10, 6, 2); b.crumble(15, 4, 2); b.crumble(20, 2, 2); b.crumble(25, 0, 2);
    b.meteor(16, 4, { P: 2.2 }); b.meteor(26, 0, { P: 2.2, off: 1.1 });
    b.shard(17.5, 1.4);                                      // under the cascade
    b.plat(30, -2, 9.6);
    b.wall(36, 0.2, 11.8); b.rect(39.6, -2, 3, 14);          // the chimney
    b.cells(38.2, 1, 38.2, 10, 4);
    b.shard(38.2, 15.4);
    b.crumble(46, 13, 2); b.crumble(51, 14.5, 2);
    b.wind(44, 12, 13, 6, -6, { P: 3.6, on: 1.6 });
    b.plat(57, 15, 5);
    b.checkpoint(59, 15);
    b.crumble(65, 14, 2); b.crumble(70, 12.5, 2);
    b.enemy('flyer', 73, 15.5, { ax: 1.5, ay: 1.2, T: 2.4 });
    b.crumble(75, 14, 2); b.crumble(80, 15.5, 2);
    b.shard(80.9, 19.6);
    b.crumble(86, 14, 2);
    b.rect(92, 8, 2, 6); b.turret(92, 16.6, -1, { P: 2.2 }); b.turret(92, 14.8, -1, { P: 2.2, off: 1.1 });
    b.plat(98, 12, 8);
    b.goal(103, 12);
    b.cells(11, 7.5, 26, 1.5, 4); b.cells(47, 14.5, 52, 16, 2); b.cells(66, 15.5, 87, 15.5, 5);
  }),

  // 149 ── overdrive: fast crane pads zip between magma geysers and meteor strikes; no room for hesitation
  L('Tharsis Overdrive', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.slide(11, 0, 25, 0, { T: 2.4, w: 2.6 });
    b.beam('steam', 18, -3, { P: 2.4, on: 0.7 });
    b.shard(18, 4.4);                                        // right over the geyser
    b.plat(29, 1, 3);
    b.loop([[36, 1], [44, 6], [52, 1]], { speed: 4.5, loop: false, w: 2.4 });
    b.meteor(44, 6, { P: 2.6 });
    b.thin(43, 10, 2); b.shard(44, 11.6);
    b.plat(56, 1, 5);
    b.checkpoint(58, 1);
    b.slide(65, 1, 65, 9, { T: 2.2, w: 2.4 });
    b.slide(71, 9, 83, 9, { T: 2.4, w: 2.4 });
    b.beam('steam', 77, 3.5, { P: 2.2, on: 0.7, off: 1 });
    b.plat(87, 9, 3);
    b.slide(94, 9, 106, 3, { T: 2, w: 2.4 });
    b.shard(100, 9.4);
    b.meteor(103, 4.5, { P: 2.2, off: 0.8 });
    b.plat(110, 3, 8);
    b.goal(115, 3);
    b.cells(12, 1.5, 24, 1.5, 4); b.cells(38, 3, 50, 3, 4); b.cells(65, 3, 65, 8, 3); b.cells(72, 10.5, 82, 10.5, 4); b.cells(95, 9, 105, 4.5, 4);
  }),

  // 150 ── FINALE: a rover canyon, a research base gate, a chimney up Olympus Mons, and the Dust Storm down from the summit
  L('Olympus Mons', 'finale', (b) => {
    b.start(-6, 2, 12);
    b.stream('rover', 4, 40, -1.35, { speed: 4, spacing: 10 });     // deck 0.65
    b.meteor(16, 0.65, { P: 2.4 }); b.meteor(30, 0.65, { P: 2.4, off: 1.2 });
    b.shard(23, 5.2);
    b.plat(40, 1.4, 5);
    // the base: flip the airlock, take the blue steps
    b.plat(46, 2, 14);
    b.rect(46, 7.5, 14, 0.8);
    b.switch(50, 2);
    b.blue(52.5, 4.6, 2.5); b.shard(53.7, 6.4);
    b.redWall(58, 2, 5.5);
    b.blue(63, 5, 3); b.blue(68, 7, 3);
    // the chimney up the volcano wall
    b.plat(72, 8, 7.8);
    b.wall(76.2, 10.2, 10); b.rect(79.8, 8, 3, 12);
    b.cells(78.4, 11, 78.4, 18, 3);
    b.plat(82.8, 20, 6);
    b.checkpoint(85, 20);
    // the summit and the storm
    b.chase({ speed: 4.6, trigger: 86, behind: 16 });
    b.crumble(92, 22, 2.5);
    b.plat(98, 24, 4);
    b.thin(99, 28.5, 2); b.shard(100, 30);
    b.crumble(106, 21, 2.5);
    b.plat(112, 18, 4);
    b.pool(116, 18, 4);
    b.plat(120, 18, 4);
    b.crumble(127, 15, 2.5);
    b.plat(133, 11, 12);
    b.goal(141, 11);
    b.cells(8, 2, 36, 2, 6); b.cells(47, 3, 57, 3, 4); b.cells(64, 6.5, 70, 8.5, 2); b.cells(93, 23.5, 130, 16.5, 9);
  }),
];
