import { Serializable } from 'models/serializable'
import { ValidationConstraints } from 'forms/validation/validationConstraints'
import { ValidationErrors as DefaultValidationErrors } from 'forms/validation/validationErrors'
import { MaxLength } from 'forms/validation/validators/maxLengthValidator'

export class ImpactOfDispute implements Serializable<ImpactOfDispute> {

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
