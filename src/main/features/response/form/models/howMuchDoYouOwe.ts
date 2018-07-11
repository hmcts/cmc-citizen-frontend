import { IsDefined, IsPositive, MaxLength, ValidateNested } from 'class-validator'
import { IsPastDate } from 'forms/validation/validators/datePastConstraint'
import { LocalDate } from 'forms/models/localDate'
import { IsNotBlank, Fractions, IsValidLocalDate } from '@hmcts/cmc-validators'
import { MomentFactory } from 'shared/momentFactory'
import { MomentFormatter } from 'utils/momentFormatter'
import { ValidationConstraints } from 'forms/validation/validationConstraints'
import { ValidationErrors as DefaultValidationErrors } from 'forms/validation/validationErrors'
import { toNumberOrUndefined } from 'shared/utils/numericUtils'

export class ValidationErrors {
  static readonly AMOUNT_NOT_VALID: string = 'Enter valid amount'
}

export class HowMuchDoYouOwe {

  @IsDefined({ message: DefaultValidationErrors.AMOUNT_REQUIRED })
  @IsPositive({ message: ValidationErrors.AMOUNT_NOT_VALID })
  @Fractions(0, 2, { message: DefaultValidationErrors.AMOUNT_INVALID_DECIMALS })
  amount?: number

  constructor (amount?: number, date?: LocalDate, text?: string) {
    this.amount = amount

  }

  static fromObject (value?: any): HowMuchDoYouOwe {
    if (!value) {
      return value
    }

    const amount = toNumberOrUndefined(value.amount)

    return new HowMuchDoYouOwe(amount)
  }

  deserialize (input: any): HowMuchDoYouOwe {
    if (input) {
      this.amount = input.amount
    }

    return this
  }
}
