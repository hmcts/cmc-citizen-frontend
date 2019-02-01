import { ClaimantResponseType } from 'claims/models/claimant-response/claimantResponseType'

export interface ClaimantResponseCommon {
  type: ClaimantResponseType
  amountPaid: number
}

export namespace ClaimantResponseCommon {
  export function deserialize (input: any): ClaimantResponseCommon {
    return {
      type: input.type,
      amountPaid: input.amountPaid
    }
  }
}
