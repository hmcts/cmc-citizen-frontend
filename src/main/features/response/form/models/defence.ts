import { MaxLength, IsDefined } from '@hmcts/class-validator'
import { IsNotBlank } from '@hmcts/cmc-validators'
import { ValidationConstraints } from 'forms/validation/validationConstraints'
import { ValidationErrors as DefaultValidationErrors } from 'forms/validation/validationErrors'

export class ValidationErrors {
  static readonly DEFENCE_REQUIRED: string = 'You need to explain why you don’t owe the money'
}

export class Defence {
  @IsDefined({ message: ValidationErrors.DEFENCE_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.DEFENCE_REQUIRED })
  @MaxLength(ValidationConstraints.FREE_TEXT_MAX_LENGTH, { message: DefaultValidationErrors.TEXT_TOO_LONG })
  text?: string

  constructor (text?: string) {
    this.text = text
  }

  public static fromObject (input?: any): Defence {
    if (!input) {
      return input
    }

    return new Defence(input.text)
  }

  deserialize (input: any): Defence {
    if (input) {
      this.text = input.text
    }
    return this
  }
}
