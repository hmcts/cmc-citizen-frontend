"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const draftClaimantResponse_1 = require("claimant-response/draft/draftClaimantResponse");
const claimantResponseConverter_1 = require("claims/converters/claimantResponseConverter");
const yesNoOption_1 = require("models/yesNoOption");
const settleAdmitted_1 = require("claimant-response/form/models/settleAdmitted");
const paidAmount_1 = require("ccj/form/models/paidAmount");
const yesNoOption_2 = require("ccj/form/models/yesNoOption");
const freeMediation_1 = require("forms/models/freeMediation");
const formaliseRepaymentPlan_1 = require("claimant-response/form/models/formaliseRepaymentPlan");
const formaliseRepaymentPlanOption_1 = require("claimant-response/form/models/formaliseRepaymentPlanOption");
const decisionType_1 = require("common/court-calculations/decisionType");
const rejectionReason_1 = require("claimant-response/form/models/rejectionReason");
const paymentIntentionDraft_1 = require("test/data/draft/paymentIntentionDraft");
const acceptPaymentMethod_1 = require("claimant-response/form/models/acceptPaymentMethod");
const courtDetermination_1 = require("claimant-response/draft/courtDetermination");
const claimSettled_1 = require("claimant-response/form/models/states-paid/claimSettled");
const partPaymentReceived_1 = require("claimant-response/form/models/states-paid/partPaymentReceived");
const momentFactory_1 = require("shared/momentFactory");
const localDate_1 = require("forms/models/localDate");
const claimantPaymentIntentionDraft_1 = require("test/data/draft/claimantPaymentIntentionDraft");
const claim_1 = require("claims/models/claim");
const claimStoreMock = require("test/http-mocks/claim-store");
const mediationDraft_1 = require("mediation/draft/mediationDraft");
const featureToggles_1 = require("utils/featureToggles");
function createDraftClaimantResponseForFullRejection() {
    const draftResponse = new draftClaimantResponse_1.DraftClaimantResponse();
    draftResponse.settleAdmitted = new settleAdmitted_1.SettleAdmitted(yesNoOption_1.YesNoOption.NO);
    draftResponse.paidAmount = new paidAmount_1.PaidAmount(yesNoOption_2.PaidAmountOption.NO, 10, 100);
    draftResponse.courtDetermination = new courtDetermination_1.CourtDetermination(paymentIntentionDraft_1.intentionOfPaymentByInstalments, paymentIntentionDraft_1.intentionOfPaymentInFullBySetDate, new rejectionReason_1.RejectionReason('Rejection reason is..'), 1000, decisionType_1.DecisionType.COURT);
    return draftResponse;
}
function createDraftClaimantResponseBaseForAcceptance(accept, settle) {
    const draftResponse = new draftClaimantResponse_1.DraftClaimantResponse();
    draftResponse.settleAdmitted = new settleAdmitted_1.SettleAdmitted(settle);
    draftResponse.paidAmount = new paidAmount_1.PaidAmount(yesNoOption_2.PaidAmountOption.YES, 10, 100);
    if (accept)
        draftResponse.acceptPaymentMethod = new acceptPaymentMethod_1.AcceptPaymentMethod(accept);
    return draftResponse;
}
function createDraftClaimantResponseWithCourtDecisionType(claimantPI, decisionType, formaliseOption, courtDecision, courtPaymentIntention) {
    const draftClaimantResponse = new draftClaimantResponse_1.DraftClaimantResponse();
    draftClaimantResponse.paidAmount = new paidAmount_1.PaidAmount(yesNoOption_2.PaidAmountOption.YES, 10, 100);
    draftClaimantResponse.formaliseRepaymentPlan = new formaliseRepaymentPlan_1.FormaliseRepaymentPlan(formaliseOption);
    draftClaimantResponse.acceptPaymentMethod = new acceptPaymentMethod_1.AcceptPaymentMethod(yesNoOption_1.YesNoOption.NO);
    if (claimantPI)
        draftClaimantResponse.alternatePaymentMethod = claimantPI;
    draftClaimantResponse.courtDetermination = new courtDetermination_1.CourtDetermination(courtDecision, courtPaymentIntention, undefined, 1000, decisionType);
    draftClaimantResponse.settleAdmitted = new settleAdmitted_1.SettleAdmitted(yesNoOption_1.YesNoOption.YES);
    return draftClaimantResponse;
}
describe('claimant response converter', () => {
    const claim = new claim_1.Claim().deserialize(claimStoreMock.sampleClaimObj);
    const mediationDraft = new mediationDraft_1.MediationDraft().deserialize({
        youCanOnlyUseMediation: {
            option: freeMediation_1.FreeMediationOption.YES
        },
        canWeUseCompany: {
            option: freeMediation_1.FreeMediationOption.YES,
            mediationPhoneNumberConfirmation: '07777777788',
            mediationContactPerson: 'Mary Richards'
        }
    });
    if (featureToggles_1.FeatureToggles.isEnabled('mediation')) {
        describe('Claimant Rejection', () => {
            it('rejection with mediation missing ', () => {
                const mediationDraft = new mediationDraft_1.MediationDraft().deserialize({
                    youCanOnlyUseMediation: {
                        option: freeMediation_1.FreeMediationOption.NO
                    }
                });
                chai_1.expect(claimantResponseConverter_1.ClaimantResponseConverter.convertToClaimantResponse(claim, createDraftClaimantResponseForFullRejection(), mediationDraft, false)).to.deep.eq({
                    'type': 'REJECTION',
                    'amountPaid': 10,
                    'reason': 'Rejection reason is..',
                    'freeMediation': 'no',
                    'mediationContactPerson': undefined,
                    'mediationPhoneNumber': undefined
                });
            });
            it('rejection with mediation', () => {
                const draftClaimantResponse = createDraftClaimantResponseForFullRejection();
                draftClaimantResponse.freeMediation = new freeMediation_1.FreeMediation('yes');
                chai_1.expect(claimantResponseConverter_1.ClaimantResponseConverter.convertToClaimantResponse(claim, draftClaimantResponse, mediationDraft, false)).to.deep.eq({
                    'type': 'REJECTION',
                    'amountPaid': 10,
                    'freeMediation': 'yes',
                    'mediationContactPerson': undefined,
                    'mediationPhoneNumber': '07777777788',
                    'reason': 'Rejection reason is..'
                });
            });
            it('rejection with mediation with reason', () => {
                const draftClaimantResponse = createDraftClaimantResponseForFullRejection();
                draftClaimantResponse.courtDetermination.rejectionReason = new rejectionReason_1.RejectionReason('rejected');
                chai_1.expect(claimantResponseConverter_1.ClaimantResponseConverter.convertToClaimantResponse(claim, draftClaimantResponse, mediationDraft, false)).to.deep.eq({
                    'type': 'REJECTION',
                    'amountPaid': 10,
                    'freeMediation': 'yes',
                    'mediationContactPerson': undefined,
                    'mediationPhoneNumber': '07777777788',
                    'reason': 'rejected'
                });
            });
            it('rejection with mediation with nil amount paid', () => {
                const draftClaimantResponse = new draftClaimantResponse_1.DraftClaimantResponse();
                draftClaimantResponse.settleAdmitted = new settleAdmitted_1.SettleAdmitted(yesNoOption_1.YesNoOption.NO);
                draftClaimantResponse.paidAmount = new paidAmount_1.PaidAmount(yesNoOption_2.PaidAmountOption.NO, 0, 100);
                draftClaimantResponse.freeMediation = new freeMediation_1.FreeMediation('yes');
                draftClaimantResponse.courtDetermination = new courtDetermination_1.CourtDetermination(paymentIntentionDraft_1.intentionOfPaymentByInstalments, paymentIntentionDraft_1.intentionOfPaymentInFullBySetDate, new rejectionReason_1.RejectionReason('Rejection reason is..'), 1000, decisionType_1.DecisionType.COURT);
                chai_1.expect(claimantResponseConverter_1.ClaimantResponseConverter.convertToClaimantResponse(claim, draftClaimantResponse, mediationDraft, false)).to.deep.eq({
                    'type': 'REJECTION',
                    'amountPaid': 0,
                    'freeMediation': 'yes',
                    'mediationContactPerson': undefined,
                    'mediationPhoneNumber': '07777777788',
                    'reason': 'Rejection reason is..'
                });
            });
            it('rejection from non acceptance of states paid', () => {
                const draftClaimantResponse = new draftClaimantResponse_1.DraftClaimantResponse();
                draftClaimantResponse.accepted = new claimSettled_1.ClaimSettled(yesNoOption_1.YesNoOption.NO);
                draftClaimantResponse.partPaymentReceived = new partPaymentReceived_1.PartPaymentReceived(yesNoOption_1.YesNoOption.YES);
                draftClaimantResponse.freeMediation = new freeMediation_1.FreeMediation('yes');
                draftClaimantResponse.rejectionReason = new rejectionReason_1.RejectionReason('OBJECTION!');
                chai_1.expect(claimantResponseConverter_1.ClaimantResponseConverter.convertToClaimantResponse(claim, draftClaimantResponse, mediationDraft, false)).to.deep.eq({
                    'type': 'REJECTION',
                    'freeMediation': 'yes',
                    'mediationContactPerson': undefined,
                    'mediationPhoneNumber': '07777777788',
                    'paymentReceived': 'yes',
                    'settleForAmount': 'no',
                    'reason': 'OBJECTION!'
                });
            });
            it('Should convert to rejection when given a no option in part payment received', () => {
                const draftClaimantResponse = new draftClaimantResponse_1.DraftClaimantResponse();
                draftClaimantResponse.partPaymentReceived = new partPaymentReceived_1.PartPaymentReceived(yesNoOption_1.YesNoOption.NO);
                draftClaimantResponse.freeMediation = new freeMediation_1.FreeMediation('yes');
                chai_1.expect(claimantResponseConverter_1.ClaimantResponseConverter.convertToClaimantResponse(claim, draftClaimantResponse, mediationDraft, false)).to.deep.eq({
                    'type': 'REJECTION',
                    'freeMediation': 'yes',
                    'mediationContactPerson': undefined,
                    'mediationPhoneNumber': '07777777788',
                    'paymentReceived': 'no'
                });
            });
        });
    }
    describe('Claimant Acceptance', () => {
        it('Accept defendant offer with CCJ', () => {
            const draftClaimantResponse = createDraftClaimantResponseBaseForAcceptance(null, yesNoOption_1.YesNoOption.YES);
            draftClaimantResponse.formaliseRepaymentPlan = new formaliseRepaymentPlan_1.FormaliseRepaymentPlan(formaliseRepaymentPlanOption_1.FormaliseRepaymentPlanOption.REQUEST_COUNTY_COURT_JUDGEMENT);
            chai_1.expect(claimantResponseConverter_1.ClaimantResponseConverter.convertToClaimantResponse(claim, draftClaimantResponse, mediationDraft, false)).to.deep.eq({
                'type': 'ACCEPTATION',
                'amountPaid': 10,
                'formaliseOption': 'CCJ'
            });
        });
        it('Accept defendant offer with settlement', () => {
            const draftClaimantResponse = createDraftClaimantResponseBaseForAcceptance(null, yesNoOption_1.YesNoOption.YES);
            draftClaimantResponse.formaliseRepaymentPlan = new formaliseRepaymentPlan_1.FormaliseRepaymentPlan(formaliseRepaymentPlanOption_1.FormaliseRepaymentPlanOption.SIGN_SETTLEMENT_AGREEMENT);
            chai_1.expect(claimantResponseConverter_1.ClaimantResponseConverter.convertToClaimantResponse(claim, draftClaimantResponse, mediationDraft, false)).to.deep.eq({
                'type': 'ACCEPTATION',
                'amountPaid': 10,
                'formaliseOption': 'SETTLEMENT'
            });
        });
        it('Accept defendant offer with unknown formalise option', () => {
            const draftClaimantResponse = createDraftClaimantResponseBaseForAcceptance(yesNoOption_1.YesNoOption.NO, yesNoOption_1.YesNoOption.YES);
            draftClaimantResponse.courtDetermination = new courtDetermination_1.CourtDetermination(null, null, null, null, decisionType_1.DecisionType.DEFENDANT);
            draftClaimantResponse.formaliseRepaymentPlan = new formaliseRepaymentPlan_1.FormaliseRepaymentPlan(new formaliseRepaymentPlanOption_1.FormaliseRepaymentPlanOption('xyz', 'xyz'));
            const errMsg = 'Unknown formalise repayment option xyz';
            chai_1.expect(() => claimantResponseConverter_1.ClaimantResponseConverter.convertToClaimantResponse(claim, draftClaimantResponse, mediationDraft, false)).to.throw(Error, errMsg);
        });
        it('Accept defendant offer but propose a counter repayment plan to pay immediately', () => {
            const draftClaimantResponse = createDraftClaimantResponseWithCourtDecisionType(claimantPaymentIntentionDraft_1.payImmediatelyIntent, decisionType_1.DecisionType.DEFENDANT, formaliseRepaymentPlanOption_1.FormaliseRepaymentPlanOption.REQUEST_COUNTY_COURT_JUDGEMENT, paymentIntentionDraft_1.intentionOfPaymentInFullBySetDate, paymentIntentionDraft_1.intentionOfPaymentInFullBySetDate);
            chai_1.expect(claimantResponseConverter_1.ClaimantResponseConverter.convertToClaimantResponse(claim, draftClaimantResponse, mediationDraft, false)).to.deep.eq({
                'type': 'ACCEPTATION',
                'amountPaid': 10,
                'claimantPaymentIntention': {
                    'paymentOption': 'IMMEDIATELY',
                    'paymentDate': momentFactory_1.MomentFactory.currentDate().add(5, 'days')
                },
                'formaliseOption': 'CCJ',
                'courtDetermination': {
                    courtDecision: paymentIntentionDraft_1.intentionOfPaymentInFullBySetDate,
                    courtPaymentIntention: paymentIntentionDraft_1.intentionOfPaymentInFullBySetDate,
                    disposableIncome: 1000,
                    decisionType: decisionType_1.DecisionType.DEFENDANT
                }
            });
        });
        it('Accept defendant offer but propose a counter repayment plan to pay by set date', () => {
            const draftClaimantResponse = createDraftClaimantResponseWithCourtDecisionType(claimantPaymentIntentionDraft_1.payBySetDateIntent, decisionType_1.DecisionType.DEFENDANT, formaliseRepaymentPlanOption_1.FormaliseRepaymentPlanOption.REQUEST_COUNTY_COURT_JUDGEMENT, paymentIntentionDraft_1.intentionOfPaymentInFullBySetDate, paymentIntentionDraft_1.intentionOfPaymentInFullBySetDate);
            chai_1.expect(claimantResponseConverter_1.ClaimantResponseConverter.convertToClaimantResponse(claim, draftClaimantResponse, mediationDraft, false)).to.deep.eq({
                'type': 'ACCEPTATION',
                'amountPaid': 10,
                'claimantPaymentIntention': {
                    'paymentOption': 'BY_SPECIFIED_DATE',
                    'paymentDate': new localDate_1.LocalDate(2018, 12, 31).toMoment()
                },
                'formaliseOption': 'CCJ',
                'courtDetermination': {
                    courtDecision: paymentIntentionDraft_1.intentionOfPaymentInFullBySetDate,
                    courtPaymentIntention: paymentIntentionDraft_1.intentionOfPaymentInFullBySetDate,
                    disposableIncome: 1000,
                    decisionType: decisionType_1.DecisionType.DEFENDANT
                }
            });
        });
        it('Accept defendant offer but propose a counter repayment plan to pay by instalments', () => {
            const draftClaimantResponse = createDraftClaimantResponseWithCourtDecisionType(claimantPaymentIntentionDraft_1.payByInstallmentsIntent, decisionType_1.DecisionType.DEFENDANT, formaliseRepaymentPlanOption_1.FormaliseRepaymentPlanOption.REQUEST_COUNTY_COURT_JUDGEMENT, paymentIntentionDraft_1.intentionOfPaymentInFullBySetDate, paymentIntentionDraft_1.intentionOfPaymentInFullBySetDate);
            chai_1.expect(claimantResponseConverter_1.ClaimantResponseConverter.convertToClaimantResponse(claim, draftClaimantResponse, mediationDraft, false)).to.deep.eq({
                'type': 'ACCEPTATION',
                'amountPaid': 10,
                'claimantPaymentIntention': {
                    'paymentOption': 'INSTALMENTS',
                    'repaymentPlan': {
                        'firstPaymentDate': new localDate_1.LocalDate(2018, 12, 31).toMoment(),
                        'instalmentAmount': 100,
                        'paymentSchedule': 'EVERY_MONTH',
                        'paymentLength': '',
                        'completionDate': new localDate_1.LocalDate(2019, 12, 30).toMoment()
                    }
                },
                'formaliseOption': 'CCJ',
                'courtDetermination': {
                    courtDecision: paymentIntentionDraft_1.intentionOfPaymentInFullBySetDate,
                    courtPaymentIntention: paymentIntentionDraft_1.intentionOfPaymentInFullBySetDate,
                    disposableIncome: 1000,
                    decisionType: decisionType_1.DecisionType.DEFENDANT
                }
            });
        });
        it('Claimant proposes immediate payment court decides pay by set date', () => {
            const draftClaimantResponse = createDraftClaimantResponseWithCourtDecisionType(claimantPaymentIntentionDraft_1.payImmediatelyIntent, decisionType_1.DecisionType.COURT, formaliseRepaymentPlanOption_1.FormaliseRepaymentPlanOption.REQUEST_COUNTY_COURT_JUDGEMENT, paymentIntentionDraft_1.intentionOfPaymentInFullBySetDate, paymentIntentionDraft_1.intentionOfPaymentByInstalments);
            chai_1.expect(claimantResponseConverter_1.ClaimantResponseConverter.convertToClaimantResponse(claim, draftClaimantResponse, mediationDraft, false)).to.deep.eq({
                'type': 'ACCEPTATION',
                'amountPaid': 10,
                'formaliseOption': 'CCJ',
                'claimantPaymentIntention': {
                    'paymentOption': 'IMMEDIATELY',
                    'paymentDate': momentFactory_1.MomentFactory.currentDate().add(5, 'days')
                },
                'courtDetermination': {
                    courtDecision: paymentIntentionDraft_1.intentionOfPaymentInFullBySetDate,
                    courtPaymentIntention: paymentIntentionDraft_1.intentionOfPaymentByInstalments,
                    disposableIncome: 1000,
                    decisionType: decisionType_1.DecisionType.COURT
                }
            });
        });
        it('Accept court decision to pay by instalments with ccj', () => {
            const draftClaimantResponse = createDraftClaimantResponseWithCourtDecisionType(claimantPaymentIntentionDraft_1.payImmediatelyIntent, decisionType_1.DecisionType.COURT, formaliseRepaymentPlanOption_1.FormaliseRepaymentPlanOption.REQUEST_COUNTY_COURT_JUDGEMENT, paymentIntentionDraft_1.intentionOfPaymentByInstalments, paymentIntentionDraft_1.intentionOfPaymentByInstalments);
            chai_1.expect(claimantResponseConverter_1.ClaimantResponseConverter.convertToClaimantResponse(claim, draftClaimantResponse, mediationDraft, false)).to.deep.eq({
                'type': 'ACCEPTATION',
                'amountPaid': 10,
                'formaliseOption': 'CCJ',
                'claimantPaymentIntention': {
                    'paymentOption': 'IMMEDIATELY',
                    'paymentDate': momentFactory_1.MomentFactory.currentDate().add(5, 'days')
                },
                'courtDetermination': {
                    courtDecision: paymentIntentionDraft_1.intentionOfPaymentByInstalments,
                    courtPaymentIntention: paymentIntentionDraft_1.intentionOfPaymentByInstalments,
                    disposableIncome: 1000,
                    decisionType: decisionType_1.DecisionType.COURT
                }
            });
        });
        it('Accept court decision favouring defendant payment intent', () => {
            const draftClaimantResponse = createDraftClaimantResponseWithCourtDecisionType(claimantPaymentIntentionDraft_1.payBySetDateIntent, decisionType_1.DecisionType.DEFENDANT, formaliseRepaymentPlanOption_1.FormaliseRepaymentPlanOption.REQUEST_COUNTY_COURT_JUDGEMENT, paymentIntentionDraft_1.intentionOfPaymentByInstalments, paymentIntentionDraft_1.intentionOfPaymentInFullBySetDate);
            chai_1.expect(claimantResponseConverter_1.ClaimantResponseConverter.convertToClaimantResponse(claim, draftClaimantResponse, mediationDraft, false)).to.deep.eq({
                'type': 'ACCEPTATION',
                'amountPaid': 10,
                'claimantPaymentIntention': {
                    'paymentOption': 'BY_SPECIFIED_DATE',
                    'paymentDate': new localDate_1.LocalDate(2018, 12, 31).toMoment()
                },
                'courtDetermination': {
                    courtDecision: paymentIntentionDraft_1.intentionOfPaymentByInstalments,
                    courtPaymentIntention: paymentIntentionDraft_1.intentionOfPaymentInFullBySetDate,
                    disposableIncome: 1000,
                    decisionType: decisionType_1.DecisionType.DEFENDANT
                },
                'formaliseOption': 'CCJ'
            });
        });
        it('Accept court decision favouring claimant payment intent', () => {
            const draftClaimantResponse = createDraftClaimantResponseWithCourtDecisionType(claimantPaymentIntentionDraft_1.payByInstallmentsIntent, decisionType_1.DecisionType.CLAIMANT, formaliseRepaymentPlanOption_1.FormaliseRepaymentPlanOption.REQUEST_COUNTY_COURT_JUDGEMENT, paymentIntentionDraft_1.intentionOfPaymentByInstalments, paymentIntentionDraft_1.intentionOfPaymentInFullBySetDate);
            chai_1.expect(claimantResponseConverter_1.ClaimantResponseConverter.convertToClaimantResponse(claim, draftClaimantResponse, mediationDraft, false)).to.deep.eq({
                'type': 'ACCEPTATION',
                'amountPaid': 10,
                'formaliseOption': 'CCJ',
                'claimantPaymentIntention': {
                    'paymentOption': 'INSTALMENTS',
                    'repaymentPlan': {
                        'firstPaymentDate': new localDate_1.LocalDate(2018, 12, 31).toMoment(),
                        'instalmentAmount': 100,
                        'paymentSchedule': 'EVERY_MONTH',
                        'paymentLength': '',
                        'completionDate': new localDate_1.LocalDate(2019, 12, 30).toMoment()
                    }
                },
                'courtDetermination': {
                    courtDecision: paymentIntentionDraft_1.intentionOfPaymentByInstalments,
                    courtPaymentIntention: paymentIntentionDraft_1.intentionOfPaymentInFullBySetDate,
                    disposableIncome: 1000,
                    decisionType: decisionType_1.DecisionType.CLAIMANT
                }
            });
        });
        it('Reject court decision to pay by set date and refer to judge', () => {
            const draftClaimantResponse = createDraftClaimantResponseWithCourtDecisionType(claimantPaymentIntentionDraft_1.payImmediatelyIntent, decisionType_1.DecisionType.COURT, formaliseRepaymentPlanOption_1.FormaliseRepaymentPlanOption.REFER_TO_JUDGE, paymentIntentionDraft_1.intentionOfPaymentInFullBySetDate, paymentIntentionDraft_1.intentionOfPaymentByInstalments);
            draftClaimantResponse.rejectionReason = new rejectionReason_1.RejectionReason('rejected reason');
            chai_1.expect(claimantResponseConverter_1.ClaimantResponseConverter.convertToClaimantResponse(claim, draftClaimantResponse, mediationDraft, false)).to.deep.eq({
                'type': 'ACCEPTATION',
                'amountPaid': 10,
                'claimantPaymentIntention': {
                    'paymentOption': 'IMMEDIATELY',
                    'paymentDate': momentFactory_1.MomentFactory.currentDate().add(5, 'days')
                },
                'courtDetermination': {
                    courtDecision: paymentIntentionDraft_1.intentionOfPaymentInFullBySetDate,
                    courtPaymentIntention: paymentIntentionDraft_1.intentionOfPaymentByInstalments,
                    rejectionReason: 'rejected reason',
                    disposableIncome: 1000,
                    decisionType: decisionType_1.DecisionType.COURT
                },
                'formaliseOption': 'REFER_TO_JUDGE'
            });
        });
        it('Reject court decision to pay by instalments and refer to judge', () => {
            const draftClaimantResponse = createDraftClaimantResponseWithCourtDecisionType(claimantPaymentIntentionDraft_1.payImmediatelyIntent, decisionType_1.DecisionType.COURT, formaliseRepaymentPlanOption_1.FormaliseRepaymentPlanOption.REFER_TO_JUDGE, paymentIntentionDraft_1.intentionOfPaymentByInstalments, paymentIntentionDraft_1.intentionOfPaymentInFullBySetDate);
            draftClaimantResponse.rejectionReason = new rejectionReason_1.RejectionReason('rejected reason');
            chai_1.expect(claimantResponseConverter_1.ClaimantResponseConverter.convertToClaimantResponse(claim, draftClaimantResponse, mediationDraft, false)).to.deep.eq({
                'type': 'ACCEPTATION',
                'amountPaid': 10,
                'claimantPaymentIntention': {
                    'paymentOption': 'IMMEDIATELY',
                    'paymentDate': momentFactory_1.MomentFactory.currentDate().add(5, 'days')
                },
                'courtDetermination': {
                    courtDecision: paymentIntentionDraft_1.intentionOfPaymentByInstalments,
                    courtPaymentIntention: paymentIntentionDraft_1.intentionOfPaymentInFullBySetDate,
                    rejectionReason: 'rejected reason',
                    disposableIncome: 1000,
                    decisionType: decisionType_1.DecisionType.COURT
                },
                'formaliseOption': 'REFER_TO_JUDGE'
            });
        });
        it('If defendant is a business and claimant rejects defendant payment plan for alternative means then refer to judge', () => {
            const draftClaimantResponse = createDraftClaimantResponseBaseForAcceptance(yesNoOption_1.YesNoOption.YES, yesNoOption_1.YesNoOption.YES);
            draftClaimantResponse.formaliseRepaymentPlan = new formaliseRepaymentPlan_1.FormaliseRepaymentPlan(formaliseRepaymentPlanOption_1.FormaliseRepaymentPlanOption.REFER_TO_JUDGE);
            draftClaimantResponse.alternatePaymentMethod = claimantPaymentIntentionDraft_1.payImmediatelyIntent;
            draftClaimantResponse.paidAmount = undefined;
            chai_1.expect(claimantResponseConverter_1.ClaimantResponseConverter.convertToClaimantResponse(claim, draftClaimantResponse, mediationDraft, true)).to.deep.eq({
                'type': 'ACCEPTATION',
                'claimantPaymentIntention': {
                    'paymentOption': 'IMMEDIATELY',
                    'paymentDate': momentFactory_1.MomentFactory.currentDate().add(5, 'days')
                },
                'formaliseOption': 'REFER_TO_JUDGE'
            });
        });
    });
});
