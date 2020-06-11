"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("claim/paths");
const errorHandling_1 = require("shared/errorHandling");
const claimMiddleware_1 = require("claims/claimMiddleware");
const sealedClaimPdfGenerator_1 = require("services/sealedClaimPdfGenerator");
const onlyDefendantLinkedToClaimCanDoIt_1 = require("guards/onlyDefendantLinkedToClaimCanDoIt");
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.sealedClaimPdfReceiver.uri, claimMiddleware_1.ClaimMiddleware.retrieveByExternalId, onlyDefendantLinkedToClaimCanDoIt_1.OnlyDefendantLinkedToClaimCanDoIt.check(), errorHandling_1.ErrorHandling.apply(sealedClaimPdfGenerator_1.SealedClaimPdfGenerator.requestHandler));
