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
    b.vine(51, 8, 5);                                    // a buoy tether over the first dip
    b.tornado(60, 64, 0, { rise: 6, T: 6 });                // the first little waterspout: it lifts you into the gust
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
    b.vine(55, 13, 5);
    b.tornado(24, 27, 10, { rise: 7, T: 5 });                // a waterspout drifting off the second terrace
  }),

  // 3 ── Buoy Bounce: storm buoys sink under your weight and bubble columns lift you; waterspouts carry you over the open sea
  L('Buoy Bounce', 'swing', (b) => {
    b.start(-6, 0, 12);
    b.sinker(9, 0, 3, { depth: 3 });                       // first buoy: feel it go down
    b.sinker(15, 0.5, 3, { depth: 3.5 });
    b.shard(15.5, -1.6);                                   // only reached by riding a buoy all the way under
    b.sinker(21, 0, 3, { depth: 3 });
    b.plat(26, 1, 5);
    b.floater(35, 1, 3, { rise: 9, speed: 2.2 });          // a bubble column: stand on it and it floats you up
    b.cells(35, 3.5, 35, 8.5, 3);
    b.shard(35, 12.6);                                     // ride the bubbles to the very top
    b.plat(41, 8, 5);
    b.checkpoint(43, 8);
    b.tornado(48, 60, 7.5, { rise: 9, T: 6 });               // a waterspout roaming the gap
    b.cells(50, 13, 64, 13, 6);
    b.plat(66, 11, 5);
    b.sinker(75, 11, 2.6, { depth: 3, speed: 2 });
    b.sinker(81, 10, 2.6, { depth: 3, speed: 2 });
    b.sinker(87, 9, 2.6, { depth: 3, speed: 2 });
    b.enemy('flyer', 81, 14, { ax: 3, ay: 0.8, T: 3 });
    b.plat(92, 8, 10);
    b.goal(98, 8);
    b.cells(6, 1, 24, 1, 5);
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
    b.pendulum(61, 11, 5.6, { amp: 25, T: 3.2 });          // a buoy anchor swinging over the icy pools
    b.vine(88, 13, 5);
  }),

  // 5 ── Tether Storm: swing across the sea on lightning-charged tethers while a lighthouse beam turns over the landing
  L('Tether Storm', 'swing', (b) => {
    b.start(-6, 0, 12);
    b.vine(11, 10, 6);
    b.plat(17, 1, 5);
    b.sweeper(19.5, 4.6, 3, { omega: 60 });                // a lighthouse beam turning over the first landing
    b.vine(28, 11, 6);
    b.plat(33, 2, 4);
    b.beam('lightning', 36, 2, { P: 3, on: 0.6, warn: 0.8, h: 8 });
    b.vine(42, 12, 6); b.vine(49, 13, 6);                  // the chain: no ground between
    b.arc(38, 3, 56, 3, 6, 3);
    b.shard(45.5, 8);
    b.plat(57, 3, 5);
    b.checkpoint(59, 3);
    b.vine(67, 13, 6);
    b.plat(73, 6, 4);
    b.vine(81, 16, 6);                                     // tethers up the storm front
    b.plat(87, 9, 4);
    b.vine(95, 19, 6);
    b.plat(101, 12, 9);
    b.goal(106, 12);
    b.cells(11, 6, 28, 7, 5); b.cells(65, 7, 73, 8, 3);
    b.vine(-9, 10, 5); b.plat(-17, 5, 3); b.shard(-15.5, 7);   // a tether behind the start swings to a perch
    b.plat(84, 14, 3); b.shard(85.5, 16);                   // let go high on a back-swing
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
    b.vine(-2, 21, 5);                                   // a tether off the cliff
    b.pendulum(46, 40, 6, { amp: 30, T: 3.4 });             // a buoy anchor swinging in the summit gust
  }),

  // 7 ── Lighthouse Zip: storm zip lines run between lighthouse towers past swinging buoy anchors, then a waterspout lifts you to the last line
  L('Lighthouse Zip', 'ride', (b) => {
    b.start(-6, 20, 12);
    b.zip(7, 23, 25, 17);
    b.wrecker(16, 26, 5.4, { amp: 50, T: 3.2 });           // a buoy anchor swinging across the first line
    b.shard(20, 20.6);
    b.plat(27, 14, 5);
    b.tower(28, -3, 3, 14);
    b.sweeper(29.5, 17.6, 2.6, { omega: 70 });             // the lighthouse beam
    b.zip(33, 17, 55, 10);
    b.wrecker(44, 20, 5.6, { amp: 50, T: 3, phase: 0.5 });
    b.plat(57, 7, 6);
    b.checkpoint(60, 7);
    b.vine(68, 15, 6);                                     // tether → line: let go into the next zip
    b.zip(72, 10, 90, 4);
    b.plat(92, 1, 6);
    b.tornado(98, 106, 0.5, { rise: 12, T: 7 });           // a waterspout lifts you to the last tower
    b.cells(100, 6, 110, 12, 5);
    b.shard(106, 12);
    b.plat(113, 12, 5);
    b.zip(119, 15, 138, 8, { oneWay: true });
    b.plat(140, 5, 10);
    b.goal(146, 5);
    b.cells(9, 21, 23, 16.5, 5); b.cells(35, 16, 53, 10, 6); b.cells(74, 9, 88, 4, 4); b.cells(121, 14, 136, 8, 5);
    b.plat(-14, 22, 3); b.shard(-12.5, 24);
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
    b.vine(36, 22, 5);
    b.sinker(46, 1, 2.6, { depth: 2.5 });
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
    b.pendulum(80, 15, 5, { amp: 30, T: 3 });
    b.vine(66, 22, 5);
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
    b.vine(66, 15, 5);
    b.pendulum(112, 18, 6, { amp: 30, T: 3 });
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
    b.pendulum(72, 10, 4, { amp: 30, T: 3 });
    b.vine(82, 9, 5);
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
    b.vine(-4, 22, 5);
    b.floater(28, 8, 2.6, { rise: 6, speed: 2 });
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
    b.sinker(98, 4, 2.6, { depth: 2 });
    b.vine(70, 10, 5);
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
    b.pendulum(71, 18, 5, { amp: 30, T: 3.2 });
    b.vine(101, 10, 5);
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
    b.vine(27, 20, 5);
    b.floater(5, 2, 2.6, { rise: 6, speed: 2.4 });
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
    b.sinker(20, 1, 2.6, { depth: 2 });
    b.vine(48, 10, 5);
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
    b.pendulum(21, 8, 4, { amp: 30, T: 3 });
    b.vine(60, 12, 5);
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
    b.vine(25, 10, 5);
    b.pendulum(46, 14, 5, { amp: 30, T: 3.4 });
  }),

  // 19 ── Waterspout Alley: four waterspouts roam the open sea at different tempos; ride each one up the staircase of islands
  L('Waterspout Alley', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.tornado(8, 20, 0, { rise: 9, T: 5 });
    b.cells(8, 4, 24, 7, 6);
    b.plat(28, 7, 5);
    b.checkpoint(30, 7);
    b.tornado(34, 44, 6.5, { rise: 10, T: 6, phase: 0.5 });
    b.enemy('flyer', 40, 16, { ax: 3, ay: 1, T: 3 });
    b.plat(50, 14, 4);
    b.beam('lightning', 52, 14, { P: 3, on: 0.6, warn: 0.8, h: 8 });
    b.tornado(55, 65, 13.5, { rise: 10, T: 5, phase: 0.2 });
    b.cells(54, 18, 68, 22, 6);
    b.shard(66, 22);                                        // in the crest of the third waterspout
    b.plat(70, 20, 4);
    b.plat(78, 21, 4);
    b.pendulum(88, 29, 7.5, { amp: 40, T: 3.4 });           // a raft swung out from a crane to the goal isle
    b.plat(96, 20, 10);
    b.goal(102, 20);
    b.shard(24.5, 5.4);                                     // in the first spout's wake, over the open sea
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
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
    b.vine(60, 12, 5);
    b.pendulum(122, 8, 5, { amp: 30, T: 3 });
  }),
  // 21 ── Triton Pod Spire: geyser cannon pods blast you up a lighthouse spire: a fixed pod, a spinning pod, a pod ladder, then a rocking pod
  L('Triton Pod Spire', 'ascent', (b) => {
    b.start(-6, 0, 12);
    b.tower(8, -3, 44, 40);
    b.plat(8, 0, 5);
    b.barrel(15, 2.4, { angle: 45 });                       // pod 1: hop in, press jump
    b.barrel(24, 4.4, { spin: 90 });                        // a spinning pod: wait for it to face the next ledge
    b.plat(31, 3.5, 5);
    b.checkpoint(33, 3.5);
    b.barrel(40, 6, { angle: 90, power: 22 });              // the pod ladder up the spire
    b.barrel(40, 11, { angle: 90, power: 22 });
    b.barrel(40, 16, { spin: 90 });
    b.shard(40, 21.5);                                      // straight up out of the top pod
    b.plat(46, 14, 4);
    b.barrel(54, 16.5, { angle: 60, sweep: 35, spin: 100, power: 20 });   // a rocking pod
    b.plat(61, 19, 4);
    b.plat(51, 22, 3); b.shard(52.5, 24);                   // the rocking pod flung high reaches this perch
    b.vine(70, 29, 6);
    b.plat(76, 21, 10);
    b.goal(82, 21);
    b.cells(10, 1, 14, 2.5, 2); b.arc(16, 3, 23, 4.4, 2, 1.5); b.arc(25, 5, 31, 5, 2, 1.5);
    b.cells(40, 8, 40, 14, 3);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 22 ── Crane Docks: pendulum life-rafts hang from crane arms over the harbour, wrecking buoys swing between the piers
  L('Crane Docks', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 4);
    b.pendulum(17, 8, 7, { amp: 40, T: 3.4 });              // first raft
    b.plat(25, 0, 5);
    b.wrecker(32, 9, 6.4, { amp: 50, T: 3 });               // a wrecking buoy across the next pier
    b.plat(30, 0, 6);
    b.shard(33, 1.4);
    b.pendulum(40, 9, 8, { amp: 35, T: 3.6 });
    b.pendulum(48, 9, 8, { amp: 35, T: 3.6, phase: 0.5 });
    b.plat(54, 1, 6);
    b.checkpoint(57, 1);
    b.pendulum(63, 12, 7, { amp: 40, T: 3.4 });             // a crane staircase up the dock
    b.pendulum(71, 15, 7, { amp: 40, T: 3.4, phase: 0.5 });
    b.shard(71, 12);                                        // under the raft: swing it out of the way
    b.pendulum(79, 18, 7, { amp: 40, T: 3.4 });
    b.plat(85, 11, 4);
    b.wrecker(91, 20, 6.5, { amp: 55, T: 3, phase: 0.3 });
    b.plat(89, 11, 12);
    b.goal(97, 11);
    b.cells(10, 1, 22, 1, 4); b.cells(36, 2, 52, 2, 5); b.cells(60, 6, 78, 12, 5);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
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
    b.vine(36, 12, 5);
    b.pendulum(77, 20, 5, { amp: 30, T: 3 });
  }),

  // 24 ── Cannon Pod Relay: Triton cannon pods blast you across the open ocean, one pod to the next, with a waterspout for the long haul
  L('Cannon Pod Relay', 'bounce', (b) => {
    b.start(-6, 0, 12);
    b.barrel(12, 2.5, { angle: 35, power: 20 });
    b.barrel(23, 3, { angle: 35, power: 20 });
    b.barrel(34, 3, { spin: 100 });
    b.plat(43, 3, 5);
    b.checkpoint(45, 3);
    b.tornado(50, 58, 3, { rise: 10, T: 5 });
    b.plat(64, 12, 4);
    b.barrel(72, 14.5, { angle: 70, sweep: 40, spin: 90, power: 20 });
    b.plat(78, 17, 4);
    b.plat(67, 17.5, 3); b.shard(68.5, 19.5);
    b.barrel(86, 16, { angle: 25, power: 20 });
    b.barrel(97, 14, { angle: 20, power: 20 });
    b.plat(106, 9, 10);
    b.goal(112, 9);
    b.arc(13, 3, 22, 3.5, 2, 2); b.arc(24, 3.5, 33, 3.5, 2, 2); b.arc(35, 4, 43, 4, 2, 2);
    b.cells(48, 6, 60, 12, 4);
    b.shard(28, 4.7);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
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
    b.vine(60, 11, 5);
    b.floater(93, 5, 2.6, { rise: 4, speed: 2 });
  }),

  // 26 ── Beacon Run: dash lighthouse to lighthouse past turning beams, buoys that sink and a storm spring up the last tower
  L('Beacon Run', 'bounce', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 8);
    b.sweeper(12, 3.4, 3.2, { omega: 70 });                 // beam 1, a slow clockwise sweep
    b.sinker(21, 0, 3, { depth: 2.5 });
    b.sinker(27, 0.5, 3, { depth: 2.5 });
    b.plat(32, 1, 9);
    b.sweeper(36.5, 4.4, 3.4, { omega: -80 });              // beam 2 turns the other way
    b.beam('lightning', 40, 1, { P: 2.8, on: 0.6 });
    b.plat(46, 1, 3); b.spring(47, 1, 5);
    b.plat(52, 6, 10);
    b.checkpoint(55, 6);
    b.sweeper(58, 9.4, 3.2, { omega: 60, both: true });     // a full bar turning over the ledge
    b.shard(64, 4.4);
    b.pendulum(70, 15, 7, { amp: 40, T: 3.4 });
    b.plat(76, 8, 3); b.spring(77, 8, 6);
    b.plat(82, 14, 5);
    b.sweeper(84.5, 17.4, 2.8, { omega: 75 });
    b.shard(86, 18.5);
    b.plat(90, 12, 3); b.spring(91, 12, 1.5);
    b.plat(96, 10, 10);
    b.goal(102, 10);
    b.cells(10, 1, 18, 1, 3); b.cells(21, 2, 28, 2, 3); b.cells(34, 3, 44, 3, 4); b.cells(54, 8, 63, 8, 4);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
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
    b.vine(86, 12, 5);
    b.tornado(55, 62, 4, { rise: 6, T: 6 });
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
    b.pendulum(112, 12, 5, { amp: 30, T: 3 });
    b.vine(52, 10, 5);
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
    b.vine(25, 28, 5);
    b.floater(33, 22, 2.6, { rise: 5, speed: 2 });
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
    b.vine(52, 18, 5);
    b.pendulum(112, 24, 5, { amp: 30, T: 3 });
  }),
];
