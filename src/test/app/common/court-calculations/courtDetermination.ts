import { expect } from 'chai'
import { CourtDetermination } from 'common/court-calculations/courtDetermination'
import { PaymentIntention } from 'claims/models/response/core/paymentIntention'
import { DecisionType } from 'common/court-calculations/courtDecision'
import { PaymentSchedule } from 'ccj/form/models/paymentSchedule'
import { MomentFactory } from 'shared/momentFactory'

const paymentIntention = PaymentIntention.deserialize({
  repaymentPlan: {
    instalmentAmount: 100,
    paymentSchedule: {
      value: PaymentSchedule.EVERY_MONTH.value
    },
    firstPaymentDate: MomentFactory.parse('2018-12-31'),
    completionDate: MomentFactory.parse('2019-12-31'),
    paymentLength: '10 weeks'
  } })

describe('CourtDetermination', () => {
  context('deserialize', () => {
    it('should return instance initialised with defaults given undefined', () => {
      expect(new CourtDetermination().deserialize(undefined)).to.deep.equal(new CourtDetermination())
    })

    it('should return instance with set fields from given object', () => {
      expect(new CourtDetermination().deserialize(
        {
          courtDecision: PaymentIntention.deserialize(paymentIntention),
          courtPaymentIntention: PaymentIntention.deserialize(paymentIntention),
          rejectionReason: undefined,
          disposableIncome: 1000,
          decisionType: DecisionType.COURT
        })).to.deep.equal(new CourtDetermination(paymentIntention, paymentIntention, undefined, 1000, DecisionType.COURT))
    })
  })
})
