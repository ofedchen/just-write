FROM node:20-alpine AS frontend-build

WORKDIR /app

COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

COPY index.html vite.config.js eslint.config.js ./
COPY src ./src
COPY public ./public
COPY assets ./assets

RUN npm run build

FROM node:20-alpine AS backend-build

WORKDIR /app/server

COPY server/package.json server/package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi \
  && npm install --no-save prisma@6.7.0

COPY server/src ./src
COPY server/prisma ./prisma

RUN npx prisma generate

FROM node:20-alpine AS production

WORKDIR /app

RUN addgroup -S app && adduser -S app -G app

COPY --from=backend-build /app/server/node_modules ./node_modules
COPY --from=backend-build /app/server/src ./src
COPY --from=backend-build /app/server/prisma ./prisma
COPY --from=backend-build /app/server/node_modules/.prisma ./node_modules/.prisma
COPY --from=backend-build /app/server/node_modules/@prisma ./node_modules/@prisma
COPY --from=frontend-build /app/dist ./public
COPY start.sh ./start.sh

RUN chmod +x /app/start.sh && chown -R app:app /app

ENV NODE_ENV=production
ENV PORT=3004

EXPOSE 3004

HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=40s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3004/api/health || exit 1

USER app

ENTRYPOINT ["/bin/sh", "/app/start.sh"]
