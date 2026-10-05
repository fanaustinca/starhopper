// WORLD 11 — PRISMARA. 30 hand-written levels over the crystal sea.
// Gravity 0.95: single jump ≈ 2.6 high, double ≈ 4.6 high / ~12 far.
// Signature: light bridges (solidify when you walk up to them), mirrored pad pairs,
// flickering prism light, red/blue refraction blocks, shattering glass.
// Every level has its own idea; see the comment above each one.
import { L } from './dsl.js';

export default [
  // 1 ── intro: run and jump over the crystal sea, cross your first light bridge and mirror pair
  L('First Light', 'intro', (b) => {
    b.start(-6, 0, 14);
    b.arc(8, 0, 12, 0, 2, 1.8);
    b.plat(12, 0, 6);
    b.plat(22, 1, 5);
    b.vine(29, 9, 6);                          // your first light strand: grab it, or just jump the gap
    b.thin(23, 4.5, 3); b.cells(23.5, 5.5, 25.5, 5.5, 3);
    b.plat(31, 0, 6);
    b.bridge(37, 0, 14);                       // a wide gap: walk up and the light hardens
    b.cells(39, 1, 49, 1, 5);
    b.plat(51, 0, 8);
    b.checkpoint(55, 0);
    b.mirror(61, 0, 4, { w: 3, T: 4 });        // pad and its reflection meet at x=68
    b.thin(66.5, 4, 3); b.shard(68, 5.6);
    b.plat(76.5, 0, 5);
    b.pendulum(83.3, 9, 7, { amp: 30, T: 4, w: 2.6 });   // a swinging crystal pad over the last gap
    b.plat(85, 2, 4);
    b.arc(81.5, 0, 85, 2, 2, 1.5);
    b.plat(92, 3, 4); b.plat(99, 1, 10);
    b.goal(105, 1);
    b.thin(91.5, 7.2, 2); b.shard(92.5, 8.8);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 2 ── shattering glass: panes break behind you, and a shard glints under a glass floor
  L('Shattered Panes', 'intro', (b) => {
    b.start(-6, 0, 12);
    b.crumble(9, 0, 3); b.crumble(15, 1, 3); b.crumble(21, 0, 3);
    b.cells(10.5, 1.5, 22.5, 1.5, 3);
    b.plat(27, 0, 5);
    b.wrecker(39, 9, 6.3, { amp: 45, T: 3.2 });   // a loose geode swings over the glass floor
    for (let i = 0; i < 7; i++) b.crumble(32 + i * 2, 0, 2);      // a glass floor: don't stop running
    b.cells(33, 1.2, 45, 1.2, 6);
    b.plat(44, -4.5, 3); b.shard(45.5, -3.3);                      // seen through the glass
    b.plat(50, 0, 6);
    b.checkpoint(53, 0);
    // a zig-zag of panes up to a crystal perch
    b.crumble(57, 2.5, 2.4); b.crumble(62, 5, 2.4); b.crumble(57, 7.5, 2.4); b.crumble(62, 10, 2.4);
    b.cells(58.2, 4, 63.2, 11.5, 4);
    b.plat(67, 11, 5);
    b.vine(70.5, 19, 5);                          // a light strand to the lonely pane
    b.crumble(73.5, 14, 1.6); b.shard(74.3, 16);                  // one lonely pane over the void
    b.crumble(76, 9, 2.4); b.crumble(81, 7, 2.4); b.crumble(86, 5, 2.4);
    b.cells(77, 10.5, 87, 6.5, 4);
    b.plat(91, 4, 10);
    b.goal(97, 4);
    b.crumble(-13.5, 3, 2.4); b.shard(-12.3, 5);
  }),

  // 3 ── mirror pairs: ride a pad until it meets its reflection, then step across; finish on a relay of two
  L('Looking-Glass Lake', 'intro', (b) => {
    b.start(-6, 0, 12);
    b.mirror(8, 0, 3, { w: 3, T: 4 });                  // meet at 14, far edge 20
    b.plat(21, 0, 4);
    b.mirror(26.5, 0, 6, { w: 3, T: 5 });               // meet at 35.5, far edge 44.5
    b.shard(35.5, 4.6);                                  // leap from the meeting point
    b.plat(46, 1, 5);
    b.checkpoint(48.5, 1);
    b.mirror(53, 1, 8, { w: 2.6, T: 5.5 });             // meet at 63.6
    b.thin(62.1, 4.6, 3); b.cells(62.6, 5.6, 64.6, 5.6, 3);
    b.thin(62.6, 9, 2); b.shard(63.6, 10.6);
    b.plat(75.5, 1, 5);
    // relay: the first reflection hands you straight to the next pad
    b.mirror(82, 1, 3, { w: 2.6, T: 3.5 });             // far edge 93.2
    b.mirror(94.2, 1, 3, { w: 2.6, T: 3.5 });           // far edge 105.4
    b.cells(84, 2.2, 104, 2.2, 6);
    b.plat(107, 2, 8);
    b.zip(84, 7, 104, 4);                         // a light rail over the relay
    b.floater(117, 2, 3, { rise: 7, speed: 2 }); b.plat(121, 9, 4); b.cells(121.5, 10.5, 124, 10.5, 3);    b.goal(112, 2);
    b.plat(-14, 2, 3); b.shard(-12.5, 4);
  }),

  // 4 ── prism-cannon pods: a pod chain over the crystal sea, a spinning pod, a mirror pad that hands you to a rocking pod, a pod ladder up a spire
  L('Prism Cannons', 'pods', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 4);
    b.barrel(12.5, 2.2, { angle: 40 });                    // pod 1: hop in, press jump
    b.plat(22, 1, 6);
    b.barrel(28, 3.2, { angle: 15 });                      // the chain: pod -> pod -> pod
    b.barrel(34, 3.2, { angle: 15 });
    b.barrel(40, 3.2, { angle: 45 });
    b.plat(48, 2, 6);
    b.checkpoint(51, 2);
    b.barrel(58, 5, { spin: 100 });                        // a spinning prism: fire when it faces the ledge
    b.plat(63, -0.5, 2.5); b.shard(64.2, 1.5);             // fire it low for a drowned crystal
    b.plat(64, 7, 4);
    b.mirror(69, 7, 4, { w: 2.8, T: 4 });                  // meet at 76.8
    b.barrel(84, 9, { angle: 70, sweep: 35, spin: 100, power: 20 });   // a rocking pod
    b.plat(78, 14, 2.5); b.shard(79.2, 16);
    b.plat(92, 12, 5);
    b.barrel(99, 15, { angle: 90, power: 22 });            // pod ladder
    b.barrel(99, 20.5, { angle: 90, power: 22 });
    b.barrel(99, 26, { spin: 90 });
    b.shard(99, 31);
    b.plat(106, 23, 9);
    b.goal(112, 23);
    b.arc(3, 0, 11, 2, 2, 1); b.arc(13, 2.2, 23, 1.5, 3, 2); b.cells(29, 3.4, 39, 3.4, 3); b.cells(52, 3, 56, 4, 2);
    b.arc(70, 8.5, 80, 8.5, 3, 2); b.cells(99, 17.5, 99, 23.5, 3); b.arc(100, 26, 108, 24, 3, 1);
  }),

  // 5 ── flick-flack: prism lights that alternate, so you always jump onto the one lighting up
  L('Prism Flicker', 'timing', (b) => {
    b.start(-6, 0, 12);
    for (let i = 0; i < 6; i++) b.blink(9 + i * 5.5, 0, 3, { P: 3, on: 1.5, off: (i % 2) * 1.5 });
    b.cells(10.5, 1.4, 38, 1.4, 6);
    b.plat(23, -3.5, 2.5); b.shard(24.2, -2.4);          // between the lights, below
    b.plat(42, 0, 6);
    b.sweeper(17.8, 3.3, 2.0, { omega: 80 }); b.sweeper(34, 3.3, 2.0, { omega: -80 });   // prisms spinning in the gaps
    b.checkpoint(45, 0);
    // the same flick-flack, climbing
    for (let i = 0; i < 4; i++) b.blink(i % 2 ? 55 : 50, 2.5 + i * 2.5, 3, { P: 3, on: 1.5, off: (i % 2) * 1.5 });
    b.blink(50, 12.5, 3, { P: 3, on: 1.5 }); b.shard(51.5, 14.5);
    b.cells(51.5, 4, 56.5, 11.5, 4);
    b.plat(60, 12.5, 4);
    b.wrecker(73, 24, 9, { amp: 45, T: 3.4 });    // a geode swinging over the light bridge
    b.bridge(64, 12.5, 18);
    b.cells(66, 13.5, 80, 13.5, 6);
    b.thin(71, 16.5, 3); b.shard(72.5, 18);
    b.plat(82, 12.5, 10);
    b.goal(88, 12.5);
  }),
  // 6 ── a glass staircase tower: thin ledges, a laser across the shattering upper flight, then a bridge out
  L('Spectrum Stair', 'ascent', (b) => {
    b.start(-6, 0, 12);
    b.tower(7, -2, 22, 30);
    b.thin(9, 3, 4); b.thin(15, 6, 4); b.thin(9, 9, 4); b.thin(15, 12, 4);
    b.cells(11, 4, 17, 13, 4);
    b.plat(19, 14.5, 8.8);
    b.checkpoint(21, 14.5);
    // side chimney for the brave
    b.wall(24, 16.5, 7); b.wall(27.8, 14.5, 9);
    b.tornado(25.2, 26.6, 14.5, { rise: 10, T: 4 });   // a whirlwind in the chimney
    b.cells(26.3, 17, 26.3, 22, 3); b.shard(26.3, 24.6);
    // laser sweeps the shattering flight
    b.rect(6.8, 13, 1.2, 10); b.turret(8.2, 17.8, 1, { P: 2.4 });
    b.shard(7.4, 24.6);
    b.crumble(13, 17, 2.4); b.crumble(9, 19.5, 2.4); b.crumble(14, 22, 2.4); b.crumble(10, 24.5, 2.4);
    b.plat(15, 27, 6);
    b.bridge(21, 27, 16);
    b.cells(23, 28, 35, 28, 5);
    b.plat(37, 27, 4); b.plat(44, 23, 4);
    b.zip(41, 31, 55, 21);                        // a light rail over the stepping stones
    b.plat(51, 19, 9);
    b.goal(56, 19);
    b.plat(-13, -3, 3); b.shard(-11.5, -2);
  }),

  // 7 ── beam ridge: rolling crystal ridges with spinning prisms hung in every valley, refracted light to time your jump through
  L('Beam Ridge', 'gauntlet', (b) => {
    b.start(-6, 0, 12);
    b.block(8, 1, 10);
    b.sweeper(22, 4.2, 3, { omega: 70 });                  // a single spinning arm over the first valley
    b.block(26, 3, 6);
    b.block(34, 0, 12); b.enemy('spiker', 35, 0, { range: 9, speed: 2.4 });
    b.thin(35.5, 4.5, 9); b.cells(36, 5.5, 44, 5.5, 5);
    b.shard(40, 9);
    b.sweeper(51, 4.5, 3.2, { omega: -80, both: true });   // a full bar turning between the ridges
    b.block(56, 2, 6);
    b.checkpoint(59, 2);
    b.block(64, 4, 26);                                    // the long spine: a crossing pair of prisms
    b.sweeper(71, 8, 2.6, { omega: 75, both: true });
    b.sweeper(76.5, 8, 2.6, { omega: -75, both: true, a0: 45 });
    b.thin(66, 7.5, 3); b.thin(73.5, 11.5, 2.5); b.thin(82, 7.5, 3);
    b.shard(74.7, 13.2);                                   // high over the crossing prisms
    b.cells(66, 5.2, 88, 5.2, 7);
    b.block(96, 1, 8); b.enemy('walker', 97, 1, { range: 6, speed: 2 });
    b.sweeper(107, 3.5, 3, { omega: 85 });
    b.block(111, 3, 10);
    b.goal(117, 3);
    b.plat(-15, 2.5, 3); b.shard(-13.5, 4.5);
  }),

  // 8 ── lasers sweep long light bridges: jump the bolts, or take the upper bridge you light mid-leap
  L('Laser Lattice', 'gauntlet', (b) => {
    b.start(-6, 0, 12);
    b.bridge(6, 0, 22);
    b.cells(8, 1, 26, 1, 6);
    b.sweeper(14, 3.4, 2.6, { omega: 70, both: true }); b.sweeper(20, 3.4, 2.6, { omega: -70, both: true, a0: 45 });   // a crossing pair
    b.plat(28, 0, 6); b.rect(30, 0, 1.6, 2.2); b.turret(30.8, 0.8, -1, { P: 2.2 });
    b.bridge(34, 0, 20);
    b.bridge(38, 4.5, 16);                               // lit only by leaping up into it
    b.cells(40, 5.5, 52, 5.5, 5); b.shard(46, 6.6);
    b.plat(54, 0, 8);
    b.thin(56, 3.5, 2.5);
    b.rect(60, 0, 1.4, 6.5); b.turret(60.7, 0.8, -1, { P: 2.6 }); b.turret(60.7, 5.3, -1, { P: 2.6, off: 1.3 });
    b.shard(60.7, 9);
    b.plat(64, 4, 6);
    b.checkpoint(67, 4);
    b.bridge(70, 4, 24);
    b.thin(76, 7.5, 3); b.thin(85, 7.5, 3);
    b.sweeper(82, 8, 2.6, { omega: 65, both: true });    b.cells(72, 5, 92, 5, 7);
    b.plat(94, 4, 10); b.rect(102, 4, 1.4, 4); b.turret(102, 4.8, -1, { P: 1.8 });
    b.goal(98, 4);
    b.plat(-14, -2.5, 3); b.shard(-12.5, -1.5);
  }),

  // 9 ── kaleidoscope wheels: ride rings of crystal pads, a mirror pair, then two wheels that interlock
  L('Kaleidoscope Wheels', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.ferris(16, 1, 5, { n: 4, omega: 0.6 });
    b.plat(25, 2, 5);
    b.mirror(32, 2, 5, { w: 2.8, T: 4.5 });             // meet at 39.8, far edge 47.6
    b.shard(39.8, 6.8);
    b.plat(49, 2, 5);
    b.checkpoint(51.5, 2);
    b.ferris(64, 4, 7, { n: 6, omega: -0.5 });
    b.shard(64, 4.5);                                    // the hub of the big wheel
    b.cell(64, 13);
    b.plat(74, 6, 4);
    b.vine(79.5, 14, 6);                          // a light strand across to the twin wheels
    b.ferris(85, 6, 4, { n: 3, omega: 0.8 });
    b.ferris(94, 9, 4, { n: 3, omega: -0.8 });
    b.cells(81, 11, 98, 14, 5);
    b.plat(100, 10, 8);
    b.goal(105, 10);
    b.thin(-12, 4, 3); b.shard(-10.5, 5.6);
  }),

  // 10 ── CHASE: the Shatter Wave! light bridges and breaking glass, never a reason to stop
  L('Shatter Wave', 'chase', (b) => {
    b.chase({ speed: 3.9 });
    b.start(-6, 0, 14);
    b.bridge(8, 0, 14);
    b.thin(14, 3.8, 3); b.shard(15.5, 5.4);
    b.crumble(24, 1, 3); b.crumble(30, 2, 3); b.crumble(36, 1, 3);
    b.arc(22, 0, 42, 1, 6, 1.6);
    b.plat(42, 1, 5);
    b.bridge(47, 1, 12);
    b.plat(59, 1, 4); b.spring(60.5, 1, 6);
    b.shard(63.5, 11.5);
    b.plat(66, 7, 5);
    b.checkpoint(68, 7);
    b.bridge(71, 7, 14);
    b.cells(73, 8, 83, 8, 5);
    b.crumble(87, 5, 2.5); b.crumble(92, 3, 2.5); b.crumble(97, 1, 2.5);
    b.zip(86, 8, 104, 3);                         // or ride the light rail over the glass
    b.plat(102, 1, 4);
    b.bridge(106, 1, 10);
    b.plat(116, 1, 10);
    b.goal(122, 1);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 11 ── an invisible causeway: every step is a light bridge you only see once you leap into it
  L('Invisible Causeway', 'precision', (b) => {
    b.start(-6, 0, 12);
    b.bridge(9, 2.5, 5); b.bridge(17, 5, 5); b.bridge(25, 7.5, 5); b.bridge(33, 10, 5);
    b.arc(6, 0, 35, 10, 8, 1.5);
    b.sweeper(15.5, 6.4, 2.2, { omega: 70 }); b.sweeper(31.5, 10.8, 2.2, { omega: -70 });   // refracted beams between the invisible steps
    b.vine(76.5, 9, 6);                                  // a light strand over the leap of faith
    b.bridge(36, 14.5, 3); b.shard(37.5, 16);
    b.plat(41, 10, 6);
    b.checkpoint(44, 10);
    // now the steps drop away: fall into the light and it catches you
    b.bridge(50, 7, 6); b.bridge(59, 4, 6); b.bridge(68, 1, 6);
    b.bridge(54, 0, 3); b.shard(55.5, 1.4);
    b.cells(48, 9, 72, 2, 7);
    b.bridge(80, -1, 12);                                // leap of faith
    b.arc(74, 1, 82, -1, 3, 2);
    b.plat(95, 1, 10);
    b.goal(101, 1);
    b.bridge(-14, 2, 4); b.shard(-12, 3.6);
  }),

  // 12 ── drop down through a geode: chamber after chamber, glass skylights, a crawler and a laser
  L('Geode Descent', 'descent', (b) => {
    b.start(-6, 30, 12);
    b.rect(6, -1, 1.5, 27);                              // geode walls
    b.rect(27, 2, 1.5, 13); b.rect(27, 17, 1.5, 15);     // a window at the third chamber
    b.plat(7.5, 25, 13);
    b.cells(9, 26, 19, 26, 4);
    b.plat(15, 20, 12); b.crumble(7.5, 20, 3.5);         // glass skylight
    b.shard(9.2, 21.4);
    b.plat(7.5, 15, 13); b.enemy('spiker', 8, 15, { range: 10, speed: 2 });
    b.sweeper(14, 18.6, 2.4, { omega: 70 });             // a turning prism in the crawler's chamber
    b.plat(28.5, 15, 4); b.shard(31, 16.5);              // out through the window
    b.plat(12, 10, 15); b.turret(7.6, 10.8, 1, { P: 2.4 });
    b.checkpoint(15, 5);
    b.cells(13, 11, 25, 11, 5);
    b.plat(7.5, 5, 13); b.cells(9, 6, 19, 6, 4);
    b.plat(7.5, 0, 24);
    b.cells(21, 1, 30, 1, 4);
    b.crumble(34, -2, 2.5); b.crumble(39, -4, 2.5);
    b.vine(36.5, 6, 5);                                  // a light strand over the glass
    b.plat(44, -5, 10);
    b.goal(50, -5);
    b.thin(-12, 27, 3); b.shard(-10.5, 28.5);
  }),

  // 13 ── a hall of mirrors stacked three high: ride right, spring up, ride back left, spring up, ride right
  L('Hall of Mirrors', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.mirror(7.5, 0, 8, { w: 3, T: 5 });                 // floor 1 → meet 18.5
    b.plat(17, -4, 3); b.shard(18.5, -3);
    b.plat(31, 0, 7); b.spring(35.5, 0, 6.5);
    b.plat(29, 6.5, 5);
    b.mirror(8, 6.5, 7, { w: 3, T: 5 });                 // floor 2, ridden right-to-left
    b.shard(18, 10.2);
    b.plat(1, 6.5, 5.5); b.spring(2, 6.5, 6);
    b.plat(5, 12.5, 5);
    b.mirror(11.5, 12.5, 9, { w: 3, T: 5.5 });           // floor 3 → far edge 35.5
    b.thin(22, 16.5, 3); b.shard(23.5, 18);
    b.cells(10, 1.2, 27, 1.2, 5); b.cells(26, 7.7, 10, 7.7, 5); b.cells(13, 13.7, 33, 13.7, 5);
    b.plat(37, 12.5, 6);
    b.checkpoint(40, 12.5);
    b.sweeper(60, 11.8, 2.4, { omega: 70, both: true });  // refracted beams over the last mirror ride
    b.sweeper(80, 9.8, 2.4, { omega: -70, both: true });
    b.plat(47, 9, 4);
    b.mirror(53, 7, 4, { w: 2.6, T: 4 });                // far edge 66.2
    b.plat(67.5, 5, 4);
    b.mirror(73, 5, 4, { w: 2.6, T: 4 });                // far edge 86.2
    b.cells(55, 8, 84, 6, 6);
    b.plat(87.5, 4, 8);
    b.goal(92, 4);
  }),

  // 14 ── the crystal sea rises: chimney, spring, a mirror crossing at altitude, a second chimney, out on a bridge
  L('Prism Tide', 'tide', (b) => {
    b.rise({ rate: 0.6, delay: 5 });
    b.start(-6, 0, 12);
    b.tower(6, -4, 44, 50);
    b.plat(6, 0, 8);
    b.wall(9, 2, 11); b.wall(12.8, 0, 13);               // walk under the left wall into the chimney
    b.cells(11.3, 3, 11.3, 11, 4);
    b.sweeper(14, 23.8, 2.4, { omega: 65 });
    b.plat(13.6, 13, 4); b.spring(15.5, 13, 6);
    b.plat(4, 15, 3); b.shard(5.5, 16.5);
    b.plat(10, 20, 4);
    b.thin(16, 23, 4); b.thin(10, 26, 4);
    b.plat(16, 29, 6);
    b.checkpoint(19, 29);
    b.mirror(23.5, 29, 5, { w: 2.8, T: 4 });             // meet at 31.3
    b.shard(31.3, 33.5);
    b.plat(40.5, 29, 6);
    b.wall(43, 31, 12); b.wall(46.8, 29, 14);
    b.cells(45.3, 32, 45.3, 41, 4);
    b.plat(47.6, 43, 5);
    b.bridge(52.6, 43, 12);
    b.wrecker(58.5, 55, 7.6, { amp: 45, T: 3.2 });        // a geode swinging over the bridge
    b.thin(57, 47, 3); b.shard(58.5, 48.6);
    b.plat(64.6, 43, 8);
    b.goal(70, 43);
  }),

  // 15 ── spinning prisms: crossing pairs of refracted beams over a light-bridge causeway, then a floater climb through a third
  L('Spinning Prisms', 'gauntlet', (b) => {
    b.start(-6, 0, 12);
    b.bridge(8, 0, 20); b.bridge(33, 0, 15);               // a long causeway of light, with a drop-hole
    b.sweeper(17, 3.2, 2.7, { omega: 80, both: true });
    b.sweeper(22.5, 3.2, 2.7, { omega: -80, both: true, a0: 45 });   // a crossing pair
    b.cells(10, 1, 46, 1, 12);
    b.shard(19.5, 4.8);                                     // snatch it between the beams
    b.plat(29.5, -3, 3); b.shard(31, -1.9);                // under the bridge
    b.sweeper(35, 3.4, 2.8, { omega: 60, both: true });
    b.sweeper(41, 3.4, 2.8, { omega: -60, both: true });
    b.plat(50, 0, 8);
    b.checkpoint(53, 0);
    b.floater(60, 1, 3, { rise: 8, speed: 2.4 });          // a light bubble up to the high deck
    b.plat(66, 9, 5);
    b.sweeper(73, 11.5, 3, { omega: 70 });
    b.plat(78, 9, 4);
    b.sweeper(84.2, 11.5, 3, { omega: -70 });
    b.plat(88, 9, 3);
    b.sweeper(92.5, 11.5, 3, { omega: 70, a0: 90 });
    b.plat(96, 9, 8);
    b.thin(98, 13, 3); b.cells(98.5, 14, 100.5, 14, 3);
    b.goal(101, 9);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 16 ── swinging geodes: crystal geodes hang on light strands over the void; ride the pendulums, swing the strands, dodge the wrecking geode
  L('Swinging Geodes', 'swing', (b) => {
    b.start(-6, 0, 12);
    b.pendulum(14, 10, 8, { amp: 35, T: 4, w: 3 });        // first geode
    b.plat(22, 2, 3);
    b.vine(29, 12, 7);                                     // a light strand
    b.plat(36, 3, 3);
    b.pendulum(43, 11.5, 8, { amp: 38, T: 4 });
    b.pendulum(51, 12.5, 8, { amp: 38, T: 4, phase: 0.5 });   // a pair, half a beat apart
    b.plat(58, 4, 5);
    b.checkpoint(60, 4);
    b.wrecker(66, 14, 6.5, { amp: 50, T: 3 });             // a loose geode swinging across the walkway
    b.plat(63.5, 4, 5);
    b.vine(72, 13, 7); b.vine(80, 13, 7);                  // strand to strand
    b.plat(86, 4, 3);
    b.pendulum(93, 12, 8.5, { amp: 40, T: 4.4 });
    b.plat(100, 4, 8);
    b.goal(106, 4);
    b.shard(29, 8.5);                                      // hanging beside the first strand
    b.thin(43, 8.5, 2.5); b.shard(44.2, 10.2);             // above the swinging pair
    b.cells(10, 2.5, 20, 2.5, 3); b.cells(24, 4, 34, 4, 3); b.arc(60, 5, 70, 5, 3, 2); b.arc(74, 6, 84, 6, 3, 3); b.cells(95, 4, 99, 4, 2);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 17 ── a crystal shaft of lifts, lasers firing across from alternating walls
  L('Lumen Shaft', 'ascent', (b) => {
    b.start(-6, 0, 12);
    b.rect(7, 3, 1.2, 32); b.rect(22, 0, 1.2, 30);       // shaft walls (walk in under the left one)
    b.plat(6, 0, 16);
    b.lift(12, 1, 10, { T: 5 });
    b.turret(21.9, 5.8, -1, { P: 2.5 });
    b.plat(19, 5, 3); b.shard(20.5, 6.6);                // right in the laser's line
    b.plat(16, 10, 6);
    b.lift(11, 10, 20, { T: 5 });
    b.turret(8.3, 15.8, 1, { P: 2.5, off: 1 });
    b.plat(8.2, 20, 5);
    b.checkpoint(10, 20);
    b.lift(17, 20, 30, { T: 5 });
    b.turret(21.9, 25.8, -1, { P: 2.2 });
    b.shard(17, 34);
    b.cells(12, 3, 12, 9, 3); b.cells(11, 12, 11, 19, 3); b.cells(17, 22, 17, 29, 3);
    b.sweeper(15, 16.8, 2.4, { omega: 70 });             // a prism turning over the middle ledge
    b.zip(38.5, 33.5, 52, 24);                           // a light rail over the stepping stones
    b.plat(19, 30, 4.2);
    b.bridge(23.2, 30, 14);
    b.cells(25, 31, 35, 31, 4);
    b.plat(37.2, 30, 4); b.plat(44, 26, 4);
    b.plat(51, 22, 8);
    b.goal(56, 22);
    b.crumble(-13, 2.5, 2); b.shard(-12, 4.5);
  }),

  // 18 ── crystal bats roost over the bridges and the mirror line; stomp them or slip under
  L('Crystal Roost', 'enemies', (b) => {
    b.start(-6, 0, 12);
    b.bridge(6, 0, 16);
    b.enemy('flyer', 12, 2.5, { ax: 0, ay: 1.5, T: 2.4 }); b.enemy('flyer', 18, 3, { ax: 1.5, ay: 0.5, T: 2 });
    b.shard(15, 4.4);
    b.plat(22, 0, 5);
    b.mirror(28.5, 0, 5, { w: 2.8, T: 4.5 });            // meet at 36.3
    b.enemy('flyer', 36.3, 3, { ax: 0.5, ay: 1.2, T: 2.2 });
    b.shard(36.3, 4.8);
    b.plat(45.5, 1, 6);
    b.checkpoint(48, 1);
    b.tornado(52.8, 53.2, 1, { rise: 11, h: 15, T: 4 });  // a whirlwind between the roosts
    b.zip(86, 16, 98, 8);
    b.thin(54, 4.5, 3); b.thin(59, 8, 3); b.thin(54, 11.5, 3);
    b.enemy('flyer', 57, 7, { ax: 2, ay: 0.5, T: 3 }); b.enemy('flyer', 57, 11, { ax: 2, ay: 0.5, T: 2.5 });
    b.shard(55.5, 15.5);
    b.plat(60, 13, 6);
    b.bridge(66, 13, 16);
    b.enemy('flyer', 71, 15, { ax: 2, ay: 1, T: 2.6 }); b.enemy('flyer', 77, 14.5, { ax: 1, ay: 1.5, T: 2 });
    b.cells(8, 1, 20, 1, 4); b.cells(68, 14, 80, 14, 5); b.cells(55, 5.5, 56, 12.5, 3);
    b.plat(82, 13, 4); b.plat(89, 9, 4);
    b.plat(96, 6, 8);
    b.goal(101, 6);
  }),

  // 19 ── light rail: slide down glowing cables between crystal stations, a whirlwind lifts you back up, a wrecking geode guards the long line
  L('Light Rail', 'speed', (b) => {
    b.start(-6, 24, 12);
    b.zip(7, 27, 26, 21);                                  // first rail
    b.plat(27, 19, 5);
    b.plat(31, 13, 3); b.shard(32.2, 14.6);                // a low platform beside the whirlwind
    b.tornado(35, 39, 17, { rise: 9, T: 5 });              // the whirlwind lifts you to the upper station
    b.plat(43, 28, 4);
    b.zip(49, 31, 70, 24);                                 // a long rail under a swinging geode
    b.wrecker(59, 38, 8.5, { amp: 50, T: 3 });
    b.plat(72, 22, 6);
    b.checkpoint(75, 22);
    b.floater(80, 22, 3, { rise: 9, speed: 2.4 });         // a light bubble up to the last station
    b.plat(84, 31, 3);
    b.zip(86, 34, 108, 25, { oneWay: true });              // the long ride home
    b.plat(110, 23, 10);
    b.goal(116, 23);
    b.shard(97, 28.9);                                     // hop the rail to snag it
    b.cells(9, 26, 24, 22, 5); b.cells(51, 30, 68, 25, 6); b.cells(88, 33, 106, 26, 6); b.cells(35, 18, 38, 24, 3);
    b.plat(-14, 22, 3); b.shard(-12.5, 24);
  }),

  // 20 ── CHASE: the Shatter Wave returns, faster: springs, light bridges, a glass staircase and a sprint to the end
  L('Rainbow Rush', 'chase', (b) => {
    b.chase({ speed: 4.3 });
    b.start(-6, 0, 14);
    b.plat(11, 1, 4);
    b.bridge(15, 1, 10);
    b.plat(25, 1, 4); b.spring(26.5, 1, 7);
    b.shard(29, 14);
    b.plat(31, 9, 5);
    b.bridge(36, 9, 12);
    b.thin(41, 13, 3); b.shard(42.5, 14.6);
    b.crumble(50, 7, 2.5); b.crumble(55, 5, 2.5); b.crumble(60, 3, 2.5);
    b.plat(65, 3, 6);
    b.checkpoint(68, 3);
    b.zip(49, 9, 66, 4.5);                               // light rails over the glass
    b.zip(109, 16, 121.5, 11.8);
    b.thin(74, 5, 3); b.thin(80, 7, 3); b.thin(86, 9, 3);
    b.bridge(89, 9, 14);
    b.plat(103, 9, 4); b.spring(104.5, 9, 5);
    b.crumble(110, 13, 2.5); b.crumble(115, 13, 2.5);
    b.plat(121, 10, 4);
    b.bridge(125, 10, 12);
    b.plat(137, 10, 10);
    b.goal(143, 10);
    b.cells(16, 2, 24, 2, 4); b.cells(38, 10, 46, 10, 4); b.cells(75, 6, 87, 10, 4); b.cells(127, 11, 135, 11, 4);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 21 ── chandelier cavern: crystal chandeliers swing from the roof, sinking shards give way underfoot, light bubbles lift you out the top
  L('Chandelier Cavern', 'swing', (b) => {
    b.start(-6, 0, 12);
    b.rect(8, 13, 62, 2);                                  // the cavern roof
    b.pendulum(15, 13, 12, { amp: 28, T: 4.4, w: 3 });     // chandelier 1
    b.plat(23, 0, 3);
    b.sinker(29, 0.5, 3, { depth: 3 });                    // shards that sink: don't stop
    b.sinker(35, 0, 3, { depth: 3 });
    b.sinker(41, 0.5, 3, { depth: 3 });
    b.plat(46, 1, 5);
    b.checkpoint(48.5, 1);
    b.pendulum(55, 13, 12, { amp: 30, T: 4.2 });           // a pair of chandeliers, out of step
    b.pendulum(62, 13, 12, { amp: 30, T: 4.2, phase: 0.5 });
    b.plat(69, 1, 4);
    b.floater(75, 1, 3, { rise: 9, speed: 2.4 });          // a light bubble through the roof gap
    b.plat(80, 10, 4);
    b.wrecker(87, 22, 9, { amp: 50, T: 3.2 });             // a falling chandelier on the way out
    b.plat(86, 10, 3);
    b.pendulum(95, 20, 9, { amp: 35, T: 4 });
    b.plat(102, 10, 8);
    b.goal(108, 10);
    b.plat(30, -6, 3); b.shard(31.5, -4.8);                // below the sinking shards: drop in, bounce out
    b.thin(58.5, 5.3, 2.5); b.shard(59.7, 7);                // between the chandeliers
    b.cells(10, 1.2, 21, 1.2, 4); b.cells(48, 2.5, 66, 2.5, 5); b.arc(82, 11, 100, 11, 5, 2);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 22 ── a refraction spire: every landing flips the ledges you just climbed; the summit needs button stepping-stones
  L('Refraction Spire', 'puzzle', (b) => {
    b.start(-6, 0, 12);
    b.tower(5, -2, 23, 38);
    b.plat(6, 0, 18);
    b.red(18, 3, 3); b.red(13, 5.5, 3);
    b.plat(6, 8, 5); b.switch(8, 8);
    b.blue(19, 5.5, 2); b.shard(20, 7.4);                // a blue ledge you can only use after the press
    b.blue(13, 10.5, 3); b.blue(18, 13, 3);
    b.plat(19, 15.5, 5); b.switch(22.3, 15.5);
    b.checkpoint(20, 15.5);
    b.red(14, 18, 3); b.red(8.5, 20.5, 3);
    b.plat(6, 23, 5);
    // the summit: each button you land on reveals the next ledge
    b.switch(12.5, 25.2); b.blue(17, 27.5, 3);
    b.switch(12.5, 30); b.red(17, 32.5, 3);
    b.plat(21, 35, 6);
    b.thin(23, 39.5, 2); b.shard(24, 41);
    b.cells(14.5, 7, 19.5, 14.5, 4); b.cells(15.5, 19.5, 10, 22, 2); b.cells(14, 27, 19, 34, 4);
    b.mirror(28.5, 35, 5, { w: 2.8, T: 4 });             // far edge 44.1
    b.sweeper(24, 29.5, 2.6, { omega: 60 });             // a prism turning beside the summit buttons
    b.plat(45.5, 33, 8);
    b.goal(50, 33);
    b.thin(-12, 3, 3); b.shard(-10.5, 4.6);
  }),

  // 23 ── prism pendulums swing low over the void; cannons fire at the top of each swing, so ride the bottom
  L('Prism Pendulums', 'timing', (b) => {
    const pend = (cx, top, s, ph) => b.loop([[cx - 5, top + 1.5], [cx - 2.5, top], [cx, top - 0.5], [cx + 2.5, top], [cx + 5, top + 1.5]], { loop: false, speed: s, w: 2.6, phase: ph });
    b.start(-6, 0, 12);
    pend(13, 0, 3, 0);
    b.plat(20, 2, 2); b.shard(21, 6.5);
    pend(29, 0, 3.4, 0.5);
    b.plat(35.5, 2, 5); b.rect(39, 2, 1.4, 3); b.turret(39, 2.8, -1, { P: 2.4 });
    b.shard(39.7, 6.6);
    b.checkpoint(40, 2);
    b.wrecker(18, 10.5, 5.2, { amp: 45, T: 3 });         // a geode guarding the first shard
    b.sweeper(56.5, 10, 2.4, { omega: 70 });
    pend(47, 2, 3.2, 0.25);
    b.thin(45.5, 7, 3); b.shard(47, 8.6);
    b.plat(53, 4, 1.6);
    pend(61, 3.5, 3.6, 0.75);
    b.plat(67.5, 5, 8); b.rect(76, 4, 1.4, 4); b.turret(76, 6.3, -1, { P: 2 });
    b.cells(9, 1.6, 17, 1.6, 3); b.cells(25, 1.6, 33, 1.6, 3); b.cells(43, 3.6, 51, 3.6, 3); b.cells(57, 5, 65, 5, 3);
    b.goal(72, 5);
  }),

  // 24 ── fractured sky: springs fling you up into light bridges hanging in the air; fall, bounce, climb higher
  L('Fractured Sky', 'bounce', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 4); b.spring(9.5, 0, 10);
    b.plat(17, 1, 3); b.shard(18.5, 2.5);               // tucked under the first bridge
    b.bridge(14, 9, 10);
    b.cells(10.4, 4, 10.4, 9, 3); b.cells(16, 10, 22, 10, 3);
    b.plat(28, 3, 4); b.spring(30, 3, 9);
    b.bridge(34, 13, 12);
    b.thin(38, 17, 3); b.shard(39.5, 18.6);
    b.plat(50, 5, 6); b.spring(53.5, 5, 7);
    b.checkpoint(51.5, 5);
    b.barrel(48.5, 14, { angle: -30 });                  // a pod on the bridge end: drop-fire down to the next spring
    b.tornado(75, 77, 12, { rise: 10, T: 4 });
    b.plat(58, 13, 4); b.spring(60, 13, 6);
    b.bridge(64, 20, 12);
    b.shard(70, 24.4);
    b.cells(36, 14, 44, 14, 4); b.cells(66, 21, 74, 21, 4);
    b.plat(80, 12, 4);
    b.plat(88, 8, 10);
    b.goal(93, 8);
  }),

  // 25 ── bubble cascade: light bubbles rise and crystal shards sink: hop from bubble to bubble up a glowing waterfall, then drop down the sinkers
  L('Bubble Cascade', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.floater(10, 0, 3, { rise: 8, speed: 2.2 });
    b.plat(14, 8, 3);
    b.floater(19, 8, 3, { rise: 8, speed: 2.2 });
    b.plat(23, 16, 3);
    b.floater(28, 16, 3, { rise: 7, speed: 2.2 });
    b.plat(33, 23, 5);
    b.checkpoint(36, 23);
    b.sinker(42, 23, 3, { depth: 5, speed: 1.4 });         // now the shards sink you back down
    b.sinker(48, 20, 3, { depth: 5, speed: 1.4 });
    b.sinker(54, 17, 3, { depth: 5, speed: 1.4 });
    b.plat(60, 10, 5);
    b.switch(62, 10);
    b.red(67, 10, 3); b.red(72, 12, 3);
    b.floater(77, 10, 3, { rise: 6, speed: 2 });           // bubble riders
    b.blue(83, 15, 3);
    b.plat(88, 15, 8);
    b.goal(93, 15);
    b.thin(16, 14, 3); b.shard(17.5, 15.6);                // between the first two bubbles
    b.plat(51, 7, 3); b.shard(52.5, 8.6);                  // under the sinkers
    b.cells(10, 2, 10, 7, 3); b.cells(19, 10, 19, 15, 3); b.cells(36, 24.5, 56, 19, 6); b.cells(68, 11.5, 86, 16.5, 5);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 26 ── mirror pairs under cannon fire: wait out the bolts on a moving pad, then step through the reflection
  L('Mirror Cannonade', 'gauntlet', (b) => {
    b.start(-6, 0, 12);
    b.mirror(7.5, 0, 6, { w: 3, T: 4.5 });               // meet 16.5, far 25.5
    b.plat(27, 0, 6); b.rect(31, 0, 1.4, 2.4); b.turret(31, 0.8, -1, { P: 2.2 });
    b.mirror(34.5, 1, 7, { w: 2.8, T: 5 });              // meet 44.3, far 54.1
    b.shard(44.3, 5.6);                                  // right in the upper cannon's line
    b.plat(55.5, 1, 6); b.rect(59.5, 1, 1.4, 6);
    b.turret(59.5, 1.8, -1, { P: 2.4 }); b.turret(59.5, 4.6, -1, { P: 2.4, off: 1.2 });
    b.thin(57, 4.5, 2);
    b.shard(60.2, 8.6);
    b.plat(63, 5, 5);
    b.checkpoint(65, 5);
    b.barrel(29, 2.4, { angle: 60, sweep: 25, spin: 80 }); b.plat(40, 9, 4); b.cells(40.5, 10.5, 43.5, 10.5, 3);   // a rocking prism pod flings you up to a high glass shelf
    b.sweeper(98, 10.2, 2.6, { omega: 70 });
    b.mirror(69.5, 5, 3, { w: 2.6, T: 3.6 });            // relay: far 80.7
    b.mirror(81.7, 5, 3, { w: 2.6, T: 3.6 });            // far 92.9
    b.plat(94.4, 5, 8); b.rect(101, 5, 1.4, 4); b.turret(101, 5.8, -1, { P: 2.6, range: 30 });
    b.cells(10, 1.2, 23, 1.2, 4); b.cells(37, 2.2, 52, 2.2, 5); b.cells(72, 6.2, 91, 6.2, 6);
    b.goal(98, 5);
    b.plat(-15, -2, 3); b.shard(-13.5, -1);
  }),

  // 27 ── whirlwind shaft: prismatic whirlwinds drift across a tall crystal shaft and refracted beams turn between them; ride the wind up
  L('Whirlwind Shaft', 'ascent', (b) => {
    b.start(-6, 0, 12);
    b.rect(5, 3, 1.2, 31); b.rect(27.5, 4, 1.2, 30);       // shaft walls (walk in under the left one)
    b.plat(6, 0, 21);
    b.tornado(14, 19, 0, { rise: 12.5, T: 5 });
    b.plat(6.5, 11.5, 4.5);                                // a side ledge
    b.plat(21.5, 13, 4.5);
    b.checkpoint(23.5, 13);
    b.sweeper(14.5, 17, 2.6, { omega: 60 });               // a turning beam in the updraft's path
    b.tornado(14, 19, 13, { rise: 12.5, T: 5, phase: 0.5 });
    b.plat(6.5, 24.5, 4.5);
    b.plat(21.5, 26, 4.5);
    b.sweeper(14.5, 30, 2.8, { omega: -65, both: true });
    b.tornado(14, 19, 26, { rise: 12.5, T: 5.5 });
    b.plat(6.5, 37.5, 4.5);
    b.plat(21.5, 38, 6);
    b.bridge(28.5, 38, 10);
    b.plat(41, 34, 4); b.plat(48, 30, 4);
    b.plat(55, 27, 8);
    b.goal(60, 27);
    b.shard(8.7, 13.3); b.shard(8.7, 39.4);                // rewards for the side ledges
    b.cells(14, 3, 16, 10, 3); b.cells(15, 14, 17, 22, 3); b.cells(15, 27, 17, 34, 3); b.cells(30, 39, 38, 39, 4);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 28 ── a spectral carousel: pads orbit crystal spires on diamond, square and triangle tracks
  L('Spectral Carousel', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.rect(13.2, -1, 1.6, 4.5); b.shard(14, 5);
    b.loop([[9, 2], [14, 7], [19, 2], [14, -3]], { speed: 3, w: 2.6 });
    b.loop([[9, 2], [14, 7], [19, 2], [14, -3]], { speed: 3, w: 2.6, phase: 0.5 });
    b.rect(28, -3, 2, 9);
    b.loop([[24, 0], [24, 8], [34, 8], [34, 0]], { speed: 3.2, w: 2.6 });
    b.loop([[24, 0], [24, 8], [34, 8], [34, 0]], { speed: 3.2, w: 2.6, phase: 0.5 });
    b.plat(38, 4, 5);
    b.checkpoint(40.5, 4);
    b.sweeper(56, 16.5, 2.6, { omega: 60 });             // a prism guarding the shard above the triangle
    b.rect(55, -2, 2, 8);
    for (let i = 0; i < 3; i++) b.loop([[46, 4], [56, 12], [66, 4]], { speed: 3.5, w: 2.6, phase: i / 3 });
    b.shard(56, 15.5);
    b.ferris(74, 6, 4, { n: 4, omega: 0.7 });
    b.cells(14, 8, 14, 8, 1); b.cells(25, 9, 33, 9, 3); b.cells(49, 7, 63, 7, 4); b.cell(74, 11);
    b.plat(81, 8, 8);
    b.goal(86, 8);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 29 ── HARD: a kaleidoscope of everything: glass under crossfire, mid-air light, a guarded mirror, a button lock, slick glass
  L('Kaleidoscope Gauntlet', 'gauntlet', (b) => {
    b.start(-6, 0, 12);
    b.rect(-7.4, 0, 1.4, 10); b.turret(-6, 4.8, 1, { P: 2.2, range: 40 }); b.turret(-6, 8.8, 1, { P: 2.2, off: 1.1, range: 40 });
    b.crumble(9, 2, 2); b.crumble(14, 4, 2); b.crumble(19, 6, 2); b.crumble(24, 8, 2);
    b.shard(25, 12.4);
    b.plat(28, 8, 3);
    b.bridge(34, 10, 4); b.blink(41, 11, 2, { P: 2.4, on: 1.6 }); b.bridge(46, 12, 4); b.blink(53, 11, 2, { P: 2.4, on: 1.6, off: 1.2 });
    b.plat(58, 10, 5);
    b.checkpoint(60, 10);
    b.sweeper(21, 11.5, 2.2, { omega: 75 });
    b.wrecker(50, 21.5, 8.2, { amp: 40, T: 3 });
    b.mirror(64.5, 10, 7, { w: 2.6, T: 4.4 });           // meet 74.1, far 83.7
    b.enemy('flyer', 74.1, 13, { ax: 0.4, ay: 1.4, T: 2 });
    b.shard(74.1, 14.5);
    b.plat(85, 10, 5);
    b.switch(92.5, 10.5); b.blue(96, 11, 3);
    b.switch(101.5, 11.5); b.switch(104.5, 12);           // both, or neither
    b.blue(108, 12.5, 3);
    b.plat(112, 12, 6); b.rect(116.5, 12, 1.4, 3); b.turret(116.5, 12.8, -1, { P: 2 });
    b.shard(117.2, 16.5);
    b.ice(121, 10, 14); b.enemy('spiker', 122, 10, { range: 11, speed: 3 });
    b.cells(10, 3.5, 25, 9.5, 4); b.cells(35, 11, 55, 12, 5); b.cells(67, 11.2, 81, 11.2, 4); b.cells(122, 11, 133, 11, 4);
    b.plat(138, 11, 8);
    b.goal(143, 11);
  }),

  // 30 ── FINALE: bridge, buttons, a mirror and a prism climb, then the Shatter Wave chases you home
  L('Heart of Prismara', 'finale', (b) => {
    b.start(-6, 0, 12);
    b.bridge(6, 0, 14);
    b.plat(20, 0, 6); b.switch(22, 0);
    b.blue(29, 2, 3); b.blue(34, 4, 3);
    b.plat(39, 6, 5);
    b.mirror(45.5, 6, 5, { w: 2.8, T: 4.2 });            // meet 53.3, far 61.1
    b.shard(53.3, 10.6);
    b.plat(62.5, 6, 5);
    b.blink(70, 8.5, 3, { P: 3, on: 1.5 }); b.blink(65, 11, 3, { P: 3, on: 1.5, off: 1.5 });
    b.blink(70, 13.5, 3, { P: 3, on: 1.5 }); b.blink(65, 16, 3, { P: 3, on: 1.5, off: 1.5 });
    b.plat(70, 18.5, 12);
    b.checkpoint(74, 18.5);
    b.sweeper(13, 3.4, 2.6, { omega: 70, both: true });   // a prism turning over the first bridge
    b.zip(94, 20.5, 108, 14.5);                          // light rails over the glass
    b.zip(128, 20, 142, 13.8);
    b.chase({ speed: 4.5, trigger: 76, behind: 16 });
    b.bridge(82, 18.5, 12);
    b.crumble(96, 16.5, 2.5); b.crumble(101, 14.5, 2.5);
    b.plat(106, 13, 4); b.spring(107.5, 13, 6);
    b.shard(110, 23.5);
    b.plat(112, 19, 4);
    b.bridge(116, 19, 10);
    b.crumble(128, 17, 2.5); b.crumble(133, 15, 2.5); b.crumble(138, 13, 2.5);
    b.plat(143, 12, 12);
    b.goal(150, 12);
    b.cells(8, 1, 18, 1, 4); b.cells(30, 3.5, 36, 5.5, 2); b.cells(48, 7.2, 59, 7.2, 4); b.cells(71.5, 10, 66.5, 17.5, 4);
    b.cells(84, 19.5, 92, 19.5, 4); b.cells(118, 20, 124, 20, 3); b.cells(129, 18.5, 139, 14.5, 3);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),
];
