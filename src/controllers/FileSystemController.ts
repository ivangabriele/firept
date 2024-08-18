import type { Context, Next } from 'koa'

import { B } from 'bhala'
import { FileSystemActions } from '../actions/FileSystemActions.js'
import { FileKind } from '../constants.js'
import { ResponseError } from '../errors/ResponseError.js'
import { parseAndValidatePath } from '../utils/parseAndValidatePath.js'
import { requireNotNullish } from '../utils/requireNotNullish.js'
import { validateRequestBody } from '../utils/validateRequestBody.js'

export const FileSystemController = {
  async list(ctx: Context, next: Next) {
    try {
      const { path } = validateRequestBody<{
        path: string
      }>(ctx.request.body, [['path', 'string']])
      const { cleanPath } = parseAndValidatePath(path, FileKind.Directory)

      const result = await FileSystemActions.list(cleanPath)

      ctx.status = 200
      ctx.body = result
    } catch (error) {
      ctx.responseError = error instanceof ResponseError ? error : ResponseError.fromError(error)

      await next()
    }
  },

  async read(ctx: Context, next: Next) {
    try {
      const { path } = validateRequestBody<{
        path: string
      }>(ctx.request.body, [['path', 'string']])
      const { cleanPath } = parseAndValidatePath(path, FileKind.File)

      const result = await FileSystemActions.readFile(cleanPath)

      ctx.status = 200
      ctx.set('Content-Type', 'text/plain')
      ctx.body = result
    } catch (error) {
      ctx.responseError = error instanceof ResponseError ? error : ResponseError.fromError(error)

      await next()
    }
  },

  async create(ctx: Context, next: Next) {
    try {
      const { path } = validateRequestBody<{
        path: string
      }>(ctx.request.body, [['path', 'string']])
      const source = requireNotNullish(ctx.request.body, 'ctx.request.body').source
      if (!['string', 'undefined'].includes(typeof source)) {
        throw new ResponseError('`source` request body property must either be a string or be undefined.', 422)
      }
      const { cleanPath, isDirectory } = parseAndValidatePath(path, FileKind.Both)

      await FileSystemActions.create(cleanPath, source, isDirectory)

      B.info('[FirePT]', `Created file or directory at path: \`${path}\`.`)

      ctx.status = 201
    } catch (error) {
      ctx.responseError = error instanceof ResponseError ? error : ResponseError.fromError(error)

      await next()
    }
  },

  async update(ctx: Context, next: Next) {
    try {
      const { path, source } = validateRequestBody<{
        path: string
        source: string
      }>(ctx.request.body, [
        ['path', 'string'],
        ['source', 'string'],
      ])

      await FileSystemActions.update(path, source)

      B.info('[FirePT]', `Updated file at path: \`${path}\`.`)

      ctx.status = 204
    } catch (error) {
      ctx.responseError = error instanceof ResponseError ? error : ResponseError.fromError(error)

      await next()
    }
  },

  async delete(ctx: Context, next: Next) {
    try {
      const { path } = validateRequestBody<{
        path: string
      }>(ctx.request.body, [['path', 'string']])

      await FileSystemActions.delete(path)

      B.info('[FirePT]', `Deleted file or directory at path: \`${path}\`.`)

      ctx.status = 204
    } catch (error) {
      ctx.responseError = error instanceof ResponseError ? error : ResponseError.fromError(error)

      await next()
    }
  },

  async move(ctx: Context, next: Next) {
    try {
      const { fromPath, toPath } = validateRequestBody<{
        fromPath: string
        toPath: string
      }>(ctx.request.body, [
        ['fromPath', 'string'],
        ['toPath', 'string'],
      ])
      const { cleanPath: fromCleanPath, isDirectory: isFromPathDirectory } = parseAndValidatePath(
        fromPath,
        FileKind.Both,
      )
      const { cleanPath: toCleanPath, isDirectory: isToPathDirectory } = parseAndValidatePath(toPath, FileKind.Both)
      if (isFromPathDirectory !== isToPathDirectory) {
        throw new ResponseError(
          [
            'The source and destination paths must both be directories or files.',
            'They cannot be mixed. Did you forget to end the paths with a `/`?',
          ].join(' '),
          422,
        )
      }

      await FileSystemActions.move(fromCleanPath, toCleanPath)

      B.info('[FirePT]', `Moved file or directory: \`${fromCleanPath} => ${toCleanPath}\`.`)

      ctx.status = 204
    } catch (error) {
      ctx.responseError = error instanceof ResponseError ? error : ResponseError.fromError(error)

      await next()
    }
  },
}
