import { expect } from 'chai'

import { CourtDetermination, DecisionType } from 'common/court-calculations/courtDetermination'
import { LocalDate } from 'forms/models/localDate'

describe('CourtDetermination', () => {

  context('calculateDecision', () => {
    it('should return a claimant decision type when claimantPaymentDate is after the defendantPaymentDate', () => {

      let defendantPaymentDate = new LocalDate(2019, 10, 10).toMoment()
      let claimantPaymentDate = new LocalDate(2019, 10, 11).toMoment()
      let courtGeneratedPaymentDate = new LocalDate(2019, 10, 12).toMoment()

      expect(CourtDetermination.calculateDecision(defendantPaymentDate, claimantPaymentDate, courtGeneratedPaymentDate)).to.equal(DecisionType.CLAIMANT)
    })

    it('should return a claimant or defendant decision type when claimantPaymentDate and defendantPaymentDate are the same', () => {

      let defendantPaymentDate = new LocalDate(2019, 12, 31).toMoment()
      let claimantPaymentDate = new LocalDate(2019, 12, 31).toMoment()
      let courtGeneratedPaymentDate = new LocalDate(2019, 10, 11).toMoment()

      expect(CourtDetermination.calculateDecision(defendantPaymentDate, claimantPaymentDate, courtGeneratedPaymentDate)).to.equal(DecisionType.CLAIMANT)
    })

    it('should return a claimant decision type when claimantPaymentDate and courtGeneratedPaymentDate are the same', () => {

      let defendantPaymentDate = new LocalDate(2019, 10, 10).toMoment()
      let claimantPaymentDate = new LocalDate(2019, 10, 11).toMoment()
      let courtGeneratedPaymentDate = new LocalDate(2019, 10, 11).toMoment()

      expect(CourtDetermination.calculateDecision(defendantPaymentDate, claimantPaymentDate, courtGeneratedPaymentDate)).to.equal(DecisionType.CLAIMANT)
    })

    it('should return a claimant decision type when claimantPaymentDate is before defendantPaymentDate and after the courtGeneratedPaymentDate', () => {

      let defendantPaymentDate = new LocalDate(2019, 10, 11).toMoment()
      let claimantPaymentDate = new LocalDate(2019, 10, 10).toMoment()
      let courtGeneratedPaymentDate = new LocalDate(2019, 10, 9).toMoment()

      expect(CourtDetermination.calculateDecision(defendantPaymentDate, claimantPaymentDate, courtGeneratedPaymentDate)).to.equal(DecisionType.CLAIMANT)
    })

    it('should return a defendant decision type when claimantPaymentDate is before defendantPaymentDate and before the courtGeneratedPaymentDate', () => {

      let defendantPaymentDate = new LocalDate(2019, 10, 5).toMoment()
      let claimantPaymentDate = new LocalDate(2019, 10, 1).toMoment()
      let courtGeneratedPaymentDate = new LocalDate(2019, 10, 2).toMoment()

      expect(CourtDetermination.calculateDecision(defendantPaymentDate, claimantPaymentDate, courtGeneratedPaymentDate)).to.equal(DecisionType.COURT)
    })

    it('should return a court decision type when the claimantPaymentDate is before defendantPaymentDate and the defendantPaymentDate is before the courtGeneratedPaymentDate', () => {

      let defendantPaymentDate = new LocalDate(2019, 10, 10).toMoment()
      let claimantPaymentDate = new LocalDate(2019, 10, 7).toMoment()
      let courtGeneratedPaymentDate = new LocalDate(2019, 10, 15).toMoment()

      expect(CourtDetermination.calculateDecision(defendantPaymentDate, claimantPaymentDate, courtGeneratedPaymentDate)).to.equal(DecisionType.DEFENDANT)
    })
  })
})
