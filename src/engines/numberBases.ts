import type { CategoryDefinition } from './types';

export const numberBasesCategory: CategoryDefinition = {
  id: 'number_bases',
  name: 'Number Bases & Bits',
  icon: 'binary',
  description: 'Convert Decimal, Binary, Hexadecimal, Octal, and custom radixes (Base 2-36).',
  defaultFromUnit: 'dec',
  defaultToUnit: 'bin',
  defaultInputValue: '255',
  hasVisualizer: true,
  visualizerType: 'bitboard',
  units: [
    { id: 'dec', name: 'Decimal (Base 10)', symbol: 'Dec (10)', category: 'number_bases' },
    { id: 'bin', name: 'Binary (Base 2)', symbol: 'Bin (2)', category: 'number_bases' },
    { id: 'hex', name: 'Hexadecimal (Base 16)', symbol: 'Hex (16)', category: 'number_bases' },
    { id: 'oct', name: 'Octal (Base 8)', symbol: 'Oct (8)', category: 'number_bases' },
    { id: 'base32', name: 'Base32', symbol: 'Base32', category: 'number_bases' },
    { id: 'base36', name: 'Base36', symbol: 'Base36', category: 'number_bases' }
  ]
};

export function getBaseRadix(unitId: string): number {
  switch (unitId) {
    case 'bin': return 2;
    case 'oct': return 8;
    case 'dec': return 10;
    case 'hex': return 16;
    case 'base32': return 32;
    case 'base36': return 36;
    default: return 10;
  }
}

export function convertBase(valStr: string, fromRadix: number, toRadix: number): string {
  const cleanVal = valStr.trim().replace(/^0b/i, '').replace(/^0x/i, '').replace(/^0o/i, '');
  if (!cleanVal) return '0';

  // Handle BigInt for arbitrary length precision
  try {
    // Parse to BigInt if possible
    let bigIntVal: bigint;
    if (fromRadix === 10) {
      bigIntVal = BigInt(cleanVal);
    } else if (fromRadix === 16) {
      bigIntVal = BigInt('0x' + cleanVal);
    } else if (fromRadix === 2) {
      bigIntVal = BigInt('0b' + cleanVal);
    } else if (fromRadix === 8) {
      bigIntVal = BigInt('0o' + cleanVal);
    } else {
      // General radix parse
      bigIntVal = parseRadixToBigInt(cleanVal, fromRadix);
    }

    return bigIntVal.toString(toRadix).toUpperCase();
  } catch {
    return 'Invalid Input for Radix ' + fromRadix;
  }
}

function parseRadixToBigInt(str: string, radix: number): bigint {
  const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const clean = str.toUpperCase();
  let result = 0n;
  const bigRadix = BigInt(radix);

  for (let i = 0; i < clean.length; i++) {
    const char = clean[i];
    const val = ALPHABET.indexOf(char);
    if (val === -1 || val >= radix) {
      throw new Error(`Invalid character ${char} for radix ${radix}`);
    }
    result = result * bigRadix + BigInt(val);
  }

  return result;
}
