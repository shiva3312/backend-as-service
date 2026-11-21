# Modular Backend Platform (`data-manager`)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue.svg)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10-red.svg)](https://nestjs.com/)
[![Fastify](https://img.shields.io/badge/Fastify-4-black.svg)](https://www.fastify.io/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748.svg)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7-DC382D.svg)](https://redis.io/)
[![BullMQ](https://img.shields.io/badge/BullMQ-5-orange.svg)](https://docs.bullmq.io/)
[![pnpm](https://img.shields.io/badge/pnpm-9-orange.svg)](https://pnpm.io/)

**`data-manager`** is an enterprise-grade, highly secure, modular **Backend-as-a-Service (BaaS)** platform built with TypeScript, NestJS, Fastify, Prisma (PostgreSQL), Redis, BullMQ, and Cloudflare R2 / S3 storage. 

Instead of re-architecting authentication, multi-tenancy, file storage, subscription billing, credit wallets, or license key redemptions for every new product, `data-manager` enables new applications to be provisioned effortlessly via configuration.

---

## 🚀 Supported Client Ecosystems

- **Web Applications**: SPAs (React, Vue, Next.js) & Server-Side Rendered applications.
- **Mobile Applications**: Native Android (Kotlin / Jetpack Compose), Native iOS (Swift / SwiftUI), Flutter, and React Native.
- **Desktop Applications**: Electron, Tauri, and native desktop environments.
- **API & B2B Integrations**: External client integrations utilizing app-scoped keys and webhooks.

---

## ✨ Key Features & Core Modules

### 🔐 1. Authentication & Identity (`packages/modules/auth`)
- **Secure Credentials**: Argon2id password hashing with custom salt vectors.
- **Token Lifecycle**: Short-lived JWT access tokens + rotating refresh tokens stored in Redis.
- **Multi-Factor Auth**: Time-based One-Time Password (TOTP) 2FA support.
- **Session Revocation**: Remote device session logout & global token revocation.

### 🏢 2. Multi-Tenant Application Isolation (`packages/modules/app-management`)
- **Strict Data Scoping**: Every database record is scoped to an `appId`.
- **Dynamic Feature Flags**: Enable/disable specific modules per client application without backend redeployments.
- **App Key & Domain Management**: Unique API key generation and custom domain routing.

### 👤 3. User & Organization Management (`packages/modules/user-management`)
- **User Profiles**: User preference management and RBAC/ABAC role assignments.
- **Organizations & Teams**: Hierarchical tenant organizations with team member management.

### 📦 4. Abstract Storage & Envelope Encryption (`packages/modules/storage`)
- **Storage Providers**: Multi-provider support for Local disk, AWS S3, and Cloudflare R2.
- **Envelope Encryption**: AES-256-GCM file encryption with client/app-managed key vectors.
- **Resumable Uploads**: Chunked file upload processing with pre-signed URL delegation.

### 💳 5. Subscription & Entitlements Engine (`packages/modules/billing` & `packages/core`)
- **Flexible Plans**: Tiered subscription plans (Free, Pro, Enterprise) with quota tracking.
- **Entitlement Resolution**: Centralized feature access enforcement engine (`IFeatureAccessEngine`).
- **Trial & Renewals**: Grace periods, automated renewals, and upgrade/downgrade handling.

### 👛 6. Wallet & Immutable Credit Ledger (`packages/modules/wallet`)
- **Double-Entry Ledger**: Immutable financial transaction ledger for pay-as-you-go credits.
- **Atomic Operations**: Idempotent balance updates with strict transaction locks.
- **Usage Deductions**: Real-time credit deductions linked to API & storage usage.

### 🔑 7. Activation & License Key Engine (`packages/modules/activation`)
- **Key Generation & Validation**: Cryptographically secure activation key generation & SHA-256 hash validation.
- **Redemption Limits**: Usage-capped key redemptions bound to app features or credit top-ups.

### ⚡ 8. Audit Logging & Background Processing (`packages/core`)
- **BullMQ Queue Management**: Asynchronous task workers for email notification delivery and asset processing.
- **Security Audit Logs**: Immutable audit event records for all administrative and sensitive operations.

---

## 🏗️ Monorepo Architecture

`data-manager` is organized as a high-performance **pnpm monorepo** managed by **TurboRepo**:

```text
data-manager/
├── apps/
│   └── api/                    # NestJS API Gateway & Fastify HTTP Server
├── packages/
│   ├── core/                   # Platform abstractions, Module Registry, Guards & Exceptions
│   ├── database/               # Prisma Schema, Migrations & Database Seeder
│   ├── shared/                 # Shared DTOs, API Response wrappers & Utilities
│   └── modules/                # Independent Domain Feature Packages
│       ├── activation/         # License & Activation Key Engine
│       ├── app-management/     # Application CRUD & Tenant Scoping
│       ├── auth/               # Authentication & Identity Service
│       ├── billing/            # Subscription & Entitlements Service
│       ├── storage/            # File Storage & Envelope Encryption
│       ├── user-management/    # Users & Organization Management
│       └── wallet/             # Immutable Credit Ledger & Wallet
├── docs/                       # Comprehensive Technical Documentation Hub
├── docker-compose.yml          # Local infrastructure (Postgres, Redis)
└── docker-compose.prod.yml     # Production deployment stack
```

---

## 📚 Technical Documentation Hub

All technical aspects of the platform are thoroughly documented in the [`docs/`](docs/) directory:

- [📄 01. Project Overview](docs/01-project-overview.md) — Vision, target clients, multi-tenant architecture, and core BaaS capabilities.
- [📄 02. Architecture & Layering](docs/02-architecture-and-layers.md) — 5-Layer architectural pattern, monorepo structure, and technology stack.
- [📄 03. Core Module Catalog](docs/03-module-catalog.md) — In-depth breakdown of all 10 domain feature packages and public interfaces.
- [📄 04. Monetization & Entitlements](docs/04-monetization-and-entitlements.md) — Feature entitlement engine, subscription tiers, wallet ledger, and license keys.
- [📄 05. Security & Privacy Architecture](docs/05-security-and-privacy.md) — Argon2id hashing, JWT refresh rotation, envelope encryption (AES-256-GCM), and RBAC/ABAC guards.
- [📄 06. Database & Storage Design](docs/06-database-and-storage.md) — PostgreSQL + Prisma schema design, indexing strategy, and S3/R2 storage integration.
- [📄 07. API Design & Standards](docs/07-api-design-and-standards.md) — REST standards, Zod DTO validations, OpenAPI/Swagger specifications, and error contracts.
- [📄 08. Engineering Checklist Compliance](docs/08-engineering-checklist-compliance.md) — Compliance matrix mapping 20 production readiness standards.
- [📄 09. Setup & Operational Guide](docs/09-setup-and-feature-guide.md) — Step-by-step developer setup, seed data, and operational guide.
- [📄 10. Production VPS Deployment Guide](docs/10-vps-deployment-guide.md) — Production Docker containerization, Caddy reverse proxy, and SSL deployment.
- [📄 Documentation Navigation Index](docs/INDEX.md) — Quick links and documentation hub map.
- [📄 Master Platform Blueprint](docs/Backend-as-service.md) — Original master platform blueprint and feature matrix.
- [📄 Industry-Grade Engineering Checklist](docs/Industry-grade-be-project-checklist.md) — 20-point engineering quality control checklist.

### Governance & Operational Guides
- [🏛️ AGENTS.md](AGENTS.md) — Core rules and boundary guidelines for AI Agents & Developers.
- [📐 ARCHITECTURE.md](ARCHITECTURE.md) — High-level architecture overview and system design.
- [🤝 CONTRIBUTING.md](CONTRIBUTING.md) — Guidelines for code contributions, workflow, and quality gates.
- [🔒 SECURITY.md](SECURITY.md) — Security policy and vulnerability reporting process.

---

## 🛠️ Quick Start & Developer Setup

### Prerequisites
- **Node.js**: `^20.0.0`
- **pnpm**: `^9.0.0`
- **Docker**: For running PostgreSQL 16 & Redis 7 locally

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-org/data-manager.git
cd data-manager
pnpm install
```

### 2. Configure Environment Variables
```bash
cp .env.example .env
```

### 3. Start Local Infrastructure
```bash
docker compose up -d
```

### 4. Database Setup & Seeding
```bash
# Generate Prisma Client
pnpm db:generate

# Apply Database Migrations
pnpm db:migrate

# Seed Database with Initial Tenant & Admin Account
pnpm db:seed
```

### 5. Run Development Server
```bash
pnpm dev
```
The NestJS API Gateway will be accessible at `http://localhost:3000`, with interactive Swagger OpenAPI documentation available at `http://localhost:3000/api/docs`.

---

## 🧪 Testing & Quality Assurance

```bash
# Run unit tests across all monorepo packages
pnpm test

# Run TypeScript typechecks
pnpm typecheck

# Run linter
pnpm lint

# Build all monorepo packages and API gateway
pnpm build
```

---

## 📜 License

Private & Proprietary — All rights reserved. See [SECURITY.md](SECURITY.md) for vulnerability reporting.
