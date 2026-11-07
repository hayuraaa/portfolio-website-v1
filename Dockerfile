# syntax=docker/dockerfile:1

FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:24-alpine AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1 \
    NEXT_STANDALONE=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build
# The admin CLI is bundled into one file so it runs with plain `node` in the slim image.
# libsql stays external: it loads a native binary, which the standalone build already ships.
RUN npx esbuild scripts/create-admin.mts scripts/migrate.mts --bundle --platform=node --format=esm --target=node24 \
      --external:libsql --outdir=dist --out-extension:.js=.mjs \
      --banner:js="import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);"

FROM node:24-alpine AS run
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    DATABASE_URL=file:storage/portfolio.db

RUN addgroup -S -g 1001 app && adduser -S -u 1001 -G app app \
    && mkdir -p storage/uploads && chown -R app:app storage

COPY --from=build --chown=app:app /app/.next/standalone ./
COPY --from=build --chown=app:app /app/.next/static ./.next/static
COPY --from=build --chown=app:app /app/public ./public
COPY --from=build --chown=app:app /app/drizzle ./drizzle
COPY --from=build --chown=app:app /app/dist/create-admin.mjs /app/dist/migrate.mjs ./scripts/

USER app
# SQLite database + uploads.
VOLUME /app/storage
EXPOSE 3000
# Migrate first, then serve: requests never see a half-migrated database.
CMD ["sh", "-c", "node scripts/migrate.mjs && exec node server.js"]
