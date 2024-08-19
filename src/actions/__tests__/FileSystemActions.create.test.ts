import { promises as fs } from 'node:fs'
import { getAbsolutePath } from '../../utils/getAbsolutePath.js'
import { FileSystemActions } from '../FileSystemActions.js'

describe('actions/FileSystemActions.create()', () => {
  afterEach(async () => {
    await FileSystemActions.delete('./sample/new')
  })

  it('should create the expected directory', async () => {
    const path = './sample/new/directory'
    const source = undefined
    const isDirectory = true

    await FileSystemActions.create(path, source, isDirectory)

    const createdFileStats = await fs.stat(getAbsolutePath(path))
    expect(createdFileStats.isDirectory()).toBe(true)
  })

  it('should create the expected file with an undefined source', async () => {
    const path = './sample/new/directory/hello.txt'
    const source = undefined
    const isDirectory = false

    await FileSystemActions.create(path, source, isDirectory)

    const createdFileStats = await fs.stat(getAbsolutePath(path))
    expect(createdFileStats.isFile()).toBe(true)

    const createdFileSource = await FileSystemActions.readFile(path)
    expect(createdFileSource).toBe('')
  })

  it('should create the expected file with an empty source', async () => {
    const path = './sample/new/directory/hello.txt'
    const source = ''
    const isDirectory = false

    await FileSystemActions.create(path, source, isDirectory)

    const createdFileStats = await fs.stat(getAbsolutePath(path))
    expect(createdFileStats.isFile()).toBe(true)

    const createdFileSource = await FileSystemActions.readFile(path)
    expect(createdFileSource).toBe(source)
  })

  it('should create the expected file with the expected content', async () => {
    const path = 'src/actions/__tests__/__samples__/hello.txt'
    const source = 'world!'
    const isDirectory = false

    await FileSystemActions.create(path, source, isDirectory)

    const createdFileStats = await fs.stat(getAbsolutePath(path))
    expect(createdFileStats.isFile()).toBe(true)

    const createdFileSource = await FileSystemActions.readFile(path)
    expect(createdFileSource).toBe(source)
  })
})
