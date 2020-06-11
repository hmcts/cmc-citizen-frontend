"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const guardFactory_1 = require("response/guards/guardFactory");
const nodejs_logging_1 = require("@hmcts/nodejs-logging");
const paths_1 = require("response/paths");
const claimFeatureToggles_1 = require("utils/claimFeatureToggles");
const logger = nodejs_logging_1.Logger.getLogger('response/guards/responseGuard');
class PartialAdmissionGuard {
    static requestHandler() {
        function isRequestAllowed(res) {
            const draft = res.locals.responseDraft;
            const claim = res.locals.claim;
            return claimFeatureToggles_1.ClaimFeatureToggles.isFeatureEnabledOnClaim(claim) && draft.document.isResponsePartiallyAdmitted();
        }
        function accessDeniedCallback(req, res) {
            const claim = res.locals.claim;
            logger.warn('Partial Admission Guard: user tried to access page for partial admission flow');
            res.redirect(paths_1.Paths.responseTypePage.evaluateUri({ externalId: claim.externalId }));
        }
        return guardFactory_1.GuardFactory.create(isRequestAllowed, accessDeniedCallback);
    }
}
exports.PartialAdmissionGuard = PartialAdmissionGuard;
