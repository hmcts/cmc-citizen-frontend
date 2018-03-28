import { Claim } from 'claims/models/claim'
import { MomentFactory } from 'common/momentFactory'
import { expect } from 'chai'
import { Settlement } from 'claims/models/settlement'
import { StatementType } from 'offer/form/models/statementType'
import { MadeBy } from 'offer/form/models/madeBy'
import { Offer } from 'claims/models/offer'
import { ClaimStatus } from 'claims/models/claimStatus'
import { ResponseType } from 'claims/models/response/responseCommon'
import { FreeMediationOption } from 'response/form/models/freeMediation'
import { defenceWithDisputeData } from '../../../data/entity/responseData'
import { offer, offerRejection } from '../../../data/entity/offer'
import { individual } from '../../../data/entity/party'
import { DefenceType, FullDefenceResponse } from 'claims/models/response/fullDefenceResponse'
import { Individual } from 'claims/models/details/yours/individual'
import { PartyStatement } from 'claims/models/partyStatement'
import moment = require('moment')

describe('Claim', () => {

  describe('eligibleForCCJ', () => {
    const claim = new Claim()

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
    const claim = new Claim()

    it('should return valid Offer object when defendant made an offer', () => {
      claim.settlement = new Settlement().deserialize({
        partyStatements: [
          new PartyStatement(StatementType.OFFER.value, MadeBy.DEFENDANT.value, new Offer('aa', moment()))
        ]
      })
      expect(claim.defendantOffer).to.be.instanceof(Offer)
    })

    it('should return undefined when settlement not set', () => {
      claim.settlement = undefined
      expect(claim.defendantOffer).to.be.eq(undefined)
    })
  })

  describe('claimStatus', () => {
    let claim

    beforeEach(() => {
      claim = new Claim()
      claim.responseDeadline = moment()
    });

    [true, false].forEach(isMoreTimeRequested => {
      it(`should return CCJ_REQUESTED when a claimant requests a CCJ and more time requested = ${isMoreTimeRequested}.`, () => {
        claim.moreTimeRequested = isMoreTimeRequested
        claim.responseDeadline = moment().subtract(10, 'days')

        claim.countyCourtJudgmentRequestedAt = moment()
        expect(claim.status).to.be.equal(ClaimStatus.CCJ_REQUESTED)
      })
    })

    it('should return OFFER_SUBMITTED if an offer has been submitted.', () => {
      claim.settlement = new Settlement()
      claim.response = {
        responseType: ResponseType.FULL_DEFENCE,
        defenceType: DefenceType.DISPUTE,
        defence: 'defence reasoning',
        freeMediation: FreeMediationOption.YES,
        defendant: new Individual().deserialize(individual)
      }

      expect(claim.status).to.be.equal(ClaimStatus.OFFER_SUBMITTED)
    })

    it('should return OFFER_SETTLEMENT_REACHED if an offer has been accepted', () => {
      claim.settlement = new Settlement()
      claim.settlementReachedAt = moment()

      expect(claim.status).to.be.equal(ClaimStatus.OFFER_SETTLEMENT_REACHED)
    })

    it('should return MORE_TIME_REQUESTED when more time is requested', () => {
      claim.moreTimeRequested = true

      expect(claim.status).to.be.equal(ClaimStatus.MORE_TIME_REQUESTED)
    });

    [true, false].forEach(isMoreTimeRequested => {
      it(`should return CLAIM_REJECTED when the defendant has rejected the claim with no free mediation and more time requested = ${isMoreTimeRequested}`, () => {
        claim.moreTimeRequested = isMoreTimeRequested
        claim.response = {
          responseType: ResponseType.FULL_DEFENCE,
          defenceType: DefenceType.DISPUTE,
          defence: 'defence reasoning',
          freeMediation: FreeMediationOption.NO,
          defendant: new Individual().deserialize(individual)
        }
        expect(claim.status).to.be.equal(ClaimStatus.CLAIM_REJECTED)
      })
    })

    it('should return NO_RESPONSE when a defendant has not responded to the claim yet', () => {
      claim.response = undefined

      expect(claim.status).to.be.equal(ClaimStatus.NO_RESPONSE)
    })

    it('should return OFFER_REJECTED when offer is rejected', () => {
      claim.response = FullDefenceResponse.deserialize(defenceWithDisputeData)
      claim.settlement = new Settlement().deserialize({
        partyStatements: [offer, offerRejection]
      })

      expect(claim.status).to.be.equal(ClaimStatus.OFFER_REJECTED)
    })
  })

  describe('respondToResponseDeadline', () => {

    it('should add 33 days to the response deadline', () => {
      const claim = new Claim()
      claim.respondedAt = moment()

      expect(claim.respondToResponseDeadline.toISOString()).to.equal(claim.respondedAt.add(33, 'days').toISOString())
    })

    it('should return undefined if claim is not responded to', () => {
      const claim = new Claim()
      expect(claim.respondToResponseDeadline).to.equal(undefined)
    })
  })

  describe('stateHistory', () => {
    let claim

    beforeEach(() => {
      claim = new Claim()
      claim.responseDeadline = moment()
    })

    it('should contain the claim status only if not responded to', () => {
      expect(claim.stateHistory).to.have.lengthOf(1)
      expect(claim.stateHistory[0].status).to.equal(ClaimStatus.NO_RESPONSE)
    })

    it('should contain only 1 response status', () => {
      claim.respondedAt = moment()
      claim.response = { defenceType: DefenceType.ALREADY_PAID }

      expect(claim.stateHistory).to.have.lengthOf(1)
      expect(claim.stateHistory[0].status).to.equal(ClaimStatus.CLAIM_REJECTED_STATES_PAID)
    })

    it('should contain multiple statuses when multiple apply', () => {
      claim.respondedAt = moment()
      claim.response = { defenceType: DefenceType.DISPUTE }
      claim.settlement = new Settlement()
      claim.settlementReachedAt = moment()

      expect(claim.stateHistory).to.have.lengthOf(2)
      expect(claim.stateHistory[0].status).to.equal(ClaimStatus.OFFER_SETTLEMENT_REACHED)
      expect(claim.stateHistory[1].status).to.equal(ClaimStatus.CLAIM_REJECTED)
    })
  })
})
