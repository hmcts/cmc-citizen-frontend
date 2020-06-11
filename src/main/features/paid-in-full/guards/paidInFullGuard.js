"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const guardFactory_1 = require("features/response/guards/guardFactory");
const errors_1 = require("errors");
class PaidInFullGuard {
    /**
     * Throws Forbidden error if user is not the claimant in the case
     *
     * @returns {express.RequestHandler} - request handler middleware
     */
    static check() {
        return guardFactory_1.GuardFactory.create((res) => {
            const claim = res.locals.claim;
            const user = res.locals.user;
            return !claim.moneyReceivedOn && claim.claimantId === user.id;
        }, (req, res) => {
            throw new errors_1.ForbiddenError();
        });
    }
}
exports.PaidInFullGuard = PaidInFullGuard;
