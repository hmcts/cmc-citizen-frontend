import { PaymentIntention } from 'claims/models/response/core/paymentIntention'

export class CourtDetermination {

  courtDecision: PaymentIntention
  rejectionReason?: string
  disposableIncome: number

}
