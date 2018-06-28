import { IsDefined, Min } from 'class-validator'
import { Fractions } from '@hmcts/cmc-validators'
import { ValidationErrors } from 'forms/validation/validationErrors'
import { toNumberOrUndefined } from 'shared/utils/numericUtils'

export class HowMuchHaveYouPaid {

  @IsDefined({ message: ValidationErrors.AMOUNT_REQUIRED })
  @Min(0.01, { message: ValidationErrors.AMOUNT_NOT_VALID })
  @Fractions(0, 2, { message: ValidationErrors.AMOUNT_INVALID_DECIMALS })
  amount?: number

  constructor (amount?: number) {
    this.amount = amount
  }

  static fromObject (value?: any): HowMuchHaveYouPaid {
    if (!value) {
      return value
    }

    return new HowMuchHaveYouPaid(toNumberOrUndefined(value.amount))
  }

  deserialize (input: any): HowMuchHaveYouPaid {
    if (input) {
      this.amount = toNumberOrUndefined(input.amount)
    }
    return this
  }
}
