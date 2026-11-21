# System Architecture & Design Specification

## Overview

The `data-manager` platform is a multi-tenant, modular Backend-as-a-Service (BaaS) engineered for scalability, high security, and reusability across Web, Mobile (Android/iOS), Desktop, and Third-Party API integrations.

## 5-Layer System Design

```
+-----------------------------------------------------------------------+
|                       Client Applications Layer                        |
|   [ Web Apps ]   [ Android / iOS ]   [ Desktop ]   [ 3rd-Party APIs ] |
+-----------------------------------------------------------------------+
                                    |
                                    v
+-----------------------------------------------------------------------+
|                    API Gateway & Application Layer                    |
|                NestJS + Fastify REST APIs & Webhooks                  |
+-----------------------------------------------------------------------+
                                    |
                                    v
+-----------------------------------------------------------------------+
|                          Core Platform Layer                          |
|  Auth | RBAC | App Management | Module Registry | Feature Access Engine |
+-----------------------------------------------------------------------+
                                    |
                                    v
+-----------------------------------------------------------------------+
|                          Monetization Engine                          |
|      Subscription Engine | Wallet & Credit Ledger | License Keys     |
+-----------------------------------------------------------------------+
                                    |
                                    v
+-----------------------------------------------------------------------+
|                         Infrastructure Layer                          |
| PostgreSQL + Prisma | Redis + BullMQ | Cloudflare R2 / S3 | KMS / AES |
+-----------------------------------------------------------------------+
```

## Monorepo Layout

```
data-manager/
├── .ai/                       # AI Agent Policies, Skills & Templates
├── docs/                      # Comprehensive System Documentation
├── apps/
│   └── api/                   # Main NestJS Gateway & Fastify HTTP Server
└── packages/
    ├── core/                  # Core Abstractions, Guards, Interceptors, Registry
    ├── database/              # Prisma Schema, Migrations, Seed Data
    ├── shared/                # Common DTOs, Zod Schemas, Helpers, Utilities
    └── modules/
        ├── auth/              # Authentication & Identity Management
        ├── user-management/   # User Profile & Role Administration
        ├── app-management/    # Application Isolation & Configuration
        ├── storage/           # Data Uploader, Storage Adapters & Encryption
        ├── billing/           # Subscriptions & Entitlement Management
        ├── wallet/            # Wallet Balance & Ledger System
        └── activation/        # License & Activation Key Generation
```

## Key Architectural Principles

1. **Strict Module Isolation**: Direct database access across module boundaries is prohibited. Modules export public service contracts (`*Service`) and interact asynchronously via events or synchronous DI interfaces.
2. **Multi-Tenant Logical Isolation**: Every resource belongs to a specific `appId`. Queries must include `appId` filters to prevent cross-tenant data leaks.
3. **Envelope Encryption**: Files marked for encryption use AES-256-GCM envelope encryption with per-file Data Encryption Keys (DEKs) wrapped by Key Encryption Keys (KEKs).
4. **Financial Grade Ledger**: The wallet module uses integer minor units (e.g., cents/credits), atomic SQL transactions, and append-only ledger entries.
