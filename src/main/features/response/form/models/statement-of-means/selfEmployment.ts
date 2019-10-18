import { IsDefined, Max } from '@hmcts/class-validator'
import { IsNotBlank, Fractions, MaxLength, Min } from '@hmcts/cmc-validators'
import { toNumberOrUndefined } from 'shared/utils/numericUtils'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { ValidationConstraints as GlobalValidationConstants } from 'forms/validation/validationConstraints'

export class ValidationErrors {
  static readonly JOB_TITLE_REQUIRED: string = 'Enter a job title'
  static readonly ANNUAL_TURNOVER_REQUIRED: string = 'Enter an annual turnover'
}

export class SelfEmployment {

  @IsDefined({ message: ValidationErrors.JOB_TITLE_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.JOB_TITLE_REQUIRED })
  @MaxLength(GlobalValidationConstants.STANDARD_TEXT_INPUT_MAX_LENGTH,
    { message: GlobalValidationErrors.TEXT_TOO_LONG })
  jobTitle?: string

  @IsDefined({ message: ValidationErrors.ANNUAL_TURNOVER_REQUIRED })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED })
  @Max(GlobalValidationConstants.MAX_VALUE, { message: GlobalValidationErrors.AMOUNT_TOO_HIGH })
  annualTurnover?: number

  constructor (jobTitle?: string, annualTurnover?: number) {
    this.jobTitle = jobTitle
    this.annualTurnover = annualTurnover
  }

  static fromObject (value?: any): SelfEmployment {
    if (!value) {
      return value
    }

    return new SelfEmployment(
      value.jobTitle || undefined,
      toNumberOrUndefined(value.annualTurnover)
    )
  }

  deserialize (input?: any): SelfEmployment {
    if (input) {
      this.jobTitle = input.jobTitle
      this.annualTurnover = input.annualTurnover
    }
    return this
  }
}
