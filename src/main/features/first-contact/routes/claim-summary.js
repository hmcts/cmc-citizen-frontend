"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const config = require("config");
const Cookies = require("cookies");
const paths_1 = require("first-contact/paths");
const claimReferenceMatchesGuard_1 = require("first-contact/guards/claimReferenceMatchesGuard");
const jwtExtractor_1 = require("idam/jwtExtractor");
const claimantRequestedCCJGuard_1 = require("first-contact/guards/claimantRequestedCCJGuard");
const oAuthHelper_1 = require("idam/oAuthHelper");
const interestUtils_1 = require("shared/interestUtils");
const sessionCookie = config.get('session.cookieName');
function receiverPath(req, res) {
    return `${oAuthHelper_1.OAuthHelper.forUplift(req, res)}&jwt=${jwtExtractor_1.JwtExtractor.extract(req)}`;
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.claimSummaryPage.uri, claimReferenceMatchesGuard_1.ClaimReferenceMatchesGuard.requestHandler, claimantRequestedCCJGuard_1.ClaimantRequestedCCJGuard.requestHandler, async (req, res, next) => {
    const claim = res.locals.claim;
    const interestData = await interestUtils_1.getInterestDetails(claim);
    res.render(paths_1.Paths.claimSummaryPage.associatedView, {
        interestData: interestData
    });
})
    .post(paths_1.Paths.claimSummaryPage.uri, (req, res) => {
    new Cookies(req, res).set(sessionCookie, '');
    res.redirect(receiverPath(req, res));
});
