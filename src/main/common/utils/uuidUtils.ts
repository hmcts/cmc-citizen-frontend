const pattern = /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/
const documentIdPattern = /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/g

export class UUIDUtils {
  /**
   * Extracts first UUID from given string. Returns UUID or undefined if UUID does not exists in the string value.
   */
  static extractFrom (value: string): string {
    if (value === undefined) {
      throw new Error('String to extract UUID from is required')
    }

    const matches: RegExpMatchArray = value.match(pattern)
    if (matches !== null) {
      return matches[1]
    }

    return undefined
  }

  static extractDocumentId (value: string): string {
    if (value === undefined) {
      throw new Error('String to extract UUID from is required')
    }

    const matches: RegExpMatchArray = value.match(documentIdPattern)
    if (matches !== null) {
      return matches[1]
    }

    return undefined
  }
}
