"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const authorizationMiddleware_1 = require("idam/authorizationMiddleware");
const routerFinder_1 = require("shared/router/routerFinder");
const claimMiddleware_1 = require("claims/claimMiddleware");
const cmc_draft_store_middleware_1 = require("@hmcts/cmc-draft-store-middleware");
const draftService_1 = require("services/draftService");
const onlyClaimantLinkedToClaimCanDoIt_1 = require("guards/onlyClaimantLinkedToClaimCanDoIt");
const paidInFullGuard_1 = require("./guards/paidInFullGuard");
const oAuthHelper_1 = require("idam/oAuthHelper");
const draftPaidInFull_1 = require("features/paid-in-full/draft/draftPaidInFull");
function requestHandler() {
    function accessDeniedCallback(req, res) {
        res.redirect(oAuthHelper_1.OAuthHelper.forLogin(req, res));
    }
    const requiredRoles = ['citizen'];
    const unprotectedPaths = [];
    return authorizationMiddleware_1.AuthorizationMiddleware.requestHandler(requiredRoles, accessDeniedCallback, unprotectedPaths);
}
class PaidInFullFeature {
    enableFor(app) {
        const allPaidInFull = '/case/*/paid-in-full/*';
        app.all(allPaidInFull, requestHandler());
        app.all(allPaidInFull, claimMiddleware_1.ClaimMiddleware.retrieveByExternalId);
        app.all(allPaidInFull, onlyClaimantLinkedToClaimCanDoIt_1.OnlyClaimantLinkedToClaimCanDoIt.check());
        app.all(/^\/case\/.+\/paid-in-full\/(?!confirmation).*$/, paidInFullGuard_1.PaidInFullGuard.check());
        app.all(/^\/case\/.+\/paid-in-full\/(?!confirmation).*$/, cmc_draft_store_middleware_1.DraftMiddleware.requestHandler(new draftService_1.DraftService(), 'paidInFull', 100, (value) => {
            return new draftPaidInFull_1.DraftPaidInFull().deserialize(value);
        }), (req, res, next) => {
            res.locals.draft = res.locals.DraftPaidInFull;
            next();
        });
        app.use('/', routerFinder_1.RouterFinder.findAll(path.join(__dirname, 'routes')));
    }
}
exports.PaidInFullFeature = PaidInFullFeature;
