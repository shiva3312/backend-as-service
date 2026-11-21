---
name: database-review
description: Review Prisma schemas, indexes, foreign keys, migrations, and query performance.
---

# Database Review Skill

## Checklist
- [ ] Primary keys use UUIDv4 or CUID2
- [ ] Foreign key relationships explicitly declared with index coverage
- [ ] `appId` field present for multi-tenant data entities
- [ ] Compound indexes created for high-frequency query filters
- [ ] Decimal or BigInt used for monetary/credit fields
- [ ] Soft delete (`deletedAt`) standard applied where required
- [ ] Migrations version-controlled and tested
