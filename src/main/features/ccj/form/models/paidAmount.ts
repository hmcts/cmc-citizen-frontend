import { IsDefined, IsIn, IsPositive, ValidateIf } from 'class-validator'
import { Serializable } from 'models/serializable'
import { PaidAmountOption } from 'ccj/form/models/yesNoOption'

export class ValidationErrors {
  static readonly OPTION_REQUIRED: string = 'Choose option: yes or no'
  static readonly AMOUNT_REQUIRED: string = 'Enter an amount'
  static readonly AMOUNT_NOT_VALID: string = 'Invalid amount'
}

export class PaidAmount implements Serializable <PaidAmount> {

  @IsDefined({ message: ValidationErrors.OPTION_REQUIRED })
  @IsIn(PaidAmountOption.all(), { message: ValidationErrors.OPTION_REQUIRED })
  option?: PaidAmountOption

  @ValidateIf(o => o.option === PaidAmountOption.YES)
  @IsDefined({ message: ValidationErrors.AMOUNT_REQUIRED })
  @IsPositive({ message: ValidationErrors.AMOUNT_NOT_VALID })
  amount?: number

  constructor (option?: PaidAmountOption, amount?: number) {
    this.option = option
    this.amount = amount
  }

  static fromObject (value?: any): PaidAmount {
    if (value && value.option) {
      const amount = value.amount ? parseFloat(value.amount) : undefined
      const option = PaidAmountOption.all()
        .filter(option => option.value === value.option)
        .pop()
      return new PaidAmount(option, amount)
    } else {
      return new PaidAmount()
    }
  }

  deserialize (input?: any): PaidAmount {
    if (input) {
      this.option = input.option
      this.amount = (input.option && input.option.value === PaidAmountOption.YES.value) ? input.amount : undefined
    }

    return this
  }
}
