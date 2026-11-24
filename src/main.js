import { createGrid, EMPTY } from './grid.js';
import { draw } from './render.js';
import { SAND, stepSand } from './sim.js';
import { cellAt, stamp, strokeLine } from './paint.js';

const canvas = document.getElementById('view');
const grid = createGrid(200, 150);
canvas.width = grid.width;
canvas.height = grid.height;
const ctx = canvas.getContext('2d');

const brush = { size: 3, value: SAND };
const sizeButtons = [...document.querySelectorAll('[data-size]')];
const eraseButton = document.getElementById('erase');
let last = null;
let frame = 0;

for (const button of sizeButtons) {
  button.addEventListener('click', () => {
    brush.size = Number(button.dataset.size);
    for (const other of sizeButtons) other.classList.toggle('active', other === button);
  });
}

eraseButton.addEventListener('click', () => {
  brush.value = brush.value === SAND ? EMPTY : SAND;
  eraseButton.classList.toggle('active', brush.value === EMPTY);
});

function cellUnderPointer(event) {
  return cellAt(grid, canvas.getBoundingClientRect(), event.clientX, event.clientY);
}

canvas.addEventListener('pointerdown', (event) => {
  canvas.setPointerCapture(event.pointerId);
  last = cellUnderPointer(event);
  stamp(grid, last.x, last.y, brush.size, brush.value);
});

canvas.addEventListener('pointermove', (event) => {
  if (!last) return;
  const next = cellUnderPointer(event);
  strokeLine(grid, last.x, last.y, next.x, next.y, brush.size, brush.value);
  last = next;
});

const endStroke = () => {
  last = null;
};
canvas.addEventListener('pointerup', endStroke);
canvas.addEventListener('pointercancel', endStroke);

function tick() {
  frame += 1;
  // alternating the scan direction each frame keeps piles from leaning
  stepSand(grid, frame % 2 === 0);
  draw(ctx, grid);
  requestAnimationFrame(tick);
}

requestAnimationFrame(tick);
