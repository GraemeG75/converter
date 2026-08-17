import { ALL_CATEGORIES } from '../engines/registry';
import { appStateManager } from '../state/appState';

const ICON_SVGS: Record<string, string> = {
  ruler: '<path d="M21 3H3v18h18V3zM7 7v4M11 7v2M15 7v4M19 7v2"/>',
  square: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>',
  box: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>',
  compass: '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',
  thermometer: '<path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>',
  globe: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  'hard-drive': '<line x1="22" y1="12" x2="2" y2="12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
  wifi: '<path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/>',
  gauge: '<path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  scale: '<path d="M12 3v18M3 7l9-4 9 4M3 7l4 8M21 7l-4 8M7 15a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm10 0a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/>',
  barometer: '<circle cx="12" cy="12" r="10"/><path d="M12 12l3-5"/>',
  zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  activity: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  palette: '<circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.92 0 1.5-.72 1.5-1.5 0-.38-.15-.74-.44-1-.29-.27-.44-.64-.44-1.02 0-.83.67-1.48 1.5-1.48H16c3.31 0 6-2.69 6-6 0-4.96-4.49-9-10-9z"/>',
  binary: '<path d="M4 10h12M4 14h12M10 4v16M14 4v16"/>',
  type: '<polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/>',
  code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
  key: '<path d="M21 2l-2 2m-1.5 1.5L4 19l-2 2 2 2 2-2 1.5-1.5M15.5 7.5l3 3M7 16l3 3"/><circle cx="17.5" cy="6.5" r="3.5"/>'
};

export function renderCategoryNav(container: HTMLElement, onSelectCategory: (catId: string) => void): void {
  const state = appStateManager.getState();
  const activeId = state.activeCategory;

  container.innerHTML = `
    <nav class="category-nav-scroll">
      <div class="category-tabs">
        ${ALL_CATEGORIES.map(cat => {
          const isActive = cat.id === activeId;
          const iconSvg = ICON_SVGS[cat.icon] || ICON_SVGS.ruler;
          const isFav = state.favorites.includes(cat.id);

          return `
            <button class="category-tab ${isActive ? 'active' : ''}" data-id="${cat.id}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                ${iconSvg}
              </svg>
              <span class="tab-name">${cat.name}</span>
              ${isFav ? `<span class="fav-star" title="Favorited">★</span>` : ''}
            </button>
          `;
        }).join('')}
      </div>
    </nav>
  `;

  // Attach click listeners
  container.querySelectorAll('.category-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      const catId = btn.getAttribute('data-id');
      if (catId) {
        onSelectCategory(catId);
      }
    });
  });
}
