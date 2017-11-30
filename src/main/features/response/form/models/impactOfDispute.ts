import { ValidationConstraints } from 'forms/validation/validationConstraints'
import { ValidationErrors } from 'forms/validation/validationErrors'
import { MaxLength } from 'forms/validation/validators/maxLengthValidator'

export class ImpactOfDispute {

  @MaxLength(ValidationConstraints.FREE_TEXT_MAX_LENGTH, { message: ValidationErrors.FREE_TEXT_TOO_LONG })
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
