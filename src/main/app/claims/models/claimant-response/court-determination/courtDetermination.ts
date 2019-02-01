import { PaymentIntention } from 'claims/models/response/core/paymentIntention'
import { DecisionType } from 'common/court-calculations/decisionType'

export interface CourtDetermination {
  courtDecision: PaymentIntention
  courtPaymentIntention: PaymentIntention
  rejectionReason?: string
  disposableIncome: number
  decisionType: DecisionType
}

export namespace CourtDetermination {
  export function deserialize (input: any): CourtDetermination {
    if (!input) {
      return input
    }

    return {
      courtDecision: PaymentIntention.deserialize(input.courtDecision),
      courtPaymentIntention: PaymentIntention.deserialize(input.courtPaymentIntention),
      rejectionReason: input.rejectionReason,
      disposableIncome: input.disposableIncome,
      decisionType: input.decisionType
    }
  }
}
