"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const guardFactory_1 = require("response/guards/guardFactory");
const nodejs_logging_1 = require("@hmcts/nodejs-logging");
const errors_1 = require("errors");
const paths_1 = require("dashboard/paths");
const yesNoOption_1 = require("models/yesNoOption");
const logger = nodejs_logging_1.Logger.getLogger('response/guards/responseGuard');
class ResponseGuard {
    /**
     * Protects response journey from being accessed when response has been already submitted. Request in such scenario
     * will result in redirect to defendant dashboard. In opposite scenario where response has not been made yet,
     * the request will be processed.
     */
    static checkResponseDoesNotExist() {
        const allowed = (res) => {
            const claim = res.locals.claim;
            return claim.response === undefined && claim.paperResponse !== yesNoOption_1.YesNoOption.YES;
        };
        const accessDeniedCallback = (req, res) => {
            logger.warn('State guard: response already exists - redirecting to dashboard');
            res.redirect(paths_1.Paths.dashboardPage.uri);
        };
        return guardFactory_1.GuardFactory.create(allowed, accessDeniedCallback);
    }
    /**
     * Protects response journey from being accessed when response has not been submitted yet. Request in such scenario
     * will result in rendering not found page. In opposite scenario where response has already been made,
     * the request will be processed.
     */
    static checkResponseExists() {
        const allowed = (res) => {
            const claim = res.locals.claim;
            return claim.response !== undefined;
        };
        const accessDeniedCallback = (req, res) => {
            logger.warn('State guard: no response exists - rendering not found page');
            throw new errors_1.NotFoundError(req.path);
        };
        return guardFactory_1.GuardFactory.create(allowed, accessDeniedCallback);
    }
}
exports.ResponseGuard = ResponseGuard;
