import { Validator } from '@hmcts/class-validator'

const validator = new Validator()

export class ValidationUtils {
  static isValid (value: any): boolean {
    return !!value && validator.validateSync(value).length === 0
  }
}
