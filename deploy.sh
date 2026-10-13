#!/bin/bash
set -e

# ─── Inputs ───────────────────────────────────────────────────────────────────
read -p "Project name [e-stay]: " PROJECT_NAME
PROJECT_NAME=${PROJECT_NAME:-e-stay}

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

# ─── Sitemap ──────────────────────────────────────────────────────────────────
echo "→ Generating sitemap..."
node scripts/generate-sitemap.mjs

# ─── Install & Build ──────────────────────────────────────────────────────────
echo "→ Installing dependencies..."
npm install --frozen-lockfile

echo "→ Building..."
npm run build

# ─── Copy static assets to standalone ────────────────────────────────────────
echo "→ Copying static assets to standalone..."
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public

# ─── PM2 ──────────────────────────────────────────────────────────────────────
echo "→ Creating logs directory..."
mkdir -p logs

echo "→ Reloading PM2 (name=$PROJECT_NAME, port=$PORT)..."
if pm2 list | grep -q "$PROJECT_NAME"; then
  PORT=$PORT pm2 reload ecosystem.config.js --update-env
else
  PORT=$PORT pm2 start ecosystem.config.js --name "$PROJECT_NAME"
fi

pm2 save

echo ""
echo "✓ Deploy complete"
echo "  App   : $PROJECT_NAME on port $PORT"
