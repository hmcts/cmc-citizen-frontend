"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("claim/paths");
const claimStoreClient_1 = require("claims/claimStoreClient");
const draftService_1 = require("services/draftService");
const nodejs_logging_1 = require("@hmcts/nodejs-logging");
const claimState_1 = require("claims/models/claimState");
const featuresBuilder_1 = require("claim/helpers/featuresBuilder");
const HttpStatus = require("http-status-codes");
const errorHandling_1 = require("shared/errorHandling");
const request_1 = require("client/request");
const launchDarklyClient_1 = require("shared/clients/launchDarklyClient");
const claimStoreClient = new claimStoreClient_1.ClaimStoreClient(request_1.noRetryRequest);
const launchDarklyClient = new launchDarklyClient_1.LaunchDarklyClient();
const featuresBuilder = new featuresBuilder_1.FeaturesBuilder(claimStoreClient, launchDarklyClient);
const logger = nodejs_logging_1.Logger.getLogger('router/finish-payment');
/* tslint:disable:no-default-export */
// noinspection JSUnusedGlobalSymbols
exports.default = express.Router()
    .get(paths_1.Paths.finishPaymentController.uri, errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const { externalId } = req.params;
    const user = res.locals.user;
    const draft = res.locals.claimDraft;
    try {
        const claim = await claimStoreClient.retrieveByExternalId(externalId, user);
        logger.info('CLAIM IN FINISH PAYMENT: ', JSON.stringify(claim));
        if (claimState_1.ClaimState[claim.state] === claimState_1.ClaimState.AWAITING_CITIZEN_PAYMENT) {
            const features = await featuresBuilder.features(claim.claimData.amount.totalAmount(), user);
            const createdClaim = await claimStoreClient.createCitizenClaim(draft, user, features);
            if (claimState_1.ClaimState[createdClaim.state] === claimState_1.ClaimState.AWAITING_CITIZEN_PAYMENT) {
                res.redirect(paths_1.Paths.checkAndSendPage.uri);
            }
            else {
                await new draftService_1.DraftService().delete(draft.id, user.bearerToken);
                res.redirect(paths_1.Paths.confirmationPage.evaluateUri({ externalId }));
            }
        }
        else {
            if (draft && draft.id) {
                await new draftService_1.DraftService().delete(draft.id, user.bearerToken);
            }
            res.redirect(paths_1.Paths.confirmationPage.evaluateUri({ externalId }));
        }
    }
    catch (err) {
        if (err.statusCode === HttpStatus.NOT_FOUND) {
            logger.log(`claim with external id ${externalId} not found, redirecting user to check and send`);
            res.redirect(paths_1.Paths.checkAndSendPage.uri);
        }
        else {
            next(err);
        }
    }
}));
