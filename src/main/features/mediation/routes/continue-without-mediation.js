"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("mediation/paths");
const errorHandling_1 = require("main/common/errorHandling");
const paths_2 = require("response/paths");
const paths_3 = require("claimant-response/paths");
function renderView(res) {
    const user = res.locals.user;
    const claim = res.locals.claim;
    res.render(paths_1.Paths.continueWithoutMediationPage.associatedView, {
        otherParty: claim.otherPartyName(user)
    });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.continueWithoutMediationPage.uri, (req, res) => {
    renderView(res);
})
    .post(paths_1.Paths.continueWithoutMediationPage.uri, errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const claim = res.locals.claim;
    if (!claim.isResponseSubmitted()) {
        res.redirect(paths_2.Paths.taskListPage.evaluateUri({ externalId: claim.externalId }));
    }
    else {
        res.redirect(paths_3.Paths.taskListPage.evaluateUri({ externalId: claim.externalId }));
    }
}));
