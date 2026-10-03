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
    b.stream('ring', 3, 36, -2.35, { speed: 5.5, spacing: 5 });     // → deck -1.35
    b.plat(36.5, -0.55, 4); b.spring(38, -0.55, 6);
    b.plat(31, 6.4, 6);                                             // boarding slab over the retrograde lane
    b.stream('ring', 2, 34, 4.05, { speed: -6, spacing: 5 });      // ← deck 5.05
    b.plat(-3, 5.85, 4.6);
    b.wall(-4.6, 6, 8); b.wall(-0.8, 8.6, 6.4);                    // a chimney up the left end
    b.plat(-0.8, 15, 5);
    b.checkpoint(1.5, 15);
    b.stream('ring', 4, 38, 12.65, { speed: 6.5, spacing: 5 });    // → deck 13.65
    b.enemy('flyer', 20, 16.5, { ax: 4, ay: 0.6, T: 3 });
    b.plat(38.5, 14.45, 3);
    b.crumble(36, 17.5, 2.4); b.crumble(39.5, 20.5, 2.4);
    b.plat(32, 23.4, 6);
    b.stream('ring', 6, 34, 21.05, { speed: -7, spacing: 5 });     // ← deck 22.05
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
    b.thin(84, 4.6, 4); b.shard(86, 6.2);
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
    b.plat(-14, 42, 3); b.shard(-12.5, 44);
  }),
];
