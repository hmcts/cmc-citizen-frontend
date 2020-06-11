"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CourtDecisionHelper_1 = require("shared/helpers/CourtDecisionHelper");
const claim_1 = require("claims/models/claim");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const draftClaimantResponse_1 = require("claimant-response/draft/draftClaimantResponse");
const chai_1 = require("chai");
const decisionType_1 = require("common/court-calculations/decisionType");
const paymentOption_1 = require("shared/components/payment-intention/model/paymentOption");
const draft_store_1 = require("test/http-mocks/draft-store");
const momentFactory_1 = require("shared/momentFactory");
describe('CourtDecisionHelper', () => {
    let claim;
    let draft;
    it('should create COURT decision when court calculated payment intention is most reasonable', () => {
        claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObj));
        draft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize({
            alternatePaymentMethod: {
                paymentOption: new paymentOption_1.PaymentOption(paymentOption_1.PaymentType.IMMEDIATELY)
            },
            courtDetermination: { disposableIncome: 100 }
        });
        chai_1.expect(CourtDecisionHelper_1.CourtDecisionHelper.createCourtDecision(claim, draft)).to.equal(decisionType_1.DecisionType.COURT);
    });
    it('should create CLAIMANT decision when claimant payment intention is most reasonable', () => {
        claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObj));
        draft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize(Object.assign(Object.assign({}, draft_store_1.sampleClaimantResponseDraftObj), { courtDetermination: { disposableIncome: 100 } }));
        chai_1.expect(CourtDecisionHelper_1.CourtDecisionHelper.createCourtDecision(claim, draft)).to.equal(decisionType_1.DecisionType.CLAIMANT);
    });
    it('should create CLAIMANT_IN_FAVOUR_OF_DEFENDANT decision when claimant is more lenient than defendant', () => {
        claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObjWithReasonablePaymentSchedule));
        draft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize({
            alternatePaymentMethod: {
                paymentOption: {
                    option: {
                        value: 'INSTALMENTS',
                        displayValue: 'By instalments'
                    }
                },
                paymentPlan: {
                    totalAmount: 3326.59,
                    instalmentAmount: 1000,
                    firstPaymentDate: {
                        year: momentFactory_1.MomentFactory.currentDate().add(82, 'days').format('YYYY'),
                        month: momentFactory_1.MomentFactory.currentDate().add(82, 'days').format('M'),
                        day: momentFactory_1.MomentFactory.currentDate().add(82, 'days').format('D')
                    },
                    paymentSchedule: {
                        value: 'EACH_WEEK',
                        displayValue: 'Each week'
                    }
                }
            },
            courtDetermination: { disposableIncome: 100 }
        });
        chai_1.expect(CourtDecisionHelper_1.CourtDecisionHelper.createCourtDecision(claim, draft)).to.equal(decisionType_1.DecisionType.CLAIMANT_IN_FAVOUR_OF_DEFENDANT);
    });
    it('should create DEFENDANT decision when defendant payment intention is most reasonable with pay by set date', () => {
        claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObjWithReasonablePaymentSchedule));
        draft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize({
            alternatePaymentMethod: {
                paymentOption: {
                    option: {
                        value: paymentOption_1.PaymentType.BY_SET_DATE.value
                    }
                },
                paymentDate: {
                    date: {
                        year: 2018,
                        month: 1,
                        day: 1
                    }
                }
            },
            courtDetermination: { disposableIncome: 0 }
        });
        chai_1.expect(CourtDecisionHelper_1.CourtDecisionHelper.createCourtDecision(claim, draft)).to.equal(decisionType_1.DecisionType.DEFENDANT);
    });
    it('should create DEFENDANT decision when defendant payment intention is most reasonable with pay by instalments', () => {
        claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObjWithNoDisposableIncome));
        draft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize({
            alternatePaymentMethod: {
                paymentOption: {
                    option: {
                        value: 'INSTALMENTS',
                        displayValue: 'By instalments'
                    }
                },
                paymentPlan: {
                    totalAmount: 3326.59,
                    instalmentAmount: 1000,
                    firstPaymentDate: {
                        year: 2019,
                        month: 1,
                        day: 1
                    },
                    paymentSchedule: {
                        value: 'EACH_WEEK',
                        displayValue: 'Each week'
                    },
                    completionDate: '2019-10-01',
                    paymentLength: '1'
                }
            },
            courtDetermination: { disposableIncome: 0 }
        });
        chai_1.expect(CourtDecisionHelper_1.CourtDecisionHelper.createCourtDecision(claim, draft)).to.equal(decisionType_1.DecisionType.DEFENDANT);
    });
});
