#!/bin/sh
set -e

cd /app

if [ "$SERVICE_NAME" = "api" ]; then
  echo "Running Prisma migrations..."
  cd apps/api
  npx prisma migrate deploy || echo "No migrations to run"
  echo "Seeding database..."
  npx ts-node prisma/seed.ts || echo "Seed may have already run"
  cd /app
fi

case "$SERVICE_NAME" in
  api)
    exec node apps/api/dist/main.js
    ;;
  web)
    cd apps/web && exec node_modules/.bin/next start -p 3000
    ;;
  admin)
    cd apps/admin && exec node_modules/.bin/next start -p 3001
    ;;
  *)
    echo "ERROR: SERVICE_NAME must be set to api, web, or admin"
    exit 1
    ;;
esac
