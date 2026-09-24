import { createCanvas } from "@napi-rs/canvas";
import {
  createRandom,
  randomInt,
  randomFloat,
  randomHexColor,
  randomChoice,
} from "../utils/random.js";

export function generateProceduralPhoto(size: number, seed: number): Buffer {
  const rand = createRandom(seed);
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = randomHexColor(rand);
  ctx.fillRect(0, 0, size, size);

  const shapeCount = randomInt(rand, 3, 8);
  const kinds = ["circle", "rect", "triangle"] as const;

  for (let i = 0; i < shapeCount; i++) {
    ctx.fillStyle = randomHexColor(rand);
    ctx.globalAlpha = randomFloat(rand, 0.2, 0.7);
    const kind = randomChoice(rand, kinds);

    if (kind === "circle") {
      ctx.beginPath();
      ctx.arc(
        randomFloat(rand, 0, size),
        randomFloat(rand, 0, size),
        randomFloat(rand, size * 0.05, size * 0.35),
        0,
        Math.PI * 2,
      );
      ctx.fill();
    } else if (kind === "rect") {
      ctx.fillRect(
        randomFloat(rand, 0, size * 0.7),
        randomFloat(rand, 0, size * 0.7),
        randomFloat(rand, size * 0.1, size * 0.5),
        randomFloat(rand, size * 0.1, size * 0.5),
      );
    } else {
      ctx.beginPath();
      ctx.moveTo(randomFloat(rand, 0, size), randomFloat(rand, 0, size));
      ctx.lineTo(randomFloat(rand, 0, size), randomFloat(rand, 0, size));
      ctx.lineTo(randomFloat(rand, 0, size), randomFloat(rand, 0, size));
      ctx.closePath();
      ctx.fill();
    }
  }

  ctx.globalAlpha = 1;
  return canvas.toBuffer("image/png");
}
