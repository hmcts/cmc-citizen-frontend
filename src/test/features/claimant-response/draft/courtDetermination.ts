import { expect } from 'chai'
import { CourtDetermination } from 'claimant-response/draft/courtDetermination'
import { DecisionType } from 'claimant-response/draft/courtDecision'
import {
  intentionOfPaymentByInstallments,
  intentionOfPaymentInFullBySetDate
} from 'test/data/draft/paymentIntentionDraft'
import { PaymentIntention } from 'shared/components/payment-intention/model/paymentIntention'

describe('CourtDetermination', () => {
  context('deserialize', () => {
    it('should return instance initialised with defaults given undefined', () => {
      expect(new CourtDetermination().deserialize(undefined)).to.deep.equal(new CourtDetermination())
    })

    it('should return instance with set fields from given object', () => {
      expect(new CourtDetermination().deserialize(
        {
          courtDecision: intentionOfPaymentByInstallments,
          courtPaymentIntention: intentionOfPaymentInFullBySetDate,
          rejectionReason: undefined,
          disposableIncome: 1000,
          decisionType: DecisionType.COURT
        })).to.deep.equal(new CourtDetermination(PaymentIntention.deserialize(intentionOfPaymentByInstallments), PaymentIntention.deserialize(intentionOfPaymentInFullBySetDate), undefined, 1000, DecisionType.COURT))
    })
  })
})
