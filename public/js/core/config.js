// Global tuning + the 14-world campaign definition.
// Everything in core/ is DOM-free so it runs in Node for the unit tests.

export const LEVELS_PER_WORLD = 30;

export const PHYS = {
  w: 0.8,             // player hitbox width
  h: 1.6,             // player hitbox height
  gravity: 40,
  runSpeed: 8.5,
  accelGround: 70,
  decelGround: 80,
  accelAir: 40,
  jumpVel: 14,
  doubleJumpVel: 12.5,
  jumpCut: 0.5,       // vy multiplier when jump released early
  maxFall: 25,
  coyote: 0.1,
  jumpBuffer: 0.12,
  iceAccel: 0.35,     // accel multiplier on slippery surfaces
  iceDecel: 0.06,
  grabWindow: 0.32,   // vertical tolerance for ledge grabs
  climbTime: 0.22,
  wallSlide: 4.5,     // max fall speed while sliding down a wall
  wallJumpVx: 9,
  wallJumpVy: 13.5,
  wallLock: 0.16,     // seconds of reduced control after a wall jump
  dt: 1 / 120,        // fixed simulation step
};

export const MAX_HEALTH = 3;

// Earth tour, 3 levels per city.
export const EARTH_CITIES = [
  'London', 'New York', 'San Francisco', 'Los Angeles', 'Shanghai',
  'Beijing', 'Sydney', 'Berlin', 'Moscow', 'Tokyo',
];

// `pool` = weighted segment builders (see levelgen.js).
// Colours are hex ints; sky = [top, horizon].
export const WORLDS = [
  {
    id: 'sun', name: 'The Sun', short: 'Sun', alien: false,
    blurb: 'Intense heat and solar storms.',
    gravity: 1.0, floor: 'lava', floating: true,
    sky: [0x2a0500, 0xff6a1a], fog: 0xb8300a, fogDensity: 0.0045,
    plat: 0x3a3f4a, platTop: 0xd9dde6, accent: 0xffb020, light: 0xffd2a0, ambient: 0x803010,
    planet: { color: 0xffa020, emissive: true, size: 1.0 },
    pool: { gap: 3, pit: 2, flare: 3, heat: 3, moverH: 2, moverV: 1, crumble: 1 },
    signature: 'flare',
  },
  {
    id: 'mercury', name: 'Mercury', short: 'Mercury', alien: false,
    blurb: 'Low gravity across cratered rock.',
    gravity: 0.62, floor: 'mercury', floating: false,
    sky: [0x05060c, 0x3a3d48], fog: 0x0c0c10, fogDensity: 0.0012,
    plat: 0x6b6862, platTop: 0xb7b1a6, accent: 0x9fe8ff, light: 0xfff4e6, ambient: 0x404050,
    planet: { color: 0x8c8781, size: 0.4 },
    pool: { gap: 4, pit: 3, vent: 3, moverH: 1, climb: 1, crumble: 2 },
    signature: 'vent',
  },
  {
    id: 'venus', name: 'Venus', short: 'Venus', alien: false,
    blurb: 'Thick, toxic, crushing atmosphere.',
    gravity: 0.9, floor: 'acid', floating: false,
    sky: [0x3a1206, 0xd9783a], fog: 0xb05a28, fogDensity: 0.008,
    plat: 0x5a3a2a, platTop: 0xe0a070, accent: 0xb6ff3a, light: 0xffc890, ambient: 0x803a1a,
    planet: { color: 0xe8b060, size: 0.9 },
    pool: { gap: 3, cloud: 3, steam: 3, drip: 3, moverH: 1, climb: 1 },
    signature: 'cloud',
  },
  {
    id: 'earth', name: 'Earth', short: 'Earth', alien: false,
    blurb: 'A world tour riding buses, cabs, boats and planes.',
    gravity: 1.0, floor: 'street', floating: false,
    sky: [0x2a6fd6, 0xbfe2ff], fog: 0xbcd8f0, fogDensity: 0.004,
    plat: 0x59616e, platTop: 0xdfe5ec, accent: 0xffd23a, light: 0xfff6e0, ambient: 0x6080b0,
    planet: { color: 0x3a7bd5, size: 1.0 },
    pool: { gap: 3, vehicle: 6, moverV: 2, climb: 1, crumble: 1 },
    signature: 'vehicle',
  },
  {
    id: 'mars', name: 'Mars', short: 'Mars', alien: false,
    blurb: 'Red canyons, rovers and dust storms.',
    gravity: 0.75, floor: 'lava', floating: false,
    sky: [0x3a1408, 0xe08a5a], fog: 0xc06a40, fogDensity: 0.008,
    plat: 0x7a3a22, platTop: 0xe0905a, accent: 0xffd080, light: 0xffe0c0, ambient: 0x804030,
    planet: { color: 0xc1502e, size: 0.55 },
    pool: { gap: 3, rover: 5, pit: 3, moverH: 1, crumble: 2 },
    signature: 'rover', dust: true,
  },
  {
    id: 'asteroids', name: 'Asteroid Belt', short: 'Asteroids', alien: false,
    blurb: 'Tumbling debris in the deep dark.',
    gravity: 0.85, floor: 'void', floating: true,
    sky: [0x01010a, 0x14142a], fog: 0x0a0a18, fogDensity: 0.003,
    plat: 0x5a5048, platTop: 0x9a8e80, accent: 0xff7040, light: 0xffffff, ambient: 0x303050,
    planet: { color: 0x7a6a5a, size: 0.25 },
    pool: { asteroid: 5, gap: 2, meteor: 3, moverH: 1, crumble: 2 },
    signature: 'asteroid',
  },
  {
    id: 'jupiter', name: 'Jupiter', short: 'Jupiter', alien: false,
    blurb: 'Floating platforms in screaming wind.',
    gravity: 1.15, floor: 'gas', floating: true,
    sky: [0x4a2a16, 0xe8c090], fog: 0xd0a070, fogDensity: 0.006,
    plat: 0x6a5a4a, platTop: 0xf0dcc0, accent: 0xff8a3a, light: 0xfff0d8, ambient: 0x806040,
    planet: { color: 0xd8a878, size: 2.2, bands: true },
    pool: { gap: 3, wind: 4, moverH: 2, moverV: 1, crumble: 1 },
    signature: 'wind',
  },
  {
    id: 'saturn', name: 'Saturn', short: 'Saturn', alien: false,
    blurb: 'Racing ring particles, then the slick gas below.',
    gravity: 1.0, floor: 'gas', floating: true,
    sky: [0x1a1408, 0xe8d8a8], fog: 0xd8c898, fogDensity: 0.005,
    plat: 0x7a6a50, platTop: 0xf6ead0, accent: 0xffe08a, light: 0xfff6e0, ambient: 0x706040,
    planet: { color: 0xe6d29a, size: 1.9, bands: true, rings: true },
    pool: { ring: 5, gap: 2, moverH: 2, crumble: 1 },
    poolLate: { gap: 3, updraft: 3, moverH: 2, ice: 2 },
    signature: 'ring',
  },
  {
    id: 'uranus', name: 'Uranus', short: 'Uranus', alien: false,
    blurb: 'A frozen, tilted world of sideways winds.',
    gravity: 0.9, floor: 'ice', floating: false,
    sky: [0x0a2a3a, 0x9ee8f0], fog: 0x5ab0c4, fogDensity: 0.0026,
    plat: 0x3a6a7a, platTop: 0xd8f6fa, accent: 0x5af0ff, light: 0xd0f0f8, ambient: 0x305868,
    planet: { color: 0x9fe3e8, size: 1.3, rings: true, tilt: 1.4 },
    pool: { gap: 3, ice: 3, geyser: 3, moverH: 1, crumble: 1 },
    signature: 'geyser', sideWind: true,
  },
  {
    id: 'neptune', name: 'Neptune', short: 'Neptune', alien: false,
    blurb: 'Supersonic storms and lightning.',
    gravity: 1.1, floor: 'water', floating: true,
    sky: [0x020a2a, 0x3a6ae0], fog: 0x2a4ab0, fogDensity: 0.007,
    plat: 0x2a4a7a, platTop: 0xcfe6ff, accent: 0x6ab0ff, light: 0xd8e8ff, ambient: 0x203a80,
    planet: { color: 0x3a5ee0, size: 1.25, bands: true },
    pool: { gap: 3, gust: 4, lightning: 3, ice: 1, moverH: 1, crumble: 1 },
    signature: 'gust',
  },
  {
    id: 'prismara', name: 'Prismara', short: 'Prismara', alien: true,
    blurb: 'A realm of glass, crystal and solid light.',
    gravity: 0.95, floor: 'crystal', floating: true,
    sky: [0x14063a, 0xc08aff], fog: 0x8a6ae0, fogDensity: 0.005,
    plat: 0x5a4a9a, platTop: 0xf0e8ff, accent: 0xff7af0, light: 0xf8f0ff, ambient: 0x6040a0,
    planet: { color: 0xb08aff, size: 1.0, crystal: true },
    pool: { gap: 2, bridge: 4, mirror: 3, moverH: 1, crumble: 2 },
    signature: 'bridge',
  },
  {
    id: 'mechanus', name: 'Mechanus', short: 'Mechanus', alien: true,
    blurb: 'An ancient alien clockwork machine.',
    gravity: 1.0, floor: 'void', floating: false,
    sky: [0x1a1206, 0x8a6a3a], fog: 0x6a5030, fogDensity: 0.008,
    plat: 0x6a5030, platTop: 0xe8c070, accent: 0xffb040, light: 0xffe8c0, ambient: 0x604020,
    planet: { color: 0xb08850, size: 0.8, metal: true },
    pool: { gap: 2, gear: 4, conveyor: 3, exhaust: 2, piston: 3 },
    signature: 'gear',
  },
  {
    id: 'biolumina', name: 'Bio-Lumina', short: 'Bio-Lumina', alien: true,
    blurb: 'A glowing alien jungle that bites back.',
    gravity: 0.95, floor: 'swamp', floating: false,
    sky: [0x020a10, 0x0a4a40], fog: 0x0a3a34, fogDensity: 0.012,
    plat: 0x1a3a2a, platTop: 0x60e0a0, accent: 0x3affc0, light: 0xa0ffe0, ambient: 0x104040,
    planet: { color: 0x2ad0a0, size: 0.9 },
    pool: { gap: 2, mushroom: 3, vine: 3, door: 3, crumble: 1 },
    signature: 'vine',
  },
  {
    id: 'chronos', name: 'Chronos', short: 'Chronos', alien: true,
    blurb: 'Where time runs fast, frozen, and backwards.',
    gravity: 1.0, floor: 'void', floating: true,
    sky: [0x0a0418, 0x4a3a8a], fog: 0x2a2050, fogDensity: 0.006,
    plat: 0x3a3a5a, platTop: 0xe0e0ff, accent: 0xffd86a, light: 0xf0f0ff, ambient: 0x403060,
    planet: { color: 0xd8c070, size: 1.0, clock: true },
    pool: { gap: 2, warp: 4, gravity: 3, moverV: 1, crumble: 2 },
    signature: 'warp',
  },
];

export const TOTAL_LEVELS = WORLDS.length * LEVELS_PER_WORLD;
export const RED_SPOT_FROM = 25;        // Jupiter levels 25-30 are inside the Great Red Spot
export const SATURN_RINGS_UNTIL = 15;   // Saturn 1-15 rings, 16-30 gas surface

// Flavour for level names + the thing that chases you in chase levels.
export const WORLD_FLAVOR = {
  sun: { words: ['Corona', 'Flare', 'Plasma', 'Helios', 'Sunspot', 'Prominence', 'Photon', 'Solar'], chaser: 'Solar Wave' },
  mercury: { words: ['Crater', 'Quicksilver', 'Caloris', 'Regolith', 'Scarp', 'Basin', 'Dawn', 'Mirror'], chaser: 'Sunrise Line' },
  venus: { words: ['Sulfur', 'Maxwell', 'Haze', 'Ishtar', 'Caustic', 'Vapor', 'Lava Dome', 'Amber'], chaser: 'Acid Fog' },
  earth: { words: ['Rush Hour', 'Downtown', 'Harbour', 'Skyline', 'Avenue', 'Overpass', 'Metro', 'Boulevard'], chaser: 'Traffic Jam' },
  mars: { words: ['Olympus', 'Valles', 'Rust', 'Dune', 'Rover', 'Red Dust', 'Gale', 'Jezero'], chaser: 'Dust Storm' },
  asteroids: { words: ['Ceres', 'Vesta', 'Debris', 'Tumble', 'Meteor', 'Orbit', 'Pallas', 'Rubble'], chaser: 'Debris Cloud' },
  jupiter: { words: ['Storm', 'Ammonia', 'Io', 'Jet Stream', 'Thunder', 'Cyclone', 'Europa', 'Belt'], chaser: 'Storm Front' },
  saturn: { words: ['Ring', 'Cassini', 'Titan', 'Hexagon', 'Ice Chip', 'Enceladus', 'Gap', 'Halo'], chaser: 'Ring Shear' },
  uranus: { words: ['Frost', 'Tilt', 'Miranda', 'Crystal', 'Glacier', 'Aurora', 'Ariel', 'Polar'], chaser: 'Blizzard' },
  neptune: { words: ['Triton', 'Gale', 'Dark Spot', 'Tempest', 'Abyss', 'Squall', 'Azure', 'Riptide'], chaser: 'Supersonic Front' },
  prismara: { words: ['Prism', 'Refraction', 'Spectrum', 'Glass', 'Lumen', 'Facet', 'Rainbow', 'Mirror'], chaser: 'Shatter Wave' },
  mechanus: { words: ['Cog', 'Piston', 'Escapement', 'Gear', 'Boiler', 'Spring', 'Ratchet', 'Brass'], chaser: 'Crusher Wall' },
  biolumina: { words: ['Glowcap', 'Spore', 'Canopy', 'Fungal', 'Luminous', 'Tangle', 'Bloom', 'Vine'], chaser: 'Spore Swarm' },
  chronos: { words: ['Tick', 'Paradox', 'Epoch', 'Hourglass', 'Rewind', 'Moment', 'Eon', 'Clockwork'], chaser: 'Time Rift' },
};

export function worldIndexOf(level) {
  return Math.floor((level - 1) / LEVELS_PER_WORLD);
}

export function worldOf(level) {
  return WORLDS[worldIndexOf(level)];
}

export function subLevelOf(level) {
  return ((level - 1) % LEVELS_PER_WORLD) + 1;
}

// "Earth · London" style location label.
export function locationOf(level) {
  const w = worldOf(level);
  const sub = subLevelOf(level);
  if (w.id === 'earth') return EARTH_CITIES[Math.floor((sub - 1) / 3)];
  if (w.id === 'jupiter' && sub >= RED_SPOT_FROM) return 'Great Red Spot';
  if (w.id === 'saturn') return sub <= SATURN_RINGS_UNTIL ? 'The Rings' : 'Gas Surface';
  return null;
}
