import type { Context, Next } from 'koa'
import { GithubActions } from '../actions/GithubActions.js'
import { ResponseError } from '../errors/ResponseError.js'
import { validateRequestBody } from '../utils/validateRequestBody.js'

export const GithubController = {
  async readIssue(ctx: Context, next: Next) {
    try {
      const { issueNumber } = validateRequestBody<{
        issueNumber: number
      }>(ctx.request.body, [['issueNumber', 'number']])

      const result = await GithubActions.getGithubIssue(issueNumber)

      ctx.response.status = 200
      ctx.response.body = {
        content: result,
      }
    } catch (error) {
      ctx.responseError = error instanceof ResponseError ? error : ResponseError.fromError(error)

      await next()
    }
  },
}
