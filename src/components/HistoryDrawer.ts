import { appStateManager } from '../state/appState';
import { ALL_CATEGORIES } from '../engines/registry';
import { t, getCategoryTranslation } from '../i18n';
import { showToast } from './Toast';

export function renderHistoryDrawer(
  onSelectCategory: (catId: string) => void,
  onClose: () => void
): HTMLElement {
  const state = appStateManager.getState();
  const lang = state.language;

  const backdrop = document.createElement('div');
  backdrop.className = 'drawer-backdrop glass-backdrop';

  const favCategories = ALL_CATEGORIES.filter(c => state.favorites.includes(c.id));

  backdrop.innerHTML = `
    <div class="drawer-panel glass-panel">
      <div class="drawer-header">
        <h2>${t('historyAndFavs', lang)}</h2>
        <button id="closeDrawerBtn" class="close-modal-btn">✕</button>
      </div>

      <div class="drawer-body">
        <!-- Favorites Section -->
        <div class="drawer-section">
          <h3>${t('pinnedFavs', lang)}</h3>
          ${favCategories.length === 0 ? `
            <p class="drawer-empty">${t('noFavs', lang)}</p>
          ` : `
            <div class="drawer-fav-grid">
              ${favCategories.map(cat => {
                const catInfo = getCategoryTranslation(cat.id, lang);
                return `
                  <button class="fav-chip glass-btn" data-cat="${cat.id}">
                    <span>${catInfo.name}</span>
                  </button>
                `;
              }).join('')}
            </div>
          `}
        </div>

        <!-- Conversion Log Section -->
        <div class="drawer-section">
          <div class="section-title-row">
            <h3>${t('recentConversions', lang)}</h3>
            ${state.history.length > 0 ? `<button id="clearHistoryBtn" class="clear-btn">${t('clearLog', lang)}</button>` : ''}
          </div>

          ${state.history.length === 0 ? `
            <p class="drawer-empty">${t('noHistory', lang)}</p>
          ` : `
            <div class="history-list">
              ${state.history.map(item => {
                const catInfo = getCategoryTranslation(item.categoryId, lang);
                return `
                  <div class="history-item-card glass-panel" data-cat="${item.categoryId}">
                    <div class="history-item-top">
                      <span class="history-cat-badge">${catInfo.name}</span>
                      <span class="history-time">${new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div class="history-conversion">
                      <span class="hist-from">${item.fromValue} ${item.fromSymbol}</span>
                      <span class="hist-arrow">➔</span>
                      <span class="hist-to">${item.toValue}</span>
                    </div>
                  </div>
                `;
              }).join('')}
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
    showToast(t('historyClearedToast', lang));
    onClose();
  });

  return backdrop;
}
