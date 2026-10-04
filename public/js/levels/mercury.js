// WORLD 2 — MERCURY. 30 hand-written levels.
// Gravity 0.62: single jump ≈ 3.9 high / 9 far, double jump ≈ 7 high / 17 far.
// Gaps that would be impossible on the Sun are the bread and butter here.
// Every level has its own idea; see the comment above each one.
import { L } from './dsl.js';

export default [
  // 31 ── first steps in low gravity: floaty hops, then a crane swing, a thermal floater and a zip line over quicksilver
  L('Hermes Landing', 'intro', (b) => {
    b.start(-6, 0, 14);
    b.arc(8, 0, 18, 0, 4, 4);
    b.plat(18, 0, 6);
    b.cells(25, 2.5, 27, 4.5, 2);
    b.plat(28, 3.5, 5);                       // a step taller than you: one jump
    b.plat(36, 7, 5);
    b.pendulum(48, 16, 9, { amp: 26, T: 5.5, w: 3.6 });   // first crane swing: step on, ride, step off
    b.cells(45, 8.5, 51, 8.5, 3);
    b.shard(48, 13);                          // float high under the crane's arm
    b.plat(55, 2, 8);
    b.checkpoint(57, 2);
    b.floater(65, 5, 3, { rise: 6 });         // a sunrise thermal floater: ride it up
    b.cells(66.5, 7, 66.5, 11, 3);
    b.shard(66.5, 15.5);
    b.plat(72, 2, 14);
    b.pool(86, 2, 14);                        // first quicksilver: zip over it on the survey cable
    b.zip(84, 7.5, 101, 4.5);
    b.cells(88, 5.3, 98, 3.6, 4);
    b.plat(100, 2, 12);
    b.goal(107, 2);
    b.plat(-17, 5, 3); b.shard(-15.5, 7);
  }),

  // 32 ── mass-driver pods: jump into a pod and it blasts you clean across the quicksilver lake, then chain pod to pod
  L('Mass Driver Relay', 'ride', (b) => {
    b.start(-6, 0, 14);
    b.pool(8, 0, 17);
    b.barrel(10.5, 2.8, { angle: 40 });       // pod 1: fixed, points the way
    b.arc(11, 3, 26, 1, 4, 3);
    b.shard(24.5, 8.4);                       // double-jump at the top of the blast
    b.plat(25, 1, 7);
    b.pool(32, 1, 30);
    b.barrel(34, 3.5, { angle: 25, power: 20 });  // pod 2 throws you straight into pod 3
    b.barrel(49.5, 3.3, { angle: 65, power: 22 });
    b.cells(38, 4.7, 46, 4.4, 3); b.cells(54, 8.6, 60, 11.1, 3);
    // the slow way: quicksilver blobs that sink under your weight
    b.sinker(37, 1.5, 2.4, { depth: 2.4, speed: 1.2 }); b.sinker(43, 1.5, 2.4, { depth: 2.4, speed: 1.2 });
    b.sinker(55, 1.5, 2.4, { depth: 2.4, speed: 1.2 });
    b.shard(44.2, 3.4);                       // on a sinking blob, under the relay
    b.plat(62, 7, 8);
    b.checkpoint(64, 7);
    b.barrel(73.5, 9.5, { angle: 0, spin: 110, power: 22 });   // a rotating pod: fire when it points at the far mesa
    b.shard(73.5, 20);                        // ...or straight up
    b.pool(70, 1, 28);
    b.plat(87, 5, 7);
    b.cells(76, 9, 85, 7, 3);
    b.barrel(97, 7.5, { angle: 55, sweep: 30, spin: 100 });   // a rocking pod for the last leap
    b.arc(98, 8, 113, 4, 4, 5);
    b.plat(110, 4, 12);
    b.goal(117, 4);
  }),

  // 33 ── crater vents breathe you up a terraced crater wall, a thermal floater lifts you on, a cable zips you home
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
    b.floater(54, 6.5, 3, { rise: 10, speed: 2.4 });   // the sun-warmed floater rises up the wall
    b.cells(55.5, 9, 55.5, 15, 3);
    b.plat(60, 16, 7); b.vent(66, 16, 4);
    b.wrecker(63, 25, 5, { amp: 50, T: 3.4 });   // a loose boulder swings over the ledge
    b.plat(68, 24, 7); b.vent(69, 24, 2);
    b.cells(66, 20, 66, 25, 3);
    b.shard(69, 33);                        // ride the last puff all the way up
    b.zip(75.3, 27.6, 87, 22.5);              // the rim cable down to the far terrace
    b.cells(78, 26.3, 86, 22.4, 3);
    b.plat(86, 18, 14);
    b.goal(95, 18);
  }),

  // 34 ── scale a sheer scarp through a crack in its face, zip off the top, ride a crane swing, float up the second scarp
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
    b.zip(35, 27.5, 52, 18.5);                // survey cable off the scarp top
    b.cells(39, 25.4, 48, 20.6, 4);
    b.plat(50, 16, 4);
    b.pendulum(59, 23, 10, { amp: 35, T: 4.6, w: 3 });   // crane swing over the shadowed drop
    b.cells(56, 14, 62, 14, 3);
    b.plat(56, 4, 4); b.shard(58, 6);         // a ledge down in the shadow of the drop
    b.plat(70, 4, 10);
    b.enemy('flyer', 76, 9, { ax: 2, ay: 1.5, T: 3 });
    b.floater(80.5, 4.5, 2.6, { rise: 10.5, speed: 2.4 });   // a thermal floater up the second scarp's face
    b.cells(81.8, 7, 81.8, 13, 3);
    b.plat(84, 16, 20, { h: 21 });            // the second scarp
    b.sweeper(91, 17, 3, { omega: 75 });      // a survey laser turning on the summit
    b.plat(96, 23, 3); b.shard(97.5, 25);
    b.goal(100, 16);
  }),

  // 35 ── zip down Enterprise Rupes on survey cables, hopping cable to cable past swinging boulders and survey lasers
  L('Enterprise Cable Run', 'ride', (b) => {
    b.start(-6, 30, 12);
    b.plat(-12, 24, 4); b.shard(-10, 26);     // a ledge under the lip of the scarp
    b.zip(5, 33.5, 30, 24);
    b.cells(10, 31.6, 26, 25.5, 4);
    b.plat(29, 22, 7);
    b.zip(36.5, 25.5, 62, 15);
    b.wrecker(50, 30, 8.3, { amp: 45, T: 3 });   // a boulder swings across the cable: hop off and re-catch it
    b.cells(40, 24, 58, 16.6, 5);
    b.shard(44, 25.5);                        // jump off the cable to grab it
    b.plat(59, 13, 7);
    b.checkpoint(61, 13);
    b.zip(66.5, 16.5, 86, 9);
    b.zip(88, 10.5, 110, 3.5);                // fly off the end of one cable onto the next
    b.sweeper(99, 3.5, 3.6, { omega: 80 });   // a survey laser sweeping under the second cable
    b.cells(70, 15, 84, 9.8, 4); b.cells(92, 9.3, 106, 4.9, 4);
    b.shard(122, 3.4);                        // skim the quicksilver at the bottom of the swing
    b.plat(108, 1, 8);
    b.pool(116, 1, 12);
    b.vine(122, 10, 6);                       // a dangling cable over the quicksilver
    b.plat(128, 1, 10);
    b.goal(134, 1);
  }),

  // 36 ── a chain of ever-wider craters: hop rim to rim, swing over the second, dodge the boulder, ride the central peak
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
    b.sinker(16.8, 2, 2.4, { depth: 2.2, speed: 1.4 });   // a quicksilver blob in the first bowl
    b.arc(13, 5, 23, 5, 3, 3);
    crater(30, 12, 3);
    b.vine(41, 15, 7.5);                      // a mining cable strung over the second crater
    b.cells(41.6, 5, 41.6, 12, 3);
    b.shard(38, 2.2);                         // down in the bowl, just above the quicksilver
    b.plat(55, 5, 6);
    b.checkpoint(58, 5);
    b.wrecker(66, 15, 7.2, { amp: 50, T: 3.4 });   // a boulder swinging over the big crater's rim
    crater(64, 22, 7);
    b.crumble(73, 4, 2); b.crumble(87, 4, 2);
    b.cells(80.6, 6, 80.6, 16, 4);
    b.thin(78.6, 16, 4); b.shard(80.6, 20.5);     // caught at the top of the big puff
    b.pendulum(102, 15, 8, { amp: 30, T: 4.4, w: 3 });
    b.plat(108, 5, 10);
    b.goal(114, 5);
    b.plat(-14, -2.5, 4); b.shard(-12, -0.6);   // a ledge hidden below the start
  }),

  // 37 ── a mining crane yard: ride swinging crane platforms over a spiker-patrolled floor, dodging wrecking balls
  L('Tolstoj Crane Yard', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 92);                         // the yard floor: spikers and walkers own it
    b.enemy('spiker', 16, 0, { range: 16, speed: 3 }); b.enemy('spiker', 54, 0, { range: 14, speed: 3.2 });
    b.enemy('walker', 74, 0, { range: 12, speed: 2.2 });
    b.plat(6, 4, 7);                          // loading dock
    b.tower(18, 0, 18, 14);
    b.pendulum(20, 14, 9, { amp: 35, T: 4.6, w: 3 });
    b.pendulum(32, 14, 9, { amp: 35, T: 4.6, phase: 0.5, w: 3 });
    b.cells(15, 6.5, 37, 6.5, 6);
    b.shard(46, 1.2);                         // on the yard floor between the spikers
    b.plat(39, 6, 14);
    b.wrecker(44, 15, 6, { amp: 60, T: 3 });   // a wrecking ball sweeping the gantry deck
    b.checkpoint(50, 6);
    b.tower(56, 0, 18, 20);
    b.pendulum(58, 17, 10, { amp: 40, T: 5 });
    b.pendulum(71, 19, 10, { amp: 40, T: 5, phase: 0.5 });
    b.thin(63, 17.5, 3); b.shard(64.5, 19.5);   // the crane tower's cab, reached at the top of a swing
    b.cells(58, 8, 71, 10, 4);
    b.vine(82, 20, 8);                        // swing off the last crane's hook
    b.plat(88, 10, 7);
    b.wrecker(91.5, 20, 6, { amp: 55, T: 2.8, phase: 0.3 });
    b.zip(94.5, 13.5, 112, 5);
    b.cells(98, 11.8, 108, 7, 3);
    b.plat(108, 3, 10);
    b.goal(114, 3);
    b.plat(-14, 6, 3); b.shard(-12.5, 8);
  }),

  // 38 ── descend the quicksilver falls: swing, sink and zip through the windows in each cascade
  L('Quicksilver Falls', 'descent', (b) => {
    b.start(-6, 40, 12);
    b.plat(10, 38, 5);
    b.hazard('mercury', 18, 15, 1.2, 18); b.hazard('mercury', 18, 45, 1.2, 10);
    b.pendulum(25, 42, 10, { amp: 22, T: 4.4, w: 4 });   // a gantry swing between the first two cascades
    b.hazard('mercury', 31, 10, 1.2, 16); b.hazard('mercury', 31, 39, 1.2, 14);
    b.plat(35, 26, 6);
    b.checkpoint(38, 26);
    b.hazard('mercury', 44, 5, 1.2, 15); b.hazard('mercury', 44, 33, 1.2, 18);
    b.sinker(47.5, 20, 5, { depth: 3, speed: 1.2 });     // a quicksilver-slick ledge that sinks as you cross
    b.wrecker(52, 31, 7.5, { amp: 45, T: 3.2 });
    b.hazard('mercury', 56, 0, 1.2, 14); b.hazard('mercury', 56, 27, 1.2, 22);
    b.plat(60, 14, 5);
    b.plat(68, 8, 5);
    b.pool(74, 4, 12);
    b.zip(72, 11.5, 90, 7.5);                 // a cable over the last pool
    b.plat(86, 4, 10);
    b.goal(92, 4);
    b.arc(15, 38, 22, 32, 2, 3); b.arc(28, 32, 35, 26, 2, 3); b.arc(41, 26, 48, 20, 2, 3); b.arc(53, 20, 60, 14, 2, 3);
    b.cells(75, 9.2, 85, 6.7, 3);
    b.plat(26, 44, 3); b.shard(27.5, 46);      // above the first window, between two cascades
    b.plat(63, 23, 3); b.shard(64.5, 25);
    b.shard(80, 12.8);                         // hop off the cable to grab it
  }),

  // 39 ── floodgate locks: buttons swap red and blue gates across a roofed canal, then climb the lock past turning lasers
  L('Floodgate Locks', 'puzzle', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 6);
    b.rect(12, 3.4, 54, 1);                   // the low canal roof stops floaty jumps
    b.pool(14, 0, 24);
    b.red(14, 0, 6); b.plat(20, 0, 6); b.switch(22, 0); b.blue(26, 0, 6);
    b.sinker(32, 0.3, 2.4, { depth: 1.6, speed: 1 });   // a quicksilver blob: don't linger
    b.shard(29, 1);
    b.plat(38, 0, 6);
    b.checkpoint(40, 0);
    b.pool(44, 0, 20);
    b.blue(44, 0, 5); b.plat(49, 0, 5); b.switch(50.8, 0); b.red(54, 0, 5); b.plat(59, 0, 5); b.switch(60.8, 0);
    b.cells(15, 1, 63, 1, 12);
    // the lock chamber: climb by flipping the floors while survey lasers turn
    b.plat(64, 0, 16);
    b.wall(64, 4.4, 30); b.wall(85, 0, 26);
    b.blue(80, 5, 4);
    b.plat(70, 10, 4); b.switch(71, 10);
    b.red(80, 15, 4);
    b.plat(70, 20, 4); b.switch(71, 20);
    b.blue(80, 25, 4);
    b.sweeper(77, 12.5, 3, { omega: 70 }); b.sweeper(77, 22.5, 3, { omega: -70, a0: 180 });
    b.rect(64.8, 30, 12, 0.8);
    b.plat(66, 26, 3); b.shard(67.5, 28);
    b.cells(82, 7, 82, 27, 5);
    b.plat(86, 26, 6);
    b.zip(91.5, 29.5, 108, 21.5);             // the spillway cable down to the outflow
    b.cells(95, 27.3, 104, 23.4, 3);
    b.plat(106, 20, 10);
    b.goal(112, 20);
    b.plat(-15, 1.5, 3); b.shard(-13.5, 3.5);
  }),

  // 40 ── the Sunrise Line: sprint the plains, blast out of a pod, swing a cable and zip ahead of the dawn
  L('Outrun the Dawn', 'chase', (b) => {
    b.chase({ speed: 4.2 });
    b.start(-6, 0, 14);
    b.plat(17, 0, 5);
    b.barrel(25.5, 3.3, { angle: 30, power: 20 });   // a mass-driver pod: in and out, no waiting
    b.crumble(41, 2.5, 3); b.crumble(52, 4, 3);
    b.vine(62, 13, 7);
    b.plat(67, 2, 7); b.vent(72, 2, 4, { always: true });
    b.checkpoint(69, 2);
    b.plat(76, 12, 5);
    b.zip(80.5, 15.5, 112, 6.5);              // one long cable over the quicksilver
    b.pool(96, 2, 14);
    b.crumble(112, 4, 3); b.crumble(124, 3, 3);
    b.plat(136, 3, 12);
    b.goal(144, 3);
    b.arc(8, 0, 17, 0, 3, 3.5); b.cells(29, 4.8, 38, 4.9, 3); b.arc(44, 2.5, 52, 4, 2, 3);
    b.cells(62, 7, 62, 7, 1); b.cells(72, 5, 72, 10, 2); b.cells(85, 14, 108, 7.8, 6); b.arc(115, 4, 124, 3, 2, 3);
    b.shard(35, 10); b.shard(78.5, 18); b.shard(118, 10);
  }),

  // 41 ── a heat-shimmer lake: every other stepping stone is a mirage that flickers away
  L('Mirage Flats', 'timing', (b) => {
    b.start(-6, 4, 12);
    b.blink(10, 2, 3, { P: 3.4, on: 2.2 });
    b.vine(14, 12, 7);                        // a mining cable to swing the first gap
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
    b.zip(86, 28.5, 112, 7.5);                // one long survey cable down off the mesa
    b.cells(90, 26, 108, 10.5, 6);
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
    b.zip(60, 28.5, 72, 18.5);                // from the high perch: a shortcut cable down to the next ledge
    b.pendulum(80, 25, 9, { amp: 28, T: 5, w: 3 });   // a crane platform over the last wheel
    b.ferris(87, 13, 5, { n: 3, omega: -0.9 });
    b.shard(87, 21);
    b.plat(96, 11, 10);
    b.goal(102, 11);
    b.arc(6, 0, 46, 6, 10, 6);
  }),

  // 43 ── a cinder cone of mass-driver pods: blast pod to pod up the volcano, then ride a cable down the far flank
  L('Cinder Cone Cannons', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.barrel(9, 2.4, { angle: 62 });                          // pod 1: fixed, aimed up the cone
    b.barrel(17, 9, { angle: 40, sweep: 30, spin: 110 });    // pod 2: rocking, fire as it swings forward
    b.plat(30, 15, 6);
    b.checkpoint(32, 15);
    b.barrel(38, 18, { angle: 90, power: 22 });               // pod 3: straight up the chimney
    b.barrel(38, 31, { spin: 100 });                          // pod 4: spinning, wait for the far ledge
    b.plat(54, 30, 6);
    b.wrecker(60, 44, 11, { amp: 35, T: 4.4 });               // a swinging boulder guards the cable
    b.zip(62, 34.5, 92, 17);
    b.plat(94, 14, 12);
    b.goal(101, 14);
    b.cells(10, 4, 15, 8, 3); b.cells(19, 17, 28, 17, 4); b.cells(38, 21, 38, 28, 3); b.cells(66, 31, 88, 20, 6);
    b.shard(34, 26);                          // between pod 2's arc and pod 3: a double-jump detour
    b.shard(70, 33.2);                          // jump off the cable to grab it
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 44 ── survey-laser scarp: a thermal floater, turning laser bars, a dust devil and a crane swing to the summit
  L('Laser Scarp Lift', 'ascent', (b) => {
    b.start(-6, 0, 12);
    b.floater(10, 1, 3, { rise: 10 });                       // thermal pad: up to the first shelf
    b.cells(11.5, 3, 11.5, 11, 3);
    b.plat(18, 12, 6);
    b.sweeper(29, 15, 3, { omega: 70 });                     // a survey laser between the shelves
    b.plat(36, 12, 5);
    b.checkpoint(38, 12);
    b.tornado(44, 54, 12, { rise: 12, T: 6 });               // a dust devil wandering up the cliff
    b.plat(60, 26, 5);
    b.sinker(70, 24, 3, { depth: 4 });
    b.pendulum(80, 38, 11, { amp: 30, T: 5, w: 3.4 });
    b.plat(90, 28, 12);
    b.goal(97, 28);
    b.cells(19, 14, 24, 14, 3); b.cells(37, 14, 40, 14, 2); b.cells(61, 28, 64, 28, 2); b.cells(72, 26, 88, 29, 4);
    b.shard(29, 21);                          // over the laser's reach
    b.plat(46, 29, 4); b.shard(48, 31);       // top of the dust devil, a perch above the tide of wind
    b.shard(80, 33);                          // under the crane's arm
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

  // 46 ── catapult highlands: rocking launch pods and springs throw you clean across the canyons
  L('Catapult Highlands', 'bounce', (b) => {
    b.start(-6, 0, 12);
    b.barrel(9, 2.2, { angle: 50 });                          // pod 1: your first big arc
    b.plat(26, 8, 5);
    b.barrel(31, 10.3, { angle: 20, sweep: 25, spin: 90 });   // pod 2: rocking, wait for the swing to level out
    b.plat(50, 10, 6);
    b.checkpoint(53, 10);
    b.cells(11, 5, 22, 9, 4); b.cells(34, 12, 46, 12, 4);
    b.plat(57, 3, 5); b.spring(60.2, 3, 6);
    b.plat(63, 10, 5); b.spring(66.2, 10, 6);
    b.plat(71, 17, 5); b.spring(74, 17, 8);
    b.cells(61.1, 6, 61.1, 10, 2); b.cells(67.1, 13, 67.1, 17, 2);
    b.thin(73, 26, 3); b.shard(74.5, 28.5);    // a ledge only the tall spring reaches
    b.barrel(80, 14.2, { angle: 15, power: 19, spin: 100, sweep: 20 });   // a last rocking pod over the drop
    b.plat(96, 10, 10);
    b.goal(102, 10);
    b.shard(24, 13);
    b.plat(-12, -3, 3); b.spring(-11.4, -3, 2); b.shard(-10.5, 4);
  }),

  // 47 ── quicksilver weights: step-sinking pads, crane swings and thermal floaters carry you over two silver rivers
  L('Quicksilver Weights', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.pool(6, 0, 38);
    b.sinker(10, 1, 3, { depth: 3 });
    b.sinker(15.5, 2, 3, { depth: 3 });
    b.pendulum(26, 14, 10, { amp: 30, T: 5, w: 3.2 });
    b.slide(30, 4, 40, 4, { T: 3.4, w: 2.6, phase: 0.5 });
    b.floater(18, 8, 3, { rise: 5 });
    b.cells(11, 2.4, 41, 4.5, 7);
    b.thin(22, 14, 3); b.shard(23.5, 16);
    b.plat(44, 0, 6);
    b.checkpoint(47, 0);
    b.pool(50, 0, 36);
    b.floater(55, 1, 3, { rise: 8 });
    b.slide(61, 9, 72, 9, { T: 3.2, w: 2.6 });
    b.sinker(78, 9, 3, { depth: 8, speed: 1.2 });
    b.rect(94, 0, 1.4, 5); b.turret(94.7, 3, -1, { P: 2.6 });
    b.cells(55, 9.5, 78, 10, 6);
    b.shard(66.5, 1.4);                        // skim low over the river
    b.plat(86, 0, 8);
    b.goal(91, 0);
    b.thin(60, 15, 3); b.shard(61.5, 17);
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
    b.wrecker(60, 4, 7, { amp: 40, T: 4 });   // a frozen boulder swings over the rink
    b.wall(95, 4, 14); b.wall(98.6, 6, 14);         // a frosted chimney
    b.ice(94, 4, 6);
    b.cells(97.2, 8, 97.2, 18, 4);
    b.shard(97.2, 21);
    b.ice(99.4, 20, 4);
    b.ice(108, 16, 10);
    b.zip(101, 24.5, 112, 19);                // an icy cable down to the goal, no skidding
    b.goal(114, 16);
    b.block(53, 2, 1); b.shard(53.5, 4);
  }),

  // 49 ── dust devils in the fault cracks: wall-jump the first crack, then let wandering whirlwinds and a floater lift you up the scarp
  L('Dust Devil Chimneys', 'ascent', (b) => {
    b.start(-6, 0, 12);
    b.tower(6, 0, 34, 46);
    const chimney = (x, y0, h) => { b.wall(x, y0 + 2.2, h); b.wall(x + 3.6, y0, h); };
    b.plat(6, 0, 10);
    chimney(10, 0, 12);
    b.plat(14.4, 12, 10);
    b.enemy('spiker', 15, 12, { range: 2.5 });
    b.tornado(24, 33, 12, { rise: 13, T: 5 });          // a dust devil prowls the second crack
    b.plat(36, 26, 8);
    b.checkpoint(39, 26);
    b.floater(48, 20, 3, { rise: 12 });                 // a thermal pad over the gap
    b.pendulum(56, 46, 11, { amp: 28, T: 5, w: 3.4 });  // crane swing to the summit
    b.plat(64, 36, 12);
    b.goal(71, 36);
    b.cells(11.8, 3, 11.8, 12, 4); b.cells(37, 28, 42, 28, 3); b.cells(49.5, 22, 49.5, 33, 4); b.cells(58, 37, 62, 37, 2);
    b.shard(10.4, 16.2);                       // on top of the first left wall
    b.shard(27, 24);                           // riding the dust devil to the top of its column
    b.shard(56, 41);                           // under the crane's arm
    b.plat(-12, 6, 3);
  }),

  // 50 ── the Sunrise Line chases you down into Caloris Basin and up its far rim
  L('Caloris Crossing', 'chase', (b) => {
    b.chase({ speed: 4.5 });
    b.start(-6, 12, 14);
    b.plat(15, 8, 5); b.plat(29, 4, 5);
    b.plat(42, 0, 8); b.vent(48, 0, 3, { always: true });
    b.plat(54, 9, 4);
    b.barrel(66, 8.5, { angle: 20, power: 19 });   // a pod: in and out, no waiting
    b.plat(89, 2, 6); b.spring(93, 2, 6);
    b.checkpoint(90, 2);
    b.plat(99, 10, 4);
    b.plat(112, 12, 5);
    b.vine(125, 22, 8);
    b.plat(134, 12, 6); b.vent(139, 12, 4, { always: true });
    b.thin(138, 24, 4);
    b.plat(150, 26, 12);
    b.goal(158, 26);
    b.arc(8, 12, 15, 8, 2, 2); b.arc(20, 8, 29, 4, 3, 2); b.cells(48, 4, 48, 8, 2);
    b.arc(58, 9, 63, 8, 2, 2); b.arc(70, 10, 82, 6, 3, 3); b.cells(93, 5, 93, 9, 2);
    b.arc(103, 10, 112, 12, 3, 3); b.cells(139, 16, 139, 22, 3);
    b.shard(36, 9); b.shard(72, 13); b.shard(130, 20);
  }),
  // 51 ── perihelion noon: the plain ignites in a rolling wave, so ride crane platforms and a thermal over it, then cross the oven roof
  L('Perihelion Noon', 'timing', (b) => {
    b.start(-6, 0, 12);
    for (let i = 0; i < 14; i++) b.heat(6 + i * 3, 0, 3, { P: 4, on: 1.6, off: -i * 0.28 });
    b.plat(14, 6, 4);                         // rock umbrellas to wait out the wave
    b.pendulum(26, 15, 9, { amp: 30, T: 5, w: 3.4 });   // a crane platform swinging over the burning floor
    b.plat(33, 6, 4);
    b.shard(35, 8);
    b.floater(40, 6, 3, { rise: 5 });
    b.cells(7, 1, 47, 1, 10);
    b.plat(48, 0, 6);
    b.checkpoint(50, 0);
    // the oven: a wave in the floor and a roof that is nearly always alight
    for (let i = 0; i < 8; i++) b.heat(54 + i * 3, 0, 3, { P: 3, on: 1.2, off: -i * 0.3 });
    b.heat(54, 5, 24, { P: 2.4, on: 2 });
    b.shard(66, 6.5);                         // sizzling on the oven roof
    b.cells(55, 1, 77, 1, 6);
    b.plat(78, 0, 5);
    b.barrel(82, 3, { angle: 75, power: 22, sweep: 20, spin: 100 });   // a rocking pod fires you out of the oven
    b.thin(80, 18, 7);
    b.shard(83.5, 22);
    b.plat(90, 14, 10);
    b.goal(96, 14);
  }),

  // 52 ── swinging boulders: a causeway of crane platforms, a wrecking-ball gate, then sinking pads up the cliff and a last crumble sprint
  L('Boulder Causeway', 'precision', (b) => {
    b.start(-6, 0, 12);
    b.pendulum(15, 12, 9, { amp: 32, T: 5, w: 3 });
    b.pendulum(26, 12, 9, { amp: 32, T: 5, w: 3, phase: 0.5 });
    b.pendulum(37, 12, 9, { amp: 32, T: 5, w: 3 });
    b.cells(14, 5, 38, 5, 8);
    b.shard(26, 11);                          // above the middle crane, a double-jump hop
    b.plat(45, 2, 10);
    b.checkpoint(47, 2);
    b.wrecker(54, 16, 12.5, { amp: 38, T: 4.2 });   // the boulder gate: slip past on the beat
    b.plat(58, 2, 8);
    b.cells(46, 3.5, 64, 3.5, 7);
    b.sinker(70, 3, 3, { depth: 3 });
    b.sinker(75, 8, 3, { depth: 3 });
    b.sinker(70, 13, 3, { depth: 3 });
    b.sinker(75, 18, 3, { depth: 3 });
    b.cells(71.5, 5, 76.5, 20, 5);
    b.plat(80, 24, 6);
    b.shard(82, 30);
    b.crumble(90, 24, 3); b.crumble(94, 24, 3); b.crumble(98, 24, 3);
    b.plat(79, 14, 3); b.shard(80.5, 16);     // under the cliff
    b.plat(104, 22, 10);
    b.goal(110, 22);
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
    b.sweeper(20, 3.4, 2.2, { omega: 70 });   // a loose survey laser spinning in the hold
    b.shard(40, 1);                           // behind the lower bulkhead
    b.cells(12, 1, 28, 1, 5); b.cells(25, 7, 46, 7, 6); b.cells(55, 1, 58, 1, 2); b.cells(59, 7, 65, 7, 3);
    b.plat(68, 6, 10);
    b.plat(70, 9, 2);
    b.shard(40, 14);                          // on the hull roof
    b.thin(28, 18, 4); b.shard(30, 20);       // the bent antenna
    b.goal(75, 6);
  }),

  // 54 ── cable-car canyon: start on a high rim and chain zip lines, a mass-driver pod and a crane swing down to the valley floor
  L('Cable Car Canyon', 'ride', (b) => {
    b.start(-6, 30, 14);
    b.plat(-17, 33, 3); b.shard(-15.5, 35);
    b.zip(8, 34.5, 32, 24.5);
    b.plat(33, 22, 7);
    b.zip(38, 26.5, 62, 14);
    b.plat(63, 11, 6);
    b.checkpoint(65, 11);
    b.barrel(72, 14, { angle: 25, power: 19 });
    b.pendulum(84, 24, 9, { amp: 28, T: 5, w: 3.4 });
    b.plat(92, 10, 6);
    b.zip(98, 15, 126, 3.5);
    b.plat(125, 0, 14);
    b.goal(132, 0);
    b.cells(10, 33, 30, 25.5, 5); b.cells(40, 25, 60, 15, 5); b.cells(100, 14, 124, 4, 6);
    b.shard(48, 24);                         // jump off the second cable to grab it
    b.shard(84, 20);                           // under the crane's arm
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
    b.tornado(74, 80, 25, { rise: 6, T: 4 });
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
    b.thin(15, 12, 4); b.blink(23, 13, 3, { P: 3, on: 2 }); b.pendulum(30, 25, 11, { amp: 24, T: 5, w: 3 }); b.thin(37, 13, 4);
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
    b.zip(76, 14, 84, 8.5);
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
    b.zip(41, 21, 62, 8.5);                   // down the sunny scarp on a cable
    b.ice(60, 0, 10);
    b.checkpoint(62, 0);
    b.pool(70, 0, 6);
    b.ice(76, 0, 5); b.vent(80, 0, 5);
    b.thin(78.5, 13, 3);
    b.plat(86, 18, 4); b.plat(94, 23, 4);
    b.heat(100, 26, 8, { P: 2.6, on: 1.1, off: 1.3 });
    b.pendulum(114, 30, 9, { amp: 30, T: 5, w: 3.4 }); b.ice(122, 14, 3);
    b.plat(130, 8, 10);
    b.goal(136, 8);
    b.cells(11, 5.5, 27, 15.5, 5); b.cells(33, 18.5, 39, 18.5, 3); b.cells(45, 19, 58, 11, 4);
    b.cells(80, 4, 80, 11, 3); b.cells(87, 19.5, 107, 27.5, 6); b.cells(115, 21.5, 123, 15.5, 3);
    b.thin(34, 22, 3); b.shard(35.5, 24);                     // a perch above the first crest
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
    b.zip(82.5, 11.5, 93, 5);
    b.wrecker(30, 17, 8.5, { amp: 30, T: 5 });  // a swinging boulder over the first fumaroles
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
    b.crumble(54, 16, 2); b.pendulum(61, 30, 11, { amp: 24, T: 4.4, w: 2.8 }); b.crumble(68, 16, 2);
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
    b.zip(95, 35.5, 120, 25.5);               // a cable across the dawn
    b.plat(119, 22, 6); b.vent(123.5, 22, 3, { always: true });
    b.thin(122.5, 30, 4);
    b.plat(134, 28, 4);
    b.plat(142, 22, 6); b.spring(146, 22, 5);
    b.plat(152, 28, 4);
    b.barrel(160, 28, { angle: 8, power: 20 });
    b.plat(172, 24, 12);
    b.goal(180, 24);
    b.cells(26.5, 5.5, 32.5, 9.5, 2); b.cells(42, 15, 42, 20, 2); b.cells(73.8, 27, 73.8, 34, 3);
    b.arc(82, 36, 90, 32, 2, 2); b.arc(94, 32, 110, 26, 4, 3); b.cells(123.5, 25, 123.5, 28, 2);
    b.arc(138, 28, 142, 22, 1, 2); b.cells(147, 25, 147, 30, 2); b.arc(156, 28, 172, 24, 4, 3);
    b.shard(105, 34);
  }),
];
