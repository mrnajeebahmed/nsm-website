#!/usr/bin/env bash
# Build once, then package a runtime-only bundle for cPanel shared hosting.
# Output: dist/nsm-website-cpanel.zip (no node_modules: cPanel installs them).
set -euo pipefail
cd "$(dirname "$0")/.."

npm run build
rm -rf dist && mkdir -p dist/pkg
cp -r .next dist/pkg/.next && rm -rf dist/pkg/.next/cache dist/pkg/.next/dev
cp -r public knowledge dist/pkg/
cp server.js next.config.mjs package.json package-lock.json .env.example dist/pkg/
(cd dist/pkg && zip -qr ../nsm-website-cpanel.zip .)
echo "Created dist/nsm-website-cpanel.zip ($(du -h dist/nsm-website-cpanel.zip | cut -f1))"
