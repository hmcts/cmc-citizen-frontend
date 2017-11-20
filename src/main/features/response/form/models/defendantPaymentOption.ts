import { IsDefined, IsIn } from 'class-validator'
import { Serializable } from 'models/serializable'
import { ResponseType } from 'response/form/models/responseType'

export class DefendantPaymentTypeLabels {
  static readonly INSTALLMENTS: string = 'By installments'
  static readonly FULL_ADMIT_BY_SPECIFIED_DATE: string = 'Full amount on a set date'
  static readonly PART_ADMIT_BY_SPECIFIED_DATE: string = 'On a set date'
}

export class DefendantPaymentType {
  static readonly INSTALMENTS = new DefendantPaymentType('INSTALMENTS')
  static readonly FULL_BY_SPECIFIED_DATE = new DefendantPaymentType('FULL_BY_SPECIFIED_DATE')

  readonly value: string

  constructor (value: string) {
    this.value = value
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

  displayValueFor (responseType: ResponseType): string {
    switch (this.value) {
      case DefendantPaymentType.INSTALMENTS.value:
        return DefendantPaymentTypeLabels.INSTALLMENTS
      case DefendantPaymentType.FULL_BY_SPECIFIED_DATE.value:
        return this.bySetDateLabelFor(responseType)
      default:
        throw new Error('Unknown defendant payment option!')
    }
  }

  private bySetDateLabelFor (responseType: ResponseType): string {
    switch (responseType.value) {
      case ResponseType.OWE_ALL_PAID_NONE.value:
        return DefendantPaymentTypeLabels.FULL_ADMIT_BY_SPECIFIED_DATE
      case ResponseType.OWE_SOME_PAID_NONE.value:
        return DefendantPaymentTypeLabels.PART_ADMIT_BY_SPECIFIED_DATE
      default:
        throw new Error('Unsupported response type!')
    }
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
