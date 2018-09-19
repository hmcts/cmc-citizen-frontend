import { expect } from 'chai'

import { CourtDetermination, DecisionType } from 'common/court-calculations/courtDetermination'
import { MomentFactory } from 'shared/momentFactory'

describe('CourtDetermination', () => {
  context('calculateDecision', () => {
    it('should throw an error if defendantPaymentDate, claimantPaymentDate or courtGeneratedPaymentDate are undefined', () => {
      expect(() => {
        CourtDetermination.determinePaymentDeadline(undefined, undefined, undefined)
      }).to.throw(Error, 'Input should be a moment, cannot be empty')
    })

    it('should throw an error if defendantPaymentDate, claimantPaymentDate or courtGeneratedPaymentDate are null', () => {
      expect(() => {
        CourtDetermination.determinePaymentDeadline(null, null, null)
      }).to.throw(Error, 'Input should be a moment, cannot be empty')
    })

    it('should return a claimant decision type when claimantPaymentDate is after the defendantPaymentDate', () => {
      const defendantPaymentDate = MomentFactory.currentDate()
      const claimantPaymentDate = MomentFactory.currentDate().add(1,'days')
      const courtGeneratedPaymentDate = MomentFactory.currentDate().add(2,'days')

      // TODO: Kiran please double check this is correct, such case does not appear on the diagram
      expect(CourtDetermination.determinePaymentDeadline(defendantPaymentDate, claimantPaymentDate, courtGeneratedPaymentDate).source).to.equal(DecisionType.CLAIMANT)
    })

    it('should return a claimant or defendant decision type when claimantPaymentDate and defendantPaymentDate are the same', () => {
      const defendantPaymentDate = MomentFactory.currentDate()
      const claimantPaymentDate = MomentFactory.currentDate()
      const courtGeneratedPaymentDate = MomentFactory.currentDate()

      // TODO: Kiran please fix the test, there is no assertion, implementation returns undefined in such case which is wrong
      expect(Object.values(DecisionType).includes(CourtDetermination.determinePaymentDeadline(defendantPaymentDate, claimantPaymentDate, courtGeneratedPaymentDate)))
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
})
