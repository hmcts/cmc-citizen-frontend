"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const momentFactory_1 = require("shared/momentFactory");
function respondedAt() {
    return {
        respondedAt: momentFactory_1.MomentFactory.currentDate()
    };
}
exports.respondedAt = respondedAt;
function claimantRejectAlreadyPaid() {
    return {
        claimantResponse: {
            freeMediation: 'no',
            settleForAmount: 'no',
            type: 'REJECTION'
        },
        claimantRespondedAt: momentFactory_1.MomentFactory.currentDate()
    };
}
exports.claimantRejectAlreadyPaid = claimantRejectAlreadyPaid;
function claimantRejectAlreadyPaidWithMediation() {
    return {
        claimantResponse: {
            freeMediation: 'yes',
            settleForAmount: 'no',
            type: 'REJECTION'
        },
        claimantRespondedAt: momentFactory_1.MomentFactory.currentDate()
    };
}
exports.claimantRejectAlreadyPaidWithMediation = claimantRejectAlreadyPaidWithMediation;
function directionsQuestionnaireDeadline() {
    return {
        directionsQuestionnaireDeadline: momentFactory_1.MomentFactory.currentDate().add(19, 'days')
    };
}
exports.directionsQuestionnaireDeadline = directionsQuestionnaireDeadline;
function intentionToProceedDeadline() {
    return {
        intentionToProceedDeadline: momentFactory_1.MomentFactory.currentDateTime().subtract(1, 'days')
    };
}
exports.intentionToProceedDeadline = intentionToProceedDeadline;
function defendantOffersSettlement() {
    return [{
            type: 'OFFER',
            madeBy: 'DEFENDANT',
            offer: {
                content: 'test',
                completionDate: momentFactory_1.MomentFactory.currentDate().add(1, 'day')
            }
        }];
}
const claimantAcceptOffer = [{
        madeBy: 'CLAIMANT',
        type: 'ACCEPTATION'
    }];
const claimantRejectOffer = [{
        madeBy: 'CLAIMANT',
        type: 'REJECTION'
    }];
const defendantCounterSign = [{
        madeBy: 'DEFENDANT',
        type: 'COUNTERSIGNATURE'
    }];
function settledWithAgreement() {
    return {
        settlement: {
            partyStatements: [
                ...defendantOffersSettlement(),
                ...claimantAcceptOffer,
                ...defendantCounterSign
            ]
        },
        settlementReachedAt: momentFactory_1.MomentFactory.currentDate()
    };
}
exports.settledWithAgreement = settledWithAgreement;
function settlementOfferAccept() {
    return {
        settlement: {
            partyStatements: [
                ...defendantOffersSettlement(),
                ...claimantAcceptOffer
            ]
        }
    };
}
exports.settlementOfferAccept = settlementOfferAccept;
function settlementOfferReject() {
    return {
        settlement: {
            partyStatements: [
                ...defendantOffersSettlement(),
                ...claimantRejectOffer
            ]
        }
    };
}
exports.settlementOfferReject = settlementOfferReject;
function settlementOffer() {
    return {
        settlement: {
            partyStatements: [
                ...defendantOffersSettlement()
            ]
        }
    };
}
exports.settlementOffer = settlementOffer;
