import { expect } from 'chai'

import { CourtDetermination, DecisionType } from 'common/court-calculations/courtDetermination'
import moment = require('moment')

describe('CourtDetermination', () => {

  context('calculateDecision', () => {

    it('should throw an error if defendantPaymentDate, claimantPaymentDate or courtGeneratedPaymentDate are undefined', () => {
      expect(() => {
        CourtDetermination.calculateDecision(undefined, undefined, undefined)
      }).to.throw(Error, 'Input should be a moment, cannot be empty')
    })

    it('should throw an error if defendantPaymentDate, claimantPaymentDate or courtGeneratedPaymentDate are null', () => {
      expect(() => {
        CourtDetermination.calculateDecision(null, null, null)
      }).to.throw(Error, 'Input should be a moment, cannot be empty')
    })

    it('should return a claimant decision type when claimantPaymentDate is after the defendantPaymentDate and no court date is supplied', () => {

      let defendantPaymentDate = moment(new Date())
      let claimantPaymentDate = moment(new Date()).add(1,'days')
      let courtGeneratedPaymentDate = undefined

      expect(CourtDetermination.calculateDecision(defendantPaymentDate, claimantPaymentDate, courtGeneratedPaymentDate)).to.equal(DecisionType.CLAIMANT_IN_FAVOUR_OF_DEFENDANT)
    })

    it('should return a defendant decision type when claimantPaymentDate is after the defendantPaymentDate and no court date is supplied', () => {

      let defendantPaymentDate = moment(new Date()).add(1,'days')
      let claimantPaymentDate = moment(new Date())
      let courtGeneratedPaymentDate = undefined

      expect(CourtDetermination.calculateDecision(defendantPaymentDate, claimantPaymentDate, courtGeneratedPaymentDate)).to.equal(DecisionType.DEFENDANT)
    })

    it('should return a claimant decision type when claimantPaymentDate is after the defendantPaymentDate', () => {

      let defendantPaymentDate = moment(new Date())
      let claimantPaymentDate = moment(new Date()).add(1,'days')
      let courtGeneratedPaymentDate = moment(new Date()).add(2,'days')

      expect(CourtDetermination.calculateDecision(defendantPaymentDate, claimantPaymentDate, courtGeneratedPaymentDate)).to.equal(DecisionType.CLAIMANT_IN_FAVOUR_OF_DEFENDANT)
    })

    it('should return a claimant decision type when claimantPaymentDate and defendantPaymentDate are the same', () => {

      let defendantPaymentDate = moment(new Date())
      let claimantPaymentDate = moment(new Date())
      let courtGeneratedPaymentDate = moment(new Date())

      expect(CourtDetermination.calculateDecision(defendantPaymentDate, claimantPaymentDate, courtGeneratedPaymentDate)).to.equal(DecisionType.CLAIMANT_IN_FAVOUR_OF_DEFENDANT)
    })

    it('should return a claimant decision type when claimantPaymentDate and courtGeneratedPaymentDate are the same', () => {

      let defendantPaymentDate = moment(new Date())
      let claimantPaymentDate = moment(new Date()).add(1,'days')
      let courtGeneratedPaymentDate = moment(new Date()).add(1,'days')

      expect(CourtDetermination.calculateDecision(defendantPaymentDate, claimantPaymentDate, courtGeneratedPaymentDate)).to.equal(DecisionType.CLAIMANT_IN_FAVOUR_OF_DEFENDANT)
    })

    it('should return a claimant decision type when claimantPaymentDate is before defendantPaymentDate and after the courtGeneratedPaymentDate', () => {

      let defendantPaymentDate = moment(new Date()).add(11,'days')
      let claimantPaymentDate = moment(new Date()).add(10,'days')
      let courtGeneratedPaymentDate = moment(new Date()).add(9,'days')

      expect(CourtDetermination.calculateDecision(defendantPaymentDate, claimantPaymentDate, courtGeneratedPaymentDate)).to.equal(DecisionType.CLAIMANT)
    })

    it('should return a court decision type when claimantPaymentDate is before defendantPaymentDate and before the courtGeneratedPaymentDate', () => {

      let defendantPaymentDate = moment(new Date()).add(5,'days')
      let claimantPaymentDate = moment(new Date()).add(1,'days')
      let courtGeneratedPaymentDate = moment(new Date()).add(2,'days')

      expect(CourtDetermination.calculateDecision(defendantPaymentDate, claimantPaymentDate, courtGeneratedPaymentDate)).to.equal(DecisionType.COURT)
    })

    it('should return a defendant decision type when the claimantPaymentDate is before defendantPaymentDate and the defendantPaymentDate is before the courtGeneratedPaymentDate', () => {

      let defendantPaymentDate = moment(new Date()).add(10,'days')
      let claimantPaymentDate = moment(new Date()).add(7,'days')
      let courtGeneratedPaymentDate = moment(new Date()).add(15,'days')

      expect(CourtDetermination.calculateDecision(defendantPaymentDate, claimantPaymentDate, courtGeneratedPaymentDate)).to.equal(DecisionType.DEFENDANT)
    })

    it('should return a defendant decision type when the claimantPaymentDate is before defendantPaymentDate and the claimantPaymentDate is the same as courtGeneratedPaymentDate', () => {

      let defendantPaymentDate = moment(new Date()).add(10,'days')
      let claimantPaymentDate = moment(new Date()).add(7,'days')
      let courtGeneratedPaymentDate = claimantPaymentDate

      expect(CourtDetermination.calculateDecision(defendantPaymentDate, claimantPaymentDate, courtGeneratedPaymentDate)).to.equal(DecisionType.COURT)
    })
    it('should return a defendant decision type when the claimantPaymentDate is before defendantPaymentDate and the defendantPaymentDate is the same as courtGeneratedPaymentDate', () => {

      let defendantPaymentDate = moment(new Date()).add(10,'days')
      let claimantPaymentDate = moment(new Date()).add(7,'days')
      let courtGeneratedPaymentDate = defendantPaymentDate

      expect(CourtDetermination.calculateDecision(defendantPaymentDate, claimantPaymentDate, courtGeneratedPaymentDate)).to.equal(DecisionType.DEFENDANT)
    })
  })
})
