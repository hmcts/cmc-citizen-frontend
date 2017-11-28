import { IsDefined, IsIn, ValidateIf } from 'class-validator'

import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { MultiRowFormItem } from 'forms/models/multiRowFormItem'
import { Fractions } from 'forms/validation/validators/fractions'
import * as toBoolean from 'to-boolean'
import { toNumberOrUndefined } from 'common/utils/numericUtils'
import { BankAccountType } from 'response/form/models/statement-of-means/bankAccountType'

export class ValidationErrors {
  static readonly TYPE_OF_ACCOUNT_REQUIRED: string = 'Select a type of account'
}

export class BankAccountRow extends MultiRowFormItem {

  @ValidateIf(o => o.typeOfAccount !== undefined || o.isJoint !== undefined || o.balance !== undefined)
  @IsDefined({ message: ValidationErrors.TYPE_OF_ACCOUNT_REQUIRED })
  @IsIn(BankAccountType.all(), { message: ValidationErrors.TYPE_OF_ACCOUNT_REQUIRED })
  typeOfAccount?: BankAccountType

  @ValidateIf(o => o.typeOfAccount !== undefined || o.isJoint !== undefined || o.balance !== undefined)
  @IsDefined({ message: GlobalValidationErrors.SELECT_AN_OPTION })
  isJoint?: boolean = undefined

  @ValidateIf(o => o.typeOfAccount !== undefined || o.isJoint !== undefined || o.balance !== undefined)
  @IsDefined({ message: GlobalValidationErrors.NUMBER_REQUIRED })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS })
  balance?: number

  constructor (typeOfAccount?: BankAccountType, isJoint?: boolean, balance?: number) {
    super()
    this.typeOfAccount = typeOfAccount
    this.isJoint = isJoint
    this.balance = balance
  }

  static empty (): BankAccountRow {
    return new BankAccountRow(undefined, undefined, undefined)
  }

  static fromObject (value?: any): BankAccountRow {
    if (!value) {
      return value
    }

    const typeOfAccount: BankAccountType = BankAccountType.valueOf(value.typeOfAccount)
    const isJoint: boolean = value.isJoint !== '' ? toBoolean(value.isJoint) : undefined
    const balance: number = toNumberOrUndefined(value.balance)

    return new BankAccountRow(typeOfAccount, isJoint, balance)
  }

  deserialize (input?: any): BankAccountRow {
    if (input) {
      this.typeOfAccount = BankAccountType.valueOf(input.typeOfAccount)
      this.isJoint = input.isJoint
      this.balance = input.balance
    }

    return this
  }
}
