"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const store_1 = require("eligibility/store");
const paths_1 = require("paths");
const paths_2 = require("claim/paths");
const paths_3 = require("dashboard/paths");
const paths_4 = require("eligibility/paths");
const paths_5 = require("first-contact/paths");
const claimStoreClient_1 = require("claims/claimStoreClient");
const errorHandling_1 = require("shared/errorHandling");
const Cookies = require("cookies");
const config = require("config");
const idamClient_1 = require("idam/idamClient");
const callbackBuilder_1 = require("utils/callbackBuilder");
const jwtExtractor_1 = require("idam/jwtExtractor");
const authorizationMiddleware_1 = require("idam/authorizationMiddleware");
const nodejs_logging_1 = require("@hmcts/nodejs-logging");
const oAuthHelper_1 = require("idam/oAuthHelper");
const draftService_1 = require("services/draftService");
const customEventTracker_1 = require("logging/customEventTracker");
const logger = nodejs_logging_1.Logger.getLogger('router/receiver');
const sessionCookie = config.get('session.cookieName');
const stateCookieName = 'state';
const draftService = new draftService_1.DraftService();
const claimStoreClient = new claimStoreClient_1.ClaimStoreClient();
const eligibilityStore = new store_1.CookieEligibilityStore();
async function getOAuthAccessToken(req, receiver) {
    if (req.query.state !== oAuthHelper_1.OAuthHelper.getStateCookie(req)) {
        customEventTracker_1.trackCustomEvent('State cookie mismatch (citizen)', {
            requestValue: req.query.state,
            cookieValue: oAuthHelper_1.OAuthHelper.getStateCookie(req)
        });
    }
    const authToken = await idamClient_1.IdamClient.exchangeCode(req.query.code, callbackBuilder_1.buildURL(req, receiver.uri));
    if (authToken) {
        return authToken.accessToken;
    }
    return Promise.reject();
}
async function getAuthToken(req, receiver = paths_1.Paths.receiver, checkCookie = true) {
    let authenticationToken;
    if (req.query.code) {
        authenticationToken = await getOAuthAccessToken(req, receiver);
    }
    else if (checkCookie) {
        authenticationToken = jwtExtractor_1.JwtExtractor.extract(req);
    }
    return authenticationToken;
}
function isDefendantFirstContactPinLogin(req) {
    return req.query && req.query.state && req.query.state.match(/[0-9]{3}MC[0-9]{3}/);
}
function loginErrorHandler(req, res, cookies, next, err, receiver = paths_1.Paths.receiver) {
    if (authorizationMiddleware_1.hasTokenExpired(err)) {
        cookies.set(sessionCookie);
        logger.debug(`Protected path - expired auth token - access to ${req.path} rejected`);
        return res.redirect(oAuthHelper_1.OAuthHelper.forLogin(req, res, receiver));
    }
    cookies.set(stateCookieName, '');
    return next(err);
}
async function retrieveRedirectForLandingPage(req, res) {
    const eligibility = eligibilityStore.read(req, res);
    if (eligibility.eligible) {
        return paths_2.Paths.taskListPage.uri;
    }
    const user = res.locals.user;
    const noClaimIssued = (await claimStoreClient.retrieveByClaimantId(user)).length === 0;
    const noClaimReceived = (await claimStoreClient.retrieveByDefendantId(user)).length === 0;
    const noDraftClaims = (await draftService.find('claim', '100', user.bearerToken, value => value)).length === 0;
    const noDraftResponses = (await draftService.find('response', '100', user.bearerToken, value => value)).length === 0;
    if (noClaimIssued && noClaimReceived && noDraftClaims && noDraftResponses) {
        return paths_4.Paths.startPage.uri;
    }
    else {
        return paths_3.Paths.dashboardPage.uri;
    }
}
function setAuthCookie(cookies, authenticationToken) {
    cookies.set(sessionCookie, authenticationToken);
    cookies.set(stateCookieName, '');
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.receiver.uri, errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const cookies = new Cookies(req, res);
    let user;
    try {
        const authenticationToken = await getAuthToken(req);
        if (authenticationToken) {
            user = await idamClient_1.IdamClient.retrieveUserFor(authenticationToken);
            res.locals.isLoggedIn = true;
            res.locals.user = user;
            setAuthCookie(cookies, authenticationToken);
        }
    }
    catch (err) {
        return loginErrorHandler(req, res, cookies, next, err);
    }
    if (res.locals.isLoggedIn) {
        if (isDefendantFirstContactPinLogin(req)) {
            // re-set state cookie as it was cleared above, we need it in this case
            cookies.set(stateCookieName, req.query.state);
            return res.redirect(paths_5.Paths.claimSummaryPage.uri);
        }
        else {
            await claimStoreClient.linkDefendant(user);
            res.redirect(await retrieveRedirectForLandingPage(req, res));
        }
    }
    else {
        if (res.locals.code) {
            customEventTracker_1.trackCustomEvent('Authentication token undefined (jwt defined)', { requestValue: req.query.state });
        }
        res.redirect(oAuthHelper_1.OAuthHelper.forLogin(req, res));
    }
}))
    .get(paths_1.Paths.linkDefendantReceiver.uri, errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const cookies = new Cookies(req, res);
    try {
        const authenticationToken = await getAuthToken(req, paths_1.Paths.linkDefendantReceiver, false);
        if (authenticationToken) {
            res.locals.user = await idamClient_1.IdamClient.retrieveUserFor(authenticationToken);
            res.locals.isLoggedIn = true;
            setAuthCookie(cookies, authenticationToken);
            res.redirect(paths_1.Paths.receiver.uri);
            return;
        }
    }
    catch (err) {
        return loginErrorHandler(req, res, cookies, next, err, paths_1.Paths.linkDefendantReceiver);
    }
    res.redirect(oAuthHelper_1.OAuthHelper.forLogin(req, res, paths_1.Paths.linkDefendantReceiver));
}));
