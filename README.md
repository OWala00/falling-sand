# Falling sand

A small sandbox for sand, water, and stone. Paint particles onto a 200 × 150 grid and watch them fall, pile up, and flow.

![Falling sand running in the browser](docs/screenshot.png)

## Run it

The page loads ES modules, so serve the folder instead of opening `index.html` directly.

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Controls

- **sand, water, stone, erase**: pick what the brush places. Click or drag on the canvas to paint.
- **1, 3, 5, 9**: brush size in cells.
- **pause / play**: freeze the simulation. You can still paint while it is paused.
- **step**: pause and advance one step.
- **clear**: empty the grid.
- **speed**: scale the simulation from 0.25x to 4x.

## How the particles behave

- Sand falls straight down. When the cell below is blocked, it slides diagonally. It sinks through water and comes to rest on stone.
- Water falls when it can. When it is blocked, it flows toward the nearest gap that lets it drop.
- Stone does not move.
- The scan direction alternates every step, so piles do not lean to one side.

The simulation runs at a fixed 60 steps per second, whatever the display refresh rate. A long pause, such as a background tab, advances at most 15 steps when the page resumes. A settled grid skips work until you paint or clear again.

## Tests

```bash
npm test
```

The tests use Node's built-in runner, `node --test`, and run without a browser. Tested with Node.js v26.0.0.

## Layout

- `src/sim.js`: particle rules and the per-step update
- `src/grid.js`: grid and cell helpers
- `src/clock.js`: fixed-timestep clock
- `src/controls.js`: pause, step, and speed scheduling
- `src/paint.js`: brush stamps, strokes, and pointer-to-cell mapping
- `src/render.js`: draws the grid to the canvas
- `src/main.js`: page controls and the frame loop
- `test/`: unit tests per module, plus whole-scene rule tests
