import { IsDefined, IsPositive, MaxLength, ValidateNested } from '@hmcts/class-validator'
import { IsPastDate } from 'forms/validation/validators/datePastConstraint'
import { LocalDate } from 'forms/models/localDate'
import { IsNotBlank, Fractions, IsValidLocalDate } from '@hmcts/cmc-validators'
import { MomentFactory } from 'shared/momentFactory'
import { MomentFormatter } from 'utils/momentFormatter'
import { ValidationConstraints } from 'forms/validation/validationConstraints'
import { ValidationErrors as DefaultValidationErrors } from 'forms/validation/validationErrors'
import { toNumberOrUndefined } from 'shared/utils/numericUtils'

const currentDate = MomentFormatter.formatLongDate(MomentFactory.currentDate())

export class ValidationErrors {
  static readonly EXPLANATION_REQUIRED: string = 'Enter text explaining how you paid'
  static readonly AMOUNT_NOT_VALID: string = 'Enter valid amount'
  static readonly VALID_PAST_DATE: string = `Enter date before ${currentDate}`
}

export class HowMuchHaveYouPaid {

  @IsDefined({ message: DefaultValidationErrors.AMOUNT_REQUIRED })
  @IsPositive({ message: ValidationErrors.AMOUNT_NOT_VALID })
  @Fractions(0, 2, { message: DefaultValidationErrors.AMOUNT_INVALID_DECIMALS })
  amount?: number

  @ValidateNested()
  @IsDefined({ message: DefaultValidationErrors.DATE_REQUIRED })
  @IsValidLocalDate({ message: DefaultValidationErrors.DATE_REQUIRED })
  @IsPastDate({ message: ValidationErrors.VALID_PAST_DATE })
  date?: LocalDate

  @IsDefined({ message: ValidationErrors.EXPLANATION_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.EXPLANATION_REQUIRED })
  @MaxLength(ValidationConstraints.FREE_TEXT_MAX_LENGTH, { message: DefaultValidationErrors.TEXT_TOO_LONG })
  text?: string

  constructor (amount?: number, date?: LocalDate, text?: string) {
    this.amount = amount
    this.date = date
    this.text = text
  }

  static fromObject (value?: any): HowMuchHaveYouPaid {
    if (!value) {
      return value
    }

    const amount = toNumberOrUndefined(value.amount)
    const pastDate = LocalDate.fromObject(value.date)
    const text = value.text

    return new HowMuchHaveYouPaid(amount, pastDate, text)
  }

  deserialize (input: any): HowMuchHaveYouPaid {
    if (input) {
      this.amount = input.amount
      this.date = new LocalDate().deserialize(input.date)
      this.text = input.text
    }

    return this
  }
}
