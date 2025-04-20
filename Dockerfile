# Base image for installing dependencies
FROM node:18-alpine AS deps
WORKDIR /app

# Copy monorepo essentials
COPY package.json package-lock.json turbo.json ./

# Copy app-specific package.json
COPY apps/web/package.json ./apps/web/package.json

# Install shared dependencies
RUN npm install --legacy-peer-deps

# Build stage
FROM node:18-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/turbo.json ./turbo.json
COPY --from=deps /app/apps/web/package.json ./apps/web/package.json

# 👇 Copy your actual code and shared config
COPY apps/web ./apps/web
COPY packages/typescript-config ./packages/typescript-config
COPY packages/db ./packages/db

# Build the web app
RUN cd packages/db && npx prisma generate && npx prisma migrate dev
RUN cd apps/web && npm run build

# Final production image
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/apps/web/public ./public
COPY --from=builder /app/apps/web/.next ./.next
COPY --from=builder /app/apps/web/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "start"]
