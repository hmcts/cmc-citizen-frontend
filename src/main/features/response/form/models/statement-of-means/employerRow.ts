import { IsDefined, ValidateIf } from 'class-validator'

import { IsNotBlank } from 'forms/validation/validators/isBlank'
import { MaxLength } from 'forms/validation/validators/maxLengthValidator'

export class ValidationErrors {
  static readonly EMPLOYER_NAME_REQUIRED: string = 'Enter an employer name'
  static readonly EMPLOYER_NAME_TOO_LONG: string = 'You’ve entered too many characters'
  static readonly JOB_TITLE_REQUIRED: string = 'Enter a job title'
  static readonly JOB_TITLE_TOO_LONG: string = 'You’ve entered too many characters'
}

export class ValidationConstraints {
  static readonly EMPLOYER_NAME_MAX_LENGTH: number = 50
  static readonly JOB_TITLE_MAX_LENGTH: number = 50
}

export class EmployerRow {

  @ValidateIf(o => o.jobTitle !== undefined)
  @IsDefined({ message: ValidationErrors.EMPLOYER_NAME_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.EMPLOYER_NAME_REQUIRED })
  @MaxLength(ValidationConstraints.EMPLOYER_NAME_MAX_LENGTH, { message: ValidationErrors.EMPLOYER_NAME_TOO_LONG })
  employerName?: string

  @ValidateIf(o => o.employerName !== undefined)
  @IsDefined({ message: ValidationErrors.JOB_TITLE_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.JOB_TITLE_REQUIRED })
  @MaxLength(ValidationConstraints.JOB_TITLE_MAX_LENGTH, { message: ValidationErrors.JOB_TITLE_TOO_LONG })
  jobTitle?: string = undefined

  constructor (employerName?: string, jobTitle?: string) {
    this.employerName = employerName
    this.jobTitle = jobTitle
  }

  static empty (): EmployerRow {
    return new EmployerRow(undefined, undefined)
  }

  static fromObject (value?: any): EmployerRow {
    if (!value) {
      return value
    }

    const employerName: string = value.employerName || undefined
    const jobTitle: string = value.jobTitle || undefined

    return new EmployerRow(employerName, jobTitle)
  }

  deserialize (input?: any): EmployerRow {
    if (input) {
      this.employerName = input.employerName
      this.jobTitle = input.jobTitle
    }

    return this
  }
}
