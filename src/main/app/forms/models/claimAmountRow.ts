import * as _ from 'lodash'
import { IsDefined, Min, ValidateIf } from 'class-validator'

import { IsNotBlank } from 'forms/validation/validators/isBlank'
import { Fractions } from 'forms/validation/validators/fractions'

export class ValidationErrors {
  static readonly REASON_REQUIRED: string = 'Enter reason'

  static readonly AMOUNT_REQUIRED: string = 'Enter amount'
  static readonly AMOUNT_NOT_VALID: string = 'Enter valid amount'
  static readonly AMOUNT_INVALID_DECIMALS: string = 'Enter valid amount, maximum two decimal places'
}

export default class ClaimAmountRow {

  @ValidateIf(o => o.amount !== undefined)
  @IsDefined({ message: ValidationErrors.REASON_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.REASON_REQUIRED })
  reason?: string = undefined

  @ValidateIf(o => o.reason !== undefined)
  @IsDefined({ message: ValidationErrors.AMOUNT_REQUIRED })
  @Min(0.01, { message: ValidationErrors.AMOUNT_NOT_VALID })
  @Fractions(0, 2, { message: ValidationErrors.AMOUNT_INVALID_DECIMALS })
  amount?: number = undefined

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

    const reason = value.reason ? value.reason : undefined
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
