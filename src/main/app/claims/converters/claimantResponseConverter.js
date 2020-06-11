"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const responseRejection_ts_1 = require("claims/models/response/core/responseRejection.ts");
const formaliseRepaymentPlanOption_1 = require("claimant-response/form/models/formaliseRepaymentPlanOption");
const responseAcceptance_1 = require("claims/models/response/core/responseAcceptance");
const courtDetermination_1 = require("claims/models/response/core/courtDetermination");
const paymentOption_1 = require("claims/models/paymentOption");
const momentFactory_1 = require("shared/momentFactory");
const yesNoOption_1 = require("claims/models/response/core/yesNoOption");
const freeMediationUtil_1 = require("shared/utils/freeMediationUtil");
const directionsQuestionnaire_1 = require("claims/models/directions-questionnaire/directionsQuestionnaire");
const directionsQuestionnaireHelper_1 = require("claimant-response/helpers/directionsQuestionnaireHelper");
class ClaimantResponseConverter {
    static convertToClaimantResponse(claim, draftClaimantResponse, mediationDraft, isDefendantBusiness, directionsQuestionnaireDraft) {
        if (!this.isResponseAcceptance(draftClaimantResponse)) {
            let reject = new responseRejection_ts_1.ResponseRejection();
            if (draftClaimantResponse.paidAmount) {
                reject.amountPaid = draftClaimantResponse.paidAmount.amount;
            }
            reject.freeMediation = freeMediationUtil_1.FreeMediationUtil.getFreeMediation(mediationDraft);
            reject.mediationPhoneNumber = freeMediationUtil_1.FreeMediationUtil.getMediationPhoneNumber(claim, mediationDraft);
            reject.mediationContactPerson = freeMediationUtil_1.FreeMediationUtil.getMediationContactPerson(claim, mediationDraft);
            if (draftClaimantResponse.courtDetermination && draftClaimantResponse.courtDetermination.rejectionReason) {
                reject.reason = draftClaimantResponse.courtDetermination.rejectionReason.text;
            }
            else if (draftClaimantResponse.rejectionReason) {
                reject.reason = draftClaimantResponse.rejectionReason.text;
            }
            this.addStatesPaidOptions(draftClaimantResponse, reject);
            if (directionsQuestionnaireHelper_1.DirectionsQuestionnaireHelper.isDirectionsQuestionnaireEligible(draftClaimantResponse, claim)) {
                this.addDirectionsQuestionnaire(directionsQuestionnaireDraft, reject);
            }
            return reject;
        }
        else
            return this.createResponseAcceptance(draftClaimantResponse, isDefendantBusiness);
    }
    static isResponseAcceptance(draftClaimantResponse) {
        if (draftClaimantResponse.settleAdmitted && draftClaimantResponse.settleAdmitted.admitted.option === yesNoOption_1.YesNoOption.NO) {
            return false;
        }
        else if (draftClaimantResponse.accepted && draftClaimantResponse.accepted.accepted.option === yesNoOption_1.YesNoOption.NO) {
            return false;
        }
        else if (draftClaimantResponse.partPaymentReceived && draftClaimantResponse.partPaymentReceived.received.option === yesNoOption_1.YesNoOption.NO) {
            return false;
        }
        else if (draftClaimantResponse.intentionToProceed && draftClaimantResponse.intentionToProceed.proceed.option === yesNoOption_1.YesNoOption.YES) {
            return false;
        }
        return true;
    }
    static createResponseAcceptance(draftClaimantResponse, isDefendentBusiness) {
        const respAcceptance = new responseAcceptance_1.ResponseAcceptance();
        if (draftClaimantResponse.paidAmount) {
            respAcceptance.amountPaid = draftClaimantResponse.paidAmount.amount;
        }
        if (isDefendentBusiness && draftClaimantResponse.alternatePaymentMethod) {
            respAcceptance.formaliseOption = 'REFER_TO_JUDGE';
        }
        if (draftClaimantResponse.formaliseRepaymentPlan) {
            respAcceptance.formaliseOption = this.getFormaliseOption(draftClaimantResponse.formaliseRepaymentPlan);
        }
        if (draftClaimantResponse.courtDetermination && draftClaimantResponse.courtDetermination.courtDecision) {
            respAcceptance.courtDetermination = this.getCourtDetermination(draftClaimantResponse);
        }
        if (draftClaimantResponse.alternatePaymentMethod) {
            respAcceptance.claimantPaymentIntention = this.getClaimantPaymentIntention(draftClaimantResponse);
        }
        this.addStatesPaidOptions(draftClaimantResponse, respAcceptance);
        return respAcceptance;
    }
    static getCourtDetermination(draftClaimantResponse) {
        const courtDetermination = draftClaimantResponse.courtDetermination;
        if (!courtDetermination.courtPaymentIntention && !courtDetermination.courtDecision) {
            throw new Error('Court payment intention and court decision are missing in court Determination');
        }
        const responseCourtDetermination = new courtDetermination_1.CourtDetermination();
        responseCourtDetermination.courtDecision = courtDetermination.courtDecision;
        responseCourtDetermination.courtPaymentIntention = courtDetermination.courtPaymentIntention;
        if (draftClaimantResponse.rejectionReason) {
            responseCourtDetermination.rejectionReason = draftClaimantResponse.rejectionReason.text;
        }
        responseCourtDetermination.disposableIncome = courtDetermination.disposableIncome ? courtDetermination.disposableIncome : 0;
        responseCourtDetermination.decisionType = courtDetermination.decisionType;
        return responseCourtDetermination;
    }
    static getClaimantPaymentIntention(draftClaimantResponse) {
        const claimantPaymentIntention = draftClaimantResponse.alternatePaymentMethod.toDomainInstance();
        if (draftClaimantResponse.alternatePaymentMethod.paymentOption.option.value === paymentOption_1.PaymentOption.IMMEDIATELY) {
            claimantPaymentIntention.paymentDate = momentFactory_1.MomentFactory.currentDate().add(5, 'days');
        }
        return claimantPaymentIntention;
    }
    static getFormaliseOption(repaymentPlan) {
        switch (repaymentPlan.option) {
            case formaliseRepaymentPlanOption_1.FormaliseRepaymentPlanOption.SIGN_SETTLEMENT_AGREEMENT:
                return 'SETTLEMENT';
            case formaliseRepaymentPlanOption_1.FormaliseRepaymentPlanOption.REQUEST_COUNTY_COURT_JUDGEMENT:
                return 'CCJ';
            case formaliseRepaymentPlanOption_1.FormaliseRepaymentPlanOption.REFER_TO_JUDGE:
                return 'REFER_TO_JUDGE';
            default:
                throw new Error(`Unknown formalise repayment option ${repaymentPlan.option.value}`);
        }
    }
    static addStatesPaidOptions(draftClaimantResponse, claimantResponse) {
        if (draftClaimantResponse.partPaymentReceived) {
            claimantResponse.paymentReceived = draftClaimantResponse.partPaymentReceived.received.option;
        }
        if (draftClaimantResponse.accepted) {
            claimantResponse.settleForAmount = draftClaimantResponse.accepted.accepted.option;
        }
    }
    static addDirectionsQuestionnaire(directionsQuestionnaireDraft, respRejection) {
        respRejection.directionsQuestionnaire = directionsQuestionnaire_1.DirectionsQuestionnaire.deserialize(directionsQuestionnaireDraft);
    }
}
exports.ClaimantResponseConverter = ClaimantResponseConverter;
