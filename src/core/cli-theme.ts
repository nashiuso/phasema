import { gradient, color } from "ansimax";

export const PURPLE_GRADIENT = ["#6a0dad", "#9b59b6", "#d7bde2", "#9b59b6", "#6a0dad"];

export const theme = {
  primary: (text: string) => gradient(text, PURPLE_GRADIENT),
  accent: (text: string) => color.magenta(text),
  success: (text: string) => color.green(text),
  error: (text: string) => color.red(text),
  warn: (text: string) => color.yellow(text),
  info: (text: string) => color.cyan(text),
  dim: (text: string) => color.gray(text),
};

export function printBanner(): void {
  console.log(theme.primary("PHASEMA"));
  console.log(theme.dim("Generative image and animated banner engine"));
  console.log();
}
