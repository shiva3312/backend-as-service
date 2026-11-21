# Security Rules Policy

## Core Principles
1. **Input Validation**: Validate every API request payload using Zod schemas or NestJS Class Validators.
2. **Authentication & Password Hashing**: Use Argon2id for passwords. Rotate JWT refresh tokens on every issue.
3. **Authorization**: Guard all protected endpoints with `@RequirePermissions(...)` or `@RequireRole(...)`. Verify resource ownership server-side.
4. **Encryption**: AES-256-GCM envelope encryption for sensitive uploaded files. Store encrypted DEK alongside metadata.
5. **Rate Limiting**: Enforce global and per-endpoint rate limits using Redis token buckets.
6. **No Credentials in Code**: Always load configurations from validated environment variables (`ConfigService`).
