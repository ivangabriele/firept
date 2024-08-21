import type { Context, Next } from 'koa'
import { GithubActions } from '../actions/GithubActions.js'
import { ResponseError } from '../errors/ResponseError.js'
import { validateRequestBody } from '../utils/validateRequestBody.js'

export const GithubController = {
  async readIssue(ctx: Context, next: Next) {
    try {
      const { issueNumber: issueNumberAsString } = validateRequestBody<{
        issueNumber: string
      }>(ctx.request.query, [['issueNumber', 'string']])

      const result = await GithubActions.getGithubIssue(Number(issueNumberAsString))

      ctx.response.status = 200
      ctx.response.body = result
    } catch (error) {
      ctx.responseError = error instanceof ResponseError ? error : ResponseError.fromError(error)

      await next()
    }
  },
}
