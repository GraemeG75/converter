import { parsePermissionInput } from '../engines/bitwiseFlags';

export function renderPermissionVisualizer(
  container: HTMLElement,
  inputStr: string,
  fromId: string,
  onPermissionToggle?: (newOctalStr: string) => void
): void {
  const perm = parsePermissionInput(inputStr, fromId);

  container.innerHTML = `
    <div class="visualizer-card glass-panel">
      <div class="visualizer-header" style="display: flex; justify-content: space-between; align-items: center;">
        <span class="visualizer-title">🛡️ Linux Permission Bit Matrix</span>
        <span style="font-family: monospace; font-weight: bold; color: var(--accent-color, #6366f1); font-size: 1rem;">
          ${perm.octal} (${perm.symbolic})
        </span>
      </div>

      <div style="margin-top: 14px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; text-align: center;">
        <!-- User -->
        <div style="background: rgba(255,255,255,0.04); padding: 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);">
          <div style="font-weight: 600; font-size: 0.85rem; margin-bottom: 8px;">User (Owner)</div>
          <div style="display: flex; justify-content: center; gap: 6px;">
            <button class="perm-chip ${perm.uRead ? 'active' : ''}" data-bit="8">R</button>
            <button class="perm-chip ${perm.uWrite ? 'active' : ''}" data-bit="7">W</button>
            <button class="perm-chip ${perm.uExec ? 'active' : ''}" data-bit="6">X</button>
          </div>
        </div>

        <!-- Group -->
        <div style="background: rgba(255,255,255,0.04); padding: 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);">
          <div style="font-weight: 600; font-size: 0.85rem; margin-bottom: 8px;">Group</div>
          <div style="display: flex; justify-content: center; gap: 6px;">
            <button class="perm-chip ${perm.gRead ? 'active' : ''}" data-bit="5">R</button>
            <button class="perm-chip ${perm.gWrite ? 'active' : ''}" data-bit="4">W</button>
            <button class="perm-chip ${perm.gExec ? 'active' : ''}" data-bit="3">X</button>
          </div>
        </div>

        <!-- Others -->
        <div style="background: rgba(255,255,255,0.04); padding: 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);">
          <div style="font-weight: 600; font-size: 0.85rem; margin-bottom: 8px;">Others (World)</div>
          <div style="display: flex; justify-content: center; gap: 6px;">
            <button class="perm-chip ${perm.oRead ? 'active' : ''}" data-bit="2">R</button>
            <button class="perm-chip ${perm.oWrite ? 'active' : ''}" data-bit="1">W</button>
            <button class="perm-chip ${perm.oExec ? 'active' : ''}" data-bit="0">X</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach button click listeners for toggling individual bits
  container.querySelectorAll('.perm-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const bitIndex = parseInt(btn.getAttribute('data-bit') || '0', 10);
      const mask = 1 << bitIndex;
      const newIntVal = perm.intVal ^ mask;
      const newOctalStr = '0' + (newIntVal & 0o777).toString(8).padStart(3, '0');
      if (onPermissionToggle) {
        onPermissionToggle(newOctalStr);
      }
    });
  });
}
