import { generateUUIDv4, generateUUIDv7, NIL_GUID } from '../engines/uuid';
import { showToast } from '../components/Toast';

export function renderUuidVisualizer(
  container: HTMLElement,
  onSelectGeneratedUuid?: (uuidVal: string) => void
): void {
  let v4Val = generateUUIDv4();
  let v7Val = generateUUIDv7();
  const nilVal = NIL_GUID;

  const render = () => {
    container.innerHTML = `
      <div class="visualizer-card glass-panel">
        <div class="visualizer-header">
          <span class="visualizer-title">Instant GUID / UUID Generators</span>
        </div>

        <div class="uuid-generator-grid">
          <!-- UUID v4 Card -->
          <div class="uuid-card glass-panel">
            <div class="uuid-card-header">
              <span class="uuid-title">UUID Version 4 (Random)</span>
              <button id="regenV4Btn" class="glass-btn-sm" title="Generate New v4">↻ New</button>
            </div>
            <div class="uuid-value-row">
              <code class="uuid-code">${v4Val}</code>
              <button id="copyV4Btn" class="copy-btn glass-btn" title="Copy UUID v4">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- UUID v7 Card -->
          <div class="uuid-card glass-panel">
            <div class="uuid-card-header">
              <span class="uuid-title">UUID Version 7 (Time-Ordered)</span>
              <button id="regenV7Btn" class="glass-btn-sm" title="Generate New v7">↻ New</button>
            </div>
            <div class="uuid-value-row">
              <code class="uuid-code">${v7Val}</code>
              <button id="copyV7Btn" class="copy-btn glass-btn" title="Copy UUID v7">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Empty / Nil GUID Card -->
          <div class="uuid-card glass-panel">
            <div class="uuid-card-header">
              <span class="uuid-title">Empty / Nil GUID</span>
              <span class="uuid-tag">Standard All-Zeros</span>
            </div>
            <div class="uuid-value-row">
              <code class="uuid-code">${nilVal}</code>
              <button id="copyNilBtn" class="copy-btn glass-btn" title="Copy Nil GUID">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Attach Event Listeners
    container.querySelector('#regenV4Btn')?.addEventListener('click', () => {
      v4Val = generateUUIDv4();
      if (onSelectGeneratedUuid) onSelectGeneratedUuid(v4Val);
      render();
    });

    container.querySelector('#regenV7Btn')?.addEventListener('click', () => {
      v7Val = generateUUIDv7();
      if (onSelectGeneratedUuid) onSelectGeneratedUuid(v7Val);
      render();
    });

    container.querySelector('#copyV4Btn')?.addEventListener('click', () => {
      navigator.clipboard.writeText(v4Val);
      showToast(`Copied UUID v4: ${v4Val}`);
    });

    container.querySelector('#copyV7Btn')?.addEventListener('click', () => {
      navigator.clipboard.writeText(v7Val);
      showToast(`Copied UUID v7: ${v7Val}`);
    });

    container.querySelector('#copyNilBtn')?.addEventListener('click', () => {
      navigator.clipboard.writeText(nilVal);
      showToast(`Copied Nil GUID: ${nilVal}`);
    });
  };

  render();
}
