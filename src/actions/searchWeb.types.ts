export interface MetaUrl {
  scheme: string
  netloc: string
  hostname: string
  favicon: string
  path: string
}

export interface Profile {
  name: string
  long_name: string
  url: string
  img: string
}

export interface Query {
  original: string
  show_strict_warning: boolean
  altered?: string
  safesearch?: boolean
  is_navigational: boolean
  is_geolocal?: boolean
  local_decision?: string
  local_locations_idx?: number
  is_trending?: boolean
  is_news_breaking: boolean
  ask_for_location?: boolean
  language?: string
  spellcheck_off: boolean
  country: string
  bad_results: boolean
  should_fallback: boolean
  lat?: string
  long?: string
  postal_code: string
  city: string
  state: string
  header_country: string
  more_results_available: boolean
  custom_location_label?: string
  reddit_cluster?: string
}

export interface ResultReference {
  type: string
  index: number
  all: boolean
}

export interface MixedResponse {
  type: 'mixed'
  main: ResultReference[]
  top: ResultReference[]
  side: ResultReference[]
}

export interface Result {
  title: string
  url: string
  is_source_local: boolean
  is_source_both: boolean
  description: string
  page_age?: string
  page_fetched?: string
  profile: Profile
  language: string
  family_friendly: boolean
}

export interface SearchResult extends Result {
  type: 'search_result'
  subtype: string
  meta_url: MetaUrl
  deep_results?: any
  schemas?: any[][]
  thumbnail?: any
  age?: string
  language: string
  restaurant?: any
  locations?: any
  video?: any
  movie?: any
  faq?: any
  qa?: any
  book?: any
  rating?: any
  article?: any
  product?: any
  product_cluster?: any[]
  cluster_type?: string
  cluster?: any[]
  creative_work?: any
  music_recording?: any
  review?: any
  software?: any
  content_type?: string
  extra_snippets?: string[]
}

export interface Search {
  type: 'search'
  results: SearchResult[]
  family_friendly: boolean
}

export interface WebSearchApiResponse {
  type: 'search'
  discussions?: any
  faq?: any
  infobox?: any
  locations?: any
  mixed: MixedResponse
  news?: any
  query: Query
  videos?: any
  web: Search
}
