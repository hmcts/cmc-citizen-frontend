"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("dashboard/paths");
const claimMiddleware_1 = require("claims/claimMiddleware");
const page = paths_1.Paths.directionsQuestionnairePage;
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(page.uri, claimMiddleware_1.ClaimMiddleware.retrieveByExternalId, (req, res) => {
    const user = res.locals.user;
    const claim = res.locals.claim;
    res.render(page.associatedView, {
        deadline: claim.directionsQuestionnaireDeadline,
        claimNumber: claim.claimNumber,
        citizenName: user.forename + ' ' + user.surname
    });
});
