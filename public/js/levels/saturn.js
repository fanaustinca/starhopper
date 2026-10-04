// WORLD 8 — SATURN. 30 hand-written levels.
// Levels 1–15: THE RINGS — racing ice-chunk streams, shepherd moons, sparkles, the Cassini Division.
// Levels 16–30: THE GAS SURFACE — slick ice, updraft columns, lightning, the polar hexagon.
// Ring chunks: b.stream('ring', x0, x1, laneY) → deck at laneY + 1. Board from a slab ~1.35 above
// the deck, hop off onto a slab ~0.8 above it just past x1. Jumping off a chunk does NOT keep its speed.
import { L } from './dsl.js';

export default [
  // 1 ── intro: walk, jump, then let two slow ring streams ferry you over the gaps
  L('Ring Rider', 'intro', (b) => {
    b.start(-6, 0, 12);
    b.arc(6, 0, 10, 0, 2, 1.6);
    b.plat(10, 0, 6);
    b.plat(20, 1, 5);
    b.arc(16, 0, 20, 1, 2, 1.6);
    // first stream: drop off the slab onto a passing ice chunk
    b.stream('ring', 23, 45, -1.35, { speed: 5, spacing: 5 });
    b.cells(27, 0.6, 42, 0.6, 6);
    b.shard(34, 3.2);
    b.plat(45.5, 0.45, 7);
    b.checkpoint(49, 0.45);
    // a short slick shelf: momentum carries you off the end
    b.ice(56, 1.2, 8);
    b.cells(57, 2.4, 63, 2.4, 4);
    b.plat(68, 3, 5);
    // second stream: faster, with a ledge to hop up to
    b.stream('ring', 72, 100, 0.65, { speed: 6, spacing: 4.5 });
    b.thin(82, 5.4, 4); b.shard(84, 7);
    b.cells(76, 2.6, 98, 2.6, 7);
    b.plat(100.5, 2.45, 10);
    b.goal(106, 2.45);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 2 ── an escalator of four rising ring lanes: hop up lane to lane while they carry you
  L('Ice Chip Escalator', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.stream('ring', 3, 30, -2.35, { speed: 5, spacing: 5 });     // passes under the start
    b.stream('ring', 18, 46, 1.4, { speed: 5.5, spacing: 5 });
    b.stream('ring', 34, 62, 5.2, { speed: 6, spacing: 5 });
    b.stream('ring', 50, 78, 9.0, { speed: 6.5, spacing: 5 });
    b.cells(10, 0, 26, 0, 4); b.cells(28, 3.8, 42, 3.8, 4); b.cells(44, 7.6, 58, 7.6, 4); b.cells(60, 11.4, 74, 11.4, 4);
    b.shard(70, 14.6);
    b.plat(78.5, 10.8, 9);
    b.checkpoint(82, 10.8);
    // back down a crumbling ice cascade
    b.crumble(91, 8.6, 2.4); b.crumble(96, 6.2, 2.4); b.crumble(101, 3.8, 2.4);
    b.arc(88, 10.8, 103, 3.8, 5, 1.4);
    b.thin(95, 1, 3); b.shard(96.5, 2.4);            // tucked under the cascade
    b.plat(107, 2, 10);
    b.goal(113, 2);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 3 ── a double helix of sparkle platforms climbs around an ice spire to a high ring lane
  L('Sparkle Spire', 'ascent', (b) => {
    b.start(-6, 0, 12);
    b.tower(7, -2, 14, 30);
    b.rect(12.6, 3, 2.8, 17);                       // the spire itself
    // left helix strand and right helix strand blink in opposite phase
    for (let i = 0; i < 4; i++) b.blink(8, 2.8 + i * 5, 3, { P: 3.2, on: 2, off: -i * 0.4 });
    for (let i = 0; i < 4; i++) b.blink(17, 5.3 + i * 5, 3, { P: 3.2, on: 2, off: -i * 0.4 - 1.6 });
    b.checkpoint(14, 21);
    b.plat(12.6, 21, 2.8);                          // rest on the spire's cap
    b.cells(9.5, 4.5, 9.5, 19.5, 4); b.cells(18.5, 7, 18.5, 22, 4);
    b.shard(4.5, 18.5); b.blink(3.5, 16.5, 2, { P: 3.2, on: 1.4, off: 0.6 });   // a lone sparkle off to the side
    // up and away on a ring lane
    b.plat(18, 25.5, 5);
    b.stream('ring', 21, 54, 23.15, { speed: 6.5, spacing: 4.5 });
    b.cells(25, 25, 50, 25, 7);
    b.thin(36, 28.2, 4); b.shard(38, 29.8);
    b.plat(54.5, 24.9, 4);
    b.crumble(61, 21, 2.4); b.crumble(66, 17, 2.4); b.crumble(71, 13, 2.4);
    b.plat(76, 10, 10);
    b.goal(82, 10);
    b.cells(62, 22.5, 72, 14.5, 4);
    b.plat(7, -3.2, 4); b.shard(9, -1.4);           // under the first sparkle
  }),

  // 4 ── Prometheus and Pandora: two moonlets on big oval orbits; ride one, leap to the other
  L('Shepherd Moons', 'ride', (b) => {
    b.start(-6, 0, 12);
    const oval = (cx, cy, rx, ry, rev) => {
      const pts = [];
      for (let i = 0; i < 12; i++) { const a = (rev ? -1 : 1) * i * Math.PI / 6 + Math.PI; pts.push([cx + Math.cos(a) * rx, cy - Math.sin(a) * ry]); }
      return pts;
    };
    b.loop(oval(20, 5, 12, 5, false), { speed: 4, w: 3 });     // Prometheus (left → down → right → up)
    b.loop(oval(46, 7, 12, 5, true), { speed: 4, w: 3 });      // Pandora (the opposite way)
    b.cells(10, 7, 30, 7, 5);
    b.plat(17, 4.5, 5); b.shard(19.5, 6.5);                    // the hub inside Prometheus' orbit
    b.cells(36, 9, 56, 9, 5);
    b.plat(59, 7.5, 7);
    b.checkpoint(62, 7.5);
    // Daphnis: a tall, thin orbit up to the high islands
    const tall = []; for (let i = 0; i < 12; i++) { const a = -i * Math.PI / 6 - Math.PI / 2; tall.push([74 + Math.cos(a) * 4.5, 14 + Math.sin(a) * 8]); }
    b.loop(tall, { speed: 3.6, w: 3 });
    b.plat(81, 20, 4); b.shard(83, 24);
    b.crumble(88, 17, 2.4); b.crumble(93, 14, 2.4);
    b.plat(98, 11, 10);
    b.goal(104, 11);
    b.cells(82, 21.5, 95, 15.5, 4);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 5 ── the Cassini Division: a vast dark gap between ring A and ring B, crossed on scraps
  L('Cassini Division', 'precision', (b) => {
    b.start(-6, 0, 12);
    // ring A
    b.stream('ring', 3, 30, -2.35, { speed: 6, spacing: 4 });
    b.cells(9, -0.6, 27, -0.6, 5);
    b.plat(30.5, -0.55, 6);
    b.checkpoint(33, -0.55);
    // the Division: crumbling motes, a sparkle wave and one shepherd moonlet sweeping the middle
    b.crumble(41, 0.5, 2); b.crumble(46, 1.5, 2);
    b.blink(51, 2, 2.4, { P: 3, on: 1.8 }); b.blink(56, 2.5, 2.4, { P: 3, on: 1.8, off: -0.5 });
    b.loop([[61, 3], [72, 3]], { speed: 3.4, loop: false, w: 2.8 });
    b.blink(77, 3, 2.4, { P: 3, on: 1.8, off: -1 }); b.crumble(82, 3.5, 2);
    b.cells(42, 2, 84, 5, 10);
    b.thin(64, 7.2, 5); b.shard(66.5, 8.8);
    // ring B: dense and fast
    b.plat(87, 4.5, 4);
    b.stream('ring', 89, 120, 2.15, { speed: 8, spacing: 3.6 });
    b.cells(93, 4.2, 116, 4.2, 6);
    b.shard(106, 7.4);
    b.plat(120.5, 3.95, 10);
    b.goal(126, 3.95);
    b.plat(38, -3.5, 2.4); b.shard(39.2, -1.6);        // a mote hiding below the Division's lip
  }),
  // 6 ── one giant ice wheel is the elevator: ride it up, step off at the top, raid its hub
  L('Encke Wheel', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 5);
    b.cells(9, 1.5, 12, 1.5, 3);
    b.ferris(21, 10, 9, { n: 8, omega: 0.45, w: 2.6 });      // counter-clockwise: the right side climbs
    b.plat(19.5, 10, 3); b.shard(21, 12);                    // the hub: drop in from the top of the wheel
    b.cells(30, 6, 30, 16, 4);
    b.plat(32, 18, 5);
    b.checkpoint(34.5, 18);
    b.shard(21, 23.5);                                       // only from a pad at the very top
    // a smaller wheel turning the other way carries you down and across
    b.ferris(46, 13, 5.5, { n: 4, omega: -0.7, w: 2.6 });
    b.enemy('flyer', 46, 13, { ax: 1.2, ay: 1.2, T: 2.6 });
    b.plat(54.5, 9, 4);
    b.ferris(66, 7, 4.5, { n: 3, omega: 0.9, w: 2.6 });
    b.cells(56, 11, 64, 13, 3);
    b.plat(73, 6, 3); b.thin(73, 11, 3); b.shard(74.5, 12.6);
    b.plat(80, 3, 10);
    b.goal(86, 3);
    b.arc(37, 18, 54.5, 9, 5, 2);
  }),

  // 7 ── a vertical crossing: five ring lanes race in alternating directions; climb straight up through them
  L('Keeler Crossing', 'timing', (b) => {
    b.start(-6, 0, 12);
    b.plat(10, 0, 8);
    const lanes = [[3, 5], [6.6, -5.5], [10.2, 6], [13.8, -6.5], [17.4, 7]];
    lanes.forEach(([deck, v], i) => {
      b.stream('ring', 4, 28, deck - 1, { speed: v, spacing: 5 + (i % 2) * 0.4 });
      b.cell(16 + (i % 2 ? -3 : 3), deck + 1.2);
    });
    b.plat(-3.5, 10.2, 4); b.shard(-1.5, 12);                   // a ledge off the left end of the lanes
    b.plat(30, 13.8, 3); b.shard(31.5, 15.6);               // and one off the right end
    b.plat(12, 21, 8);
    b.checkpoint(16, 21);
    // over the top and down the far side
    b.thin(23, 24.5, 4); b.shard(25, 26.2);
    b.crumble(27, 18, 2.4); b.crumble(33, 15, 2.4); b.crumble(39, 12, 2.4);
    b.plat(45, 9, 10);
    b.goal(51, 9);
    b.cells(28, 19.5, 40, 13.5, 4);
  }),

  // 8 ── descend a deep ice well on crumbling ledges past drifting sentries, then ride out the bottom
  L('Crumble Well', 'descent', (b) => {
    b.start(-6, 36, 12);
    b.rect(8, 6, 1.2, 28); b.rect(23.8, 9, 1.2, 31);          // the well walls: hop the low left rim
    b.tower(9.2, 5, 14.6, 40);
    const ledges = [[9.2, 32], [20.8, 28.5], [9.2, 25], [20.8, 21.5], [9.2, 18], [20.8, 14.5], [9.2, 11]];
    for (const [x, y] of ledges) b.crumble(x, y, 3);
    b.enemy('flyer', 16.5, 26.5, { ax: 3, ay: 0.5, T: 3 });
    b.enemy('flyer', 16.5, 16, { ax: 3, ay: 0.5, T: 2.6 });
    b.cells(16.5, 34, 16.5, 10, 7);
    b.thin(14.5, 23, 4); b.shard(16.5, 24.6);                 // a safe sill in the middle of the shaft
    b.plat(9.2, 6, 14.6);
    b.checkpoint(14, 6);
    // the bottom of the well opens onto a ring lane
    b.stream('ring', 22, 56, 3.65, { speed: 7, spacing: 4 });
    b.cells(27, 6.4, 52, 6.4, 6);
    b.thin(38, 8.8, 4); b.shard(40, 10.4);
    b.plat(56.5, 5.45, 4);
    b.plat(63, 7, 3); b.plat(69, 9, 8);
    b.goal(74, 9);
    b.plat(-14, 38, 3); b.shard(-12.5, 40);
  }),

  // 9 ── the braided F ring: three lanes at three speeds, ice gates force you to weave between them
  L('F-Ring Braid', 'ride', (b) => {
    b.start(-6, 0, 12);
    const gate = (x, deck) => b.rect(x, deck + 0.2, 0.8, 2.2);   // frozen pillars hanging low over one lane
    // first braid: decks -1.35 / 2.25 / 5.85
    b.stream('ring', 3, 46, -2.35, { speed: 5, spacing: 6 });
    b.stream('ring', 3, 46, 1.25, { speed: 6.5, spacing: 6.5 });
    b.stream('ring', 3, 46, 4.85, { speed: 8, spacing: 7 });
    gate(20, -1.35); gate(30, 2.25); gate(38, -1.35); gate(38, 5.85);
    b.cells(10, 0, 18, 0, 3); b.cells(23, 3.6, 28, 3.6, 2); b.cells(32, 7.2, 37, 7.2, 2); b.cells(40, 3.6, 44, 3.6, 2);
    b.shard(34, -0.2);                                       // low lane, between two gates
    b.plat(46.5, 6.65, 6);
    b.checkpoint(49.5, 6.65);
    // second braid, a step higher: decks 0.65 / 4.25 / 7.85
    b.stream('ring', 55, 96, -0.35, { speed: 5.5, spacing: 6 });
    b.stream('ring', 55, 96, 3.25, { speed: 7, spacing: 6.5 });
    b.stream('ring', 55, 96, 6.85, { speed: 8.5, spacing: 7 });
    gate(62, 7.85); gate(70, 4.25); gate(70, 0.65); gate(80, 7.85); gate(86, 4.25); gate(86, 0.65);
    b.cells(56, 5.6, 60, 5.6, 2); b.cells(64, 9.2, 68, 9.2, 2); b.cells(72, 5.6, 78, 5.6, 2); b.cells(82, 2, 84, 2, 2); b.cells(88, 9.2, 94, 9.2, 3);
    b.thin(73, 12.1, 4); b.shard(75, 13.8);
    b.plat(96.5, 8.65, 10);
    b.goal(102, 8.65);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 10 ── CHASE: the Ring Shear tears through the rings. Fast lanes are your only way to outrun it
  L('Ring Shear', 'chase', (b) => {
    b.chase({ speed: 4.4 });
    b.start(-6, 0, 14);
    b.plat(12, 1, 5); b.plat(21, 2, 4);
    b.stream('ring', 24, 52, -0.35, { speed: 8, spacing: 3.4 });
    b.cells(28, 2.3, 48, 2.3, 5);
    b.crumble(53, 1.5, 2.4); b.crumble(58, 3, 2.4); b.crumble(63, 4.5, 2.4);
    b.plat(68, 4.5, 6);
    b.checkpoint(71, 4.5);
    b.spring(72, 4.5, 7);
    b.plat(77, 12, 4);
    b.stream('ring', 80, 112, 9.65, { speed: 9, spacing: 3.4 });
    b.cells(84, 12.3, 108, 12.3, 6);
    b.blink(113, 11, 2.4, { P: 2, on: 1.4 }); b.crumble(118, 10, 2.4); b.crumble(123, 9, 2.4);
    b.plat(128, 8, 12);
    b.goal(136, 8);
    b.shard(38, 5.6); b.shard(96, 15.6);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),
  // 11 ── a switchyard tunnel: red and blue gates bar the ring lane; hop up to the switch islands to throw them in time
  L('Prometheus Switchyard', 'puzzle', (b) => {
    b.start(-6, 0, 12);
    b.stream('ring', 3, 68, -2.35, { speed: 4.5, spacing: 5.5 });   // deck -1.35
    b.rect(8, 6.6, 60, 1);                                           // the tunnel roof
    b.plat(13, 2, 3.4); b.switch(14, 2);
    b.redWall(23, -1.15, 7.75);
    b.plat(29, 2, 3.4); b.switch(30, 2);
    b.blueWall(39, -1.15, 7.75);
    b.plat(45, 2, 3.4); b.switch(46, 2);
    b.redWall(55, -1.15, 7.75);
    b.cells(8, 0, 12, 0, 2); b.cells(18, 0, 22, 0, 2); b.cells(34, 0, 38, 0, 2); b.cells(50, 0, 54, 0, 2); b.cells(58, 0, 66, 0, 3);
    b.plat(60, 4.2, 2.4); b.shard(61.2, 5.4);                       // a perch tucked under the roof
    b.plat(68.5, -0.55, 7);
    b.checkpoint(70, -0.55);
    // open air: the colours climb, and the last switch lights a hidden blue ledge
    b.switch(73, -0.55);
    b.red(79, 1, 4); b.blue(85, 2.5, 4);
    b.plat(91, 4, 4); b.switch(92.3, 4);
    b.red(97, 5.5, 4); b.blue(97, 10, 3); b.shard(98.5, 11.8);
    b.plat(103, 6.5, 3); b.switch(103.8, 6.5);
    b.blue(108, 6.5, 3);
    b.plat(113, 6.5, 8);
    b.goal(118, 6.5);
    b.cells(80, 2.4, 98, 7, 6);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 12 ── retrograde: the lanes run back and forth up a switchback stack; ride each to its end and climb to the next
  L('Retrograde Switchback', 'ascent', (b) => {
    b.start(-6, 0, 12);
    b.stream('ring', 3, 36, -2.35, { speed: 5.5, spacing: 6.5 });     // → deck -1.35
    b.plat(36.5, -0.55, 4); b.spring(38, -0.55, 6);
    b.plat(31, 6.4, 6);                                             // boarding slab over the retrograde lane
    b.stream('ring', 2, 34, 4.05, { speed: -6, spacing: 6.5 });      // ← deck 5.05
    b.plat(-3, 5.85, 4.6);
    b.wall(-4.6, 6, 8); b.wall(-0.8, 8.6, 6.4);                    // a chimney up the left end
    b.plat(-0.8, 15, 5);
    b.checkpoint(1.5, 15);
    b.stream('ring', 4, 38, 12.65, { speed: 6.5, spacing: 6.5 });    // → deck 13.65
    b.enemy('flyer', 20, 16.5, { ax: 4, ay: 0.6, T: 3 });
    b.plat(38.5, 14.45, 3);
    b.crumble(36, 17.5, 2.4); b.crumble(39.5, 20.5, 2.4);
    b.plat(32, 23.4, 6);
    b.stream('ring', 6, 34, 21.05, { speed: -7, spacing: 6.5 });     // ← deck 22.05
    b.plat(1, 22.85, 6);
    b.goal(3, 22.85);
    b.cells(8, 0.2, 32, 0.2, 5); b.cells(30, 6.8, 6, 6.8, 5); b.cells(8, 15.4, 34, 15.4, 5); b.cells(30, 23.6, 10, 23.6, 4);
    b.cell(-2.7, 10); b.cell(-2.7, 13);
    b.thin(16, 9.3, 4); b.shard(18, 11);                            // a ledge above the first retrograde run
    b.plat(42, 20, 3); b.shard(43.5, 21.8);                         // off the crumbles' far side
    b.plat(-12, 24, 3); b.shard(-10.5, 26);                         // past the goal, a leap to the left
  }),

  // 13 ── Enceladus: pulsing ice geysers on a moonlet fling you up into the ring lanes overhead
  L('Enceladus Geysers', 'bounce', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 8); b.vent(13, 0, 6, { type: 'geyser', P: 2.4, on: 1.2 });
    b.stream('ring', 14, 40, 6.15, { speed: 5.5, spacing: 5 });    // deck 7.15
    b.cells(13, 3, 13, 6, 2); b.cells(18, 8.8, 36, 8.8, 4);
    b.plat(40.5, 7.95, 5);
    b.plat(48, 3, 9); b.vent(54, 3, 3.5, { type: 'geyser', P: 2.4, on: 1.2, off: 1.2 });
    b.checkpoint(50, 3);
    b.plat(56, 9.5, 3);
    b.vent(60.5, 9.5, 7, { type: 'geyser', P: 3, on: 1.4 });
    b.plat(59, 9.5, 3);
    b.stream('ring', 58, 86, 16.15, { speed: 6.5, spacing: 5 });   // deck 17.15
    b.cells(60.5, 12, 60.5, 16, 2); b.cells(64, 18.8, 82, 18.8, 4);
    b.shard(72, 22);
    b.plat(86.5, 17.95, 3);
    b.crumble(91, 15, 2.4); b.crumble(95, 12, 2.4);
    b.plat(99, 9, 9); b.vent(102, 9, 6, { type: 'geyser', P: 2.4, on: 1.2 });
    b.plat(100, 19, 4); b.shard(102, 21);                           // the last geyser's secret
    b.goal(106, 9);
    b.plat(26, 0.5, 3); b.shard(27.5, 2.4);                         // under the first lane
    b.plat(-14, 1.5, 3); b.cell(-12.5, 3.5);
  }),

  // 14 ── sentinels guard the ring: turrets snipe down the lane while you ride; jump the bolts
  L('Sentinel Ring', 'gauntlet', (b) => {
    b.start(-6, 0, 12);
    b.stream('ring', 3, 40, -2.35, { speed: 5.5, spacing: 4.5 });  // deck -1.35
    b.plat(40.5, -0.55, 4);
    b.rect(45.5, -4, 1.6, 4.8); b.turret(46.3, -0.1, -1, { P: 2.4 });   // fires back down the lane at rider height
    b.cells(8, 0, 36, 0, 6);
    b.thin(20, 2.6, 4); b.shard(22, 4.2);
    b.plat(49, 1.5, 6);
    b.checkpoint(52, 1.5);
    b.stream('ring', 56, 96, -0.85, { speed: 6.5, spacing: 4.5 }); // deck 0.15
    b.enemy('flyer', 66, 3, { ax: 2, ay: 1, T: 2.4 });
    b.enemy('flyer', 80, 3.5, { ax: 2.5, ay: 1, T: 2.2 });
    b.rect(97.5, -3, 1.6, 4.2); b.turret(98.3, 1.3, -1, { P: 2, off: 1 });
    b.rect(60, 6.5, 1.6, 2); b.turret(60.8, 7.2, 1, { P: 2.6 });        // and one snipes from behind, up high
    b.thin(84, 4.3, 4); b.shard(86, 5.9);
    b.cells(60, 1.6, 94, 1.6, 8);
    b.plat(96.5, 0.95, 1); b.plat(97.5, 1.2, 1.6);
    b.plat(101, 3, 8);
    b.goal(106, 3);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 15 ── the ring plane dive: fall from the high ring through debris and lanes down to the gas surface
  L('Ring Plane Dive', 'descent', (b) => {
    b.start(-6, 40, 12);
    b.blink(9, 37, 3, { P: 3, on: 2 }); b.crumble(14, 34, 2.4);
    b.stream('ring', 15, 40, 30.65, { speed: 6, spacing: 4.5 });   // deck 31.65
    b.cells(10, 38.5, 15, 35.5, 3); b.cells(20, 33.2, 36, 33.2, 4);
    b.crumble(42, 27, 2.4); b.blink(46, 24, 3, { P: 3, on: 2, off: 1 }); b.crumble(51, 21, 2.4);
    b.plat(55, 18, 6);
    b.checkpoint(58, 18);
    b.enemy('flyer', 64, 15, { ax: 1.5, ay: 1.5, T: 2.6 });
    b.stream('ring', 60, 92, 13.65, { speed: 7.5, spacing: 4.5 }); // deck 14.65
    b.cells(64, 16.2, 88, 16.2, 5);
    b.thin(74, 18.8, 4); b.shard(76, 20.4);
    b.blink(93, 11.5, 3, { P: 2.6, on: 1.7 }); b.crumble(98, 8, 2.4); b.blink(102, 5, 3, { P: 2.6, on: 1.7, off: 1.3 });
    b.cells(94, 13, 103, 6.5, 4);
    // the first touch of the gas surface: slick ice
    b.ice(107, 2, 10);
    b.ice(120, 1, 8);
    b.goal(125, 1);
    b.plat(36, 24, 3); b.shard(37.5, 26);                           // a debris ledge left of the first drop
    b.plat(99, 1, 3); b.shard(100.5, 2.8);                          // beneath the last crumble
    b.plat(-14, 42, 3); b.cell(-12.5, 44);
  }),
  // ════════════════════════ THE GAS SURFACE ════════════════════════

  // 16 ── down on the gas: slick ice keeps you sliding, and sliding off an edge into an updraft is the way up
  L('Slick Landing', 'intro', (b) => {
    b.start(-6, 0, 12);
    b.ice(10, 0, 10);
    b.cells(11, 1.2, 19, 1.2, 4);
    b.plat(24, 0, 4);
    b.arc(20, 0, 24, 0, 2, 1.5);
    b.ice(32, 1, 12);
    b.cells(33, 2.2, 43, 2.2, 5);
    b.vent(46.5, 0, 3);                                   // slide off the end and the draft catches you
    b.cells(46.5, 4, 46.5, 8, 3);
    b.shard(46.5, 12);                                    // ride the draft right to its crest
    b.plat(48.5, 7, 6);
    b.checkpoint(51, 7);
    b.ice(58, 5, 5); b.ice(67, 3, 5);
    b.arc(54.5, 7, 58, 5, 2, 1.5); b.arc(63, 5, 67, 3, 2, 1.5);
    b.plat(76, 2, 4);
    b.vent(82, 2, 2);
    b.plat(84, 7, 10);
    b.goal(90, 7);
    b.plat(6.5, -4, 3); b.shard(8, -2.2);                 // down in the first gap
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 17 ── no floor at all: hop between stumps and let a chain of updraft columns carry you, ducking ceilings
  L('Updraft Alley', 'bounce', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 3); b.vent(12.3, 0, 3);
    b.plat(14, 8, 3);
    b.cells(12.3, 3, 12.3, 7, 2);
    b.rect(18, 13, 5, 1);                                 // a ceiling caps the next draft
    b.vent(20, 8, 4);
    b.plat(24, 11, 4);
    b.checkpoint(26, 11);
    b.shard(20.5, 16.5);                                  // on the ceiling's roof
    // three stumps, three drafts of rising strength
    b.plat(31, 7, 2); b.vent(34, 7, 1);
    b.plat(36, 10, 2); b.vent(39, 10, 2);
    b.plat(41, 14, 2); b.vent(44, 14, 3);
    b.enemy('flyer', 44, 19, { ax: 0.6, ay: 1, T: 2.4 });
    b.plat(46.5, 21, 4);
    b.cells(34, 9, 44, 18, 5);
    b.wall(52, 13, 9); b.plat(54, 17, 3);                 // drop behind a pillar to a hidden ledge
    b.shard(55.5, 18.8);
    b.plat(58, 20, 3); b.vent(62, 20, 1.5);
    b.rect(60, 27.5, 6, 0.8);
    b.plat(64, 25, 9);
    b.goal(69, 25);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 18 ── Skid Row: a staircase of ice shelves under low roofs; you can't jump, only slide off at the right speed
  L('Skid Row', 'precision', (b) => {
    b.start(-6, 14, 12);
    b.ice(8, 14, 10); b.rect(6, 16.4, 12, 0.8);
    b.ice(21, 11.5, 5); b.rect(21, 13.9, 5, 0.6);
    b.ice(29, 9, 4); b.rect(29, 11.4, 4, 0.6);
    b.crumble(36, 7, 2.4);
    b.plat(41, 6, 6);
    b.checkpoint(44, 6);
    b.cells(9, 15, 17, 15, 4); b.cells(22, 12.5, 25, 12.5, 2); b.cells(30, 10, 32, 10, 2);
    // second flight: wider ice, narrower landings, a brake wall at the bottom
    b.ice(50, 4, 12); b.rect(50, 6.4, 12, 0.6);
    b.ice(66, 2, 3);
    b.ice(73, 0, 3);
    b.ice(80, -2, 12); b.wall(92, -2, 4.5);
    b.cells(51, 5, 61, 5, 4); b.cells(67, 3, 68.5, 3, 2); b.cells(74, 1, 75.5, 1, 2);
    b.plat(87, 4, 3); b.plat(93.5, 2.5, 8);                 // climb out over the brake wall
    b.goal(98, 2.5);
    b.plat(17, 8, 2.6); b.shard(18.3, 9.8);                 // under the first roof's lip
    b.thin(80, 1.5, 4); b.shard(82, 3.2);
    b.plat(-14, 16, 3); b.shard(-12.5, 18);
  }),

  // 19 ── lightning walks across slick ice flats: wait on the grippy tiles, then slide through the gaps in the storm
  L('Lightning Flats', 'timing', (b) => {
    b.start(-6, 0, 12);
    for (let i = 0; i < 5; i++) {
      b.ice(8 + i * 8, 0, 6);
      b.plat(14 + i * 8, 0, 2);
      b.beam('lightning', 11 + i * 8, 0, { P: 3, on: 0.9, off: i * 0.6 });
    }
    b.cells(9, 1.2, 46, 1.2, 10);
    b.plat(50, 1, 6);
    b.checkpoint(53, 1);
    // raised flats: lightning above the ice, an updraft to the cloud deck
    b.ice(59, 3, 8); b.beam('lightning', 63, 3, { P: 2.6, on: 0.8 });
    b.plat(67, 3, 2); b.vent(71, 3, 3);
    b.ice(73, 9, 10); b.beam('lightning', 76, 9, { P: 2.6, on: 0.8, off: 1 }); b.beam('lightning', 80, 9, { P: 2.6, on: 0.8, off: 1.8 });
    b.ice(87, 7, 6); b.beam('lightning', 90, 7, { P: 2.4, on: 0.8, off: 0.5 });
    b.plat(97, 5, 10);
    b.goal(103, 5);
    b.cells(60, 4.2, 66, 4.2, 3); b.cells(74, 10.2, 82, 10.2, 4);
    b.shard(27, 4.2);                                      // right under a strike point
    b.shard(71, 14);                                       // the crest of the draft
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 20 ── CHASE: the Ring Shear follows you down to the surface. Slide, ride the drafts, never stop
  L('Shear Front', 'chase', (b) => {
    b.chase({ speed: 4.4 });
    b.start(-6, 0, 14);
    b.ice(12, 0, 12); b.ice(28, -1, 8);
    b.vent(37.5, -1, 3);
    b.plat(40, 6, 5);
    b.ice(49, 5, 10); b.crumble(62, 4, 2.4); b.crumble(67, 3, 2.4);
    b.plat(72, 3, 6);
    b.checkpoint(75, 3);
    b.spring(76, 3, 6);
    b.ice(80, 9, 14);
    b.vent(96, 7, 2);
    b.plat(98, 12, 4);
    b.crumble(105, 11, 2.4); b.crumble(110, 10, 2.4);
    b.ice(115, 9, 8);
    b.plat(126, 8, 10);
    b.goal(133, 8);
    b.cells(13, 1.2, 35, 0.2, 7); b.cells(50, 6.2, 70, 4.2, 6); b.cells(81, 10.2, 93, 10.2, 5);
    b.shard(37.5, 11.5); b.shard(87, 13.5);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),
  // 21 ── the polar hexagon: climb its outer rim, ride a hexagonal orbit inward, then let the eye's draft fire you out the top
  L('Hexagon Spiral', 'ascent', (b) => {
    b.start(-6, 0, 12);
    b.ice(10, 2, 18);                                       // bottom edge
    b.thin(29.5, 5, 3); b.thin(31.5, 8.5, 3); b.thin(33, 12, 3);      // lower-right edge
    b.thin(31.5, 15.5, 3); b.thin(29.5, 19, 3); b.thin(27.5, 22.5, 3); // upper-right edge
    b.beam('lightning', 32.6, 8.5, { P: 3, on: 0.8, h: 7 });
    b.beam('lightning', 31, 19, { P: 3, on: 0.8, h: 7, off: 1.5 });
    b.ice(22, 26, 5); b.ice(13, 26, 5);                     // top edge, split by the eye
    b.checkpoint(24.5, 26);
    // the inner orbit: a small hexagon turning inside the big one
    b.loop([[26, 14], [23, 19.2], [17, 19.2], [14, 14], [17, 8.8], [23, 8.8]], { speed: 3, w: 2.6 });
    b.plat(17.5, 13, 2.4); b.shard(18.7, 14.8);             // the hub
    b.vent(20.6, 13, 8);                                    // the eye: a column straight up through the gap
    b.plat(24, 33, 8);
    b.goal(29, 33);
    b.cells(12, 3.2, 26, 3.2, 5); b.cells(31, 6.5, 33, 20.5, 5); b.cells(26, 24, 14, 27.5, 4); b.cells(20.6, 16, 20.6, 28, 4);
    // the lower-left rim hides a shard
    b.thin(8, 5.5, 2.4); b.thin(6, 9, 2.4); b.thin(5, 12.5, 2.4); b.shard(6.2, 14.4);
    b.thin(13.5, 30, 3); b.shard(15, 31.6);                 // above the top-left edge
  }),

  // 22 ── catch the jet stream: an updraft lifts you into a river of wind that hurls you over the gas; headwinds fight back on the ice
  L('Jet Stream', 'wind', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 4); b.vent(13.5, 0, 4);
    b.wind(12, 8, 30, 5, 10, { gust: true, P: 3, on: 2.2 });   // the jet stream band
    b.cells(13.5, 4, 13.5, 8, 2); b.cells(18, 10.5, 36, 10.5, 6);
    b.plat(40, 7, 6);
    b.checkpoint(43, 7);
    // headwind runway: the wind shoves you back across slick ice toward the drop
    b.ice(50, 7, 18);
    b.wind(50, 7, 18, 6, -7, { P: 4, on: 2 });
    b.cells(51, 8.2, 66, 8.2, 6);
    b.thin(57, 11.2, 4); b.shard(59, 12.8);
    b.plat(70, 8, 3); b.vent(74.5, 8, 4);
    b.wind(73, 13, 32, 7, 10, { gust: true, P: 3.4, on: 2.4, off: 1 });
    b.cells(74.5, 11, 74.5, 15, 2); b.cells(78, 17, 84, 17, 3); b.cells(90, 17, 98, 17, 3);
    b.plat(85, 12, 3);                                       // one cloud to catch your breath on
    b.plat(102, 13, 8);
    b.goal(107, 13);
    b.plat(26, 4, 3); b.shard(27.5, 5.8);                    // a cloud island beneath the first jet
    b.shard(86, 21);                                         // ride high in the second jet
  }),

  // 23 ── the haze rises: chimney, slick ledges and a draft column, climbing before the gas swallows you
  L('Rising Haze', 'tide', (b) => {
    b.rise({ rate: 0.7, delay: 4 });
    b.start(-6, 0, 12);
    b.tower(6, -4, 22, 46);
    b.plat(8, 3, 4); b.ice(14, 6, 6);
    b.plat(18.8, 9, 3);
    b.wall(18, 10, 11); b.wall(21.8, 12, 9);               // chimney
    b.cells(20.3, 11, 20.3, 19, 3);
    b.plat(9, 21, 9);
    b.checkpoint(13, 21);
    b.vent(7.4, 21, 4);                                     // step off the left end into the draft
    b.plat(9.4, 29, 4);
    b.ice(16, 32, 5); b.ice(9, 35.5, 5);
    b.thin(16, 39, 4);
    b.plat(21, 42, 5);
    b.plat(30, 42, 8);
    b.goal(35, 42);
    b.cells(7.4, 24, 7.4, 30, 3); b.cells(10, 30.5, 13, 30.5, 2); b.cells(17, 33.3, 19, 33.3, 2); b.cells(10, 36.8, 12, 36.8, 2);
    b.plat(23, 15, 3); b.shard(24.5, 16.8);                 // a ledge outside the chimney
    b.shard(7.4, 33.5);                                     // the draft's crest
    b.thin(3, 39, 3); b.shard(4.5, 40.6);
  }),

  // 24 ── a battery of thunderhead turrets over two routes: a slick low road under fire or a high road of drifting sentries
  L('Thunderhead Battery', 'gauntlet', (b) => {
    b.start(-6, 0, 12);
    // low road
    b.ice(8, 0, 34);
    b.rect(42, -3, 1.6, 4.5); b.turret(42.8, 0.8, -1, { P: 2.2 });
    b.rect(24, 3.4, 1.6, 2.4); b.turret(24.8, 4, -1, { P: 2.6, off: 1 });   // a hanging battery: slide under it
    b.cells(10, 1.2, 40, 1.2, 8);
    // high road
    b.thin(10, 4, 4); b.thin(17, 7, 4); b.thin(26, 8.5, 4); b.thin(34, 7, 4);
    b.enemy('flyer', 22, 9.5, { ax: 2, ay: 1, T: 2.4 }); b.enemy('flyer', 31, 10, { ax: 1.5, ay: 1.5, T: 2.2 });
    b.cells(18, 8.4, 36, 8.4, 5);
    b.shard(28, 12.5);
    b.plat(44, 4, 6);
    b.checkpoint(47, 4);
    // the storm wall: turrets stacked on a pillar, lightning, a draft over the top
    b.ice(53, 4, 12);
    b.beam('lightning', 59, 4, { P: 2.8, on: 0.8 });
    b.rect(66, 4, 1.6, 8); b.turret(66.8, 5, -1, { P: 2.4 }); b.turret(66.8, 9, -1, { P: 2.4, off: 1.2 });
    b.vent(64, 4, 6);
    b.plat(68.5, 13, 4); b.shard(70.5, 14.8);
    b.enemy('flyer', 77, 9, { ax: 2, ay: 2, T: 3 });
    b.plat(74, 7, 4); b.plat(82, 5, 10);
    b.goal(88, 5);
    b.cells(54, 5.2, 62, 5.2, 4);
    b.shard(24.8, 7.6);                                     // perched on the hanging battery
  }),

  // 25 ── switches on the polar ice: every landing flips red and blue, and the ice won't let you stop where you like
  L('Polar Switchback', 'puzzle', (b) => {
    b.start(-6, 0, 12);
    b.ice(8, 0, 16);
    b.redWall(24, 0, 5);
    b.thin(12, 3.6, 4); b.switch(13.3, 3.6);               // flip from the ledge above the ice
    b.plat(24, 0, 6);
    b.blue(32, 2, 3); b.blue(37, 4, 3);
    b.ice(42, 5, 12); b.switch(52, 5);                      // slide to a stop on the button (or overshoot)
    b.red(56, 7, 3);
    b.plat(61, 8, 5);
    b.checkpoint(63, 8);
    // the switchback: the ledges you need alternate colour as you climb back left
    b.switch(64, 8);
    b.blue(56, 11, 3); b.plat(50, 13, 3); b.switch(50.8, 13);
    b.red(56, 16, 3); b.plat(62, 18, 3); b.switch(62.8, 18);
    b.blue(67, 20, 3);
    b.ice(72, 20, 8);
    b.plat(82, 19, 8);
    b.goal(87, 19);
    b.cells(9, 1.2, 22, 1.2, 5); b.cells(33, 3.4, 39, 5.4, 3); b.cells(43, 6.2, 51, 6.2, 4); b.cells(57, 12.4, 63, 19.4, 4);
    b.blue(43, 9.5, 3); b.shard(44.5, 11.3);                // only solid while blue
    b.red(70, 24, 3); b.shard(71.5, 25.8);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),
  // 26 ── ammonia caverns: a two-storey ice cave; updraft shafts punch up through the roof to the gallery and out
  L('Ammonia Caverns', 'maze', (b) => {
    b.start(-6, 0, 12);
    b.ice(8, 0, 30);                                        // the tunnel floor
    b.rect(8, 3.5, 14, 1);                                  // tunnel roof...
    b.vent(23.5, 0, 3);                                     // ...with a draft blowing up through the gap
    b.ice(25, 4.5, 13);                                     // the gallery floor
    b.rect(6, 9, 36, 1);                                    // the cave roof
    b.enemy('walker', 27, 4.5, { range: 8, speed: 2 });
    b.enemy('flyer', 31, 1.8, { ax: 4, ay: 0.3, T: 3 });
    b.cells(10, 1.2, 21, 1.2, 4); b.cells(26, 5.7, 36, 5.7, 4);
    b.shard(9.5, 6.3);                                      // the dead end at the back of the gallery (on the tunnel roof)
    // the routes split: low road over the drop, high road across the gallery mouth
    b.plat(42, -1, 5); b.plat(43, 4.5, 3);
    b.cells(39, 0, 41, 0, 2);
    b.plat(50, 1, 6);
    b.checkpoint(53, 1);
    // the chimney shaft: one big draft, alcoves on the walls
    b.plat(56, 1, 8.6);
    b.wall(56, 3.2, 17); b.wall(64.6, 1, 19);
    b.vent(60.3, 1, 9);
    b.plat(56.8, 12, 1.8); b.shard(57.7, 13.8);             // a left-wall alcove
    b.plat(62.8, 16, 1.8);
    b.cells(60.3, 4, 60.3, 18, 5);
    b.rect(54, 27, 14, 1);
    b.plat(64.6, 21, 10);
    b.goal(70, 21);
    b.plat(46, -5, 3); b.shard(47.5, -3.2);                 // under the low road
  }),

  // 27 ── hailstone drop: switchback down a storm shaft of ice shelves; brake on the walls, dodge hail and lightning
  L('Hailstone Drop', 'descent', (b) => {
    b.start(-6, 30, 12);
    b.ice(6, 26, 12);
    b.ice(14, 21, 16); b.wall(30, 21, 4.5);
    b.ice(2, 16, 16); b.wall(1.2, 16, 4.5);
    b.ice(14, 11, 16); b.wall(30, 11, 4.5);
    b.meteor(12, 26, { P: 2.6 }); b.meteor(8, 16, { P: 2.4, off: 1 });
    b.beam('lightning', 23, 21, { P: 3, on: 0.9, h: 4 });
    b.beam('lightning', 21, 11, { P: 2.6, on: 0.8, h: 4, off: 1.3 });
    b.plat(2, 6, 8);
    b.checkpoint(5, 6);
    b.cells(8, 27.2, 16, 27.2, 3); b.cells(17, 22.2, 28, 22.2, 4); b.cells(4, 17.2, 15, 17.2, 4); b.cells(17, 12.2, 28, 12.2, 4);
    b.shard(30.4, 27);                                      // on top of the first brake wall
    b.thin(-4, 10, 3); b.shard(-2.5, 11.6);                 // out in the void left of the shaft
    // out the bottom
    b.crumble(13, 4, 2.4); b.blink(18, 2.5, 3, { P: 3, on: 2 }); b.crumble(24, 1, 2.4);
    b.meteor(19.5, 2.5, { P: 2.8, off: 0.5 });
    b.cells(14, 5.4, 25, 2.4, 4);
    b.ice(30, 0, 6); b.plat(39, 0, 8);
    b.goal(44, 0);
    b.plat(36, -4, 2); b.shard(37, -2.2);                   // a stub below the last gap
  }),

  // 28 ── gale pinball: slide off ice ledges onto springs that ricochet you higher, under bumper ceilings
  L('Gale Pinball', 'bounce', (b) => {
    b.start(-6, 6, 12);
    b.ice(8, 6, 8);
    b.plat(17.5, 0, 3); b.spring(18.1, 0, 9);
    b.ice(22, 10, 8);
    b.plat(31.5, 4, 3); b.spring(32.1, 4, 10);
    b.rect(30, 18, 6, 0.8);                                 // a bumper: drift right off it
    b.ice(37, 15, 8);
    b.checkpoint(41, 15);
    b.cells(16, 5, 19, 7, 2); b.cells(23, 11.2, 29, 11.2, 3); b.cells(33.5, 9, 33.5, 15, 3);
    // second table: a gust lane and twin springs
    b.plat(46.5, 9, 3); b.spring(47.1, 9, 6);
    b.wind(45, 16, 14, 6, 9, { gust: true, P: 3, on: 2 });
    b.ice(58, 17, 6);
    b.enemy('flyer', 52, 19, { ax: 2, ay: 1, T: 2.6 });
    b.plat(65.5, 11, 3); b.spring(66.1, 11, 10);
    b.rect(64, 25, 8, 0.8);
    b.ice(71, 21, 6);
    b.plat(80, 18, 8);
    b.goal(85, 18);
    b.shard(33.6, 20.2);                                    // on top of the first bumper
    b.shard(68, 27.2);                                      // on top of the last bumper
    b.plat(10, 1, 3); b.shard(11.5, 2.8);                   // down under the first slide
  }),

  // 29 ── HARD: the eye of the hexagon storm — narrow ice under lightning, draft hops, a headwind runway and twin hex orbits
  L('Eye of the Hexagon', 'gauntlet', (b) => {
    b.start(-6, 0, 12);
    for (let i = 0; i < 4; i++) {
      b.ice(9 + i * 7, i % 2, 3);
      b.beam('lightning', 10.5 + i * 7, i % 2, { P: 2.6, on: 0.8, off: i * 0.65, h: 7 });
    }
    b.cells(10.5, 2, 31.5, 3, 4);
    // draft hops under ceilings with sentries
    b.plat(37, 1, 2); b.vent(40.5, 1, 3); b.rect(38, 11, 6, 0.8);
    b.thin(44, 8, 2.4);
    b.vent(48, 5.5, 3); b.rect(46, 15, 5, 0.8);
    b.thin(51, 12, 2.4);
    b.enemy('flyer', 46, 9, { ax: 1, ay: 2, T: 2.2 });
    b.plat(56, 10, 5);
    b.checkpoint(58.5, 10);
    // the headwind runway with blinking refuges
    b.ice(64, 10, 20);
    b.wind(64, 10, 20, 6, -8, { P: 3.6, on: 1.8 });
    b.blink(68, 13.5, 2.4, { P: 3, on: 1.8 }); b.blink(76, 13.5, 2.4, { P: 3, on: 1.8, off: 1.5 });
    b.cells(66, 11.2, 82, 11.2, 5);
    // the eye: two hexagonal orbits, a turret watching from the far wall
    const hex = (cx, cy, r) => [0, 1, 2, 3, 4, 5].map((k) => [cx + Math.cos(k * Math.PI / 3) * r, cy + Math.sin(k * Math.PI / 3) * r * 0.8]);
    b.loop(hex(94, 10, 6), { speed: 3.4, w: 2.6 });
    b.loop(hex(108, 12, 6).reverse(), { speed: 3.4, w: 2.6 });
    b.rect(118, 6, 1.6, 12); b.turret(118.8, 14, -1, { P: 2.4 });
    b.plat(113, 22, 4); b.shard(115, 24);                    // above the second orbit
    b.plat(119.6, 17, 6);
    b.crumble(127, 14, 2.4); b.crumble(132, 11, 2.4);
    b.plat(137, 8, 10);
    b.goal(143, 8);
    b.cells(90, 16, 112, 16, 6);
    b.shard(48, 13.8);                                       // in the second draft, under its ceiling
    b.shard(94, 10);                                         // the dead centre of the first orbit
  }),

  // 30 ── FINALE: ring lanes, a wheel and sparkles, a dive to the slick surface, then the Ring Shear chases you home
  L('Lord of the Rings', 'finale', (b) => {
    b.start(-6, 20, 12);
    // the rings
    b.stream('ring', 3, 30, 17.65, { speed: 6.5, spacing: 4.5 });   // deck 18.65
    b.cells(8, 20.2, 26, 20.2, 4);
    b.plat(30.5, 19.45, 4);
    b.ferris(42, 18, 5.5, { n: 4, omega: 0.7, w: 2.6 });
    b.shard(42, 18);                                                 // ...in the wheel's hub (jump through)
    b.plat(50, 21, 4);
    b.blink(57, 19, 2.6, { P: 3, on: 1.8 }); b.blink(62, 17, 2.6, { P: 3, on: 1.8, off: -0.6 }); b.crumble(67, 15, 2.4);
    b.cells(51, 22.4, 68, 16.4, 5);
    // the dive
    b.crumble(71, 11, 2.4); b.crumble(75, 7, 2.4);
    b.ice(79, 3, 10);
    b.vent(91, 2, 3);
    b.plat(93, 8, 6);
    b.checkpoint(96, 8);
    // the chase across the gas
    b.chase({ speed: 4.5, trigger: 97, behind: 14 });
    b.ice(103, 8, 12);
    b.beam('lightning', 109, 8, { P: 2.4, on: 0.7, h: 7 });
    b.crumble(118, 7, 2.4); b.crumble(123, 6, 2.4);
    b.plat(128, 6, 3); b.spring(129, 6, 6);
    b.plat(133, 12, 3);
    b.stream('ring', 136, 166, 9.65, { speed: 8.5, spacing: 3.6 }); // deck 10.65: a stray ring lane, low over the gas
    b.cells(140, 12.4, 162, 12.4, 5);
    b.ice(167, 11.5, 8);
    b.vent(177, 10, 2);
    b.plat(179, 15, 12);
    b.goal(186, 15);
    b.cells(104, 9.2, 114, 9.2, 4);
    b.shard(150, 15.6);                                             // a leap from the last lane
    b.plat(-14, 22, 3); b.shard(-12.5, 24);
  }),
];
