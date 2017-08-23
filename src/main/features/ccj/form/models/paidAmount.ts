import { IsDefined, IsIn, IsPositive, ValidateIf } from 'class-validator'
import { Serializable } from 'models/serializable'
import { CompletableTask } from 'models/task'

export class ValidationErrors {
  static readonly OPTION_REQUIRED: string = 'Choose option: yes or no'
  static readonly AMOUNT_REQUIRED: string = 'Enter an amount'
  static readonly AMOUNT_NOT_VALID: string = 'Invalid amount'
}

export class PaidAmountOption {
  static readonly YES = 'yes'
  static readonly NO = 'no'

  static all (): string[] {
    return [
      PaidAmountOption.YES,
      PaidAmountOption.NO
    ]
  }
}

export class PaidAmount implements Serializable <PaidAmount>, CompletableTask {

  @IsDefined({ message: ValidationErrors.OPTION_REQUIRED })
  @IsIn(PaidAmountOption.all(), { message: ValidationErrors.OPTION_REQUIRED })
  option?: string

  @ValidateIf(o => o.option === PaidAmountOption.YES)
  @IsDefined({ message: ValidationErrors.AMOUNT_REQUIRED })
  @IsPositive({ message: ValidationErrors.AMOUNT_NOT_VALID })
  amount?: number

  constructor (option?: string, amount?: number) {
    this.option = option
    this.amount = amount
  }

  static fromObject (value?: any): PaidAmount {
    if (value == null) {
      return value
    }

    return new PaidAmount(value.option, value.amount ? parseFloat(value.amount) : undefined)
  }

  deserialize (input?: any): PaidAmount {
    if (input) {
      this.option = input.option
      this.amount = input.amount
    }

    return this
  }

  isCompleted (): boolean {
    return !!this.option && (this.option === PaidAmountOption.NO || this.amount > 0)
  }
}
