"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("features/directions-questionnaire/paths");
const errorHandling_1 = require("shared/errorHandling");
function renderView(res) {
    const claim = res.locals.claim;
    const user = res.locals.user;
    const otherParty = user.id === claim.claimantId ? 'defendant' : 'claimant';
    res.render(paths_1.Paths.expertGuidancePage.associatedView, {
        otherParty: otherParty
    });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.expertGuidancePage.uri, async (req, res) => {
    renderView(res);
})
    .post(paths_1.Paths.expertGuidancePage.uri, errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const claim = res.locals.claim;
    res.redirect(paths_1.Paths.permissionForExpertPage.evaluateUri({ externalId: claim.externalId }));
}));
