export function renderProtractorVisualizer(
  container: HTMLElement,
  angleDegrees: number,
  onAngleChange?: (newDegrees: number) => void
): void {
  const normalized = ((angleDegrees % 360) + 360) % 360;
  const rad = (normalized * Math.PI) / 180;

  const presets = [0, 30, 45, 90, 180, 270, 360];

  container.innerHTML = `
    <div class="visualizer-card glass-panel">
      <div class="visualizer-header">
        <span class="visualizer-title">📐 Interactive Protractor & Unit Arc</span>
        <span class="visualizer-angle-readout" style="font-family: var(--font-family-mono); font-weight: 700; color: var(--accent-primary);">
          ${normalized.toFixed(1)}° (${rad.toFixed(3)} rad)
        </span>
      </div>

      <div class="canvas-container">
        <canvas id="protractorCanvas" width="280" height="280" style="cursor: crosshair;"></canvas>
      </div>

      <div class="angle-presets-row" style="display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; margin-top: 6px;">
        ${presets.map(p => `
          <button class="angle-preset-btn glass-btn-sm ${Math.round(normalized) === p ? 'active' : ''}" data-angle="${p}">
            ${p}°
          </button>
        `).join('')}
      </div>
    </div>
  `;

  const canvas = container.querySelector('#protractorCanvas') as HTMLCanvasElement;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const radius = 100;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Outer circle ring
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Tick marks
  for (let a = 0; a < 360; a += 15) {
    const r = (a * Math.PI) / 180;
    const innerR = a % 90 === 0 ? radius - 14 : radius - 8;
    const x1 = cx + innerR * Math.cos(r);
    const y1 = cy + innerR * Math.sin(r);
    const x2 = cx + radius * Math.cos(r);
    const y2 = cy + radius * Math.sin(r);

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = a % 90 === 0 ? '#6366f1' : 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = a % 90 === 0 ? 2 : 1;
    ctx.stroke();
  }

  // Filled Angle Arc Sweep
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  // canvas arc is clockwise starting right (0 rad)
  ctx.arc(cx, cy, radius, 0, -rad, true);
  ctx.closePath();
  ctx.fillStyle = 'rgba(99, 102, 241, 0.25)';
  ctx.fill();

  // Baseline (0 deg)
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + radius, cy);
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Vector arm
  const vx = cx + radius * Math.cos(-rad);
  const vy = cy + radius * Math.sin(-rad);
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(vx, vy);
  ctx.strokeStyle = '#ec4899';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Center point
  ctx.beginPath();
  ctx.arc(cx, cy, 6, 0, 2 * Math.PI);
  ctx.fillStyle = '#6366f1';
  ctx.fill();

  // Interactive mouse events for setting angle
  if (onAngleChange) {
    let isDragging = false;

    const handlePointerAngle = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left - cx;
      const y = clientY - rect.top - cy;
      let angle = Math.atan2(-y, x) * (180 / Math.PI);
      if (angle < 0) angle += 360;
      onAngleChange(Math.round(angle));
    };

    canvas.addEventListener('mousedown', (e) => {
      isDragging = true;
      handlePointerAngle(e.clientX, e.clientY);
    });

    window.addEventListener('mousemove', (e) => {
      if (isDragging) {
        handlePointerAngle(e.clientX, e.clientY);
      }
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch support for mobile devices
    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        e.preventDefault();
        isDragging = true;
        handlePointerAngle(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches.length > 0) {
        e.preventDefault();
        handlePointerAngle(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: false });

    canvas.addEventListener('touchend', () => {
      isDragging = false;
    });
  }

  // Preset button listeners
  container.querySelectorAll('.angle-preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const angle = parseInt(btn.getAttribute('data-angle') || '0', 10);
      if (onAngleChange) {
        onAngleChange(angle);
      }
    });
  });
}
