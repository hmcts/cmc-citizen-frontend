import { IsEmail } from 'forms/validation/validators/isEmail'
import { CompletableTask } from 'app/models/task'
import { Validator } from 'class-validator'

export class ValidationErrors {
  static readonly ADDRESS_NOT_VALID: string = 'Enter valid email address'
}

export class Email implements CompletableTask {

  @IsEmail({ message: ValidationErrors.ADDRESS_NOT_VALID })
  address?: string

  constructor (address?: string) {
    this.address = address
  }

  deserialize (input: any): Email {
    if (input) {
      this.address = input.address
    }
    return this
  }

  isCompleted (): boolean {
    return new Validator().validateSync(this).length === 0
  }
}
