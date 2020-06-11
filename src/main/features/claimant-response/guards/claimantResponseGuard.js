"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const guardFactory_1 = require("response/guards/guardFactory");
const nodejs_logging_1 = require("@hmcts/nodejs-logging");
const paths_1 = require("dashboard/paths");
const logger = nodejs_logging_1.Logger.getLogger('claimant-response/guards/claimantResponseGuard');
class ClaimantResponseGuard {
    static checkClaimantResponseDoesNotExist() {
        const allowed = (res) => {
            const claim = res.locals.claim;
            return claim.claimantResponse === undefined;
        };
        const accessDeniedCallback = (req, res) => {
            logger.warn('State guard: claimant response already exists - redirecting to dashboard');
            res.redirect(paths_1.Paths.dashboardPage.uri);
        };
        return guardFactory_1.GuardFactory.create(allowed, accessDeniedCallback);
    }
}
exports.ClaimantResponseGuard = ClaimantResponseGuard;
