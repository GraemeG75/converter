import { parseSubnetInput } from '../engines/cidrSubnet';

export function renderSubnetVisualizer(container: HTMLElement, inputStr: string, onPrefixChange?: (newPrefixInput: string) => void): void {
  const subnet = parseSubnetInput(inputStr);

  if (!subnet) {
    container.innerHTML = `
      <div class="visualizer-card glass-panel">
        <div class="visualizer-header">
          <span class="visualizer-title">IPv4 Subnet Mask Allocation</span>
        </div>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 8px;">
          Enter a valid IPv4 address or CIDR notation (e.g. 192.168.1.1/24)
        </p>
      </div>
    `;
    return;
  }

  const prefix = subnet.prefixLen;
  const netBits = prefix;
  const hostBits = 32 - prefix;

  container.innerHTML = `
    <div class="visualizer-card glass-panel">
      <div class="visualizer-header" style="display: flex; justify-content: space-between; align-items: center;">
        <span class="visualizer-title">🌐 IPv4 Subnet Allocation (/${prefix})</span>
        <span style="font-size: 0.8rem; font-family: monospace; color: var(--accent-color, #6366f1);">
          Net: ${netBits} bits | Host: ${hostBits} bits
        </span>
      </div>

      <div style="margin-top: 14px;">
        <div style="display: flex; height: 24px; border-radius: 6px; overflow: hidden; font-size: 0.75rem; font-weight: bold; text-align: center; line-height: 24px; color: #fff;">
          <div style="width: ${(netBits / 32) * 100}%; background: #3b82f6; transition: width 0.3s ease;">
            ${netBits > 4 ? `Network (/${netBits})` : ''}
          </div>
          <div style="width: ${(hostBits / 32) * 100}%; background: #10b981; transition: width 0.3s ease;">
            ${hostBits > 4 ? `Hosts (${subnet.usableHosts})` : ''}
          </div>
        </div>

        <div style="margin-top: 12px; display: flex; align-items: center; gap: 12px;">
          <label style="font-size: 0.8rem; font-weight: 500;">Adjust Subnet Prefix:</label>
          <input type="range" id="prefixRangeInput" min="0" max="32" value="${prefix}" style="flex: 1; cursor: pointer;" />
          <span style="font-weight: bold; font-family: monospace; font-size: 0.9rem;">/${prefix}</span>
        </div>
      </div>
    </div>
  `;

  const rangeEl = container.querySelector('#prefixRangeInput') as HTMLInputElement | null;
  if (rangeEl && onPrefixChange) {
    rangeEl.addEventListener('input', () => {
      const newPrefix = parseInt(rangeEl.value, 10);
      onPrefixChange(`${subnet.ipStr}/${newPrefix}`);
    });
  }
}
