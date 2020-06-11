"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("claim/paths");
const claimStoreClient_1 = require("claims/claimStoreClient");
const claimState_1 = require("claims/models/claimState");
const nodejs_logging_1 = require("@hmcts/nodejs-logging");
const HttpStatus = require("http-status-codes");
const errorHandling_1 = require("shared/errorHandling");
const request_1 = require("client/request");
const logger = nodejs_logging_1.Logger.getLogger('router/initiate-payment');
const claimStoreClient = new claimStoreClient_1.ClaimStoreClient(request_1.noRetryRequest);
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.initiatePaymentController.uri, errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const draft = res.locals.claimDraft;
    const user = res.locals.user;
    const externalId = draft.document.externalId;
    if (!externalId) {
        throw new Error(`externalId is missing from the draft claim. User Id : ${user.id}`);
    }
    let existingClaim;
    try {
        existingClaim = await claimStoreClient.retrieveByExternalId(externalId, user);
    }
    catch (err) {
        if (err.statusCode === HttpStatus.NOT_FOUND) {
            const paymentRef = draft.document.claimant.payment ? draft.document.claimant.payment.reference : undefined;
            logger.info(`payment for claim with external id ${externalId} is ${paymentRef}`);
            if (paymentRef) {
                return res.redirect(paths_1.Paths.startPaymentReceiver.uri);
            }
            else {
                const nextUrl = await claimStoreClient.initiatePayment(draft, user);
                logger.info('NEXT URL PAYMENT: ', nextUrl);
                return res.redirect(nextUrl);
            }
        }
        else {
            logger.error(`error retrieving claim with external id ${externalId}`);
            throw err;
        }
    }
    if (claimState_1.ClaimState[existingClaim.state] === claimState_1.ClaimState.AWAITING_CITIZEN_PAYMENT) {
        const nextUrl = await claimStoreClient.resumePayment(draft, user);
        res.redirect(nextUrl);
    }
    else {
        res.redirect(paths_1.Paths.confirmationPage.evaluateUri({ externalId }));
    }
}));
