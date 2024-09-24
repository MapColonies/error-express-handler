module.exports = {
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  coverageReporters: ['text', 'html'],
  rootDir: '../../.',
  testMatch: ['<rootDir>/tests/**/*.spec.ts'],
  collectCoverage: true,
  moduleDirectories: ['node_modules', 'src'],
  collectCoverageFrom: ['<rootDir>/src/**/*.{ts}', '!**/node_modules/**', '!**/vendor/**'],
  preset: 'ts-jest',
  testEnvironment: 'node',
};
