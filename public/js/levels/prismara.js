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
];
