# ==========================================
# Stage 1: Builder
# ==========================================
FROM node:20-alpine AS builder

# Enable Corepack for pnpm
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# Build tools for native dependencies (like argon2) and OpenSSL for Prisma
RUN apk add --no-cache python3 make g++ openssl

WORKDIR /app

# Copy root workspace configs
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json tsconfig.json ./

# Copy package manifests for workspace caching
COPY apps/api/package.json ./apps/api/
COPY packages/core/package.json ./packages/core/
COPY packages/database/package.json ./packages/database/
COPY packages/shared/package.json ./packages/shared/
COPY packages/modules/activation/package.json ./packages/modules/activation/
COPY packages/modules/app-management/package.json ./packages/modules/app-management/
COPY packages/modules/auth/package.json ./packages/modules/auth/
COPY packages/modules/billing/package.json ./packages/modules/billing/
COPY packages/modules/storage/package.json ./packages/modules/storage/
COPY packages/modules/user-management/package.json ./packages/modules/user-management/
COPY packages/modules/wallet/package.json ./packages/modules/wallet/

# Install workspace dependencies
RUN pnpm install --frozen-lockfile

# Copy full source trees
COPY apps ./apps
COPY packages ./packages

# Generate Prisma ORM Client
RUN pnpm db:generate

# Build all monorepo packages and apps
RUN pnpm build

# ==========================================
# Stage 2: Production Runner
# ==========================================
FROM node:20-alpine AS runner

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# Runtime requirements (OpenSSL for Prisma, curl for healthchecks)
RUN apk add --no-cache openssl curl

WORKDIR /app

ENV NODE_ENV=production

# Create non-root system user for security compliance
RUN addgroup -S nestjs && adduser -S nestjs -G nestjs

# Copy root configs & manifests
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json tsconfig.json ./

# Copy compiled apps, packages, and node_modules from builder
COPY --from=builder /app/apps ./apps
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/node_modules ./node_modules

# Copy entrypoint script
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

# Create upload storage directory with permissions
RUN mkdir -p /app/uploads && chown -R nestjs:nestjs /app

USER nestjs

EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]
