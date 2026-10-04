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
    b.plat(-14, -2.5, 4); b.shard(-12, -0.6);   // a ledge hidden below the start
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
  // 41 ── a heat-shimmer lake: every other stepping stone is a mirage that flickers away
  L('Mirage Flats', 'timing', (b) => {
    b.start(-6, 4, 12);
    b.blink(10, 2, 3, { P: 3.4, on: 2.2 });
    b.block(18, 1, 2);
    b.blink(24, 0, 3, { P: 3.4, on: 2.2, off: -0.6 });
    b.block(31, 0, 2);
    b.blink(37, 0, 3, { P: 3.4, on: 2.2, off: -1.2 });
    b.block(44, 1, 2);
    b.blink(50, 2, 3, { P: 3.4, on: 2.2, off: -1.8 });
    b.cells(11, 3.5, 51, 3.5, 9);
    b.shard(27.5, -1.6);                      // dip down to the shimmer's surface
    b.plat(56, 3, 6);
    b.checkpoint(59, 3);
    // a mirage ladder: zig-zag up through vanishing ledges
    b.blink(65, 8, 3, { P: 3, on: 1.9 });
    b.blink(72, 13, 3, { P: 3, on: 1.9, off: -0.5 });
    b.blink(65, 18, 3, { P: 3, on: 1.9, off: -1 });
    b.blink(72, 23, 3, { P: 3, on: 1.9, off: -1.5 });
    b.thin(63, 26, 3); b.shard(64.5, 28);
    b.plat(80, 24, 5);
    b.cells(66.5, 10, 73.5, 25, 4);
    b.plat(100, 23, 3); b.shard(101.5, 25);   // a real mesa far out on the horizon
    // and back down on a fading staircase
    b.blink(90, 18, 3, { P: 3.2, on: 2, off: 0 });
    b.blink(99, 13, 3, { P: 3.2, on: 2, off: -0.6 });
    b.blink(108, 8, 3, { P: 3.2, on: 2, off: -1.2 });
    b.arc(85, 24, 109, 8, 6, 2);
    b.plat(116, 4, 10);
    b.goal(122, 4);
  }),

  // 42 ── two wheels turning at a 3:2 resonance, like Mercury's own spin and orbit
  L('Spin-Orbit Resonance', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.ferris(19, 4, 6.5, { n: 3, omega: 0.6 });
    b.ferris(36, 4, 6.5, { n: 2, omega: -0.4 });
    b.shard(19, 4);                           // the hub of the first wheel
    b.plat(46, 6, 6);
    b.checkpoint(49, 6);
    b.ferris(62, 13, 7.5, { n: 4, omega: 0.45 });
    b.cells(62, 21.5, 62, 21.5, 1);
    b.plat(57, 25.5, 3); b.shard(58.5, 27.5);     // only the top of the big wheel reaches this perch
    b.plat(73, 15, 5);
    b.ferris(87, 13, 5, { n: 3, omega: -0.9 });
    b.shard(87, 21);
    b.plat(96, 11, 10);
    b.goal(102, 11);
    b.arc(6, 0, 46, 6, 10, 6);
  }),

  // 43 ── a lava-tube cave: low ceilings kill your floaty jumps, a skylight shaft gives them back
  L('The Hollows', 'maze', (b) => {
    b.start(-6, 0, 12);
    b.rect(-13, 3.6, 49, 1);                   // tube roof
    b.plat(-12, 0, 6); b.rect(-13, 0, 1, 3.6);
    b.shard(-11, 1);                          // the dark dead end behind the spawn
    b.plat(6, 0, 6); b.pool(12, 0, 4);
    b.plat(16, 0, 6); b.pool(22, 0, 4);
    b.plat(26, 0, 10); b.enemy('walker', 27, 0, { range: 7 });
    b.cells(7, 1, 34, 1, 8);
    // the skylight: open shaft with a vent
    b.plat(36, 0, 8); b.vent(42, 0, 5);
    b.cells(42, 3, 42, 11, 3);
    b.thin(40, 12, 4);
    b.plat(30, 8, 4); b.shard(32, 9.5);       // a crawlspace above the tube roof
    b.plat(44, 12, 8); b.plat(56, 12, 18);
    b.rect(44, 15.6, 32, 1);                  // upper tube roof
    b.checkpoint(47, 12);
    b.pool(52, 12, 4);
    b.enemy('spiker', 58, 12, { range: 8, speed: 2 });
    b.cells(46, 13, 72, 13, 8);
    b.rect(36, 17, 1, 9); b.rect(36, 26, 42, 1);  // the cave ceiling over the skylight
    b.plat(60, 20, 4); b.shard(62, 21.5);     // above the upper roof, via the shaft lip
    b.plat(78, 8, 4);
    b.rect(77, 13, 20, 1);
    b.plat(86, 4, 12);
    b.goal(93, 4);
  }),

  // 44 ── a switchback cliff under crossfire: each ledge is swept by a cannon
  L('Beagle Rupes Battery', 'ascent', (b) => {
    b.start(-6, 0, 12);
    b.tower(6, 0, 26, 32);
    b.plat(6, 0, 24);
    b.plat(14, 6, 16);
    b.plat(8, 12, 16);
    b.plat(14, 18, 16);
    b.plat(8, 24, 16);
    b.plat(14, 30, 16);
    b.rect(30, -4, 1.6, 33);
    b.turret(30.8, 0.8, -1, { P: 2.4 });
    b.turret(30.8, 6.8, -1, { P: 2.4, off: 1.2 });
    b.turret(30.8, 18.8, -1, { P: 2.2 });
    b.rect(4, 8, 1.4, 22);
    b.turret(4.7, 12.8, 1, { P: 2.6 });
    b.turret(4.7, 24.8, 1, { P: 2.2, off: 1 });
    b.checkpoint(22, 18);
    b.cells(10, 1, 28, 1, 5); b.cells(16, 7, 28, 7, 4); b.cells(9, 13, 22, 13, 4); b.cells(16, 19, 28, 19, 4); b.cells(9, 25, 22, 25, 4);
    b.shard(4.7, 31.5);                       // atop the left battery
    b.plat(34, 28, 4);
    b.plat(46, 24, 4);
    b.enemy('flyer', 52, 26, { ax: 2, ay: 2, T: 3 });
    b.plat(58, 18, 10);
    b.goal(64, 18);
    b.plat(38, 36, 3); b.shard(39.5, 38);
    b.shard(27, 3);
  }),

  // 45 ── the quicksilver rises: climb the shaft, a chimney and a vent before it swallows you
  L('Quicksilver Rising', 'tide', (b) => {
    b.rise({ rate: 0.7, delay: 4 });
    b.start(-6, 0, 12);
    b.tower(6, -4, 18, 58);
    b.plat(8, 5, 4);
    b.plat(17, 10, 4);
    b.plat(0, 11, 3); b.shard(1.5, 13);
    b.plat(12, 16, 6);
    b.wall(12.6, 17, 13); b.wall(16.2, 17, 13);   // chimney
    b.cells(14.8, 19, 14.8, 28, 4);
    b.plat(17, 30, 5);
    b.checkpoint(18, 30);
    b.vent(21, 30, 4, { always: true });
    b.cells(21, 33, 21, 39, 3);
    b.thin(19.5, 40, 3.5);
    b.shard(21, 47);                           // ride the vent past the ledge
    b.plat(10, 45, 5);
    b.crumble(18, 50, 3);
    b.plat(24, 55, 10);
    b.goal(30, 55);
    b.shard(14.8, 31.5);                       // top of the chimney
  }),

  // 46 ── springs in low gravity: every pad throws you clean across a canyon
  L('Springboard Highlands', 'bounce', (b) => {
    b.start(-6, 0, 12);
    b.plat(9, 0, 4); b.spring(10, 0, 8);
    b.plat(16, 10, 4); b.spring(17, 10, 4);
    b.plat(25, 15, 5);
    b.cells(11, 4, 11, 9, 3); b.cells(18, 13, 18, 17, 2);
    b.arc(30, 15, 49, 10, 6, 4);
    b.plat(49, 10, 6);
    b.checkpoint(52, 10);
    b.plat(57, 3, 5); b.spring(60.2, 3, 6);
    b.plat(63, 10, 5); b.spring(66.2, 10, 6);
    b.plat(71, 17, 5); b.spring(74, 17, 8);
    b.cells(61.1, 6, 61.1, 10, 2); b.cells(67.1, 13, 67.1, 17, 2);
    b.thin(73, 26, 3); b.shard(74.5, 28.5);    // a ledge only the tall spring reaches
    b.plat(79, 12, 5); b.spring(82.2, 12, 3);
    b.plat(87, 14, 3);
    b.plat(96, 10, 10);
    b.goal(102, 10);
    b.shard(27.5, 21);
    b.plat(-12, -3, 3); b.spring(-11.4, -3, 2); b.shard(-10.5, 4);
  }),

  // 47 ── a quicksilver river: hop between ferry pads drifting at three speeds, then lifts
  L('Quicksilver Ferry', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.pool(6, 0, 38);
    b.slide(10, 1, 22, 1, { T: 4, w: 3 });
    b.slide(24, 4, 38, 4, { T: 3, w: 2.6, phase: 0.5 });
    b.slide(16, 8, 32, 8, { T: 5.5, w: 3, phase: 0.25 });
    b.cells(12, 2.4, 40, 2.4, 7);
    b.thin(22, 13, 3); b.shard(23.5, 15);
    b.plat(44, 0, 6);
    b.checkpoint(47, 0);
    b.pool(50, 0, 36);
    b.lift(55, 1, 8, { T: 4 });
    b.slide(61, 9, 72, 9, { T: 3.2, w: 2.6 });
    b.lift(78, 9, 1, { T: 4 });
    b.rect(94, 0, 1.4, 5); b.turret(94.7, 3, -1, { P: 2.6 });
    b.cells(55, 9.5, 78, 10, 6);
    b.shard(66.5, 1.4);                        // skim low over the river
    b.plat(86, 0, 8);
    b.goal(91, 0);
    b.thin(60, 14.5, 3); b.shard(61.5, 16.5);
  }),

  // 48 ── a polar crater in permanent shadow: every surface is ice, every landing a skid
  L('Permanent Shadow', 'precision', (b) => {
    b.start(-6, 0, 12);
    b.ice(10, -2, 3); b.ice(18, -5, 2.5); b.ice(26, -3, 2.5); b.ice(34, -6, 3);
    b.cells(11, -0.5, 35, -4.5, 6);
    b.ice(40, -8, 32);
    b.enemy('spiker', 44, -8, { range: 10, speed: 3 }); b.enemy('spiker', 58, -8, { range: 10, speed: 3 });
    b.block(52, -4, 2);
    b.checkpoint(42, -8);
    b.rect(62, -4.6, 6, 0.8); b.shard(65, -6.6);   // a frost overhang over the rink
    b.ice(76, -4, 2); b.ice(82, 0, 2); b.ice(88, 4, 2);
    b.wall(95, 4, 14); b.wall(98.6, 6, 14);         // a frosted chimney
    b.ice(94, 4, 6);
    b.cells(97.2, 8, 97.2, 18, 4);
    b.shard(97.2, 21);
    b.ice(99.4, 20, 4);
    b.ice(108, 16, 10);
    b.goal(114, 16);
    b.block(53, 2, 1); b.shard(53.5, 4);
  }),

  // 49 ── a staircase of fault chimneys: wall-jump up each crack, exit over the low lip
  L('Fault Chimneys', 'ascent', (b) => {
    b.start(-6, 0, 12);
    b.tower(6, 0, 34, 46);
    const chimney = (x, y0, h) => { b.wall(x, y0 + 2.2, h); b.wall(x + 3.6, y0, h); };
    b.plat(6, 0, 10);
    chimney(10, 0, 12);
    b.plat(14.4, 12, 10);
    b.enemy('spiker', 15, 12, { range: 2.5 });
    chimney(19, 12, 14);
    b.plat(23.4, 26, 8);
    b.checkpoint(27, 26);
    b.crumble(28, 32, 2);
    chimney(31.4, 26, 16);
    b.cells(11.8, 3, 11.8, 12, 4); b.cells(20.8, 15, 20.8, 26, 4); b.cells(33.2, 29, 33.2, 40, 4);
    b.shard(10.4, 16.2);                       // on top of the first left wall
    b.shard(31.8, 46.2);
    b.plat(35.8, 42, 10);
    b.goal(42, 42);
    b.plat(-12, 6, 3); b.shard(-10.5, 8);
  }),

  // 50 ── the Sunrise Line chases you down into Caloris Basin and up its far rim
  L('Caloris Crossing', 'chase', (b) => {
    b.chase({ speed: 4.5 });
    b.start(-6, 12, 14);
    b.plat(15, 8, 5); b.plat(29, 4, 5);
    b.plat(42, 0, 8); b.vent(48, 0, 3, { always: true });
    b.plat(54, 9, 4);
    b.crumble(66, 6, 3); b.crumble(78, 5, 3);
    b.plat(89, 2, 6); b.spring(93, 2, 6);
    b.checkpoint(90, 2);
    b.plat(99, 10, 4);
    b.plat(112, 12, 5);
    b.crumble(125, 13, 3);
    b.plat(134, 12, 6); b.vent(139, 12, 4, { always: true });
    b.thin(138, 24, 4);
    b.plat(150, 26, 12);
    b.goal(158, 26);
    b.arc(8, 12, 15, 8, 2, 2); b.arc(20, 8, 29, 4, 3, 2); b.cells(48, 4, 48, 8, 2);
    b.arc(58, 9, 66, 6, 3, 3); b.arc(69, 6, 78, 5, 3, 3); b.cells(93, 5, 93, 9, 2);
    b.arc(103, 10, 112, 12, 3, 3); b.cells(139, 16, 139, 22, 3);
    b.shard(36, 9); b.shard(72, 13); b.shard(130, 20);
  }),
  // 51 ── perihelion noon: the plain ignites in a rolling wave, then an oven with a burning roof
  L('Perihelion Noon', 'timing', (b) => {
    b.start(-6, 0, 12);
    for (let i = 0; i < 14; i++) b.heat(6 + i * 3, 0, 3, { P: 4, on: 1.6, off: -i * 0.28 });
    b.plat(15, 6, 4); b.plat(33, 6, 4);       // rock umbrellas to wait out the wave
    b.shard(35, 8);
    b.cells(7, 1, 47, 1, 10);
    b.plat(48, 0, 6);
    b.checkpoint(50, 0);
    // the oven: a wave in the floor and a roof that is nearly always alight
    for (let i = 0; i < 8; i++) b.heat(54 + i * 3, 0, 3, { P: 3, on: 1.2, off: -i * 0.3 });
    b.heat(54, 5, 24, { P: 2.4, on: 2 });
    b.shard(66, 6.5);                         // sizzling on the oven roof
    b.cells(55, 1, 77, 1, 6);
    b.plat(78, 0, 5); b.vent(81, 0, 5, { always: true });
    b.cells(81, 4, 81, 12, 3);
    b.thin(79, 14, 4);
    b.shard(81, 19.5);
    b.arc(83, 14, 90, 10, 2, 2);
    b.plat(90, 10, 10);
    b.goal(96, 10);
  }),

  // 52 ── regolith that gives way: a crumbling causeway, a crumbling tower, a collapsing floor
  L('Regolith Collapse', 'precision', (b) => {
    b.start(-6, 0, 12);
    b.crumble(10, 1, 2.4); b.crumble(19, 3, 2.4); b.crumble(28, 1, 2.4); b.crumble(37, 3, 2.4);
    b.arc(6, 0, 45, 2, 9, 2);
    b.shard(23.5, -1.5);                      // low under the causeway
    b.plat(45, 2, 10);
    b.checkpoint(47, 2);
    // the tower: crumbling ledges between two walls, no going back down
    b.wall(52.2, 5, 23); b.wall(62, -2, 30);
    b.pool(55, 2, 7);
    b.crumble(58, 7, 3); b.crumble(53, 12, 3); b.crumble(59, 17, 3); b.crumble(53, 22, 3); b.crumble(59, 27, 3);
    b.cells(57.5, 9, 57.5, 26, 5);
    b.shard(52.6, 30);
    b.plat(64, 28, 6);
    b.crumble(73, 26, 3); b.crumble(76, 26, 3); b.crumble(79, 26, 3); b.crumble(82, 26, 3);
    b.cells(73.5, 27.5, 84.5, 27.5, 5);
    b.plat(77, 18, 3); b.shard(78.5, 20);     // where the floor falls to
    b.plat(90, 24, 10);
    b.goal(96, 24);
  }),

  // 53 ── inside a crashed probe: two decks, bulkheads and buttons that open one and shut another
  L("Messenger's Wreck", 'puzzle', (b) => {
    b.start(-6, 0, 16);
    b.plat(10, 0, 56);                        // lower deck
    b.plat(10, 6, 10); b.plat(24, 6, 10); b.plat(38, 6, 16); b.plat(58, 6, 8);   // upper deck with hatches
    b.rect(9, 12, 58, 1);                     // hull roof
    b.rect(9, 2.2, 1, 9.8);                   // hull wall, crawl in underneath
    b.redWall(30, 0, 6);                      // lower bulkhead
    b.redWall(48, 6, 6);                      // upper bulkhead
    b.switch(42, 6);
    b.blueWall(61, 6, 6);                     // forward bulkhead, shut once the reds open
    b.rect(60, 0, 1, 6);                      // the switch room behind the hatch
    b.switch(56, 0);
    b.turret(10, 6.8, 1, { P: 2.6 });
    b.turret(59.8, 0.8, -1, { P: 2.4 });
    b.checkpoint(40, 6);
    b.shard(40, 1);                           // behind the lower bulkhead
    b.cells(12, 1, 28, 1, 5); b.cells(25, 7, 46, 7, 6); b.cells(55, 1, 58, 1, 2); b.cells(59, 7, 65, 7, 3);
    b.plat(68, 6, 10);
    b.plat(70, 9, 2);
    b.shard(40, 14);                          // on the hull roof
    b.thin(28, 18, 4); b.shard(30, 20);       // the bent antenna
    b.goal(75, 6);
  }),

  // 54 ── the Mariner Express: one pad circles a spire, a second hauls you up the scarp
  L('Mariner Express', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.plat(26, 14, 8, { h: 10 });             // the spire
    b.loop([[9, 1], [9, 14], [30, 22], [51, 14], [51, 1], [30, 1]], { speed: 3.4, w: 3 });
    b.shard(30, 15.5); b.shard(30, 2.6);      // on the spire and tucked under it
    b.cells(9, 4, 9, 12, 3); b.cells(14, 16, 46, 16, 5);
    b.plat(56, 6, 6);
    b.checkpoint(58, 6);
    b.loop([[66, 6], [66, 20], [82, 27], [98, 21]], { speed: 3, loop: false, w: 3 });
    b.enemy('flyer', 74, 25, { ax: 2, ay: 1.5, T: 3 });
    b.enemy('flyer', 90, 26, { ax: 2, ay: 1.5, T: 2.6 });
    b.cells(66, 9, 66, 18, 3); b.cells(70, 23, 94, 24, 5);
    b.shard(82, 33);
    b.plat(102, 21, 8);
    b.goal(107, 21);
  }),

  // 55 ── ion moths orbit every gap of the pillar sea, then swarm a ladder of ledges
  L('Ion Moths', 'enemies', (b) => {
    b.start(-6, 0, 12);
    b.block(12, 1, 2); b.block(21, 3, 2); b.block(30, 2, 2); b.block(39, 4, 2); b.block(48, 2, 2);
    b.enemy('flyer', 17.5, 5, { ax: 1, ay: 2, T: 2.6 });
    b.enemy('flyer', 26.5, 6, { ax: 2, ay: 1, T: 3 });
    b.enemy('flyer', 35.5, 6, { ax: 1, ay: 2.5, T: 2.2 });
    b.enemy('flyer', 44.5, 7, { ax: 2, ay: 1.5, T: 3.4 });
    b.arc(14, 1, 21, 3, 2, 2.5); b.arc(23, 3, 30, 2, 2, 2.5); b.arc(32, 2, 39, 4, 2, 2.5); b.arc(41, 4, 48, 2, 2, 2.5);
    b.shard(35.5, 10.5);                      // above the moth's orbit
    b.shard(44.5, -1.2);                      // under it, skimming the surface
    b.plat(54, 3, 6);
    b.checkpoint(57, 3);
    b.thin(62, 8, 4); b.thin(69, 13, 4); b.thin(62, 18, 4); b.thin(69, 23, 4);
    b.enemy('flyer', 67.5, 10.5, { ax: 4, ay: 0.5, T: 2.4 });
    b.enemy('flyer', 67.5, 15.5, { ax: 4, ay: 0.5, T: 2 });
    b.enemy('flyer', 67.5, 20.5, { ax: 4, ay: 0.5, T: 2.8 });
    b.cells(64, 9.5, 71, 24.5, 4);
    b.plat(62, 28, 3); b.shard(63.5, 30);
    b.plat(78, 25, 4);
    b.enemy('flyer', 88, 20, { ax: 3, ay: 3, T: 3.6 });
    b.arc(82, 25, 96, 12, 4, 3);
    b.plat(96, 12, 10);
    b.goal(102, 12);
  }),

  // 56 ── weird terrain: three braided routes (tunnel, rooftop, mirage) that rejoin twice
  L('Weird Terrain', 'maze', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 6); b.spring(12, 0, 7);
    // low: a tunnel with a walker / middle: the tunnel roof with a spiker / high: mirage ledges
    b.plat(16, 0, 10); b.pool(26, 0, 4); b.plat(30, 0, 12);
    b.rect(16, 3.6, 26, 1);
    b.enemy('walker', 31, 0, { range: 9 });
    b.enemy('spiker', 18, 4.6, { range: 20, speed: 2.4 });
    b.thin(15, 12, 4); b.blink(23, 13, 3, { P: 3, on: 2 }); b.blink(30, 14, 3, { P: 3, on: 2, off: -1 }); b.thin(37, 13, 4);
    b.shard(28, 1.2); b.shard(39, 15);
    b.cells(17, 1, 40, 1, 6); b.cells(18, 5.6, 40, 5.6, 6); b.cells(16, 13.5, 38, 14.5, 5);
    b.plat(46, 2, 6);
    b.checkpoint(48, 2);
    // second braid: a vent up to a crumbling ridge, or crumbles low over the pool
    b.vent(51, 2, 4);
    b.thin(49.5, 14, 3);
    b.plat(58, 16, 4); b.crumble(66, 17, 2); b.plat(73, 16, 3);
    b.shard(74.5, 18);
    b.pool(52, 2, 26);
    b.crumble(56, 2.5, 2.4); b.crumble(63, 3, 2.4); b.crumble(70, 2.5, 2.4);
    b.enemy('flyer', 61, 6, { ax: 1.5, ay: 1.5, T: 2.6 }); b.enemy('flyer', 68, 6, { ax: 1.5, ay: 1.5, T: 3 });
    b.cells(57, 4, 71, 4, 4); b.cells(59, 17.5, 74, 17.5, 4);
    b.plat(78, 2, 6);
    b.plat(88, 4, 10);
    b.goal(94, 4);
  }),

  // 57 ── double sunrise: up a sun-baked ridge, down an icy valley, and over a taller second ridge
  L('Double Sunrise', 'classic', (b) => {
    b.start(-6, 0, 12);
    b.plat(10, 4, 4); b.plat(18, 9, 4); b.plat(26, 14, 4);
    b.heat(32, 17, 8, { P: 2.6, on: 1.1 });
    b.ice(45, 11, 4); b.ice(53, 5, 4);
    b.ice(60, 0, 10);
    b.checkpoint(62, 0);
    b.pool(70, 0, 6);
    b.ice(76, 0, 5); b.vent(80, 0, 5);
    b.thin(78.5, 13, 3);
    b.plat(86, 18, 4); b.plat(94, 23, 4);
    b.heat(100, 26, 8, { P: 2.6, on: 1.1, off: 1.3 });
    b.ice(114, 20, 3); b.ice(122, 14, 3);
    b.plat(130, 8, 10);
    b.goal(136, 8);
    b.cells(11, 5.5, 27, 15.5, 5); b.cells(33, 18.5, 39, 18.5, 3); b.cells(46, 12.5, 55, 6.5, 3);
    b.cells(80, 4, 80, 11, 3); b.cells(87, 19.5, 107, 27.5, 6); b.cells(115, 21.5, 123, 15.5, 3);
    b.shard(36, 14.4);                        // in the shade under the first crest
    b.shard(73, 1.2);                         // over the valley pool
    b.shard(104, 32);                         // the second sunrise
  }),

  // 58 ── fumaroles: the same cracks that launch you also scald you
  L('Fumarole Gauntlet', 'gauntlet', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 36);
    for (let i = 0; i < 5; i++) b.beam('steam', 14 + i * 6, 0, { P: 2.8, on: 1, off: i * 0.5 });
    b.cells(10, 1, 40, 1, 8);
    b.thin(28.5, 8, 3); b.shard(30, 10);
    b.vent(42, 0, 4);
    b.cells(42, 4, 42, 10, 3);
    b.thin(40, 12, 6);
    b.plat(46, 12, 28);
    b.checkpoint(48, 12);
    for (let i = 0; i < 4; i++) b.beam('steam', 53 + i * 6, 12, { P: 2.4, on: 0.9, off: (3 - i) * 0.5 });
    b.vent(71, 12, 3);
    b.shard(71, 24);                          // ride the last fumarole for this
    b.cells(50, 13, 68, 13, 6);
    b.plat(80, 6, 4); b.beam('steam', 82, 6, { P: 3, on: 1 });
    b.plat(88, 2, 10);
    b.goal(94, 2);
    b.plat(-12, -3, 3); b.shard(-10.5, -1);
  }),

  // 59 ── the hard one: blinkers under fire, a vent to a crumbling ridge, an icy descent, a last sprint
  L('Rachmaninoff Rim', 'precision', (b) => {
    b.start(-6, 0, 12);
    b.blink(10, 1, 2.4, { P: 2.4, on: 1.4 }); b.blink(17, 2, 2.4, { P: 2.4, on: 1.4, off: -0.6 });
    b.blink(24, 3, 2.4, { P: 2.4, on: 1.4, off: -1.2 }); b.blink(31, 2, 2.4, { P: 2.4, on: 1.4, off: -1.8 });
    b.rect(38, -4, 1.4, 10); b.turret(38.7, 3.8, -1, { P: 2 });
    b.shard(38.7, 8);
    b.plat(43, 4, 6); b.vent(48, 4, 3);
    b.thin(46.5, 14, 3);
    b.crumble(54, 16, 2); b.crumble(61, 18, 2); b.crumble(68, 16, 2);
    b.shard(61, 25);
    b.plat(75, 14, 4);
    b.checkpoint(77, 14);
    b.ice(81, 9, 2.5); b.ice(88, 5, 2.5); b.ice(81, 1, 2.5);
    b.plat(88, -3, 6); b.enemy('spiker', 88.5, -3, { range: 4.5, speed: 2 });
    b.shard(84, -2);
    b.crumble(98, -2, 2.2); b.crumble(104, 0, 2.2); b.blink(110, 2, 2.6, { P: 2.6, on: 1.6 }); b.crumble(117, 3, 2.2);
    b.plat(124, 4, 9);
    b.rect(131.8, 4, 1.2, 3); b.turret(131.8, 4.8, -1, { P: 2.2 });
    b.goal(128, 4);
    b.cells(11, 2.5, 32, 3.5, 6); b.cells(55, 17.5, 69, 17.5, 4); b.cells(82, 10.5, 82, 2.5, 3); b.cells(99, -0.5, 118, 4.5, 5);
  }),

  // 60 ── FINALE: switch stairs, a vent, the wheel, a chimney, then the Sunrise Line chases you home
  L('Caloris Basin', 'finale', (b) => {
    b.start(-6, 0, 12);
    b.pool(6, 0, 10);
    b.plat(16, 0, 6); b.switch(18, 0);
    b.blue(25, 4, 3); b.blue(31, 8, 3);
    b.plat(37, 12, 6); b.vent(42, 12, 4);
    b.thin(40.5, 22, 3);
    b.ferris(55, 22, 6, { n: 3, omega: 0.5 });
    b.shard(55, 22);
    b.plat(65, 24, 13);
    b.wall(72, 26.2, 12); b.wall(75.6, 24, 12);
    b.shard(73.8, 37);
    b.plat(76.4, 36, 6);
    b.checkpoint(79, 36);
    b.chase({ speed: 4.6, trigger: 79, behind: 16 });
    b.plat(90, 32, 4);
    b.crumble(100, 29, 3); b.crumble(110, 26, 3);
    b.plat(119, 22, 6); b.vent(123.5, 22, 3, { always: true });
    b.thin(122.5, 30, 4);
    b.plat(134, 28, 4);
    b.plat(142, 22, 6); b.spring(146, 22, 5);
    b.plat(152, 28, 4);
    b.crumble(162, 26, 3);
    b.plat(172, 24, 12);
    b.goal(180, 24);
    b.cells(26.5, 5.5, 32.5, 9.5, 2); b.cells(42, 15, 42, 20, 2); b.cells(73.8, 27, 73.8, 34, 3);
    b.arc(82, 36, 90, 32, 2, 2); b.arc(94, 32, 110, 26, 4, 3); b.cells(123.5, 25, 123.5, 28, 2);
    b.arc(138, 28, 142, 22, 1, 2); b.cells(147, 25, 147, 30, 2); b.arc(156, 28, 172, 24, 4, 3);
    b.shard(105, 34);
  }),
];
