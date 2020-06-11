"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paths_1 = require("dashboard/paths");
const nodejs_logging_1 = require("@hmcts/nodejs-logging");
const guardFactory_1 = require("response/guards/guardFactory");
const logger = nodejs_logging_1.Logger.getLogger('offer/guards/offerAcceptedGuard');
class OfferAcceptedGuard {
    static check() {
        return guardFactory_1.GuardFactory.create((res) => {
            const claim = res.locals.claim;
            const user = res.locals.user;
            if (claim.settlementReachedAt) {
                logger.warn('State guard: offer settlement reached, redirecting to dashboard');
                return false;
            }
            else if (user.id === claim.claimantId && claim.claimantId !== claim.defendantId
                && claim.settlement.isOfferResponded()) {
                logger.warn('State guard: offer already accepted, redirecting to dashboard');
                return false;
            }
            else {
                return true;
            }
        }, (req, res) => {
            res.redirect(paths_1.Paths.dashboardPage.uri);
        });
    }
}
exports.OfferAcceptedGuard = OfferAcceptedGuard;
