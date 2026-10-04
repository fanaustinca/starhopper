# Starhopper

A 2.5D robot platformer for the browser, built with Three.js. You play a small glossy robot hopping across **14 worlds and 420 levels** (30 per world), plus a bonus 421st level, **THE END**, inside a black hole,: the Sun, the eight planets plus the Asteroid Belt, and four alien worlds.

**Play:** https://fanaustinca.github.io/starhopper/

| # | World | Levels | Signature mechanics |
|---|-------|--------|---------------------|
| 1 | The Sun | 1–30 | plasma surface, fire pits, solar-flare beams, sunspot heat tiles, heat-shield pads |
| 2 | Mercury | 31–60 | low gravity, liquid-mercury pools, crater vents that launch you |
| 3 | Venus | 61–90 | thick toxic haze, drifting acid clouds, acid rain, high-pressure steam vents |
| 4 | Earth | 91–120 | world tour (London, NYC, SF, LA, Shanghai, Beijing, Sydney, Berlin, Moscow, Tokyo; 3 levels each, with 3–4 landmarks per city, such as Tower Bridge, Brooklyn Bridge, Alcatraz, Griffith Observatory, the Great Wall, Tiananmen, Skytree): ride buses (both decks), taxis, trucks, boats, planes, elevators |
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
| ★ | The Black Hole | 421 | **THE END**: a ~860-unit gauntlet with a section from every world in order and 7 checkpoints, ending in an Event Horizon chase. Big Ben, buses, rovers, gears and clocks spiral into the accretion disk around you |

Every jump plays a random air trick: flips, cartwheels, corkscrews, star jumps and more.

When you first press Play, a multi-deck mothership flies in to the Sun, lands, lowers its ramp, and the robot walks out. When you finish a world, the robot boards the ship, it lifts off, banks through space to the next planet and lands there.

### Hand-written levels

All 420 levels are **hand-written** as explicit layouts in `public/js/levels/<world>.js`, using a small authoring DSL (`public/js/levels/dsl.js`, documented in `public/js/levels/README.md`). There's no procedural generation and no randomness. Each level is built around its own idea, for example *Sunspot Checkers*, *Hop-On at the Back*, *Paradox Stair*, *Facet Chimneys* or *Heart of the Machine*. Each world has an intro, two chase levels, a rising-tide climb, a hard level 29 and a finale.

Moving things are everywhere. Each world uses them in its own style:
- **zip lines** (canyon cables, ski lifts, spider silk)
- **launch barrels**, fixed, rotating or rocking, and chainable (mass drivers, cuckoo cannons, seed pods)
- **pendulum platforms**
- **sinking and floating weight platforms**
- **wrecking balls**
- **sweeping beams**
- **travelling tornadoes** (dust devils, waterspouts)
- **swing ropes** drawn per world (vines, plasma tethers, crane hooks, chains, light strands)

Other mechanics include stompable walker enemies, spiky enemies you can't stomp, hovering drones, turrets, floor switches that swap red/blue blocks, blinking platforms, crumbling platforms, multi-point looping rides, ferris wheels, vehicles, vines, light bridges, gravity zones, time-warp platforms, wall-jump chimneys and ceilings/tunnels.

Every level hides **3 Star Shards**.

**Solver bot.** `tools/solver.mjs` plays every level with the real player controller. From each reachable surface it tries runs, jumps, double jumps, springs, vents, vine swings, wall-climbs and rides on moving platforms, breadth-first, until it reaches the goal. The unit tests require all 420 levels to be solved.

What the solver does not check: enemy, turret and hazard timing, and the chase/tide pacing. Those were designed by hand.

```bash
node tools/validate.mjs <world|level…>   # solve levels, warn about unreachable shards
node tools/preview.mjs world <world>      # side-view map PNGs in tools/previews/
```

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
npm run test:unit    # Node: physics, mechanics, solver bot over all 420 levels
npm run test:e2e     # Playwright + headless Chromium against ./public
npm run test:live    # e2e against the deployed GitHub Pages build
```

- **Unit tests** (`tests/unit.mjs`) cover the controller physics: jump heights, double jump, ledge grab, one-way platforms, moving-platform carry, and no tunnelling. They also build all 420 hand-written levels and run the **solver bot on every one**. They check that each level has 3 shards and a checkpoint, that no two layouts repeat within a world, and that the level files contain no randomness.
- **E2E tests** (`tests/e2e.mjs`) drive the real game in a headless browser through `window.SH`, a small test API that steps the fixed-timestep simulation deterministically. They cover boot, menus, movement by input, collision, hazards and respawn, level completion and unlocking, save persistence, pause, the level selector, world-transition cutscenes (including skipping), Earth vehicles carrying the robot, each world's signature mechanic, a render of every world, and the mobile layout. Screenshots go to `tests/screenshots/`.

CI (`.github/workflows/deploy.yml`) runs both suites on every push and deploys `public/` to GitHub Pages only if they pass.

## Architecture

```
public/js/
  core/        DOM-free, runs in Node too
    config.js    physics constants + the 14 world definitions
    physics.js   player controller, swept AABB collision, jump envelope
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

Levels are authored data, so what you play is exactly what was written.
