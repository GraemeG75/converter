import kittenUrl from '../assets/kitten.png';
import { APP_VERSION } from '../version';

export function renderFooter(container: HTMLElement): void {
  const currentYear = new Date().getFullYear();
  container.innerHTML = `
    <footer class="app-footer glass-panel">
      <div class="pride-stripe" title="Celebrating Diversity & Inclusion 🏳️‍🌈"></div>
      <div class="footer-content">
        <div class="footer-primary-row">
          <div class="footer-text-group">
            <a href="https://generatedpixel.dev/" target="_blank" rel="noopener noreferrer" class="footer-kitten-link" title="Visit generatedpixel.dev">
              <img src="${kittenUrl}" alt="Generated Pixel Kitten" class="footer-kitten-img" />
            </a>
            <span>© ${currentYear} 
              <a href="https://generatedpixel.dev/" target="_blank" rel="noopener noreferrer" class="footer-link">
                generatedpixel.dev
              </a>
            </span>
          </div>

          <div class="footer-meta-group">
            <a href="https://buymeacoffee.com/figuremodel" target="_blank" rel="noopener noreferrer" class="footer-meta-link glass-btn bmac-btn" title="Buy Me a Coffee">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                <line x1="6" y1="1" x2="6" y2="4"></line>
                <line x1="10" y1="1" x2="10" y2="4"></line>
                <line x1="14" y1="1" x2="14" y2="4"></line>
              </svg>
              <span>Buy Me a Coffee</span>
            </a>
            <a href="mailto:hello@generatedpixel.dev" class="footer-meta-link glass-btn" title="Send email to hello@generatedpixel.dev">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </svg>
              <span>hello@generatedpixel.dev</span>
            </a>
            <a href="https://github.com/GraemeG75/converter" target="_blank" rel="noopener noreferrer" class="footer-meta-link glass-btn" title="View Source Code on GitHub">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path>
              </svg>
              <span>GitHub</span>
            </a>
            <span class="footer-badge">MIT License</span>
            <span class="footer-badge">v${APP_VERSION}</span>
          </div>
        </div>
      </div>
    </footer>
  `;
}
