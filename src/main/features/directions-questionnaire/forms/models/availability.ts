import { IsArray, IsDefined, ValidateIf, ValidateNested } from '@hmcts/class-validator'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { YesNoOption } from 'models/yesNoOption'
import { LocalDate } from 'forms/models/localDate'
import { AreValidLocalDates, IsValidLocalDate } from '@hmcts/cmc-validators'
import { AreFutureDates, IsFutureDate } from 'forms/validation/validators/dateFutureConstraint'

export class ValidationErrors {
  static readonly AT_LEAST_ONE_DATE: string = 'Select at least one date or choose No'
  static readonly DATE_NOT_VALID: string = 'Please enter a valid date'
  static readonly FUTURE_DATE: string = 'Enter a date in the future'
}

export class Availability {

  @IsDefined({ message: GlobalValidationErrors.YES_NO_REQUIRED })
  hasUnavailableDates?: YesNoOption

  @ValidateIf(o => o.hasUnavailableDates && o.hasUnavailableDates.option === YesNoOption.YES.option)
  @IsDefined()
  @ArrayNotEmpty()
  unavailableDates?: LocalDate[]

  @IsValidLocalDate({ message: ValidationErrors.DATE_NOT_VALID })
  @IsFutureDate({ message: ValidationErrors.FUTURE_DATE })
  newDate?: LocalDate

  constructor (hasUnavailableDates?: YesNoOption, unavailableDates?: LocalDate[], newDate?: LocalDate) {
    this.hasUnavailableDates = hasUnavailableDates
    this.unavailableDates = unavailableDates
    this.newDate = newDate
  }

  static fromObject (value?: any): Availability {
    if (!value) {
      return value
    }

    return new Availability(
      value.hasUnavailableDates ? YesNoOption.fromObject(value.hasUnavailableDates.option) : undefined,
      value.unavailableDates ? value.unavailableDates.map(date => LocalDate.fromObject(date)) : [],
      LocalDate.fromObject(value.newDate)
    )
  }

  deserialize (input?: any): Availability {
    if (input) {
      this.hasUnavailableDates = YesNoOption.fromObject(input.hasUnavailableDates.option)
      if (input.unavailableDates) {
        this.unavailableDates = input.unavailableDates.map(
          dateStr => moment(Number(dateStr))
        )
      }
    }
    return this
  }
}
