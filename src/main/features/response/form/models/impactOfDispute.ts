import { ValidationConstraints } from 'forms/validation/validationConstraints'
import { ValidationErrors } from 'forms/validation/validationErrors'
import { MaxLength } from '@hmcts/cmc-validators'

export class ImpactOfDispute {

  @MaxLength(ValidationConstraints.FREE_TEXT_MAX_LENGTH, { message: ValidationErrors.TEXT_TOO_LONG })
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
