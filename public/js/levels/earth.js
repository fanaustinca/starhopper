// WORLD 4 — EARTH. A world tour: 10 cities × 3 levels, all hand-written.
// Units (g = 1.0): single jump ≈ 2.45 high / 6 far, double ≈ 4.4 high / 10 far, run 8.5/s.
// Vehicle decks above laneY: bus 0.5 / 2.6 / 4.6, car 1.35, taxi 1.4, truck 3.2 (cab 2.5),
// boat 1.0 (cabin roof 2.6), plane 1.6. Every level has its own idea; see the comment above each.
import { L } from './dsl.js';

export default [
  // ════════════════════════════ LONDON ════════════════════════════

  // 91 ── intro: hop the rooftops, drop onto your first double-decker over Westminster Bridge,
  //        then tick-tock blinkers up to Big Ben
  L('Westminster Express', 'intro', (b) => {
    b.start(-6, 0, 14);
    b.arc(8, 0, 11, 1.5, 2, 1.5);
    b.plat(11, 1.5, 4);
    b.plat(18, 3, 3);
    b.plat(24, 4, 8);                                   // bus-stop shelter roof: the overpass
    b.cells(25, 5, 30, 5, 3);
    b.stream('bus', 30, 72, -2, { speed: 3.2 });       // top deck at 2.6
    b.cells(34, 3.8, 66, 3.8, 8);
    b.thin(47, 6.4, 3); b.shard(48.5, 7.9);             // jump up off the roof of the bus
    b.plat(70, 3.4, 9);
    b.checkpoint(74, 3.4);
    b.block(83, 5, 4);
    b.blink(91, 6, 3, { P: 3, on: 2 });
    b.blink(96.5, 7, 3, { P: 3, on: 2, off: 1.5 });
    b.cells(92.5, 7.2, 98, 8.2, 3);
    b.block(102, 8, 5);
    b.shard(104.5, 11.8);
    b.plat(111, 6, 10);
    b.goal(117, 6);
    b.plat(-14, 2, 3); b.shard(-12.5, 4);
  }),

  // 92 ── Routemasters have an open rear platform: chase the bus from the kerb, board at the back,
  //        climb up through the decks while it drives — and stay inside under the low railway bridge
  L('Hop-On at the Back', 'vehicle', (b) => {
    b.start(-6, 0, 12);
    b.stream('bus', 16, 56, -0.5, { speed: 3 });        // decks 0 / 2.1 / 4.1
    b.cells(10, 0.8, 14, 0.8, 3);
    b.cells(20, 2.9, 24, 2.9, 2); b.cells(28, 4.9, 44, 4.9, 5);
    b.enemy('flyer', 38, 7.4, { ax: 3, ay: 0.6, T: 3 });
    b.plat(54, 5, 6);
    b.checkpoint(57, 5);
    b.plat(62, 0, 5);                                   // the next kerb
    b.stream('bus', 76, 120, -0.5, { speed: 3.2 });
    b.rect(88, 4.2, 10, 2);                             // low railway bridge: top-deck riders get swept off
    b.cells(84, 2.9, 87, 2.9, 2); b.shard(93, 3.0); b.cells(96, 2.9, 99, 2.9, 2);
    b.shard(93, 7.4);                                   // ...or leap the bridge from the top deck
    b.cells(104, 4.9, 112, 4.9, 3);
    b.plat(118, 6, 9);
    b.goal(123, 6);
    b.plat(-13, -1.5, 3); b.shard(-11.5, 0.5);
  }),

  // 93 ── climb inside the clock tower: a swinging pendulum, chiming blinkers, then ride the
  //        turning hands of the clock face to the belfry
  L('Big Ben Belfry', 'ascent', (b) => {
    b.start(-6, 0, 12);
    b.tower(2, -2, 26, 38);
    b.plat(9, 1.5, 4); b.plat(17, 3, 4); b.plat(24, 5.5, 4);
    b.loop([[22, 7.5], [16, 6.2], [10, 7.5]], { speed: 2.6, loop: false, w: 2.6 });   // pendulum
    b.shard(16, 7.4);
    b.plat(4, 10.5, 4);
    b.blink(11, 13, 3, { P: 3.2, on: 2.2 });
    b.blink(16.5, 15.5, 3, { P: 3.2, on: 2.2, off: -0.8 });
    b.enemy('flyer', 9, 16, { ax: 2, ay: 1, T: 3.4 });
    b.plat(22, 18, 4);
    b.checkpoint(24, 18);
    b.ferris(15, 24.5, 5, { n: 4, omega: 0.5, w: 2.4 });   // the clock hands
    b.shard(15, 24.5);
    b.plat(3, 28.5, 5);
    b.thin(-3, 31, 3); b.shard(-1.5, 32.6);
    b.crumble(10, 32.5, 2.4); b.crumble(15, 34, 2.4);
    b.plat(20, 35, 8);
    b.goal(25, 35);
    b.cells(10, 3, 26, 7, 4); b.cells(5, 12, 18, 17, 4); b.cells(4, 30, 16, 35.5, 4);
  }),

  // ════════════════════════════ NEW YORK ════════════════════════════

  // 94 ── walk the High Line; where it's broken, drop onto the yellow cabs below, dodge the manhole
  //        steam while riding and hop back up
  L('Fifth Avenue Taxi Hop', 'vehicle', (b) => {
    b.start(-6, 3, 12);
    b.stream('taxi', 4, 104, 0, { speed: 4, spacing: 9 });   // cab roofs at 1.4
    b.plat(18, 3, 8);
    b.beam('steam', 33, 0, { h: 2.6, P: 3, on: 1 });
    b.plat(40, 3, 6);
    b.blink(50, 5, 2.5, { P: 3, on: 1.8 }); b.blink(55, 6.5, 2.5, { P: 3, on: 1.8, off: 1 });   // WALK signals
    b.shard(56.2, 8.3);
    b.enemy('flyer', 52, 2.6, { ax: 2.5, ay: 0.5, T: 3 });
    b.plat(58, 3, 8);
    b.checkpoint(62, 3);
    b.beam('steam', 71, 0, { h: 2.6, P: 3, on: 1 });
    b.beam('steam', 78, 0, { h: 2.6, P: 3, on: 1, off: 1.5 });
    b.shard(74.5, 2.3);                                       // between the vents, at cab-roof height
    b.plat(84, 3, 5);
    b.enemy('flyer', 95, 3.2, { ax: 3, ay: 0.8, T: 2.6 });
    b.plat(101, 3, 12);
    b.goal(108, 3);
    b.cells(8, 2.4, 16, 2.4, 3); b.cells(28, 2.4, 38, 2.4, 3); b.cells(68, 2.4, 82, 2.4, 5); b.cells(90, 2.4, 99, 2.4, 3);
    b.plat(-12, 7, 2.5); b.shard(-10.75, 9);
  }),

  // 95 ── scale the art-deco setbacks: an exterior lift, a wall-jump chimney, an elevator under a
  //        security turret, then rungs around the spire with biplanes buzzing
  L('Empire State Setbacks', 'ascent', (b) => {
    b.start(-6, 0, 12);
    b.lift(9.5, 0, 6.2, { T: 4, w: 2.6 });
    b.block(12, 6, 34);                                 // tier 0
    b.wall(14.2, 6, 9);                                 // chimney with the tier-1 face
    b.thin(8.5, 12, 2); b.shard(9.5, 13.5);
    b.block(18, 14, 22);                                // tier 1
    b.checkpoint(30, 14);
    b.block(24, 24, 10);                                // tier 2
    b.turret(23.8, 14.8, -1, { P: 2.4 });
    b.lift(21, 14, 24.2, { T: 5, w: 2.6 });
    b.spring(44, 6, 8.5); b.enemy('walker', 41, 6, { range: 3 }); b.shard(45, 7.2);
    b.thin(24.5, 27.5, 2.6); b.thin(24, 31, 2);
    b.thin(19, 33, 2.5); b.shard(20.25, 34.5);
    b.block(27.5, 33, 3);                               // the spire
    b.enemy('flyer', 22, 37, { ax: 4, ay: 1, T: 4 });
    b.enemy('flyer', 34, 30, { ax: 3, ay: 2, T: 3.4 });
    b.goal(29, 33);
    b.cells(16.6, 8, 16.6, 13, 3); b.cells(19, 16, 19, 22, 3); b.cells(26, 25, 26, 32, 3);
  }),

  // 96 ── harbor hopping: drop from the pier onto a slow ferry, cross the rotten crumbling jetty,
  //        catch a fast water taxi to Liberty Island and climb the statue to the torch
  L('Liberty Ferry Line', 'vehicle', (b) => {
    b.start(-6, 4, 12);
    b.stream('boat', 4, 44, 0, { speed: 3, spacing: 13 });   // deck 1.0, cabin roof 2.6
    b.shard(20, 6.6);
    b.enemy('flyer', 27, 5.5, { ax: 2, ay: 1, T: 3 });
    b.plat(44, 3, 5);
    b.checkpoint(46, 3);
    b.pool(49, 3, 13, 'water');
    b.crumble(52, 3, 2.4); b.crumble(57, 3.5, 2.4);
    b.shard(54.6, 3.1);                                      // low over the water between the planks
    b.plat(62, 4, 4);
    b.stream('boat', 66, 96, 0, { speed: 4.5, spacing: 15 });
    b.enemy('flyer', 80, 4.6, { ax: 3, ay: 0.6, T: 2.4 });
    b.block(96, 4, 12);                                      // pedestal
    b.lift(98, 4, 10.2, { T: 4, w: 2.6 });
    b.block(100, 10, 6);
    b.thin(106.5, 13.5, 2.5); b.thin(102, 17, 2.5);
    b.thin(98.5, 20, 2); b.shard(99.5, 21.5);               // the crown
    b.plat(106, 20.5, 4);                                    // the torch
    b.goal(108, 20.5);
    b.cells(8, 3.6, 40, 3.6, 8); b.cells(68, 3.6, 92, 3.6, 6); b.cells(103, 11, 107, 15, 3);
  }),
  // ════════════════════════════ SAN FRANCISCO ════════════════════════════

  // 97 ── the crookedest street: a descent that zig-zags right, left, right down stair-stepped
  //        switchbacks, each tier tucked under the last, to a car crossing at the bottom
  L('Lombard Switchbacks', 'descent', (b) => {
    b.start(-6, 24, 12);
    for (let i = 0; i < 7; i++) b.plat(6 + i * 3, 24 - i * 0.7, 3);        // tier A, heading right
    b.plat(27, 19.5, 5);
    b.enemy('spiker', 28, 19.5, { range: 3, speed: 1.4 });
    b.plat(30, 15.5, 6);
    for (let j = 0; j < 7; j++) b.plat(24 - j * 3, 14.8 - j * 0.7, 3);     // tier B, heading left
    b.thin(14, 16.5, 3); b.shard(15.5, 18);                              // tucked between the tiers
    b.plat(0, 10, 6);
    b.checkpoint(3, 10);
    b.plat(-4, 6, 6);
    b.plat(-10, 2.5, 2.5); b.shard(-8.75, 4.2);
    for (let k = 0; k < 8; k++) b.plat(2 + k * 3, 5.3 - k * 0.7, 3);       // tier C, heading right
    b.enemy('walker', 8, 4.6, { range: 2 });
    b.stream('car', 28, 58, -3, { speed: 4.5, spacing: 10 });            // roofs at -1.65
    b.plat(56, -0.8, 10);
    b.goal(62, -0.8);
    b.thin(-12, 27, 3); b.shard(-10.5, 28.6);
    b.cells(8, 25, 26, 21, 6); b.cells(25, 16, 7, 12, 6); b.cells(4, 6.5, 24, 1.8, 6); b.cells(32, -0.6, 52, -0.6, 4);
  }),

  // 98 ── ride the cable cars up and over Nob Hill: diagonal cars on steeper and steeper tracks,
  //        stair-stepped crests between them, gulls in the wires
  L('Powell Street Cable Cars', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 1, 3); b.plat(11, 1.8, 3); b.plat(14, 2.6, 3); b.plat(17, 3.4, 4);
    b.loop([[24, 3.4], [40, 11]], { loop: false, speed: 3, w: 3.6 });
    b.plat(43, 11, 5);
    b.thin(44, 15, 3); b.shard(45.5, 16.6);
    b.loop([[51, 11], [64, 19]], { loop: false, speed: 2.6, w: 3 });
    b.plat(67, 19, 4);
    b.checkpoint(69, 19);
    b.loop([[74, 19], [92, 8]], { loop: false, speed: 3.4, w: 3 });
    b.enemy('flyer', 83, 16.5, { ax: 2.5, ay: 1, T: 3 });
    b.plat(95, 8, 4);
    b.plat(91, 4, 2.5); b.shard(92.2, 5.6);
    b.loop([[102, 8], [108, 18]], { loop: false, speed: 2, w: 2.6 });
    b.plat(111, 18, 9);
    b.goal(115, 18);
    b.shard(119, 22);
    b.cells(25, 5, 39, 12, 5); b.cells(52, 12.5, 63, 20, 4); b.cells(76, 20, 90, 10, 5); b.cells(103, 10, 107, 18, 3);
  }),

  // 99 ── the Golden Gate: ride trucks across the deck, but the far tower's portal is too low —
  //        climb the sagging main cable over it (or the near tower's chimney for a shard)
  L('Golden Gate Fog Run', 'vehicle', (b) => {
    b.start(-6, 4.6, 12);
    b.stream('truck', 4, 124, 0, { speed: 3.5, spacing: 16 });           // trailer roofs at 3.2
    b.rect(30, 7, 1, 22); b.rect(33.9, 7, 1, 19);                        // near tower: a chimney
    b.shard(32.5, 31);
    const down = [[37, 23.5], [42, 21], [47, 18.5], [52, 16], [57, 13.5], [62, 11]];
    for (const [x, y] of down) b.thin(x, y, 2.5);
    b.shard(66, 13);
    b.thin(67, 7.4, 3);                                                  // the cable's low point
    const up = [[72, 9.5], [76.5, 11.5], [81, 13.5], [85.5, 15.5]];
    for (const [x, y] of up) b.thin(x, y, 2.5);
    b.rect(89, 4.5, 6, 13);                                              // far tower: low portal
    b.checkpoint(92, 17.5);
    b.thin(97, 14, 2.5); b.thin(101.5, 11, 2.5); b.thin(106, 8, 2.5);
    b.enemy('flyer', 55, 17, { ax: 3, ay: 1, T: 3.4 });
    b.enemy('flyer', 79, 15, { ax: 2, ay: 1.5, T: 2.8 });
    b.plat(122, 4.2, 10);
    b.goal(128, 4.2);
    b.plat(-14, 6.5, 3); b.shard(-12.5, 8.5);
    b.cells(8, 4.6, 28, 4.6, 5); b.cells(38, 25, 63, 12.5, 6); b.cells(68, 8.6, 86, 16.8, 5); b.cells(110, 4.6, 120, 4.6, 3);
  }),

  // ════════════════════════════ LOS ANGELES ════════════════════════════

  // 100 ── CHASE: the 405 at a standstill. Sprint across bumper-to-bumper car roofs, truck trailers
  //         and a crawling bus line while the Traffic Jam rolls up behind you
  L('405 Gridlock', 'chase', (b) => {
    b.chase({ speed: 4.2 });
    b.start(-6, 2.8, 14);
    b.stream('car', 8, 40, 0, { speed: 2, spacing: 4.8 });               // roofs at 1.35
    b.plat(40, 2.4, 3);
    b.crumble(44.5, 4.2, 2);
    b.plat(50, 5.6, 6);
    b.checkpoint(52, 5.6);
    b.stream('truck', 58, 90, 1, { speed: 2.5, spacing: 10 });           // trailers at 4.2
    b.thin(70, 8.2, 3); b.shard(71.5, 9.7);                              // gantry sign
    b.plat(88, 5.2, 4);
    b.crumble(95, 6, 2.4); b.crumble(100, 7, 2.4);
    b.plat(104, 7.5, 4);
    b.stream('bus', 108, 140, 1.5, { speed: 2.2, spacing: 8.6 });        // decks 2 / 4.1 / 6.1
    b.shard(124, 2.9);                                                   // down in the lower deck
    b.plat(138, 7, 12);
    b.goal(146, 7);
    b.plat(-14, 3.5, 3); b.shard(-12.5, 5.5);
    b.cells(10, 2.4, 38, 2.4, 7); b.cells(60, 5.2, 86, 5.2, 7); b.cells(110, 7.1, 136, 7.1, 7);
  }),

  // 101 ── a Hollywood backlot stunt run: crumbling western facades, airbag springs over the set
  //         walls, a camera dolly under stamping props, then a car-chase scene
  L('Backlot Stunt Double', 'gauntlet', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 24);
    b.wall(14, 0, 3.6);
    b.thin(9, 6, 3); b.shard(10.5, 7.5);
    b.crumble(17, 3.4, 2.5);
    b.enemy('walker', 18, 0, { range: 8 });
    b.crumble(22, 5, 2.5);
    b.rect(28, 0, 1.2, 7);
    b.plat(32, 2, 8); b.spring(37, 2, 7);
    b.rect(40.4, 2, 1, 7.5);
    b.shard(38, 11.5);
    b.plat(42, 9, 5); b.spring(45, 9, 5);
    b.plat(49, 14, 4);
    b.checkpoint(51, 14);
    b.slide(57, 12, 72, 12, { T: 5, w: 3 });                              // camera dolly
    b.beam('piston', 62, 12.5, { h: 9, P: 3, on: 0.9 });
    b.beam('piston', 68, 12.5, { h: 9, P: 3, on: 0.9, off: 1.5 });
    b.shard(65.5, 16);
    b.plat(75, 12, 5);
    b.crumble(83, 10, 2.2); b.crumble(87, 8, 2.2); b.crumble(91, 6, 2.2);
    b.stream('car', 94, 120, 2, { speed: 5, spacing: 11 });               // roofs at 3.35
    b.enemy('flyer', 106, 4.6, { ax: 3, ay: 0.4, T: 2.6 });              // camera drone
    b.plat(118, 4.3, 10);
    b.goal(124, 4.3);
    b.cells(15, 4.6, 24, 6.4, 4); b.cells(43, 10.5, 46, 13, 2); b.cells(58, 13.4, 72, 13.4, 5); b.cells(84, 11, 92, 7, 3); b.cells(98, 4.4, 114, 4.4, 4);
  }),

  // 102 ── LAX: baggage carts across the tarmac, elevators up the control tower, then ride jumbo
  //         jets between the skyscraper helipads with drones in the flight path
  L('LAX Departures', 'vehicle', (b) => {
    b.start(-6, 0, 12);
    b.stream('car', 8, 30, -3, { speed: 3, spacing: 9 });                // baggage carts
    b.block(30, 0, 8);
    b.lift(40, 0, 12, { T: 4.5, w: 2.6 });
    b.plat(42, 12, 4);
    b.lift(47.5, 12, 23, { T: 5, w: 2.6 });
    b.plat(49, 23, 6);                                                   // control tower deck
    b.thin(44.5, 26.5, 2); b.shard(45.5, 28);
    b.stream('plane', 52, 110, 20, { speed: 4, spacing: 16 });           // wings at 21.6
    b.block(66, 17.6, 5); b.shard(68.5, 19);
    b.enemy('flyer', 80, 23.6, { ax: 3, ay: 0.6, T: 2.8 });
    b.enemy('flyer', 95, 24, { ax: 2, ay: 1, T: 3.4 });
    b.plat(108, 22.4, 5);
    b.checkpoint(110, 22.4);
    b.block(116, 18, 5);
    b.plat(124, 15, 4);
    b.plat(131, 13, 4);
    b.stream('plane', 135, 165, 10, { speed: 5, spacing: 15 });          // wings at 11.6
    b.enemy('flyer', 150, 13.5, { ax: 3, ay: 0.8, T: 2.4 });
    b.shard(153, 15);
    b.plat(163, 12.4, 10);
    b.goal(170, 12.4);
    b.cells(10, -0.6, 26, -0.6, 4); b.cells(41, 3, 41, 10, 3); b.cells(56, 22.8, 104, 22.8, 9); b.cells(138, 12.8, 160, 12.8, 5);
  }),
  // ════════════════════════════ SHANGHAI ════════════════════════════

  // 103 ── a night cruise up the Huangpu: duck down onto the deck to slip under the low bridges,
  //         climb onto the cabin roof between them to dodge the gulls skimming the water
  L('Waibaidu Night Cruise', 'vehicle', (b) => {
    b.start(-6, 4, 12);
    b.stream('boat', 4, 110, 0, { speed: 3, spacing: 12 });              // deck 1.0, cabin roof 2.6
    const bridges = [[22, 4], [46, 5], [72, 4], [94, 4]];
    for (const [x, w] of bridges) b.rect(x, 2.9, w, 1.2);                // too low for roof riders
    b.enemy('flyer', 35, 1.9, { ax: 2.5, ay: 0.3, T: 2.6 });
    b.enemy('flyer', 84, 1.9, { ax: 3, ay: 0.3, T: 2.2 });
    b.blink(36, 6, 2.5, { P: 3, on: 1.8 }); b.shard(37.25, 7.6);         // neon sign
    b.shard(48.5, 5.6);                                                  // on top of a bridge
    b.plat(58, 4.2, 6);                                                  // floating pontoon
    b.checkpoint(61, 4.2);
    b.blink(102, 6, 2.5, { P: 3, on: 1.8, off: 1.5 });
    b.plat(108, 2, 6);
    b.block(116, 4, 4);
    b.block(122, 6, 8);
    b.goal(127, 6);
    b.thin(-13, 7.5, 3); b.shard(-11.5, 9);
    b.cells(10, 3.6, 20, 3.6, 3); b.cells(23, 1.8, 25, 1.8, 2); b.cells(30, 3.6, 42, 3.6, 3); b.cells(47, 1.8, 50, 1.8, 2);
    b.cells(73, 1.8, 75, 1.8, 2); b.cells(80, 3.6, 90, 3.6, 3); b.cells(95, 1.8, 97, 1.8, 2);
  }),

  // 104 ── skyline hopping in Lujiazui: an exterior lift, a window-cleaner gondola, a run through
  //         the "bottle opener" hole under a turret, then a lift relay up the twisting tower
  L('Lujiazui Skyline Lifts', 'ascent', (b) => {
    b.start(-6, 0, 12);
    b.lift(8, 0, 14.2, { T: 5, w: 2.6 });
    b.block(10, 14, 6);                                                  // Jin Mao
    b.thin(11.5, 18, 3);
    b.slide(19, 14, 31, 20, { T: 5, w: 3 });                             // gondola
    b.block(34, 22, 8);                                                  // World Financial Center...
    b.rect(34, 26, 8, 4);                                                // ...with its hole
    b.rect(40.6, 24.6, 1.4, 1.4); b.turret(40.6, 23, -1, { P: 2.4 });
    b.checkpoint(36, 22);
    b.thin(43, 26, 2.5); b.shard(38, 31.5);
    b.crumble(45, 22, 2.4); b.crumble(49, 22, 2.4);
    b.lift(53, 22, 31.2, { T: 4.5, w: 2.6 });
    b.shard(49.5, 30);
    b.block(55, 31, 7);                                                  // Shanghai Tower
    b.rect(57.5, 31, 4.5, 9);
    b.lift(56.2, 31, 40.2, { T: 4.5, w: 2.4 });
    b.enemy('flyer', 50, 36, { ax: 3, ay: 1, T: 3.4 });
    b.enemy('flyer', 26, 23, { ax: 3, ay: 1, T: 3 });
    b.goal(60, 40);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.cells(8, 3, 8, 12, 4); b.cells(20, 15.5, 30, 21, 4); b.cells(35, 23, 39, 23, 3); b.cells(53, 24, 53, 30, 3); b.cells(56.2, 33, 56.2, 39, 3);
  }),

  // 105 ── TIDE: the Huangpu floods the construction site. Climb fast: crumbling scaffold, a
  //         swinging crane girder, a wall-jump chimney and a rising crane hook
  L('Huangpu Floodwater', 'tide', (b) => {
    b.rise({ rate: 0.65, delay: 4 });
    b.start(-6, 0, 12);
    b.tower(4, -4, 22, 46);
    b.plat(8, 3, 4);
    b.crumble(15, 5.5, 2.5);
    b.plat(20, 8, 4);
    b.slide(18, 11, 8, 11, { T: 4, w: 3.5 });                            // crane girder
    b.plat(2, 14, 4);
    b.crumble(9, 16.5, 2.4); b.crumble(13, 19, 2.4);
    b.plat(15.2, 21, 7);
    b.checkpoint(20, 21);
    b.wall(14.2, 21, 11); b.wall(17.9, 23, 7);                           // chimney
    b.shard(14.6, 34);
    b.plat(19, 32, 4);
    b.slide(27, 32, 33, 38, { T: 4.5, w: 3 });                           // crane hook
    b.plat(36, 38, 4);
    b.thin(42, 42, 2.5); b.shard(43.25, 43.6);
    b.crumble(31, 41, 2.4);
    b.enemy('flyer', 24, 37, { ax: 2, ay: 1, T: 3 });
    b.plat(24, 44, 8);
    b.goal(28, 44);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.cells(10, 4.5, 22, 9.5, 4); b.cells(16, 12, 8, 12, 3); b.cells(16.4, 24, 16.4, 30, 3); b.cells(28, 34, 33, 39.5, 3);
  }),

  // ════════════════════════════ BEIJING ════════════════════════════

  // 106 ── three bus lanes stacked on rising flyovers: ride the top deck, and as the next lane's
  //         bus emerges overhead, jump UP through its floor into the lower deck
  L('Chang\'an Avenue Relay', 'vehicle', (b) => {
    b.start(-6, 6, 12);
    b.stream('bus', 4, 50, 0, { speed: 3.5, spacing: 13 });              // top deck 4.6
    b.shard(30, 1.4);                                                    // inside, downstairs
    b.enemy('flyer', 24, 6.4, { ax: 2, ay: 0.3, T: 2.6 });               // kite
    b.stream('bus', 50, 95, 6, { speed: 3.5, spacing: 13 });             // decks 6.5 / 8.6 / 10.6
    b.plat(70, 12, 6);                                                   // elevated station
    b.checkpoint(73, 12);
    b.thin(71.5, 15.5, 3); b.shard(73, 17);
    b.stream('bus', 95, 140, 12, { speed: 3.5, spacing: 13 });           // decks 12.5 / 14.6 / 16.6
    b.enemy('flyer', 112, 18.4, { ax: 2.5, ay: 0.3, T: 2.4 });
    b.enemy('flyer', 124, 19.5, { ax: 2, ay: 0.6, T: 3 });
    b.shard(118, 20);
    b.plat(138, 17.6, 10);
    b.goal(144, 17.6);
    b.tower(50, -3, 1.5, 6); b.tower(95, -3, 1.5, 12);
    b.cells(8, 5.6, 40, 5.6, 6); b.cells(46, 6.4, 50, 7.5, 2); b.cells(56, 11.6, 66, 11.6, 3); b.cells(80, 11.6, 90, 11.6, 3);
    b.cells(91, 12.4, 96, 13.5, 2); b.cells(100, 17.6, 134, 17.6, 6);
  }),

  // 107 ── palace gates: every floor button swaps the red and blue doors. Press them in order
  //         across three courtyards and come out with the blue stepping stones over the moat
  L('Forbidden City Gates', 'puzzle', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 20);
    b.thin(10, 3, 5);
    b.plat(13, 6, 4); b.switch(15, 6);
    b.thin(20, 9, 3); b.shard(21.5, 10.5);
    b.enemy('walker', 9, 0, { range: 14 });
    b.redWall(26, 0, 6); b.rect(26, 6, 0.8, 14);                         // gate A
    b.plat(28, 0, 24);
    b.blue(31.5, 3, 3);
    b.plat(36, 6.5, 4); b.switch(38, 6.5);
    b.red(42, 9.5, 3); b.shard(43.5, 11);                                // only there after the 2nd button
    b.enemy('spiker', 30, 0, { range: 16, speed: 2 });
    b.blueWall(50, 0, 6); b.rect(50, 6, 0.8, 14);                        // gate B
    b.plat(52, 0, 28);
    b.checkpoint(54, 0);
    b.plat(56, 3.5, 4); b.plat(60.5, 7, 3); b.plat(64, 10.5, 4); b.switch(66.8, 10.5);   // the great hall's eaves
    b.plat(69, 7, 3);
    b.thin(65, 14, 2); b.shard(66, 15.5);
    b.redWall(76, 0, 7); b.rect(76, 7, 0.8, 13);                         // gate C
    b.pool(80, 0, 12, 'water');
    b.blue(82.5, 0, 2.5); b.blue(87, 0, 2.5);
    b.plat(92, 0, 10);
    b.goal(98, 0);
    b.cells(10, 4, 14, 7.5, 3); b.cells(32, 4, 37, 7.5, 3); b.cells(58, 4.5, 65, 11.5, 4); b.cells(81, 1.2, 90, 1.2, 4);
  }),

  // 108 ── hutong courtyards: drop into each walled yard, cross it past guards, kites or a turret,
  //         and wall-jump out through the narrow alley chimney; then a rickshaw ride down the lane
  L('Hutong Kite Alleys', 'maze', (b) => {
    b.start(-6, 0, 12);
    b.block(6, 3, 2); b.block(8, 6, 2);
    b.block(10, 0, 12);                                                  // yard 1
    b.enemy('walker', 11, 0, { range: 6 });
    b.rect(18.2, 2.2, 0.8, 8.8); b.block(22, 10, 1);                     // alley chimney 1
    b.shard(18.6, 12.5);
    b.block(23, 8, 5);
    b.block(28, -1, 14);                                                 // yard 2
    b.turret(28.3, -0.2, 1, { P: 2.6 }); b.shard(29.5, 0.2);
    b.rect(38.2, 1.4, 0.8, 9.6); b.block(42, 11, 1.2);                   // alley chimney 2
    b.enemy('flyer', 40.5, 13, { ax: 2, ay: 0.6, T: 3 });
    b.block(43.2, 9, 5);
    b.checkpoint(45.5, 9);
    b.block(48.2, 0, 16);                                                // yard 3
    b.crumble(52, 3, 2.4); b.crumble(56.5, 6, 2.4); b.crumble(61, 9, 2.4);
    b.enemy('flyer', 55, 9, { ax: 3, ay: 1, T: 3.2 });
    b.shard(57.7, 11);
    b.block(64.2, 12, 1.2);
    b.plat(65.4, 10, 4);
    b.stream('car', 72, 100, 3, { speed: 4, spacing: 10 });              // rickshaws, roofs at 4.35
    b.rect(80, 6.2, 3, 4);                                               // lintel over the lane
    b.enemy('flyer', 88, 5.2, { ax: 2, ay: 0.3, T: 2.4 });
    b.plat(98, 5.3, 8);
    b.goal(103, 5.3);
    b.cells(12, 1, 17, 1, 3); b.cells(20.5, 2, 20.5, 9, 3); b.cells(31, 0, 37, 0, 3); b.cells(40.5, 1, 40.5, 10, 3);
    b.cells(53, 4, 62, 10, 3); b.cells(75, 5.6, 95, 5.6, 5);
  }),
  // ════════════════════════════ SYDNEY ════════════════════════════

  // 109 ── a monorail loops over Darling Harbour: ride its rectangle circuit, drop onto the ferries
  //         below to reach the wharf, then catch a second, tall loop up to the high station
  L('Darling Harbour Monorail', 'ride', (b) => {
    b.start(-6, 6, 12);
    b.loop([[9, 6], [34, 6], [34, 14], [9, 14]], { speed: 4, w: 3.5 });       // monorail A
    b.shard(21.5, 10);                                                     // inside the circuit
    b.stream('boat', 4, 60, 0, { speed: 3, spacing: 12 });                 // ferries, cabin roof 2.6
    b.enemy('flyer', 46, 6, { ax: 2.5, ay: 1, T: 3 });
    b.shard(48, 7.5);
    b.plat(58, 3.6, 6);                                                    // wharf
    b.checkpoint(60, 3.6);
    b.loop([[67, 4], [67, 18], [75, 18], [75, 4]], { speed: 3.5, w: 3 });    // monorail B
    b.thin(66, 21.5, 2.5); b.shard(67.25, 23);
    b.plat(77.5, 18, 5);
    b.thin(86, 16, 3); b.thin(92, 14, 3);
    b.enemy('flyer', 90, 18, { ax: 3, ay: 1, T: 2.8 });
    b.plat(98, 12, 8);
    b.goal(103, 12);
    b.cells(12, 7.4, 30, 7.4, 4); b.cells(38, 3.6, 54, 3.6, 4); b.cells(67, 7, 67, 15, 3); b.cells(87, 17.2, 94, 15.2, 3);
  }),

  // 110 ── CHASE: the BridgeClimb at a sprint. Up the granite pylon, over the steel arch of the
  //         Harbour Bridge, down the far side and across the jammed deck before the Traffic Jam
  L('Harbour Bridge Climb', 'chase', (b) => {
    b.chase({ speed: 4.4 });
    b.start(-6, 0, 14);
    b.block(10, 3, 5); b.block(16, 5.5, 4);                               // pylon
    const arch = [22, 26, 30, 34, 38, 42, 46];
    for (const x of arch) b.plat(x - 1.5, 8 + 10 * (1 - ((x - 52) / 30) ** 2), 3);
    b.plat(50, 18, 4);                                                     // the summit
    b.checkpoint(52, 18);
    b.shard(52, 22.5);                                                     // the flagpole
    b.enemy('flyer', 47, 21, { ax: 2, ay: 0.6, T: 2.6 });
    b.crumble(56.3, 17.6, 2.4); b.crumble(60.5, 16.9, 2.4);
    for (const x of [66, 70, 74, 78, 82]) b.plat(x - 1.5, 8 + 10 * (1 - ((x - 52) / 30) ** 2), 3);
    b.thin(62, 11, 3); b.shard(63.5, 12.5);                                // a hanger under the arch
    b.stream('car', 84, 120, 4, { speed: 3, spacing: 4.8 });               // jammed deck, roofs 5.35
    b.plat(118, 6.3, 10);
    b.goal(125, 6.3);
    b.thin(-12, 4, 3); b.shard(-10.5, 5.5);
    b.cells(10, 4, 18, 7, 3); b.cells(22, 9.5, 46, 19, 7); b.cells(58, 19, 82, 9.5, 7); b.cells(88, 6.8, 114, 6.8, 6);
  }),

  // 111 ── the Opera House: run up the curved sails and leap from their tips into the sea-breeze
  //         gusts that carry you to the next shell; wait out the headwind between them
  L('Opera House Sails', 'wind', (b) => {
    b.start(-6, 0, 12);
    const sail1 = [[8, 1.5], [11, 3], [14, 4.5], [17, 6], [19.5, 7.5]];
    for (const [x, y] of sail1) b.plat(x, y, 3);
    b.wind(22, 0, 14, 16, 9, { gust: true, P: 3.6, on: 1.8 });
    b.shard(29, 11);
    b.plat(22, 0, 2.5); b.shard(23.25, 1.6);                              // tucked under the first tip
    const sail2 = [[36, 6], [39, 8], [42, 10], [44.5, 12]];
    for (const [x, y] of sail2) b.plat(x, y, 3);
    b.checkpoint(46, 12);
    b.wind(47.5, 8, 9, 10, -6, { P: 4, on: 2 });                           // headwind: wait for calm
    b.plat(50, 6, 6); b.spring(53, 6, 8);
    b.plat(58, 16, 3);
    b.thin(57, 20, 2); b.shard(58, 21.5);
    b.wind(61, 6, 21, 16, 10, { gust: true, P: 3.2, on: 1.6, off: 1 });
    b.enemy('flyer', 71, 15, { ax: 3, ay: 1.5, T: 3 });
    b.plat(82, 12, 4);
    b.plat(88, 9, 3);
    b.plat(92, 6, 10);
    b.goal(98, 6);
    b.cells(9, 3, 20, 9, 5); b.cells(25, 10, 33, 9, 3); b.cells(37, 7.5, 45, 13.5, 4); b.cells(64, 17, 79, 14, 5);
  }),

  // ════════════════════════════ BERLIN ════════════════════════════

  // 112 ── Checkpoint Charlie: sneak down the street from sandbag to sandbag while the tower
  //         turret fires and searchlights fall; then dodge the dogs, press the booth button and
  //         climb the blue steps over the Wall
  L('Checkpoint Charlie', 'gauntlet', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 52);
    for (const x of [17, 27, 37, 47]) b.wall(x, 0, 1.6, 1.2);             // sandbags stop the bolts
    b.rect(60, 0, 2, 10);                                                  // watchtower
    b.turret(60, 0.8, -1, { P: 1.8, range: 50 });
    b.turret(60, 4, -1, { P: 1.8, off: 0.9, range: 50 });
    for (const [x, o] of [[22, 0], [32, 1], [42, 2], [52, 0.5]]) b.beam('lightning', x, 0, { h: 14, P: 3, on: 0.8, off: o });
    b.thin(30, 5.2, 3); b.shard(31.5, 6.7);
    b.thin(53.5, 3.4, 2.5); b.thin(57.5, 6.5, 2.5);                         // ladder up the tower
    b.checkpoint(61, 10);
    b.plat(64, 2, 30);                                                     // the death strip
    b.enemy('spiker', 66, 2, { range: 8, speed: 2 });
    b.enemy('spiker', 82, 2, { range: 8, speed: 2.4 });
    b.plat(72, 5.5, 4); b.switch(74.8, 5.5);                               // guard booth
    b.shard(74, 2.8);
    b.redWall(80, 2, 6); b.rect(80, 8, 0.8, 10);                           // boom gate
    b.blue(86, 5, 2.5); b.blue(90, 7.5, 2.5);
    b.block(94, 10, 2);                                                    // the Wall
    b.turret(94, 2.8, -1, { P: 2.6 });
    b.thin(96, 13, 2); b.shard(97, 14.5);
    b.plat(99, 4, 10);
    b.goal(105, 4);
    b.cells(10, 1, 56, 1, 10); b.cells(66, 3, 78, 3, 4); b.cells(87, 6.2, 92, 8.7, 2);
  }),

  // 113 ── the Autobahn has no speed limit: ride fast trucks, then faster cars, and jump the
  //         overhead sign gantries that would sweep you off the roof
  L('Autobahn Gantries', 'vehicle', (b) => {
    b.start(-6, 4.6, 12);
    b.stream('truck', 4, 60, 0, { speed: 5, spacing: 14 });                // roofs 3.2, cabs 2.5
    for (const x of [18, 32, 46]) b.rect(x, 3.7, 1.5, 0.8);                // gantries
    b.shard(32.75, 5.3);
    b.thin(52, 7.2, 3); b.shard(53.5, 8.7);
    b.plat(58, 4.2, 8);                                                    // Raststätte
    b.checkpoint(62, 4.2);
    b.stream('car', 66, 120, 1, { speed: 6.5, spacing: 11 });              // roofs 2.35
    for (const x of [78, 92, 104]) b.rect(x, 3.3, 1.5, 0.8);
    b.shard(104.75, 4.9);
    b.enemy('flyer', 98, 5.6, { ax: 2, ay: 0.5, T: 2.4 });
    b.plat(118, 3.3, 10);
    b.goal(124, 3.3);
    b.cells(8, 4.4, 16, 4.4, 3); b.cells(22, 4.4, 30, 4.4, 3); b.cells(36, 4.4, 44, 4.4, 3); b.cells(70, 3.6, 76, 3.6, 2);
    b.cells(82, 3.6, 90, 3.6, 3); b.cells(96, 3.6, 102, 3.6, 2); b.cells(108, 3.6, 116, 3.6, 3);
  }),

  // 114 ── down into the U-Bahn: escalators that run against you, a maintenance car through the
  //         tunnel, the closing doors of the concourse, and a hidden way back over the ceiling
  L('U-Bahn Unterwelt', 'maze', (b) => {
    b.start(-6, 0, 12);
    b.rect(-8, 6, 28, 1);
    b.plat(-16, -2, 5); b.shard(-14, -0.6);                                // a closed old platform
    b.conveyor(8, -1, 4, -3); b.conveyor(12, -2.5, 4, -3); b.conveyor(16, -4, 4, -3);   // down escalator
    b.plat(20, -5, 10);
    b.rect(20, 0, 10, 1);
    b.stream('car', 30, 60, -8, { speed: 4, spacing: 10 });                 // roofs -6.65
    b.rect(30, -1, 40, 1);                                                  // tunnel roof
    b.shard(45, -2.2);
    b.plat(58, -5.6, 10);
    b.checkpoint(62, -5.6);
    b.enemy('walker', 59, -5.6, { range: 7 });
    b.conveyor(68, -4, 4, -4); b.conveyor(72, -2.5, 4, -4); b.conveyor(76, -1, 4, -4);  // up escalator
    b.plat(80, 0, 20);
    b.rect(80, 4, 20, 1);                                                   // concourse ceiling
    b.beam('piston', 87, 0, { h: 4, P: 2.6, on: 0.9 });                     // closing doors
    b.beam('piston', 93, 0, { h: 4, P: 2.6, on: 0.9, off: 1.3 });
    b.enemy('walker', 94, 0, { range: 5, speed: 2 });
    b.shard(84, 6);                                                         // up on top of the concourse
    b.plat(102, 2.5, 3); b.plat(106, 5, 3);
    b.plat(110, 7.5, 8);
    b.goal(115, 7.5);
    b.cells(9, 0, 18, -3, 3); b.cells(22, -4, 28, -4, 3); b.cells(34, -5.2, 54, -5.2, 5); b.cells(69, -3, 78, 0, 3); b.cells(82, 1, 98, 1, 5);
  }),

  // ════════════════════════════ MOSCOW ════════════════════════════

  // 115 ── St Basil's onion domes, every cap glazed with black ice, then a snowy bus across
  //         Red Square and the Kremlin battlements to the Spasskaya Tower
  L('Red Square Black Ice', 'precision', (b) => {
    b.start(-6, 0, 12);
    const domes = [[10, 3, 3], [16, 5.5, 3], [22.5, 4, 2.5], [28, 6.5, 3]];
    for (const [x, y, w] of domes) { b.ice(x, y, w); b.block(x + 0.6, y - 1, w - 1.2); }
    b.ice(34, 9, 2.5);                                                      // the central dome
    b.shard(35.25, 12.5);
    b.ice(18, 0.5, 2.5); b.shard(19.25, 2);                                 // low between the domes
    b.ice(39, 8, 4);
    b.stream('bus', 40, 80, 2, { speed: 3, spacing: 14 });                  // top deck 6.6
    b.enemy('flyer', 60, 8.4, { ax: 3, ay: 0.4, T: 2.8 });
    b.ice(78, 7.6, 6);
    b.checkpoint(81, 7.6);
    b.plat(86, 6, 18);                                                      // Kremlin wall walk
    for (const x of [89, 94, 99]) b.rect(x, 6, 1.2, 1.2);                  // merlons
    b.enemy('walker', 90, 6, { range: 8, speed: 2 });
    b.plat(82.5, 2.5, 2.5); b.shard(83.75, 4);                              // under the wall's lip
    b.ice(104, 8, 2.5);
    b.block(108, 10, 5);                                                    // Spasskaya Tower
    b.goal(110.5, 10);
    b.cells(11, 4.5, 29, 8, 5); b.cells(42, 7.6, 74, 7.6, 6); b.cells(88, 7.5, 102, 7.5, 4);
  }),

  // 116 ── a snow convoy: icicles drip from the overpasses onto the trucks, an icy hand-off to the
  //         bus, and a sniper on the far roof — duck inside the bus to let his shots pass over
  L('Moskva Snow Convoy', 'vehicle', (b) => {
    b.start(-6, 4.6, 12);
    b.thin(-4, 8.5, 3); b.shard(-2.5, 10);
    b.stream('truck', 4, 40, 0, { speed: 3.5, spacing: 15 });               // roofs 3.2
    b.rect(18, 6.4, 8, 0.8);                                                // overpass
    b.shard(22, 8.6);
    b.meteor(20, 3.2, { style: 'drip', P: 2.5, h: 3.2 });
    b.meteor(24, 3.2, { style: 'drip', P: 2.5, off: 1.2, h: 3.2 });
    b.ice(37, 4.2, 5);
    b.checkpoint(39, 4.2);
    b.ice(46, 6, 4);
    b.stream('bus', 50, 86, 0, { speed: 3.5, spacing: 14 });                // decks 0.5 / 2.6 / 4.6
    b.meteor(60, 4.6, { style: 'drip', P: 2.2, h: 4 });
    b.rect(98, 4.6, 1.4, 2); b.turret(98, 5.4, -1, { P: 2.2, range: 34 });  // the sniper
    b.shard(80, 3.5);                                                       // middle deck, under fire
    b.plat(86, 5.2, 4);
    b.ice(92, 7.5, 3);
    b.plat(97, 10, 9);
    b.goal(102, 10);
    b.cells(8, 4.4, 16, 4.4, 3); b.cells(28, 4.4, 36, 4.4, 3); b.cells(54, 5.8, 76, 5.8, 5); b.cells(87, 6.4, 93, 8.7, 3);
  }),

  // 117 ── the Sparrow Hills ski slope: slither down icy steps, launch off ski-jump springs over
  //         the gaps, and land on glazed shelves at the bottom past the snow cannon
  L('Sparrow Hills Ski Jump', 'descent', (b) => {
    b.start(-6, 30, 12);
    for (let i = 0; i < 6; i++) b.ice(6 + i * 3, 29.3 - i * 0.8, 3);
    b.plat(24, 25, 3); b.spring(25.5, 25, 3);                               // ski jump
    b.shard(30, 31);
    b.ice(36, 20, 6);
    b.checkpoint(39, 20);
    b.ice(31, 17, 2.5); b.shard(32.25, 18.6);
    for (let i = 0; i < 5; i++) b.ice(42 + i * 3, 19.2 - i * 0.8, 3);
    b.enemy('flyer', 52, 20, { ax: 3, ay: 0.6, T: 2.6 });
    b.ice(60, 12, 3); b.ice(66, 9, 3);
    b.plat(70, 6, 8); b.spring(76, 6, 7);
    b.rect(80.5, 2, 1.4, 9); b.turret(80.5, 7, -1, { P: 2.4 });             // snow cannon
    b.shard(81.2, 12.5);
    b.plat(84, 4, 10);
    b.goal(90, 4);
    b.cells(7, 30.5, 22, 27, 5); b.cells(28, 27, 34, 22, 3); b.cells(43, 20.5, 55, 17.5, 4); b.cells(61, 13, 67, 10, 2);
  }),

  // ════════════════════════════ TOKYO ════════════════════════════

  // 118 ── the Shibuya Scramble: each crossing has a WALK-light crosswalk that blinks solid on the
  //         green phase — or drop onto a passing taxi; then climb the giant video screens
  L('Shibuya Scramble', 'timing', (b) => {
    b.start(-6, 0, 12);
    b.thin(-13, 3.5, 3); b.shard(-11.5, 5);
    b.stream('taxi', 6, 20, -4, { speed: 4, spacing: 9 });                  // roofs -2.6
    for (const x of [7, 11.5, 16]) b.blink(x, 0, 3, { P: 4, on: 2.2 });
    b.plat(20, 0, 6);
    b.enemy('walker', 21, 0, { range: 4, speed: 1.2 });
    b.stream('taxi', 26, 44, -4, { speed: 5, spacing: 10 });
    for (const [i, x] of [27, 31.5, 36, 40.5].entries()) b.blink(x, 0, 3, { P: 4, on: 2, off: 2 - i * 0.4 });
    b.plat(44, 0, 8);
    b.checkpoint(46, 0);
    b.rect(49.5, 0, 1.6, 2.2);                                              // Hachiko
    b.stream('taxi', 52, 76, -4, { speed: 4.5, spacing: 9 });
    b.enemy('flyer', 62, -0.8, { ax: 3, ay: 0.4, T: 2.4 });
    b.shard(64, -1.8);
    b.plat(76, 0, 6);
    b.blink(82, 3, 3, { P: 3.2, on: 2 }); b.blink(86, 6, 3, { P: 3.2, on: 2, off: -0.8 });
    b.blink(82, 9, 3, { P: 3.2, on: 2, off: -1.6 }); b.blink(86, 12, 3, { P: 3.2, on: 2, off: -2.4 });
    b.shard(87.5, 16.5);
    b.plat(90, 14, 8);
    b.goal(95, 14);
    b.cells(8, 1, 18, 1, 3); b.cells(28, 1, 42, 1, 4); b.cells(54, -1.8, 74, -1.8, 5); b.cells(83, 4.5, 87, 13.5, 4);
  }),

  // 119 ── a Shinjuku alley at night: neon signs flicker in sequence up the gap between two towers,
  //         and buttons swap the red and blue signs while drones patrol
  L('Shinjuku Neon Alley', 'ascent', (b) => {
    b.start(-6, 0, 12);
    b.plat(-12, -3, 3); b.shard(-10.5, -1.4);
    b.rect(5, 4, 2, 42);                                                    // left tower
    b.block(23, 40, 3);                                                     // right tower
    b.plat(7, 0, 16);
    b.blink(8, 3.5, 3.5, { P: 3.2, on: 2.2 });
    b.blink(14, 6, 3.5, { P: 3.2, on: 2.2, off: -0.7 });
    b.shard(11, 9);
    b.plat(19.5, 8.5, 3.5); b.switch(21.6, 8.5);
    b.blue(14.5, 11.5, 3.5);
    b.blink(8, 14, 3.5, { P: 3.2, on: 2.2, off: -1.4 });
    b.blink(14, 17, 3.5, { P: 3.2, on: 2.2, off: -2.1 });
    b.enemy('flyer', 16, 15, { ax: 2, ay: 0.6, T: 3 });
    b.plat(19.5, 19.5, 3.5); b.switch(21.6, 19.5);
    b.checkpoint(20.2, 19.5);
    b.blue(10.5, 21.5, 3); b.shard(12, 23);                                 // only lit before the 2nd button
    b.red(14, 22.5, 3.5); b.red(8, 25.5, 3.5);
    b.blink(14, 28.5, 3.5, { P: 3.2, on: 2.2 });
    b.blink(19.5, 31, 3.5, { P: 3.2, on: 2.2, off: -0.8 });
    b.enemy('flyer', 12, 31, { ax: 3, ay: 1, T: 3.4 });
    b.turret(7, 34.8, 1, { P: 2.4 });
    b.plat(14, 34, 3.5);
    b.plat(8, 37, 3.5);
    b.thin(14, 39.5, 4);
    b.plat(19.5, 40, 6.5);
    b.goal(23, 40);
    b.cells(9.5, 5, 16, 7.5, 2); b.cells(10, 15.5, 16, 18.5, 2); b.cells(10, 27, 16, 30, 2); b.cells(15, 35.5, 10, 38.5, 2);
  }),

  // 120 ── FINALE, Tokyo rush hour: a bus roof, a blinking crosswalk, a skyscraper elevator,
  //         a jet off the roof — then the Traffic Jam chases you down across the gridlock
  L('Tokyo Rush Hour', 'finale', (b) => {
    b.start(-6, 6, 12);
    b.stream('bus', 4, 36, 0, { speed: 3.5, spacing: 13 });                // top deck 4.6
    b.thin(18, 8.8, 3); b.shard(19.5, 10.3);
    b.enemy('flyer', 26, 6.4, { ax: 2, ay: 0.3, T: 2.4 });
    b.plat(34, 5.6, 4);
    b.stream('taxi', 40, 56, 0, { speed: 4.5, spacing: 9 });               // roofs 1.4
    b.blink(39.5, 5.6, 3, { P: 3, on: 1.8 }); b.blink(44.5, 5.6, 3, { P: 3, on: 1.8, off: 1 }); b.blink(49.5, 5.6, 3, { P: 3, on: 1.8, off: 2 });
    b.plat(55, 5.6, 4);
    b.lift(60.6, 5.6, 16, { T: 4.5, w: 2.4 });
    b.plat(62, 16, 8);                                                     // tower roof
    b.checkpoint(65, 16);
    b.thin(64, 20, 2); b.shard(65, 21.5);
    b.chase({ speed: 4.4, trigger: 70, behind: 16 });
    b.stream('plane', 76, 104, 13, { speed: 5, spacing: 12 });             // wings 14.6
    b.shard(90, 18);
    b.crumble(104, 13, 2.4); b.crumble(109, 10.5, 2.4); b.crumble(114, 8, 2.4);
    b.stream('car', 118, 150, 4, { speed: 2.5, spacing: 4.8 });            // gridlock, roofs 5.35
    b.plat(148, 6.3, 12);
    b.goal(156, 6.3);
    b.cells(8, 5.6, 30, 5.6, 5); b.cells(40, 7, 53, 7, 4); b.cells(60.6, 8, 60.6, 14, 3); b.cells(78, 15.6, 100, 15.6, 6); b.cells(120, 6.8, 144, 6.8, 6);
  }),
];
