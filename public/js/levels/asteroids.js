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
];
