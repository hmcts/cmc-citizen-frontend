import * as _ from 'lodash'
import { IsDefined, Min, ValidateIf } from 'class-validator'

import { IsNotBlank } from 'app/forms/validation/validators/isBlank'
import { Fractions } from 'app/forms/validation/validators/fractions'
import { MaxLength } from 'app/forms/validation/validators/maxLengthValidator'

export class ValidationErrors {
  static readonly REASON_REQUIRED: string = 'Enter a reason'
  static readonly REASON_TOO_LONG: string = 'Enter a reason no longer than $constraint1 characters'

  static readonly AMOUNT_REQUIRED: string = 'Enter a amount'
  static readonly AMOUNT_NOT_VALID: string = 'Enter a valid amount'
  static readonly AMOUNT_INVALID_DECIMALS: string = 'Enter a valid amount, maximum two decimal places'
}

export class ValidationConstants {
  static readonly REASON_MAX_LENGTH: number = 99000
}

export class ClaimAmountRow {

  @ValidateIf(o => o.amount !== undefined)
  @IsDefined({ message: ValidationErrors.REASON_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.REASON_REQUIRED })
  @MaxLength(ValidationConstants.REASON_MAX_LENGTH, { message: ValidationErrors.REASON_TOO_LONG })
  reason?: string

  @ValidateIf(o => o.reason !== undefined)
  @IsDefined({ message: ValidationErrors.AMOUNT_REQUIRED })
  @Min(0.01, { message: ValidationErrors.AMOUNT_NOT_VALID })
  @Fractions(0, 2, { message: ValidationErrors.AMOUNT_INVALID_DECIMALS })
  amount?: number

  constructor (reason?: string, amount?: number) {
    this.reason = reason
    this.amount = amount
  }

  static empty (): ClaimAmountRow {
    return new ClaimAmountRow(undefined, undefined)
  }

  static fromObject (value?: any): ClaimAmountRow {
    if (!value) {
      return value
    }

    const reason = value.reason || undefined
    const amount = value.amount ? _.toNumber(value.amount) : undefined
    return new ClaimAmountRow(reason, amount)
  }

  deserialize (input?: any): ClaimAmountRow {
    if (input) {
      this.amount = input.amount
      this.reason = input.reason
    }

    return this
  }
}
