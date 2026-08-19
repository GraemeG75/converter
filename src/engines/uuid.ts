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

  const part1 = timeHex.slice(0, 8);  // 8 hex digits
  const part2 = timeHex.slice(8, 12); // 4 hex digits

  let randA: string;
  let randB1: string;
  let randB2: string;

  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = new Uint8Array(10);
    crypto.getRandomValues(bytes);

    // 12 bits for rand_a (3 hex digits)
    const valA = ((bytes[0] << 8) | bytes[1]) & 0x0fff;
    randA = valA.toString(16).padStart(3, '0');

    // Variant 10xx (0x8..0xB) + 3 hex chars from 12 bits
    const varNibble = (8 + (bytes[2] >> 6)).toString(16);
    const randB1Rest = (((bytes[2] & 0x0f) << 8) | bytes[3]).toString(16).padStart(3, '0');
    randB1 = varNibble + randB1Rest; // EXACTLY 4 hex digits

    // 12 hex digits for part5 from 6 bytes (bytes[4..9])
    randB2 = Array.from(bytes.slice(4, 10)).map(b => b.toString(16).padStart(2, '0')).join(''); // EXACTLY 12 hex digits
  } else {
    // Fallback Math.random
    randA = Math.floor(Math.random() * 4096).toString(16).padStart(3, '0');
    const varNibble = (8 + Math.floor(Math.random() * 4)).toString(16);
    const randB1Rest = Math.floor(Math.random() * 4096).toString(16).padStart(3, '0');
    randB1 = varNibble + randB1Rest; // EXACTLY 4 hex digits

    randB2 = '';
    for (let i = 0; i < 12; i++) {
      randB2 += Math.floor(Math.random() * 16).toString(16);
    }
  }

  const part3 = '7' + randA; // EXACTLY 4 hex digits
  const part4 = randB1;       // EXACTLY 4 hex digits
  const part5 = randB2;       // EXACTLY 12 hex digits

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
