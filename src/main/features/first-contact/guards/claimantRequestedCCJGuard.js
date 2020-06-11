"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paths_1 = require("first-contact/paths");
const nodejs_logging_1 = require("@hmcts/nodejs-logging");
const logger = nodejs_logging_1.Logger.getLogger('first-contact/guards/claimantRequestedCCJGuard');
class ClaimantRequestedCCJGuard {
    static async requestHandler(req, res, next) {
        const claim = res.locals.claim;
        if (claim.countyCourtJudgmentRequestedAt !== undefined) {
            logger.error('Defendant cannot respond to the claim with a CCJ against them - redirecting to handoff page. ');
            res.redirect(paths_1.ErrorPaths.ccjRequestedHandoffPage.uri);
        }
        else {
            next();
        }
    }
}
exports.ClaimantRequestedCCJGuard = ClaimantRequestedCCJGuard;
