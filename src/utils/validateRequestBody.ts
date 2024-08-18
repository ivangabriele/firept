import { ResponseError } from '../errors/ResponseError.js'
import type { AnyObject } from '../types.js'

type Requirement<T extends AnyObject> = [keyof T, 'string' | 'number' | 'boolean']

const isObject = (value: unknown): value is AnyObject => typeof value === 'object' && value !== null

export function validateRequestBody<T extends AnyObject>(requestBody: unknown, requirements: Requirement<T>[]): T {
  if (!isObject(requestBody)) {
    throw new ResponseError('Request body must be an object.', 422)
  }

  requirements.every(([key, type]) => {
    // @ts-ignore
    if (requestBody[key] === undefined) {
      throw new ResponseError(`Missing \`${String(key)}\` request body property.`, 422)
    }

    // biome-ignore lint/suspicious/useValidTypeof: <explanation>
    if (typeof requestBody[key] !== type) {
      throw new ResponseError(`\`${String(key)}\` request body property must be a ${type}.`, 422)
    }
  })

  return requestBody as T
}
