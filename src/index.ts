export { generatePixelLayer } from "./pixels/generator.js";
export type { Canvas } from "./pixels/generator.js";
export { compose } from "./composition/composer.js";
export { DEFAULT_OPTIONS } from "./core/config.js";
export type { GenerationOptions, GenerationResult } from "./core/types.js";
export {
  createRandom,
  randomInt,
  randomFloat,
  randomChoice,
  randomHexColor,
} from "./utils/random.js";
export {
  registerAllFonts,
  renderVariableFontText,
  encodeRgbaFrames,
  generateFramesParallel,
  buildBackgroundPool,
  FONT_FAMILIES,
} from "./banner/index.js";
export type { BannerRecipe, FontFamily, BackgroundPool } from "./banner/index.js";
export {
  fetchRandomStockPhotos,
  downloadImage,
  processStockImage,
  generateProceduralPhoto,
} from "./stock/index.js";
