import { RejectionReason } from 'claimant-response/form/models/rejectionReason'
import { DecisionType } from 'common/court-calculations/decisionType'
import { PaymentIntention } from 'claims/models/response/core/paymentIntention'

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
      this.courtDecision = input.courtDecision
      this.courtPaymentIntention = input.courtPaymentIntention
      this.rejectionReason = new RejectionReason().deserialize(input.rejectionReason)
      this.disposableIncome = input.disposableIncome
      this.decisionType = input.decisionType
    }
    return this
  }
}
