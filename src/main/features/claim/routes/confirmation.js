"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("claim/paths");
const claimStoreClient_1 = require("claims/claimStoreClient");
const errorHandling_1 = require("shared/errorHandling");
const claimStoreClient = new claimStoreClient_1.ClaimStoreClient();
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.confirmationPage.uri, errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const { externalId } = req.params;
    const user = res.locals.user;
    const claim = await claimStoreClient.retrieveByExternalId(externalId, user);
    res.render(paths_1.Paths.confirmationPage.associatedView, { claim: claim });
}));
