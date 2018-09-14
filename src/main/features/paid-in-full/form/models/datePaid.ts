import { IsValidLocalDate } from '@hmcts/cmc-validators'
import { ValidateNested } from 'class-validator'
import { LocalDate } from 'forms/models/localDate'
import { IsNotInFuture } from 'forms/validation/validators/notInFuture'
export class ValidationErrors {
  static readonly DATE_NOT_VALID: string = 'Please enter a valid date'
  static readonly DATE_IN_FUTURE = 'Please enter a date that is not in the future'
}

export class DatePaid {

  @ValidateNested()
  @IsNotInFuture({ message: ValidationErrors.DATE_IN_FUTURE })
  @IsValidLocalDate({ message: ValidationErrors.DATE_NOT_VALID })
  date: LocalDate

  constructor (date?: LocalDate) {
    this.date = date
  }

  static fromObject (input?: any): DatePaid {
    if (input == null) {
      return input
    }
    return new DatePaid(input)
  }

  deserialize (input: any): DatePaid {
    if (input) {
      this.date = new LocalDate().deserialize(input.date)
    }
    return this
  }
}
