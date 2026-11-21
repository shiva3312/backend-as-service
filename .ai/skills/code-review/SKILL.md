---
name: code-review
description: Perform comprehensive code reviews evaluating quality, modularity, security, performance, and test coverage.
---

# Code Review Skill

## Objective
Review proposed code changes against coding standards, security rules, and engineering checklists.

## Checklist
- [ ] TypeScript strict mode satisfied with no unwanted `any`
- [ ] Module boundaries respected (no direct repository access across modules)
- [ ] Zod schema validation applied to API payloads
- [ ] Authentication & RBAC permissions enforced
- [ ] Error handling utilizes custom exception hierarchy
- [ ] Unit & integration tests provided
