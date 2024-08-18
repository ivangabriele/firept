import { getAbsolutePath } from 'esm-path'
import yaml from 'json-to-pretty-yaml'
import { promises as fs } from 'node:fs'
import swaggerJsdoc from "swagger-jsdoc"

import { createRequire } from 'module'
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
    servers: [{ url: 'https://monitorfish.publichost.org' }]
  },
  components: {
    schemas: {}
  },
  apis: ['./src/index.ts'],
  failOnErrors: true,
}

const openApiSpecification = swaggerJsdoc(options)
const openApiSpecificationAsYaml = yaml.stringify({
  ...openApiSpecification,
  components: {
    schemas: {}
  }
})

await fs.writeFile(OPEN_API_FILE_PATH, openApiSpecificationAsYaml, 'utf8')
