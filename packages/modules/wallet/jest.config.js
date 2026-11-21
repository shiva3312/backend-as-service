module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.(spec|test|integration-spec|stress-spec)\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@modular-platform/database$': '<rootDir>/../../../../packages/database/src/index.ts',
    '^@modular-platform/core$': '<rootDir>/../../../../packages/core/src/index.ts',
    '^@modular-platform/shared$': '<rootDir>/../../../../packages/shared/src/index.ts',
  },
  modulePathIgnorePatterns: ['/dist/'],
  testEnvironment: 'node',
};
