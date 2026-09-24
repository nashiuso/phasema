import { gradient, color } from "ansimax";

const PURPLE_GRADIENT = ["#6a0dad", "#9b59b6", "#d7bde2", "#9b59b6", "#6a0dad"];

export function printBanner(): void {
  console.log(gradient("PHASEMA", PURPLE_GRADIENT));
  console.log(color.gray("Generative image and animated banner engine"));
  console.log();
}
