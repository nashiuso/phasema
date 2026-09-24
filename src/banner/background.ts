import { createRandom } from "../utils/random.js";
import { fetchRandomStockPhotos, downloadImage } from "../stock/client.js";
import { processStockImage } from "../stock/processor.js";
import { generateProceduralPhoto } from "../stock/fallback.js";

export interface BackgroundPool {
  buffers: Buffer[];
  mode: "pexels" | "procedural";
}

export async function buildBackgroundPool(
  count: number,
  targetSize: number,
  seed: number,
): Promise<BackgroundPool> {
  const rand = createRandom(seed);
  const apiKey = process.env.PEXELS_API_KEY;
  const buffers: Buffer[] = [];
  let mode: "pexels" | "procedural" = "procedural";

  if (apiKey !== undefined && apiKey !== "") {
    mode = "pexels";
    const photos = await fetchRandomStockPhotos(count, apiKey, rand);
    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      if (photo === undefined) continue;
      const raw = await downloadImage(photo.url);
      const processed = await processStockImage(raw, targetSize, seed + i + 1);
      buffers.push(processed.buffer);
    }
  } else {
    for (let i = 0; i < count; i++) {
      const raw = generateProceduralPhoto(targetSize, seed + i + 1);
      const processed = await processStockImage(raw, targetSize, seed + i + 100);
      buffers.push(processed.buffer);
    }
  }

  return { buffers, mode };
}
