import { IsDefined } from 'class-validator'
import { IsBooleanTrue } from 'forms/validation/validators/isBooleanTrue'
import * as toBoolean from 'to-boolean'

export class ValidationErrors {
  static readonly DECLARATION_REQUIRED: string = 'Please select I confirm I’ve read and accept the terms of the agreement.'
}

export class Declaration {
  @IsDefined({ message: ValidationErrors.DECLARATION_REQUIRED })
  @IsBooleanTrue({ message: ValidationErrors.DECLARATION_REQUIRED })
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
