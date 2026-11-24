import { EMPTY } from './grid.js';

const PALETTE = [
  [13, 15, 18],
  [224, 180, 108],
  [58, 122, 196],
];

export function draw(ctx, grid) {
  const { width, height, cells } = grid;
  const image = ctx.createImageData(width, height);
  for (let i = 0; i < cells.length; i++) {
    const [r, g, b] = PALETTE[cells[i]] ?? PALETTE[EMPTY];
    const p = i * 4;
    image.data[p] = r;
    image.data[p + 1] = g;
    image.data[p + 2] = b;
    image.data[p + 3] = 255;
  }
  ctx.putImageData(image, 0, 0);
}
