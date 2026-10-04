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
    b.plat(58, 3.5, 12); b.plat(60, 7, 8); b.plat(62, 10.5, 4); b.switch(65.1, 10.5);
    b.thin(63, 14, 2); b.shard(64, 15.5);
    b.redWall(76, 0, 7); b.rect(76, 7, 0.8, 13);                         // gate C
    b.pool(80, 0, 12, 'water');
    b.blue(82.5, 0, 2.5); b.blue(87, 0, 2.5);
    b.plat(92, 0, 10);
    b.goal(98, 0);
    b.cells(10, 4, 14, 7.5, 3); b.cells(32, 4, 37, 7.5, 3); b.cells(59, 4.5, 63, 11.5, 4); b.cells(81, 1.2, 90, 1.2, 4);
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
];
