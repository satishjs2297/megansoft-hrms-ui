#!/bin/sh
set -e

# Cloud Run injects PORT; default to 8080 if not set
export PORT="${PORT:-8080}"

# BACKEND_URL must be set — e.g. https://megansoft-hrms-api-xxxx-uc.a.run.app
if [ -z "${BACKEND_URL}" ]; then
  echo "WARNING: BACKEND_URL is not set. /api requests will fail."
  export BACKEND_URL="http://localhost:8000"
fi

# Strip trailing slash to avoid double-slash in nginx proxy_pass
BACKEND_URL="${BACKEND_URL%/}"
export BACKEND_URL

# Substitute env vars into nginx config template
envsubst '${PORT} ${BACKEND_URL}' \
  < /etc/nginx/templates/nginx.conf.template \
  > /etc/nginx/conf.d/default.conf

echo "Starting nginx on port ${PORT}, proxying /api to ${BACKEND_URL}"

exec nginx -g "daemon off;"
