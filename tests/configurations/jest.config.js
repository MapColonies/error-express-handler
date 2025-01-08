module.exports = {
  transform: {
    '^.+\\.ts$': '@swc/jest',
  },
  coverageReporters: ['text', 'html'],
  rootDir: '../../.',
  testMatch: ['<rootDir>/tests/**/*.spec.ts'],
  collectCoverage: true,
  moduleDirectories: ['node_modules', 'src'],
  collectCoverageFrom: ['<rootDir>/src/**/*.{ts}', '!**/node_modules/**', '!**/vendor/**'],
  testEnvironment: 'node',
};
