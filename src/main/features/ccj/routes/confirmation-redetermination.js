"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("ccj/paths");
const errorHandling_1 = require("shared/errorHandling");
const madeBy_1 = require("claims/models/madeBy");
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.redeterminationConfirmationPage.uri, errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const claim = res.locals.claim;
    res.render(paths_1.Paths.redeterminationConfirmationPage.associatedView, {
        defendantName: claim.claimData.defendant.name,
        claimantName: claim.claimData.claimant.name,
        reDeterminationRequestedAt: claim.reDeterminationRequestedAt,
        reDeterminationByClaimant: claim.reDetermination && claim.reDetermination.partyType === madeBy_1.MadeBy.CLAIMANT
    });
}));
