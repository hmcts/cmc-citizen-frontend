import { IsDefined, IsIn } from 'class-validator'
import { Serializable } from 'models/serializable'

export class ValidationErrors {
  static readonly OPTION_REQUIRED: string = 'Choose option'
}

export class CCJPaymentOption implements Serializable <CCJPaymentOption> {

  static readonly IMMEDIATELY = new CCJPaymentOption('immediately')
  static readonly BY_INSTALMENTS = new CCJPaymentOption('instalments')
  static readonly FULL = new CCJPaymentOption('full')

  @IsDefined({ message: ValidationErrors.OPTION_REQUIRED })
  @IsIn(CCJPaymentOption.all(), { message: ValidationErrors.OPTION_REQUIRED })
  option?: string

  constructor (option?: string) {
    this.option = option
  }

  static all (): string[] {
    return [
      CCJPaymentOption.IMMEDIATELY.option,
      CCJPaymentOption.BY_INSTALMENTS.option,
      CCJPaymentOption.FULL.option
    ]
  }

  static fromObject (value?: any): CCJPaymentOption {
    if (value && value.option) {
      const option: string = CCJPaymentOption.all()
        .filter(o => o === value.option)
        .pop()
      return new CCJPaymentOption(option)
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
