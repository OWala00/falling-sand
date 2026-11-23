import { createGrid, setCell } from './grid.js';
import { draw } from './render.js';

const canvas = document.getElementById('view');
const grid = createGrid(200, 150);
canvas.width = grid.width;
canvas.height = grid.height;

setCell(grid, 100, 75, 1);
draw(canvas.getContext('2d'), grid);
