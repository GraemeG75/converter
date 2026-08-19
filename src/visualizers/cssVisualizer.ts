import { generateClampFormula } from '../engines/cssUnits';

export function renderCssVisualizer(container: HTMLElement, inputStr: string): void {
  const num = parseFloat(inputStr);
  const pxVal = isNaN(num) ? 24 : num;
  const remVal = (pxVal / 16).toFixed(2);
  const clampStr = generateClampFormula(pxVal, 16);

  container.innerHTML = `
    <div class="visualizer-card glass-panel">
      <div class="visualizer-header" style="display: flex; justify-content: space-between; align-items: center;">
        <span class="visualizer-title">🖥️ Fluid Typography & Screen Breakdown</span>
        <span style="font-family: monospace; font-size: 0.85rem; color: var(--accent-color, #6366f1); font-weight: bold;">
          ${pxVal}px / ${remVal}rem
        </span>
      </div>

      <div style="margin-top: 14px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; text-align: center;">
        <div style="background: rgba(255,255,255,0.04); padding: 10px; border-radius: 6px;">
          <div style="font-size: 0.75rem; color: var(--text-muted);">📱 Mobile (375px)</div>
          <div style="font-size: ${Math.max(12, Math.round(pxVal * 0.75))}px; font-weight: bold; margin-top: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            Sample Text
          </div>
          <div style="font-size: 0.7rem; opacity: 0.7; font-family: monospace; margin-top: 4px;">
            ${Math.max(12, Math.round(pxVal * 0.75))}px
          </div>
        </div>

        <div style="background: rgba(255,255,255,0.04); padding: 10px; border-radius: 6px;">
          <div style="font-size: 0.75rem; color: var(--text-muted);">📱 Tablet (768px)</div>
          <div style="font-size: ${Math.round(pxVal * 0.95)}px; font-weight: bold; margin-top: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            Sample Text
          </div>
          <div style="font-size: 0.7rem; opacity: 0.7; font-family: monospace; margin-top: 4px;">
            ${Math.round(pxVal * 0.95)}px
          </div>
        </div>

        <div style="background: rgba(255,255,255,0.04); padding: 10px; border-radius: 6px;">
          <div style="font-size: 0.75rem; color: var(--text-muted);">💻 Desktop (1440px)</div>
          <div style="font-size: ${Math.round(pxVal * 1.3)}px; font-weight: bold; margin-top: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            Sample Text
          </div>
          <div style="font-size: 0.7rem; opacity: 0.7; font-family: monospace; margin-top: 4px;">
            ${Math.round(pxVal * 1.3)}px
          </div>
        </div>
      </div>

      <div style="margin-top: 12px; background: rgba(0,0,0,0.2); padding: 8px 12px; border-radius: 6px; font-family: monospace; font-size: 0.8rem; border-left: 3px solid #10b981;">
        <span style="color: #10b981; font-weight: bold;">Fluid Clamp: </span>
        <span>${clampStr}</span>
      </div>
    </div>
  `;
}
