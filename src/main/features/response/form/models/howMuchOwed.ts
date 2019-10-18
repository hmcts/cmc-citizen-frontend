import { IsDefined, IsPositive, MaxLength } from '@hmcts/class-validator'
import { IsNotBlank, Fractions } from '@hmcts/cmc-validators'
import { ValidationErrors } from 'forms/validation/validationErrors'
import { ValidationConstraints } from 'forms/validation/validationConstraints'
import { toNumberOrUndefined } from 'shared/utils/numericUtils'

export class HowMuchOwed {

  @IsDefined({ message: ValidationErrors.AMOUNT_REQUIRED })
  @IsPositive({ message: ValidationErrors.VALID_OWED_AMOUNT_REQUIRED })
  @Fractions(0, 2, { message: ValidationErrors.AMOUNT_INVALID_DECIMALS })
  amount?: number
  @IsDefined({ message: ValidationErrors.WHY_NOT_OWE_FULL_AMOUNT_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.WHY_NOT_OWE_FULL_AMOUNT_REQUIRED })
  @MaxLength(ValidationConstraints.FREE_TEXT_MAX_LENGTH, { message: ValidationErrors.TEXT_TOO_LONG })
  text?: string

  constructor (amount?: number, text?: string) {
    this.amount = amount
    this.text = text
  }

  static fromObject (value?: any): HowMuchOwed {
    if (value) {
      const amount = toNumberOrUndefined(value.amount)
      const text = value.text
      return new HowMuchOwed(amount, text)
    } else {
      return new HowMuchOwed()
    }
  }

  deserialize (input: any): HowMuchOwed {
    if (input) {
      this.amount = input.amount
      this.text = input.text
    }
    return this
  }
}
