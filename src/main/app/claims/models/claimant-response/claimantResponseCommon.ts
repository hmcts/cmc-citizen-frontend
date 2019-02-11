import { ClaimantResponseType } from 'claims/models/claimant-response/claimantResponseType'
import { YesNoOption } from 'models/yesNoOption'

export interface ClaimantResponseCommon {
  type: ClaimantResponseType
  amountPaid: number
  paymentReceived: YesNoOption
  settleForAmount: YesNoOption
}

export namespace ClaimantResponseCommon {
  export function deserialize (input: any): ClaimantResponseCommon {
    return {
      type: input.type,
      amountPaid: input.amountPaid,
      paymentReceived: input.paymentReceived,
      settleForAmount: input.settleForAmount
    }
  }
}
