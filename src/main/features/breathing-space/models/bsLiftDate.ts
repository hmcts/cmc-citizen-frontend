import { IsValidLocalDate } from '@hmcts/cmc-validators'
import { LocalDate } from 'forms/models/localDate'
import { IsNotInFuture } from 'forms/validation/validators/notInFuture'

export class ValidationErrors {
  static readonly DATE_NOT_VALID: string = 'Please enter a valid date'
  static readonly DATE_IN_FUTURE: string = "Date entered must not be after today's date"
}

export class BreathingSpaceLiftDate {
  @IsValidLocalDate({ message: ValidationErrors.DATE_NOT_VALID })
  @IsNotInFuture({ message: ValidationErrors.DATE_IN_FUTURE })
  respiteLiftDate?: LocalDate

  constructor (num?: LocalDate) {
    this.respiteLiftDate = num
  }

  static fromObject (input?: any): BreathingSpaceLiftDate {
    if (!input) {
      return input
    }
    return new BreathingSpaceLiftDate(LocalDate.fromObject(input.respiteLiftDate))
  }

  deserialize (input?: any): BreathingSpaceLiftDate {
    if (input) {
      this.respiteLiftDate = new LocalDate().deserialize(input.respiteLiftDate)
    }
    return this
  }
}
