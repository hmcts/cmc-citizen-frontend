import { IsDefined, ValidateNested } from '@hmcts/class-validator'

import { IsValidLocalDate } from '@hmcts/cmc-validators'
import { IsTodayOrInFuture } from 'forms/validation/validators/isTodayOrInFuture'

import { LocalDate } from 'forms/models/localDate'

export class ValidationErrors {
  static readonly DATE_REQUIRED: string = 'Enter a date'
  static readonly DATE_NOT_VALID: string = 'Enter a valid date'
  static readonly DATE_TODAY_OR_IN_FUTURE: string = 'Enter a date that is today or in the future'
}

export class PaymentDate {

  @ValidateNested()
  @IsDefined({ message: ValidationErrors.DATE_REQUIRED })
  @IsValidLocalDate({ message: ValidationErrors.DATE_NOT_VALID })
  @IsTodayOrInFuture({ message: ValidationErrors.DATE_TODAY_OR_IN_FUTURE })
  date?: LocalDate

  constructor (date?: LocalDate) {
    this.date = date
  }

  static fromObject (value?: any): PaymentDate {
    if (value == null) {
      return value
    }

    return new PaymentDate(LocalDate.fromObject(value.date))
  }

  deserialize (input?: any): PaymentDate {
    if (input) {
      this.date = new LocalDate().deserialize(input.date)
    }
    return this
  }
}
