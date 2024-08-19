import { promises as fs, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { parse } from 'yaml'
import type { FireptConfig } from './types.js'

const CONFIG_FILE_NAMES = ['firept.yml', 'firept.yaml']

class WorkspaceManager {
  absoluteRootPath: string | undefined
  config: FireptConfig | undefined

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

    this.absoluteRootPath = dirname(absolutePath)
    this.config = config

    return config
  }
}

export const workspaceManager = new WorkspaceManager()
