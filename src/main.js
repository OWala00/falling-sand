import { createGrid, clearGrid, EMPTY } from './grid.js';
import { draw } from './render.js';
import { SAND, WATER, STONE, step } from './sim.js';
import { cellAt, stamp, strokeLine } from './paint.js';
import { createControls, togglePause, requestStep, stepsDue } from './controls.js';

const canvas = document.getElementById('view');
const grid = createGrid(200, 150);
canvas.width = grid.width;
canvas.height = grid.height;
const ctx = canvas.getContext('2d');

const brush = { size: 3, value: SAND };
const materials = { sand: SAND, water: WATER, stone: STONE, erase: EMPTY };
const sizeButtons = [...document.querySelectorAll('[data-size]')];
const materialButtons = [...document.querySelectorAll('[data-material]')];
const controls = createControls();
let last = null;
let stepCount = 0;
let previous = null;
let settled = false;
let changed = true;

for (const button of sizeButtons) {
  button.addEventListener('click', () => {
    brush.size = Number(button.dataset.size);
    for (const other of sizeButtons) other.classList.toggle('active', other === button);
  });
}

for (const button of materialButtons) {
  button.addEventListener('click', () => {
    brush.value = materials[button.dataset.material];
    for (const other of materialButtons) other.classList.toggle('active', other === button);
  });
}

const pauseButton = document.querySelector('[data-action="pause"]');
const stepButton = document.querySelector('[data-action="step"]');
const clearButton = document.querySelector('[data-action="clear"]');
const speedInput = document.getElementById('speed');
const speedLabel = document.getElementById('speed-value');

function syncPauseButton() {
  pauseButton.textContent = controls.paused ? 'play' : 'pause';
}

pauseButton.addEventListener('click', () => {
  togglePause(controls);
  syncPauseButton();
});

stepButton.addEventListener('click', () => {
  requestStep(controls);
  syncPauseButton();
});

clearButton.addEventListener('click', () => {
  clearGrid(grid);
  edit();
});

speedInput.addEventListener('input', () => {
  controls.speed = Number(speedInput.value);
  speedLabel.textContent = `${controls.speed}x`;
});

function cellUnderPointer(event) {
  return cellAt(grid, canvas.getBoundingClientRect(), event.clientX, event.clientY);
}

function edit() {
  settled = false;
  changed = true;
}

canvas.addEventListener('pointerdown', (event) => {
  canvas.setPointerCapture(event.pointerId);
  last = cellUnderPointer(event);
  stamp(grid, last.x, last.y, brush.size, brush.value);
  edit();
});

canvas.addEventListener('pointermove', (event) => {
  if (!last) return;
  const next = cellUnderPointer(event);
  strokeLine(grid, last.x, last.y, next.x, next.y, brush.size, brush.value);
  last = next;
  edit();
});

const endStroke = () => {
  last = null;
};
canvas.addEventListener('pointerup', endStroke);
canvas.addEventListener('pointercancel', endStroke);

function frame(now) {
  const steps = stepsDue(controls, previous === null ? 0 : now - previous);
  previous = now;
  for (let i = 0; i < steps && !settled; i += 1) {
    stepCount += 1;
    // alternating the scan direction each step keeps piles from leaning
    settled = !step(grid, stepCount % 2 === 0);
    changed = true;
  }
  if (changed) {
    draw(ctx, grid);
    changed = false;
  }
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
