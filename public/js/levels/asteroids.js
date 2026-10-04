// WORLD 6 — THE ASTEROID BELT. 30 hand-written levels.
// Gravity 0.85: single jump ≈ 2.9 high, double jump ≈ 5.2 high / ~12 far (comfortable gaps 4–8).
// The floor is the void: every rock floats. Every level has its own idea; see the comment above each one.
import { L } from './dsl.js';

export default [
  // 151 ── intro: solid rocks first, then the first gently bobbing asteroids and a crumbling chain
  L('First Drift', 'intro', (b) => {
    b.start(-6, 0, 14);
    b.plat(12, 0, 5);
    b.arc(8, 0, 12, 0, 2, 2);
    b.plat(21, 1, 5);
    b.arc(17, 0, 21, 1, 2, 2);
    b.bob(31.5, 1, { ax: 0, ay: 0.4, T: 4, w: 4 });
    b.cells(30, 2.8, 33, 2.8, 3);
    b.shard(31.5, 6);
    b.plat(37, 1, 5);
    b.bob(46.5, 1.5, { ax: 0.6, ay: 0.5, T: 3.6, w: 3.5 });
    b.arc(42, 1, 52, 2, 3, 2.4);
    b.plat(52, 2, 7);
    b.checkpoint(55, 2);
    b.crumble(63, 2, 3); b.crumble(69, 3, 3); b.crumble(75, 2, 3);
    b.cells(64.5, 3.4, 76.5, 3.4, 5);
    b.plat(70, -2.5, 2.5); b.shard(71.25, -1);          // a pocket below the crumbles
    b.plat(82, 2, 5);
    b.bob(91, 4, { ax: 0, ay: 0.6, T: 3.6 });
    b.bob(96.5, 6, { ax: 0.4, ay: 0.6, T: 4, phase: 0.4 });
    b.cells(91, 5.8, 96.5, 7.8, 3);
    b.plat(102, 4, 10);
    b.goal(108, 4);
    b.plat(-14, 4, 2.5); b.shard(-12.75, 6);
  }),

  // 152 ── one long chain of tumbling rocks: first in sync, then a rising wave, then swinging side to side
  L('Vesta Tumble', 'classic', (b) => {
    b.start(-6, 0, 12);
    for (let i = 0; i < 5; i++) b.bob(11 + i * 6, 0, { ax: 0.4, ay: 0.8, T: 4, w: 3 });
    b.cells(11, 1.8, 35, 1.8, 5);
    b.shard(23, 6.2);
    b.plat(39, 1, 5);
    for (let i = 0; i < 5; i++) b.bob(49 + i * 6, 1 + i, { ax: 0, ay: 1.2, T: 3.6, w: 3, phase: i * 0.15 });
    b.cells(49, 3, 73, 7, 5);
    b.plat(77, 5, 6);
    b.checkpoint(80, 5);
    for (let i = 0; i < 4; i++) b.bob(88 + i * 7, 5 - (i % 2), { ax: 2, ay: 0.5, T: 4.4, w: 3.5, phase: (i % 2) * 0.5 });
    b.cells(88, 6.6, 109, 6.6, 6);
    b.plat(98.5, 0.5, 2.5); b.shard(99.75, 2);         // low rock under the swingers
    b.bob(115, 6, { ax: 0, ay: 0.5, T: 3, w: 2 });
    b.plat(119, 5, 10);
    b.goal(125, 5);
    b.plat(-13, 3, 2.5); b.shard(-11.75, 5);
  }),

  // 153 ── every boulder has a moonlet; boulders sit too far apart, so ride the orbits across
  L('Moonlet Carousel', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.plat(12, 0, 6);
    b.ferris(15, 0, 5.5, { n: 1, omega: 0.7, w: 2.6 });
    b.shard(15, -4.6);                                   // only the moonlet's low pass reaches it
    b.plat(32, 0, 6);
    b.ferris(35, 0, 5.5, { n: 1, omega: -0.7, a0: Math.PI, w: 2.6 });
    b.checkpoint(35, 0);
    b.shard(35, 9.2);
    b.plat(54, 1, 6);
    b.ferris(57, 1, 6, { n: 2, omega: 0.55, w: 2.6 });
    b.plat(72, 4, 10);
    b.goal(78, 4);
    b.cells(7, 1.5, 11, 1.5, 2); b.cells(15, 6.5, 15, 6.5, 1); b.cells(35, 6.5, 35, 6.5, 1);
    b.cells(20.5, 1.5, 29.5, 1.5, 3); b.cells(57, 8, 57, 8, 1); b.cells(64, 5.5, 70, 5.5, 3);
    b.plat(-14, 4, 2); b.shard(-13, 6);
  }),

  // 154 ── meteors hammer the rocks in a rolling wave: keep pace right behind it
  L('Impact Wave', 'timing', (b) => {
    b.start(-6, 0, 12);
    for (let i = 0; i < 6; i++) {
      const top = (i % 2) * 0.8;
      b.plat(9 + i * 6.5, top, 4);
      b.meteor(11 + i * 6.5, top, { P: 3.2, off: -i * 0.45 });
      b.cell(11 + i * 6.5, top + 1.4);
    }
    b.plat(30, -3.5, 3); b.shard(31.5, -2);              // a crater ledge under the wave
    b.plat(50, 1.5, 6);
    b.checkpoint(53, 1.5);
    const steps = [[60, 3.5], [66.5, 6], [73, 8.5], [79.5, 11]];
    steps.forEach(([x, y], i) => { b.plat(x, y, 3.5); b.meteor(x + 1.75, y, { P: 2.6, off: -i * 0.5 }); });
    b.cells(61, 5, 81, 12.5, 5);
    b.shard(81.25, 15.6);
    b.crumble(86, 11, 2.5); b.crumble(91, 10, 2.5);
    b.cells(87, 12.4, 92, 11.4, 2);
    b.plat(96, 7, 10);
    b.goal(102, 7);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 155 ── a derelict mining hull: flickering hologram catwalks, then a switch opens the bulkhead
  L('Hologram Catwalk', 'puzzle', (b) => {
    b.start(-6, 0, 12);
    b.rect(8, 6, 40, 0.8);                               // hull roof (its top is a secret walkway)
    for (let i = 0; i < 6; i++) b.blink(8 + i * 4, 0, 3.5, { P: 3, on: 2, off: -i * 0.4 });
    b.cells(9, 1.2, 30, 1.2, 6);
    b.plat(37.5, -4, 2.5); b.shard(38.75, -2.5);         // a ledge tucked under the switch deck
    b.plat(32, 0, 6);
    b.checkpoint(34, 0);
    b.red(41, 1, 4); b.red(47, 2, 4);
    b.shard(20, 8.2); b.cells(30, 7.8, 44, 7.8, 4);
    b.plat(53, 2, 6); b.switch(57, 2);
    b.redWall(61, 2, 6); b.rect(53, 8, 14, 0.8);
    b.blue(62, 2, 4); b.blue(68, 3, 4);
    b.plat(74, 3, 5);
    b.blue(72, 7.5, 3); b.shard(73.5, 9.5);
    b.blink(82, 5, 3, { P: 2.6, on: 1.7 }); b.blink(87, 7, 3, { P: 2.6, on: 1.7, off: -0.5 }); b.blink(92, 5, 3, { P: 2.6, on: 1.7, off: -1 });
    b.cells(83.5, 6.4, 93.5, 6.4, 3);
    b.plat(97, 4, 10);
    b.goal(103, 4);
  }),

  // 156 ── slip through a crack into a hollow asteroid and climb its insides to the vent on top
  L('Ceres Hollow', 'ascent', (b) => {
    b.start(-6, 0, 12);
    b.bob(12, 0.5, { ax: 0, ay: 0.4, T: 4, w: 3.5 });
    // the shell
    b.rect(20, -2, 21, 2);                               // inner floor
    b.rect(20, 3, 3, 29);                                // left wall (crack below it)
    b.rect(41, -2, 3, 34);                               // right wall
    b.rect(20, 32, 10, 1.5); b.rect(34, 32, 10, 1.5);    // cap with a vent hole
    b.tower(23, 0, 18, 32);
    b.enemy('walker', 25, 0, { range: 12 });
    b.plat(33, 3.5, 6);
    b.plat(24, 7, 5);
    b.bob(33.5, 10.5, { ax: 1.2, ay: 0.5, T: 4, w: 3 });
    b.plat(36, 14, 5);
    b.checkpoint(39, 14);
    b.rect(37.6, 16, 0.8, 11);                           // inner fin: a chimney against the shell
    b.cells(39.7, 17, 39.7, 25, 4);
    b.shard(39.7, 29.5);
    b.plat(30, 27, 5);
    b.plat(23, 21, 3); b.shard(24.5, 22.6);              // a dead-end nook (falling just means a re-climb)
    b.thin(30.5, 30, 3);
    b.cells(32, 31.5, 32, 34.5, 2);
    // outside, down the far face
    b.plat(48, 30, 4); b.plat(55, 25, 4);
    b.bob(62, 21, { ax: 0.6, ay: 0.5, T: 3.6 });
    b.plat(68, 18, 10);
    b.goal(74, 18);
    b.cells(25, 1.2, 37, 1.2, 4); b.cells(49, 31.2, 63, 22.5, 4);
    b.plat(-12, -4, 3); b.shard(-10.5, -2.5);
  }),

  // 157 ── comet streams: drop onto a river of ice chunks and ride it over gaps no jump could clear
  L('Comet Express', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.stream('ring', 4, 40, -2.35, { speed: 4, spacing: 5 });
    b.cells(10, 0.3, 36, 0.3, 7);
    b.meteor(22, -1.35, { P: 3.4 });
    b.plat(40, -0.5, 5);
    b.checkpoint(42, -0.5);
    b.stream('ring', 44, 84, -2.85, { speed: 5, spacing: 6 });
    b.cells(48, -0.2, 80, -0.2, 7);
    b.plat(56, 3.6, 3); b.plat(70, 4.6, 3); b.shard(71.5, 6.6);    // islands above the stream
    b.meteor(63, -1.85, { P: 3, off: 1.5 });
    b.plat(84, -1, 5);
    // a comet nucleus: icy and slick
    b.ice(92, 1, 14);
    b.cells(93, 2.4, 104, 2.4, 5);
    b.plat(110, 3, 8);
    b.goal(115, 3);
    b.shard(99, 6.8);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 158 ── a cratered moonlet crawling with space mites; spiny ones guard the rims
  L('Mite Crater', 'enemies', (b) => {
    b.start(-6, 0, 12);
    b.plat(9, 0, 14); b.enemy('walker', 11, 0, { range: 9, speed: 2 });
    b.plat(21, -4.5, 6); b.shard(25.5, -3);             // tucked under the rock's lip
    b.plat(27, 0, 10); b.enemy('spiker', 28, 0, { range: 7, speed: 2 });
    b.thin(29, 3.8, 6); b.cells(30, 4.8, 34, 4.8, 3);
    b.crumble(38.5, 0, 1.6);
    b.plat(41, 0, 14); b.enemy('walker', 42, 0, { range: 5 }); b.enemy('walker', 48, 0, { range: 5, speed: 2.4 });
    b.checkpoint(44, 0);
    b.thin(46, 4, 6); b.enemy('walker', 46, 4, { range: 5, speed: 1.4 });
    b.bob(59, 1.5, { ax: 0.8, ay: 0.5, T: 4 });
    b.enemy('flyer', 59, 5, { ax: 1, ay: 1, T: 3 });
    b.plat(63, 1, 16); b.enemy('spiker', 64, 1, { range: 13, speed: 3 }); b.enemy('walker', 70, 1, { range: 6, speed: 2 });
    b.thin(66, 4.6, 4); b.thin(73, 6.4, 4); b.shard(75, 9);
    b.plat(83, 1, 8);
    b.goal(88, 1);
    b.cells(10, 1.2, 20, 1.2, 4); b.cells(43, 1.2, 53, 1.2, 4); b.cells(64, 2.2, 78, 2.2, 6);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 159 ── a busy intersection of drifting rocks: horizontal, vertical, a looping convoy, then a diagonal slide
  L('Pallas Crossing', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.slide(10, 0, 23, 0, { T: 6, w: 3 });
    b.slide(28, -2, 28, 8, { T: 5, w: 3 });
    b.slide(33, 8, 45, 8, { T: 6, w: 3, phase: 0.5 });
    b.cells(11, 1.2, 22, 1.2, 4); b.cells(28, 2, 28, 7, 3);
    b.plat(26.5, -6.5, 3); b.shard(28, -5);             // the vertical rock's low stop
    b.plat(49, 8, 5);
    b.checkpoint(51, 8);
    for (let i = 0; i < 3; i++) b.loop([[58, 8], [70, 8], [70, 14], [58, 14]], { speed: 3, w: 3, phase: i / 3 });
    b.cells(59, 9.4, 69, 9.4, 4);
    b.shard(64, 17.6);
    b.plat(74, 14, 4);
    b.slide(82, 13, 93, 5, { T: 5, w: 3 });
    b.cells(82, 14.4, 93, 6.4, 4);
    b.plat(97, 5, 10);
    b.goal(103, 5);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 160 ── CHASE: the Debris Cloud rolls in; run a rubble slope down, climb a rock face, sprint the crumbles
  L('Debris Cloud', 'chase', (b) => {
    b.chase({ speed: 3.9 });
    b.start(-6, 0, 14);
    b.plat(12, 0, 4); b.plat(20, 1, 4);
    b.bob(28, 1.5, { ax: 0, ay: 0.3, T: 3, w: 3.5 });
    b.plat(34, 0, 4);
    b.crumble(41, -1, 3); b.crumble(47, -2.5, 3); b.crumble(53, -4, 3);
    b.plat(50, -8.5, 3); b.shard(51.5, -7);              // greedy drop under the crumbles
    b.plat(59, -4, 6);
    b.checkpoint(62, -4);
    b.plat(68, -1, 3); b.plat(73.5, 1.5, 3); b.plat(79, 4, 3);
    b.thin(73, 7.5, 3); b.shard(74.5, 9.3);
    b.bob(86, 5, { ax: 0, ay: 0.3, T: 3, w: 3 });
    b.crumble(91, 5, 2.5); b.crumble(96, 6, 2.5); b.crumble(101, 5, 2.5);
    b.plat(106, 5, 12);
    b.goal(114, 5);
    b.arc(8, 0, 34, 0, 8, 1.5); b.cells(42, 0.4, 54, -2.6, 3); b.cells(69, 0.4, 80, 5.4, 3); b.cells(92, 6.4, 102, 6.4, 3);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),
  // 161 ── a wrecked refinery: dodge cannon bolts on the girder, then climb a zigzag shaft under alternating fire
  L('Refinery Wreck', 'gauntlet', (b) => {
    b.start(-6, 0, 12);
    b.plat(5, -4, 4); b.shard(7.5, -2.5);                // under the gap before the girder
    b.plat(10, 0, 24);
    b.rect(34, 0, 1.6, 4.5); b.turret(34.8, 0.8, -1, { P: 2.2 });
    b.thin(14, 3.4, 5); b.thin(24, 3.4, 5);
    b.enemy('walker', 16, 0, { range: 8, speed: 2 });
    b.cells(12, 1.2, 32, 1.2, 6);
    b.plat(39, 2, 6);
    b.checkpoint(42, 2);
    b.plat(48, 4, 4); b.plat(55, 7, 4); b.plat(48, 10, 4); b.plat(55, 13, 4); b.plat(48, 16, 4);
    b.rect(61, 5, 1.4, 12); b.turret(61.7, 8, -1, { P: 2.6 }); b.turret(61.7, 14, -1, { P: 2.6, off: 1.3 });
    b.shard(61.7, 18.8);
    b.cells(50, 5.4, 50, 17.4, 4); b.cells(57, 8.4, 57, 14.4, 2);
    b.plat(54, 19, 6);
    b.blink(64, 19, 3, { P: 2.8, on: 1.9 }); b.blink(69, 19, 3, { P: 2.8, on: 1.9, off: -0.6 }); b.blink(74, 18, 3, { P: 2.8, on: 1.9, off: -1.2 });
    b.cells(65.5, 20.4, 75.5, 19.4, 3);
    b.shard(70.5, 23);
    b.plat(79, 17, 10);
    b.goal(85, 17);
  }),

  // 162 ── two rubble rings turn like meshing gears around solid cores, then one huge ring lifts you out
  L('Rubble Rings', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.rect(15, 3, 6, 2);                                 // core A
    b.ferris(18, 4, 7, { n: 6, omega: 0.5 });
    b.shard(18, 13.5);
    b.rect(33, 5, 6, 1.5);                               // core B (shard rests on it)
    b.ferris(36, 6, 7, { n: 6, omega: -0.5 });
    b.shard(36, 8);
    b.plat(47, 8, 5);
    b.checkpoint(49.5, 8);
    b.ferris(62, 8, 8, { n: 4, omega: 0.45, w: 3 });
    b.plat(72, 15, 4);
    b.shard(74, 19.5);
    b.plat(81, 12, 3); b.plat(88, 9, 8);
    b.goal(93, 9);
    b.cells(7, 2, 10, 4, 2); b.cells(18, 6.5, 18, 6.5, 1); b.cells(26, 6, 28, 7, 2);
    b.cells(62, 17.5, 62, 17.5, 1); b.cells(54, 10, 54, 10, 1); b.cells(82.5, 13.4, 89, 10.4, 3);
  }),

  // 163 ── RISE: the rift wells up a crevice splitting an asteroid; climb ledges, a wedged rock and a chimney
  L('Kirkwood Fissure', 'tide', (b) => {
    b.rise({ rate: 0.7, delay: 4 });
    b.start(-6, 0, 12);
    b.rect(6, -2, 18, 2);                                // crevice floor
    b.rect(6, 3, 4, 35); b.rect(20, -2, 4, 40);          // the two halves
    b.tower(10, 0, 10, 38);
    b.plat(15, 3.5, 5);
    b.plat(10, 7, 4);
    b.bob(16, 10.5, { ax: 1, ay: 0.4, T: 4, w: 3 });
    b.plat(10, 14, 3.5);
    b.plat(17.2, 16, 2.8);
    b.checkpoint(18.6, 16);
    b.wall(16.4, 20, 9);                                 // fin: chimney against the right half
    b.cells(18.6, 19, 18.6, 27, 4);
    b.shard(16.8, 31);
    b.plat(10, 21, 2.5); b.shard(11.25, 22.6);           // a nook only reachable by dropping back
    b.plat(10, 29, 4);
    b.crumble(16, 32.5, 3);
    b.plat(10, 36, 3.5);
    b.cells(12, 30.4, 17.5, 34, 3);
    b.plat(28, 37, 4); b.plat(35, 38, 10);
    b.goal(41, 38);
    b.cells(11, 8.4, 11, 15.4, 2); b.cells(25, 39.5, 31, 39.5, 2);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 164 ── descend a rubble chute while meteors rain alongside, then crawl the low tunnel under a boulder
  L('Rubble Chute', 'descent', (b) => {
    b.start(-6, 30, 12);
    b.crumble(9, 27, 3);
    b.plat(1, 22, 3); b.shard(2.5, 23.6);                // side pocket off the chute
    b.bob(16, 24, { ax: 1, ay: 0.5, T: 4 });
    b.plat(19, 20, 6); b.enemy('spiker', 19.5, 20, { range: 4.5, speed: 1.6 });
    b.meteor(22, 20, { P: 3 });
    b.shard(22, 23.6);
    b.plat(12, 16, 5);
    b.bob(9, 12, { ax: 0, ay: 0.6, T: 3.6 });
    b.plat(13, 8, 6);
    b.checkpoint(16, 8);
    b.crumble(22, 5, 2.5); b.crumble(26, 2, 2.5);
    b.plat(30, 0, 30);
    b.rect(34, 3.4, 22, 5);                              // boulder over the tunnel
    b.enemy('walker', 38, 0, { range: 12, speed: 1.8 });
    b.spring(58, 0, 8);
    b.shard(45, 10);
    b.plat(64, 3, 10);
    b.goal(70, 3);
    b.cells(10.5, 28.4, 16, 25.6, 3); b.cells(20, 21.4, 24, 21.4, 2); b.cells(14, 17.4, 9, 13.6, 2);
    b.cells(14, 9.4, 27, 3.4, 4); b.cells(33, 1.2, 55, 1.2, 8);
  }),

  // 165 ── a rubble pile you climb by crumbling every step: no lingering, then a crumble bridge off the top
  L('Rubble Pile', 'ascent', (b) => {
    b.start(-6, 0, 12);
    b.plat(9, 1, 4);
    const steps = [[15, 4], [10, 7], [15, 10], [10, 13], [15, 16]];
    for (const [x, y] of steps) b.crumble(x, y, 2.5);
    b.bob(23, 12, { ax: 0, ay: 0.4, T: 3, w: 2 }); b.shard(23, 15);
    b.plat(8, 19, 5);
    b.checkpoint(10, 19);
    b.enemy('flyer', 16, 23, { ax: 2, ay: 1, T: 3.2 });
    b.crumble(15, 22, 2); b.crumble(19, 25, 2); b.crumble(15, 28, 2);
    b.bob(11, 31, { ax: 0.8, ay: 0.4, T: 3.6, w: 2.6 });
    b.plat(16, 34, 4);
    b.shard(18, 39);
    b.crumble(24, 34, 2); b.crumble(29, 34, 2); b.crumble(34, 33, 2); b.crumble(39, 32, 2);
    b.plat(44, 30, 10);
    b.goal(50, 30);
    b.cells(12, 5, 12, 17, 4); b.cells(16, 23.4, 16, 29.4, 2); b.cells(25, 35.4, 40, 33.4, 4);
    b.plat(-15, 2, 2); b.shard(-14, 4);
  }),

  // 166 ── climb a comet's tail: three chunk streams, each one higher and faster, icy islands between
  L("Halley's Wake", 'ride', (b) => {
    b.start(-6, 0, 12);
    b.stream('ring', 4, 30, -2.35, { speed: 4, spacing: 6 });
    b.ice(30, -0.5, 4);
    b.plat(36, 2.5, 3);
    b.stream('ring', 38, 64, 0.15, { speed: 5, spacing: 6 });
    b.bob(51, 5.5, { ax: 0.5, ay: 0.4, T: 3, w: 2 }); b.shard(51, 7.6);
    b.plat(64, 1.9, 5);
    b.checkpoint(66, 1.9);
    b.ice(71, 4, 5);
    b.stream('ring', 76, 104, 1.65, { speed: 6, spacing: 6.5 });
    b.meteor(90, 2.65, { P: 2.8 });
    b.plat(104, 3.4, 4);
    b.ice(110, 5, 12); b.enemy('walker', 112, 5, { range: 7, speed: 2 });
    b.ice(116, 9, 3); b.shard(117.5, 11);
    b.plat(124, 6, 8);
    b.goal(128, 6);
    b.cells(10, 0.3, 26, 0.3, 5); b.cells(42, 2.8, 60, 2.8, 5); b.cells(80, 4.3, 100, 4.3, 6);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 167 ── a meteor storm sprint over a rolling swell of rocks, half of them crumbling
  L('Meteor Storm', 'gauntlet', (b) => {
    b.start(-6, 0, 12);
    const rocks = [[9, 0], [16, 1.5], [23, 3], [30, 2], [37, 0.5], [44, -1], [51, 0.5], [67, 3.5], [74, 5], [81, 4], [88, 2.5], [95, 4], [102, 6]];
    rocks.forEach(([x, y], i) => {
      if (i % 2) b.crumble(x, y, 3.5); else b.plat(x, y, 3.5);
      b.meteor(x + 1.75, y, { P: 2.2, off: -((i * 0.37) % 2.2) });
      b.cell(x + 1.75, y + 1.4);
    });
    b.meteor(60, 2, { P: 2.4, off: 1 });
    b.plat(57, 2, 6);
    b.checkpoint(60, 2);
    b.heart(60, 4);
    b.plat(43.5, -5, 3); b.shard(45, -3.5);
    b.thin(73.5, 9.5, 3); b.shard(75, 11.2);
    b.shard(34.5, 7.5);
    b.plat(108, 5, 10);
    b.goal(114, 5);
  }),
  // 168 ── hollow pebbles: a cramped low road through rock huts, or a high road over their roofs past the drones
  L('Drone Picket', 'enemies', (b) => {
    b.start(-6, 0, 12);
    const huts = [9, 17, 25, 33];
    for (const x of huts) { b.plat(x, 0, 5); b.rect(x, 3, 5, 1.2); b.cell(x + 2.5, 1.2); }
    b.enemy('flyer', 16, 6.5, { ax: 2, ay: 1, T: 3 });
    b.enemy('flyer', 32, 6.5, { ax: 2, ay: 1, T: 2.6 });
    b.cells(11, 5.6, 35, 5.6, 5);
    b.shard(23.5, 9.5);
    b.plat(42, 1, 6);
    b.checkpoint(45, 1);
    // part two: huts stacked into a staircase, drones in the gaps
    const stack = [[52, 3], [59, 6], [66, 9], [73, 6], [80, 3]];
    for (const [x, y] of stack) { b.plat(x, y, 4.5); b.rect(x, y + 3, 4.5, 1); }
    b.enemy('flyer', 64, 10.5, { ax: 1, ay: 2, T: 2.4 });
    b.enemy('flyer', 78, 10, { ax: 1.5, ay: 1.5, T: 2.8 });
    b.enemy('walker', 66, 9, { range: 3, speed: 1.2 });
    b.shard(68.25, 10.4);                                 // inside the summit hut, past its mite
    b.cells(54, 4.2, 82, 4.2, 5);
    b.plat(88, 2, 10);
    b.goal(94, 2);
    b.plat(-12, -4.5, 3); b.shard(-10.5, -3);
  }),

  // 169 ── a tower of pendulum pebbles swinging side to side; climb by catching each at the right end
  L('Pendulum Pebbles', 'ascent', (b) => {
    b.start(-6, 0, 12);
    b.tower(6, -2, 18, 38);
    b.bob(12, 3, { ax: 2.5, ay: 0.3, T: 4, w: 3 });
    b.bob(17, 6.5, { ax: 2.5, ay: 0.3, T: 4, w: 3, phase: 0.5 });
    b.bob(12, 10, { ax: 2.5, ay: 0.3, T: 4, w: 3 });
    b.plat(4, 13, 2.5); b.shard(5.25, 14.6);
    b.bob(17, 13.5, { ax: 2.5, ay: 0.3, T: 4, w: 3, phase: 0.5 });
    b.plat(23.5, 12.5, 2); b.shard(24.5, 14.2);
    b.plat(9, 17, 4);
    b.checkpoint(11, 17);
    b.enemy('flyer', 16, 22, { ax: 3, ay: 0.6, T: 3 });
    b.bob(15, 20.5, { ax: 2.5, ay: 0.3, T: 3.6, w: 2.6 });
    b.bob(20, 24, { ax: 3, ay: 0.3, T: 3.6, w: 2.6, phase: 0.5 });
    b.bob(14, 27.5, { ax: 3, ay: 0.3, T: 3.6, w: 2.6 });
    b.bob(19, 31, { ax: 3, ay: 0.3, T: 3.6, w: 2.6, phase: 0.5 });
    b.plat(12, 34.5, 5);
    b.cells(12, 4.5, 17, 8, 2); b.cells(12, 11.5, 17, 15, 2); b.cells(15, 22, 20, 25.5, 2); b.cells(14, 29, 19, 32.5, 2);
    b.shard(14.5, 38.8);
    b.plat(24, 32, 3); b.plat(31, 29, 10);
    b.goal(37, 29);
  }),

  // 170 ── CHASE: the Debris Cloud again: a spring vault, a crumbling descent and a low-tunnel sprint
  L('Kirkwood Run', 'chase', (b) => {
    b.chase({ speed: 4.3 });
    b.start(-6, 0, 14);
    b.plat(12, 0, 5); b.plat(21, 2, 4);
    b.plat(29, 4, 4); b.spring(31.2, 4, 7);
    b.shard(33, 14.4);
    b.plat(36, 11, 5);
    b.crumble(44, 8, 2.5); b.crumble(49, 5, 2.5); b.crumble(54, 2, 2.5);
    b.plat(47, -1, 3); b.shard(48.5, 0.6);              // under the crumbling descent
    b.plat(58, 0, 8);
    b.checkpoint(61, 0);
    b.plat(69, 0, 16); b.rect(69, 3, 16, 6);            // low tunnel through a boulder
    b.enemy('walker', 74, 0, { range: 6, speed: 1.6 });
    b.bob(89, 1, { ax: 0, ay: 0.3, T: 3 });
    b.plat(94, 2, 3); b.crumble(99, 3, 2.5); b.crumble(104, 4, 2.5);
    b.plat(109, 4, 10);
    b.goal(115, 4);
    b.arc(17, 0, 29, 4, 4, 1.8); b.cells(37, 12.4, 55, 3.4, 5); b.cells(70, 1.2, 84, 1.2, 5); b.cells(95, 3.4, 106, 5.4, 3);
    b.plat(-15, 3, 3); b.shard(-13.5, 5);
  }),
  // 171 ── rock jaws: three chimneys of rising height; slip under each jaw, wall-jump up, drop to the next
  L('Rock Jaws', 'ascent', (b) => {
    b.start(-6, 0, 12);
    b.plat(9, 0, 9.8);
    b.rect(13, 2.4, 1.5, 8); b.rect(17.3, 0, 1.5, 10.4);
    b.enemy('spiker', 9, 0, { range: 3.2, speed: 1.4 });
    b.shard(11, 1.4);                                    // under the first jaw, past its spiker
    b.cells(15.9, 2, 15.9, 9, 3);
    b.plat(23, 6, 4);
    b.plat(30, 4, 8.8);
    b.rect(33, 6.4, 1.5, 11); b.rect(37.3, 4, 1.5, 13.4);
    b.enemy('walker', 30, 4, { range: 2.4, speed: 1.2 });
    b.cells(35.9, 6, 35.9, 15, 4);
    b.plat(43, 14, 5);
    b.checkpoint(45, 14);
    b.plat(51, 12, 8.8);
    b.rect(54, 14.4, 1.5, 13); b.rect(58.3, 12, 1.5, 15.4);
    b.meteor(52.5, 12, { P: 3.4 });
    b.cells(56.9, 14, 56.9, 25, 4);
    b.shard(56.9, 32);
    b.plat(64, 24, 3);
    b.bob(70, 21, { ax: 0.6, ay: 0.5, T: 3.6 });
    b.plat(75, 18, 10);
    b.goal(81, 18);
    b.cells(19, 11.6, 24, 7.4, 2); b.cells(39, 18.6, 44, 15.4, 2); b.cells(60, 28.6, 70, 22.8, 3);
    b.thin(-13, 2.5, 3); b.shard(-11.5, 4.3);
  }),

  // 172 ── a mining station's ore belts: fight the reverse belt past a cannon, ride the switchbacks up
  L('Ore Conveyor', 'gauntlet', (b) => {
    b.start(-6, 0, 12);
    b.conveyor(9, 0, 16, -3);
    b.rect(26, 0, 1.4, 3.5); b.turret(26.7, 0.8, -1, { P: 2.4 });
    b.shard(26.7, 7);
    b.cells(11, 1.2, 23, 1.2, 4);
    b.conveyor(30, 2, 14, 4);
    b.enemy('walker', 32, 2, { range: 9, speed: 2 });
    b.thin(36, 6, 3); b.shard(37.5, 7.8);
    b.cells(31, 3.2, 43, 3.2, 4);
    b.plat(48, 2, 5);
    b.checkpoint(50, 2);
    b.conveyor(56, 5, 10, 3);
    b.plat(69, 8, 4);
    b.conveyor(58, 11, 10, -3);
    b.plat(52, 14, 4);
    b.conveyor(60, 17, 16, 5);
    b.rect(80, 20.5, 1.4, 3); b.turret(80.7, 18, -1, { P: 2.2 });
    b.shard(68, 21.5);
    b.cells(57, 6.2, 65, 6.2, 3); b.cells(59, 12.2, 67, 12.2, 3); b.cells(62, 18.2, 75, 18.2, 4);
    b.plat(80, 15, 10);
    b.goal(86, 15);
  }),

  // 173 ── orbital transfers: rocks race around overlapping elliptical orbits; hop orbit to orbit
  L('Hohmann Transfer', 'ride', (b) => {
    b.start(-6, 0, 12);
    const orbit = (cx, cy, rx, ry, dir) => {
      const pts = [];
      for (let k = 0; k < 8; k++) { const a = dir * k * Math.PI / 4; pts.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]); }
      return pts;
    };
    const A = orbit(18, 4, 8, 4, 1), B = orbit(36, 6, 8, 5, -1), C = orbit(62, 9, 9, 4, 1);
    b.loop(A, { speed: 3.5, w: 2.6 }); b.loop(A, { speed: 3.5, w: 2.6, phase: 0.5 });
    b.loop(B, { speed: 3.5, w: 2.6 }); b.loop(B, { speed: 3.5, w: 2.6, phase: 0.5 });
    b.plat(35, 6, 2); b.shard(36, 7.5);                 // the barycentre rock of orbit B
    b.plat(46, 8, 5);
    b.checkpoint(48.5, 8);
    b.loop(C, { speed: 4, w: 2.6 }); b.loop(C, { speed: 4, w: 2.6, phase: 1 / 3 }); b.loop(C, { speed: 4, w: 2.6, phase: 2 / 3 });
    b.shard(62, 16.5);
    b.plat(74, 10, 8);
    b.goal(79, 10);
    b.cells(10, 5.5, 26, 5.5, 3); b.cells(28, 7.5, 44, 7.5, 3); b.cells(53, 10.5, 71, 10.5, 4);
    b.plat(-13, -3, 2.5); b.shard(-11.75, -1.5);
  }),

  // 174 ── binary asteroids: pairs of rocks whirling round each other; time each leap to a partner
  L('Binary Pairs', 'timing', (b) => {
    b.start(-6, 0, 12);
    const pairs = [[14, 1, 2.5, 0.9], [26, 2, 2.8, -0.8], [38, 3, 2.5, 1]];
    for (const [x, y, r, w] of pairs) b.ferris(x, y, r, { n: 2, omega: w, w: 2.4 });
    b.shard(38, 4.4);
    b.meteor(26, 4.8, { P: 3.6 });
    b.plat(45, 3, 5);
    b.checkpoint(47.5, 3);
    const pairs2 = [[56, 4, 3, -1.1], [67, 6, 2.5, 1.2], [78, 5, 3, -1]];
    for (const [x, y, r, w] of pairs2) b.ferris(x, y, r, { n: 2, omega: w, w: 2.4 });
    b.enemy('flyer', 61.5, 9, { ax: 1, ay: 1.5, T: 2.6 });
    b.shard(67, 11.6);
    b.plat(85, 5, 10);
    b.goal(91, 5);
    b.cells(8, 2, 10, 2.5, 2); b.cells(19, 3.6, 21, 3.6, 2); b.cells(31, 5, 33, 5, 2); b.cells(50.5, 4.6, 52, 5, 2); b.cells(72, 7.6, 74, 7.6, 2);
    b.plat(-14, -1, 2.5); b.shard(-12.75, 0.6);
  }),

  // 175 ── mining launch pads fling you from rock to rock; ceilings cap the arcs, crumbles catch the falls
  L('Launch Rail', 'bounce', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 4); b.spring(10, 0, 9);
    b.plat(13, 3, 3); b.shard(14.5, 4.6);               // a ledge under the first landing
    b.plat(14, 9, 5); b.spring(17.2, 9, 8);
    b.plat(24, 14, 4); b.rect(22, 19.5, 10, 1);
    b.shard(27, 22.2);
    b.plat(32, 10, 5); b.spring(35.2, 10, 10);
    b.plat(40, 21, 5);
    b.checkpoint(42.5, 21);
    b.crumble(50, 17, 2.5); b.crumble(55, 13, 2.5);
    b.plat(60, 9, 4); b.spring(62, 9, 4); b.rect(58, 17, 10, 1);
    b.plat(68, 12, 4); b.spring(70, 12, 12);
    b.shard(72, 28.5);
    b.plat(76, 24, 10);
    b.goal(82, 24);
    b.cells(10.9, 3, 10.9, 8, 3); b.cells(18.4, 12, 18.4, 15, 2); b.cells(35.9, 13, 35.9, 20, 3); b.cells(51, 18.4, 56, 14.4, 2); b.cells(70.9, 15, 70.9, 22, 3);
  }),

  // 176 ── inside a metal asteroid: a two-storey tunnel maze; the switch at the far end opens the way out
  L('Psyche Core', 'maze', (b) => {
    b.start(-6, 0, 12);
    b.rect(10, -3, 60, 3);                               // lower tunnel floor
    b.rect(10, 3.2, 26, 3.8); b.rect(40, 3.2, 20, 3.8);  // between the storeys (a shaft at 36–40)
    b.rect(10, 10.2, 50, 4);                             // roof
    b.rect(10, 7, 0.8, 3.2); b.turret(10.8, 7.8, 1, { P: 2.6 });
    b.enemy('walker', 14, 0, { range: 18, speed: 2 });
    b.thin(36, 3.6, 4);
    b.switch(13, 7);
    b.redWall(56, 7, 3.2);
    b.checkpoint(44, 7);
    b.enemy('walker', 42, 7, { range: 12, speed: 1.6 });
    b.enemy('spiker', 44, 0, { range: 18, speed: 2.4 });
    b.shard(66, 1.4);                                    // the lower tunnel's dead end
    b.plat(63, 8, 4);
    b.thin(61, 11.8, 2);
    b.shard(30, 15.8);                                   // on the asteroid's back
    b.plat(70, 6, 10);
    b.goal(76, 6);
    b.cells(12, 1.2, 34, 1.2, 6); b.cells(38, 2, 38, 8, 3); b.cells(15, 8.2, 34, 8.2, 5); b.cells(42, 8.2, 58, 8.2, 4);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 177 ── a switch ladder: every button swaps which ledges exist, so you climb by flipping the world
  L('Switchback Vault', 'puzzle', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 6);
    b.red(15, 3.5, 4); b.switch(16.5, 3.5);
    b.blue(9, 7, 4); b.switch(10.5, 7);
    b.red(21, 7, 2.5); b.shard(22.25, 8.6);
    b.red(15, 10.5, 4); b.switch(17, 10.5);
    b.blue(9, 14, 4); b.switch(10.5, 14);
    b.red(15, 17.5, 4);
    b.plat(8, 21, 6);
    b.checkpoint(10, 21);
    b.shard(11, 25.6);
    b.red(18, 21, 3);
    b.plat(24.5, 22, 3); b.switch(25.5, 22);
    b.blue(27, 18, 3); b.shard(28.5, 19.6);
    b.blue(31, 22, 3); b.blue(36, 23, 3);
    b.plat(42, 23, 4);
    b.blink(49, 21, 3, { P: 3, on: 2 }); b.blink(54, 19, 3, { P: 3, on: 2, off: -0.6 }); b.blink(59, 17, 3, { P: 3, on: 2, off: -1.2 });
    b.plat(64, 15, 10);
    b.goal(70, 15);
    b.cells(17, 5.2, 17, 5.2, 1); b.cells(11, 8.6, 11, 8.6, 1); b.cells(17, 12.2, 17, 12.2, 1); b.cells(11, 15.6, 11, 15.6, 1); b.cells(17, 19, 17, 19, 1);
    b.cells(19.5, 22.4, 38, 24.4, 5); b.cells(50.5, 22.4, 60.5, 18.4, 3);
  }),

  // 178 ── the ore crusher: pistons hammer the deck, exhaust jets puff through the gaps
  L('Ore Crusher', 'timing', (b) => {
    b.start(-6, 0, 12);
    b.plat(9, 0, 30);
    [14, 21, 28, 35].forEach((x, i) => b.beam('piston', x, 0, { P: 2.4, on: 0.8, off: i * 0.6 }));
    b.thin(23, 4.6, 3); b.shard(24.5, 6.4);              // a perch between two pistons
    b.cells(11, 1.2, 37, 1.2, 8);
    b.plat(38, -2.5, 2.5); b.shard(39.25, -1);
    b.blink(43, 2, 3, { P: 3, on: 2 });
    b.beam('exhaust', 48.5, -4, { P: 2.6, on: 0.9 });
    b.plat(52, 3, 24);
    b.checkpoint(54, 3);
    [58, 64, 70].forEach((x, i) => b.beam('piston', x, 3, { P: 2, on: 0.7, off: (i % 2) * 1 }));
    b.enemy('walker', 60, 3, { range: 12, speed: 2 });
    b.cells(55, 4.2, 74, 4.2, 6);
    b.crumble(80, 4, 2.5); b.beam('exhaust', 84.5, -2, { P: 2.4, on: 0.8 });
    b.crumble(87, 5, 2.5); b.beam('exhaust', 91.5, -1, { P: 2.4, on: 0.8, off: 1.2 });
    b.crumble(94, 6, 2.5);
    b.cells(81, 5.4, 95, 7.4, 3);
    b.plat(99, 6, 10);
    b.goal(105, 6);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 179 ── the chaos belt: fast tiny tumblers, whirling rubble, meteors and drones with nowhere to rest
  L('Chaos Belt', 'precision', (b) => {
    b.start(-6, 0, 12);
    b.bob(11, 0, { w: 2, ax: 1.5, ay: 0.8, T: 2.6 });
    b.bob(17, 1.5, { w: 2, ax: 1, ay: 1, T: 2.2, phase: 0.3 });
    b.shard(17, 6.6);
    b.crumble(22, 2, 2);
    b.bob(27.5, 3, { w: 2, ax: 1.5, ay: 0.6, T: 2.4 });
    b.meteor(27.5, 3, { P: 2.8 });
    b.ferris(37, 4, 4, { n: 3, omega: 1.1, w: 2.2 });
    b.shard(37, 4.4);
    b.crumble(44, 4, 2);
    b.plat(48, 4, 4);
    b.checkpoint(50, 4);
    b.slide(56, 4, 64, 8, { T: 2.4, w: 2.2 });
    b.bob(68, 9, { w: 2, ax: 2, ay: 0.5, T: 2.4 });
    b.crumble(73, 10, 1.8);
    b.ferris(80, 8, 3.5, { n: 2, omega: -1.2, w: 2.2 });
    b.shard(80, 12.8);
    b.bob(87, 7, { w: 2, ax: 0, ay: 1.2, T: 2 });
    b.enemy('flyer', 89.5, 10, { ax: 1, ay: 1.2, T: 2.2 });
    b.crumble(92, 6, 1.8);
    b.blink(96, 6, 2.4, { P: 2, on: 1.2 });
    b.meteor(97.2, 6, { P: 2.6, off: 1 });
    b.plat(100, 6, 8);
    b.goal(105, 6);
    b.cells(11, 1.8, 27.5, 4.6, 4); b.cells(44, 5.4, 49, 5.4, 2); b.cells(57, 5.4, 68, 10.4, 3); b.cells(84, 9, 96, 7.4, 3);
  }),

  // 180 ── FINALE: tumbling chain, a moonlet ride, a chimney, a comet stream, then the Debris Cloud chase
  L('Heart of the Belt', 'finale', (b) => {
    b.start(-6, 0, 12);
    b.bob(11, 0, { ax: 0.4, ay: 0.8, T: 4 });
    b.bob(17, 1, { ax: 0.4, ay: 0.8, T: 4, phase: 0.3 });
    b.bob(23, 2, { ax: 0.4, ay: 0.8, T: 4, phase: 0.6 });
    b.plat(28, 2, 5);
    b.ferris(30.5, 2, 5, { n: 1, omega: 0.8, w: 2.6 });
    b.shard(30.5, -2.4);
    b.plat(46, 4, 14);
    b.rect(54, 6.4, 1.2, 9.6); b.rect(58, 4, 1.2, 12);  // the chimney
    b.enemy('walker', 47, 4, { range: 5, speed: 1.6 });
    b.shard(56.6, 19);
    b.stream('ring', 60, 86, 13.65, { speed: 5, spacing: 6 });
    b.plat(86, 15.5, 5);
    b.checkpoint(88, 15.5);
    b.chase({ speed: 4.4, trigger: 90, behind: 16 });
    b.crumble(95, 14, 2.5); b.crumble(100, 12, 2.5);
    b.plat(105, 10, 3); b.meteor(106.5, 10, { P: 2.4 });
    b.bob(111, 10, { ax: 0, ay: 0.3, T: 3 });
    b.crumble(116, 11, 2.5); b.crumble(121, 12, 2.5);
    b.plat(126, 12, 4); b.spring(128, 12, 6);
    b.plat(133, 17, 3);
    b.shard(134.5, 21);
    b.crumble(139, 15, 2.5);
    b.plat(144, 14, 12);
    b.goal(152, 14);
    b.cells(11, 1.8, 23, 3.8, 3); b.cells(36, 4, 44, 5.4, 3); b.cells(56.6, 6, 56.6, 14, 3); b.cells(64, 16.2, 82, 16.2, 5);
    b.cells(96, 15.4, 106, 11.4, 3); b.cells(112, 11.8, 122, 13.4, 3); b.cells(140, 16.4, 146, 15.4, 2);
  }),
];
