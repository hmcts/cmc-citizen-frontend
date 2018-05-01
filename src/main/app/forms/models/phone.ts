import { IsDefined, MaxLength } from 'class-validator'
import { ValidationErrors as CommonValidationErrors } from 'app/forms/validation/validationErrors'

export class ValidationErrors {
  static readonly NUMBER_REQUIRED: string = 'Enter UK phone number'
}

export class Phone {

  @IsDefined({ message: ValidationErrors.NUMBER_REQUIRED })
  @MaxLength(30, { message: CommonValidationErrors.TEXT_TOO_LONG })
  number?: string

  constructor (num?: string) {
    this.number = num
  }

  static fromObject (input?: any): Phone {
    return new Phone(input.number)
  }

  deserialize (input?: any): Phone {
    if (input) {
      this.number = input.number
    }
    return this
  }

}
