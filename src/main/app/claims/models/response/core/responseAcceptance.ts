import { PaymentIntention } from 'claims/models/response/core/paymentIntention'
import { CourtDetermination } from 'claims/models/response/core/courtDetermination'

export class ResponseAcceptance {

  courtDetermination: CourtDetermination
  paymentIntention: PaymentIntention
  formaliseOption: string

}
