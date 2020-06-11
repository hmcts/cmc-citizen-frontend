"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("response/paths");
const errorHandling_1 = require("shared/errorHandling");
const feesClient_1 = require("fees/feesClient");
const feesTableViewHelper_1 = require("claim/helpers/feesTableViewHelper");
const supportedFeeLimitInGBP = 10000;
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.sendYourResponseByEmailPage.uri, errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const issueFeeGroup = await feesClient_1.FeesClient.getIssueFeeRangeGroup();
    const supportedIssueFees = issueFeeGroup
        .filter((range) => range.minRange < supportedFeeLimitInGBP)
        .map((range) => new feesTableViewHelper_1.FeeRange(range.minRange, Math.min(range.maxRange, supportedFeeLimitInGBP), range.currentVersion.flatAmount.amount));
    const draft = res.locals.responseDraft;
    res.render(paths_1.Paths.sendYourResponseByEmailPage.associatedView, {
        draft: draft.document,
        fees: supportedIssueFees
    });
}));
