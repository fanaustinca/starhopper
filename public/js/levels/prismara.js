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
    b.thin(23, 4.5, 3); b.cells(23.5, 5.5, 25.5, 5.5, 3);
    b.plat(31, 0, 6);
    b.bridge(37, 0, 14);                       // a wide gap: walk up and the light hardens
    b.cells(39, 1, 49, 1, 5);
    b.plat(51, 0, 8);
    b.checkpoint(55, 0);
    b.mirror(61, 0, 4, { w: 3, T: 4 });        // pad and its reflection meet at x=68
    b.thin(66.5, 4, 3); b.shard(68, 5.6);
    b.plat(76.5, 0, 5);
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
    for (let i = 0; i < 7; i++) b.crumble(32 + i * 2, 0, 2);      // a glass floor: don't stop running
    b.cells(33, 1.2, 45, 1.2, 6);
    b.plat(44, -4.5, 3); b.shard(45.5, -3.3);                      // seen through the glass
    b.plat(50, 0, 6);
    b.checkpoint(53, 0);
    // a zig-zag of panes up to a crystal perch
    b.crumble(57, 2.5, 2.4); b.crumble(62, 5, 2.4); b.crumble(57, 7.5, 2.4); b.crumble(62, 10, 2.4);
    b.cells(58.2, 4, 63.2, 11.5, 4);
    b.plat(67, 11, 5);
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
    b.goal(112, 2);
    b.plat(-14, 2, 3); b.shard(-12.5, 4);
  }),

  // 4 ── refraction basics: a sealed hall of red and blue walls; each button swaps which colour is solid
  L('Refraction Hall', 'puzzle', (b) => {
    b.start(-6, 0, 12);
    b.plat(6, 0, 24);
    b.rect(10, 6, 46, 1);                                // the hall's glass roof
    b.switch(9, 0);
    b.redWall(15, 0, 6);
    b.switch(18.5, 0);
    b.blueWall(22, 0, 6);
    b.cells(11, 1, 26, 1, 6);
    // a pit spanned by red steps
    b.red(31.5, 0, 3); b.red(36.5, 0, 3);
    b.plat(30, -3.5, 1.5); b.shard(30.75, -2.4);         // tucked under the hall floor
    b.plat(41, 0, 15);
    b.switch(44, 0);
    b.redWall(48, 0, 6);
    b.checkpoint(52, 0);
    // outside: a blue stair, then press to bring out the red one
    b.blue(58, 1, 3); b.blue(63, 2, 3);
    b.plat(68, 3, 6); b.switch(71.5, 3);
    b.red(76, 3.5, 3); b.red(81, 4.5, 3);
    b.plat(86, 5, 10);
    b.goal(92, 5);
    // secret: a glass ledge up to the hall roof, which runs all the way back
    b.thin(56.5, 4.5, 2.5);
    b.cells(52, 8, 16, 8, 8); b.shard(12, 8.6);
    // behind the start, a blue shelf that only appears after the first button
    b.blue(-15, 2, 3); b.shard(-13.5, 4);
  }),

  // 5 ── flick-flack: prism lights that alternate, so you always jump onto the one lighting up
  L('Prism Flicker', 'timing', (b) => {
    b.start(-6, 0, 12);
    for (let i = 0; i < 6; i++) b.blink(9 + i * 5.5, 0, 3, { P: 3, on: 1.5, off: (i % 2) * 1.5 });
    b.cells(10.5, 1.4, 38, 1.4, 6);
    b.plat(23, -3.5, 2.5); b.shard(24.2, -2.4);          // between the lights, below
    b.plat(42, 0, 6);
    b.checkpoint(45, 0);
    // the same flick-flack, climbing
    for (let i = 0; i < 4; i++) b.blink(i % 2 ? 55 : 50, 2.5 + i * 2.5, 3, { P: 3, on: 1.5, off: (i % 2) * 1.5 });
    b.blink(50, 12.5, 3, { P: 3, on: 1.5 }); b.shard(51.5, 14.5);
    b.cells(51.5, 4, 56.5, 11.5, 4);
    b.plat(60, 12.5, 4);
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
    b.cells(26.3, 17, 26.3, 22, 3); b.shard(26.3, 24.6);
    // laser sweeps the shattering flight
    b.rect(6.8, 13, 1.2, 10); b.turret(8.2, 17.8, 1, { P: 2.4 });
    b.shard(7.4, 24.6);
    b.crumble(13, 17, 2.4); b.crumble(9, 19.5, 2.4); b.crumble(14, 22, 2.4); b.crumble(10, 24.5, 2.4);
    b.plat(15, 27, 6);
    b.bridge(21, 27, 16);
    b.cells(23, 28, 35, 28, 5);
    b.plat(37, 27, 4); b.plat(44, 23, 4);
    b.plat(51, 19, 9);
    b.goal(56, 19);
    b.plat(-13, -3, 3); b.shard(-11.5, -2);
  }),

  // 7 ── rolling crystal ridges where shard-crawlers patrol every valley; overpasses of glass skip them
  L('Shardback Ridge', 'enemies', (b) => {
    b.start(-6, 0, 12);
    b.block(8, 1, 10); b.enemy('spiker', 9, 1, { range: 7, speed: 1.8 });
    b.block(20, 3, 6);
    b.block(28, 0, 12); b.enemy('spiker', 29, 0, { range: 10, speed: 2.6 });
    b.thin(29.5, 4.5, 9); b.cells(30, 5.5, 38, 5.5, 5);
    b.shard(34, 9);
    b.block(42, 2, 6);
    b.checkpoint(45, 2);
    // the long spine: three crawlers at three speeds
    b.block(50, 4, 26);
    b.enemy('spiker', 51, 4, { range: 7, speed: 1.4 }); b.enemy('spiker', 59, 4, { range: 7, speed: 2.4 }); b.enemy('spiker', 67, 4, { range: 8, speed: 3.2 });
    b.thin(54, 7.5, 3); b.thin(61, 8.5, 3); b.thin(68, 7.5, 3);
    b.enemy('walker', 61, 8.5, { range: 2, speed: 1 });
    b.shard(62.5, 13.2);                                 // bounce off the walker to reach it
    b.cells(55.5, 8.5, 69.5, 8.5, 5);
    b.block(78, 1, 8); b.enemy('walker', 79, 1, { range: 6, speed: 2 });
    b.block(90, 3, 10);
    b.goal(96, 3);
    b.plat(-15, 2.5, 3); b.shard(-13.5, 4.5);
  }),

  // 8 ── lasers sweep long light bridges: jump the bolts, or take the upper bridge you light mid-leap
  L('Laser Lattice', 'gauntlet', (b) => {
    b.start(-6, 0, 12);
    b.bridge(6, 0, 22);
    b.cells(8, 1, 26, 1, 6);
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
    b.cells(72, 5, 92, 5, 7);
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
    b.plat(28.5, 15, 4); b.shard(31, 16.5);              // out through the window
    b.plat(12, 10, 15); b.turret(7.6, 10.8, 1, { P: 2.4 });
    b.checkpoint(22, 10);
    b.cells(13, 11, 25, 11, 5);
    b.plat(7.5, 5, 13); b.cells(9, 6, 19, 6, 4);
    b.plat(7.5, 0, 24);
    b.cells(21, 1, 30, 1, 4);
    b.crumble(34, -2, 2.5); b.crumble(39, -4, 2.5);
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
    b.thin(57, 47, 3); b.shard(58.5, 48.6);
    b.plat(64.6, 43, 8);
    b.goal(70, 43);
  }),

  // 15 ── refraction lock: jump OVER a button to keep the red steps, then two button stepping-stones: touch both or neither
  L('Chromatic Lock', 'puzzle', (b) => {
    b.start(-6, 0, 12);
    b.plat(6, 0, 20);
    b.switch(14, 0);
    b.arc(11, 0, 18, 0, 3, 2.6);
    b.blue(17, 3.5, 3); b.shard(18.5, 5.5);              // only there if you press — then press again
    b.red(27.5, 0, 3); b.red(32, 0, 2.5);
    b.plat(30.5, -4, 1.5); b.shard(31.25, -2.9);
    b.plat(36, 0, 20); b.rect(36, 5, 12, 1);
    b.switch(39, 0); b.redWall(43, 0, 5);
    b.checkpoint(46, 0);
    b.switch(50, 0);                                     // hop over this one too
    b.blue(57, 2, 3); b.blue(61, 4, 3);
    b.plat(65, 6, 5);
    b.switch(73, 6); b.switch(77, 6.5);                  // the lock: an even number of presses
    b.shard(75.7, 10);
    b.blue(82.5, 6.5, 3);
    b.cells(66, 7, 84, 8, 6);
    b.plat(88, 7, 8);
    b.goal(93, 7);
  }),

  // 16 ── a glass highwire far above the sea: tiny ledges, panes that shatter, prism flickers, then a dive onto light
  L('Glasswalk', 'precision', (b) => {
    b.start(-6, 0, 12);
    b.plat(9, 3, 2.5); b.plat(14, 6, 2); b.plat(19, 9, 2); b.plat(25, 11, 2);
    b.thin(31, 11, 2); b.crumble(36, 12, 1.6); b.thin(41, 13, 1.5); b.crumble(46, 12, 1.6); b.thin(51, 11, 2);
    b.cells(32, 12, 52, 12, 6);
    b.shard(41.7, 17.4);
    b.plat(56, 11, 4);
    b.checkpoint(58, 11);
    b.blink(64, 12, 2, { P: 2.6, on: 1.8 }); b.thin(69, 14, 1.5);
    b.blink(74, 15, 2, { P: 2.6, on: 1.8, off: 1.3 }); b.shard(75, 18.6);
    b.crumble(79, 14, 1.6); b.thin(84, 12.5, 1.5);
    b.cells(65, 13, 85, 13.5, 6);
    b.arc(85.5, 12.5, 93, 6, 3, 1);
    b.bridge(92, 6, 14);                                 // dive into the light
    b.plat(106, 6, 8);
    b.goal(111, 6);
    b.plat(-12, 4, 2); b.shard(-11, 5.6);
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

  // 19 ── polished glass floors: you slide, crawlers don't care; leap them mid-skid and stick tiny landings
  L('Polished Floor', 'enemies', (b) => {
    b.start(-6, 0, 12);
    b.ice(8, 0, 16); b.enemy('spiker', 10, 0, { range: 12, speed: 2.2 });
    b.plat(25, -3, 2); b.shard(26, -2);
    b.ice(28, 2, 4); b.ice(35, 4, 4);
    b.ice(42, 4, 20); b.enemy('spiker', 44, 4, { range: 8, speed: 2 }); b.enemy('spiker', 52, 4, { range: 8, speed: 2.8 });
    b.thin(47, 7.5, 4); b.thin(55, 7.5, 4);
    b.thin(51, 11, 2.5); b.shard(52.2, 12.6);
    b.plat(64, 5, 4);
    b.checkpoint(66, 5);
    b.ice(72, 5, 2.5); b.ice(78, 6, 2); b.ice(84, 5, 2.5);
    b.ice(81, 9.5, 2); b.shard(82, 11.2);
    b.ice(90, 3, 18); b.enemy('spiker', 92, 3, { range: 6, speed: 2.4 }); b.enemy('spiker', 99, 3, { range: 7, speed: 3 });
    b.cells(9, 1, 22, 1, 5); b.cells(43, 5, 60, 5, 6); b.cells(73, 6.5, 85, 6.5, 3); b.cells(91, 4, 106, 4, 5);
    b.plat(110, 3, 8);
    b.goal(115, 3);
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

  // 21 ── a three-storey glass labyrinth: the exit is sealed red; the button is upstairs, the way back down is a hole
  L('Glass Labyrinth', 'maze', (b) => {
    b.start(-6, 0, 12);
    b.plat(6, 0, 74);
    b.rect(6, 15, 64, 1);                                // roof
    b.plat(10, 5, 32); b.plat(46, 5, 24);                // middle floor, with a drop hole at 42–46
    b.plat(16, 10, 54);                                  // top floor
    b.rect(70, 5, 1, 10);                                // seals the upper storeys
    b.enemy('spiker', 18, 0, { range: 12, speed: 2 });
    b.shard(24, 3.2);                                    // over the crawler's beat
    b.blueWall(38, 0, 4);                                // appears once the button is pressed
    b.redWall(66, 0, 4);                                 // the sealed exit
    b.thin(11, 8, 3);
    b.switch(64, 5);
    b.checkpoint(56, 5);
    // top floor: a dead end behind a low lintel and a button you can't jump over
    b.rect(58, 12.2, 6, 2.8);
    b.switch(60, 10);
    b.shard(67.5, 11.5);
    b.cells(8, 1, 36, 1, 6); b.cells(12, 6, 62, 6, 9); b.cells(18, 11, 56, 11, 7); b.cells(48, 1, 64, 1, 4);
    b.plat(84, 2, 4); b.plat(91, 4, 8);
    b.goal(96, 4);
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
    b.checkpoint(37, 2);
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
    b.plat(58, 13, 4); b.spring(60, 13, 6);
    b.bridge(64, 20, 12);
    b.shard(70, 24.4);
    b.cells(36, 14, 44, 14, 4); b.cells(66, 21, 74, 21, 4);
    b.plat(80, 12, 4);
    b.plat(88, 8, 10);
    b.goal(93, 8);
  }),

  // 25 ── a switchboard of floating buttons and prism lights: count your presses so the right colour is waiting
  L('Flicker Switchboard', 'puzzle', (b) => {
    b.start(-6, 0, 12);
    b.switch(8.8, 0);                                    // press it and the red block ahead is gone
    b.red(13, 0, 3);
    b.red(18.5, 3.5, 2); b.shard(19.5, 5.3);
    b.switch(19, 0.5);
    b.blue(23, 1, 3);
    b.switch(29, 1.5); b.switch(32.5, 1.5); b.switch(36, 1.5);    // land on exactly two
    b.shard(33.2, 5.5);
    b.blue(40, 1.5, 3);
    b.plat(46, 2, 6);
    b.checkpoint(49, 2);
    b.plat(53, -1.5, 2); b.shard(54, -0.4);
    b.blink(55, 3, 3, { P: 3, on: 1.8 });
    b.switch(61, 3.5);
    b.red(65, 4, 3);
    b.switch(71.5, 4.5);
    b.blink(75, 5.5, 3, { P: 3, on: 1.8, off: 1.5 });
    b.blue(81, 6.5, 3);
    b.cells(14, 1.2, 25, 2.2, 4); b.cells(41, 2.7, 51, 3, 4); b.cells(56, 4.2, 83, 7.7, 7);
    b.plat(87, 7, 8);
    b.goal(92, 7);
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
    b.mirror(69.5, 5, 3, { w: 2.6, T: 3.6 });            // relay: far 80.7
    b.mirror(81.7, 5, 3, { w: 2.6, T: 3.6 });            // far 92.9
    b.plat(94.4, 5, 8); b.rect(101, 5, 1.4, 4); b.turret(101, 5.8, -1, { P: 2.6, range: 30 });
    b.cells(10, 1.2, 23, 1.2, 4); b.cells(37, 2.2, 52, 2.2, 5); b.cells(72, 6.2, 91, 6.2, 6);
    b.goal(98, 5);
    b.plat(-15, -2, 3); b.shard(-13.5, -1);
  }),

  // 27 ── facet chimneys: the walls are refraction crystal, so you press a button to grow the wall you need
  L('Facet Chimneys', 'puzzle', (b) => {
    b.start(-6, 0, 12);
    b.plat(6, 0, 6.8);
    b.wall(9, 2, 10); b.wall(12.8, 0, 12);               // a plain chimney to warm up
    b.cells(11.3, 3, 11.3, 10, 3);
    b.shard(9.4, 13.8);
    b.plat(13.6, 12, 8.8); b.switch(15, 12);
    b.wall(18.6, 14, 10); b.blueWall(22.4, 12, 12);      // the right wall only exists in blue
    b.cells(20.9, 15, 20.9, 22, 3);
    b.plat(23.2, 24, 8.8); b.switch(26.5, 24);
    b.checkpoint(24.5, 24);
    b.redWall(28.2, 26, 10); b.wall(32, 24, 12);         // and this left wall only in red
    b.cells(30.5, 27, 30.5, 34, 3);
    b.shard(30.6, 38.5);
    b.plat(32.8, 36, 5);
    b.blink(41, 32, 3, { P: 3, on: 1.8 }); b.blink(46, 28, 3, { P: 3, on: 1.8, off: 1.5 }); b.blink(51, 24, 3, { P: 3, on: 1.8 });
    b.cells(42.5, 33.5, 52.5, 25.5, 3);
    b.plat(56, 20, 8);
    b.goal(61, 20);
    b.plat(-13, -3, 3); b.shard(-11.5, -2);
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
