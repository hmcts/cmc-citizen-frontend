import { ClaimantResponseCommon } from 'claims/models/claimant-response/claimantResponseCommon'

export interface ResponseAcceptation extends ClaimantResponseCommon {
}

export namespace ResponseAcceptation {
  export function deserialize (input: any): ResponseAcceptation {
    return {
      ...ClaimantResponseCommon.deserialize(input)
    }
  }
}
