import { statSync } from 'node:fs'
import { promises as fs } from 'node:fs'
import { dirname, join } from 'node:path'
import { deleteAsync } from 'del'
import { globby } from 'globby'

import { ResponseError } from '../errors/ResponseError.js'
import { getAbsolutePath } from '../utils/getAbsolutePath.js'

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type DirectoryTreeNode = Record<string, any>

function getDirectoryTreeFromDirectoryPaths(directories: string[]): Record<string, DirectoryTreeNode> {
  const tree = {}

  for (const dir of directories) {
    const parts = dir.split('/')
    let currentLevel = tree

    for (const part of parts) {
      if (!currentLevel[part]) {
        currentLevel[part] = {}
      }

      currentLevel = currentLevel[part]
    }
  }

  return tree
}

function getDirectoryTreeAsYaml(tree: Record<string, DirectoryTreeNode>, indent = ''): string {
  return Object.keys(tree)
    .map((key) => {
      const subtree = tree[key]

      if (Object.keys(subtree).length > 0) {
        return `${indent}- ${key}\n${getDirectoryTreeAsYaml(subtree, `${indent}  `)}`
      }

      return `${indent}- ${key}`
    })
    .join('\n')
}

export const FileSystemActions = {
  async list(relativePath: string | undefined): Promise<string[]> {
    try {
      const absolutePath = getAbsolutePath(relativePath)

      const paths = await globby(['*', '!.git/**'], {
        cwd: absolutePath,
        dot: true,
        followSymbolicLinks: false,
        gitignore: true,
        onlyFiles: false,
      })

      return paths
        .map((path) => {
          const isDirectory = statSync(join(absolutePath, path)).isDirectory()

          if (isDirectory) {
            return `${path}/`
          }

          return path
        })
        .sort()
    } catch (err) {
      throw err instanceof Error
        ? ResponseError.fromError(err)
        : new ResponseError(`Failed to list files. Original error: \`${err}\`.`)
    }
  },

  async readFile(relativePath: string): Promise<string> {
    try {
      const absolutePath = getAbsolutePath(relativePath)
      const source = await fs.readFile(absolutePath, 'utf-8')

      return source
    } catch (err) {
      throw err instanceof Error
        ? ResponseError.fromError(err)
        : new ResponseError(`Failed to read file. Original error: \`${err}\`.`)
    }
  },

  async create(relativePath: string, source: string | undefined, isDirectory: boolean): Promise<undefined> {
    try {
      const controlledSource = source ?? ''
      const absolutePath = getAbsolutePath(relativePath)

      if (isDirectory) {
        await fs.mkdir(absolutePath, { recursive: true })

        return undefined
      }

      const fileDirectoryAbsolutePath = dirname(absolutePath)
      await fs.mkdir(fileDirectoryAbsolutePath, { recursive: true })
      await fs.writeFile(absolutePath, controlledSource)

      return undefined
    } catch (err) {
      throw err instanceof Error
        ? ResponseError.fromError(err)
        : new ResponseError(`Failed to create file. Original error: \`${err}\`.`)
    }
  },

  async update(relativePath: string, source: string): Promise<undefined> {
    try {
      const absolutePath = getAbsolutePath(relativePath)

      await fs.writeFile(absolutePath, source)

      return undefined
    } catch (err) {
      throw err instanceof Error
        ? ResponseError.fromError(err)
        : new ResponseError(`Failed to update file. Original error: \`${err}\`.`)
    }
  },

  async delete(relativePath: string): Promise<undefined> {
    try {
      const absolutePath = getAbsolutePath(relativePath)

      await deleteAsync(absolutePath, {
        force: true,
      })

      return undefined
    } catch (err) {
      throw err instanceof Error
        ? ResponseError.fromError(err)
        : new ResponseError(`Failed to delete file. Original error: \`${err}\`.`)
    }
  },

  async move(fromRelativePath: string, toRelativePath: string): Promise<undefined> {
    try {
      const fromAbsolutePath = getAbsolutePath(fromRelativePath)
      const toAbsolutePath = getAbsolutePath(toRelativePath)

      const fileDirectoryNewAbsolutePath = dirname(toAbsolutePath)
      await fs.mkdir(fileDirectoryNewAbsolutePath, { recursive: true })
      await fs.rename(fromAbsolutePath, toAbsolutePath)

      return undefined
    } catch (err) {
      throw err instanceof Error
        ? ResponseError.fromError(err)
        : new ResponseError(`Failed to move file. Original error: \`${err}\`.`)
    }
  },

  async getDirectoryTree(): Promise<string> {
    const absolutePath = getAbsolutePath()

    const directories = await globby('**/', {
      cwd: absolutePath,
      dot: true,
      ignore: ['./.git/'],
      followSymbolicLinks: false,
      gitignore: true,
      onlyDirectories: true,
    })
    const directoryTree = getDirectoryTreeFromDirectoryPaths(directories)
    const directoryTreeAsYaml = getDirectoryTreeAsYaml(directoryTree)

    return directoryTreeAsYaml
  },
}
