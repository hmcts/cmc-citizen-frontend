import { IsDefined, MaxLength } from '@hmcts/class-validator'
import { IsNotBlank } from '@hmcts/cmc-validators'
import { ValidationConstraints } from 'forms/validation/validationConstraints'
import { ValidationErrors as DefaultValidationErrors } from 'forms/validation/validationErrors'

export class ValidationErrors {
  static readonly EXPLAIN_WHY_YOU_CANT_PAY_NOW = 'Enter an explanation of why you can’t pay now'
}

export class Explanation {
  @IsDefined({ message: ValidationErrors.EXPLAIN_WHY_YOU_CANT_PAY_NOW })
  @IsNotBlank({ message: ValidationErrors.EXPLAIN_WHY_YOU_CANT_PAY_NOW })
  @MaxLength(ValidationConstraints.FREE_TEXT_MAX_LENGTH, { message: DefaultValidationErrors.TEXT_TOO_LONG })
  text: string

  constructor (text?: string) {
    this.text = text
  }

  deserialize (input: any): Explanation {
    if (input) {
      this.text = input.text
    }
    return this
  }
}
