"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("mediation/paths");
const errorHandling_1 = require("main/common/errorHandling");
const claimFeatureToggles_1 = require("utils/claimFeatureToggles");
function renderView(res) {
    const user = res.locals.user;
    const claim = res.locals.claim;
    res.render(paths_1.Paths.freeMediationPage.associatedView, {
        otherParty: claim.otherPartyName(user),
        defendant: user.id === claim.defendantId,
        mediationPilot: claimFeatureToggles_1.ClaimFeatureToggles.isFeatureEnabledOnClaim(res.locals.claim, 'mediationPilot')
    });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.freeMediationPage.uri, (req, res) => {
    renderView(res);
})
    .post(paths_1.Paths.freeMediationPage.uri, errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const claim = res.locals.claim;
    res.redirect(paths_1.Paths.howMediationWorksPage.evaluateUri({ externalId: claim.externalId }));
}));
