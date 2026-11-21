# 02. Architecture & System Layering

## 5-Layer Architectural Model

```
+-----------------------------------------------------------------------+
|                    1. Client Applications Layer                       |
|         (Web, Android, iOS, Desktop, Third-Party Clients)            |
+-----------------------------------------------------------------------+
                                   |
                                   v
+-----------------------------------------------------------------------+
|                2. API Gateway & Application Layer                     |
|           (NestJS + Fastify REST APIs, Guards, Interceptors)          |
+-----------------------------------------------------------------------+
                                   |
                                   v
+-----------------------------------------------------------------------+
|                      3. Core Platform Layer                           |
|  (Auth, App Management, Module Registry, Feature Access Engine, RBAC) |
+-----------------------------------------------------------------------+
                                   |
                                   v
+-----------------------------------------------------------------------+
|                    4. Monetization Engine                             |
|       (Subscription Engine, Wallet Credit Ledger, License Keys)        |
+-----------------------------------------------------------------------+
                                   |
                                   v
+-----------------------------------------------------------------------+
|                   5. Infrastructure Layer                             |
|  (PostgreSQL + Prisma, Redis + BullMQ, Cloudflare R2 / S3, KMS)       |
+-----------------------------------------------------------------------+
```

## Technology Stack

- **Runtime & Language**: Node.js (v20+) with strict TypeScript.
- **Framework**: NestJS backed by Fastify HTTP adapter for high throughput.
- **Monorepo Manager**: Turborepo with pnpm workspaces.
- **Database & ORM**: PostgreSQL paired with Prisma ORM.
- **Caching & Queues**: Redis with BullMQ for asynchronous background job processing.
- **Storage Abstraction**: Cloudflare R2 / AWS S3 / Local Disk via unified `StorageProvider` adapter interface.
- **Authentication & Cryptography**: Argon2id for password hashing, JWT with refresh token rotation, and Node.js native `crypto` for AES-256-GCM.
- **Validation & Serialization**: Zod schemas for runtime request validation.
- **Observability & Logging**: Pino structured logger with Correlation / Trace IDs.
