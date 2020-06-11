"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("settlement-agreement/paths");
const errorHandling_1 = require("main/common/errorHandling");
const form_1 = require("main/app/forms/form");
const madeBy_1 = require("claims/models/madeBy");
function renderView(form, req, res) {
    const claim = res.locals.claim;
    const lastOfferAsPartyStatement = claim.settlement.getLastOfferAsPartyStatement();
    const paymentIntention = lastOfferAsPartyStatement.offer.paymentIntention;
    const isPaymentIntentionMadeByCourt = lastOfferAsPartyStatement.madeBy === madeBy_1.MadeBy.COURT.value;
    const amountPaid = claim.claimantResponse && claim.claimantResponse.amountPaid ? claim.claimantResponse.amountPaid : 0;
    res.render(paths_1.Paths.repaymentPlanSummary.associatedView, {
        form: form,
        claim: claim,
        paymentIntention: paymentIntention,
        isPaymentIntentionMadeByCourt: isPaymentIntentionMadeByCourt,
        remainingAmountToPay: claim.totalAmountTillDateOfIssue - amountPaid,
        requestedBy: req.params.madeBy
    });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.repaymentPlanSummary.uri, errorHandling_1.ErrorHandling.apply(async (req, res) => {
    renderView(form_1.Form.empty(), req, res);
}));
