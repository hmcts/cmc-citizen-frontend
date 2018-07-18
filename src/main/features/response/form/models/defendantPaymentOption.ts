import { IsDefined, IsIn } from 'class-validator'

export class DefendantPaymentTypeLabels {
  static readonly INSTALMENTS: string = 'I’ll suggest a repayment plan'
  static readonly BY_SET_DATE: string = 'By a set date'
  static readonly IMMEDIATELY: string = 'Immediately'
}

export class DefendantPaymentType {
  static readonly INSTALMENTS = new DefendantPaymentType('INSTALMENTS')
  static readonly BY_SET_DATE = new DefendantPaymentType('BY_SPECIFIED_DATE')
  static readonly IMMEDIATELY = new DefendantPaymentType('IMMEDIATELY')

  readonly value: string

  constructor (value: string) {
    this.value = value
  }

  get displayValue (): string {
    switch (this.value) {
      case DefendantPaymentType.INSTALMENTS.value:
        return DefendantPaymentTypeLabels.INSTALMENTS
      case DefendantPaymentType.BY_SET_DATE.value:
        return DefendantPaymentTypeLabels.BY_SET_DATE
      case DefendantPaymentType.IMMEDIATELY.value:
        return DefendantPaymentTypeLabels.IMMEDIATELY
      default:
        throw new Error('Unknown defendant payment option!')
    }
  }

  static all (): DefendantPaymentType[] {
    return [
      DefendantPaymentType.IMMEDIATELY,
      DefendantPaymentType.BY_SET_DATE,
      DefendantPaymentType.INSTALMENTS
    ]
  }

  static except (dependantPaymentType: DefendantPaymentType): DefendantPaymentType[] {
    if (dependantPaymentType === undefined) {
      throw new Error('DependantPaymentType type is required')
    }
    return DefendantPaymentType.all().filter(item => item !== dependantPaymentType)
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

export class DefendantPaymentOption {

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

  isOfType (defendantPaymentType: DefendantPaymentType): boolean {
    if (!this.option) {
      return false
    }
    return this.option.value === defendantPaymentType.value
  }
}
