// WORLD 1 — THE SUN. 30 hand-written levels.
// Units: single jump ≈ 2.4 high / 6 far, double jump ≈ 4.4 high / 10 far, run 8.5/s.
// Every level has its own idea; see the comment above each one.
import { L } from './dsl.js';

export default [
  // 1 ── teach run / jump / double jump over the plasma sea
  L('Sunrise Steps', 'intro', (b) => {
    b.start(-6, 0, 16);
    b.arc(10, 0, 14, 0, 3, 2);
    b.plat(14, 0, 6);
    b.plat(23, 1, 5);
    b.plat(31, 2, 5);
    b.cells(32, 3.4, 35, 3.4, 3);
    b.plat(39, 0, 7);
    b.checkpoint(42, 0);
    b.arc(46, 0, 55, 0, 4, 3.4);
    b.plat(55, 0, 6);
    b.plat(64, 3, 4);
    b.plat(71, 5, 4);
    b.shard(73, 9.5);
    b.plat(79, 2, 12);
    b.goal(87, 2);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.shard(50.5, 4.5);
  }),

  // 2 ── heat-shield pads that drift, rise and patrol
  L('Heat Shield Hop', 'classic', (b) => {
    b.start(-6, 0, 14);
    b.slide(13, 0, 21, 0, { T: 4, w: 3 });
    b.cells(13, 1.2, 21, 1.2, 4);
    b.plat(25, 0, 5);
    b.slide(33, 1, 33, 5, { T: 4.5, w: 3 });
    b.plat(37, 5, 6);
    b.checkpoint(40, 5);
    b.slide(47, 5, 59, 3, { T: 5, w: 3, phase: 0.3 });
    b.slide(63, 3, 63, 7, { T: 3.5, w: 2.6 });
    b.cells(63, 8.5, 63, 11, 3);
    b.shard(63, 12);
    b.plat(68, 6, 5);
    b.slide(76, 6, 88, 6, { T: 5, w: 3, phase: 0.5 });
    b.plat(92, 6, 10);
    b.goal(98, 6);
    b.plat(-15, 2, 3); b.shard(-13.5, 4);
    b.shard(82, 9.4);
  }),

  // 3 ── flares fire in a rolling sequence down a long walkway; read the rhythm
  L('Flare Alley', 'gauntlet', (b) => {
    b.start(-6, 0, 12);
    b.plat(9, 0, 36);
    for (let i = 0; i < 5; i++) b.beam('flare', 14 + i * 6.5, 0, { P: 3.2, on: 0.9, off: i * 0.55 });
    b.cells(13, 1, 41, 1, 8);
    b.thin(24, 3.6, 4); b.shard(26, 5.2);
    b.plat(49, 2, 6);
    b.checkpoint(52, 2);
    b.plat(59, 4, 30);
    for (let i = 0; i < 4; i++) b.beam('flare', 64 + i * 7, 4, { P: 2.6, on: 0.8, off: (3 - i) * 0.5 });
    b.cells(62, 5, 86, 5, 7);
    b.thin(64, 7.4, 3);
    b.rect(70, 8.5, 10, 0.8);
    b.shard(75, 10.5);
    b.plat(93, 4, 10);
    b.goal(99, 4);
    b.plat(-14, 1, 3); b.shard(-12.5, 3);
  }),

  // 4 ── two decks of sunspot tiles igniting in opposite waves: hop between decks
  L('Sunspot Checkers', 'puzzle', (b) => {
    b.start(-6, 0, 12);
    for (let i = 0; i < 8; i++) b.heat(8 + i * 3, 0, 3, { P: 3.6, on: 1.4, off: i * 0.45 });
    for (let i = 0; i < 8; i++) b.heat(8 + i * 3, 4.2, 3, { P: 3.6, on: 1.4, off: (7 - i) * 0.45 + 1.8, h: 0.6 });
    b.cells(9, 1, 30, 1, 6); b.cells(9, 5.2, 30, 5.2, 6);
    b.plat(32, 2, 6);
    b.checkpoint(35, 2);
    // the staircase: each step is a sunspot, ignite pattern climbs with you
    for (let i = 0; i < 6; i++) b.heat(41 + i * 4.5, 3 + i * 1.6, 3, { P: 3, on: 1, off: i * 0.5 });
    b.cells(42, 5, 64, 13, 5);
    b.plat(68, 12, 8);
    b.shard(72, 16.6);
    b.plat(80, 9, 4); b.plat(87, 6, 4);
    b.plat(94, 4, 10);
    b.goal(100, 4);
    b.plat(-15, 2, 3); b.shard(-13.5, 4);
    b.shard(20, 7.5);
  }),

  // 5 ── the Solar Wave arrives. No waiting, keep moving.
  L('Solar Wave', 'chase', (b) => {
    b.chase({ speed: 3.8 });
    b.start(-6, 0, 14);
    b.plat(12, 0, 5); b.plat(21, 1, 5); b.plat(30, 0, 4);
    b.crumble(37, 0, 3); b.crumble(43, 1, 3); b.crumble(49, 2, 3);
    b.plat(55, 2, 8);
    b.checkpoint(59, 2);
    b.spring(61, 2, 5);
    b.plat(66, 8, 6);
    b.plat(76, 5, 5); b.plat(85, 2, 5);
    b.crumble(93, 2, 2.5); b.crumble(98, 3, 2.5); b.crumble(103, 2, 2.5);
    b.plat(109, 2, 12);
    b.goal(117, 2);
    b.arc(12, 0, 30, 0, 6, 2); b.cells(66, 9, 71, 9, 4);
    b.shard(69, 12); b.shard(-12, 3.5); b.plat(-14, 1.5, 3); b.shard(98, 6.6);
  }),

  // 6 ── a scaffold tower: zig-zag ledges, a wall-jump chimney, then over the top
  L('Corona Spire', 'ascent', (b) => {
    b.start(-6, 0, 12);
    b.tower(8, -2, 14, 40);
    b.plat(9, 2.5, 4); b.plat(17, 5, 4); b.plat(9, 8, 4); b.plat(17, 11, 4);
    b.thin(12, 14, 6);
    b.plat(9, 17, 4); b.plat(17, 20, 4);
    b.checkpoint(19, 20);
    // chimney: two walls 3 apart, climb by wall-jumping
    b.wall(14, 21, 12); b.wall(17.8, 23.5, 9.5);
    b.cells(16.2, 24, 16.2, 31, 4);
    b.plat(9, 33, 4); b.cells(10, 34.5, 12, 34.5, 3);   // a ledge left of the chimney top
    b.plat(19.5, 33, 5);
    b.shard(16.2, 35.4);
    b.plat(28, 31, 5); b.plat(37, 27, 5); b.plat(46, 23, 10);
    b.goal(52, 23);
    b.shard(-12, 3.5); b.plat(-14, 1.5, 3);
    b.shard(13, 17); b.cells(10, 9, 21, 9, 4);
  }),

  // 7 ── sun-mites patrol the pads; stomp them for cells and a bounce
  L('Mite Patrol', 'enemies', (b) => {
    b.start(-6, 0, 12);
    b.plat(10, 0, 10); b.enemy('walker', 12, 0, { range: 6 });
    b.plat(24, 1, 8); b.enemy('walker', 25, 1, { range: 5, speed: 2 });
    b.thin(25, 5, 6); b.cells(25, 6, 30, 6, 4);
    b.plat(36, 0, 12); b.enemy('walker', 37, 0, { range: 9, speed: 2.4 }); b.enemy('walker', 44, 0, { range: 3 });
    b.checkpoint(46, 0);
    b.plat(52, 2, 4); b.plat(60, 4, 10); b.enemy('walker', 61, 4, { range: 7, speed: 2.6 });
    b.plat(74, 4, 4);
    b.rect(80, 0, 1, 7.2); b.plat(80, 7.2, 1);                  // pillar
    b.plat(84, 4, 14); b.enemy('walker', 85, 4, { range: 5 }); b.enemy('walker', 92, 4, { range: 4, speed: 2.2 });
    b.goal(95, 4);
    b.shard(80.5, 10.5); b.shard(28, 7.6); b.plat(-14, 2, 3); b.shard(-12.5, 4);
  }),

  // 8 ── crumbling chains over a fire field, branching to a high and low line
  L('Crumbling Corona', 'precision', (b) => {
    b.start(-6, 0, 12);
    for (let i = 0; i < 5; i++) b.crumble(9 + i * 5, (i % 2) * 1.2, 2.4);
    b.plat(35, 1, 5);
    b.checkpoint(37, 1);
    // high line (more cells) vs low line
    for (let i = 0; i < 4; i++) b.crumble(43 + i * 4.6, 4 + i * 0.6, 2);
    b.cells(44, 6, 58, 8, 6);
    for (let i = 0; i < 4; i++) b.crumble(44 + i * 5, 0, 2.4);
    b.plat(64, 4, 5);
    b.crumble(72, 5, 1.8); b.crumble(77, 6.5, 1.8); b.crumble(82, 5, 1.8);
    b.shard(77.9, 10.5);
    b.plat(88, 3, 10);
    b.goal(94, 3);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.shard(54, 9.4);
  }),

  // 9 ── plasma cannons sweep the walkways; jump the bolts or use the low ledges
  L('Plasma Cannons', 'gauntlet', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 26);
    b.rect(34, 0, 1.6, 4); b.turret(34.8, 0.8, -1, { P: 2.2 });
    b.cells(10, 1, 30, 1, 6);
    b.plat(38, 2, 6);
    b.checkpoint(41, 2);
    b.plat(48, 3, 24);
    b.rect(45.3, 0, 1.4, 3); b.turret(46, 3.8, 1, { P: 2.8 });            // squat pillar between the walkways
    b.rect(73.5, 0, 1.6, 6.5); b.turret(74.3, 3.8, -1, { P: 2.4, off: 1.2 }); // tall pillar: a stepping stone too
    b.thin(56, 6.8, 6); b.shard(59, 8.4);
    b.cells(50, 4, 70, 4, 6);
    b.plat(78, 5, 4); b.plat(85, 3, 10);
    b.goal(91, 3);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.shard(34.8, 7);
  }),

  // 10 ── ride a single shield pad along a prominence arc, flares licking the route
  L('Prominence Express', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.loop([[9, 0], [20, 6], [34, 10], [48, 6], [60, 0], [74, 4], [86, 4]], { speed: 3.2, loop: false, w: 3.2 });
    b.beam('flare', 27, 7, { P: 3.4, on: 0.9 });
    b.beam('flare', 54, 2, { P: 3.4, on: 0.9, off: 1.5 });
    b.cells(14, 4.5, 30, 10, 6); b.cells(40, 10, 58, 3, 6); b.cells(64, 3.5, 82, 5, 5);
    b.thin(31, 13.6, 6); b.shard(34, 15.2);
    b.plat(91, 4, 8);
    b.checkpoint(95, 4);
    b.loop([[102, 4], [102, 12], [114, 12], [114, 4]], { speed: 3, w: 3 });
    b.plat(119, 6, 8);
    b.shard(108, 15.5);
    b.goal(125, 6);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 11 ── floor buttons swap red and blue blocks: plan the order
  L('Red Giant, Blue Dwarf', 'puzzle', (b) => {
    b.start(-6, 0, 12);
    b.switch(4, 0);
    b.red(9, 0, 4); b.blue(15, 0, 4); b.red(21, 0, 4);
    b.plat(27, 0, 6); b.switch(29, 0);
    b.blue(36, 1, 4); b.red(42, 2, 4); b.blue(48, 3, 4);
    b.plat(54, 3, 6);
    b.checkpoint(57, 3);
    // a red wall blocks the hall; the button is past a blue bridge
    b.redWall(62, 3, 5); b.rect(60, 8, 12, 0.8);
    b.plat(60, 3, 14); b.switch(70, 3);
    b.blue(76, 3, 5); b.redWall(84, 3, 6); b.plat(82, 3, 6); b.switch(83, 3);
    b.plat(90, 3, 10);
    b.goal(96, 3);
    b.thin(56.5, 6.4, 3); b.shard(66, 9.8); b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.blue(36, 6, 3); b.shard(37.5, 8);
  }),

  // 12 ── platforms of solid light blink in a travelling wave
  L('Flicker Field', 'timing', (b) => {
    b.start(-6, 0, 12);
    for (let i = 0; i < 7; i++) b.blink(9 + i * 5, (i % 3) * 0.8, 3, { P: 3.5, on: 2.2, off: -i * 0.5 });
    b.plat(45, 1, 5);
    b.checkpoint(47, 1);
    // a vertical flicker ladder
    for (let i = 0; i < 6; i++) b.blink(52 + (i % 2) * 5, 3 + i * 2.6, 3, { P: 3, on: 1.9, off: -i * 0.45 });
    b.plat(62, 18, 6);
    b.shard(65, 21.5);
    for (let i = 0; i < 5; i++) b.blink(72 + i * 5, 16 - i * 2.4, 3, { P: 3, on: 1.8, off: -i * 0.4 });
    b.plat(98, 4, 10);
    b.goal(104, 4);
    b.cells(10, 2, 40, 2, 8);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.shard(29.5, 5);
  }),

  // 13 ── springs stitched into a three-tier pinball course
  L('Spring Corona', 'bounce', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 6); b.spring(11, 0, 6);
    b.plat(16, 7, 5); b.spring(18, 7, 5);
    b.plat(24, 13, 6);
    b.cells(12, 4, 12, 9, 3); b.cells(19, 11, 19, 16, 3);
    b.plat(33, 9, 4); b.plat(40, 5, 4);
    b.plat(47, 2, 8); b.spring(52, 2, 9);
    b.checkpoint(49, 2);
    b.rect(50, 17, 8, 0.8);                    // ceiling: spring launches past it at the edge
    b.plat(57, 13, 5);
    b.thin(64, 17, 5); b.shard(66.5, 19);
    b.plat(68, 10, 4); b.spring(70, 10, 4);
    b.plat(76, 14, 4);
    b.plat(84, 8, 4); b.plat(91, 4, 10);
    b.goal(97, 4);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.shard(27, 17);
  }),

  // 14 ── down into a sunspot: dark cave levels under hanging flares
  L('Into the Sunspot', 'descent', (b) => {
    b.start(-6, 20, 14);
    b.plat(12, 17, 6); b.rect(10, 24, 30, 1);
    b.plat(22, 13, 5); b.plat(31, 10, 5);
    b.beam('flare', 33.5, 10, { P: 3, on: 0.9, h: 14 });
    b.plat(40, 6, 8);
    b.checkpoint(44, 6);
    b.rect(38, 12, 24, 1);
    b.crumble(51, 3, 2.4); b.crumble(56, 0, 2.4);
    b.plat(61, -3, 8); b.enemy('walker', 62, -3, { range: 5 });
    b.beam('flare', 66, -3, { P: 2.6, on: 0.8, h: 15, off: 1 });
    b.plat(73, -6, 4); b.plat(80, -9, 12);
    b.rect(74, -1, 20, 1);
    b.goal(88, -9);
    b.arc(14, 17, 42, 6, 8, 1);
    b.shard(23, 17.5); b.plat(-14, 22, 3); b.shard(-12.5, 24);
    b.shard(64, 1.5);
  }),

  // 15 ── the plasma rises; climb the coronal scaffold before it swallows you
  L('Rising Plasma', 'tide', (b) => {
    b.rise({ rate: 0.75, delay: 4 });
    b.start(-6, 0, 12);
    b.tower(6, -4, 18, 46);
    const steps = [[8, 3], [16, 6], [8, 9], [16, 12], [8, 15], [16, 18], [11, 21], [18, 24], [8, 27], [16, 30], [8, 33], [16, 36], [10, 39]];
    for (const [x, y] of steps) b.plat(x, y, 4);
    b.checkpoint(18, 18);
    b.cells(10, 5, 10, 35, 8);
    b.plat(22, 41, 4); b.plat(30, 41, 10);
    b.goal(36, 41);
    b.shard(19, 27.5); b.shard(12, 43.5);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 16 ── ember drones hover over every gap; slip past their arcs
  L('Ember Drones', 'enemies', (b) => {
    b.start(-6, 0, 12);
    b.plat(12, 0, 5); b.enemy('flyer', 10, 3, { ax: 1.5, ay: 1.5, T: 3 });
    b.plat(22, 1, 5); b.enemy('flyer', 20, 3.5, { ax: 0.5, ay: 2.5, T: 2.6 });
    b.plat(32, 2, 5); b.enemy('flyer', 30, 4, { ax: 1, ay: 1.2, T: 2.2 });
    b.plat(41, 2, 6);
    b.checkpoint(44, 2);
    b.plat(51, 4, 3); b.plat(58, 6, 3); b.plat(65, 4, 3);
    b.enemy('flyer', 56, 8, { ax: 4, ay: 0.6, T: 3.4 });
    b.enemy('flyer', 63, 7, { ax: 3, ay: 1, T: 2.8 });
    b.plat(72, 3, 12); b.enemy('flyer', 78, 5, { ax: 4, ay: 1, T: 2 });
    b.goal(81, 3);
    b.arc(17, 0, 22, 1, 2, 2); b.arc(27, 1, 32, 2, 2, 2);
    b.shard(59.5, 10.5); b.shard(37, 6.5);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 17 ── twin lifts in counter-phase: ride one up, cross to the other at the top
  L('Twin Suns', 'timing', (b) => {
    b.start(-6, 0, 12);
    b.lift(10, 0, 10, { T: 5 }); b.lift(16, 10, 0, { T: 5 });
    b.plat(20, 9, 5);
    b.lift(29, 9, 3, { T: 4 }); b.lift(35, 3, 15, { T: 4.4 });
    b.plat(39, 14, 6);
    b.checkpoint(42, 14);
    b.slide(49, 14, 49, 4, { T: 4.5 }); b.slide(55, 4, 55, 14, { T: 4.5 });
    b.slide(61, 14, 61, 4, { T: 4.5 }); b.slide(67, 4, 67, 14, { T: 4.5 });
    b.cells(49, 9, 67, 9, 4);
    b.plat(71, 10, 4); b.plat(78, 7, 10);
    b.goal(84, 7);
    b.shard(58, 18); b.shard(22.5, 13);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 18 ── magnetic loops: two huge rings of pads turning in opposite directions
  L('Magnetic Loops', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.ferris(16, 2, 6, { n: 6, omega: 0.55 });
    b.plat(26, 4, 5);
    b.checkpoint(28, 4);
    b.ferris(42, 5, 8, { n: 8, omega: -0.45 });
    b.plat(54, 8, 5);
    b.ferris(66, 10, 5, { n: 4, omega: 0.8 });
    b.plat(75, 10, 10);
    b.goal(81, 10);
    b.cells(16, 9.5, 16, 9.5, 1); b.cells(42, 14.5, 42, 14.5, 1);
    b.shard(42, 5); b.shard(66, 17);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 19 ── solar wind gusts: they fling you across gaps too wide to jump
  L('Solar Wind', 'wind', (b) => {
    b.start(-6, 0, 12);
    b.wind(6, -6, 18, 16, 9, { gust: true, P: 3.6, on: 1.8 });
    b.plat(20, 0, 6);
    b.wind(26, -6, 20, 16, 10, { gust: true, P: 3.2, on: 1.6, off: 1 });
    b.plat(42, 1, 6);
    b.checkpoint(45, 1);
    b.plat(52, 3, 3); b.wind(50, 3, 12, 10, -6, { P: 4, on: 2 });   // headwind: wait for calm
    b.plat(60, 5, 3);
    b.wind(63, -2, 22, 16, 10, { gust: true, P: 3, on: 1.5 });
    b.plat(81, 5, 10);
    b.goal(87, 5);
    b.cells(10, 4, 18, 4, 4); b.cells(30, 5, 40, 5, 5); b.cells(66, 8, 78, 8, 5);
    b.shard(31, 5.5); b.shard(72, 9.5);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 20 ── a longer chase over springs, crumbles and drops
  L('Chromosphere Run', 'chase', (b) => {
    b.chase({ speed: 4.4 });
    b.start(-6, 0, 14);
    b.plat(12, 2, 5); b.plat(21, 4, 5); b.spring(24, 4, 6);
    b.plat(30, 11, 5); b.plat(39, 7, 4); b.plat(47, 3, 4);
    b.crumble(54, 3, 2.4); b.crumble(59, 4, 2.4); b.crumble(64, 5, 2.4);
    b.plat(70, 5, 6);
    b.checkpoint(73, 5);
    b.plat(81, 1, 4); b.plat(89, -3, 4); b.spring(91, -3, 7);
    b.plat(96, 6, 5); b.crumble(104, 6, 2.2); b.crumble(109, 7, 2.2);
    b.plat(115, 7, 12);
    b.goal(123, 7);
    b.arc(26, 4, 30, 11, 3, 2); b.cells(82, 2, 90, -2, 4);
    b.shard(32.5, 15); b.shard(110, 10.5);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 21 ── a cave maze threaded with ceilings, a low tunnel and a switch gate
  L('Coronal Maze', 'maze', (b) => {
    b.start(-6, 0, 12);
    b.plat(6, 0, 40);
    b.rect(10, 2.4, 14, 1);          // low tunnel roof
    b.rect(10, 7, 30, 1);            // upper roof
    b.thin(26, 3.6, 5);
    b.wall(32, 0, 4.2); b.thin(30, 4.6, 5);
    b.enemy('walker', 12, 0, { range: 9 });
    b.switch(42, 0);
    b.redWall(46, 0, 7);
    b.plat(46, 0, 8);
    b.checkpoint(50, 0);
    b.blue(56, 2, 4); b.blue(62, 4, 4);
    b.plat(68, 4, 10); b.rect(68, 9, 10, 1);
    b.enemy('spiker', 70, 4, { range: 5 });
    b.plat(82, 6, 10);
    b.goal(88, 6);
    b.cells(12, 1, 22, 1, 5); b.cells(27, 4.6, 34, 5.6, 4);
    b.shard(17, 8.6); b.shard(73, 10.6);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 22 ── everything ticks to one beat: flares, blinkers and heat tiles in sync
  L('Flare Metronome', 'timing', (b) => {
    b.start(-6, 0, 12);
    const P = 2;
    for (let i = 0; i < 6; i++) {
      b.plat(8 + i * 7, 0, 4);
      b.beam('flare', 10 + i * 7, 0, { P, on: 0.7, off: (i % 2) * 1 });
      b.blink(12.5 + i * 7, 1, 2, { P, on: 1.2, off: (i % 2) ? 0 : 1 });
    }
    b.plat(52, 1, 6);
    b.checkpoint(55, 1);
    for (let i = 0; i < 6; i++) b.heat(60 + i * 3, 1, 3, { P, on: 0.8, off: i % 2 });
    b.plat(78, 2, 4);
    for (let i = 0; i < 4; i++) b.blink(84 + i * 4.5, 3 + i, 2.4, { P, on: 1.3, off: i * 0.5 });
    b.plat(103, 6, 10);
    b.goal(109, 6);
    b.cells(9, 2.5, 46, 2.5, 8);
    b.shard(66, 5); b.shard(98, 9);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 23 ── solar urchins (unstompable!) roll along every walkway
  L('Urchin Garden', 'enemies', (b) => {
    b.start(-6, 0, 12);
    b.plat(9, 0, 18); b.enemy('spiker', 10, 0, { range: 15, speed: 3 });
    b.thin(12, 4, 12);
    b.plat(31, 2, 14); b.enemy('spiker', 32, 2, { range: 11, speed: 2.2 }); b.enemy('spiker', 38, 2, { range: 6, speed: 1.6 });
    b.checkpoint(42, 2);
    b.plat(49, 4, 22); b.enemy('spiker', 50, 4, { range: 19, speed: 3.6 });
    b.thin(54, 7.6, 4); b.thin(62, 7.6, 4);
    b.plat(75, 4, 10);
    b.goal(81, 4);
    b.cells(13, 5, 23, 5, 5); b.cells(55, 8.6, 65, 8.6, 6);
    b.shard(18, 8); b.shard(64, 11.4);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 24 ── a highwire of thin ledges above the corona, with gusts to ride
  L('Heliopause Highwire', 'precision', (b) => {
    b.start(-6, 0, 12);
    b.plat(9, 3, 2.5); b.plat(15, 6, 2); b.plat(21, 9, 2); b.plat(27, 12, 2);
    b.thin(33, 12, 3); b.thin(40, 13, 2); b.thin(46, 12, 2); b.thin(52, 13, 2);
    b.plat(58, 13, 4);
    b.checkpoint(60, 13);
    b.wind(60, 8, 20, 14, 9, { gust: true, P: 3.4, on: 1.7 });
    b.thin(77, 14, 4);
    b.thin(87, 12, 2); b.thin(93, 10, 2); b.thin(99, 8, 2);
    b.plat(105, 6, 8);
    b.goal(110, 6);
    b.cells(34, 13.5, 53, 14, 8); b.cells(65, 16, 78, 16, 5);
    b.shard(70, 16.5); b.shard(40.9, 16.2);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 25 ── inside the fusion core: lifts between cannons and burning tiles
  L('Fusion Core', 'ascent', (b) => {
    b.start(-6, 0, 12);
    b.tower(8, -2, 22, 40);
    b.lift(11, 0, 10, { T: 5 });
    b.plat(14, 10, 6); b.heat(20, 10, 3, { P: 3, on: 1 });
    b.rect(28, 8, 1.4, 6); b.turret(28.7, 11, -1, { P: 2.2 });
    b.plat(23, 10, 5);
    b.lift(16, 10, 22, { T: 5.5 });
    b.plat(9, 22, 5); b.plat(20, 22, 6);
    b.checkpoint(23, 22);
    b.rect(8, 23, 1.4, 6); b.turret(8.7, 23.8, 1, { P: 2.6 });
    b.plat(12, 26, 4); b.plat(19, 29, 4); b.heat(24, 29, 3, { P: 2.8, on: 1, off: 1 });
    b.lift(11, 29, 37, { T: 4 });
    b.plat(14, 37, 12);
    b.plat(32, 33, 4); b.plat(40, 29, 10);
    b.goal(46, 29);
    b.cells(14, 11, 26, 11, 5); b.cells(12, 30, 12, 36, 3);
    b.shard(28.7, 16); b.shard(25, 40.5);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 26 ── a crossfire corridor where the floor crumbles under the barrage
  L('Cannon Gauntlet', 'gauntlet', (b) => {
    b.start(-6, 0, 12);
    b.rect(-6, 0, 1.4, 4.2); b.turret(-5.3, 0.8, 1, { P: 2.4 }); b.turret(-5.3, 4.9, 1, { P: 2.4, off: 1.2 });
    b.plat(10, 0, 4);
    for (let i = 0; i < 6; i++) b.crumble(15 + i * 4, (i % 2) * 1.5, 2.6);
    b.rect(40, 3.6, 1, 6); b.turret(40.5, 3.1, -1, { P: 2 });              // hanging cannon: duck under it
    b.plat(42, 1, 6);
    b.checkpoint(45, 1);
    b.plat(51, 3, 26);
    b.rect(78.3, -2, 1.4, 8); b.turret(79, 3.8, -1, { P: 1.8 }); b.turret(79, 7, -1, { P: 1.8, off: 0.9 });
    b.thin(55, 6.6, 4); b.thin(63, 6.6, 4); b.thin(71, 6.6, 4);
    b.plat(81, 6, 10);
    b.goal(87, 6);
    b.cells(16, 2, 36, 3, 6); b.cells(56, 7.6, 74, 7.6, 6);
    b.shard(-5.3, 7); b.shard(79, 9.6);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 27 ── a pinball corridor: chained springs ricochet you under ceilings
  L('Photon Pinball', 'bounce', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 4); b.spring(9.5, 0, 3);
    b.rect(8, 7.5, 12, 1);
    b.plat(14, 2, 4); b.spring(15.5, 2, 3);
    b.plat(20, 4, 4); b.spring(21.5, 4, 8);
    b.rect(18, 13, 8, 1);
    b.plat(27, 12, 5);
    b.checkpoint(29, 12);
    b.plat(35, 8, 3); b.spring(35.5, 8, 4);
    b.plat(40, 14, 3); b.spring(40.5, 14, 4);
    b.plat(45, 20, 6);
    b.rect(42, 25, 14, 1);
    b.plat(56, 16, 4); b.spring(57, 16, 2); b.plat(62, 15, 3); b.spring(62.5, 15, 2);
    b.plat(68, 14, 10);
    b.goal(74, 14);
    b.cells(10, 4, 22, 9, 5); b.cells(36, 12, 46, 22, 5);
    b.shard(48, 23.5); b.shard(23, 15);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 28 ── sunquake: the platforms flicker and crumble in a collapsing sequence
  L('Sunquake', 'timing', (b) => {
    b.start(-6, 0, 12);
    for (let i = 0; i < 4; i++) { b.blink(8 + i * 8, 0, 3, { P: 4, on: 3, off: -i * 0.7 }); b.crumble(12 + i * 8, 1, 2.2); }
    b.plat(41, 1, 6);
    b.checkpoint(44, 1);
    b.plat(51, 3, 3); b.crumble(57, 5, 2); b.blink(62, 7, 3, { P: 3, on: 2 }); b.crumble(68, 9, 2);
    b.blink(73, 7, 3, { P: 3, on: 2, off: 1 }); b.crumble(79, 5, 2); b.blink(84, 3, 3, { P: 3, on: 2, off: 2 });
    b.plat(90, 3, 10);
    b.goal(96, 3);
    b.cells(9, 2, 38, 2, 8); b.cells(57, 7, 85, 5, 7);
    b.shard(69, 12.5); b.shard(25, 5.5);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 29 ── plasma rapids: fast patrolling pads over fire pits, flares above
  L('Plasma Rapids', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.slide(11, 0, 25, 0, { T: 2.6, w: 3 });
    b.slide(29, 1, 43, 1, { T: 2.2, w: 3, phase: 0.5 });
    b.beam('flare', 36, 1.5, { P: 2.4, on: 0.7 });
    b.plat(47, 1, 5);
    b.checkpoint(49, 1);
    b.slide(56, 1, 70, 3, { T: 2.4, w: 2.6 });
    b.slide(74, 3, 88, 1, { T: 2, w: 2.6, phase: 0.25 });
    b.beam('flare', 65, 2.5, { P: 2.2, on: 0.7, off: 1 }); b.beam('flare', 81, 2.5, { P: 2.2, on: 0.7 });
    b.plat(92, 2, 10);
    b.goal(98, 2);
    b.cells(12, 1.4, 42, 2.4, 10); b.cells(57, 2.4, 87, 2.4, 10);
    b.thin(33, 5.2, 6); b.shard(36, 7.2); b.thin(78, 7, 5); b.shard(80.5, 9);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 30 ── FINALE: switches, cannons, a core climb and the Solar Wave
  L('Heart of the Sun', 'finale', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 10); b.switch(14, 0);
    b.blue(21, 2, 4); b.blue(27, 4, 4); b.red(33, 0, 4);
    b.plat(33, 6, 6);
    b.rect(42, 0, 1.4, 9); b.turret(42.7, 6.8, -1, { P: 2.2 });
    b.tower(44, 4, 14, 32);
    b.plat(45, 8, 4); b.plat(53, 11, 4); b.plat(45, 14, 4); b.plat(53, 17, 4);
    b.beam('flare', 47, 14, { P: 3, on: 0.9, h: 16 });
    b.plat(45, 20, 4); b.plat(53, 23, 4); b.plat(45, 26, 12);
    b.checkpoint(51, 26);
    b.chase({ speed: 4.6, trigger: 52, behind: 16 });
    b.plat(62, 24, 4); b.crumble(69, 22, 2.4); b.crumble(74, 20, 2.4);
    b.plat(80, 18, 4); b.spring(82, 18, 5); b.plat(87, 24, 4);
    b.plat(95, 20, 4); b.crumble(102, 18, 2.2); b.crumble(107, 16, 2.2);
    b.plat(113, 14, 12);
    b.goal(121, 14);
    b.cells(22, 3, 30, 5, 4); b.cells(63, 25, 108, 17, 10);
    b.shard(55, 30); b.shard(89, 28);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),
];
