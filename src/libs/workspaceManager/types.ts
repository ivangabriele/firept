export interface FireptConfig {
  server: {
    apiKey: string
    port: number
  }
  publichost: {
    apiKey: string
    host: string
    subdomain: string
  }
  workspace?: Partial<{
    ignoredFiles: string[]
  }>
}
