import { bodyParser } from '@koa/bodyparser'
import cors from '@koa/cors'
import Router from '@koa/router'
import 'dotenv/config'
import Koa from 'koa'
import { start as startPublicHost } from 'publichost'

import { B } from 'bhala'
import serve from 'koa-static'
import { FileSystemController } from './controllers/FileSystemController.js'
import { GithubController } from './controllers/GithubController.js'
import { MetaController } from './controllers/MetaController.js'
import { WorkspaceController } from './controllers/WorkspaceController.js'

const { API_KEY, PORT, PUBLICHOST_API_KEY, PUBLICHOST_HOST, PUBLICHOST_SUBDOMAIN } = process.env

export function start() {
  const app = new Koa()
  const router = new Router()

  router
    /**
     * @openapi
     * /:
     *   post:
     *     operationId: index
     *     description: Get the OpenAPI document.
     *     responses:
     *       200:
     *         description: OpenAPI document.
     */
    .get('/', MetaController.getOpenApiDocument)

    /**
     * @openapi
     * /file-system/list:
     *   post:
     *     operationId: fileSystemList
     *     description: List files in a directory.
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               path:
     *                 type: string
     *                 description: Directory path.
     *             required: [path]
     *     responses:
     *       200:
     *         description: List of file paths.
     */
    .post('/file-system/list', FileSystemController.list)

    /**
     * @openapi
     * /file-system/read:
     *   post:
     *     operationId: fileSystemRead
     *     description: Read a file.
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               path:
     *                 type: string
     *                 description: File path.
     *             required: [path]
     *     responses:
     *       200:
     *         description: File content.
     */
    .post('/file-system/read', FileSystemController.read)

    /**
     * @openapi
     * /file-system/create:
     *   post:
     *     operationId: fileSystemCreate
     *     description: Create a file or directory.
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               path:
     *                 type: string
     *                 description: File path. If the path ends with a `/`, a directory will be created.
     *               source:
     *                 type: string
     *                 description: File content.
     *             required: [path]
     *     responses:
     *       201:
     *         description: File or directory created.
     */
    .post('/file-system/create', FileSystemController.create)

    /**
     * @openapi
     * /file-system/update:
     *   post:
     *     operationId: fileSystemUpdate
     *     description: Update a file.
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               path:
     *                 type: string
     *                 description: File path.
     *               source:
     *                 type: string
     *                 description: File content.
     *             required: [path, source]
     *     responses:
     *       204:
     *         description: File updated.
     */
    .post('/file-system/update', FileSystemController.update)

    /**
     * @openapi
     * /file-system/delete:
     *   post:
     *     operationId: fileSystemDelete
     *     description: Delete a file or directory.
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               path:
     *                 type: string
     *                 description: File path. If the path ends with a `/`, a directory will be created.
     *             required: [path]
     *     responses:
     *       204:
     *         description: File or directory deleted.
     */
    .post('/file-system/delete', FileSystemController.delete)

    .post('/github/issue/read', GithubController.readIssue)

    .post('/workspace/execute', WorkspaceController.execute)
    .post('/workspace/meta', WorkspaceController.meta)

  app
    .use(
      cors({
        allowHeaders: '*',
        allowMethods: '*',
        origin: '*',
      }),
    )
    .use(bodyParser())
    .use(
      serve('./public', {
        // defer: true,
        hidden: true,
      }),
    )
    .use((ctx, next) => {
      B.debug('[FirePT]', `Incoming HTTP Request ${ctx.method} ${ctx.url}.`)

      next()
    })
    // .use((ctx, next) => {
    //   if (ctx.request.url === '/') {
    //     next()

    //     return
    //   }

    //   console.log(ctx.request.headers)

    //   if (!ctx.request.headers['x-api-key']) {
    //     B.warn('[FirePT]', 'No API key provided.')

    //     ctx.status = 403
    //     ctx.body = {
    //       error: 'Forbidden.',
    //     }

    //     return
    //   }

    //   if (ctx.request.headers['x-api-key'] !== API_KEY) {
    //     B.warn('[FirePT]', 'Invalid API key provided.')

    //     ctx.status = 401
    //     ctx.body = {
    //       error: 'Unauthorized.',
    //     }

    //     return
    //   }

    //   next()
    // })
    .use(router.routes())
    .use(async (ctx, next) => {
      if (ctx.responseError) {
        ctx.responseError.toHttpResponse(ctx)

        return
      }

      await next()
    })

  app.listen(PORT, () => {
    B.info('[FirePT]', `Server listening on port ${PORT}.`)

    startPublicHost(PUBLICHOST_HOST, PUBLICHOST_SUBDOMAIN, PUBLICHOST_API_KEY, {
      localhostAppPort: PORT,
    })
  })
}

start()
