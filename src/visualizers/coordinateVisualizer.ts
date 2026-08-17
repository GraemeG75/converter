export function renderCoordinateVisualizer(container: HTMLElement, lat: number, lng: number): void {
  container.innerHTML = `
    <div class="visualizer-card glass-panel">
      <div class="visualizer-header">
        <span class="visualizer-title">Geographic Location Projection</span>
      </div>
      <div class="canvas-container">
        <canvas id="coordCanvas" width="300" height="180"></canvas>
      </div>
    </div>
  `;

  const canvas = container.querySelector('#coordCanvas') as HTMLCanvasElement;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  // Background map grid
  ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
  ctx.fillRect(0, 0, w, h);

  // Grid lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 30) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += 30) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // Equator and Prime Meridian
  const eqY = h / 2;
  const pmX = w / 2;

  ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)';
  ctx.lineWidth = 1.5;
  // Equator
  ctx.beginPath();
  ctx.moveTo(0, eqY);
  ctx.lineTo(w, eqY);
  ctx.stroke();
  // Prime Meridian
  ctx.beginPath();
  ctx.moveTo(pmX, 0);
  ctx.lineTo(pmX, h);
  ctx.stroke();

  // Convert lat/lng to canvas x, y (Plate Carrée Equirectangular)
  // Lng [-180, 180] -> [0, w]
  // Lat [-90, 90] -> [h, 0]
  const px = ((lng + 180) / 360) * w;
  const py = ((90 - lat) / 180) * h;

  // Pulse ring
  ctx.beginPath();
  ctx.arc(px, py, 14, 0, 2 * Math.PI);
  ctx.fillStyle = 'rgba(236, 72, 153, 0.25)';
  ctx.fill();

  // Crosshair
  ctx.strokeStyle = '#ec4899';
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(px - 10, py);
  ctx.lineTo(px + 10, py);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(px, py - 10);
  ctx.lineTo(px, py + 10);
  ctx.stroke();

  // Pin center
  ctx.beginPath();
  ctx.arc(px, py, 4, 0, 2 * Math.PI);
  ctx.fillStyle = '#ec4899';
  ctx.fill();
}
