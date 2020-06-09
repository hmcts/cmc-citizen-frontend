import { IsDefined, ValidateIf } from '@hmcts/class-validator'
import { IsNotBlank } from '@hmcts/cmc-validators'
import * as toBoolean from 'to-boolean'

export class ValidationErrors {
  static readonly SELECTION_REQUIRED: string = 'Select a payment method'
  static readonly HELP_WITH_FEES_NUMBER_REQUIRED: string = 'Enter the Help With Fees number'
}

export class PaymentMethod {
  @IsDefined({ message: ValidationErrors.SELECTION_REQUIRED })
  helpWithFees?: boolean

  @ValidateIf(o => !!o.helpWithFees && toBoolean(o.helpWithFees))
  @IsNotBlank({ message: ValidationErrors.HELP_WITH_FEES_NUMBER_REQUIRED })
  helpWithFeesNumber?: string

  constructor (helpWithFees?: boolean, helpWithFeesNumber?: string) {
    this.helpWithFees = helpWithFees
    this.helpWithFeesNumber = helpWithFeesNumber
  }

  deserialize (input: any): PaymentMethod {
    if (input) {
      this.helpWithFees = input.helpWithFees ? toBoolean(input.helpWithFees) : false
      this.helpWithFeesNumber = this.helpWithFees ? input.helpWithFeesNumber : undefined
    }
    return this
  }
}
