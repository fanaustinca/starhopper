// WORLD 9 — URANUS. 30 hand-written levels.
// Gravity 0.9: single jump ≈ 2.7 high, double jump ≈ 4.9 high / ~11 far.
// Geysers: vent(x, y, r) peaks about 2r + 4 above its base (≈ 2r + 5.5 with a double jump).
// Side wind (b.sideWind) is ignored by the solver, so jumps under strong wind stay ≤ ~6 wide.
import { L } from './dsl.js';

export default [
  // 241 ── touchdown on Uranus: run, jump, a first slippery crystal and a first geyser, under a gentle breeze
  L('Frostfall Landing', 'intro', (b) => {
    b.sideWind(1.2, 8);
    b.start(-6, 0, 14);
    b.arc(8, 0, 13, 0, 3, 2);
    b.plat(13, 0, 6);
    b.plat(23, 1.5, 5);
    b.plat(26, -2.5, 3); b.shard(27.5, -1);                 // tucked under the next ledge
    b.ice(32, 1.5, 9);                                      // first crystal: long and safe
    b.cells(33, 2.8, 40, 2.8, 4);
    b.plat(45, 0, 9);
    b.checkpoint(47, 0);
    b.vent(51.5, 0, 2.5);                                   // first geyser lifts you to the shelf
    b.cells(51.5, 3, 51.5, 7, 3);
    b.plat(55, 7, 6);
    b.shard(58, 11.2);
    b.plat(65, 4, 4);
    b.ice(73, 3, 4);
    b.arc(77, 3, 82, 2, 2, 1.6);
    b.plat(82, 2, 12);
    b.goal(90, 2);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.vine(63, 11, 6); b.cells(62, 6, 66, 6, 3);                 // a first frozen rope over the gap
  }),

  // 242 ── ski-lift glacier: cable zip lines carry you down the ice, a bubble lifts you back up, and swinging chandeliers guard the last run
  L('Ski-Lift Glacier', 'zip', (b) => {
    b.sideWind(1.2, 8);
    b.start(-6, 14, 12);
    b.plat(-12, 17.5, 3); b.shard(-10.5, 19.5);
    b.zip(8, 17, 28, 10);
    b.cells(10, 15.4, 26, 10.4, 5);
    b.plat(29, 7, 5);
    b.plat(31, 12, 3); b.shard(32.5, 13.6);                 // hop off the cable onto this perch
    b.zip(36, 10, 58, 4);
    b.plat(50, 3, 3); b.shard(51.5, 4.6);                   // hop off the second cable
    b.plat(59, 1, 6);
    b.checkpoint(62, 1);
    b.floater(69, 1, 3, { rise: 10, speed: 2.4 });          // a frozen gas bubble lifts you back up
    b.cells(70.5, 3.5, 70.5, 9.5, 3);
    b.plat(75, 11, 5);
    b.pendulum(84, 17, 6, { amp: 35, T: 3.4 });
    b.pendulum(91, 17, 6, { amp: 35, T: 3.4, phase: 0.5 });
    b.plat(97, 11, 4);
    b.zip(103, 14, 122, 6, { oneWay: true });
    b.plat(123, 3, 10);
    b.goal(129, 3);
  }),

  // 243 ── cliffs too tall to jump, each with a frozen geyser at its foot
  L('Geyser Garden', 'geyser', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 12);
    b.vent(16, 0, 2.6);
    b.cells(16, 3, 16, 8, 3);
    b.shard(16.5, 12.4);                                    // ride the geyser and double jump
    b.block(21, 7, 5);
    b.plat(30, 4, 5);
    b.plat(38, 1, 7);
    b.vent(43, 1, 3.6);
    b.block(46, 10, 6);
    b.checkpoint(49, 10);
    // geyser hops: three small pads over the drop, each with its own spout
    b.plat(56, 6, 3); b.vent(57.5, 6, 1.6, { P: 2.4, on: 1.2 });
    b.plat(63, 8, 3); b.vent(64.5, 8, 1.6, { P: 2.4, on: 1.2, off: 0.8 });
    b.plat(70, 6, 3); b.vent(71.5, 6, 4, { P: 2.4, on: 1.2, off: 1.6 });
    b.cells(57.5, 9, 71.5, 9, 4);
    b.rect(73.5, 16, 5, 0.8); b.shard(76, 18.2);           // perched on an ice cap above the last spout
    b.plat(78, 4, 10);
    b.goal(84, 4);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.vine(28, 11, 6);                                        // a rope over the cliff gap
    b.wrecker(81, 11, 5.5, { amp: 50, T: 3 });               // a frozen boulder swings over the goal run
  }),

  // 244 ── the tilted axis: two crossing diagonals; climb one, switch at the hub, and the wind shoves every hop
  L('Tilted Axis', 'wind', (b) => {
    b.sideWind(3, 6);
    b.start(-6, 0, 12);
    // lower-left arm (the climb)
    b.plat(9, 2, 3); b.plat(15, 4, 3); b.plat(21, 6, 3); b.plat(27, 8, 3);
    b.cells(10, 3.4, 28, 9.4, 5);
    b.plat(33, 10, 6);                                      // the hub
    b.checkpoint(36, 10);
    // upper-left arm: back over your own head
    b.plat(27, 13, 3); b.plat(21, 15, 3); b.plat(15, 17, 3);
    b.shard(16.5, 19.5);
    // upper-right arm
    b.plat(43, 13, 3); b.plat(49, 15, 3); b.plat(55, 17, 3);
    b.shard(56.5, 19.5);
    // lower-right arm (the way down)
    b.plat(43, 7, 3); b.plat(49, 5, 3); b.plat(55, 3, 3); b.plat(61, 1, 3);
    b.cells(44, 8.4, 62, 2.4, 5);
    b.plat(35, 4, 3); b.shard(36.5, 5.5);                   // under the hub
    b.plat(68, 0, 12);
    b.goal(75, 0);
    b.zip(59, 19.5, 68, 6, { oneWay: true });                 // a ski-lift line down from the last upper perch
  }),

  // 245 ── icicle chandeliers: a frozen cavern where hanging ice platforms swing in the wind over the pits, stepping up to a high shelf
  L('Chandelier Caverns', 'pendulum', (b) => {
    b.sideWind(1.5, 9);
    b.start(-6, 0, 12);
    b.plat(-13, -2, 3); b.shard(-11.5, -0.5);
    b.plat(8, 0, 5);
    b.pendulum(18, 9, 7, { amp: 38, T: 3.4 });
    b.pendulum(26, 9, 7, { amp: 38, T: 3.4, phase: 0.5 });
    b.cells(14, 1.5, 28, 3.5, 6);
    b.plat(33, 2, 6);
    b.checkpoint(36, 2);
    b.plat(21, -5, 3); b.shard(22.5, -3.4);                 // in the pit under the chandeliers
    b.pendulum(44, 12, 7, { amp: 35, T: 3.6 });
    b.pendulum(51, 14, 7, { amp: 35, T: 3.6, phase: 0.5 });
    b.pendulum(58, 16, 7, { amp: 35, T: 3.6 });
    b.cells(42, 6.5, 58, 10.5, 6);
    b.plat(63, 9, 5);
    b.thin(52.5, 10.8, 3); b.shard(54, 12.4);                // a ledge in the swing of the middle chandelier
    b.plat(70, 9, 10);
    b.wrecker(76, 15, 5.5, { amp: 50, T: 3 });              // a frozen boulder swings across the shelf
    b.plat(84, 6, 4);
    b.plat(91, 4, 12);
    b.goal(98, 4);
  }),

  // 246 ── a frozen gallery: icicles drip in rhythm from the cave roof, and a geyser opens an upper hall
  L('Icicle Gallery', 'cave', (b) => {
    b.start(-6, 0, 12);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.rect(4, 5.2, 42, 1);
    b.plat(6, 0, 12); b.ice(21, 0, 8); b.plat(32, 0, 12);
    b.plat(18.2, -3.4, 2.6); b.shard(19.5, -1.8);           // down the crack between floor plates
    for (const [x, o] of [[10, 0], [14, 0.8], [24, 0.3], [27, 1.2], [35, 0.6], [39, 1.6]]) b.meteor(x, 0, { style: 'drip', h: 5, P: 2.4, off: o });
    b.cells(8, 1, 42, 1, 9);
    b.plat(46, 0, 8);
    b.checkpoint(48, 0);
    b.vent(52, 0, 3.4);
    // two halls: upper gallery (riskier, with a shard) and the lower crawl with mites
    b.plat(55, 9, 30);
    b.rect(55, 14.4, 30, 1);
    for (let i = 0; i < 5; i++) b.meteor(59 + i * 5.5, 9, { style: 'drip', h: 5, P: 2.2, off: i * 0.45 });
    b.cells(57, 10, 83, 10, 7);
    b.shard(70, 10.6);
    b.plat(56, 0, 28);
    b.enemy('walker', 60, 0, { range: 8 }); b.enemy('spiker', 72, 0, { range: 8, speed: 2 });
    b.plat(88, 3, 10);
    b.goal(94, 3);
    b.zip(80, 12, 92, 6, { oneWay: true });                   // a cable from the upper hall to the exit
  }),

  // 247 ── aurora bands: two decks of light bridges alternate, then a curtain wave sweeps down to the goal
  L('Aurora Bridges', 'timing', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 5);
    for (let i = 0; i < 5; i++) {
      b.blink(16 + i * 7, 0, 5, { P: 4, on: 2.2, off: 0 });
      b.blink(19.5 + i * 7, 4, 4, { P: 4, on: 2.2, off: 2 });
    }
    b.cells(17, 1.2, 47, 1.2, 6); b.cells(21, 5.2, 50, 5.2, 5);
    b.shard(43, 9.5);
    b.plat(54, 3, 6);
    b.checkpoint(57, 3);
    // a light ladder up, then the curtain wave down
    b.blink(63, 6, 3, { P: 3, on: 1.8, off: 0 });
    b.blink(68, 9, 3, { P: 3, on: 1.8, off: -0.5 });
    b.blink(73, 12, 3, { P: 3, on: 1.8, off: -1 });
    b.bonus(78, 15, 3); b.shard(79.5, 17);
    for (let i = 0; i < 5; i++) b.blink(80 + i * 5.5, 10 - i * 1.6, 3, { P: 3, on: 1.8, off: -1.5 - i * 0.45 });
    b.cells(81, 11.4, 103, 5, 5);
    b.plat(108, 2, 10);
    b.goal(114, 2);
    b.plat(-13, -2.5, 3); b.shard(-11.5, -1);
    b.zip(18, 12, 46, 9, { oneWay: true });                   // a cable above the light decks
  }),

  // 248 ── cryo-cannon spires: pods bolted to ice spires blast you up a chain into the sky, then a rocking pod fires you across the aurora
  L('Cryo Cannon Spires', 'pods', (b) => {
    b.sideWind(1.2, 8);
    b.start(-6, 0, 12);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.plat(8, 0, 5);
    b.barrel(14, 2.2, { angle: 40 });                       // pod 1: hop in, press jump
    b.plat(22, 1, 6);
    b.barrel(30, 3, { angle: 90, power: 22 });              // the ladder: pod to pod up the spire
    b.barrel(30, 9, { angle: 90, power: 22 });
    b.barrel(30, 15, { angle: 90, power: 22 });
    b.barrel(30, 21, { angle: 60, sweep: 30, spin: 100, power: 20 });
    b.plat(40, 25, 5);
    b.plat(25, 14, 3); b.shard(26.5, 15.6);
    b.cells(30, 5, 30, 19, 5);
    b.checkpoint(43, 25);
    b.barrel(52, 27.5, { spin: 90 });                       // a spinning pod: wait for it to face the far spire
    b.plat(63, 27, 5);
    b.plat(66, 31, 3); b.shard(67.5, 32.6);
    b.barrel(71, 29.5, { angle: 15 });
    b.plat(80, 24, 5);
    b.barrel(88, 26.5, { angle: -20 });
    b.plat(98, 18, 10);
    b.goal(104, 18);
  }),

  // 249 ── down into Ariel's rift: switchback ledges back and forth, crumbling ice and snow-mites
  L("Ariel's Rift", 'descent', (b) => {
    b.start(-6, 30, 12);
    b.plat(-14, 31.5, 3); b.shard(-12.5, 33.5);
    b.plat(10, 27, 8); b.enemy('walker', 11, 27, { range: 5 });
    b.crumble(21, 24, 3); b.crumble(26, 21, 3);
    b.rect(16.5, -6, 1.6, 24); b.shard(17.3, 19.6);       // the rift wall's lip
    b.plat(31, 18, 8); b.enemy('walker', 32, 18, { range: 5 });
    b.plat(31, 13, 14);                                     // switchback: walk back left
    b.enemy('spiker', 33, 13, { range: 8, speed: 1.8 });
    b.plat(22, 9, 6);
    b.checkpoint(25, 9);
    b.rect(46.5, 8, 1.6, 22);                               // the far rift wall
    b.plat(30, 4, 17);                                      // and right again
    b.enemy('walker', 33, 4, { range: 5 }); b.enemy('walker', 40, 4, { range: 5, speed: 2 });
    b.thin(38, 7.8, 4); b.shard(40, 9.4);
    b.crumble(50, 2, 2.6); b.crumble(55, 0, 2.6); b.crumble(60, -2, 2.6);
    b.cells(51, 3.5, 61, -0.5, 4);
    b.plat(66, -3, 12);
    b.goal(73, -3);
    b.cells(11, 28.5, 16, 28.5, 3); b.cells(32, 14.5, 43, 14.5, 4);
    b.vine(55, 8, 6);                                         // a frozen rope over the crumbling steps
  }),

  // 250 ── CHASE: the Blizzard rolls in across floes and a constant geyser; the gusts ebb and push
  L('Blizzard Run', 'chase', (b) => {
    b.chase({ speed: 4 });
    b.sideWind(2, 5);
    b.start(-6, 0, 14);
    b.plat(12, 1, 5); b.ice(21, 1, 6); b.plat(31, 2, 4);
    b.ice(39, 3, 8);
    b.crumble(51, 3, 3); b.crumble(57, 4, 3);
    b.plat(63, 4, 7);
    b.checkpoint(65, 4);
    b.vent(68, 4, 3, { always: true });
    b.plat(71, 11, 5);
    b.shard(73.5, 15.2);
    b.plat(80, 8, 4); b.ice(88, 6, 6);
    b.crumble(98, 5, 2.6); b.crumble(104, 4, 2.6); b.crumble(110, 3, 2.6);
    b.plat(116, 3, 12);
    b.goal(124, 3);
    b.arc(5, 0, 12, 1, 2, 2); b.cells(40, 4.4, 46, 4.4, 3); b.cells(81, 9.4, 93, 7.4, 4);
    b.plat(44, -2, 3); b.shard(45.5, -0.5);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.vine(104, 11, 6);                    // ropes over the crumbling floes
  }),
  // 251 ── frozen ropes over the crevasse: swing rope to rope into the gorge, ride a bubble back up, and swing on to the far rim
  L('Rope Crevasse', 'swing', (b) => {
    b.sideWind(1.5, 8);
    b.start(-6, 6, 12);
    b.vine(-9, 12, 5); b.plat(-17, 8, 3); b.shard(-15.5, 10);   // a rope behind the start swings to a perch
    b.vine(11, 14, 6);
    b.plat(16, 6, 3);
    b.vine(24, 15, 7);
    b.plat(31, 5, 4);
    b.checkpoint(33, 5);
    b.plat(26, -1, 2.6); b.shard(27.3, 0.6);                // a ledge down in the crevasse
    b.vine(42, 16, 7); b.vine(51, 16, 7);                   // the chain: no ground between
    b.plat(57, 4, 4);
    b.shard(46.5, 10);                                      // mid-air between the two ropes
    b.floater(65, -6, 3, { rise: 14, speed: 2.4 });         // a gas bubble in the gorge floats you back up
    b.cells(66.5, -4, 66.5, 8, 5);
    b.plat(71, 8, 4);
    b.vine(80, 17, 6);
    b.plat(88, 8, 10);
    b.goal(94, 8);
    b.cells(10, 8, 25, 8, 5);
  }),

  // 252 ── switches swap the ice lids that cap the geysers, and build the bridges as they do; don't step on the last one
  L('Cryo Switchyard', 'puzzle', (b) => {
    b.start(-6, 0, 12);
    b.plat(6, 0, 16);
    b.switch(11, 0);
    b.vent(17, 0, 5.5);
    b.red(14, 10, 7);                                       // red lid caps the first geyser
    b.red(24, 4, 3); b.shard(25.5, 5.5);                    // grab it before the switch erases it
    b.plat(21, 12, 6);
    b.blue(30, 12, 4); b.blue(36, 12, 4);
    b.blue(33, 16, 3); b.shard(34.5, 17.8);
    b.cells(30, 13.2, 40, 13.2, 4);
    b.plat(42, 12, 8);
    b.checkpoint(44, 12);
    b.switch(47, 12);
    b.red(53, 12, 4); b.red(59, 12, 4);
    b.cells(53, 13.2, 63, 13.2, 4);
    b.plat(65, 6, 12);
    b.switch(69, 6);                                        // the trap: stepping on it shuts the lid
    b.vent(74, 6, 5);
    b.blue(72.5, 12.5, 3);
    b.cells(74, 9, 74, 15, 3);
    b.plat(78, 18, 8);
    b.goal(82, 18);
    b.plat(-13, -2, 3); b.shard(-11.5, -0.5);
    b.sweeper(58, 17, 2.5, { omega: 50 });                    // an aurora beam turning over the bridge
  }),

  // 253 ── a stack of ring-wheels: climb from wheel to wheel straight up the sky while the wind leans on you
  L('Ring Carousel', 'ride', (b) => {
    b.sideWind(2, 7);
    b.start(-6, 0, 12);
    b.ferris(12, 6, 5, { n: 4, omega: 0.6 });
    b.ferris(22, 13, 5, { n: 4, omega: -0.6 });
    b.shard(22, 13);                                        // the hub of the second wheel
    b.plat(29, 17, 5);
    b.checkpoint(31, 17);
    b.ferris(40, 22, 5, { n: 4, omega: 0.55 });
    b.ferris(31, 30, 4, { n: 3, omega: -0.7 });
    b.plat(38, 35, 6);
    b.shard(41, 39.5);
    b.plat(49, 31, 4); b.ice(57, 27, 5); b.plat(66, 23, 4);
    b.cells(50, 32.4, 67, 24.4, 6);
    b.plat(74, 19, 10);
    b.goal(80, 19);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 254 ── the glacier calves under your feet: long crumbling bridges, falling seracs, no stopping
  L('Calving Glacier', 'precision', (b) => {
    b.sideWind(1.5, 8);
    b.start(-6, 8, 12);
    for (let i = 0; i < 7; i++) b.crumble(6 + i * 2, 8, 2);
    b.ice(22, 7, 8);
    b.meteor(27, 7, { P: 3 });
    b.plat(24, 12, 3); b.shard(25.5, 13.6);                 // a serac perch, right in the fall line
    b.crumble(33, 5, 2.4); b.crumble(37, 3, 2.4); b.crumble(41, 1, 2.4);
    b.plat(45, 0, 7);
    b.checkpoint(48, 0);
    for (let i = 0; i < 9; i++) b.crumble(52 + i * 2, 0, 2);
    b.meteor(57, 0, { P: 2.6 }); b.meteor(63, 0, { P: 2.6, off: 0.9 }); b.meteor(69, 0, { P: 2.6, off: 1.8 });
    b.plat(72, -3, 3); b.shard(73.5, -1.5);                 // tucked under the far end of the span
    b.ice(73, 2, 5); b.ice(80, 4, 5);
    for (let i = 0; i < 4; i++) b.crumble(87 + i * 2, 6, 2);
    b.plat(97, 6, 10);
    b.goal(103, 6);
    b.cells(7, 9.2, 19, 9.2, 5); b.cells(53, 1.2, 69, 1.2, 6); b.cells(74, 3.4, 84, 5.4, 3);
    b.plat(-14, 10, 3); b.shard(-12.5, 12);
    b.vine(91, 13, 6);                                        // a rope over the last crumbling span
  }),

  // 255 ── slush rises up a geyser shaft; ride the spouts between slick crystal ledges before it freezes you in
  L('Rising Slush', 'tide', (b) => {
    b.rise({ rate: 0.6, delay: 5 });
    b.start(-6, 0, 12);
    b.tower(6, -4, 20, 48);
    b.plat(8, 2, 6);
    b.vent(12.5, 2, 3);
    b.ice(15, 10, 5);
    b.plat(9, 13, 4);
    b.plat(15, 16, 3);
    b.plat(21, 18, 5);
    b.checkpoint(22, 18);
    b.vent(24.5, 18, 3.5);
    b.shard(24.5, 30.5);                                    // top of the second spout
    b.ice(16, 28, 5);
    b.plat(29, 25, 2.5); b.shard(30.2, 26.6);              // a ledge outside the shaft
    b.plat(9, 31, 4);
    b.ice(15, 34, 4);
    b.plat(21, 37, 4);
    b.crumble(14, 40, 3);
    b.plat(19, 43, 10);
    b.goal(25, 43);
    b.cells(10, 5, 10, 12, 3); b.cells(17, 29.4, 23, 38.4, 4);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.vine(12, 25, 6);                                        // a rope across the shaft
  }),

  // 256 ── boulder gauntlet: frozen boulders swing across the trail and chandeliers carry you over the gaps between
  L('Boulder Gauntlet', 'gauntlet', (b) => {
    b.sideWind(1.6, 7);
    b.start(-6, 4, 12);
    b.plat(-14, 6, 3); b.shard(-12.5, 8);
    b.plat(8, 4, 14);
    b.wrecker(15, 11, 4.9, { amp: 55, T: 3 });              // a boulder sweeping the trail: duck through the gap
    b.cells(9, 5.2, 21, 5.2, 5);
    b.pendulum(28, 12, 7.5, { amp: 35, T: 3.4 });
    b.pendulum(35, 12, 7.5, { amp: 35, T: 3.4, phase: 0.5 });
    b.plat(41, 4, 8);
    b.checkpoint(44, 4);
    b.wrecker(46, 11, 4.9, { amp: 55, T: 2.8, phase: 0.4 });
    b.plat(53, 4, 10);
    b.wrecker(58, 11, 4.9, { amp: 55, T: 2.8 });
    b.shard(55, 11.6);                                      // up over the boulders
    b.plat(65, 8, 3); b.plat(70, 11, 3);
    b.plat(76, 8, 3); b.shard(77.5, 9.6);
    b.rect(79.5, 8, 1.4, 5); b.turret(80.2, 10.4, -1, { P: 2.2 });
    b.pendulum(88, 14, 6.5, { amp: 35, T: 3.2 });
    b.plat(95, 6, 12);
    b.goal(102, 6);
    b.cells(66, 9.4, 84, 9.4, 6);
  }),

  // 257 ── a whiteout gale: ferry floes across a void, landing on ice stops where the wind wants to shove you off
  L('Whiteout Ferry', 'ride', (b) => {
    b.sideWind(3.6, 5);
    b.start(-6, 2, 12);
    b.slide(10, 2, 26, 2, { T: 5, w: 3 });
    b.ice(30, 3, 5);
    b.plat(25, -2, 2.6); b.shard(26.3, -0.5);               // under the first floe's landing
    b.slide(38.5, 3, 38.5, 10, { T: 4, w: 3 });
    b.slide(43, 10, 59, 6, { T: 5, w: 3 });
    b.meteor(51, 8, { style: 'drip', P: 2.8 });
    b.ice(62, 6, 6);
    b.checkpoint(64, 6);
    b.loop([[71, 6], [79, 12], [91, 12], [99, 6]], { speed: 3, w: 3, loop: false });
    b.thin(83, 16, 4); b.shard(85, 17.6);
    b.cells(14, 3.4, 24, 3.4, 4); b.cells(46, 11, 57, 7.5, 4); b.cells(74, 9.5, 96, 9.5, 6);
    b.plat(103, 6, 10);
    b.goal(109, 6);
    b.plat(-14, 3.5, 3); b.shard(-12.5, 5.5);
  }),

  // 258 ── the cryo organ: pick the one pipe that blows through the ice roof, then ride spouts up pipes of rising height
  L('Cryo Organ', 'geyser', (b) => {
    b.start(-6, 0, 12);
    b.plat(6, 0, 42);
    b.rect(6, 7.5, 9, 1.5); b.rect(18, 7.5, 13, 1.5); b.rect(34, 7.5, 14, 1.5);
    for (const x of [11, 16.5, 24, 32.5, 41]) b.vent(x, 0, 3.5, { P: 2.6, on: 1.2, off: x * 0.05 });
    b.enemy('walker', 19, 0, { range: 4 }); b.enemy('walker', 35, 0, { range: 4 });
    b.cells(8, 1, 46, 1, 8);
    b.shard(8, 10.5);                                       // only the first pipe reaches this roof
    b.checkpoint(44, 9);
    b.plat(50, 9, 3);
    for (const [i, t] of [[0, 11], [1, 14], [2, 17], [3, 20]]) { b.block(54 + i * 6, t, 3); b.vent(55.5 + i * 6, t, 1); }
    b.vent(73.5, 20, 2);
    b.shard(73.5, 26.5);
    b.cells(55.5, 13, 73.5, 22, 4);
    b.block(78, 18, 10);
    b.goal(84, 18);
    b.pendulum(60, 28, 6.5, { amp: 30, T: 3.4 });             // an icicle chandelier over the top pipes
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 259 ── aurora beams sweep an open frozen plaza: time every crossing under the turning bars, then ride a blizzard vortex to the top
  L('Aurora Sweepers', 'hazard', (b) => {
    b.sideWind(2.2, 6);
    b.start(-6, 0, 12);
    b.plat(8, 0, 58);
    b.sweeper(16, 2.8, 3.2, { omega: 55, both: true });
    b.sweeper(28, 2.8, 3.2, { omega: -60, both: true });
    b.sweeper(40, 3.2, 3.4, { omega: 70, both: true });
    b.sweeper(52, 2.8, 3.2, { omega: -55, both: true });
    b.enemy('walker', 21, 0, { range: 4 });
    b.checkpoint(34, 0);
    b.thin(14, 4.4, 4); b.shard(16, 6);                     // the roof of the first beam
    b.thin(44, 4.4, 4); b.shard(46, 6);
    b.cells(10, 1, 62, 1, 11);
    b.plat(70, 0, 6);
    b.tornado(79, 87, 0, { rise: 11, T: 5 });              // a blizzard vortex wanders the gap
    b.plat(92, 10, 5);
    b.pendulum(100, 17, 6.5, { amp: 35, T: 3.2 });
    b.plat(106, 10, 10);
    b.goal(112, 10);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 260 ── CHASE: the Blizzard chases you down the mountainside, over slides and drop-offs, then up a spout
  L('Avalanche Line', 'chase', (b) => {
    b.chase({ speed: 4.4 });
    b.sideWind(2.5, 6);
    b.start(-6, 24, 14);
    b.ice(12, 22, 8); b.plat(24, 19, 5); b.ice(33, 16, 8);
    b.plat(37, 12, 3); b.shard(38.5, 13.6);                 // under the slide
    b.crumble(45, 13, 3); b.crumble(50, 11, 3);
    b.plat(56, 9, 6);
    b.checkpoint(59, 9);
    b.ice(66, 6, 10);
    b.plat(80, 2, 4);
    b.vent(83, 2, 3, { always: true });
    b.plat(86, 11, 5);
    b.shard(88.5, 15.4);
    b.plat(95, 8, 4); b.ice(103, 6, 6);
    b.crumble(112, 5, 2.6); b.crumble(117, 4, 2.6);
    b.plat(122, 4, 12);
    b.goal(130, 4);
    b.cells(13, 23.4, 19, 23.4, 3); b.cells(34, 17.4, 40, 17.4, 3); b.cells(67, 7.4, 75, 7.4, 4);
    b.plat(-14, 25.5, 3); b.shard(-12.5, 27.5);
    b.zip(68, 10, 79, 4, { oneWay: true });                    // ride the ski-lift down the slope
    b.vine(115, 11, 6);
  }),
  // 261 ── up one side of an ice needle and down the other, ice moths circling every perch
  L('Moth Spire', 'enemies', (b) => {
    b.sideWind(2.2, 7);
    b.start(-6, 0, 12);
    b.tower(6, -2, 12, 26);
    const up = [[13, 3], [8, 6], [13, 9], [8, 12], [13, 15], [8, 18], [13, 21]];
    for (const [x, t] of up) b.plat(x, t, 3);
    b.enemy('flyer', 11, 8, { ax: 1.2, ay: 1, T: 2.6 });
    b.enemy('flyer', 11.5, 14, { ax: 1.5, ay: 0.8, T: 3 });
    b.enemy('flyer', 11, 20, { ax: 1, ay: 1.2, T: 2.4 });
    b.plat(2, 14, 2.5); b.shard(3.2, 15.6);                 // an outlying perch in the wind
    b.block(17, 24, 5);                                     // the needle
    b.checkpoint(19.5, 24);
    b.shard(19.5, 28.5);
    const down = [[26, 20], [31, 16], [26, 12], [31, 8], [36, 4]];
    for (const [x, t] of down) b.plat(x, t, 3);
    b.enemy('flyer', 29.5, 18, { ax: 1.5, ay: 1, T: 2.8 }); b.enemy('flyer', 29.5, 10, { ax: 1.5, ay: 1, T: 2.2 });
    b.plat(29, 1, 2.5); b.shard(30.2, 2.6);
    b.cells(10, 4.5, 10, 22, 6); b.cells(28, 21.5, 37, 5.5, 5);
    b.plat(42, 2, 10);
    b.goal(48, 2);
    b.zip(20, 29, 40, 6, { oneWay: true });                   // a cable-car line off the needle
  }),

  // 262 ── a geyser relay: every pad is too high or walled off to jump to, so each spout hands you to the next
  L('Geyser Relay', 'geyser', (b) => {
    b.sideWind(2, 6);
    b.start(-6, 0, 12);
    b.ice(8, 0, 3); b.vent(9.5, 0, 2.5, { P: 2.4, on: 1.2 });
    b.ice(15, 5, 3); b.vent(16.5, 5, 2.5, { P: 2.4, on: 1.2, off: 0.6 });
    b.ice(22, 10, 3); b.vent(23.5, 10, 2.5, { P: 2.4, on: 1.2, off: 1.2 });
    b.ice(29, 15, 3); b.vent(30.5, 15, 3.5, { P: 2.4, on: 1.2, off: 1.8 });
    b.shard(30.5, 27);                                      // top of the tallest spout
    b.cells(9.5, 4, 30.5, 19, 5);
    b.plat(36, 18, 6);
    b.checkpoint(39, 18);
    for (let i = 0; i < 3; i++) {
      b.ice(46 + i * 9, 13, 3); b.vent(47.5 + i * 9, 13, 2.8, { P: 2.6, on: 1.2, off: i * 0.8 });
      b.rect(51 + i * 9, 11, 1.2, 9);
      b.cell(51.6 + i * 9, 22);
    }
    b.shard(69.6, 21.6);                                    // balanced on the last wall
    b.plat(74, 13, 9);
    b.goal(80, 13);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.pendulum(42, 22, 6.5, { amp: 30, T: 3.4 });             // an icicle chandelier bridging to the pipes
  }),

  // 263 ── the twin moons: lift up Miranda's face, ferry across the sky, then pick down Ariel's far side
  L('Twin Moons', 'ascent', (b) => {
    b.sideWind(2, 8);
    b.start(-6, 0, 12);
    b.block(10, 26, 8);                                     // Miranda
    b.lift(7.5, 1, 12, { T: 5 });
    b.plat(1, 13, 4); b.plat(-4, 16, 3); b.plat(1, 19, 4);
    b.lift(7.5, 19, 27, { T: 4.4 });
    b.cells(7.5, 4, 7.5, 11, 3); b.cells(2, 20.4, 5, 20.4, 2);
    b.checkpoint(14, 26);
    b.shard(11, 30.5);
    b.slide(23, 26, 37, 26, { T: 5, w: 3 });
    b.shard(30, 30.4);
    b.cells(24, 27.4, 36, 27.4, 4);
    b.block(41, 24, 8);                                     // Ariel
    b.plat(51, 20, 3); b.crumble(56, 16, 2.6); b.plat(51, 12, 3); b.crumble(56, 8, 2.6); b.plat(51, 4, 3);
    b.enemy('flyer', 54.5, 14, { ax: 1.6, ay: 0.6, T: 2.4 });
    b.cells(52.5, 21.4, 52.5, 5.4, 5);
    b.plat(60, 1, 10);
    b.goal(66, 1);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 264 ── hitch rides on drifting chunks of the epsilon ring, two lanes at two speeds
  L('Epsilon Drift', 'ride', (b) => {
    b.sideWind(1.6, 9);
    b.start(-6, 2.35, 14);
    b.plat(-14, 4, 3); b.shard(-12.5, 6);
    b.stream('ring', 8, 40, 0, { speed: 3, spacing: 6 });
    b.cells(12, 2.2, 36, 2.2, 6);
    b.thin(22, 5.6, 4); b.shard(24, 7.2);                   // hop off the chunk mid-drift
    b.plat(41, 1.9, 6);
    b.checkpoint(44, 1.9);
    b.plat(46, 5.35, 3);
    b.stream('ring', 49, 82, 4, { speed: 4.2, spacing: 7 });
    b.meteor(60, 5, { style: 'drip', P: 2.6 }); b.meteor(72, 5, { style: 'drip', P: 2.6, off: 1.3 });
    b.cells(52, 6.2, 80, 6.2, 7);
    b.plat(64, -1, 3); b.shard(65.5, 0.6);                  // drop under the fast lane
    b.plat(83, 5.9, 10);
    b.goal(89, 5.9);
  }),

  // 265 ── blizzard vortices: tornado after tornado lifts you out of the pits, one tall stair of updrafts with ice beams turning at the top
  L('Vortex Stairs', 'tornado', (b) => {
    b.sideWind(1.4, 6);
    b.start(-6, 0, 12);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.plat(8, 0, 4);
    b.tornado(16, 22, 0, { rise: 11, T: 5 });
    b.plat(27, 6, 4);
    b.cells(12, 1, 26, 7, 4);
    b.tornado(34, 40, 6, { rise: 11, T: 5 });
    b.plat(45, 11, 4);
    b.checkpoint(46.5, 11);
    b.tornado(51, 57, 11, { rise: 11, T: 5 });
    b.plat(62, 17, 5);
    b.thin(58, 19.5, 3); b.shard(59.5, 21.1);                                        // on top of the vortex, past the beam
    b.plat(69, 13, 3); b.plat(75, 10, 3);
    b.shard(76.5, 11.6);
    b.floater(81, 10, 3, { rise: 8, speed: 2.2 });
    b.plat(88, 15, 10);
    b.goal(94, 15);
    b.cells(63, 18.2, 76, 11.2, 5);
  }),

  // 266 ── climb an aurora curtain: rungs of light flicker in a rising wave while the wind sways you
  L('Aurora Ladder', 'timing', (b) => {
    b.sideWind(2.4, 7);
    b.start(-6, 0, 12);
    b.tower(6, -2, 14, 40);
    for (let i = 0; i < 6; i++) b.blink(i % 2 ? 14 : 8, 2.6 + i * 2.6, 4, { P: 3.2, on: 2, off: -i * 0.4 });
    b.plat(9, 18, 8);
    b.checkpoint(13, 18);
    b.blink(1, 17, 3, { P: 3.2, on: 2, off: 1.6 }); b.shard(2.5, 18.8);
    for (let i = 0; i < 6; i++) b.blink(i % 2 ? 8 : 14, 20.6 + i * 2.6, 4, { P: 3, on: 1.8, off: -i * 0.4 });
    b.plat(9, 36, 6);
    b.shard(12, 40.5);
    b.cells(10, 3.6, 16, 16.6, 5); b.cells(10, 21.6, 16, 34.6, 5);
    for (let i = 0; i < 4; i++) b.blink(20 + i * 5.5, 34 - i * 2.5, 3, { P: 3, on: 1.8, off: -i * 0.45 });
    b.plat(43, 24, 10);
    b.goal(49, 24);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.zip(17, 38.5, 41, 27, { oneWay: true });                // a cable off the summit ledge
  }),

  // 267 ── sinking floes: slush ice floes sink under your weight and frozen gas bubbles rise; cross the gorge without ever standing still
  L('Floe Falls', 'weights', (b) => {
    b.sideWind(1.2, 7);
    b.start(-6, 0, 12);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.sinker(9, 0, 3, { depth: 3 });
    b.sinker(15, 0.5, 3, { depth: 3.5 });
    b.shard(16.5, -2);                                      // ride a floe all the way under
    b.sinker(21, 0, 3, { depth: 3 });
    b.plat(27, 1, 5);
    b.checkpoint(29, 1);
    b.floater(35, 1, 3, { rise: 10, speed: 2.2 });
    b.cells(36.5, 3.5, 36.5, 10, 3);
    b.shard(36.5, 13);                                      // ride the bubble to the very top
    b.plat(41, 8, 5);
    b.sinker(48, 7, 2.6, { depth: 3, speed: 2 });
    b.sinker(53.5, 6, 2.6, { depth: 3, speed: 2 });
    b.sinker(59, 5, 2.6, { depth: 3, speed: 2 });
    b.enemy('flyer', 56.5, 9.5, { ax: 2.5, ay: 0.6, T: 3 });
    b.floater(65, 3, 3, { rise: 7, speed: 2.4 });
    b.plat(70, 10, 4);
    b.sinker(77, 9, 6, { depth: 5, speed: 0.9 });           // the great floe: slow, but don't dawdle
    b.plat(87, 7, 10);
    b.goal(93, 7);
    b.arc(6, 0, 26, 1, 6, 1.6); b.cells(49, 8.2, 60, 6.2, 4);
  }),

  // 268 ── a crevasse labyrinth of red and blue ice: three switches, one chimney, and an exit through the roof
  L('Crevasse Labyrinth', 'puzzle', (b) => {
    b.start(-6, 0, 12);
    b.plat(6, 0, 14); b.plat(20, 0, 10); b.plat(30, 0, 6); b.plat(36, 0, 8);   // floor split at each ice wall
    b.rect(6, 14, 58, 1);
    b.switch(10, 0);
    b.blue(13, 4, 3); b.shard(14.5, 5.6);
    b.redWall(20, 0, 14);
    b.wall(25, 2.2, 9); b.wall(28.6, 0, 9);                 // the chimney
    b.cells(27.2, 3, 27.2, 8, 3);
    b.shard(25.4, 12.6);
    b.plat(28.6, 9, 6); b.switch(32, 9);
    b.blueWall(36, 0, 14);
    b.checkpoint(40, 0);
    b.red(44, 0, 8);
    b.plat(52, 0, 7.5); b.plat(59.5, 0, 4.5);
    b.switch(55, 0);
    b.redWall(59.5, 0, 14);
    b.blue(60.5, 3, 3); b.blue(63, 7, 3);
    b.cells(45, 1.2, 51, 1.2, 3);
    b.plat(69, 10, 8);
    b.goal(74, 10);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.vine(50, 13.5, 6);                                      // a rope hanging from the roof
  }),

  // 269 ── the polar night: tiny crystal footholds in a howling crosswind, icicles and sentries; the hardest stretch on Uranus
  L('Polar Night', 'precision', (b) => {
    b.sideWind(4, 5);
    b.start(-6, 0, 12);
    b.ice(9, 1, 2); b.ice(15, 3, 1.8); b.crumble(21, 4, 2); b.ice(27, 2, 1.8);
    b.meteor(16, 3, { P: 2.4 }); b.meteor(28, 2, { P: 2.4, off: 1.2 });
    b.blink(32, 4, 2.4, { P: 2.6, on: 1.5 }); b.blink(37, 6, 2.4, { P: 2.6, on: 1.5, off: -0.6 });
    b.ice(42, 8, 2);
    b.shard(43, 12.6);
    b.plat(47, 5, 5);
    b.checkpoint(49, 5);
    b.rect(56, 0, 1.4, 9); b.turret(56.7, 6.6, -1, { P: 1.9 });
    b.ice(59, 6, 1.8); b.crumble(64, 7.5, 1.8); b.ice(69, 9, 1.8);
    b.rect(73, 2, 1.4, 12); b.turret(73.7, 10.6, -1, { P: 1.7, off: 0.8 });
    b.shard(66, 11.5);                                      // a leap between the sentries
    b.ice(77, 8, 1.8); b.blink(82, 6, 2.4, { P: 2.4, on: 1.4 }); b.ice(87, 4, 1.8); b.crumble(92, 3, 2);
    b.meteor(88, 4, { P: 2.2, off: 0.5 });
    b.plat(97, 3, 10);
    b.goal(103, 3);
    b.cells(10, 2.5, 38, 7.5, 7); b.cells(60, 7.5, 92, 4.5, 7);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.vine(24, 10, 5);                                        // a frayed rope over the first crumble
  }),

  // 270 ── FINALE: a lidded geyser, aurora bridges, an ice chimney, and then the Blizzard chases you off the giant
  L('Heart of the Ice Giant', 'finale', (b) => {
    b.sideWind(1.8, 7);
    b.start(-6, 0, 12);
    b.plat(6, 0, 16); b.switch(9, 0);
    b.vent(17, 0, 5.5);
    b.red(14, 10, 7);                                       // the switch-lidded geyser again
    b.plat(21, 12, 6);
    b.blink(29, 12, 4, { P: 3.4, on: 2, off: 0 }); b.blink(36, 13, 4, { P: 3.4, on: 2, off: -0.8 });
    b.blink(32, 17, 3, { P: 3.4, on: 2, off: 1.7 }); b.shard(33.5, 18.8);
    b.plat(43, 12, 10);
    b.rect(48, 14.2, 1, 10); b.rect(51.8, 12, 1, 12);      // the chimney
    b.cells(50.4, 15, 50.4, 22, 3);
    b.shard(48.5, 26.4);
    b.plat(51.8, 24, 6);
    b.checkpoint(54, 24);
    b.chase({ speed: 4.4, trigger: 56, behind: 16 });
    b.plat(62, 22, 4); b.ice(69, 20, 5);
    b.crumble(78, 18, 2.6); b.crumble(83, 17, 2.6);
    b.plat(88, 16, 5); b.vent(91.5, 16, 2.5, { always: true });
    b.plat(95, 23, 4);
    b.shard(97, 27.4);
    b.ice(103, 20, 5);
    b.crumble(111, 18, 2.4); b.crumble(116, 16, 2.4);
    b.plat(121, 14, 12);
    b.goal(129, 14);
    b.cells(30, 13.2, 40, 14.2, 4); b.cells(63, 23.4, 117, 17.4, 10);
    b.zip(104, 24, 120, 15, { oneWay: true });                // a last cable over the crumbling floes
    b.vine(74.5, 24, 5.5);
  }),
];
