import type { Canvas, Image } from "@napi-rs/canvas";
import { loadImage } from "@napi-rs/canvas";
import { generatePixelLayer } from "../pixels/generator.js";
import { compose } from "../composition/composer.js";
import { renderVariableFontText } from "./text-renderer.js";
import { buildBackgroundPool } from "./background.js";
import type { BannerRecipe } from "./types.js";

export interface BannerFramesResult {
  frames: Canvas[];
  backgroundMode: "pexels" | "procedural" | "none";
}

export async function generateBannerFrames(recipe: BannerRecipe): Promise<BannerFramesResult> {
  const frames: Canvas[] = [];
  const totalFrames = recipe.fps * recipe.duration;
  const maxDim = Math.max(recipe.width, recipe.height);

  let backgroundImages: Image[] = [];
  let backgroundMode: "pexels" | "procedural" | "none" = "none";

  if (recipe.useBackground && recipe.backgroundImageCount > 0) {
    const pool = await buildBackgroundPool(recipe.backgroundImageCount, maxDim, recipe.seed);
    backgroundImages = await Promise.all(pool.buffers.map((b) => loadImage(b)));
    backgroundMode = pool.mode;
  }

  for (let i = 0; i < totalFrames; i++) {
    const frameSeed = recipe.seed + i * 1000;
    const canvas = generatePixelLayer(recipe.width, recipe.height, 0.1, frameSeed);

    if (backgroundImages.length > 0) {
      compose(canvas, backgroundImages, frameSeed + 7);
    }

    renderVariableFontText(canvas, {
      text: recipe.text,
      fontSize: recipe.fontSize,
      fontWeight: recipe.fontWeight,
      color: recipe.textColor,
      fontFamilies: recipe.fontFamilies,
      seed: frameSeed + 3,
    });

    frames.push(canvas);
  }

  return { frames, backgroundMode };
}
