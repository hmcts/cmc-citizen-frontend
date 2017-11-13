import { MaxLength, IsDefined } from 'class-validator'
import { Serializable } from 'models/serializable'
import { IsNotBlank } from 'app/forms/validation/validators/isBlank'
import { ValidationConstraints } from 'forms/validation/validationConstraints'
import { ValidationErrors as DefaultValidationErrors } from 'forms/validation/validationErrors'

export class ValidationErrors {
  static readonly DEFENCE_REQUIRED: string = "You need to explain why you don't owe the money"
}

export class Defence implements Serializable<Defence> {
  @IsDefined({ message: ValidationErrors.DEFENCE_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.DEFENCE_REQUIRED })
  @MaxLength(ValidationConstraints.FREE_TEXT_MAX_LENGTH, { message: DefaultValidationErrors.FREE_TEXT_TOO_LONG })
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
