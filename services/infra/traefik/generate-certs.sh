#!/bin/bash
# ============================================================
# Generate self-signed TLS certificates for local development
# Usage: ./generate-certs.sh
# Certificates are created in the certs/ directory next to this script
# ============================================================

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CERTS_DIR="$SCRIPT_DIR/certs"

mkdir -p "$CERTS_DIR"

# Check if certificates already exist
if [ -f "$CERTS_DIR/cert.pem" ] && [ -f "$CERTS_DIR/key.pem" ]; then
  echo "✅ Certificates already exist in $CERTS_DIR"
  echo "   To regenerate, delete cert.pem and key.pem then re-run this script."
  exit 0
fi

echo "🔐 Generating self-signed certificates..."

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout "$CERTS_DIR/key.pem" \
  -out "$CERTS_DIR/cert.pem" \
  -subj "/C=ES/ST=Madrid/L=Madrid/O=42Transcendence/CN=localhost" \
  -addext "subjectAltName=DNS:localhost,DNS:*.localhost,DNS:api.localhost,DNS:grafana.localhost,DNS:prometheus.localhost,IP:127.0.0.1"

if [ $? -eq 0 ]; then
  echo "✅ Certificates generated successfully:"
  echo "   - $CERTS_DIR/cert.pem"
  echo "   - $CERTS_DIR/key.pem"
  echo ""
  echo "⚠️  These are self-signed certificates — the browser will show a warning."
  echo "   Click 'Advanced' → 'Proceed' to accept."
else
  echo "❌ Error generating certificates"
  exit 1
fi
