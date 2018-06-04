import { IsDefined, IsPositive, MaxLength, Min, ValidateNested } from 'class-validator'
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
  static readonly NOT_OWE_FULL_AMOUNT_REQUIRED: string = 'Explain why you don’t owe the full amount'
  static readonly VALID_AMOUNT_REQUIRED: string = 'Enter a valid amount paid'
  static readonly AMOUNT_REQUIRED: string = 'Enter an amount'
  static readonly AMOUNT_NOT_VALID: string = 'Enter valid amount'
  static readonly DATE_REQUIRED: string = 'Enter a date'
  static readonly VALID_PAST_DATE: string = `Enter date before ${currentDate}`
  static readonly AMOUNT_INVALID_DECIMALS: string = 'Enter valid amount, maximum two decimal places'
}

export class HowMuchPaid {

  @IsDefined({ message: ValidationErrors.AMOUNT_REQUIRED })
  @IsPositive({ message: ValidationErrors.VALID_AMOUNT_REQUIRED })
  @Min(0.01, { message: ValidationErrors.AMOUNT_NOT_VALID })
  @Fractions(0, 2, { message: ValidationErrors.AMOUNT_INVALID_DECIMALS })
  amount?: number

  @ValidateNested()
  @IsDefined({ message: ValidationErrors.DATE_REQUIRED })
  @IsValidLocalDate({ message: ValidationErrors.DATE_REQUIRED })
  @IsPastDate({ message: ValidationErrors.VALID_PAST_DATE })
  date?: LocalDate

  @IsDefined({ message: ValidationErrors.NOT_OWE_FULL_AMOUNT_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.NOT_OWE_FULL_AMOUNT_REQUIRED })
  @MaxLength(ValidationConstraints.FREE_TEXT_MAX_LENGTH, { message: DefaultValidationErrors.TEXT_TOO_LONG })
  text?: string

  constructor (amount?: number, date?: LocalDate, text?: string) {
    this.amount = amount
    this.date = date
    this.text = text
  }

  static fromObject (value?: any): HowMuchPaid {
    if (value) {
      const amount = toNumberOrUndefined(value.amount)
      const pastDate = LocalDate.fromObject(value.date)
      const text = value.text
      return new HowMuchPaid(amount, pastDate, text)
    } else {
      return new HowMuchPaid()
    }
  }

  deserialize (input: any): HowMuchPaid {
    if (input) {
      this.amount = input.amount
      this.date = new LocalDate().deserialize(input.date)
      this.text = input.text
    }
    return this
  }

  isCompleted (): boolean {
    return !!this.date.year && this.date.year.toString().length > 0 &&
      !!this.text && this.text.length > 0 &&
      !!this.amount && this.amount > 0
  }
}
