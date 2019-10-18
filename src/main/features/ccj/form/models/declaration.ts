import { IsDefined } from '@hmcts/class-validator'
import { IsBooleanTrue } from '@hmcts/cmc-validators'
import { SignatureType } from 'common/signatureType'

/**
 * We cannot reuse StatementOfTruth class as for legal reason error message must be different.
 */
export class ValidationErrors {
  static readonly DECLARATION_REQUIRED: string = 'Please select I confirm that I believe the details I have provided are correct.'
}

export class Declaration {
  type: string = SignatureType.BASIC

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
    return new Declaration(value.signed === 'true')
  }
}
