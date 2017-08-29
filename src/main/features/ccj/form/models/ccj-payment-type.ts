import { IsDefined, IsIn } from 'class-validator'
import { Serializable } from 'models/serializable'

export class ValidationErrors {
  static readonly OPTION_REQUIRED: string = 'Choose option'
}

export class CCJPaymentOption implements Serializable <CCJPaymentOption> {

  static readonly IMMEDIATELY = new CCJPaymentOption('immediately')
  static readonly BY_INSTALMENTS = new CCJPaymentOption('by instalments')
  static readonly FULL = new CCJPaymentOption('full')

  static all (): CCJPaymentOption[] {
    return [
      CCJPaymentOption.IMMEDIATELY,
      CCJPaymentOption.BY_INSTALMENTS,
      CCJPaymentOption.FULL
    ]
  }

  @IsDefined({ message: ValidationErrors.OPTION_REQUIRED })
  @IsIn(CCJPaymentOption.all(), { message: ValidationErrors.OPTION_REQUIRED })
  option?: string

  constructor (option?: string) {
    this.option = option
  }

  static fromObject (value?: any): CCJPaymentOption {
    if (value && value.option) {
      const option: CCJPaymentOption = CCJPaymentOption.all()
        .filter(o => o.option === value.option)
        .pop()
      return option
    } else {
      return new CCJPaymentOption()
    }
  }

  deserialize (input?: any): CCJPaymentOption {
    if (input) {
      this.option = input.option
    }

    return this
  }
}
