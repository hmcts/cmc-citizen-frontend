import { IsDefined, ValidateNested } from 'class-validator'

import { IsValidLocalDate } from 'forms/validation/validators/isValidLocalDate'
import { IsTodayOrInFuture } from 'forms/validation/validators/isTodayOrInFuture'

import { Serializable } from 'models/serializable'
import { LocalDate } from 'forms/models/localDate'
import { IsValidYearFormat } from 'app/forms/validation/validators/isValidYearFormat'

export class ValidationErrors {
  static readonly DATE_REQUIRED: string = 'Enter a date'
  static readonly DATE_NOT_VALID: string = 'Enter a valid date'
  static readonly DATE_TODAY_OR_IN_FUTURE: string = 'Enter a date that is today or in the future'
  static readonly DATE_INVALID_YEAR: string = 'Enter a 4 digit year'
}

export class PayBySetDate implements Serializable <PayBySetDate> {

  @ValidateNested()
  @IsDefined({ message: ValidationErrors.DATE_REQUIRED })
  @IsValidYearFormat({ message: ValidationErrors.DATE_INVALID_YEAR })
  @IsValidLocalDate({ message: ValidationErrors.DATE_NOT_VALID })
  @IsTodayOrInFuture({ message: ValidationErrors.DATE_TODAY_OR_IN_FUTURE })
  date?: LocalDate

  constructor (date?: LocalDate) {
    this.date = date
  }

  static fromObject (value?: any): PayBySetDate {
    if (value == null) {
      return value
    }

    return new PayBySetDate(LocalDate.fromObject(value.date))
  }

  deserialize (input?: any): PayBySetDate {
    if (input) {
      this.date = new LocalDate().deserialize(input.date)
    }
    return this
  }
}
