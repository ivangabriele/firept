import { promises as fs, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { B } from 'bhala'
import { parse } from 'yaml'
import type { Defined } from '../../types.js'
import type { FireptConfig } from './types.js'

const CONFIG_FILE_NAMES = ['firept.yml', 'firept.yaml']
const { E2E_TEST_WORKSPACE_PATH, E2E_REPOSITORY_PERSONAL_ACCESS_TOKEN, UNIT_TEST_WORKSPACE_PATH } = process.env

class WorkspaceManager {
  #absoluteRootPath: string | undefined
  #config: FireptConfig | undefined

  get definedAbsoluteRootPath(): string {
    const absoluteRootPath = UNIT_TEST_WORKSPACE_PATH ?? this.#absoluteRootPath
    if (!absoluteRootPath) {
      B.error('[FirePT]', '`WorkspaceManager.#absoluteRootPath` is undefined. This should never happen.')

      process.exit(1)
    }

    return absoluteRootPath
  }

  get definedConfig(): FireptConfig {
    if (!this.#config) {
      B.error('[FirePT]', '`WorkspaceManager.#config` is undefined. This should never happen.')

      process.exit(1)
    }

    return this.#config
  }

  get definedPublicUrl(): string {
    const publicBaseUrl = this.definedConfig.publichost
      ? `https://${this.definedConfig.publichost.subdomain}.${this.definedConfig.publichost.host}`
      : this.definedConfig.customPublicUrl
    if (!publicBaseUrl) {
      B.error(
        '[FirePT]',
        'Both `WorkspaceManager.#config.publichost` and `WorkspaceManager.#config.customPublicUrl` are undefined. This should never happen.',
      )

      process.exit(1)
    }

    return publicBaseUrl
  }

  get definedRepository(): Defined<FireptConfig['repository']> {
    if (!this.definedConfig.repository) {
      B.error('[FirePT]', '`WorkspaceManager.#config.repository` is undefined. This should never happen.')

      process.exit(1)
    }

    return {
      ...this.definedConfig.repository,
      ...(E2E_REPOSITORY_PERSONAL_ACCESS_TOKEN
        ? {
            personalAccessToken: E2E_REPOSITORY_PERSONAL_ACCESS_TOKEN,
          }
        : {}),
    }
  }

  get hasDefinedRepository(): boolean {
    return !!this.definedConfig.repository
  }

  async loadConfig(absolutePath: string = E2E_TEST_WORKSPACE_PATH ?? process.cwd()): Promise<FireptConfig | undefined> {
    for (const configFile of CONFIG_FILE_NAMES) {
      if (existsSync(join(absolutePath, configFile))) {
        return await this.#readAndSetConfig(join(absolutePath, configFile))
      }
    }
    if (absolutePath === '/') {
      return undefined
    }

    return await this.loadConfig(join(absolutePath, '..'))
  }

  async #readAndSetConfig(absolutePath: string): Promise<FireptConfig> {
    const source = await fs.readFile(absolutePath, 'utf-8')
    const config = parse(source)

    this.#absoluteRootPath = dirname(absolutePath)
    this.#config = config

    return config
  }
}

export const workspaceManager = new WorkspaceManager()
