import type { Context, Next } from 'koa'

export async function handleResponseError(ctx: Context, next: Next) {
  if (ctx.responseError) {
    ctx.status = ctx.responseError.status
    ctx.body = {
      error: ctx.responseError.message,
    }

    return
  }

  await next()
}
