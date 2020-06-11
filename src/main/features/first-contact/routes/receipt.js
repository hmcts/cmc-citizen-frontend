"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("first-contact/paths");
const errorHandling_1 = require("shared/errorHandling");
const claimReferenceMatchesGuard_1 = require("first-contact/guards/claimReferenceMatchesGuard");
const claimantRequestedCCJGuard_1 = require("first-contact/guards/claimantRequestedCCJGuard");
const sealedClaimPdfGenerator_1 = require("services/sealedClaimPdfGenerator");
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.receiptReceiver.uri, claimReferenceMatchesGuard_1.ClaimReferenceMatchesGuard.requestHandler, claimantRequestedCCJGuard_1.ClaimantRequestedCCJGuard.requestHandler, errorHandling_1.ErrorHandling.apply(sealedClaimPdfGenerator_1.SealedClaimPdfGenerator.requestHandler));
