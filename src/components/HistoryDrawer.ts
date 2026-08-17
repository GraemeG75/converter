import { appStateManager } from '../state/appState';
import { ALL_CATEGORIES } from '../engines/registry';

export function renderHistoryDrawer(
  onSelectCategory: (catId: string) => void,
  onClose: () => void
): HTMLElement {
  const state = appStateManager.getState();
  const backdrop = document.createElement('div');
  backdrop.className = 'drawer-backdrop glass-backdrop';

  const favCategories = ALL_CATEGORIES.filter(c => state.favorites.includes(c.id));

  backdrop.innerHTML = `
    <div class="drawer-panel glass-panel">
      <div class="drawer-header">
        <h2>History & Favorites</h2>
        <button id="closeDrawerBtn" class="close-modal-btn">✕</button>
      </div>

      <div class="drawer-body">
        <!-- Favorites Section -->
        <div class="drawer-section">
          <h3>Pinned Favorites</h3>
          ${favCategories.length === 0 ? `
            <p class="drawer-empty">No favorites pinned yet. Click the star on any converter to pin!</p>
          ` : `
            <div class="drawer-fav-grid">
              ${favCategories.map(cat => `
                <button class="fav-chip glass-btn" data-cat="${cat.id}">
                  <span>${cat.name}</span>
                </button>
              `).join('')}
            </div>
          `}
        </div>

        <!-- Conversion Log Section -->
        <div class="drawer-section">
          <div class="section-title-row">
            <h3>Recent Conversions</h3>
            ${state.history.length > 0 ? `<button id="clearHistoryBtn" class="clear-btn">Clear Log</button>` : ''}
          </div>

          ${state.history.length === 0 ? `
            <p class="drawer-empty">No recent conversions recorded yet.</p>
          ` : `
            <div class="history-list">
              ${state.history.map(item => `
                <div class="history-item-card glass-panel" data-cat="${item.categoryId}">
                  <div class="history-item-top">
                    <span class="history-cat-badge">${item.categoryName}</span>
                    <span class="history-time">${new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div class="history-conversion">
                    <span class="hist-from">${item.fromValue} ${item.fromSymbol}</span>
                    <span class="hist-arrow">➔</span>
                    <span class="hist-to">${item.toValue}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      </div>
    </div>
  `;

  // Attach Listeners
  backdrop.querySelector('#closeDrawerBtn')?.addEventListener('click', onClose);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) onClose();
  });

  backdrop.querySelectorAll('.fav-chip').forEach(el => {
    el.addEventListener('click', () => {
      const catId = el.getAttribute('data-cat');
      if (catId) {
        onSelectCategory(catId);
        onClose();
      }
    });
  });

  backdrop.querySelectorAll('.history-item-card').forEach(el => {
    el.addEventListener('click', () => {
      const catId = el.getAttribute('data-cat');
      if (catId) {
        onSelectCategory(catId);
        onClose();
      }
    });
  });

  backdrop.querySelector('#clearHistoryBtn')?.addEventListener('click', () => {
    appStateManager.clearHistory();
    onClose();
  });

  return backdrop;
}
