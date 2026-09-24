import { Piscina } from "piscina";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { logInfo, logSuccess } from "../core/logger.js";
import type { BannerRecipe } from "./types.js";
import type { WorkerInput } from "./worker.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const isDev = __dirname.includes("/src/");

export async function generateFramesParallel(recipe: BannerRecipe): Promise<Buffer[]> {
  const totalFrames = recipe.fps * recipe.duration;
  const workerCount = recipe.workerCount ?? 4;

  const workerFile = isDev ? resolve(__dirname, "worker.ts") : resolve(__dirname, "worker.js");
  const execArgv = isDev ? ["--import", "tsx/esm"] : [];

  const piscina = new Piscina({
    filename: workerFile,
    maxThreads: workerCount,
    execArgv,
  });

  let completed = 0;
  const progressEvery = Math.max(1, Math.floor(totalFrames / 20));

  const t0 = Date.now();
  logInfo(`Rendering ${totalFrames} frames with ${workerCount} workers`);

  const tasks = Array.from({ length: totalFrames }, (_, frameIndex) => {
    const input: WorkerInput = { recipe, frameIndex };
    return piscina.run(input).then((result) => {
      completed++;
      if (completed % progressEvery === 0 || completed === totalFrames) {
        const pct = Math.round((completed / totalFrames) * 100);
        const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
        process.stdout.write(`\r[PHASEMA] ${pct}% (${completed}/${totalFrames}) ${elapsed}s`);
      }
      return result as Buffer;
    });
  });

  const frames = await Promise.all(tasks);
  await piscina.destroy();
  process.stdout.write("\n");

  const dt = ((Date.now() - t0) / 1000).toFixed(1);
  logSuccess(`Rendered ${frames.length} frames in ${dt}s`);
  return frames;
}
