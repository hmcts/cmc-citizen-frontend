import { IsDefined, Max, Min, ValidateIf } from 'class-validator'
import { IsNotBlank } from '@hmcts/cmc-validators/dist/isNotBlank'
import { MaxLength } from 'forms/validation/validators/maxLengthValidator'
import { Fractions } from 'forms/validation/validators/fractions'
import * as toBoolean from 'to-boolean'
import { toNumberOrUndefined } from 'common/utils/numericUtils'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { ValidationConstraints as GlobalValidationConstants } from 'forms/validation/validationConstraints'

export class ValidationErrors {
  static readonly JOB_TITLE_REQUIRED: string = 'Enter a job title'
  static readonly ANNUAL_TURNOVER_REQUIRED: string = 'Enter an annual turnover'
  static readonly REASON_REQUIRED: string = 'Enter a reason'
  static readonly TOO_MUCH: string = 'Are you sure this is a valid value?'
}

export class ValidationConstraints {
  static readonly AMOUNT_YOU_OWE_MIN_VALUE: number = 1
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

  @IsDefined({ message: GlobalValidationErrors.YES_NO_REQUIRED })
  areYouBehindOnTax: boolean

  @ValidateIf(o => o.areYouBehindOnTax === true)
  @IsDefined({ message: GlobalValidationErrors.VALID_OWED_AMOUNT_REQUIRED })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS })
  @Min(ValidationConstraints.AMOUNT_YOU_OWE_MIN_VALUE, { message: GlobalValidationErrors.VALID_OWED_AMOUNT_REQUIRED })
  @Max(GlobalValidationConstants.MAX_VALUE, { message: ValidationErrors.TOO_MUCH })
  amountYouOwe: number

  @ValidateIf(o => o.areYouBehindOnTax === true)
  @IsDefined({ message: ValidationErrors.REASON_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.REASON_REQUIRED })
  @MaxLength(GlobalValidationConstants.FREE_TEXT_MAX_LENGTH, { message: GlobalValidationErrors.TEXT_TOO_LONG })
  reason: string

  constructor (jobTitle?: string, annualTurnover?: number, areYouBehindOnTax?: boolean, amountYouOwe?: number, reason?: string) {
    this.jobTitle = jobTitle
    this.annualTurnover = annualTurnover
    this.areYouBehindOnTax = areYouBehindOnTax !== undefined ? !!areYouBehindOnTax : undefined
    this.amountYouOwe = amountYouOwe
    this.reason = reason
  }

  static fromObject (value?: any): SelfEmployed {
    if (!value) {
      return value
    }

    const selfEmployed = new SelfEmployed(
      value.jobTitle || undefined,
      toNumberOrUndefined(value.annualTurnover),
      value.areYouBehindOnTax !== undefined ? toBoolean(value.areYouBehindOnTax) === true : undefined,
      toNumberOrUndefined(value.amountYouOwe),
      value.reason || undefined
    )

    if (!selfEmployed.areYouBehindOnTax) {
      selfEmployed.amountYouOwe = selfEmployed.reason = undefined
    }

    return selfEmployed
  }

  deserialize (input?: any): SelfEmployed {
    if (input) {
      this.jobTitle = input.jobTitle
      this.annualTurnover = input.annualTurnover
      this.areYouBehindOnTax = input.areYouBehindOnTax
      if (this.areYouBehindOnTax) {
        this.amountYouOwe = input.amountYouOwe
        this.reason = input.reason
      }
    }
    return this
  }
}
