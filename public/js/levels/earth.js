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
];
