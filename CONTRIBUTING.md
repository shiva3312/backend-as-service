# Contribution Guidelines

Thank you for contributing to `data-manager`.

## Development Setup

1. **Prerequisites**:
   - Node.js >= 20.x
   - pnpm >= 9.x
   - Docker & Docker Compose

2. **Installation & Workspace Build**:
   ```bash
   pnpm install
   pnpm build
   ```

3. **Running Database & Infrastructure**:
   ```bash
   docker-compose up -d
   pnpm db:migrate
   pnpm db:seed
   ```

4. **Running Development Mode**:
   ```bash
   pnpm dev
   ```

## Coding & Architectural Guidelines
- All code must pass `pnpm lint`, `pnpm typecheck`, and `pnpm test`.
- New feature modules must be placed under `packages/modules/<module-name>` and follow the standard structure.
- Follow the 20-point checklist in `Industry-grade-be-project-checklist.md`.
- Commit messages must conform to Conventional Commits format (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`).
