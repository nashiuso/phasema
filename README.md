<p align="center">
  <img alt="phasema" src="./assets/banner.gif" width="100%">
  <h1 align="center">phasema</h1>
</p>

![Node.js](https://img.shields.io/badge/node-%3E%3D22-brightgreen)
![TypeScript](https://img.shields.io/badge/typescript-6.0-blue)
![License](https://img.shields.io/badge/license-BSD--3--Clause-purple)

Generative image and animated banner engine for Node.js.

## Examples

```bash
# Generate 10 static PNG compositions
npx tsx src/cli.ts generate

# Generate an animated banner GIF at 60 fps
npx tsx src/cli.ts banner --fps 60 --duration 3

# Custom banner at 120 fps with 8 workers
npx tsx src/cli.ts banner --fps 120 --duration 3 --workers 8 --sample 15

# Show all commands and flags
npx tsx src/cli.ts help
```

```ts
import { generatePixelLayer, compose, generateFramesParallel, registerAllFonts } from "phasema";

const canvas = generatePixelLayer(512, 512, 0.1, Date.now());
const frames = await generateFramesParallel(recipe);
```

## Installation

You can install this package using a package manager like [npm](https://docs.npmjs.com/cli/v11/commands/npm-install), [yarn](https://yarnpkg.com/cli/add), [pnpm](https://pnpm.io/cli/add), or [bun](https://bun.com/docs/cli/add).

```bash
npm install phasema
yarn add phasema
pnpm add phasema
bun add phasema
```

## Features

- Procedural pixel layers with deterministic randomness
- Animated GIF banners with per-letter variable typography
- Parallel frame rendering via worker threads (piscina)
- High-performance native GIF encoding (Rust N-API)
- Optional Pexels integration with procedural fallback
- Reproducible output through seed-based randomness

## CLI flags

| Flag              | Default   | Description                               |
| ----------------- | --------- | ----------------------------------------- |
| `--fps <n>`       | `60`      | Frames per second (banner)                |
| `--duration <n>`  | `5`       | Duration in seconds (banner)              |
| `--workers <n>`   | `4`       | Worker threads (banner)                   |
| `--sample <n>`    | `20`      | GIF compression (1 = best, 30 = smallest) |
| `--width <n>`     | `1200`    | Canvas width (banner)                     |
| `--height <n>`    | `630`     | Canvas height (banner)                    |
| `--text <s>`      | `PHASEMA` | Text on the banner                        |
| `--count <n>`     | `10`      | Number of results (generate)              |
| `--size <n>`      | `512`     | Canvas size (generate)                    |
| `--no-background` | `false`   | Disable background (banner)               |

## Library usage

### Generate a procedural pixel layer

```ts
import { generatePixelLayer } from "phasema";
const canvas = generatePixelLayer(width, height, coverage, seed);
```

### Compose with stock or procedural imagery

```ts
import { compose } from "phasema";
const final = compose(canvas, images, seed);
```

### Render banner frames in parallel

```ts
import { registerAllFonts, generateFramesParallel } from "phasema";
registerAllFonts();
const frames = await generateFramesParallel(recipe);
```

## Architecture

```
src/
  banner/        animated banner pipeline
  composition/   layer composition with blend modes
  core/          shared types, defaults, logger
  pixels/        procedural pixel layer generator
  stock/         stock and procedural image sources
  utils/         deterministic random utilities
  cli.ts         command-line interface
```

## Performance

| Workload                      | v0.1  | v0.3   |
| ----------------------------- | ----- | ------ |
| 180 frames at 60 fps (render) | 4 min | 4.1 s  |
| GIF size (3 s, 900x472)       | 22 MB | 6.3 MB |

## Requirements

- Node.js >= 22
- TypeScript 6+

## Related

- [@napi-rs/canvas](https://github.com/Brooooooklyn/canvas) - Native canvas for Node.js
- [sharp](https://github.com/lovell/sharp) - High-performance image processing
- [piscina](https://github.com/piscinajs/piscina) - Worker thread pool
- [@gomander/napi-gif-encoder](https://github.com/gomander/napi-gif-encoder) - Native GIF encoder

## Caught a Bug?

1. [Fork](https://help.github.com/articles/fork-a-repo/) this repository to your own GitHub account and then [clone](https://help.github.com/articles/cloning-a-repository/) it to your local device
2. Install the dependencies: `npm install`
3. Run the test suite: `npm test`
4. Open a pull request with a clear description of the change

## License

BSD-3-Clause. See [LICENSE](./LICENSE) for details.
