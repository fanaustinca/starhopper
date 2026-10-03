// WORLD 2 — MERCURY. 30 hand-written levels.
// Gravity 0.62: single jump ≈ 3.9 high / 9 far, double jump ≈ 7 high / 17 far.
// Gaps that would be impossible on the Sun are the bread and butter here.
// Every level has its own idea; see the comment above each one.
import { L } from './dsl.js';

export default [
  // 31 ── first steps in low gravity: gaps that look impossible are one floaty hop
  L('Hermes Landing', 'intro', (b) => {
    b.start(-6, 0, 14);
    b.arc(8, 0, 18, 0, 4, 4);
    b.plat(18, 0, 6);
    b.cells(25, 2.5, 27, 4.5, 2);
    b.plat(28, 3.5, 5);                       // a step taller than you: one jump
    b.plat(37, 7, 5);
    b.arc(42, 7, 52, 2, 4, 3.5);
    b.shard(47, 11.5);                        // float high over the drop
    b.plat(52, 2, 9);
    b.checkpoint(55, 2);
    b.plat(66, 8, 4);                         // double jump: almost a whole storey
    b.cells(62, 4, 64, 7, 2);
    b.shard(68, 14.5);
    b.plat(72, 2, 14);
    b.pool(86, 2, 14);                        // first quicksilver: clear it with a long double jump
    b.arc(86, 2, 100, 2, 5, 4.5);
    b.plat(100, 2, 12);
    b.goal(107, 2);
    b.plat(-17, 5, 3); b.shard(-15.5, 7);
  }),

  // 32 ── a quicksilver lake: islands shrink to pillars and the gaps keep widening
  L('Quicksilver Shallows', 'classic', (b) => {
    b.start(-6, 0, 12);
    b.pool(6, 0, 6); b.block(12, 0.5, 4);
    b.pool(16, 0, 8); b.block(24, 1.5, 3);
    b.pool(27, 0, 10); b.block(37, 0, 8);
    b.enemy('walker', 38, 0, { range: 5 });
    b.checkpoint(43, 0);
    b.cells(13, 1.7, 15, 1.7, 2); b.arc(27, 1.5, 37, 0, 3, 3);
    b.shard(31.5, 0.4);                       // skim the surface of the lake
    b.pool(45, 0, 4.5);
    b.block(49.5, 2, 1.6); b.pool(51.1, 0, 6.4);
    b.block(57.5, 3.5, 1.6); b.pool(59.1, 0, 6.4);
    b.block(65.5, 2, 1.6); b.pool(67.1, 0, 6.4);
    b.block(73.5, 0.5, 1.6); b.pool(75.1, 0, 6.9);
    b.cells(50.3, 3.5, 74.3, 2, 4);
    b.thin(56.5, 10, 3.5); b.shard(58.3, 12);
    b.block(82, 0, 12);
    b.goal(89, 0);
    b.block(-16, 3, 2); b.shard(-15, 5);
  }),

  // 33 ── crater vents breathe you up a terraced crater wall, one puff at a time
  L('Breathing Craters', 'bounce', (b) => {
    b.start(-6, 0, 12);
    b.plat(10, 0, 8); b.vent(15, 0, 3);
    b.cells(15, 3, 15, 8, 3);
    b.plat(19, 9, 5);
    b.shard(24, 3);                           // tucked under the first terrace
    b.plat(28, 6, 5);
    b.pool(33, 6, 12);
    b.plat(36, 6.5, 5); b.vent(40, 6.5, 5);  // island vent: a long way up
    b.plat(42, 20, 6); b.cells(43, 21.5, 47, 21.5, 3); b.shard(46, 24);
    b.plat(45, 6, 6);
    b.checkpoint(48, 6);
    b.plat(54, 6, 6); b.vent(59, 6, 3);
    b.plat(61, 16, 6); b.vent(66, 16, 4);
    b.plat(70, 24, 5); b.vent(74, 24, 2);
    b.cells(59, 10, 59, 15, 3); b.cells(66, 20, 66, 25, 3);
    b.shard(74, 34);                        // ride the last puff all the way up
    b.arc(75, 24, 86, 18, 3, 3);
    b.plat(86, 18, 10);
    b.goal(92, 18);
  }),

  // 34 ── scale a sheer scarp through a crack in its face, then glide off the top
  L('Discovery Rupes', 'ascent', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 10);
    b.plat(22, 24, 14, { h: 28 });            // the scarp
    b.plat(18.5, 5, 3.5);
    b.thin(16, 10, 6);
    b.wall(18.4, 12, 11.5);                   // crack: wall-jump between this and the scarp face
    b.cells(20.7, 13, 20.7, 22, 4);
    b.shard(20.7, 18);
    b.plat(12, 18, 4); b.cells(13, 19.5, 15, 19.5, 2);
    b.checkpoint(30, 24);
    b.enemy('walker', 25, 24, { range: 8 });
    b.arc(36, 24, 50, 16, 5, 3);
    b.plat(50, 16, 4);
    b.plat(62, 12, 4);
    b.plat(56, 4, 4); b.shard(58, 6);         // a ledge down in the shadow of the drop
    b.plat(70, 4, 10);
    b.enemy('flyer', 77, 9, { ax: 2, ay: 1.5, T: 3 });
    b.plat(84, 16, 20, { h: 21 });            // the second scarp, climbed by ledges
    b.thin(79, 9, 5); b.thin(79, 13.5, 3);
    b.cells(81, 10.5, 81, 15, 2);
    b.plat(96, 23, 3); b.shard(97.5, 25);
    b.goal(100, 16);
  }),

  // 35 ── cross the terminator: sun-baked tiles flare on the dayside, ice skates the night
  L('The Terminator', 'gauntlet', (b) => {
    b.start(-6, 0, 12);
    for (let i = 0; i < 5; i++) b.heat(10 + i * 9, (i % 2) * 2, 4, { P: 3, on: 1.2, off: i * 0.6 });
    b.cells(11, 2, 47, 2, 9);
    b.plat(25, 7, 4); b.rect(24, 11.2, 6, 0.8); b.shard(27, 8.5);   // a shady nook under a ledge
    b.plat(56, 2, 3); b.ice(59, 2, 3);
    b.checkpoint(57, 2);
    b.pool(62, 2, 6);
    b.ice(68, 2, 7);
    b.pool(75, 2, 6);
    b.ice(81, 3, 3);                          // a short ice landing: don't skate off
    b.pool(84, 2, 5);
    b.ice(89, 3, 12); b.enemy('spiker', 90, 3, { range: 9, speed: 2.2 });
    b.block(94, 10, 2); b.shard(95, 12);
    b.pool(101, 2, 5);
    b.ice(106, 1, 4);
    b.plat(114, 1, 10);
    b.goal(120, 1);
    b.cells(69, 3.5, 74, 3.5, 3); b.arc(75, 2, 81, 3, 2, 2.5); b.cells(91, 4.5, 99, 4.5, 4);
    b.shard(78, 3);
  }),

  // 36 ── a chain of ever-wider craters: hop rim to rim, or drop in and ride the central peak
  L('Crater Chain', 'classic', (b) => {
    b.start(-6, 0, 12);
    const crater = (x0, span, vent) => {
      b.block(x0, 5, 3); b.block(x0 + 3, 2.5, 2);
      b.pool(x0 + 5, 1, span);
      if (vent) { const cx = x0 + 5 + span / 2; b.block(cx - 3.5, 1.5, 5); b.vent(cx + 0.6, 1.5, vent); }
      b.block(x0 + 5 + span, 2.5, 2); b.block(x0 + 7 + span, 5, 3);
    };
    b.plat(6, 2, 3);
    crater(10, 6, 0);
    b.arc(13, 5, 23, 5, 3, 3);
    crater(30, 12, 3);
    b.cells(41.6, 5, 41.6, 12, 3);
    b.shard(38, 2.2);                         // down in the bowl, just above the quicksilver
    b.plat(55, 5, 6);
    b.checkpoint(58, 5);
    crater(64, 22, 7);
    b.crumble(73, 4, 2); b.crumble(87, 4, 2);
    b.cells(80.6, 6, 80.6, 16, 4);
    b.thin(78.6, 16, 4); b.shard(80.6, 20.5);     // caught at the top of the big puff
    b.plat(100, 7, 4);
    b.plat(108, 5, 10);
    b.goal(114, 5);
    b.rect(-12, 6, 1, 6); b.plat(-15, 1.5, 3); b.shard(-13.5, 3.5);
  }),

  // 37 ── a three-storey plain: spikers own the ground floor, walkers and moths the ledges
  L('Skitter Flats', 'enemies', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 34); b.enemy('spiker', 9, 0, { range: 30, speed: 3.2 });
    b.thin(12, 4.5, 10); b.thin(28, 4.5, 10);
    b.enemy('walker', 13, 4.5, { range: 8 }); b.enemy('walker', 29, 4.5, { range: 8, speed: 2.2 });
    b.plat(20, 10, 6); b.enemy('flyer', 23, 13, { ax: 3, ay: 0.8, T: 3 });
    b.shard(23, 11.6);
    b.cells(13, 6, 37, 6, 8);
    b.plat(46, 2, 6);
    b.checkpoint(49, 2);
    b.plat(56, 2, 26);
    b.enemy('spiker', 57, 2, { range: 10, speed: 2.6 }); b.enemy('spiker', 70, 2, { range: 10, speed: 2.6 });
    b.enemy('flyer', 62, 7, { ax: 4, ay: 1, T: 2.6 }); b.enemy('flyer', 75, 7, { ax: 4, ay: 1, T: 3.2 });
    b.thin(60, 6.5, 5); b.thin(72, 6.5, 5);
    b.rect(66, 11, 4, 0.8); b.shard(68, 13);
    b.cells(58, 3.5, 80, 3.5, 7);
    b.plat(86, 4, 4);
    b.plat(94, 6, 12); b.enemy('walker', 96, 6, { range: 6, speed: 2.4 });
    b.goal(103, 6);
    b.plat(-11, 5.5, 3); b.shard(-9.5, 7.5);
  }),

  // 38 ── descend the quicksilver falls: slip through the windows in each cascade
  L('Quicksilver Falls', 'descent', (b) => {
    b.start(-6, 40, 12);
    b.plat(10, 38, 5);
    b.hazard('mercury', 18, 15, 1.2, 18); b.hazard('mercury', 18, 45, 1.2, 10);
    b.plat(22, 32, 6);
    b.hazard('mercury', 31, 10, 1.2, 16); b.hazard('mercury', 31, 39, 1.2, 14);
    b.plat(35, 26, 6);
    b.checkpoint(38, 26);
    b.hazard('mercury', 44, 5, 1.2, 15); b.hazard('mercury', 44, 33, 1.2, 18);
    b.plat(48, 20, 5); b.enemy('walker', 48.5, 20, { range: 3 });
    b.hazard('mercury', 56, 0, 1.2, 14); b.hazard('mercury', 56, 27, 1.2, 22);
    b.plat(60, 14, 5);
    b.plat(70, 8, 4);
    b.pool(74, 4, 12);
    b.plat(78, 5, 2);
    b.plat(86, 4, 10);
    b.goal(92, 4);
    b.arc(15, 38, 22, 32, 2, 3); b.arc(28, 32, 35, 26, 2, 3); b.arc(41, 26, 48, 20, 2, 3); b.arc(53, 20, 60, 14, 2, 3);
    b.plat(26, 44, 3); b.shard(27.5, 46);      // above the first window, between two cascades
    b.plat(64, 23, 3); b.shard(65.5, 25);
    b.shard(79, 9);
  }),

  // 39 ── floodgate locks: each button swaps red and blue gates across a roofed canal
  L('Floodgate Locks', 'puzzle', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 6);
    b.rect(12, 3.4, 54, 1);                   // the low canal roof stops floaty jumps
    b.pool(14, 0, 24);
    b.red(14, 0, 6); b.plat(20, 0, 6); b.switch(22, 0); b.blue(26, 0, 6);
    b.plat(32, 0, 2);
    b.shard(29, 1);
    b.plat(38, 0, 6);
    b.checkpoint(40, 0);
    b.pool(44, 0, 20);
    b.blue(44, 0, 5); b.plat(49, 0, 5); b.switch(50.8, 0); b.red(54, 0, 5); b.plat(59, 0, 5); b.switch(60.8, 0);
    b.cells(15, 1, 63, 1, 12);
    // the lock chamber: climb by flipping the floors
    b.plat(64, 0, 16);
    b.wall(64, 4.4, 30); b.wall(85, 0, 26);
    b.blue(80, 5, 4);
    b.plat(70, 10, 4); b.switch(71, 10);
    b.red(80, 15, 4);
    b.plat(70, 20, 4); b.switch(71, 20);
    b.blue(80, 25, 4);
    b.rect(64.8, 30, 12, 0.8);
    b.plat(66, 26, 3); b.shard(67.5, 28);
    b.cells(82, 7, 82, 27, 5);
    b.plat(86, 26, 10);
    b.goal(92, 26);
    b.plat(-15, 1.5, 3); b.shard(-13.5, 3.5);
  }),

  // 40 ── the Sunrise Line: sprint the sunlit plains in huge floaty leaps
  L('Outrun the Dawn', 'chase', (b) => {
    b.chase({ speed: 4.2 });
    b.start(-6, 0, 14);
    b.plat(17, 0, 5);
    b.plat(31, 2, 5);
    b.crumble(44, 3, 3); b.crumble(56, 4, 3);
    b.plat(67, 2, 7); b.vent(72, 2, 4, { always: true });
    b.checkpoint(69, 2);
    b.plat(76, 12, 5);
    b.plat(93, 6, 5);
    b.pool(98, 3, 14); b.plat(96, 3, 2);
    b.crumble(112, 4, 3); b.crumble(124, 3, 3);
    b.plat(136, 3, 12);
    b.goal(144, 3);
    b.arc(8, 0, 17, 0, 3, 3.5); b.arc(22, 0, 31, 2, 3, 3.5); b.arc(36, 2, 44, 3, 3, 3.5);
    b.cells(72, 5, 72, 10, 2); b.arc(81, 12, 93, 6, 4, 3); b.arc(98, 3, 112, 4, 4, 4);
    b.shard(50, 10); b.shard(78.5, 18); b.shard(118, 10);
  }),
];
