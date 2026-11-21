---
name: component-review
description: Review structural components (Controllers, Services, Repositories, Adapters) for correct design patterns.
---

# Component Review Skill

## Guidelines
- **Controllers**: Thin controllers, delegation to services, NestJS OpenAPI annotations.
- **Services**: Encapsulate domain logic, publish events, coordinate repositories.
- **Repositories**: Direct Prisma access restricted to module boundary.
- **Adapters**: Storage, Cache, Email abstractions implementing core interfaces.
