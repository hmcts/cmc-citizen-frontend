import { IsDefined, Max, Min, ValidateIf } from '@hmcts/class-validator'
import { IsNotBlank, Fractions, MaxLength } from '@hmcts/cmc-validators'
import * as toBoolean from 'to-boolean'
import { toNumberOrUndefined } from 'shared/utils/numericUtils'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { ValidationConstraints as GlobalValidationConstants } from 'forms/validation/validationConstraints'

export class ValidationErrors {
  static readonly REASON_REQUIRED: string = 'Enter a reason'
}

export class ValidationConstraints {
  static readonly AMOUNT_YOU_OWE_MIN_VALUE: number = 0.01
}

export class OnTaxPayments {

  @IsDefined({ message: GlobalValidationErrors.YES_NO_REQUIRED })
  declared: boolean

  @ValidateIf(o => o.declared === true)
  @IsDefined({ message: GlobalValidationErrors.VALID_OWED_AMOUNT_REQUIRED })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS })
  @Min(ValidationConstraints.AMOUNT_YOU_OWE_MIN_VALUE, { message: GlobalValidationErrors.VALID_OWED_AMOUNT_REQUIRED })
  @Max(GlobalValidationConstants.MAX_VALUE, { message: GlobalValidationErrors.AMOUNT_TOO_HIGH })
  amountYouOwe: number

  @ValidateIf(o => o.declared === true)
  @IsDefined({ message: ValidationErrors.REASON_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.REASON_REQUIRED })
  @MaxLength(GlobalValidationConstants.FREE_TEXT_MAX_LENGTH, { message: GlobalValidationErrors.TEXT_TOO_LONG })
  reason: string

  constructor (declared?: boolean, amountYouOwe?: number, reason?: string) {
    this.declared = declared
    this.amountYouOwe = amountYouOwe
    this.reason = reason
  }

  static fromObject (value?: any): OnTaxPayments {
    if (!value) {
      return value
    }

    const declared: boolean = value.declared !== undefined ? toBoolean(value.declared) : undefined

    return new OnTaxPayments(
      declared,
      declared ? toNumberOrUndefined(value.amountYouOwe) : undefined,
      declared ? value.reason || undefined : undefined
    )
  }

  deserialize (input?: any): OnTaxPayments {
    if (input) {
      this.declared = input.declared
      if (this.declared) {
        this.amountYouOwe = input.amountYouOwe
        this.reason = input.reason
      }
    }
    return this
  }
}
