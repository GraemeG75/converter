import { rgbToHex, hslToRgb, rgbToHsl } from '../engines/color';
import type { RGB } from '../engines/color';

export function renderColorVisualizer(container: HTMLElement, hex: string, rgb: RGB): void {
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  const textColor = luminance > 0.5 ? '#000000' : '#FFFFFF';

  // Generate 5-shade palette around the current color
  const baseHsl = rgbToHsl(rgb);
  const paletteHexes: string[] = [];
  const lightnesses = [15, 35, baseHsl.l, 70, 85];

  lightnesses.forEach(l => {
    const rgbShade = hslToRgb({ h: baseHsl.h, s: baseHsl.s, l });
    paletteHexes.push(rgbToHex(rgbShade));
  });

  container.innerHTML = `
    <div class="visualizer-card glass-panel">
      <div class="visualizer-header">
        <span class="visualizer-title">Color Swatch & Contrast Preview</span>
      </div>
      
      <div class="color-preview-box" style="background-color: ${hex}; color: ${textColor};">
        <div class="color-preview-text">Sample Text Preview</div>
        <div class="color-preview-sub">Contrast Ratio: ${luminance > 0.5 ? 'Dark Text (High Contrast)' : 'Light Text (High Contrast)'}</div>
      </div>

      <div class="color-palette-title">Generated Shade Palette</div>
      <div class="color-palette-row">
        ${paletteHexes.map(h => `
          <div class="palette-swatch" style="background-color: ${h};" title="${h}">
            <span>${h}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
