// WORLD 1 — THE SUN. 30 hand-written levels.
// Units: single jump ≈ 2.4 high / 6 far, double jump ≈ 4.4 high / 10 far, run 8.5/s.
// Every level has its own idea; see the comment above each one.
// Moving things everywhere: plasma tethers (vine), coronal-loop cables (zip), flare cannons (barrel),
// heat-shield pads on chains (pendulum), sinking sunspot rafts (sinker), magnetic floaters (floater),
// swinging plasma balls (wrecker), rotating flare beams (sweeper) and plasma twisters (tornado).
import { L } from './dsl.js';

export default [
  // 1 ── teach run / jump / double jump over the plasma sea, then a first taste of motion: a drifting pad, a plasma tether, a magnetic floater
  L('Sunrise Steps', 'intro', (b) => {
    b.start(-6, 0, 16);
    b.arc(10, 0, 14, 0, 3, 2);
    b.plat(14, 0, 6);
    b.plat(23, 1, 5);
    b.slide(33.5, 2, 33.5, 3.5, { T: 4, w: 3.4 });
    b.cells(32, 4.6, 35, 4.6, 3);
    b.plat(39, 0, 7);
    b.checkpoint(42, 0);
    b.vine(50.5, 8, 6);                                   // first plasma tether over a wide gap
    b.arc(46, 0, 55, 0, 4, 3.4);
    b.plat(55, 0, 6);
    b.floater(64, 0, 3, { rise: 6 });                     // a magnetic floater: stand on it to rise
    b.cells(65.5, 2, 65.5, 6, 3);
    b.plat(71, 5, 4);
    b.slide(79.5, 5, 85.5, 5, { T: 4, w: 3 });
    b.plat(89, 5, 10);
    b.goal(95, 5);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.shard(50.5, 6);                                   // above the tether: let go at the top of the swing
    b.shard(65.5, 11);                                    // ride the floater all the way up
  }),

  // 2 ── heat-shield pads that drift, patrol, rise and swing on chains
  L('Heat Shield Hop', 'classic', (b) => {
    b.start(-6, 0, 14);
    b.slide(13, 0, 21, 0, { T: 4, w: 3 });
    b.cells(13, 1.2, 21, 1.2, 4);
    b.plat(25, 0, 5);
    b.pendulum(35.5, 10, 8, { amp: 35, T: 3.6 });        // a shield pad on a chain
    b.cells(33, 3.6, 38, 3.6, 3);
    b.plat(41, 4, 5);
    b.checkpoint(43.5, 4);
    b.slide(51, 4, 59, 2.5, { T: 5, w: 3, phase: 0.3 });
    b.floater(62, 2, 3, { rise: 6 });
    b.cells(63.5, 4, 63.5, 10, 3);
    b.shard(63.5, 12.5);
    b.plat(68, 7, 5);
    b.pendulum(78.5, 15, 8, { amp: 30, T: 4 });          // two chained pads swinging in counter-phase
    b.pendulum(88, 15, 8, { amp: 30, T: 4, phase: 0.5 });
    b.cells(78.5, 8.6, 88, 8.6, 4);
    b.plat(93, 7, 10);
    b.goal(99, 7);
    b.plat(-15, 2, 3); b.shard(-13.5, 4);
    b.shard(83.25, 11.2);
  }),

  // 3 ── flares fire in a rolling sequence down a long walkway; a flare cannon bridges the gap; ride the coronal cable through the second run
  L('Flare Alley', 'gauntlet', (b) => {
    b.start(-6, 0, 12);
    b.plat(9, 0, 36);
    for (let i = 0; i < 5; i++) b.beam('flare', 14 + i * 6.5, 0, { P: 3.2, on: 0.9, off: i * 0.55 });
    b.cells(13, 1, 41, 1, 8);
    b.thin(24, 3.6, 4); b.shard(26, 5.2);
    b.barrel(49, 2.4, { angle: 35, power: 19 });          // flare cannon: hop in, press jump
    b.arc(49, 2.4, 60, 3, 4, 3);
    b.plat(58, 3, 6);
    b.checkpoint(61, 3);
    b.plat(67, 4, 30);
    for (let i = 0; i < 4; i++) b.beam('flare', 72 + i * 7, 4, { P: 2.6, on: 0.8, off: (3 - i) * 0.5 });
    b.zip(68, 9.2, 96, 7.2);                              // the cable runs right through the beams
    b.cells(70, 5, 94, 5, 7);
    b.shard(82.5, 8.6);
    b.plat(100, 4, 10);
    b.goal(106, 4);
    b.plat(-14, 1, 3); b.shard(-12.5, 3);
  }),

  // 4 ── two decks of sunspot tiles igniting in opposite waves under a swinging plasma ball, then a sunspot stair with floaters and a cable home
  L('Sunspot Checkers', 'puzzle', (b) => {
    b.start(-6, 0, 12);
    for (let i = 0; i < 8; i++) b.heat(8 + i * 3, 0, 3, { P: 3.6, on: 1.4, off: i * 0.45 });
    for (let i = 0; i < 8; i++) b.heat(8 + i * 3, 4.2, 3, { P: 3.6, on: 1.4, off: (7 - i) * 0.45 + 1.8, h: 0.6 });
    b.wrecker(20, 13, 6, { amp: 50, T: 3.6 });            // plasma ball sweeping the upper deck
    b.cells(9, 1, 30, 1, 6); b.cells(9, 5.2, 30, 5.2, 6);
    b.plat(32, 2, 6);
    b.checkpoint(35, 2);
    // the staircase: sunspot steps and two magnetic floaters
    b.heat(41, 3, 3, { P: 3, on: 1, off: 0 });
    b.heat(45.5, 4.6, 3, { P: 3, on: 1, off: 0.5 });
    b.floater(50, 6.2, 3, { rise: 3 });
    b.heat(54.5, 7.8, 3, { P: 3, on: 1, off: 1.5 });
    b.floater(59, 9.4, 3, { rise: 3 });
    b.heat(63.5, 11, 3, { P: 3, on: 1, off: 2.5 });
    b.cells(42, 5, 64, 13, 5);
    b.plat(68, 12, 8);
    b.shard(72, 16.6);
    b.zip(77, 14, 95, 6.6);                               // coronal cable down to the exit
    b.cells(80, 11.5, 92, 7, 4);
    b.plat(93, 4, 12);
    b.goal(101, 4);
    b.plat(-15, 2, 3); b.shard(-13.5, 4);
    b.shard(20, 7.5);                                     // right in the plasma ball's path
  }),

  // 5 ── the Solar Wave arrives: an auto flare cannon, crumbling rafts, a long cable and a spring. No waiting, keep moving.
  L('Solar Wave', 'chase', (b) => {
    b.chase({ speed: 3.8 });
    b.start(-6, 0, 14);
    b.plat(12, 0, 5); b.plat(21, 1, 5);
    b.barrel(30.5, 3.2, { angle: 32, auto: true });       // fires by itself
    b.plat(42, 3, 5);
    b.crumble(51, 3.5, 3); b.crumble(57, 4, 3);
    b.plat(62, 4, 7);
    b.checkpoint(65, 4);
    b.zip(70, 8.2, 90, 3.4);
    b.plat(86, 1, 7);
    b.spring(91, 1, 6);
    b.plat(95, 8, 5);
    b.crumble(104, 7, 2.5); b.crumble(109, 6, 2.5);
    b.plat(114, 6, 12);
    b.goal(122, 6);
    b.arc(12, 0, 26, 1, 4, 2); b.arc(30, 3, 43, 3, 4, 3); b.cells(72, 6, 86, 3, 5); b.cells(96, 9, 99, 9, 3);
    b.shard(36, 8); b.shard(-12, 3.5); b.plat(-14, 1.5, 3); b.shard(97.5, 12.5);
  }),

  // 6 ── a scaffold tower: a floater ride past a swinging plasma ball, a wall-jump chimney, then a cable off the top
  L('Corona Spire', 'ascent', (b) => {
    b.start(-6, 0, 12);
    b.tower(8, -2, 14, 40);
    b.plat(9, 2.5, 4);
    b.floater(16.5, 5, 3, { rise: 6 });                   // magnetic floater up the first floors
    b.plat(9, 8, 4);
    b.thin(12, 14, 6);
    b.wrecker(15, 21.5, 4.5, { amp: 45, T: 3.4 });        // swings across the thin ledge
    b.plat(9, 17, 4); b.plat(17, 20, 4);
    b.checkpoint(19, 20);
    // chimney: two walls 3 apart, climb by wall-jumping
    b.wall(14, 21, 12); b.wall(17.8, 23.5, 9.5);
    b.cells(16.2, 24, 16.2, 31, 4);
    b.plat(9, 33, 4); b.cells(10, 34.5, 12, 34.5, 3);   // a ledge left of the chimney top
    b.plat(19.5, 33, 5);
    b.shard(16.2, 35.4);
    b.zip(25.5, 35.6, 46, 26.2);                          // ride the cable down off the spire
    b.cells(28, 33.5, 43, 26.5, 5);
    b.plat(44, 23, 12);
    b.goal(52, 23);
    b.shard(-12, 3.5); b.plat(-14, 1.5, 3);
    b.shard(13, 17); b.cells(10, 9, 13, 9, 2); b.cells(18, 7, 18, 11, 3);
  }),

  // 7 ── NEW: a battery of flare cannons over the plasma sea: fixed, then chained, then rocking, then spinning, then straight up
  L('Flare Cannon Battery', 'cannons', (b) => {
    b.start(-6, 0, 12);
    b.barrel(10.5, 2.2, { angle: 30 });                   // fixed: just press jump
    b.arc(10.5, 2.2, 23, 2, 4, 3);
    b.plat(22, 2, 5);
    b.barrel(31, 4, { angle: 60 });                       // chained: cannon into cannon
    b.barrel(39, 8.5, { angle: 0 });
    b.cells(33, 7, 37, 8.5, 3);
    b.plat(49, 7, 6);
    b.checkpoint(52, 7);
    b.barrel(59.5, 9, { angle: 40, sweep: 35, spin: 2 }); // rocking: fire on the low swing
    b.cells(62, 10.5, 69, 10.5, 3);
    b.plat(71, 9, 4);
    b.barrel(79, 11.5, { angle: 0, spin: 120 });          // spinning: fire when it points at the pad
    b.plat(89, 12, 5);
    b.barrel(97, 14.5, { angle: 80, power: 26 });         // straight up through a one-way ledge
    b.cells(98, 17, 99.5, 21, 3);
    b.thin(99, 21, 5);
    b.plat(108, 20, 12);
    b.goal(116, 20);
    b.shard(16, 5.4);                                       // blast high off the first cannon
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.shard(79, 16.5);                                    // aim the spinning cannon straight up
  }),

  // 8 ── crumbling chains over a fire field: a tether between crumbles, then a high crumble line or a low line of sinking rafts, then a chain pad
  L('Crumbling Corona', 'precision', (b) => {
    b.start(-6, 0, 12);
    b.crumble(9, 0, 2.4); b.crumble(14, 1.2, 2.4);
    b.vine(21, 9, 6);
    b.crumble(26, 1, 2.4); b.crumble(30.5, 0, 2.4);
    b.plat(35, 1, 5);
    b.checkpoint(37, 1);
    // high line (more cells) vs low line of sinking rafts
    for (let i = 0; i < 4; i++) b.crumble(43 + i * 4.6, 4 + i * 0.6, 2);
    b.cells(44, 6, 58, 8, 6);
    for (let i = 0; i < 4; i++) b.sinker(44 + i * 5, 0, 2.4, { depth: 2, speed: 1.2 });
    b.plat(64, 4, 5);
    b.crumble(72, 5, 1.8);
    b.pendulum(78, 13, 6, { amp: 25, T: 3.4, w: 2.4 });
    b.crumble(84, 5, 1.8);
    b.shard(78, 10.5);
    b.plat(88, 3, 10);
    b.goal(94, 3);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.shard(54, 9.4);
    b.cells(17, 4, 25, 4, 3);
  }),

  // 9 ── NEW: coronal loops: ride the cables down the prominence arcs, a floater and a flare cannon hoist you back up, a plasma ball guards the second loop
  L('Coronal Loops', 'zipline', (b) => {
    b.start(-6, 0, 12);
    b.floater(8, 0, 3, { rise: 7 });
    b.zip(12, 10.5, 30, 3);                               // loop one
    b.cells(14, 8.2, 28, 2.5, 5);
    b.plat(29, 1, 6);
    b.barrel(38, 3, { angle: 70, power: 24 });            // cannon up onto loop two
    b.zip(40, 12.5, 62, 6.6);
    b.wrecker(51, 20, 8.5, { amp: 40, T: 3.2 });          // hop off the cable to let it pass
    b.cells(43, 10, 59, 6, 5);
    b.plat(62, 5, 6);
    b.checkpoint(65, 5);
    b.pendulum(74, 16, 8, { amp: 35, T: 3.6 });           // swing up to the last, highest loop
    b.zip(80, 13.5, 104, 5);
    b.cells(83, 11, 101, 4.8, 6);
    b.plat(103, 3, 12);
    b.goal(110, 3);
    b.shard(9.5, 12.5);                                   // top of the floater ride
    b.shard(51, 9.5);                                    // jump off the cable under the plasma ball
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 10 ── ride a single shield pad along a prominence arc under a swinging plasma ball, then a square loop, then a rotating flare beam guards the exit
  L('Prominence Express', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.loop([[9, 0], [20, 6], [34, 10], [48, 6], [60, 0], [74, 4], [86, 4]], { speed: 3.2, loop: false, w: 3.2 });
    b.beam('flare', 27, 7, { P: 3.4, on: 0.9 });
    b.wrecker(41, 20, 9, { amp: 40, T: 3.4 });
    b.beam('flare', 54, 2, { P: 3.4, on: 0.9, off: 1.5 });
    b.cells(14, 4.5, 30, 10, 6); b.cells(40, 10, 58, 3, 6); b.cells(64, 3.5, 82, 5, 5);
    b.thin(31, 13.6, 6); b.shard(34, 15.2);
    b.plat(91, 4, 8);
    b.checkpoint(95, 4);
    b.loop([[102, 4], [102, 12], [114, 12], [114, 4]], { speed: 3, w: 3 });
    b.plat(119, 6, 14);
    b.sweeper(124, 9, 3.5, { omega: 80, both: true });    // duck under it as it lies flat
    b.shard(108, 15.5);
    b.goal(130, 6);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 11 ── floor buttons swap red and blue blocks: plan the order, dodge the plasma ball in the hall, swing out on a shield pad
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
    b.wrecker(66.5, 8, 2.6, { amp: 60, T: 3 });           // swinging in the hall
    b.blue(76, 3, 5); b.redWall(84, 3, 6); b.plat(82, 3, 6); b.switch(83, 3);
    b.pendulum(93, 11, 8, { amp: 30, T: 3.6 });
    b.plat(99, 3, 8);
    b.goal(104, 3);
    b.cells(10, 1.2, 24, 1.2, 4); b.cells(37, 2.5, 50, 4.5, 4); b.cells(77, 4.2, 81, 4.2, 2); b.cells(90, 4.6, 96, 4.6, 3);
    b.thin(56.5, 6.4, 3); b.shard(66, 9.8); b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.blue(36, 6, 3); b.shard(37.5, 8);
  }),

  // 12 ── platforms of solid light blink in a travelling wave over a drifting updraft; a flicker ladder; tethers swing you down the far side
  L('Flicker Field', 'timing', (b) => {
    b.start(-6, 0, 12);
    for (let i = 0; i < 7; i++) b.blink(9 + i * 5, (i % 3) * 0.8, 3, { P: 3.5, on: 2.2, off: -i * 0.5 });
    b.tornado(14, 40, -3, { rise: 9, T: 7 });            // a plasma updraft roams under the field
    b.plat(45, 1, 5);
    b.checkpoint(47, 1);
    // a vertical flicker ladder
    for (let i = 0; i < 6; i++) b.blink(52 + (i % 2) * 5, 3 + i * 2.6, 3, { P: 3, on: 1.9, off: -i * 0.45 });
    b.plat(62, 18, 6);
    b.shard(65, 21.5);
    b.blink(72, 16, 3, { P: 3, on: 1.8 });
    b.vine(79.5, 24, 6);
    b.blink(85, 12, 3, { P: 3, on: 1.8, off: -1 });
    b.vine(92, 20, 6);
    b.plat(98, 6, 10);
    b.goal(104, 6);
    b.cells(10, 2, 40, 2, 8); b.cells(76, 17, 89, 13, 4);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.shard(29.5, 6);
  }),

  // 13 ── springs stitched into a three-tier pinball course, a shield pad on a chain, a spinning flare cannon to finish
  L('Spring Corona', 'bounce', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 6); b.spring(11, 0, 6);
    b.plat(16, 7, 5); b.spring(18, 7, 5);
    b.plat(24, 13, 6);
    b.cells(12, 4, 12, 9, 3); b.cells(19, 11, 19, 16, 3);
    b.pendulum(36, 20, 7, { amp: 35, T: 3.8 });
    b.plat(41, 7, 4);
    b.plat(47, 2, 8); b.spring(52, 2, 9);
    b.checkpoint(49, 2);
    b.rect(50, 17, 8, 0.8);                    // ceiling: spring launches past it at the edge
    b.plat(57, 13, 5);
    b.thin(64, 17, 5); b.shard(66.5, 19);
    b.plat(68, 10, 4); b.spring(70, 10, 4);
    b.barrel(75, 15, { spin: 120 });           // bounce into the spinning cannon
    b.plat(86, 9, 10);
    b.goal(92, 9);
    b.cells(33, 14.5, 39, 14.5, 3); b.cells(77, 14, 84, 11, 3);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.shard(27, 17);
  }),

  // 14 ── down into a sunspot: a cable under a hanging flare, sinking rafts, then a plasma ball swinging in the dark cave
  L('Into the Sunspot', 'descent', (b) => {
    b.start(-6, 20, 14);
    b.plat(12, 17, 6); b.rect(10, 24, 30, 1);
    b.zip(19, 19, 36, 11);
    b.beam('flare', 29, 8, { P: 3, on: 0.9, h: 16 });     // crosses the cable
    b.plat(40, 6, 8);
    b.checkpoint(44, 6);
    b.rect(38, 12, 24, 1);
    b.sinker(51, 3, 2.4, { depth: 2 }); b.sinker(56, 0, 2.4, { depth: 2 });
    b.plat(61, -3, 8); b.enemy('walker', 62, -3, { range: 5 });
    b.beam('flare', 66, -3, { P: 2.6, on: 0.8, h: 15, off: 1 });
    b.plat(73, -6, 4); b.plat(80, -9, 14);
    b.rect(74, -1, 20, 1);
    b.wrecker(85, -1, 5, { amp: 45, T: 3.2 });
    b.goal(91, -9);
    b.cells(14, 18, 34, 12, 6); b.cells(52, 4, 58, 1, 3); b.cells(76, -8, 82, -8, 3);
    b.shard(26, 18.6); b.plat(-14, 22, 3); b.shard(-12.5, 24);
    b.shard(64, 1.5);
  }),

  // 15 ── the plasma rises; climb the coronal scaffold on a floater, a flare cannon and a tether before it swallows you
  L('Rising Plasma', 'tide', (b) => {
    b.rise({ rate: 0.75, delay: 4 });
    b.start(-6, 0, 12);
    b.tower(6, -4, 18, 46);
    b.plat(8, 3, 4); b.plat(16, 6, 4);
    b.floater(9, 9, 3, { rise: 7, speed: 2.4 });
    b.plat(16, 18, 4);
    b.checkpoint(18, 18);
    b.barrel(13, 21.5, { angle: 100, power: 24 });        // blast up through the one-way ledge
    b.thin(7, 28, 4);
    b.vine(14.5, 37, 6);
    b.plat(19, 33, 4);
    b.floater(13.5, 35, 3, { rise: 5, speed: 2.4 });
    b.plat(22, 41, 4); b.plat(30, 41, 10);
    b.goal(36, 41);
    b.cells(10.5, 5, 10.5, 16, 5); b.cells(12, 24, 9, 27, 3); b.cells(15, 37, 21, 40, 3);
    b.shard(19, 27.5); b.shard(15, 43.5);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 16 ── NEW: plasma twisters drift over the sea; hitch a ride up to the drone-guarded sky islands
  L('Plasma Twisters', 'tornado', (b) => {
    b.start(-6, 0, 12);
    b.tornado(9, 15, 0, { rise: 8, T: 4 });
    b.plat(18, 9, 5);
    b.enemy('flyer', 25, 12, { ax: 1.5, ay: 1.2, T: 3 });
    b.plat(27, 3, 4);
    b.tornado(34, 40, 3, { rise: 9, T: 5 });
    b.enemy('flyer', 38, 14, { ax: 3, ay: 1, T: 3.4 });
    b.plat(43, 12, 5);
    b.checkpoint(45.5, 12);
    b.plat(52, 6, 4);
    b.tornado(59, 65, 6, { rise: 10, T: 4.5 });
    b.plat(68, 15, 4);
    b.enemy('flyer', 72, 18, { ax: 2, ay: 1, T: 2.6 });
    b.plat(75, 9, 3);
    b.tornado(81, 87, 9, { rise: 9, T: 4, phase: 0.3 });
    b.plat(90, 17, 10);
    b.goal(96, 17);
    b.cells(9, 4, 15, 8, 3); b.cells(34, 7, 40, 11, 3); b.cells(59, 10, 65, 14, 3); b.cells(81, 13, 87, 16, 3);
    b.shard(12, 12.5); b.shard(62, 18.5);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 17 ── twin suns: lifts in counter-phase, then three shield pads swinging in counter-phase on long chains
  L('Twin Suns', 'timing', (b) => {
    b.start(-6, 0, 12);
    b.lift(10, 0, 10, { T: 5 }); b.lift(16, 10, 0, { T: 5 });
    b.plat(20, 9, 5);
    b.lift(29, 9, 3, { T: 4 }); b.lift(35, 3, 15, { T: 4.4 });
    b.plat(39, 14, 6);
    b.checkpoint(42, 14);
    b.pendulum(50, 22, 8, { amp: 30, T: 4, w: 2.6 });
    b.pendulum(59.5, 22, 8, { amp: 30, T: 4, w: 2.6, phase: 0.5 });
    b.pendulum(69, 22, 8, { amp: 30, T: 4, w: 2.6 });
    b.cells(50, 15.4, 69, 15.4, 5);
    b.plat(75, 14, 4); b.plat(82, 10, 10);
    b.goal(88, 10);
    b.cells(10, 4, 16, 6, 3);
    b.shard(59.5, 19.5); b.shard(22.5, 13);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 18 ── magnetic loops: rings of pads turning in opposite directions, with a spinning flare cannon at the hub of the giant one
  L('Magnetic Loops', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.ferris(16, 2, 6, { n: 6, omega: 0.55 });
    b.plat(26, 4, 5);
    b.checkpoint(28, 4);
    b.ferris(42, 5, 8, { n: 8, omega: -0.45 });
    b.barrel(42, 5, { spin: 90 });                        // drop into the hub, fire out
    b.plat(54, 8, 5);
    b.ferris(66, 10, 5, { n: 4, omega: 0.8 });
    b.plat(75, 10, 10);
    b.goal(81, 10);
    b.cells(16, 9.5, 16, 9.5, 1); b.cells(42, 14.5, 42, 14.5, 1);
    b.cells(27, 5.2, 30, 5.2, 3); b.cells(55, 9.2, 58, 9.2, 3); b.cells(76, 11.2, 84, 11.2, 4);
    b.shard(42, 16.5); b.shard(66, 17);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 19 ── solar wind gusts fling you across gaps too wide to jump; a floater rises into a headwind; a twister roams under the last gust
  L('Solar Wind', 'wind', (b) => {
    b.start(-6, 0, 12);
    b.wind(6, -6, 18, 16, 9, { gust: true, P: 3.6, on: 1.8 });
    b.plat(20, 0, 6);
    b.wind(26, -6, 20, 16, 10, { gust: true, P: 3.2, on: 1.6, off: 1 });
    b.plat(42, 1, 6);
    b.checkpoint(45, 1);
    b.floater(51, 2, 3, { rise: 6 });
    b.wind(50, 3, 12, 10, -6, { P: 4, on: 2 });           // headwind: wait for calm
    b.plat(59, 8, 3);
    b.wind(63, -2, 22, 18, 10, { gust: true, P: 3, on: 1.5 });
    b.tornado(67, 78, -2, { rise: 9, T: 5 });             // a twister that can catch a short jump
    b.plat(81, 8, 10);
    b.goal(87, 8);
    b.cells(10, 4, 18, 4, 4); b.cells(30, 5, 40, 5, 5); b.cells(52.5, 4, 52.5, 8, 3); b.cells(66, 11, 78, 11, 5);
    b.shard(31, 5.5); b.shard(72, 12.5);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 20 ── a longer chase: a spring, a long cable down, crumbles, then a chain of auto-firing flare cannons
  L('Chromosphere Run', 'chase', (b) => {
    b.chase({ speed: 4.4 });
    b.start(-6, 0, 14);
    b.plat(12, 2, 5); b.plat(21, 4, 5); b.spring(24, 4, 6);
    b.plat(30, 11, 5);
    b.zip(36, 14.5, 52, 5.6);
    b.crumble(54, 4, 2.4); b.crumble(59, 4.5, 2.4); b.crumble(64, 5, 2.4);
    b.plat(70, 5, 6);
    b.checkpoint(73, 5);
    b.barrel(80, 7.5, { angle: 25, auto: true });
    b.plat(93, 7, 4);
    b.barrel(100.5, 9, { angle: 60, auto: true });
    b.barrel(108, 13.5, { angle: 0, auto: true });
    b.plat(112, 10, 14);
    b.goal(122, 10);
    b.arc(26, 4, 30, 11, 3, 2); b.cells(38, 12, 50, 6, 4); b.arc(80, 7.5, 93, 7, 4, 2.5);
    b.shard(44, 10.5); b.shard(104, 10.5);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 21 ── NEW: a swingset of heat-shield pads on chains over the plasma sea, plasma balls swinging between them, and one giant pendulum to finish
  L('Heat-Shield Swingset', 'swing', (b) => {
    b.start(-6, 0, 12);
    b.pendulum(11, 9, 8, { amp: 35, T: 3.6 });
    b.pendulum(23.5, 10, 8, { amp: 35, T: 3.6, phase: 0.5 });
    b.plat(31, 3, 4);
    b.pendulum(41.5, 12, 8, { amp: 40, T: 4 });
    b.wrecker(47.75, 16, 8, { amp: 50, T: 4 });           // swings in step with the pads
    b.pendulum(54, 13, 8, { amp: 40, T: 4, phase: 0.5 });
    b.plat(61, 7, 6);
    b.checkpoint(64, 7);
    b.pendulum(73, 16, 8, { amp: 35, T: 3.4 });
    b.wrecker(79.25, 19, 7, { amp: 55, T: 3.4 });
    b.pendulum(85.5, 17, 8, { amp: 35, T: 3.4, phase: 0.5 });
    b.pendulum(103, 22, 14, { amp: 45, T: 5.2, w: 3.4 }); // the giant
    b.plat(116, 12, 10);
    b.goal(122, 12);
    b.cells(11, 2.5, 23.5, 3.5, 4); b.cells(41.5, 5.5, 54, 6.5, 4); b.cells(73, 9.5, 85.5, 10.5, 4); b.arc(93, 12, 113, 12, 5, -2.5);
    b.shard(17.25, 6.5); b.shard(79.25, 13.8); b.shard(103, 11);
  }),

  // 22 ── everything ticks to one beat: flares, blinkers, heat tiles, a rotating flare beam and a plasma ball, all on a 2 s clock
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
    b.sweeper(69, 5.2, 3.6, { omega: 120, both: true }); // follow the blade across
    b.plat(78, 2, 4);
    b.wrecker(80, 9, 4.5, { amp: 50, T: P });
    for (let i = 0; i < 4; i++) b.blink(84 + i * 4.5, 3 + i, 2.4, { P, on: 1.3, off: i * 0.5 });
    b.plat(103, 6, 10);
    b.goal(109, 6);
    b.cells(9, 2.5, 46, 2.5, 8); b.cells(61, 2.2, 76, 2.2, 5);
    b.shard(66, 5); b.shard(98, 9);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 23 ── NEW: flare turbines: slip under a spinning blade, ride a wheel whose blades turn between its pads, chase a giant blade, then fire out of a turbine's eye
  L('Flare Turbines', 'turbine', (b) => {
    b.start(-6, 0, 12);
    b.plat(9, 0, 16);
    b.sweeper(17, 4.4, 3.8, { omega: 70, both: true });
    b.plat(29, 2, 4);
    b.ferris(43, 6, 5.5, { n: 4, omega: 0.6, w: 2.6 });
    b.sweeper(43, 6, 7.5, { omega: 34.38, a0: 45, both: true });   // blades ride between the pads
    b.plat(53, 6, 6);
    b.checkpoint(56, 6);
    b.plat(62, 6, 20);
    b.sweeper(72, 15.5, 9.5, { omega: 120 });             // one huge blade: run in behind it
    b.plat(86, 8, 4);
    b.barrel(96, 12, { angle: 45, spin: 90 });            // the cannon in the turbine's eye…
    b.sweeper(96, 12, 5, { omega: 90, a0: 225 });         // …with its blade always behind the muzzle
    b.plat(106, 12, 10);
    b.goal(112, 12);
    b.cells(11, 1, 23, 1, 5); b.cells(43, 12.6, 43, 12.6, 1); b.cells(64, 7, 80, 7, 6); b.cells(91, 9.5, 94, 11, 2);
    b.thin(21, 4, 3); b.shard(22.5, 5.6); b.shard(43, 6.8); b.shard(96, 18.5);
  }),

  // 24 ── NEW: a highwire of plasma tethers: chained swings with no ground between, a drifting shield pad as the only rest, plasma balls in the gaps
  L('Plasma Tethers', 'swing', (b) => {
    b.start(-6, 2, 12);
    b.vine(11, 10, 6); b.vine(19.5, 10, 6);
    b.slide(27, 2, 33, 2, { T: 3, w: 3 });
    b.vine(39, 11, 6);
    b.plat(44, 3, 5);
    b.checkpoint(46.5, 3);
    b.plat(52, 3, 4);
    b.wrecker(65.5, 20, 9, { amp: 40, T: 3 });
    b.vine(61, 13, 6); b.vine(70, 13, 6);
    b.enemy('flyer', 56, 8, { ax: 1, ay: 1.5, T: 3 });
    b.plat(76, 3, 5);
    b.vine(86, 13, 6);
    b.plat(91, 9, 4); b.plat(100, 10, 9);
    b.goal(105, 10);
    b.cells(9, 6, 21, 6, 4); b.cells(36, 7, 42, 7, 2); b.arc(56, 3, 76, 3, 6, 3); b.cells(83, 10, 89, 10, 2);
    b.shard(15.25, 2); b.shard(39, 8);
    b.plat(-14, 3.5, 3); b.shard(-12.5, 5.5);
  }),

  // 25 ── inside the fusion core: floaters and an up-cannon between plasma cannons and burning tiles, a plasma ball at the top, a cable out
  L('Fusion Core', 'ascent', (b) => {
    b.start(-6, 0, 12);
    b.tower(8, -2, 22, 40);
    b.floater(9.5, 0, 3, { rise: 10 });
    b.plat(14, 10, 6); b.heat(20, 10, 3, { P: 3, on: 1 });
    b.rect(28, 8, 1.4, 6); b.turret(28.7, 11, -1, { P: 2.2 });
    b.plat(23, 10, 5);
    b.barrel(17, 13.5, { angle: 90, power: 28 });         // straight up the core
    b.plat(9, 22, 5); b.plat(20, 22, 6);
    b.checkpoint(23, 22);
    b.rect(8, 23, 1.4, 6); b.turret(8.7, 23.8, 1, { P: 2.6 });
    b.plat(12, 26, 4); b.plat(19, 29, 4); b.heat(24, 29, 3, { P: 2.8, on: 1, off: 1 });
    b.floater(10.5, 29, 3, { rise: 8 });
    b.plat(14, 37, 12);
    b.wrecker(20, 44, 5.5, { amp: 50, T: 3.2 });
    b.zip(27, 39.5, 41, 31.5);
    b.plat(40, 29, 10);
    b.goal(46, 29);
    b.cells(14, 11, 26, 11, 5); b.cells(12, 30, 12, 36, 3); b.cells(17, 15, 17, 20, 3); b.cells(29, 37, 38, 32.5, 3);
    b.shard(28.7, 16); b.shard(25, 40.5);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 26 ── NEW: sunspot rafts sink under your weight and magnetic floaters rise: keep hopping, ride one down for a shard, one up to escape
  L('Sinking Sunspots', 'sinkers', (b) => {
    b.start(-6, 0, 12);
    b.sinker(9, 0, 3, { depth: 3 }); b.sinker(15, 0.5, 3, { depth: 3 }); b.sinker(21, 1, 3, { depth: 3 });
    b.floater(27, 1, 3, { rise: 6 });
    b.plat(33, 8, 5);
    b.wrecker(44, 17, 7, { amp: 50, T: 3 });
    b.sinker(41, 6, 3, { depth: 4 }); b.sinker(47, 6, 3, { depth: 4 });
    b.plat(53, 6, 6);
    b.checkpoint(56, 6);
    b.sinker(62, 6, 3, { depth: 5 });                     // ride it down…
    b.floater(68, 1, 3, { rise: 8 });                     // …and the floater back up
    b.plat(74, 10, 4);
    b.sinker(81, 9, 3, { depth: 3, speed: 2.2 }); b.sinker(87, 9, 3, { depth: 3, speed: 2.2 }); b.sinker(93, 9, 3, { depth: 3, speed: 2.2 });
    b.sweeper(90, 13.5, 3.5, { omega: 100, both: true });
    b.plat(99, 9, 10);
    b.goal(105, 9);
    b.cells(10.5, 1.5, 22.5, 2.5, 3); b.cells(28.5, 3, 28.5, 7, 3); b.cells(42.5, 7.5, 48.5, 7.5, 2); b.cells(69.5, 3, 69.5, 9, 3); b.cells(82.5, 10.5, 94.5, 10.5, 3);
    b.shard(63.5, 2); b.shard(44, 10.5); b.shard(28.5, 11.5);
  }),

  // 27 ── a pinball corridor: chained springs ricochet you under ceilings into spinning and rocking flare cannons
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
    b.barrel(41, 15.5, { spin: 150 });
    b.plat(45, 20, 6);
    b.rect(42, 25, 14, 1);
    b.plat(56, 16, 4); b.spring(57, 16, 2);
    b.barrel(61.5, 19.5, { angle: 10, sweep: 35, spin: 2.5 });
    b.plat(70, 15, 10);
    b.goal(76, 15);
    b.cells(10, 4, 22, 9, 5); b.cells(36, 12, 46, 22, 5); b.cells(63, 20, 69, 18, 3);
    b.shard(48, 23.5); b.shard(23, 15);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 28 ── NEW: the eclipse elevator: ride magnetic floaters up a shaft, stepping across as rotating flare beams pass, then zip out under a plasma ball
  L('Eclipse Elevator', 'elevator', (b) => {
    b.start(-6, 0, 12);
    b.tower(8, -2, 14, 44);
    b.floater(9, 1, 3, { rise: 8 });
    b.floater(16, 9.5, 3, { rise: 8 });
    b.sweeper(13.5, 13.5, 2.6, { omega: 70, both: true });
    b.plat(8.5, 19, 4);
    b.checkpoint(10.5, 19);
    b.floater(15.5, 20, 3, { rise: 9 });
    b.sweeper(13.5, 25, 2.6, { omega: -80, both: true });
    b.floater(8.5, 30, 3, { rise: 8 });
    b.plat(15, 40, 6);
    b.zip(22, 42.5, 52, 31);
    b.wrecker(37, 48, 10, { amp: 45, T: 3.4 });
    b.plat(50, 28, 12);
    b.goal(58, 28);
    b.cells(10.5, 3, 10.5, 9, 3); b.cells(17.5, 12, 17.5, 17, 3); b.cells(17, 22, 17, 28, 3); b.cells(10, 32, 10, 38, 3); b.cells(25, 40, 49, 31.5, 6);
    b.shard(13.5, 17.6); b.shard(30, 40.5); b.shard(10, 42.5);
  }),

  // 29 ── plasma rapids: fast patrolling pads over fire pits under a plasma ball, then a rocking flare cannon onto a cable through the flares
  L('Plasma Rapids', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.slide(11, 0, 25, 0, { T: 2.6, w: 3 });
    b.wrecker(18, 8, 4.5, { amp: 55, T: 2.6 });
    b.slide(29, 1, 43, 1, { T: 2.2, w: 3, phase: 0.5 });
    b.beam('flare', 36, 1.5, { P: 2.4, on: 0.7 });
    b.plat(47, 1, 5);
    b.checkpoint(49, 1);
    b.slide(56, 1, 70, 3, { T: 2.4, w: 2.6 });
    b.barrel(74.5, 6, { angle: 40, sweep: 20, spin: 2 });
    b.plat(81, 5, 4);
    b.zip(85, 9.2, 103, 5.8);
    b.beam('flare', 91, 4, { P: 2.2, on: 0.7, off: 1 }); b.beam('flare', 97, 3, { P: 2.2, on: 0.7 });
    b.plat(101, 3, 10);
    b.goal(107, 3);
    b.cells(12, 1.4, 42, 2.4, 10); b.cells(57, 2.4, 70, 4.4, 5); b.cells(87, 7.5, 101, 5.5, 5);
    b.thin(33, 5.2, 6); b.shard(36, 7.2); b.shard(91, 8.4);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 30 ── FINALE: switches, a cannon, a floater up the core, then the Solar Wave: a cable, auto flare cannons and crumbles
  L('Heart of the Sun', 'finale', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 10); b.switch(14, 0);
    b.blue(21, 2, 4); b.blue(27, 4, 4); b.red(33, 0, 4);
    b.plat(33, 6, 6);
    b.rect(42, 0, 1.4, 9); b.turret(42.7, 6.8, -1, { P: 2.2 });
    b.tower(44, 4, 14, 32);
    b.plat(45, 8, 4);
    b.floater(53, 10, 3, { rise: 7 });
    b.wrecker(51, 26, 6, { amp: 45, T: 3.4 });
    b.beam('flare', 47, 14, { P: 3, on: 0.9, h: 16 });
    b.plat(45, 20, 4); b.plat(53, 23, 4); b.thin(45, 26, 12);
    b.checkpoint(51, 26);
    b.chase({ speed: 4.6, trigger: 52, behind: 16 });
    b.zip(58, 29.2, 76, 21);
    b.plat(75, 19, 4);
    b.barrel(82.5, 21, { angle: 40, auto: true });
    b.plat(93, 22, 4);
    b.crumble(100, 20, 2.4); b.crumble(105, 18, 2.4);
    b.barrel(110.5, 19.5, { angle: 20, auto: true });
    b.plat(118, 16, 12);
    b.goal(126, 16);
    b.cells(22, 3, 30, 5, 4); b.cells(60, 27, 74, 21.5, 5); b.arc(82.5, 21, 94, 22, 4, 3); b.cells(101, 21, 106, 19, 2);
    b.shard(55, 30); b.shard(88, 27.5);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),
];
