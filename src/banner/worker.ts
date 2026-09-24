import { loadImage } from "@napi-rs/canvas";
import type { Image } from "@napi-rs/canvas";
import { generatePixelLayer } from "../pixels/generator.js";
import { compose } from "../composition/composer.js";
import { renderVariableFontText } from "./text-renderer.js";
import { buildBackgroundPool } from "./background.js";
import type { BannerRecipe } from "./types.js";

export interface WorkerInput {
  recipe: BannerRecipe;
  frameIndex: number;
}

let cachedImages: Image[] | null = null;
let cachedSeed = -1;

async function getBackground(recipe: BannerRecipe): Promise<Image[]> {
  if (cachedImages !== null && cachedSeed === recipe.seed) return cachedImages;

  const maxDim = Math.max(recipe.width, recipe.height);
  const pool = await buildBackgroundPool(recipe.backgroundImageCount, maxDim, recipe.seed);
  cachedImages = await Promise.all(pool.buffers.map((b) => loadImage(b)));
  cachedSeed = recipe.seed;
  return cachedImages;
}

export default async function generateFrame(input: WorkerInput): Promise<Buffer> {
  const { recipe, frameIndex } = input;
  const frameSeed = recipe.seed + frameIndex * 1000;

  const canvas = generatePixelLayer(recipe.width, recipe.height, 0.02, frameSeed, 3);
  const ctx = canvas.getContext("2d");

  if (recipe.useBackground && recipe.backgroundImageCount > 0) {
    const images = await getBackground(recipe);
    compose(canvas, images, frameSeed + 7);
  }

  renderVariableFontText(canvas, {
    text: recipe.text,
    fontSize: recipe.fontSize,
    fontWeight: recipe.fontWeight,
    color: recipe.textColor,
    fontFamilies: recipe.fontFamilies,
    seed: frameSeed + 3,
  });

  const imageData = ctx.getImageData(0, 0, recipe.width, recipe.height);
  const raw = imageData.data;
  return Buffer.from(raw.buffer as ArrayBuffer, raw.byteOffset, raw.byteLength);
}
