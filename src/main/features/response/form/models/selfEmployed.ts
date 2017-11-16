import { IsDefined, Max, Min, ValidateIf } from 'class-validator'
import { Serializable } from 'models/serializable'
import { IsNotBlank } from 'forms/validation/validators/isBlank'
import { MaxLength } from 'forms/validation/validators/maxLengthValidator'
import { ValidationConstraints as GlobalValidationConstants } from 'forms/validation/validationConstraints'
import { Fractions } from 'forms/validation/validators/fractions'
import * as toBoolean from 'to-boolean'
import * as _ from 'lodash'

export class ValidationErrors {
  static readonly JOB_TITLE_REQUIRED: string = 'Enter a job title'
  static readonly JOB_TITLE_TOO_LONG: string = 'You’ve entered too many characters'
  static readonly ANNUAL_TURNOVER_REQUIRED: string = 'Enter an annual turnover'
  static readonly ARE_YOU_BEHIND_ON_TAX_REQUIRED: string = 'Select an option'
  static readonly AMOUNT_YOU_OWE_REQUIRED: string = 'Enter an amount you owe'
  static readonly REASON_REQUIRED: string = 'Enter a reason'
  static readonly REASON_TOO_LONG: string = 'You’ve entered too many characters'
  static readonly AMOUNT_YOU_OWE_NOT_VALID: string = 'Invalid an amount, minimum £$constraint1'
  static readonly INVALID_DECIMALS: string = 'Enter a valid amount, maximum two decimal places'
  static readonly TOO_MUCH: string = 'Are you sure this is a valid value?'
}

export class ValidationConstraints {
  static readonly JOB_TITLE_MAX_LENGTH: number = 100
  static readonly MAX_VALUE: number = 999999999999999
  static readonly AMOUNT_YOU_OWE_MIN_VALUE: number = 1
}

export class SelfEmployed implements Serializable<SelfEmployed> {

  @IsDefined({ message: ValidationErrors.JOB_TITLE_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.JOB_TITLE_REQUIRED })
  @MaxLength(ValidationConstraints.JOB_TITLE_MAX_LENGTH, { message: ValidationErrors.JOB_TITLE_TOO_LONG })
  jobTitle?: string

  @IsDefined({ message: ValidationErrors.ANNUAL_TURNOVER_REQUIRED })
  @Fractions(0, 2, { message: ValidationErrors.INVALID_DECIMALS })
  @Max(ValidationConstraints.MAX_VALUE, { message: ValidationErrors.TOO_MUCH })
  annualTurnover?: number

  @IsDefined({ message: ValidationErrors.ARE_YOU_BEHIND_ON_TAX_REQUIRED })
  areYouBehindOnTax: boolean

  @ValidateIf(o => o.areYouBehindOnTax === true)
  @IsDefined({ message: ValidationErrors.AMOUNT_YOU_OWE_REQUIRED })
  @Fractions(0, 2, { message: ValidationErrors.INVALID_DECIMALS })
  @Min(ValidationConstraints.AMOUNT_YOU_OWE_MIN_VALUE, { message: ValidationErrors.AMOUNT_YOU_OWE_NOT_VALID })
  @Max(ValidationConstraints.MAX_VALUE, { message: ValidationErrors.TOO_MUCH })
  amountYouOwe: number

  @ValidateIf(o => o.areYouBehindOnTax === true)
  @IsDefined({ message: ValidationErrors.REASON_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.REASON_REQUIRED })
  @MaxLength(GlobalValidationConstants.FREE_TEXT_MAX_LENGTH, { message: ValidationErrors.REASON_TOO_LONG })
  reason: string

  constructor (jobTitle?: string, annualTurnover?: number, areYouBehindOnTax?: boolean, amountYouOwe?: number, reason?: string) {
    this.jobTitle = jobTitle
    this.annualTurnover = _.toNumber(annualTurnover)
    this.areYouBehindOnTax = areYouBehindOnTax !== undefined ? !!areYouBehindOnTax : undefined
    this.amountYouOwe = _.toNumber(amountYouOwe)
    this.reason = reason
  }

  static fromObject (value?: any): SelfEmployed {
    if (!value) {
      return value
    }

    const selfEmployed = new SelfEmployed(
      value.jobTitle || undefined,
      value.annualTurnover,
      value.areYouBehindOnTax !== undefined ? toBoolean(value.areYouBehindOnTax) === true : undefined,
      value.amountYouOwe,
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
