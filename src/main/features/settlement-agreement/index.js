"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const routerFinder_1 = require("shared/router/routerFinder");
const claimMiddleware_1 = require("claims/claimMiddleware");
const authorizationMiddleware_1 = require("idam/authorizationMiddleware");
const paths_1 = require("offer/paths");
const oAuthHelper_1 = require("idam/oAuthHelper");
const settlementAgreementGuard_1 = require("settlement-agreement/guards/settlementAgreementGuard");
const onlyDefendantLinkedToClaimCanDoIt_1 = require("guards/onlyDefendantLinkedToClaimCanDoIt");
const alreadyPaidInFullGuard_1 = require("guards/alreadyPaidInFullGuard");
function requestHandler() {
    function accessDeniedCallback(req, res) {
        res.redirect(oAuthHelper_1.OAuthHelper.forLogin(req, res));
    }
    const requiredRoles = [
        'citizen'
    ];
    const unprotectedPaths = [];
    return authorizationMiddleware_1.AuthorizationMiddleware.requestHandler(requiredRoles, accessDeniedCallback, unprotectedPaths);
}
class Feature {
    enableFor(app) {
        if (app.settings.nunjucksEnv && app.settings.nunjucksEnv.globals) {
            app.settings.nunjucksEnv.globals.OfferPaths = paths_1.Paths;
        }
        app.all(/^\/case\/.+\/settlement-agreement\/.*$/, requestHandler());
        app.all(/^\/case\/.+\/settlement-agreement\/.*$/, claimMiddleware_1.ClaimMiddleware.retrieveByExternalId);
        app.all(/^\/case\/.+\/settlement-agreement\/.*$/, onlyDefendantLinkedToClaimCanDoIt_1.OnlyDefendantLinkedToClaimCanDoIt.check());
        app.all(/^\/case\/.+\/settlement-agreement\/(?!settlement-agreement-confirmation).*$/, settlementAgreementGuard_1.SettlementAgreementGuard.requestHandler);
        app.all(/^\/case\/.+\/settlement-agreement\/.*$/, alreadyPaidInFullGuard_1.AlreadyPaidInFullGuard.requestHandler);
        app.use('/', routerFinder_1.RouterFinder.findAll(path.join(__dirname, 'routes')));
    }
}
exports.Feature = Feature;
