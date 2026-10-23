import { rgbToHex, hslToRgb, rgbToHsl } from '../engines/color';
import type { RGB } from '../engines/color';
import { showToast } from '../components/Toast';

export function renderColorVisualizer(
  container: HTMLElement,
  hex: string,
  rgb: RGB,
  onSelectColor?: (newColorHex: string) => void
): void {
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  const textColor = luminance > 0.5 ? '#000000' : '#FFFFFF';

  // Normalize hex for color input (must be #rrggbb)
  let cleanHex = hex.startsWith('#') ? hex : '#' + hex;
  if (cleanHex.length === 4) {
    cleanHex = '#' + cleanHex[1] + cleanHex[1] + cleanHex[2] + cleanHex[2] + cleanHex[3] + cleanHex[3];
  }
  if (!/^#[0-9A-Fa-f]{6}$/.test(cleanHex)) {
    cleanHex = '#6366f1';
  }

  // Generate 5-shade palette around current color
  const baseHsl = rgbToHsl(rgb);
  const paletteHexes: string[] = [];
  const lightnesses = [15, 35, baseHsl.l, 70, 85];

  lightnesses.forEach(l => {
    const rgbShade = hslToRgb({ h: baseHsl.h, s: baseHsl.s, l });
    paletteHexes.push(rgbToHex(rgbShade));
  });

  const presetColors = [
    { name: 'Indigo', hex: '#6366f1' },
    { name: 'Emerald', hex: '#10b981' },
    { name: 'Rose', hex: '#f43f5e' },
    { name: 'Amber', hex: '#f59e0b' },
    { name: 'Cyan', hex: '#06b6d4' },
    { name: 'Violet', hex: '#8b5cf6' }
  ];

  container.innerHTML = `
    <div class="visualizer-card glass-panel">
      <div class="visualizer-header">
        <span class="visualizer-title">🎨 Color Swatch, Picker & Contrast Preview</span>
        <label class="color-picker-label glass-btn-sm" title="Open Color Picker">
          <input type="color" id="nativeColorPicker" value="${cleanHex}" class="native-color-input" />
          <span>Pick Color</span>
        </label>
      </div>
      
      <div class="color-preview-box" style="background-color: ${hex}; color: ${textColor};">
        <div class="color-preview-text">Sample Text Preview</div>
        <div class="color-preview-sub">Contrast: ${luminance > 0.5 ? 'Dark Text (High Contrast)' : 'Light Text (High Contrast)'} | Luminance: ${(luminance * 100).toFixed(1)}%</div>
      </div>

      <div class="color-section-row">
        <div>
          <div class="color-palette-title">Generated Shade Palette (Click to Apply & Copy)</div>
          <div class="color-palette-row">
            ${paletteHexes.map(h => `
              <div class="palette-swatch clickable-swatch" data-hex="${h}" style="background-color: ${h};" title="Click to use ${h}">
                <span>${h}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div style="margin-top: 12px;">
          <div class="color-palette-title">Curated Color Presets</div>
          <div class="color-presets-row">
            ${presetColors.map(p => `
              <button class="color-preset-chip glass-btn-sm" data-hex="${p.hex}">
                <span class="preset-dot" style="background: ${p.hex};"></span>
                <span>${p.name}</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  // Color input listener
  const picker = container.querySelector('#nativeColorPicker') as HTMLInputElement | null;
  if (picker && onSelectColor) {
    picker.addEventListener('input', () => {
      onSelectColor(picker.value.toUpperCase());
    });
  }

  // Clickable swatch listeners
  container.querySelectorAll('.clickable-swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
      const selected = swatch.getAttribute('data-hex');
      if (selected) {
        navigator.clipboard.writeText(selected).catch(() => {});
        showToast(`Color applied: ${selected}`);
        if (onSelectColor) onSelectColor(selected);
      }
    });
  });

  // Preset chips
  container.querySelectorAll('.color-preset-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const selected = chip.getAttribute('data-hex');
      if (selected && onSelectColor) {
        showToast(`Preset: ${selected}`);
        onSelectColor(selected);
      }
    });
  });
}
