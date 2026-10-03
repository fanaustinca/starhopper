# Starhopper

A 2.5D robot platformer for the browser, built with Three.js. You play a small glossy robot hopping across **14 worlds and 700 levels**: the Sun, the eight planets plus the Asteroid Belt, and four alien worlds.

**Play:** https://fanaustinca.github.io/starhopper/

| # | World | Levels | Signature mechanics |
|---|-------|--------|---------------------|
| 1 | The Sun | 1–50 | lava sea, fire pits, solar-flare beams, floating heat-shield pads |
| 2 | Mercury | 51–100 | low gravity, liquid-mercury pools, crater vents that launch you |
| 3 | Venus | 101–150 | thick toxic haze, drifting acid clouds, high-pressure steam vents |
| 4 | Earth | 151–200 | world tour (London, NYC, SF, LA, Shanghai, Beijing, Sydney, Berlin, Moscow, Tokyo): ride buses (both decks), taxis, trucks, boats and planes |
| 5 | Mars | 201–250 | rovers across canyons, dust storms, lava pits |
| 6 | Asteroid Belt | 251–300 | tumbling asteroid platforms, falling meteors |
| 7 | Jupiter | 301–350 | floating platforms, wind drafts; 341–350 are inside the Great Red Spot |
| 8 | Saturn | 351–400 | fast ring-particle streams (351–375), slick gas surface + updrafts (376–400) |
| 9 | Uranus | 401–450 | sideways-shifting wind, slippery crystal ice, frozen geysers |
| 10 | Neptune | 451–500 | supersonic gusts that fling you forward, icy water, lightning |
| 11 | Prismara | 501–550 | light beams that solidify into bridges, mirrored platforms |
| 12 | Mechanus | 551–600 | giant rotating gears, conveyor belts, steam exhaust |
| 13 | Bio-Lumina | 601–650 | bouncy mushrooms, swinging vines, carnivorous plant doors |
| 14 | Chronos | 651–700 | platforms that run fast-forward, freeze or reverse; erratic gravity zones |

When you finish a world, a cutscene plays: the robot jumps into its ship and flies to the next planet.

## Controls

| Action | Keyboard | Gamepad | Touch |
|---|---|---|---|
| Run | ← → / A D | stick / D-pad | ◀ ▶ |
| Jump / double jump | Space / W / ↑ | A | ⤒ |
| Ledge grab | push toward the ledge while falling, then jump or ↑ to climb | | |
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
npm run test:unit    # Node: physics, all 700 levels, every jump simulated
npm run test:e2e     # Playwright + headless Chromium against ./public
npm run test:live    # e2e against the deployed GitHub Pages build
```

- **Unit tests** (`tests/unit.mjs`) cover the controller physics: jump heights, double jump, ledge grab, one-way platforms, moving-platform carry, and no tunnelling. They also generate all 700 levels and check that **every static jump on every level can be made**, by running the real player controller with a steering bot.
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
    robot.js     procedurally animated hero
    vehicles.js  bus/taxi/truck/boat/plane/rover/asteroid/ship meshes
    decor.js     skies, planets, hazard floors, landmarks and scenery
    cutscene.js  between-world ship flight
    fx.js        particles + weather
  main.js      state machine, UI, main loop, window.SH test API
```

Levels are generated from a seed, so the 700 levels are identical on every machine. Gap sizes come from the player's real jump envelope (`maxGapFor`), and difficulty ramps up within each world and across the campaign.
