---
name: module-development
description: Guide step-by-step creation of new feature modules following monorepo conventions.
---

# Module Development Skill

## Steps
1. Create directory `packages/modules/<module-name>`.
2. Configure `package.json`, `tsconfig.json`, and `AGENTS.md`.
3. Define public interface contracts (`/src/interfaces`).
4. Implement domain service, repository, and controller.
5. Define NestJS module class (`<ModuleName>Module`).
6. Export public service via package barrel `index.ts`.
7. Write unit & integration tests.
