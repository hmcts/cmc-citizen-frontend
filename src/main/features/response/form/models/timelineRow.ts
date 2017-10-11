import { IsDefined, ValidateIf } from 'class-validator'

import { IsNotBlank } from 'forms/validation/validators/isBlank'

export class ValidationErrors {
  static readonly DATE_REQUIRED: string = 'Enter reason'
  static readonly DESCRIPTION_REQUIRED: string = 'Enter amount'
}

export class TimelineRow {

  @ValidateIf(o => o.amount !== undefined)
  @IsDefined({ message: ValidationErrors.DATE_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.DATE_REQUIRED })
  date?: string = undefined

  @ValidateIf(o => o.reason !== undefined)
  @IsDefined({ message: ValidationErrors.DESCRIPTION_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.DESCRIPTION_REQUIRED })
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
