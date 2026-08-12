import { access, readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const required = [
  'index.html','manifest.webmanifest','sw.js','privacy.html','terms.html',
  'src/catalog/labs.js','src/app/main.js','src/v3/schema.js','src/v3/storage.js',
  'src/v3/labs.js','src/v3/importers.js','src/v3/analytics.js','src/v3/brief.js',
  'src/v3/crypto.js','src/v3/styles.css','src/engine/derived.js','src/engine/rules.js',
  'src/engine/recommendation-engine.js','src/ui/recommendations.js','src/core/storage/indexed-db.js'
];
for (const path of required) await access(new URL(path, root));

const manifest = JSON.parse(await readFile(new URL('manifest.webmanifest', root), 'utf8'));
const index = await readFile(new URL('index.html', root), 'utf8');
const sw = await readFile(new URL('sw.js', root), 'utf8');
const schema = await readFile(new URL('src/v3/schema.js', root), 'utf8');
const pkg = JSON.parse(await readFile(new URL('package.json', root), 'utf8'));

const failures = [];
if (pkg.version !== '3.0.0') failures.push('package version is not 3.0.0');
if (!schema.includes("APP_VERSION = '3.0.0'")) failures.push('schema APP_VERSION is not 3.0.0');
if (!schema.includes('SCHEMA_VERSION = 4')) failures.push('schema version is not 4');
if (!sw.includes('markov-life-os-v3.0.0')) failures.push('service-worker cache version is not v3.0.0');
if (!index.includes('./src/app/main.js')) failures.push('index does not load Life OS app');
if (!index.includes('./src/v3/styles.css')) failures.push('index does not load v3 styles');
if (!/connect-src\s+'self'/.test(index)) failures.push('strict same-origin connect-src is missing');
if (!Array.isArray(manifest.icons) || manifest.icons.length < 2) failures.push('manifest icons are incomplete');
if (!manifest.start_url) failures.push('manifest start_url is missing');
for (const path of required.filter(p => p.startsWith('src/'))) if (!sw.includes(`'./${path}'`)) failures.push(`service worker shell misses ${path}`);

if (failures.length) {
  console.error(`Build check failed:\n${failures.map(v => `- ${v}`).join('\n')}`);
  process.exit(1);
}
console.info(`Build check passed (${required.length} required files; versions and PWA shell synchronized).`);
