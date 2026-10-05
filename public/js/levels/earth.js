// WORLD 4 — EARTH. A world tour: 10 cities × 3 levels, all hand-written.
// Units (g = 1.0): single jump ≈ 2.45 high / 6 far, double ≈ 4.4 high / 10 far, run 8.5/s.
// Vehicle decks above laneY: bus 0.5 / 2.6 / 4.6, car 1.35, taxi 1.4, truck 3.2 (cab 2.5),
// boat 1.0 (cabin roof 2.6), plane 1.6. Every level has its own idea; see the comment above each.
// Moving toys (v4): crane-hook vines, hanging-girder pendulums, zip lines, circus-cannon barrels, balloon floaters,
// sinking pontoons, wrecking balls, searchlight sweepers and dust-devil tornadoes, plus the vehicle rides.
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
    b.vine(58, 13, 6);                                                   // crane hook over the bus lane
    b.cells(54, 8, 62, 8, 3);
    b.pendulum(108, 16, 7, { amp: 30, T: 4, w: 2.8 });                  // Tower Bridge hook
    b.zip(36, 12, 52, 9);
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
    b.vine(67, 9, 6);                                                   // scaffold hook over the kerb gap
    b.sweeper(93, 10.8, 3, { omega: 70, both: true, width: 0.6 });      // a radar dish guards the high shard
    b.pendulum(114, 12, 6, { amp: 35, T: 4, w: 2.8 });                  // hanging sign into the terminus
    b.cells(110, 8, 114, 8, 2);
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
    b.wrecker(8, 24, 5.2, { amp: 50, T: 3.4 });                       // the great bell's clapper
    b.vine(31, 36, 6); b.cells(28, 31, 31, 31, 2);
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
    b.vine(33, 10, 6); b.cells(29, 6, 37, 6, 3);                       // window-cleaner rope over the broken High Line
    b.zip(63, 9.5, 82, 6.5);                                           // skyscraper-to-skyscraper line over the steam vents
    b.wrecker(91, 14, 8, { amp: 45, T: 3.2 });                         // demolition ball over the last gap
  }),

  // 95 ── a Manhattan construction site: ride a balloon-pad up the scaffold, swing off a crane hook,
  //        hop a girder hanging from a crane, then zip across the avenue past a wrecking ball
  L('Crane Yard Climb', 'ascent', (b) => {
    b.start(-6, 0, 12);
    b.tower(2, -2, 22, 26);
    b.floater(10, 0.6, 3, { rise: 7.8, speed: 2.4 });                    // hoist platform
    b.cells(10, 3, 10, 8, 3); b.shard(10, 12);
    b.plat(15, 8.4, 4);
    b.vine(24, 15, 6);                                                   // crane hook
    b.plat(31, 9, 4); b.checkpoint(32.5, 9);
    b.pendulum(40, 19, 8, { amp: 32, T: 4.2, w: 3.4 });                  // girder hanging from the crane
    b.shard(40, 14.5);
    b.plat(48, 10, 5);
    b.floater(54.5, 10, 3, { rise: 9, speed: 2.4 });
    b.plat(58, 19.2, 5);
    b.thin(60.5, 23.4, 3); b.shard(62, 25);
    b.zip(62, 25.5, 84, 18.5);
    b.wrecker(73, 33, 9, { amp: 40, T: 3.4 });
    b.plat(86, 16.8, 9);
    b.goal(91, 16.8);
    b.cells(16, 10, 28, 12, 4); b.cells(42, 12, 46, 12, 2); b.cells(64, 24, 82, 19.5, 5);
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
    b.zip(14, 12, 40, 7);                                              // a line across the Hudson over the ferries
    b.pendulum(88, 14, 6, { amp: 30, T: 4, w: 2.8 });                  // a cargo net swinging over the water taxis
    b.sweeper(103, 12, 4.2, { omega: 60, both: true, width: 0.7 });    // the torch's light beam
  }),
  // ════════════════════════════ SAN FRANCISCO ════════════════════════════

  // 97 ── escape Alcatraz at night: zip off the cliff across the bay, slip past the lighthouse's turning beam,
  //        zip on over sinking pontoons, chain two crane-hook swings and zip down to the Embarcadero
  L('Alcatraz Searchlights', 'speed', (b) => {
    b.start(-6, 24, 12);
    b.thin(-12, 27, 3); b.shard(-10.5, 28.6);
    b.zip(7, 27.5, 27, 20.5);
    b.plat(26, 17.5, 10);                                                // the island
    b.rect(30.6, 17.5, 0.8, 4);                                          // lighthouse
    b.sweeper(31, 21.8, 5, { omega: 70, both: true, width: 0.7 });
    b.cells(27, 19, 29, 19, 2);
    b.zip(40, 22, 62, 13.5);
    b.sinker(50, 9, 3, { depth: 2.5, speed: 1.4 });                      // pontoons, only for the careful
    b.shard(50, 10.7);
    b.sinker(55, 9.5, 3, { depth: 2.5, speed: 1.4 });
    b.plat(62, 8.5, 2.5);
    b.plat(64, 11.5, 6);
    b.checkpoint(66, 11.5);
    b.vine(76, 19, 6); b.vine(85, 19, 6);                                // crane hooks over the pier
    b.shard(80.5, 15.5);
    b.plat(92, 10, 5);
    b.zip(97, 14, 117, 6, { oneWay: true });
    b.wrecker(104, 17, 6.5, { amp: 50, T: 3 });
    b.wrecker(111, 15, 6, { amp: 50, T: 3, phase: 0.5 });
    b.plat(118, 3.4, 10);
    b.goal(124, 3.4);
    b.cells(10, 26, 24, 21, 5); b.cells(42, 22, 60, 15, 5); b.arc(70, 12, 90, 11, 4, 3); b.cells(99, 13, 115, 7, 5);
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
    b.pendulum(32, 17, 5, { amp: 35, T: 3.6, w: 2.6 });                 // a gondola dangling from the cable
    b.wrecker(60, 27, 6, { amp: 45, T: 3.2 });                          // the cable-car counterweight
    b.zip(96, 22, 109, 19.5);
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
    b.checkpoint(90.5, 17.5);
    b.thin(97, 14, 2.5); b.thin(101.5, 11, 2.5); b.thin(106, 8, 2.5);
    b.enemy('flyer', 55, 17, { ax: 3, ay: 1, T: 3.4 });
    b.enemy('flyer', 79, 15, { ax: 2, ay: 1.5, T: 2.8 });
    b.plat(122, 4.2, 10);
    b.goal(128, 4.2);
    b.plat(-14, 6.5, 3); b.shard(-12.5, 8.5);
    b.cells(8, 4.6, 28, 4.6, 5); b.cells(38, 25, 63, 12.5, 6); b.cells(68, 8.6, 86, 16.8, 5); b.cells(110, 4.6, 120, 4.6, 3);
    b.cells(44, 28, 58, 22, 3);
    b.wrecker(100, 28, 12.5, { amp: 38, T: 3.4 });                        // a swinging tower crane hook-block
    b.vine(80, 24, 7);                                                // a suspender cable to swing on
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
    b.vine(97, 15, 6);                                                  // gantry swing over the crumbling pads
    b.pendulum(131, 16, 7, { amp: 30, T: 3.6, w: 2.8 });                // swinging billboard
    b.wrecker(76, 15, 7, { amp: 45, T: 3 });                           // a crane ball swinging over the trailers
  }),

  // 101 ── a Hollywood backlot of stunt rigs: a circus cannon, a dust devil that lifts you onto the
  //         tower set, a chain of rocking cannons, then drop onto the car-chase scene under a swinging klieg light
  L('Dust Devil Backlot', 'pods', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 5);
    b.barrel(16, 2.2, { angle: 40 });                                    // the human cannonball
    b.plat(26, 3, 18);
    b.tornado(34, 40, 3, { rise: 10, T: 7 });                            // a dust devil blows across the set
    b.shard(38, 14);
    b.plat(45, 11, 6);
    b.checkpoint(47, 11);
    b.thin(46, 15.4, 3); b.shard(47.5, 17);
    b.barrel(56, 12.8, { angle: 15 });                                   // chained cannons
    b.barrel(63, 12.6, { angle: 30, sweep: 25, spin: 100 });
    b.plat(74, 9, 5);
    b.cells(51, 13, 54, 13.5, 2); b.arc(65, 13, 73, 10, 3, 2);
    b.stream('car', 82, 114, 2, { speed: 5, spacing: 11 });              // roofs at 3.35
    b.wrecker(98, 15, 8, { amp: 45, T: 3.4 });                           // klieg light on a boom
    b.shard(92, 5.2);
    b.enemy('flyer', 106, 5.4, { ax: 3, ay: 0.4, T: 2.6 });              // camera drone
    b.plat(114, 4.3, 10);
    b.goal(120, 4.3);
    b.cells(10, 2, 14, 2, 2); b.arc(18, 3, 26, 4, 3, 2); b.cells(86, 4.8, 110, 4.8, 6);
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
    b.sweeper(51.5, 26.2, 3, { omega: 90, both: true, width: 0.6 });         // control-tower radar dish
    b.vine(120, 24, 6); b.cells(118, 17, 124, 17, 2);                  // a hangar crane hook
    b.pendulum(38, 8, 5, { amp: 35, T: 3.8, w: 2.6 });                 // baggage hook swinging by the lift
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
    b.pendulum(54, 12, 5.5, { amp: 30, T: 3.8, w: 2.8 }); b.cells(51, 7, 57, 7, 2);   // a lantern basket over the pontoon
    b.vine(122, 14, 6);
    b.wrecker(112, 14, 8, { amp: 40, T: 3.2 });                        // a dockyard crane ball
  }),

  // 104 ── the Lujiazui window-cleaners: ride a washing rig up the Jin Mao, zip off the ledge to the
  //         Financial Center, swing across on a gondola hung from a roof crane, then a last rig up the twisting tower
  L('Window Washers', 'ascent', (b) => {
    b.start(-6, 0, 12);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.floater(8, 0.6, 3, { rise: 13.4, speed: 2.6 });                    // window-cleaner platform
    b.cells(8, 3, 8, 12, 4);
    b.block(11, 14, 6);                                                  // Jin Mao
    b.thin(12, 18, 3); b.shard(13.5, 19.7);
    b.zip(21, 19.5, 41, 14.5);
    b.plat(43, 12.5, 7);                                                 // World Financial Center
    b.checkpoint(45, 12.5);
    b.pendulum(58, 23, 9, { amp: 32, T: 4.6, w: 3.4 });                  // gondola on a roof crane
    b.enemy("flyer", 55, 19.5, { ax: 2, ay: 0.8, T: 3.2 });
    b.block(66, 16, 5);                                                  // Shanghai Tower base
    b.floater(73, 16.4, 3, { rise: 16, speed: 2.6 });
    b.shard(73, 36.2);
    b.plat(77, 32.6, 9);
    b.goal(82, 32.6);
    b.cells(22, 20, 40, 15.5, 5); b.cells(50, 15, 64, 16.5, 4); b.cells(73, 19, 73, 31, 4);
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
    b.pendulum(31, 47, 6.5, { amp: 30, T: 4, w: 3 });                // girder dangling from the tower crane
    b.vine(8, 31, 5); b.cells(10, 26, 10, 29, 2);                      // crane cable
    b.floater(24, 33, 2.6, { rise: 9, speed: 2.6 });                   // hoist cage
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
    b.wrecker(130, 27, 8, { amp: 40, T: 3.4 });                        // a lantern-festival ball on a boom
    b.pendulum(83, 22, 6, { amp: 28, T: 3.8, w: 2.8 });                 // a paper lantern basket
  }),

  // 107 ── the Great Wall at Badaling: duck the battering-ram wreckers swinging over the walkway, hop a
  //         hanging beacon basket, dodge a guard's spinning spear, zip down the slope and sink-hop the moat
  L('Great Wall Wreckers', 'gauntlet', (b) => {
    b.start(-6, 0, 12);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.block(6, 1.5, 2);
    b.block(8, 3, 14);                                                   // wall section 1
    b.wrecker(15, 16, 11, { amp: 45, T: 3.6 });                          // battering ram
    b.thin(10, 7.1, 3); b.cells(10, 8.5, 12, 8.5, 2);
    b.pendulum(30, 13.5, 8, { amp: 35, T: 4, w: 3.4 });                  // beacon basket
    b.block(36, 5, 6);                                                   // watchtower
    b.checkpoint(38, 5);
    b.thin(38, 9.2, 3); b.shard(39.5, 10.8);
    b.block(44, 5, 8);
    b.sweeper(48, 8.6, 4.5, { omega: 80, both: true, width: 0.7 });      // guard's spear
    b.zip(55, 10, 75, 5);
    b.block(77, 3, 18);                                                  // wall section 3
    b.wrecker(83, 15, 11.5, { amp: 45, T: 3.4 });
    b.wrecker(90, 15, 11.5, { amp: 45, T: 3.4, phase: 0.5 });
    b.sinker(99, 3, 3, { depth: 3.2, speed: 1.5 });                      // moat pontoons
    b.shard(100.5, 0.4);
    b.sinker(104.5, 3, 3, { depth: 2.5, speed: 1.5 });
    b.plat(110, 3, 10);
    b.goal(116, 3);
    b.cells(10, 4.6, 20, 4.6, 4); b.cells(25, 8, 35, 8, 3); b.cells(57, 9, 73, 5.5, 5); b.cells(79, 4.6, 94, 4.6, 5);
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
    b.sweeper(15, 3, 2.6, { omega: 85, both: true, width: 0.6 });         // a spinning prayer wheel in yard 1
    b.sweeper(35, 3, 2.6, { omega: -85, both: true, width: 0.6 });
    b.pendulum(61, 18, 5, { amp: 30, T: 3.6, w: 2.6 });                // a paper lantern over the crumbling steps
    b.vine(68, 17, 6);
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
    b.wrecker(89, 27, 9.5, { amp: 40, T: 3.4 });                        // a harbour crane ball over the gangway
    b.pendulum(40, 12, 5, { amp: 30, T: 3.8, w: 2.6 });                // a signal basket over the ferry lane
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
    b.vine(103, 14, 6);                                                // a bridge-climb safety line to swing on
    b.wrecker(70, 30, 9, { amp: 35, T: 3.2 });                        // a pile-driver ball over the downhill arch
  }),

  // 111 ── hot-air balloons over Sydney Harbour: ride a balloon up past the sails, zip across the water,
  //         catch a second balloon, swing a crane hook over the Quay and zip home under a swinging buoy
  L('Harbour Balloons', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.thin(-13, 4.2, 3); b.shard(-11.5, 5.8);
    b.floater(9, 0.6, 3, { rise: 8.2, speed: 2.2 });                     // balloon one
    b.cells(9, 3, 9, 8, 3); b.shard(9, 13);
    b.plat(13, 8.6, 4);
    b.zip(21, 12, 43, 6.5);
    b.plat(46, 4.5, 7);
    b.checkpoint(48, 4.5);
    b.floater(57, 4.9, 3, { rise: 11, speed: 2.4 });                     // balloon two
    b.enemy('flyer', 55, 12, { ax: 1.5, ay: 1.5, T: 3.4 });              // a gull
    b.plat(62, 15.6, 4);
    b.thin(63, 19.8, 3); b.shard(64.5, 21.4);
    b.vine(73, 22, 6.5);
    b.plat(79, 14, 5);
    b.zip(88, 17, 108, 8.5);
    b.wrecker(98, 23.5, 10, { amp: 45, T: 3.2 });                        // channel buoy on a boom
    b.plat(110, 6.4, 10);
    b.goal(116, 6.4);
    b.cells(23, 11.5, 41, 7, 5); b.arc(66, 16, 77, 15, 3, 3); b.cells(90, 16, 106, 9.5, 5);
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
    b.sweeper(42, 8.5, 3.6, { omega: 70, both: true, width: 0.7 });       // searchlight on the tower mast
    b.pendulum(90, 18, 6, { amp: 30, T: 3.8, w: 2.8 });                // a hanging lamp over the Wall
    b.wrecker(70, 14, 6.5, { amp: 40, T: 3.2 });                       // a demolition ball clearing the death strip
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
    b.wrecker(25, 14, 8.6, { amp: 40, T: 3 });                         // an overhead sign gantry swings loose
    b.pendulum(114, 15, 6, { amp: 28, T: 3.6, w: 2.8 });               // a hanging road sign
  }),

  // 114 ── the Rohrpost: Berlin's pneumatic-tube network. Blast pod to pod through the pipes, ride a
  //         maintenance car under the tunnel roof, cut through the ventilation fan and shoot up the vertical tube
  L('Rohrpost Tubes', 'pods', (b) => {
    b.start(-6, 0, 12);
    b.plat(-16, -2, 5); b.shard(-14, -0.6);                              // a closed old platform
    b.plat(8, 0, 4);
    b.barrel(17, 2, { angle: 20 });                                      // the tube: pod → pod → pod
    b.barrel(25, 3, { angle: 20 });
    b.barrel(33, 3.4, { spin: 90 });
    b.plat(42, 0, 6);
    b.checkpoint(44, 0);
    b.plat(52, -5.2, 5);
    b.stream('car', 58, 86, -8, { speed: 4, spacing: 10 });              // maintenance cars, roofs -6.65
    b.rect(58, -1, 28, 1);                                               // tunnel roof
    b.shard(72, -3.2);
    b.plat(88, -5.6, 16);
    b.enemy('walker', 89, -5.6, { range: 4 });
    b.sweeper(96, -2.4, 3.6, { omega: 100, both: true, width: 0.6 });    // ventilation fan
    b.barrel(106.5, -3.5, { angle: 90, power: 20 });                     // the vertical tube
    b.barrel(106.5, 3.5, { angle: 90, power: 22 });
    b.barrel(106.5, 10.5, { angle: 40 });
    b.thin(110, 13.2, 3); b.shard(111.5, 14.8);
    b.plat(116, 9, 8);
    b.goal(121, 9);
    b.arc(10, 1, 16, 2.5, 2, 1.5); b.arc(18, 2.5, 24, 3.5, 2, 1.5); b.arc(26, 3.5, 32, 3.5, 2, 1.5); b.cells(60, -5.2, 84, -5.2, 5); b.cells(106.5, -1, 106.5, 1.5, 2);
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
    b.pendulum(46, 14, 6, { amp: 28, T: 3.8, w: 3 });                  // a bell swinging under the Kremlin arch
    b.wrecker(20, 14, 6.6, { amp: 40, T: 3.4 });                       // a swinging church bell between the domes
    b.vine(75, 14, 5);
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
    b.pendulum(44, 15, 6, { amp: 28, T: 3.8, w: 2.8 });                // a snow-laden hanging sign
    b.vine(90, 14, 6);
  }),

  // 117 ── the Sparrow Hills cable car: zip down the snowy ridge under dripping icicles, swing a gondola
  //         hook to the ledge, zip again, hop sinking ice floes, then a last zip past swinging lanterns
  L('Sparrow Hills Cable Car', 'speed', (b) => {
    b.start(-6, 30, 12);
    b.thin(-12, 33, 3); b.shard(-10.5, 34.6);
    b.zip(7, 33, 27, 26);
    b.plat(28, 23, 6);
    b.meteor(31, 23, { style: 'drip', P: 2.6, h: 3.4 });                 // icicles
    b.vine(42, 31, 6);                                                   // gondola hook
    b.shard(44, 27.5);
    b.plat(47, 19, 6);
    b.checkpoint(49, 19);
    b.zip(57, 25, 79, 14.5);
    b.ice(80.5, 12, 4);
    b.sinker(87, 12, 3.5, { depth: 3.4, speed: 1.4 });                   // ice floes
    b.shard(88.7, 8.6);
    b.sinker(93, 11.5, 3.5, { depth: 2.5, speed: 1.4 });
    b.plat(99, 8.6, 6);
    b.zip(108, 13, 128, 5, { oneWay: true });
    b.wrecker(116, 22, 9, { amp: 45, T: 3.2 });
    b.wrecker(123, 20, 9, { amp: 45, T: 3.2, phase: 0.5 });
    b.plat(129, 2.6, 10);
    b.goal(135, 2.6);
    b.cells(9, 32, 25, 27, 5); b.cells(59, 24, 77, 15.5, 5); b.cells(110, 12, 126, 6, 5);
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
    b.pendulum(17, 12, 6, { amp: 30, T: 3.6, w: 3 });                  // a hanging neon sign over the first crossing
    b.wrecker(66, 11, 7, { amp: 38, T: 3 });                           // a wrecking ball over the taxi lane
    b.vine(30, 12, 6);
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
    b.sweeper(11, 11.5, 2.6, { omega: 90, both: true, width: 0.5 });        // a spinning neon sign
    b.sweeper(17, 33, 2.4, { omega: -80, both: true, width: 0.5 });
    b.pendulum(11, 43, 5, { amp: 30, T: 3.4, w: 3 });                  // a hanging banner into the penthouse
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
    b.vine(70, 22, 6);                                                // a crane hook to swing in on
    b.wrecker(90, 30, 9, { amp: 40, T: 3 });                           // a billboard ball over the jet lane
    b.pendulum(126, 14, 6, { amp: 28, T: 3.4, w: 3 });                 // a swinging neon sign over the gridlock
  }),
];
