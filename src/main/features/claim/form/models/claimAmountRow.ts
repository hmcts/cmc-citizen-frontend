import * as _ from 'lodash'
import { IsDefined, Min, ValidateIf } from 'class-validator'

import { IsNotBlank } from 'app/forms/validation/validators/isBlank'
import { Fractions } from 'app/forms/validation/validators/fractions'
import { MaxLength } from 'app/forms/validation/validators/maxLengthValidator'
import { ValidationConstraints } from 'forms/validation/validationConstraints'

export class ValidationErrors {
  static readonly REASON_REQUIRED: string = 'Enter a reason'
  static readonly REASON_TOO_LONG: string = 'You’ve entered too many characters'

  static readonly AMOUNT_REQUIRED: string = 'Enter an amount'
  static readonly AMOUNT_NOT_VALID: string = 'Enter a valid amount'
  static readonly AMOUNT_INVALID_DECIMALS: string = 'Enter a valid amount, maximum two decimal places'
}

export class ClaimAmountRow {

  @ValidateIf(o => o.amount !== undefined)
  @IsDefined({ message: ValidationErrors.REASON_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.REASON_REQUIRED })
  @MaxLength(ValidationConstraints.FREE_TEXT_MAX_LENGTH, { message: ValidationErrors.REASON_TOO_LONG })
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

  static hasAValidCommaInNumber (input: string): boolean {
    const output: string[] = input.split(',')

    return output[output.length - 1].length >= 3
  }

  static translateToNumber (input?: any): any {

    const output: string = this.hasAValidCommaInNumber(input) ? input.replace(new RegExp(/,/g), '') : input

    const numberValue = _.toNumber(output)
    const isExponential = numberValue.toString().match(new RegExp('\\d*[Ee][+-]?\\d*?'))

    if (!isNaN(numberValue) && !isExponential) {
      return numberValue
    } else {
      return output
    }
  }

  static fromObject (value?: any): ClaimAmountRow {
    if (!value) {
      return value
    }

    const reason = value.reason || undefined
    const amount = value.amount ? ClaimAmountRow.translateToNumber(value.amount) : undefined

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
