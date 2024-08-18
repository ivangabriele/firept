import cors from '@koa/cors'
import { B } from 'bhala'
import Koa from 'koa'
import { start as startPublicHost } from 'publichost'
import 'dotenv/config'

import { authorizeRequest } from './middlewares/authorizeRequest.js'
import { handleResponseError } from './middlewares/handleResponseError.js'
import { parseRequestBody } from './middlewares/parseRequestBody.js'
import { koaRouter } from './router.js'

const { PORT, PUBLICHOST_API_KEY, PUBLICHOST_HOST, PUBLICHOST_SUBDOMAIN } = process.env

export const server = {
  start() {
    const koaApp = new Koa()

    koaApp
      .use(koaRouter.allowedMethods())
      .use(cors({ allowHeaders: '*', allowMethods: '*', origin: '*' }))
      .use(authorizeRequest)
      .use(parseRequestBody)
      .use(koaRouter.routes())
      .use(handleResponseError)

    koaApp.listen(PORT, () => {
      B.info('[FirePT]', `Server listening on port ${PORT}.`)

      startPublicHost(PUBLICHOST_HOST, PUBLICHOST_SUBDOMAIN, PUBLICHOST_API_KEY, {
        localhostAppPort: PORT,
      })
    })
  },
}
