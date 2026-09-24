import { createCanvas } from "@napi-rs/canvas";
import type { Canvas } from "@napi-rs/canvas";
import {
  createRandom,
  randomInt,
  randomFloat,
  randomHexColor,
  randomChoice,
} from "../utils/random.js";

export type { Canvas };

export function generatePixelLayer(
  width: number,
  height: number,
  coverage: number,
  seed: number,
  blockSize = 1,
): Canvas {
  const rand = createRandom(seed);
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, width, height);

  const totalBlocks = Math.floor(((width * height) / (blockSize * blockSize)) * coverage);
  const colors: string[] = [];
  for (let i = 0; i < 5; i++) colors.push(randomHexColor(rand));

  if (rand() < 0.5) {
    const x0 = randomFloat(rand, 0, width);
    const y0 = randomFloat(rand, 0, height);
    const x1 = randomFloat(rand, 0, width);
    const y1 = randomFloat(rand, 0, height);
    const grad = ctx.createLinearGradient(x0, y0, x1, y1);
    for (let i = 0; i < colors.length; i++) {
      const c = colors[i];
      if (c === undefined) continue;
      grad.addColorStop(i / (colors.length - 1), c);
    }
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
    ctx.globalAlpha = 1;
  }

  for (let i = 0; i < totalBlocks; i++) {
    const x = randomInt(rand, 0, width - blockSize);
    const y = randomInt(rand, 0, height - blockSize);
    ctx.fillStyle = randomChoice(rand, colors);
    ctx.fillRect(x, y, blockSize, blockSize);
  }

  return canvas;
}
