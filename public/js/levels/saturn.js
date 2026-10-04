// WORLD 8 — SATURN. 30 hand-written levels.
// Levels 1–15: THE RINGS — racing ice-chunk streams, slingshot pods, icy strands, orbit tethers,
//   shepherd-moon sweeps, tumbling ice wrecking balls, long ring-plane zip lines, the Cassini Division.
// Levels 16–30: THE GAS SURFACE — slick ice, hexagon-storm cyclones, sinking slush rafts, rising
//   helium bubbles, gas-geyser cannons, lightning, the polar hexagon.
// Ring chunks: b.stream('ring', x0, x1, laneY) → deck at laneY + 1. Board from a slab ~1.35 above
// the deck, hop off onto a slab ~0.8 above it just past x1. Jumping off a chunk does NOT keep its speed.
import { L } from './dsl.js';

export default [
  // 1 ── intro: a ring stream ferries you over the first gap, a slingshot pod flings you on, a zip line carries you down to the last stream
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
    // a slingshot pod: hop in, press jump, fly
    b.barrel(55.5, 2.2, { angle: 35 });
    b.arc(56, 3, 67, 4, 4, 3);
    b.plat(66, 3, 6);
    // a gentle zip line down the ring plane
    b.zip(70.5, 6, 84, 4.4);
    b.cells(73, 4.2, 82, 3.2, 4);
    b.plat(84, 2.6, 6);
    // the last stream, with a ledge to hop up to
    b.stream('ring', 89, 115, 0.25, { speed: 6, spacing: 4.5 });
    b.thin(100, 5, 4); b.shard(102, 6.6);
    b.cells(93, 2.4, 112, 2.4, 6);
    b.plat(115.5, 2.05, 10);
    b.goal(121, 2.05);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 2 ── an escalator of three rising ring lanes and a balloon-pad lift, then down a chain of ice chunks swinging on orbit tethers and a zip to the finish
  L('Ice Chip Escalator', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.stream('ring', 3, 30, -2.35, { speed: 5, spacing: 5 });     // passes under the start
    b.stream('ring', 18, 46, 1.4, { speed: 5.5, spacing: 5 });
    b.stream('ring', 34, 62, 5.2, { speed: 6, spacing: 5 });
    b.plat(62.5, 7.0, 3.5);                                   // hop off the third lane
    b.floater(68, 6.0, 5, { rise: 5.5, speed: 2 });          // a balloon pad lifts you to the rest stop
    b.cells(10, 0, 26, 0, 4); b.cells(28, 3.8, 42, 3.8, 4); b.cells(44, 7.6, 58, 7.6, 4); b.cells(63, 8.8, 66, 8.8, 2); b.cells(71, 12, 76, 12.4, 3);
    b.shard(70, 15.6);
    b.plat(78.5, 10.8, 9);
    b.checkpoint(82, 10.8);
    // tethered chunks swing in opposite beats
    b.pendulum(92, 17, 6, { amp: 25, T: 4, w: 4 });
    b.pendulum(98.5, 14.8, 6, { amp: 25, T: 4, phase: 0.5, w: 4 });
    b.cells(92, 12.4, 99.5, 9.9, 3);
    b.shard(95.8, 7.4);                                 // low between the two tethers
    b.plat(103.5, 8.0, 3); b.zip(105, 9.8, 116, 4.6);
    b.cells(105, 8.2, 114, 4.8, 4);
    b.plat(116, 2.6, 10);
    b.goal(122, 2.6);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 3 ── a double helix of sparkle platforms climbs an ice spire; a tethered chunk swings you to a high ring lane; zip down the far side
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
    // an orbit tether swings from over the spire to the boarding slab
    b.pendulum(17.5, 31, 6.5, { amp: 30, T: 3.6 });
    b.plat(22.5, 25.5, 3.5);
    b.stream('ring', 23, 54, 23.15, { speed: 6.5, spacing: 4.5 });
    b.cells(27, 25, 50, 25, 6);
    b.thin(36, 28.2, 4); b.shard(38, 29.8);
    b.plat(54.5, 24.9, 4);
    // the long zip line down past a shepherd moonlet's sweep
    b.zip(57.5, 27.8, 76, 13.5);
    b.sweeper(68, 23.5, 3.2, { omega: 70 });
    b.cells(60, 25.4, 73, 15.4, 5);
    b.plat(76, 10, 10);
    b.goal(82, 10);
    b.plat(7, -3.2, 4); b.shard(9, -1.4);           // under the first sparkle
  }),

  // 4 ── Prometheus and Pandora: ride one moonlet on its oval, leap to the other past a shepherd sweep, then a rocking pod off Daphnis
  L('Shepherd Moons', 'ride', (b) => {
    b.start(-6, 0, 12);
    const oval = (cx, cy, rx, ry, rev) => {
      const pts = [];
      for (let i = 0; i < 12; i++) { const a = (rev ? -1 : 1) * i * Math.PI / 6 + Math.PI; pts.push([cx + Math.cos(a) * rx, cy - Math.sin(a) * ry]); }
      return pts;
    };
    b.loop(oval(20, 5, 12, 5, false), { speed: 4, w: 3 });     // Prometheus (left → down → right → up)
    b.loop(oval(46, 7, 12, 5, true), { speed: 4, w: 3 });      // Pandora (the opposite way)
    b.sweeper(33, 14.5, 4.5, { omega: 45 });                   // a shepherd's gravity sweep over the hand-off
    b.cells(10, 7, 30, 7, 5);
    b.plat(17, 4.5, 5); b.shard(19.5, 6.5);                    // the hub inside Prometheus' orbit
    b.cells(36, 9, 56, 9, 5);
    b.plat(59, 7.5, 7);
    b.checkpoint(62, 7.5);
    // Daphnis: a tall, thin orbit up to the high islands
    const tall = []; for (let i = 0; i < 12; i++) { const a = -i * Math.PI / 6 - Math.PI / 2; tall.push([74 + Math.cos(a) * 4.5, 14 + Math.sin(a) * 8]); }
    b.loop(tall, { speed: 3.6, w: 3 });
    b.plat(81, 20, 4); b.shard(83, 24);
    b.barrel(88, 21.5, { angle: -15, sweep: 25, spin: 2 });   // a rocking pod: fire it on the downswing
    b.plat(98, 11, 10);
    b.goal(104, 11);
    b.cells(90, 19.5, 98, 13.5, 4);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 5 ── the Cassini Division: a vast dark gap crossed on an icy strand, a tethered chunk and a moonlet, between two fast ring streams
  L('Cassini Division', 'precision', (b) => {
    b.start(-6, 0, 12);
    // ring A
    b.stream('ring', 3, 30, -2.35, { speed: 6, spacing: 4 });
    b.cells(9, -0.6, 27, -0.6, 5);
    b.plat(30.5, -0.55, 6);
    b.checkpoint(33, -0.55);
    // the Division
    b.crumble(40, 0.5, 2.4);
    b.vine(47, 9, 5.5);                                           // an icy strand
    b.pendulum(56, 10, 7, { amp: 30, T: 3.6 });                  // a chunk on an orbit tether
    b.loop([[63, 3.5], [72, 3.5]], { speed: 3.4, loop: false, w: 2.8 });
    b.blink(77, 3.5, 2.4, { P: 3, on: 1.8, off: -1 }); b.crumble(82, 4, 2);
    b.cells(42, 2.5, 84, 5.5, 10);
    b.thin(64, 7.2, 5); b.shard(66.5, 8.8);
    // ring B: dense and fast
    b.plat(87, 4.5, 4);
    b.stream('ring', 89, 120, 2.15, { speed: 8, spacing: 3.6 });
    b.cells(93, 4.2, 116, 4.2, 6);
    b.shard(106, 7.4);
    b.plat(120.5, 3.95, 10);
    b.goal(126, 3.95);
    b.plat(37, -3.5, 2.4); b.shard(38.2, -1.6);        // a mote hiding below the Division's lip
  }),

  // 6 ── one giant ice wheel is the elevator, a smaller wheel turns you back down, a wrecking ball guards the rest stop, a pod fires you home
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
    b.wrecker(56.5, 17, 5, { amp: 55, T: 3.2 });             // a tumbling ice chunk swings over the rest stop
    b.ferris(66, 7, 4.5, { n: 3, omega: 0.9, w: 2.6 });
    b.cells(56, 11, 64, 13, 3);
    b.plat(73, 6, 3); b.thin(73, 11, 3); b.shard(74.5, 12.6);
    b.barrel(79, 7.6, { angle: 25 });
    b.arc(79, 8, 92, 6, 4, 2.5);
    b.plat(90, 5, 10);
    b.goal(96, 5);
    b.arc(37, 18, 54.5, 9, 5, 2);
  }),

  // 7 ── a vertical crossing: five ring lanes race in alternating directions; climb up through them, then zip down past a sweeping moonlet
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
    // over the top and down the far side on a long cable
    b.thin(23, 25, 4); b.shard(25, 26.6);
    b.zip(21, 23.8, 46, 12.6);
    b.sweeper(35, 23, 4.6, { omega: 60 });
    b.cells(24, 21, 44, 12, 6);
    b.plat(45, 9, 10);
    b.goal(51, 9);
  }),

  // 8 ── NEW: a deep shaft of ice chunks on orbit tethers: swing down the chain, slip past tumbling wrecking balls, zip out the bottom
  L('Tether Drop', 'descent', (b) => {
    b.start(-6, 36, 12);
    b.tower(8, 5, 26, 40);
    b.pendulum(11, 42, 7, { amp: 35, T: 3.6 });
    b.pendulum(19, 38, 7, { amp: 35, T: 3.6, phase: 0.5 });
    b.pendulum(27, 34, 7, { amp: 35, T: 3.6 });
    b.cells(11, 36.5, 27, 28.5, 5);
    b.plat(16, 25, 3); b.shard(17.5, 26.8);                   // a ledge tucked under the chain
    b.plat(32, 24, 6);
    b.checkpoint(35, 24);
    // the tumbling chunks: three ledges, three wrecking balls
    b.plat(41, 21, 3); b.wrecker(42.5, 29, 5, { amp: 50, T: 3 });
    b.plat(47, 18, 3); b.wrecker(48.5, 26, 5, { amp: 50, T: 3, phase: 0.33 });
    b.plat(53, 15, 3); b.wrecker(54.5, 23, 5, { amp: 50, T: 3, phase: 0.66 });
    b.cells(39, 23, 55, 17, 5);
    b.thin(47.5, 25.5, 2.4); b.shard(48.7, 27.2);             // right under the middle ball's rope
    // out the bottom on a long cable
    b.zip(56.5, 17.5, 80, 8.5);
    b.cells(60, 14.5, 77, 8.5, 5);
    b.plat(80, 5.5, 10);
    b.goal(86, 5.5);
    b.plat(-14, 38, 3); b.shard(-12.5, 40);
  }),

  // 9 ── the braided F ring: three lanes at three speeds; frozen gates and tumbling chunks force you to weave between them
  L('F-Ring Braid', 'ride', (b) => {
    b.start(-6, 0, 12);
    const gate = (x, deck) => b.rect(x, deck + 0.2, 0.8, 2.2);   // frozen pillars hanging low over one lane
    // first braid: decks -1.35 / 2.25 / 5.85
    b.stream('ring', 3, 46, -2.35, { speed: 5, spacing: 6 });
    b.stream('ring', 3, 46, 1.25, { speed: 6.5, spacing: 6.5 });
    b.stream('ring', 3, 46, 4.85, { speed: 8, spacing: 7 });
    gate(20, -1.35); gate(30, 2.25); gate(38, -1.35); gate(38, 5.85);
    b.wrecker(25, 14, 7, { amp: 40, T: 3.2 });                  // swings through the top lane
    b.cells(10, 0, 18, 0, 3); b.cells(23, 3.6, 28, 3.6, 2); b.cells(32, 7.2, 37, 7.2, 2); b.cells(40, 3.6, 44, 3.6, 2);
    b.shard(34, -0.2);                                       // low lane, between two gates
    b.plat(46.5, 6.65, 6);
    b.checkpoint(49.5, 6.65);
    // second braid, a step higher: decks 0.65 / 4.25 / 7.85
    b.stream('ring', 55, 96, -0.35, { speed: 5.5, spacing: 6 });
    b.stream('ring', 55, 96, 3.25, { speed: 7, spacing: 6.5 });
    b.stream('ring', 55, 96, 6.85, { speed: 8.5, spacing: 7 });
    gate(62, 7.85); gate(70, 4.25); gate(70, 0.65); gate(86, 4.25); gate(86, 0.65);
    b.wrecker(80, 16.5, 7, { amp: 40, T: 3, phase: 0.5 });
    b.cells(56, 5.6, 60, 5.6, 2); b.cells(64, 9.2, 68, 9.2, 2); b.cells(72, 5.6, 78, 5.6, 2); b.cells(82, 2, 84, 2, 2); b.cells(88, 9.2, 94, 9.2, 3);
    b.thin(73, 12.1, 4); b.shard(75, 13.8);
    b.plat(96.5, 8.65, 10);
    b.goal(102, 8.65);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 10 ── CHASE: the Ring Shear tears through the rings. Fast lanes, a zip line and a chain of slingshot pods are your only way to outrun it
  L('Ring Shear', 'chase', (b) => {
    b.chase({ speed: 4.4 });
    b.start(-6, 0, 14);
    b.plat(12, 1, 5); b.plat(21, 2, 4);
    b.stream('ring', 24, 52, -0.35, { speed: 8, spacing: 3.4 });
    b.cells(28, 2.3, 48, 2.3, 5);
    b.zip(52, 4.8, 66, 3.4);
    b.cells(55, 3.4, 64, 2.4, 3);
    b.plat(66, 1.5, 7);
    b.checkpoint(69, 1.5);
    b.barrel(75.5, 3.5, { angle: 55, power: 20 });
    b.plat(80, 7, 6);
    b.stream('ring', 84, 112, 6.65, { speed: 9, spacing: 3.4 });
    b.cells(88, 9.3, 108, 9.3, 5);
    // pod to pod: they fire themselves
    b.barrel(116, 9.5, { angle: 15, auto: true });
    b.barrel(128, 8.5, { angle: 15, auto: true });
    b.cells(119, 10, 125, 9.5, 3);
    b.plat(134, 8, 12);
    b.goal(142, 8);
    b.shard(38, 5.6); b.shard(96, 12.6);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 11 ── NEW: Daphnis' wake: icy strands hang between ring chunks; swing strand to strand, ride tethered chunks, slip under a wrecking ball
  L('Daphnis Strands', 'swing', (b) => {
    b.start(-6, 2, 12);
    b.vine(11, 10, 6);
    b.plat(16, 2, 4);
    b.vine(25, 11, 6);
    b.plat(31, 3, 5);
    b.checkpoint(33.5, 3);
    // the strand chain: no chunk between
    b.vine(44, 12, 6); b.vine(52.5, 12, 6);
    b.shard(48.2, 4.6);                                      // low between the chained strands
    b.pendulum(61, 12, 7, { amp: 30, T: 3.6 });
    b.vine(70, 13, 6);
    b.plat(76, 4, 5);
    b.wrecker(78.5, 12.5, 4.5, { amp: 55, T: 3.2 });
    // orbit tethers up to the far chunk
    b.pendulum(86, 13, 7, { amp: 30, T: 3.4 });
    b.pendulum(94, 15, 7, { amp: 30, T: 3.4, phase: 0.5 });
    b.thin(91, 10.5, 2.4); b.shard(92.2, 10.5+1.6);
    b.plat(100, 9, 9);
    b.goal(106, 9);
    b.arc(4, 2, 16, 2, 4, 3); b.arc(20, 2, 31, 3, 3, 3); b.arc(36, 3, 76, 4, 10, 3); b.arc(81, 4, 100, 9, 5, 3);
    b.plat(-14, 4, 3); b.shard(-12.5, 6);
  }),

  // 12 ── retrograde: lanes run back and forth up a switchback stack; a pod, a chimney and a tethered chunk link each run to the next
  L('Retrograde Switchback', 'ascent', (b) => {
    b.start(-6, 0, 12);
    b.stream('ring', 3, 36, -2.35, { speed: 5.5, spacing: 6.5 });     // → deck -1.35
    b.plat(36.5, -0.55, 5);
    b.barrel(40.5, 1.6, { angle: 110, power: 20 });                // a pod fires you back up-left
    b.plat(31, 6.4, 6);                                             // boarding slab over the retrograde lane
    b.stream('ring', 2, 34, 4.05, { speed: -6, spacing: 6.5 });      // ← deck 5.05
    b.plat(-3, 5.85, 4.6);
    b.wall(-4.6, 6, 8); b.wall(-0.8, 8.6, 6.4);                    // a chimney up the left end
    b.plat(-0.8, 15, 5);
    b.checkpoint(1.5, 15);
    b.stream('ring', 4, 38, 12.65, { speed: 6.5, spacing: 6.5 });    // → deck 13.65
    b.enemy('flyer', 20, 16.5, { ax: 4, ay: 0.6, T: 3 });
    b.plat(38.5, 14.45, 3);
    b.crumble(36, 17.5, 2.4);
    b.pendulum(40, 26.5, 6, { amp: 30, T: 3.6 });
    b.plat(32, 23.4, 6);
    b.stream('ring', 6, 34, 21.05, { speed: -7, spacing: 6.5 });     // ← deck 22.05
    b.plat(1, 22.85, 6);
    b.goal(3, 22.85);
    b.cells(8, 0.2, 32, 0.2, 5); b.cells(30, 6.8, 6, 6.8, 5); b.cells(8, 15.4, 34, 15.4, 5); b.cells(30, 23.6, 10, 23.6, 4);
    b.cell(-2.7, 10); b.cell(-2.7, 13);
    b.thin(16, 9.3, 4); b.shard(18, 11);                            // a ledge above the first retrograde run
    b.plat(44, 20, 3); b.shard(45.5, 21.8);                         // off the tether's far swing
    b.plat(-12, 24, 3); b.shard(-10.5, 26);                         // past the goal, a leap to the left
  }),

  // 13 ── Enceladus: pulsing ice geysers on a moonlet fling you up into the ring lanes overhead; a wrecker on the moonlet, a zip off the top
  L('Enceladus Geysers', 'bounce', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 8); b.vent(13, 0, 6, { type: 'geyser', P: 2.4, on: 1.2 });
    b.stream('ring', 14, 40, 6.15, { speed: 5.5, spacing: 5 });    // deck 7.15
    b.cells(13, 3, 13, 6, 2); b.cells(18, 8.8, 36, 8.8, 4);
    b.plat(40.5, 7.95, 5);
    b.plat(48, 3, 9); b.vent(54, 3, 3.5, { type: 'geyser', P: 2.4, on: 1.2, off: 1.2 });
    b.wrecker(51, 11, 5, { amp: 50, T: 3.4 });
    b.checkpoint(49, 3);
    b.plat(56, 9.5, 3);
    b.vent(60.5, 9.5, 7, { type: 'geyser', P: 3, on: 1.4 });
    b.plat(59, 9.5, 3);
    b.stream('ring', 58, 86, 16.15, { speed: 6.5, spacing: 5 });   // deck 17.15
    b.cells(60.5, 12, 60.5, 16, 2); b.cells(64, 18.8, 82, 18.8, 4);
    b.shard(72, 22);
    b.plat(86.5, 17.95, 3);
    b.zip(88.5, 20.8, 99, 12.8);
    b.cells(90.5, 18.5, 97.5, 13.5, 3);
    b.plat(99, 9, 9); b.vent(102, 9, 6, { type: 'geyser', P: 2.4, on: 1.2 });
    b.plat(100, 19, 4); b.shard(102, 21);                           // the last geyser's secret
    b.goal(106, 9);
    b.plat(26, 0.5, 3); b.shard(27.5, 2.4);                         // under the first lane
    b.plat(-14, 1.5, 3); b.cell(-12.5, 3.5);
  }),

  // 14 ── NEW: a relay of ice-chunk slingshot pods across the ring plane: fixed pods, pod-to-pod chains, rocking pods, spinning pods
  L('Slingshot Relay', 'cannon', (b) => {
    b.start(-6, 0, 12);
    b.barrel(9, 2, { angle: 20 });
    b.arc(10, 3, 22, 2.5, 4, 2);
    b.plat(22, 1, 5);
    // a chain: the first pod fires you straight into the second
    b.barrel(30, 3, { angle: 20 });
    b.barrel(41, 1.5, { angle: 30 });
    b.thin(34, -2.5, 3); b.shard(35.5, -0.9);                // under the chain
    b.plat(54, 2, 7);
    b.checkpoint(57, 2);
    // rocking pods: fire on the right beat
    b.barrel(64, 4, { angle: 35, sweep: 30, spin: 2.2 });
    b.plat(76, 3, 4);
    b.plat(72, 8, 3); b.shard(73.5, 9.8);                // only from the pod's steepest swing
    b.barrel(84, 5.5, { spin: 110 });                        // a spinning pod
    b.sweeper(90, 11, 3, { omega: -60 });                    // a shepherd moonlet orbits the landing
    b.plat(92, 7, 4);
    b.barrel(99, 9, { angle: 10, sweep: 20, spin: 2.6 });
    b.barrel(107, 9, { angle: 40, auto: true });
    b.shard(105, 11);                                        // in the air between the last two pods
    b.plat(120, 10, 10);
    b.goal(126, 10);
    b.cells(31, 3.5, 40, 2.5, 3); b.cells(43, 3, 52, 3, 3); b.cells(66, 6, 75, 5, 3); b.cells(86, 7.5, 92, 8.5, 2); b.cells(110, 11, 118, 11.5, 3);
  }),

  // 15 ── the ring plane dive: fall from the high ring on long zip lines through debris and lanes down to the slushy gas surface
  L('Ring Plane Dive', 'descent', (b) => {
    b.start(-6, 40, 12);
    b.blink(9, 37, 3, { P: 3, on: 2 }); b.crumble(14, 34, 2.4);
    b.stream('ring', 15, 40, 30.65, { speed: 6, spacing: 4.5 });   // deck 31.65
    b.cells(10, 38.5, 15, 35.5, 3); b.cells(20, 33.2, 36, 33.2, 4);
    b.zip(40, 33.6, 55, 21.5);
    b.cells(43, 30.5, 53, 22.5, 4);
    b.plat(55, 18, 6);
    b.checkpoint(58, 18);
    b.enemy('flyer', 64, 15, { ax: 1.5, ay: 1.5, T: 2.6 });
    b.stream('ring', 60, 92, 13.65, { speed: 7.5, spacing: 4.5 }); // deck 14.65
    b.cells(64, 16.2, 88, 16.2, 5);
    b.thin(74, 18.8, 4); b.shard(76, 20.4);
    b.zip(92, 16.6, 106, 6.2);
    b.wrecker(99, 19, 5.5, { amp: 45, T: 3.2 });
    b.cells(94, 14, 104, 7.5, 4);
    // the first touch of the gas surface: slick ice and slush rafts
    b.ice(106, 2, 10);
    b.sinker(118, 1.5, 3, { depth: 3 });
    b.ice(123, 1, 8);
    b.goal(128, 1);
    b.plat(36, 24, 3); b.shard(37.5, 26);                           // a debris ledge left of the first drop
    b.plat(99, 1, 3); b.shard(100.5, 2.8);                          // beneath the last cable
    b.plat(-14, 42, 3); b.cell(-12.5, 44);
  }),
  // ════════════════════════ THE GAS SURFACE ════════════════════════

  // 16 ── NEW: down on the gas, one toy at a time: a slush raft that sinks, a helium bubble that rises, a drifting cyclone, a geyser cannon
  L('Slush Landing', 'intro', (b) => {
    b.start(-6, 0, 12);
    b.ice(10, 0, 8);
    b.cells(11, 1.2, 17, 1.2, 3);
    b.sinker(20.5, 0, 3, { depth: 3, speed: 1.2 });
    b.shard(22, -1.8);                                     // ride the raft all the way down
    b.plat(27, 0, 4);
    b.floater(33, 0, 3, { rise: 6 });
    b.cells(34.5, 2, 34.5, 6, 3);
    b.plat(37.5, 6, 6);
    b.checkpoint(40, 6);
    // a cyclone wanders over the ice: slide into it
    b.ice(46, 3, 14);
    b.tornado(49, 57, 3, { rise: 2, T: 5 });
    b.thin(57, 11, 5);
    b.shard(53, 15.5);                                     // the cyclone's crest
    b.cells(48, 4.2, 58, 4.2, 4);
    b.sinker(64, 10, 3, { depth: 2.5 }); b.sinker(70, 10, 3, { depth: 2.5 });
    b.plat(75.5, 10, 5);
    b.barrel(82.5, 12, { angle: 35 });                     // a geyser cannon
    b.arc(83, 12.5, 96, 11.5, 4, 2.5);
    b.plat(94, 11, 9);
    b.goal(99, 11);
    b.cells(65.5, 11.2, 71.5, 11.2, 2);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 17 ── NEW: no floor at all: hexagon-storm cyclones wander between stumps; ride each one up and step off at its crest
  L('Cyclone Alley', 'bounce', (b) => {
    b.start(-6, 0, 12);
    b.tornado(10, 15, -1, { rise: 7.5, T: 4 });
    b.plat(17, 5, 3);
    b.cells(12, 2, 15, 6, 3);
    b.tornado(23, 29, 2, { rise: 8, T: 4.5, phase: 0.5 });
    b.thin(33, 12.5, 3); b.shard(34.5, 14.1);                                     // the second cyclone's crest
    b.plat(31, 9, 6);
    b.checkpoint(34, 9);
    // two cyclones, one stacked above the other
    b.tornado(39.5, 43, 3, { rise: 9, T: 5 });
    b.plat(44.5, 12, 3);
    b.tornado(49.5, 53, 12, { rise: 8, T: 4, phase: 0.5 });
    b.enemy('flyer', 47, 16.5, { ax: 1, ay: 1.2, T: 2.6 });
    b.cells(40, 8, 44, 14, 3);
    b.plat(56, 20, 4);
    // a slush raft, and the last cyclone over the drop
    b.sinker(62.5, 19, 3, { depth: 3 });
    b.tornado(68, 74, 13, { rise: 11, T: 4 });
    b.plat(69, 28, 3); b.shard(70.5, 29.8);                // above the last cyclone
    b.thin(76, 24, 4);
    b.plat(83, 24, 8);
    b.goal(88, 24);
    b.cells(63, 20.2, 65, 20.2, 2); b.cells(70, 16, 77, 25.2, 3);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 18 ── NEW: slush raft run: slide off slick ice under low roofs onto rafts that sink under you; never stop until the helium bubble
  L('Slush Raft Run', 'precision', (b) => {
    b.start(-6, 8, 12);
    b.ice(8, 8, 8);
    b.sinker(18.5, 7, 3, { depth: 3, speed: 2 });
    b.ice(24, 6, 6); b.rect(24, 8.4, 6, 0.6);              // a low roof: slide, don't jump
    b.sinker(32.5, 5, 3, { depth: 3, speed: 2 });
    b.sinker(38, 4, 3, { depth: 3, speed: 2 });
    b.plat(43, 4, 6);
    b.checkpoint(46, 4);
    b.cells(9, 9.2, 15, 9.2, 3); b.cells(25, 7.2, 29, 7.2, 2); b.cells(34, 6.2, 39.5, 5.2, 2);
    // second flight: longer ice, lightning, rafts sinking faster
    b.ice(52, 4, 10); b.rect(52, 6.4, 10, 0.6);
    b.beam('lightning', 57, 6.4, { P: 2.6, on: 0.8, h: 0.01 });
    b.sinker(64.5, 3, 2.6, { depth: 3, speed: 2.6 });
    b.sinker(70, 2, 2.6, { depth: 3, speed: 2.6 });
    b.ice(75, 1, 6);
    b.floater(81.5, 1, 3, { rise: 7 });
    b.plat(85, 8, 8);
    b.goal(90, 8);
    b.cells(53, 5, 61, 5, 3); b.cells(65.8, 4.2, 71.3, 3.2, 2); b.cells(83, 3, 83, 7, 3);
    b.plat(17, 1.5, 2.6); b.shard(18.3, 3.3);              // sink the first raft to reach it
    b.thin(76, 4.5, 3); b.shard(77.5, 6);
    b.plat(-14, 10, 3); b.shard(-12.5, 12);
  }),

  // 19 ── lightning walks across slick ice flats: the only rests are slush rafts that sink; then a cyclone up to the cloud deck
  L('Lightning Flats', 'timing', (b) => {
    b.start(-6, 0, 12);
    for (let i = 0; i < 5; i++) {
      b.ice(8 + i * 8, 0, 6);
      if (i % 2) b.sinker(14 + i * 8, 0, 2, { depth: 1.5, speed: 0.8 }); else b.plat(14 + i * 8, 0, 2);
      b.beam('lightning', 11 + i * 8, 0, { P: 3, on: 0.9, off: i * 0.6 });
    }
    b.cells(9, 1.2, 46, 1.2, 10);
    b.plat(50, 1, 6);
    b.checkpoint(53, 1);
    // raised flats: lightning above the ice, a cyclone to the cloud deck
    b.ice(59, 3, 8); b.beam('lightning', 63, 3, { P: 2.6, on: 0.8 });
    b.plat(67, 3, 2);
    b.tornado(70, 72.5, 3, { rise: 8, T: 3 });
    b.ice(73, 9, 10); b.beam('lightning', 76, 9, { P: 2.6, on: 0.8, off: 1 }); b.beam('lightning', 80, 9, { P: 2.6, on: 0.8, off: 1.8 });
    b.sinker(84.5, 8, 3, { depth: 2 });
    b.ice(89, 7, 6); b.beam('lightning', 92, 7, { P: 2.4, on: 0.8, off: 0.5 });
    b.plat(98, 5, 10);
    b.goal(104, 5);
    b.cells(60, 4.2, 66, 4.2, 3); b.cells(74, 10.2, 82, 10.2, 4);
    b.shard(27, 4.2);                                      // right under a strike point
    b.shard(71, 12.2);                                       // the cyclone's crest
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 20 ── CHASE: the Ring Shear follows you down to the surface. Slide, run the slush rafts, fire the cannon, take the cable, never stop
  L('Shear Front', 'chase', (b) => {
    b.chase({ speed: 4.4 });
    b.start(-6, 0, 14);
    b.ice(12, 0, 12); b.ice(28, -1, 8);
    b.vent(37.5, -1, 3);
    b.plat(40, 6, 5);
    b.ice(49, 5, 10); b.sinker(61.5, 4, 2.6, { depth: 3, speed: 2 }); b.sinker(66.5, 3, 2.6, { depth: 3, speed: 2 });
    b.plat(72, 3, 6);
    b.checkpoint(75, 3);
    b.barrel(79.5, 5, { angle: 55, power: 20 });           // a geyser cannon
    b.ice(84, 8, 12);
    b.vent(98, 6, 2);
    b.plat(100, 12, 4);
    b.zip(103.5, 14.4, 116, 11.2);
    b.ice(116, 9, 8);
    b.plat(127, 8, 10);
    b.goal(134, 8);
    b.cells(13, 1.2, 35, 0.2, 7); b.cells(50, 6.2, 70, 4.2, 6); b.cells(85, 9.2, 95, 9.2, 5); b.cells(106, 12, 114, 10.5, 3);
    b.shard(37.5, 11.5); b.shard(90, 12.5);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 21 ── the polar hexagon: climb its outer rim on ice and a helium bubble, ride a hex orbit inward, then time the eye past its spinning gust bar
  L('Hexagon Spiral', 'ascent', (b) => {
    b.start(-6, 0, 12);
    b.ice(10, 2, 18);                                       // bottom edge
    b.thin(29.5, 5, 3); b.thin(31.5, 8.5, 3); b.thin(33, 12, 3);      // lower-right edge
    b.floater(30.5, 14, 3, { rise: 8 });                    // upper-right edge: a helium bubble
    b.beam('lightning', 32.6, 8.5, { P: 3, on: 0.8, h: 7 });
    b.ice(22, 26, 5); b.ice(13, 26, 5);                     // top edge, split by the eye
    b.checkpoint(24.5, 26);
    // the inner orbit: a small hexagon turning inside the big one
    b.loop([[26, 14], [23, 19.2], [17, 19.2], [14, 14], [17, 8.8], [23, 8.8]], { speed: 3, w: 2.6 });
    b.plat(17.5, 13, 2.4); b.shard(18.7, 14.8);             // the hub
    b.vent(20.6, 13, 8);                                    // the eye: a column straight up through the gap
    b.sweeper(20.3, 14.2, 3, { omega: 50 });                // its gust bar
    b.plat(24, 33, 8);
    b.goal(29, 33);
    b.cells(12, 3.2, 26, 3.2, 5); b.cells(31, 6.5, 33, 13.5, 3); b.cells(32, 16, 32, 22, 3); b.cells(26, 27.5, 14, 27.5, 4); b.cells(20.6, 18, 20.6, 28, 4);
    // the lower-left rim hides a shard
    b.thin(8, 5.5, 2.4); b.thin(6, 9, 2.4); b.thin(5, 12.5, 2.4); b.shard(6.2, 14.4);
    b.thin(13.5, 30, 3); b.shard(15, 31.6);                 // above the top-left edge
  }),

  // 22 ── catch the jet stream: a cyclone lifts you into a river of wind; a headwind runway of sinking slush; a bubble to rest on in the second jet
  L('Jet Stream', 'wind', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 4);
    b.tornado(13.5, 17, -2, { rise: 3, T: 3.5 });
    b.wind(12, 8, 30, 5, 10, { gust: true, P: 3, on: 2.2 });   // the jet stream band
    b.cells(14, 4, 15, 8, 2); b.cells(18, 10.5, 36, 10.5, 6);
    b.plat(40, 7, 6);
    b.checkpoint(43, 7);
    // headwind runway: the wind shoves you back across slick ice and sinking slush
    b.ice(50, 7, 8);
    b.sinker(58.5, 7, 3, { depth: 2.5, speed: 1.2 });
    b.ice(62, 7, 6);
    b.wind(50, 7, 18, 6, -7, { P: 4, on: 2 });
    b.cells(51, 8.2, 66, 8.2, 6);
    b.thin(57, 11.2, 4); b.shard(59, 12.8);
    b.plat(70, 8, 3); b.vent(74.5, 8, 4);
    b.wind(73, 13, 32, 7, 10, { gust: true, P: 3.4, on: 2.4, off: 1 });
    b.cells(74.5, 11, 74.5, 15, 2); b.cells(78, 17, 84, 17, 3); b.cells(90, 17, 98, 17, 3);
    b.floater(85, 11, 3, { rise: 5, speed: 1.6 });         // a helium bubble to catch your breath on
    b.plat(102, 13, 8);
    b.goal(107, 13);
    b.plat(26, 4, 3); b.shard(27.5, 5.8);                    // a cloud island beneath the first jet
    b.shard(86.5, 21);                                       // ride the bubble high in the second jet
  }),

  // 23 ── the haze rises: a sinking raft, a chimney, a draft and a helium bubble, climbing before the gas swallows you
  L('Rising Haze', 'tide', (b) => {
    b.rise({ rate: 0.7, delay: 4 });
    b.start(-6, 0, 12);
    b.tower(6, -4, 22, 46);
    b.plat(8, 3, 4); b.sinker(14, 6, 4, { depth: 2 });
    b.plat(18.8, 9, 3);
    b.wall(18, 10, 11); b.wall(21.8, 12, 9);               // chimney
    b.cells(20.3, 11, 20.3, 19, 3);
    b.plat(9, 21, 9);
    b.checkpoint(13, 21);
    b.vent(7.4, 21, 4);                                     // step off the left end into the draft
    b.plat(9.4, 29, 4);
    b.floater(15, 29, 3, { rise: 7, speed: 2.5 });          // a helium bubble up the middle
    b.ice(9, 35.5, 5);
    b.thin(16, 39, 4);
    b.plat(21, 42, 5);
    b.plat(30, 42, 8);
    b.goal(35, 42);
    b.cells(7.4, 24, 7.4, 30, 3); b.cells(10, 30.5, 13, 30.5, 2); b.cells(16.5, 31, 16.5, 35, 3); b.cells(10, 36.8, 12, 36.8, 2);
    b.plat(23, 15, 3); b.shard(24.5, 16.8);                 // a ledge outside the chimney
    b.shard(7.4, 33.5);                                     // the draft's crest
    b.thin(3, 39, 3); b.shard(4.5, 40.6);
  }),

  // 24 ── NEW: a battery of gas-geyser cannons that blow by themselves: pick your cannon, ride the blast over lightning, then aim the rocking and spinning ones
  L('Geyser Cannon Battery', 'cannon', (b) => {
    b.start(-6, 0, 12);
    b.ice(8, 0, 10);
    b.barrel(21, 1.8, { angle: 45, auto: true });
    b.plat(31, 3, 6);
    b.beam('lightning', 34, 3, { P: 3, on: 0.8 });
    b.barrel(40, 6, { angle: 70, auto: true });
    b.plat(44, 9, 4);
    b.plat(50, 9, 6);
    b.checkpoint(53, 9);
    b.plat(28, -3, 3); b.shard(29.5, -1.2);                 // below the first blast
    // the aimed cannons
    b.barrel(59, 10.5, { angle: 45, sweep: 30, spin: 2.2 });
    b.plat(70, 12, 4);
    b.plat(64, 16, 3); b.shard(65.5, 17.8);                 // the rocking cannon's steepest shot
    b.barrel(78, 14, { spin: 100 });
    b.rect(84, 8, 1.6, 4); b.turret(84.8, 11, -1, { P: 2.4 });   // a battery turret under the landing
    b.plat(88, 14, 4);
    // the last salvo: cannon into cannon
    b.barrel(95, 15.5, { angle: 10, auto: true });
    b.barrel(104, 13, { angle: 35, auto: true });
    b.shard(101, 17);
    b.beam('lightning', 99, 12, { P: 2.8, on: 0.8, h: 2 });
    b.plat(117, 14, 10);
    b.goal(123, 14);
    b.cells(9, 1.2, 17, 1.2, 3); b.cells(23, 4, 30, 5, 3); b.cells(61, 12, 69, 13.5, 3); b.cells(80, 15.5, 88, 15.5, 3); b.cells(110, 16, 116, 15.5, 3);
  }),

  // 25 ── switches on the polar ice: every landing flips red and blue, a slush raft sinks under the stairs, a bubble carries you home
  L('Polar Switchback', 'puzzle', (b) => {
    b.start(-6, 0, 12);
    b.ice(8, 0, 16);
    b.redWall(24, 0, 5);
    b.thin(12, 3.6, 4); b.switch(13.3, 3.6);               // flip from the ledge above the ice
    b.plat(24, 0, 6);
    b.blue(32, 2, 3); b.sinker(37, 4, 3, { depth: 2.5 });
    b.ice(42, 5, 12); b.switch(52, 5);                      // slide to a stop on the button (or overshoot)
    b.red(56, 7, 3);
    b.plat(61, 8, 5);
    b.checkpoint(63, 8);
    // the switchback: the ledges you need alternate colour as you climb back left
    b.switch(64, 8);
    b.blue(56, 11, 3); b.plat(50, 13, 3); b.switch(50.8, 13);
    b.red(56, 16, 3); b.plat(62, 18, 3); b.switch(62.8, 18);
    b.blue(67, 20, 3);
    b.ice(72, 20, 6);
    b.wrecker(76, 28, 5.5, { amp: 50, T: 3.2 });             // a hailstone on a tether swings over the ice
    b.floater(79, 19, 3, { rise: 4 });
    b.plat(84, 23, 8);
    b.goal(89, 23);
    b.cells(9, 1.2, 22, 1.2, 5); b.cells(33, 3.4, 39, 5.4, 3); b.cells(43, 6.2, 51, 6.2, 4); b.cells(57, 12.4, 63, 19.4, 4); b.cells(80.5, 21, 80.5, 23, 2);
    b.blue(43, 9.5, 3); b.shard(44.5, 11.3);                // only solid while blue
    b.red(70, 24, 3); b.shard(71.5, 25.8);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 26 ── NEW: helium caverns: a two-storey ammonia cave; bubbles float you up the shafts, a slush raft drops you to the low road, a cyclone in the dome
  L('Helium Caverns', 'maze', (b) => {
    b.start(-6, 0, 12);
    b.ice(8, 0, 14);                                        // the tunnel floor
    b.rect(8, 3.5, 14, 1);                                  // tunnel roof
    b.floater(22.5, 0, 3, { rise: 4.5 });                   // a bubble up through the gap
    b.ice(26, 4.5, 12);                                     // the gallery floor
    b.rect(6, 9, 36, 1);                                    // the cave roof
    b.enemy('walker', 27, 4.5, { range: 8, speed: 2 });
    b.cells(10, 1.2, 21, 1.2, 4); b.cells(24, 2, 24, 4.5, 2); b.cells(27, 5.7, 36, 5.7, 4);
    b.shard(9.5, 6.3);                                      // the dead end at the back of the gallery (on the tunnel roof)
    // the gallery mouth: a slush raft sinks to the low road, or leap for the high ledge
    b.sinker(38.5, 4.5, 3, { depth: 5 });
    b.plat(43, -1, 4); b.plat(43, 4.5, 3);
    b.plat(50, 1, 6);
    b.checkpoint(53, 1);
    // the chimney shaft: two bubbles, alcoves on the walls
    b.plat(56, 1, 8.6);
    b.wall(56, 3.2, 17); b.wall(64.6, 1, 19);
    b.floater(57, 1, 3, { rise: 8 });
    b.floater(61, 9.5, 3, { rise: 9 });
    b.plat(56.8, 12, 1.8); b.shard(57.7, 13.8);             // a left-wall alcove
    b.cells(58.5, 4, 58.5, 9, 3); b.cells(62.5, 12, 62.5, 19, 3);
    b.rect(54, 27, 14, 1);
    b.plat(64.6, 21, 7);
    // the dome: a cyclone drifts over the drop
    b.tornado(75, 78.5, 14, { rise: 10, T: 4 });
    b.rect(70, 33, 26, 1);
    b.plat(80.5, 23, 8);
    b.goal(86, 23);
    b.cells(73, 23, 80, 25, 4);
    b.plat(46, -5, 3); b.shard(47.5, -3.2);                 // under the low road
  }),

  // 27 ── hailstone drop: switchback down a storm shaft of ice shelves; hailstones swing on tethers, hail falls, slush rafts at the bottom
  L('Hailstone Drop', 'descent', (b) => {
    b.start(-6, 30, 12);
    b.ice(6, 26, 12);
    b.ice(14, 21, 16); b.wall(30, 21, 4.5);
    b.ice(2, 16, 16); b.wall(1.2, 16, 4.5);
    b.ice(14, 11, 16); b.wall(30, 11, 4.5);
    b.meteor(12, 26, { P: 2.6 }); b.meteor(8, 16, { P: 2.4, off: 1 });
    b.wrecker(22, 29.5, 5.5, { amp: 50, T: 3 });            // a hailstone on a tether over the second shelf
    b.wrecker(10, 24.5, 5.5, { amp: 50, T: 3, phase: 0.5 });
    b.beam('lightning', 21, 11, { P: 2.6, on: 0.8, h: 4, off: 1.3 });
    b.plat(2, 6, 8);
    b.checkpoint(5, 6);
    b.cells(8, 27.2, 16, 27.2, 3); b.cells(17, 22.2, 28, 22.2, 4); b.cells(4, 17.2, 15, 17.2, 4); b.cells(17, 12.2, 28, 12.2, 4);
    b.shard(30.4, 27);                                      // on top of the first brake wall
    b.thin(-4, 10, 3); b.shard(-2.5, 11.6);                 // out in the void left of the shaft
    // out the bottom over sinking slush
    b.sinker(13, 4, 2.6, { depth: 2.5 }); b.sinker(18.5, 2.5, 3, { depth: 2.5 }); b.sinker(24.5, 1, 2.6, { depth: 2.5 });
    b.meteor(20, 2.5, { P: 2.8, off: 0.5 });
    b.cells(14, 5.4, 25, 2.4, 4);
    b.ice(30, 0, 6); b.plat(39, 0, 8);
    b.goal(44, 0);
    b.plat(36, -4, 2); b.shard(37, -2.2);                   // a stub below the last gap
  }),

  // 28 ── gale pinball: slide off ice ledges onto springs, rocking and spinning geyser cannons that ricochet you higher under bumper ceilings
  L('Gale Pinball', 'bounce', (b) => {
    b.start(-6, 6, 12);
    b.ice(8, 6, 8);
    b.plat(17.5, 0, 3); b.spring(18.1, 0, 9);
    b.ice(22, 10, 8);
    b.plat(31.5, 4, 3);
    b.barrel(33, 6.5, { angle: 80, sweep: 20, spin: 2.5 }); // a rocking cannon: the flipper
    b.rect(30, 18, 6, 0.8);                                 // a bumper: drift right off it
    b.ice(37, 15, 8);
    b.checkpoint(41, 15);
    b.cells(16, 5, 19, 7, 2); b.cells(23, 11.2, 29, 11.2, 3); b.cells(33.5, 9, 33.5, 15, 3);
    // second table: a gust lane, a spring and a spinning cannon
    b.plat(46.5, 9, 3); b.spring(47.1, 9, 6);
    b.wind(45, 16, 14, 6, 9, { gust: true, P: 3, on: 2 });
    b.ice(58, 17, 6);
    b.enemy('flyer', 52, 19, { ax: 2, ay: 1, T: 2.6 });
    b.plat(65.5, 11, 3);
    b.barrel(67, 13.5, { spin: 120 });                     // the spinner
    b.rect(64, 25, 8, 0.8);
    b.ice(71, 21, 6);
    b.plat(80, 18, 8);
    b.goal(85, 18);
    b.shard(33.6, 20.2);                                    // on top of the first bumper
    b.shard(68, 27.2);                                      // on top of the last bumper
    b.plat(10, 1, 3); b.shard(11.5, 2.8);                   // down under the first slide
  }),

  // 29 ── HARD: the eye of the hexagon storm: lightning over sinking slush, wandering cyclones under ceilings, a headwind runway, twin hex orbits split by a gust bar
  L('Eye of the Hexagon', 'gauntlet', (b) => {
    b.start(-6, 0, 12);
    for (let i = 0; i < 4; i++) {
      if (i % 2) b.sinker(9 + i * 7, i % 2, 3, { depth: 2, speed: 1.6 }); else b.ice(9 + i * 7, i % 2, 3);
      b.beam('lightning', 10.5 + i * 7, i % 2, { P: 2.6, on: 0.8, off: i * 0.65, h: 7 });
    }
    b.cells(10.5, 2, 31.5, 3, 4);
    // cyclone hops under ceilings with sentries
    b.plat(36, 1, 2);
    b.tornado(39.5, 42, -1, { rise: 8.5, T: 3 }); b.rect(38, 11, 6, 0.8);
    b.thin(44, 8, 2.4);
    b.tornado(47, 49.5, 4, { rise: 7.5, T: 3, phase: 0.5 }); b.rect(46, 15, 5, 0.8);
    b.thin(51, 12, 2.4);
    b.enemy('flyer', 46, 9, { ax: 1, ay: 2, T: 2.2 });
    b.plat(56, 10, 5);
    b.checkpoint(58.5, 10);
    // the headwind runway with blinking refuges
    b.ice(64, 10, 20);
    b.wind(64, 10, 20, 6, -8, { P: 3.6, on: 1.8 });
    b.blink(68, 13.5, 2.4, { P: 3, on: 1.8 }); b.blink(76, 13.5, 2.4, { P: 3, on: 1.8, off: 1.5 });
    b.cells(66, 11.2, 82, 11.2, 5);
    // the eye: two hexagonal orbits split by a gust bar, a turret watching from the far wall
    const hex = (cx, cy, r) => [0, 1, 2, 3, 4, 5].map((k) => [cx + Math.cos(k * Math.PI / 3) * r, cy + Math.sin(k * Math.PI / 3) * r * 0.8]);
    b.loop(hex(94, 10, 6), { speed: 3.4, w: 2.6 });
    b.loop(hex(108, 12, 6).reverse(), { speed: 3.4, w: 2.6 });
    b.sweeper(101, 19, 3, { omega: 70 });
    b.rect(118, 6, 1.6, 12); b.turret(118.8, 14, -1, { P: 2.4 });
    b.plat(113, 22, 4); b.shard(115, 24);                    // above the second orbit
    b.plat(119.6, 17, 4);
    b.barrel(126, 18.5, { spin: 120 });                      // a spinning cannon off the wall
    b.plat(136, 12, 10);
    b.goal(142, 12);
    b.cells(90, 16, 112, 16, 6);
    b.shard(52.2, 13.6);                                       // in the second cyclone, under its ceiling
    b.shard(94, 10);                                         // the dead centre of the first orbit
  }),

  // 30 ── FINALE: ring lanes, a wheel, tethered chunks and a zip dive to the slick surface, then the Ring Shear chases you over slush and cannons
  L('Lord of the Rings', 'finale', (b) => {
    b.start(-6, 20, 12);
    // the rings
    b.stream('ring', 3, 30, 17.65, { speed: 6.5, spacing: 4.5 });   // deck 18.65
    b.cells(8, 20.2, 26, 20.2, 4);
    b.plat(30.5, 19.45, 4);
    b.ferris(42, 18, 5.5, { n: 4, omega: 0.7, w: 2.6 });
    b.shard(42, 18);                                                 // ...in the wheel's hub (jump through)
    b.plat(50, 21, 4);
    b.pendulum(58, 26, 6, { amp: 30, T: 3.4 });
    b.pendulum(65, 23, 6, { amp: 30, T: 3.4, phase: 0.5 });
    b.cells(51, 22.4, 65, 18.4, 5);
    // the dive
    b.zip(67.5, 19.5, 80, 7);
    b.ice(79, 3, 10);
    b.vent(91, 2, 3);
    b.plat(93, 8, 6);
    b.checkpoint(96, 8);
    // the chase across the gas
    b.chase({ speed: 4.5, trigger: 97, behind: 14 });
    b.ice(103, 8, 12);
    b.beam('lightning', 109, 8, { P: 2.4, on: 0.7, h: 7 });
    b.sinker(117.5, 7, 2.6, { depth: 3, speed: 2 }); b.sinker(122.5, 6, 2.6, { depth: 3, speed: 2 });
    b.plat(127, 6, 3);
    b.barrel(131.5, 8, { angle: 60, power: 20 });
    b.plat(135, 12, 3);
    b.stream('ring', 138, 166, 9.65, { speed: 8.5, spacing: 3.6 }); // deck 10.65: a stray ring lane, low over the gas
    b.cells(142, 12.4, 162, 12.4, 5);
    b.barrel(169, 13, { angle: 30, auto: true });
    b.plat(180, 15, 12);
    b.goal(187, 15);
    b.cells(104, 9.2, 114, 9.2, 4); b.cells(70, 16.5, 78, 9, 3);
    b.shard(152, 15.6);                                             // a leap from the last lane
    b.plat(-14, 22, 3); b.shard(-12.5, 24);
  }),
];
