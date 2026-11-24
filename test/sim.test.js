import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createGrid, getCell, setCell, EMPTY } from '../src/grid.js';
import { SAND, stepSand } from '../src/sim.js';

test('a grain of sand falls one cell per step through empty space', () => {
  const grid = createGrid(3, 6);
  setCell(grid, 1, 0, SAND);
  stepSand(grid, true);
  assert.equal(getCell(grid, 1, 0), EMPTY);
  assert.equal(getCell(grid, 1, 1), SAND);
});

test('a grain slides diagonally when the cell below is blocked', () => {
  const grid = createGrid(3, 3);
  setCell(grid, 1, 1, SAND);
  setCell(grid, 1, 2, SAND);
  stepSand(grid, true);
  assert.equal(getCell(grid, 1, 1), EMPTY);
  assert.equal(getCell(grid, 0, 2), SAND);
});

test('the scan direction decides which diagonal a grain takes', () => {
  const grid = createGrid(3, 3);
  setCell(grid, 1, 1, SAND);
  setCell(grid, 1, 2, SAND);
  stepSand(grid, false);
  assert.equal(getCell(grid, 1, 1), EMPTY);
  assert.equal(getCell(grid, 2, 2), SAND);
});

test('when two grains want the same cell, the one scanned first takes it', () => {
  const grid = createGrid(3, 3);
  setCell(grid, 0, 2, SAND);
  setCell(grid, 2, 2, SAND);
  setCell(grid, 0, 1, SAND);
  setCell(grid, 2, 1, SAND);
  stepSand(grid, false);
  assert.equal(getCell(grid, 2, 1), EMPTY);
  assert.equal(getCell(grid, 1, 2), SAND);
  assert.equal(getCell(grid, 0, 1), SAND);
});

test('a column of sand settles into a pile that spreads evenly to both sides', () => {
  const grid = createGrid(41, 30);
  for (let y = 0; y < 20; y += 1) setCell(grid, 20, y, SAND);
  for (let step = 0; step < 400; step += 1) stepSand(grid, step % 2 === 0);
  let left = 0;
  let right = 0;
  for (let y = 0; y < grid.height; y += 1) {
    for (let x = 0; x < grid.width; x += 1) {
      if (getCell(grid, x, y) !== SAND) continue;
      if (x < 20) left += 1;
      if (x > 20) right += 1;
    }
  }
  assert.equal(grid.cells.filter((cell) => cell === SAND).length, 20);
  assert.ok(left > 0 && right > 0);
  assert.ok(Math.abs(left - right) <= 1, `left ${left}, right ${right}`);
});
