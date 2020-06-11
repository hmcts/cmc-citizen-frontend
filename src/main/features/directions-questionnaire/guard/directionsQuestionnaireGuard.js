"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paths_1 = require("dashboard/paths");
const nodejs_logging_1 = require("@hmcts/nodejs-logging");
const claimFeatureToggles_1 = require("utils/claimFeatureToggles");
const logger = nodejs_logging_1.Logger.getLogger('directions-questionnaire/guards/directionsQuestionnaireGuard');
class DirectionsQuestionnaireGuard {
    static requestHandler(req, res, next) {
        const claim = res.locals.claim;
        if (!claimFeatureToggles_1.ClaimFeatureToggles.isFeatureEnabledOnClaim(claim, 'directionsQuestionnaire')) {
            logger.warn('State guard: direction questionnaire feature not found - redirecting to dashboard');
            res.redirect(paths_1.Paths.dashboardPage.uri);
        }
        else {
            next();
        }
    }
}
exports.DirectionsQuestionnaireGuard = DirectionsQuestionnaireGuard;
