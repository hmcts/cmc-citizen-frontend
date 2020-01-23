import { YesNoOption } from 'claims/models/response/core/yesNoOption'

export interface ClaimantResponse {
  type: string
  amountPaid: number
  paymentReceived: YesNoOption
  settleForAmount: YesNoOption
}
