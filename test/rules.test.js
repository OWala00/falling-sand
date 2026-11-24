import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createGrid, setCell, EMPTY } from '../src/grid.js';
import { SAND, WATER, STONE, step } from '../src/sim.js';

function mixedScene() {
  const grid = createGrid(30, 20);
  for (let x = 0; x < grid.width; x += 1) setCell(grid, x, 19, STONE);
  setCell(grid, 13, 8, STONE);
  setCell(grid, 14, 8, STONE);
  for (let x = 2; x < 11; x += 1) for (let y = 16; y < 19; y += 1) setCell(grid, x, y, WATER);
  for (let x = 5; x < 12; x += 1) setCell(grid, x, 2, SAND);
  for (let x = 16; x < 24; x += 1) setCell(grid, x, 4, WATER);
  return grid;
}

function countOf(grid, value) {
  return grid.cells.filter((cell) => cell === value).length;
}

test('a mixed scene keeps every grain and drop, and stone never moves', () => {
  const grid = mixedScene();
  const stoneBefore = Array.from(grid.cells, (cell) => cell === STONE);
  for (let i = 0; i < 300; i += 1) step(grid, i % 2 === 0);
  assert.equal(countOf(grid, SAND), 7);
  assert.equal(countOf(grid, WATER), 35);
  assert.deepEqual(Array.from(grid.cells, (cell) => cell === STONE), stoneBefore);
});

test('a mixed scene settles within a bounded number of steps', () => {
  const grid = mixedScene();
  let steps = 0;
  while (steps < 2000 && step(grid, steps % 2 === 0)) steps += 1;
  assert.ok(steps < 2000, 'scene still moving after 2000 steps');
});

test('particles on the edge of the grid stay inside it', () => {
  const grid = createGrid(3, 4);
  setCell(grid, 0, 2, SAND);
  setCell(grid, 0, 3, STONE);
  setCell(grid, 2, 1, WATER);
  for (let i = 0; i < 20; i += 1) step(grid, i % 2 === 0);
  assert.equal(countOf(grid, EMPTY), 9);
  assert.equal(countOf(grid, SAND), 1);
  assert.equal(countOf(grid, WATER), 1);
  assert.equal(countOf(grid, STONE), 1);
});
