# gtin-checksum

[![npm version](https://img.shields.io/npm/v/gtin-checksum.svg)](https://www.npmjs.com/package/gtin-checksum)
[![license](https://img.shields.io/npm/l/gtin-checksum.svg)](./LICENSE)
[![types](https://img.shields.io/npm/types/gtin-checksum.svg)](./src/index.ts)
[![bundle size](https://img.shields.io/bundlephobia/minzip/gtin-checksum)](https://bundlephobia.com/package/gtin-checksum)

> GS1 modulo-10 check-digit calculator and validator for **GTIN-8**, **GTIN-12 (UPC-A)**, **GTIN-13 (EAN-13)**, and **GTIN-14 (ITF-14)**. Zero runtime dependencies, TypeScript-native, ESM-only, tested against public GS1 / Wikipedia test vectors.

A correctly computed GTIN check digit is the difference between a product feed that lands in Google Merchant Center and one that gets rejected for "Invalid GTIN". This module exists because the algorithm is one short page in the [GS1 General Specifications](https://www.gs1.org/services/how-calculate-check-digit-manually) — but every e-commerce stack ends up re-implementing it, usually with a subtle bug at the weight-alternation step.

## Install

```sh
npm install gtin-checksum
```

Node 18+ · ESM-only · `~1 KB` minified.

## Usage

```ts
import {
  computeCheckDigit,
  isValidGtin,
  appendCheckDigit,
  gtinVariant,
} from 'gtin-checksum';

computeCheckDigit('400638133393');   // 1
appendCheckDigit('400638133393');    // '4006381333931'

isValidGtin('4006381333931');        // true   (GTIN-13)
isValidGtin('036000291452');         // true   (GTIN-12 / UPC-A)
isValidGtin('73513537');             // true   (GTIN-8)
isValidGtin('00012345678905');       // true   (GTIN-14 / ITF-14)
isValidGtin('4006381333932');        // false  (wrong check digit)
isValidGtin('not-a-number');         // false  (no throw — returns false)

gtinVariant('4006381333931');        // 13
gtinVariant('not-a-number');         // null
```

## API

### `computeCheckDigit(dataDigits: string): number`

Returns the GS1 modulo-10 check digit (0-9) for the given **data digits** — i.e. the GTIN **without** its trailing check digit. Throws `RangeError` on non-digit input or a length that is not one of 7, 11, 12, 13 (corresponding to GTIN-8/12/13/14).

### `isValidGtin(gtin: string): boolean`

Returns `true` iff the input is a string of all digits whose length is 8, 12, 13, or 14, and whose trailing digit matches the computed check digit. **Never throws** — returns `false` for any malformed input.

### `appendCheckDigit(dataDigits: string): string`

Convenience wrapper. Returns the full GTIN by appending the computed check digit to the input.

### `gtinVariant(gtin: string): 8 | 12 | 13 | 14 | null`

Returns the GTIN length if it matches one of the four canonical variants; `null` otherwise. Does **not** verify the check digit — use `isValidGtin` for that.

### `GTIN_LENGTHS`

Readonly tuple `[8, 12, 13, 14]` — the four canonical GTIN lengths.

## Algorithm

Per [GS1 General Specifications §7.9](https://www.gs1.org/services/how-calculate-check-digit-manually):

1. Starting at the **rightmost data digit** (i.e. the digit immediately to the left of the check digit position), multiply by **3**.
2. Move left, alternating weights **1** and **3**.
3. Sum the products.
4. The check digit is `(10 - sum mod 10) mod 10` — i.e. the smallest non-negative value that makes the total a multiple of 10.

### Worked example (GTIN-13: `4006381333931`)

| Position (from left) | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Digit | 4 | 0 | 0 | 6 | 3 | 8 | 1 | 3 | 3 | 3 | 9 | 3 | **1** (check) |
| Weight | 1 | 3 | 1 | 3 | 1 | 3 | 1 | 3 | 1 | 3 | 1 | 3 | — |
| Product | 4 | 0 | 0 | 18 | 3 | 24 | 1 | 9 | 3 | 9 | 9 | 9 | — |

Sum = 89 · `(10 − 89 mod 10) mod 10 = (10 − 9) mod 10 = 1` · check digit matches.

## Why a separate package

Most e-commerce projects pull a 50 KB barcode library that drags in symbology renderers, image generators, and `canvas` peer-dependencies — just to validate a check digit. This module is the opposite: 4 exported functions, zero dependencies, types-first, and an explicit test suite against named public vectors so you can audit correctness without trusting opaque vendor code.

Built and maintained by [Marius Pahomi](https://www.feedarc.com/author/marius) at [FeedArc](https://www.feedarc.com) — where verifying GTINs at scale is a daily concern.

## Development

```sh
npm install
npm test         # vitest, all test vectors
npm run build    # emits dist/ with d.ts + sourcemaps
```

## Contributing

Bug reports and additional test vectors (especially edge cases — pseudo-GTINs, embedded weight/price codes, restricted ranges) are welcome via [GitHub Issues](https://github.com/marius103/gtin-checksum/issues).

## License

[MIT](./LICENSE) © Marius Pahomi
