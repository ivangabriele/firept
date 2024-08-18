// biome-ignore lint/suspicious/noExplicitAny: This is a type definition.
export type AnyObject = { [key: string]: any }

// export interface FireptConfig {
//   meta: {
//     name: string
//     description: string
//     type: FireptConfigMetaType
//     stack: Record<FireptConfigMetaStackKey, FireptConfigMetaStackNode>
//     structure: Record<string, FireptConfigMetaStructureNode>
//   }

//   ignoredFiles: string[]
// }

// type FireptConfigMetaType = 'cli' | 'desktopapp' | 'game' | 'library' | 'mobileapp' | 'webapi' | 'webapp' | 'other'

// type FireptConfigMetaStackKey = 'backend' | 'frontend' | 'main'
// type FireptConfigMetaStackNode = {
//   framework: string
//   mainLanguage: string
//   testing: string[]
//   storage?: [string]
// }

// type FireptConfigMetaStructureNode = Partial<{
//   description: string
//   designPattern: string
//   children: Record<string, FireptConfigMetaStructureNode>
// }>
