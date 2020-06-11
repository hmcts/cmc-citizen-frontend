"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("offer/paths");
const paths_2 = require("response/paths");
const errorHandling_1 = require("shared/errorHandling");
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.offerConfirmationPage.uri, errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const claim = res.locals.claim;
    const user = res.locals.user;
    res.render(paths_1.Paths.offerConfirmationPage.associatedView, {
        claim: claim,
        submittedOn: claim.respondedAt,
        defendantEmail: user.email,
        responsePaths: paths_2.Paths
    });
}));
