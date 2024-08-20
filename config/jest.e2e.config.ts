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
  testMatch: ['<rootDir>/e2e/**/*.spec.ts'],
  transform: {
    '.*\\.(j|t)s$': '@swc/jest',
  },
  transformIgnorePatterns: ['node_modules/?!(ky)/'],
}

// biome-ignore lint/style/noDefaultExport: <explanation>
export default jestConfig
