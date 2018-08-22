import { DraftStatesPaidResponse } from 'claimant-response/draft/draftStatesPaidResponse'
import { YesNoOption } from 'models/yesNoOption'
import { ClaimantResponse } from 'claims/models/claimantResponse'
import { ResponseAcceptation } from 'claims/models/claimant-response/responseAcceptation'
import { ResponseRejection } from 'claims/models/claimant-response/responseRejection'
import { ClaimantResponseType } from 'claims/models/claimant-response/claimantResponseType'

export class ClaimantResponseModelConverter {
  static convert (draft: DraftStatesPaidResponse): ClaimantResponse {
    if (draft.accepted !== undefined && draft.accepted.accepted.option === YesNoOption.YES.option) {
      return this.convertAcceptedResponse(draft)
    } else {
      return this.convertRejectedResponse(draft)
    }
  }

  private static convertAcceptedResponse (draft: DraftStatesPaidResponse): ResponseAcceptation {
    return {
      type: ClaimantResponseType.ACCEPTATION,
      amountPaid: draft.amount
    }
  }

  private static convertRejectedResponse (draft: DraftStatesPaidResponse): ResponseRejection {
    let freeMediation: boolean = false

    if (draft.freeMediation !== undefined && draft.freeMediation.freeMediation.option === YesNoOption.YES.option) {
      freeMediation = true
    }
    return {
      type: ClaimantResponseType.REJECTION,
      amountPaid: draft.amount,
      freeMediation: freeMediation,
      reason: draft.disputeReason.reason
    }
  }
}
