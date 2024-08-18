import { getOctokit } from '../utils/getOctokit.js'

const { GITHUB_OWNER, GITHUB_REPOSITORY } = process.env

export async function getGithubIssue(issueNumber: number): Promise<
  | {
      body: string
      comments: Array<{
        body: string
      }>
      title: string
    }
  | Error
> {
  try {
    if (!GITHUB_OWNER) {
      throw new Error('Missing `GITHUB_OWNER` environment variable.')
    }
    if (!GITHUB_REPOSITORY) {
      throw new Error('Missing `GITHUB_REPOSITORY` environment variable.')
    }

    const octokit = await getOctokit()

    const { data: issue } = await octokit.rest.issues.get({
      // biome-ignore lint/style/useNamingConvention: <explanation>
      issue_number: issueNumber,
      owner: GITHUB_OWNER,
      repo: GITHUB_REPOSITORY,
    })
    const { data: issueComments } = await octokit.rest.issues.listComments({
      // biome-ignore lint/style/useNamingConvention: <explanation>
      issue_number: issueNumber,
      owner: GITHUB_OWNER,
      repo: GITHUB_REPOSITORY,
    })

    const { body, title } = issue
    const comments = issueComments.map((comment) => ({ body: comment.body || '' }))

    return { body: body || '', comments, title }
  } catch (err) {
    return err instanceof Error ? err : new Error(`Failed to delete file. Original error: \`${err}\`.`)
  }
}
