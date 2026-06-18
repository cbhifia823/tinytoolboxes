#!/bin/bash
# Submits all sitemap URLs to IndexNow (Bing, Yandex, Seznam, Naver, Yep).
# Re-run this whenever you add new pages or want to ping search engines about updates.
#
# Usage: bash scripts/indexnow-submit.sh

set -e
HOST="www.tinytoolboxes.com"
KEY="cfb0a610a0e2c65de2c1dd1eb565313c"
KEY_URL="https://${HOST}/${KEY}.txt"

URLS=$(curl -s "https://${HOST}/sitemap.xml" | grep -oP '<loc>\K[^<]+' | jq -R . | jq -s .)
COUNT=$(echo "$URLS" | jq length)

PAYLOAD=$(jq -n \
  --arg host "$HOST" \
  --arg key "$KEY" \
  --arg keyLocation "$KEY_URL" \
  --argjson urls "$URLS" \
  '{host: $host, key: $key, keyLocation: $keyLocation, urlList: $urls}')

echo "Submitting ${COUNT} URLs to IndexNow..."
curl -sS -X POST "https://api.indexnow.org/IndexNow" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d "$PAYLOAD" \
  -w "\nHTTP %{http_code}\n"
