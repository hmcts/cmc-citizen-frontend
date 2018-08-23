import { YesNoOption } from 'models/yesNoOption'
import { ClaimantResponse } from 'claims/models/claimantResponse'
import { ResponseAcceptation } from 'claims/models/claimant-response/responseAcceptation'
import { ResponseRejection } from 'claims/models/claimant-response/responseRejection'
import { ClaimantResponseType } from 'claims/models/claimant-response/claimantResponseType'
import { Claim } from 'claims/models/claim'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'

export class ClaimantResponseModelConverter {
  static convert (draft: DraftClaimantResponse, claim: Claim): ClaimantResponse {
    if (draft.accepted !== undefined && draft.accepted.accepted.option === YesNoOption.YES.option) {
      return this.convertAcceptedResponse(draft, claim)
    } else {
      return this.convertRejectedResponse(draft, claim)
    }
  }

  private static convertAcceptedResponse (draft: DraftClaimantResponse, claim: Claim): ResponseAcceptation {
    return {
      type: ClaimantResponseType.ACCEPTATION,
      amountPaid: draft.paidAmount.amount
    }
  }

  private static convertRejectedResponse (draft: DraftClaimantResponse, claim: Claim): ResponseRejection {
    return {
      type: ClaimantResponseType.REJECTION,
      amountPaid: draft.paidAmount.amount,
      freeMediation: draft.freeMediation.option === YesNoOption.YES.option,
      reason: draft.rejectionReason.text
    }
  }
}
