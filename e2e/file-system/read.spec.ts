import { customKy } from '../libs.js'

describe('/file-system/read', () => {
  it('should work', async () => {
    const result = await customKy
      .post<string[]>('file-system/read', {
        json: {
          path: './README.md',
        },
      })
      .text()

    expect(result).toContain('# FirePT Sample Workspace')
  })
})
