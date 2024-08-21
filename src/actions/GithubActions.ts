import { workspaceManager } from '../libs/workspaceManager/index.js'
import { getOctokit } from '../utils/getOctokit.js'

export const GithubActions = {
  async getGithubIssue(issueNumber: number): Promise<{
    authorLogin: string | null
    authorRole:
      | 'COLLABORATOR'
      | 'CONTRIBUTOR'
      | 'FIRST_TIMER'
      | 'FIRST_TIME_CONTRIBUTOR'
      | 'MANNEQUIN'
      | 'MEMBER'
      | 'NONE'
      | 'OWNER'
    body: string | null
    comments: Array<{
      authorLogin: string | null
      authorRole:
        | 'COLLABORATOR'
        | 'CONTRIBUTOR'
        | 'FIRST_TIMER'
        | 'FIRST_TIME_CONTRIBUTOR'
        | 'MANNEQUIN'
        | 'MEMBER'
        | 'NONE'
        | 'OWNER'
      body: string | null
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

      return {
        authorLogin: issue.user?.login ?? null,
        authorRole: issue.author_association,
        body: issue.body ?? null,
        comments: issueComments.map((comment) => ({
          authorLogin: comment.user?.login ?? null,
          authorRole: comment.author_association,
          body: comment.body ?? null,
        })),
        title: issue.title,
      }
    } catch (err) {
      throw err instanceof Error ? err : new Error(`Failed to delete file. Original error: \`${err}\`.`)
    }
  },
}
