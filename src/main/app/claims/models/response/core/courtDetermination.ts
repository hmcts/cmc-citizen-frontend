import { PaymentIntention } from 'claims/models/response/core/paymentIntention'

export class CourtDetermination {

  courtCalculatedPaymentIntention: PaymentIntention
  rejectionReason?: string

}
