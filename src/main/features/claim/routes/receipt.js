"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("claim/paths");
const claimMiddleware_1 = require("claims/claimMiddleware");
const documentsClient_1 = require("documents/documentsClient");
const errorHandling_1 = require("shared/errorHandling");
const downloadUtils_1 = require("utils/downloadUtils");
const documentsClient = new documentsClient_1.DocumentsClient();
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.receiptReceiver.uri, claimMiddleware_1.ClaimMiddleware.retrieveByExternalId, errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const claim = res.locals.claim;
    const pdf = await documentsClient.getClaimIssueReceiptPDF(claim.externalId, res.locals.user.bearerToken);
    downloadUtils_1.DownloadUtils.downloadPDF(res, pdf, `${claim.claimNumber}-claim-form-claimant-copy`);
}));
