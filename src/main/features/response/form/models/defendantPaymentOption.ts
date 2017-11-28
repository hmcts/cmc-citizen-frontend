import { IsDefined, IsIn } from 'class-validator'
import { ResponseType } from 'response/form/models/responseType'

export class DefendantPaymentTypeLabels {
  static readonly INSTALMENTS: string = 'By instalments'
  static readonly FULL_ADMIT_BY_SPECIFIED_DATE: string = 'Full amount by a set date'
  static readonly BY_SET_DATE: string = 'By a set date'
}

export class DefendantPaymentType {
  static readonly INSTALMENTS = new DefendantPaymentType('INSTALMENTS')
  static readonly BY_SET_DATE = new DefendantPaymentType('BY_SET_DATE')

  readonly value: string

  constructor (value: string) {
    this.value = value
  }

  static all (): DefendantPaymentType[] {
    return [
      DefendantPaymentType.BY_SET_DATE,
      DefendantPaymentType.INSTALMENTS
    ]
  }

  static valueOf (value: string): DefendantPaymentType {
    return DefendantPaymentType.all()
      .filter(type => type.value === value)
      .pop()
  }

  displayValueFor (responseType: ResponseType): string {
    switch (this.value) {
      case DefendantPaymentType.INSTALMENTS.value:
        return DefendantPaymentTypeLabels.INSTALMENTS
      case DefendantPaymentType.BY_SET_DATE.value:
        return this.bySetDateLabelFor(responseType)
      default:
        throw new Error('Unknown defendant payment option!')
    }
  }

  private bySetDateLabelFor (responseType: ResponseType): string {
    if (responseType.value === ResponseType.OWE_ALL_PAID_NONE.value) {
      return DefendantPaymentTypeLabels.FULL_ADMIT_BY_SPECIFIED_DATE
    } else {
      return DefendantPaymentTypeLabels.BY_SET_DATE
    }
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
