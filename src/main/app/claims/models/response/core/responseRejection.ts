import { ClaimantResponse } from 'claims/models/response/core/claimantResponse'

export class ResponseRejection implements ClaimantResponse {
  type: string
  amountPaid: number
  freeMediation?: boolean
  reason?: string

  constructor () {
    this.type = 'REJECTION'
  }
}
