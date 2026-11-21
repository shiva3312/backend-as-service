# 05. Security Architecture & Data Privacy

## Security Controls Overview

1. **Argon2id Hashing**: All user authentication passwords are hashed using Argon2id with salt generation.
2. **Rotating JWT Tokens**: Access tokens expire in 15 minutes. Refresh tokens are rotated upon each renewal and stored in HTTP-only, SameSite=Strict cookies or secure storage.
3. **Multi-Tenant Logical Isolation**: Every database table owning user or domain assets includes `appId`. Global NestJS interceptors automatically verify tenant context.
4. **AES-256-GCM Envelope Encryption**:
   - Files uploaded with encryption enabled are encrypted before persistence.
   - A unique 256-bit Data Encryption Key (DEK) is generated per file.
   - The DEK is encrypted using a master Key Encryption Key (KEK) and stored alongside metadata.
5. **OWASP Protections**:
   - Helmet headers (X-Content-Type-Options, X-Frame-Options, CSP).
   - Rate limiting via Fastify Redis rate limit plugin.
   - SQL Injection prevention using Prisma ORM.
   - Input sanitization & Zod schema validation.
