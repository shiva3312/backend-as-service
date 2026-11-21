# Architecture Rules Policy

## Core Principles
1. **Module Independence**: Modules inside `packages/modules/*` must be strictly decoupled. Cross-module access must happen exclusively through public exported interfaces (`*Service`) or domain events.
2. **Layering Hierarchy**:
   - `apps/api`: Controllers, routes, request handlers.
   - `packages/modules/*`: Domain logic, services, module repositories.
   - `packages/core`: Global guards, interceptors, module registry, platform contracts.
   - `packages/database`: Prisma models and database access layer.
   - `packages/shared`: Shared DTOs, interfaces, and schemas.
3. **No Direct Database Bypassing**: Controllers must never query Prisma directly; they must delegate to service classes.
4. **Tenant Isolation**: Every database entity associated with an application must have an `appId` field and enforced query filters.
