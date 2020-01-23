import { expect } from 'chai'
import { CourtDetermination } from 'claimant-response/draft/courtDetermination'
import { DecisionType } from 'common/court-calculations/decisionType'
import {
  intentionOfPaymentByInstalments,
  intentionOfPaymentInFullBySetDate
} from 'test/data/draft/paymentIntentionDraft'
import { RejectionReason } from 'claimant-response/form/models/rejectionReason'

describe('CourtDetermination', () => {
  context('deserialize', () => {
    it('should return instance initialised with defaults given undefined', () => {
      expect(new CourtDetermination().deserialize(undefined)).to.deep.equal(new CourtDetermination())
    })

    it('should return instance with set fields from given object', () => {
      expect(new CourtDetermination().deserialize(
        {
          courtDecision: intentionOfPaymentByInstalments,
          courtPaymentIntention: intentionOfPaymentInFullBySetDate,
          rejectionReason: { text: 'rejection reason' },
          disposableIncome: 1000,
          decisionType: DecisionType.COURT
        })).to.deep.equal(new CourtDetermination(
          intentionOfPaymentByInstalments,
        intentionOfPaymentInFullBySetDate,
        new RejectionReason('rejection reason'),
        1000,
        DecisionType.COURT))
    })
  })
})
