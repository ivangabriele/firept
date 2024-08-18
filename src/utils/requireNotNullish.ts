export function requireNotNullish<T>(value: T | null | undefined, name: string): T {
  if (value === null || value === undefined) {
    throw new Error(`\`${name}\` must not be nullish.`)
  }

  return value
}
