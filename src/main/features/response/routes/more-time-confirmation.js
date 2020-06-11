"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("response/paths");
const moreTimeRequestRequiredGuard_1 = require("response/guards/moreTimeRequestRequiredGuard");
async function renderView(res, next) {
    try {
        const claim = res.locals.claim;
        res.render(paths_1.Paths.moreTimeConfirmationPage.associatedView, {
            newDeadline: claim.responseDeadline,
            claimantFullName: claim.claimData.claimant.name
        });
    }
    catch (err) {
        next(err);
    }
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.moreTimeConfirmationPage.uri, moreTimeRequestRequiredGuard_1.MoreTimeRequestRequiredGuard.requestHandler, async (req, res, next) => {
    await renderView(res, next);
})
    .post(paths_1.Paths.moreTimeConfirmationPage.uri, moreTimeRequestRequiredGuard_1.MoreTimeRequestRequiredGuard.requestHandler, (req, res) => {
    const claim = res.locals.claim;
    res.redirect(paths_1.Paths.taskListPage.evaluateUri({ externalId: claim.externalId }));
});
