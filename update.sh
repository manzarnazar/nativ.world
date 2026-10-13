#!/bin/bash
set -e

echo "→ Running PM2 processes:"
pm2 list

echo ""
read -p "Enter app name or id to update: " TARGET

read -p "Port [3000]: " PORT
PORT=${PORT:-3000}

# ─── .htaccess ────────────────────────────────────────────────────────────────
echo "→ Generating .htaccess (port=$PORT)..."
cat > .htaccess << EOF
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /

    RewriteRule ^favicon\.ico$ - [L]

    # Allow SSL certificate verification
    RewriteRule ^.well-known/acme-challenge/(.*) /.well-known/acme-challenge/\$1 [L]

    # Serve Next.js static files directly from filesystem
    RewriteRule ^_next/static/(.*) /.next/static/\$1 [L]

    # Proxy Next.js data requests to Node.js server
    RewriteRule ^_next/data/(.*) http://127.0.0.1:${PORT}/_next/data/\$1 [P,L]

    # Serve public folder static files directly
    RewriteCond %{REQUEST_URI} \.(js|css|svg|jpg|jpeg|png|gif|ico|woff|woff2|ttf|eot|webp|mp4|webm)$
    RewriteRule ^ - [L]

    # Forward all other requests to Node.js server
    RewriteRule ^index.html http://127.0.0.1:${PORT}/\$1 [P]
    RewriteRule ^index.php http://127.0.0.1:${PORT}/\$1 [P]
    RewriteRule ^/?(.*)$ http://127.0.0.1:${PORT}/\$1 [P]
</IfModule>
EOF

# ─── Install Dependencies ─────────────────────────────────────────────────────
echo "→ Installing dependencies..."
npm install

# ─── Sitemap ──────────────────────────────────────────────────────────────────
echo "→ Generating sitemap..."
node scripts/generate-sitemap.mjs

# ─── Build ────────────────────────────────────────────────────────────────────
echo "→ Building..."
npm run build

# ─── Copy static assets to standalone ────────────────────────────────────────
echo "→ Copying static assets to standalone..."
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public

# ─── Restart ──────────────────────────────────────────────────────────────────
echo "→ Restarting $TARGET..."
pm2 restart "$TARGET"

echo ""
echo "✓ Update complete → $TARGET"
