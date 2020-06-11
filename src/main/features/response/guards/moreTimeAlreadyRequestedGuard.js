"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paths_1 = require("response/paths");
class MoreTimeAlreadyRequestedGuard {
    static requestHandler(req, res, next) {
        const claim = res.locals.claim;
        if (claim.moreTimeRequested) {
            res.redirect(paths_1.Paths.moreTimeConfirmationPage.evaluateUri({ externalId: claim.externalId }));
        }
        else {
            next();
        }
    }
}
exports.MoreTimeAlreadyRequestedGuard = MoreTimeAlreadyRequestedGuard;
