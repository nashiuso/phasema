declare module "@gomander/napi-gif-encoder" {
  export class GIFEncoder {
    constructor(width: number, height: number, file: string);
    addFrame(frame: Buffer): void;
    setFrameRate(framerate: number): void;
    setSampleFactor(factor: number): void;
    setRepeat(count: number): void;
    finish(): Promise<void>;
  }
}
