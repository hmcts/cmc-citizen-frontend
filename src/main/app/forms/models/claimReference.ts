import { IsDefined } from 'class-validator'
import { IsNotBlank } from 'app/forms/validation/validators/isBlank'
import { IsClaimReferenceNumber } from 'forms/validation/validators/isClaimReferenceNumber'

export class ValidationErrors {
  static readonly CLAIM_REFERENCE_REQUIRED: string = 'You need to enter the claim number'
  static readonly INVALID_CLAIM_NUMBER: string = 'Enter a valid reference number'
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
