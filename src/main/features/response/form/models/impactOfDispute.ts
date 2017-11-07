import { Serializable } from 'models/serializable'
import { IsDefined } from 'class-validator'
import { IsNotBlank } from 'forms/validation/validators/isBlank'
import { MaxLength } from 'forms/validation/validators/maxLengthValidator'

export class ValidationErrors {
  static readonly IMPACT_OF_DISPUTE_REQUIRED: string = 'Explain how has this dispute affected you'
  static readonly IMPACT_OF_DISPUTE_TOO_LONG: string = 'You’ve entered too many characters'
}

export class ImpactOfDispute implements Serializable<ImpactOfDispute> {

  @IsDefined({ message: ValidationErrors.IMPACT_OF_DISPUTE_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.IMPACT_OF_DISPUTE_REQUIRED })
  @MaxLength(99000, { message: ValidationErrors.IMPACT_OF_DISPUTE_TOO_LONG })
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
