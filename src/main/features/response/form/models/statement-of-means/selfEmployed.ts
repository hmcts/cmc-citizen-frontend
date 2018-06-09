import { IsDefined, Max } from 'class-validator'
import { IsNotBlank, Fractions, MaxLength } from '@hmcts/cmc-validators'
import { toNumberOrUndefined } from 'shared/utils/numericUtils'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { ValidationConstraints as GlobalValidationConstants } from 'forms/validation/validationConstraints'

export class ValidationErrors {
  static readonly JOB_TITLE_REQUIRED: string = 'Enter a job title'
  static readonly ANNUAL_TURNOVER_REQUIRED: string = 'Enter an annual turnover'
  static readonly TOO_MUCH: string = 'Are you sure this is a valid value?'
}

export class SelfEmployed {

  @IsDefined({ message: ValidationErrors.JOB_TITLE_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.JOB_TITLE_REQUIRED })
  @MaxLength(GlobalValidationConstants.STANDARD_TEXT_INPUT_MAX_LENGTH,
    { message: GlobalValidationErrors.TEXT_TOO_LONG })
  jobTitle?: string

  @IsDefined({ message: ValidationErrors.ANNUAL_TURNOVER_REQUIRED })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS })
  @Max(GlobalValidationConstants.MAX_VALUE, { message: ValidationErrors.TOO_MUCH })
  annualTurnover?: number

  constructor (jobTitle?: string, annualTurnover?: number) {
    this.jobTitle = jobTitle
    this.annualTurnover = annualTurnover
  }

  static fromObject (value?: any): SelfEmployed {
    if (!value) {
      return value
    }

    return new SelfEmployed(
      value.jobTitle || undefined,
      toNumberOrUndefined(value.annualTurnover),
    )
  }

  deserialize (input?: any): SelfEmployed {
    if (input) {
      this.jobTitle = input.jobTitle
      this.annualTurnover = input.annualTurnover
    }
    return this
  }
}
