"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("response/paths");
const statementOfMeansStateGuard_1 = require("response/guards/statementOfMeansStateGuard");
const statementOfMeans_1 = require("response/draft/statementOfMeans");
const draftService_1 = require("services/draftService");
const errorHandling_1 = require("shared/errorHandling");
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.StatementOfMeansPaths.introPage.uri, statementOfMeansStateGuard_1.StatementOfMeansStateGuard.requestHandler(false), (req, res) => {
    const claim = res.locals.claim;
    res.render(paths_1.StatementOfMeansPaths.introPage.associatedView, {
        claimantName: claim.claimData.claimant.name
    });
})
    .post(paths_1.StatementOfMeansPaths.introPage.uri, statementOfMeansStateGuard_1.StatementOfMeansStateGuard.requestHandler(false), errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const claim = res.locals.claim;
    const draft = res.locals.responseDraft;
    const user = res.locals.user;
    if (draft.document.statementOfMeans === undefined) {
        draft.document.statementOfMeans = new statementOfMeans_1.StatementOfMeans();
        await new draftService_1.DraftService().save(draft, user.bearerToken);
    }
    res.redirect(paths_1.StatementOfMeansPaths.bankAccountsPage.evaluateUri({ externalId: claim.externalId }));
}));
