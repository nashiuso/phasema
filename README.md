<p align="center">
  <img src="assets/banner.gif" alt="phasema" width="720">
</p>

<h1 align="center">phasema</h1>

<p align="center">
  Generative image and animated banner engine for Node.js.
</p>

<p align="center">
  <a href="https://nodejs.org"><img src="https://img.shields.io/badge/node-%3E%3D22-brightgreen" alt="Node.js"></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/typescript-6.0-blue" alt="TypeScript"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-BSD--3--Clause-purple" alt="License"></a>
</p>

---

Generative image and animated banner engine for Node.js.

## Features

- Procedural pixel layers with deterministic randomness
- Animated GIF banners with per-letter variable typography
- Parallel frame rendering via worker threads (piscina)
- High-performance native GIF encoding
- Structured logging with colored CLI output
- Optional Pexels integration with procedural fallback
- Reproducible output through seed-based randomness

## Requirements

- Node.js >= 22
- TypeScript 7+

## Showcase

![phasema CLI demo](assets/screenshots/terminal-demo.gif)

## Install

```
npm install
```

## Usage

Generate 10 static compositions:

```
npm run generate
```

Generate an animated banner GIF at 60 fps:

```
npm run generate:banner
```

Custom banner at 120 fps with 8 workers:

```
npx tsx src/cli.ts banner --fps 120 --duration 3 --workers 8
```

Show help:

```
npx tsx src/cli.ts help
```

## CLI Flags

| Flag               | Default | Description                    |
| ------------------ | ------- | ------------------------------ |
| --fps <n>          | 60      | Frames per second (banner)     |
| --duration <n>     | 5       | Duration in seconds (banner)   |
| --workers <n>      | 4       | Worker threads (banner)        |
| --count <n>        | 10      | Number of results (generate)   |
| --size <n>         | 512     | Canvas size (generate)         |
| --no-background    | false   | Disable background composition |
| --background-count | 6       | Number of background images    |

## Library usage

```ts
import { generatePixelLayer, compose, generateFramesParallel, registerAllFonts } from "phasema";
```

## Architecture

```
src/
  banner/        animated banner pipeline
    worker.ts             per-frame worker
    parallel-composer.ts  piscina orchestration
    gif-encoder.ts        native GIF encoding
  composition/   layer composition
  core/          shared types, defaults, logger, CLI theme
  pixels/        procedural pixel layer generator
  stock/         stock and procedural image sources
  utils/         deterministic random utilities
  cli.ts         command-line interface
```

## License

ISC
