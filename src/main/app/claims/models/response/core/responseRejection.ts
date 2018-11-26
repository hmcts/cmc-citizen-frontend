import { ClaimantResponse } from 'claims/models/response/core/claimantResponse'
import { PaymentIntention } from 'claims/models/response/core/paymentIntention'

export class ResponseRejection implements ClaimantResponse {
  type: string
  amountPaid: number
  freeMediation?: boolean
  reason?: string
  claimantPaymentIntention?: PaymentIntention

  constructor () {
    this.type = 'REJECTION'
  }
}
