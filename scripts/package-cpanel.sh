#!/usr/bin/env bash
# Build once, then package a runtime-only bundle for GoDaddy (cPanel Node.js
# apps and GoDaddy Node.js app hosting "Folder upload").
# Output: dist/nsm-website-godaddy.zip with package.json AT THE ZIP ROOT.
# The bundle is prebuilt: its "build" script is a no-op so the host never
# needs to run `next build`; it only installs dependencies and runs server.js.
set -euo pipefail
cd "$(dirname "$0")/.."

npm run build
rm -rf dist && mkdir -p dist/pkg
cp -r .next dist/pkg/.next && rm -rf dist/pkg/.next/cache dist/pkg/.next/dev
cp -r public knowledge dist/pkg/
cp server.js next.config.mjs package-lock.json .env.example dist/pkg/
node -e "
const p = require('./package.json');
p.scripts = { build: 'echo \"Prebuilt bundle: skipping next build\"', start: 'node server.js' };
require('fs').writeFileSync('dist/pkg/package.json', JSON.stringify(p, null, 2) + '\n');"
(cd dist/pkg && zip -qr ../nsm-website-godaddy.zip .)
cp dist/nsm-website-godaddy.zip dist/nsm-website-cpanel.zip
echo "Created dist/nsm-website-godaddy.zip ($(du -h dist/nsm-website-godaddy.zip | cut -f1))"
