import { promises as fs } from 'node:fs'
import { getAbsolutePath } from 'esm-path'

import { B } from 'bhala'
import { CacheKey } from '../libs/cache/constants.js'
import { cache } from '../libs/cache/index.js'
import { workspaceManager } from '../libs/workspaceManager/index.js'

const OPEN_API_FILE_PATH = getAbsolutePath(import.meta.url, '../../public/.well-known/openapi.yaml')

export const OpenApiActions = {
  async getDocument(): Promise<string> {
    if (!workspaceManager.config) {
      B.error('[FirePT]', '`workspaceManager.config` is undefined. This should never happen.')

      process.exit(1)
    }

    const cachedOpenApiDocumentAsYaml = cache.get(CacheKey.OPENAPI_DOCUMENT_AS_YAML)
    if (cachedOpenApiDocumentAsYaml) {
      return cachedOpenApiDocumentAsYaml
    }

    const rawOpenApiDocumentAsYaml = await fs.readFile(OPEN_API_FILE_PATH, 'utf-8')
    const openApiDocumentAsYaml = rawOpenApiDocumentAsYaml
      .replace(/{{PUBLICHOST_SUBDOMAIN}}/, workspaceManager.config.publichost.subdomain)
      .replace(/{{PUBLICHOST_HOST}}/, workspaceManager.config.publichost.host)

    cache.set(CacheKey.OPENAPI_DOCUMENT_AS_YAML, openApiDocumentAsYaml)

    return openApiDocumentAsYaml
  },
}
