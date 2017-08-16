import { IsDefined, Matches } from 'class-validator'
import { Serializable } from 'models/serializable'
import { IsNotBlank } from 'app/forms/validation/validators/isBlank'

export class ValidationErrors {
  static readonly CLAIM_REFERENCE_REQUIRED: string = 'You need to enter the claim number'
  static readonly CLAIM_REFERENCE_INVALID: string = 'You need to enter valid claim number'
}

export class ClaimReference implements Serializable<ClaimReference> {

  @IsDefined({ message: ValidationErrors.CLAIM_REFERENCE_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.CLAIM_REFERENCE_REQUIRED })
  @Matches(new RegExp('\\b\\d{3}MC\\d{3}\\b'), { message: ValidationErrors.CLAIM_REFERENCE_INVALID })
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
