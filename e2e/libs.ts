import ky from 'ky'

export const customKy = ky.extend({
  prefixUrl: 'http://localhost:9999',
  headers: {
    'x-api-key': '****',
  },
})
