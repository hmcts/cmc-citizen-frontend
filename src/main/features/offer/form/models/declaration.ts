import { IsDefined } from '@hmcts/class-validator'
import { IsBooleanTrue } from '@hmcts/cmc-validators'
import * as toBoolean from 'to-boolean'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'

export class Declaration {
  @IsDefined({ message: GlobalValidationErrors.DECLARATION_REQUIRED })
  @IsBooleanTrue({ message: GlobalValidationErrors.DECLARATION_REQUIRED })
  signed?: boolean

  constructor (signed?: boolean) {
    this.signed = signed
  }

  static fromObject (value?: any): Declaration {
    if (!value) {
      return value
    }
    return new Declaration(value.signed && toBoolean(value.signed))
  }
}
