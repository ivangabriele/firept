import { promises as fs } from 'node:fs'
import { getAbsolutePath } from 'esm-path'
import yaml from 'json-to-pretty-yaml'
import swaggerJsdoc from 'swagger-jsdoc'

import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const packageJson = require('../../package.json')

const OPEN_API_FILE_PATH = getAbsolutePath(import.meta.url, '../../public/.well-known/openapi.yaml')

/** @type {import('swagger-jsdoc').Options} */
const options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'FirePT',
      description: 'Expose your codebase workspace through a protected public API.',
      version: packageJson.version,
    },
    servers: [{ url: '{{PUBLIC_URL}}' }],
  },
  components: {
    schemas: {
      // biome-ignore lint/style/useNamingConvention: <explanation>
      GithubUserRole: {
        type: 'string',
        enum: [
          'COLLABORATOR',
          'CONTRIBUTOR',
          'FIRST_TIMER',
          'FIRST_TIME_CONTRIBUTOR',
          'MANNEQUIN',
          'MEMBER',
          'NONE',
          'OWNER',
        ],
      },
    },
  },
  apis: ['./src/router.ts'],
  failOnErrors: true,
}

const openApiSpecification = swaggerJsdoc(options)
const openApiSpecificationAsYaml = yaml.stringify({
  ...openApiSpecification,
  components: {
    schemas: {},
  },
})

await fs.writeFile(OPEN_API_FILE_PATH, openApiSpecificationAsYaml, 'utf8')
