"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const config = require("config");
const Cookies = require("cookies");
const idamClient_1 = require("idam/idamClient");
const nodejs_logging_1 = require("@hmcts/nodejs-logging");
const paths_1 = require("paths");
const jwtExtractor_1 = require("idam/jwtExtractor");
const jwtUtils_1 = require("shared/utils/jwtUtils");
const errorHandling_1 = require("shared/errorHandling");
const sessionCookie = config.get('session.cookieName');
const logger = nodejs_logging_1.Logger.getLogger('routes/logout');
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.logoutReceiver.uri, errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const jwt = jwtExtractor_1.JwtExtractor.extract(req);
    if (jwt) {
        try {
            const user = await idamClient_1.IdamClient.retrieveUserFor(jwt);
            await idamClient_1.IdamClient.invalidateSession(jwt, user.bearerToken);
        }
        catch (error) {
            const { id } = jwtUtils_1.JwtUtils.decodePayload(jwt);
            logger.error(`Failed invalidating JWT for userId  ${id}`);
        }
        const cookies = new Cookies(req, res);
        cookies.set(sessionCookie, '');
    }
    res.redirect(paths_1.Paths.homePage.uri);
}));
