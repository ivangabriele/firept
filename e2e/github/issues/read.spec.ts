import { customKy } from '../../libs.js'

describe('/github/issues/read', () => {
  it('should work', async () => {
    const result = await customKy
      .get<string[]>('github/issues/read', {
        searchParams: {
          issueNumber: 1,
        },
      })
      .json()

    expect(result).toMatchObject({
      title: 'Dependency Dashboard',
      authorLogin: 'renovate[bot]',
      authorRole: 'NONE',
    })
  })
})
