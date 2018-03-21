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
import { individual } from '../../../data/entity/party'
import { DefenceType } from 'claims/models/response/fullDefenceResponse'
import { Individual } from 'claims/models/details/yours/individual'
import { PartyStatement } from 'claims/models/partyStatement'
import { DATE_FORMAT } from 'app/utils/momentFormatter'
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
          new PartyStatement(StatementType.OFFER.value, MadeBy.DEFENDANT.value,
            new Offer('aa', moment().format(DATE_FORMAT)))
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
      it(`should return ELIGIBLE_FOR_CCJ if defendant has not responded before the deadline, more time requested = ${isMoreTimeRequested}`, () => {
        claim.moreTimeRequested = isMoreTimeRequested
        claim.responseDeadline = moment().subtract(10, 'days')

        expect(claim.status).to.be.equal(ClaimStatus.ELIGIBLE_FOR_CCJ)
      })
    });

    [true, false].forEach(isMoreTimeRequested => {
      it(`should return CCJ_REQUESTED when a claimant requests a CCJ and more time requested = ${isMoreTimeRequested}.`, () => {
        claim.moreTimeRequested = isMoreTimeRequested
        claim.responseDeadline = moment().subtract(10, 'days')

        claim.countyCourtJudgmentRequestedAt = moment()
        expect(claim.status).to.be.equal(ClaimStatus.CCJ_REQUESTED)
      })
    });

    [
      { isMoreTimeRequested: false, isEligibleForCCJ: false },
      { isMoreTimeRequested: false, isEligibleForCCJ: true },
      { isMoreTimeRequested: true, isEligibleForCCJ: false },
      { isMoreTimeRequested: true, isEligibleForCCJ: true }
    ].forEach(obj => {
      it(`should return OFFER_SUBMITTED if an offer has been submitted. More time requested = ${obj.isMoreTimeRequested} and eligibility for a CCJ is ${obj.isEligibleForCCJ}`, () => {
        claim.moreTimeRequested = obj.isMoreTimeRequested
        if (obj.isEligibleForCCJ) {
          claim.responseDeadline = moment().subtract(2, 'days')
        } else {
          claim.responseDeadline = moment().add(2, 'days')
        }
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
    });

    [true, false].forEach(isMoreTimeRequested => {
      it(`should return OFFER_SETTLEMENT_REACHED if an offer has been accepted and more time requested = ${isMoreTimeRequested}`, () => {
        claim.moreTimeRequested = isMoreTimeRequested

        claim.settlement = new Settlement()
        claim.settlementReachedAt = moment()

        expect(claim.status).to.be.equal(ClaimStatus.OFFER_SETTLEMENT_REACHED)
      })
    })

    it('should return MORE_TIME_REQUESTED when more time is requested', () => {
      claim.moreTimeRequested = true

      expect(claim.status).to.be.equal(ClaimStatus.MORE_TIME_REQUESTED)
    });

    [true, false].forEach(isMoreTimeRequested => {
      it(`should return FREE_MEDIATION when defendant has rejected the claim and asked for free mediation and more time requested = ${isMoreTimeRequested}`, () => {
        claim.moreTimeRequested = isMoreTimeRequested
        claim.response = {
          responseType: ResponseType.FULL_DEFENCE,
          defenceType: DefenceType.DISPUTE,
          defence: 'defence reasoning',
          freeMediation: FreeMediationOption.YES,
          defendant: new Individual().deserialize(individual)
        }
        expect(claim.status).to.be.equal(ClaimStatus.FREE_MEDIATION)
      })
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
  })
})
