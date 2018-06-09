import { IsDefined, Max, Min, ValidateIf } from 'class-validator'
import { IsNotBlank, Fractions, MaxLength } from '@hmcts/cmc-validators'
import * as toBoolean from 'to-boolean'
import { toNumberOrUndefined } from 'shared/utils/numericUtils'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { ValidationConstraints as GlobalValidationConstants } from 'forms/validation/validationConstraints'

export class ValidationErrors {
  static readonly REASON_REQUIRED: string = 'Enter a reason'
  static readonly TOO_MUCH: string = 'Are you sure this is a valid value?'
}

export class ValidationConstraints {
  static readonly AMOUNT_YOU_OWE_MIN_VALUE: number = 1
}

export class OnTaxPayments {

  @IsDefined({ message: GlobalValidationErrors.YES_NO_REQUIRED })
  behindOnTaxPayments: boolean

  @ValidateIf(o => o.behindOnTaxPayments === true)
  @IsDefined({ message: GlobalValidationErrors.VALID_OWED_AMOUNT_REQUIRED })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS })
  @Min(ValidationConstraints.AMOUNT_YOU_OWE_MIN_VALUE, { message: GlobalValidationErrors.VALID_OWED_AMOUNT_REQUIRED })
  @Max(GlobalValidationConstants.MAX_VALUE, { message: ValidationErrors.TOO_MUCH })
  amountYouOwe: number

  @ValidateIf(o => o.behindOnTaxPayments === true)
  @IsDefined({ message: ValidationErrors.REASON_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.REASON_REQUIRED })
  @MaxLength(GlobalValidationConstants.FREE_TEXT_MAX_LENGTH, { message: GlobalValidationErrors.TEXT_TOO_LONG })
  reason: string

  constructor (behindOnTaxPayments?: boolean, amountYouOwe?: number, reason?: string) {
    this.behindOnTaxPayments = behindOnTaxPayments
    this.amountYouOwe = amountYouOwe
    this.reason = reason
  }

  static fromObject (value?: any): OnTaxPayments {
    if (!value) {
      return value
    }

    const behindOnTaxPayments: boolean = value.behindOnTaxPayments !== undefined ? toBoolean(value.behindOnTaxPayments) : undefined

    return new OnTaxPayments(
      behindOnTaxPayments,
      behindOnTaxPayments ? toNumberOrUndefined(value.amountYouOwe) : undefined,
      behindOnTaxPayments ? value.reason || undefined : undefined
    )
  }

  deserialize (input?: any): OnTaxPayments {
    if (input) {
      this.behindOnTaxPayments = input.behindOnTaxPayments
      if (this.behindOnTaxPayments) {
        this.amountYouOwe = input.amountYouOwe
        this.reason = input.reason
      }
    }
    return this
  }
}
