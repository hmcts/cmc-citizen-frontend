import { IsDefined, Min, ValidateIf } from 'class-validator'

import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { MultiRowFormItem } from 'forms/models/multiRowFormItem'
import { Fractions } from 'forms/validation/validators/fractions'
import { toNumberOrUndefined } from 'shared/utils/numericUtils'
import { IsNotBlank } from '@hmcts/cmc-validators'
import { MaxLength } from 'forms/validation/validators/maxLengthValidator'
import { ValidationConstraints } from 'forms/validation/validationConstraints'

export class ValidationErrors {
  static readonly DETAILS_REQUIRED: string = 'Enter details'
}

export class CourtOrderRow extends MultiRowFormItem {

  @ValidateIf(o => o.isAtLeastOneFieldPopulated())
  @IsDefined({ message: ValidationErrors.DETAILS_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.DETAILS_REQUIRED })
  @MaxLength(ValidationConstraints.STANDARD_TEXT_INPUT_MAX_LENGTH, { message: GlobalValidationErrors.TEXT_TOO_LONG })
  details?: string

  @ValidateIf(o => o.isAtLeastOneFieldPopulated())
  @IsDefined({ message: GlobalValidationErrors.AMOUNT_REQUIRED })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS })
  @Min(1, { message: GlobalValidationErrors.POSITIVE_NUMBER_REQUIRED })
  amount?: number

  constructor (details?: string, amount?: number) {
    super()
    this.details = details
    this.amount = amount
  }

  static empty (): CourtOrderRow {
    return new CourtOrderRow(undefined, undefined)
  }

  static fromObject (value?: any): CourtOrderRow {
    if (!value) {
      return value
    }

    const details: string = value.details || undefined
    const amount: number = toNumberOrUndefined(value.amount)

    return new CourtOrderRow(details, amount)
  }

  deserialize (input?: any): CourtOrderRow {
    if (input) {
      this.details = input.details
      this.amount = input.amount
    }

    return this
  }
}
