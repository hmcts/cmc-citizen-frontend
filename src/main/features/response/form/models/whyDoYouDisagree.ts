import { MaxLength, IsDefined } from '@hmcts/class-validator'
import { IsNotBlank } from '@hmcts/cmc-validators'
import { ValidationConstraints } from 'forms/validation/validationConstraints'
import { ValidationErrors as DefaultValidationErrors } from 'forms/validation/validationErrors'

export class ValidationErrors {
  static readonly EXPLANATION_REQUIRED: string = 'Enter text explaining why you disagree'
}

export class WhyDoYouDisagree {
  @IsDefined({ message: ValidationErrors.EXPLANATION_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.EXPLANATION_REQUIRED })
  @MaxLength(ValidationConstraints.FREE_TEXT_MAX_LENGTH, { message: DefaultValidationErrors.TEXT_TOO_LONG })
  text?: string

  constructor (text?: string) {
    this.text = text
  }

  public static fromObject (input?: any): WhyDoYouDisagree {
    if (!input) {
      return input
    }

    return new WhyDoYouDisagree(input.text)
  }

  deserialize (input: any): WhyDoYouDisagree {
    if (input) {
      this.text = input.text
    }
    return this
  }
}
