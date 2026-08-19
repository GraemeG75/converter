import { parseJwtToken } from '../engines/hashEncoding';

export function renderJwtVisualizer(container: HTMLElement, inputStr: string): void {
  const parts = inputStr.trim().split('.');
  if (parts.length < 2) {
    container.innerHTML = `
      <div class="visualizer-card glass-panel">
        <div class="visualizer-header">
          <span class="visualizer-title">JWT Token Payload Inspector</span>
        </div>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 8px;">
          Paste a valid JWT token (Header.Payload.Signature) to inspect formatted JSON structure.
        </p>
      </div>
    `;
    return;
  }

  const jsonStr = parseJwtToken(inputStr);

  container.innerHTML = `
    <div class="visualizer-card glass-panel">
      <div class="visualizer-header">
        <span class="visualizer-title">⚡ JWT Token Header & Payload Inspector</span>
      </div>
      <div class="jwt-structure" style="margin-top: 12px; font-family: monospace; font-size: 0.85rem;">
        <div style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 8px; border-left: 4px solid var(--accent-color, #6366f1); overflow-x: auto;">
          <pre style="margin: 0; white-space: pre-wrap; word-break: break-all; color: var(--text-main);">${escapeHtml(jsonStr)}</pre>
        </div>
      </div>
    </div>
  `;
}

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
