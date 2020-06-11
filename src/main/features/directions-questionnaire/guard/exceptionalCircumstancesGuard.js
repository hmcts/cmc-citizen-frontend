"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paths_1 = require("dashboard/paths");
const nodejs_logging_1 = require("@hmcts/nodejs-logging");
const DirectionsQuestionnaireHelper = require("directions-questionnaire/helpers/directionsQuestionnaireHelper");
const logger = nodejs_logging_1.Logger.getLogger('directions-questionnaire/guards/exceptionalCircumstancesGuard');
class ExceptionalCircumstancesGuard {
    static requestHandler(req, res, next) {
        const claim = res.locals.claim;
        const user = res.locals.user;
        if (DirectionsQuestionnaireHelper.getUsersRole(claim, user) === DirectionsQuestionnaireHelper.getPreferredParty(claim)) {
            logger.info('State guard: user is preferred party in court hearing location - redirecting to dashboard');
            res.redirect(paths_1.Paths.dashboardPage.uri);
        }
        else {
            next();
        }
    }
}
exports.ExceptionalCircumstancesGuard = ExceptionalCircumstancesGuard;
