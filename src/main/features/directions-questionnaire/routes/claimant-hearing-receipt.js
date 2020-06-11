"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("directions-questionnaire/paths");
const documentsClient_1 = require("documents/documentsClient");
const errorHandling_1 = require("shared/errorHandling");
const downloadUtils_1 = require("utils/downloadUtils");
const documentsClient = new documentsClient_1.DocumentsClient();
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.claimantHearingRequirementsReceiver.uri, errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const claim = res.locals.claim;
    const user = res.locals.user;
    if (claim.claimantId === user.id) {
        const pdf = await documentsClient.getClaimantHearingRequirementPDF(claim.externalId, res.locals.user.bearerToken);
        downloadUtils_1.DownloadUtils.downloadPDF(res, pdf, `${claim.claimNumber}-claimant-directions-questionnaire-online-claimant-copy`);
    }
    else if (claim.defendantId === user.id) {
        const pdf = await documentsClient.getClaimantHearingRequirementPDF(claim.externalId, res.locals.user.bearerToken);
        downloadUtils_1.DownloadUtils.downloadPDF(res, pdf, `${claim.claimNumber}-claimant-directions-questionnaire-online-defendant-copy`);
    }
}));
