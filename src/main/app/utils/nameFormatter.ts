import { StringUtils } from 'utils/stringUtils'

export class NameFormatter {

  static fullName (firstName: string, lastName: string, title?: string): string {
    return [StringUtils.trimToUndefined(title), firstName, lastName].filter(Boolean).join(' ')
  }
}
