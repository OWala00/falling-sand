export const EMPTY = 0;

export function createGrid(width, height) {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1) {
    throw new RangeError('grid size must be positive integers');
  }
  return { width, height, cells: new Uint8Array(width * height) };
}

export function inBounds(grid, x, y) {
  return x >= 0 && y >= 0 && x < grid.width && y < grid.height;
}

export function getCell(grid, x, y) {
  if (!inBounds(grid, x, y)) return null;
  return grid.cells[y * grid.width + x];
}

export function setCell(grid, x, y, value) {
  if (!inBounds(grid, x, y)) return false;
  grid.cells[y * grid.width + x] = value;
  return true;
}
