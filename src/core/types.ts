export interface GenerationOptions {
  size: number;
  seed: number;
  pixelCoverage: number;
  outputDir: string;
  outputCount: number;
}

export interface GenerationResult {
  index: number;
  seed: number;
  filePath: string;
  width: number;
  height: number;
}
