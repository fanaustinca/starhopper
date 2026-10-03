// WORLD 12 — MECHANUS. 30 hand-written levels inside an ancient alien clockwork machine.
// Gravity 1.0: single jump ≈ 2.45 high / 6 far, double jump ≈ 4.4 high / 10 far, run 8.5/s.
// The floor is a bottomless void. Signature pieces: rotating gears (ferris), conveyor belts,
// exhaust vents (beam 'exhaust', rising), crushing pistons (beam 'piston', slamming down),
// escapement lifts and loops, lever gates (red/blue). Every level has its own idea (see comments).
import { L } from './dsl.js';

export default [
  // 1 ── wind the key: hop brass ledges, let a belt carry you, then ride your very first gear
  L('Winding Key', 'intro', (b) => {
    b.start(-6, 0, 14);
    b.arc(8, 0, 12, 0, 2, 1.6);
    b.plat(12, 0, 6);
    b.plat(22, 1.5, 5);
    b.cells(23, 3, 26, 3, 3);
    b.conveyor(31, 1.5, 12, 3);                 // the belt helps you along
    b.cells(32, 3, 42, 3, 5);
    b.thin(35, 5.2, 4); b.shard(37, 7);         // hop up off the moving belt
    b.plat(47, 1.5, 6);
    b.checkpoint(50, 1.5);
    b.ferris(61, 1.5, 4.5, { n: 4, omega: 0.5 }); // a slow, friendly cog
    b.cell(61, 7.5);
    b.shard(61, 9);
    b.plat(69, 3, 5);
    b.arc(74, 3, 79, 5, 2, 1.5);
    b.plat(79, 5, 4);
    b.arc(83, 5, 88, 3, 2, 1.5);
    b.plat(88, 3, 10);
    b.goal(94, 3);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 2 ── read the arrows: belts that fling you, belts that fight you, and a switchback of belts to climb
  L('Assembly Line', 'classic', (b) => {
    b.start(-6, 0, 12);
    b.conveyor(9, 0, 14, 4);                    // fling: run off the end for a huge leap
    b.cells(10, 1.2, 22, 1.2, 5);
    b.conveyor(8, 3.8, 12, -3);                 // the return belt rides you back over the start
    b.shard(7.5, 5.4);
    b.conveyor(30, 0, 10, -3.5);                // this one pushes back
    b.cells(31, 1.2, 39, 1.2, 4);
    b.plat(44, 1, 5);
    b.checkpoint(46, 1);
    // switchback: each belt carries you to the foot of the next jump
    b.conveyor(50, 3, 10, 3);
    b.conveyor(44, 7, 12, -3);
    b.conveyor(48, 11, 12, 3);
    b.cells(51, 4.2, 59, 4.2, 4); b.cells(54, 8.2, 45, 8.2, 4); b.cells(49, 12.2, 59, 12.2, 4);
    b.shard(41.5, 9.2);                          // off the end of the left-running belt
    b.plat(64, 12, 5);
    b.conveyor(73, 12, 16, 5);                  // last fling
    b.cells(75, 13.2, 87, 13.2, 5);
    b.shard(85, 16.4);
    b.plat(95, 11, 10);
    b.goal(101, 11);
  }),

  // 3 ── two cogs, counter-rotating: ride one up, step across where they meet, then roll down two more
  L('Twin Cogs', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.plat(9, 0, 5);
    b.ferris(21, 3, 5, { n: 4, omega: 0.45 });
    b.ferris(31, 11, 5, { n: 4, omega: -0.45 });
    b.shard(21, 3.6);                            // in the hub of the first cog
    b.cells(16, 4.5, 26, 9, 4);
    b.plat(38, 15, 6);
    b.checkpoint(41, 15);
    b.shard(31, 18.4);
    b.ferris(52, 11, 4, { n: 3, omega: 0.6 });
    b.plat(59, 7, 4);
    b.ferris(68, 6, 3, { n: 3, omega: -0.7 });
    b.cells(60, 8.4, 62, 8.4, 2);
    b.plat(75, 4, 10);
    b.goal(81, 4);
    b.thin(-12, -3, 3); b.shard(-10.5, -1.4);    // tucked under the start ledge
  }),

  // 4 ── a scalding tunnel: exhaust jets fire in a rolling wave, so run with the wave (or hide in the roof pocket)
  L('Exhaust Port', 'timing', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 40);
    b.rect(8, 4, 20, 1); b.rect(31, 4, 17, 1);  // tunnel roof with a pocket at 28–31
    b.rect(27, 7.5, 5, 0.8);
    b.shard(29.5, 5.4);
    for (let i = 0; i < 5; i++) b.beam('exhaust', 13 + i * 7, 0, { w: 1.6, h: 4, P: 3, on: 1.1, warn: 0.7, off: -i * 0.82 });
    b.cells(10, 1.2, 46, 1.2, 10);
    b.plat(52, 1, 5);
    b.checkpoint(54, 1);
    b.shard(44, 6.6);                            // on the tunnel roof, back over your shoulder
    // jets rising out of the void through every gap
    b.plat(61, 2, 4); b.plat(69, 3, 4); b.plat(77, 2, 4); b.plat(85, 3, 9.6);
    for (let i = 0; i < 4; i++) b.beam('exhaust', 59 + i * 8, -6, { w: 1.6, h: 11, P: 2.4, on: 1, off: i * 0.6 });
    b.arc(57, 1, 61, 2, 1, 1.6); b.arc(65, 2, 69, 3, 1, 1.6); b.arc(73, 3, 77, 2, 1, 1.6); b.arc(81, 2, 85, 3, 1, 1.6);
    b.shard(67, 6.4);                            // right in a jet column
    // a chimney with a jet in its base: climb before it fires
    b.wall(91, 6.2, 9); b.wall(94.6, 3, 13);
    b.beam('exhaust', 93.2, 3, { w: 1.6, h: 5, P: 3, on: 1 });
    b.cells(93.2, 6, 93.2, 13, 3);
    b.plat(95.4, 16, 9);
    b.goal(100, 16);
  }),

  // 5 ── under the drop forge: pistons slam in sequence, wait in the gaps, then cross stamping pads
  L('Drop Forge', 'gauntlet', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 42);
    b.rect(8, 4.5, 42, 1);                      // forge housing (walk on its roof for a shard)
    for (let i = 0; i < 6; i++) b.beam('piston', 14 + i * 6, 0, { w: 2.4, h: 4.5, P: 3, on: 0.6, warn: 0.8, off: i * 0.5 });
    b.cells(11, 1, 47, 1, 7);
    b.shard(17, 1);                              // safe spot between the first two hammers
    b.plat(54, 2, 6);
    b.checkpoint(57, 2);
    b.shard(46, 7.2);                              // on the housing roof, reached from the rest ledge
    // stamping pads: each little pad has its own hammer
    const pads = [[64, 2], [71, 3], [78, 2], [85, 3]];
    pads.forEach(([x, t], i) => {
      b.plat(x, t, 3);
      b.beam('piston', x + 1.5, t, { w: 2.4, h: 5, P: 2.4, on: 0.5, warn: 0.7, off: i * 0.6 });
      b.rect(x - 0.5, t + 5, 4, 1);
      b.cell(x + 1.5, t + 1.2);
    });
    b.plat(92, 3, 10);
    b.goal(98, 3);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 6 ── a ticking shaft: escapement lifts, a crumble ladder and a wall-mounted cannon, all the way up
  L('Escapement Shaft', 'ascent', (b) => {
    b.start(-6, 0, 12);
    b.tower(6.5, -2, 18.5, 40);
    b.rect(5, 4, 1.5, 34);                      // shaft walls
    b.rect(25, -2, 1.5, 38);
    b.plat(6, 0, 9);
    b.lift(17, 0, 8, { T: 4 });
    b.plat(19, 8, 6);
    b.thin(12, 11, 4);
    b.lift(9, 11, 18, { T: 4.5 });
    b.plat(6.5, 19, 5);
    b.checkpoint(8.5, 19);
    b.shard(23, 13);                            // above the first ledge, behind the lift path
    b.crumble(13, 21.5, 3); b.crumble(19, 24, 3); b.crumble(13, 27, 3);
    b.rect(23.5, 25.5, 1.5, 2); b.turret(23.5, 26.2, -1, { P: 2.6 });
    b.lift(20.5, 28, 35, { T: 4 });
    b.cells(9, 12, 9, 17, 3); b.cells(14, 23, 20, 25.5, 3);
    b.thin(7, 31, 3); b.shard(8.5, 33);          // hop off the top lift, back left
    b.plat(22, 37, 14);
    b.goal(32, 37);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 7 ── climb a staircase of belts that all run downhill, then ride downhill belts into the pistons
  L('Ratchet Run', 'precision', (b) => {
    b.start(-6, 0, 12);
    for (let i = 0; i < 6; i++) b.conveyor(9 + i * 8, 1 + i * 2, 6, -3 - i * 0.2);
    b.cells(10, 2.2, 52, 12.2, 10);
    b.thin(30, 11, 3); b.shard(31.5, 12.8);      // a pawl above the climb
    b.plat(58, 12, 5);
    b.checkpoint(60, 12);
    // downhill belts that feed you into the hammers
    b.conveyor(66, 10, 9, 4);
    b.beam('piston', 72.5, 10, { w: 2.4, h: 5, P: 2.6, on: 0.6 }); b.rect(71, 15, 3, 1);
    b.conveyor(79, 8, 9, 4);
    b.beam('piston', 85.5, 8, { w: 2.4, h: 5, P: 2.6, on: 0.6, off: 1.3 }); b.rect(84, 13, 3, 1);
    b.conveyor(92, 6, 9, 4);
    b.beam('piston', 98.5, 6, { w: 2.4, h: 5, P: 2.6, on: 0.6 }); b.rect(97, 11, 3, 1);
    b.cells(67, 11.2, 100, 7.2, 9);
    b.plat(78, 3, 3); b.shard(79.5, 4.8);         // low ledge under the second belt
    b.plat(105, 5, 10);
    b.goal(111, 5);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 8 ── a gear train: six cogs of different sizes and directions hand you on, never touch the void
  L('Gear Train', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.ferris(14, 0, 4, { n: 4, omega: 0.6 });
    b.ferris(24, 3, 4, { n: 4, omega: -0.6 });
    b.ferris(35, 6, 5, { n: 6, omega: 0.5 });
    b.shard(35, 13.4);
    b.plat(43, 6, 5);
    b.checkpoint(45, 6);
    b.ferris(55, 4, 6, { n: 6, omega: -0.45 });
    b.shard(55, 4.6);
    b.ferris(67, 9, 3.5, { n: 3, omega: 0.8 });
    b.ferris(77, 5, 4, { n: 4, omega: -0.6 });
    b.cells(14, 5.5, 14, 5.5, 1); b.cells(24, 8.5, 24, 8.5, 1); b.cells(55, 11.5, 55, 11.5, 1); b.cells(67, 14, 67, 14, 1);
    b.plat(85, 5, 10);
    b.goal(91, 5);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 9 ── a sorting machine: belts carry you past lever gates; each button flips which way the machine lets you go
  L('Sorting Gate', 'puzzle', (b) => {
    b.start(-6, 0, 12);
    b.conveyor(8, 0, 30, 3);                    // lower belt → right
    b.plat(38, 0, 8); b.switch(42, 0);           // lever 1: red gone, blue appears
    b.blue(46, 3, 3);
    b.conveyor(14, 6, 28, -3);                  // upper belt ← left
    b.redWall(26, 6, 4);                         // blocks the upper belt until lever 1
    b.plat(4, 6, 10); b.switch(7, 6);            // lever 2: red is back
    b.red(15, 9.5, 3); b.red(21, 12, 3);
    b.plat(27, 13, 8);
    b.checkpoint(30, 13);
    b.conveyor(37, 13, 14, -4);                 // headwind belt on the top deck
    b.plat(53, 13, 6); b.switch(56, 13);         // lever 3: blue bridge out to the exit
    b.blue(62, 13, 4); b.blue(69, 14, 4); b.blue(76, 15, 3);
    b.plat(82, 15, 9);
    b.goal(87, 15);
    b.cells(10, 1.2, 36, 1.2, 8); b.cells(38, 7.2, 16, 7.2, 8); b.cells(38, 14.2, 50, 14.2, 5);
    b.red(49, 1.5, 3); b.shard(50.5, 3.3);       // a red perch past lever 1: jump the button to grab it
    b.blue(0, 10, 3); b.shard(1.5, 11.8);        // blue perch above lever 2 (only before you pull it)
    b.shard(70, 17.6);
  }),

  // 10 ── CHASE: the Crusher Wall grinds in; belts speed you up, grates crumble, never stop
  L('Grindstone Sprint', 'chase', (b) => {
    b.chase({ speed: 4.2 });
    b.start(-6, 0, 14);
    b.plat(12, 0, 5);
    b.conveyor(21, 1, 10, 4);
    b.crumble(35, 1, 2.5); b.crumble(40, 2, 2.5);
    b.plat(46, 3, 5); b.spring(49, 3, 6);
    b.plat(54, 10, 6);
    b.checkpoint(57, 10);
    b.conveyor(64, 8, 12, 5);
    b.rect(64, 11, 12, 1);                       // low roof over the speed belt
    b.plat(81, 5, 4);
    b.crumble(88, 4, 2.4); b.crumble(93, 3, 2.4);
    b.plat(99, 2, 7); b.enemy('walker', 100, 2, { range: 5 });
    b.conveyor(110, 2, 10, 4);
    b.plat(124, 3, 12);
    b.goal(132, 3);
    b.cells(13, 1.2, 30, 2.2, 6); b.cells(65, 9.2, 75, 9.2, 4); b.cells(100, 3.2, 119, 3.2, 6);
    b.shard(57, 14.4); b.shard(122, 7);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),
  // 11 ── down through the boiler: switchback ledges, hot plates and exhaust that scalds whatever lands on it
  L('Boiler Descent', 'descent', (b) => {
    b.start(-6, 30, 12);
    b.rect(-6, 36, 46, 1);                       // boiler crown
    b.plat(10, 27, 5);
    b.beam('exhaust', 12.5, 27, { w: 1.8, h: 4, P: 3, on: 1 });
    b.heat(19, 24, 6, { P: 3, on: 1.2, off: 1.5 });
    b.plat(29, 21, 4);
    b.wall(35, 8, 24);                           // boiler's right shell
    b.plat(20, 17, 5);
    b.plat(9, 13, 6);
    b.checkpoint(12, 13);
    b.beam('exhaust', 17.5, 0, { w: 1.6, h: 15, P: 2.6, on: 1, off: 1 });
    b.shard(17.5, 14.5);                         // inside the jet's column
    b.crumble(20, 10, 3); b.crumble(26, 7, 3);
    b.plat(31, 4, 4);
    b.beam('exhaust', 33, 4, { w: 1.6, h: 4, P: 2.6, on: 0.9 });
    b.plat(39, 1, 10); b.enemy('walker', 40, 1, { range: 8 });
    b.plat(50, -4, 3); b.shard(51.5, -2.4);       // low ledge below the walker deck
    b.plat(55, -2, 4);
    b.heat(62, -4, 4, { P: 2.8, on: 1.1 });
    b.plat(70, -6, 10);
    b.goal(76, -6);
    b.arc(6, 30, 10, 27, 2, 1); b.cells(20, 25.2, 24, 25.2, 3); b.cells(21, 18.2, 24, 18.2, 2);
    b.cells(10, 14.2, 14, 14.2, 3); b.cells(21, 11.2, 33, 5.2, 4); b.cells(41, 2.2, 47, 2.2, 3);
    b.plat(-13, 26, 3); b.shard(-11.5, 27.8);     // a perch below and behind the start
  }),

  // 12 ── a gallery of pendulums: ride the swing out, let go at the end, and finally hop pendulum to pendulum
  L('Pendulum Gallery', 'ride', (b) => {
    const pend = (cx, cy, R, amp, o = {}) => {
      const pts = [];
      for (let k = 0; k <= 8; k++) { const a = -amp + (2 * amp * k) / 8; pts.push([cx + R * Math.sin(a), cy - R * Math.cos(a)]); }
      b.loop(pts, { speed: o.speed ?? 4, w: 3, loop: false, phase: o.phase ?? 0 });
      b.rect(cx - 0.6, cy, 1.2, 0.8);            // pivot
    };
    b.start(-6, 0, 12);
    pend(15, 13, 12, 0.55);
    b.plat(25, 3, 4);
    pend(36, 14, 12, 0.6, { phase: 0.5 });
    b.shard(44, 7);                               // fly off the far end of the swing
    b.plat(45, 3, 5); b.enemy('walker', 45.5, 3, { range: 3.5 });
    b.checkpoint(47, 3);
    pend(57, 15, 12, 0.6);
    pend(70, 15, 12, 0.6, { phase: 1 });          // swings opposite: meet it at the top
    b.shard(63.5, 8);
    b.plat(80, 4, 4);
    pend(97, 16, 11, 0.7, { speed: 4.5 });
    b.plat(108, 5, 8);
    b.goal(113, 5);
    b.cells(9, 3.5, 21, 3.5, 4); b.cells(30, 4, 42, 4, 4); b.cells(51, 4.5, 76, 4.5, 8); b.cells(90, 7, 104, 7, 4);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 13 ── the foundry floor: walker robots ride the belts with you, spikers guard the decks, a cannon sweeps the line
  L('Foundry Floor', 'enemies', (b) => {
    b.start(-6, 0, 12);
    b.conveyor(9, 0, 16, 2.5); b.enemy('walker', 10, 0, { range: 13, speed: 2 });
    b.plat(29, 1, 10); b.enemy('spiker', 29.5, 1, { range: 8, speed: 2.4 });
    b.thin(30, 4.5, 8);
    b.shard(34, 6.6);
    b.conveyor(43, 2, 14, -3); b.enemy('walker', 44, 2, { range: 11, speed: 1.8 });
    b.rect(57, 2, 1.5, 4); b.turret(57.75, 2.8, -1, { P: 2.4 });   // the mount is a stepping stone
    b.shard(57.75, 8);
    b.plat(60, 3, 6);
    b.checkpoint(63, 3);
    b.conveyor(70, 3, 16, 3.5);
    b.enemy('flyer', 75, 6, { ax: 3, ay: 1, T: 3 });
    b.enemy('spiker', 82, 3, { range: 3.5, speed: 1.8 });
    b.thin(80, 6.4, 5);
    b.plat(90, 4, 12); b.enemy('walker', 91, 4, { range: 4 }); b.enemy('walker', 96, 4, { range: 4, speed: 2.2 });
    b.goal(99, 4);
    b.cells(11, 1.2, 23, 1.2, 4); b.cells(31, 5.6, 37, 5.6, 4); b.cells(45, 3.2, 55, 3.2, 4); b.cells(72, 4.2, 84, 7.4, 5);
    b.plat(72, -1, 3); b.shard(73.5, 0.6);       // under the fast belt
  }),

  // 14 ── paternosters: open elevator cars that loop forever, up one side and down the other
  L('Paternoster', 'ascent', (b) => {
    b.start(-6, 0, 12);
    b.tower(8, -2, 11, 26);
    for (let i = 0; i < 4; i++) b.loop([[16, 0], [16, 24], [10, 24], [10, 0]], { speed: 2.6, w: 2.6, phase: i * 0.25 });
    b.plat(18.5, 8, 5); b.cells(19.5, 9.2, 22.5, 9.2, 3);
    b.plat(18.5, 16, 5); b.enemy('walker', 19, 16, { range: 3.5 });
    b.plat(2, 14, 6); b.shard(3.5, 15.8);         // off the descending side
    b.shard(13, 27.4);                            // over the top of the loop
    b.plat(19, 24, 6);
    b.checkpoint(22, 24);
    b.tower(28, 22, 11, 48);
    for (let i = 0; i < 4; i++) b.loop([[36, 24], [36, 46], [30, 46], [30, 24]], { speed: 2.8, w: 2.6, phase: i * 0.25 });
    b.rect(39.5, 30, 1.5, 6); b.turret(39.5, 33, -1, { P: 2.8 });   // fires across the climbing cars
    b.rect(39.5, 38, 1.5, 4); b.turret(39.5, 40, -1, { P: 2.8, off: 1.4 });
    b.plat(24.5, 36, 3); b.shard(26, 37.8);
    b.cells(16, 2, 16, 22, 5); b.cells(36, 26, 36, 44, 5);
    b.plat(38.5, 46, 9);
    b.goal(43, 46);
  }),

  // 15 ── belts feed you onto springs: the machine throws you, ceilings shape the throw, a hammer guards the last pad
  L('Spring Feed', 'bounce', (b) => {
    b.start(-6, 0, 12);
    b.conveyor(8, 0, 9, 3);
    b.plat(17, 0, 3); b.spring(17.6, 0, 6);
    b.rect(13, 11, 8, 1);                        // ceiling: drift right off the spring
    b.plat(22, 7, 5);
    b.conveyor(27, 7, 8, 3);
    b.plat(35, 7, 3); b.spring(35.6, 7, 9);
    b.plat(40, 16, 6);
    b.checkpoint(43, 16);
    b.cells(18.5, 3, 21, 8, 4); b.cells(36.5, 10, 39, 17, 4);
    b.plat(50, 11, 3); b.spring(50.6, 11, 6);
    b.rect(48, 21.5, 6, 1);
    b.plat(56, 15, 3); b.spring(56.6, 15, 5);
    b.thin(60, 23, 4); b.shard(62, 25);           // a high catwalk above the pads
    b.plat(63, 14, 3); b.spring(63.6, 14, 7);
    b.beam('piston', 64.5, 14.5, { w: 2.6, h: 6, P: 2.8, on: 0.6 }); b.rect(63, 20.5, 3, 1);
    b.plat(69, 18, 4);
    b.conveyor(76, 15, 10, -3);                  // a backwards belt into the last spring
    b.plat(86, 15, 3); b.spring(86.6, 15, 4);
    b.plat(91, 18, 10);
    b.goal(97, 18);
    b.shard(44, 21); b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 16 ── a giant clock face: twelve cog pads tick slowly round; climb the dial, then a quicker counter-dial
  L('Clock Face', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.plat(10, 2, 5);
    b.ferris(30, 11, 10, { n: 12, omega: 0.25, w: 2.6 });
    b.plat(28, 11, 4); b.shard(30, 12.8);         // the hub
    b.shard(30, 23.6);                            // twelve o'clock
    b.plat(43, 14, 5);
    b.checkpoint(45, 14);
    b.ferris(57, 15, 6, { n: 8, omega: -0.4 });
    b.plat(55.5, 15, 3); b.shard(57, 16.8);       // second hub
    b.plat(66, 21, 9);
    b.goal(71, 21);
    b.cells(16, 3, 20, 5, 3); b.cells(44, 15.2, 47, 15.2, 2);
    for (let i = 0; i < 6; i++) b.cell(30 + 8 * Math.cos(Math.PI * (1 + i / 5)), 11 + 8 * Math.sin(Math.PI * (1 + i / 5)) + 1.4);
  }),

  // 17 ── rusty grates on the belt line: the belts deliver you onto crumbling grates, so never stop moving
  L('Rust Belt', 'precision', (b) => {
    b.start(-6, 0, 12);
    b.conveyor(9, 0, 8, 3);
    b.crumble(19, 0, 2.6); b.crumble(23.5, 0.8, 2.6); b.crumble(28, 0, 2.6);
    b.conveyor(33, 1, 10, -3);                    // fights you while the grate behind falls
    b.crumble(45, 2, 2.4); b.crumble(49.5, 3, 2.4);
    b.plat(54, 4, 6);
    b.checkpoint(57, 4);
    b.rect(62, 7, 18, 1);                         // roof over a fast belt
    b.conveyor(62, 4, 18, 5);
    b.crumble(83, 3, 2.2); b.crumble(87, 2, 2.2); b.crumble(91, 3, 2.2);
    b.thin(66, 9.4, 10); b.shard(71, 11);          // on top of the roof
    b.conveyor(96, 4, 8, -4);
    b.crumble(106, 5, 2.2); b.crumble(110, 6.5, 2.2);
    b.plat(115, 7, 10);
    b.goal(121, 7);
    b.cells(10, 1.2, 30, 1.2, 6); b.cells(34, 2.2, 50, 4.2, 5); b.cells(63, 5.2, 92, 4.2, 9); b.cells(97, 5.2, 111, 7.7, 5);
    b.crumble(88, -1.5, 2); b.shard(89, 0.2);     // under the grate run
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 18 ── ride cogs between cannon pillars: the pillar tops are safe stops, their cannons sweep the gears
  L('Cannon Carousel', 'gauntlet', (b) => {
    b.start(-6, 0, 12);
    b.ferris(14, 3, 5, { n: 4, omega: 0.5 });
    b.rect(22.5, -6, 2, 11); b.turret(22.5, 2, -1, { P: 2.6 }); b.turret(24.5, 0, 1, { P: 2.6, off: 1.3 });
    b.ferris(32, 6, 5, { n: 4, omega: -0.5 });
    b.rect(40.5, -6, 2, 14); b.plat(39.5, 9, 4); b.turret(40.5, 6, -1, { P: 2.4 }); b.turret(42.5, 4, 1, { P: 2.4, off: 1.2 });
    b.checkpoint(41.5, 9);
    b.ferris(51, 8, 5.5, { n: 6, omega: 0.45 });
    b.rect(59.5, -6, 2, 17); b.plat(58.5, 12, 4); b.turret(59.5, 8, -1, { P: 2.2 });
    b.ferris(69, 11, 4.5, { n: 4, omega: -0.6 });
    b.rect(78, 4, 1.5, 6); b.turret(78, 8, -1, { P: 2.4, off: 0.8 });
    b.plat(77, 13, 11);
    b.goal(84, 13);
    b.cells(14, 8.6, 14, 8.6, 1); b.cells(32, 11.6, 32, 11.6, 1); b.cells(51, 14.2, 51, 14.2, 1);
    b.shard(23.5, 7.6); b.shard(51, 8.6); b.shard(69, 17.4);
  }),

  // 19 ── a stair of hammers: climb as the wave of pistons climbs, then descend into a wave coming at you
  L('Hammer Stair', 'timing', (b) => {
    b.start(-6, 0, 12);
    for (let i = 0; i < 6; i++) {
      const x = 8 + i * 5, t = 1 + i * 1.8;
      b.plat(x, t, 3.6);
      b.beam('piston', x + 1.8, t, { w: 2.4, h: 4.5, P: 3, on: 0.6, warn: 0.7, off: -i * 0.4 });
      b.rect(x, t + 4.5, 3.6, 1);
      b.cell(x + 1.8, t + 1.2);
    }
    b.plat(38, 11, 6);
    b.checkpoint(41, 11);
    b.shard(35.8, 13.6);                           // on the last hammer's housing
    for (let i = 0; i < 6; i++) {
      const x = 48 + i * 5, t = 10 - i * 1.8;
      b.plat(x, t, 3.6);
      b.beam('piston', x + 1.8, t, { w: 2.4, h: 4.5, P: 2.6, on: 0.6, warn: 0.7, off: i * 0.4 });
      b.rect(x, t + 4.5, 3.6, 1);
      b.cell(x + 1.8, t + 1.2);
    }
    b.plat(57, -2, 3); b.shard(58.5, -0.4);        // a ledge under the descending stair
    b.plat(80, 0, 10);
    b.goal(86, 0);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 20 ── CHASE: down a chute, along a roofed speed belt, up a spring and over the summit, the Crusher Wall behind
  L('Crankshaft Escape', 'chase', (b) => {
    b.chase({ speed: 4.5 });
    b.start(-6, 8, 14);
    b.plat(12, 6, 5);
    b.crumble(21, 4, 2.5); b.crumble(26, 2, 2.5);
    b.conveyor(31, 0, 14, 5); b.rect(31, 3, 14, 1);
    b.plat(49, 0, 5); b.spring(51.5, 0, 7);
    b.plat(57, 8, 6);
    b.checkpoint(60, 8);
    b.thin(67, 11, 3); b.thin(72, 14, 3);
    b.plat(78, 16, 5);
    b.crumble(87, 14, 2.4); b.crumble(92, 13, 2.4);
    b.conveyor(98, 12, 12, 4); b.enemy('walker', 100, 12, { range: 6, speed: 2 });
    b.crumble(114, 11, 2.5); b.crumble(119, 12, 2.5);
    b.plat(125, 12, 12);
    b.goal(133, 12);
    b.cells(13, 7.2, 27, 3.2, 5); b.cells(32, 1.2, 44, 1.2, 5); b.cells(68, 12.2, 80, 17.2, 4); b.cells(99, 13.2, 120, 13.2, 6);
    b.shard(38, 5.4); b.shard(80.5, 20.4);
    b.plat(-14, 9.5, 3); b.shard(-12.5, 11.5);
  }),
];
