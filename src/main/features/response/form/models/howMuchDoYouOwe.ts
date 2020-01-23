import { IsDefined, IsPositive } from '@hmcts/class-validator'
import { Fractions, IsLessThan } from '@hmcts/cmc-validators'
import { ValidationErrors } from 'forms/validation/validationErrors'
import { toNumberOrUndefined } from 'shared/utils/numericUtils'

export class HowMuchDoYouOwe {

  @IsDefined({ message: ValidationErrors.AMOUNT_REQUIRED })
  @IsLessThan('totalAmount', { message: ValidationErrors.AMOUNT_ENTERED_TOO_LARGE })
  @IsPositive({ message: ValidationErrors.AMOUNT_NOT_VALID })
  @Fractions(0, 2, { message: ValidationErrors.AMOUNT_INVALID_DECIMALS })
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
