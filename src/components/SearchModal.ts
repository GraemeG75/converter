import { ALL_CATEGORIES } from '../engines/registry';
import type { UnitDefinition, CategoryDefinition } from '../engines/types';
import { appStateManager } from '../state/appState';
import { t, getCategoryTranslation, getUnitNameTranslation } from '../i18n';
import { trackSearch } from '../utils/analytics';

export interface SearchResultItem {
  category: CategoryDefinition;
  unit: UnitDefinition;
}

export function renderSearchModal(
  onSelectResult: (catId: string, unitId: string) => void,
  onClose: () => void
): HTMLElement {
  const state = appStateManager.getState();
  const lang = state.language;

  const backdrop = document.createElement('div');
  backdrop.className = 'search-modal-backdrop glass-backdrop';

  backdrop.innerHTML = `
    <div class="search-modal-card glass-panel">
      <div class="search-input-header">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input type="text" id="modalSearchInput" placeholder="${t('searchPlaceholder', lang)}" autofocus />
        <button id="closeSearchModalBtn" class="close-modal-btn">✕</button>
      </div>
      
      <div class="search-results-list" id="searchResultsList"></div>

      <div class="search-modal-footer">
        <span><kbd>↑</kbd> <kbd>↓</kbd> ${t('navigate', lang)}</span>
        <span><kbd>↵</kbd> ${t('select', lang)}</span>
        <span><kbd>ESC</kbd> ${t('close', lang)}</span>
      </div>
    </div>
  `;

  const input = backdrop.querySelector('#modalSearchInput') as HTMLInputElement;
  const list = backdrop.querySelector('#searchResultsList') as HTMLElement;
  const closeBtn = backdrop.querySelector('#closeSearchModalBtn') as HTMLButtonElement;

  // Flatten all units for search index
  const allUnits: SearchResultItem[] = [];
  ALL_CATEGORIES.forEach(cat => {
    cat.units.forEach(unit => {
      allUnits.push({ category: cat, unit });
    });
  });

  const renderResults = (query: string) => {
    const q = query.trim().toLowerCase();
    const filtered = allUnits.filter(item => {
      if (!q) return true;
      const catInfo = getCategoryTranslation(item.category.id, lang);
      const translatedUnitName = getUnitNameTranslation(item.unit.id, item.unit.name, lang);

      return (
        item.unit.name.toLowerCase().includes(q) ||
        translatedUnitName.toLowerCase().includes(q) ||
        item.unit.symbol.toLowerCase().includes(q) ||
        item.category.name.toLowerCase().includes(q) ||
        catInfo.name.toLowerCase().includes(q)
      );
    }).slice(0, 15);

    if (filtered.length === 0) {
      list.innerHTML = `<div class="search-no-results">${t('noResults', lang)} "${escapeHtml(query)}"</div>`;
      return;
    }

    list.innerHTML = filtered.map((item, idx) => {
      const catInfo = getCategoryTranslation(item.category.id, lang);
      const translatedUnitName = getUnitNameTranslation(item.unit.id, item.unit.name, lang);

      return `
        <div class="search-item ${idx === 0 ? 'selected' : ''}" data-cat="${item.category.id}" data-unit="${item.unit.id}">
          <div class="search-item-left">
            <span class="search-unit-name">${translatedUnitName}</span>
            <span class="search-unit-symbol">${item.unit.symbol}</span>
          </div>
          <span class="search-cat-tag">${catInfo.name}</span>
        </div>
      `;
    }).join('');

    // Attach click handlers
    list.querySelectorAll('.search-item').forEach(el => {
      el.addEventListener('click', () => {
        const catId = el.getAttribute('data-cat');
        const unitId = el.getAttribute('data-unit');
        if (catId && unitId) {
          onSelectResult(catId, unitId);
          onClose();
        }
      });
    });
  };

  let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;
  input.addEventListener('input', () => {
    renderResults(input.value);
    if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
      if (input.value.trim().length > 1) {
        trackSearch(input.value.trim());
      }
    }, 500);
  });
  closeBtn.addEventListener('click', onClose);

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) onClose();
  });

  window.addEventListener('keydown', function handleEsc(e) {
    if (e.key === 'Escape') {
      onClose();
      window.removeEventListener('keydown', handleEsc);
    }
  });

  // Initial render
  setTimeout(() => renderResults(''), 50);

  return backdrop;
}

function escapeHtml(str: string): string {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
