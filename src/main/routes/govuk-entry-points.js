"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("paths");
const paths_2 = require("eligibility/paths");
const paths_3 = require("first-contact/paths");
const errorHandling_1 = require("shared/errorHandling");
/* tslint:disable:no-default-export */
// These routes are linked to from gov.uk and cannot be changed without a matching content change on their side
exports.default = express.Router()
    .get(paths_1.Paths.makeClaimReceiver.uri, errorHandling_1.ErrorHandling.apply(async (req, res) => {
    res.redirect(paths_2.Paths.startPage.uri);
}))
    .get(paths_1.Paths.respondToClaimReceiver.uri, errorHandling_1.ErrorHandling.apply(async (req, res) => {
    res.redirect(paths_3.Paths.claimReferencePage.uri);
}))
    .get(paths_1.Paths.returnToClaimReceiver.uri, errorHandling_1.ErrorHandling.apply(async (req, res) => {
    res.redirect(paths_1.Paths.enterClaimNumberPage.uri);
}));
