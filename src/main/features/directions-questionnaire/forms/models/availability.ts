import { IsDefined } from '@hmcts/class-validator'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { LocalDate } from 'forms/models/localDate'
import { IsValidLocalDate } from '@hmcts/cmc-validators'
import { IsFutureDate } from 'forms/validation/validators/dateFutureConstraint'
import { IsValidAvailabilityDates } from 'directions-questionnaire/forms/validators/availabilityDatesValidator'

export class ValidationErrors {
  static readonly AT_LEAST_ONE_DATE: string = 'Select at least one date or choose No'
  static readonly CLEAR_ALL_DATES: string = 'Remove all dates or choose Yes'
  static readonly DATE_NOT_VALID: string = 'Please enter a valid date'
  static readonly FUTURE_DATE_REQUIRED: string = 'Select a date after today'
}

export class Availability {

  @IsDefined({ message: GlobalValidationErrors.YES_NO_REQUIRED })
  hasUnavailableDates?: boolean

  @IsValidAvailabilityDates()
  unavailableDates?: LocalDate[]

  @IsFutureDate({ message: ValidationErrors.FUTURE_DATE_REQUIRED })
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

    return new Availability(
      value.hasUnavailableDates !== undefined ? value.hasUnavailableDates.toString() === 'true' : undefined,
      value.unavailableDates && (value.unavailableDates.constructor === Array)
        ? value.unavailableDates.map(date => LocalDate.fromObject(date)) : [],
      LocalDate.fromObject(value.newDate)
    )
  }

  deserialize (input?: any): Availability {
    if (input) {
      this.hasUnavailableDates = input.hasUnavailableDates
      this.unavailableDates = this.deserializeDates(input.unavailableDates)
      this.newDate = new LocalDate().deserialize(input.newDate)
    }

    return this
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

  private deserializeDates (dates: any[]): LocalDate[] {
    if (!dates) {
      return []
    }

    return dates.map(date => new LocalDate().deserialize(date))
  }
}
