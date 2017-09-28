import Claim from 'claims/models/claim'
import { MomentFactory } from 'common/momentFactory'
import { expect } from 'chai'

const claim = new Claim()

describe('Claim', () => {
  describe('isCountyCourtJudgmentSubmitted', () => {
    it('should return true when CCJ was submitted', () => {
      claim.countyCourtJudgmentRequestedAt = MomentFactory.currentDate().subtract(1, 'day')
      expect(claim.isCountyCourtJudgmentSubmitted).to.be.equal(true)
    })

    it('should return false when CCJ was not submitted', () => {
      claim.countyCourtJudgmentRequestedAt = undefined
      expect(claim.isCountyCourtJudgmentSubmitted).to.be.equal(false)
    })
  })

  describe('eligibleForCCJ', () => {
    context('remainingDays < 0', () => {
      before('setup', () => {
        claim.responseDeadline = MomentFactory.currentDate().subtract(1, 'day')
      })

      it('should return true when claim not responded to', () => {
        expect(claim.eligibleForCCJ).to.be.equal(true)
      })

      it('should return false when claim responded to', () => {
        claim.respondedAt = MomentFactory.currentDateTime()
        expect(claim.eligibleForCCJ).to.be.equal(false)
      })
    })

    context('remainingDays = 0', () => {
      before('setup', () => {
        claim.responseDeadline = MomentFactory.currentDate()
      })
      it('should return false', () => {
        expect(claim.eligibleForCCJ).to.be.equal(false)
      })
    })
    context('remainingDays > 0', () => {
      before('setup', () => {
        claim.responseDeadline = MomentFactory.currentDate().add(1, 'day')
      })

      it('should return false', () => {
        expect(claim.eligibleForCCJ).to.be.equal(false)
      })
    })
  })
})
