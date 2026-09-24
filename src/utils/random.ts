export function createRandom(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = t;
    r = Math.imul(r ^ (r >>> 15), r | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function randomInt(rand: () => number, min: number, max: number): number {
  return Math.floor(rand() * (max - min + 1)) + min;
}

export function randomFloat(rand: () => number, min: number, max: number): number {
  return rand() * (max - min) + min;
}

export function randomChoice<T>(rand: () => number, arr: readonly T[]): T {
  const item = arr[Math.floor(rand() * arr.length)];
  if (item === undefined) throw new Error("randomChoice: empty array");
  return item;
}

export function randomHexColor(rand: () => number): string {
  const r = randomInt(rand, 0, 255).toString(16).padStart(2, "0");
  const g = randomInt(rand, 0, 255).toString(16).padStart(2, "0");
  const b = randomInt(rand, 0, 255).toString(16).padStart(2, "0");
  return "#" + r + g + b;
}
