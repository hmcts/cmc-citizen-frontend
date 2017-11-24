import { IsDefined, ValidateIf } from 'class-validator'

import { IsNotBlank } from 'forms/validation/validators/isBlank'
import { MaxLength } from 'forms/validation/validators/maxLengthValidator'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { ValidationConstraints } from 'forms/validation/validationConstraints'
import { MultiRowFormItem } from 'forms/models/multiRowFormItem'

export class ValidationErrors {
  static readonly EMPLOYER_NAME_REQUIRED: string = 'Enter an employer name'
  static readonly JOB_TITLE_REQUIRED: string = 'Enter a job title'
}

export class EmployerRow extends MultiRowFormItem {

  @ValidateIf(o => o.jobTitle !== undefined)
  @IsDefined({ message: ValidationErrors.EMPLOYER_NAME_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.EMPLOYER_NAME_REQUIRED })
  @MaxLength(ValidationConstraints.STANDARD_TEXT_INPUT_MAX_LENGTH, { message: GlobalValidationErrors.TOO_LONG_INPUT })
  employerName?: string

  @ValidateIf(o => o.employerName !== undefined)
  @IsDefined({ message: ValidationErrors.JOB_TITLE_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.JOB_TITLE_REQUIRED })
  @MaxLength(ValidationConstraints.STANDARD_TEXT_INPUT_MAX_LENGTH, { message: GlobalValidationErrors.TOO_LONG_INPUT })
  jobTitle?: string = undefined

  constructor (employerName?: string, jobTitle?: string) {
    super()
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
