import { GIFEncoder } from "@gomander/napi-gif-encoder";
import { logInfo } from "../core/logger.js";

export interface GifOptions {
  width: number;
  height: number;
  fps: number;
  outputPath: string;
  sampleFactor: number;
}

export async function encodeRgbaFrames(frames: Buffer[], opts: GifOptions): Promise<void> {
  logInfo(`Encoding ${frames.length} frames at ${opts.fps} fps (sample ${opts.sampleFactor})`);

  const encoder = new GIFEncoder(opts.width, opts.height, opts.outputPath);
  encoder.setFrameRate(opts.fps);
  encoder.setRepeat(0);
  encoder.setSampleFactor(opts.sampleFactor);

  for (const frame of frames) {
    encoder.addFrame(frame);
  }

  await encoder.finish();
  logInfo(`GIF written to ${opts.outputPath}`);
}
