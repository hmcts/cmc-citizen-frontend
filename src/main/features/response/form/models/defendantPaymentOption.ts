import { IsDefined, IsIn } from 'class-validator'
import { Serializable } from 'models/serializable'

export class ValidationErrors {
  static readonly OPTION_REQUIRED: string = 'Choose option'
}

export class PaymentType {
  static readonly INSTALMENTS = new PaymentType('INSTALMENTS', 'By instalments')
  static readonly FULL_BY_SPECIFIED_DATE = new PaymentType('FULL_BY_SPECIFIED_DATE', 'The full amount by')

  readonly value: string
  readonly displayValue: string

  constructor (value: string, displayValue: string) {
    this.value = value
    this.displayValue = displayValue
  }

  static all (): PaymentType[] {
    return [
      PaymentType.INSTALMENTS,
      PaymentType.FULL_BY_SPECIFIED_DATE
    ]
  }

  static valueOf (value: string): PaymentType {
    return PaymentType.all()
      .filter(type => type.value === value)
      .pop()
  }
}

export class DefendantPaymentOption implements Serializable <DefendantPaymentOption> {

  @IsDefined({ message: ValidationErrors.OPTION_REQUIRED })
  @IsIn(PaymentType.all(), { message: ValidationErrors.OPTION_REQUIRED })
  option?: PaymentType

  constructor (option?: PaymentType) {
    this.option = option
  }

  static fromObject (value?: any): DefendantPaymentOption {
    if (!value) {
      return value
    }
    if (value.option) {
      const option: PaymentType = PaymentType.valueOf(value.option)
      return new DefendantPaymentOption(option)
    } else {
      return new DefendantPaymentOption()
    }
  }

  deserialize (input?: any): DefendantPaymentOption {
    if (input && input.option) {
      this.option = PaymentType.valueOf(input.option.value)
    }
    return this
  }
}
