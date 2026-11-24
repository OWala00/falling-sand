import { setCell } from './grid.js';

export function stamp(grid, cx, cy, size, value) {
  const r = (size - 1) / 2;
  for (let dy = -r; dy <= r; dy += 1) {
    for (let dx = -r; dx <= r; dx += 1) {
      if (dx * dx + dy * dy <= r * r) setCell(grid, cx + dx, cy + dy, value);
    }
  }
}

export function strokeLine(grid, x0, y0, x1, y1, size, value) {
  const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
  for (let i = 0; i <= steps; i += 1) {
    const t = steps === 0 ? 0 : i / steps;
    stamp(grid, Math.round(x0 + (x1 - x0) * t), Math.round(y0 + (y1 - y0) * t), size, value);
  }
}

export function cellAt(grid, rect, clientX, clientY) {
  return {
    x: Math.floor(((clientX - rect.left) / rect.width) * grid.width),
    y: Math.floor(((clientY - rect.top) / rect.height) * grid.height),
  };
}
