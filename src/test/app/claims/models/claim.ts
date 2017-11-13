import { Claim } from 'claims/models/claim'
import { MomentFactory } from 'common/momentFactory'
import { expect } from 'chai'
import { Settlement } from 'claims/models/settlement'
import { StatementType } from 'offer/form/models/statementType'
import { MadeBy } from 'offer/form/models/madeBy'
import { Offer } from 'claims/models/offer'

const claim = new Claim()

describe('Claim', () => {

  describe('eligibleForCCJ', () => {

    context('remainingDays < 0', () => {

      before('setup', () => {
        claim.countyCourtJudgmentRequestedAt = undefined
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
        claim.countyCourtJudgmentRequestedAt = undefined
        claim.responseDeadline = MomentFactory.currentDate()
      })

      it('should return false', () => {
        expect(claim.eligibleForCCJ).to.be.equal(false)
      })
    })

    context('remainingDays > 0', () => {

      before('setup', () => {
        claim.countyCourtJudgmentRequestedAt = undefined
        claim.responseDeadline = MomentFactory.currentDate().add(1, 'day')
      })

      it('should return false', () => {
        expect(claim.eligibleForCCJ).to.be.equal(false)
      })
    })

    context('countyCourtJudgmentRequestedAt is not empty', () => {

      before('setup', () => {
        claim.countyCourtJudgmentRequestedAt = MomentFactory.currentDate().subtract(1, 'day')
      })

      it('should return false', () => {
        expect(claim.eligibleForCCJ).to.be.equal(false)
      })
    })
  })

  describe('defendantOffer', () => {

    it('should return valid Offer object when defendant made an offer', () => {
      claim.settlement = new Settlement().deserialize({
        partyStatements: [
          {
            type: StatementType.OFFER.value,
            madeBy: MadeBy.DEFENDANT.value,
            offer: {
              content: 'bla',
              completionDate: '2019-10-10'
            }
          }
        ]
      })
      expect(claim.defendantOffer).to.be.instanceof(Offer)
    })

    it('should return undefined when settlement not set', () => {
      claim.settlement = undefined
      expect(claim.defendantOffer).to.be.eq(undefined)
    })
  })
})
