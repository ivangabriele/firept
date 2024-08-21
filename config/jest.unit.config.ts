import type { Config } from 'jest'

const jestConfig: Config = {
  clearMocks: true,
  errorOnDeprecated: true,
  extensionsToTreatAsEsm: ['.ts'],
  maxWorkers: '50%',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  rootDir: '..',
  silent: false,
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/**/__tests__/**/*.test.ts'],
  transform: {
    '.*\\.(j|t)s$': '@swc/jest',
  },
  transformIgnorePatterns: ['node_modules/?!(del)/'],
}

export default jestConfig
