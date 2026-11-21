---
name: security-check
description: Review code for security vulnerabilities, OWASP Top 10 risks, tenant isolation, and crypto implementations.
---

# Security Check Skill

## Objective
Review code for security vulnerabilities and unsafe implementations.

## Scope
- Authentication & Session validation
- Authorization & RBAC/ABAC verification
- Tenant / Application isolation (`appId` scoping)
- Input sanitization (XSS, SQLi, SSRF)
- Password hashing (Argon2id) & Key Encryption (AES-256-GCM)
- Wallet ledger immutability & Idempotency
- Secrets & credential exposure in logs or code

## Output Format
- **Severity**: [CRITICAL | HIGH | MEDIUM | LOW]
- **Title**: Vulnerability name
- **Location**: File & line number
- **Impact**: Detailed risk assessment
- **Remediation**: Required fix
