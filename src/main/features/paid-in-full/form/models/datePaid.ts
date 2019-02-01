import { ValidationErrors } from 'forms/validation/validationErrors'
import { IsValidLocalDate } from '@hmcts/cmc-validators'
import { ValidateNested } from '@hmcts/class-validator'
import { LocalDate } from 'forms/models/localDate'
import { IsNotInFuture } from 'forms/validation/validators/notInFuture'

export class DatePaid {

  @ValidateNested()
  @IsNotInFuture({ message: ValidationErrors.DATE_IN_FUTURE })
  @IsValidLocalDate({ message: ValidationErrors.DATE_NOT_VALID })
  date: LocalDate

  constructor (date?: LocalDate) {
    this.date = date
  }

  static fromObject (input?: any): DatePaid {
    if (!input) {
      return input
    }

    return new DatePaid(LocalDate.fromObject(input.date))
  }

  deserialize (input: any): DatePaid {
    if (input) {
      this.date = new LocalDate().deserialize(input.date)
    }
    return this
  }
}
