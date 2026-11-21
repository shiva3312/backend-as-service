---
name: testing
description: Implement unit, integration, and end-to-end tests for platform services and APIs.
---

# Testing Skill

## Guidelines
- Unit tests use Jest with mocked dependencies.
- Integration tests use isolated test DB transactions or Testcontainers PostgreSQL.
- API E2E tests use Supertest against the NestJS Fastify app instance.
- Edge cases tested: invalid tokens, expired sessions, insufficient wallet balance, tenant data isolation violations.
