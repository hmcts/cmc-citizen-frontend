"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paths_1 = require("response/paths");
class MoreTimeRequestRequiredGuard {
    static requestHandler(req, res, next) {
        const claim = res.locals.claim;
        if (claim.moreTimeRequested) {
            next();
        }
        else {
            res.redirect(paths_1.Paths.moreTimeRequestPage.evaluateUri({ externalId: claim.externalId }));
        }
    }
}
exports.MoreTimeRequestRequiredGuard = MoreTimeRequestRequiredGuard;
