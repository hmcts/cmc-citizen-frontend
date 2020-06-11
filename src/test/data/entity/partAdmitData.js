"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const momentFactory_1 = require("shared/momentFactory");
const formaliseOption_1 = require("claims/models/claimant-response/formaliseOption");
const claimantResponseType_1 = require("claims/models/claimant-response/claimantResponseType");
const paymentOption_1 = require("claims/models/paymentOption");
const paymentSchedule_1 = require("claims/models/response/core/paymentSchedule");
const responseData_1 = require("./responseData");
function immediatePaymentIntention() {
    return {
        paymentDate: momentFactory_1.MomentFactory.currentDate().add(5, 'days'),
        paymentOption: paymentOption_1.PaymentOption.IMMEDIATELY
    };
}
function bySetByDatePaymentIntention() {
    return {
        paymentDate: momentFactory_1.MomentFactory.currentDate().add(30, 'days'),
        paymentOption: paymentOption_1.PaymentOption.BY_SPECIFIED_DATE
    };
}
function bySetByDatePaymentIntentionPastDeadline() {
    return {
        paymentDate: momentFactory_1.MomentFactory.currentDate().subtract(1, 'days'),
        paymentOption: paymentOption_1.PaymentOption.BY_SPECIFIED_DATE
    };
}
function instalmentsPaymentIntentionPastDeadline() {
    return {
        paymentOption: paymentOption_1.PaymentOption.INSTALMENTS,
        repaymentPlan: {
            completionDate: momentFactory_1.MomentFactory.currentDate().subtract(12, 'months'),
            firstPaymentDate: momentFactory_1.MomentFactory.currentDate().subtract(1, 'days'),
            instalmentAmount: 10,
            paymentLength: '10 months',
            paymentSchedule: paymentSchedule_1.PaymentSchedule.EVERY_MONTH
        }
    };
}
function instalmentsPaymentIntention() {
    return {
        paymentOption: paymentOption_1.PaymentOption.INSTALMENTS,
        repaymentPlan: {
            completionDate: momentFactory_1.MomentFactory.currentDate().add(12, 'months'),
            firstPaymentDate: momentFactory_1.MomentFactory.currentDate().add(15, 'days'),
            instalmentAmount: 10,
            paymentLength: '10 months',
            paymentSchedule: paymentSchedule_1.PaymentSchedule.EVERY_MONTH
        }
    };
}
exports.instalmentsPaymentIntention = instalmentsPaymentIntention;
function courtDeterminationBySpecifiedDate() {
    return {
        courtDecision: Object.assign({}, bySetByDatePaymentIntention()),
        courtPaymentIntention: {
            paymentDate: momentFactory_1.MomentFactory.maxDate(),
            paymentOption: paymentOption_1.PaymentOption.BY_SPECIFIED_DATE,
            decisionType: 'DEFENDANT',
            rejectionReason: 'test'
        }
    };
}
function courtDeterminationInInstalments() {
    return {
        courtDecision: Object.assign({}, instalmentsPaymentIntention()),
        courtPaymentIntention: {
            paymentDate: momentFactory_1.MomentFactory.maxDate(),
            paymentOption: paymentOption_1.PaymentOption.BY_SPECIFIED_DATE,
            decisionType: 'DEFENDANT',
            rejectionReason: 'test'
        }
    };
}
function claimantReferredToJudgeResponse() {
    return {
        claimantPaymentIntention: Object.assign({}, immediatePaymentIntention()),
        courtDetermination: Object.assign({}, courtDeterminationBySpecifiedDate()),
        formaliseOption: formaliseOption_1.FormaliseOption.REFER_TO_JUDGE,
        type: claimantResponseType_1.ClaimantResponseType.ACCEPTATION
    };
}
exports.claimantReferredToJudgeResponse = claimantReferredToJudgeResponse;
function claimantReferredToJudgeResponseForInstalments() {
    return {
        claimantPaymentIntention: Object.assign({}, immediatePaymentIntention()),
        courtDetermination: Object.assign({}, courtDeterminationInInstalments()),
        formaliseOption: formaliseOption_1.FormaliseOption.REFER_TO_JUDGE,
        type: claimantResponseType_1.ClaimantResponseType.ACCEPTATION
    };
}
exports.claimantReferredToJudgeResponseForInstalments = claimantReferredToJudgeResponseForInstalments;
exports.claimantAcceptRepaymentPlan = {
    formaliseOption: formaliseOption_1.FormaliseOption.SETTLEMENT,
    type: claimantResponseType_1.ClaimantResponseType.ACCEPTATION
};
function claimantAcceptRepaymentPlanByDetermination() {
    return Object.assign({ claimantPaymentIntention: Object.assign({}, immediatePaymentIntention()), courtDetermination: Object.assign({}, courtDeterminationBySpecifiedDate()) }, exports.claimantAcceptRepaymentPlan);
}
exports.claimantAcceptRepaymentPlanByDetermination = claimantAcceptRepaymentPlanByDetermination;
function claimantAcceptRepaymentPlanInInstalmentsByDetermination() {
    return Object.assign({ claimantPaymentIntention: Object.assign({}, immediatePaymentIntention()), courtDetermination: Object.assign({}, courtDeterminationInInstalments()) }, exports.claimantAcceptRepaymentPlan);
}
exports.claimantAcceptRepaymentPlanInInstalmentsByDetermination = claimantAcceptRepaymentPlanInInstalmentsByDetermination;
function defendantOffersSettlementBySetDate() {
    return [{
            type: 'OFFER',
            madeBy: 'DEFENDANT',
            offer: {
                content: 'test',
                completionDate: momentFactory_1.MomentFactory.currentDate().add(1, 'day'),
                paymentIntention: Object.assign({}, bySetByDatePaymentIntention())
            }
        }];
}
function defendantOffersSettlementByInstalments() {
    return [{
            type: 'OFFER',
            madeBy: 'DEFENDANT',
            offer: {
                content: 'test',
                completionDate: momentFactory_1.MomentFactory.currentDate().add(12, 'months'),
                paymentIntention: Object.assign({}, instalmentsPaymentIntention())
            }
        }];
}
function defendantOffersSettlementBySetDatePastPaymentDeadline() {
    return [{
            type: 'OFFER',
            madeBy: 'DEFENDANT',
            offer: {
                content: 'test',
                completionDate: momentFactory_1.MomentFactory.currentDate().subtract(2, 'day'),
                paymentIntention: Object.assign({}, bySetByDatePaymentIntentionPastDeadline())
            }
        }];
}
function defendantOffersSettlementInInstalmentsPastPaymentDeadline() {
    return [{
            type: 'OFFER',
            madeBy: 'DEFENDANT',
            offer: {
                content: 'test',
                completionDate: momentFactory_1.MomentFactory.currentDate().add(12, 'months'),
                paymentIntention: Object.assign({}, instalmentsPaymentIntentionPastDeadline())
            }
        }];
}
const claimantAcceptOffer = [{
        madeBy: 'CLAIMANT',
        type: 'ACCEPTATION'
    }];
const defendantCounterSign = [{
        madeBy: 'DEFENDANT',
        type: 'COUNTERSIGNATURE'
    }];
const defendantRejected = [{
        madeBy: 'DEFENDANT',
        type: 'REJECTION'
    }];
function settledWithAgreementBySetDate() {
    return {
        settlement: {
            partyStatements: [
                ...defendantOffersSettlementBySetDate(),
                ...claimantAcceptOffer,
                ...defendantCounterSign
            ]
        },
        settlementReachedAt: momentFactory_1.MomentFactory.currentDate()
    };
}
exports.settledWithAgreementBySetDate = settledWithAgreementBySetDate;
function settledWithAgreementInInstalments() {
    return {
        settlement: {
            partyStatements: [
                ...defendantOffersSettlementByInstalments(),
                ...claimantAcceptOffer,
                ...defendantCounterSign
            ]
        },
        settlementReachedAt: momentFactory_1.MomentFactory.currentDate()
    };
}
exports.settledWithAgreementInInstalments = settledWithAgreementInInstalments;
function defendantRejectedSettlementOfferAcceptBySetDate() {
    return {
        settlement: {
            partyStatements: [
                ...defendantOffersSettlementBySetDate(),
                ...claimantAcceptOffer,
                ...defendantRejected
            ]
        },
        settlementReachedAt: momentFactory_1.MomentFactory.currentDate()
    };
}
exports.defendantRejectedSettlementOfferAcceptBySetDate = defendantRejectedSettlementOfferAcceptBySetDate;
function defendantRejectedSettlementOfferAcceptInInstalments() {
    return {
        settlement: {
            partyStatements: [
                ...defendantOffersSettlementByInstalments(),
                ...claimantAcceptOffer,
                ...defendantRejected
            ]
        },
        settlementReachedAt: momentFactory_1.MomentFactory.currentDate()
    };
}
exports.defendantRejectedSettlementOfferAcceptInInstalments = defendantRejectedSettlementOfferAcceptInInstalments;
function settledWithAgreementBySetDatePastPaymentDeadline() {
    return {
        settlement: {
            partyStatements: [
                ...defendantOffersSettlementBySetDatePastPaymentDeadline(),
                ...claimantAcceptOffer,
                ...defendantCounterSign
            ]
        },
        settlementReachedAt: momentFactory_1.MomentFactory.currentDate().subtract(7, 'days')
    };
}
exports.settledWithAgreementBySetDatePastPaymentDeadline = settledWithAgreementBySetDatePastPaymentDeadline;
function settledWithAgreementInInstalmentsPastPaymentDeadline() {
    return {
        settlement: {
            partyStatements: [
                ...defendantOffersSettlementInInstalmentsPastPaymentDeadline(),
                ...claimantAcceptOffer,
                ...defendantCounterSign
            ]
        },
        settlementReachedAt: momentFactory_1.MomentFactory.currentDate().subtract(7, 'days')
    };
}
exports.settledWithAgreementInInstalmentsPastPaymentDeadline = settledWithAgreementInInstalmentsPastPaymentDeadline;
function settlementOfferAcceptBySetDate() {
    return {
        settlement: {
            partyStatements: [
                ...defendantOffersSettlementBySetDate(),
                ...claimantAcceptOffer
            ]
        }
    };
}
exports.settlementOfferAcceptBySetDate = settlementOfferAcceptBySetDate;
function settlementOfferAcceptInInstalment() {
    return {
        settlement: {
            partyStatements: [
                ...defendantOffersSettlementByInstalments(),
                ...claimantAcceptOffer
            ]
        }
    };
}
exports.settlementOfferAcceptInInstalment = settlementOfferAcceptInInstalment;
function settlementOfferBySetDate() {
    return {
        settlement: {
            partyStatements: [
                ...defendantOffersSettlementBySetDate()
            ]
        }
    };
}
exports.settlementOfferBySetDate = settlementOfferBySetDate;
function settlementOfferByInstalments() {
    return {
        settlement: {
            partyStatements: [
                ...defendantOffersSettlementByInstalments()
            ]
        }
    };
}
exports.settlementOfferByInstalments = settlementOfferByInstalments;
exports.partialAdmissionAlreadyPaidData = Object.assign(Object.assign(Object.assign(Object.assign({}, responseData_1.baseResponseData), responseData_1.basePartialAdmissionData), responseData_1.basePartialEvidencesAndTimeLines), { amount: 100, defence: 'i have paid more than enough', paymentDeclaration: {
        paidDate: '2050-12-31',
        explanation: 'i have already paid enough'
    } });
