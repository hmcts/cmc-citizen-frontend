import { MaxLength } from '@hmcts/class-validator'
import { CompletableTask } from 'models/task'
import { ValidationConstraints } from 'forms/validation/validationConstraints'
import { ValidationErrors as DefaultValidationErrors } from 'forms/validation/validationErrors'

export class DisagreeReason implements CompletableTask {
  @MaxLength(ValidationConstraints.FREE_TEXT_MAX_LENGTH, { message: DefaultValidationErrors.TEXT_TOO_LONG })
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

  isCompleted (): boolean {
    return !!this.reason && this.reason.length > 0
  }
}
