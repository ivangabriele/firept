import Router from '@koa/router'
import 'dotenv/config'
import { bodyParser } from '@koa/bodyparser'
import cors from '@koa/cors'
import { B } from 'bhala'
import Koa from 'koa'
import { start as startPublicHost } from 'publichost'

import { FileSystemController } from './controllers/FileSystemController.js'
import { GithubController } from './controllers/GithubController.js'
import { MetaController } from './controllers/MetaController.js'
import { WorkspaceController } from './controllers/WorkspaceController.js'
import { authorizeRequest } from './middlewares/authorizeRequest.js'

const { API_KEY, PORT, PUBLICHOST_API_KEY, PUBLICHOST_HOST, PUBLICHOST_SUBDOMAIN } = process.env

export function start() {
  const koaApp = new Koa()
  const koaRouter = new Router()

  koaRouter
    /**
     * @openapi
     * /:
     *   get:
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
     *                 description: Directory path. It must end with a `/` unless it is the root directory.
     *             required: [path]
     *     responses:
     *       200:
     *         description: List of file paths.
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: string
     *                 description: File path.
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
     *         content:
     *           application/json:
     *             schema:
     *               type: string
     *               description: File content.
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
     *                 description: |
     *                   File path. If the path ends with a `/`, a directory will be created.
     *                   Intermediate directories will be created if they do not exist.
     *               source:
     *                 type: string
     *                 description: File content. Can be empty or undefined.
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
     *     description: Update a file source.
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
     *                 description: New file content. Can be an empty string to clear the file content.
     *             required: [path, source]
     *     responses:
     *        204:
     *          description: File updated.
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
     *                 description: |
     *                   File path. If the path ends with a `/`, the directory will be recursively deleted.
     *                   Cannot be the root directory.
     *             required: [path]
     *     responses:
     *       204:
     *         description: File or directory deleted.
     */
    .post('/file-system/delete', FileSystemController.delete)

    /**
     * @openapi
     * /file-system/move:
     *   post:
     *     operationId: fileSystemMove
     *     description: Move or remame a file or directory.
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               fromPath:
     *                 type: string
     *                 description: Source file or directory path. Directory paths must end with a `/`.
     *               toPath:
     *                 type: string
     *                 description: Destination file or directory path. Directory paths must end with a `/`.
     *             required: [fromPath, toPath]
     *     responses:
     *       204:
     *         description: File updated.
     */
    .post('/file-system/move', FileSystemController.move)

    .post('/github/issue/read', GithubController.readIssue)

    /**
     * @openapi
     * /meta/project-structure:
     *   get:
     *     operationId: metaProjectStructure
     *     description: Get the project main directory structure.
     *     responses:
     *       200:
     *         description: Project main directory structure in YAML format.
     *         content:
     *           application/json:
     *             schema:
     *               type: string
     *               description: Project main directory structure in YAML format.
     */
    .get('/meta/project-structure', MetaController.getProjectStructure)

    /**
     * @openapi
     * /workspace/execute:
     *   post:
     *     operationId: workspaceExecute
     *     description: Execute a shell command in a directory.
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               command:
     *                 type: string
     *                 description: Shell command to execute.
     *               path:
     *                 type: string
     *                 description: |
     *                   Directory path. If not provided, the command will be executed in the root directory.
     *                   Must end with a `/` unless it is the root directory.
     *             required: [command]
     *     responses:
     *       200:
     *         description: Command executed.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 stderr:
     *                   type: string
     *                   description: Standard error output.
     *                 stdout:
     *                   type: string
     *                   description: Standard output.
     */
    .post('/workspace/execute', WorkspaceController.execute)

    .post('/workspace/meta', WorkspaceController.meta)

  koaApp
    .use(koaRouter.allowedMethods())
    .use(cors({ allowHeaders: '*', allowMethods: '*', origin: '*' }))
    .use(authorizeRequest)
    .use(
      bodyParser({
        enableTypes: ['json', 'text'],
        encoding: 'utf-8',
        jsonStrict: false,
        textLimit: '1mb',
      }),
    )
    .use(koaRouter.routes())
    .use(async (ctx, next) => {
      if (ctx.responseError) {
        ctx.status = ctx.responseError.status
        ctx.body = {
          error: ctx.responseError.message,
        }

        return
      }

      await next()
    })

  koaApp.listen(PORT, () => {
    B.info('[FirePT]', `Server listening on port ${PORT}.`)

    startPublicHost(PUBLICHOST_HOST, PUBLICHOST_SUBDOMAIN, PUBLICHOST_API_KEY, {
      localhostAppPort: PORT,
    })
  })
}
