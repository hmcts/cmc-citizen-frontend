/* tslint:disable:no-unused-expression */
import { Claim } from 'claims/models/claim'
import { MomentFactory } from 'shared/momentFactory'
import { expect } from 'chai'
import { Settlement } from 'claims/models/settlement'
import { StatementType } from 'offer/form/models/statementType'
import { MadeBy } from 'offer/form/models/madeBy'
import { Offer } from 'claims/models/offer'
import { ClaimStatus } from 'claims/models/claimStatus'
import { ResponseType } from 'claims/models/response/responseType'
import { DefenceType } from 'claims/models/response/defenceType'
import { FreeMediationOption } from 'response/form/models/freeMediation'
import { defenceWithDisputeData } from 'test/data/entity/responseData'
import { offer, offerRejection } from 'test/data/entity/offer'
import { individual, organisation } from 'test/data/entity/party'
import { FullDefenceResponse } from 'claims/models/response/fullDefenceResponse'
import { Individual } from 'claims/models/details/yours/individual'
import { PartyStatement } from 'claims/models/partyStatement'
import * as moment from 'moment'
import { PaymentIntention } from 'claims/models/response/core/paymentIntention'
import { PaymentOption } from 'claims/models/paymentOption'
import { CountyCourtJudgment } from 'claims/models/countyCourtJudgment'
import { CountyCourtJudgmentType } from 'claims/models/countyCourtJudgmentType'
import { Organisation } from 'claims/models/details/theirs/organisation'
import {
  baseAcceptationClaimantResponseData,
  rejectionClaimantResponseData
} from 'test/data/entity/claimantResponseData'
import { Company } from 'claims/models/details/theirs/company'
import { ClaimantResponseType } from 'claims/models/claimant-response/claimantResponseType'
import { FormaliseOption } from 'claims/models/claimant-response/formaliseOption'
import { DecisionType } from 'common/court-calculations/courtDecision'

describe('Claim', () => {
  describe('eligibleForCCJ', () => {
    const claim = new Claim()

    context('response deadline has passed', () => {
      before('setup', () => {
        claim.countyCourtJudgmentRequestedAt = undefined
        claim.responseDeadline = MomentFactory.currentDate().subtract(1, 'day')
      })

      it('should return true when claim not responded to', () => {
        expect(claim.eligibleForCCJ).to.be.true
      })

      it('should return false when claim responded to', () => {
        claim.respondedAt = MomentFactory.currentDateTime()
        expect(claim.eligibleForCCJ).to.be.false
      })
    })

    context('defendant still has time to respond', () => {
      before('setup', () => {
        claim.countyCourtJudgmentRequestedAt = undefined
        claim.responseDeadline = MomentFactory.currentDate().add(1, 'day')
      })

      it('should return false', () => {
        expect(claim.eligibleForCCJ).to.be.false
      })
    })

    context('countyCourtJudgmentRequestedAt is not empty', () => {
      before('setup', () => {
        claim.countyCourtJudgmentRequestedAt = MomentFactory.currentDate().subtract(1, 'day')
      })

      it('should return false', () => {
        expect(claim.eligibleForCCJ).to.be.false
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
      claim.responseDeadline = MomentFactory.currentDate().add(1, 'day')
    });

    [true, false].forEach(isMoreTimeRequested => {
      it(`should return CCJ_REQUESTED when a claimant requests a CCJ and more time requested = ${isMoreTimeRequested}.`, () => {
        claim.moreTimeRequested = isMoreTimeRequested
        claim.responseDeadline = moment().subtract(10, 'days')

        claim.countyCourtJudgmentRequestedAt = moment()
        expect(claim.status).to.be.equal(ClaimStatus.CCJ_REQUESTED)
      })
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
      it(`should return RESPONSE_SUBMITTED when the defendant has rejected the claim with no free mediation and more time requested = ${isMoreTimeRequested}`, () => {
        claim.moreTimeRequested = isMoreTimeRequested
        claim.response = {
          responseType: ResponseType.FULL_DEFENCE,
          defenceType: DefenceType.DISPUTE,
          defence: 'defence reasoning',
          freeMediation: FreeMediationOption.NO,
          defendant: new Individual().deserialize(individual)
        }
        expect(claim.status).to.be.equal(ClaimStatus.RESPONSE_SUBMITTED)
      })
    })

    it('should return NO_RESPONSE when a defendant has not responded to the claim yet', () => {
      claim.response = undefined

      expect(claim.status).to.be.equal(ClaimStatus.NO_RESPONSE)
    })

    it('should return ELIGIBLE_FOR_CCJ_AFTER_FULL_ADMIT_PAY_IMMEDIATELY_PAST_DEADLINE when a defendant has not paid immediately', () => {
      claim.response = {
        responseType: ResponseType.FULL_ADMISSION,
        paymentIntention: {
          paymentDate: MomentFactory.currentDate().subtract(6, 'days'),
          paymentOption: 'IMMEDIATELY'
        },
        defendant: new Individual().deserialize(individual)
      }

      expect(claim.status).to.be.equal(ClaimStatus.ELIGIBLE_FOR_CCJ_AFTER_FULL_ADMIT_PAY_IMMEDIATELY_PAST_DEADLINE)
    })

    it('should return CLAIMANT_ACCEPTED_ADMISSION when a claimant has signed a settlement agreement', () => {
      const paymentIntention = {
        paymentOption: PaymentOption.BY_SPECIFIED_DATE,
        paymentDate: MomentFactory.currentDate()
      }
      claim.claimantResponse = {
        type: ClaimantResponseType.ACCEPTATION,
        formaliseOption: FormaliseOption.SETTLEMENT
      }
      claim.settlement = prepareSettlement(PaymentIntention.deserialize(paymentIntention), MadeBy.DEFENDANT)
      claim.respondedAt = MomentFactory.currentDateTime().subtract(5, 'days')

      expect(claim.status).to.be.equal(ClaimStatus.CLAIMANT_ACCEPTED_ADMISSION)
    })

    it('should return CLAIMANT_ACCEPTED_COURT_PLAN_SETTLEMENT when a claimant has signed a settlement agreement', () => {
      claim.claimantResponse = {
        type: ClaimantResponseType.ACCEPTATION,
        formaliseOption: FormaliseOption.SETTLEMENT,
        courtDetermination: {
          decisionType: DecisionType.CLAIMANT,
          courtDecision: {
            paymentDate: MomentFactory.currentDate().add('1 year'),
            paymentOption: PaymentOption.BY_SPECIFIED_DATE
          },
          disposableIncome: 0,
          courtPaymentIntention: {
            paymentDate: MomentFactory.currentDate().add('6 months'),
            paymentOption: PaymentOption.BY_SPECIFIED_DATE
          }
        },
        claimantPaymentIntention: {
          paymentDate: MomentFactory.currentDate().add('1 year'),
          paymentOption: PaymentOption.BY_SPECIFIED_DATE
        }
      }
      const paymentIntention = {
        paymentOption: PaymentOption.BY_SPECIFIED_DATE,
        paymentDate: MomentFactory.currentDate()
      }
      claim.settlement = prepareSettlement(PaymentIntention.deserialize(paymentIntention), MadeBy.CLAIMANT)
      claim.respondedAt = MomentFactory.currentDateTime()

      expect(claim.status).to.be.equal(ClaimStatus.CLAIMANT_ACCEPTED_COURT_PLAN_SETTLEMENT)
    })

    it('should return CLAIMANT_ACCEPTED_ADMISSION_AND_DEFENDANT_NOT_SIGNED when a claimant has signed a settlement agreement but defendant has not', () => {
      const paymentIntention = {
        paymentOption: PaymentOption.BY_SPECIFIED_DATE,
        paymentDate: MomentFactory.currentDate()
      }
      claim.settlement = prepareSettlement(PaymentIntention.deserialize(paymentIntention), MadeBy.DEFENDANT)
      claim.respondedAt = MomentFactory.currentDateTime().subtract(2, 'months')
      claim.claimantRespondedAt = MomentFactory.currentDate().subtract('8', 'days')

      expect(claim.status).to.be.equal(ClaimStatus.CLAIMANT_ACCEPTED_ADMISSION_AND_DEFENDANT_NOT_SIGNED)
    })

    it('should return ELIGIBLE_FOR_CCJ_AFTER_BREACHED_SETTLEMENT after date of payment', () => {
      const paymentIntention = {
        paymentOption: PaymentOption.BY_SPECIFIED_DATE,
        paymentDate: MomentFactory.currentDate().subtract(1, 'days')
      }
      claim.settlement = prepareSettlement(PaymentIntention.deserialize(paymentIntention), MadeBy.DEFENDANT)
      claim.settlementReachedAt = MomentFactory.currentDate().subtract(1, 'month')
      claim.response = {
        responseType: ResponseType.FULL_ADMISSION,
        paymentIntention: paymentIntention,
        defendant: new Individual().deserialize(individual)
      }

      expect(claim.stateHistory.map(state => state.status)).includes(ClaimStatus.ELIGIBLE_FOR_CCJ_AFTER_BREACHED_SETTLEMENT)
    })

    it('should return CLAIMANT_ALTERNATIVE_PLAN_WITH_CCJ when there is a CCJ and a claimant response with a court decision', () => {
      const paymentIntention = {
        paymentOption: PaymentOption.BY_SPECIFIED_DATE,
        paymentDate: MomentFactory.currentDate().subtract(1, 'days')
      }
      claim.response = {
        responseType: ResponseType.FULL_ADMISSION,
        paymentIntention: paymentIntention,
        defendant: new Individual().deserialize(individual)
      }
      claim.claimantResponse = baseAcceptationClaimantResponseData
      claim.claimantRespondedAt = MomentFactory.currentDate()
      claim.countyCourtJudgmentRequestedAt = MomentFactory.currentDate()

      expect(claim.status).to.be.equal(ClaimStatus.CLAIMANT_ALTERNATIVE_PLAN_WITH_CCJ)
    })

    it('should return REDETERMINATION_BY_JUDGE when there is a CCJ and a redetermination requested at', () => {
      const paymentIntention = {
        paymentOption: PaymentOption.BY_SPECIFIED_DATE,
        paymentDate: MomentFactory.currentDate().subtract(1, 'days')
      }
      claim.response = {
        responseType: ResponseType.FULL_ADMISSION,
        paymentIntention: paymentIntention,
        defendant: new Individual().deserialize(individual)
      }
      claim.claimantResponse = baseAcceptationClaimantResponseData
      claim.claimantRespondedAt = MomentFactory.currentDate()
      claim.countyCourtJudgmentRequestedAt = MomentFactory.currentDate()
      claim.reDeterminationRequestedAt = MomentFactory.currentDate()

      expect(claim.status).to.be.equal(ClaimStatus.REDETERMINATION_BY_JUDGE)
    })

    it('should return CLAIMANT_REJECTS_PART_ADMISSION when the claimant rejects the part admission', () => {
      claim.claimantResponse = rejectionClaimantResponseData
      claim.claimantRespondedAt = MomentFactory.currentDate()
      claim.claimData = {
        defendant: new Individual().deserialize(individual)
      }
      expect(claim.status).to.be.equal(ClaimStatus.CLAIMANT_REJECTS_PART_ADMISSION)
    })

    it('should return PART_ADMIT_PAY_IMMEDIATELY when the claimant accepts a part admit with immediately as the payment option', () => {
      const paymentIntention = {
        paymentOption: PaymentOption.IMMEDIATELY,
        paymentDate: MomentFactory.currentDate().add(5, 'days')
      }
      claim.response = {
        responseType: ResponseType.PART_ADMISSION,
        paymentIntention: paymentIntention,
        defendant: new Individual().deserialize(individual)
      }
      claim.claimantResponse = {
        type: ClaimantResponseType.ACCEPTATION
      }
      expect(claim.status).to.be.equal(ClaimStatus.PART_ADMIT_PAY_IMMEDIATELY)
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

  describe('respondToMediationDeadline', () => {

    it('should add 5 days to the response deadline', () => {
      const claim = new Claim()
      claim.respondedAt = moment()

      expect(claim.respondToMediationDeadline.toISOString()).to.equal(claim.respondedAt.add(5, 'days').toISOString())
    })

    it('should return undefined if claim is not responded to', () => {
      const claim = new Claim()
      expect(claim.respondToMediationDeadline).to.equal(undefined)
    })
  })

  describe('isEligibleForReDetermination', () => {

    it('should be eligible', () => {
      const claim = new Claim()
      claim.countyCourtJudgment = {
        paymentOption: PaymentOption.IMMEDIATELY,
        ccjType: CountyCourtJudgmentType.DETERMINATION
      } as CountyCourtJudgment
      claim.countyCourtJudgmentRequestedAt = MomentFactory.currentDateTime().subtract(18, 'days')

      expect(claim.isEligibleForReDetermination()).to.be.true
    })

    it('should not be eligible when ccj requested date is 20 days before', () => {
      const claim = new Claim()
      claim.countyCourtJudgment = {
        paymentOption: PaymentOption.IMMEDIATELY,
        ccjType: CountyCourtJudgmentType.DETERMINATION
      } as CountyCourtJudgment
      claim.countyCourtJudgmentRequestedAt = MomentFactory.currentDateTime().subtract(20, 'days')

      expect(claim.isEligibleForReDetermination()).to.be.false
    })

    it('should not be eligible when reDetermination already requested', () => {
      const claim = new Claim()
      claim.countyCourtJudgment = {
        paymentOption: PaymentOption.IMMEDIATELY,
        ccjType: CountyCourtJudgmentType.DETERMINATION
      } as CountyCourtJudgment
      claim.countyCourtJudgmentRequestedAt = MomentFactory.currentDateTime().subtract(20, 'days')
      claim.reDeterminationRequestedAt = MomentFactory.currentDateTime()

      expect(claim.isEligibleForReDetermination()).to.be.false
    })

    it('should not be eligible when ccjType is Admissions', () => {
      const claim = new Claim()
      claim.countyCourtJudgment = {
        paymentOption: PaymentOption.IMMEDIATELY,
        ccjType: CountyCourtJudgmentType.ADMISSIONS
      } as CountyCourtJudgment
      claim.countyCourtJudgmentRequestedAt = MomentFactory.currentDateTime().subtract(20, 'days')
      claim.reDeterminationRequestedAt = MomentFactory.currentDateTime()

      expect(claim.isEligibleForReDetermination()).to.be.false
    })

    it('should not be eligible when ccjType is Default', () => {
      const claim = new Claim()
      claim.countyCourtJudgment = {
        paymentOption: PaymentOption.IMMEDIATELY,
        ccjType: CountyCourtJudgmentType.DEFAULT
      } as CountyCourtJudgment
      claim.countyCourtJudgmentRequestedAt = MomentFactory.currentDateTime().subtract(20, 'days')
      claim.reDeterminationRequestedAt = MomentFactory.currentDateTime()

      expect(claim.isEligibleForReDetermination()).to.be.false
    })
  })

  describe('stateHistory', () => {
    let claim

    beforeEach(() => {
      claim = new Claim()
      claim.responseDeadline = MomentFactory.currentDate().add(1, 'day')
    })

    it('should return OFFER_SUBMITTED, RESPONSE_SUBMITTED and PAID_IN_FULL_LINK_ELIGIBLE if an offer has been submitted.', () => {
      claim.settlement = new Settlement()
      claim.response = {
        responseType: ResponseType.FULL_DEFENCE,
        defenceType: DefenceType.DISPUTE,
        defence: 'defence reasoning',
        freeMediation: FreeMediationOption.YES,
        defendant: new Individual().deserialize(individual)
      }

      expect(claim.stateHistory).to.have.lengthOf(3)
      expect(claim.stateHistory[0].status).to.equal(ClaimStatus.RESPONSE_SUBMITTED)
      expect(claim.stateHistory[1].status).to.equal(ClaimStatus.OFFER_SUBMITTED)
      expect(claim.stateHistory[2].status).to.equal(ClaimStatus.PAID_IN_FULL_LINK_ELIGIBLE)
    })

    it('should return OFFER_REJECTED when offer is rejected', () => {
      claim.response = FullDefenceResponse.deserialize(defenceWithDisputeData)
      claim.settlement = new Settlement().deserialize({
        partyStatements: [offer, offerRejection]
      })

      expect(claim.stateHistory).to.have.lengthOf(3)
      expect(claim.stateHistory[0].status).to.equal(ClaimStatus.RESPONSE_SUBMITTED)
      expect(claim.stateHistory[1].status).to.equal(ClaimStatus.OFFER_REJECTED)
      expect(claim.stateHistory[2].status).to.equal(ClaimStatus.PAID_IN_FULL_LINK_ELIGIBLE)
    })

    it('should contain the claim status only if not responded to', () => {
      expect(claim.stateHistory).to.have.lengthOf(2)
      expect(claim.stateHistory[0].status).to.equal(ClaimStatus.NO_RESPONSE)
      expect(claim.stateHistory[1].status).to.equal(ClaimStatus.PAID_IN_FULL_LINK_ELIGIBLE)
    })

    it('should contain the claim status only if response submitted but no offer made', () => {
      claim.respondedAt = moment()
      claim.response = { responseType: ResponseType.FULL_DEFENCE }

      expect(claim.stateHistory).to.have.lengthOf(2)
      expect(claim.stateHistory[0].status).to.equal(ClaimStatus.RESPONSE_SUBMITTED)
      expect(claim.stateHistory[1].status).to.equal(ClaimStatus.PAID_IN_FULL_LINK_ELIGIBLE)
    })

    it('should contain the claim status only if claimant rejects organisation response', () => {
      claim.respondedAt = moment()
      claim.response = {
        responseType: ResponseType.PART_ADMISSION,
        paymentIntention: {
          paymentDate: MomentFactory.currentDate().add(60, 'days'),
          paymentOption: 'BY_SPECIFIED_DATE'
        }
      }
      claim.claimData = {
        defendant: new Organisation().deserialize(organisation)
      }
      claim.claimantResponse = rejectionClaimantResponseData

      expect(claim.stateHistory).to.have.lengthOf(1)
      expect(claim.stateHistory[0].status).to.equal(ClaimStatus.CLAIMANT_REJECTED_DEFENDANT_AS_COMPANY_OR_ORGANISATION_RESPONSE)
    })

    it('should contain the claim status only if claimant rejects company response', () => {
      claim.respondedAt = moment()
      claim.response = {
        responseType: ResponseType.PART_ADMISSION,
        paymentIntention: {
          paymentDate: MomentFactory.currentDate().add(60, 'days'),
          paymentOption: 'BY_SPECIFIED_DATE'
        }
      }
      claim.claimantResponse = rejectionClaimantResponseData
      claim.claimData = {
        defendant: new Company().deserialize(organisation)
      }

      expect(claim.stateHistory).to.have.lengthOf(1)
      expect(claim.stateHistory[0].status).to.equal(ClaimStatus.CLAIMANT_REJECTED_DEFENDANT_AS_COMPANY_OR_ORGANISATION_RESPONSE)
    })

    it('should contain multiple statuses when response submitted and offers exchanged', () => {
      claim.respondedAt = moment()
      claim.response = { responseType: ResponseType.FULL_DEFENCE }
      claim.settlement = new Settlement()
      claim.settlementReachedAt = moment()

      expect(claim.stateHistory).to.have.lengthOf(3)
      expect(claim.stateHistory[0].status).to.equal(ClaimStatus.OFFER_SETTLEMENT_REACHED)
      expect(claim.stateHistory[1].status).to.equal(ClaimStatus.OFFER_SUBMITTED)
      expect(claim.stateHistory[2].status).to.equal(ClaimStatus.PAID_IN_FULL_LINK_ELIGIBLE)
    })
  })

  describe('paidInFullCCJPaidWithinMonth', () => {
    let claim

    beforeEach(() => {
      claim = new Claim()
      claim.moneyReceivedOn = MomentFactory.currentDate()
    })

    it('should return true when CCJ is paid within month of countyCourtJudgmentRequestedAt', () => {
      claim.countyCourtJudgmentRequestedAt = MomentFactory.currentDate().add(1, 'month')
      expect(claim.isCCJPaidWithinMonth()).to.be.true
    })

    it('should return false when CCJ is paid 2 months after countyCourtJudgmentRequestedAt', () => {
      claim.moneyReceivedOn = MomentFactory.currentDate().add(2, 'month')
      claim.countyCourtJudgmentRequestedAt = MomentFactory.currentDate()
      expect(claim.isCCJPaidWithinMonth()).to.be.false
    })
  })
})

function prepareSettlement (paymentIntention: PaymentIntention, party: MadeBy): Settlement {
  const settlement = {
    partyStatements: [
      {
        type: StatementType.OFFER.value,
        madeBy: party.value,
        offer: {
          content: 'My offer contents here.',
          completionDate: '2020-10-10',
          paymentIntention: paymentIntention
        }
      },
      {
        madeBy: MadeBy.CLAIMANT.value,
        type: StatementType.ACCEPTATION.value
      }
    ]
  }
  return new Settlement().deserialize(settlement)
}
