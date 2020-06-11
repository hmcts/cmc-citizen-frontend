"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("response/paths");
const draftService_1 = require("services/draftService");
const errorHandling_1 = require("shared/errorHandling");
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.sendCompanyFinancialDetailsPage.uri, (req, res) => {
    const claim = res.locals.claim;
    res.render(paths_1.Paths.sendCompanyFinancialDetailsPage.associatedView, {
        claimantName: claim.claimData.claimant.name
    });
})
    .post(paths_1.Paths.sendCompanyFinancialDetailsPage.uri, errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const claim = res.locals.claim;
    const draft = res.locals.responseDraft;
    const user = res.locals.user;
    draft.document.companyDefendantResponseViewed = true;
    await new draftService_1.DraftService().save(draft, user.bearerToken);
    res.redirect(paths_1.Paths.taskListPage.evaluateUri({ externalId: claim.externalId }));
}));
