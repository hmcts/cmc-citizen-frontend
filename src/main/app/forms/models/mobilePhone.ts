import { IsDefined } from 'class-validator'

import { IsMobilePhone } from 'forms/validation/validators/mobilePhone'
import { CompletableTask } from 'app/models/task'

export class ValidationErrors {
  static readonly NUMBER_REQUIRED: string = 'Enter UK mobile number'
  static readonly NUMBER_NOT_VALID: string = 'Enter valid UK mobile number'
}

export class MobilePhone implements CompletableTask {

  @IsDefined({ message: ValidationErrors.NUMBER_REQUIRED })
  @IsMobilePhone({ message: ValidationErrors.NUMBER_NOT_VALID })
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
