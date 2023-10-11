/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  clearMocks: true,
  coverageProvider: 'v8',
  errorOnDeprecated: true,
  extensionsToTreatAsEsm: ['.ts'],
  maxWorkers: '50%',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  preset: 'ts-jest/presets/default-esm',
  rootDir: '..',
  globalSetup: '<rootDir>/config/jest.e2e.setup.ts',
  globalTeardown: '<rootDir>/config/jest.e2e.teardown.ts',
  silent: false,
  testMatch: ['<rootDir>/e2e/**/*.spec.ts'],
  transform: {
    '^.+\\.m?[tj]sx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
}

export default config
