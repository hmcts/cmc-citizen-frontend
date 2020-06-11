"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paths_1 = require("dashboard/paths");
class AlreadyPaidInFullGuard {
    static async requestHandler(req, res, next) {
        const claim = res.locals.claim;
        const user = res.locals.user;
        if (!!claim && !!user && user.id === claim.defendantId && claim.moneyReceivedOn) {
            res.redirect(paths_1.Paths.defendantPage.uri.replace(':externalId', claim.externalId));
        }
        else {
            next();
        }
    }
}
exports.AlreadyPaidInFullGuard = AlreadyPaidInFullGuard;
