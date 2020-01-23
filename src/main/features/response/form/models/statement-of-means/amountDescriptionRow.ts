import { IsDefined, Min, ValidateIf } from '@hmcts/class-validator'
import { MultiRowFormItem } from 'forms/models/multiRowFormItem'
import { toNumberOrUndefined } from 'shared/utils/numericUtils'
import { ValidationConstraints } from 'forms/validation/validationConstraints'
import { IsNotBlank, Fractions, MaxLength } from '@hmcts/cmc-validators'

export class ValidationErrors {
  static readonly DESCRIPTION_REQUIRED: string = 'Enter name for item you added'
  static readonly DESCRIPTION_TOO_LONG: string = 'Name is too long'

  static readonly AMOUNT_REQUIRED: string = 'Enter amount for item you added'
  static readonly AMOUNT_INVALID_DECIMALS: string = 'Maximum two decimal places for item you added'
  static readonly POSITIVE_NUMBER_REQUIRED: string = 'Enter a number higher than 0 for item you added'
}

export class AmountDescriptionRow extends MultiRowFormItem {

  @ValidateIf(o => o.isAtLeastOneFieldPopulated())
  @IsDefined({ message: ValidationErrors.DESCRIPTION_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.DESCRIPTION_REQUIRED })
  @MaxLength(ValidationConstraints.STANDARD_TEXT_INPUT_MAX_LENGTH, { message: ValidationErrors.DESCRIPTION_TOO_LONG })
  description?: string

  @ValidateIf(o => o.isAtLeastOneFieldPopulated())
  @IsDefined({ message: ValidationErrors.AMOUNT_REQUIRED })
  @Fractions(0, 2, { message: ValidationErrors.AMOUNT_INVALID_DECIMALS })
  @Min(1, { message: ValidationErrors.POSITIVE_NUMBER_REQUIRED })
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
