"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const authorizationMiddleware_1 = require("idam/authorizationMiddleware");
const routerFinder_1 = require("shared/router/routerFinder");
const claimMiddleware_1 = require("claims/claimMiddleware");
const ccjGuard_1 = require("ccj/guards/ccjGuard");
const cmc_draft_store_middleware_1 = require("@hmcts/cmc-draft-store-middleware");
const draftService_1 = require("services/draftService");
const draftCCJ_1 = require("ccj/draft/draftCCJ");
const onlyClaimantLinkedToClaimCanDoIt_1 = require("guards/onlyClaimantLinkedToClaimCanDoIt");
const oAuthHelper_1 = require("idam/oAuthHelper");
const paths_1 = require("ccj/paths");
function requestHandler() {
    function accessDeniedCallback(req, res) {
        res.redirect(oAuthHelper_1.OAuthHelper.forLogin(req, res));
    }
    const requiredRoles = ['citizen'];
    const unprotectedPaths = [];
    return authorizationMiddleware_1.AuthorizationMiddleware.requestHandler(requiredRoles, accessDeniedCallback, unprotectedPaths);
}
class CCJFeature {
    enableFor(app) {
        if (app.settings.nunjucksEnv && app.settings.nunjucksEnv.globals) {
            app.settings.nunjucksEnv.globals.CCJPaths = paths_1.Paths;
        }
        const allCCJ = '/case/*/ccj/*';
        app.all(allCCJ, requestHandler());
        app.all(allCCJ, claimMiddleware_1.ClaimMiddleware.retrieveByExternalId);
        app.all(/^\/case\/.+\/ccj\/(?!confirmation-redetermination|repayment-plan-summary|redetermination).*$/, onlyClaimantLinkedToClaimCanDoIt_1.OnlyClaimantLinkedToClaimCanDoIt.check());
        app.all(/^\/case\/.+\/ccj\/(?!confirmation|repayment-plan-summary|redetermination).*$/, ccjGuard_1.CCJGuard.requestHandler);
        app.all(/^\/case\/.+\/ccj\/(?!confirmation|repayment-plan-summary|redetermination).*$/, cmc_draft_store_middleware_1.DraftMiddleware.requestHandler(new draftService_1.DraftService(), 'ccj', 100, (value) => {
            return new draftCCJ_1.DraftCCJ().deserialize(value);
        }), (req, res, next) => {
            res.locals.draft = res.locals.ccjDraft;
            next();
        });
        app.use('/', routerFinder_1.RouterFinder.findAll(path.join(__dirname, 'routes')));
    }
}
exports.CCJFeature = CCJFeature;
