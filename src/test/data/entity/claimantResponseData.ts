import { ClaimantResponseType } from 'claims/models/claimant-response/claimantResponseType'
import { FormaliseOption } from 'claims/models/claimant-response/formaliseOption'

import { monthlyInstalmentPaymentIntentionData } from 'test/data/entity/paymentIntentionData'
import { courtDeterminationData } from 'test/data/entity/courtDeterminationData'
import { sampleDirectionsQuestionnaireDraftObj } from 'test/http-mocks/draft-store'

export const baseDeterminationAcceptationClaimantResponseData = {
  type: ClaimantResponseType.ACCEPTATION,
  claimantPaymentIntention: monthlyInstalmentPaymentIntentionData,
  courtDetermination: courtDeterminationData,
  amountPaid: 100
}

export const baseAcceptationClaimantResponseData = {
  type: ClaimantResponseType.ACCEPTATION
}

const baseRejectionClaimantResponseData = {
  type: ClaimantResponseType.REJECTION,
  amountPaid: 100
}

export const ccjAcceptationClaimantResponseData = {
  ...baseDeterminationAcceptationClaimantResponseData,
  formaliseOption: FormaliseOption.CCJ
}

export const settlementAcceptationClaimantResponseData = {
  ...baseDeterminationAcceptationClaimantResponseData,
  formaliseOption: FormaliseOption.SETTLEMENT
}

export const referToJudgeAcceptationClaimantResponseData = {
  ...baseDeterminationAcceptationClaimantResponseData,
  formaliseOption: FormaliseOption.REFER_TO_JUDGE
}

export const partAdmissionStatesPaidClaimantResponseData = {
  ...baseAcceptationClaimantResponseData,
  claimantPaymentIntention: null,
  formaliseOption: FormaliseOption.SETTLEMENT
}

export const rejectionClaimantResponseData = {
  ...baseRejectionClaimantResponseData,
  freeMediation: 'yes',
  reason: 'reason'
}

export const rejectionClaimantResponseWithDQ = {
  ...baseRejectionClaimantResponseData,
  directionsQuestionnaire: sampleDirectionsQuestionnaireDraftObj,
  freeMediation: 'yes',
  reason: 'reason'
}
