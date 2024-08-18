import { FileKind } from '../constants.js'
import { ResponseError } from '../errors/ResponseError.js'

export function parseAndValidatePath(
  path: string | undefined,
  allowedFileKind: FileKind,
): {
  cleanPath: string
  isDirectory: boolean
} {
  if (path === undefined) {
    if (allowedFileKind === FileKind.File) {
      throw new ResponseError('`path` is required for this API route.', 422)
    }

    return {
      cleanPath: './',
      isDirectory: true,
    }
  }

  if (path.startsWith('/')) {
    throw new ResponseError('`path` must be relative to the project root directory. Absolute paths are forbidden.', 422)
  }

  const pathWithCleanEnd = path.endsWith('/') ? path.slice(0, -1) : path
  const cleanPath = pathWithCleanEnd.startsWith('./') ? pathWithCleanEnd : `./${pathWithCleanEnd}`

  const isDirectory = path.endsWith('/') || path === '' || path === '.'
  if (allowedFileKind === FileKind.File && isDirectory) {
    throw new ResponseError('Paths cannot be directories for this API route.', 422)
  }
  if (allowedFileKind === FileKind.Directory && !isDirectory) {
    throw new ResponseError(
      'Paths must be directories for this API route. Did you forget to end the path with a `/`?',
      422,
    )
  }

  return {
    cleanPath,
    isDirectory,
  }
}
