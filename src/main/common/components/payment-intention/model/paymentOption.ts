import { IsDefined, IsIn } from '@hmcts/class-validator'

export class PaymentTypeLabels {
  static readonly INSTALMENTS: string = 'By instalments'
  static readonly BY_SET_DATE: string = 'By a set date'
  static readonly IMMEDIATELY: string = 'Immediately'
}

export class PaymentType {
  static readonly INSTALMENTS = new PaymentType('INSTALMENTS')
  static readonly BY_SET_DATE = new PaymentType('BY_SPECIFIED_DATE')
  static readonly IMMEDIATELY = new PaymentType('IMMEDIATELY')

  readonly value: string

  constructor (value: string) {
    this.value = value
  }

  get displayValue (): string {
    switch (this.value) {
      case PaymentType.INSTALMENTS.value:
        return PaymentTypeLabels.INSTALMENTS
      case PaymentType.BY_SET_DATE.value:
        return PaymentTypeLabels.BY_SET_DATE
      case PaymentType.IMMEDIATELY.value:
        return PaymentTypeLabels.IMMEDIATELY
      default:
        throw new Error('Unknown defendant payment option!')
    }
  }

  static all (): PaymentType[] {
    return [
      PaymentType.IMMEDIATELY,
      PaymentType.BY_SET_DATE,
      PaymentType.INSTALMENTS
    ]
  }

  static except (paymentType: PaymentType): PaymentType[] {
    if (paymentType === undefined) {
      throw new Error('Payment type is required')
    }
    return PaymentType.all().filter(item => item !== paymentType)
  }

  static valueOf (value: string): PaymentType {
    return PaymentType.all()
      .filter(type => type.value === value)
      .pop()
  }
}

export class ValidationErrors {
  static readonly OPTION_REQUIRED: string = 'Choose a payment option'
}

export class PaymentOption {

  @IsDefined({ message: ValidationErrors.OPTION_REQUIRED })
  @IsIn(PaymentType.all(), { message: ValidationErrors.OPTION_REQUIRED })
  option?: PaymentType

  constructor (option?: PaymentType) {
    this.option = option
  }

  static fromObject (value?: any): PaymentOption {
    if (!value) {
      return value
    }
    if (value.option) {
      const option: PaymentType = PaymentType.valueOf(value.option)
      return new PaymentOption(option)
    } else {
      return new PaymentOption()
    }
  }

  deserialize (input?: any): PaymentOption {
    if (input && input.option) {
      this.option = PaymentType.valueOf(input.option.value)
    }
    return this
  }

  isOfType (paymentType: PaymentType): boolean {
    if (!this.option) {
      return false
    }
    return this.option.value === paymentType.value
  }
}
