import { IsDefined, MaxLength } from 'class-validator'
import { ValidationErrors as CommonValidationErrors } from 'app/forms/validation/validationErrors'

import { CompletableTask } from 'app/models/task'

export class ValidationErrors {
  static readonly NUMBER_REQUIRED: string = 'Enter UK phone number'
}

export class MobilePhone implements CompletableTask {

  @IsDefined({ message: ValidationErrors.NUMBER_REQUIRED })
  @MaxLength(30, { message: CommonValidationErrors.TEXT_TOO_LONG })
  number?: string

  constructor (num?: string) {
    this.number = num
  }

  static fromObject (input?: any): MobilePhone {
    return new MobilePhone(input.number)
  }

  deserialize (input?: any): MobilePhone {
    if (input) {
      this.number = input.number
    }
    return this
  }

  isCompleted (): boolean {
    return !!this.number && this.number.length > 0
  }
}
