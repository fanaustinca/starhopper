// WORLD 10 — NEPTUNE. 30 hand-written levels.
// Gravity 1.1: single jump ≈ 2.2 high, double jump ≈ 4.0 high / ~9.5 far, run 8.5/s.
// Signature: forward gusts that fling you over huge gaps (time the jump!), headwinds
// that shove you back, icy water, lightning, the Great Dark Spot vortex, Triton geysers.
// Every level has its own idea; see the comment above each one.
import { L } from './dsl.js';

const GUST = (P, on, off = 0) => ({ gust: true, P, on, off });
const JET = { gust: true, P: 1, on: 1, warn: 0 };   // a jet stream that never stops blowing

export default [
  // 1 ── learn to hop the ocean swells, then let the first storm gust carry you across
  L('Gale Landing', 'intro', (b) => {
    b.start(-6, 0, 14);
    b.arc(8, 0, 12, 0, 2, 1.6);
    b.plat(12, 0, 6);
    b.plat(22, 1.5, 5);
    b.plat(31, 3, 4);
    b.thin(30.5, 6.6, 5); b.shard(33, 8.4);
    b.plat(39, 0, 8);
    b.checkpoint(43, 0);
    b.arc(47, 0, 55, 0, 3, 3.2);
    b.plat(55, 0, 5);
    b.wind(59, -4, 16, 13, 9, GUST(4, 2.2));
    b.cells(62, 3, 72, 3, 5);
    b.shard(67, 0.4);
    b.plat(75, 0.5, 6);
    b.plat(85, 2.5, 4);
    b.plat(93, 4, 10);
    b.goal(99, 4);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 2 ── a staircase of islands falling away into the storm, each gap its own gust rhythm
  L('Tailwind Terraces', 'wind', (b) => {
    b.start(-6, 12, 12);
    b.plat(-14, 9, 3); b.shard(-12.5, 10.6);                       // a ledge tucked under the start
    b.wind(6, 6, 14, 14, 9, GUST(3.5, 1.8));
    b.cells(9, 15, 17, 14, 4);
    b.plat(19, 10, 5);
    b.wind(24, 4, 16, 14, 10, GUST(3, 1.5, 1));
    b.cells(27, 13, 36, 11, 4);
    b.plat(39, 8, 4);
    b.thin(39.5, 11.6, 3); b.shard(41, 13.5);
    b.wind(43, 2, 18, 15, 10, GUST(4, 2, 2));
    b.shard(52, 11.8);
    b.plat(60, 6, 7);
    b.checkpoint(63, 6);
    b.wind(67, 0, 26, 14, 9, GUST(2.6, 1.6));
    b.plat(79, 4, 2.5);                                             // a stepping rock mid-gale: don't stop long
    b.cells(70, 8, 78, 7, 3); b.cells(83, 6, 90, 5, 3);
    b.plat(92, 2, 10);
    b.goal(98, 2);
  }),

  // 3 ── a long icy pier: headwinds shove you back, so dash between the windbreak walls
  L('Windbreak Pier', 'wind', (b) => {
    b.start(-6, 0, 12);
    b.plat(6, 0, 10); b.pool(16, 0, 4, 'water');
    b.plat(20, 0, 12); b.wall(25, 0, 2.6, 1.2);
    b.wind(26.2, -1, 14, 9, -12, { P: 4, on: 1.8 });
    b.pool(32, 0, 5, 'water');
    b.plat(37, 0, 12); b.wall(44, 0, 2.6, 1.2);
    b.checkpoint(40, 0);
    b.wind(45.2, -1, 16, 9, -12, { P: 3.6, on: 1.6, off: 1.2 });
    b.pool(49, 0, 6, 'water');
    b.plat(55, 0, 12); b.wall(62, 0, 2.6, 1.2);
    b.wind(63.2, -1, 18, 9, -13, { P: 3.4, on: 1.6, off: 2.2 });
    b.pool(67, 0, 5, 'water');
    b.plat(72, 0, 8);
    b.pool(80, 0, 6, 'water');
    b.plat(86, 0, 12);
    b.goal(93, 0);
    // the sheltered high road along the wall tops
    b.thin(28, 5.6, 4); b.thin(36, 6.4, 4); b.thin(47, 5.6, 4);
    b.cells(29, 6.6, 50, 6.6, 6);
    b.shard(38, 8.4);
    b.cells(8, 1, 14, 1, 3); b.cells(57, 1, 79, 1, 6);
    b.shard(83, 1.6);                                               // over the last pool: risky
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 4 ── frozen swells: rocking floes and slick ice shelves where every landing skids
  L('Frozen Swells', 'precision', (b) => {
    b.start(-6, 0, 12);
    for (let i = 0; i < 5; i++) b.slide(11 + i * 6, -0.6, 11 + i * 6, 1.6, { T: 3, w: 3, phase: i * 0.2 });
    b.cells(11, 2.6, 35, 2.6, 5);
    b.ice(40, 1, 3);
    b.ice(46, 2, 10); b.pool(56, 2, 4, 'water'); b.ice(60, 2, 4); b.pool(64, 2, 4, 'water'); b.ice(68, 2, 7);
    b.checkpoint(71, 2);
    b.cells(48, 3, 72, 3, 6);
    b.ice(79, 4, 2.4); b.ice(85, 6, 2.4); b.ice(91, 8, 2.4);
    b.thin(84, 10.8, 3); b.shard(85.5, 12.5);
    b.ice(97, 6, 2.4);
    b.plat(103, 4, 10);
    b.goal(109, 4);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.shard(62, 5.4);
  }),

  // 5 ── lightning walks down a long cloud bridge; then climb a ladder of strikes
  L('Lightning Rods', 'gauntlet', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 44);
    for (let i = 0; i < 7; i++) b.beam('lightning', 12 + i * 5.5, 0, { P: 3, on: 0.6, warn: 0.8, off: -i * 0.4 });
    b.cells(10, 1, 49, 1, 9);
    b.rect(26, 2.6, 10, 0.8); b.shard(31, 4.9);                    // a storm-cloud lid with a prize on it
    b.plat(56, 2, 6);
    b.checkpoint(59, 2);
    b.plat(64, 5, 3); b.plat(70, 8, 3); b.plat(64, 11, 3); b.plat(70, 14, 3);
    b.beam('lightning', 65.5, 5, { P: 2.6, on: 0.6, h: 14 });
    b.beam('lightning', 71.5, 8, { P: 2.6, on: 0.6, off: 1.3, h: 14 });
    b.cells(65.5, 6.5, 71.5, 15.5, 4);
    b.plat(77, 14, 8);
    b.shard(68, 18);
    b.plat(89, 10, 3); b.plat(96, 6, 10);
    b.goal(102, 6);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 6 ── climb an ice cliff on Triton geysers, then ride a gust off the summit
  L('Triton Geysers', 'ascent', (b) => {
    b.start(-6, 0, 12);
    b.tower(7, -3, 22, 33);
    b.plat(8, 0, 6); b.vent(11, 0, 7, { type: 'geyser' });
    b.plat(14, 6, 5); b.vent(18, 6, 7, { type: 'geyser', off: 1 });
    b.plat(8, 12, 6); b.vent(10, 12, 7, { type: 'geyser' });
    b.plat(1, 15, 3); b.shard(2.5, 17);                            // an off-cliff ledge
    b.plat(14, 18, 7);
    b.checkpoint(16, 18);
    b.rect(13, 26.5, 6, 0.8);                                       // overhang: the geyser by the edge is the way up
    b.vent(20, 18, 8, { type: 'geyser', off: 0.5 });
    b.plat(23, 24, 6); b.vent(28, 24, 7, { type: 'geyser' });
    b.shard(28, 35.5);
    b.plat(31, 30, 5);
    b.cells(11, 3, 11, 8, 3); b.cells(18, 9, 18, 14, 3); b.cells(10, 15, 10, 20, 3); b.cells(21, 21, 21, 26, 3);
    b.wind(36, 25, 18, 13, 10, GUST(3.6, 1.8));
    b.cells(37, 33, 50, 32, 5);
    b.shard(44, 27.5);                                                 // low in the gust: dip for it
    b.plat(52, 29, 4);
    b.plat(60, 25, 4); b.plat(67, 21, 10);
    b.goal(73, 21);
  }),

  // 7 ── storm-drone squadrons patrol the gust corridors: fly between them
  L('Squall Drones', 'enemies', (b) => {
    b.start(-6, 0, 12);
    b.plat(10, 0, 7); b.enemy('walker', 11, 0, { range: 5 });
    b.wind(17, -4, 14, 12, 9, GUST(3.2, 1.8));
    b.enemy('flyer', 24, 3, { ax: 0.6, ay: 2.4, T: 2.6 });
    b.plat(31, 1, 6);
    b.rect(37, 6.4, 13, 0.8);                                        // storm ceiling: no going over the drones
    b.wind(37, -4, 13, 10.4, 9, GUST(3, 1.6, 1));
    b.enemy('flyer', 43.5, 2.4, { ax: 0.4, ay: 1.6, T: 2 });
    b.plat(50, 1, 8); b.enemy('walker', 51, 1, { range: 6, speed: 2.2 });
    b.thin(51, 4.6, 3);                                              // a step up onto the storm ceiling
    b.checkpoint(56, 1);
    b.wind(58, -4, 30, 16, 10, GUST(4, 2.2));
    b.plat(70, 3, 3);
    b.enemy('flyer', 64, 6, { ax: 3, ay: 1, T: 3 });
    b.enemy('flyer', 79, 5, { ax: 2, ay: 2, T: 2.4 });
    b.plat(86, 2, 12); b.enemy('walker', 88, 2, { range: 6 });
    b.goal(95, 2);
    b.cells(20, 4, 28, 4, 3); b.cells(40, 3, 47, 3, 3); b.cells(61, 7, 68, 6, 3); b.cells(74, 6, 83, 5, 4);
    b.shard(43.5, 7.8);                                               // on the ceiling
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.shard(71.5, 6.8);
  }),

  // 8 ── down an ice crevasse: shelves zig-zag left and right, each with its own trap
  L('Icebreaker Crevasse', 'descent', (b) => {
    b.start(-6, 30, 10);
    b.rect(2.5, -1, 1.5, 28);                                        // crevasse walls
    b.rect(32, 4, 1.5, 29);
    b.ice(4, 26, 20);                                                // A: slick, slide off the right end
    b.cells(6, 27, 22, 27, 5);
    b.plat(18, 21, 14); b.enemy('walker', 19, 21, { range: 10, speed: 2 });   // B
    b.ice(4, 16, 8); b.pool(12, 16, 4, 'water'); b.ice(16, 16, 8);        // C: icy water in the middle
    b.checkpoint(20, 16);
    b.crumble(12, 11, 4); b.crumble(17, 11, 4); b.crumble(22, 11, 4); b.plat(26, 11, 6);   // D: brittle ice
    b.plat(4, 6, 12); b.enemy('spiker', 5, 6, { range: 9, speed: 2.4 });   // E
    b.plat(12, 1, 30);                                                // the way out under the right wall
    b.cells(14, 2, 40, 2, 6); b.cells(28, 24, 28, 20, 2); b.cells(28, 14, 28, 11.5, 2); b.cells(8, 10, 8, 7.5, 2);
    b.shard(30.5, 23);                                                // B's far corner, under A's ledge
    b.shard(6, 12.5);                                                 // hangs in the drop shaft below C
    b.pool(42, 1, 5, 'water');
    b.plat(47, 1, 4);
    b.plat(55, 3, 10);
    b.goal(61, 3);
    b.shard(49, 6.5);
  }),

  // 9 ── the Great Dark Spot: two vortices of counter-rotating rings, the inner eye holds a shard
  L('Dark Spot Spiral', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 1, 4);
    b.ferris(24, 6, 5, { n: 4, omega: 0.55 });
    b.ferris(24, 6, 9, { n: 6, omega: -0.35 });
    b.plat(35, 8, 6);
    b.checkpoint(38, 8);
    b.ferris(57, 10, 3.6, { n: 3, omega: 0.8, w: 2 });
    b.ferris(57, 10, 7, { n: 5, omega: -0.5 });
    b.ferris(57, 10, 10.5, { n: 7, omega: 0.32 });
    b.plat(56.2, 10, 1.6); b.shard(57, 11.6);                        // the eye of the storm
    b.plat(70, 10, 10);
    b.goal(76, 10);
    b.arc(12, 1, 18, 3, 2, 1.5); b.cells(24, 15.5, 24, 15.5, 1); b.cells(24, 6, 24, 6, 1); b.cells(36, 9.5, 40, 9.5, 3);
    b.cells(57, 21, 57, 21, 1); b.cells(45, 10, 45, 10, 1);
    b.shard(24, 17);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 10 ── CHASE: the Supersonic Front roars in; ride the jet stream's endless tailwind
  L('Supersonic Front', 'chase', (b) => {
    b.chase({ speed: 4.2 });
    b.start(-6, 0, 14);
    b.plat(12, 1, 5); b.plat(21, 2.5, 4); b.plat(30, 4, 4);
    b.wind(34, 2, 62, 12, 7, JET);
    b.crumble(46, 5, 3); b.crumble(60, 6, 3); b.plat(74, 6, 6);
    b.checkpoint(77, 6);
    b.crumble(91, 5, 3);
    b.cells(36, 8, 44, 8, 3); b.cells(50, 9, 58, 9, 3); b.cells(64, 10, 72, 10, 3); b.cells(81, 10, 89, 9, 3);
    b.thin(62, 9.6, 3); b.shard(63.5, 11.4);
    b.plat(100, 3, 4); b.spring(101.5, 3, 6);
    b.plat(107, 9, 4); b.plat(115, 6, 4);
    b.crumble(122, 4, 2.6); b.crumble(127, 3, 2.6);
    b.plat(133, 3, 12);
    b.goal(141, 3);
    b.shard(109, 13.4);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),
];
