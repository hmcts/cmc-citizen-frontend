"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("claimant-response/paths");
const draftService_1 = require("services/draftService");
const paymentPlanHelper_1 = require("shared/helpers/paymentPlanHelper");
const errorHandling_1 = require("shared/errorHandling");
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.counterOfferAcceptedPage.uri, errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const claim = res.locals.claim;
    const draft = res.locals.draft;
    const response = claim.response;
    const claimantPaymentPlan = paymentPlanHelper_1.PaymentPlanHelper.createPaymentPlanFromDraft(draft.document);
    const defendantPaymentOption = response.paymentIntention.paymentOption;
    const defendantPaymentPlan = paymentPlanHelper_1.PaymentPlanHelper.createPaymentPlanFromClaim(claim, draft.document);
    const differentPaymentFrequency = claimantPaymentPlan.frequency !== defendantPaymentPlan.frequency;
    const isCourtOrderPaymentPlanConvertedByDefendantFrequency = (defendantPaymentOption !== 'BY_SPECIFIED_DATE') ? defendantPaymentPlan.frequency && differentPaymentFrequency : false;
    res.render(paths_1.Paths.counterOfferAcceptedPage.associatedView, {
        isCourtOrderPaymentPlanConvertedByDefendantFrequency: isCourtOrderPaymentPlanConvertedByDefendantFrequency,
        claimantPaymentPlan: claimantPaymentPlan,
        courtOrderPaymentPlan: draft.document.courtDetermination.courtDecision ?
            draft.document.courtDetermination.courtDecision.repaymentPlan : undefined
    });
}))
    .post(paths_1.Paths.counterOfferAcceptedPage.uri, errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const { externalId } = req.params;
    const draft = res.locals.draft;
    const user = res.locals.user;
    draft.document.settlementAgreement = undefined;
    draft.document.formaliseRepaymentPlan = undefined;
    draft.document.courtDetermination.rejectionReason = undefined;
    await new draftService_1.DraftService().save(draft, user.bearerToken);
    res.redirect(paths_1.Paths.taskListPage.evaluateUri({ externalId: externalId }));
}));
