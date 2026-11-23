import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createGrid, getCell, setCell, EMPTY } from '../src/grid.js';

test('a new grid is empty and has the requested size', () => {
  const grid = createGrid(4, 3);
  assert.equal(grid.width, 4);
  assert.equal(grid.height, 3);
  assert.equal(grid.cells.length, 12);
  assert.ok(grid.cells.every((cell) => cell === EMPTY));
});

test('a value set in a cell can be read back', () => {
  const grid = createGrid(4, 3);
  assert.equal(setCell(grid, 2, 1, 7), true);
  assert.equal(getCell(grid, 2, 1), 7);
});

test('cells outside the grid are rejected', () => {
  const grid = createGrid(4, 3);
  assert.equal(setCell(grid, 4, 0, 1), false);
  assert.equal(setCell(grid, 0, -1, 1), false);
  assert.equal(getCell(grid, 4, 0), null);
});

test('grid sizes must be positive integers', () => {
  assert.throws(() => createGrid(0, 3), RangeError);
  assert.throws(() => createGrid(2.5, 3), RangeError);
});
