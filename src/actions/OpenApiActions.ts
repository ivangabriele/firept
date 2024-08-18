import yaml from 'json-to-pretty-yaml'
import swaggerJsdoc, { type Options } from 'swagger-jsdoc'

import { createRequire } from 'module'
import { cache } from '../libs/cache.js'
const require = createRequire(import.meta.url)
const packageJson = require('../../package.json')

const options: Options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'FirePT',
      description: 'Expose your codebase workspace through a protected public API.',
      version: packageJson.version,
    },
    servers: [{ url: 'https://monitorfish.publichost.org' }],
  },
  components: {
    schemas: {},
  },
  apis: ['./src/index.ts'],
  failOnErrors: true,
}

export const OpenApiActions = {
  getDocument(): string {
    const cachedOpenApiSpecsAsYaml = cache.get<string>('OPEN_API_SPECS_AS_YAML')
    if (cachedOpenApiSpecsAsYaml) {
      return cachedOpenApiSpecsAsYaml
    }

    const openApiSpecs = swaggerJsdoc(options)
    const openApiSpecsAsYaml = yaml.stringify({
      ...openApiSpecs,
      components: {
        schemas: {},
      },
    })

    cache.set('OPEN_API_SPECS_AS_YAML', openApiSpecsAsYaml)

    return openApiSpecsAsYaml
  },
}
