import kittenUrl from '../assets/kitten.png';

export function renderFooter(container: HTMLElement): void {
  const currentYear = new Date().getFullYear();
  container.innerHTML = `
    <footer class="app-footer glass-panel">
      <div class="pride-stripe" title="Celebrating Diversity & Inclusion 🏳️‍🌈"></div>
      <div class="footer-content">
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
      </div>
    </footer>
  `;
}
