import { join } from 'node:path'
import { B } from 'bhala'

import { workspaceManager } from '../libs/workspaceManager/index.js'

export function getAbsolutePath(relativePath?: string | undefined): string {
  if (!workspaceManager.absoluteRootPath) {
    B.error('[FirePT]', '`workspaceManager.absoluteRootPath` is undefined. This should never happen.')

    process.exit(1)
  }

  if (!relativePath) {
    return workspaceManager.absoluteRootPath
  }

  return join(workspaceManager.absoluteRootPath, relativePath)
}
