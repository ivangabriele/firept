import { workspaceManager } from '../libs/workspaceManager/index.js'
import { getOctokit } from '../utils/getOctokit.js'

export const GithubActions = {
  async getGithubIssue(issueNumber: number): Promise<{
    body: string
    comments: Array<{
      body: string
    }>
    title: string
  }> {
    try {
      const octokit = await getOctokit()

      const { data: issue } = await octokit.rest.issues.get({
        // biome-ignore lint/style/useNamingConvention: <explanation>
        issue_number: issueNumber,
        owner: workspaceManager.definedRepository.owner,
        repo: workspaceManager.definedRepository.name,
      })
      const { data: issueComments } = await octokit.rest.issues.listComments({
        // biome-ignore lint/style/useNamingConvention: <explanation>
        issue_number: issueNumber,
        owner: workspaceManager.definedRepository.owner,
        repo: workspaceManager.definedRepository.name,
      })

      const { body, title } = issue
      const comments = issueComments.map((comment) => ({ body: comment.body || '' }))

      return { body: body || '', comments, title }
    } catch (err) {
      throw err instanceof Error ? err : new Error(`Failed to delete file. Original error: \`${err}\`.`)
    }
  },
}
