"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("claim/paths");
const errorHandling_1 = require("shared/errorHandling");
const draftService_1 = require("services/draftService");
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.completingClaimPage.uri, (req, res) => {
    res.render(paths_1.Paths.completingClaimPage.associatedView);
})
    .post(paths_1.Paths.completingClaimPage.uri, errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const draft = res.locals.claimDraft;
    const user = res.locals.user;
    draft.document.readCompletingClaim = true;
    await new draftService_1.DraftService().save(draft, user.bearerToken);
    res.redirect(paths_1.Paths.taskListPage.uri);
}));
