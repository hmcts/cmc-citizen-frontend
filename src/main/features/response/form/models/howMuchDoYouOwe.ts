import { IsDefined, IsPositive } from 'class-validator'
import { Fractions, IsLessThan } from '@hmcts/cmc-validators'
import { ValidationErrors as DefaultValidationErrors } from 'forms/validation/validationErrors'
import { toNumberOrUndefined } from 'shared/utils/numericUtils'

export class HowMuchDoYouOwe {

  @IsDefined({ message: DefaultValidationErrors.AMOUNT_REQUIRED })
  @IsLessThan('totalAmount', { message: DefaultValidationErrors.AMOUNT_ENTERED_TOO_LARGE })
  @IsPositive({ message: DefaultValidationErrors.AMOUNT_NOT_VALID })
  @Fractions(0, 2, { message: DefaultValidationErrors.AMOUNT_INVALID_DECIMALS })
  amount?: number

  totalAmount?: number

  constructor (amount?: number, totalAmount?: number) {
    this.amount = amount
    this.totalAmount = totalAmount
  }

  static fromObject (value?: any): HowMuchDoYouOwe {
    if (!value) {
      return value
    }

    const amount = toNumberOrUndefined(value.amount)
    const totalAmount = toNumberOrUndefined(value.totalAmount)

    return new HowMuchDoYouOwe(amount, totalAmount)
  }

  deserialize (input: any): HowMuchDoYouOwe {
    if (input) {
      this.amount = input.amount
      this.totalAmount = input.totalAmount
    }

    return this
  }
}
