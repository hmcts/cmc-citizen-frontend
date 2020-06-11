"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paths_1 = require("dashboard/paths");
const nodejs_logging_1 = require("@hmcts/nodejs-logging");
const yesNoOption_1 = require("models/yesNoOption");
const logger = nodejs_logging_1.Logger.getLogger('ccj/guards/ccjGuard');
class CCJGuard {
    static async requestHandler(req, res, next) {
        const claim = res.locals.claim;
        if ((claim.eligibleForCCJ
            || claim.eligibleForCCJAfterBreachedSettlementTerms
            || claim.isSettlementAgreementRejected)
            && !(claim.paperResponse === yesNoOption_1.YesNoOption.YES)) {
            next();
        }
        else {
            logger.warn(`Claim ${claim.claimNumber} not eligible for a CCJ - redirecting to dashboard page`);
            res.redirect(paths_1.Paths.dashboardPage.uri);
        }
    }
}
exports.CCJGuard = CCJGuard;
