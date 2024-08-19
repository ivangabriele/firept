import { promises as fs, existsSync } from 'node:fs'
import { getAbsolutePath } from '../../utils/getAbsolutePath.js'
import { FileSystemActions } from '../FileSystemActions.js'

describe('actions/FileSystemActions.update()', () => {
  beforeEach(async () => {
    const firstPath = './sample/new/first/directory/hello.txt'
    const firstSource = 'world!'

    await FileSystemActions.create(firstPath, firstSource, false)

    const firstCreateFileSource = await FileSystemActions.readFile(firstPath)
    expect(firstCreateFileSource).toBe(firstSource)

    const secondPath = './sample/new/first/directory/hello.txt'
    const secondSource = 'world!'

    await FileSystemActions.create(secondPath, secondSource, false)

    const secondCreateFileSource = await FileSystemActions.readFile(secondPath)
    expect(secondCreateFileSource).toBe(secondSource)
  })

  afterEach(async () => {
    await FileSystemActions.delete('./sample/new')
  })

  it('should delete the expected directory', async () => {
    const path = './sample/new'

    expect(existsSync(getAbsolutePath(path))).toBe(true)

    await FileSystemActions.delete(path)

    expect(existsSync(getAbsolutePath(path))).toBe(false)
    expect(await fs.readdir(getAbsolutePath('./sample'))).toEqual(['.gitkeep'])
  })

  it('should delete the expected file', async () => {
    const path = './sample/new/first/directory/hello.txt'

    expect(existsSync(getAbsolutePath(path))).toBe(true)

    await FileSystemActions.delete(path)

    expect(existsSync(getAbsolutePath(path))).toBe(false)
  })
})
