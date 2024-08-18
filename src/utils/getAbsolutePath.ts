import { join } from 'node:path'

const { WORKSPACE_PATH } = process.env

export function getAbsolutePath(relativePath?: string | undefined): string {
  if (!relativePath) {
    return WORKSPACE_PATH
  }

  return join(WORKSPACE_PATH, relativePath)
}
