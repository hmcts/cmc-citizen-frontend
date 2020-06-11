"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const oAuthHelper_1 = require("idam/oAuthHelper");
const authorizationMiddleware_1 = require("idam/authorizationMiddleware");
const claimMiddleware_1 = require("claims/claimMiddleware");
const countyCourtJudgmentRequestedGuard_1 = require("response/guards/countyCourtJudgmentRequestedGuard");
const cmc_draft_store_middleware_1 = require("@hmcts/cmc-draft-store-middleware");
const draftService_1 = require("services/draftService");
const directionsQuestionnaireDraft_1 = require("directions-questionnaire/draft/directionsQuestionnaireDraft");
const directionsQuestionnaireGuard_1 = require("directions-questionnaire/guard/directionsQuestionnaireGuard");
const routerFinder_1 = require("shared/router/routerFinder");
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
class DirectionsQuestionnaireFeature {
    enableFor(app) {
        const allDQs = '/case/*/directions-questionnaire/*';
        app.all(allDQs, requestHandler());
        app.all(allDQs, claimMiddleware_1.ClaimMiddleware.retrieveByExternalId);
        app.all(allDQs, alreadyPaidInFullGuard_1.AlreadyPaidInFullGuard.requestHandler);
        app.all(allDQs, countyCourtJudgmentRequestedGuard_1.CountyCourtJudgmentRequestedGuard.requestHandler);
        app.all(allDQs, directionsQuestionnaireGuard_1.DirectionsQuestionnaireGuard.requestHandler);
        app.all(allDQs, cmc_draft_store_middleware_1.DraftMiddleware.requestHandler(new draftService_1.DraftService(), 'directionsQuestionnaire', 100, (value) => {
            return new directionsQuestionnaireDraft_1.DirectionsQuestionnaireDraft().deserialize(value);
        }), (req, res, next) => {
            res.locals.draft = res.locals.directionsQuestionnaireDraft;
            next();
        });
        app.all(allDQs, cmc_draft_store_middleware_1.DraftMiddleware.requestHandler(new draftService_1.DraftService(), 'response', 100, (value) => {
            return new responseDraft_1.ResponseDraft().deserialize(value);
        }));
        app.use('/', routerFinder_1.RouterFinder.findAll(path.join(__dirname, 'routes')));
    }
}
exports.DirectionsQuestionnaireFeature = DirectionsQuestionnaireFeature;
