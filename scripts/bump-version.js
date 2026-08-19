import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const pkgPath = path.join(rootDir, 'package.json');
const versionFilePath = path.join(rootDir, 'src', 'version.ts');

try {
  const pkgContent = fs.readFileSync(pkgPath, 'utf8');
  const pkg = JSON.parse(pkgContent);

  const currentVersion = pkg.version || '1.0.0';
  const parts = currentVersion.split('.').map(n => parseInt(n, 10));

  if (parts.length === 3 && !parts.some(isNaN)) {
    parts[2] += 1; // Increment patch version
  } else {
    parts[0] = 1;
    parts[1] = 0;
    parts[2] = 0;
  }

  const newVersion = parts.join('.');
  pkg.version = newVersion;

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');

  const versionTsContent = `// Auto-generated build version file\nexport const APP_VERSION = '${newVersion}';\n`;
  fs.writeFileSync(versionFilePath, versionTsContent, 'utf8');

  console.log(`[version-bump] Updated version from v${currentVersion} -> v${newVersion}`);
} catch (err) {
  console.error('[version-bump] Failed to bump version:', err);
}
