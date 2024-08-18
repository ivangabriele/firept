import type { Context } from 'koa'
import { getGithubIssue } from '../actions/getGithubIssue.js'
import { validateRequestBody } from '../utils/validateRequestBody.js'

export const GithubController = {
  async readIssue(ctx: Context) {
    const { issueNumber } = validateRequestBody<{
      issueNumber: number
    }>(ctx.request.body, [['issueNumber', 'number']])

    const result = await getGithubIssue(issueNumber)
    if (result instanceof Error) {
      ctx.response.status = 400
      ctx.response.body = {
        error: result.message,
      }

      return
    }

    ctx.response.status = 200
    ctx.response.body = {
      content: result,
    }
  },
}
