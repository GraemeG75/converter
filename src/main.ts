import './style.css';
import { appStateManager } from './state/appState';
import { getCategoryById, ALL_CATEGORIES } from './engines/registry';
import { renderHeader } from './components/Header';
import { renderCategoryNav } from './components/CategoryNav';
import { renderConverterCard } from './components/ConverterCard';
import { renderSearchModal } from './components/SearchModal';
import { renderHistoryDrawer } from './components/HistoryDrawer';
import { renderFooter } from './components/Footer';
import { injectGlobalJsonLd, updateCategorySEO } from './utils/seo';
import { initAnalytics, trackCategoryView } from './utils/analytics';

function initApp(): void {
  const appContainer = document.getElementById('app');
  if (!appContainer) return;

  // Initialize Analytics (Firebase + Google Analytics gtag.js)
  initAnalytics().catch(() => {});

  // Initialize Global JSON-LD Schema (WebSite with SearchAction + FAQ)
  injectGlobalJsonLd();

  // Read URL Hash on initial load if present (e.g. #coordinates -> load category)
  const initialHash = window.location.hash.replace('#', '').trim();
  if (initialHash) {
    const matchedCategory = ALL_CATEGORIES.find(c => c.id === initialHash);
    if (matchedCategory) {
      appStateManager.setState({ activeCategory: matchedCategory.id });
    }
  }

  // Handle URL hash changes
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '').trim();
    if (hash) {
      const cat = ALL_CATEGORIES.find(c => c.id === hash);
      if (cat && appStateManager.getState().activeCategory !== cat.id) {
        appStateManager.setState({ activeCategory: cat.id });
      }
    }
  });

  // Build shell DOM layout
  appContainer.innerHTML = `
    <div id="headerSlot"></div>
    <div id="navSlot"></div>
    <main id="mainSlot"></main>
    <div id="footerSlot"></div>
    <div id="modalSlot"></div>
  `;

  const headerSlot = document.getElementById('headerSlot') as HTMLElement;
  const navSlot = document.getElementById('navSlot') as HTMLElement;
  const mainSlot = document.getElementById('mainSlot') as HTMLElement;
  const footerSlot = document.getElementById('footerSlot') as HTMLElement;
  const modalSlot = document.getElementById('modalSlot') as HTMLElement;

  renderFooter(footerSlot);

  // Global Keyboard Shortcuts (Ctrl+K or / for Search)
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openSearchModal();
    } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'SELECT') {
      e.preventDefault();
      openSearchModal();
    }
  });

  const openSearchModal = () => {
    modalSlot.innerHTML = '';
    const modalEl = renderSearchModal(
      (catId, unitId) => {
        appStateManager.setState({ activeCategory: catId });
        const cat = getCategoryById(catId);
        renderConverterCard(mainSlot, cat, unitId);
      },
      () => {
        modalSlot.innerHTML = '';
      }
    );
    modalSlot.appendChild(modalEl);
  };

  const openHistoryDrawer = () => {
    modalSlot.innerHTML = '';
    const drawerEl = renderHistoryDrawer(
      (catId) => {
        appStateManager.setState({ activeCategory: catId });
      },
      () => {
        modalSlot.innerHTML = '';
      }
    );
    modalSlot.appendChild(drawerEl);
  };

  // Render Initial View
  const initialCategory = getCategoryById(appStateManager.getState().activeCategory);
  renderHeader(headerSlot, openSearchModal, openHistoryDrawer);
  renderCategoryNav(navSlot, (catId) => {
    appStateManager.setState({ activeCategory: catId });
  });
  renderConverterCard(mainSlot, initialCategory);
  trackCategoryView(initialCategory.id, initialCategory.name);

  let currentTheme = appStateManager.getState().theme;
  let currentCategory = appStateManager.getState().activeCategory;
  let currentLanguage = appStateManager.getState().language;
  let transitionTimer: ReturnType<typeof setTimeout> | null = null;

  document.documentElement.setAttribute('data-theme', currentTheme);
  updateCategorySEO(currentCategory);

  // Subscribe to State Changes with smooth theme transition
  appStateManager.subscribe((state) => {
    const themeChanged = state.theme !== currentTheme;
    const categoryChanged = state.activeCategory !== currentCategory;
    const languageChanged = state.language !== currentLanguage;

    if (themeChanged) {
      document.documentElement.classList.add('theme-transitioning');
      document.documentElement.setAttribute('data-theme', state.theme);

      if (transitionTimer) clearTimeout(transitionTimer);
      transitionTimer = setTimeout(() => {
        document.documentElement.classList.remove('theme-transitioning');
      }, 480);

      currentTheme = state.theme;
      renderHeader(headerSlot, openSearchModal, openHistoryDrawer);
    }

    if (categoryChanged || languageChanged) {
      if (window.location.hash !== `#${state.activeCategory}`) {
        history.replaceState(null, '', `#${state.activeCategory}`);
      }

      updateCategorySEO(state.activeCategory);

      renderCategoryNav(navSlot, (catId) => {
        appStateManager.setState({ activeCategory: catId });
      });

      const activeCat = getCategoryById(state.activeCategory);
      renderConverterCard(mainSlot, activeCat);
      trackCategoryView(activeCat.id, activeCat.name);

      if (!themeChanged) {
        renderHeader(headerSlot, openSearchModal, openHistoryDrawer);
      }

      currentCategory = state.activeCategory;
      currentLanguage = state.language;
    }
  });
}

document.addEventListener('DOMContentLoaded', initApp);
if (document.readyState === 'interactive' || document.readyState === 'complete') {
  initApp();
}
