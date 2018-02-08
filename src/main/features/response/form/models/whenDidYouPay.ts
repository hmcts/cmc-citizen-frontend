import { IsDefined, MaxLength } from 'class-validator'
import { IsPastDate } from 'forms/validation/validators/datePastConstraint'
import { LocalDate } from 'forms/models/localDate'
import { IsNotBlank } from 'app/forms/validation/validators/isBlank'
import { IsValidYearFormat } from 'app/forms/validation/validators/isValidYearFormat'
import { MomentFactory } from 'common/momentFactory'
import { ValidationConstraints } from 'forms/validation/validationConstraints'
import { ValidationErrors as DefaultValidationErrors } from 'forms/validation/validationErrors'
import { Moment } from 'moment'

const currentDate: Moment = MomentFactory.currentDate()

export class ValidationErrors {
  static readonly EXPLANATION_REQUIRED: string = 'Explain how did you pay the amount claimed'
  static readonly DATE_REQUIRED: string = 'Enter a date'
  static readonly VALID_PAST_DATE: string = `Enter date before ${currentDate}`
  static readonly DATE_INVALID_YEAR: string = 'Enter a 4 digit year'
}

export class WhenDidYouPay {

  @IsDefined({ message: ValidationErrors.DATE_REQUIRED })
  @IsPastDate({ message: ValidationErrors.VALID_PAST_DATE })
  @IsValidYearFormat({ message: ValidationErrors.DATE_INVALID_YEAR })
  date?: LocalDate

  @IsDefined({ message: ValidationErrors.EXPLANATION_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.EXPLANATION_REQUIRED })
  @MaxLength(ValidationConstraints.FREE_TEXT_MAX_LENGTH, { message: DefaultValidationErrors.TEXT_TOO_LONG })
  text?: string

  constructor (date?: LocalDate, text?: string) {
    this.date = date
    this.text = text
  }

  static fromObject (value?: any): WhenDidYouPay {
    if (value) {
      const pastDate = LocalDate.fromObject(value.date)
      const text = value.text
      return new WhenDidYouPay(pastDate, text)
    } else {
      return new WhenDidYouPay()
    }
  }

  deserialize (input: any): WhenDidYouPay {
    if (input) {
      this.date = new LocalDate().deserialize(input.date)
      this.text = input.text
    }
    return this
  }
}
