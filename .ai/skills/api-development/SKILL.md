---
name: api-development
description: Design REST API endpoints, DTOs, Zod schemas, and OpenAPI specifications.
---

# API Development Skill

## Guidelines
- Follow REST conventions (`GET`, `POST`, `PATCH`, `DELETE`).
- Version endpoints using URI prefix (`/v1/...`).
- Validate request bodies and params using Zod/Class-Validator DTOs.
- Use standardized response wrapper (`{ success: true, data: ..., error: null }`).
- Annotate with Swagger `@ApiOperation` and `@ApiResponse`.
