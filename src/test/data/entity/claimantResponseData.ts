import { ClaimantResponseType } from 'claims/models/claimant-response/claimantResponseType'
import { FormaliseOption } from 'claims/models/claimant-response/formaliseOption'

import { monthlyInstalmentPaymentIntentionData } from 'test/data/entity/paymentIntentionData'
import { courtDeterminationData } from 'test/data/entity/courtDeterminationData'

export const baseAcceptationClaimantResponseData = {
  type: ClaimantResponseType.ACCEPTATION,
  claimantPaymentIntention: monthlyInstalmentPaymentIntentionData,
  courtDetermination: courtDeterminationData,
  amountPaid: 100
}

const baseRejectionClaimantResponseData = {
  type: ClaimantResponseType.REJECTION,
  amountPaid: 100
}

export const ccjAcceptationClaimantResponseData = {
  ...baseAcceptationClaimantResponseData,
  formaliseOption: FormaliseOption.CCJ
}

export const settlementAcceptationClaimantResponseData = {
  ...baseAcceptationClaimantResponseData,
  formaliseOption: FormaliseOption.SETTLEMENT
}

export const referToJudgeAcceptationClaimantResponseData = {
  ...baseAcceptationClaimantResponseData,
  formaliseOption: FormaliseOption.REFER_TO_JUDGE
}

export const rejectionClaimantResponseData = {
  ...baseRejectionClaimantResponseData,
  freeMediation: true,
  reason: 'reason'
}
