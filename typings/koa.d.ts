import 'koa'

declare module 'koa' {
  interface Request {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    body?: { [key: string]: any }
    rawBody: string
  }
}
