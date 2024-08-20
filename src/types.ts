// biome-ignore lint/suspicious/noExplicitAny: This is a type definition.
export type AnyObject = { [key: string]: any }

export type Defined<T> = T extends undefined ? never : T
