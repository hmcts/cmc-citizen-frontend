import { LocalDate } from 'forms/models/localDate'
import { ArrayNotEmpty, IsDefined, ValidateIf } from '@hmcts/class-validator'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { YesNoOption } from 'models/yesNoOption'

export class ValidationErrors {
  static readonly AT_LEAST_ONE_DATE: string = 'Select at least one date or choose No'
}

export class Availability {

  @IsDefined({ message: GlobalValidationErrors.YES_NO_REQUIRED })
  hasUnavailableDates?: YesNoOption

  @ValidateIf(o => o.hasUnavailableDates && o.hasUnavailableDates.option === YesNoOption.YES.option)
  @IsDefined()
  @ArrayNotEmpty({ message: ValidationErrors.AT_LEAST_ONE_DATE })
  unavailableDates?: LocalDate[]

  constructor (hasUnavailableDates?: YesNoOption, unavailableDates?: LocalDate[]) {
    this.hasUnavailableDates = hasUnavailableDates
    this.unavailableDates = unavailableDates
  }

  static fromObject (value?: any): Availability {
    if (!value) {
      return value
    }

    return new Availability(
      YesNoOption.fromObject(value.hasUnavailableDates),
      value.unavailableDates)
  }

  deserialize (input?: any): Availability {
    if (input) {
      this.hasUnavailableDates = YesNoOption.fromObject(input.hasUnavailableDates)
      if (this.hasUnavailableDates === YesNoOption.YES && input.unavailableDates) {
        this.unavailableDates = input.unavailableDates
      }
    }
    return this
  }
}
