import { parseCronExpression } from '../engines/cronSchedule';

export function renderCronVisualizer(container: HTMLElement, inputStr: string): void {
  const info = parseCronExpression(inputStr);

  if (!info.isValid || info.nextTriggers.length === 0) {
    container.innerHTML = `
      <div class="visualizer-card glass-panel">
        <div class="visualizer-header">
          <span class="visualizer-title">Cron Schedule Timeline</span>
        </div>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 8px;">
          ${info.humanText}
        </p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="visualizer-card glass-panel">
      <div class="visualizer-header">
        <span class="visualizer-title">📅 Next 5 Schedule Executions</span>
      </div>
      <div style="margin-top: 12px; display: flex; flex-direction: column; gap: 8px;">
        ${info.nextTriggers.map((date, idx) => {
          const iso = date.toISOString();
          const localStr = date.toLocaleString();
          return `
            <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.05); padding: 8px 12px; border-radius: 6px; font-size: 0.85rem;">
              <span style="font-weight: 600; color: var(--accent-color, #6366f1);">Run #${idx + 1}</span>
              <span style="font-family: monospace;">${localStr}</span>
              <span style="font-size: 0.75rem; opacity: 0.7; font-family: monospace;">(${iso})</span>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}
