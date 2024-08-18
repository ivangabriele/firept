import { createTokenAuth } from '@octokit/auth-token'
import { Octokit } from '@octokit/rest'

const { GITHUB_PERSONAL_ACCESS_TOKEN } = process.env

let octokitSingleton: Octokit | undefined

export async function getOctokit(): Promise<Octokit> {
  if (!GITHUB_PERSONAL_ACCESS_TOKEN) {
    throw new Error('Missing `GITHUB_PERSONAL_ACCESS_TOKEN` environment variable.')
  }

  if (octokitSingleton) {
    return octokitSingleton
  }

  const auth = createTokenAuth(GITHUB_PERSONAL_ACCESS_TOKEN)
  const { token } = await auth()

  octokitSingleton = new Octokit({
    auth: token,
  })

  return octokitSingleton
}
