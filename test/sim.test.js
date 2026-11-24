import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createGrid, getCell, setCell, EMPTY } from '../src/grid.js';
import { SAND, WATER, STONE, step } from '../src/sim.js';

test('step reports whether any particle moved, so a settled grid can be skipped', () => {
  const grid = createGrid(3, 4);
  setCell(grid, 1, 0, SAND);
  assert.equal(step(grid, true), true);
  for (let i = 0; i < 10; i += 1) step(grid, i % 2 === 0);
  assert.equal(step(grid, true), false);
});

test('a grain of sand falls one cell per step through empty space', () => {
  const grid = createGrid(3, 6);
  setCell(grid, 1, 0, SAND);
  step(grid, true);
  assert.equal(getCell(grid, 1, 0), EMPTY);
  assert.equal(getCell(grid, 1, 1), SAND);
});

test('a grain slides diagonally when the cell below is blocked', () => {
  const grid = createGrid(3, 3);
  setCell(grid, 1, 1, SAND);
  setCell(grid, 1, 2, SAND);
  step(grid, true);
  assert.equal(getCell(grid, 1, 1), EMPTY);
  assert.equal(getCell(grid, 0, 2), SAND);
});

test('the scan direction decides which diagonal a grain takes', () => {
  const grid = createGrid(3, 3);
  setCell(grid, 1, 1, SAND);
  setCell(grid, 1, 2, SAND);
  step(grid, false);
  assert.equal(getCell(grid, 1, 1), EMPTY);
  assert.equal(getCell(grid, 2, 2), SAND);
});

test('when two grains want the same cell, the one scanned first takes it', () => {
  const grid = createGrid(3, 3);
  setCell(grid, 0, 2, SAND);
  setCell(grid, 2, 2, SAND);
  setCell(grid, 0, 1, SAND);
  setCell(grid, 2, 1, SAND);
  step(grid, false);
  assert.equal(getCell(grid, 2, 1), EMPTY);
  assert.equal(getCell(grid, 1, 2), SAND);
  assert.equal(getCell(grid, 0, 1), SAND);
});

test('a column of sand settles into a pile that spreads evenly to both sides', () => {
  const grid = createGrid(41, 30);
  for (let y = 0; y < 20; y += 1) setCell(grid, 20, y, SAND);
  for (let i = 0; i < 400; i += 1) step(grid, i % 2 === 0);
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

test('a drop of water falls one cell per step through empty space', () => {
  const grid = createGrid(3, 6);
  setCell(grid, 1, 0, WATER);
  step(grid, true);
  assert.equal(getCell(grid, 1, 0), EMPTY);
  assert.equal(getCell(grid, 1, 1), WATER);
});

test('water spreads sideways when the cell below is blocked', () => {
  const grid = createGrid(3, 2);
  setCell(grid, 1, 1, SAND);
  setCell(grid, 1, 0, WATER);
  step(grid, true);
  assert.equal(getCell(grid, 1, 0), EMPTY);
  assert.equal(getCell(grid, 0, 0), WATER);
});

test('water that moves sideways waits until the next step to fall', () => {
  const grid = createGrid(5, 2);
  for (const x of [0, 1, 2, 4]) setCell(grid, x, 1, SAND);
  setCell(grid, 1, 0, SAND);
  setCell(grid, 2, 0, WATER);
  step(grid, true);
  assert.equal(getCell(grid, 2, 0), EMPTY);
  assert.equal(getCell(grid, 3, 0), WATER);
  assert.equal(getCell(grid, 3, 1), EMPTY);
});

test('sand sinks through water', () => {
  const grid = createGrid(3, 3);
  for (let x = 0; x < 3; x += 1) setCell(grid, x, 2, WATER);
  setCell(grid, 1, 1, SAND);
  step(grid, true);
  assert.equal(getCell(grid, 1, 1), WATER);
  assert.equal(getCell(grid, 1, 2), SAND);
});

test('blocked water flows toward a gap in the floor, not toward the side it prefers', () => {
  const grid = createGrid(5, 3);
  for (const x of [0, 1, 3, 4]) setCell(grid, x, 2, SAND);
  setCell(grid, 1, 1, WATER);
  step(grid, true);
  assert.equal(getCell(grid, 1, 1), EMPTY);
  assert.equal(getCell(grid, 2, 1), WATER);
});

test('water poured into a container spreads until the floor is covered', () => {
  const grid = createGrid(9, 10);
  for (let y = 0; y < 9; y += 1) setCell(grid, 4, y, WATER);
  for (let i = 0; i < 300; i += 1) step(grid, i % 2 === 0);
  for (let x = 0; x < grid.width; x += 1) assert.equal(getCell(grid, x, 9), WATER);
});

test('sand stops on stone instead of falling through it', () => {
  const grid = createGrid(3, 3);
  for (let x = 0; x < 3; x += 1) setCell(grid, x, 2, STONE);
  setCell(grid, 1, 1, SAND);
  step(grid, true);
  assert.equal(getCell(grid, 1, 1), SAND);
  assert.equal(getCell(grid, 1, 2), STONE);
});

test('water does not flow through a stone wall', () => {
  const grid = createGrid(5, 3);
  for (const x of [0, 1, 2, 4]) setCell(grid, x, 2, STONE);
  setCell(grid, 2, 1, STONE);
  setCell(grid, 1, 1, WATER);
  for (let i = 0; i < 50; i += 1) step(grid, i % 2 === 0);
  assert.equal(getCell(grid, 1, 1), WATER);
  assert.equal(getCell(grid, 3, 1), EMPTY);
  assert.equal(getCell(grid, 4, 1), EMPTY);
});

test('sand piles on stone into a slope that falls away on both sides', () => {
  const grid = createGrid(21, 10);
  for (let x = 0; x < grid.width; x += 1) setCell(grid, x, 9, STONE);
  for (let y = 0; y < 8; y += 1) setCell(grid, 10, y, SAND);
  for (let i = 0; i < 300; i += 1) step(grid, i % 2 === 0);
  const heights = [];
  for (let x = 0; x < grid.width; x += 1) {
    let height = 0;
    for (let y = 0; y < grid.height; y += 1) if (getCell(grid, x, y) === SAND) height += 1;
    heights.push(height);
  }
  const falls = (values) => values.every((value, i) => i === 0 || value <= values[i - 1]);
  assert.equal(heights.reduce((sum, height) => sum + height, 0), 8);
  assert.ok(falls(heights.slice(10)), `right side ${heights}`);
  assert.ok(falls(heights.slice(0, 11).reverse()), `left side ${heights}`);
  assert.ok(heights[8] > 0 && heights[12] > 0, `${heights}`);
  for (let y = 0; y < grid.height; y += 1) {
    for (let x = 0; x < grid.width; x += 1) {
      if (getCell(grid, x, y) !== SAND) continue;
      assert.ok([STONE, SAND].includes(getCell(grid, x, y + 1)), `sand floats at ${x},${y}`);
    }
  }
});
