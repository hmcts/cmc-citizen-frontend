"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const claimStoreClient_1 = require("claims/claimStoreClient");
const paths_1 = require("first-contact/paths");
const nodejs_logging_1 = require("@hmcts/nodejs-logging");
const oAuthHelper_1 = require("idam/oAuthHelper");
const logger = nodejs_logging_1.Logger.getLogger('first-contact/guards/claimReferenceMatchesGuard');
const claimStoreClient = new claimStoreClient_1.ClaimStoreClient();
class ClaimReferenceMatchesGuard {
    static async requestHandler(req, res, next) {
        try {
            const reference = ClaimReferenceMatchesGuard.getClaimRef(req);
            const user = res.locals.user;
            const claim = await claimStoreClient.retrieveByLetterHolderId(user.id, user.bearerToken);
            res.locals.claim = claim;
            if (claim.claimNumber !== reference) {
                logger.error('Claim reference mismatch - redirecting to access denied page');
                res.redirect(paths_1.ErrorPaths.claimSummaryAccessDeniedPage.uri);
            }
            else {
                next();
            }
        }
        catch (err) {
            next(err);
        }
    }
    static getClaimRef(req) {
        return oAuthHelper_1.OAuthHelper.getStateCookie(req);
    }
}
exports.ClaimReferenceMatchesGuard = ClaimReferenceMatchesGuard;
