"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const paths_1 = require("first-contact/paths");
const authorizationMiddleware_1 = require("idam/authorizationMiddleware");
const routerFinder_1 = require("shared/router/routerFinder");
function defendantFirstContactRequestHandler() {
    function accessDeniedCallback(req, res) {
        res.redirect(paths_1.Paths.startPage.uri);
    }
    // IDAM doesn't set cmc-private-beta yet so we don't check for it
    const requiredRoles = [
        'letter-holder'
    ];
    const unprotectedPaths = [
        paths_1.Paths.startPage.uri,
        paths_1.Paths.claimReferencePage.uri,
        paths_1.ErrorPaths.claimSummaryAccessDeniedPage.uri
    ];
    return authorizationMiddleware_1.AuthorizationMiddleware.requestHandler(requiredRoles, accessDeniedCallback, unprotectedPaths);
}
class Feature {
    enableFor(app) {
        if (app.settings.nunjucksEnv && app.settings.nunjucksEnv.globals) {
            app.settings.nunjucksEnv.globals.FirstContactPaths = paths_1.Paths;
        }
        app.all('/first-contact/*', defendantFirstContactRequestHandler());
        app.use('/', routerFinder_1.RouterFinder.findAll(path.join(__dirname, 'routes')));
    }
}
exports.Feature = Feature;
