import { MaxLength } from '@hmcts/class-validator'
import { ValidationConstraints } from 'forms/validation/validationConstraints'
import { ValidationErrors as DefaultValidationErrors } from 'forms/validation/validationErrors'

export class DisagreeReason {
  @MaxLength(ValidationConstraints.FREE_TEXT_MAX_LENGTH_1000, { message: DefaultValidationErrors.TEXT_TOO_LONG })
  reason?: string

  constructor (reason?: string) {
    this.reason = reason
  }

  deserialize (input: any): DisagreeReason {
    if (input) {
      this.reason = input.reason
    }
    return this
  }
}
