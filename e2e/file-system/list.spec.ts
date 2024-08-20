import { customKy } from '../libs.js'

describe('/file-system/list', () => {
  it('should work', async () => {
    const result = await customKy
      .post<string[]>('file-system/list', {
        json: {
          path: '.',
        },
      })
      .json()

    expect(result.length).toBeGreaterThan(0)
  })
})
