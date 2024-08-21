import cors from '@koa/cors'
import { B } from 'bhala'
import Koa from 'koa'
import serve from 'koa-static'
import { start as startPublicHost } from 'publichost'

import { workspaceManager } from './libs/workspaceManager/index.js'
import { getAuthorizeRequest } from './middlewares/authorizeRequest.js'
import { handleResponseError } from './middlewares/handleResponseError.js'
import { parseRequestBody } from './middlewares/parseRequestBody.js'
import { koaRouter } from './router.js'

export const server = {
  async start() {
    const fireptConfig = await workspaceManager.loadConfig()
    if (!fireptConfig) {
      B.error(
        '[FirePT]',
        'No firept.[yml,yaml] config file found in the current working directory or any of its parent directories.',
      )
      B.info(
        '[FirePT]',
        [
          'Please refer to the documentation to get started:',
          'https://github.com/ivangabriele/firept?tab=readme-ov-file#getting-started',
        ].join('\n'),
      )

      process.exit(1)
    }

    const koaApp = new Koa()

    koaApp
      .use(koaRouter.allowedMethods())
      .use(cors({ allowHeaders: '*', allowMethods: '*', origin: '*' }))
      .use(getAuthorizeRequest(fireptConfig.server.apiKey))
      .use(parseRequestBody)
      .use(koaRouter.routes())
      .use(handleResponseError)
      .use(
        serve('./public', {
          defer: true,
          hidden: true,
        }),
      )

    koaApp.listen(fireptConfig.server.port, () => {
      B.info('[FirePT]', `Server listening on port ${fireptConfig.server.port}.`)

      if (fireptConfig.publichost) {
        startPublicHost(
          fireptConfig.publichost.host,
          fireptConfig.publichost.subdomain,
          fireptConfig.publichost.apiKey,
          {
            localhostAppPort: fireptConfig.server.port.toString(),
          },
        )
      }
    })
  },
}
