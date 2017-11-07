import { MaxLength, IsDefined } from 'class-validator'
import { Serializable } from 'app/models/serializable'
import { IsNotBlank } from 'app/forms/validation/validators/isBlank'
import { CompletableTask } from 'app/models/task'
import { ValidationConstraints } from 'forms/validation/validationConstraints'

export class ValidationErrors {
  static readonly REASON_REQUIRED: string = 'You need to explain why you’re owed the money'
  static readonly REASON_TOO_LONG: string = 'Enter reason no longer than $constraint1 characters'
}

export class Reason implements Serializable<Reason>, CompletableTask {
  @IsDefined({ message: ValidationErrors.REASON_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.REASON_REQUIRED })
  @MaxLength(ValidationConstraints.FREE_TEXT_MAX_LENGTH, { message: ValidationErrors.REASON_TOO_LONG })
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
