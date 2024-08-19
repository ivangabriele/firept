import { promises as fs } from 'node:fs'
import { getAbsolutePath } from '../../utils/getAbsolutePath.js'
import { FileSystemActions } from '../FileSystemActions.js'

describe('actions/FileSystemActions.update()', () => {
  beforeAll(async () => {
    const path = './sample/new/directory/hello.txt'
    const source = 'world!'

    await FileSystemActions.create(path, source, false)

    const createFileSource = await FileSystemActions.readFile(path)
    expect(createFileSource).toBe(source)
  })

  afterAll(async () => {
    await FileSystemActions.delete('./sample/new')
  })

  it('should update the expected file with an empty source', async () => {
    const path = './sample/new/directory/hello.txt'
    const source = ''

    await FileSystemActions.update(path, source)

    const updatedFileStats = await fs.stat(getAbsolutePath(path))
    expect(updatedFileStats.isFile()).toBe(true)

    const updatedFileSource = await FileSystemActions.readFile(path)
    expect(updatedFileSource).toBe(source)
  })

  it('should update the expected file with the expected content', async () => {
    const path = 'src/actions/__tests__/__samples__/hello.txt'
    const source = 'world!'

    await FileSystemActions.update(path, source)

    const updatedFileStats = await fs.stat(getAbsolutePath(path))
    expect(updatedFileStats.isFile()).toBe(true)

    const updatedFileSource = await FileSystemActions.readFile(path)
    expect(updatedFileSource).toBe(source)
  })
})
