# Base image for installing dependencies
FROM node:18-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json turbo.json ./
COPY apps/web/package.json ./apps/web/package.json

# Install only production dependencies (remove devDeps later)
RUN npm install --legacy-peer-deps

# Builder stage
FROM node:18-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./
COPY --from=deps /app/turbo.json ./
COPY --from=deps /app/apps/web/package.json ./apps/web/package.json

COPY apps/web ./apps/web
COPY packages/typescript-config ./packages/typescript-config
COPY packages/db ./packages/db
COPY packages/db/.env ./packages/db/.env

# Generate and migrate the Prisma schema
WORKDIR /app/packages/db
RUN npx prisma generate
# Note: `migrate dev` is not suitable for production. Use `migrate deploy`.
RUN npx prisma migrate deploy

# Build Next.js app
WORKDIR /app/apps/web
RUN npm run build

# Final image
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/apps/web/public ./public
COPY --from=builder /app/apps/web/.next ./.next
COPY --from=builder /app/apps/web/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "start"]
