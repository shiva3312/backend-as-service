# Security Policy & Guidelines

## Security Baseline

The `data-manager` platform adheres to standard OWASP Top 10 guidelines and strict enterprise security controls.

### 1. Authentication & Session Management
- **Password Hashing**: Argon2id with strong salt and memory parameter bounds.
- **Tokens**: JWT access tokens (short-lived) paired with rotating refresh tokens stored in HTTP-only secure cookies or protected token storage.
- **Brute Force Protection**: IP and user-rate limiting via Redis token bucket.

### 2. Tenant Isolation & Authorization
- Every API operation validates the `appId` header/token claim.
- Role-Based Access Control (RBAC) and Resource-Level Permissions are verified on every endpoint.

### 3. Data Protection & Encryption
- **Data in Transit**: TLS 1.3 enforced for all external endpoints.
- **Data at Rest**: Sensitive database fields encrypted. File assets support envelope encryption (AES-256-GCM).
- **Secrets Management**: Absolute prohibition of committed secrets. Environment variables validated at startup.

### 4. Input Sanitization & Injection Defense
- Strict input validation using Zod DTO schemas.
- SQL injection prevention via Prisma parameterized ORM queries.
- XSS and SSRF protection headers enabled via Fastify Helmet.

### 5. Audit Logging
- Security-critical events (login failures, privilege escalation, balance updates, key redemptions) logged with correlation IDs, IP address, user agent, and timestamp.
