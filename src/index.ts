import 'dotenv/config'
import Koa from 'koa'
import { bodyParser } from '@koa/bodyparser'
import cors from '@koa/cors'
import Router from '@koa/router'
import serve from 'koa-static'

import { searchWeb } from './actions/searchWeb.js'
import { fetchWeb } from './actions/fetchWeb.js'

const PORT = process.env.PORT || 3333

export function start() {
  const app = new Koa()
  const router = new Router()

  router
    .get('/', (ctx, next) => {
      ctx.body = {}
    })

    .get('/web/fetch', async (ctx, next) => {
      const url = String(ctx.request.query.url)

      const sourceAsMarkdown = await fetchWeb(url)
      if (!sourceAsMarkdown) {
        ctx.response.status = 400
        ctx.response.body = {
          error: 'Failed to fetch or convert web page. Please try again from another website.',
        }

        return
      }

      ctx.response.body = { sourceAsMarkdown }
    })

    .get('/web/search', async (ctx, next) => {
      const query = String(ctx.request.query.query)

      const results = await searchWeb(query)

      ctx.response.body = results
    })

  app
    .use(bodyParser())
    .use(
      cors({
        allowHeaders: '*',
        allowMethods: '*',
        origin: '*',
      }),
    )
    .use(
      serve('./public', {
        hidden: true,
      }),
    )
    .use(router.routes())

  app.listen(PORT, () => console.info('[FirePT]', `Server listening on port ${PORT}.`))
}

start()
