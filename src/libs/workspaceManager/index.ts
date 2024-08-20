import { promises as fs, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { B } from 'bhala'
import { parse } from 'yaml'
import type { Defined } from '../../types.js'
import type { FireptConfig } from './types.js'

const CONFIG_FILE_NAMES = ['firept.yml', 'firept.yaml']
// Used to inject the workspace path in unit tests
const { WORKSPACE_PATH } = process.env

class WorkspaceManager {
  #absoluteRootPath: string | undefined
  #config: FireptConfig | undefined

  get loadedAbsoluteRootPath(): string {
    const absoluteRootPath = WORKSPACE_PATH ?? this.#absoluteRootPath
    if (!absoluteRootPath) {
      B.error('[FirePT]', '`WorkspaceManager.#absoluteRootPath` is undefined. This should never happen.')

      process.exit(1)
    }

    return absoluteRootPath
  }

  get loadedConfig(): FireptConfig {
    if (!this.#config) {
      B.error('[FirePT]', '`WorkspaceManager.#config` is undefined. This should never happen.')

      process.exit(1)
    }

    return this.#config
  }

  get definedRepository(): Defined<FireptConfig['repository']> {
    if (!this.loadedConfig.repository) {
      B.error('[FirePT]', '`WorkspaceManager.#config.repository` is undefined. This should never happen.')

      process.exit(1)
    }

    return this.loadedConfig.repository
  }

  get hasDefinedRepository(): boolean {
    return !!this.loadedConfig.repository
  }

  async loadConfig(absolutePath: string = process.cwd()): Promise<FireptConfig | undefined> {
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

    this.#absoluteRootPath = WORKSPACE_PATH ?? dirname(absolutePath)
    this.#config = config

    return config
  }
}

export const workspaceManager = new WorkspaceManager()
