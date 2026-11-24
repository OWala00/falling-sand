import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createGrid, getCell, setCell, EMPTY } from '../src/grid.js';
import { SAND } from '../src/sim.js';
import { stamp, strokeLine, cellAt } from '../src/paint.js';

function sandCount(grid) {
  return grid.cells.filter((cell) => cell === SAND).length;
}

test('a size 3 brush stamps five cells of sand centered on the cursor', () => {
  const grid = createGrid(5, 5);
  stamp(grid, 2, 2, 3, SAND);
  assert.equal(sandCount(grid), 5);
  assert.equal(getCell(grid, 2, 2), SAND);
  assert.equal(getCell(grid, 1, 1), EMPTY);
});

test('an erase stamp clears only the cells in its footprint', () => {
  const grid = createGrid(5, 5);
  for (let y = 0; y < 5; y += 1) {
    for (let x = 0; x < 5; x += 1) setCell(grid, x, y, SAND);
  }
  stamp(grid, 2, 2, 3, EMPTY);
  assert.equal(sandCount(grid), 20);
  assert.equal(getCell(grid, 2, 2), EMPTY);
  assert.equal(getCell(grid, 1, 1), SAND);
});

test('a stroke between two samples fills every cell on the way, so fast drags leave no gaps', () => {
  const grid = createGrid(10, 3);
  strokeLine(grid, 0, 1, 9, 1, 1, SAND);
  for (let x = 0; x < 10; x += 1) assert.equal(getCell(grid, x, 1), SAND);
});

test('a pointer over a scaled canvas maps to the grid cell under it', () => {
  const grid = createGrid(200, 150);
  const rect = { left: 100, top: 50, width: 400, height: 300 };
  assert.deepEqual(cellAt(grid, rect, 100, 50), { x: 0, y: 0 });
  assert.deepEqual(cellAt(grid, rect, 104, 54), { x: 2, y: 2 });
  assert.deepEqual(cellAt(grid, rect, 499, 349), { x: 199, y: 149 });
});
