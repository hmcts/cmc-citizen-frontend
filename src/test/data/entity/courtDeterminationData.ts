import { monthlyInstalmentPaymentIntentionData } from 'test/data/entity/paymentIntentionData'
import { DecisionType } from 'common/court-calculations/decisionType'
import { MomentFactory } from 'shared/momentFactory'

export const courtDeterminationData = {
  courtDecision: monthlyInstalmentPaymentIntentionData,
  courtPaymentIntention: monthlyInstalmentPaymentIntentionData,
  rejectionReason: 'rejection reason',
  disposableIncome: 750,
  decisionType: DecisionType.CLAIMANT
}

export const courtDeterminationChoseDefendantData = {
  decisionType: 'DEFENDANT',
  courtDecision: {
    paymentOption: 'INSTALMENTS',
    repaymentPlan: {
      paymentLength: '100 months',
      completionDate: '2028-04-01',
      paymentSchedule: 'EVERY_MONTH',
      firstPaymentDate: '2020-01-01',
      instalmentAmount: 1
    }
  },
  disposableIncome: -250.9,
  courtPaymentIntention: {
    paymentDate: '9999-12-31',
    paymentOption: 'BY_SPECIFIED_DATE'
  }
}

export const courtDeterminationChoseClaimantData = {
  decisionType: 'CLAIMANT',
  courtDecision: {
    paymentDate: '2020-01-01',
    paymentOption: 'BY_SPECIFIED_DATE'
  },
  disposableIncome: 2332.43,
  courtPaymentIntention: {
    paymentDate: '2019-06-28',
    paymentOption: 'BY_SPECIFIED_DATE'
  }
}

export const courtDeterminationChoseCourtData = {
  decisionType: 'COURT',
  courtDecision: {
    paymentOption: 'BY_SPECIFIED_DATE',
    paymentDate: MomentFactory.parse('2018-11-01'),
    repaymentPlan: undefined }
}
