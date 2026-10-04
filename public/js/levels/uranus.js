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
  }),

  // 242 ── a crystal ski slope: long ice runs carry your momentum, tiny grippy rocks are the only brakes
  L('Crystal Slalom', 'ice', (b) => {
    b.start(-6, 14, 12);
    b.plat(-12, 17.5, 3); b.shard(-10.5, 19.5);
    b.ice(10, 12, 12);
    b.cells(11, 13.2, 21, 13.2, 4);
    b.ice(26, 10, 10);
    b.plat(40, 8, 2.5);                                     // brake rock
    b.plat(33, 5, 3); b.shard(34.5, 6.6);                   // hidden under the second run
    b.ice(46, 6, 14);
    b.cells(47, 7.2, 59, 7.2, 5);
    b.plat(64, 4, 6);
    b.checkpoint(67, 4);
    // back uphill on short, slick crystal steps
    b.ice(74, 6, 4); b.ice(81, 8, 4); b.ice(88, 10, 4);
    b.cells(76, 7.4, 90, 11.4, 3);
    b.shard(90, 14.6);
    b.ice(96, 8, 12);
    b.plat(112, 6, 10);
    b.goal(118, 6);
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
  }),

  // 245 ── scale the cliff face of Miranda: uneven terraces, a wall-jump crack, then a needle-spire descent
  L('Miranda Cliffs', 'ascent', (b) => {
    b.sideWind(1.5, 9);
    b.start(-6, 0, 12);
    b.plat(-13, -2, 3); b.shard(-11.5, -0.5);
    b.block(8, 2, 6);
    b.block(16, 5, 4);
    b.block(24, 6, 8);
    // the crack: a hanging slab and the cliff face 2.8 apart
    b.wall(26, 8.2, 9, 0.8);
    b.block(29.6, 18, 6);
    b.cells(28.2, 9, 28.2, 16, 4);
    b.shard(33, 22.4);
    b.block(39, 15, 4);
    b.block(46, 12, 5);
    b.checkpoint(48, 12);
    for (const [x, t] of [[54, 9], [59, 11], [64, 8], [69, 10]]) b.block(x, t, 2);
    b.cells(55, 10.5, 70, 11.5, 4);
    b.block(75, 6, 4);
    b.block(82, 4, 10);
    b.goal(88, 4);
    b.block(94, 8, 1.6); b.shard(94.8, 9.6);               // the needle past the goal
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
  }),

  // 248 ── a frozen shaft climbed by wall-jumps alone, icicles falling down the cracks
  L('Frozen Chimney', 'ascent', (b) => {
    b.start(-6, 0, 12);
    b.tower(6, -2, 18, 46);
    b.plat(6, 0, 8);
    // chimney 1 (x 10 → 12.8)
    b.rect(9, 2.2, 1, 12); b.rect(12.8, 0, 1, 14);
    b.cells(11.4, 3, 11.4, 12, 4);
    b.meteor(11.4, 0, { style: 'drip', h: 14, P: 4 });
    b.plat(12.8, 14, 8);
    // chimney 2 (x 17.8 → 20.6)
    b.rect(16.8, 16.2, 1, 12); b.rect(20.6, 14, 1, 14);
    b.cells(19.2, 17, 19.2, 26, 4);
    b.plat(21.6, 22, 2.4); b.shard(22.8, 23.6);            // a notch outside the second crack
    b.plat(8, 28.2, 9.8);
    b.checkpoint(14.6, 28.2);
    // chimney 3 back on the left (x 9 → 11.8), roofed by the summit ledge
    b.rect(8, 28.2, 1, 12); b.rect(11.8, 31.2, 1, 9);
    b.meteor(10.4, 28.2, { style: 'drip', h: 12, P: 3.4, off: 1 });
    b.cells(10.4, 30, 10.4, 38, 3);
    b.crumble(12.8, 40.2, 3);
    b.plat(18, 41, 4);
    b.plat(25, 39, 10);
    b.goal(31, 39);
    b.shard(10, 44.4);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
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
  }),
  // 251 ── a honeycomb of snow-mite burrows: low tunnel, high tunnel, then pick the lower den or the hidden upper one
  L('Snowmite Burrows', 'enemies', (b) => {
    b.start(-6, 0, 12);
    b.plat(6, 0, 15);
    b.rect(8, 4.4, 12, 1);                                  // roof of the first burrow
    b.thin(3, 3, 3);                                        // climb onto the roof for a shard
    b.enemy('spiker', 9, 5.4, { range: 8, speed: 1.4 });
    b.shard(18.5, 7);
    b.enemy('walker', 9, 0, { range: 9, speed: 2 });
    b.cells(8, 1, 20, 1, 4);
    b.plat(22, 2.5, 3);
    b.plat(27, 5, 23);                                      // the high burrow
    b.rect(27, 9.4, 23, 1);
    b.checkpoint(28.5, 5);
    b.enemy('spiker', 31, 5, { range: 8, speed: 1.8 }); b.enemy('spiker', 41, 5, { range: 7, speed: 2.2 });
    b.cells(30, 6, 48, 6, 6);
    // drop down the shaft into the den, or leap across into the secret upper den
    b.plat(47, 0, 27);
    b.enemy('walker', 53, 0, { range: 6 }); b.enemy('walker', 62, 0, { range: 9, speed: 2.4 });
    b.rect(53, 4.4, 21, 1);
    b.rect(53, 9.4, 21, 1);
    b.enemy('flyer', 63, 7.2, { ax: 4, ay: 0.5, T: 3 });
    b.cells(55, 6.4, 72, 6.4, 6); b.cells(52, 1, 72, 1, 6);
    b.shard(71, 6.6);
    b.plat(77, 3, 4);
    b.plat(84, 5, 12);
    b.goal(90, 5);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
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
  }),

  // 256 ── frost sentries sweep the column tops; drop into the trenches between volleys
  L('Frost Sentries', 'gauntlet', (b) => {
    b.start(-6, 4, 12);
    for (let i = 0; i < 4; i++) { b.block(8 + i * 8, 4, i ? 4 : 5); b.block(13 + i * 8, 0, 4); }
    b.cells(9, 5.2, 35, 5.2, 7);
    b.block(41, 8, 2.4);                                    // the sentry post
    b.turret(41, 5.2, -1, { P: 2.2 });
    b.shard(42.2, 12);
    b.plat(47, 6, 20);
    b.checkpoint(48, 6);
    b.rect(66, 8.4, 1.4, 4); b.turret(66.7, 6.8, -1, { P: 2, off: 1 });   // hanging sentry: jump its bolts
    b.enemy('walker', 50, 6, { range: 6 });
    b.thin(51, 9.6, 4); b.thin(59, 9.6, 4); b.shard(61, 11.2);
    b.cells(49, 7.2, 64, 7.2, 6);
    b.plat(71, 3, 4);
    b.plat(78, 1, 10);
    b.goal(84, 1);
    b.plat(-14, 6, 3); b.shard(-12.5, 8);
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
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 259 ── hail sweeps an open frozen plaza; dash shelter to shelter, or brave the roofs for the shards
  L('Hailstorm Plaza', 'hazard', (b) => {
    b.sideWind(2.5, 6);
    b.start(-6, 0, 12);
    b.plat(8, 0, 62);
    const roofs = [[13, 4.2, 5], [25, 4.6, 6], [39, 4.2, 5], [53, 4.6, 6]];
    for (const [x, y, w] of roofs) b.rect(x, y, w, 0.8);
    for (const [x, o] of [[21, 0], [34, 0.7], [47, 1.4], [62, 0.4], [66, 1.6]]) b.meteor(x, 0, { P: 2.2, off: o });
    for (const [x, o] of [[15.5, 1], [28, 0.2], [42, 1.7], [56, 0.9]]) b.meteor(x, 5.4, { P: 2.6, off: o });
    b.enemy('walker', 30, 0, { range: 7 });
    b.checkpoint(41, 0);
    b.shard(28, 7); b.shard(56, 7);
    b.cells(10, 1, 68, 1, 12);
    b.plat(73, 3, 4); b.crumble(80, 6, 2.6); b.crumble(85, 9, 2.6);
    b.meteor(81.3, 6, { P: 2.4 });
    b.plat(90, 11, 10);
    b.goal(96, 11);
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

  // 265 ── a frost tube: the roof dips and rises, so every hop over a pit or urchin has to stay low
  L('Frostbite Tube', 'tunnel', (b) => {
    b.sideWind(1.4, 6);
    b.start(-6, 0, 12);
    b.rect(4, 3.6, 22, 1); b.rect(26, 4.4, 4, 1); b.rect(34, 4.4, 6, 1); b.rect(40, 3.6, 10, 1);
    b.plat(6, 0, 10); b.plat(19, 0, 8); b.crumble(29.5, 0, 3); b.plat(35, 0, 15);
    b.enemy('spiker', 21, 0, { range: 4, speed: 1.4 });
    b.enemy('spiker', 37, 0, { range: 10, speed: 2 });
    b.rect(30, 5.4, 0.8, 3); b.rect(33.2, 5.4, 0.8, 3); b.rect(30, 8.4, 4, 0.8);
    b.thin(30.8, 4.4, 2.4); b.shard(32, 6.2);               // an alcove punched up through the roof
    b.cells(7, 1, 48, 1, 10);
    b.plat(50, 2, 6);                                       // the tube steps up
    b.checkpoint(52, 2);
    b.rect(50, 5.6, 34, 1);
    b.plat(59, 2, 6); b.crumble(68, 2, 2.4); b.plat(73, 2, 11);
    b.enemy('walker', 61, 2, { range: 3 }); b.enemy('spiker', 75, 2, { range: 7, speed: 2.4 });
    b.plat(65, -2, 2.4); b.shard(66.2, -0.6);               // down in a pit
    b.meteor(78, 2, { style: 'drip', h: 3.6, P: 2 });
    b.cells(52, 3, 82, 3, 8);
    b.plat(87, 4, 10);
    b.goal(93, 4);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
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
  }),

  // 267 ── a three-storey switchback through the glacier: right along the bottom, back left above, right again on top
  L('Switchback Glacier', 'maze', (b) => {
    b.start(-6, 0, 12);
    b.ice(6, 0, 46);                                        // storey 1: slick floor, mites
    b.enemy('walker', 14, 0, { range: 10, speed: 2 }); b.enemy('walker', 30, 0, { range: 10, speed: 2.4 });
    b.cells(8, 1, 40, 1, 7);
    b.thin(46, 2.6, 3);
    b.plat(50.5, 0.01, 1.5); b.shard(51.2, 1.4);           // the far corner of the bottom storey
    b.plat(6, 5, 38);                                       // storey 2: icicles, walking back left
    b.checkpoint(40, 5);
    for (let i = 0; i < 5; i++) b.meteor(14 + i * 6, 5, { style: 'drip', h: 4.6, P: 2.4, off: i * 0.5 });
    b.cells(10, 6, 38, 6, 6);
    b.thin(7, 7.6, 3);
    b.plat(12, 10, 40);                                     // storey 3: a sentry fires down the hall
    b.rect(52, 10, 1.4, 4); b.turret(52, 10.8, -1, { P: 2.4 });
    b.enemy('spiker', 24, 10, { range: 10, speed: 2 });
    b.cells(14, 11, 50, 11, 8);
    b.shard(52.7, 15.6);                                    // on the sentry's roof
    b.plat(56, 12, 8);
    b.goal(61, 12);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
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
  }),
];
