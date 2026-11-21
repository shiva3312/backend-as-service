# Auth Module AI Guidance

## Domain Ownership
Authentication, password hashing (Argon2id), registration, token issuance, refresh token rotation, session verification.

## Public Service Contract
Exports `IAuthService` via `index.ts`. Other modules must interact with Auth through `IAuthService`.
