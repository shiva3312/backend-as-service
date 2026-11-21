#!/bin/sh
set -e

echo "🚀 [1/3] Running Database Migrations..."
pnpm db:deploy || echo "⚠️ Database migration step finished or skipped."

echo "🌱 [2/3] Seeding Database Initial Data..."
pnpm db:seed || echo "⚠️ Database seeding step finished or skipped."

echo "⚡ [3/3] Starting Gateway API application..."
exec node apps/api/dist/main.js
