"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("claim/paths");
const totalAmount_1 = require("forms/models/totalAmount");
const interestUtils_1 = require("shared/interestUtils");
const feesClient_1 = require("fees/feesClient");
const errorHandling_1 = require("shared/errorHandling");
const feesTableViewHelper_1 = require("claim/helpers/feesTableViewHelper");
const yesNoOption_1 = require("models/yesNoOption");
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.totalPage.uri, errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const draft = res.locals.claimDraft;
    const interest = await interestUtils_1.draftInterestAmount(draft.document);
    const totalAmount = draft.document.amount.totalAmount();
    const claimAmount = await interestUtils_1.draftClaimAmountWithInterest(draft.document);
    const issueFee = await feesClient_1.FeesClient.calculateIssueFee(claimAmount);
    const hearingFee = await feesClient_1.FeesClient.calculateHearingFee(claimAmount);
    const feeTableContent = await feesTableViewHelper_1.FeesTableViewHelper.feesTableContent();
    res.render(paths_1.Paths.totalPage.associatedView, {
        interestTotal: new totalAmount_1.TotalAmount(totalAmount, interest, issueFee),
        interestClaimed: (draft.document.interest.option !== yesNoOption_1.YesNoOption.NO),
        issueFee: issueFee,
        hearingFee: hearingFee,
        feeTableContent: feeTableContent
    });
}))
    .post(paths_1.Paths.totalPage.uri, (req, res) => {
    res.redirect(paths_1.Paths.taskListPage.uri);
});
