import type { Context, Next } from 'koa'

import { FileSystemActions } from '../actions/FileSystemActions.js'
import { OpenApiActions } from '../actions/OpenApiActions.js'
import { ResponseError } from '../errors/ResponseError.js'

export const MetaController = {
  async getOpenApiDocument(ctx: Context, next: Next) {
    try {
      const result = await OpenApiActions.getDocument()

      ctx.status = 200
      ctx.body = result
    } catch (error) {
      ctx.responseError = error instanceof ResponseError ? error : ResponseError.fromError(error)

      await next()
    }
  },

  async getProjectStructure(ctx: Context, next: Next) {
    try {
      const result = await FileSystemActions.getDirectoryTree()

      ctx.status = 200
      ctx.body = result
    } catch (error) {
      ctx.responseError = error instanceof ResponseError ? error : ResponseError.fromError(error)

      await next()
    }
  },
}
