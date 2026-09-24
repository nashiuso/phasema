import type { Canvas } from "@napi-rs/canvas";
import { createRandom, randomChoice } from "../utils/random.js";
import { FONT_FAMILIES } from "./fonts.js";

export interface TextRenderOptions {
  text: string;
  fontSize: number;
  fontWeight: number;
  color: string;
  fontFamilies: string[];
  seed: number;
}

export function renderVariableFontText(canvas: Canvas, opts: TextRenderOptions): void {
  const ctx = canvas.getContext("2d");
  const rand = createRandom(opts.seed);
  const families =
    opts.fontFamilies.length > 0 ? opts.fontFamilies : FONT_FAMILIES.map((f) => f.name);

  ctx.fillStyle = opts.color;
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";

  const chars = [...opts.text];

  let totalWidth = 0;
  const widths: number[] = [];
  for (const ch of chars) {
    const family = randomChoice(rand, families);
    ctx.font = opts.fontWeight + " " + opts.fontSize + "px " + family;
    const w = ctx.measureText(ch).width;
    widths.push(w);
    totalWidth += w;
  }

  let x = (canvas.width - totalWidth) / 2;
  const y = canvas.height / 2;

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    if (ch === undefined) continue;
    const family = randomChoice(rand, families);
    ctx.font = opts.fontWeight + " " + opts.fontSize + "px " + family;
    ctx.fillText(ch, x, y);
    x += widths[i] ?? 0;
  }
}
