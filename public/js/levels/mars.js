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
];
