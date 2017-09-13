import { IsDefined, IsIn, MaxLength, ValidateIf, ValidateNested } from 'class-validator'

import { IsNotBlank } from 'forms/validation/validators/isBlank'
import { IsNotInFuture } from 'forms/validation/validators/notInFuture'
import { IsValidLocalDate } from 'forms/validation/validators/isValidLocalDate'

import { Serializable } from 'models/serializable'
import { LocalDate } from 'forms/models/localDate'
import { CompletableTask } from 'app/models/task'
import InterestDateType from 'app/common/interestDateType'
import { IsValidYearFormat } from 'app/forms/validation/validators/isValidYearFormat'

export class ValidationErrors {
  static readonly TYPE_REQUIRED: string = 'Choose when to claim interest from'

  static readonly DATE_REQUIRED: string = 'Enter a date'
  static readonly DATE_NOT_VALID: string = 'Enter a valid date'
  static readonly DATE_IN_FUTURE: string = 'Correct the date. You can\'t use a future date'
  static readonly DATE_INVALID_YEAR: string = 'Enter a 4 digit year'

  static readonly REASON_REQUIRED: string = 'You need to explain why you\'re claiming from a particular date'
  static readonly REASON_TOO_LONG: string = 'Enter reason no longer than $constraint1 characters'
}

export default class InterestDate implements Serializable<InterestDate>, CompletableTask {

  @IsDefined({ message: ValidationErrors.TYPE_REQUIRED })
  @IsIn(InterestDateType.all(), { message: ValidationErrors.TYPE_REQUIRED })
  type?: string

  @ValidateIf(o => o.type === InterestDateType.CUSTOM)
  @ValidateNested()
  @IsDefined({ message: ValidationErrors.DATE_REQUIRED })
  @IsValidLocalDate({ message: ValidationErrors.DATE_NOT_VALID })
  @IsValidYearFormat({ message: ValidationErrors.DATE_INVALID_YEAR })
  @IsNotInFuture({ message: ValidationErrors.DATE_IN_FUTURE })
  date?: LocalDate

  @ValidateIf(o => o.type === InterestDateType.CUSTOM)
  @IsDefined({ message: ValidationErrors.REASON_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.REASON_REQUIRED })
  @MaxLength(250, { message: ValidationErrors.REASON_TOO_LONG })
  reason?: string

  constructor (type?: string, date?: LocalDate, reason?: string) {
    this.type = type
    this.date = date
    this.reason = reason
  }

  static fromObject (value?: any): InterestDate {
    if (value == null) {
      return value
    }

    const instance = new InterestDate(value.type, LocalDate.fromObject(value.date), value.reason)

    if (instance.type === InterestDateType.SUBMISSION) {
      instance.date = undefined
      instance.reason = undefined
    }

    return instance
  }

  deserialize (input?: any): InterestDate {
    if (input) {
      this.type = input.type
      this.date = new LocalDate().deserialize(input.date)
      this.reason = input.reason
    }
    return this
  }

  isCompleted (): boolean {
    return !!this.type && this.type.length > 0
  }
}
