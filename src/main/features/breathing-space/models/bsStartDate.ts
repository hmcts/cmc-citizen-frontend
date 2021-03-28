import { IsValidLocalDate } from '@hmcts/cmc-validators'
import { LocalDate } from 'forms/models/localDate'
import { IsToday } from 'forms/validation/validators/isToday'
import { IsNotInFuture } from 'forms/validation/validators/notInFuture'

export class ValidationErrors {
  static readonly DATE_NOT_VALID: string = 'Please enter a valid date'
  static readonly DATE_IN_FUTURE: string = "Start date must not be after today's date"
}

export class BreathingSpaceRespiteStart {
  @IsValidLocalDate({ message: ValidationErrors.DATE_NOT_VALID })
  @IsNotInFuture({ message: ValidationErrors.DATE_IN_FUTURE })
  @IsToday({ message: ValidationErrors.DATE_IN_FUTURE })
  respiteStart?: LocalDate

  constructor (num?: LocalDate) {
    this.respiteStart = num
  }

  static fromObject (input?: any): BreathingSpaceRespiteStart {
    if (!input) {
      return input
    }

    return new BreathingSpaceRespiteStart(LocalDate.fromObject(input.respiteStart))
  }

  deserialize (input?: any): BreathingSpaceRespiteStart {
    if (input) {
      this.respiteStart = new LocalDate().deserialize(input.respiteStart)
    }
    return this
  }
}
