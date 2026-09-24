# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2026-09-24

### Added

- Parallel frame rendering via Piscina worker threads
- Native GIF encoding with `@gomander/napi-gif-encoder` (Rust N-API)
- Per-letter variable typography with per-frame font rotation
- Animated background composition synced with text animation
- CLI with purple gradient output via `ansimax`
- Structured logging with `tslog` and typed tags (`[SUCCESS]`, `[ERROR]`, etc.)
- ESLint 9 flat config with `typescript-eslint` type-checked rules
- Prettier integration for consistent formatting

### Changed

- TypeScript downgraded to 6.0.2 (via npm alias) for tooling compatibility
- Worker frames now return raw RGBA instead of PNG to eliminate encode/decode overhead
- Background pool cached per worker instead of rebuilt per frame
- Pixel generator supports configurable block size
- Default canvas reduced to 900×472 for faster rendering

### Removed

- `@types/piscina` (piscina ships its own types)
- Redundant `composer.ts` (replaced by `parallel-composer.ts`)

## [0.1.0] - 2026-09-24

### Added

- Initial project scaffold with TypeScript 7, ESM, and strict mode
- Procedural pixel layer generator with seeded randomness
- Stock image pipeline (Pexels API + procedural fallback)
- Image composition with blend modes
- Animated GIF banner with variable typography
- CLI with `generate` and `banner` commands
- Vitest test suite
