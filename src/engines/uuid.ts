import type { CategoryDefinition } from './types';

export function generateUUIDv4(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback random v4
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function generateUUIDv7(timestampMs?: number): string {
  const now = timestampMs ?? Date.now();

  // 48-bit timestamp in hex (12 hex digits)
  const timeHex = now.toString(16).padStart(12, '0');

  // Random 12 bits for rand_a with ver 7 (0x7xxx)
  const randA = Math.floor(Math.random() * 4096).toString(16).padStart(3, '0');

  // Random bits for rand_b with variant 10xx (0x8xxx, 0x9xxx, 0xaxxx, 0xbxxx)
  const variant = (8 + Math.floor(Math.random() * 4)).toString(16);
  const randB = Math.floor(Math.random() * 0x0fff_ffff_ffff)
    .toString(16)
    .padStart(11, '0');

  const part1 = timeHex.slice(0, 8);
  const part2 = timeHex.slice(8, 12);
  const part3 = '7' + randA;
  const part4 = variant + randB.slice(0, 3);
  const part5 = randB.slice(3, 11);

  return `${part1}-${part2}-${part3}-${part4}-${part5}`;
}

export const NIL_GUID = '00000000-0000-0000-0000-000000000000';

export interface UUIDParsed {
  raw: string;
  normalized: string;
  version: string;
  variant: string;
  timestamp?: string;
  uppercase: string;
  noHyphens: string;
  braces: string;
}

export function parseAndFormatUUID(input: string): UUIDParsed {
  const clean = input.trim().replace(/[{}]/g, '').toLowerCase();
  const validHex = clean.replace(/-/g, '');

  if (validHex.length !== 32 || !/^[0-9a-f]{32}$/.test(validHex)) {
    return {
      raw: input,
      normalized: NIL_GUID,
      version: 'Invalid GUID Format',
      variant: 'N/A',
      uppercase: NIL_GUID.toUpperCase(),
      noHyphens: '00000000000000000000000000000000',
      braces: `{${NIL_GUID}}`
    };
  }

  const formatted = `${validHex.slice(0, 8)}-${validHex.slice(8, 12)}-${validHex.slice(12, 16)}-${validHex.slice(16, 20)}-${validHex.slice(20)}`;

  let ver = 'Unknown Version';
  const verDigit = formatted.charAt(14);
  if (formatted === NIL_GUID) {
    ver = 'Nil / Empty GUID';
  } else if (verDigit === '4') {
    ver = 'Version 4 (Random)';
  } else if (verDigit === '7') {
    ver = 'Version 7 (Time-Ordered)';
  } else if (verDigit === '1') {
    ver = 'Version 1 (Time & MAC)';
  } else {
    ver = `Version ${verDigit}`;
  }

  let tsStr: string | undefined;
  if (verDigit === '7') {
    const timeHex = validHex.slice(0, 12);
    const ms = parseInt(timeHex, 16);
    if (!isNaN(ms)) {
      tsStr = new Date(ms).toISOString();
    }
  }

  return {
    raw: input,
    normalized: formatted,
    version: ver,
    variant: 'RFC 4122 / IETF',
    timestamp: tsStr,
    uppercase: formatted.toUpperCase(),
    noHyphens: validHex,
    braces: `{${formatted}}`
  };
}

export const uuidCategory: CategoryDefinition = {
  id: 'uuid_guid',
  name: 'UUID & GUID Generator',
  icon: 'key',
  description: 'Generate UUID v4, v7 (time-ordered), and Nil/Empty GUIDs, plus parse and reformat identifiers.',
  defaultFromUnit: 'uuid_v4',
  defaultToUnit: 'uuid_v7',
  defaultInputValue: generateUUIDv4(),
  hasVisualizer: true,
  visualizerType: 'none',
  units: [
    { id: 'uuid_v4', name: 'UUID Version 4 (Random)', symbol: 'v4', category: 'uuid_guid' },
    { id: 'uuid_v7', name: 'UUID Version 7 (Time-Ordered)', symbol: 'v7', category: 'uuid_guid' },
    { id: 'uuid_nil', name: 'Nil / Empty GUID', symbol: 'Nil', category: 'uuid_guid' },
    { id: 'uuid_nohyphens', name: 'No-Hyphens (32-hex)', symbol: '32-hex', category: 'uuid_guid' },
    { id: 'uuid_braces', name: 'Braced GUID {UUID}', symbol: '{GUID}', category: 'uuid_guid' }
  ]
};
