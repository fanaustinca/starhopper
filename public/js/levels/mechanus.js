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
    b.vine(44, 10, 6);                           // a hanging chain over the belt's end: a first swing to try
    b.pendulum(76.5, 12, 8, { amp: 25, T: 4 });   // a chain-hung plate between the last two ledges
  }),

  // 2 ── overhead trolley lines: zip down the rails, ride a counterweight lift back up, then swing across on chain-hung pendulum platforms
  L('Trolley Line', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.zip(7, 3.2, 25, 0.2);                     // your first trolley rail: jump up, grab, slide
    b.plat(27, -3, 6);
    b.conveyor(34, -3, 10, 3);
    b.cells(35, -1.8, 43, -1.8, 4);
    b.floater(47, -3, 3, { rise: 9, speed: 2.2 }); // counterweight elevator
    b.cells(48.5, -0.5, 48.5, 5, 3);
    b.shard(48.5, 10.8);                        // ride it to the very top and double-jump
    b.plat(53, 6, 4);
    b.zip(58, 9.2, 78, 4);
    b.plat(72, 0.5, 3); b.shard(73.5, 2.3);     // drop off the rail onto a low ledge, then hop on to the next ledge
    b.plat(80, 1, 6);
    b.checkpoint(83, 1);
    b.pendulum(94, 13, 10, { amp: 35, T: 4 });  // chain-hung platforms over the void
    b.pendulum(106, 13, 10, { amp: 35, T: 4, phase: 0.5 });
    b.plat(114, 3, 5);
    b.wrecker(122, 11, 6, { amp: 45, T: 3 });
    b.plat(120, 3, 12);
    b.goal(128, 3);
    b.cells(8, 4.5, 24, 1.5, 6); b.cells(59, 7.5, 77, 2.5, 6);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
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
    b.vine(46.5, 19, 6);                         // swing from the top ledge onto the third cog
    b.wrecker(80, 12, 6.5, { amp: 40, T: 3.2 });  // a hammer guarding the exit
  }),

  // 4 ── steam cannon alley: boiler pods fire you across the void, first fixed, then rocking, then ratcheting round, then a pod ladder up
  L('Steam Cannon Alley', 'cannon', (b) => {
    b.start(-6, 0, 12);
    b.plat(9, 0, 5);
    b.barrel(13, 2.2, { angle: 40 });           // pod 1: hop in, press jump
    b.plat(21, 1, 7);
    b.barrel(27, 3, { angle: 15 });             // pod chain: no ground between
    b.barrel(33, 2.9, { angle: 15, sweep: 25, spin: 80 });
    b.barrel(39, 2.7, { angle: 40 });
    b.plat(48, 1.5, 7);
    b.checkpoint(51, 1.5);
    b.barrel(58, 4.5, { spin: 100 });           // ratcheting pod: wait for it to face the ledge
    b.beam('exhaust', 61, -8, { w: 1.6, h: 11, P: 2.6, on: 1 });
    b.plat(64, 7, 4);
    b.barrel(71, 9, { angle: 70, sweep: 35, spin: 100, power: 20 });   // a rocking pod
    b.plat(78, 12.5, 5);
    b.barrel(86, 15, { angle: 90, power: 22 }); // pod ladder
    b.barrel(86, 20.5, { angle: 90, power: 22 });
    b.barrel(86, 26, { spin: 90 });
    b.shard(86, 31);
    b.plat(93, 23, 9);
    b.goal(99, 23);
    b.arc(3, 0, 11, 2, 2, 1); b.cells(52, 2.5, 56, 3.5, 2); b.cells(29, 3, 37, 2.9, 3);
    b.plat(64.5, 14, 2.5); b.shard(65.7, 16);       // the rocking pod, rocked all the way back, reaches this perch
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
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
    b.wrecker(18.2, 4.5, 3.4, { amp: 40, T: 3, phase: 0.5 });
    b.wrecker(30.2, 4.5, 3.4, { amp: 40, T: 3, phase: 0.5 });
    b.wrecker(42.2, 4.5, 3.4, { amp: 40, T: 3, phase: 0.5 });
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
    b.wrecker(14, 36, 5.5, { amp: 45, T: 3.4 });  // a hammer over the top landing
  }),

  // 7 ── hammer bridge: chain-hung pendulum platforms over the void, then a hall where wrecking hammers and pistons beat out alternate time
  L('Hammerfall Bridge', 'timing', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 6);
    b.pendulum(21, 14, 11, { amp: 32, T: 4 });
    b.plat(29, 0, 6);
    b.plat(38, 0, 28);
    b.rect(38, 8, 28, 1);                       // hall roof
    b.wrecker(43, 8, 6.4, { amp: 48, T: 3 });
    b.beam('piston', 48.5, 0, { w: 2.2, h: 8, P: 3, on: 0.6, warn: 0.7, off: 1.5 });
    b.wrecker(53, 8, 6.4, { amp: 48, T: 3, phase: 0.5 });
    b.beam('piston', 58.5, 0, { w: 2.2, h: 8, P: 3, on: 0.6, warn: 0.7, off: 0 });
    b.cells(40, 1.2, 64, 1.2, 8);
    b.shard(63, 5);
    b.checkpoint(65, 0);
    b.plat(72, 2, 3);
    b.pendulum(82, 15, 11, { amp: 35, T: 3.6 });
    b.pendulum(94, 15, 11, { amp: 35, T: 3.6, phase: 0.5 });
    b.wrecker(88, 14, 5, { amp: 40, T: 3.6, phase: 0.2 });
    b.plat(103, 4, 10);
    b.goal(109, 4);
    b.plat(30, -6, 3); b.shard(31.5, -4.4);     // a ledge below the first pendulum's far side
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
    b.cells(44, 7.2, 47, 7.2, 3); b.cells(86, 6.2, 89, 6.2, 3);
    b.plat(85, 5, 10);
    b.goal(91, 5);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.vine(82.5, 12, 6);                         // swing from the last cog to the exit
    b.wrecker(91, 14, 7, { amp: 35, T: 3.4 });
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
    b.wrecker(44, 20, 6, { amp: 40, T: 3 });      // a hammer over the headwind belt
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
    b.zip(32, 4.2, 45, 4.2);                    // a level trolley rail skips the crumbles
    b.zip(86, 8, 98, 5.2);
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
    b.wrecker(44, 9, 6, { amp: 45, T: 3 });
    b.zip(60, 1, 69, -3);                        // a rail down to the exit
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
    b.wrecker(82, 11, 6, { amp: 40, T: 3 });
    b.tornado(30, 32, 0, { rise: 8, T: 4 });     // a steam vortex drifting between the first ledges
  }),

  // 13 ── the chain gang: swing from hanging foundry chains across the pit, ride chain-hung plates, then dodge the ladle hammer
  L('Chain Gang', 'swing', (b) => {
    b.start(-6, 2, 12);
    b.vine(11, 10, 6);
    b.plat(16, 2, 4);
    b.plat(23, -1, 3); b.shard(24.5, 0.6);      // a sunken ledge under the second chain
    b.vine(26, 11, 6);
    b.plat(32, 3, 10); b.enemy('walker', 34, 3, { range: 6 });
    b.checkpoint(40, 3);
    b.pendulum(50, 15, 11, { amp: 35, T: 4 });  // chain-hung plates over the void
    b.pendulum(63, 15, 11, { amp: 35, T: 4, phase: 0.5 });
    b.shard(56.5, 9);
    b.conveyor(71, 3, 10, -3);
    b.wrecker(76, 11, 6.5, { amp: 45, T: 3 });
    b.vine(86, 13, 6);
    b.plat(91, 9, 4);
    b.plat(100, 10, 9);
    b.goal(105, 10);
    b.cells(11, 6, 26, 7, 5); b.cells(72, 4.2, 80, 4.2, 4);
    b.vine(-9, 12, 5); b.plat(-17, 7, 3); b.shard(-15.5, 9);
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
    b.wrecker(43, 53, 6, { amp: 35, T: 3 });
  }),

  // 15 ── steam-cannon relay: climb the machine by blasting from pod to pod, with a rising counterweight between the volleys
  L('Steam Relay', 'cannon', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 0, 4);
    b.barrel(10, 2.2, { angle: 65, power: 22 });
    b.plat(15, 7, 4);
    b.barrel(21, 9.2, { angle: 30, sweep: 20, spin: 80 });
    b.plat(30, 10, 5);
    b.floater(41, 10, 3, { rise: 9, speed: 2.2 });
    b.cells(42.5, 12, 42.5, 18, 3);
    b.shard(42.5, 23.5);                        // ride the counterweight up and double-jump
    b.plat(46, 19, 5);
    b.checkpoint(48, 19);
    b.barrel(53, 21.2, { spin: 110 });
    b.plat(61, 22, 3);
    b.barrel(64.5, 24.2, { angle: 70, power: 22 });
    b.plat(66, 27, 4); b.shard(68, 28.7);
    b.barrel(72, 28.7, { angle: 15 });
    b.barrel(78, 28.5, { angle: 15 });
    b.plat(86, 26, 10);
    b.goal(92, 26);
    b.cells(11, 4, 15, 8, 3); b.cells(87, 27.2, 91, 27.2, 2);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
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
    b.sweeper(57, 20, 2.5, { omega: 80 });
    b.wrecker(70, 28, 6.5, { amp: 40, T: 3 });
  }),

  // 17 ── counterweight quarry: ride rising counterweights up the cliff, then step down sinking weights across the pit
  L('Counterweight Quarry', 'weights', (b) => {
    b.start(-6, 0, 12);
    b.conveyor(9, 0, 8, 3);
    b.floater(20, 0, 3, { rise: 8, speed: 2.2 });
    b.cells(21.5, 2, 21.5, 7, 3);
    b.plat(26, 8, 5);
    b.conveyor(32, 8, 8, 3);
    b.sinker(43, 8, 3, { depth: 4, speed: 1.8 });
    b.sinker(48.5, 6, 3, { depth: 4, speed: 1.8 });
    b.sinker(54, 4, 3, { depth: 4, speed: 1.8 });
    b.shard(49.5, 0.8);                         // ride a weight all the way down
    b.plat(60, 3, 5);
    b.checkpoint(62, 3);
    b.floater(67, 3, 3, { rise: 10, speed: 2.4 });
    b.plat(72, 13, 4);
    b.wrecker(80, 20, 6, { amp: 45, T: 3 });
    b.plat(78, 13, 10);
    b.sinker(90, 13, 3, { depth: 8, speed: 1.4 });
    b.plat(96, 6, 10);
    b.goal(102, 6);
    b.shard(68.5, 16.5);
    b.cells(10, 1.2, 16, 1.2, 3); b.cells(44.5, 9.2, 55.5, 5.2, 5);
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
    b.cells(40, 10.2, 43, 10.2, 3); b.cells(80, 14.2, 82, 14.2, 2);
    b.cells(14, 8.6, 14, 8.6, 1); b.cells(32, 11.6, 32, 11.6, 1); b.cells(51, 14.2, 51, 14.2, 1);
    b.shard(23.5, 7.6); b.shard(51, 8.6); b.shard(69, 17.4);
    b.sweeper(80, 17.4, 3.5, { omega: 60, both: true });
  }),

  // 19 ── gong tower: climb a staircase of pendulum plates, with a wrecking hammer and a piston keeping time on every landing
  L('Gong Tower', 'timing', (b) => {
    b.start(-6, 0, 12);
    b.plat(8, 1, 4);
    b.pendulum(17, 14, 11, { amp: 30, T: 3.6 });
    b.plat(24, 4, 6);
    b.wrecker(28, 12, 5.5, { amp: 48, T: 3 });
    b.pendulum(37, 17, 11, { amp: 30, T: 3.6, phase: 0.5 });
    b.plat(44, 7, 6);
    b.beam('piston', 47, 7, { w: 2.2, h: 4.5, P: 3, on: 0.6, warn: 0.7 }); b.rect(45, 11.5, 4, 1);
    b.pendulum(57, 20, 11, { amp: 30, T: 3.6 });
    b.plat(64, 10, 6);
    b.checkpoint(67, 10);
    b.wrecker(68, 18, 5.5, { amp: 48, T: 3, phase: 0.5 });
    b.pendulum(77, 23, 11, { amp: 30, T: 3.6, phase: 0.5 });
    b.plat(84, 13, 6);
    b.beam('piston', 87, 13, { w: 2.2, h: 4.5, P: 3, on: 0.6, warn: 0.7, off: 1.5 }); b.rect(85, 17.5, 4, 1);
    b.plat(93, 15, 10);
    b.goal(99, 15);
    b.shard(48, 14); b.shard(80, 16.5);
    b.cells(9, 2.2, 12, 2.2, 2); b.cells(25, 5.2, 29, 5.2, 3); b.cells(94, 16.2, 98, 16.2, 3);
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
    b.zip(18, 9, 30, 3.5);                      // rails over the crumbles: no waiting on the grates
    b.zip(84, 19, 97, 15.2);
  }),
  // 21 ── a cascade of cogs falling away down the machine: each gear lowers you onto the next
  L('Gear Cascade', 'descent', (b) => {
    b.start(-6, 30, 12);
    b.ferris(13, 26, 4, { n: 4, omega: -0.5 });
    b.ferris(21, 19, 4.5, { n: 4, omega: 0.5 });
    b.plat(28, 14, 4);
    b.beam('piston', 30, 14, { w: 2.4, h: 4.5, P: 3, on: 0.6 }); b.rect(28.5, 18.5, 3, 1);
    b.ferris(38, 9, 5, { n: 6, omega: -0.45 });
    b.shard(38, 9.6);                              // in the third cog's hub
    b.plat(46, 5, 5);
    b.checkpoint(48, 5);
    b.ferris(57, 2, 4.5, { n: 4, omega: 0.55 });
    b.beam('exhaust', 62, -12, { w: 1.6, h: 12, P: 2.8, on: 1 });
    b.ferris(67, -4, 4, { n: 4, omega: -0.6 });
    b.shard(67, -6.6);                             // only the lowest tooth passes it
    b.plat(74, -6, 10);
    b.goal(80, -6);
    b.cells(13, 31.5, 13, 31.5, 1); b.cells(21, 25, 21, 25, 1); b.cells(29, 15.2, 31, 15.2, 2);
    b.cells(38, 15.5, 38, 15.5, 1); b.cells(47, 6.2, 50, 6.2, 2); b.cells(57, 8, 57, 8, 1);
    b.plat(-14, 31.5, 3); b.shard(-12.5, 33.5);
    b.zip(52, 8, 72, -3);                        // a rail straight down over the cogs
  }),

  // 22 ── an interlocking tower: every floor has a lever and a gate, and each lever opens the next floor while closing the last
  L('Interlock', 'puzzle', (b) => {
    b.start(-6, 0, 12);
    b.tower(6, -2, 24, 26);
    b.plat(6, 0, 18); b.switch(11, 0);
    b.redWall(18, 0, 5);
    b.lift(27, 0, 7, { T: 4.5 });
    b.blue(7, 4, 3); b.shard(8.5, 5.8);            // a blue perch that appears after lever 1
    b.plat(12, 7, 12); b.switch(20, 7);
    b.blueWall(16, 7, 5);
    b.lift(9, 7, 14, { T: 4.5 });
    b.plat(12, 14, 12); b.switch(14.5, 14);
    b.redWall(20, 14, 5);
    b.lift(27, 14, 21, { T: 4.5 });
    b.shard(27, 25.5);                             // above the third lift
    b.plat(12, 21, 12);
    b.checkpoint(16, 21);
    b.blue(26, 21, 3); b.blue(31, 22, 3);
    b.plat(36, 23, 4); b.switch(37.5, 23);
    b.red(42, 24, 3); b.red(47, 25, 3);
    b.red(40, 19, 3); b.shard(41.5, 20.8);         // a red ledge under the exit bridge
    b.plat(53, 26, 8);
    b.goal(58, 26);
    b.cells(13, 1.2, 16, 1.2, 2); b.cells(19, 8.2, 22, 8.2, 2); b.cells(15, 15.2, 18, 15.2, 2); b.cells(27, 22.4, 49, 26.4, 6);
    b.sweeper(20, 24.4, 2.8, { omega: 60, both: true });
    b.wrecker(57, 33, 6.5, { amp: 35, T: 3 });
  }),

  // 23 ── meshing teeth: counter-rotating gears whose cogs interleave; cross at the mesh, where hammers fall
  L('Meshing Teeth', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.ferris(14, 2, 4, { n: 4, omega: 0.6 });
    b.ferris(21, 2, 4, { n: 4, omega: -0.6, a0: Math.PI / 4 });
    b.plat(28, 4, 4);
    b.beam('piston', 30, 4, { w: 2.4, h: 5, P: 2.8, on: 0.6 }); b.rect(28.5, 9, 3, 1);
    b.ferris(39, 3, 3.5, { n: 3, omega: -0.7 });
    b.ferris(39, 9.5, 3.5, { n: 3, omega: 0.7, a0: 0.5 });
    b.shard(39, 6.25);                             // between the stacked hubs
    b.plat(45, 14, 5);
    b.checkpoint(47, 14);
    b.ferris(56, 12, 5, { n: 6, omega: 0.5 });
    b.ferris(64.5, 12, 5, { n: 6, omega: -0.5, a0: 0.5 });
    b.beam('piston', 60.25, 13, { w: 2.6, h: 7, P: 3, on: 0.7 }); b.rect(58.5, 20, 3.5, 1);
    b.shard(60.25, 8);                             // low in the mesh
    b.plat(72, 13, 8);
    b.goal(77, 13);
    b.cells(14, 7.5, 21, 7.5, 2); b.cells(29, 5.2, 31, 5.2, 2); b.cells(56, 18.5, 64.5, 18.5, 2);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.wrecker(76, 20, 6, { amp: 40, T: 3 });
  }),

  // 24 ── the boiler floods: scalding water rises through a two-column tower, a wall-jump chimney in the middle
  L('Boiler Flood', 'tide', (b) => {
    b.rise({ rate: 0.7, delay: 4 });
    b.start(-6, 0, 12);
    b.tower(6, -4, 18, 46);
    b.plat(8, 3, 4);
    b.plat(18, 6, 4); b.beam('exhaust', 20, 6, { w: 1.6, h: 3, P: 2.6, on: 0.9 });
    b.plat(8, 9, 4);
    b.shard(10, 12.6);
    b.plat(13.8, 12, 8.2);
    b.checkpoint(20, 12);
    b.wall(13, 13, 11); b.wall(16.8, 15, 9);      // chimney
    b.cells(15.2, 15, 15.2, 22, 3);
    b.plat(17.6, 24, 5);
    b.plat(8, 27, 4);
    b.thin(17, 30, 4);
    b.plat(25, 30, 3); b.shard(26.5, 31.8);        // out on a limb past the column
    b.conveyor(7, 33, 6, 2);
    b.plat(17, 36, 4);
    b.crumble(9, 39, 3);
    b.plat(15, 42, 10);
    b.goal(20, 42);
    b.cells(10, 28.2, 10, 28.2, 1); b.cells(9, 34.2, 12, 34.2, 2); b.cells(18, 37.2, 20, 37.2, 2);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.floater(12.8, 3, 2.6, { rise: 8, speed: 2.4 });
    b.vine(8, 34, 5);
  }),

  // 25 ── clock hands: every platform is a dial whose hour and minute hands sweep across it; jump the blades and cross the hubs
  L('Clock Hands', 'gauntlet', (b) => {
    b.start(-6, 0, 12);
    b.plat(9, 0, 10);
    b.sweeper(14, 3.4, 4.2, { omega: 55, both: true });
    b.plat(25, 1, 10);
    b.sweeper(30, 4.4, 4.2, { omega: -70, both: true });
    b.checkpoint(27, 1);
    b.plat(41, 2, 10);
    b.sweeper(46, 5.4, 4.2, { omega: 50, both: true });
    b.sweeper(46, 5.4, 2.6, { omega: -110, both: true });
    b.plat(57, 3, 10);
    b.sweeper(62, 6.4, 4.2, { omega: 80 });
    b.plat(73, 4, 6);
    b.slide(80, 4, 88, 8, { T: 5, w: 3 });
    b.plat(92, 8, 12);
    b.sweeper(98, 11.4, 4.2, { omega: 65, both: true });
    b.goal(102, 8);
    b.plat(20.5, -2, 3); b.shard(22, -0.4);     // a low ledge between the dials
    b.plat(36.5, -1, 3); b.shard(38, 0.6);
    b.cells(10, 1.2, 18, 1.2, 3); b.cells(26, 2.2, 34, 2.2, 3); b.cells(42, 3.2, 50, 3.2, 3); b.cells(58, 4.2, 66, 4.2, 3);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
  }),

  // 26 ── a balance wheel: sliders, hammers and shutters all tick on one 3-second beat; learn it and flow through
  L('Balance Wheel', 'timing', (b) => {
    b.start(-6, 0, 12);
    const T = 3;
    b.slide(12, 0, 20, 0, { T, w: 3 });
    b.beam('piston', 20, 0, { w: 2.4, h: 6, P: T, on: 0.6, warn: 0.7, off: 1 });
    b.blink(23, 0.5, 2, { P: T, on: 1.6, off: 0 });
    b.slide(28, 0, 36, 0, { T, w: 3, phase: 0.5 });
    b.beam('piston', 28, 0, { w: 2.4, h: 6, P: T, on: 0.6, warn: 0.7, off: 2.5 });
    b.blink(39, 0.5, 2, { P: T, on: 1.6, off: 1.5 });
    b.slide(44, 0, 52, 0, { T, w: 3 });
    b.plat(55, 1, 5);
    b.checkpoint(57, 1);
    b.lift(63, 1, 9, { T }); b.lift(69, 9, 1, { T });
    b.lift(75, 1, 9, { T });
    b.shard(69, 12);                               // above the middle lift's top stop
    b.slide(80, 10, 88, 14, { T, w: 3, phase: 0.5 });
    b.beam('piston', 84, 12, { w: 2.4, h: 6, P: T, on: 0.6, off: 1 }); b.rect(82.5, 18, 3, 1);
    b.plat(92, 14, 8);
    b.goal(97, 14);
    b.cells(12, 1.2, 20, 1.2, 3); b.cells(28, 1.2, 36, 1.2, 3); b.cells(44, 1.2, 52, 1.2, 3); b.cells(63, 10.4, 75, 10.4, 3);
    b.thin(36, 4.5, 4); b.shard(38, 6.3);
    b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5);
    b.wrecker(48, 9, 7, { amp: 50, T: 3, phase: 0.25 });
  }),

  // 27 ── OVERCLOCK: everything runs fast — flinging belts, a racing cog, wide leaps; momentum is the whole game
  L('Overclock', 'speed', (b) => {
    b.start(-6, 0, 12);
    b.conveyor(8, 0, 12, 6);
    b.plat(28, 0, 4);
    b.conveyor(36, 0, 12, 7); b.rect(36, 3, 12, 1);
    b.ferris(57, 3, 4, { n: 6, omega: 1.2 });
    b.plat(65, 4, 5);
    b.checkpoint(67, 4);
    b.conveyor(74, 4, 10, 6); b.enemy('walker', 75, 4, { range: 7, speed: 3 });
    b.conveyor(90, 6, 10, 7);
    b.plat(108, 6, 10);
    b.goal(114, 6);
    b.cells(9, 1.2, 19, 1.2, 4); b.arc(20, 0, 28, 0, 3, 2.5); b.cells(37, 1.2, 47, 1.2, 4); b.arc(84, 4, 90, 6, 2, 2); b.arc(100, 6, 108, 6, 3, 3);
    b.shard(42, 5.6);                              // on the tunnel roof
    b.shard(57, 3.6);                              // through the spinning hub
    b.shard(104, 10.4);                            // the top of the last leap
    b.zip(21, 3, 35, 0.5);
    b.sweeper(111, 10.2, 4, { omega: 120, both: true });
  }),

  // 28 ── an orrery: concentric rings turning against each other; explore the hubs, climb to the top
  L('Orrery', 'ride', (b) => {
    b.start(-6, 0, 12);
    b.ferris(20, 8, 8, { n: 8, omega: 0.3 });
    b.ferris(20, 8, 4, { n: 4, omega: -0.5 });
    b.plat(18.5, 8, 3); b.shard(20, 9.8);
    b.plat(30, 1, 4);
    b.ferris(40, 14, 6, { n: 6, omega: -0.35 });
    b.ferris(40, 14, 2.8, { n: 3, omega: 0.7 });
    b.shard(40, 14.4);
    b.plat(49, 6, 5);
    b.checkpoint(51, 6);
    b.ferris(62, 20, 7, { n: 7, omega: 0.3 });
    b.ferris(62, 20, 3, { n: 3, omega: -0.6 });
    b.plat(60.5, 20, 3); b.shard(62, 21.8);
    b.plat(72, 28, 8);
    b.goal(76, 28);
    b.cells(9, 1.2, 12, 2, 2); b.cells(31, 2.2, 33, 2.2, 2); b.cells(50, 7.2, 53, 7.2, 2);
    b.cells(20, 17.5, 20, 17.5, 1); b.cells(40, 21.5, 40, 21.5, 1); b.cells(62, 28.5, 62, 28.5, 1);
    b.wrecker(76, 35, 6.5, { amp: 35, T: 3 });
    b.tornado(25, 27, 0, { rise: 8, T: 5 });
  }),

  // 29 ── CLOCKBREAKER: belts into hammers, jets under grates, a switch bridge, a cannon chimney and a racing cog
  L('Clockbreaker', 'hard', (b) => {
    b.start(-6, 0, 12);
    b.conveyor(9, 0, 10, 4);
    b.beam('piston', 17, 0, { w: 2.4, h: 5, P: 2.4, on: 0.5 }); b.rect(15.5, 5, 3, 1);
    b.crumble(22, 1, 2.2); b.crumble(26.5, 2, 2.2);
    b.beam('exhaust', 25.3, -10, { w: 1.4, h: 13, P: 2.4, on: 0.9, off: 1.2 });
    b.ferris(36, 4, 4, { n: 3, omega: 0.8 });
    b.plat(43, 6, 4); b.switch(44.5, 6);
    b.blue(50, 7, 2.5); b.blue(55, 8, 2.5);
    b.red(50, 3, 2.5); b.shard(51.25, 4.8);         // only before the lever
    b.plat(60, 9, 9.4);
    b.checkpoint(62, 9);
    b.wall(65, 12, 10); b.wall(68.6, 9, 13);      // chimney
    b.beam('exhaust', 67, 9, { w: 1.4, h: 4, P: 2.6, on: 0.9 });
    b.rect(73.5, 19, 1.5, 3); b.turret(75, 20.2, 1, { P: 2.2 });   // sweeps the headwind belt
    b.shard(66.8, 23.5);
    b.plat(69.4, 22, 4);
    b.conveyor(77, 19, 8, -4);
    b.crumble(88, 17, 2);
    b.ferris(96, 15, 3.5, { n: 3, omega: -0.9 });
    b.plat(103, 14, 3); b.spring(103.6, 14, 4);
    b.beam('piston', 104.5, 14.5, { w: 2.6, h: 6, P: 2.6, on: 0.5, off: 1.3 }); b.rect(103, 20.5, 3, 1);
    b.plat(110, 18, 8);
    b.goal(115, 18);
    b.cells(10, 1.2, 18, 1.2, 3); b.cells(36, 8.5, 36, 8.5, 1); b.cells(50, 8.2, 56, 9.2, 2); b.cells(66.8, 13, 66.8, 20, 3); b.cells(78, 20.2, 84, 20.2, 3);
    b.shard(96, 15.6);
    b.wrecker(114, 25, 6.5, { amp: 45, T: 2.8 });
  }),

  // 30 ── FINALE: belt under hammers, a lever stair, a pair of cogs, then the Crusher Wall chases you out of the machine
  L('Heart of the Machine', 'finale', (b) => {
    b.start(-6, 0, 12);
    b.conveyor(8, 0, 13, 3); b.rect(8, 5, 13, 1);
    b.beam('piston', 12, 0, { w: 2.4, h: 5, P: 2.8, on: 0.6 }); b.beam('piston', 17, 0, { w: 2.4, h: 5, P: 2.8, on: 0.6, off: 1.4 });
    b.plat(24, 1, 5); b.switch(26, 1);
    b.blue(31, 3, 3); b.blue(36, 5, 3);
    b.red(31, 7, 3); b.shard(32.5, 8.8);           // over the lever stair: leap for it from the blue step
    b.ferris(47, 7, 4, { n: 4, omega: 0.55 });
    b.ferris(56, 11, 4, { n: 4, omega: -0.55 });
    b.shard(56, 11.6);
    b.plat(62, 15, 8);
    b.checkpoint(65, 15);
    b.chase({ speed: 4.6, trigger: 67, behind: 16 });
    b.crumble(74, 14, 2.4); b.crumble(79, 13, 2.4);
    b.conveyor(84, 12, 12, 5); b.rect(84, 15, 12, 1);
    b.plat(100, 10, 4); b.spring(101.5, 10, 6);
    b.plat(106, 17, 5);
    b.thin(115, 19, 3);
    b.crumble(122, 18, 2.4); b.crumble(127, 17, 2.4);
    b.plat(133, 16, 12);
    b.goal(141, 16);
    b.cells(9, 1.2, 20, 1.2, 4); b.cells(32, 4.2, 38, 6.2, 2); b.cells(75, 15.2, 95, 13.2, 7); b.cells(107, 18.2, 128, 18.2, 6);
    b.shard(90, 17.4);                             // on the belt roof
    b.zip(71, 18, 83, 15.2);
    b.zip(110, 21, 131, 19.2);
  }),
];
