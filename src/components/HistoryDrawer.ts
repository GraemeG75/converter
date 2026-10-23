import { appStateManager } from '../state/appState';
import { ALL_CATEGORIES } from '../engines/registry';
import { t, getCategoryTranslation } from '../i18n';
import { showToast } from './Toast';

export function renderHistoryDrawer(
  onSelectCategory: (catId: string, fromUnitId?: string, toUnitId?: string, inputValue?: string) => void,
  onClose: () => void
): HTMLElement {
  const backdrop = document.createElement('div');
  backdrop.className = 'drawer-backdrop glass-backdrop';

  const renderContent = () => {
    const state = appStateManager.getState();
    const lang = state.language;
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
                      <span>★ ${catInfo.name}</span>
                    </button>
                  `;
                }).join('')}
              </div>
            `}
          </div>

          <!-- Conversion Log Section -->
          <div class="drawer-section">
            <div class="section-title-row">
              <h3>${t('recentConversions', lang)} (${state.history.length})</h3>
              ${state.history.length > 0 ? `<button id="clearHistoryBtn" class="clear-btn">${t('clearLog', lang)}</button>` : ''}
            </div>

            ${state.history.length === 0 ? `
              <p class="drawer-empty">${t('noHistory', lang)}</p>
            ` : `
              <div class="history-list">
                ${state.history.map(item => {
                  const catInfo = getCategoryTranslation(item.categoryId, lang);
                  return `
                    <div class="history-item-card glass-panel" data-id="${item.id}" data-cat="${item.categoryId}">
                      <div class="history-item-top">
                        <span class="history-cat-badge">${catInfo.name}</span>
                        <div class="history-top-actions">
                          <span class="history-time">${new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          <button class="history-action-btn copy-hist-btn" data-output="${item.toValue}" title="Copy Result">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                          </button>
                          <button class="history-action-btn delete-hist-btn" data-id="${item.id}" title="Remove Entry">
                            ✕
                          </button>
                        </div>
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
      el.addEventListener('click', (e) => {
        // If clicked on an action button, do not restore
        const target = e.target as HTMLElement;
        if (target.closest('.history-action-btn')) {
          return;
        }

        const itemId = el.getAttribute('data-id');
        const stateNow = appStateManager.getState();
        const item = stateNow.history.find(h => h.id === itemId);
        if (item) {
          if (item.fromUnitId && item.toUnitId) {
            appStateManager.setCategoryUnits(item.categoryId, item.fromUnitId, item.toUnitId, item.fromValue);
          }
          onSelectCategory(item.categoryId, item.fromUnitId, item.toUnitId, item.fromValue);
          onClose();
        }
      });
    });

    backdrop.querySelectorAll('.copy-hist-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const output = btn.getAttribute('data-output') || '';
        navigator.clipboard.writeText(output).then(() => {
          showToast(t('copiedToast', lang));
        });
      });
    });

    backdrop.querySelectorAll('.delete-hist-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        if (id) {
          appStateManager.removeHistoryItem(id);
          renderContent();
        }
      });
    });

    backdrop.querySelector('#clearHistoryBtn')?.addEventListener('click', () => {
      appStateManager.clearHistory();
      showToast(t('historyClearedToast', lang));
      renderContent();
    });
  };

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      onClose();
    }
  });

  const handleEsc = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
      window.removeEventListener('keydown', handleEsc);
    }
  };
  window.addEventListener('keydown', handleEsc);

  renderContent();
  return backdrop;
}
