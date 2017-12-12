import { IsDefined, Min, ValidateIf } from 'class-validator'
import { MultiRowFormItem } from 'forms/models/multiRowFormItem'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { Fractions } from 'forms/validation/validators/fractions'
import { toNumberOrUndefined } from 'common/utils/numericUtils'
import { ValidationConstraints } from 'forms/validation/validationConstraints'
import { MaxLength } from 'forms/validation/validators/maxLengthValidator'
import { IsNotBlank } from 'forms/validation/validators/isBlank'

export class ValidationErrors {
  static readonly DESCRIPTION_REQUIRED: string = 'Enter a description'
}

export class MonthlyIncomeRow extends MultiRowFormItem {

  @ValidateIf(o => o.isAtLeastOneFieldPopulated())
  @IsDefined({ message: ValidationErrors.DESCRIPTION_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.DESCRIPTION_REQUIRED })
  @MaxLength(ValidationConstraints.STANDARD_TEXT_INPUT_MAX_LENGTH, { message: GlobalValidationErrors.TEXT_TOO_LONG })
  description?: string

  @ValidateIf(o => o.isAtLeastOneFieldPopulated())
  @IsDefined({ message: GlobalValidationErrors.AMOUNT_REQUIRED })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS })
  @Min(0, { message: GlobalValidationErrors.POSITIVE_NUMBER_REQUIRED })
  amount?: number

  constructor (description?: string, amount?: number) {
    super()
    this.description = description
    this.amount = amount
  }

  static empty (): MonthlyIncomeRow {
    return new MonthlyIncomeRow(undefined, undefined)
  }

  static fromObject (value?: any): MonthlyIncomeRow {
    if (!value) {
      return value
    }

    return new MonthlyIncomeRow(value.description || undefined, toNumberOrUndefined(value.amount))
  }

  deserialize (input?: any): MonthlyIncomeRow {
    if (input) {
      this.amount = input.amount
      this.description = input.description
    }

    return this
  }
}
