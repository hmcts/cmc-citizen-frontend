"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("response/paths");
const paths_2 = require("claim/paths");
const interestUtils_1 = require("shared/interestUtils");
const errorHandling_1 = require("shared/errorHandling");
function isCurrentUserLinkedToClaim(user, claim) {
    return claim.defendantId === user.id;
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.claimDetailsPage.uri, errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const claim = res.locals.claim;
    const interestData = await interestUtils_1.getInterestDetails(claim);
    res.render(paths_1.Paths.claimDetailsPage.associatedView, {
        interestData: interestData,
        pdfUrl: isCurrentUserLinkedToClaim(res.locals.user, res.locals.claim) ? paths_2.Paths.sealedClaimPdfReceiver : paths_2.Paths.receiptReceiver
    });
}));
