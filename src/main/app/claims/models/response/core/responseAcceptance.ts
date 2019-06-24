import { PaymentIntention } from 'claims/models/response/core/paymentIntention'
import { CourtDetermination } from 'claims/models/response/core/courtDetermination'
import { ClaimantResponse } from 'claims/models/response/core/claimantResponse'
import { YesNoOption } from 'claims/models/response/core/yesNoOption'
import { DirectionsQuestionnaire } from 'claims/models/directions-questionnaire/directionsQuestionnaire'


export class ResponseAcceptance implements ClaimantResponse {
  type: string
  amountPaid: number
  paymentReceived: YesNoOption
  settleForAmount: YesNoOption
  formaliseOption: string
  decisionType: string
  claimantPaymentIntention?: PaymentIntention
  courtDetermination?: CourtDetermination
  directionsQuestionnaire?: DirectionsQuestionnaire

  constructor () {
    this.type = 'ACCEPTATION'
  }

}
