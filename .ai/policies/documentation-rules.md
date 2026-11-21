# Documentation Rules Policy

## Core Principles
1. **Self-Documenting Code**: Clear method names and explicit parameter typing over excessive comments.
2. **OpenAPI / Swagger**: Every controller endpoint must be annotated with Swagger decorators `@ApiOperation`, `@ApiResponse`, and `@ApiTags`.
3. **Module Guidelines**: Every module package must contain an `AGENTS.md` describing its responsibility, boundaries, public API, and domain events.
4. **Architecture Decision Records (ADRs)**: Major design choices must be documented under `docs/` with rationale and trade-offs.
