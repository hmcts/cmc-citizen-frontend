"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("response/paths");
const paths_2 = require("dashboard/paths");
const guardFactory_1 = require("response/guards/guardFactory");
const stateGuardRequestHandler = guardFactory_1.GuardFactory.create((res) => {
    const claim = res.locals.claim;
    return claim.respondedAt !== undefined;
}, (req, res) => {
    res.redirect(paths_2.Paths.dashboardPage.uri);
});
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.confirmationPage.uri, stateGuardRequestHandler, (req, res) => {
    const claim = res.locals.claim;
    res.render(paths_1.Paths.confirmationPage.associatedView, {
        claim: claim
    });
});
