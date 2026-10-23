export function renderCoordinateVisualizer(
  container: HTMLElement,
  lat: number,
  lng: number,
  onCoordinateChange?: (newLat: number, newLng: number) => void
): void {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';

  const cities = [
    { name: 'San Francisco', lat: 37.7749, lng: -122.4194 },
    { name: 'New York', lat: 40.7128, lng: -74.0060 },
    { name: 'London', lat: 51.5074, lng: -0.1278 },
    { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
    { name: 'Sydney', lat: -33.8688, lng: 151.2093 }
  ];

  container.innerHTML = `
    <div class="visualizer-card glass-panel">
      <div class="visualizer-header">
        <span class="visualizer-title">🗺️ Geographic Location Projection (Click Map to Pin)</span>
        <span style="font-family: var(--font-family-mono); font-weight: 700; color: var(--accent-primary);">
          ${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lng).toFixed(4)}° ${lngDir}
        </span>
      </div>
      <div class="canvas-container">
        <canvas id="coordCanvas" width="360" height="190" style="cursor: crosshair; max-width: 100%; height: auto; border-radius: var(--radius-sm); border: 1px solid var(--glass-border);"></canvas>
      </div>

      <div class="coord-presets-row" style="display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; margin-top: 8px;">
        ${cities.map(c => `
          <button class="city-preset-btn glass-btn-sm" data-lat="${c.lat}" data-lng="${c.lng}">
            📍 ${c.name}
          </button>
        `).join('')}
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
  ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
  ctx.fillRect(0, 0, w, h);

  // Simplified continent outlines approximation (world aesthetic silhouette)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  // North America
  ctx.fillRect(w * 0.12, h * 0.15, w * 0.22, h * 0.35);
  // South America
  ctx.fillRect(w * 0.22, h * 0.52, w * 0.14, h * 0.38);
  // Europe
  ctx.fillRect(w * 0.45, h * 0.18, w * 0.14, h * 0.22);
  // Africa
  ctx.fillRect(w * 0.44, h * 0.42, w * 0.16, h * 0.42);
  // Asia
  ctx.fillRect(w * 0.58, h * 0.16, w * 0.30, h * 0.38);
  // Australia
  ctx.fillRect(w * 0.74, h * 0.62, w * 0.16, h * 0.26);

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

  ctx.strokeStyle = 'rgba(99, 102, 241, 0.5)';
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

  // Canvas click handler to pin location
  if (onCoordinateChange) {
    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const clickX = (e.clientX - rect.left) * scaleX;
      const clickY = (e.clientY - rect.top) * scaleY;

      // Inverse Plate Carrée:
      // clickX / w * 360 - 180 = lng
      // 90 - (clickY / h * 180) = lat
      const newLng = Number(((clickX / w) * 360 - 180).toFixed(4));
      const newLat = Number((90 - (clickY / h) * 180).toFixed(4));
      onCoordinateChange(newLat, newLng);
    });
  }

  // City preset listeners
  container.querySelectorAll('.city-preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const latVal = parseFloat(btn.getAttribute('data-lat') || '0');
      const lngVal = parseFloat(btn.getAttribute('data-lng') || '0');
      if (onCoordinateChange) {
        onCoordinateChange(latVal, lngVal);
      }
    });
  });
}
