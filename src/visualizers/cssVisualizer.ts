import { generateClampFormula } from '../engines/cssUnits';
import { showToast } from '../components/Toast';

export function renderCssVisualizer(container: HTMLElement, inputStr: string): void {
  const num = parseFloat(inputStr.replace(/,/g, ''));
  const pxVal = isNaN(num) ? 24 : num;
  const remVal = (pxVal / 16).toFixed(2);
  const clampStr = generateClampFormula(pxVal, 16);

  let currentViewport = 1024;

  const calculateFluidPx = (vw: number) => {
    // 375px -> pxVal * 0.75, 1440px -> pxVal * 1.3
    const minW = 375;
    const maxW = 1440;
    const minFs = Math.max(12, Math.round(pxVal * 0.75));
    const maxFs = Math.round(pxVal * 1.3);
    const clampedVw = Math.max(minW, Math.min(maxW, vw));
    const factor = (clampedVw - minW) / (maxW - minW);
    return Math.round(minFs + factor * (maxFs - minFs));
  };

  const render = () => {
    const computedAtVw = calculateFluidPx(currentViewport);

    container.innerHTML = `
      <div class="visualizer-card glass-panel">
        <div class="visualizer-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
          <span class="visualizer-title">🖥️ Fluid Typography & Screen Breakdown</span>
          <span style="font-family: var(--font-family-mono); font-size: 0.85rem; color: var(--accent-primary); font-weight: bold;">
            ${pxVal}px / ${remVal}rem
          </span>
        </div>

        <div style="margin-top: 14px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; text-align: center;">
          <div style="background: rgba(255,255,255,0.04); padding: 10px; border-radius: var(--radius-sm); border: 1px solid var(--glass-border);">
            <div style="font-size: 0.75rem; color: var(--text-muted);">📱 Mobile (375px)</div>
            <div style="font-size: ${Math.max(12, Math.round(pxVal * 0.75))}px; font-weight: bold; margin-top: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              Sample Text
            </div>
            <div style="font-size: 0.7rem; opacity: 0.7; font-family: var(--font-family-mono); margin-top: 4px;">
              ${Math.max(12, Math.round(pxVal * 0.75))}px
            </div>
          </div>

          <div style="background: rgba(255,255,255,0.04); padding: 10px; border-radius: var(--radius-sm); border: 1px solid var(--glass-border);">
            <div style="font-size: 0.75rem; color: var(--text-muted);">📱 Tablet (768px)</div>
            <div style="font-size: ${Math.round(pxVal * 0.95)}px; font-weight: bold; margin-top: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              Sample Text
            </div>
            <div style="font-size: 0.7rem; opacity: 0.7; font-family: var(--font-family-mono); margin-top: 4px;">
              ${Math.round(pxVal * 0.95)}px
            </div>
          </div>

          <div style="background: rgba(255,255,255,0.04); padding: 10px; border-radius: var(--radius-sm); border: 1px solid var(--glass-border);">
            <div style="font-size: 0.75rem; color: var(--text-muted);">💻 Desktop (1440px)</div>
            <div style="font-size: ${Math.round(pxVal * 1.3)}px; font-weight: bold; margin-top: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              Sample Text
            </div>
            <div style="font-size: 0.7rem; opacity: 0.7; font-family: var(--font-family-mono); margin-top: 4px;">
              ${Math.round(pxVal * 1.3)}px
            </div>
          </div>
        </div>

        <!-- Interactive Viewport Width Tester Slider -->
        <div style="margin-top: 14px; background: rgba(0,0,0,0.25); padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--glass-border);">
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px;">
            <span>Viewport Width Tester: <strong>${currentViewport}px</strong></span>
            <span style="color: var(--accent-primary); font-family: var(--font-family-mono); font-weight: bold;">Computed: ${computedAtVw}px</span>
          </div>
          <div style="margin-top: 8px;">
            <input type="range" id="vpSlider" min="320" max="1920" step="10" value="${currentViewport}" style="width: 100%; cursor: pointer;" />
          </div>
          <div style="margin-top: 8px; font-size: ${computedAtVw}px; font-weight: 600; color: var(--text-primary); text-align: center; padding: 6px; border: 1px dashed var(--glass-border); border-radius: 4px; overflow: hidden;">
            Fluid Typography Scaled Live (${computedAtVw}px)
          </div>
        </div>

        <div id="copyClampBox" style="margin-top: 12px; background: rgba(0,0,0,0.2); padding: 10px 14px; border-radius: var(--radius-sm); font-family: var(--font-family-mono); font-size: 0.8rem; border-left: 3px solid #10b981; display: flex; justify-content: space-between; align-items: center; cursor: pointer;" title="Click to copy CSS clamp">
          <div>
            <span style="color: #10b981; font-weight: bold;">Fluid Clamp: </span>
            <span>${clampStr}</span>
          </div>
          <button class="glass-btn-sm" style="font-size: 11px; padding: 2px 8px;">📋 Copy</button>
        </div>
      </div>
    `;

    const slider = container.querySelector('#vpSlider') as HTMLInputElement | null;
    if (slider) {
      slider.addEventListener('input', () => {
        currentViewport = parseInt(slider.value, 10);
        render();
      });
    }

    container.querySelector('#copyClampBox')?.addEventListener('click', () => {
      navigator.clipboard.writeText(clampStr);
      showToast('Copied CSS clamp() formula!');
    });
  };

  render();
}
