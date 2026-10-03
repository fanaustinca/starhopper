# Starhopper

A 2.5D robot platformer for the browser, built with Three.js. You play a small glossy robot hopping across **14 worlds and 420 levels** (30 per world): the Sun, the eight planets plus the Asteroid Belt, and four alien worlds.

**Play:** https://fanaustinca.github.io/starhopper/

| # | World | Levels | Signature mechanics |
|---|-------|--------|---------------------|
| 1 | The Sun | 1–30 | plasma surface, fire pits, solar-flare beams, sunspot heat tiles, heat-shield pads |
| 2 | Mercury | 31–60 | low gravity, liquid-mercury pools, crater vents that launch you |
| 3 | Venus | 61–90 | thick toxic haze, drifting acid clouds, acid rain, high-pressure steam vents |
| 4 | Earth | 91–120 | world tour (London, NYC, SF, LA, Shanghai, Beijing, Sydney, Berlin, Moscow, Tokyo; 3 levels each): ride buses (both decks), taxis, trucks, boats, planes, elevators |
| 5 | Mars | 121–150 | rovers across canyons, dust storms, lava pits |
| 6 | Asteroid Belt | 151–180 | tumbling asteroid platforms, falling meteors |
| 7 | Jupiter | 181–210 | floating platforms, wind drafts; 205–210 are inside the Great Red Spot |
| 8 | Saturn | 211–240 | fast ring-particle streams (211–225), slick gas surface + updrafts (226–240) |
| 9 | Uranus | 241–270 | sideways-shifting wind, slippery crystal ice, frozen geysers |
| 10 | Neptune | 271–300 | supersonic gusts that fling you forward, icy water, lightning |
| 11 | Prismara | 301–330 | light beams that solidify into bridges, mirrored platforms |
| 12 | Mechanus | 331–360 | giant rotating gears, conveyor belts, crushing pistons, steam exhaust |
| 13 | Bio-Lumina | 361–390 | bouncy mushrooms, swinging vines, carnivorous plant doors |
| 14 | Chronos | 391–420 | platforms that run fast-forward, freeze or reverse; erratic gravity zones |

When you first press Play, the ship flies in to the Sun, lands, and the robot hops out. When you finish a world, the robot jumps into its ship, flies to the next planet and lands there.

### Level variety

Each world schedules its 30 levels from a set of **archetypes**, and the same archetype never appears twice in a row:

- **Arrival / Finale**: the opening level of each world teaches its mechanic. The last level is a long gauntlet that ends in a chase.
- **Tower climbs** (zig-zag ascents) and **descents** (dropping through the level).
- **Chase**: a world-themed wall (a solar wave, a dust storm, a time rift) sweeps in from the left.
- **Rising tide**: lava, acid or a rift floods upward while you climb.
- **Ride**: long trips on vehicles, rovers, ring streams, gears or vines while dodging hazards.
- **Gauntlet**, **precision** (small platforms that crumble) and **branch** (secret upper routes).

Every level has a name (for example *Prominence Escape* or *Helios Tower*) and hides **3 Star Shards**: one on an upper route reached by a spring, one behind the start (sometimes at the top of a wall-jump shaft), and one in a risky spot.

### Robot Shop

Cells you collect are banked when you finish a level, and each new Star Shard adds 50. You spend them in the shop on 13 skins, some with accessories: Midnight, Ninja (scarf), Royal (crown), Space Ranger (backpack), Kitty Bot, Gold Chrome, Galaxy and more.

### Dev console

Open DevTools (F12) and type `dev.help()`. Useful commands include `dev.unlockAll()`, `dev.skipAll()`, `dev.level(n)`, `dev.world(w)`, `dev.win()`, `dev.cells(n)`, `dev.allSkins()`, `dev.intro()` and `dev.fly(w)`.

## Controls

| Action | Keyboard | Gamepad | Touch |
|---|---|---|---|
| Run | ← → / A D | stick / D-pad | ◀ ▶ |
| Jump / double jump | Space / W / ↑ | A | ⤒ |
| Ledge grab | push toward the ledge while falling, then jump or ↑ to climb | | |
| Wall slide / wall jump | hold toward a wall while falling, then jump | | |
| Drop through a deck | ↓ + Space | | ▼ + ⤒ |
| Pause | Esc / P | Start | ❚❚ |

## Running locally

No build step. Three.js is vendored in `public/vendor/`.

```bash
npm install          # only needed for the tests
npm run serve        # http://localhost:8000
```

## Tests

```bash
npm test             # unit + e2e
npm run test:unit    # Node: physics, all 420 levels, every jump simulated
npm run test:e2e     # Playwright + headless Chromium against ./public
npm run test:live    # e2e against the deployed GitHub Pages build
```

- **Unit tests** (`tests/unit.mjs`) cover the controller physics: jump heights, double jump, ledge grab, one-way platforms, moving-platform carry, and no tunnelling. They also generate all 420 levels and check that **every static jump on every level can be made**, by running the real player controller with a steering bot.
- **E2E tests** (`tests/e2e.mjs`) drive the real game in a headless browser through `window.SH`, a small test API that steps the fixed-timestep simulation deterministically. They cover boot, menus, movement by input, collision, hazards and respawn, level completion and unlocking, save persistence, pause, the level selector, world-transition cutscenes (including skipping), Earth vehicles carrying the robot, each world's signature mechanic, a render of every world, and the mobile layout. Screenshots go to `tests/screenshots/`.

CI (`.github/workflows/deploy.yml`) runs both suites on every push and deploys `public/` to GitHub Pages only if they pass.

## Architecture

```
public/js/
  core/        DOM-free, runs in Node too
    config.js    physics constants + the 14 world definitions
    physics.js   player controller, swept AABB collision, jump envelope
    levelgen.js  deterministic procedural generator (seeded per level)
    sim.js       LevelSim: movers, vehicles, hazards, pickups, goal (fixed 120 Hz step)
    save.js / input.js / audio.js
  render/      Three.js
    renderer.js  level meshes, camera follow, lights/shadows, bloom
    shaders.js   GLSL: skies, solar granulation, plasma, lava/water/acid, cloud seas
    terrain.js   procedural heightfield landscapes + billboard clouds
    robot.js     procedurally animated hero
    vehicles.js  bus/taxi/truck/boat/plane/rover/asteroid/ship meshes
    decor.js     skies, planets, hazard floors, landmarks and scenery
    cutscene.js  between-world ship flight
    fx.js        particles + weather
  main.js      state machine, UI, main loop, window.SH test API
```

Levels are generated from a seed, so the 420 levels are identical on every machine. Gap sizes come from the player's real jump envelope (`maxGapFor`), and difficulty ramps up within each world and across the campaign.
