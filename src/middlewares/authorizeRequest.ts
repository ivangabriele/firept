import { B } from 'bhala'
import type { Context, Next } from 'koa'

const { API_KEY } = process.env

export async function authorizeRequest(ctx: Context, next: Next) {
  if (ctx.request.url === '/') {
    next()

    return
  }

  if (!ctx.request.headers['x-api-key']) {
    B.warn('[FirePT]', 'No API key provided.')

    ctx.status = 403
    ctx.body = {
      error: 'Forbidden.',
    }

    return
  }

  if (ctx.request.headers['x-api-key'] !== API_KEY) {
    B.warn('[FirePT]', 'Invalid API key provided.')

    ctx.status = 401
    ctx.body = {
      error: 'Unauthorized.',
    }

    return
  }

  await next()
}
