"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const authorizationMiddleware_1 = require("idam/authorizationMiddleware");
const paths_1 = require("response/paths");
const routerFinder_1 = require("shared/router/routerFinder");
const responseType_1 = require("claims/models/response/responseType");
const defenceType_1 = require("claims/models/response/defenceType");
const paymentOption_1 = require("claims/models/paymentOption");
const paymentSchedule_1 = require("claims/models/response/core/paymentSchedule");
const freeMediation_1 = require("forms/models/freeMediation");
const responseGuard_1 = require("response/guards/responseGuard");
const claimMiddleware_1 = require("claims/claimMiddleware");
const cmc_draft_store_middleware_1 = require("@hmcts/cmc-draft-store-middleware");
const draftService_1 = require("services/draftService");
const responseDraft_1 = require("response/draft/responseDraft");
const countyCourtJudgmentRequestedGuard_1 = require("response/guards/countyCourtJudgmentRequestedGuard");
const onlyClaimantLinkedToClaimCanDoIt_1 = require("guards/onlyClaimantLinkedToClaimCanDoIt");
const onlyDefendantLinkedToClaimCanDoIt_1 = require("guards/onlyDefendantLinkedToClaimCanDoIt");
const oAuthHelper_1 = require("idam/oAuthHelper");
const optInFeatureToggleGuard_1 = require("guards/optInFeatureToggleGuard");
const mediationDraft_1 = require("mediation/draft/mediationDraft");
const directionsQuestionnaireDraft_1 = require("directions-questionnaire/draft/directionsQuestionnaireDraft");
const partyType_1 = require("common/partyType");
const individualDetails_1 = require("forms/models/individualDetails");
const soleTraderDetails_1 = require("forms/models/soleTraderDetails");
const companyDetails_1 = require("forms/models/companyDetails");
const organisationDetails_1 = require("forms/models/organisationDetails");
const alreadyPaidInFullGuard_1 = require("guards/alreadyPaidInFullGuard");
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
function deserializeFn(value) {
    switch (value.type) {
        case partyType_1.PartyType.INDIVIDUAL.value:
            return individualDetails_1.IndividualDetails.fromObject(value);
        case partyType_1.PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
            return soleTraderDetails_1.SoleTraderDetails.fromObject(value);
        case partyType_1.PartyType.COMPANY.value:
            return companyDetails_1.CompanyDetails.fromObject(value);
        case partyType_1.PartyType.ORGANISATION.value:
            return organisationDetails_1.OrganisationDetails.fromObject(value);
        default:
            throw new Error(`Unknown party type: ${value.type}`);
    }
}
function initiatePartyFromClaimHandler(req, res, next) {
    const draft = res.locals.responseDraft;
    if (!draft.document.defendantDetails.partyDetails) {
        const claim = res.locals.claim;
        draft.document.defendantDetails.partyDetails = deserializeFn(claim.claimData.defendant);
    }
    next();
}
class Feature {
    enableFor(app) {
        if (app.settings.nunjucksEnv && app.settings.nunjucksEnv.globals) {
            app.settings.nunjucksEnv.globals.FullAdmissionPaths = paths_1.FullAdmissionPaths;
            app.settings.nunjucksEnv.globals.PartAdmissionPaths = paths_1.PartAdmissionPaths;
            app.settings.nunjucksEnv.globals.StatementOfMeansPaths = paths_1.StatementOfMeansPaths;
            app.settings.nunjucksEnv.globals.DefenceType = defenceType_1.DefenceType;
            app.settings.nunjucksEnv.globals.FreeMediationOption = freeMediation_1.FreeMediationOption;
            app.settings.nunjucksEnv.globals.domain = {
                ResponseType: responseType_1.ResponseType,
                PaymentOption: paymentOption_1.PaymentOption,
                PaymentSchedule: paymentSchedule_1.PaymentSchedule
            };
        }
        const allResponseRoutes = '/case/*/response/*';
        app.all(allResponseRoutes, defendantResponseRequestHandler());
        app.all(allResponseRoutes, claimMiddleware_1.ClaimMiddleware.retrieveByExternalId);
        app.all(/^\/case\/.+\/response\/(?!receipt|summary|claim-details).*$/, onlyDefendantLinkedToClaimCanDoIt_1.OnlyDefendantLinkedToClaimCanDoIt.check());
        app.all(allResponseRoutes, alreadyPaidInFullGuard_1.AlreadyPaidInFullGuard.requestHandler);
        app.all(/^\/case\/.+\/response\/(?!confirmation|counter-claim|receipt|summary|claim-details).*$/, responseGuard_1.ResponseGuard.checkResponseDoesNotExist());
        app.all('/case/*/response/summary', onlyClaimantLinkedToClaimCanDoIt_1.OnlyClaimantLinkedToClaimCanDoIt.check(), responseGuard_1.ResponseGuard.checkResponseExists());
        app.all(/^\/case\/.*\/response\/(?!claim-details|receipt).*$/, countyCourtJudgmentRequestedGuard_1.CountyCourtJudgmentRequestedGuard.requestHandler);
        app.all(/^\/case\/.*\/response\/statement-of-means\/.*/, optInFeatureToggleGuard_1.OptInFeatureToggleGuard.featureEnabledGuard('admissions'));
        app.all(/^\/case\/.+\/response\/(?!confirmation|receipt|summary).*$/, cmc_draft_store_middleware_1.DraftMiddleware.requestHandler(new draftService_1.DraftService(), 'response', 100, (value) => {
            return new responseDraft_1.ResponseDraft().deserialize(value);
        }), (req, res, next) => {
            res.locals.draft = res.locals.responseDraft;
            next();
        }, initiatePartyFromClaimHandler);
        app.all(/^\/case\/.+\/response\/(?!confirmation|receipt|summary).*$/, cmc_draft_store_middleware_1.DraftMiddleware.requestHandler(new draftService_1.DraftService(), 'mediation', 100, (value) => {
            return new mediationDraft_1.MediationDraft().deserialize(value);
        }));
        app.all(/^\/case\/.+\/response\/task-list|check-and-send|incomplete-submission.*$/, cmc_draft_store_middleware_1.DraftMiddleware.requestHandler(new draftService_1.DraftService(), 'directionsQuestionnaire', 100, (value) => {
            return new directionsQuestionnaireDraft_1.DirectionsQuestionnaireDraft().deserialize(value);
        }));
        app.use('/', routerFinder_1.RouterFinder.findAll(path.join(__dirname, 'routes')));
    }
}
exports.Feature = Feature;
