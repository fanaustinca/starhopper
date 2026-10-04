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
    b.shard(17, -0.2);                                               // skimming the swells between floes
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
  // 11 ── a storm bunker: each floor button drops one shutter and swaps which stones float
  L('Storm Shutters', 'puzzle', (b) => {
    b.start(-6, 0, 12);
    b.blue(-3, 3.6, 3); b.shard(-1.5, 5.4);                          // only there once the first shutter drops: go back
    b.rect(6, 6.5, 50, 0.8);                                        // the bunker roof
    b.plat(6, 0, 16); b.switch(12, 0);
    b.redWall(20, 0, 6.5);
    b.cells(8, 1, 18, 1, 4);
    b.pool(22, 0, 12, 'water');
    b.blue(24.5, 1, 2.5); b.blue(29, 1.5, 2.5);
    b.wind(22, -1, 12, 7.4, -10, { P: 3.6, on: 1.6 });             // headwind gusting through the bunker
    b.cells(25.7, 2.4, 30.2, 2.9, 2);
    b.plat(34, 0, 10); b.switch(40, 0);
    b.checkpoint(36, 0);
    b.blueWall(44, 0, 6.5);
    b.pool(44, 0, 22, 'water');
    b.red(47, 1, 2.5);
    b.plat(51.5, 1.5, 2.4); b.switch(52, 1.5);                      // the commitment rock: landing here sinks the red stone
    b.blue(57, 2, 2.5); b.blue(61.5, 1.5, 2.5);
    b.shard(55.2, 0.6);                                              // skimming the icy water
    b.cells(48, 2.4, 63, 3, 5);
    b.plat(66, 0, 8);
    b.plat(78, 2, 4);
    b.plat(85, 4, 12);
    b.beam('lightning', 88, 4, { P: 2.8, on: 0.6 }); b.beam('lightning', 93, 4, { P: 2.8, on: 0.6, off: 1.4 });
    b.thin(86, 7.5, 3); b.shard(87.5, 9.3);
    b.goal(95, 4);
  }),

  // 12 ── a tall chimney climbed by crosswinds: each tier's gust blows the opposite way
  L('Crosswind Chimney', 'ascent', (b) => {
    b.start(-6, 0, 12);
    b.tower(2, -3, 28, 30);
    b.wind(6, -3, 16, 8, 10, GUST(3.4, 1.8));                       // tier 1 →
    b.cells(10, 4, 19, 4, 3);
    b.plat(22, 1, 6);
    b.thin(20, 4.6, 3.5);
    b.plat(24, 8, 5);
    b.wind(9, 6, 15, 8, -10, GUST(3.6, 1.8, 1));                     // tier 2 ←
    b.cells(21, 12, 11, 12, 3);
    b.shard(16, 8.2);                                                // low in the leftward gust
    b.plat(2, 9, 7); b.vent(3.5, 9, 6, { type: 'geyser' });
    b.plat(-4, 12, 3); b.shard(-2.5, 14);                            // a ledge outside the chimney
    b.plat(5, 15, 5);
    b.checkpoint(7, 15);
    b.wind(10, 13, 16, 8, 10, GUST(3.2, 1.6));                       // tier 3 →
    b.cells(13, 19, 22, 19, 3);
    b.plat(25, 16, 5);
    b.thin(27, 19.6, 3);
    b.beam('lightning', 28.5, 19.6, { P: 3, on: 0.6, h: 10 });
    b.plat(23, 23, 4);
    b.shard(25, 27.6);
    b.wind(8, 21, 16, 7, -10, GUST(3.4, 1.7, 1.5));                  // tier 4 ←
    b.cells(20, 27, 11, 27, 3);
    b.plat(4, 24, 4);
    b.plat(10, 27.5, 6);
    b.wind(16, 28, 14, 9, 10, GUST(3.6, 1.8));                      // off the top →
    b.cells(17, 32, 27, 32, 4);
    b.plat(30, 28.5, 10);
    b.goal(36, 28.5);
  }),

  // 13 ── riptide currents: forward belts fling you into gusts, backward belts drag you to sea
  L('Riptide Rapids', 'wind', (b) => {
    b.start(-6, 0, 12);
    b.conveyor(8, 0, 12, 5);
    b.wind(20, -4, 16, 12, 9, GUST(3.4, 1.8));
    b.cells(10, 1, 18, 1, 3); b.cells(23, 4, 33, 4, 4);
    b.plat(36, 1, 4);
    b.conveyor(44, 1, 18, -5); b.enemy('walker', 46, 1, { range: 14, speed: 1.4 });
    b.thin(46, 4.6, 4); b.thin(54, 5.2, 4);
    b.cells(47, 5.6, 57, 6.2, 4);
    b.shard(56, 7.4);
    b.plat(64, 2, 6);
    b.checkpoint(67, 2);
    b.conveyor(73, 3, 6, 6);
    b.wind(79, -2, 14, 13, 10, GUST(3, 1.6));
    b.cells(81, 6, 90, 6, 3);
    b.shard(85, 2.6);
    b.conveyor(93, 4, 6, -6);                                         // lands you on a riptide: run!
    b.plat(103, 5, 10);
    b.goal(109, 5);
    b.shard(63, 1.4);                                                // in the gap past the riptide's end
  }),

  // 14 ── each cloud-pad blinks out exactly when its bolt strikes: hop in counterpoint
  L('Thunder Choir', 'timing', (b) => {
    b.start(-6, 0, 12);
    for (let i = 0; i < 6; i++) {
      const x = 9 + i * 5, o = -i * 0.5;
      b.blink(x, (i % 2) * 1, 3, { P: 3, on: 1.8, off: o });
      b.beam('lightning', x + 1.5, (i % 2) * 1 - 0.6, { P: 3, on: 0.6, off: o - 1.95 });
    }
    b.cells(10.5, 2, 35.5, 3, 6);
    b.plat(41, 1, 6);
    b.checkpoint(44, 1);
    const loft = [[51, 3], [56, 6], [51, 9], [56, 12], [61, 15]];
    loft.forEach(([x, y], i) => {
      b.blink(x, y, 3, { P: 3, on: 1.8, off: -i * 0.6 });
      b.beam('lightning', x + 1.5, y - 0.6, { P: 3, on: 0.6, off: -i * 0.6 - 1.95, h: 4 });
    });
    b.cells(52.5, 4.5, 62.5, 16.5, 5);
    b.plat(66, 15, 5);
    b.shard(68.5, 19);
    b.crumble(75, 12, 2.4); b.crumble(80, 9, 2.4); b.crumble(85, 6, 2.4);
    b.plat(91, 4, 10);
    b.goal(97, 4);
    b.shard(46, 5.2);
    b.shard(35.5, 4.6);                                              // over the last singing pad
  }),

  // 15 ── the ocean rises: climb the ice tower on geysers, slick ledges and a chimney
  L('The Great Wave', 'tide', (b) => {
    b.rise({ rate: 0.7, delay: 4 });
    b.start(-6, 0, 12);
    b.tower(6, -4, 26, 48);
    b.plat(8, 3, 5);
    b.plat(16, 5, 5); b.vent(19.5, 5, 7, { type: 'geyser', always: true });
    b.plat(22, 11, 5);
    b.checkpoint(25, 11);
    b.plat(30, 14.5, 3); b.shard(31.5, 16.3);
    b.ice(16, 14.5, 3); b.ice(10, 17.5, 3);
    b.plat(1, 19, 3); b.shard(2.5, 20.8);
    b.ice(16, 20.5, 3);
    b.wall(20, 25, 9); b.wall(23.6, 22, 12);                         // the chimney
    b.plat(20, 22, 3.6);
    b.cells(22.2, 25, 22.2, 32, 4);
    b.plat(15, 35, 4);
    b.thin(9, 38, 5);
    b.shard(11.5, 41);
    b.plat(16, 41.5, 4);
    b.plat(23, 44, 8);
    b.goal(28, 44);
    b.cells(10, 4.5, 18, 6.5, 3); b.cells(19.5, 8, 19.5, 11, 2); b.cells(11, 19, 17, 22, 2);
  }),

  // 16 ── ride three storm-tossed rafts: a choppy one, a heaving one and a circling one
  L('Storm-Tossed Flotilla', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.loop([[9, 0], [15, 2], [21, -0.5], [27, 2.5], [33, 0], [39, 2]], { speed: 3, loop: false, w: 3.2 });
    b.beam('lightning', 24, -1, { P: 3.2, on: 0.6 });
    b.thin(22.5, 5.6, 3); b.shard(24, 7.3);
    b.cells(12, 2.5, 36, 3.5, 6);
    b.plat(44, 2, 5);
    b.checkpoint(46, 2);
    b.loop([[52, 2], [56, 8], [62, 3], [68, 9], [74, 4]], { speed: 3.4, loop: false });
    b.beam('lightning', 62, 3, { P: 3, on: 0.6, off: 1, h: 4 });
    b.cells(56, 9.5, 68, 10.5, 4);
    b.shard(68, 12.6);
    b.plat(79, 5, 4);
    b.loop([[87, 5], [96, 9], [105, 5], [96, 1]], { speed: 3.5 });
    b.cells(90, 8, 102, 8, 4);
    b.plat(109, 6, 9);
    b.goal(114, 6);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 17 ── rock-mounted storm cannons fire across the gust lanes: fly over or under the bolts
  L('Cannon Squall', 'gauntlet', (b) => {
    b.start(-6, 0, 12);
    b.plat(10, 0, 5);
    b.wind(15, -4, 13, 12, 9, GUST(3.4, 1.8));
    b.plat(28, 1, 6);
    b.rect(36, -3, 2.4, 7.5); b.turret(36, 2, -1, { P: 2.4 });         // cannon pillar: also the next step
    b.cells(18, 4, 26, 4, 3);
    b.wind(38.4, 0, 18, 13, 10, GUST(3.2, 1.6, 0.8));
    b.rect(57, 0, 2, 7); b.turret(57, 5.8, -1, { P: 2.2 });
    b.plat(52, 5, 5);
    b.checkpoint(54, 5);
    b.cells(41, 9, 50, 8, 4);
    b.shard(47, 9.6);
    b.plat(57, 8, 6);                                                   // cap of the cannon rock
    b.plat(66, 6, 22);
    b.rect(64.6, 6, 1.4, 4); b.turret(66, 7, 1, { P: 2.6 });
    b.rect(88, 5, 1.4, 6); b.turret(88, 7.2, -1, { P: 2.6, off: 1.3 });
    b.thin(70, 9.6, 5); b.thin(79, 9.6, 5);
    b.cells(71, 10.6, 83, 10.6, 5);
    b.shard(81.5, 12.4);
    b.plat(92, 4, 10);
    b.goal(98, 4);
    b.shard(88.7, 12.4);                                             // on the far cannon's roof
  }),

  // 18 ── a bowl into the calm eye: a tailwind shoves you down, a headwind fights you out
  L('Eye of the Storm', 'wind', (b) => {
    b.start(-6, 12, 12);
    b.wind(6, 3, 22, 14, 7, { P: 4, on: 1.8 });                      // the descent tailwind: don't overshoot
    b.plat(9, 9, 3); b.plat(15, 6, 3); b.plat(21, 3, 3);
    b.beam('lightning', 16.5, 6, { P: 3, on: 0.6, h: 12 });
    b.cells(10.5, 10.5, 22.5, 4.5, 4);
    b.plat(28, 0, 24);
    b.checkpoint(32, 0);
    b.enemy('walker', 34, 0, { range: 6 }); b.enemy('walker', 44, 0, { range: 5, speed: 2.2 });
    b.spring(39, 0, 10); b.shard(39.9, 13);                           // straight up from the eye
    b.wind(52, 0, 24, 16, -8, { P: 3.6, on: 1.6 });                   // the way out: a headwind
    b.plat(56, 3, 3); b.plat(62, 6, 3); b.plat(57, 9, 3); b.plat(64, 12, 3);
    b.beam('lightning', 58.5, 9, { P: 3, on: 0.6, off: 1.5, h: 10 });
    b.cells(57.5, 4.5, 65.5, 13.5, 4);
    b.plat(71, 12, 11);
    b.goal(78, 12);
    b.plat(-14, 9, 3); b.shard(-12.5, 11);
    b.shard(51, 2);
  }),

  // 19 ── a crumbling iceberg: tunnel through its brittle belly or skate over its peak
  L('Crumbling Iceberg', 'maze', (b) => {
    b.start(-6, 0, 12);
    b.plat(10, 0, 16);
    b.plat(12, 3, 3);
    b.rect(20, 3, 20, 1.5); b.rect(48, 3, 17, 1.5);                 // the berg's roof, cracked open in the middle
    b.crumble(26, 0, 3); b.crumble(29.5, 0, 3); b.crumble(33, 0, 3);
    b.enemy('walker', 21, 0, { range: 4 });
    b.shard(31, 1.6);                                                 // only the tunnel route passes it
    b.plat(36.5, 0, 11.5);
    b.checkpoint(42, 0);
    b.pool(48, 0, 4, 'water');
    b.plat(52, 0, 6); b.enemy('spiker', 52.5, 0, { range: 4.5 });
    b.crumble(58, 0, 3); b.crumble(61.5, 0, 3);
    b.plat(65, 0, 8);
    b.ice(24, 7, 6); b.ice(32, 10, 6); b.ice(40, 12, 6); b.ice(48, 10, 6); b.ice(56, 7, 6);
    b.beam('lightning', 43, 12, { P: 3, on: 0.6 });
    b.shard(43, 15.5);
    b.cells(22, 5.5, 60, 8.5, 9); b.cells(14, 1, 24, 1, 3); b.cells(53, 1, 63, 1, 4);
    b.plat(77, 2, 4); b.plat(84, 3, 10);
    b.goal(90, 3);
    b.shard(55, 1.4);                                                // past the spiker in the berg's belly
  }),

  // 20 ── CHASE: the Supersonic Front chases you down from the stormwall to the sea
  L('Jetstream Breakout', 'chase', (b) => {
    b.chase({ speed: 4.4 });
    b.start(-6, 20, 14);
    b.plat(12, 17, 5); b.crumble(21, 14, 3); b.crumble(27, 11, 3);
    b.plat(33, 8, 5);
    b.wind(38, 2, 26, 12, 8, JET);
    b.crumble(52, 6, 3);
    b.plat(62, 4, 6);
    b.checkpoint(65, 4);
    b.plat(72, 1, 5); b.spring(74.5, 1, 6);
    b.plat(80, 6, 4);
    b.shard(82, 11);
    b.crumble(88, 4, 2.6); b.crumble(93, 2, 2.6); b.crumble(98, 0, 2.6);
    b.plat(103, -2, 4);
    b.wind(107, -6, 22, 12, 9, JET);
    b.shard(116, -3);
    b.plat(122, -1, 12);
    b.goal(130, -1);
    b.cells(13, 18, 16, 18, 2); b.cells(40, 10, 50, 9, 4); b.cells(54, 8, 60, 6, 3); b.cells(109, 1, 120, 1, 4);
    b.plat(-14, 22, 3); b.shard(-12.5, 24);
  }),
  // 21 ── a sawtooth of glacier chimneys: wall-jump up, cross a brittle bridge, drop, climb again
  L('Glacier Chimneys', 'ascent', (b) => {
    b.start(-6, 0, 12);
    b.plat(6, 0, 8);
    b.wall(10, 2.2, 14); b.wall(13.6, 0, 13);                       // chimney 1: duck under the left wall
    b.cells(12.2, 3, 12.2, 11, 4);
    b.shard(12.2, 17.2);
    b.crumble(15, 13, 3); b.crumble(19.5, 13.5, 3);
    b.plat(24, 14, 4);
    b.beam('lightning', 26, 14, { P: 3, on: 0.6, h: 12 });
    b.thin(24.5, 17.6, 3); b.shard(26, 19.4);
    b.cells(16.5, 14.5, 21, 15, 2);
    b.shard(30, 7);                                                   // drift for it on the drop
    b.cells(30, 11, 30, 4, 3);
    b.plat(32, 2, 8);
    b.wall(36, 4.4, 14); b.wall(39.4, 2, 13);                        // chimney 2, a Triton geyser at its foot
    b.vent(38.1, 2, 6, { type: 'geyser' });
    b.cells(38.1, 10, 38.1, 14, 3);
    b.plat(40.2, 15, 5);
    b.checkpoint(42, 15);
    b.ice(49, 12, 3); b.ice(55, 9, 3);
    b.cells(50.5, 13.5, 56.5, 10.5, 2);
    b.plat(61, 7, 10);
    b.goal(67, 7);
  }),

  // 22 ── abyssal caverns: two corridors stacked under the sea, a switch below opens the gate above
  L('Abyssal Caverns', 'maze', (b) => {
    b.start(-6, 0, 12);
    b.rect(6, 4.5, 53, 1);                                          // cavern roof
    b.plat(6, 0, 20); b.plat(29, 0, 15); b.plat(47, 0, 12);         // upper floor, holed at 26 and 44
    b.rect(14, 2.2, 6, 2.3);                                         // a low squeeze
    b.enemy('walker', 13, 0, { range: 8, speed: 1.4 });
    b.shard(17, 1);
    b.plat(22, -6, 8); b.pool(30, -6, 4, 'water'); b.plat(34, -6, 20);   // lower floor
    b.shard(32, -4.4);
    b.enemy('spiker', 35, -6, { range: 6, speed: 2 });
    b.checkpoint(37, -6);
    b.switch(40, -6);
    b.spring(45, -6, 4.5);                                            // up through the second hole
    b.blueWall(49.5, -6, 5);
    b.rect(54, -6, 1.5, 5); b.turret(54, -5.2, -1, { P: 2.6 });
    b.shard(52.5, -5);                                                // grab it before the switch seals it off
    b.redWall(52, 0, 4.5);                                            // the gate in the upper corridor
    b.cells(8, 1, 12, 1, 2); b.cells(24, -5, 28, -5, 2); b.cells(35, -5, 43, -5, 4); b.cells(48, 1, 57, 1, 4);
    b.plat(63, 1, 4);
    b.plat(70, 2, 10);
    b.beam('lightning', 74, 2, { P: 2.8, on: 0.6 });
    b.goal(77, 2);
  }),

  // 23 ── a relay of Dark Spot vortices, each one hurls you at the next on a gust
  L('Vortex Relay', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.ferris(13, 3, 4.5, { n: 4, omega: 0.7 });
    b.shard(13, 10.5);
    b.wind(18, 3, 18, 12, 10, GUST(3.2, 1.7));
    b.cells(21, 10, 32, 10, 4);
    b.shard(26, 10.2);
    b.ferris(40, 6, 4.5, { n: 4, omega: -0.7 });
    b.plat(48, 8, 5);
    b.checkpoint(50, 8);
    b.ferris(62, 9, 6, { n: 5, omega: 0.5 });
    b.shard(62, 9);
    b.wind(69, 8, 15, 14, 10, GUST(3.6, 1.8, 1));
    b.cells(72, 15, 80, 14, 3);
    b.plat(84, 12, 10);
    b.goal(90, 12);
  }),

  // 24 ── rocks too far apart to jump: let each geyser toss you skyward, then glide to the next
  L('Geyser Hopscotch', 'bounce', (b) => {
    b.start(-6, 0, 12);
    b.plat(10, 0, 3); b.vent(11.5, 0, 8, { type: 'geyser', P: 2.6, on: 1.1 });
    b.plat(24, 0, 3); b.vent(25.5, 0, 8, { type: 'geyser', P: 2.6, on: 1.1, off: 0.9 });
    b.beam('lightning', 31, 4, { P: 3, on: 0.6 });
    b.plat(37, 1, 3); b.vent(38.5, 1, 8, { type: 'geyser', P: 2.6, on: 1.1, off: 1.7 });
    b.cells(11.5, 5, 11.5, 9, 2); b.arc(13, 9, 24, 3, 3, 1.5); b.arc(27, 9, 37, 4, 3, 1.5);
    b.shard(25.5, 13.6);
    b.plat(46, 1, 6);
    b.checkpoint(49, 1);
    // the rocks crumble now: land just as the geyser wakes
    b.crumble(55, 1, 3); b.vent(56.5, 1, 8, { type: 'geyser', P: 2.4, on: 1 });
    b.crumble(68, 1, 3); b.vent(69.5, 1, 8, { type: 'geyser', P: 2.4, on: 1, off: 0.8 });
    b.beam('lightning', 75, 5, { P: 2.8, on: 0.6, off: 1 });
    b.crumble(81, 2, 3); b.vent(82.5, 2, 8, { type: 'geyser', P: 2.4, on: 1, off: 1.6 });
    b.arc(58, 9, 68, 4, 3, 1.5); b.arc(71, 9, 81, 5, 3, 1.5);
    b.shard(63, 2);                                                   // low between the rocks
    b.plat(92, 3, 10);
    b.goal(98, 3);
    b.shard(31, 8.6);                                                // inside the bolt's column: glide through between strikes
  }),

  // 25 ── skate a glacier under shifting winds: a headwind shoves you back, a tailwind off the edge
  L('Slipstream Glacier', 'wind', (b) => {
    b.start(-6, 0, 12);
    b.ice(8, 0, 14); b.pool(22, 0, 4, 'water'); b.ice(26, 0, 12);
    b.wind(8, -1, 30, 7, -10, { P: 4, on: 1.6 });
    b.cells(10, 1, 36, 1, 7);
    b.ice(41, 2, 3); b.ice(47, 4, 3);
    b.shard(45.6, 2.4);                                               // a low skim between the slick steps
    b.plat(53, 5, 6);
    b.checkpoint(56, 5);
    b.ice(63, 4, 16); b.pool(79, 4, 4, 'water'); b.ice(83, 4, 4);
    b.wind(63, 3, 24, 7, 9, { P: 3.6, on: 1.5, off: 1 });           // tailwind: it'll skate you into the pool
    b.beam('lightning', 71, 4, { P: 3, on: 0.6 });
    b.cells(65, 5, 85, 5, 6);
    b.thin(70, 7.6, 3); b.shard(71.5, 9.4);
    b.plat(91, 5, 10);
    b.goal(97, 5);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 26 ── thunder drums: spring pads in a line, bolts striking between, then a drum stack up and down
  L('Thunder Drums', 'bounce', (b) => {
    b.start(-6, 0, 12);
    const drums = [[10, 0], [19, 1], [28, 0], [37, 2]];
    drums.forEach(([x, y]) => { b.plat(x, y, 2.4); b.spring(x + 0.3, y, 4); });
    b.beam('lightning', 15.5, -1, { P: 2.8, on: 0.6 });
    b.beam('lightning', 24.5, -1, { P: 2.8, on: 0.6, off: 1.4 });
    b.beam('lightning', 33.5, -1, { P: 2.8, on: 0.6 });
    b.arc(11, 1, 20, 2, 3, 4); b.arc(20, 2, 29, 1, 3, 4); b.arc(29, 1, 38, 3, 3, 4);
    b.plat(44, 2, 6);
    b.checkpoint(47, 2);
    b.plat(52, 2, 3); b.spring(52.6, 2, 6);
    b.rect(50, 12.5, 6, 0.8);                                         // a lid: drift right off the drum
    b.plat(57, 9, 3); b.spring(57.6, 9, 5);
    b.plat(62, 15, 5);
    b.shard(64.5, 19);
    b.plat(70, 12, 2.4); b.spring(70.3, 12, 1.5);
    b.plat(76, 10, 2.4); b.spring(76.3, 10, 1.5);
    b.plat(82, 8, 2.4); b.spring(82.3, 8, 1.5);
    b.beam('lightning', 79.4, 6, { P: 2.6, on: 0.6, off: 0.7 });
    b.plat(88, 6, 10);
    b.goal(94, 6);
    b.shard(53, 11.4);                                                // tucked under the lid
    b.shard(24.5, 7.4);                                              // right in a bolt's path at the top of a bounce
  }),

  // 27 ── choose your weather: a fast high road on gusts past drones, or a slow low road into headwinds
  L('Gale Gauntlet', 'gauntlet', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 3, 3);                                                  // fork: up for the high road
    b.wind(11, 2, 16, 12, 10, GUST(3.2, 1.7));
    b.enemy('flyer', 19, 8, { ax: 1, ay: 2, T: 2.4 });
    b.plat(27, 5, 3);
    b.wind(30, 4, 18, 12, 10, GUST(3.4, 1.7, 1.2));
    b.enemy('flyer', 39, 9, { ax: 2, ay: 1.4, T: 3 });
    b.cells(14, 8, 24, 8, 3); b.cells(33, 10, 44, 10, 3);
    b.shard(35, 9.4);
    // low road: ice and icy water against the wind
    b.ice(10, 0, 8); b.pool(18, 0, 4, 'water'); b.ice(22, 0, 8); b.pool(30, 0, 4, 'water'); b.ice(34, 0, 14);
    b.wind(10, -1, 38, 2.8, -9, { P: 3.6, on: 1.6 });
    b.enemy('walker', 36, 0, { range: 9 });
    b.shard(32, 0.8);
    b.plat(48, 4, 7);
    b.checkpoint(51, 4);
    // the merge: blink pads carried by one long gust
    b.wind(55, 0, 32, 14, 9, GUST(4, 2.2));
    b.blink(66, 5, 3, { P: 4, on: 2.6 }); b.blink(77, 6, 3, { P: 4, on: 2.6, off: 1 });
    b.cells(58, 8, 85, 9, 6);
    b.plat(87, 5, 10);
    b.goal(93, 5);
    b.shard(9.5, 6.6);                                               // above the fork
  }),

  // 28 ── storm trawlers: ride a fleet of boats across the open ocean while lightning walks the lanes
  L('Trawler Crossing', 'ride', (b) => {
    b.start(-6, 3, 12);
    b.stream('boat', 4, 54, -1, { speed: 3.5, spacing: 12 });
    b.beam('lightning', 22, 0, { P: 3, on: 0.6 });
    b.beam('lightning', 38, 0, { P: 3, on: 0.6, off: 1.5 });
    b.thin(29, 5.4, 3); b.shard(30.5, 7.2);
    b.cells(10, 3, 50, 3, 8);
    b.plat(54, 3, 8);
    b.checkpoint(57, 3);
    b.stream('boat', 60, 108, -1, { speed: 4.5, spacing: 14, offset: 3 });
    b.beam('lightning', 72, 0, { P: 2.6, on: 0.6, off: 0.6 });
    b.beam('lightning', 84, 0, { P: 2.6, on: 0.6, off: 1.9 });
    b.beam('lightning', 96, 0, { P: 2.6, on: 0.6, off: 1.2 });
    b.thin(89, 5.4, 3); b.shard(90.5, 7.2);
    b.cells(64, 3, 104, 3, 8);
    b.plat(108, 2.5, 10);
    b.goal(114, 2.5);
    b.plat(-14, 4.5, 3); b.shard(-12.5, 6.5);
  }),

  // 29 ── the Storm King's spire: every Neptune trick stacked into one brutal climb
  L("Storm King's Spire", 'ascent', (b) => {
    b.start(-6, 0, 12);
    b.tower(4, -4, 28, 46);
    b.plat(8, 3, 3);
    b.crumble(14, 6, 2.6);
    b.blink(8, 9, 3, { P: 3, on: 2 });
    b.plat(14, 11.5, 5); b.vent(17.5, 11.5, 8, { type: 'geyser' });
    b.plat(21, 19, 4);
    b.checkpoint(23, 19);
    b.plat(29, 22, 3); b.shard(30.5, 24);                             // a ledge off the spire's edge
    b.wind(9, 17, 12, 7, -10, GUST(3.2, 1.6));
    b.plat(4, 19.5, 5);
    b.wall(4, 21.5, 12); b.wall(7.6, 21.5, 9);                        // chimney
    b.cells(6.2, 23, 6.2, 30, 3);
    b.plat(9, 30.5, 4);
    b.beam('lightning', 11, 30.5, { P: 2.6, on: 0.6, h: 10 });
    b.ferris(18.5, 33, 3.5, { n: 3, omega: 0.9 });
    b.shard(18.5, 33);                                                 // the eye of the little vortex
    b.plat(24, 36, 4);
    b.crumble(18, 39.5, 2.5);
    b.plat(11, 42, 5);
    b.shard(13, 45.8);
    b.wind(16, 43.5, 14, 10, 10, GUST(3.4, 1.7));
    b.cells(19, 47, 27, 47, 3);
    b.plat(30, 43, 8);
    b.goal(35, 43);
    b.cells(9.5, 4.5, 15.5, 7.5, 2); b.cells(17.5, 14, 17.5, 18, 2); b.cells(10, 20.5, 18, 20.5, 3);
  }),

  // 30 ── FINALE: gust, shutter, geyser and vortex, then the Supersonic Front chases you home
  L('Heart of the Tempest', 'finale', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 5);
    b.wind(13, -4, 15, 12, 9, GUST(3.4, 1.8));
    b.cells(16, 4, 25, 4, 3);
    b.plat(28, 1, 10); b.switch(30, 1);
    b.rect(28, 7.5, 12, 0.8);
    b.redWall(36, 1, 6.5);
    b.plat(40, 1, 4); b.vent(42, 1, 8, { type: 'geyser' });
    b.plat(45, 9, 4);
    b.ferris(57, 10, 4.5, { n: 4, omega: 0.6 });
    b.ferris(57, 10, 8.5, { n: 6, omega: -0.4 });
    b.shard(57, 10);
    b.plat(68, 12, 6);
    b.checkpoint(70, 12);
    b.chase({ speed: 4.6, trigger: 72, behind: 16 });
    b.wind(74, 9, 20, 12, 8, JET);
    b.crumble(88, 12, 3);
    b.cells(77, 16, 86, 16, 3);
    b.plat(95, 11, 4); b.spring(97, 11, 6);
    b.plat(102, 18, 4);
    b.shard(104, 22.4);
    b.crumble(110, 15, 2.6); b.crumble(116, 12, 2.6);
    b.plat(121, 10, 4); b.vent(123, 10, 7, { type: 'geyser', always: true });
    b.plat(126, 17, 4);
    b.wind(130, 13, 16, 12, 9, JET);
    b.cells(133, 20, 143, 19, 4);
    b.plat(146, 16, 12);
    b.goal(154, 16);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),
];
