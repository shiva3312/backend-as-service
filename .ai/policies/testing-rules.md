# Testing Rules Policy

## Core Principles
1. **Unit Testing**: Unit test every service method covering success, negative cases, boundary values, and unauthorized access.
2. **Integration Testing**: Test database repositories and module service interactions using an isolated test database.
3. **E2E Testing**: API endpoints must have end-to-end supertest validation covering authentication, permission validation, response structure, and HTTP status codes.
4. **Mocking**: External infrastructure services (S3, Cloudflare R2, Redis, Email SMTP) must be mocked using adapter interfaces during unit tests.
5. **Determinism**: Tests must be 100% deterministic with clean setup and teardown hooks (`beforeEach`, `afterEach`).
