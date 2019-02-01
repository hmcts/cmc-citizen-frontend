import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { YesNoOption } from 'models/yesNoOption'
import { Claim } from 'claims/models/claim'
import { PartialAdmissionResponse } from 'claims/models/response/partialAdmissionResponse'
import { ResponseType } from 'claims/models/response/responseType'
import { FormaliseRepaymentPlanOption } from 'claimant-response/form/models/formaliseRepaymentPlanOption'

export class AmountHelper {
  static calculateTotalAmount (claim: Claim, draft: DraftClaimantResponse): number {
    const settledAmount = AmountHelper.calculateAmountSettledFor(claim, draft)

    if (settledAmount && draft.formaliseRepaymentPlan && draft.formaliseRepaymentPlan.option === FormaliseRepaymentPlanOption.SIGN_SETTLEMENT_AGREEMENT) {
      return settledAmount
    } else if (settledAmount) {
      return settledAmount + claim.claimData.feeAmountInPennies / 100
    }
    return claim.totalAmountTillToday
  }

  static calculateAmountSettledFor (claim: Claim, draft: DraftClaimantResponse): number | undefined {
    const settledForLessThanClaimAmount = AmountHelper.isSettledForLessThanClaim(claim, draft)

    if (settledForLessThanClaimAmount) {
      return (claim.response as PartialAdmissionResponse).amount
    }
    return undefined
  }

  static isSettledForLessThanClaim (claim: Claim, draft: DraftClaimantResponse): boolean {
    return claim.response && claim.response.responseType === ResponseType.PART_ADMISSION
      && draft.settleAdmitted && draft.settleAdmitted.admitted === YesNoOption.YES
  }

}
