#!/bin/sh
set -e

echo ">>> Running Prisma db push..."
pnpm prisma db push --config prisma.config.ts --skip-generate

echo ">>> Starting application..."
exec "$@"
