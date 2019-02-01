import { monthlyInstalmentPaymentIntentionData } from 'test/data/entity/paymentIntentionData'
import { DecisionType } from 'common/court-calculations/decisionType'

export const courtDeterminationData = {
  courtDecision: monthlyInstalmentPaymentIntentionData,
  courtPaymentIntention: monthlyInstalmentPaymentIntentionData,
  rejectionReason: 'rejection reason',
  disposableIncome: 750,
  decisionType: DecisionType.CLAIMANT
}
