"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const payment_date_1 = require("shared/components/payment-intention/payment-date");
const model_accessor_1 = require("shared/components/model-accessor");
const paymentIntention_1 = require("claims/models/response/core/paymentIntention");
const paths_1 = require("claimant-response/paths");
const paymentPlanHelper_1 = require("shared/helpers/paymentPlanHelper");
const decisionType_1 = require("common/court-calculations/decisionType");
const paymentOption_1 = require("claims/models/paymentOption");
const CourtDecisionHelper_1 = require("shared/helpers/CourtDecisionHelper");
class PaymentDatePage extends payment_date_1.AbstractPaymentDatePage {
    static generateCourtOfferedPaymentIntention(draft, claim, decisionType) {
        const courtOfferedPaymentIntention = new paymentIntention_1.PaymentIntention();
        const claimResponse = claim.response;
        switch (decisionType) {
            case decisionType_1.DecisionType.CLAIMANT:
            case decisionType_1.DecisionType.CLAIMANT_IN_FAVOUR_OF_DEFENDANT:
                if (draft.alternatePaymentMethod.paymentOption.option.value === paymentOption_1.PaymentOption.BY_SPECIFIED_DATE) {
                    courtOfferedPaymentIntention.paymentDate = draft.alternatePaymentMethod.toDomainInstance().paymentDate;
                    courtOfferedPaymentIntention.paymentOption = paymentOption_1.PaymentOption.BY_SPECIFIED_DATE;
                }
                break;
            case decisionType_1.DecisionType.COURT:
                const paymentPlanFromDefendantFinancialStatement = paymentPlanHelper_1.PaymentPlanHelper.createPaymentPlanFromDefendantFinancialStatement(claim, draft);
                const lastPaymentDate = paymentPlanFromDefendantFinancialStatement.calculateLastPaymentDate();
                if (draft.alternatePaymentMethod.paymentOption.option.value === paymentOption_1.PaymentOption.BY_SPECIFIED_DATE) {
                    courtOfferedPaymentIntention.paymentDate = lastPaymentDate;
                    courtOfferedPaymentIntention.paymentOption = paymentOption_1.PaymentOption.BY_SPECIFIED_DATE;
                }
                break;
            case decisionType_1.DecisionType.DEFENDANT:
                if (claimResponse.paymentIntention.paymentOption === paymentOption_1.PaymentOption.BY_SPECIFIED_DATE) {
                    courtOfferedPaymentIntention.paymentDate = claimResponse.paymentIntention.paymentDate;
                    courtOfferedPaymentIntention.paymentOption = paymentOption_1.PaymentOption.BY_SPECIFIED_DATE;
                }
                if (claimResponse.paymentIntention.paymentOption === paymentOption_1.PaymentOption.INSTALMENTS) {
                    courtOfferedPaymentIntention.paymentOption = paymentOption_1.PaymentOption.INSTALMENTS;
                    courtOfferedPaymentIntention.repaymentPlan = claimResponse.paymentIntention.repaymentPlan;
                }
                break;
            default:
        }
        return courtOfferedPaymentIntention;
    }
    static generateCourtCalculatedPaymentIntention(draft, claim) {
        const paymentPlan = paymentPlanHelper_1.PaymentPlanHelper.createPaymentPlanFromDefendantFinancialStatement(claim, draft);
        if (!paymentPlan) {
            return undefined;
        }
        const courtCalculatedPaymentIntention = new paymentIntention_1.PaymentIntention();
        courtCalculatedPaymentIntention.paymentOption = paymentOption_1.PaymentOption.BY_SPECIFIED_DATE;
        courtCalculatedPaymentIntention.paymentDate = paymentPlan.calculateLastPaymentDate();
        return courtCalculatedPaymentIntention;
    }
    getHeading() {
        return 'When do you want the defendant to pay?';
    }
    getNotice() {
        return 'The court will review your suggestion and may reject it if it’s sooner than the defendant can afford to repay the money.';
    }
    createModelAccessor() {
        return new model_accessor_1.DefaultModelAccessor('alternatePaymentMethod');
    }
    async saveDraft(locals) {
        if (!locals.claim.response.defendant.isBusiness()) {
            const decisionType = CourtDecisionHelper_1.CourtDecisionHelper.createCourtDecision(locals.claim, locals.draft.document);
            locals.draft.document.courtDetermination.decisionType = decisionType;
            locals.draft.document.courtDetermination.courtPaymentIntention = PaymentDatePage.generateCourtCalculatedPaymentIntention(locals.draft.document, locals.claim) || undefined;
            locals.draft.document.courtDetermination.courtDecision = PaymentDatePage.generateCourtOfferedPaymentIntention(locals.draft.document, locals.claim, decisionType);
        }
        return super.saveDraft(locals);
    }
    buildPostSubmissionUri(req, res) {
        const claim = res.locals.claim;
        const draft = res.locals.draft.document;
        const claimResponse = claim.response;
        const externalId = req.params.externalId;
        const courtDecision = CourtDecisionHelper_1.CourtDecisionHelper.createCourtDecision(claim, draft);
        switch (courtDecision) {
            case decisionType_1.DecisionType.NOT_APPLICABLE_IS_BUSINESS:
                return paths_1.Paths.taskListPage.evaluateUri({ externalId });
            case decisionType_1.DecisionType.COURT:
                return paths_1.Paths.courtOfferedSetDatePage.evaluateUri({ externalId });
            case decisionType_1.DecisionType.DEFENDANT:
                if (claimResponse.paymentIntention.paymentOption === paymentOption_1.PaymentOption.INSTALMENTS) {
                    return paths_1.Paths.courtOfferedInstalmentsPage.evaluateUri({ externalId });
                }
                if (claimResponse.paymentIntention.paymentOption === paymentOption_1.PaymentOption.BY_SPECIFIED_DATE) {
                    return paths_1.Paths.courtOfferedSetDatePage.evaluateUri({ externalId });
                }
                break;
            case decisionType_1.DecisionType.CLAIMANT:
            case decisionType_1.DecisionType.CLAIMANT_IN_FAVOUR_OF_DEFENDANT:
                return paths_1.Paths.payBySetDateAcceptedPage.evaluateUri({ externalId });
        }
    }
}
exports.PaymentDatePage = PaymentDatePage;
/* tslint:disable:no-default-export */
exports.default = new PaymentDatePage()
    .buildRouter(paths_1.claimantResponsePath);
