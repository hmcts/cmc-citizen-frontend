import { PaymentIntention } from 'claims/models/response/core/paymentIntention'

export class CourtDetermination {

  courtDecision: PaymentIntention
  courtPaymentIntention?: PaymentIntention
  rejectionReason?: string
  disposableIncome: number
  decisionType: string

}
