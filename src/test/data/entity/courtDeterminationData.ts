import { monthlyInstalmentPaymentIntentionData } from 'test/data/entity/paymentIntentionData'
import { DecisionType } from 'claims/models/claimant-response/court-determination/decisionType'

export const courtDeterminationData = {
  courtDecision: monthlyInstalmentPaymentIntentionData,
  courtPaymentIntention: monthlyInstalmentPaymentIntentionData,
  rejectionReason: 'rejection reason',
  disposableIncome: 750,
  decisionType: DecisionType.CLAIMANT
}
