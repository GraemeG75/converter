export function renderBitBoardVisualizer(
  container: HTMLElement,
  currentValBigInt: bigint,
  onBitToggle: (newVal: bigint) => void
): void {
  // Extract 32 bits
  const bits: number[] = [];
  for (let i = 31; i >= 0; i--) {
    const bit = Number((currentValBigInt >> BigInt(i)) & 1n);
    bits.push(bit);
  }

  const hexVal = '0x' + (currentValBigInt & 0xFFFFFFFFn).toString(16).toUpperCase().padStart(8, '0');
  const decVal = (currentValBigInt & 0xFFFFFFFFn).toString(10);

  container.innerHTML = `
    <div class="visualizer-card glass-panel">
      <div class="visualizer-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
        <span class="visualizer-title">💻 Interactive 32-Bit Toggle Board</span>
        <div style="font-family: var(--font-family-mono); font-size: 13px;">
          <span style="color: var(--accent-primary); font-weight: bold;">${hexVal}</span>
          <span style="opacity: 0.6; margin-left: 6px;">(${decVal})</span>
        </div>
      </div>

      <div class="bitboard-grid">
        ${bits.map((b, idx) => {
          const bitIndex = 31 - idx;
          const isByteBorder = bitIndex % 8 === 0 && bitIndex !== 0;
          return `
            <div class="bit-item ${b === 1 ? 'active' : ''} ${isByteBorder ? 'byte-separator' : ''}" data-bit="${bitIndex}" title="Toggle Bit ${bitIndex} (2^${bitIndex})">
              <span class="bit-val">${b}</span>
              <span class="bit-index">${bitIndex}</span>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Quick Bitboard Actions -->
      <div style="display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; margin-top: 10px;">
        <button id="bitClearAll" class="glass-btn-sm">Clear All (0x0)</button>
        <button id="bitSetAll" class="glass-btn-sm">Set All (0xFF..)</button>
        <button id="bitInvert" class="glass-btn-sm">Invert Bits (~)</button>
        <button id="bitRandom" class="glass-btn-sm">🎲 Random</button>
      </div>
    </div>
  `;

  // Attach event listeners for bit clicks
  container.querySelectorAll('.bit-item').forEach(el => {
    el.addEventListener('click', () => {
      const bitIndex = parseInt(el.getAttribute('data-bit') || '0', 10);
      const mask = 1n << BigInt(bitIndex);
      const newVal = (currentValBigInt ^ mask) & 0xFFFFFFFFn;
      onBitToggle(newVal);
    });
  });

  // Action listeners
  container.querySelector('#bitClearAll')?.addEventListener('click', () => {
    onBitToggle(0n);
  });

  container.querySelector('#bitSetAll')?.addEventListener('click', () => {
    onBitToggle(0xFFFFFFFFn);
  });

  container.querySelector('#bitInvert')?.addEventListener('click', () => {
    onBitToggle((~currentValBigInt) & 0xFFFFFFFFn);
  });

  container.querySelector('#bitRandom')?.addEventListener('click', () => {
    const rand = BigInt(Math.floor(Math.random() * 0xFFFFFFFF));
    onBitToggle(rand);
  });
}
