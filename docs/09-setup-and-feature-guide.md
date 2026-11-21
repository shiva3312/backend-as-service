# 09. Complete Setup & Feature Guide

This guide provides step-by-step instructions for installing, configuring, running, and utilizing every feature built into the **`data-manager`** platform.

---

## 1. Quickstart & Installation Guide

### Prerequisites
- **Node.js**: `v20.x` or `v22.x`
- **pnpm**: `v9.x` (`corepack enable pnpm`)
- **Docker & Docker Compose**: For PostgreSQL 16 & Redis 7

### Installation Steps

1. **Clone & Install Workspace Dependencies**:
   ```bash
   pnpm install
   ```

2. **Launch Infrastructure Containers**:
   ```bash
   docker-compose up -d
   ```

3. **Configure Environment Variables**:
   ```bash
   cp .env.example .env
   ```

4. **Initialize Database Client, Migrations & Seed Data**:
   ```bash
   # Generate Prisma ORM Client
   pnpm db:generate

   # Apply Database Migrations
   pnpm db:migrate

   # Seed Default Application, Admin User & Subscription Plans
   pnpm db:seed
   ```

5. **Start Development Gateway API**:
   ```bash
   pnpm dev
   ```

6. **Access Interactive Swagger OpenAPI UI**:
   Open [http://localhost:3000/docs](http://localhost:3000/docs) in your browser.

### 1.1 Production VPS Setup (Docker)

To deploy the entire stack (PostgreSQL, Redis, and Gateway API) on a production VPS server using Docker:

1. Copy `.env.production.example` to `.env` and set your production secrets:
   ```bash
   cp .env.production.example .env
   ```
2. Build and launch all production containers:
   ```bash
   docker compose -f docker-compose.prod.yml up -d --build
   ```
3. For full details on Nginx reverse proxy, SSL configuration with Certbot, and backup maintenance, see the [Production & VPS Docker Deployment Guide](file:///home/shivam-chaurasiya/Desktop/Projects/data-manager/docs/10-vps-deployment-guide.md).

---

## 2. Feature-by-Feature Operational Guide

### Feature 1: Multi-Tenant Application Management (`/v1/apps`)
- **Capability**: Provision independent, logically isolated application tenants (`appId`).
- **Secret Credentials**: Automatically generates an API Key (`ak_live_...`) and hashes the API Secret (`sk_live_...`) using Argon2id.
- **Dynamic Module Enablement**: Enable/disable feature modules per application on the fly.
- **Endpoints**:
  * `POST /v1/apps` — Create a new application
  * `GET /v1/apps/:id` — Retrieve application status and enabled module list
  * `POST /v1/apps/:id/modules/:moduleId/enable` — Enable feature module

---

### Feature 2: Authentication & Token Rotation (`/v1/auth`)
- **Capability**: Centralized user identity management.
- **Password Security**: Argon2id memory-hard password hashing.
- **JWT Rotation**: 15-minute access tokens paired with rotating 7-day refresh tokens.
- **Endpoints**:
  * `POST /v1/auth/register` — Register a new user
  * `POST /v1/auth/login` — Authenticate and receive access + refresh token
  * `POST /v1/auth/refresh` — Rotate refresh token and issue new access token

---

### Feature 3: User & Profile Management (`/v1/users`)
- **Capability**: Tenant-scoped user profiles and RBAC role assignments.
- **Tenant Guard**: Every query requires the `x-app-id` header to enforce tenant data isolation.
- **Endpoints**:
  * `GET /v1/users/me` — Get profile and application-assigned roles
  * `PATCH /v1/users/me` — Update user profile details

---

### Feature 4: Storage & AES-256-GCM Envelope Encryption (`/v1/files`)
- **Capability**: Upload images, videos, audio, text, PDFs, and binary assets.
- **Envelope Encryption**: Generates a 256-bit DEK per file, encrypts buffer with AES-256-GCM, and wraps the DEK with a Master KEK (`MASTER_ENCRYPTION_KEY`).
- **Soft Delete & Recovery**: Deleting a file sets `deletedAt = timestamp`, hiding it from user queries while preserving the physical server asset for recovery or audit.
- **Endpoints**:
  * `POST /v1/files/upload` — Upload asset (with optional `encrypt: true`)
  * `GET /v1/files/:fileId` — Get file metadata and download link
  * `DELETE /v1/files/:fileId` — Soft delete file asset
  * `POST /v1/files/:fileId/restore` — Restore a soft-deleted file asset

---

### Feature 5: Subscription Management (`/v1/subscriptions`)
- **Capability**: Recurring subscription plans, billing cycle evaluation, and feature entitlement grants.
- **Endpoints**:
  * `GET /v1/subscriptions/plans` — List active subscription plans
  * `POST /v1/subscriptions/subscribe` — Subscribe user to a plan
  * `GET /v1/subscriptions/me` — Check current active subscription and expiration

---

### Feature 6: Wallet Credit Ledger & Idempotency (`/v1/wallet`)
- **Capability**: Atomic credit balance ledger using minor currency integers.
- **Idempotency Protection**: Pass `x-idempotency-key` in `POST /v1/wallet/deduct` to prevent double-spending or duplicate charges.
- **Transaction Safety**: Runs within Prisma `$transaction` blocks.
- **Endpoints**:
  * `GET /v1/wallet` — Retrieve wallet credit balance
  * `POST /v1/wallet/deduct` — Deduct credits idempotently
  * `POST /v1/wallet/topup` — Top-up credits idempotently

---

### Feature 7: Activation & License Keys (`/v1/activation`)
- **Capability**: Format `PREFIX-XXXX-XXXX-XXXX` activation key generation, SHA-256 hash validation, redemption limits, and automatic wallet credit grant upon redemption.
- **Endpoints**:
  * `POST /v1/activation/generate` — Generate activation key
  * `POST /v1/activation/redeem` — Redeem key to grant credits or unlock plan
