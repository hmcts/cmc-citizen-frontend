import { ClaimantResponse } from 'claims/models/response/core/claimantResponse'
import { PaymentIntention } from 'claims/models/response/core/paymentIntention'
import { YesNoOption } from 'claims/models/response/core/yesNoOption'

export class ResponseRejection implements ClaimantResponse {
  type: string
  amountPaid: number
  freeMediation?: YesNoOption
  reason?: string
  claimantPaymentIntention?: PaymentIntention

  constructor () {
    this.type = 'REJECTION'
  }
}
