import got from 'got'
// import nock from 'nock';
// import app from '../../src/index'

describe('E2E tests', () => {
  // Mock Brave Search API response
  // beforeAll(() => {
  //   nock('https://api.search.brave.com').get('/res/v1/web/search').query(true).reply(200, {
  //     // Your mock response here
  //   })
  // })

  // it('should fetch search results from /web/search', async () => {
  //   const query = 'test query';
  //   const res = await request(app.callback()).get(`/web/search?query=${query}`);

  //   expect(res.status).toBe(200);
  //   expect(res.body).toHaveProperty('searchResults');
  // });

  it('should fetch and convert web page from /web/fetch', async () => {
    const url = 'https://example.org'
    const res = await got.get(`http://localhost:3333/web/fetch?url=${url}`)

    expect(res.ok).toBe(true)
    expect(res.body).toMatchSnapshot()
  })
})
