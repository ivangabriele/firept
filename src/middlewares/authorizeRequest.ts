import { B } from 'bhala'
import type { Context, Next } from 'koa'

const PUBLIC_PATHS = ['/', '/.well-known/openapi.yaml', '/favicon.ico']

export function getAuthorizeRequest(apiKey: string) {
  return async function authorizeRequest(ctx: Context, next: Next) {
    if (PUBLIC_PATHS.includes(ctx.request.url)) {
      await next()

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

    if (ctx.request.headers['x-api-key'] !== apiKey) {
      B.warn('[FirePT]', 'Invalid API key provided.')

      ctx.status = 401
      ctx.body = {
        error: 'Unauthorized.',
      }

      return
    }

    await next()
  }
}
