import { readFileSync } from 'node:fs'
import { getAbsolutePath } from 'esm-path'
import { parse } from 'yaml'
import type { FireptConfig } from '../src/libs/workspaceManager/types.js'

let fireptConfig: FireptConfig

export function getFireptConfig(): FireptConfig {
  if (!fireptConfig) {
    const source = readFileSync(getAbsolutePath(import.meta.url, '../firept.yaml'), 'utf-8')

    fireptConfig = parse(source)
  }

  return fireptConfig
}
