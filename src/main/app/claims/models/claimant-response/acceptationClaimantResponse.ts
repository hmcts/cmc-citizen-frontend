import { ClaimantResponseCommon } from 'claims/models/claimant-response/claimantResponseCommon'
import { ClaimantResponseType } from 'claims/models/claimant-response/claimantResponseType'
import { FormaliseOption } from 'claims/models/claimant-response/formaliseOption'

import { PaymentIntention } from 'claims/models/response/core/paymentIntention'
import { CourtDetermination } from 'claims/models/claimant-response/court-determination/courtDetermination'

export interface AcceptationClaimantResponse extends ClaimantResponseCommon {
  type: ClaimantResponseType.ACCEPTATION
  claimantPaymentIntention?: PaymentIntention,
  courtDetermination?: CourtDetermination,
  formaliseOption: FormaliseOption
}

export namespace AcceptationClaimantResponse {
  export function deserialize (input: any): AcceptationClaimantResponse {
    if (!input) {
      return input
    }

    return {
      ...ClaimantResponseCommon.deserialize(input),
      type: ClaimantResponseType.ACCEPTATION,
      claimantPaymentIntention: PaymentIntention.deserialize(input.claimantPaymentIntention),
      courtDetermination: CourtDetermination.deserialize(input.courtDetermination),
      formaliseOption: input.formaliseOption
    }
  }
}
