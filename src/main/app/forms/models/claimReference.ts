import { IsDefined } from '@hmcts/class-validator'
import { IsNotBlank } from '@hmcts/cmc-validators'
import { IsClaimReferenceNumber } from 'forms/validation/validators/isClaimReferenceNumber'

export class ValidationErrors {
  static readonly CLAIM_REFERENCE_REQUIRED: string = 'You need to enter the claim number'
  static readonly INVALID_CLAIM_NUMBER: string = 'Enter a valid claim number'
}

export class ClaimReference {

  @IsDefined({ message: ValidationErrors.CLAIM_REFERENCE_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.CLAIM_REFERENCE_REQUIRED })
  @IsClaimReferenceNumber({ message: ValidationErrors.INVALID_CLAIM_NUMBER })
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
