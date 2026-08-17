export function renderThermometerVisualizer(container: HTMLElement, celsius: number): void {
  // Clamp fill height between -40C and 120C
  const minC = -40;
  const maxC = 120;
  const clampedC = Math.max(minC, Math.min(maxC, celsius));
  const percent = ((clampedC - minC) / (maxC - minC)) * 100;

  // Determine fluid color from blue (cold) to red (hot)
  let fluidColor = '#3b82f6';
  if (celsius > 30) fluidColor = '#ef4444';
  else if (celsius > 15) fluidColor = '#f59e0b';
  else if (celsius > 0) fluidColor = '#10b981';

  container.innerHTML = `
    <div class="visualizer-card glass-panel">
      <div class="visualizer-header">
        <span class="visualizer-title">Temperature Scale Gauge</span>
      </div>
      <div class="thermometer-gauge-wrapper">
        <div class="thermo-ticks">
          <div class="tick-mark" style="bottom: 100%"><span>120°C</span></div>
          <div class="tick-mark" style="bottom: 87.5%"><span>100°C (Boiling)</span></div>
          <div class="tick-mark" style="bottom: 48%"><span>37°C (Body)</span></div>
          <div class="tick-mark" style="bottom: 37.5%"><span>20°C (Room)</span></div>
          <div class="tick-mark" style="bottom: 25%"><span>0°C (Freezing)</span></div>
          <div class="tick-mark" style="bottom: 0%"><span>-40°C</span></div>
        </div>
        <div class="thermometer-glass">
          <div class="thermometer-fill" style="height: ${percent}%; background: ${fluidColor};"></div>
          <div class="thermometer-bulb" style="background: ${fluidColor};"></div>
        </div>
      </div>
    </div>
  `;
}
