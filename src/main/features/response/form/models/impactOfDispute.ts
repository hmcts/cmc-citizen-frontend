import { Serializable } from 'models/serializable'
import { IsDefined, MaxLength } from 'class-validator'
import { IsNotBlank } from 'forms/validation/validators/isBlank'
import { ValidationConstraints } from 'forms/validation/validationConstraints'
import { ValidationErrors as DefaultValidationErrors } from 'forms/validation/validationErrors'

export class ValidationErrors {
  static readonly IMPACT_OF_DISPUTE_REQUIRED: string = 'Explain how this dispute has affected you'
}

export class ImpactOfDispute implements Serializable<ImpactOfDispute> {

  @IsDefined({ message: ValidationErrors.IMPACT_OF_DISPUTE_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.IMPACT_OF_DISPUTE_REQUIRED })
  @MaxLength(ValidationConstraints.FREE_TEXT_MAX_LENGTH, { message: DefaultValidationErrors.FREE_TEXT_TOO_LONG })
  text?: string

  constructor (text?: string) {
    this.text = text
  }

  deserialize (input: any): ImpactOfDispute {
    if (input) {
      this.text = input.text
    }
    return this
  }

}
