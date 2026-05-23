# Changelog

All notable changes to `gtin-checksum` are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- GitHub Actions CI workflow running `typecheck` → `vitest` → `build` across Node 18.x / 20.x / 22.x on every push and pull request to `main`.
- Dependabot configuration for weekly npm + GitHub Actions dependency updates (Monday 06:00 Europe/Bucharest), grouping minor + patch updates to reduce noise.
- `CHANGELOG.md` (this file) following Keep a Changelog 1.1.0.

## [1.0.0] — 2026-05-22

### Added
- Initial public release.
- `computeCheckDigit(dataDigits: string): number` — GS1 modulo-10 check-digit calculator. Accepts data lengths 7 / 11 / 12 / 13 (producing GTIN-8 / GTIN-12 / GTIN-13 / GTIN-14). Throws `RangeError` on non-digit input or unsupported length, `TypeError` on non-string input.
- `isValidGtin(gtin: string): boolean` — non-throwing GTIN validator. Returns `true` only for well-formed digit-only strings of length 8 / 12 / 13 / 14 whose trailing digit matches the computed check digit. Returns `false` for any malformed input.
- `appendCheckDigit(dataDigits: string): string` — convenience wrapper; returns full GTIN with appended check digit.
- `gtinVariant(gtin: string): 8 | 12 | 13 | 14 | null` — variant inference by length.
- `GTIN_LENGTHS` — readonly tuple `[8, 12, 13, 14]`.
- 36 vitest unit tests against public GS1 / Wikipedia / vendor test vectors (GTIN-8: 73513537, 95050003; GTIN-12: 036000291452, 036000241457; GTIN-13: 4006381333931, 9780201379624; GTIN-14: 00012345678905).
- ESM-only build with TypeScript declarations + sourcemaps; published under MIT license.

### Notes
- Zero runtime dependencies. ~1 KB minified.
- Node 18+. ESM-only (no CommonJS build).
- Built and maintained by [Marius Pahomi](https://www.feedarc.com/author/marius) at [FeedArc](https://www.feedarc.com).

[Unreleased]: https://github.com/marius103/gtin-checksum/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/marius103/gtin-checksum/releases/tag/v1.0.0
