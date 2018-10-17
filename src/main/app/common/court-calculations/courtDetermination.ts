import { DecisionType } from 'common/court-calculations/courtDecision'
import { PaymentIntention } from 'claims/models/response/core/paymentIntention'
import { RejectionReason } from 'claimant-response/form/models/rejectionReason'

export class CourtDetermination {
  courtDecision?: PaymentIntention
  courtPaymentIntention?: PaymentIntention
  rejectionReason?: RejectionReason
  disposableIncome?: number
  decisionType?: DecisionType

  constructor (
    courtDecision?: PaymentIntention,
    courtPaymentIntention?: PaymentIntention,
    rejectionReason?: RejectionReason,
    disposableIncome?: number,
    decisionType?: DecisionType
  ) {
    this.courtDecision = courtDecision
    this.courtPaymentIntention = courtPaymentIntention
    this.rejectionReason = rejectionReason
    this.disposableIncome = disposableIncome
    this.decisionType = decisionType
  }

  deserialize (input?: any): CourtDetermination {
    if (input) {
      this.courtDecision = PaymentIntention.deserialize(input.courtDecision)
      this.courtPaymentIntention = PaymentIntention.deserialize(input.courtPaymentIntention)
      this.rejectionReason = input.rejectionReason
      this.disposableIncome = input.disposableIncome
      this.decisionType = input.decisionType
    }
    return this
  }
}
