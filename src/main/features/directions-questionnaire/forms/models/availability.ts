import { ArrayNotEmpty, IsDefined, ValidateIf } from '@hmcts/class-validator'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { YesNoOption } from 'models/yesNoOption'
import { LocalDate } from 'forms/models/localDate'
import * as moment from 'moment'

export class Availability {

  @IsDefined({ message: GlobalValidationErrors.YES_NO_REQUIRED })
  hasUnavailableDates?: YesNoOption

  @ValidateIf(o => o.hasUnavailableDates && o.hasUnavailableDates.option === YesNoOption.YES.option)
  @IsDefined()
  @ArrayNotEmpty()
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
      value.unavailabledates
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
