import { IsDefined, Min, ValidateIf } from 'class-validator'

import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { MultiRowFormItem } from 'forms/models/multiRowFormItem'
import { Fractions } from 'forms/validation/validators/fractions'
import { toNumberOrUndefined } from 'common/utils/numericUtils'
import { IsNotBlank } from 'forms/validation/validators/isBlank'
import { MaxLength } from 'forms/validation/validators/maxLengthValidator'
import { ValidationConstraints } from 'forms/validation/validationConstraints'

export class ValidationErrors {
  static readonly DEBT_REQUIRED: string = 'Enter a debt'
  static readonly TOTAL_OWED_REQUIRED: string = 'Enter the total owed'
  static readonly MONTHLY_PAYMENT_REQUIRED: string = 'Enter a monthly payment'
}

export class DebtRow extends MultiRowFormItem {

  @ValidateIf(o => o.isAtLeastOneFieldPopulated())
  @IsDefined({ message: ValidationErrors.DEBT_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.DEBT_REQUIRED })
  @MaxLength(ValidationConstraints.STANDARD_TEXT_INPUT_MAX_LENGTH, { message: GlobalValidationErrors.TEXT_TOO_LONG })
  debt?: string

  @ValidateIf(o => o.isAtLeastOneFieldPopulated())
  @IsDefined({ message: ValidationErrors.TOTAL_OWED_REQUIRED })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS })
  @Min(1, { message: GlobalValidationErrors.POSITIVE_NUMBER_REQUIRED })
  totalOwed?: number

  @ValidateIf(o => o.isAtLeastOneFieldPopulated())
  @IsDefined({ message: ValidationErrors.MONTHLY_PAYMENT_REQUIRED })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS })
  @Min(0, { message: GlobalValidationErrors.POSITIVE_NUMBER_REQUIRED })
  monthlyPayments?: number

  constructor (debt?: string, totalOwed?: number, monthlyPayment?: number) {
    super()
    this.debt = debt
    this.totalOwed = totalOwed
    this.monthlyPayments = monthlyPayment
  }

  static empty (): DebtRow {
    return new DebtRow(undefined, undefined, undefined)
  }

  static fromObject (value?: any): DebtRow {
    if (!value) {
      return value
    }

    const debt: string = value.debt || undefined
    const totalOwed: number = toNumberOrUndefined(value.totalOwed)
    const monthlyPayments: number = toNumberOrUndefined(value.monthlyPayments)

    return new DebtRow(debt, totalOwed, monthlyPayments)
  }

  deserialize (input?: any): DebtRow {
    if (input) {
      this.debt = input.debt
      this.totalOwed = input.totalOwed
      this.monthlyPayments = input.monthlyPayments
    }

    return this
  }
}
