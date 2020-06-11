"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const nunjucks = require("nunjucks");
const authorizationMiddleware_1 = require("idam/authorizationMiddleware");
const routerFinder_1 = require("shared/router/routerFinder");
const cmc_draft_store_middleware_1 = require("@hmcts/cmc-draft-store-middleware");
const draftService_1 = require("services/draftService");
const draftClaim_1 = require("drafts/models/draftClaim");
const oAuthHelper_1 = require("idam/oAuthHelper");
const paymentSchedule_1 = require("claims/models/response/core/paymentSchedule");
const paths_1 = require("dashboard/paths");
const claimStatusFlow_1 = require("dashboard/helpers/claimStatusFlow");
const app_1 = require("main/app");
function requestHandler() {
    function accessDeniedCallback(req, res) {
        res.redirect(oAuthHelper_1.OAuthHelper.forLogin(req, res));
    }
    const requiredRoles = ['citizen'];
    const unprotectedPaths = [];
    return authorizationMiddleware_1.AuthorizationMiddleware.requestHandler(requiredRoles, accessDeniedCallback, unprotectedPaths);
}
function render(claim, type) {
    const dashboardName = claimStatusFlow_1.ClaimStatusFlow.dashboardFor(claim);
    try {
        const template = nunjucks.render(path.join(__dirname, './views', 'status', type, dashboardName + '.njk').toString(), { claim: claim });
        return app_1.app.settings.nunjucksEnv.filters['safe'](template);
    }
    catch (err) {
        return '';
    }
}
class DashboardFeature {
    enableFor(app) {
        if (app.settings.nunjucksEnv) {
            if (app.settings.nunjucksEnv.filters) {
                app.settings.nunjucksEnv.filters.renderPaymentSchedule = (value, adverbial = false) => {
                    switch (value) {
                        case paymentSchedule_1.PaymentSchedule.EACH_WEEK:
                            return adverbial ? 'Weekly' : 'Every week';
                        case paymentSchedule_1.PaymentSchedule.EVERY_TWO_WEEKS:
                            return 'Every 2 weeks';
                        case paymentSchedule_1.PaymentSchedule.EVERY_MONTH:
                            return adverbial ? 'Monthly' : 'Every month';
                    }
                };
                app.settings.nunjucksEnv.filters.dashboardStatusForClaimant = (claim) => render(claim, 'claimant');
                app.settings.nunjucksEnv.filters.dashboardStatusForDefendant = (claim) => render(claim, 'defendant');
            }
            if (app.settings.nunjucksEnv.globals) {
                app.settings.nunjucksEnv.globals.DashboardPaths = paths_1.Paths;
            }
        }
        app.all(/^\/dashboard.*$/, requestHandler());
        app.all(/^\/dashboard$/, cmc_draft_store_middleware_1.DraftMiddleware.requestHandler(new draftService_1.DraftService(), 'claim', 100, (value) => {
            return new draftClaim_1.DraftClaim().deserialize(value);
        }));
        app.use('/', routerFinder_1.RouterFinder.findAll(path.join(__dirname, 'routes')));
    }
}
exports.DashboardFeature = DashboardFeature;
