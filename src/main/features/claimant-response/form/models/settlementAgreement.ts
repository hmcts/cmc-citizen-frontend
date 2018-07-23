import { IsDefined } from 'class-validator'
import { IsBooleanTrue } from '@hmcts/cmc-validators'
import { SignatureType } from 'common/signatureType'

export class ValidationErrors {
  static readonly SETTLEMENT_AGREEMENT_REQUIRED_MESSAGE: string = 'Please select I confirm I\'ve read and accept the terms of the agreement.'
}

export class SettlementAgreement {
  type: string = SignatureType.BASIC

  @IsDefined({ message: ValidationErrors.SETTLEMENT_AGREEMENT_REQUIRED_MESSAGE })
  @IsBooleanTrue({ message: ValidationErrors.SETTLEMENT_AGREEMENT_REQUIRED_MESSAGE })
  signed?: boolean

  constructor (signed?: boolean
  ) {
    this.signed = signed
  }

  static fromObject (value?: any): SettlementAgreement {
    if (!value) {
      return value
    }
    return new SettlementAgreement(value.signed === 'true')
  }
}
