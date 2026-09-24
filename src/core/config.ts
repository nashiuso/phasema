import type { GenerationOptions } from "./types.js";

export const DEFAULT_OPTIONS: GenerationOptions = {
  size: 512,
  seed: Date.now(),
  pixelCoverage: 0.1,
  outputDir: "output",
  outputCount: 10,
};
