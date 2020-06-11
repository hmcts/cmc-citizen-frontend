"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const oAuthHelper_1 = require("idam/oAuthHelper");
const authorizationMiddleware_1 = require("idam/authorizationMiddleware");
const claimMiddleware_1 = require("claims/claimMiddleware");
const countyCourtJudgmentRequestedGuard_1 = require("response/guards/countyCourtJudgmentRequestedGuard");
const directionsQuestionnaireGuard_1 = require("directions-questionnaire/guard/directionsQuestionnaireGuard");
const routerFinder_1 = require("shared/router/routerFinder");
const cmc_draft_store_middleware_1 = require("@hmcts/cmc-draft-store-middleware");
const draftService_1 = require("services/draftService");
const ordersDraft_1 = require("orders/draft/ordersDraft");
const paths_1 = require("orders/paths");
function requestHandler() {
    function accessDeniedCallback(req, res) {
        res.redirect(oAuthHelper_1.OAuthHelper.forLogin(req, res));
    }
    const requiredRoles = ['citizen'];
    const unprotectedPaths = [];
    return authorizationMiddleware_1.AuthorizationMiddleware.requestHandler(requiredRoles, accessDeniedCallback, unprotectedPaths);
}
class OrdersFeature {
    enableFor(app) {
        if (app.settings.nunjucksEnv && app.settings.nunjucksEnv.globals) {
            app.settings.nunjucksEnv.globals.OrdersPaths = paths_1.Paths;
        }
        const allOrders = '/case/*/orders/*';
        // todo add in order guard so people can't get to these pages when they shouldn't
        app.all(allOrders, requestHandler());
        app.all(allOrders, claimMiddleware_1.ClaimMiddleware.retrieveByExternalId);
        app.all(allOrders, countyCourtJudgmentRequestedGuard_1.CountyCourtJudgmentRequestedGuard.requestHandler);
        app.all(allOrders, directionsQuestionnaireGuard_1.DirectionsQuestionnaireGuard.requestHandler);
        app.all(/^\/case\/.+\/orders\/(?!confirmation|review-order-receipt).*$/, cmc_draft_store_middleware_1.DraftMiddleware.requestHandler(new draftService_1.DraftService(), 'orders', 100, (value) => {
            return new ordersDraft_1.OrdersDraft().deserialize(value);
        }), (req, res, next) => {
            res.locals.draft = res.locals.ordersDraft;
            next();
        });
        app.use('/', routerFinder_1.RouterFinder.findAll(path.join(__dirname, 'routes')));
    }
}
exports.OrdersFeature = OrdersFeature;
