// aerolis: 30 hand-written speed-run levels
import { L } from './dsl.js';

export default [
  // 421 ── teach ring, ribbon and boost lane in one flowing line
  L('First Gust', 'intro', (b) => {
    b.start(-6, 0, 12);
    b.boost(8, 0, 8, 12);
    b.ring(20, 2.6);
    b.ring(27, 3);
    b.plat(33, 1, 5);
    b.vine(44, 9, 6);
    b.plat(52, 1, 5);
    b.checkpoint(54, 1);
    b.boost(58, 1, 8, 12);
    b.plat(76, 2, 6);
    b.ring(70, 4);
    b.goal(80, 2);
    b.cells(8, 1.4, 16, 1.4, 5);
    b.arc(20, 3, 33, 2, 5, 1);
    b.shard(35, 5.5); b.shard(48, 4); b.shard(-12.5, 3.5);
    b.plat(-14, 1.5, 3);
  }),
  // 422 ── a ring slalom: fling ring to fling ring up and down a corridor of hoops with only ribbon touch-downs
  L('Ribbon Slalom', 'rings', (b) => {
    b.start(-6, 0, 12);
    b.boost(8, 0, 6, 12);
    b.ring(18, 3, { angle: 45 });
    b.ring(25, 6, { angle: 20 });
    b.ring(32, 5, { angle: 50 });
    b.ring(38, 9, { angle: 15 });
    b.plat(46, 8, 4);
    b.vine(56, 16, 6);
    b.plat(64, 6, 4);
    b.checkpoint(65, 6);
    b.ring(72, 8, { angle: 35 });
    b.ring(79, 9, { angle: 35 });
    b.ring(86, 9, { angle: 35 });
    b.plat(93, 7, 6);
    b.goal(96, 7);
    b.arc(10, 1.4, 18, 3, 3, 1); b.cells(46, 9.5, 49, 9.5, 2); b.arc(66, 7.5, 72, 8, 2, 1);
    b.shard(33, 8.6); b.shard(94, 11); b.shard(56, 3);
  }),

  // 423 ── descend a chain of floating islands by zip line, hopping from one cable straight onto the next
  L('Cable Cascade', 'descent', (b) => {
    b.start(-6, 30, 12);
    b.zip(8, 32.5, 26, 27);
    b.plat(28, 24, 4);
    b.zip(32, 26, 50, 19);
    b.plat(52, 16, 4);
    b.checkpoint(53, 16);
    b.boost(57, 16, 6, 12);
    b.vine(74, 25, 6);
    b.plat(80, 12, 4);
    b.zip(84, 14, 104, 7);
    b.plat(106, 4, 8);
    b.goal(110, 4);
    b.cells(10, 32, 24, 27.5, 6); b.cells(34, 25.5, 48, 20, 5); b.cells(86, 13, 102, 8, 5);
    b.shard(40, 25); b.shard(94, 14); b.shard(66, 20);
  }),

  // 424 ── a gust highway: wind lanes shove you across empty sky between tiny islets
  L('Gust Highway', 'wind', (b) => {
    b.start(-6, 0, 12);
    b.wind(5, -2, 14, 10, 14, { gust: true, P: 1.2, on: 1.2 });
    b.plat(20, 1, 3);
    b.wind(22, -1, 14, 10, 14, { gust: true, P: 1.2, on: 1.2 });
    b.plat(37, 2, 3);
    b.ring(44, 4);
    b.plat(51, 3, 3);
    b.checkpoint(52, 3);
    b.wind(53, 0, 16, 10, 15, { gust: true, P: 1.2, on: 1.2 });
    b.plat(68, 4, 3);
    b.wind(70, 0, 16, 10, 15, { gust: true, P: 1.2, on: 1.2 });
    b.plat(85, 3, 3);
    b.boost(88, 2, 8, 12);
    b.plat(104, 3, 8);
    b.goal(108, 3);
    b.cells(8, 4, 18, 4, 5); b.cells(25, 4, 35, 4, 5); b.cells(56, 5, 66, 5, 5); b.cells(73, 5, 83, 5, 5);
    b.shard(13, 5.5); b.shard(44, 7.4); b.shard(77, 7.5);
  }),

  // 425 ── trapeze: fast pendulum seats and ribbons, always swinging forward
  L('Trapeze Reach', 'swing', (b) => {
    b.start(-6, 4, 12);
    b.vine(10, 13, 6);
    b.pendulum(19, 14, 6, { amp: 40, T: 2.4 });
    b.vine(27, 13, 6);
    b.vine(35, 13, 6);
    b.plat(41, 5, 4);
    b.checkpoint(42, 5);
    b.pendulum(49, 15, 6, { amp: 40, T: 2.4, phase: 0.5 });
    b.pendulum(57, 15, 6, { amp: 40, T: 2.4 });
    b.vine(66, 14, 6);
    b.plat(72, 5, 4);
    b.ring(78, 7);
    b.ring(85, 8);
    b.plat(92, 6, 6);
    b.goal(96, 6);
    b.cells(10, 8, 35, 8, 8); b.cells(50, 10, 68, 9, 5);
    b.shard(31, 13.5); b.shard(73.5, 9.5); b.shard(85, 11.5);
  }),

  // 426 ── tornado elevator: ride a roaming twister up, burst out through a ring chain, and glide down
  L('Twister Lift', 'ascent', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 12);
    b.tornado(13, 17, 0, { rise: 10, T: 3 });
    b.plat(24, 11, 4);
    b.ring(30, 13, { angle: 40 });
    b.ring(37, 15, { angle: 40 });
    b.plat(44, 14, 4);
    b.checkpoint(45, 14);
    b.plat(52, 8, 14);
    b.tornado(55, 63, 8, { rise: 10, T: 3 });
    b.ring(70, 19, { angle: 30 });
    b.ring(77, 20, { angle: 30 });
    b.plat(85, 17, 8);
    b.goal(89, 17);
    b.cells(14, 4, 14, 10, 3); b.cells(56, 11, 56, 18, 3);
    b.shard(15, 14); b.shard(38, 18.5); b.shard(53, 12.5);
  }),

  // 427 ── auto-barrel cascade: pod to pod across a cloud bank, the pods fire themselves so you never touch down
  L('Pod Cascade', 'pods', (b) => {
    b.start(-6, 12, 12);
    b.barrel(10, 14, { angle: 25, power: 20, auto: true });
    b.barrel(20.4, 14, { angle: 25, power: 20, auto: true });
    b.barrel(30.8, 14, { angle: 25, power: 20, auto: true });
    b.plat(38, 13, 7);
    b.checkpoint(41, 13);
    b.barrel(52, 15, { angle: 55, power: 20, auto: true });
    b.barrel(61.5, 18.3, { angle: 25, power: 20, auto: true });
    b.barrel(72, 18.3, { angle: 25, power: 20, auto: true });
    b.plat(58, 11, 4);
    b.ring(82.5, 18.4, { angle: 35 });
    b.plat(90, 16, 8);
    b.goal(95, 16);
    b.arc(11, 15, 19, 15, 3, 1); b.arc(21.4, 15, 29.8, 15, 3, 1); b.cells(39, 14.5, 44, 14.5, 3); b.arc(53, 16.5, 60, 19.5, 3, 1);
    b.shard(2, 16.5); b.shard(60, 15.5); b.shard(41, 17);
  }),

  // 428 ── silk weave: ribbons that hand you onto zip lines that hand you onto ribbons
  L('Silk Weave', 'swing', (b) => {
    b.start(-6, 6, 12);
    b.vine(11, 14, 6);
    b.plat(17, 6, 3);
    b.zip(20, 10, 34, 5);
    b.plat(36, 3, 3);
    b.vine(44, 12, 6);
    b.plat(50, 4, 3);
    b.checkpoint(51, 4);
    b.zip(54, 11, 70, 7, { speed: 8 });
    b.plat(72, 4, 3);
    b.vine(80, 13, 6);
    b.plat(86, 4, 3);
    b.zip(89, 8, 105, 4);
    b.plat(107, 3, 8);
    b.goal(111, 3);
    b.cells(12, 8, 16, 7, 3); b.cells(22, 9, 33, 5.5, 4); b.cells(56, 10, 69, 7.5, 4); b.cells(91, 7, 104, 4.5, 4);
    b.shard(40, 8); b.shard(74, 8.5); b.shard(88.5, 8.5);
  }),

  // 429 ── boost-lane ramps: sprint up a lane and launch off its lip into a ring chain
  L('Lane Launch', 'boost', (b) => {
    b.start(-6, 0, 12);
    b.boost(8, 0, 8, 13);
    b.ring(24, 3, { angle: 40 });
    b.ring(31, 5, { angle: 30 });
    b.boost(38, 4, 8, 13);
    b.ring(56, 7, { angle: 40 });
    b.ring(63, 9, { angle: 30 });
    b.boost(70, 7, 8, 13);
    b.plat(88, 6, 4);
    b.checkpoint(89, 6);
    b.ring(95, 8, { angle: 30 });
    b.ring(102, 9, { angle: 30 });
    b.plat(109, 7, 8);
    b.goal(113, 7);
    b.cells(10, 1.4, 14, 1.4, 4); b.cells(40, 5.4, 44, 5.4, 4); b.cells(72, 8.4, 76, 8.4, 4);
    b.shard(42, 8.5); b.shard(74, 11.5); b.shard(80, 11);
  }),

  // 430 ── JET STREAM: the squall wall closes in; ring, ribbon and lane without a single stop
  L('Jet Stream', 'chase', (b) => {
    b.chase({ speed: 4.2 });
    b.start(-6, 0, 14);
    b.boost(8, 0, 8, 13);
    b.ring(24, 3, { angle: 35 });
    b.ring(31, 4, { angle: 35 });
    b.plat(38, 2, 4);
    b.vine(48, 11, 6);
    b.plat(56, 3, 4);
    b.checkpoint(57, 3);
    b.boost(60, 3, 8, 13);
    b.ring(76, 6, { angle: 40 });
    b.ring(83, 8, { angle: 30 });
    b.vine(94, 16, 6);
    b.plat(102, 5, 4);
    b.ring(108, 7, { angle: 35 });
    b.ring(115, 8, { angle: 35 });
    b.plat(122, 6, 10);
    b.goal(128, 6);
    b.cells(10, 1.4, 14, 1.4, 4); b.cells(60, 4.4, 66, 4.4, 4);
    b.shard(31, 7.8); b.shard(104, 9.5); b.shard(48, 6);
  }),

  // 431 ── climb a ladder of silk ribbons: each swing lifts you one island higher, with a ring chain to top out
  L('Ribbon Ladder', 'ascent', (b) => {
    b.start(-6, 0, 12);
    b.vine(10, 8, 6);
    b.plat(17, 3, 3);
    b.vine(24, 11, 6);
    b.plat(31, 6, 3);
    b.vine(38, 14, 6);
    b.vine(46.5, 14, 6);
    b.plat(53, 9, 3);
    b.checkpoint(54, 9);
    b.ring(59, 11.5, { angle: 60, speed: 21 });
    b.ring(65, 16.5, { angle: 60, speed: 21 });
    b.plat(71, 17, 3);
    b.vine(78, 25, 6);
    b.plat(85, 20, 8);
    b.goal(89, 20);
    b.cells(10, 3, 16, 4.5, 3); b.cells(24, 6, 30, 7.5, 3); b.cells(38, 9, 52, 10, 5);
    b.shard(18.5, 7.5); b.shard(32.5, 10.5); b.shard(87, 24);
  }),

  // 432 ── swing past hammering wrecker balls: ribbons and fast pendulum seats carry you through a gauntlet that never waits
  L('Wrecker Run', 'gauntlet', (b) => {
    b.start(-6, 4, 12);
    b.vine(10, 12, 6);
    b.wrecker(15, 12, 4, { amp: 50, T: 2.6 });
    b.plat(19, 4, 3);
    b.pendulum(28, 14, 6.5, { amp: 40, T: 2.4 });
    b.wrecker(33, 12, 4, { amp: 50, T: 2.6, phase: 0.5 });
    b.plat(38, 4, 3);
    b.checkpoint(39, 4);
    b.vine(46, 12, 6);
    b.vine(54.5, 12, 6);
    b.wrecker(50, 11, 4, { amp: 50, T: 2.4 });
    b.plat(61, 4, 3);
    b.ring(67, 6.5, { angle: 35 });
    b.wrecker(70, 10, 4, { amp: 50, T: 2.4, phase: 0.5 });
    b.ring(74, 7, { angle: 35 });
    b.plat(81, 5, 8);
    b.goal(85, 5);
    b.cells(11, 7, 18, 5.5, 3); b.cells(40, 7, 60, 6, 6);
    b.shard(22, 8.5); b.shard(64, 9); b.shard(83, 9.5);
  }),

  // 433 ── the cloud tide rises: zigzag up a stack of vertical rings before the pink sea swallows you
  L('Skyward Surge', 'tide', (b) => {
    b.rise({ rate: 0.65, delay: 3 });
    b.start(-6, 0, 12);
    b.plat(8, 0, 6);
    b.ring(14, 2.6, { angle: 90, speed: 22 });
    b.ring(14, 8.4, { angle: 75, speed: 22 });
    b.ring(19.5, 14.4, { angle: 110, speed: 20 });
    b.ring(15, 19, { angle: 75, speed: 22 });
    b.plat(18, 23, 5);
    b.checkpoint(21, 23);
    b.ring(25.5, 25.6, { angle: 60, speed: 21 });
    b.plat(31, 30, 4);
    b.ring(38, 32.6, { angle: 35 });
    b.ring(45, 33.6, { angle: 35 });
    b.plat(52, 32, 8);
    b.goal(56, 32);
    b.cells(9, 1.4, 12, 1.4, 2); b.cells(32, 31.5, 36, 32, 3);
    b.shard(20, 27.5); b.shard(32.5, 34); b.shard(54, 36);
  }),

  // 434 ── boost mile: a long sprint down lanes that hurl you from one to the next with ring kicks in the gaps
  L('Boost Mile', 'boost', (b) => {
    b.start(-6, 0, 12);
    b.boost(8, 0, 8, 14);
    b.boost(25, 0, 8, 14);
    b.boost(42, 1, 8, 14);
    b.ring(56, 3.5, { angle: 35 });
    b.plat(63, 2, 3); b.boost(66, 2, 5, 14);
    b.checkpoint(64.5, 2);
    b.boost(80, 2, 8, 14);
    b.ring(94, 4.5, { angle: 35 });
    b.ring(101, 5, { angle: 35 });
    b.boost(108, 3, 8, 14);
    b.plat(124, 3, 8);
    b.goal(128, 3);
    b.sweeper(44, 7, 3, { omega: 90, both: true });
    b.cells(9, 1.4, 15, 1.4, 4); b.cells(26, 1.4, 32, 1.4, 4); b.cells(64, 3.4, 70, 3.4, 4); b.cells(109, 4.4, 115, 4.4, 4);
    b.shard(46, 6); b.shard(84, 6.5); b.shard(112, 8.5);
  }),

  // 435 ── zip slalom: long descending cables between wrecker-guarded islands, a vine to change lanes mid-run
  L('Cable Slalom', 'descent', (b) => {
    b.start(-6, 36, 12);
    b.zip(8, 38.5, 28, 31);
    b.wrecker(18, 40, 5, { amp: 45, T: 2.6 });
    b.plat(30, 28, 3);
    b.zip(33, 30, 52, 22);
    b.plat(54, 19, 3);
    b.checkpoint(55, 19);
    b.vine(62, 27, 6);
    b.plat(69, 18, 3);
    b.zip(72, 20.5, 92, 12);
    b.wrecker(82, 21, 5, { amp: 45, T: 2.6, phase: 0.5 });
    b.plat(94, 9, 3);
    b.zip(97, 11, 116, 4, { speed: 8 });
    b.plat(118, 1, 8);
    b.goal(122, 1);
    b.cells(10, 37.5, 26, 31.5, 6); b.cells(35, 29.5, 50, 23, 5); b.cells(74, 20, 90, 13, 5); b.cells(99, 10, 114, 4.5, 5);
    b.shard(2, 40.5); b.shard(43, 28); b.shard(104, 8);
  }),

  // 436 ── ring cathedral: spiral up through a vault of hoops, then ride a zip line down the far side
  L('Ring Cathedral', 'rings', (b) => {
    b.start(-6, 0, 12);
    b.ring(12, 2.6, { angle: 45, speed: 19 });
    b.ring(20, 6.5, { angle: 45, speed: 19 });
    b.ring(28, 10, { angle: 45, speed: 19 });
    b.plat(36, 9, 4);
    b.checkpoint(37, 9);
    b.ring(43, 11.5, { angle: 60, speed: 21 });
    b.ring(48, 17, { angle: 25, speed: 19 });
    b.ring(56, 18.5, { angle: 25, speed: 19 });
    b.plat(64, 17, 3);
    b.zip(67, 19.5, 90, 8);
    b.plat(92, 5, 8);
    b.goal(96, 5);
    b.cells(13, 3.4, 19, 6, 3); b.cells(29, 11, 34, 10.5, 3); b.cells(70, 18, 88, 9, 6);
    b.shard(37.5, 13.5); b.shard(65.5, 21.5); b.shard(78, 17);
  }),

  // 437 ── vine, barrel, vine: ribbons toss you into self-firing pods that shoot you onto the next ribbon
  L('Pod Relay', 'swing', (b) => {
    b.start(-6, 2, 12);
    b.vine(10, 10, 6);
    b.plat(17, 2, 3);
    b.barrel(24, 4, { angle: 30, power: 20, auto: true });
    b.plat(33, 3, 3);
    b.vine(40, 11, 6);
    b.plat(47, 2, 3);
    b.checkpoint(48, 2);
    b.barrel(55, 4, { angle: 25, power: 20, auto: true });
    b.barrel(65.4, 4, { angle: 25, power: 20, auto: true });
    b.plat(74, 3, 3);
    b.vine(81, 11, 6);
    b.vine(89.5, 11, 6);
    b.plat(96, 2, 8);
    b.goal(100, 2);
    b.cells(10, 5, 17, 3.5, 3); b.cells(40, 5, 47, 3.5, 3); b.cells(81, 5, 95, 3.5, 5);
    b.shard(28, 9); b.shard(75.5, 7.5); b.shard(98, 7);
  }),

  // 438 ── fast floaters: balloon pads that surge upward the moment you land, strung between gust lanes
  L('Balloon Stair', 'ascent', (b) => {
    b.start(-6, 0, 12);
    b.floater(9, 0, 3, { rise: 7, speed: 7 });
    b.plat(15, 8, 3);
    b.wind(17, 6, 14, 8, 13, { gust: true, P: 1.2, on: 1.2 });
    b.floater(33, 8, 3, { rise: 7, speed: 7 });
    b.plat(39, 15, 3);
    b.checkpoint(40, 15);
    b.ring(46, 17.5, { angle: 35 });
    b.ring(53, 18.5, { angle: 35 });
    b.floater(60, 17, 3, { rise: 7, speed: 7 });
    b.plat(66, 24, 3);
    b.ring(72, 26.5, { angle: 20 });
    b.plat(80, 25, 8);
    b.goal(84, 25);
    b.cells(10, 3, 10, 7, 3); b.cells(34, 11, 34, 14, 3); b.cells(61, 20, 61, 23, 3);
    b.shard(16.5, 12.5); b.shard(41, 20.5); b.shard(82, 29.5);
  }),

  // 439 ── the long trapeze: fast loops and pendulums over a sheer drop, then boost into a sweeper corridor
  L('Spinner Spans', 'ride', (b) => {
    b.start(-6, 6, 12);
    b.loop([[12, 6], [20, 9], [28, 6]], { speed: 8, loop: false, w: 4 });
    b.plat(33, 6, 3);
    b.pendulum(42, 16, 6.5, { amp: 40, T: 2.4 });
    b.slide(48, 6, 58, 8, { T: 2.4, w: 4 });
    b.plat(63, 7, 3);
    b.checkpoint(64, 7);
    b.boost(67, 7, 8, 14);
    b.sweeper(77, 11, 3.5, { omega: 100, both: true });
    b.plat(86, 7, 3);
    b.ring(92, 9.5, { angle: 35 });
    b.plat(100, 7, 8);
    b.goal(104, 7);
    b.cells(13, 7.5, 27, 7.5, 5); b.cells(48, 8.5, 58, 10, 4); b.cells(68, 8.4, 74, 8.4, 3);
    b.shard(20, 14); b.shard(87.5, 11.5); b.shard(53, 12);
  }),

  // 440 ── SQUALL LINE: the storm wall roars in behind you; ring chain, ribbon swing and boost lanes without a pause
  L('Squall Line', 'chase', (b) => {
    b.chase({ speed: 4.5 });
    b.start(-6, 0, 14);
    b.ring(12, 2.6, { angle: 35 });
    b.ring(19, 3.6, { angle: 35 });
    b.ring(26, 4.6, { angle: 35 });
    b.plat(33, 3, 3);
    b.vine(42, 11, 6);
    b.vine(50.5, 11, 6);
    b.plat(57, 3, 3);
    b.checkpoint(58, 3);
    b.boost(61, 3, 8, 14);
    b.ring(77, 5.6, { angle: 40 });
    b.plat(84, 6, 3);
    b.zip(87, 8.5, 104, 2);
    b.plat(106, 0, 3);
    b.boost(109, 0, 8, 14);
    b.ring(125, 2.6, { angle: 35 });
    b.ring(132, 3.4, { angle: 35 });
    b.plat(139, 2, 10);
    b.goal(145, 2);
    b.cells(62, 4.4, 68, 4.4, 4); b.cells(89, 8, 102, 3, 5); b.cells(110, 1.4, 116, 1.4, 4);
    b.shard(34.5, 7.5); b.shard(46, 3.5); b.shard(142, 7);
  }),

  // 441 ── twister relay: a roaming whirlwind lifts you into a ring volley across to the next whirlwind
  L('Twister Relay', 'ascent', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 14);
    b.tornado(12, 18, 0, { rise: 10, T: 3 });
    b.ring(27, 12, { angle: 30 });
    b.ring(34, 13, { angle: 30 });
    b.plat(41, 11, 3);
    b.checkpoint(42, 11);
    b.ring(47, 13.5, { angle: 35 });
    b.plat(54, 10, 10);
    b.tornado(57, 62, 10, { rise: 10, T: 3 });
    b.ring(72, 22, { angle: 10 });
    b.ring(79, 22, { angle: 10 });
    b.plat(86, 19, 8);
    b.goal(90, 19);
    b.cells(13, 4, 13, 10, 3); b.cells(58, 14, 58, 20, 3);
    b.shard(8.5, 5); b.shard(42.5, 15.5); b.shard(88, 23);
  }),

  // 442 ── wind tunnel: gust lanes blast you down a corridor of turning rotor blades, boost lane to finish
  L('Rotor Alley', 'gauntlet', (b) => {
    b.start(-6, 0, 12);
    b.wind(4, -2, 18, 10, 14, { gust: true, P: 1.2, on: 1.2 });
    b.plat(24, 1, 3);
    b.sweeper(14, 5, 3.5, { omega: 120, both: true });
    b.wind(26, -1, 18, 10, 14, { gust: true, P: 1.2, on: 1.2 });
    b.plat(46, 2, 3);
    b.sweeper(35, 6, 3.5, { omega: -120, both: true });
    b.checkpoint(47, 2);
    b.boost(49, 2, 7, 14);
    b.ring(63, 4.6, { angle: 35 });
    b.wind(66, 1, 18, 10, 14, { gust: true, P: 1.2, on: 1.2 });
    b.sweeper(76, 7, 3.5, { omega: 120, both: true });
    b.plat(86, 4, 3);
    b.boost(89, 4, 8, 14);
    b.plat(106, 3, 8);
    b.goal(110, 3);
    b.cells(8, 5, 22, 5, 5); b.cells(28, 5, 44, 5, 5); b.cells(50, 3.4, 55, 3.4, 3);
    b.shard(25.5, 5.5); b.shard(47.5, 6.5); b.shard(87.5, 8.5);
  }),

  // 443 ── the long drop: a fall from the top of the sky through pods, cables and a ring chain to the cloud sea
  L('Plunge Line', 'descent', (b) => {
    b.start(-6, 40, 12);
    b.barrel(10, 42, { angle: 0, power: 20, auto: true });
    b.barrel(21, 41.5, { angle: -10, power: 20, auto: true });
    b.plat(31, 36, 3);
    b.zip(34, 38.5, 54, 28);
    b.plat(56, 25, 3);
    b.checkpoint(57, 25);
    b.ring(63, 27.5, { angle: 35 });
    b.ring(70, 26, { angle: 20 });
    b.plat(77, 20, 3);
    b.zip(80, 22.5, 100, 12, { speed: 8 });
    b.plat(102, 9, 3);
    b.boost(105, 9, 8, 14);
    b.plat(121, 6, 8);
    b.goal(125, 6);
    b.cells(36, 37.5, 52, 29, 6); b.cells(82, 21.5, 98, 13, 6); b.cells(106, 10.4, 112, 10.4, 3);
    b.shard(2, 44.5); b.shard(58.5, 29.5); b.shard(103.5, 13.5);
  }),

  // 444 ── a silk lattice: ribbons stepping up and down a sweeper-guarded cliff face
  L('Silk Lattice', 'swing', (b) => {
    b.start(-6, 6, 12);
    b.vine(10, 14, 6);
    b.vine(18.5, 14, 6);
    b.plat(25, 6, 3);
    b.sweeper(30, 10, 3.5, { omega: 100, both: true });
    b.vine(33, 17, 6);
    b.vine(41.5, 18, 6);
    b.plat(48, 10, 3);
    b.checkpoint(49, 10);
    b.vine(56, 18, 6);
    b.vine(64.5, 17, 6);
    b.plat(71, 8, 3);
    b.sweeper(76, 12, 3.5, { omega: -100, both: true });
    b.vine(79, 15, 6);
    b.vine(87.5, 15, 6);
    b.plat(94, 7, 8);
    b.goal(98, 7);
    b.cells(10, 10, 24, 8, 6); b.cells(34, 12, 47, 12, 5); b.cells(57, 12, 70, 10, 5); b.cells(80, 10, 93, 9, 5);
    b.shard(26.5, 10.8); b.shard(50, 15); b.shard(96, 11);
  }),

  // 445 ── turbine run: boost lanes between big spinning blades; slip through on the speed you carry
  L('Turbine Run', 'boost', (b) => {
    b.start(-6, 0, 12);
    b.boost(8, 0, 8, 14);
    b.sweeper(20, 4, 4, { omega: 110, both: true });
    b.boost(25, 0, 8, 14);
    b.ring(40, 3, { angle: 35 });
    b.sweeper(46, 5, 3.5, { omega: -110, both: true });
    b.ring(47, 3.6, { angle: 35 });
    b.plat(53, 2, 3); b.boost(56, 2, 5, 14);
    b.checkpoint(54.5, 2);
    b.sweeper(66, 6, 4, { omega: 110, both: true });
    b.boost(70, 2, 8, 14);
    b.ring(85, 4.6, { angle: 35 });
    b.ring(92, 5.2, { angle: 35 });
    b.sweeper(98, 8, 3.5, { omega: -110, both: true });
    b.boost(100, 3, 8, 14);
    b.plat(116, 3, 8);
    b.goal(120, 3);
    b.cells(9, 1.4, 15, 1.4, 4); b.cells(26, 1.4, 32, 1.4, 4); b.cells(54, 3.4, 59, 3.4, 3); b.cells(101, 4.4, 107, 4.4, 4);
    b.shard(30, 5); b.shard(74, 6.8); b.shard(118, 8);
  }),

  // 446 ── skyline zips: three huge cables across the sky, with a ring hop to switch cable mid-flight
  L('Skyline Zips', 'speed', (b) => {
    b.start(-6, 20, 12);
    b.zip(8, 22.5, 34, 12);
    b.plat(36, 9, 3);
    b.ring(42, 11.5, { angle: 60, speed: 21 });
    b.plat(48, 15, 3);
    b.checkpoint(49, 15);
    b.zip(52, 17.5, 80, 5);
    b.plat(82, 2, 3);
    b.ring(88, 4.5, { angle: 60, speed: 21 });
    b.plat(94, 8, 3);
    b.zip(97, 10.5, 122, 0);
    b.plat(124, -3, 8);
    b.goal(128, -3);
    b.cells(10, 21.5, 32, 12.5, 7); b.cells(54, 16.5, 78, 6, 7); b.cells(99, 9.5, 120, 1, 7);
    b.shard(2, 24.5); b.shard(49.5, 19.5); b.shard(95.5, 12.5);
  }),

  // 447 ── swing set: fast pendulum seats and slides hand you onwards, all over a long drop
  L('Swing Set', 'ride', (b) => {
    b.start(-6, 8, 12);
    b.pendulum(13, 18, 6.5, { amp: 45, T: 2.2 });
    b.slide(20, 9, 28, 12, { T: 2.2, w: 4 });
    b.pendulum(36, 20, 7, { amp: 45, T: 2.2, phase: 0.5 });
    b.plat(44, 9, 3);
    b.checkpoint(45, 9);
    b.slide(50, 12, 60, 8, { T: 2.2, w: 4 });
    b.pendulum(68, 18, 6.5, { amp: 45, T: 2.2 });
    b.pendulum(76, 18, 6.5, { amp: 45, T: 2.2, phase: 0.5 });
    b.plat(83, 9, 3);
    b.ring(89, 11.5, { angle: 35 });
    b.plat(97, 9, 8);
    b.goal(101, 9);
    b.cells(14, 12, 18, 12, 3); b.cells(21, 11, 27, 13, 3); b.cells(51, 14, 59, 10, 4); b.cells(69, 13, 77, 13, 4);
    b.shard(15, 17); b.shard(46, 14); b.shard(84.5, 14);
  }),

  // 448 ── storm stairs: climb a staircase of twisters, ring-kicking between them with turning blades in the way
  L('Storm Stairs', 'ascent', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 12);
    b.tornado(12, 16, 0, { rise: 9, T: 2.6 });
    b.ring(24, 11, { angle: 35 });
    b.plat(31, 10, 12);
    b.checkpoint(33, 10);
    b.tornado(35, 39, 10, { rise: 9, T: 2.6 });
    b.sweeper(37, 17, 3, { omega: 100, both: true });
    b.ring(48, 20, { angle: 35 });
    b.plat(55, 19, 10);
    b.tornado(58, 62, 19, { rise: 9, T: 2.6 });
    b.ring(70, 30, { angle: 25 });
    b.ring(77, 30.6, { angle: 25 });
    b.plat(84, 28, 8);
    b.goal(88, 28);
    b.cells(13, 3, 13, 9, 3); b.cells(36, 13, 36, 17, 2); b.cells(59, 22, 59, 28, 3);
    b.shard(9, 4.5); b.shard(32, 15); b.shard(57, 24);
  }),

  // 449 ── EYE OF THE STORM: every toy at once and no rest: rings into a wrecker corridor, pods, ribbons over rotors and a closing lane
  L('Eye of the Storm', 'hard', (b) => {
    b.start(-6, 0, 12);
    b.boost(8, 0, 7, 14);
    b.ring(21, 3, { angle: 35 });
    b.wrecker(25, 9, 4.5, { amp: 45, T: 2.2 });
    b.ring(28, 4, { angle: 35 });
    b.plat(35, 2, 3);
    b.vine(43, 10, 6);
    b.vine(51.5, 10, 6);
    b.sweeper(47, 3, 3.5, { omega: 110, both: true });
    b.plat(58, 2, 3);
    b.checkpoint(59, 2);
    b.barrel(65, 4, { angle: 30, power: 20, auto: true });
    b.barrel(75.4, 4, { angle: 25, power: 20, auto: true });
    b.plat(84, 3, 3);
    b.pendulum(92, 13, 6.5, { amp: 45, T: 2.2 });
    b.wrecker(97, 11, 4.5, { amp: 45, T: 2.2, phase: 0.5 });
    b.pendulum(102, 13, 6.5, { amp: 45, T: 2.2, phase: 0.5 });
    b.plat(108, 3, 3);
    b.boost(111, 3, 8, 14);
    b.sweeper(121, 7, 3.5, { omega: -120, both: true });
    b.ring(127, 5.6, { angle: 40 });
    b.plat(134, 4, 8);
    b.goal(138, 4);
    b.cells(9, 1.4, 14, 1.4, 4); b.cells(36, 3.5, 40, 4, 3); b.cells(112, 4.4, 118, 4.4, 4);
    b.shard(36.5, 7); b.shard(47, 8); b.shard(97, 3);
  }),

  // 450 ── FINALE: Aerolis' greatest hits in one unbroken line (boosts, rings, ribbons, pods, cables) ending in a jet-stream chase
  L('The Last Updraft', 'finale', (b) => {
    b.start(-6, 0, 12);
    b.boost(8, 0, 8, 14);
    b.ring(24, 3, { angle: 35 });
    b.ring(31, 4, { angle: 35 });
    b.ring(38, 5, { angle: 35 });
    b.plat(45, 3, 3);
    b.vine(52, 11, 6);
    b.vine(60.5, 11, 6);
    b.plat(67, 3, 3);
    b.barrel(73, 5, { angle: 40, power: 20, auto: true });
    b.barrel(83.4, 5.5, { angle: 25, power: 20, auto: true });
    b.plat(92, 4, 3);
    b.checkpoint(93, 4);
    b.chase({ speed: 4.6, trigger: 94, behind: 16 });
    b.zip(96, 6.5, 116, -2);
    b.plat(118, -5, 3);
    b.boost(121, -5, 8, 14);
    b.ring(137, -2.6, { angle: 45, speed: 19 });
    b.ring(145, 1, { angle: 45, speed: 19 });
    b.plat(152, 0, 3);
    b.vine(160, 8, 6);
    b.vine(168.5, 8, 6);
    b.plat(175, 0, 3);
    b.boost(178, 0, 8, 14);
    b.ring(194, 2.6, { angle: 35 });
    b.ring(201, 3.4, { angle: 35 });
    b.plat(208, 2, 10);
    b.goal(214, 2);
    b.cells(9, 1.4, 15, 1.4, 4); b.cells(97, 5.5, 114, -1, 7); b.cells(122, -3.6, 128, -3.6, 4); b.cells(179, 1.4, 185, 1.4, 4);
    b.shard(46.5, 8); b.shard(68.5, 8); b.shard(176.5, 5);
  }),
];
