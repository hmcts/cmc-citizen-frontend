import { PartialAdmissionResponse } from 'claims/models/response/partialAdmissionResponse'
import { YesNoOption } from 'models/yesNoOption'
import { ResponseType } from 'claims/models/response/responseType'
import { Claim } from 'claims/models/claim'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'

export function getAmountSettledFor (claim: Claim, draft: DraftClaimantResponse): number {
  const settledForLessThanClaimAmount = claim.response && claim.response.responseType === ResponseType.PART_ADMISSION
    && claim.response.paymentIntention !== undefined && draft.settleAdmitted && draft.settleAdmitted.admitted === YesNoOption.YES

  if (settledForLessThanClaimAmount) {
    return (claim.response as PartialAdmissionResponse).amount
  }
  return undefined
}
