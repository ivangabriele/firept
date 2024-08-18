import ttlCache from '@isaacs/ttlcache'
import { ONE_DAY } from '../constants.js'

export const cache = new ttlCache({
  max: 100,
  ttl: ONE_DAY,
})
