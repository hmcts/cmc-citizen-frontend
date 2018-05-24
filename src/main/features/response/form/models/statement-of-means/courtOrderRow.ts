import { IsDefined, Min, ValidateIf } from 'class-validator'

import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { MultiRowFormItem } from 'forms/models/multiRowFormItem'
import { toNumberOrUndefined } from 'shared/utils/numericUtils'
import { Fractions } from '@hmcts/cmc-validators'

export class CourtOrderRow extends MultiRowFormItem {

  @ValidateIf(o => o.isAtLeastOneFieldPopulated())
  @IsDefined({ message: GlobalValidationErrors.AMOUNT_REQUIRED })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS })
  @Min(1, { message: GlobalValidationErrors.POSITIVE_NUMBER_REQUIRED })
  instalmentAmount?: number

  @ValidateIf(o => o.isAtLeastOneFieldPopulated())
  @IsDefined({ message: GlobalValidationErrors.AMOUNT_REQUIRED })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS })
  @Min(1, { message: GlobalValidationErrors.POSITIVE_NUMBER_REQUIRED })
  amount?: number

  @ValidateIf(o => o.isAtLeastOneFieldPopulated())
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
