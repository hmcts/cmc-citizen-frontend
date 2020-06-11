"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const paths_1 = require("claim/paths");
const authorizationMiddleware_1 = require("idam/authorizationMiddleware");
const claimEligibilityGuard_1 = require("claim/guards/claimEligibilityGuard");
const routerFinder_1 = require("shared/router/routerFinder");
const cmc_draft_store_middleware_1 = require("@hmcts/cmc-draft-store-middleware");
const draftService_1 = require("services/draftService");
const draftClaim_1 = require("drafts/models/draftClaim");
const oAuthHelper_1 = require("idam/oAuthHelper");
function claimIssueRequestHandler() {
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
            app.settings.nunjucksEnv.globals.ClaimPaths = paths_1.Paths;
        }
        app.all('/claim/*', claimIssueRequestHandler());
        app.all(/^\/claim\/(?!start|amount-exceeded|new-features-consent|.+\/confirmation|.+\/receipt|.+\/sealed-claim).*$/, cmc_draft_store_middleware_1.DraftMiddleware.requestHandler(new draftService_1.DraftService(), 'claim', 100, (value) => {
            return new draftClaim_1.DraftClaim().deserialize(value);
        }));
        app.all(/^\/claim\/(?!start|amount-exceeded|new-features-consent|.+\/confirmation|.+\/receipt|.+\/sealed-claim|.+\/finish-payment|.+\/document).*$/, claimEligibilityGuard_1.ClaimEligibilityGuard.requestHandler());
        app.use('/', routerFinder_1.RouterFinder.findAll(path.join(__dirname, 'routes')));
    }
}
exports.Feature = Feature;
