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

  container.innerHTML = `
    <div class="visualizer-card glass-panel">
      <div class="visualizer-header">
        <span class="visualizer-title">Interactive 32-Bit Toggle Board</span>
      </div>

      <div class="bitboard-grid">
        ${bits.map((b, idx) => {
          const bitIndex = 31 - idx;
          const isByteBorder = bitIndex % 8 === 0 && bitIndex !== 0;
          return `
            <div class="bit-item ${b === 1 ? 'active' : ''} ${isByteBorder ? 'byte-separator' : ''}" data-bit="${bitIndex}">
              <span class="bit-val">${b}</span>
              <span class="bit-index">${bitIndex}</span>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  // Attach event listeners for bit clicks
  container.querySelectorAll('.bit-item').forEach(el => {
    el.addEventListener('click', () => {
      const bitIndex = parseInt(el.getAttribute('data-bit') || '0', 10);
      const mask = 1n << BigInt(bitIndex);
      const newVal = currentValBigInt ^ mask;
      onBitToggle(newVal);
    });
  });
}
