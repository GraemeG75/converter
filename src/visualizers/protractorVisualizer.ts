export function renderProtractorVisualizer(container: HTMLElement, angleDegrees: number): void {
  const normalized = ((angleDegrees % 360) + 360) % 360;
  const rad = (normalized * Math.PI) / 180;

  container.innerHTML = `
    <div class="visualizer-card glass-panel">
      <div class="visualizer-header">
        <span class="visualizer-title">Angle Protractor & Unit Arc</span>
      </div>
      <div class="canvas-container">
        <canvas id="protractorCanvas" width="280" height="280"></canvas>
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
}
