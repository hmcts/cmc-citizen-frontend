export default class StringUtils {

  static isBlank (value: string): boolean {
    return !(value && value.length > 0)
  }

}
