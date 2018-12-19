import { ClaimantResponse } from 'claims/models/response/core/claimantResponse'
import { YesNoOption } from 'claims/models/response/core/yesNoOption'

export class ResponseRejection implements ClaimantResponse {
  type: string
  amountPaid: number
  freeMediation?: YesNoOption
  reason?: string

  constructor () {
    this.type = 'REJECTION'
  }
}
