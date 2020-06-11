"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const config = require("config");
const paths_1 = require("claim/paths");
const payClient_1 = require("payment-hub-client/payClient");
const feesClient_1 = require("fees/feesClient");
const claimStoreClient_1 = require("claims/claimStoreClient");
const callbackBuilder_1 = require("utils/callbackBuilder");
const interestUtils_1 = require("shared/interestUtils");
const draftService_1 = require("services/draftService");
const serviceTokenFactoryImpl_1 = require("shared/security/serviceTokenFactoryImpl");
const nodejs_logging_1 = require("@hmcts/nodejs-logging");
const fee_1 = require("payment-hub-client/fee");
const HttpStatus = require("http-status-codes");
const featureToggles_1 = require("utils/featureToggles");
const customEventTracker_1 = require("logging/customEventTracker");
const mockPayClient_1 = require("mock-clients/mockPayClient");
const featuresBuilder_1 = require("claim/helpers/featuresBuilder");
const launchDarklyClient_1 = require("shared/clients/launchDarklyClient");
const claimStoreClient = new claimStoreClient_1.ClaimStoreClient();
const launchDarklyClient = new launchDarklyClient_1.LaunchDarklyClient();
const featuresBuilder = new featuresBuilder_1.FeaturesBuilder(claimStoreClient, launchDarklyClient);
const logger = nodejs_logging_1.Logger.getLogger('router/pay');
const event = config.get('fees.issueFee.event');
const channel = config.get('fees.channel.online');
const getPayClient = async (req) => {
    const authToken = await new serviceTokenFactoryImpl_1.ServiceAuthTokenFactoryImpl().get();
    if (featureToggles_1.FeatureToggles.isEnabled('mockPay')) {
        return new mockPayClient_1.MockPayClient(req.url);
    }
    return new payClient_1.GovPayClient(authToken);
};
const getReturnURL = (req, externalId) => {
    return callbackBuilder_1.buildURL(req, paths_1.Paths.finishPaymentReceiver.evaluateUri({ externalId: externalId }));
};
function logPaymentError(id, payment) {
    logError(id, payment, 'Payment might have failed, see payment information: ');
}
function logError(id, payment, message) {
    logger.error(`${message} (User Id : ${id}, Payment: ${JSON.stringify(payment)})`);
}
async function successHandler(req, res, next) {
    const draft = res.locals.claimDraft;
    const user = res.locals.user;
    const externalId = draft.document.externalId;
    let savedClaim;
    try {
        const features = await featuresBuilder.features(draft.document.amount.totalAmount(), user);
        savedClaim = await claimStoreClient.saveClaim(draft, user, features);
    }
    catch (err) {
        if (err.statusCode === HttpStatus.INTERNAL_SERVER_ERROR || err.statusCode === HttpStatus.SERVICE_UNAVAILABLE) {
            logError(user.id, draft.document.claimant.payment, `Payment processed successfully but there was a problem saving claim '${externalId}' to the claim store.`);
            customEventTracker_1.trackCustomEvent(`Post payment successful but unable to store claim in claim-store with externalId: ${externalId}`, {
                externalId: externalId,
                payment: draft.document.claimant.payment,
                error: err
            });
            next(err);
            return;
        }
        else if (err.statusCode === HttpStatus.CONFLICT) {
            logError(user.id, draft.document.claimant.payment, `Payment processed successfully and claim ${externalId} already exists.`);
            savedClaim = await claimStoreClient.retrieveByExternalId(externalId, user);
        }
    }
    if (!savedClaim) {
        throw new Error(`Error saving claim: ${externalId}`);
    }
    const payClient = await getPayClient(req);
    const paymentReference = draft.document.claimant.payment.reference;
    const ccdCaseNumber = savedClaim.ccdCaseId === undefined ? 'UNKNOWN' : String(savedClaim.ccdCaseId);
    await payClient.update(user, paymentReference, savedClaim.externalId, ccdCaseNumber);
    await new draftService_1.DraftService().delete(draft.id, user.bearerToken);
    res.redirect(paths_1.Paths.confirmationPage.evaluateUri({ externalId: externalId }));
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.startPaymentReceiver.uri, async (req, res, next) => {
    const draft = res.locals.claimDraft;
    const user = res.locals.user;
    const externalId = draft.document.externalId;
    try {
        if (!externalId) {
            throw new Error(`externalId is missing from the draft claim. User Id : ${user.id}`);
        }
        const amount = await interestUtils_1.draftClaimAmountWithInterest(draft.document);
        if (!amount) {
            throw new Error('No amount entered, you cannot pay yet');
        }
        const paymentRef = draft.document.claimant.payment ? draft.document.claimant.payment.reference : undefined;
        if (paymentRef) {
            const payClient = await getPayClient(req);
            const paymentResponse = await payClient.retrieve(user, paymentRef);
            if (paymentResponse !== undefined) {
                if (paymentResponse.status === 'Success') {
                    return res.redirect(paths_1.Paths.finishPaymentReceiver.evaluateUri({ externalId: externalId }));
                }
            }
            else if (draft.document.claimant.payment['state'] && draft.document.claimant.payment['state']['status'] === 'success') {
                logError(user.id, draft.document.claimant.payment, 'Successful payment from V1 version of the API cannot be handled');
            }
        }
        const feeOutcome = await feesClient_1.FeesClient.calculateFee(event, amount, channel);
        const payClient = await getPayClient(req);
        const payment = await payClient.create(user, externalId, [new fee_1.Fee(feeOutcome.amount, feeOutcome.code, feeOutcome.version)], getReturnURL(req, draft.document.externalId));
        draft.document.claimant.payment = payment;
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        res.redirect(payment._links.next_url.href);
    }
    catch (err) {
        customEventTracker_1.trackCustomEvent(`Pre payment error for externalId: ${externalId}`, {
            externalId: externalId,
            payment: draft.document.claimant.payment,
            error: err
        });
        logPaymentError(user.id, draft.document.claimant.payment);
        next(err);
    }
})
    .get(paths_1.Paths.finishPaymentReceiver.uri, async (req, res, next) => {
    const draft = res.locals.claimDraft;
    const user = res.locals.user;
    try {
        const { externalId } = req.params;
        const paymentReference = draft.document.claimant.payment.reference;
        if (!paymentReference) {
            return res.redirect(paths_1.Paths.confirmationPage.evaluateUri({ externalId: externalId }));
        }
        const payClient = await getPayClient(req);
        const payment = await payClient.retrieve(user, paymentReference);
        draft.document.claimant.payment = payment;
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        const status = payment.status;
        // https://gds-payments.gelato.io/docs/versions/1.0.0/api-reference
        switch (status) {
            case 'Cancelled':
            case 'Failed':
                logPaymentError(user.id, payment);
                res.redirect(paths_1.Paths.checkAndSendPage.uri);
                break;
            case 'Success':
                await successHandler(req, res, next);
                break;
            default:
                logPaymentError(user.id, payment);
                next(new Error(`Payment failed. Status ${status} is returned by the service`));
        }
    }
    catch (err) {
        const { externalId } = req.params;
        customEventTracker_1.trackCustomEvent(`Post payment error for externalId: ${externalId}`, {
            externalId: externalId,
            payment: draft.document.claimant.payment,
            error: err
        });
        logPaymentError(user.id, draft.document.claimant.payment);
        next(err);
    }
});
