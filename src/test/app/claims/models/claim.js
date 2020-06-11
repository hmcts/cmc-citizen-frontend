"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-unused-expression */
const claim_1 = require("claims/models/claim");
const momentFactory_1 = require("shared/momentFactory");
const chai_1 = require("chai");
const settlement_1 = require("claims/models/settlement");
const statementType_1 = require("offer/form/models/statementType");
const madeBy_1 = require("claims/models/madeBy");
const offer_1 = require("claims/models/offer");
const claimStatus_1 = require("claims/models/claimStatus");
const responseType_1 = require("claims/models/response/responseType");
const defenceType_1 = require("claims/models/response/defenceType");
const freeMediation_1 = require("forms/models/freeMediation");
const responseData_1 = require("test/data/entity/responseData");
const offer_2 = require("test/data/entity/offer");
const party_1 = require("test/data/entity/party");
const fullDefenceResponse_1 = require("claims/models/response/fullDefenceResponse");
const individual_1 = require("claims/models/details/yours/individual");
const partyStatement_1 = require("claims/models/partyStatement");
const moment = require("moment");
const paymentIntention_1 = require("claims/models/response/core/paymentIntention");
const paymentOption_1 = require("claims/models/paymentOption");
const countyCourtJudgmentType_1 = require("claims/models/countyCourtJudgmentType");
const organisation_1 = require("claims/models/details/theirs/organisation");
const claimantResponseData_1 = require("test/data/entity/claimantResponseData");
const company_1 = require("claims/models/details/theirs/company");
const claimantResponseType_1 = require("claims/models/claimant-response/claimantResponseType");
const formaliseOption_1 = require("claims/models/claimant-response/formaliseOption");
const claimStoreMock = require("test/http-mocks/claim-store");
const dateOfBirth_1 = require("forms/models/dateOfBirth");
const localDate_1 = require("forms/models/localDate");
const decisionType_1 = require("common/court-calculations/decisionType");
const claimData_1 = require("claims/models/claimData");
const theirDetails_1 = require("claims/models/details/theirs/theirDetails");
const user_1 = require("idam/user");
const paymentSchedule_1 = require("claims/models/response/core/paymentSchedule");
const data = require("test/data/entity/settlement");
const featureToggles_1 = require("utils/featureToggles");
const mediationOutcome_1 = require("claims/models/mediationOutcome");
const claimData_2 = require("test/data/entity/claimData");
const yesNoOption_1 = require("models/yesNoOption");
describe('Claim', () => {
    describe('eligibleForCCJ', () => {
        const claim = new claim_1.Claim();
        context('response deadline has passed', () => {
            before('setup', () => {
                claim.countyCourtJudgmentRequestedAt = undefined;
                claim.responseDeadline = momentFactory_1.MomentFactory.currentDate().subtract(1, 'day');
            });
            it('should return true when claim not responded to', () => {
                chai_1.expect(claim.eligibleForCCJ).to.be.true;
            });
            it('should return false when claim responded to', () => {
                claim.respondedAt = momentFactory_1.MomentFactory.currentDateTime();
                chai_1.expect(claim.eligibleForCCJ).to.be.false;
            });
        });
        context('defendant still has time to respond', () => {
            before('setup', () => {
                claim.countyCourtJudgmentRequestedAt = undefined;
                claim.responseDeadline = momentFactory_1.MomentFactory.currentDate().add(1, 'day');
            });
            it('should return false', () => {
                chai_1.expect(claim.eligibleForCCJ).to.be.false;
            });
        });
        context('countyCourtJudgmentRequestedAt is not empty', () => {
            before('setup', () => {
                claim.countyCourtJudgmentRequestedAt = momentFactory_1.MomentFactory.currentDate().subtract(1, 'day');
            });
            it('should return false', () => {
                chai_1.expect(claim.eligibleForCCJ).to.be.false;
            });
        });
    });
    describe('Defendant date of birth', () => {
        it('should return date of birth when response is present', () => {
            const claimWithResponse = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreMock.sampleClaimIssueObj), claimStoreMock.sampleFullAdmissionWithPaymentBySetDateResponseObj));
            const dateOfBirth = claimWithResponse.retrieveDateOfBirthOfDefendant;
            chai_1.expect(dateOfBirth).to.be.deep.eq(new dateOfBirth_1.DateOfBirth(true, new localDate_1.LocalDate(1999, 1, 1)));
        });
        it('should return undefined when response not present', () => {
            const claimWithoutResponse = new claim_1.Claim().deserialize(Object.assign({}, claimStoreMock.sampleClaimIssueObj));
            const dateOfBirth = claimWithoutResponse.retrieveDateOfBirthOfDefendant;
            chai_1.expect(dateOfBirth).to.be.eq(undefined);
        });
    });
    describe('otherParty', () => {
        it('should return the claimant name when the defendant user is given', () => {
            const claimWithResponse = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreMock.sampleClaimIssueObj), claimStoreMock.sampleFullAdmissionWithPaymentBySetDateResponseObj));
            const user = new user_1.User('1', '', 'John', 'Doe', [], '', '');
            chai_1.expect(claimWithResponse.otherPartyName(user)).to.be.eq(claimWithResponse.claimData.defendant.name);
        });
        it('should return the defendant name when the claimant user is given', () => {
            const claimWithResponse = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreMock.sampleClaimIssueObj), claimStoreMock.sampleFullAdmissionWithPaymentBySetDateResponseObj));
            const user = new user_1.User('123', '', 'John', 'Smith', [], '', '');
            chai_1.expect(claimWithResponse.otherPartyName(user)).to.be.eq(claimWithResponse.claimData.claimant.name);
        });
        it('should throw an error when a user is not given', () => {
            const claimWithResponse = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreMock.sampleClaimIssueObj), claimStoreMock.sampleFullAdmissionWithPaymentBySetDateResponseObj));
            chai_1.expect(() => claimWithResponse.otherPartyName(undefined)).to.throw(Error, 'user must be provided');
        });
    });
    describe('defendantOffer', () => {
        const claim = new claim_1.Claim();
        it('should return valid Offer object when defendant made an offer', () => {
            claim.settlement = new settlement_1.Settlement().deserialize({
                partyStatements: [
                    new partyStatement_1.PartyStatement(statementType_1.StatementType.OFFER.value, madeBy_1.MadeBy.DEFENDANT.value, new offer_1.Offer('aa', moment()))
                ]
            });
            chai_1.expect(claim.defendantOffer).to.be.instanceof(offer_1.Offer);
        });
        it('should return undefined when settlement not set', () => {
            claim.settlement = undefined;
            chai_1.expect(claim.defendantOffer).to.be.eq(undefined);
        });
    });
    describe('claimStatus', () => {
        let claim;
        beforeEach(() => {
            claim = new claim_1.Claim();
            claim.responseDeadline = momentFactory_1.MomentFactory.currentDate().add(1, 'day');
            claim.intentionToProceedDeadline = momentFactory_1.MomentFactory.currentDateTime().add(33, 'days');
        });
        [true, false].forEach(isMoreTimeRequested => {
            it(`should return CCJ_REQUESTED when a claimant requests a CCJ and more time requested = ${isMoreTimeRequested}.`, () => {
                claim.moreTimeRequested = isMoreTimeRequested;
                claim.responseDeadline = moment().subtract(10, 'days');
                claim.countyCourtJudgmentRequestedAt = moment();
                chai_1.expect(claim.status).to.be.equal(claimStatus_1.ClaimStatus.CCJ_REQUESTED);
            });
        });
        it('should return OFFER_SETTLEMENT_REACHED if an offer has been accepted', () => {
            claim.settlement = prepareSettlementOfferByDefendantAndAcceptedByClaimant();
            claim.settlementReachedAt = moment();
            chai_1.expect(claim.status).to.be.equal(claimStatus_1.ClaimStatus.OFFER_SETTLEMENT_REACHED);
        });
        it('should return MORE_TIME_REQUESTED when more time is requested', () => {
            claim.moreTimeRequested = true;
            chai_1.expect(claim.status).to.be.equal(claimStatus_1.ClaimStatus.MORE_TIME_REQUESTED);
        });
        it('should return DEFENDANT_PAPER_RESPONSE when a paper response received', () => {
            claim.paperResponse = yesNoOption_1.YesNoOption.YES;
            chai_1.expect(claim.status).to.be.equal(claimStatus_1.ClaimStatus.DEFENDANT_PAPER_RESPONSE);
        });
        [true, false].forEach(isMoreTimeRequested => {
            it(`should return RESPONSE_SUBMITTED when the defendant has rejected the claim with no free mediation and more time requested = ${isMoreTimeRequested}`, () => {
                claim.moreTimeRequested = isMoreTimeRequested;
                claim.response = {
                    responseType: responseType_1.ResponseType.FULL_DEFENCE,
                    defenceType: defenceType_1.DefenceType.DISPUTE,
                    defence: 'defence reasoning',
                    freeMediation: freeMediation_1.FreeMediationOption.NO,
                    defendant: new individual_1.Individual().deserialize(party_1.individual)
                };
                chai_1.expect(claim.status).to.be.equal(claimStatus_1.ClaimStatus.RESPONSE_SUBMITTED);
            });
        });
        it('should return NO_RESPONSE when a defendant has not responded to the claim yet', () => {
            claim.response = undefined;
            chai_1.expect(claim.status).to.be.equal(claimStatus_1.ClaimStatus.NO_RESPONSE);
        });
        it('should return ELIGIBLE_FOR_CCJ_AFTER_FULL_ADMIT_PAY_IMMEDIATELY_PAST_DEADLINE when a defendant has not paid immediately', () => {
            claim.response = {
                responseType: responseType_1.ResponseType.FULL_ADMISSION,
                paymentIntention: {
                    paymentDate: momentFactory_1.MomentFactory.currentDate().subtract(6, 'days'),
                    paymentOption: 'IMMEDIATELY'
                },
                defendant: new individual_1.Individual().deserialize(party_1.individual)
            };
            chai_1.expect(claim.status).to.be.equal(claimStatus_1.ClaimStatus.ELIGIBLE_FOR_CCJ_AFTER_FULL_ADMIT_PAY_IMMEDIATELY_PAST_DEADLINE);
        });
        it('should return ELIGIBLE_FOR_CCJ_AFTER_PART_ADMIT_PAY_IMMEDIATELY_PAST_DEADLINE when a defendant has not paid immediately', () => {
            claim.response = {
                responseType: responseType_1.ResponseType.PART_ADMISSION,
                paymentIntention: {
                    paymentDate: momentFactory_1.MomentFactory.currentDate().subtract(6, 'days'),
                    paymentOption: 'IMMEDIATELY'
                },
                defendant: new individual_1.Individual().deserialize(party_1.individual)
            };
            claim.claimantResponse = {
                type: claimantResponseType_1.ClaimantResponseType.ACCEPTATION
            };
            chai_1.expect(claim.status).to.be.equal(claimStatus_1.ClaimStatus.ELIGIBLE_FOR_CCJ_AFTER_PART_ADMIT_PAY_IMMEDIATELY_PAST_DEADLINE);
        });
        it('should return CLAIMANT_ACCEPTED_ADMISSION when a claimant has signed a settlement agreement', () => {
            const paymentIntention = {
                paymentOption: paymentOption_1.PaymentOption.BY_SPECIFIED_DATE,
                paymentDate: momentFactory_1.MomentFactory.currentDate()
            };
            claim.claimantResponse = {
                type: claimantResponseType_1.ClaimantResponseType.ACCEPTATION,
                formaliseOption: formaliseOption_1.FormaliseOption.SETTLEMENT
            };
            claim.settlement = prepareSettlement(paymentIntention_1.PaymentIntention.deserialize(paymentIntention), madeBy_1.MadeBy.DEFENDANT);
            claim.respondedAt = momentFactory_1.MomentFactory.currentDateTime().subtract(5, 'days');
            chai_1.expect(claim.status).to.be.equal(claimStatus_1.ClaimStatus.CLAIMANT_ACCEPTED_ADMISSION);
        });
        it('should return REDETERMINATION_BY_JUDGE when a claimant refer to Judge after rejecting Defendant FULL ADMISSION and Court repayment plan', () => {
            claim.response = {
                responseType: responseType_1.ResponseType.FULL_ADMISSION,
                paymentIntention: {
                    paymentDate: momentFactory_1.MomentFactory.currentDate().add(100, 'days'),
                    paymentOption: paymentOption_1.PaymentOption.BY_SPECIFIED_DATE
                },
                defendant: new individual_1.Individual().deserialize(party_1.individual)
            };
            claim.claimantResponse = {
                type: claimantResponseType_1.ClaimantResponseType.ACCEPTATION,
                formaliseOption: formaliseOption_1.FormaliseOption.REFER_TO_JUDGE
            };
            claim.respondedAt = momentFactory_1.MomentFactory.currentDateTime().subtract(5, 'days');
            chai_1.expect(claim.status).to.be.equal(claimStatus_1.ClaimStatus.REDETERMINATION_BY_JUDGE);
        });
        it('should return REDETERMINATION_BY_JUDGE when a claimant refer to Judge after rejecting Defendant PART ADMISSION and Court repayment plan', () => {
            claim.response = {
                responseType: responseType_1.ResponseType.PART_ADMISSION,
                amount: 150,
                paymentIntention: {
                    paymentDate: momentFactory_1.MomentFactory.currentDate().add(100, 'days'),
                    paymentOption: paymentOption_1.PaymentOption.BY_SPECIFIED_DATE
                },
                defendant: new individual_1.Individual().deserialize(party_1.individual)
            };
            claim.claimantResponse = {
                type: claimantResponseType_1.ClaimantResponseType.ACCEPTATION,
                formaliseOption: formaliseOption_1.FormaliseOption.REFER_TO_JUDGE
            };
            claim.respondedAt = momentFactory_1.MomentFactory.currentDateTime().subtract(5, 'days');
            chai_1.expect(claim.status).to.be.equal(claimStatus_1.ClaimStatus.REDETERMINATION_BY_JUDGE);
        });
        it('should return CLAIMANT_ACCEPTED_COURT_PLAN_SETTLEMENT when a claimant has signed a settlement agreement', () => {
            claim.claimantResponse = {
                type: claimantResponseType_1.ClaimantResponseType.ACCEPTATION,
                formaliseOption: formaliseOption_1.FormaliseOption.SETTLEMENT,
                courtDetermination: {
                    decisionType: decisionType_1.DecisionType.CLAIMANT,
                    courtDecision: {
                        paymentDate: momentFactory_1.MomentFactory.currentDate().add('1 year'),
                        paymentOption: paymentOption_1.PaymentOption.BY_SPECIFIED_DATE
                    },
                    disposableIncome: 0,
                    courtPaymentIntention: {
                        paymentDate: momentFactory_1.MomentFactory.currentDate().add('6 months'),
                        paymentOption: paymentOption_1.PaymentOption.BY_SPECIFIED_DATE
                    }
                },
                claimantPaymentIntention: {
                    paymentDate: momentFactory_1.MomentFactory.currentDate().add('1 year'),
                    paymentOption: paymentOption_1.PaymentOption.BY_SPECIFIED_DATE
                }
            };
            const paymentIntention = {
                paymentOption: paymentOption_1.PaymentOption.BY_SPECIFIED_DATE,
                paymentDate: momentFactory_1.MomentFactory.currentDate()
            };
            claim.settlement = prepareSettlement(paymentIntention_1.PaymentIntention.deserialize(paymentIntention), madeBy_1.MadeBy.CLAIMANT);
            claim.respondedAt = momentFactory_1.MomentFactory.currentDateTime();
            chai_1.expect(claim.status).to.be.equal(claimStatus_1.ClaimStatus.CLAIMANT_ACCEPTED_COURT_PLAN_SETTLEMENT);
        });
        it('should return CLAIMANT_ACCEPTED_ADMISSION_AND_DEFENDANT_NOT_SIGNED when a claimant has signed a settlement agreement but defendant has not', () => {
            const paymentIntention = {
                paymentOption: paymentOption_1.PaymentOption.BY_SPECIFIED_DATE,
                paymentDate: momentFactory_1.MomentFactory.currentDate()
            };
            claim.settlement = prepareSettlement(paymentIntention_1.PaymentIntention.deserialize(paymentIntention), madeBy_1.MadeBy.DEFENDANT);
            claim.respondedAt = momentFactory_1.MomentFactory.currentDateTime().subtract(2, 'months');
            claim.claimantRespondedAt = momentFactory_1.MomentFactory.currentDate().subtract('8', 'days');
            chai_1.expect(claim.status).to.be.equal(claimStatus_1.ClaimStatus.CLAIMANT_ACCEPTED_ADMISSION_AND_DEFENDANT_NOT_SIGNED);
        });
        it('should return ELIGIBLE_FOR_CCJ_AFTER_BREACHED_SETTLEMENT after date of payment', () => {
            const paymentIntention = {
                paymentOption: paymentOption_1.PaymentOption.BY_SPECIFIED_DATE,
                paymentDate: momentFactory_1.MomentFactory.currentDate().subtract(1, 'days')
            };
            claim.settlement = prepareSettlementWithCounterSignatureWithDatePassed(paymentIntention_1.PaymentIntention.deserialize(paymentIntention), madeBy_1.MadeBy.DEFENDANT);
            claim.settlementReachedAt = momentFactory_1.MomentFactory.currentDate().subtract(1, 'month');
            claim.response = {
                responseType: responseType_1.ResponseType.FULL_ADMISSION,
                paymentIntention: paymentIntention,
                defendant: new individual_1.Individual().deserialize(party_1.individual)
            };
            chai_1.expect(claim.stateHistory.map(state => state.status)).includes(claimStatus_1.ClaimStatus.ELIGIBLE_FOR_CCJ_AFTER_BREACHED_SETTLEMENT);
        });
        it('should return CLAIMANT_ALTERNATIVE_PLAN_WITH_CCJ when there is a CCJ and a claimant response with a court decision', () => {
            const paymentIntention = {
                paymentOption: paymentOption_1.PaymentOption.BY_SPECIFIED_DATE,
                paymentDate: momentFactory_1.MomentFactory.currentDate().subtract(1, 'days')
            };
            claim.response = {
                responseType: responseType_1.ResponseType.FULL_ADMISSION,
                paymentIntention: paymentIntention,
                defendant: new individual_1.Individual().deserialize(party_1.individual)
            };
            claim.claimantResponse = claimantResponseData_1.baseDeterminationAcceptationClaimantResponseData;
            claim.claimantRespondedAt = momentFactory_1.MomentFactory.currentDate();
            claim.countyCourtJudgmentRequestedAt = momentFactory_1.MomentFactory.currentDate();
            chai_1.expect(claim.status).to.be.equal(claimStatus_1.ClaimStatus.CLAIMANT_ALTERNATIVE_PLAN_WITH_CCJ);
        });
        it('should return CLAIMANT_REQUESTS_CCJ_AFTER_DEFENDANT_REJECTS_SETTLEMENT when there is a CCJ after the defendant rejected the settlement agreement', () => {
            const paymentIntention = {
                paymentOption: paymentOption_1.PaymentOption.BY_SPECIFIED_DATE,
                paymentDate: momentFactory_1.MomentFactory.currentDate().subtract(1, 'days')
            };
            claim.response = {
                responseType: responseType_1.ResponseType.FULL_ADMISSION,
                paymentIntention: paymentIntention,
                defendant: new individual_1.Individual().deserialize(party_1.individual)
            };
            claim.claimantResponse = claimantResponseData_1.baseDeterminationAcceptationClaimantResponseData;
            claim.claimantResponse.formaliseOption = formaliseOption_1.FormaliseOption.SETTLEMENT;
            claim.claimantRespondedAt = momentFactory_1.MomentFactory.currentDate();
            claim.countyCourtJudgmentRequestedAt = momentFactory_1.MomentFactory.currentDate();
            claim.settlement = prepareSettlementWithDefendantRejection(paymentIntention_1.PaymentIntention.deserialize(paymentIntention), madeBy_1.MadeBy.DEFENDANT);
            claim.settlementReachedAt = data.defendantRejectsSettlementPartyStatements().settlementReachedAt;
            chai_1.expect(claim.status).to.be.equal(claimStatus_1.ClaimStatus.CLAIMANT_REQUESTS_CCJ_AFTER_DEFENDANT_REJECTS_SETTLEMENT);
        });
        it('should return REDETERMINATION_BY_JUDGE when there is a CCJ and a redetermination requested at', () => {
            const paymentIntention = {
                paymentOption: paymentOption_1.PaymentOption.BY_SPECIFIED_DATE,
                paymentDate: momentFactory_1.MomentFactory.currentDate().subtract(1, 'days')
            };
            claim.response = {
                responseType: responseType_1.ResponseType.FULL_ADMISSION,
                paymentIntention: paymentIntention,
                defendant: new individual_1.Individual().deserialize(party_1.individual)
            };
            claim.claimantResponse = claimantResponseData_1.baseDeterminationAcceptationClaimantResponseData;
            claim.claimantRespondedAt = momentFactory_1.MomentFactory.currentDate();
            claim.countyCourtJudgmentRequestedAt = momentFactory_1.MomentFactory.currentDate();
            claim.reDeterminationRequestedAt = momentFactory_1.MomentFactory.currentDate();
            chai_1.expect(claim.status).to.be.equal(claimStatus_1.ClaimStatus.REDETERMINATION_BY_JUDGE);
        });
        it('should return CLAIMANT_REJECTED_PART_ADMISSION when the claimant rejects the part admission', () => {
            claim.claimantResponse = claimantResponseData_1.rejectionClaimantResponseData;
            claim.claimantRespondedAt = momentFactory_1.MomentFactory.currentDate();
            claim.claimData = {
                defendant: new individual_1.Individual().deserialize(party_1.individual)
            };
            claim.response = {
                responseType: responseType_1.ResponseType.PART_ADMISSION
            };
            chai_1.expect(claim.status).to.be.equal(claimStatus_1.ClaimStatus.CLAIMANT_REJECTED_PART_ADMISSION);
        });
        it('should return CLAIMANT_REJECTED_PART_ADMISSION_DQ when the claimant rejects the part admission with DQs', () => {
            claim.claimantResponse = claimantResponseData_1.rejectionClaimantResponseData;
            claim.claimantRespondedAt = momentFactory_1.MomentFactory.currentDate();
            claim.claimData = {
                defendant: new individual_1.Individual().deserialize(party_1.individual)
            };
            claim.response = {
                responseType: responseType_1.ResponseType.PART_ADMISSION
            };
            claim.features = ['admissions', 'directionsQuestionnaire'];
            chai_1.expect(claim.status).to.be.equal(claimStatus_1.ClaimStatus.CLAIMANT_REJECTED_PART_ADMISSION_DQ);
        });
        it('should return CCJ_AFTER_SETTLEMENT_BREACHED when the claimant requests a CCJ after settlement terms broken', () => {
            const paymentIntention = {
                paymentOption: paymentOption_1.PaymentOption.BY_SPECIFIED_DATE,
                paymentDate: momentFactory_1.MomentFactory.currentDate().subtract(1, 'days')
            };
            claim.settlement = prepareSettlementWithCounterSignature(paymentIntention_1.PaymentIntention.deserialize(paymentIntention), madeBy_1.MadeBy.DEFENDANT);
            claim.settlementReachedAt = momentFactory_1.MomentFactory.currentDate().subtract(1, 'month');
            claim.response = {
                responseType: responseType_1.ResponseType.FULL_ADMISSION,
                paymentIntention: paymentIntention,
                defendant: new individual_1.Individual().deserialize(party_1.individual)
            };
            claim.claimantResponse = claimantResponseData_1.baseAcceptationClaimantResponseData;
            claim.countyCourtJudgmentRequestedAt = momentFactory_1.MomentFactory.currentDate();
            chai_1.expect(claim.status).to.be.equal(claimStatus_1.ClaimStatus.CCJ_AFTER_SETTLEMENT_BREACHED);
            chai_1.expect(claim.isSettlementPaymentDateValid()).to.be.false;
        });
        it('should return CCJ_BY_DETERMINATION_AFTER_SETTLEMENT_BREACHED when the claimant requests a CCJ after settlement terms broken', () => {
            const paymentIntention = {
                paymentOption: paymentOption_1.PaymentOption.BY_SPECIFIED_DATE,
                paymentDate: momentFactory_1.MomentFactory.currentDate().subtract(1, 'days')
            };
            claim.settlement = prepareSettlementWithCounterSignature(paymentIntention_1.PaymentIntention.deserialize(paymentIntention), madeBy_1.MadeBy.DEFENDANT);
            claim.settlementReachedAt = momentFactory_1.MomentFactory.currentDate().subtract(1, 'month');
            claim.response = {
                responseType: responseType_1.ResponseType.FULL_ADMISSION,
                paymentIntention: paymentIntention,
                defendant: new individual_1.Individual().deserialize(party_1.individual)
            };
            claim.claimantResponse = claimantResponseData_1.baseDeterminationAcceptationClaimantResponseData;
            claim.countyCourtJudgmentRequestedAt = momentFactory_1.MomentFactory.currentDate();
            chai_1.expect(claim.status).to.be.equal(claimStatus_1.ClaimStatus.CCJ_BY_DETERMINATION_AFTER_SETTLEMENT_BREACHED);
            chai_1.expect(claim.isSettlementPaymentDateValid()).to.be.false;
        });
        it('should return true when settlement payment date is in the future for a CCJ after settlement terms broken', () => {
            const paymentIntention = {
                paymentOption: paymentOption_1.PaymentOption.BY_SPECIFIED_DATE,
                paymentDate: momentFactory_1.MomentFactory.currentDate().add(1, 'days')
            };
            claim.settlement = prepareSettlementWithCounterSignature(paymentIntention_1.PaymentIntention.deserialize(paymentIntention), madeBy_1.MadeBy.DEFENDANT);
            claim.settlementReachedAt = momentFactory_1.MomentFactory.currentDate().subtract(1, 'month');
            claim.response = {
                responseType: responseType_1.ResponseType.FULL_ADMISSION,
                paymentIntention: paymentIntention,
                defendant: new individual_1.Individual().deserialize(party_1.individual)
            };
            claim.claimantResponse = claimantResponseData_1.baseDeterminationAcceptationClaimantResponseData;
            claim.countyCourtJudgmentRequestedAt = momentFactory_1.MomentFactory.currentDate();
            chai_1.expect(claim.isSettlementPaymentDateValid()).to.be.true;
        });
        it('should return true when settlement payment option is pay immediately for a CCJ after settlement terms broken', () => {
            const paymentIntention = {
                paymentOption: paymentOption_1.PaymentOption.IMMEDIATELY,
                paymentDate: momentFactory_1.MomentFactory.currentDate().add(5, 'days')
            };
            const defendantPaymentIntention = {
                paymentOption: paymentOption_1.PaymentOption.BY_SPECIFIED_DATE,
                paymentDate: momentFactory_1.MomentFactory.currentDate().add(1, 'days')
            };
            claim.settlement = prepareSettlementWithCounterSignature(paymentIntention_1.PaymentIntention.deserialize(paymentIntention), madeBy_1.MadeBy.DEFENDANT);
            claim.settlementReachedAt = momentFactory_1.MomentFactory.currentDate().subtract(1, 'month');
            claim.response = {
                responseType: responseType_1.ResponseType.FULL_ADMISSION,
                paymentIntention: defendantPaymentIntention,
                defendant: new individual_1.Individual().deserialize(party_1.individual)
            };
            claim.claimantResponse = claimantResponseData_1.baseDeterminationAcceptationClaimantResponseData;
            claim.countyCourtJudgmentRequestedAt = momentFactory_1.MomentFactory.currentDate();
            chai_1.expect(claim.isSettlementPaymentDateValid()).to.be.true;
        });
        it('should return true when settlement payment option is pay by instalments starting in future for a CCJ after settlement terms broken', () => {
            const paymentIntention = {
                paymentOption: paymentOption_1.PaymentOption.INSTALMENTS,
                repaymentPlan: {
                    instalmentAmount: 100,
                    firstPaymentDate: momentFactory_1.MomentFactory.currentDate().add(1, 'day'),
                    paymentSchedule: paymentSchedule_1.PaymentSchedule.EACH_WEEK,
                    completionDate: '2051-12-31',
                    paymentLength: '1'
                }
            };
            const defendantPaymentIntention = {
                paymentOption: paymentOption_1.PaymentOption.BY_SPECIFIED_DATE,
                paymentDate: momentFactory_1.MomentFactory.currentDate().add(1, 'days')
            };
            claim.settlement = prepareSettlementWithCounterSignature(paymentIntention_1.PaymentIntention.deserialize(paymentIntention), madeBy_1.MadeBy.DEFENDANT);
            claim.settlementReachedAt = momentFactory_1.MomentFactory.currentDate().subtract(1, 'month');
            claim.response = {
                responseType: responseType_1.ResponseType.FULL_ADMISSION,
                paymentIntention: defendantPaymentIntention,
                defendant: new individual_1.Individual().deserialize(party_1.individual)
            };
            claim.claimantResponse = claimantResponseData_1.baseDeterminationAcceptationClaimantResponseData;
            claim.countyCourtJudgmentRequestedAt = momentFactory_1.MomentFactory.currentDate();
            chai_1.expect(claim.isSettlementPaymentDateValid()).to.be.true;
        });
        it('should return false when settlement does not exists', () => {
            const paymentIntention = {
                paymentOption: paymentOption_1.PaymentOption.IMMEDIATELY,
                paymentDate: momentFactory_1.MomentFactory.currentDate().add(5, 'days')
            };
            claim.response = {
                responseType: responseType_1.ResponseType.FULL_ADMISSION,
                paymentIntention: paymentIntention,
                defendant: new individual_1.Individual().deserialize(party_1.individual)
            };
            claim.claimantResponse = claimantResponseData_1.baseDeterminationAcceptationClaimantResponseData;
            claim.countyCourtJudgmentRequestedAt = momentFactory_1.MomentFactory.currentDate();
            chai_1.expect(claim.isSettlementPaymentDateValid()).to.be.false;
        });
        it('should return false when settlement does not exists', () => {
            const paymentIntention = {
                paymentOption: paymentOption_1.PaymentOption.IMMEDIATELY,
                paymentDate: momentFactory_1.MomentFactory.currentDate().add(5, 'days')
            };
            claim.response = {
                responseType: responseType_1.ResponseType.FULL_ADMISSION,
                paymentIntention: paymentIntention,
                defendant: new individual_1.Individual().deserialize(party_1.individual)
            };
            claim.claimantResponse = claimantResponseData_1.baseDeterminationAcceptationClaimantResponseData;
            claim.countyCourtJudgmentRequestedAt = momentFactory_1.MomentFactory.currentDate();
            chai_1.expect(claim.isSettlementPaymentDateValid()).to.be.false;
        });
        it('should return PART_ADMIT_PAY_IMMEDIATELY when the claimant accepts a part admit with immediately as the payment option', () => {
            const paymentIntention = {
                paymentOption: paymentOption_1.PaymentOption.IMMEDIATELY,
                paymentDate: momentFactory_1.MomentFactory.currentDate().add(5, 'days')
            };
            claim.response = {
                responseType: responseType_1.ResponseType.PART_ADMISSION,
                paymentIntention: paymentIntention,
                defendant: new individual_1.Individual().deserialize(party_1.individual)
            };
            claim.claimantResponse = {
                type: claimantResponseType_1.ClaimantResponseType.ACCEPTATION
            };
            chai_1.expect(claim.status).to.be.equal(claimStatus_1.ClaimStatus.PART_ADMIT_PAY_IMMEDIATELY);
        });
        it('should contain the claim status CLAIMANT_ACCEPTED_STATES_PAID only when part admission states paid is accepted', () => {
            claim.respondedAt = moment();
            claim.response = {
                paymentIntention: null,
                responseType: 'PART_ADMISSION',
                freeMediation: 'no',
                paymentDeclaration: {
                    paidDate: '2010-12-31',
                    explanation: 'Paid by cash'
                }
            };
            claim.claimantResponse = claimantResponseData_1.partAdmissionStatesPaidClaimantResponseData;
            chai_1.expect(claim.stateHistory).to.have.lengthOf(1);
            chai_1.expect(claim.stateHistory[0].status).to.equal(claimStatus_1.ClaimStatus.CLAIMANT_ACCEPTED_STATES_PAID);
        });
        if (featureToggles_1.FeatureToggles.isEnabled('directionsQuestionnaire')) {
            it('should contain the claim status DEFENDANT_REJECTS_WITH_DQS only when defendant reject with DQs', () => {
                claim.respondedAt = moment();
                claim.features = ['admissions', 'directionsQuestionnaire'];
                claim.response = {
                    paymentIntention: null,
                    responseType: 'FULL_DEFENCE',
                    freeMediation: 'no'
                };
                chai_1.expect(claim.stateHistory).to.have.lengthOf(2);
                chai_1.expect(claim.stateHistory[0].status).to.equal(claimStatus_1.ClaimStatus.DEFENDANT_REJECTS_WITH_DQS);
            });
            it('should contain the claim status ORDER_DRAWN only when the legal advisor has drawn the order', () => {
                claim.respondedAt = moment();
                claim.features = ['admissions', 'directionsQuestionnaire'];
                claim.response = {
                    paymentIntention: null,
                    responseType: 'FULL_DEFENCE',
                    freeMediation: 'no'
                };
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
                    hearingCourtName: 'Clerkenwell and Shoreditch County Court and Family Court',
                    hearingCourtAddress: {
                        line1: 'The Gee Street Courthouse',
                        line2: '29-41 Gee Street',
                        city: 'London',
                        postcode: 'EC1V 3RE'
                    },
                    estimatedHearingDuration: 'HALF_HOUR',
                    createdOn: momentFactory_1.MomentFactory.currentDate().subtract(1, 'day')
                };
                chai_1.expect(claim.stateHistory).to.have.lengthOf(2);
                chai_1.expect(claim.stateHistory[0].status).to.equal(claimStatus_1.ClaimStatus.ORDER_DRAWN);
            });
        }
        context('should return CLAIMANT_REJECTED_STATES_PAID', () => {
            it('when defendant states paid amount equal to claim amount', () => {
                claim.totalAmountTillToday = 100;
                claim.response = {
                    responseType: 'FULL_DEFENCE',
                    defenceType: 'ALREADY_PAID',
                    paymentDeclaration: {
                        paidDate: '2010-12-31',
                        explanation: 'Paid by cash',
                        paidAmount: 100
                    }
                };
                claim.claimantResponse = {
                    type: 'REJECTION'
                };
                chai_1.expect(claim.status).to.be.equal(claimStatus_1.ClaimStatus.CLAIMANT_REJECTED_STATES_PAID);
            });
            it('when defendant states paid amount greater than claim amount', () => {
                claim.totalAmountTillToday = 100;
                claim.response = {
                    responseType: 'FULL_DEFENCE',
                    defenceType: 'ALREADY_PAID',
                    paymentDeclaration: {
                        paidDate: '2010-12-31',
                        explanation: 'Paid by cash',
                        paidAmount: 200
                    }
                };
                claim.claimantResponse = {
                    type: 'REJECTION'
                };
                chai_1.expect(claim.status).to.be.equal(claimStatus_1.ClaimStatus.CLAIMANT_REJECTED_STATES_PAID);
            });
            it('when defendant states paid amount less than claim amount', () => {
                claim.totalAmountTillToday = 100;
                claim.response = {
                    amount: 90,
                    responseType: 'PART_ADMISSION',
                    defenceType: 'ALREADY_PAID',
                    paymentDeclaration: {
                        paidDate: '2010-12-31',
                        explanation: 'Paid by cash'
                    }
                };
                claim.claimantResponse = {
                    type: 'REJECTION'
                };
                chai_1.expect(claim.status).to.be.equal(claimStatus_1.ClaimStatus.CLAIMANT_REJECTED_STATES_PAID);
            });
            it('when claimant rejects defendants defence', () => {
                claim.totalAmountTillToday = 100;
                claim.response = {
                    responseType: responseType_1.ResponseType.FULL_DEFENCE,
                    defenceType: defenceType_1.DefenceType.DISPUTE,
                    defence: 'defence reasoning',
                    freeMediation: freeMediation_1.FreeMediationOption.NO,
                    defendant: new individual_1.Individual().deserialize(party_1.individual)
                };
                claim.claimantResponse = {
                    type: 'REJECTION'
                };
                chai_1.expect(claim.status).to.be.equal(claimStatus_1.ClaimStatus.CLAIMANT_REJECTED_DEFENDANT_DEFENCE_NO_DQ);
            });
            it('when claimant accepts defendants defence', () => {
                claim.totalAmountTillToday = 100;
                claim.response = {
                    responseType: responseType_1.ResponseType.FULL_DEFENCE,
                    defenceType: defenceType_1.DefenceType.DISPUTE,
                    defence: 'defence reasoning',
                    freeMediation: freeMediation_1.FreeMediationOption.NO,
                    defendant: new individual_1.Individual().deserialize(party_1.individual)
                };
                claim.claimantResponse = {
                    type: 'ACCEPTATION'
                };
                chai_1.expect(claim.status).to.be.equal(claimStatus_1.ClaimStatus.CLAIMANT_ACCEPTED_DEFENDANT_DEFENCE);
            });
        });
    });
    describe('respondToResponseDeadline', () => {
        it('should add 33 days to the response deadline', () => {
            const claim = new claim_1.Claim();
            claim.respondedAt = moment();
            chai_1.expect(claim.respondToResponseDeadline.toISOString()).to.equal(claim.respondedAt.add(33, 'days').toISOString());
        });
        it('should return undefined if claim is not responded to', () => {
            const claim = new claim_1.Claim();
            chai_1.expect(claim.respondToResponseDeadline).to.equal(undefined);
        });
    });
    describe('respondToMediationDeadline', () => {
        it('should return mediation deadline date', () => {
            const claim = new claim_1.Claim();
            claim.respondedAt = moment();
            claimStoreMock.mockNextWorkingDay(momentFactory_1.MomentFactory.parse('2019-06-28'));
            claim.respondToMediationDeadline().then(res => chai_1.expect(res.format('YYYY-MM-DD'))
                .to.equal(momentFactory_1.MomentFactory.parse('2019-06-28').format('YYYY-MM-DD')));
        });
        it('should return undefined if claim is not responded to', async () => {
            const claim = new claim_1.Claim();
            const mediationDeadline = await claim.respondToMediationDeadline();
            chai_1.expect(mediationDeadline).to.be.undefined;
        });
    });
    describe('isEligibleForReDetermination', () => {
        it('should be eligible', () => {
            const claim = new claim_1.Claim();
            claim.countyCourtJudgment = {
                paymentOption: paymentOption_1.PaymentOption.IMMEDIATELY,
                ccjType: countyCourtJudgmentType_1.CountyCourtJudgmentType.DETERMINATION
            };
            claim.countyCourtJudgmentRequestedAt = momentFactory_1.MomentFactory.currentDateTime().subtract(18, 'days');
            chai_1.expect(claim.isEligibleForReDetermination()).to.be.true;
        });
        it('should not be eligible when ccj requested date is 20 days before', () => {
            const claim = new claim_1.Claim();
            claim.countyCourtJudgment = {
                paymentOption: paymentOption_1.PaymentOption.IMMEDIATELY,
                ccjType: countyCourtJudgmentType_1.CountyCourtJudgmentType.DETERMINATION
            };
            claim.countyCourtJudgmentRequestedAt = momentFactory_1.MomentFactory.currentDateTime().subtract(20, 'days');
            chai_1.expect(claim.isEligibleForReDetermination()).to.be.false;
        });
        it('should not be eligible when reDetermination already requested', () => {
            const claim = new claim_1.Claim();
            claim.countyCourtJudgment = {
                paymentOption: paymentOption_1.PaymentOption.IMMEDIATELY,
                ccjType: countyCourtJudgmentType_1.CountyCourtJudgmentType.DETERMINATION
            };
            claim.countyCourtJudgmentRequestedAt = momentFactory_1.MomentFactory.currentDateTime().subtract(20, 'days');
            claim.reDeterminationRequestedAt = momentFactory_1.MomentFactory.currentDateTime();
            chai_1.expect(claim.isEligibleForReDetermination()).to.be.false;
        });
        it('should not be eligible when ccjType is Admissions', () => {
            const claim = new claim_1.Claim();
            claim.countyCourtJudgment = {
                paymentOption: paymentOption_1.PaymentOption.IMMEDIATELY,
                ccjType: countyCourtJudgmentType_1.CountyCourtJudgmentType.ADMISSIONS
            };
            claim.countyCourtJudgmentRequestedAt = momentFactory_1.MomentFactory.currentDateTime().subtract(20, 'days');
            claim.reDeterminationRequestedAt = momentFactory_1.MomentFactory.currentDateTime();
            chai_1.expect(claim.isEligibleForReDetermination()).to.be.false;
        });
        it('should not be eligible when ccjType is Default', () => {
            const claim = new claim_1.Claim();
            claim.countyCourtJudgment = {
                paymentOption: paymentOption_1.PaymentOption.IMMEDIATELY,
                ccjType: countyCourtJudgmentType_1.CountyCourtJudgmentType.DEFAULT
            };
            claim.countyCourtJudgmentRequestedAt = momentFactory_1.MomentFactory.currentDateTime().subtract(20, 'days');
            claim.reDeterminationRequestedAt = momentFactory_1.MomentFactory.currentDateTime();
            chai_1.expect(claim.isEligibleForReDetermination()).to.be.false;
        });
    });
    describe('mediationOutcome', () => {
        let claim;
        beforeEach(() => {
            claim = new claim_1.Claim().deserialize(claimData_2.defenceClaimData());
            claim.responseDeadline = momentFactory_1.MomentFactory.currentDate().add(1, 'day');
            claim.intentionToProceedDeadline = momentFactory_1.MomentFactory.currentDateTime().add(33, 'days');
            claim.response = fullDefenceResponse_1.FullDefenceResponse.deserialize(responseData_1.defenceWithDisputeData);
        });
        it('should return FAILED when mediation is failed', () => {
            claim.mediationOutcome = mediationOutcome_1.MediationOutcome.FAILED;
            chai_1.expect(claim.mediationOutcome).to.be.equal('FAILED');
        });
        it('should return SUCCEEDED when mediation is success', () => {
            claim.mediationOutcome = mediationOutcome_1.MediationOutcome.SUCCEEDED;
            chai_1.expect(claim.mediationOutcome).to.be.equal('SUCCEEDED');
        });
    });
    describe('stateHistory', () => {
        let claim;
        beforeEach(() => {
            claim = new claim_1.Claim();
            claim.responseDeadline = momentFactory_1.MomentFactory.currentDate().add(1, 'day');
            claim.intentionToProceedDeadline = momentFactory_1.MomentFactory.currentDateTime().add(33, 'days');
        });
        it('should return OFFER_SUBMITTED, RESPONSE_SUBMITTED and PAID_IN_FULL_LINK_ELIGIBLE if an offer has been submitted.', () => {
            claim.settlement = prepareSettlementOfferByDefendant();
            claim.response = {
                responseType: responseType_1.ResponseType.FULL_DEFENCE,
                defenceType: defenceType_1.DefenceType.DISPUTE,
                defence: 'defence reasoning',
                freeMediation: freeMediation_1.FreeMediationOption.YES,
                defendant: new individual_1.Individual().deserialize(party_1.individual)
            };
            chai_1.expect(claim.stateHistory).to.have.lengthOf(3);
            chai_1.expect(claim.stateHistory[0].status).to.equal(claimStatus_1.ClaimStatus.RESPONSE_SUBMITTED);
            chai_1.expect(claim.stateHistory[1].status).to.equal(claimStatus_1.ClaimStatus.OFFER_SUBMITTED);
            chai_1.expect(claim.stateHistory[2].status).to.equal(claimStatus_1.ClaimStatus.PAID_IN_FULL_LINK_ELIGIBLE);
        });
        it('should return OFFER_REJECTED when offer is rejected', () => {
            claim.response = fullDefenceResponse_1.FullDefenceResponse.deserialize(responseData_1.defenceWithDisputeData);
            claim.settlement = new settlement_1.Settlement().deserialize({
                partyStatements: [offer_2.offer, offer_2.offerRejection]
            });
            chai_1.expect(claim.stateHistory).to.have.lengthOf(3);
            chai_1.expect(claim.stateHistory[0].status).to.equal(claimStatus_1.ClaimStatus.RESPONSE_SUBMITTED);
            chai_1.expect(claim.stateHistory[1].status).to.equal(claimStatus_1.ClaimStatus.OFFER_REJECTED);
            chai_1.expect(claim.stateHistory[2].status).to.equal(claimStatus_1.ClaimStatus.PAID_IN_FULL_LINK_ELIGIBLE);
        });
        it('should return true when offer is rejected', () => {
            claim.response = fullDefenceResponse_1.FullDefenceResponse.deserialize(responseData_1.defenceWithDisputeData);
            claim.settlement = new settlement_1.Settlement().deserialize({
                partyStatements: [offer_2.offer, offer_2.offerRejection]
            });
            chai_1.expect(claim.isSettlementRejectedOrBreached()).to.be.true;
        });
        it('should contain the claim status only if not responded to', () => {
            chai_1.expect(claim.stateHistory).to.have.lengthOf(2);
            chai_1.expect(claim.stateHistory[0].status).to.equal(claimStatus_1.ClaimStatus.NO_RESPONSE);
            chai_1.expect(claim.stateHistory[1].status).to.equal(claimStatus_1.ClaimStatus.PAID_IN_FULL_LINK_ELIGIBLE);
        });
        it('should contain the claim status only if response submitted but no offer made', () => {
            claim.respondedAt = moment();
            claim.response = { responseType: responseType_1.ResponseType.FULL_DEFENCE };
            chai_1.expect(claim.stateHistory).to.have.lengthOf(2);
            chai_1.expect(claim.stateHistory[0].status).to.equal(claimStatus_1.ClaimStatus.RESPONSE_SUBMITTED);
            chai_1.expect(claim.stateHistory[1].status).to.equal(claimStatus_1.ClaimStatus.PAID_IN_FULL_LINK_ELIGIBLE);
        });
        it('should contain the claim status only if claimant rejects organisation response', () => {
            claim.respondedAt = moment();
            claim.response = {
                paymentIntention: {
                    paymentDate: momentFactory_1.MomentFactory.currentDate().add(60, 'days'),
                    paymentOption: 'BY_SPECIFIED_DATE'
                }
            };
            claim.claimData = {
                defendant: new organisation_1.Organisation().deserialize(party_1.organisation)
            };
            claim.claimData = new claimData_1.ClaimData().deserialize({
                defendants: new Array(new theirDetails_1.TheirDetails().deserialize({
                    type: 'organisation',
                    name: undefined,
                    address: undefined,
                    email: undefined
                }))
            });
            claim.claimantResponse = claimantResponseData_1.rejectionClaimantResponseData;
            chai_1.expect(claim.stateHistory).to.have.lengthOf(1);
            chai_1.expect(claim.stateHistory[0].status).to.equal(claimStatus_1.ClaimStatus.CLAIMANT_REJECTED_DEFENDANT_AS_BUSINESS_RESPONSE);
        });
        it('should contain the claim status only if claimant rejects company response', () => {
            claim.respondedAt = moment();
            claim.response = {
                paymentIntention: {
                    paymentDate: momentFactory_1.MomentFactory.currentDate().add(60, 'days'),
                    paymentOption: 'BY_SPECIFIED_DATE'
                }
            };
            claim.claimantResponse = claimantResponseData_1.rejectionClaimantResponseData;
            claim.claimData = new claimData_1.ClaimData().deserialize({
                defendants: new Array(new theirDetails_1.TheirDetails().deserialize({
                    type: 'organisation',
                    name: undefined,
                    address: undefined,
                    email: undefined
                }))
            });
            claim.claimData = {
                defendant: new company_1.Company().deserialize(party_1.organisation)
            };
            chai_1.expect(claim.stateHistory).to.have.lengthOf(1);
            chai_1.expect(claim.stateHistory[0].status).to.equal(claimStatus_1.ClaimStatus.CLAIMANT_REJECTED_DEFENDANT_AS_BUSINESS_RESPONSE);
        });
        it('should contain settlement reached status only when response submitted and offers exchanged', () => {
            claim.respondedAt = moment();
            claim.response = { responseType: responseType_1.ResponseType.FULL_DEFENCE };
            claim.settlement = prepareSettlementOfferByDefendantAndAcceptedByClaimant();
            claim.settlementReachedAt = moment();
            chai_1.expect(claim.stateHistory).to.have.lengthOf(1);
            chai_1.expect(claim.stateHistory[0].status).to.equal(claimStatus_1.ClaimStatus.OFFER_SETTLEMENT_REACHED);
        });
        if (featureToggles_1.FeatureToggles.isEnabled('mediation')) {
            it('should contain CLAIMANT_REJECTED_DEFENDANT_DEFENCE status when claimant has reject defence and DQs is enabled', () => {
                claim.respondedAt = moment();
                claim.features = ['admissions', 'directionsQuestionnaire'];
                claim.response = {
                    responseType: responseType_1.ResponseType.FULL_DEFENCE,
                    defenceType: defenceType_1.DefenceType.DISPUTE
                };
                claim.claimantResponse = {
                    type: claimantResponseType_1.ClaimantResponseType.REJECTION
                };
                chai_1.expect(claim.stateHistory).to.have.lengthOf(2);
                chai_1.expect(claim.stateHistory[0].status).to.equal(claimStatus_1.ClaimStatus.CLAIMANT_REJECTED_DEFENDANT_DEFENCE);
                chai_1.expect(claim.stateHistory[1].status).to.equal(claimStatus_1.ClaimStatus.PAID_IN_FULL_LINK_ELIGIBLE);
            });
        }
        it('should contain CLAIMANT_REJECTED_DEFENDANT_DEFENCE_NO_DQ status when claimant has reject defence and DQs is not enabled', () => {
            claim.respondedAt = moment();
            claim.response = {
                responseType: responseType_1.ResponseType.FULL_DEFENCE,
                defenceType: defenceType_1.DefenceType.DISPUTE
            };
            claim.claimantResponse = {
                type: claimantResponseType_1.ClaimantResponseType.REJECTION
            };
            chai_1.expect(claim.stateHistory).to.have.lengthOf(2);
            chai_1.expect(claim.stateHistory[0].status).to.equal(claimStatus_1.ClaimStatus.CLAIMANT_REJECTED_DEFENDANT_DEFENCE_NO_DQ);
            chai_1.expect(claim.stateHistory[1].status).to.equal(claimStatus_1.ClaimStatus.PAID_IN_FULL_LINK_ELIGIBLE);
        });
    });
    describe('paidInFullCCJPaidWithinMonth', () => {
        let claim;
        beforeEach(() => {
            claim = new claim_1.Claim();
            claim.moneyReceivedOn = momentFactory_1.MomentFactory.currentDate();
        });
        it('should return true when CCJ is paid within month of countyCourtJudgmentRequestedAt', () => {
            claim.countyCourtJudgmentRequestedAt = momentFactory_1.MomentFactory.currentDate().add(1, 'month');
            chai_1.expect(claim.isCCJPaidWithinMonth()).to.be.true;
        });
        it('should return false when CCJ is paid 2 months after countyCourtJudgmentRequestedAt', () => {
            claim.moneyReceivedOn = momentFactory_1.MomentFactory.currentDate().add(2, 'month');
            claim.countyCourtJudgmentRequestedAt = momentFactory_1.MomentFactory.currentDate();
            chai_1.expect(claim.isCCJPaidWithinMonth()).to.be.false;
        });
    });
    describe('isIntentionToProceedEligible', () => {
        let claim;
        beforeEach(() => {
            claim = new claim_1.Claim();
        });
        it('should return true when createdAt is after 09/09/19 3:12', () => {
            claim.createdAt = momentFactory_1.MomentFactory.currentDate();
            chai_1.expect(claim.isIntentionToProceedEligible()).to.be.true;
        });
        it('should return false when createdAt is before 09/09/19 3:12', () => {
            claim.createdAt = momentFactory_1.MomentFactory.parse('2019-09-08');
            chai_1.expect(claim.isIntentionToProceedEligible()).to.be.false;
        });
    });
});
function prepareSettlement(paymentIntention, party) {
    const settlement = {
        partyStatements: [
            {
                type: statementType_1.StatementType.OFFER.value,
                madeBy: party.value,
                offer: {
                    content: 'My offer contents here.',
                    completionDate: '2020-10-10',
                    paymentIntention: paymentIntention
                }
            },
            {
                madeBy: madeBy_1.MadeBy.CLAIMANT.value,
                type: statementType_1.StatementType.ACCEPTATION.value
            }
        ]
    };
    return new settlement_1.Settlement().deserialize(settlement);
}
function prepareSettlementOfferByDefendant() {
    const settlement = {
        partyStatements: [
            {
                type: statementType_1.StatementType.OFFER.value,
                madeBy: madeBy_1.MadeBy.DEFENDANT,
                offer: {
                    content: 'My offer contents here.',
                    completionDate: '2020-10-10'
                }
            }
        ]
    };
    return new settlement_1.Settlement().deserialize(settlement);
}
function prepareSettlementOfferByDefendantAndAcceptedByClaimant() {
    const settlement = {
        partyStatements: [
            {
                type: statementType_1.StatementType.OFFER.value,
                madeBy: madeBy_1.MadeBy.DEFENDANT,
                offer: {
                    content: 'My offer contents here.',
                    completionDate: '2020-10-10'
                }
            },
            {
                madeBy: madeBy_1.MadeBy.CLAIMANT.value,
                type: statementType_1.StatementType.ACCEPTATION.value
            }
        ]
    };
    return new settlement_1.Settlement().deserialize(settlement);
}
function prepareSettlementWithDefendantRejection(paymentIntention, party) {
    const settlement = {
        partyStatements: [
            {
                type: statementType_1.StatementType.OFFER.value,
                madeBy: party.value,
                offer: {
                    content: 'My offer contents here.',
                    completionDate: '2020-10-10',
                    paymentIntention: paymentIntention
                }
            },
            {
                madeBy: madeBy_1.MadeBy.CLAIMANT.value,
                type: statementType_1.StatementType.ACCEPTATION.value
            },
            {
                type: 'REJECTION',
                madeBy: 'DEFENDANT'
            }
        ]
    };
    return new settlement_1.Settlement().deserialize(settlement);
}
function prepareSettlementWithCounterSignature(paymentIntention, party) {
    const settlement = {
        partyStatements: [
            {
                type: statementType_1.StatementType.OFFER.value,
                madeBy: party.value,
                offer: {
                    content: 'My offer contents here.',
                    completionDate: '2020-10-10',
                    paymentIntention: paymentIntention
                }
            },
            {
                madeBy: madeBy_1.MadeBy.CLAIMANT.value,
                type: statementType_1.StatementType.ACCEPTATION.value
            },
            {
                type: 'COUNTERSIGNATURE',
                madeBy: 'DEFENDANT'
            }
        ]
    };
    return new settlement_1.Settlement().deserialize(settlement);
}
function prepareSettlementWithCounterSignatureWithDatePassed(paymentIntention, party) {
    const settlement = {
        partyStatements: [
            {
                type: statementType_1.StatementType.OFFER.value,
                madeBy: party.value,
                offer: {
                    content: 'My offer contents here.',
                    completionDate: '2010-10-10',
                    paymentIntention: paymentIntention
                }
            },
            {
                madeBy: madeBy_1.MadeBy.CLAIMANT.value,
                type: statementType_1.StatementType.ACCEPTATION.value
            },
            {
                type: 'COUNTERSIGNATURE',
                madeBy: 'DEFENDANT'
            }
        ]
    };
    return new settlement_1.Settlement().deserialize(settlement);
}
