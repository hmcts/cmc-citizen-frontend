"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paths_1 = require("dashboard/paths");
const nodejs_logging_1 = require("@hmcts/nodejs-logging");
const logger = nodejs_logging_1.Logger.getLogger('response/guards/countyCourtJudgmentRequestedGuard');
class CountyCourtJudgmentRequestedGuard {
    static requestHandler(req, res, next) {
        const claim = res.locals.claim;
        if (claim.countyCourtJudgmentRequestedAt) {
            logger.warn('State guard: CCJ already requested - redirecting to dashboard');
            return res.redirect(paths_1.Paths.dashboardPage.uri);
        }
        else {
            next();
        }
    }
}
exports.CountyCourtJudgmentRequestedGuard = CountyCourtJudgmentRequestedGuard;
