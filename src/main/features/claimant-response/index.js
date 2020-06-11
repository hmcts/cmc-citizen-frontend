"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const paths_1 = require("claimant-response/paths");
const authorizationMiddleware_1 = require("idam/authorizationMiddleware");
const routerFinder_1 = require("shared/router/routerFinder");
const claimMiddleware_1 = require("claims/claimMiddleware");
const cmc_draft_store_middleware_1 = require("@hmcts/cmc-draft-store-middleware");
const draftService_1 = require("services/draftService");
const onlyClaimantLinkedToClaimCanDoIt_1 = require("guards/onlyClaimantLinkedToClaimCanDoIt");
const oAuthHelper_1 = require("idam/oAuthHelper");
const draftClaimantResponse_1 = require("features/claimant-response/draft/draftClaimantResponse");
const responseGuard_1 = require("response/guards/responseGuard");
const renderFormaliseRepaymentPlanOption_1 = require("claimant-response/filters/renderFormaliseRepaymentPlanOption");
const formaliseRepaymentPlanOption_1 = require("claimant-response/form/models/formaliseRepaymentPlanOption");
const bank_account_type_view_filter_1 = require("claimant-response/filters/bank-account-type-view-filter");
const residence_type_view_filter_1 = require("claimant-response/filters/residence-type-view-filter");
const income_type_view_filter_1 = require("claimant-response/filters/income-type-view-filter");
const expense_type_view_filter_1 = require("claimant-response/filters/expense-type-view-filter");
const age_group_type_view_filter_1 = require("claimant-response/filters/age-group-type-view-filter");
const yes_no_view_filter_1 = require("claimant-response/filters/yes-no-view-filter");
const claimantResponseGuard_1 = require("claimant-response/guards/claimantResponseGuard");
const frequency_view_filter_1 = require("claimant-response/filters/frequency-view-filter");
const monthly_amount_view_filter_1 = require("claimant-response/filters/monthly-amount-view-filter");
const priority_debts_type_view_filter_1 = require("claimant-response/filters/priority-debts-type-view-filter");
const mediationDraft_1 = require("mediation/draft/mediationDraft");
const directionsQuestionnaireDraft_1 = require("directions-questionnaire/draft/directionsQuestionnaireDraft");
function requestHandler() {
    function accessDeniedCallback(req, res) {
        res.redirect(oAuthHelper_1.OAuthHelper.forLogin(req, res));
    }
    const requiredRoles = ['citizen'];
    const unprotectedPaths = [];
    return authorizationMiddleware_1.AuthorizationMiddleware.requestHandler(requiredRoles, accessDeniedCallback, unprotectedPaths);
}
class ClaimantResponseFeature {
    enableFor(app) {
        if (app.settings.nunjucksEnv && app.settings.nunjucksEnv.globals) {
            app.settings.nunjucksEnv.globals.ClaimantResponsePaths = paths_1.Paths;
            app.settings.nunjucksEnv.globals.ClaimantResponseCCJPath = paths_1.CCJPaths;
            app.settings.nunjucksEnv.globals.FormaliseRepaymentPlanOption = formaliseRepaymentPlanOption_1.FormaliseRepaymentPlanOption;
        }
        if (app.settings.nunjucksEnv && app.settings.nunjucksEnv.filters) {
            app.settings.nunjucksEnv.filters.renderFormaliseRepaymentPlanOption = renderFormaliseRepaymentPlanOption_1.FormaliseRepaymentPlanOptionFilter.render;
        }
        if (app.settings.nunjucksEnv && app.settings.nunjucksEnv.filters) {
            app.settings.nunjucksEnv.filters.renderYesNo = yes_no_view_filter_1.YesNoViewFilter.render;
            app.settings.nunjucksEnv.filters.renderBankAccountType = bank_account_type_view_filter_1.BankAccountTypeViewFilter.render;
            app.settings.nunjucksEnv.filters.renderResidenceType = residence_type_view_filter_1.ResidenceTypeViewFilter.render;
            app.settings.nunjucksEnv.filters.renderAgeGroupType = age_group_type_view_filter_1.AgeGroupTypeViewFilter.render;
            app.settings.nunjucksEnv.filters.renderFrequencyViewType = frequency_view_filter_1.FrequencyViewFilter.render;
            app.settings.nunjucksEnv.filters.renderIncomeType = income_type_view_filter_1.IncomeTypeViewFilter.render;
            app.settings.nunjucksEnv.filters.renderExpenseType = expense_type_view_filter_1.ExpenseTypeViewFilter.render;
            app.settings.nunjucksEnv.filters.renderMonthlyAmount = monthly_amount_view_filter_1.MonthlyAmountViewFilter.render;
            app.settings.nunjucksEnv.filters.renderPriorityDebtType = priority_debts_type_view_filter_1.PriorityDebtTypeViewFilter.render;
            app.settings.nunjucksEnv.filters.renderPaymentFrequencyView = frequency_view_filter_1.FrequencyViewFilter.renderPaymentFrequency;
        }
        const allClaimantResponse = '/case/*/claimant-response/*';
        app.all(allClaimantResponse, requestHandler());
        app.all(allClaimantResponse, claimMiddleware_1.ClaimMiddleware.retrieveByExternalId);
        app.all(allClaimantResponse, onlyClaimantLinkedToClaimCanDoIt_1.OnlyClaimantLinkedToClaimCanDoIt.check());
        app.all(allClaimantResponse, responseGuard_1.ResponseGuard.checkResponseExists());
        app.all(allClaimantResponse, responseGuard_1.ResponseGuard.checkResponseExists());
        app.all(/^\/case\/.+\/claimant-response\/(?!confirmation).*$/, claimantResponseGuard_1.ClaimantResponseGuard.checkClaimantResponseDoesNotExist());
        app.all(/^\/case\/.+\/claimant-response\/(?!confirmation).*$/, cmc_draft_store_middleware_1.DraftMiddleware.requestHandler(new draftService_1.DraftService(), 'claimantResponse', 100, (value) => {
            return new draftClaimantResponse_1.DraftClaimantResponse().deserialize(value);
        }), (req, res, next) => {
            res.locals.draft = res.locals.claimantResponseDraft;
            next();
        });
        app.all(/^\/case\/.+\/claimant-response\/task-list|intention-to-proceed|check-and-send|incomplete-submission.*$/, cmc_draft_store_middleware_1.DraftMiddleware.requestHandler(new draftService_1.DraftService(), 'mediation', 100, (value) => {
            return new mediationDraft_1.MediationDraft().deserialize(value);
        }));
        app.all(/^\/case\/.+\/claimant-response\/task-list|check-and-send|incomplete-submission.*$/, cmc_draft_store_middleware_1.DraftMiddleware.requestHandler(new draftService_1.DraftService(), 'directionsQuestionnaire', 100, (value) => {
            return new directionsQuestionnaireDraft_1.DirectionsQuestionnaireDraft().deserialize(value);
        }));
        app.use('/', routerFinder_1.RouterFinder.findAll(path.join(__dirname, 'routes')));
    }
}
exports.ClaimantResponseFeature = ClaimantResponseFeature;
