export interface BannerRecipe {
  width: number;
  height: number;
  fps: number;
  duration: number;
  text: string;
  fontFamilies: string[];
  fontWeight: number;
  fontSize: number;
  textColor: string;
  bgColor: string;
  seed: number;
  outputPath: string;
  useBackground: boolean;
  backgroundImageCount: number;
  workerCount: number;
  sampleFactor: number;
}

export interface FontFamily {
  name: string;
  path: string;
}
