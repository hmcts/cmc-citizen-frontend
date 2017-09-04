import { IsDefined, ValidateNested } from 'class-validator'

import { IsValidLocalDate } from 'forms/validation/validators/isValidLocalDate'
import { IsInFuture } from 'forms/validation/validators/IsInFuture'

import { Serializable } from 'models/serializable'
import { LocalDate } from 'forms/models/localDate'
import { isValidYearFormat } from 'app/forms/validation/validators/isValidYearFormat'

export class ValidationErrors {
  static readonly DATE_REQUIRED: string = 'Enter a date'
  static readonly DATE_NOT_VALID: string = 'Enter a valid date'
  static readonly DATE_IN_FUTURE: string = 'Enter a date that is today or in the future'
  static readonly DATE_INVALID_YEAR: string = 'Enter a 4 digit year'
}

export class PayBySetDate implements Serializable <PayBySetDate> {

  @ValidateNested()
  @IsDefined({ message: ValidationErrors.DATE_REQUIRED })
  @isValidYearFormat(4, { message: ValidationErrors.DATE_INVALID_YEAR })
  @IsValidLocalDate({ message: ValidationErrors.DATE_NOT_VALID })
  @IsInFuture({ message: ValidationErrors.DATE_IN_FUTURE })
  date?: LocalDate
  constructor (date?: LocalDate) {
    this.date = date
  }

  static fromObject (value?: any): PayBySetDate {
    if (value == null) {
      return value
    }

    const instance = new PayBySetDate(LocalDate.fromObject(value.date))
    return instance
  }

  deserialize (input?: any): PayBySetDate {
    if (input) {
      this.date = new LocalDate().deserialize(input.date)
    }
    return this
  }
}
