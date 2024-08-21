import { join } from 'node:path'

import { workspaceManager } from '../libs/workspaceManager/index.js'

export function getAbsolutePath(relativePath?: string | undefined): string {
  if (!relativePath) {
    return workspaceManager.definedAbsoluteRootPath
  }

  return join(workspaceManager.definedAbsoluteRootPath, relativePath)
}
