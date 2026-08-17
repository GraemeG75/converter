import { appStateManager } from '../state/appState';
import { t } from '../i18n';
import type { SupportedLanguage } from '../engines/types';

export function renderHeader(container: HTMLElement, onOpenSearch: () => void, onOpenHistory: () => void): void {
  const state = appStateManager.getState();
  const theme = state.theme;
  const lang = state.language;

  let themeIcon = '';
  let themeTitle = '';

  if (theme === 'dark') {
    themeTitle = 'Switch to Light Mode';
    themeIcon = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
    `;
  } else if (theme === 'light') {
    themeTitle = 'Switch to Super Fabulous Pride Mode 🏳️‍🌈';
    themeIcon = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.72-8.72 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
    `;
  } else {
    // pride theme
    themeTitle = 'Switch to Dark Mode';
    themeIcon = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    `;
  }

  container.innerHTML = `
    <header class="app-header glass-header ${theme === 'pride' ? 'pride-header' : ''}">
      <div class="header-left">
        <div class="logo-badge ${theme === 'pride' ? 'pride-badge-glow' : ''}">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"></path>
          </svg>
        </div>
        <div class="header-titles">
          <h1>${t('appName', lang)} ${theme === 'pride' ? '✨' : ''}</h1>
          <span class="header-tagline">${theme === 'pride' ? 'Super Fabulous Edition 🏳️‍🌈' : t('tagline', lang)}</span>
        </div>
      </div>

      <div class="header-actions">
        <button id="searchBtn" class="header-btn glass-btn" title="${t('searchTitle', lang)}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <span class="btn-label">${t('search', lang)}</span>
          <kbd class="kbd-shortcut">Ctrl K</kbd>
        </button>

        <button id="historyBtn" class="header-btn glass-btn" title="${t('historyTitle', lang)}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span class="btn-label">${t('history', lang)}</span>
          ${state.history.length > 0 ? `<span class="badge-dot"></span>` : ''}
        </button>

        <button id="themeToggleBtn" class="header-btn glass-btn icon-only ${theme === 'pride' ? 'pride-theme-btn' : ''}" title="${themeTitle}">
          ${themeIcon}
        </button>

        <div class="lang-select-wrapper">
          <select id="languageSelect" class="header-btn glass-select language-select" title="${t('selectLanguageTitle', lang)}">
            <option value="en" ${lang === 'en' ? 'selected' : ''}>🇺🇸 EN</option>
            <option value="de" ${lang === 'de' ? 'selected' : ''}>🇩🇪 DE</option>
            <option value="es" ${lang === 'es' ? 'selected' : ''}>🇪🇸 ES</option>
            <option value="fr" ${lang === 'fr' ? 'selected' : ''}>🇫🇷 FR</option>
            <option value="it" ${lang === 'it' ? 'selected' : ''}>🇮🇹 IT</option>
          </select>
        </div>
      </div>
    </header>
  `;

  // Attach Listeners
  container.querySelector('#searchBtn')?.addEventListener('click', onOpenSearch);
  container.querySelector('#historyBtn')?.addEventListener('click', onOpenHistory);
  container.querySelector('#themeToggleBtn')?.addEventListener('click', () => {
    const current = appStateManager.getState().theme;
    let nextTheme: 'dark' | 'light' | 'pride' = 'light';
    if (current === 'dark') nextTheme = 'light';
    else if (current === 'light') nextTheme = 'pride';
    else nextTheme = 'dark';

    appStateManager.setState({ theme: nextTheme });
    document.documentElement.setAttribute('data-theme', nextTheme);
  });
  container.querySelector('#languageSelect')?.addEventListener('change', (e) => {
    const selectedLang = (e.target as HTMLSelectElement).value as SupportedLanguage;
    appStateManager.setState({ language: selectedLang });
  });
}
