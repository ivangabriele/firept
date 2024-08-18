// import { promises as fs } from 'fs'
// import { $ } from 'execa'

// import { deleteFile } from '../deleteFile.js'

// describe('actions/deleteFile()', () => {
//   afterAll(async () => {
//     await $`rm -rf src/actions/__tests__/__samples__`
//     await $`unzip -o src/actions/__tests__/__samples__.zip -d src/actions/__tests__`
//   })

//   it('should delete the expected directory', async () => {
//     const relativePath = 'src/actions/__tests__/__samples__/b'

//     const result = await deleteFile(relativePath)
//     if (result instanceof Error) {
//       throw result
//     }

//     try {
//       await fs.stat(relativePath)

//       throw new Error('The directory should not exist.')
//     } catch (err) {
//       expect((err as any).code).toBe('ENOENT')
//     }
//   })

//   it('should delete the expected file', async () => {
//     const relativePath = 'src/actions/__tests__/__samples__/A.txt'

//     const result = await deleteFile(relativePath)
//     if (result instanceof Error) {
//       throw result
//     }

//     try {
//       await fs.stat(relativePath)

//       throw new Error('The file should not exist.')
//     } catch (err) {
//       expect((err as any).code).toBe('ENOENT')
//     }
//   })
// })
