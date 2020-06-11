"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("dashboard/paths");
const errorHandling_1 = require("shared/errorHandling");
const claimStoreClient_1 = require("claims/claimStoreClient");
const errors_1 = require("errors");
const directionOrder_1 = require("claims/models/directionOrder");
const claimStoreClient = new claimStoreClient_1.ClaimStoreClient();
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.defendantPage.uri, errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const { externalId } = req.params;
    const user = res.locals.user;
    const claim = await claimStoreClient.retrieveByExternalId(externalId, user);
    const reconsiderationDeadline = claim ? await claim.respondToReconsiderationDeadline() : undefined;
    const isReviewOrderEligible = directionOrder_1.DirectionOrder.isReviewOrderEligible(reconsiderationDeadline);
    const respondToReviewOrderDeadline = claim ? await claim.respondToReviewOrderDeadline() : undefined;
    const judgePilot = claim ? claim.features !== undefined && claim.features.includes('judgePilotEligible') : false;
    if (claim && claim.defendantId !== user.id) {
        throw new errors_1.ForbiddenError();
    }
    res.render(paths_1.Paths.defendantPage.associatedView, {
        claim: claim,
        reconsiderationDeadline: reconsiderationDeadline,
        isReviewOrderEligible: isReviewOrderEligible,
        respondToReviewOrderDeadline: respondToReviewOrderDeadline,
        judgePilot: judgePilot
    });
}));
