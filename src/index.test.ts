/**
 * Tests against published GS1 / Wikipedia / vendor test vectors.
 *
 * Each test vector is sourced from a public reference (linked beside
 * the entry). Verified manually by stepping through the GS1 modulo-10
 * algorithm before being added to this list.
 */
import { describe, it, expect } from 'vitest';
import {
  computeCheckDigit,
  isValidGtin,
  appendCheckDigit,
  gtinVariant,
  GTIN_LENGTHS,
} from './index';

// ─── Test vectors (full GTIN; last digit is the expected check digit) ───
const TEST_VECTORS = [
  // GTIN-8 / EAN-8
  { gtin: '73513537', source: 'Wikipedia EAN-8 worked example' },
  { gtin: '95050003', source: 'GS1 sample GTIN-8' },

  // GTIN-12 / UPC-A
  { gtin: '036000291452', source: 'Wikipedia UPC-A worked example' },
  { gtin: '036000241457', source: 'Public UPC-A example (tissue box)' },

  // GTIN-13 / EAN-13
  { gtin: '4006381333931', source: 'Wikipedia EAN-13 worked example' },
  { gtin: '9780201379624', source: 'ISBN-13 valid check digit' },

  // GTIN-14 / ITF-14
  { gtin: '00012345678905', source: 'GS1 ITF-14 reference vector' },
];

describe('computeCheckDigit — GS1 modulo-10', () => {
  it.each(TEST_VECTORS)(
    'matches expected check digit for $gtin ($source)',
    ({ gtin }) => {
      const data = gtin.slice(0, -1);
      const expected = Number(gtin.slice(-1));
      expect(computeCheckDigit(data)).toBe(expected);
    },
  );

  it('throws on non-digit input', () => {
    expect(() => computeCheckDigit('abc12345')).toThrow(RangeError);
    expect(() => computeCheckDigit('12 34567')).toThrow(RangeError);
    expect(() => computeCheckDigit('')).toThrow(RangeError);
  });

  it('throws on unsupported data length', () => {
    // 6 digits → would imply GTIN-7, not valid
    expect(() => computeCheckDigit('123456')).toThrow(RangeError);
    // 14 digits → would imply GTIN-15, not valid
    expect(() => computeCheckDigit('12345678901234')).toThrow(RangeError);
  });

  it('throws TypeError on non-string input', () => {
    // @ts-expect-error testing runtime guard
    expect(() => computeCheckDigit(123456)).toThrow(TypeError);
    // @ts-expect-error testing runtime guard
    expect(() => computeCheckDigit(null)).toThrow(TypeError);
  });
});

describe('isValidGtin — accepts only well-formed GTINs', () => {
  it.each(TEST_VECTORS)('accepts $gtin', ({ gtin }) => {
    expect(isValidGtin(gtin)).toBe(true);
  });

  it('rejects GTINs with the wrong check digit', () => {
    // Flip the last digit on every vector
    for (const { gtin } of TEST_VECTORS) {
      const wrongLast = (Number(gtin.slice(-1)) + 1) % 10;
      const tampered = gtin.slice(0, -1) + wrongLast.toString();
      expect(isValidGtin(tampered)).toBe(false);
    }
  });

  it('rejects empty / non-string / wrong-length input', () => {
    expect(isValidGtin('')).toBe(false);
    expect(isValidGtin('1234567')).toBe(false); // 7 digits
    expect(isValidGtin('12345678901')).toBe(false); // 11 digits
    expect(isValidGtin('not-a-number')).toBe(false);
    // @ts-expect-error testing runtime guard
    expect(isValidGtin(undefined)).toBe(false);
    // @ts-expect-error testing runtime guard
    expect(isValidGtin(4006381333931)).toBe(false);
  });

  it('rejects digits-only strings whose length is not a GTIN length', () => {
    expect(isValidGtin('123')).toBe(false); // 3 digits
    expect(isValidGtin('123456789')).toBe(false); // 9 digits
    expect(isValidGtin('1234567890123456')).toBe(false); // 16 digits
  });
});

describe('appendCheckDigit', () => {
  it.each(TEST_VECTORS)('reconstructs $gtin from its data part', ({ gtin }) => {
    expect(appendCheckDigit(gtin.slice(0, -1))).toBe(gtin);
  });
});

describe('gtinVariant', () => {
  it.each(TEST_VECTORS)(
    '$gtin → variant length',
    ({ gtin }) => {
      expect(gtinVariant(gtin)).toBe(gtin.length);
    },
  );

  it('returns null for unsupported lengths', () => {
    expect(gtinVariant('123')).toBe(null);
    expect(gtinVariant('1234567890')).toBe(null);
  });
});

describe('GTIN_LENGTHS constant', () => {
  it('lists the four canonical GTIN lengths', () => {
    expect([...GTIN_LENGTHS]).toEqual([8, 12, 13, 14]);
  });
});
