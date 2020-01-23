import { ClaimantResponse } from 'claims/models/response/core/claimantResponse'
import { PaymentIntention } from 'claims/models/response/core/paymentIntention'
import { YesNoOption } from 'claims/models/response/core/yesNoOption'
import { DirectionsQuestionnaire } from 'claims/models/directions-questionnaire/directionsQuestionnaire'

export class ResponseRejection implements ClaimantResponse {
  type: string
  amountPaid: number
  paymentReceived: YesNoOption
  settleForAmount: YesNoOption
  freeMediation?: YesNoOption
  mediationPhoneNumber?: string
  mediationContactPerson?: string
  reason?: string
  claimantPaymentIntention?: PaymentIntention
  directionsQuestionnaire?: DirectionsQuestionnaire

  constructor () {
    this.type = 'REJECTION'
  }
}
