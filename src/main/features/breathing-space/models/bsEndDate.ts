import { IsValidLocalDate } from '@hmcts/cmc-validators'
import { LocalDate } from 'forms/models/localDate'
import { IsTodayOrInFuture } from 'forms/validation/validators/isTodayOrInFuture'

export class ValidationErrors {
  static readonly DATE_NOT_VALID: string = 'Please enter a valid date'
  static readonly DATE_TODAY_OR_IN_FUTURE: string = "Expected end date must not be before today's date"
}

export class BreathingSpaceRespiteEnd {
  @IsValidLocalDate({ message: ValidationErrors.DATE_NOT_VALID })
  @IsTodayOrInFuture({ message: ValidationErrors.DATE_TODAY_OR_IN_FUTURE })
  respiteEnd?: LocalDate

  constructor (num?: LocalDate) {
    this.respiteEnd = num
  }

  static fromObject (input?: any): BreathingSpaceRespiteEnd {
    if (!input) {
      return input
    }
    return new BreathingSpaceRespiteEnd(LocalDate.fromObject(input.respiteEnd))
  }

  deserialize (input?: any): BreathingSpaceRespiteEnd {
    if (input) {
      this.respiteEnd = new LocalDate().deserialize(input.respiteEnd)
    }
    return this
  }
}
