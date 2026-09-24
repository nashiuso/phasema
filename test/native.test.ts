import { describe, it, expect } from "vitest";
import { createCanvas } from "@napi-rs/canvas";
import sharp from "sharp";

describe("native binaries", () => {
  it("canvas draws a red pixel", () => {
    const canvas = createCanvas(10, 10);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(0, 0, 1, 1);
    const pixel = ctx.getImageData(0, 0, 1, 1).data;
    expect(pixel[0]).toBe(255);
    expect(pixel[1]).toBe(0);
    expect(pixel[2]).toBe(0);
  });

  it("canvas exports a valid PNG signature", () => {
    const canvas = createCanvas(8, 8);
    const buffer = canvas.toBuffer("image/png");
    expect(buffer[0]).toBe(0x89);
    expect(buffer[1]).toBe(0x50);
    expect(buffer[2]).toBe(0x4e);
    expect(buffer[3]).toBe(0x47);
  });

  it("sharp produces a PNG buffer", async () => {
    const buffer = await sharp({
      create: {
        width: 8,
        height: 8,
        channels: 3,
        background: { r: 0, g: 0, b: 0 },
      },
    })
      .png()
      .toBuffer();
    expect(buffer.length).toBeGreaterThan(0);
    expect(buffer[0]).toBe(0x89);
  });
});
