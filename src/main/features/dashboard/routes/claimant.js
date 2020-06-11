"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("dashboard/paths");
const paths_2 = require("ccj/paths");
const errorHandling_1 = require("shared/errorHandling");
const claimStoreClient_1 = require("claims/claimStoreClient");
const partyType_1 = require("common/partyType");
const errors_1 = require("errors");
const directionOrder_1 = require("claims/models/directionOrder");
const claimStoreClient = new claimStoreClient_1.ClaimStoreClient();
const draftExternalId = 'draft';
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.claimantPage.uri, errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const { externalId } = req.params;
    const claim = externalId !== draftExternalId ? await claimStoreClient.retrieveByExternalId(externalId, res.locals.user) : undefined;
    const mediationDeadline = claim ? await claim.respondToMediationDeadline() : undefined;
    const reconsiderationDeadline = claim ? await claim.respondToReconsiderationDeadline() : undefined;
    const isReviewOrderEligible = directionOrder_1.DirectionOrder.isReviewOrderEligible(reconsiderationDeadline);
    const judgePilot = claim ? claim.features !== undefined && claim.features.includes('judgePilotEligible') : false;
    const respondToReviewOrderDeadline = claim ? await claim.respondToReviewOrderDeadline() : undefined;
    if (claim && claim.claimantId !== res.locals.user.id) {
        throw new errors_1.ForbiddenError();
    }
    res.render(paths_1.Paths.claimantPage.associatedView, {
        claim: claim,
        mediationDeadline: mediationDeadline,
        reconsiderationDeadline: reconsiderationDeadline,
        isReviewOrderEligible: isReviewOrderEligible,
        respondToReviewOrderDeadline: respondToReviewOrderDeadline,
        judgePilot: judgePilot
    });
}))
    .post(paths_1.Paths.claimantPage.uri, errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const { externalId } = req.params;
    if (externalId === draftExternalId) {
        throw new Error('Draft external ID is not supported');
    }
    const user = res.locals.user;
    const claim = await claimStoreClient.retrieveByExternalId(externalId, user);
    if (claim && claim.claimantId !== user.id) {
        throw new errors_1.ForbiddenError();
    }
    if (claim.claimData.defendant.type === partyType_1.PartyType.INDIVIDUAL.value && !claim.retrieveDateOfBirthOfDefendant) {
        res.redirect(paths_2.Paths.dateOfBirthPage.evaluateUri({ externalId: externalId }));
    }
    else {
        res.redirect(paths_2.Paths.paidAmountPage.evaluateUri({ externalId: externalId }));
    }
}));
