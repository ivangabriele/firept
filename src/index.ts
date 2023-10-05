import 'dotenv/config'
import Koa from 'koa'
import { bodyParser } from '@koa/bodyparser'
import cors from '@koa/cors'
import Router from '@koa/router'
import serve from 'koa-static'

import { searchWeb } from './actions/searchWeb.js'

const app = new Koa()
const router = new Router()

router
  .get('/', (ctx, next) => {
    ctx.body = {}
  })
  .get('/web/search', async (ctx, next) => {
    const results = await searchWeb(String(ctx.request.query.query))

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
// .use(router.allowedMethods())

app.listen(3333)
