import type { CategoryDefinition } from './types';

export interface RGB { r: number; g: number; b: number; }
export interface HSL { h: number; s: number; l: number; }
export interface HSV { h: number; s: number; v: number; }
export interface CMYK { c: number; m: number; y: number; k: number; }

export function hexToRgb(hex: string): RGB | null {
  let cleanHex = hex.trim().replace(/^#/, '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('');
  }
  if (!/^[0-9a-fA-F]{6}$/.test(cleanHex)) return null;

  const num = parseInt(cleanHex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

export function rgbToHex(rgb: RGB): string {
  const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`.toUpperCase();
}

export function rgbToHsl(rgb: RGB): HSL {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

export function hslToRgb(hsl: HSL): RGB {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;

  if (s === 0) {
    const val = Math.round(l * 255);
    return { r: val, g: val, b: val };
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return {
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255)
  };
}

export function rgbToHsv(rgb: RGB): HSV {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const v = max;
  const d = max - min;
  const s = max === 0 ? 0 : d / max;
  let h = 0;

  if (max !== min) {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100)
  };
}

export function rgbToCmyk(rgb: RGB): CMYK {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const k = 1 - Math.max(r, g, b);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };

  const c = (1 - r - k) / (1 - k);
  const m = (1 - g - k) / (1 - k);
  const y = (1 - b - k) / (1 - k);

  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100)
  };
}

export function rgbToInt(rgb: RGB): number {
  return (rgb.r << 16) + (rgb.g << 8) + rgb.b;
}

export function parseColorInput(input: string): { hex: string; rgb: RGB; hsl: HSL; hsv: HSV; cmyk: CMYK; intVal: number } | null {
  const str = input.trim();
  let rgb: RGB | null = null;

  if (str.startsWith('#') || /^[0-9a-fA-F]{3,6}$/.test(str)) {
    rgb = hexToRgb(str);
  } else if (str.toLowerCase().startsWith('rgb')) {
    const matches = str.match(/\d+/g);
    if (matches && matches.length >= 3) {
      rgb = { r: parseInt(matches[0]), g: parseInt(matches[1]), b: parseInt(matches[2]) };
    }
  } else if (str.toLowerCase().startsWith('hsl')) {
    const matches = str.match(/\d+/g);
    if (matches && matches.length >= 3) {
      const hsl = { h: parseInt(matches[0]), s: parseInt(matches[1]), l: parseInt(matches[2]) };
      rgb = hslToRgb(hsl);
    }
  } else if (/^\d+$/.test(str)) {
    const num = parseInt(str, 10);
    if (num >= 0 && num <= 16777215) {
      rgb = { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
    }
  }

  if (!rgb) return null;

  return {
    hex: rgbToHex(rgb),
    rgb,
    hsl: rgbToHsl(rgb),
    hsv: rgbToHsv(rgb),
    cmyk: rgbToCmyk(rgb),
    intVal: rgbToInt(rgb)
  };
}

export const colorCategory: CategoryDefinition = {
  id: 'color',
  name: 'Color Formats',
  icon: 'palette',
  description: 'Convert HEX, RGB, HSL, HSV, CMYK, and Decimal color representations.',
  defaultFromUnit: 'hex',
  defaultToUnit: 'rgb',
  defaultInputValue: '#3B82F6',
  hasVisualizer: true,
  visualizerType: 'color',
  units: [
    { id: 'hex', name: 'HEX Color', symbol: 'HEX', category: 'color' },
    { id: 'rgb', name: 'RGB (Red Green Blue)', symbol: 'rgb()', category: 'color' },
    { id: 'hsl', name: 'HSL (Hue Saturation Lightness)', symbol: 'hsl()', category: 'color' },
    { id: 'hsv', name: 'HSV / HSB', symbol: 'hsv()', category: 'color' },
    { id: 'cmyk', name: 'CMYK (Cyan Magenta Yellow Key)', symbol: 'cmyk()', category: 'color' },
    { id: 'int', name: 'Decimal Integer (24-bit)', symbol: 'Int', category: 'color' }
  ]
};
