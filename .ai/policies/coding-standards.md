# Coding Standards Policy

## Core Principles
1. **TypeScript Strict Mode**: `strict: true`, no implicit `any`, no unhandled promises.
2. **Naming Conventions**:
   - PascalCase for classes, interfaces, types, decorators, and enums.
   - camelCase for functions, variables, parameters, and property names.
   - UPPER_SNAKE_CASE for global constants and environment keys.
   - kebab-case for file names and directory names.
3. **Immutability & Pure Functions**: Prefer `readonly` modifiers, `const` over `let`, pure functions where applicable.
4. **DRY & Reusability**: Extract repetitive business validation or data transformation logic into shared helpers or utilities in `packages/shared`.
5. **Error Handling**: Use custom standard exceptions extending `BaseException` from `packages/core`. Never swallow errors quietly.
