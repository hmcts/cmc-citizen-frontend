import { DraftStatesPaidResponse } from 'claimant-response/draft/draftStatesPaidResponse'
import { YesNoOption } from 'models/yesNoOption'
import { ClaimantResponse } from 'claims/models/claimantResponse'
import { ResponseAcceptation } from 'claims/models/claimant-response/responseAcceptation'
import { ResponseRejection } from 'claims/models/claimant-response/responseRejection'
import { ClaimantResponseType } from 'claims/models/claimant-response/claimantResponseType'
import { Claim } from 'claims/models/claim'

export class ClaimantResponseModelConverter {
  static convert (draft: DraftStatesPaidResponse, claim: Claim): ClaimantResponse {
    if (draft.accepted !== undefined && draft.accepted.accepted.option === YesNoOption.YES.option) {
      return this.convertAcceptedResponse(draft, claim)
    } else {
      return this.convertRejectedResponse(draft, claim)
    }
  }

  private static convertAcceptedResponse (draft: DraftStatesPaidResponse, claim: Claim): ResponseAcceptation {
    return {
      type: ClaimantResponseType.ACCEPTATION,
      amountPaid: draft.amount || claim.totalAmountTillToday
    }
  }

  private static convertRejectedResponse (draft: DraftStatesPaidResponse, claim: Claim): ResponseRejection {
    let freeMediation: boolean = false

    if (draft.freeMediation !== undefined && draft.freeMediation.freeMediation.option === YesNoOption.YES.option) {
      freeMediation = true
    }
    return {
      type: ClaimantResponseType.REJECTION,
      amountPaid: draft.amount || claim.totalAmountTillToday,
      freeMediation: freeMediation,
      reason: draft.disputeReason.reason
    }
  }
}
