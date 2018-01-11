import { Claim } from 'claims/models/claim'
import { MomentFactory } from 'common/momentFactory'
import { expect } from 'chai'
import { Settlement } from 'claims/models/settlement'
import { StatementType } from 'offer/form/models/statementType'
import { MadeBy } from 'offer/form/models/madeBy'
import { Offer } from 'claims/models/offer'
import { InterestDate } from 'claims/models/interestDate'
import { ClaimData } from 'claims/models/claimData'
import { paymentOf } from '../../../data/entity/payment'
import { breakdownOf } from '../../../data/entity/amount-breakdown'
import { Interest, InterestType } from 'claim/form/models/interest'
import { InterestDateType } from 'app/common/interestDateType'
import moment = require('moment')
import { ClaimStatus } from 'claims/models/claimStatus'
import { ResponseType } from 'claims/models/response/responseCommon'
import { FreeMediationOption } from 'response/form/models/freeMediation'
import { individual } from '../../../data/entity/party'
import { DefenceType } from 'claims/models/response/fullDefenceResponse'
import { Individual } from 'claims/models/details/yours/individual'

describe('Claim', () => {

  context('totalAmountTillToday', () => {
    const claim = new Claim()
    claim.claimData = new ClaimData()
    claim.claimData.amount = breakdownOf(100)
    claim.claimData.payment = paymentOf(25)

    it('should return total of claim amount and payment amount if interest is not claimed', () => {
      claim.claimData.interest = new Interest(InterestType.NO_INTEREST)

      expect(claim.totalAmountTillToday).to.be.equal(125)
    })

    it('should return total of claim amount, payment amount and interest calculated from date of issue till today if interest is claimed from submission date', () => {
      claim.claimData.interest = new Interest(InterestType.STANDARD)
      claim.claimData.interestDate = new InterestDate(InterestDateType.SUBMISSION)
      claim.createdAt = moment().subtract(10, 'days')

      expect(claim.totalAmountTillToday).to.equal(125.22)
    })

    it('should return total of claim amount, payment amount and interest calculated from selected date till today if interest is claimed from selected date', () => {
      claim.claimData.interest = new Interest(InterestType.STANDARD)
      claim.claimData.interestDate = new InterestDate(InterestDateType.CUSTOM, moment().subtract(10, 'days'))

      expect(claim.totalAmountTillToday).to.equal(125.22)
    })
  })

  context('totalAmountTillDateOfIssue', () => {
    const claim = new Claim()
    claim.claimData = new ClaimData()
    claim.claimData.amount = breakdownOf(100)
    claim.claimData.payment = paymentOf(25)

    it('should return total of claim amount and payment amount if interest is not claimed', () => {
      claim.claimData.interest = new Interest(InterestType.NO_INTEREST)

      expect(claim.totalAmountTillDateOfIssue).to.be.equal(125)
    })

    it('should return total of claim amount and payment amount if interest is claimed from submission date', () => {
      claim.claimData.interest = new Interest(InterestType.STANDARD)
      claim.claimData.interestDate = new InterestDate(InterestDateType.SUBMISSION)
      claim.createdAt = moment().subtract(10, 'days')

      expect(claim.totalAmountTillDateOfIssue).to.equal(125)
    })

    it('should return total of claim amount, payment amount and interest calculated from selected date till today if interest is claimed from selected date', () => {
      claim.claimData.interest = new Interest(InterestType.STANDARD)
      claim.claimData.interestDate = new InterestDate(InterestDateType.CUSTOM, moment().subtract(10, 'days'))
      claim.createdAt = moment()

      expect(claim.totalAmountTillDateOfIssue).to.equal(125.22)
    })
  })

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

  describe('claimStatus', () => {
    let claim

    beforeEach(() => {
      claim = new Claim()
      claim.responseDeadline = moment()
    });

    [true, false].forEach(obj => {
      it(`should return ELIGIBLE_FOR_CCJ if defendant has not responded before the deadline, more time requested = ${obj.isMoreTimeRequested}`, () => {
        claim.moreTimeRequested = obj.isMoreTimeRequested
        claim.responseDeadline = moment().subtract(10, 'days')

        expect(claim.status).to.be.equal(ClaimStatus.ELIGIBLE_FOR_CCJ)
      })
    });

    [true, false].forEach(isMoreTimeRequested => {
      it(`should return CCJ_REQUESTED when a claimant requests a CCJ and more time requested = ${isMoreTimeRequested}`, () => {
        claim.moreTimeRequested = isMoreTimeRequested
        claim.responseDeadline = moment().subtract(10, 'days')

        claim.countyCourtJudgmentRequestedAt = moment()
        expect(claim.status).to.be.equal(ClaimStatus.CCJ_REQUESTED)
      });

      [
        { isMoreTimeRequested: false, isEligibleForCCJ: false },
        { isMoreTimeRequested: false, isEligibleForCCJ: true },
        { isMoreTimeRequested: true, isEligibleForCCJ: false },
        { isMoreTimeRequested: true, isEligibleForCCJ: true }
      ].forEach(obj => {
        it(`should return OFFER_SUBMITTED if an offer has been submitted. More time requested = ${isMoreTimeRequested} and eligibility for a CCJ is ${obj.isEligibleForCCJ}`, () => {
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
        });

        [
          { isMoreTimeRequested: false, isEligibleForCCJ: false },
          { isMoreTimeRequested: false, isEligibleForCCJ: true },
          { isMoreTimeRequested: true, isEligibleForCCJ: false },
          { isMoreTimeRequested: true, isEligibleForCCJ: true }
        ].forEach(obj => {
          it(`should return OFFER_SETTLEMENT_REACHED if an offer has been accepted, more time requested = ${obj.isMoreTimeRequested} and eligibility for a CCJ is ${obj.isEligibleForCCJ} `, () => {
            claim.moreTimeRequested = obj.isMoreTimeRequested
            if (obj.isEligibleForCCJ) {
              claim.responseDeadline = moment().subtract(2, 'days')
            } else {
              claim.responseDeadline = moment().add(2, 'days')
            }
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
          it(`should return CLAIM_REJECTED when an individual defendant has rejected the claim with no free mediation and more time requested = ${isMoreTimeRequested}`, () => {
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
  })
})
