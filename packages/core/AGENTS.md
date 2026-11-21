# @modular-platform/core AI Rules

## Responsibility
Core platform infrastructure, global NestJS guards/interceptors, custom exception hierarchy, dynamic module registry, and base service contracts.

## Rules
- Core must remain completely generic and application-agnostic.
- Do not import domain specific logic from `packages/modules/*`.
- All base exceptions must extend `BaseException`.
