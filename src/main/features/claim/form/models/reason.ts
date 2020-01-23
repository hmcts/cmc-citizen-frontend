import { MaxLength, IsDefined } from '@hmcts/class-validator'
import { IsNotBlank } from '@hmcts/cmc-validators'
import { CompletableTask } from 'models/task'
import { ValidationConstraints } from 'forms/validation/validationConstraints'
import { ValidationErrors as DefaultValidationErrors } from 'forms/validation/validationErrors'

export class ValidationErrors {
  static readonly REASON_REQUIRED: string = 'You need to explain why you believe you’re owed the money'
}

export class Reason implements CompletableTask {
  @IsDefined({ message: ValidationErrors.REASON_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.REASON_REQUIRED })
  @MaxLength(ValidationConstraints.FREE_TEXT_MAX_LENGTH, { message: DefaultValidationErrors.TEXT_TOO_LONG })
  reason?: string

  constructor (reason?: string) {
    this.reason = reason
  }

  deserialize (input: any): Reason {
    if (input) {
      this.reason = input.reason
    }
    return this
  }

  isCompleted (): boolean {
    return !!this.reason && this.reason.length > 0
  }
}
