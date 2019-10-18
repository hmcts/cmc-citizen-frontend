import { IsDefined, MaxLength, ValidateNested } from '@hmcts/class-validator'
import { IsNotBlank, IsValidLocalDate } from '@hmcts/cmc-validators'
import { IsNotInFuture } from 'forms/validation/validators/notInFuture'
import { LocalDate } from 'forms/models/localDate'
import { ValidationErrors as CommonValidationErrors } from 'forms/validation/validationErrors'
import { CompletableTask } from 'models/task'

export class ValidationErrors {
  static readonly REASON_REQUIRED: string = 'You need to explain why you’re claiming from a particular date'
}

export class InterestStartDate implements CompletableTask {

  @ValidateNested()
  @IsDefined({ message: CommonValidationErrors.DATE_REQUIRED })
  @IsValidLocalDate({ message: CommonValidationErrors.DATE_NOT_VALID })
  @IsNotInFuture({ message: CommonValidationErrors.DATE_IN_FUTURE })
  date?: LocalDate

  @IsDefined({ message: ValidationErrors.REASON_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.REASON_REQUIRED })
  @MaxLength(10000, { message: CommonValidationErrors.REASON_TOO_LONG })
  reason?: string

  constructor (date?: LocalDate, reason?: string) {
    this.date = date
    this.reason = reason
  }

  static fromObject (value?: any): InterestStartDate {
    if (value == null) {
      return value
    }

    return new InterestStartDate(LocalDate.fromObject(value.date), value.reason)
  }

  deserialize (input?: any): InterestStartDate {
    if (input) {
      this.date = new LocalDate().deserialize(input.date)
      this.reason = input.reason
    }
    return this
  }

  isCompleted (): boolean {
    return !!this.reason && this.reason.length > 0 && this.date.toMoment().isValid()
  }
}
