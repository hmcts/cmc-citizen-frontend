import { MaxLength, IsDefined } from 'class-validator'
import { Serializable } from 'models/serializable'
import { IsNotBlank } from 'app/forms/validation/validators/isBlank'

export class ValidationErrors {
  static readonly DEFENCE_REQUIRED: string = "You need to explain why you don't owe the money"
  static readonly DEFENCE_TOO_LONG: string = 'Enter reason no longer than $constraint1 characters'
}

export default class Defence implements Serializable<Defence> {
  @IsDefined({ message: ValidationErrors.DEFENCE_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.DEFENCE_REQUIRED })
  @MaxLength(99000, { message: ValidationErrors.DEFENCE_TOO_LONG })
  text?: string

  constructor (text?: string) {
    this.text = text
  }

  deserialize (input: any): Defence {
    if (input) {
      this.text = input.text
    }
    return this
  }
}
