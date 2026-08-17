import type { CategoryDefinition } from './types';

export function intToRoman(num: number): string {
  if (num <= 0 || num >= 4000) return 'Out of bounds (1 - 3999)';
  const val = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const syms = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
  let roman = '';
  let n = num;
  for (let i = 0; i < val.length; i++) {
    while (n >= val[i]) {
      roman += syms[i];
      n -= val[i];
    }
  }
  return roman;
}

export function romanToInt(romanStr: string): number {
  const str = romanStr.trim().toUpperCase();
  const map: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let result = 0;
  for (let i = 0; i < str.length; i++) {
    const current = map[str[i]];
    const next = map[str[i + 1]];
    if (!current) return 0;
    if (next && current < next) {
      result -= current;
    } else {
      result += current;
    }
  }
  return result;
}

export function charToUnicodeDetails(str: string): { char: string; dec: number; hex: string; bin: string; htmlEntity: string } {
  if (!str) str = 'A';
  const firstChar = str.charAt(0);
  const code = firstChar.charCodeAt(0);
  return {
    char: firstChar,
    dec: code,
    hex: 'U+' + code.toString(16).toUpperCase().padStart(4, '0'),
    bin: code.toString(2).padStart(8, '0'),
    htmlEntity: `&#${code};`
  };
}

export const romanUnicodeCategory: CategoryDefinition = {
  id: 'roman_unicode',
  name: 'Roman Numerals & Unicode',
  icon: 'code',
  description: 'Convert between Roman Numerals, Decimals, and Unicode/ASCII Character Code Points.',
  defaultFromUnit: 'roman',
  defaultToUnit: 'int_num',
  defaultInputValue: 'MMXXIV',
  units: [
    { id: 'roman', name: 'Roman Numerals', symbol: 'Roman', category: 'roman_unicode' },
    { id: 'int_num', name: 'Decimal Integer', symbol: 'Int', category: 'roman_unicode' },
    { id: 'char', name: 'Character / Symbol', symbol: 'Char', category: 'roman_unicode' },
    { id: 'unicode_hex', name: 'Unicode Hex (U+XXXX)', symbol: 'Hex Code', category: 'roman_unicode' }
  ]
};
