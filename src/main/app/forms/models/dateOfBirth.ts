import { ValidateNested, IsDefined, ValidateIf } from 'class-validator'

import { IsValidLocalDate } from 'forms/validation/validators/isValidLocalDate'
import { MaximumAgeValidator } from 'forms/validation/validators/maximumAgeValidator'
import { MinimumAgeValidator } from 'forms/validation/validators/minimumAgeValidator'

import { Serializable } from 'models/serializable'
import { LocalDate } from 'forms/models/localDate'
import { CompletableTask } from 'app/models/task'
import { isValidYearFormat } from 'app/forms/validation/validators/isValidYearFormat'

export class ValidationErrors {
  static readonly DATE_NOT_VALID: string = 'Please enter a valid date'
  static readonly DATE_INVALID_YEAR: string = 'Enter a 4 digit year'
  static readonly DATE_UNDER_18: string = 'You must be over 18 to use this service'
}

export default class DateOfBirth implements Serializable<DateOfBirth>, CompletableTask {
  @IsDefined ({ message: 'Select an option' })
  known: boolean

  @ValidateIf(o => o.known === true)
  @ValidateNested()
  @IsValidLocalDate({ message: ValidationErrors.DATE_NOT_VALID })
  @isValidYearFormat(4, { message: ValidationErrors.DATE_INVALID_YEAR })
  @MinimumAgeValidator(18, { message: ValidationErrors.DATE_UNDER_18 })
  @MaximumAgeValidator(150, { message: ValidationErrors.DATE_NOT_VALID })
  date: LocalDate

  constructor (known?: boolean, date?: LocalDate) {
    this.known = known
    this.date = date
  }

  static fromObject (value?: any): DateOfBirth {
    if (!value) {
      return value
    }

    const dateOfBirth = new DateOfBirth(value.known !== undefined ? value.known === 'true' : undefined, LocalDate.fromObject(value.date))

    if (!dateOfBirth.known) {
      dateOfBirth.date = undefined
    }

    return dateOfBirth
  }

  deserialize (input?: any): DateOfBirth {
    if (input) {
      this.known = input.known
      this.date = new LocalDate().deserialize(input.date)
    }
    return this
  }

  isCompleted (): boolean {
    return !!this.date.year && this.date.year.toString().length > 0
  }
}
