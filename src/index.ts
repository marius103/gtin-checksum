/**
 * GS1 modulo-10 check-digit utilities for GTIN-8, GTIN-12 (UPC-A),
 * GTIN-13 (EAN-13), and GTIN-14 (ITF-14).
 *
 * Algorithm (per GS1 General Specifications §7.9):
 *
 *   Starting at the rightmost data digit (position N-2, where N includes
 *   the check digit), multiply by 3. Move left, alternating weights 1
 *   and 3. Sum the products. The check digit is the value that, when
 *   added to the sum, produces a multiple of 10 — equivalently:
 *
 *       checkDigit = (10 - (sum mod 10)) mod 10
 *
 * Public reference: https://www.gs1.org/services/how-calculate-check-digit-manually
 *
 * This implementation has zero runtime dependencies and treats all input
 * strictly — non-digit characters and incorrect lengths throw early.
 */

/** Valid GTIN total lengths (including the check digit). */
export const GTIN_LENGTHS = [8, 12, 13, 14] as const;
export type GtinLength = (typeof GTIN_LENGTHS)[number];

/**
 * Compute the GS1 modulo-10 check digit for a string of data digits
 * (i.e. the GTIN WITHOUT the trailing check digit).
 *
 * The data length must be 7, 11, 12, or 13 — producing a GTIN-8,
 * GTIN-12, GTIN-13, or GTIN-14 respectively. Any other length throws.
 *
 * @param dataDigits  GTIN without the trailing check digit.
 * @returns The check digit as a single integer 0-9.
 * @throws RangeError if the input contains non-digits or has an
 *   unsupported length.
 *
 * @example
 *   computeCheckDigit('400638133393'); // 1  → full GTIN-13: 4006381333931
 *   computeCheckDigit('03600029145');  // 2  → full GTIN-12: 036000291452
 */
export function computeCheckDigit(dataDigits: string): number {
  if (typeof dataDigits !== 'string') {
    throw new TypeError('dataDigits must be a string');
  }
  if (!/^\d+$/.test(dataDigits)) {
    throw new RangeError(
      `dataDigits must contain only ASCII digits 0-9 (got: ${JSON.stringify(dataDigits)})`,
    );
  }
  const validDataLengths = GTIN_LENGTHS.map((n) => n - 1);
  if (!validDataLengths.includes(dataDigits.length)) {
    throw new RangeError(
      `dataDigits length must be one of ${validDataLengths.join(', ')} ` +
        `(for GTIN-${GTIN_LENGTHS.join('/')}); got ${dataDigits.length}`,
    );
  }
  // Walk right-to-left. Rightmost data digit gets weight 3, next 1,
  // then 3, then 1, etc.
  let sum = 0;
  for (let i = 0; i < dataDigits.length; i++) {
    const digit = dataDigits.charCodeAt(dataDigits.length - 1 - i) - 48;
    const weight = i % 2 === 0 ? 3 : 1;
    sum += digit * weight;
  }
  return (10 - (sum % 10)) % 10;
}

/**
 * Validate a full GTIN by checking its embedded check digit against
 * the GS1 modulo-10 algorithm.
 *
 * @param gtin  Full GTIN string (8, 12, 13, or 14 digits).
 * @returns true iff the string is a syntactically valid GTIN with a
 *   matching check digit. Returns false for any malformed input — does
 *   not throw.
 *
 * @example
 *   isValidGtin('4006381333931'); // true
 *   isValidGtin('4006381333932'); // false (wrong check digit)
 *   isValidGtin('not-a-number');  // false
 */
export function isValidGtin(gtin: string): boolean {
  if (typeof gtin !== 'string') return false;
  if (!/^\d+$/.test(gtin)) return false;
  if (!(GTIN_LENGTHS as readonly number[]).includes(gtin.length)) return false;
  const data = gtin.slice(0, -1);
  const expected = computeCheckDigit(data);
  const actual = gtin.charCodeAt(gtin.length - 1) - 48;
  return expected === actual;
}

/**
 * Append the correct check digit to a string of data digits, returning
 * the full GTIN. Convenience wrapper around `computeCheckDigit`.
 *
 * @param dataDigits  GTIN without the trailing check digit.
 * @returns Full GTIN string (one digit longer than the input).
 *
 * @example
 *   appendCheckDigit('400638133393'); // '4006381333931'
 */
export function appendCheckDigit(dataDigits: string): string {
  return `${dataDigits}${computeCheckDigit(dataDigits)}`;
}

/**
 * Infer the GTIN variant from a full GTIN's length. Returns null if the
 * length is not a valid GTIN length.
 */
export function gtinVariant(gtin: string): GtinLength | null {
  const n = gtin.length;
  return (GTIN_LENGTHS as readonly number[]).includes(n)
    ? (n as GtinLength)
    : null;
}
