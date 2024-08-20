import { join } from 'node:path'

import { workspaceManager } from '../libs/workspaceManager/index.js'

export function getAbsolutePath(relativePath?: string | undefined): string {
  if (!relativePath) {
    return workspaceManager.loadedAbsoluteRootPath
  }

  return join(workspaceManager.loadedAbsoluteRootPath, relativePath)
}
