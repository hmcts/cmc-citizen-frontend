import { IsValidLocalDate } from '@hmcts/cmc-validators'
import { LocalDate } from 'forms/models/localDate'
import { IsTodayOrInFuture } from 'forms/validation/validators/isTodayOrInFuture'

export class ValidationErrors {
  static readonly DATE_NOT_VALID: string = 'Please enter a valid date'
  static readonly DATE_TODAY_OR_IN_FUTURE: string = 'Enter a date that is today or in the future'
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

    const dateOfRespite = new BreathingSpaceRespiteEnd(LocalDate.fromObject(input.respiteEnd))

    return dateOfRespite
  }

  deserialize (input?: any): BreathingSpaceRespiteEnd {
    if (input) {
      this.respiteEnd = new LocalDate().deserialize(input.respiteEnd)
    }
    return this
  }

  isCompleted (): boolean {
    return !!this.respiteEnd.year && this.respiteEnd.year.toString().length > 0
  }
}
