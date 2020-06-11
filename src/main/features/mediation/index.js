"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const authorizationMiddleware_1 = require("idam/authorizationMiddleware");
const routerFinder_1 = require("shared/router/routerFinder");
const claimMiddleware_1 = require("claims/claimMiddleware");
const cmc_draft_store_middleware_1 = require("@hmcts/cmc-draft-store-middleware");
const draftService_1 = require("services/draftService");
const oAuthHelper_1 = require("idam/oAuthHelper");
const mediationDraft_1 = require("mediation/draft/mediationDraft");
const countyCourtJudgmentRequestedGuard_1 = require("response/guards/countyCourtJudgmentRequestedGuard");
const responseDraft_1 = require("response/draft/responseDraft");
const alreadyPaidInFullGuard_1 = require("guards/alreadyPaidInFullGuard");
function requestHandler() {
    function accessDeniedCallback(req, res) {
        res.redirect(oAuthHelper_1.OAuthHelper.forLogin(req, res));
    }
    const requiredRoles = ['citizen'];
    const unprotectedPaths = [];
    return authorizationMiddleware_1.AuthorizationMiddleware.requestHandler(requiredRoles, accessDeniedCallback, unprotectedPaths);
}
class MediationFeature {
    enableFor(app) {
        const allMediation = '/case/*/mediation/*';
        app.all(allMediation, requestHandler());
        app.all(allMediation, claimMiddleware_1.ClaimMiddleware.retrieveByExternalId);
        app.all(allMediation, alreadyPaidInFullGuard_1.AlreadyPaidInFullGuard.requestHandler);
        app.all(allMediation, countyCourtJudgmentRequestedGuard_1.CountyCourtJudgmentRequestedGuard.requestHandler);
        app.all(allMediation, cmc_draft_store_middleware_1.DraftMiddleware.requestHandler(new draftService_1.DraftService(), 'mediation', 100, (value) => {
            return new mediationDraft_1.MediationDraft().deserialize(value);
        }), (req, res, next) => {
            res.locals.draft = res.locals.mediationDraft;
            next();
        });
        app.all(allMediation, cmc_draft_store_middleware_1.DraftMiddleware.requestHandler(new draftService_1.DraftService(), 'response', 100, (value) => {
            return new responseDraft_1.ResponseDraft().deserialize(value);
        }), (req, res, next) => {
            res.locals.draft = res.locals.responseDraft;
            next();
        });
        app.use('/', routerFinder_1.RouterFinder.findAll(path.join(__dirname, 'routes')));
    }
}
exports.MediationFeature = MediationFeature;
