import { GlobalFonts } from "@napi-rs/canvas";
import { createRequire } from "node:module";
import type { FontFamily } from "./types.js";

const require = createRequire(import.meta.url);

export const FONT_FAMILIES: FontFamily[] = [
  {
    name: "Montserrat",
    path: require.resolve("@fontsource/montserrat/files/montserrat-latin-700-normal.woff2"),
  },
  { name: "Inter", path: require.resolve("@fontsource/inter/files/inter-latin-700-normal.woff2") },
  {
    name: "Poppins",
    path: require.resolve("@fontsource/poppins/files/poppins-latin-700-normal.woff2"),
  },
  {
    name: "Roboto",
    path: require.resolve("@fontsource/roboto/files/roboto-latin-700-normal.woff2"),
  },
  {
    name: "Playfair",
    path: require.resolve("@fontsource/playfair-display/files/playfair-display-latin-700-normal.woff2"),
  },
  {
    name: "Oswald",
    path: require.resolve("@fontsource/oswald/files/oswald-latin-700-normal.woff2"),
  },
];

export function registerAllFonts(): number {
  let count = 0;
  for (const font of FONT_FAMILIES) {
    try {
      const ok = GlobalFonts.registerFromPath(font.path, font.name);
      if (ok) count++;
    } catch {
      console.warn("No se pudo registrar: " + font.name);
    }
  }
  return count;
}
