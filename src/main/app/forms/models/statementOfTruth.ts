import { IsDefined } from '@hmcts/class-validator'
import { IsBooleanTrue } from '@hmcts/cmc-validators'
import { SignatureType } from 'common/signatureType'
export class ValidationErrors {
  static readonly STATEMENT_OF_TRUTH_REQUIRED_MESSAGE: string = 'Please select I believe that the facts stated in this claim are true.'
}

export class StatementOfTruth {
  type: string = SignatureType.BASIC

  @IsDefined({ message: ValidationErrors.STATEMENT_OF_TRUTH_REQUIRED_MESSAGE })
  @IsBooleanTrue({ message: ValidationErrors.STATEMENT_OF_TRUTH_REQUIRED_MESSAGE })
  signed?: boolean

  constructor (signed?: boolean
  ) {
    this.signed = signed
  }

  static fromObject (value?: any): StatementOfTruth {
    if (!value) {
      return value
    }
    return new StatementOfTruth(value.signed === 'true')
  }
}
