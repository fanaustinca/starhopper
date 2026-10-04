// BONUS — THE BLACK HOLE. One level: THE END.
// A very long, very hard gauntlet stitched from every world in campaign order,
// falling through the singularity while the wreckage of everything you've
// visited (Big Ben, buses, rovers, gears, clocks…) spirals past in the dark.
import { L } from './dsl.js';

export default [
  L('THE END', 'finale', (b) => {
    b.start(-6, 0, 14);
    b.plat(-15, 2, 3); b.shard(-13.5, 4);                    // behind the start, as tradition demands

    // ── THE SUN: sunspot tiles, a flare, plasma tethers over the void, crumbling crust
    for (let i = 0; i < 5; i++) b.heat(10 + i * 3, 0, 3, { P: 2.4, on: 1.0, off: i * 0.45 });
    b.plat(25, 0, 3);
    b.beam('flare', 26.5, 0, { P: 2.6, on: 0.8 });
    b.vine(34, 7.5, 6); b.vine(42, 7.5, 6);
    b.plat(47, 0, 4);
    b.crumble(54, 1, 2.2); b.crumble(59, 2, 2.2);
    b.plat(64, 2, 5);
    b.checkpoint(66, 2);
    b.cells(11, 1, 23, 1, 5); b.cells(34, 3, 42, 3, 3); b.cells(55, 2.5, 61, 3.5, 2);

    // ── MERCURY: a constant low-gravity field: enormous leaps onto tiny ledges, a vent to a high shelf
    b.grav(69, -10, 60, 40, { low: 0.6, high: 0.6, P: 5 });
    b.plat(76, 4, 2.4);
    b.plat(89, 7, 2.4);
    b.plat(101, 3, 6); b.vent(104.5, 3, 7, { always: true });
    b.plat(108.5, 13, 4);
    b.shard(110.5, 19);                                        // a full low-g double jump above the shelf
    b.plat(122, 8, 4);
    b.cells(80, 8, 86, 10, 3); b.cells(92, 10, 98, 8, 3);

    // ── VENUS: acid clouds, an aerostat that rises, a zip line down through the haze
    b.cloud(130, 6, 12, { T: 3.4 });
    b.plat(134, 7, 3);
    b.floater(140, 7, 3, { rise: 7, speed: 2.4 });
    b.plat(145, 14, 4);
    b.zip(148, 16.5, 176, 6.5);
    b.cloud(162, 8, 14, { T: 3 });
    b.plat(174, 4, 6);
    b.checkpoint(177, 4);
    b.cells(150, 15, 170, 8.5, 6);

    // ── EARTH: a double-decker across the gap, a wrecking ball, a crane hook to swing on
    b.plat(182, 4, 6);
    const busTop = b.stream('bus', 181, 218, 4 - 1.35 - 4.6, { speed: 4.2, spacing: 14, road: false });
    b.plat(212, busTop + 0.8, 6);
    b.plat(220, 3, 10);
    b.wrecker(225, 12, 7.5, { amp: 55, T: 3 });
    b.vine(236, 10.5, 6);
    b.plat(243, 4, 4);
    b.cells(192, busTop + 1, 206, busTop + 1, 4); b.cells(221, 4, 229, 4, 4);

    // ── MARS: a rover convoy over the canyon, then a dust devil up the cliff
    b.plat(250, 4, 6);
    const roverTop = b.stream('rover', 249, 284, 4 - 1.35 - 2.0, { speed: 4.5, spacing: 10, road: false });
    b.plat(280, roverTop + 0.85, 6);
    b.plat(287, 1, 12);
    b.tornado(292, 296, 1, { rise: 9, T: 5 });
    b.plat(301, 11, 5);
    b.checkpoint(303, 11);
    b.cells(258, roverTop + 1, 276, roverTop + 1, 4); b.cells(294, 4, 294, 9, 3);

    // ── ASTEROID BELT: tumbling rocks, then a mass-driver barrel into a spinning barrel
    b.bob(311, 10, { w: 2.6, ax: 0.5, ay: 0.5, T: 3.4 });
    b.bob(318, 9, { w: 2.4, ax: 0.6, ay: 0.6, T: 3 });
    b.barrel(326, 10.5, { angle: 48 });
    b.barrel(340, 12.5, { angle: 15, spin: 70 });
    b.plat(355, 11, 5);
    b.shard(340, 18);                                        // straight up out of the spinning barrel
    b.cells(312, 12, 319, 11, 2);

    // ── JUPITER: a gust across the cloud gap, a gas bladder up, a cloud that sinks you down
    b.wind(359, 2, 20, 16, 9, { gust: true, P: 3, on: 1.6 });
    b.plat(376, 10, 3);
    b.floater(382, 10, 3, { rise: 6, speed: 2.4 });
    b.plat(387, 16, 4);
    b.sinker(394, 16, 3, { depth: 6, speed: 2.4 });
    b.plat(399, 10, 5);
    b.cells(362, 12, 374, 12, 4); b.cells(388, 17, 390, 17, 2);

    // ── SATURN: surf the ring chunks, then slide across slick ice
    b.plat(405, 10, 5);
    const ringTop = b.stream('ring', 404, 432, 10 - 1.35 - 1.0, { speed: 7, spacing: 5 });
    b.plat(428, ringTop + 0.8, 5);
    b.ice(436, 9, 8);
    b.plat(448, 9, 4);
    b.checkpoint(450, 9);
    b.cells(410, ringTop + 1, 426, ringTop + 1, 5);

    // ── URANUS: a geyser to the heights, then two icicle pendulums in a row
    b.plat(455, 9, 7); b.vent(459, 9, 7, { type: 'geyser', P: 2.4, on: 1.2 });
    b.plat(463, 18, 4);
    b.pendulum(474, 26, 8, { amp: 45, T: 4 });
    b.plat(484, 16, 4);
    b.pendulum(494, 24, 8, { amp: 50, T: 3.6, phase: 0.5 });
    b.plat(503, 14, 5);
    b.cells(469, 19, 479, 19, 3); b.cells(489, 17, 499, 17, 3);

    // ── NEPTUNE: storm buoys that sink, a lightning strike, a supersonic gust
    b.sinker(511, 14, 3, { depth: 5, speed: 2.2 });
    b.sinker(517.5, 13, 3, { depth: 5, speed: 2.2 });
    b.plat(523, 12, 6);
    b.beam('lightning', 526, 12, { P: 2.6, on: 0.8 });
    b.wind(528, 0, 22, 20, 10, { gust: true, P: 3, on: 1.5 });
    b.plat(548, 11, 5);
    b.checkpoint(550, 11);
    b.cells(530, 14, 545, 14, 5);

    // ── PRISMARA: a bridge of solid light, a spinning laser, mirrored pads
    b.bridge(553, 11, 14);
    b.plat(567, 11, 10);
    b.sweeper(572, 16.5, 4.5, { omega: 75 });
    const mEdge = b.mirror(578.3, 11, 4);
    b.plat(mEdge + 1.3, 11, 5);
    b.cells(555, 12, 565, 12, 4);

    // ── MECHANUS: a gear, a reverse conveyor under a piston, a counter-rotating gear
    const mx = mEdge + 6.3;
    b.ferris(mx + 6, 11, 4, { n: 4, omega: 0.6 });
    b.conveyor(mx + 11.5, 11, 12, -3);
    b.beam('piston', mx + 17.5, 11, { P: 2.4, on: 0.7 });
    b.ferris(mx + 30, 13, 4, { n: 4, omega: -0.7 });
    b.plat(mx + 35.5, 13, 5);
    b.checkpoint(mx + 38, 13);
    b.cells(mx + 12, 12, mx + 22, 12, 4);

    // ── BIO-LUMINA: a vine chain, a snapjaw door, a mushroom bounce, one more vine
    const bx = mx + 40.5;
    b.vine(bx + 5, 20, 6); b.vine(bx + 13, 20, 6);
    b.plat(bx + 18, 14, 9);
    b.door(bx + 20.5, 14, { P: 3, open: 0.5 });
    b.mushroom(bx + 23.5, 14, 6);
    b.plat(bx + 28, 22, 4);
    b.vine(bx + 36, 28.5, 6);
    b.plat(bx + 42, 20, 5);
    b.cells(bx + 34, 25, bx + 38, 25, 3);
    b.cells(bx + 5, 15, bx + 13, 15, 3);

    // ── CHRONOS: a time-warped pad, a gravity chasm, a pendulum blade
    const cx = bx + 47;
    b.slide(cx + 3, 20, cx + 12, 20, { T: 4, warp: true, w: 3 });
    b.plat(cx + 15.5, 20, 3);
    b.grav(cx + 18, 8, 17, 26, { low: 0.45, high: 1.5, P: 5, lowFrac: 0.6 });
    b.plat(cx + 33, 21, 9);
    b.wrecker(cx + 37.5, 30, 7, { amp: 60, T: 2.8 });
    b.checkpoint(cx + 40, 21);
    b.cells(cx + 20, 24, cx + 31, 24, 4);

    // ── EVENT HORIZON: the singularity collapses behind you. Zip, blast, sprint.
    const ex = cx + 42;
    b.chase({ speed: 5, trigger: ex - 1, behind: 16 });
    b.zip(ex + 1, 24.5, ex + 26, 16);
    b.plat(ex + 24, 14, 4);
    b.barrel(ex + 32, 15.5, { angle: 32, auto: true });
    b.plat(ex + 46, 17, 4);
    b.crumble(ex + 53, 17, 2.4); b.crumble(ex + 58.5, 18, 2.4); b.crumble(ex + 64, 19, 2.4);
    b.plat(ex + 69, 19, 4);
    b.zip(ex + 70, 22.5, ex + 92, 15);
    b.plat(ex + 90, 13, 14);
    b.goal(ex + 98, 13);
    b.cells(ex + 4, 22, ex + 22, 17, 6); b.cells(ex + 54, 18.5, ex + 65, 20.5, 3); b.cells(ex + 92, 14, ex + 96, 14, 3);
  }),
];
