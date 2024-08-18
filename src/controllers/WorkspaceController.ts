import { B } from 'bhala'
import type { Context, Next } from 'koa'
import { WorkspaceActions } from '../actions/WorkspaceActions.js'
import { FileKind } from '../constants.js'
import { ResponseError } from '../errors/ResponseError.js'
import { parseAndValidatePath } from '../utils/parseAndValidatePath.js'
import { requireNotNullish } from '../utils/requireNotNullish.js'
import { validateRequestBody } from '../utils/validateRequestBody.js'

export const WorkspaceController = {
  async execute(ctx: Context, next: Next) {
    try {
      const { command } = validateRequestBody<{
        command: string
      }>(ctx.request.body, [['command', 'string']])
      const path = requireNotNullish(ctx.request.body, 'ctx.request.body').path
      if (!['string', 'undefined'].includes(typeof path)) {
        throw new ResponseError('`path` request body property must either be a string or be undefined.', 422)
      }
      const { cleanPath } = parseAndValidatePath(path, FileKind.Directory)

      const result = await WorkspaceActions.execute(command, cleanPath)

      B.info('[FirePT]', `Command executed: \`${command}\`.`)

      ctx.response.status = 200
      ctx.response.body = result
    } catch (error) {
      ctx.responseError = error instanceof ResponseError ? error : ResponseError.fromError(error)

      await next()
    }
  },

  async meta(ctx: Context) {
    const result = await WorkspaceActions.meta()

    ctx.response.status = 200
    ctx.response.body = result
  },
}
