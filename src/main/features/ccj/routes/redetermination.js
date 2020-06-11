"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("ccj/paths");
const errorHandling_1 = require("shared/errorHandling");
const form_1 = require("forms/form");
const formValidator_1 = require("forms/validation/formValidator");
const ccjClient_1 = require("claims/ccjClient");
const reDetermination_1 = require("ccj/form/models/reDetermination");
const madeBy_1 = require("claims/models/madeBy");
const paymentIntention_1 = require("claims/models/response/core/paymentIntention");
function renderView(form, req, res) {
    const claim = res.locals.claim;
    let paymentIntention;
    if (claim.hasClaimantAcceptedDefendantResponseWithCCJ()) {
        const ccjRepaymentPlan = claim.countyCourtJudgment.repaymentPlan;
        paymentIntention = paymentIntention_1.PaymentIntention.retrievePaymentIntention(ccjRepaymentPlan, claim);
    }
    else if (claim.hasClaimantAcceptedDefendantResponseWithSettlement()) {
        paymentIntention = claim.settlement.getLastOffer().paymentIntention;
    }
    res.render(paths_1.Paths.redeterminationPage.associatedView, {
        form: form,
        claim: claim,
        paymentIntention: paymentIntention,
        remainingAmountToPay: claim.totalAmountTillDateOfIssue - claim.amountPaid(),
        madeBy: req.params.madeBy
    });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.redeterminationPage.uri, errorHandling_1.ErrorHandling.apply(async (req, res) => {
    renderView(new form_1.Form(new reDetermination_1.ReDetermination()), req, res);
}))
    .post(paths_1.Paths.redeterminationPage.uri, formValidator_1.FormValidator.requestHandler(reDetermination_1.ReDetermination, reDetermination_1.ReDetermination.fromObject), errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, req, res);
    }
    else {
        const claim = res.locals.claim;
        const user = res.locals.user;
        await ccjClient_1.CCJClient.redetermination(claim.externalId, form.model, user, madeBy_1.MadeBy.valueOf(req.params.madeBy));
        res.redirect(paths_1.Paths.redeterminationConfirmationPage.evaluateUri({ externalId: req.params.externalId }));
    }
}));
