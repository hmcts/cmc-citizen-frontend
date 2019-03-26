import { ArrayNotEmpty, IsDefined, ValidateIf, ValidateNested } from '@hmcts/class-validator'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { LocalDate } from 'forms/models/localDate'
import { IsValidLocalDate } from '@hmcts/cmc-validators'
import { IsFutureDate } from 'forms/validation/validators/dateFutureConstraint'

export class ValidationErrors {
  static readonly AT_LEAST_ONE_DATE: string = 'Select at least one date or choose No'
  static readonly DATE_NOT_VALID: string = 'Please enter a valid date'
}

export class Availability {

  @IsDefined({ message: GlobalValidationErrors.YES_NO_REQUIRED })
  hasUnavailableDates?: boolean

  @ValidateIf(o => o.hasUnavailableDates)
  @ValidateNested()
  @ArrayNotEmpty({ message: ValidationErrors.AT_LEAST_ONE_DATE })
  @IsValidLocalDate({ message: ValidationErrors.DATE_NOT_VALID, each: true })
  unavailableDates?: LocalDate[]

  @IsFutureDate({ message: ValidationErrors.DATE_NOT_VALID })
  @IsValidLocalDate({ message: ValidationErrors.DATE_NOT_VALID })
  newDate?: LocalDate

  constructor (hasUnavailableDates?: boolean, unavailableDates?: LocalDate[], newDate?: LocalDate) {
    this.hasUnavailableDates = hasUnavailableDates
    this.unavailableDates = unavailableDates
    this.newDate = newDate
  }

  static fromObject (value?: any): Availability {
    if (!value) {
      return value
    }

    const availability = new Availability(
      value.hasUnavailableDates !== undefined ? value.hasUnavailableDates.toString() === 'true' : undefined,
      value.unavailableDates && (value.unavailableDates.constructor === Array)
        ? value.unavailableDates.map(date => LocalDate.fromObject(date)) : [],
      LocalDate.fromObject(value.newDate)
    )
    return availability
  }

  isCompleted (): boolean {
    if (this.hasUnavailableDates === undefined || this.hasUnavailableDates === null) {
      return false
    }

    if (this.hasUnavailableDates) {
      return !!this.unavailableDates && this.unavailableDates.length > 0
    }

    return true
  }
}
