"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const courtDecision_1 = require("common/court-calculations/courtDecision");
const decisionType_1 = require("common/court-calculations/decisionType");
const paymentPlanHelper_1 = require("shared/helpers/paymentPlanHelper");
const paymentOption_1 = require("shared/components/payment-intention/model/paymentOption");
const momentFactory_1 = require("shared/momentFactory");
const paymentOption_2 = require("claims/models/paymentOption");
class CourtDecisionHelper {
    static createCourtDecision(claim, draft) {
        if (claim.response.defendant.isBusiness()) {
            return decisionType_1.DecisionType.NOT_APPLICABLE_IS_BUSINESS;
        }
        const defendantLastPaymentDate = CourtDecisionHelper.getDefendantLastPaymentDate(claim);
        const claimantLastPaymentDate = CourtDecisionHelper.getClaimantLastPaymentDate(draft);
        const courtOfferedLastDate = CourtDecisionHelper.getCourtOfferedLastDate(claim, draft);
        return courtDecision_1.CourtDecision.calculateDecision(defendantLastPaymentDate, claimantLastPaymentDate, courtOfferedLastDate);
    }
    static getCourtOfferedLastDate(claim, draft) {
        const courtCalculatedPaymentPlan = paymentPlanHelper_1.PaymentPlanHelper.createPaymentPlanFromDefendantFinancialStatement(claim, draft);
        return courtCalculatedPaymentPlan ? courtCalculatedPaymentPlan.calculateLastPaymentDate() : undefined;
    }
    static getDefendantLastPaymentDate(claim) {
        const claimResponse = claim.response;
        return claimResponse.paymentIntention.paymentOption === paymentOption_2.PaymentOption.INSTALMENTS
            ? claimResponse.paymentIntention.repaymentPlan.completionDate
            : claimResponse.paymentIntention.paymentDate;
    }
    static getClaimantLastPaymentDate(draft) {
        switch (draft.alternatePaymentMethod.paymentOption.option) {
            case paymentOption_1.PaymentType.IMMEDIATELY:
                return momentFactory_1.MomentFactory.currentDate().add(5, 'days');
            case paymentOption_1.PaymentType.BY_SET_DATE:
                return draft.alternatePaymentMethod.paymentDate.date.toMoment();
            case paymentOption_1.PaymentType.INSTALMENTS:
                return paymentPlanHelper_1.PaymentPlanHelper.createPaymentPlanFromForm(draft.alternatePaymentMethod.paymentPlan).calculateLastPaymentDate();
            default:
                throw new Error('Unknown claimant payment option!');
        }
    }
}
exports.CourtDecisionHelper = CourtDecisionHelper;
