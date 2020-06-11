"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("dashboard/paths");
const guardFactory_1 = require("response/guards/guardFactory");
const paths_2 = require("settlement-agreement/paths");
const stateGuardRequestHandler = guardFactory_1.GuardFactory.create((res) => {
    const claim = res.locals.claim;
    return claim.settlement.isOfferRejected() || claim.settlement.isOfferAccepted();
}, (req, res) => {
    res.redirect(paths_1.Paths.dashboardPage.uri);
});
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_2.Paths.settlementAgreementConfirmation.uri, stateGuardRequestHandler, (req, res) => {
    const claim = res.locals.claim;
    res.render(paths_2.Paths.settlementAgreementConfirmation.associatedView, {
        claim: claim
    });
});
