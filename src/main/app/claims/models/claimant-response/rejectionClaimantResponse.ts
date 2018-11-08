import { ClaimantResponseCommon } from 'claims/models/claimant-response/claimantResponseCommon'
import { ClaimantResponseType } from 'claims/models/claimant-response/claimantResponseType'

export interface RejectionClaimantResponse extends ClaimantResponseCommon {
  type: ClaimantResponseType.REJECTION
  freeMediation?: boolean,
  reason?: string
}

export namespace RejectionClaimantResponse {
  export function deserialize (input: any): RejectionClaimantResponse {
    if (!input) {
      return input
    }
    
    return {
      ...ClaimantResponseCommon.deserialize(input),
      type: ClaimantResponseType.REJECTION,
      freeMediation: input.freeMediation,
      reason: input.reason
    }
  }
}
