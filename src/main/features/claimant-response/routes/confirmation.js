"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("claimant-response/paths");
const errorHandling_1 = require("shared/errorHandling");
const settlementHelper_1 = require("claimant-response/helpers/settlementHelper");
const momentFactory_1 = require("shared/momentFactory");
const paymentOption_1 = require("claims/models/paymentOption");
const statesPaidHelper_1 = require("claimant-response/helpers/statesPaidHelper");
const responseType_1 = require("claims/models/response/responseType");
const claimantResponseType_1 = require("claims/models/claimant-response/claimantResponseType");
const calendarClient_1 = require("claims/calendarClient");
const claimFeatureToggles_1 = require("utils/claimFeatureToggles");
function hasAcceptedDefendantsPaymentIntention(claim) {
    const paymentIntentionFromResponse = claim.response.paymentIntention;
    const paymentOptionFromCCJ = claim.countyCourtJudgment.paymentOption;
    if (paymentIntentionFromResponse.paymentOption !== paymentOptionFromCCJ) {
        return false;
    }
    switch (paymentOptionFromCCJ) {
        case paymentOption_1.PaymentOption.BY_SPECIFIED_DATE:
            return paymentIntentionFromResponse.paymentDate.toISOString() === claim.countyCourtJudgment.payBySetDate.toISOString();
        case paymentOption_1.PaymentOption.INSTALMENTS:
            return paymentIntentionFromResponse.repaymentPlan === claim.countyCourtJudgment.repaymentPlan;
        default:
            throw new Error(`Unhandled payment option ${paymentOptionFromCCJ}`);
    }
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.confirmationPage.uri, errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const claim = res.locals.claim;
    const response = claim.response;
    const alreadyPaid = statesPaidHelper_1.StatesPaidHelper.isResponseAlreadyPaid(claim);
    const acceptedPaymentPlanClaimantDeadline = await new calendarClient_1.CalendarClient().getNextWorkingDayAfterDays(claim.claimantRespondedAt, 7);
    res.render(paths_1.Paths.confirmationPage.associatedView, {
        confirmationDate: momentFactory_1.MomentFactory.currentDate(),
        repaymentPlanOrigin: (alreadyPaid || claim.response.responseType === responseType_1.ResponseType.FULL_DEFENCE) ? undefined : claim.settlement && settlementHelper_1.getRepaymentPlanOrigin(claim.settlement),
        paymentIntentionAccepted: (alreadyPaid || claim.response.responseType === responseType_1.ResponseType.FULL_DEFENCE) ? undefined : response.paymentIntention && hasAcceptedDefendantsPaymentIntention(claim),
        directionsQuestionnaireEnabled: claim.claimantResponse.type === claimantResponseType_1.ClaimantResponseType.REJECTION && claimFeatureToggles_1.ClaimFeatureToggles.isFeatureEnabledOnClaim(claim, 'directionsQuestionnaire'),
        acceptedPaymentPlanClaimantDeadline
    });
}));
