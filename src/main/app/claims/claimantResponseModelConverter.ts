import { YesNoOption } from 'models/yesNoOption'
import { ClaimantResponse } from 'claims/models/claimantResponse'
import { ResponseAcceptation } from 'claims/models/claimant-response/responseAcceptation'
import { ResponseRejection } from 'claims/models/claimant-response/responseRejection'
import { ClaimantResponseType } from 'claims/models/claimant-response/claimantResponseType'
import { Claim } from 'claims/models/claim'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { StatesPaidHelper } from 'claimant-response/helpers/statesPaidHelper'

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
      amountPaid: StatesPaidHelper.getAlreadyPaidAmount(claim)
    }
  }

  private static convertRejectedResponse (draft: DraftClaimantResponse, claim: Claim): ResponseRejection {
    return {
      type: ClaimantResponseType.REJECTION,
      amountPaid: StatesPaidHelper.getAlreadyPaidAmount(claim),
      freeMediation: draft.freeMediation.option === YesNoOption.YES.option,
      reason: draft.rejectionReason.text
    }
  }
}
