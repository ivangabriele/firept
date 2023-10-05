import got from 'got'

import type { WebSearchApiResponse } from './searchWeb.types.js'

export const searchWeb = async (
  query: string,
): Promise<
  | { error: string }
  | {
      searchResults: {
        title: string
        description: string
        url: string
      }[]
    }
> => {
  const braveSearchApiResultOrError = await fetchBraveSearchApi(query)

  if (typeof braveSearchApiResultOrError === 'string') {
    return {
      error: braveSearchApiResultOrError,
    }
  } else {
    const braveSearchApiResult = braveSearchApiResultOrError

    const simplifiedResponseData = {
      searchResults: braveSearchApiResult.web.results.map(result => ({
        title: result.title,
        description: result.description,
        url: result.url,
      })),
    }

    return simplifiedResponseData
  }
}

const fetchBraveSearchApi = async (query: string): Promise<WebSearchApiResponse | string> => {
  const endpoint = 'https://api.search.brave.com/res/v1/web/search'

  const headers = {
    Accept: 'application/json',
    'Accept-Encoding': 'gzip',
    'X-Subscription-Token': process.env.BRAVE_SEARCH_API_KEY,
  }

  const searchParams = {
    q: query,
    safesearch: 'moderate',
    result_filter: 'web',
    units: 'metric',
    extra_snippets: 'true',
  }

  try {
    const responseData = await got
      .get(endpoint, {
        headers,
        searchParams,
      })
      .json<WebSearchApiResponse>()

    return responseData
  } catch (error) {
    return `Error: ${error}`
  }
}
