import { EMPTY, getCell, setCell } from './grid.js';

export const SAND = 1;
export const WATER = 2;
export const STONE = 3;

export function step(grid, leftToRight) {
  const preferred = leftToRight ? -1 : 1;
  const moved = new Uint8Array(grid.width * grid.height);
  for (let y = grid.height - 2; y >= 0; y -= 1) {
    for (let i = 0; i < grid.width; i += 1) {
      const x = leftToRight ? i : grid.width - 1 - i;
      if (moved[y * grid.width + x]) continue;
      const cell = getCell(grid, x, y);
      if (cell === WATER) {
        if (move(grid, moved, x, y, x, y + 1)) continue;
        const dir = flowDirection(grid, x, y, preferred);
        if (dir !== null) move(grid, moved, x, y, x + dir, y);
        continue;
      }
      if (cell !== SAND) continue;
      if (move(grid, moved, x, y, x, y + 1)) continue;
      if (move(grid, moved, x, y, x + preferred, y + 1)) continue;
      move(grid, moved, x, y, x - preferred, y + 1);
    }
  }
}

function flowDirection(grid, x, y, preferred) {
  let best = null;
  let bestDistance = Infinity;
  for (const dir of [preferred, -preferred]) {
    for (let d = 1; getCell(grid, x + dir * d, y) === EMPTY; d += 1) {
      if (getCell(grid, x + dir * d, y + 1) === EMPTY) {
        if (d < bestDistance) {
          best = dir;
          bestDistance = d;
        }
        break;
      }
    }
  }
  return best;
}

function move(grid, moved, fromX, fromY, toX, toY) {
  const mover = getCell(grid, fromX, fromY);
  const target = getCell(grid, toX, toY);
  if (target !== EMPTY && !(mover === SAND && target === WATER)) return false;
  setCell(grid, toX, toY, mover);
  setCell(grid, fromX, fromY, target);
  moved[toY * grid.width + toX] = 1;
  return true;
}
