import { B } from 'bhala'
import type { Context } from 'koa'

export class ResponseError extends Error {
  originalError: Error | undefined
  status: number

  constructor(message: string, status = 400, originalError?: Error) {
    super(message)

    this.name = 'ResponseError'
    this.originalError = originalError
    this.status = status

    B.debug('[FirePT]', 'ResponseError', this)
  }

  toHttpResponse(ctx: Context) {
    ctx.status = this.status
    ctx.body = {
      error: this.message,
    }
  }

  static fromError(error: any, status = 500): ResponseError {
    return new ResponseError(String(error?.message), status, error)
  }
}
