import type { CategoryDefinition } from './types';

export const hashEncodingCategory: CategoryDefinition = {
  id: 'hash_encoding',
  name: 'Hash & Encoding',
  icon: 'key',
  description: 'Convert between Plaintext, Base64, Hex, URL Encoding, HTML Entities, JWT Tokens, and SHA-256 / MD5 Hashes.',
  defaultFromUnit: 'plain',
  defaultToUnit: 'base64',
  defaultInputValue: 'Hello World!',
  hasVisualizer: true,
  visualizerType: 'jwt',
  units: [
    { id: 'plain', name: 'Plaintext (UTF-8)', symbol: 'Text', category: 'hash_encoding' },
    { id: 'base64', name: 'Base64', symbol: 'B64', category: 'hash_encoding' },
    { id: 'base64url', name: 'Base64URL', symbol: 'B64URL', category: 'hash_encoding' },
    { id: 'hex', name: 'Hexadecimal Bytes', symbol: 'Hex', category: 'hash_encoding' },
    { id: 'url_encode', name: 'URL Encoded', symbol: 'URL', category: 'hash_encoding' },
    { id: 'html_entities', name: 'HTML Entities', symbol: 'HTML', category: 'hash_encoding' },
    { id: 'binary_bytes', name: 'Binary Bytes', symbol: 'Bin', category: 'hash_encoding' },
    { id: 'jwt_decode', name: 'JWT Decoder', symbol: 'JWT', category: 'hash_encoding' },
    { id: 'sha256', name: 'SHA-256 Digest', symbol: 'SHA256', category: 'hash_encoding' },
    { id: 'md5', name: 'MD5 Digest', symbol: 'MD5', category: 'hash_encoding' }
  ]
};

// Convert input string from `fromUnitId` to raw UTF-8 plaintext bytes/string
export function decodeToPlaintext(input: string, fromUnitId: string): string {
  if (!input) return '';

  try {
    switch (fromUnitId) {
      case 'base64':
        return window.atob(input.trim());
      case 'base64url': {
        let b64 = input.trim().replace(/-/g, '+').replace(/_/g, '/');
        while (b64.length % 4 !== 0) b64 += '=';
        return window.atob(b64);
      }
      case 'hex': {
        const cleanHex = input.replace(/^0x/i, '').replace(/\s+/g, '');
        let str = '';
        for (let i = 0; i < cleanHex.length; i += 2) {
          str += String.fromCharCode(parseInt(cleanHex.substring(i, i + 2), 16));
        }
        return str;
      }
      case 'url_encode':
        return decodeURIComponent(input);
      case 'html_entities': {
        const doc = new DOMParser().parseFromString(input, 'text/html');
        return doc.documentElement.textContent || input;
      }
      case 'binary_bytes': {
        const cleanBin = input.trim().split(/\s+/);
        return cleanBin.map(b => String.fromCharCode(parseInt(b, 2))).join('');
      }
      case 'jwt_decode': {
        const parts = input.trim().split('.');
        if (parts.length >= 2) {
          return decodeToPlaintext(parts[1], 'base64url');
        }
        return input;
      }
      default:
        return input;
    }
  } catch {
    return input;
  }
}

// Convert raw UTF-8 plaintext string to target format
export function encodeFromPlaintext(plain: string, toUnitId: string): string {
  if (!plain && toUnitId !== 'jwt_decode') return '';

  try {
    switch (toUnitId) {
      case 'plain':
        return plain;
      case 'base64':
        return window.btoa(unescape(encodeURIComponent(plain)));
      case 'base64url': {
        const b64 = window.btoa(unescape(encodeURIComponent(plain)));
        return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      }
      case 'hex': {
        const encoder = new TextEncoder();
        const bytes = encoder.encode(plain);
        return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
      }
      case 'url_encode':
        return encodeURIComponent(plain);
      case 'html_entities':
        return plain.replace(/[\u00A0-\u9999<>&"']/g, (i) => '&#' + i.charCodeAt(0) + ';');
      case 'binary_bytes': {
        const encoder = new TextEncoder();
        const bytes = encoder.encode(plain);
        return Array.from(bytes).map(b => b.toString(2).padStart(8, '0')).join(' ');
      }
      case 'jwt_decode':
        return parseJwtToken(plain);
      case 'sha256':
        return computeSha256Sync(plain);
      case 'md5':
        return computeMd5Sync(plain);
      default:
        return plain;
    }
  } catch (err: any) {
    return `Error: ${err.message || 'Invalid Encoding'}`;
  }
}

export function parseJwtToken(input: string): string {
  const parts = input.trim().split('.');
  if (parts.length < 2) {
    return 'Invalid JWT Format (Expected: Header.Payload.Signature)';
  }

  try {
    const headerStr = decodeToPlaintext(parts[0], 'base64url');
    const payloadStr = decodeToPlaintext(parts[1], 'base64url');
    const headerObj = JSON.parse(headerStr);
    const payloadObj = JSON.parse(payloadStr);

    return JSON.stringify({ header: headerObj, payload: payloadObj }, null, 2);
  } catch {
    return 'Invalid JWT JSON Payload';
  }
}

// Synchronous lightweight SHA-256 implementation
function computeSha256Sync(str: string): string {
  function rightRotate(value: number, amount: number) {
    return (value >>> amount) | (value << (32 - amount));
  }

  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  const K: number[] = [];
  const H: number[] = [];

  let isPrime = (n: number) => {
    for (let factor = 2; factor * factor <= n; factor++) {
      if (n % factor === 0) return false;
    }
    return true;
  };

  let candidate = 2;
  while (K.length < 64) {
    if (isPrime(candidate)) {
      if (H.length < 8) H.push((mathPow(candidate, 1 / 2) * maxWord) | 0);
      K.push((mathPow(candidate, 1 / 3) * maxWord) | 0);
    }
    candidate++;
  }

  const encoder = new TextEncoder();
  const ascii = encoder.encode(str);
  const words: number[] = [];

  for (let i = 0; i < ascii.length * 8; i += 8) {
    words[i >> 5] |= ascii[i / 8] << (24 - (i % 32));
  }

  const bitLen = ascii.length * 8;
  words[bitLen >> 5] |= 0x80 << (24 - (bitLen % 32));
  words[(((bitLen + 64) >> 9) << 4) + 15] = bitLen;

  for (let i = 0; i < words.length; i += 16) {
    const w = words.slice(i, i + 16);
    const hash = H.slice(0);

    for (let j = 0; j < 64; j++) {
      if (j >= 16) {
        const gamma0 = rightRotate(w[j - 15], 7) ^ rightRotate(w[j - 15], 18) ^ (w[j - 15] >>> 3);
        const gamma1 = rightRotate(w[j - 2], 17) ^ rightRotate(w[j - 2], 19) ^ (w[j - 2] >>> 10);
        w[j] = (w[j - 16] + gamma0 + w[j - 7] + gamma1) | 0;
      }

      const s1 = rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25);
      const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
      const temp1 = (hash[7] + s1 + ch + K[j] + w[j]) | 0;
      const s0 = rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22);
      const maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
      const temp2 = (s0 + maj) | 0;

      hash[7] = hash[6];
      hash[6] = hash[5];
      hash[5] = hash[4];
      hash[4] = (hash[3] + temp1) | 0;
      hash[3] = hash[2];
      hash[2] = hash[1];
      hash[1] = hash[0];
      hash[0] = (temp1 + temp2) | 0;
    }

    for (let j = 0; j < 8; j++) {
      H[j] = (H[j] + hash[j]) | 0;
    }
  }

  return H.map(h => (h >>> 0).toString(16).padStart(8, '0')).join('');
}

// Synchronous lightweight MD5 implementation
function computeMd5Sync(string: string): string {
  function md5cycle(x: number[], k: number[]) {
    let a = x[0], b = x[1], c = x[2], d = x[3];

    a = ff(a, b, c, d, k[0], 7, -680876936);
    d = ff(d, a, b, c, k[1], 12, -389564586);
    c = ff(c, d, a, b, k[2], 17, 606105819);
    b = ff(b, c, d, a, k[3], 22, -1044525330);
    a = ff(a, b, c, d, k[4], 7, -176418897);
    d = ff(d, a, b, c, k[5], 12, 1200080426);
    c = ff(c, d, a, b, k[6], 17, -1473231341);
    b = ff(b, c, d, a, k[7], 22, -45705983);
    a = ff(a, b, c, d, k[8], 7, 1770035416);
    d = ff(d, a, b, c, k[9], 12, -1958414417);
    c = ff(c, d, a, b, k[10], 17, -42063);
    b = ff(b, c, d, a, k[11], 22, -1990404162);
    a = ff(a, b, c, d, k[12], 7, 1804603682);
    d = ff(d, a, b, c, k[13], 12, -40341101);
    c = ff(c, d, a, b, k[14], 17, -1502002290);
    b = ff(b, c, d, a, k[15], 22, 1236535329);

    a = gg(a, b, c, d, k[1], 5, -165796510);
    d = gg(d, a, b, c, k[6], 9, -1069501632);
    c = gg(c, d, a, b, k[11], 14, 643717713);
    b = gg(b, c, d, a, k[0], 20, -373897302);
    a = gg(a, b, c, d, k[5], 5, -701558691);
    d = gg(d, a, b, c, k[10], 9, 38016083);
    c = gg(c, d, a, b, k[15], 14, -660478335);
    b = gg(b, c, d, a, k[4], 20, -405537848);
    a = gg(a, b, c, d, k[9], 5, 568446438);
    d = gg(d, a, b, c, k[14], 9, -1019803690);
    c = gg(c, d, a, b, k[3], 14, -187363961);
    b = gg(b, c, d, a, k[8], 20, 1163531501);
    a = gg(a, b, c, d, k[13], 5, -144468057);
    d = gg(d, a, b, c, k[2], 9, -51403784);
    c = gg(c, d, a, b, k[7], 14, 1735328473);
    b = gg(b, c, d, a, k[12], 20, -1926607734);

    a = hh(a, b, c, d, k[5], 4, -378558);
    d = hh(d, a, b, c, k[8], 11, -2022574463);
    c = hh(c, d, a, b, k[13], 16, 1839030562);
    b = hh(b, c, d, a, k[2], 23, -35309556);
    a = hh(a, b, c, d, k[5], 4, -1530992060);
    d = hh(d, a, b, c, k[8], 11, 1272893353);
    c = hh(c, d, a, b, k[11], 16, -155497632);
    b = hh(b, c, d, a, k[14], 23, -1094730640);
    a = hh(a, b, c, d, k[1], 4, 681279174);
    d = hh(d, a, b, c, k[4], 11, -358537222);
    c = hh(c, d, a, b, k[7], 16, -722521979);
    b = hh(b, c, d, a, k[10], 23, 76029189);
    a = hh(a, b, c, d, k[13], 4, -640364409);
    d = hh(d, a, b, c, k[0], 11, -343485551);
    c = hh(c, d, a, b, k[3], 16, -41086007);
    b = hh(b, c, d, a, k[6], 23, 1163531501);

    a = ii(a, b, c, d, k[0], 6, -198630844);
    d = ii(d, a, b, c, k[7], 10, 1126891415);
    c = ii(c, d, a, b, k[14], 15, -1416354905);
    b = ii(b, c, d, a, k[5], 21, -57434055);
    a = ii(a, b, c, d, k[12], 6, 1700485571);
    d = ii(d, a, b, c, k[3], 10, -1894980106);
    c = ii(c, d, a, b, k[10], 15, -1051523);
    b = ii(b, c, d, a, k[1], 21, -2054922799);
    a = ii(a, b, c, d, k[8], 6, 1873313359);
    d = ii(d, a, b, c, k[15], 10, -30611744);
    c = ii(c, d, a, b, k[6], 15, -1560198380);
    b = ii(b, c, d, a, k[13], 21, 1309151649);
    a = ii(a, b, c, d, k[4], 6, -145523070);
    d = ii(d, a, b, c, k[11], 10, -1120210379);
    c = ii(c, d, a, b, k[2], 15, 718787259);
    b = ii(b, c, d, a, k[9], 21, -343485551);

    x[0] = add32(a, x[0]);
    x[1] = add32(b, x[1]);
    x[2] = add32(c, x[2]);
    x[3] = add32(d, x[3]);
  }

  function cmn(q: number, a: number, b: number, x: number, s: number, t: number) {
    a = add32(add32(a, q), add32(x, t));
    return add32((a << s) | (a >>> (32 - s)), b);
  }
  function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn((b & c) | (~b & d), a, b, x, s, t);
  }
  function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn((b & d) | (c & ~d), a, b, x, s, t);
  }
  function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn(b ^ c ^ d, a, b, x, s, t);
  }
  function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn(c ^ (b | ~d), a, b, x, s, t);
  }
  function add32(a: number, b: number) {
    return (a + b) & 0xFFFFFFFF;
  }

  const encoder = new TextEncoder();
  const bytes = encoder.encode(string);
  const n = bytes.length;
  const state = [1732584193, -271733879, -1732584194, 271733878];
  let i: number;

  const blocks: number[] = [];
  for (i = 0; i < n; i++) {
    blocks[i >> 2] |= bytes[i] << ((i % 4) * 8);
  }
  blocks[n >> 2] |= 0x80 << ((n % 4) * 8);
  blocks[(((n + 8) >> 6) << 4) + 14] = n * 8;

  for (i = 0; i < blocks.length; i += 16) {
    md5cycle(state, blocks.slice(i, i + 16));
  }

  return state.map(val => {
    let hex = '';
    for (let j = 0; j < 4; j++) {
      const b = (val >> (j * 8)) & 0xFF;
      hex += b.toString(16).padStart(2, '0');
    }
    return hex;
  }).join('');
}
