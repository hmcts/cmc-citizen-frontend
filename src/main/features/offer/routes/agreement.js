"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("offer/paths");
const errorHandling_1 = require("shared/errorHandling");
const documentsClient_1 = require("documents/documentsClient");
const downloadUtils_1 = require("utils/downloadUtils");
const documentsClient = new documentsClient_1.DocumentsClient();
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.agreementReceiver.uri, errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const { externalId } = req.params;
    const pdf = await documentsClient.getSettlementAgreementPDF(externalId, res.locals.user.bearerToken);
    const claim = res.locals.claim;
    downloadUtils_1.DownloadUtils.downloadPDF(res, pdf, `${claim.claimNumber}-settlement-agreement`);
}));
