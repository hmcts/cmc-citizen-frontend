"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("dashboard/paths");
const errorHandling_1 = require("shared/errorHandling");
const claimStoreClient_1 = require("claims/claimStoreClient");
const claimStoreClient = new claimStoreClient_1.ClaimStoreClient();
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.contactThemPage.uri, errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const { externalId } = req.params;
    res.render(paths_1.Paths.contactThemPage.associatedView, {
        claim: await claimStoreClient.retrieveByExternalId(externalId, res.locals.user)
    });
}));
