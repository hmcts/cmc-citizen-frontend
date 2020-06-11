"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const authorizationMiddleware_1 = require("idam/authorizationMiddleware");
const routerFinder_1 = require("shared/router/routerFinder");
const nodejs_logging_1 = require("@hmcts/nodejs-logging");
const oAuthHelper_1 = require("idam/oAuthHelper");
const logger = nodejs_logging_1.Logger.getLogger('testing-support');
function defendantResponseRequestHandler() {
    function accessDeniedCallback(req, res) {
        res.redirect(oAuthHelper_1.OAuthHelper.forLogin(req, res));
    }
    const requiredRoles = [
        'citizen'
    ];
    const unprotectedPaths = [];
    return authorizationMiddleware_1.AuthorizationMiddleware.requestHandler(requiredRoles, accessDeniedCallback, unprotectedPaths);
}
class TestingSupportFeature {
    enableFor(app) {
        logger.info('Testing support activated');
        app.all('/testing-support*', defendantResponseRequestHandler());
        app.use('/', routerFinder_1.RouterFinder.findAll(path.join(__dirname, 'routes')));
    }
}
exports.TestingSupportFeature = TestingSupportFeature;
