import type { Canvas, Image } from "@napi-rs/canvas";
import { createRandom, randomInt, randomFloat } from "../utils/random.js";

const BLEND_MODES = ["source-over", "source-over", "source-over", "multiply", "screen"] as const;

export function compose(baseCanvas: Canvas, images: Image[], seed: number): Canvas {
  const rand = createRandom(seed);
  const ctx = baseCanvas.getContext("2d");
  const width = baseCanvas.width;
  const height = baseCanvas.height;

  for (const img of images) {
    const mode = BLEND_MODES[Math.floor(rand() * BLEND_MODES.length)] ?? "source-over";

    ctx.save();
    ctx.globalCompositeOperation = mode;
    ctx.globalAlpha = randomFloat(rand, 0.35, 0.75);

    const x = randomInt(rand, -Math.floor(width * 0.2), Math.floor(width * 0.8));
    const y = randomInt(rand, -Math.floor(height * 0.2), Math.floor(height * 0.8));

    ctx.drawImage(img, x, y, img.width, img.height);
    ctx.restore();
  }

  return baseCanvas;
}
