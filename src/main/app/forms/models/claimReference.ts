import { IsDefined } from 'class-validator'
import { IsNotBlank } from '@hmcts/cmc-validators/dist/isNotBlank'

export class ValidationErrors {
  static readonly CLAIM_REFERENCE_REQUIRED: string = 'You need to enter the claim number'
}

export class ClaimReference {

  @IsDefined({ message: ValidationErrors.CLAIM_REFERENCE_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.CLAIM_REFERENCE_REQUIRED })
  reference?: string

  constructor (reference?: string) {
    this.reference = reference
  }

  deserialize (input: any): ClaimReference {
    if (input) {
      this.reference = input.reference
    }
    return this
  }
}
