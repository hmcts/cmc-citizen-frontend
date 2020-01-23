import { IsDefined, IsIn, ValidateIf } from '@hmcts/class-validator'

import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { MultiRowFormItem } from 'forms/models/multiRowFormItem'
import { Fractions } from '@hmcts/cmc-validators'
import * as toBoolean from 'to-boolean'
import { toNumberOrUndefined } from 'shared/utils/numericUtils'
import { BankAccountType } from 'response/form/models/statement-of-means/bankAccountType'

export class ValidationErrors {
  static readonly TYPE_OF_ACCOUNT_REQUIRED: string = 'Select a type of account'
}

export class BankAccountRow extends MultiRowFormItem {

  @ValidateIf(o => o.isAtLeastOneFieldPopulated())
  @IsDefined({ message: ValidationErrors.TYPE_OF_ACCOUNT_REQUIRED })
  @IsIn(BankAccountType.all(), { message: ValidationErrors.TYPE_OF_ACCOUNT_REQUIRED })
  typeOfAccount?: BankAccountType

  @ValidateIf(o => o.isAtLeastOneFieldPopulated())
  @IsDefined({ message: GlobalValidationErrors.SELECT_AN_OPTION })
  joint?: boolean

  @ValidateIf(o => o.isAtLeastOneFieldPopulated())
  @IsDefined({ message: GlobalValidationErrors.NUMBER_REQUIRED })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS })
  balance?: number

  constructor (typeOfAccount?: BankAccountType, joint?: boolean, balance?: number) {
    super()
    this.typeOfAccount = typeOfAccount
    this.joint = joint
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
    const joint: boolean = value.joint !== '' ? toBoolean(value.joint) : undefined
    const balance: number = toNumberOrUndefined(value.balance)

    return new BankAccountRow(typeOfAccount, joint, balance)
  }

  deserialize (input?: any): BankAccountRow {
    if (input) {
      this.typeOfAccount = BankAccountType.valueOf(input.typeOfAccount && input.typeOfAccount.value)
      this.joint = input.joint
      this.balance = input.balance
    }

    return this
  }
}
