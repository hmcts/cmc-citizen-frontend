import { IsDefined, MaxLength, ValidateNested } from '@hmcts/class-validator'
import { IsPastDate } from 'forms/validation/validators/datePastConstraint'
import { LocalDate } from 'forms/models/localDate'
import { IsNotBlank, IsValidLocalDate } from '@hmcts/cmc-validators'
import { MomentFactory } from 'shared/momentFactory'
import { ValidationConstraints } from 'forms/validation/validationConstraints'
import { ValidationErrors as CommonValidationErrors } from 'forms/validation/validationErrors'
import { MomentFormatter } from 'utils/momentFormatter'

export class ValidationErrors {
  static readonly EXPLANATION_REQUIRED: string = 'Explain how you paid the amount claimed'
  static readonly DATE_OUTSIDE_RANGE = () => {
    const currentDate = MomentFormatter.formatLongDate(MomentFactory.currentDate())
    return `Enter date before ${currentDate}`
  }
}

export class WhenDidYouPay {

  @ValidateNested()
  @IsDefined({ message: CommonValidationErrors.DATE_REQUIRED })
  @IsPastDate({ message: ValidationErrors.DATE_OUTSIDE_RANGE })
  @IsValidLocalDate({ message: CommonValidationErrors.DATE_NOT_VALID })
  date?: LocalDate

  @IsDefined({ message: ValidationErrors.EXPLANATION_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.EXPLANATION_REQUIRED })
  @MaxLength(ValidationConstraints.FREE_TEXT_MAX_LENGTH, { message: CommonValidationErrors.TEXT_TOO_LONG })
  text?: string

  constructor (date?: LocalDate, text?: string) {
    this.date = date
    this.text = text
  }

  static fromObject (value?: any): WhenDidYouPay {
    if (!value) {
      return value
    }

    const date = LocalDate.fromObject(value.date)
    const text = value.text
    return new WhenDidYouPay(date, text)
  }

  deserialize (input: any): WhenDidYouPay {
    if (input) {
      this.date = new LocalDate().deserialize(input.date)
      this.text = input.text
    }
    return this
  }
}
