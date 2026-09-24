#!/usr/bin/env node
import "dotenv/config";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { loadImage } from "@napi-rs/canvas";
import type { Image } from "@napi-rs/canvas";
import { DEFAULT_OPTIONS } from "./core/config.js";
import { logSuccess, logError, logInfo, logStep } from "./core/logger.js";
import { printBanner } from "./core/cli-theme.js";
import { createRandom } from "./utils/random.js";
import { generatePixelLayer } from "./pixels/generator.js";
import { generateProceduralPhoto } from "./stock/fallback.js";
import { fetchRandomStockPhotos, downloadImage } from "./stock/client.js";
import { processStockImage } from "./stock/processor.js";
import { compose } from "./composition/composer.js";
import { registerAllFonts, generateFramesParallel, encodeRgbaFrames } from "./banner/index.js";
import type { BannerRecipe } from "./banner/types.js";

function parseArgs(argv: string[]): { command: string; flags: Map<string, string> } {
  const args = argv.slice(2).filter((a) => !a.endsWith(".ts") && !a.endsWith(".js"));
  const command = args[0] ?? "help";
  const flags = new Map<string, string>();

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg?.startsWith("--")) {
      const key = arg.slice(2);
      const value = args[i + 1]?.startsWith("--") ? "true" : (args[++i] ?? "true");
      flags.set(key, value);
    }
  }

  return { command, flags };
}

async function cmdHelp(): Promise<void> {
  printBanner();
  console.log("Usage: phasema <command> [flags]");
  console.log();
  console.log("Commands:");
  console.log("  generate   Generate static PNG compositions");
  console.log("  banner     Generate animated banner GIF");
  console.log("  help       Show this message");
  console.log();
  console.log("Flags:");
  console.log("  --count <n>      Number of results (generate)");
  console.log("  --fps <n>        Frames per second (banner)");
  console.log("  --duration <n>   Duration in seconds (banner)");
  console.log("  --workers <n>    Worker threads (banner)");
  console.log("  --size <n>       Canvas size (generate)");
}

async function cmdGenerate(flags: Map<string, string>): Promise<void> {
  const outputDir = DEFAULT_OPTIONS.outputDir;
  const outputCount = Number(flags.get("count") ?? DEFAULT_OPTIONS.outputCount);
  const seed = DEFAULT_OPTIONS.seed;
  const size = Number(flags.get("size") ?? DEFAULT_OPTIONS.size);

  await mkdir(outputDir, { recursive: true });
  const src = process.env.PEXELS_API_KEY ? "pexels" : "procedural";
  logStep(`Generating ${outputCount} results (${src}, seed ${seed})`);

  for (let i = 0; i < outputCount; i++) {
    const s = seed + i * 1000;
    const rand = createRandom(s);
    const canvas = generatePixelLayer(size, size, DEFAULT_OPTIONS.pixelCoverage, s);
    const buffers: Buffer[] = [];

    if (process.env.PEXELS_API_KEY) {
      const photos = await fetchRandomStockPhotos(3, process.env.PEXELS_API_KEY, rand);
      for (let j = 0; j < photos.length; j++) {
        const p = photos[j];
        if (p === undefined) continue;
        const raw = await downloadImage(p.url);
        const proc = await processStockImage(raw, size, s + j + 1);
        buffers.push(proc.buffer);
      }
    } else {
      for (let j = 0; j < 3; j++) {
        const raw = generateProceduralPhoto(size, s + j + 1);
        const proc = await processStockImage(raw, size, s + j + 100);
        buffers.push(proc.buffer);
      }
    }

    const images: Image[] = await Promise.all(buffers.map((b) => loadImage(b)));
    const final = compose(canvas, images, s);
    const filePath = join(outputDir, `result-${String(i).padStart(2, "0")}.png`);
    await writeFile(filePath, final.toBuffer("image/png"));
    logSuccess(`${filePath} (${final.width}x${final.height})`);
  }

  logSuccess("Done.");
}

async function cmdBanner(flags: Map<string, string>): Promise<void> {
  const registered = registerAllFonts();
  logInfo(`Registered fonts: ${registered}`);

  const recipe: BannerRecipe = {
    width: Number(flags.get("width") ?? 900),
    height: Number(flags.get("height") ?? 472),
    fps: Number(flags.get("fps") ?? 60),
    duration: Number(flags.get("duration") ?? 5),
    text: flags.get("text") ?? "PHASEMA",
    fontFamilies: [],
    fontWeight: 700,
    fontSize: 170,
    textColor: "#ffffff",
    bgColor: "#0a0a0a",
    seed: Date.now(),
    outputPath: flags.get("output") ?? "output/banner.gif",
    useBackground: flags.get("no-background") !== "true",
    backgroundImageCount: Number(flags.get("background-count") ?? 6),
    workerCount: Number(flags.get("workers") ?? 8),
    sampleFactor: Number(flags.get("sample") ?? 20),
  };

  await mkdir("output", { recursive: true });
  const totalFrames = recipe.fps * recipe.duration;
  logStep(`Rendering ${totalFrames} frames at ${recipe.fps} fps`);

  const rgbaFrames = await generateFramesParallel(recipe);

  await encodeRgbaFrames(rgbaFrames, {
    width: recipe.width,
    height: recipe.height,
    fps: recipe.fps,
    outputPath: recipe.outputPath,
    sampleFactor: recipe.sampleFactor,
  });

  logSuccess(`Saved: ${recipe.outputPath}`);
}

async function main(): Promise<void> {
  const { command, flags } = parseArgs(process.argv);

  if (command === "help" || flags.has("help")) {
    await cmdHelp();
    return;
  }

  if (command === "generate") {
    await cmdGenerate(flags);
    return;
  }

  if (command === "banner") {
    await cmdBanner(flags);
    return;
  }

  logError(`Unknown command: ${command}`);
  await cmdHelp();
  process.exit(1);
}

main().catch((err) => {
  logError(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
