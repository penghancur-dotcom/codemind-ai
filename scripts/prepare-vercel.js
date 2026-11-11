'use strict';
// Vercel serves public/ through its CDN. Keep editable Acode source in the
// project root, then mirror the existing static site into public at build time.
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'public');

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
for (const entry of ['index.html', 'css', 'js', 'pages']) {
  const source = path.join(root, entry);
  if (!fs.existsSync(source)) throw new Error(`Frontend source missing: ${entry}`);
  fs.cpSync(source, path.join(out, entry), { recursive: true });
}
console.log('Vercel public assets prepared from the existing CodeMind AI frontend.');
