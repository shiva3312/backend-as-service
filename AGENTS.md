# Modular Backend Platform — AI Agent Governance

Welcome to the **Modular Backend Platform (data-manager)** repository.

This project is a production-grade, highly secure, modular Backend-as-a-Service (BaaS) platform designed using TypeScript, NestJS, Fastify, Prisma (PostgreSQL), Redis, BullMQ, and Cloudflare R2 / S3 storage.

## Core Rules for All AI Agents

1. **Read & Respect Boundaries**: Every module in `packages/modules/` owns its domain. Never access private database models or internal repositories of another module directly. Use public contracts (`*Service` interfaces) or event emissions.
2. **Follow the Engineering Checklist**: All code additions must comply with `Industry-grade-be-project-checklist.md`.
3. **Security First**:
   - Zero tolerance for hardcoded secrets or unvalidated client inputs.
   - All tenant & application data must be isolated (`appId` scoping mandatory).
   - Use Argon2id for password hashing and AES-256-GCM envelope encryption for sensitive file assets.
4. **Immutability & Atomic Operations**: Financial ledger transactions (Wallet module) must be strictly immutable, idempotent, and atomic.
5. **Strict Typing & Quality Gates**: TypeScript `strict: true` must be maintained. Zero `any` casts without explicit justification.

## Navigation & Structure
- Governance & Policy Guidelines: `.ai/policies/`
- Agent Roles & Profiles: `.ai/agents/`
- Automated Workflows & Skills: `.ai/skills/`
- Documentation Hub: `docs/`
- Source Code:
  - Gateway & App API: `apps/api/`
  - Core Infrastructure & Platform Interfaces: `packages/core/`
  - Database & Prisma Schema: `packages/database/`
  - Reusable DTOs & Utilities: `packages/shared/`
  - Independent Feature Modules: `packages/modules/`
