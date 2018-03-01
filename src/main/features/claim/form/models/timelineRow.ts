import { IsDefined, ValidateIf } from 'class-validator'

import { IsNotBlank } from 'forms/validation/validators/isBlank'
import { MaxLength } from 'forms/validation/validators/maxLengthValidator'
import {
  ValidationConstraints as DefaultValidationConstraints
} from 'forms/validation/validationConstraints'
import { MultiRowFormItem } from 'forms/models/multiRowFormItem'

export class ValidationErrors {
  static readonly DATE_REQUIRED: string = 'Enter a date'
  static readonly DATE_TOO_LONG: string = 'Enter a date no longer than $constraint1 characters'
  static readonly DESCRIPTION_REQUIRED: string = 'Enter a description of what happened'
  static readonly DESCRIPTION_TOO_LONG: string = 'You’ve entered too many characters'
}

export class ValidationConstraints {
  static readonly DATE_MAX_LENGTH: number = 25
}

export class TimelineRow extends MultiRowFormItem {

  @ValidateIf(o => o.isAtLeastOneFieldPopulated())
  @IsDefined({ message: ValidationErrors.DATE_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.DATE_REQUIRED })
  @MaxLength(ValidationConstraints.DATE_MAX_LENGTH, { message: ValidationErrors.DATE_TOO_LONG })
  date?: string

  @ValidateIf(o => o.isAtLeastOneFieldPopulated())
  @IsDefined({ message: ValidationErrors.DESCRIPTION_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.DESCRIPTION_REQUIRED })
  @MaxLength(DefaultValidationConstraints.FREE_TEXT_MAX_LENGTH, { message: ValidationErrors.DESCRIPTION_TOO_LONG })
  description?: string

  constructor (date?: string, description?: string) {
    super()
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
