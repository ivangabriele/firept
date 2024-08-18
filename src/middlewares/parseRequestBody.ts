import { bodyParser } from '@koa/bodyparser'

export const parseRequestBody = bodyParser({
  enableTypes: ['json', 'text'],
  encoding: 'utf-8',
  jsonStrict: false,
  textLimit: '1mb',
})
