import Koa from 'koa'
import serve from 'koa-static'

export function start() {
  const app = new Koa()

  app.use(
    serve('./public', {
      // defer: true,
      hidden: true,
    }),
  )
}
