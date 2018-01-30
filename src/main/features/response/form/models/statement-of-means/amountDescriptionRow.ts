import { IsDefined, Min, ValidateIf } from 'class-validator'
import { MultiRowFormItem } from 'forms/models/multiRowFormItem'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { Fractions } from 'forms/validation/validators/fractions'
import { toNumberOrUndefined } from 'common/utils/numericUtils'
import { ValidationConstraints } from 'forms/validation/validationConstraints'
import { MaxLength } from 'forms/validation/validators/maxLengthValidator'
import { IsNotBlank } from 'forms/validation/validators/isBlank'

export class ValidationErrors {
  static readonly DESCRIPTION_REQUIRED: string = 'Enter a description for the income you added'//   static readonly AMOUNT_REQUIRED: string = 'Enter an amount for the income you added'
  static readonly AMOUNT_INVALID_DECIMALS: string = 'Enter valid amount, maximum two decimal places for the income you added'
  static readonly POSITIVE_NUMBER_REQUIRED: string = 'Enter a number higher than 0 for the field you added'
  static readonly TEXT_TOO_LONG: string = 'You’ve entered too many characters for the field you added'
}

export class AmountDescriptionRow extends MultiRowFormItem {

  @ValidateIf(o => o.isAtLeastOneFieldPopulated())
  @IsDefined({ message: ValidationErrors.DESCRIPTION_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.DESCRIPTION_REQUIRED })
  @MaxLength(ValidationConstraints.STANDARD_TEXT_INPUT_MAX_LENGTH, { message: GlobalValidationErrors.TEXT_TOO_LONG })
  description?: string

  @ValidateIf(o => o.isAtLeastOneFieldPopulated())
  @IsDefined({ message: GlobalValidationErrors.AMOUNT_REQUIRED })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS })
  @Min(1, { message: GlobalValidationErrors.POSITIVE_NUMBER_REQUIRED })
  amount?: number

  constructor (description?: string, amount?: number) {
    super()
    this.description = description
    this.amount = amount
  }

  static empty (): AmountDescriptionRow {
    return new AmountDescriptionRow(undefined, undefined)
  }

  static fromObject (value?: any): AmountDescriptionRow {
    if (!value) {
      return value
    }

    return new AmountDescriptionRow(value.description || undefined, toNumberOrUndefined(value.amount))
  }

  deserialize (input?: any): AmountDescriptionRow {
    if (input) {
      this.amount = input.amount
      this.description = input.description
    }

    return this
  }
}
