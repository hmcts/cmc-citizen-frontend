import { ClaimantResponseType } from 'claims/models/claimant-response/claimantResponseType'
import { AcceptationClaimantResponse } from 'claims/models/claimant-response/acceptationClaimantResponse'
import { RejectionClaimantResponse } from 'claims/models/claimant-response/rejectionClaimantResponse'

export type ClaimantResponse = AcceptationClaimantResponse | RejectionClaimantResponse

const deserializers = {
  [ClaimantResponseType.ACCEPTATION]: AcceptationClaimantResponse.deserialize,
  [ClaimantResponseType.REJECTION]: RejectionClaimantResponse.deserialize
}

export namespace ClaimantResponse {
  export function deserialize (input: any): ClaimantResponse {
    if (!input) {
      return input
    }
    return deserializers[input.type](input)
  }
}
