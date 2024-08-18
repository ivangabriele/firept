import { spawn } from 'node:child_process'
import { promises as fs } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { ResponseError } from '../errors/ResponseError.js'
import { getAbsolutePath } from '../utils/getAbsolutePath.js'

export const WorkspaceActions = {
  async execute(
    command: string,
    path: string | undefined,
  ): Promise<{
    stderr: string
    stdout: string
  }> {
    try {
      const workingDirectoryAbsolutePath = getAbsolutePath(path)
      const tempDir = await fs.mkdtemp(join(tmpdir(), 'exec-'))
      const scriptPath = join(tempDir, 'script.sh')
      await fs.writeFile(scriptPath, `#!/bin/bash\n\n${command}`)
      await fs.chmod(scriptPath, '0755')

      const { stderr, stdout } = await new Promise<{
        stderr: string
        stdout: string
      }>((resolve, reject) => {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        let stdout = ''
        // eslint-disable-next-line @typescript-eslint/no-shadow
        let stderr = ''

        const subprocess = spawn(scriptPath, { cwd: workingDirectoryAbsolutePath })
        subprocess.stdout.on('data', (data) => {
          stdout += data
        })
        subprocess.stderr.on('data', (data) => {
          stderr += data
        })
        subprocess.on('error', (error) => {
          reject(error)
        })
        subprocess.on('close', () => {
          resolve({ stderr, stdout })
        })

        setTimeout(() => {
          if (!subprocess.killed) {
            subprocess.kill('SIGKILL')
          }

          resolve({ stderr, stdout })
        }, 10000)
      })

      await fs.unlink(scriptPath)

      return { stderr, stdout }
    } catch (err) {
      throw err instanceof Error
        ? ResponseError.fromError(err)
        : new ResponseError(`Failed to execute command. Original error: \`${err}\`.`)
    }
  },
}
