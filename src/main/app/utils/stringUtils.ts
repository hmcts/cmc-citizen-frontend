export class StringUtils {

  static isBlank (value: string): boolean {
    return !(value && value.length > 0)
  }

  /**
   * Trims value on both ends of this string returning undefined if the string is empty ("") after the trim or if it is undefined.
   *
   * The string is trimmed using string.trim().
   *
   * @param {string} value
   * @returns {string}
   */
  static trimToUndefined (value: string): string {
    if (value === undefined) {
      return undefined
    }

    const trimmedValue: string = value.trim()
    if (trimmedValue.length === 0) {
      return undefined
    }

    return trimmedValue
  }

}
