import sharp from "sharp";
import { createRandom, randomFloat } from "../utils/random.js";

export interface ProcessedImage {
  buffer: Buffer;
  rotate: number;
  flip: boolean;
  flop: boolean;
}

export async function processStockImage(
  input: Buffer,
  targetSize: number,
  seed: number,
): Promise<ProcessedImage> {
  const rand = createRandom(seed);
  const rotate = randomFloat(rand, -180, 180);
  const flip = rand() < 0.5;
  const flop = rand() < 0.5;
  const scale = randomFloat(rand, 0.4, 0.9);
  const side = Math.max(64, Math.floor(targetSize * scale));

  let pipeline = sharp(input)
    .resize(side, side, { fit: "cover", position: "center" })
    .rotate(rotate, { background: { r: 0, g: 0, b: 0, alpha: 0 } });

  if (flip) pipeline = pipeline.flip();
  if (flop) pipeline = pipeline.flop();

  const buffer = await pipeline.png().toBuffer();
  return { buffer, rotate, flip, flop };
}
