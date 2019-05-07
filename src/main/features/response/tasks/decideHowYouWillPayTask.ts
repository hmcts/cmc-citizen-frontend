import { Validator } from '@hmcts/class-validator'

import { ResponseDraft } from 'response/draft/responseDraft'
import { PaymentType } from 'shared/components/payment-intention/model/paymentOption'

const validator = new Validator()

function isValid (input): boolean {
  return input !== undefined && validator.validateSync(input).length === 0
}

export class DecideHowYouWillPayTask {
  static isCompleted (responseDraft: ResponseDraft): boolean {
    return responseDraft.fullAdmission.paymentIntention !== undefined
      && isValid(responseDraft.fullAdmission.paymentIntention.paymentOption)
      && this.paymentDetailsAreProvidedFor(responseDraft)
  }

  private static paymentDetailsAreProvidedFor (responseDraft: ResponseDraft): boolean {
    switch (responseDraft.fullAdmission.paymentIntention.paymentOption.option) {
      case PaymentType.IMMEDIATELY:
        return true
      case PaymentType.INSTALMENTS:
        return true
      case PaymentType.BY_SET_DATE:
        return isValid(responseDraft.fullAdmission.paymentIntention.paymentDate)
      default:
        throw new Error(`Unknown payment option: ${responseDraft.fullAdmission.paymentIntention.paymentOption.option}`)
    }
  }
}
