export function renderThermometerVisualizer(
  container: HTMLElement,
  celsius: number,
  onSelectCelsius?: (newCelsius: number) => void
): void {
  // Clamp fill height between -40C and 120C
  const minC = -40;
  const maxC = 120;
  const clampedC = Math.max(minC, Math.min(maxC, celsius));
  const percent = ((clampedC - minC) / (maxC - minC)) * 100;
  const fahrenheit = (celsius * 9) / 5 + 32;

  // Determine fluid color from blue (cold) to red (hot)
  let fluidColor = '#3b82f6';
  if (celsius > 30) fluidColor = '#ef4444';
  else if (celsius > 15) fluidColor = '#f59e0b';
  else if (celsius > 0) fluidColor = '#10b981';

  const presets = [
    { label: 'Freezing (0°C)', val: 0 },
    { label: 'Room (20°C)', val: 20 },
    { label: 'Body (37°C)', val: 37 },
    { label: 'Boiling (100°C)', val: 100 }
  ];

  container.innerHTML = `
    <div class="visualizer-card glass-panel">
      <div class="visualizer-header">
        <span class="visualizer-title">🌡️ Temperature Scale Gauge</span>
        <span style="font-family: var(--font-family-mono); font-weight: 700; color: ${fluidColor};">
          ${celsius.toFixed(1)}°C / ${fahrenheit.toFixed(1)}°F
        </span>
      </div>

      <div class="thermometer-gauge-wrapper">
        <div class="thermo-ticks">
          <div class="tick-mark clickable-tick" data-val="120" style="bottom: 100%"><span>120°C</span></div>
          <div class="tick-mark clickable-tick" data-val="100" style="bottom: 87.5%"><span>100°C (Boiling)</span></div>
          <div class="tick-mark clickable-tick" data-val="37" style="bottom: 48%"><span>37°C (Body)</span></div>
          <div class="tick-mark clickable-tick" data-val="20" style="bottom: 37.5%"><span>20°C (Room)</span></div>
          <div class="tick-mark clickable-tick" data-val="0" style="bottom: 25%"><span>0°C (Freezing)</span></div>
          <div class="tick-mark clickable-tick" data-val="-40" style="bottom: 0%"><span>-40°C</span></div>
        </div>
        <div class="thermometer-glass">
          <div class="thermometer-fill" style="height: ${percent}%; background: ${fluidColor};"></div>
          <div class="thermometer-bulb" style="background: ${fluidColor};"></div>
        </div>
      </div>

      <div class="thermo-presets" style="display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; margin-top: 10px;">
        ${presets.map(p => `
          <button class="thermo-preset-btn glass-btn-sm ${Math.round(celsius) === p.val ? 'active' : ''}" data-val="${p.val}">
            ${p.label}
          </button>
        `).join('')}
      </div>
    </div>
  `;

  // Attach click listeners for presets
  container.querySelectorAll('.thermo-preset-btn, .clickable-tick').forEach(el => {
    el.addEventListener('click', () => {
      const valStr = el.getAttribute('data-val');
      if (valStr !== null && onSelectCelsius) {
        onSelectCelsius(parseFloat(valStr));
      }
    });
  });
}
