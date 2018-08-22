import { ResponseAcceptation } from 'claims/models/claimant-response/responseAcceptation'
import { ResponseRejection } from 'claims/models/claimant-response/responseRejection'
import { ClaimantResponseType } from 'claims/models/claimant-response/claimantResponseType'

export type ClaimantResponse = ResponseAcceptation | ResponseRejection

const deserializers = {
  [ClaimantResponseType.ACCEPTATION]: ResponseAcceptation.deserialize,
  [ClaimantResponseType.REJECTION]: ResponseRejection.deserialize
}

export namespace ClaimantResponse {
  export function deserialize (input: any): ClaimantResponse {
    return deserializers[input.type](input)
  }
}
