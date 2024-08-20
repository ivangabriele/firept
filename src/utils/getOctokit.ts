import { createTokenAuth } from '@octokit/auth-token'
import { Octokit } from '@octokit/rest'
import { workspaceManager } from '../libs/workspaceManager/index.js'

let octokitSingleton: Octokit | undefined

export async function getOctokit(): Promise<Octokit> {
  if (octokitSingleton) {
    return octokitSingleton
  }

  const auth = createTokenAuth(workspaceManager.definedRepository.personalAccessToken)
  const { token } = await auth()

  octokitSingleton = new Octokit({
    auth: token,
  })

  return octokitSingleton
}
