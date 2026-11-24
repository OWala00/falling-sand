import { createGrid, getCell, setCell, EMPTY } from './grid.js';
import { draw } from './render.js';
import { SAND, stepSand } from './sim.js';

const canvas = document.getElementById('view');
const grid = createGrid(200, 150);
canvas.width = grid.width;
canvas.height = grid.height;
const ctx = canvas.getContext('2d');

const sourceX = Math.floor(grid.width / 2);
let frame = 0;

function tick() {
  frame += 1;
  if (getCell(grid, sourceX, 0) === EMPTY) setCell(grid, sourceX, 0, SAND);
  // alternating the scan direction each frame keeps piles from leaning
  stepSand(grid, frame % 2 === 0);
  draw(ctx, grid);
  requestAnimationFrame(tick);
}

requestAnimationFrame(tick);
