import { IsDefined } from '@hmcts/class-validator'
import { IsBooleanTrue } from '@hmcts/cmc-validators'
import * as toBoolean from 'to-boolean'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'

export class SettlementAgreement {

  @IsDefined({ message: GlobalValidationErrors.DECLARATION_REQUIRED })
  @IsBooleanTrue({ message: GlobalValidationErrors.DECLARATION_REQUIRED })
  signed?: boolean

  constructor (signed?: boolean) {
    this.signed = signed
  }

  static fromObject (value?: any): SettlementAgreement {
    if (!value) {
      return value
    }
    return new SettlementAgreement(value.signed && toBoolean(value.signed))
  }

  deserialize (input?: any): SettlementAgreement {
    if (input && input.signed) {
      this.signed = input.signed
    }
    return this
  }
}
