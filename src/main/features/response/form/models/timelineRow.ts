import { IsDefined, ValidateIf } from 'class-validator'

import { IsNotBlank } from 'forms/validation/validators/isBlank'
import { MaxLength } from 'forms/validation/validators/maxLengthValidator'

export class ValidationErrors {
  static readonly DATE_REQUIRED: string = 'Enter a date'
  static readonly DATE_TOO_LONG: string = 'Enter a date no longer than $constraint1 characters'
  static readonly DESCRIPTION_REQUIRED: string = 'Enter a description of what happened'
  static readonly DESCRIPTION_TOO_LONG: string = 'Enter a description no longer than $constraint1 characters'
}

export class ValidationConstants {
  static readonly DATE_MAX_LENGTH: number = 25
  static readonly DESCRIPTION_MAX_LENGTH: number = 99000
}

export class TimelineRow {

  @ValidateIf(o => o.description !== undefined)
  @IsDefined({ message: ValidationErrors.DATE_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.DATE_REQUIRED })
  @MaxLength(ValidationConstants.DATE_MAX_LENGTH, { message: ValidationErrors.DATE_TOO_LONG })
  date?: string = undefined

  @ValidateIf(o => o.date !== undefined)
  @IsDefined({ message: ValidationErrors.DESCRIPTION_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.DESCRIPTION_REQUIRED })
  @MaxLength(ValidationConstants.DESCRIPTION_MAX_LENGTH, { message: ValidationErrors.DESCRIPTION_TOO_LONG })
  description?: string = undefined

  constructor (date?: string, description?: string) {
    this.date = date
    this.description = description
  }

  static empty (): TimelineRow {
    return new TimelineRow(undefined, undefined)
  }

  static fromObject (value?: any): TimelineRow {
    if (!value) {
      return value
    }

    const date: string = value.date || undefined
    const description: string = value.description || undefined

    return new TimelineRow(date, description)
  }

  deserialize (input?: any): TimelineRow {
    if (input) {
      this.date = input.date
      this.description = input.description
    }

    return this
  }
}
