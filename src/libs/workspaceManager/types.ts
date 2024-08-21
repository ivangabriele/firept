export interface FireptConfig {
  server: {
    apiKey: string
    port: number
  }
  publichost?: {
    apiKey: string
    host: string
    subdomain: string
  }
  customPublicUrl?: string
  repository?: {
    provider: 'github'
    personalAccessToken: string
    owner: string
    name: string
  }
  workspace?: Partial<{
    ignoredFiles?: string[]
  }>
}
