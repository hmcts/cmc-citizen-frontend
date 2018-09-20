/* tslint:disable:no-unused-expression */

import { expect } from 'chai'

import { CourtDetermination, DecisionType } from 'common/court-calculations/courtDetermination'
import { MomentFactory } from 'shared/momentFactory'
import { Moment } from 'moment'
import { PaymentIntention } from 'claims/models/response/core/paymentIntention'
import { PaymentOption } from 'claims/models/paymentOption'
import { PaymentPlan } from 'common/payment-plan/paymentPlan'
import { Frequency } from 'common/frequency/frequency'

describe('CourtDetermination', () => {
  context('determinePaymentDeadline', () => {
    it('should throw an error if defendantPaymentDate, claimantPaymentDate or courtGeneratedPaymentDate are undefined', () => {
      expect(() => {
        CourtDetermination.determinePaymentDeadline(undefined, undefined, undefined)
      }).to.throw(Error, 'Defendant payment date is required')
    })

    it('should throw an error if defendantPaymentDate, claimantPaymentDate or courtGeneratedPaymentDate are null', () => {
      expect(() => {
        CourtDetermination.determinePaymentDeadline(null, null, null)
      }).to.throw(Error, 'Defendant payment date is required')
    })

    it('should return a claimant decision type when claimantPaymentDate is after the defendantPaymentDate', () => {
      const defendantPaymentDate = MomentFactory.currentDate()
      const claimantPaymentDate = MomentFactory.currentDate().add(1,'days')
      const courtGeneratedPaymentDate = MomentFactory.currentDate().add(2,'days')

      expect(CourtDetermination.determinePaymentDeadline(defendantPaymentDate, claimantPaymentDate, courtGeneratedPaymentDate).source).to.equal(DecisionType.CLAIMANT)
    })

    it('should return a claimant or defendant decision type when claimantPaymentDate and defendantPaymentDate are the same', () => {
      const defendantPaymentDate = MomentFactory.currentDate()
      const claimantPaymentDate = MomentFactory.currentDate()
      const courtGeneratedPaymentDate = MomentFactory.currentDate()

      expect(CourtDetermination.determinePaymentDeadline(defendantPaymentDate, claimantPaymentDate, courtGeneratedPaymentDate).source).to.equal(DecisionType.CLAIMANT)
    })

    it('should return a claimant decision type when claimantPaymentDate and courtGeneratedPaymentDate are the same', () => {
      const defendantPaymentDate = MomentFactory.currentDate()
      const claimantPaymentDate = MomentFactory.currentDate().add(1,'days')
      const courtGeneratedPaymentDate = MomentFactory.currentDate().add(1,'days')

      expect(CourtDetermination.determinePaymentDeadline(defendantPaymentDate, claimantPaymentDate, courtGeneratedPaymentDate).source).to.equal(DecisionType.CLAIMANT)
    })

    it('should return a claimant decision type when claimantPaymentDate is before defendantPaymentDate and after the courtGeneratedPaymentDate', () => {
      const defendantPaymentDate = MomentFactory.currentDate().add(11,'days')
      const claimantPaymentDate = MomentFactory.currentDate().add(10,'days')
      const courtGeneratedPaymentDate = MomentFactory.currentDate().add(9,'days')

      expect(CourtDetermination.determinePaymentDeadline(defendantPaymentDate, claimantPaymentDate, courtGeneratedPaymentDate).source).to.equal(DecisionType.CLAIMANT)
    })

    it('should return a defendant decision type when claimantPaymentDate is before defendantPaymentDate and before the courtGeneratedPaymentDate', () => {
      const defendantPaymentDate = MomentFactory.currentDate().add(5,'days')
      const claimantPaymentDate = MomentFactory.currentDate().add(1,'days')
      const courtGeneratedPaymentDate = MomentFactory.currentDate().add(2,'days')

      expect(CourtDetermination.determinePaymentDeadline(defendantPaymentDate, claimantPaymentDate, courtGeneratedPaymentDate).source).to.equal(DecisionType.COURT)
    })

    it('should return a court decision type when the claimantPaymentDate is before defendantPaymentDate and the defendantPaymentDate is before the courtGeneratedPaymentDate', () => {
      const defendantPaymentDate = MomentFactory.currentDate().add(10,'days')
      const claimantPaymentDate = MomentFactory.currentDate().add(7,'days')
      const courtGeneratedPaymentDate = MomentFactory.currentDate().add(15,'days')

      expect(CourtDetermination.determinePaymentDeadline(defendantPaymentDate, claimantPaymentDate, courtGeneratedPaymentDate).source).to.equal(DecisionType.DEFENDANT)
    })
  })

  context('determinePaymentIntention', () => {
    context('when claimant wishes to be paid in full by set date', () => {
      const paymentIntentionFromClaimant: PaymentIntention = new PaymentIntention()
      paymentIntentionFromClaimant.paymentOption = PaymentOption.BY_SPECIFIED_DATE
      paymentIntentionFromClaimant.paymentDate = MomentFactory.currentDate()

      it('should return payment intention with date specified by defendant when claimant date < defendant date < court date [D]', () => {
        const paymentDateProposedByDefendant: Moment = MomentFactory.currentDate().add(1, 'day')
        const paymentPlanDeterminedFromDefendantFinancialStatement = new PaymentPlan(10, 10, Frequency.MONTHLY, MomentFactory.currentDate())

        const paymentIntention: PaymentIntention = CourtDetermination.determinePaymentIntention(100, paymentDateProposedByDefendant, paymentIntentionFromClaimant, paymentPlanDeterminedFromDefendantFinancialStatement)
        expect(paymentIntention.paymentOption).to.be.equal(PaymentOption.BY_SPECIFIED_DATE)
        expect(paymentIntention.paymentDate).to.be.deep.equal(paymentDateProposedByDefendant)
        expect(paymentIntention.repaymentPlan).to.be.undefined
      })

      it('should return payment intention with date specified by claimant when court date < claimant date < defendant date [B]', () => {
        const paymentDateProposedByDefendant: Moment = MomentFactory.currentDate().add(1, 'day')
        const paymentPlanDeterminedFromDefendantFinancialStatement = new PaymentPlan(10, 10, Frequency.MONTHLY, MomentFactory.currentDate().subtract(1.5, 'month'))

        const paymentIntention: PaymentIntention = CourtDetermination.determinePaymentIntention(100, paymentDateProposedByDefendant, paymentIntentionFromClaimant, paymentPlanDeterminedFromDefendantFinancialStatement)
        expect(paymentIntention.paymentOption).to.be.equal(PaymentOption.BY_SPECIFIED_DATE)
        expect(paymentIntention.paymentDate).to.be.deep.equal(paymentIntentionFromClaimant.paymentDate)
        expect(paymentIntention.repaymentPlan).to.be.undefined
      })

      it('should return payment intention with date specified by court when claimant date < court date < defendant date [C]', () => {
        const paymentDateProposedByDefendant: Moment = MomentFactory.currentDate().add(2, 'months')
        const paymentPlanDeterminedFromDefendantFinancialStatement = new PaymentPlan(10, 10, Frequency.MONTHLY, MomentFactory.currentDate())

        const paymentIntention: PaymentIntention = CourtDetermination.determinePaymentIntention(100, paymentDateProposedByDefendant, paymentIntentionFromClaimant, paymentPlanDeterminedFromDefendantFinancialStatement)
        expect(paymentIntention.paymentOption).to.be.equal(PaymentOption.BY_SPECIFIED_DATE)
        expect(paymentIntention.paymentDate).to.be.deep.equal(paymentPlanDeterminedFromDefendantFinancialStatement.calculateLastPaymentDate())
        expect(paymentIntention.repaymentPlan).to.be.undefined
      })
    })
  })
})
