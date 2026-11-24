import { EMPTY, getCell, setCell } from './grid.js';

export const SAND = 1;

export function stepSand(grid, leftToRight) {
  const preferred = leftToRight ? -1 : 1;
  for (let y = grid.height - 2; y >= 0; y -= 1) {
    for (let i = 0; i < grid.width; i += 1) {
      const x = leftToRight ? i : grid.width - 1 - i;
      if (getCell(grid, x, y) !== SAND) continue;
      if (move(grid, x, y, x, y + 1)) continue;
      if (move(grid, x, y, x + preferred, y + 1)) continue;
      move(grid, x, y, x - preferred, y + 1);
    }
  }
}

function move(grid, fromX, fromY, toX, toY) {
  if (getCell(grid, toX, toY) !== EMPTY) return false;
  setCell(grid, toX, toY, SAND);
  setCell(grid, fromX, fromY, EMPTY);
  return true;
}
