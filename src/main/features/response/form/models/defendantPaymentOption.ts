import { IsDefined, IsIn } from 'class-validator'
import { Serializable } from 'models/serializable'

export class DefendantPaymentType {
  static readonly INSTALMENTS = new DefendantPaymentType('INSTALMENTS', 'By instalments')
  static readonly FULL_BY_SPECIFIED_DATE = new DefendantPaymentType('FULL_BY_SPECIFIED_DATE', 'Full amount on set date')

  readonly value: string
  readonly displayValue: string

  constructor (value: string, displayValue: string) {
    this.value = value
    this.displayValue = displayValue
  }

  static all (): DefendantPaymentType[] {
    return [
      DefendantPaymentType.FULL_BY_SPECIFIED_DATE,
      DefendantPaymentType.INSTALMENTS
    ]
  }

  static valueOf (value: string): DefendantPaymentType {
    return DefendantPaymentType.all()
      .filter(type => type.value === value)
      .pop()
  }
}

export class ValidationErrors {
  static readonly WHEN_WILL_YOU_PAY_OPTION_REQUIRED: string = 'Please select when you will pay'
}

export class DefendantPaymentOption implements Serializable <DefendantPaymentOption> {

  @IsDefined({ message: ValidationErrors.WHEN_WILL_YOU_PAY_OPTION_REQUIRED })
  @IsIn(DefendantPaymentType.all(), { message: ValidationErrors.WHEN_WILL_YOU_PAY_OPTION_REQUIRED })
  option?: DefendantPaymentType

  constructor (option?: DefendantPaymentType) {
    this.option = option
  }

  static fromObject (value?: any): DefendantPaymentOption {
    if (!value) {
      return value
    }
    if (value.option) {
      const option: DefendantPaymentType = DefendantPaymentType.valueOf(value.option)
      return new DefendantPaymentOption(option)
    } else {
      return new DefendantPaymentOption()
    }
  }

  deserialize (input?: any): DefendantPaymentOption {
    if (input && input.option) {
      this.option = DefendantPaymentType.valueOf(input.option.value)
    }
    return this
  }
}
