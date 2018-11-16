import { ClaimantResponseCommon } from 'claims/models/claimant-response/claimantResponseCommon'

export interface ResponseRejection extends ClaimantResponseCommon {
  reason: string,
  freeMediation: boolean
}

export namespace ResponseRejection {
  export function deserialize (input: any): ResponseRejection {
    return {
      ...ClaimantResponseCommon.deserialize(input),
      reason: input.reason,
      freeMediation: input.freeMediation
    }
  }
}
