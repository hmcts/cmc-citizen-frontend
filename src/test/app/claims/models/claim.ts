/* tslint:disable:no-unused-expression */
import { Claim } from 'claims/models/claim'
import { MomentFactory } from 'shared/momentFactory'
import { expect } from 'chai'
import { Settlement } from 'claims/models/settlement'
import { StatementType } from 'offer/form/models/statementType'
import { MadeBy } from 'claims/models/madeBy'
import { Offer } from 'claims/models/offer'
import { ClaimStatus } from 'claims/models/claimStatus'
import { ResponseType } from 'claims/models/response/responseType'
import { DefenceType } from 'claims/models/response/defenceType'
import { FreeMediationOption } from 'forms/models/freeMediation'
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
  baseDeterminationAcceptationClaimantResponseData,
  partAdmissionStatesPaidClaimantResponseData,
  rejectionClaimantResponseData
} from 'test/data/entity/claimantResponseData'
import { Company } from 'claims/models/details/theirs/company'
import { ClaimantResponseType } from 'claims/models/claimant-response/claimantResponseType'
import { FormaliseOption } from 'claims/models/claimant-response/formaliseOption'
import * as claimStoreMock from 'test/http-mocks/claim-store'
import { DateOfBirth } from 'forms/models/dateOfBirth'
import { LocalDate } from 'forms/models/localDate'
import { DecisionType } from 'common/court-calculations/decisionType'
import { ClaimData } from 'claims/models/claimData'
import { TheirDetails } from 'claims/models/details/theirs/theirDetails'
import { User } from 'idam/user'
import { PaymentSchedule } from 'claims/models/response/core/paymentSchedule'
import * as data from 'test/data/entity/settlement'
import { FeatureToggles } from 'utils/featureToggles'
import { MediationOutcome } from 'claims/models/mediationOutcome'
import { defenceClaimData } from 'test/data/entity/claimData'

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

  describe('Defendant date of birth', () => {

    it('should return date of birth when response is present', () => {
      const claimWithResponse = new Claim().deserialize({ ...claimStoreMock.sampleClaimIssueObj, ...claimStoreMock.sampleFullAdmissionWithPaymentBySetDateResponseObj })
      const dateOfBirth: DateOfBirth = claimWithResponse.retrieveDateOfBirthOfDefendant
      expect(dateOfBirth).to.be.deep.eq(new DateOfBirth(true, new LocalDate(1999, 1, 1)))
    })
    it('should return undefined when response not present', () => {
      const claimWithoutResponse = new Claim().deserialize({ ...claimStoreMock.sampleClaimIssueObj })
      const dateOfBirth: DateOfBirth = claimWithoutResponse.retrieveDateOfBirthOfDefendant
      expect(dateOfBirth).to.be.eq(undefined)
    })
  })

  describe('otherParty', () => {

    it('should return the claimant name when the defendant user is given', () => {
      const claimWithResponse = new Claim().deserialize({ ...claimStoreMock.sampleClaimIssueObj, ...claimStoreMock.sampleFullAdmissionWithPaymentBySetDateResponseObj })
      const user: User = new User('1', '', 'John', 'Doe', [], '', '')
      expect(claimWithResponse.otherPartyName(user)).to.be.eq(claimWithResponse.claimData.defendant.name)
    })

    it('should return the defendant name when the claimant user is given', () => {
      const claimWithResponse = new Claim().deserialize({ ...claimStoreMock.sampleClaimIssueObj, ...claimStoreMock.sampleFullAdmissionWithPaymentBySetDateResponseObj })
      const user: User = new User('123', '', 'John', 'Smith', [], '', '')
      expect(claimWithResponse.otherPartyName(user)).to.be.eq(claimWithResponse.claimData.claimant.name)
    })

    it('should throw an error when a user is not given', () => {
      const claimWithResponse = new Claim().deserialize({ ...claimStoreMock.sampleClaimIssueObj, ...claimStoreMock.sampleFullAdmissionWithPaymentBySetDateResponseObj })
      expect(() => claimWithResponse.otherPartyName(undefined)).to.throw(Error, 'user must be provided')
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
      claim.intentionToProceedDeadline = MomentFactory.currentDateTime().add(33, 'days')
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
      claim.settlement = prepareSettlementOfferByDefendantAndAcceptedByClaimant()
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

    it('should return ELIGIBLE_FOR_CCJ_AFTER_PART_ADMIT_PAY_IMMEDIATELY_PAST_DEADLINE when a defendant has not paid immediately', () => {
      claim.response = {
        responseType: ResponseType.PART_ADMISSION,
        paymentIntention: {
          paymentDate: MomentFactory.currentDate().subtract(6, 'days'),
          paymentOption: 'IMMEDIATELY'
        },
        defendant: new Individual().deserialize(individual)
      }

      claim.claimantResponse = {
        type: ClaimantResponseType.ACCEPTATION
      }

      expect(claim.status).to.be.equal(ClaimStatus.ELIGIBLE_FOR_CCJ_AFTER_PART_ADMIT_PAY_IMMEDIATELY_PAST_DEADLINE)
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

    it('should return REDETERMINATION_BY_JUDGE when a claimant refer to Judge after rejecting Defendant FULL ADMISSION and Court repayment plan', () => {
      claim.response = {
        responseType: ResponseType.FULL_ADMISSION,
        paymentIntention: {
          paymentDate: MomentFactory.currentDate().add(100, 'days'),
          paymentOption: PaymentOption.BY_SPECIFIED_DATE
        },
        defendant: new Individual().deserialize(individual)
      }
      claim.claimantResponse = {
        type: ClaimantResponseType.ACCEPTATION,
        formaliseOption: FormaliseOption.REFER_TO_JUDGE
      }
      claim.respondedAt = MomentFactory.currentDateTime().subtract(5, 'days')

      expect(claim.status).to.be.equal(ClaimStatus.REDETERMINATION_BY_JUDGE)
    })

    it('should return REDETERMINATION_BY_JUDGE when a claimant refer to Judge after rejecting Defendant PART ADMISSION and Court repayment plan', () => {
      claim.response = {
        responseType: ResponseType.PART_ADMISSION,
        amount: 150,
        paymentIntention: {
          paymentDate: MomentFactory.currentDate().add(100, 'days'),
          paymentOption: PaymentOption.BY_SPECIFIED_DATE
        },
        defendant: new Individual().deserialize(individual)
      }
      claim.claimantResponse = {
        type: ClaimantResponseType.ACCEPTATION,
        formaliseOption: FormaliseOption.REFER_TO_JUDGE
      }
      claim.respondedAt = MomentFactory.currentDateTime().subtract(5, 'days')

      expect(claim.status).to.be.equal(ClaimStatus.REDETERMINATION_BY_JUDGE)
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
      claim.settlement = prepareSettlementWithCounterSignatureWithDatePassed(PaymentIntention.deserialize(paymentIntention), MadeBy.DEFENDANT)
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
      claim.claimantResponse = baseDeterminationAcceptationClaimantResponseData
      claim.claimantRespondedAt = MomentFactory.currentDate()
      claim.countyCourtJudgmentRequestedAt = MomentFactory.currentDate()

      expect(claim.status).to.be.equal(ClaimStatus.CLAIMANT_ALTERNATIVE_PLAN_WITH_CCJ)
    })

    it('should return CLAIMANT_REQUESTS_CCJ_AFTER_DEFENDANT_REJECTS_SETTLEMENT when there is a CCJ after the defendant rejected the settlement agreement', () => {
      const paymentIntention = {
        paymentOption: PaymentOption.BY_SPECIFIED_DATE,
        paymentDate: MomentFactory.currentDate().subtract(1, 'days')
      }
      claim.response = {
        responseType: ResponseType.FULL_ADMISSION,
        paymentIntention: paymentIntention,
        defendant: new Individual().deserialize(individual)
      }
      claim.claimantResponse = baseDeterminationAcceptationClaimantResponseData
      claim.claimantResponse.formaliseOption = FormaliseOption.SETTLEMENT
      claim.claimantRespondedAt = MomentFactory.currentDate()
      claim.countyCourtJudgmentRequestedAt = MomentFactory.currentDate()
      claim.settlement = prepareSettlementWithDefendantRejection(PaymentIntention.deserialize(paymentIntention), MadeBy.DEFENDANT)
      claim.settlementReachedAt = data.defendantRejectsSettlementPartyStatements.settlementReachedAt

      expect(claim.status).to.be.equal(ClaimStatus.CLAIMANT_REQUESTS_CCJ_AFTER_DEFENDANT_REJECTS_SETTLEMENT)
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
      claim.claimantResponse = baseDeterminationAcceptationClaimantResponseData
      claim.claimantRespondedAt = MomentFactory.currentDate()
      claim.countyCourtJudgmentRequestedAt = MomentFactory.currentDate()
      claim.reDeterminationRequestedAt = MomentFactory.currentDate()

      expect(claim.status).to.be.equal(ClaimStatus.REDETERMINATION_BY_JUDGE)
    })

    it('should return CLAIMANT_REJECTED_PART_ADMISSION when the claimant rejects the part admission', () => {
      claim.claimantResponse = rejectionClaimantResponseData
      claim.claimantRespondedAt = MomentFactory.currentDate()
      claim.claimData = {
        defendant: new Individual().deserialize(individual)
      }
      claim.response = {
        responseType: ResponseType.PART_ADMISSION
      }
      expect(claim.status).to.be.equal(ClaimStatus.CLAIMANT_REJECTED_PART_ADMISSION)
    })

    it('should return CLAIMANT_REJECTED_PART_ADMISSION_DQ when the claimant rejects the part admission with DQs', () => {
      claim.claimantResponse = rejectionClaimantResponseData
      claim.claimantRespondedAt = MomentFactory.currentDate()
      claim.claimData = {
        defendant: new Individual().deserialize(individual)
      }
      claim.response = {
        responseType: ResponseType.PART_ADMISSION
      }
      claim.features = ['admissions', 'directionsQuestionnaire']
      expect(claim.status).to.be.equal(ClaimStatus.CLAIMANT_REJECTED_PART_ADMISSION_DQ)
    })

    it('should return CCJ_AFTER_SETTLEMENT_BREACHED when the claimant requests a CCJ after settlement terms broken', () => {
      const paymentIntention = {
        paymentOption: PaymentOption.BY_SPECIFIED_DATE,
        paymentDate: MomentFactory.currentDate().subtract(1, 'days')
      }
      claim.settlement = prepareSettlementWithCounterSignature(PaymentIntention.deserialize(paymentIntention), MadeBy.DEFENDANT)
      claim.settlementReachedAt = MomentFactory.currentDate().subtract(1, 'month')
      claim.response = {
        responseType: ResponseType.FULL_ADMISSION,
        paymentIntention: paymentIntention,
        defendant: new Individual().deserialize(individual)
      }
      claim.claimantResponse = baseAcceptationClaimantResponseData
      claim.countyCourtJudgmentRequestedAt = MomentFactory.currentDate()

      expect(claim.status).to.be.equal(ClaimStatus.CCJ_AFTER_SETTLEMENT_BREACHED)
      expect(claim.isSettlementPaymentDateValid()).to.be.false
    })

    it('should return CCJ_BY_DETERMINATION_AFTER_SETTLEMENT_BREACHED when the claimant requests a CCJ after settlement terms broken', () => {
      const paymentIntention = {
        paymentOption: PaymentOption.BY_SPECIFIED_DATE,
        paymentDate: MomentFactory.currentDate().subtract(1, 'days')
      }
      claim.settlement = prepareSettlementWithCounterSignature(PaymentIntention.deserialize(paymentIntention), MadeBy.DEFENDANT)
      claim.settlementReachedAt = MomentFactory.currentDate().subtract(1, 'month')
      claim.response = {
        responseType: ResponseType.FULL_ADMISSION,
        paymentIntention: paymentIntention,
        defendant: new Individual().deserialize(individual)
      }
      claim.claimantResponse = baseDeterminationAcceptationClaimantResponseData
      claim.countyCourtJudgmentRequestedAt = MomentFactory.currentDate()

      expect(claim.status).to.be.equal(ClaimStatus.CCJ_BY_DETERMINATION_AFTER_SETTLEMENT_BREACHED)
      expect(claim.isSettlementPaymentDateValid()).to.be.false
    })

    it('should return true when settlement payment date is in the future for a CCJ after settlement terms broken', () => {
      const paymentIntention = {
        paymentOption: PaymentOption.BY_SPECIFIED_DATE,
        paymentDate: MomentFactory.currentDate().add(1, 'days')
      }
      claim.settlement = prepareSettlementWithCounterSignature(PaymentIntention.deserialize(paymentIntention), MadeBy.DEFENDANT)
      claim.settlementReachedAt = MomentFactory.currentDate().subtract(1, 'month')
      claim.response = {
        responseType: ResponseType.FULL_ADMISSION,
        paymentIntention: paymentIntention,
        defendant: new Individual().deserialize(individual)
      }
      claim.claimantResponse = baseDeterminationAcceptationClaimantResponseData
      claim.countyCourtJudgmentRequestedAt = MomentFactory.currentDate()

      expect(claim.isSettlementPaymentDateValid()).to.be.true
    })

    it('should return true when settlement payment option is pay immediately for a CCJ after settlement terms broken', () => {
      const paymentIntention = {
        paymentOption: PaymentOption.IMMEDIATELY,
        paymentDate: MomentFactory.currentDate().add(5, 'days')
      }
      const defendantPaymentIntention = {
        paymentOption: PaymentOption.BY_SPECIFIED_DATE,
        paymentDate: MomentFactory.currentDate().add(1, 'days')
      }
      claim.settlement = prepareSettlementWithCounterSignature(PaymentIntention.deserialize(paymentIntention), MadeBy.DEFENDANT)
      claim.settlementReachedAt = MomentFactory.currentDate().subtract(1, 'month')
      claim.response = {
        responseType: ResponseType.FULL_ADMISSION,
        paymentIntention: defendantPaymentIntention,
        defendant: new Individual().deserialize(individual)
      }
      claim.claimantResponse = baseDeterminationAcceptationClaimantResponseData
      claim.countyCourtJudgmentRequestedAt = MomentFactory.currentDate()

      expect(claim.isSettlementPaymentDateValid()).to.be.true
    })

    it('should return true when settlement payment option is pay by instalments starting in future for a CCJ after settlement terms broken', () => {
      const paymentIntention = {
        paymentOption: PaymentOption.INSTALMENTS,
        repaymentPlan: {
          instalmentAmount: 100,
          firstPaymentDate: MomentFactory.currentDate().add(1, 'day'),
          paymentSchedule: PaymentSchedule.EACH_WEEK,
          completionDate: '2051-12-31',
          paymentLength: '1'
        }
      }
      const defendantPaymentIntention = {
        paymentOption: PaymentOption.BY_SPECIFIED_DATE,
        paymentDate: MomentFactory.currentDate().add(1, 'days')
      }
      claim.settlement = prepareSettlementWithCounterSignature(PaymentIntention.deserialize(paymentIntention), MadeBy.DEFENDANT)
      claim.settlementReachedAt = MomentFactory.currentDate().subtract(1, 'month')
      claim.response = {
        responseType: ResponseType.FULL_ADMISSION,
        paymentIntention: defendantPaymentIntention,
        defendant: new Individual().deserialize(individual)
      }
      claim.claimantResponse = baseDeterminationAcceptationClaimantResponseData
      claim.countyCourtJudgmentRequestedAt = MomentFactory.currentDate()

      expect(claim.isSettlementPaymentDateValid()).to.be.true
    })

    it('should return false when settlement does not exists', () => {
      const paymentIntention = {
        paymentOption: PaymentOption.IMMEDIATELY,
        paymentDate: MomentFactory.currentDate().add(5, 'days')
      }
      claim.response = {
        responseType: ResponseType.FULL_ADMISSION,
        paymentIntention: paymentIntention,
        defendant: new Individual().deserialize(individual)
      }
      claim.claimantResponse = baseDeterminationAcceptationClaimantResponseData
      claim.countyCourtJudgmentRequestedAt = MomentFactory.currentDate()

      expect(claim.isSettlementPaymentDateValid()).to.be.false
    })

    it('should return false when settlement does not exists', () => {
      const paymentIntention = {
        paymentOption: PaymentOption.IMMEDIATELY,
        paymentDate: MomentFactory.currentDate().add(5, 'days')
      }
      claim.response = {
        responseType: ResponseType.FULL_ADMISSION,
        paymentIntention: paymentIntention,
        defendant: new Individual().deserialize(individual)
      }
      claim.claimantResponse = baseDeterminationAcceptationClaimantResponseData
      claim.countyCourtJudgmentRequestedAt = MomentFactory.currentDate()

      expect(claim.isSettlementPaymentDateValid()).to.be.false
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

    it('should contain the claim status CLAIMANT_ACCEPTED_STATES_PAID only when part admission states paid is accepted', () => {
      claim.respondedAt = moment()
      claim.response = {
        paymentIntention: null,
        responseType: 'PART_ADMISSION',
        freeMediation: 'no',
        paymentDeclaration: {
          paidDate: '2010-12-31',
          explanation: 'Paid by cash'
        }
      }
      claim.claimantResponse = partAdmissionStatesPaidClaimantResponseData

      expect(claim.stateHistory).to.have.lengthOf(1)
      expect(claim.stateHistory[0].status).to.equal(ClaimStatus.CLAIMANT_ACCEPTED_STATES_PAID)
    })

    if (FeatureToggles.isEnabled('directionsQuestionnaire')) {
      it('should contain the claim status DEFENDANT_REJECTS_WITH_DQS only when defendant reject with DQs', () => {
        claim.respondedAt = moment()
        claim.features = ['admissions', 'directionsQuestionnaire']
        claim.response = {
          paymentIntention: null,
          responseType: 'FULL_DEFENCE',
          freeMediation: 'no'
        }

        expect(claim.stateHistory).to.have.lengthOf(2)
        expect(claim.stateHistory[0].status).to.equal(ClaimStatus.DEFENDANT_REJECTS_WITH_DQS)
      })

      it('should contain the claim status ORDER_DRAWN only when the legal advisor has drawn the order', () => {
        claim.respondedAt = moment()
        claim.features = ['admissions', 'directionsQuestionnaire']
        claim.response = {
          paymentIntention: null,
          responseType: 'FULL_DEFENCE',
          freeMediation: 'no'
        }
        claim.directionOrder = {
          directions: [
            {
              id: 'd2832981-a23a-4a4c-8b6a-a013c2c8a637',
              directionParty: 'BOTH',
              directionType: 'DOCUMENTS',
              directionActionedDate: '2019-09-20'
            },
            {
              id: '8e3a20c2-10a4-49fd-b1a7-da66b088f978',
              directionParty: 'BOTH',
              directionType: 'EYEWITNESS',
              directionActionedDate: '2019-09-20'
            }
          ],
          paperDetermination: 'no',
          preferredDQCourt: 'Central London County Court',
          hearingCourt: 'CLERKENWELL',
          hearingCourtAddress: {
            line1: 'The Gee Street Courthouse',
            line2: '29-41 Gee Street',
            city: 'London',
            postcode: 'EC1V 3RE'
          },
          estimatedHearingDuration: 'HALF_HOUR',
          createdOn: MomentFactory.currentDate().subtract(1, 'day')
        }

        expect(claim.stateHistory).to.have.lengthOf(2)
        expect(claim.stateHistory[0].status).to.equal(ClaimStatus.ORDER_DRAWN)
      })
    }

    context('should return CLAIMANT_REJECTED_STATES_PAID', () => {
      it('when defendant states paid amount equal to claim amount', () => {
        claim.totalAmountTillToday = 100
        claim.response = {
          responseType: 'FULL_DEFENCE',
          defenceType: 'ALREADY_PAID',
          paymentDeclaration: {
            paidDate: '2010-12-31',
            explanation: 'Paid by cash',
            paidAmount: 100
          }
        }
        claim.claimantResponse = {
          type: 'REJECTION'
        }

        expect(claim.status).to.be.equal(ClaimStatus.CLAIMANT_REJECTED_STATES_PAID)
      })

      it('when defendant states paid amount greater than claim amount', () => {
        claim.totalAmountTillToday = 100
        claim.response = {
          responseType: 'FULL_DEFENCE',
          defenceType: 'ALREADY_PAID',
          paymentDeclaration: {
            paidDate: '2010-12-31',
            explanation: 'Paid by cash',
            paidAmount: 200
          }
        }
        claim.claimantResponse = {
          type: 'REJECTION'
        }

        expect(claim.status).to.be.equal(ClaimStatus.CLAIMANT_REJECTED_STATES_PAID)
      })

      it('when defendant states paid amount less than claim amount', () => {
        claim.totalAmountTillToday = 100
        claim.response = {
          amount: 90,
          responseType: 'PART_ADMISSION',
          defenceType: 'ALREADY_PAID',
          paymentDeclaration: {
            paidDate: '2010-12-31',
            explanation: 'Paid by cash'
          }
        }
        claim.claimantResponse = {
          type: 'REJECTION'
        }

        expect(claim.status).to.be.equal(ClaimStatus.CLAIMANT_REJECTED_STATES_PAID)
      })

      it('when claimant rejects defendants defence', () => {
        claim.totalAmountTillToday = 100
        claim.response = {
          responseType: ResponseType.FULL_DEFENCE,
          defenceType: DefenceType.DISPUTE,
          defence: 'defence reasoning',
          freeMediation: FreeMediationOption.NO,
          defendant: new Individual().deserialize(individual)
        }
        claim.claimantResponse = {
          type: 'REJECTION'
        }

        expect(claim.status).to.be.equal(ClaimStatus.CLAIMANT_REJECTED_DEFENDANT_DEFENCE_NO_DQ)
      })

      it('when claimant accepts defendants defence', () => {
        claim.totalAmountTillToday = 100
        claim.response = {
          responseType: ResponseType.FULL_DEFENCE,
          defenceType: DefenceType.DISPUTE,
          defence: 'defence reasoning',
          freeMediation: FreeMediationOption.NO,
          defendant: new Individual().deserialize(individual)
        }
        claim.claimantResponse = {
          type: 'ACCEPTATION'
        }

        expect(claim.status).to.be.equal(ClaimStatus.CLAIMANT_ACCEPTED_DEFENDANT_DEFENCE)
      })
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

    it('should return mediation deadline date', () => {
      const claim = new Claim()
      claim.respondedAt = moment()

      claimStoreMock.mockNextWorkingDay(MomentFactory.parse('2019-06-28'))

      claim.respondToMediationDeadline().then(
        res => expect(res.format('YYYY-MM-DD'))
          .to.equal(MomentFactory.parse('2019-06-28').format('YYYY-MM-DD'))
      )
    })

    it('should return undefined if claim is not responded to', async () => {
      const claim = new Claim()
      const mediationDeadline = await claim.respondToMediationDeadline()
      expect(mediationDeadline).to.be.undefined
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

  describe('mediationOutcome', () => {
    let claim

    beforeEach(() => {
      claim = new Claim().deserialize(defenceClaimData)
      claim.responseDeadline = MomentFactory.currentDate().add(1, 'day')
      claim.intentionToProceedDeadline = MomentFactory.currentDateTime().add(33, 'days')
      claim.response = FullDefenceResponse.deserialize(defenceWithDisputeData)
    })

    it('should return FAILED when mediation is failed', () => {
      claim.mediationOutcome = MediationOutcome.FAILED
      expect(claim.mediationOutcome).to.be.equal('FAILED')
    })

    it('should return SUCCEEDED when mediation is success', () => {
      claim.mediationOutcome = MediationOutcome.SUCCEEDED
      expect(claim.mediationOutcome).to.be.equal('SUCCEEDED')
    })

  })

  describe('stateHistory', () => {
    let claim

    beforeEach(() => {
      claim = new Claim()
      claim.responseDeadline = MomentFactory.currentDate().add(1, 'day')
      claim.intentionToProceedDeadline = MomentFactory.currentDateTime().add(33, 'days')
    })

    it('should return OFFER_SUBMITTED, RESPONSE_SUBMITTED and PAID_IN_FULL_LINK_ELIGIBLE if an offer has been submitted.', () => {
      claim.settlement = prepareSettlementOfferByDefendant()
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

    it('should return true when offer is rejected', () => {
      claim.response = FullDefenceResponse.deserialize(defenceWithDisputeData)
      claim.settlement = new Settlement().deserialize({
        partyStatements: [offer, offerRejection]
      })
      expect(claim.isSettlementRejectedOrBreached()).to.be.true
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
        paymentIntention: {
          paymentDate: MomentFactory.currentDate().add(60, 'days'),
          paymentOption: 'BY_SPECIFIED_DATE'
        }
      }
      claim.claimData = {
        defendant: new Organisation().deserialize(organisation)
      }
      claim.claimData = new ClaimData().deserialize({
        defendants: new Array(new TheirDetails().deserialize({
          type: 'organisation',
          name: undefined,
          address: undefined,
          email: undefined
        }))
      })
      claim.claimantResponse = rejectionClaimantResponseData

      expect(claim.stateHistory).to.have.lengthOf(1)
      expect(claim.stateHistory[0].status).to.equal(ClaimStatus.CLAIMANT_REJECTED_DEFENDANT_AS_BUSINESS_RESPONSE)
    })

    it('should contain the claim status only if claimant rejects company response', () => {
      claim.respondedAt = moment()
      claim.response = {
        paymentIntention: {
          paymentDate: MomentFactory.currentDate().add(60, 'days'),
          paymentOption: 'BY_SPECIFIED_DATE'
        }
      }
      claim.claimantResponse = rejectionClaimantResponseData
      claim.claimData = new ClaimData().deserialize({
        defendants: new Array(new TheirDetails().deserialize({
          type: 'organisation',
          name: undefined,
          address: undefined,
          email: undefined
        }))
      })
      claim.claimData = {
        defendant: new Company().deserialize(organisation)
      }

      expect(claim.stateHistory).to.have.lengthOf(1)
      expect(claim.stateHistory[0].status).to.equal(ClaimStatus.CLAIMANT_REJECTED_DEFENDANT_AS_BUSINESS_RESPONSE)
    })

    it('should contain settlement reached status only when response submitted and offers exchanged', () => {
      claim.respondedAt = moment()
      claim.response = { responseType: ResponseType.FULL_DEFENCE }
      claim.settlement = prepareSettlementOfferByDefendantAndAcceptedByClaimant()
      claim.settlementReachedAt = moment()

      expect(claim.stateHistory).to.have.lengthOf(1)
      expect(claim.stateHistory[0].status).to.equal(ClaimStatus.OFFER_SETTLEMENT_REACHED)
    })

    if (FeatureToggles.isEnabled('mediation')) {
      it('should contain CLAIMANT_REJECTED_DEFENDANT_DEFENCE status when claimant has reject defence and DQs is enabled', () => {
        claim.respondedAt = moment()
        claim.features = ['admissions', 'directionsQuestionnaire']
        claim.response = {
          responseType: ResponseType.FULL_DEFENCE,
          defenceType: DefenceType.DISPUTE
        }
        claim.claimantResponse = {
          type: ClaimantResponseType.REJECTION
        }
        expect(claim.stateHistory).to.have.lengthOf(2)
        expect(claim.stateHistory[0].status).to.equal(ClaimStatus.CLAIMANT_REJECTED_DEFENDANT_DEFENCE)
        expect(claim.stateHistory[1].status).to.equal(ClaimStatus.PAID_IN_FULL_LINK_ELIGIBLE)
      })
    }

    it('should contain CLAIMANT_REJECTED_DEFENDANT_DEFENCE_NO_DQ status when claimant has reject defence and DQs is not enabled', () => {
      claim.respondedAt = moment()
      claim.response = {
        responseType: ResponseType.FULL_DEFENCE,
        defenceType: DefenceType.DISPUTE
      }
      claim.claimantResponse = {
        type: ClaimantResponseType.REJECTION
      }
      expect(claim.stateHistory).to.have.lengthOf(2)
      expect(claim.stateHistory[0].status).to.equal(ClaimStatus.CLAIMANT_REJECTED_DEFENDANT_DEFENCE_NO_DQ)
      expect(claim.stateHistory[1].status).to.equal(ClaimStatus.PAID_IN_FULL_LINK_ELIGIBLE)
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

  describe('isIntentionToProceedEligible', () => {
    let claim

    beforeEach(() => {
      claim = new Claim()
    })

    it('should return true when createdAt is after 09/09/19 3:12', () => {
      claim.createdAt = MomentFactory.currentDate()
      expect(claim.isIntentionToProceedEligible()).to.be.true
    })

    it('should return false when createdAt is before 09/09/19 3:12', () => {
      claim.createdAt = MomentFactory.parse('2019-09-08')
      expect(claim.isIntentionToProceedEligible()).to.be.false
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

function prepareSettlementOfferByDefendant (): Settlement {
  const settlement = {
    partyStatements: [
      {
        type: StatementType.OFFER.value,
        madeBy: MadeBy.DEFENDANT,
        offer: {
          content: 'My offer contents here.',
          completionDate: '2020-10-10'
        }
      }
    ]
  }
  return new Settlement().deserialize(settlement)
}

function prepareSettlementOfferByDefendantAndAcceptedByClaimant (): Settlement {
  const settlement = {
    partyStatements: [
      {
        type: StatementType.OFFER.value,
        madeBy: MadeBy.DEFENDANT,
        offer: {
          content: 'My offer contents here.',
          completionDate: '2020-10-10'
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

function prepareSettlementWithDefendantRejection (paymentIntention: PaymentIntention, party: MadeBy): Settlement {
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
      },
      {
        type: 'REJECTION',
        madeBy: 'DEFENDANT'
      }
    ]
  }
  return new Settlement().deserialize(settlement)
}

function prepareSettlementWithCounterSignature (paymentIntention: PaymentIntention, party: MadeBy): Settlement {
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
      },
      {
        type: 'COUNTERSIGNATURE',
        madeBy: 'DEFENDANT'
      }
    ]
  }
  return new Settlement().deserialize(settlement)
}

function prepareSettlementWithCounterSignatureWithDatePassed (paymentIntention: PaymentIntention, party: MadeBy): Settlement {
  const settlement = {
    partyStatements: [
      {
        type: StatementType.OFFER.value,
        madeBy: party.value,
        offer: {
          content: 'My offer contents here.',
          completionDate: '2010-10-10',
          paymentIntention: paymentIntention
        }
      },
      {
        madeBy: MadeBy.CLAIMANT.value,
        type: StatementType.ACCEPTATION.value
      },
      {
        type: 'COUNTERSIGNATURE',
        madeBy: 'DEFENDANT'
      }
    ]
  }
  return new Settlement().deserialize(settlement)
}
