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
    expect(result).toContain('prisma/')
    expect(result).not.toContain('.git')
    expect(result).not.toContain('.git/')
    expect(result).not.toContain('node_modules')
    expect(result).not.toContain('node_modules/')
  })
})
