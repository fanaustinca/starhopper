# Writing Starhopper levels

All 420 levels are written by hand in `public/js/levels/<world>.js` with the DSL in `dsl.js`. There is **no procedural generation and no randomness**: a level is exactly what you write. `sun.js` is the reference set, so read it first.

## Workflow

```bash
node tools/validate.mjs <world>          # solver bot: proves every level can be finished
V=1 node tools/validate.mjs 61           # verbose: lists reached / NOT reached surfaces
node tools/preview.mjs world <world>     # side-view PNG maps → tools/previews/L###.png
node tools/preview.mjs 61 62             # specific levels
```

A world is **done** when the validator reports `30/30 levels completable`, every level shows `3 shards`, a checkpoint and no `⚠`, and you have looked at the preview PNGs to confirm the layouts are clean: no overlapping junk, nothing floating where it shouldn't, and readable routes.

## Physics you design against (gravity scale g = world gravity)

| | g = 1.0 | notes |
|---|---|---|
| run speed | 8.5 u/s | |
| single jump height | 2.45 / g | |
| double jump total height | 4.4 / g | landing ON a one-way `thin()` from below needs ≤ 4.3 / g |
| max same-height gap (double jump) | ~10.5 / g | comfortable gaps are 3–7; > 8 is hard |
| player size | 0.8 wide, 1.6 tall | ceilings need ≥ 1.8 clearance to walk under |
| wall slide + wall jump | yes | two walls 2.6–3.2 apart make a climbable chimney |
| ledge grab | yes | falling short of a ledge by ~0.3 still works |

World gravity: sun 1.0, mercury 0.62 (jumps go much higher and further!), venus 0.9, earth 1.0, mars 0.75, asteroids 0.85, jupiter 1.15, saturn 1.0, uranus 0.9, neptune 1.1, prismara 0.95, mechanus 1.0, biolumina 0.95, chronos 1.0.

## Coordinates

`x` grows to the right and `y` grows up. `top` is the walkable surface height. The start platform is usually `b.start(-6, 0, 12)`, which puts the spawn at x=-4. Levels run left to right and are about 80–130 units long. Vertical levels (towers or descents) can span 40+ units of height.

## Every level must have

- `b.start(...)`, `b.goal(x, top)` (on a platform) and `b.checkpoint(x, top)` (on a platform, around the middle).
- **Exactly 3** `b.shard(x, y)`. They should be **hidden or risky**: on an upper route, behind the start, at the top of a wall-jump chimney, low under a ledge, past an optional enemy and so on. Don't just put all three in the open.
- Cells (`b.cells`, `b.arc`, `b.cell`) that trace the intended route and reward detours.

## DSL reference (b = builder)

Platforms. All of these are floating slabs unless noted.

```
b.start(x, top, w=12)              spawn platform (spawn at x+2)
b.plat(x, top, w, {h})             floating slab (h default 1)
b.block(x, top, w)                 grounded column down to the floor
b.pillarPlat(x, top, w)            slab with support pillars
b.rect(x, y, w, h)                 solid box by bottom-left (walls, ceilings, pillars, roofs)
b.wall(x, y, h, w=0.8)             thin vertical wall by bottom-left
b.thin(x, top, w)                  one-way ledge (jump up through it)
b.crumble(x, top, w)               falls 0.55s after you land, re-forms after ~3s
b.ice(x, top, w)                   slippery
b.heat(x, top, w, {P, on, off})    ignites for `on` of every P seconds (damage while standing)
b.conveyor(x, top, w, speed)       moves you (negative = left)
b.blink(x, top, w, {P, on, off})   solid for `on` of every P seconds, flickers before vanishing
b.bonus(x, top, w)                 glassy reward ledge (visual only)
b.spring(x, top, rise)             pad on a surface at `top`; launches ~rise above it
b.mushroom(x, top, rise)           bouncy cap (Bio-Lumina)
b.switch(x, top)                   floor button: every landing swaps red/blue blocks
b.red(x, top, w, h=1) / b.blue(...)        on/off blocks: red solid at start, blue after a switch
b.redWall(x, y, h) / b.blueWall(...)       vertical on/off barriers
b.tower(x, y0, w, y1)              scaffold backdrop behind a climb (visual only)
```

Moving things (positions are the platform's TOP-CENTRE):

```
b.slide(x0, y0, x1, y1, {T, w, phase})     ping-pong between two points, T = round trip seconds
b.lift(x, y0, y1, {T})                      vertical lift
b.loop([[x,y], ...], {speed, w, loop})      multi-point path; loop:false = ping-pong
b.ferris(cx, cy, r, {n, omega, w})          ring of n pads rotating around a centre
b.bob(x, top, {ax, ay, T, w})               floating rock bobbing in place (asteroids)
b.mirror(x0, top, R, {w, T})                mirrored pair meeting at x0+R+w (Prismara); returns far edge
b.stream(kind, xStart, xEnd, laneY, {speed, spacing})   endless vehicles L→R; laneY = vehicle bottom;
        kinds: bus car taxi truck boat plane rover ring. Returns the top deck height.
        Riders drop onto the top deck from an overpass slab ~1.35 above it and hop off
        onto a slab ~0.6–1.1 above the deck at the far end.
```

Hazards:

```
b.pool(x, top, w, type?)           liquid pit with a basin, between two platforms at height `top`
b.hazard(type, x, y, w, h)         static deadly rect (respawn)
b.beam(type, x, y, {w, h, P, on, warn, off})
        types: flare, lightning, piston (hang down from y+h), steam, exhaust (rise from y)
b.cloud(x, y0, y1, {T, dx})        drifting acid cloud (Venus)
b.meteor(x, y1, {P, off, drift, style:'drip'})   falls onto height y1 at x
b.vent(x, y, rise, {type, P, on, off, always})   launcher column: vent/geyser/updraft
b.wind(x, y, w, h, vx, {gust:true, P, on, off})  gust:true = helpful forward gust; otherwise a hazard
b.grav(x, y, w, h, {low, high, P})               zone that alternates low/high gravity (Chronos)
b.vine(ax, ay, len=6)              swing: tip hangs at ay-len
b.bridge(x, top, w)                light bridge, solidifies when touched (Prismara)
b.door(x, top, {h, P, open})       carnivorous plant gate, open fraction `open` (Bio-Lumina)
b.enemy('walker', x, top, {range, speed})   patrols x..x+range; stompable
b.enemy('spiker', x, top, {range, speed})   patrols; NOT stompable: jump over
b.enemy('flyer', x, y, {ax, ay, T})         hovers around (x, y); stompable
b.turret(x, y, dir, {P, speed, off, range}) fires a bolt every P s at height y (dir ±1); mount it on a rect
```

Moving things (v4). These are the most fun parts, so use them a lot:

```
b.vine(ax, ay, len)                     swing rope; drawn per world (vines, plasma tethers, crane cables, chains, light strands…)
b.zip(x0, y0, x1, y1, {speed, oneWay})  zip line: grab the cable in mid-air (hands ~1.5 above feet), slide downhill
                                        (or the way you were moving on a level cable); jump to let go, or drop off the end
b.barrel(x, y, {angle, spin, sweep, power, auto})
        launch barrel/pod centred at (x,y): touch it to get loaded, press jump to blast out along `angle`
        degrees (0 = right, 90 = up). spin: deg/s rotating; sweep: rocks ±sweep degrees around `angle`
        (spin = rocking speed); power default 18 (~blasts 10–20 units); auto:true fires by itself after 0.5s.
        Barrel → barrel chains work (Donkey-Kong style).
b.pendulum(px, py, len, {amp, T, phase, w})   platform hanging on a rope from (px,py), swinging ±amp degrees
b.sinker(x, top, w, {depth, speed})     sinks while you stand on it (down to `depth`), rises back when you leave
b.floater(x, top, w, {rise, speed})     balloon pad: floats UP while you stand on it (an elevator you ride), sinks back when empty
b.wrecker(px, py, len, {amp, T, phase, r})    swinging wrecking ball / hammer hazard
b.sweeper(cx, cy, len, {omega, a0, width, both})   rotating beam hazard (deg/s); both:true = full bar through the centre
b.tornado(x0, x1, y, {rise, h, T, w})   updraft column drifting back and forth between x0 and x1 at height y
b.checkpoint(x, top)                    can be called several times for long levels
```

Speed-run kit (Aerolis and Velocitar, usable anywhere):

```
b.ring(x, y, {angle, speed, r})   fling ring: pass through the hoop centred at (x,y) and get launched toward
                                  `angle` degrees at `speed` (default 35°, 17). No stop like a barrel, and your
                                  double jump is restored. Ring → ring chains keep you airborne.
b.boost(x, top, w, speed)         boost lane: a fast conveyor (default 12) whose speed carries into your jump,
                                  so you clear much longer gaps
```

**Speed-run design rules.** A level should be one continuous line of motion: vine → zip → ring → barrel → boost → vine. The player should NEVER stand and wait.
- Barrels on the main line should be `auto: true` or fixed (fire on press). Avoid slow rotating aim.
- Moving platforms should be fast (short T, high speed). Don't use doors, timed waits or slow lifts.
- Aim each launch so the robot lands, or catches the next rope, ring or cable, mid-stride.
- Use static platforms mostly as brief touch-downs. Keep the route readable, and put optional harder lines (with shards) above or below it.

The solver understands all of these: it rides zips, chains barrels (aiming rotating ones), samples pendulums, weights and tornadoes. Barrels and zips can bridge gaps far wider than a jump.

Flow:

```
b.cell(x,y) b.cells(x0,y0,x1,y1,n) b.arc(x0,y0,x1,y1,n,h) b.shard(x,y) b.heart(x,y)
b.checkpoint(x, top)  b.goal(x, top)
b.chase({speed, trigger, behind})   a world-themed wall sweeps in from the left (speed 3.8–4.8)
b.rise({rate, delay})               the floor rises (tower levels), rate 0.6–0.9
b.sideWind(amp, T)                  level-wide oscillating wind (Uranus)
```

## Design rules

1. **Every level has its own idea.** It should be a concept you could name in one sentence: "two decks of tiles igniting in opposite waves", "ride one pad along an arc while flares lick the route", "buttons swap the bridge". No two levels in a world should feel the same, so vary the length, shape (horizontal, tower, descent, cave, branching), pace and mechanic mix.
2. **Use the world's signature mechanics heavily**, combine them in new ways, and mix in the generic ones (enemies, turrets, switches, blinkers, crumbles, springs, walls and chimneys, ceilings and tunnels, thin ledges, loops).
3. **Ramp the difficulty** across the 30: levels 1–5 teach, 10 and 20 are chase levels, 29 is hard, and 30 is the finale (the world's greatest hits, ending in a chase).
4. Don't block the route by accident. A pillar or wall between two platforms has to be jumpable. Turret mounts go off the route or act as stepping stones. Use `V=1` to see what the bot can't reach.
5. Chase levels must never force waiting (no lifts or timed doors on the main route), and tide levels should be climbs.
6. Keep `b.start` at x=-6. Put the behind-the-start shard platform at around x=-14 (e.g. `b.plat(-14, 1.5, 3); b.shard(-12.5, 3.5)`), but vary the hiding spots: don't use that one in every level.
