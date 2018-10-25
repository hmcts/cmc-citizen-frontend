import { PaymentIntention } from 'claims/models/response/core/paymentIntention'
import { CourtDetermination } from 'claims/models/response/core/courtDetermination'
import { ClaimantResponse } from 'claims/models/response/core/claimantResponse'

export class ResponseAcceptance implements ClaimantResponse {
  type: string
  amountPaid: number
  formaliseOption: string
  decisionType: string
  claimantPaymentIntention?: PaymentIntention
  courtDetermination?: CourtDetermination

  constructor () {
    this.type = 'ACCEPTATION'
  }

}
