"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("ccj/paths");
const errorHandling_1 = require("shared/errorHandling");
const form_1 = require("forms/form");
const paymentIntention_1 = require("claims/models/response/core/paymentIntention");
const CCJHelper = require("main/common/helpers/ccjHelper");
const paymentOption_1 = require("claims/models/paymentOption");
function renderView(form, req, res) {
    const claim = res.locals.claim;
    let paymentIntention;
    let payByDate;
    if (claim.hasClaimantAcceptedDefendantResponseWithCCJ()) {
        const ccjRepaymentPlan = claim.countyCourtJudgment.repaymentPlan;
        paymentIntention = paymentIntention_1.PaymentIntention.retrievePaymentIntention(ccjRepaymentPlan, claim);
    }
    else if (claim.hasClaimantAcceptedDefendantResponseWithSettlement()) {
        paymentIntention = claim.settlement.getLastOffer().paymentIntention;
    }
    if (paymentIntention.paymentOption === paymentOption_1.PaymentOption.IMMEDIATELY) {
        payByDate = claim.countyCourtJudgmentRequestedAt ? claim.countyCourtJudgmentRequestedAt.add(5, 'days') : claim.settlementReachedAt.add(5, 'days');
    }
    else if (paymentIntention.paymentOption === paymentOption_1.PaymentOption.BY_SPECIFIED_DATE) {
        payByDate = paymentIntention.paymentDate;
    }
    res.render(paths_1.Paths.repaymentPlanSummaryPage.associatedView, {
        form: form,
        claim: claim,
        paymentIntention: paymentIntention,
        remainingAmountToPay: CCJHelper.totalRemainingToPay(claim),
        requestedBy: req.params.madeBy,
        payByDate: payByDate
    });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.repaymentPlanSummaryPage.uri, errorHandling_1.ErrorHandling.apply(async (req, res) => {
    renderView(form_1.Form.empty(), req, res);
}));
