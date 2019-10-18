import { IsDefined, Min, ValidateIf } from '@hmcts/class-validator'

import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { MultiRowFormItem } from 'forms/models/multiRowFormItem'
import { toNumberOrUndefined } from 'shared/utils/numericUtils'
import { Fractions, IsNotBlank } from '@hmcts/cmc-validators'

export class ValidationErrors {
  static readonly CLAIM_NUMBER_REQUIRED: string = 'Enter a claim number'
}

export class CourtOrderRow extends MultiRowFormItem {

  @ValidateIf(o => o.isAtLeastOneFieldPopulated())
  @IsDefined({ message: GlobalValidationErrors.AMOUNT_REQUIRED })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS })
  @Min(0, { message: GlobalValidationErrors.POSITIVE_NUMBER_REQUIRED })
  instalmentAmount?: number

  @ValidateIf(o => o.isAtLeastOneFieldPopulated())
  @IsDefined({ message: GlobalValidationErrors.AMOUNT_REQUIRED })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS })
  @Min(1.00, { message: GlobalValidationErrors.AMOUNT_INVALID_LESS_THAN_ONE_POUND })
  amount?: number

  @ValidateIf(o => o.isAtLeastOneFieldPopulated())
  @IsDefined({ message: ValidationErrors.CLAIM_NUMBER_REQUIRED })
  @IsNotBlank({ message: ValidationErrors.CLAIM_NUMBER_REQUIRED })
  claimNumber?: string

  constructor (amount?: number, instalmentAmount?: number, claimNumber?: string) {
    super()
    this.instalmentAmount = instalmentAmount
    this.amount = amount
    this.claimNumber = claimNumber
  }

  static empty (): CourtOrderRow {
    return new CourtOrderRow(undefined, undefined, undefined)
  }

  static fromObject (value?: any): CourtOrderRow {
    if (!value) {
      return value
    }

    const instalmentAmount: number = toNumberOrUndefined(value.instalmentAmount)
    const amount: number = toNumberOrUndefined(value.amount)
    const claimNumber: string = value.claimNumber || undefined

    return new CourtOrderRow(amount, instalmentAmount, claimNumber)
  }

  deserialize (input?: any): CourtOrderRow {
    if (input) {
      this.instalmentAmount = input.instalmentAmount
      this.amount = input.amount
      this.claimNumber = input.claimNumber
    }

    return this
  }
}
