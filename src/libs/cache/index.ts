import ttlCache from '@isaacs/ttlcache'
// biome-ignore lint/style/useNamingConvention: <explanation>
import type TTLCache from '@isaacs/ttlcache'
import { ONE_DAY } from '../../constants.js'
import type { CacheKey } from './constants.js'
import type { CacheDictionary } from './types.js'

class Cache {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  #cache: TTLCache<CacheKey, any>

  constructor() {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    this.#cache = new ttlCache<CacheKey, any>({
      max: 100,
      ttl: ONE_DAY,
    })
  }

  get<T extends CacheKey>(key: T): CacheDictionary[T] | undefined {
    return this.#cache.get(key)
  }

  set<T extends CacheKey>(key: T, value: CacheDictionary[T], ttl: number = ONE_DAY): void {
    this.#cache.set(key, value, { ttl })
  }
}

export const cache = new Cache()
