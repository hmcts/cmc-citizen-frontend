"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const guardFactory_1 = require("response/guards/guardFactory");
const nodejs_logging_1 = require("@hmcts/nodejs-logging");
const errors_1 = require("errors");
const logger = nodejs_logging_1.Logger.getLogger('response/guards/fullRejectionGuard');
class FullRejectionGuard {
    static requestHandler() {
        function isRequestAllowed(res) {
            const draft = res.locals.responseDraft;
            return draft.document.isResponseRejected();
        }
        function accessDeniedCallback(req, res) {
            logger.warn('Full Rejection Guard: user tried to access page for full rejection flow');
            throw new errors_1.NotFoundError(req.path);
        }
        return guardFactory_1.GuardFactory.create(isRequestAllowed, accessDeniedCallback);
    }
}
exports.FullRejectionGuard = FullRejectionGuard;
