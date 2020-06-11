"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const payment_plan_1 = require("shared/components/payment-intention/payment-plan");
const model_accessor_1 = require("shared/components/model-accessor");
const calculateMonthlyIncomeExpense_1 = require("common/calculate-monthly-income-expense/calculateMonthlyIncomeExpense");
const incomeExpenseSource_1 = require("common/calculate-monthly-income-expense/incomeExpenseSource");
const paths_1 = require("claimant-response/paths");
const form_1 = require("forms/form");
const paydateHelper_1 = require("claimant-response/helpers/paydateHelper");
const paymentIntention_1 = require("claims/models/response/core/paymentIntention");
const paymentPlanHelper_1 = require("shared/helpers/paymentPlanHelper");
const decisionType_1 = require("common/court-calculations/decisionType");
const frequency_1 = require("common/frequency/frequency");
const paymentOption_1 = require("claims/models/paymentOption");
const paymentSchedule_1 = require("features/ccj/form/models/paymentSchedule");
const CourtDecisionHelper_1 = require("shared/helpers/CourtDecisionHelper");
const momentFactory_1 = require("shared/momentFactory");
const admissionHelper_1 = require("shared/helpers/admissionHelper");
class PaymentPlanPage extends payment_plan_1.AbstractPaymentPlanPage {
    static generateCourtOfferedPaymentIntention(draft, claim, decisionType) {
        const claimResponse = claim.response;
        const courtOfferedPaymentIntention = new paymentIntention_1.PaymentIntention();
        const admittedClaimAmount = admissionHelper_1.AdmissionHelper.getAdmittedAmount(claim);
        const paymentPlanFromDefendantFinancialStatement = paymentPlanHelper_1.PaymentPlanHelper.createPaymentPlanFromDefendantFinancialStatement(claim, draft);
        const claimantEnteredPaymentPlan = paymentPlanHelper_1.PaymentPlanHelper.createPaymentPlanFromDraft(draft);
        if (decisionType === decisionType_1.DecisionType.CLAIMANT || decisionType === decisionType_1.DecisionType.CLAIMANT_IN_FAVOUR_OF_DEFENDANT) {
            courtOfferedPaymentIntention.paymentOption = paymentOption_1.PaymentOption.INSTALMENTS;
            if (claimResponse.paymentIntention.paymentOption === paymentOption_1.PaymentOption.INSTALMENTS
                && claimResponse.paymentIntention.repaymentPlan.paymentSchedule !== draft.alternatePaymentMethod.toDomainInstance().repaymentPlan.paymentSchedule) {
                const paymentPlanConvertedToDefendantFrequency = claimantEnteredPaymentPlan.convertTo(paymentSchedule_1.PaymentSchedule.toFrequency(claimResponse.paymentIntention.repaymentPlan.paymentSchedule));
                const instalmentAmount = _.round(paymentPlanConvertedToDefendantFrequency.instalmentAmount, 2);
                courtOfferedPaymentIntention.repaymentPlan = {
                    firstPaymentDate: paymentPlanConvertedToDefendantFrequency.startDate,
                    instalmentAmount: instalmentAmount > admittedClaimAmount ? admittedClaimAmount : instalmentAmount,
                    paymentSchedule: frequency_1.Frequency.toPaymentSchedule(paymentPlanConvertedToDefendantFrequency.frequency),
                    completionDate: paymentPlanConvertedToDefendantFrequency.calculateLastPaymentDate(),
                    paymentLength: paymentPlanConvertedToDefendantFrequency.calculatePaymentLength()
                };
            }
            else {
                courtOfferedPaymentIntention.repaymentPlan = draft.alternatePaymentMethod.toDomainInstance().repaymentPlan;
            }
        }
        if (decisionType === decisionType_1.DecisionType.COURT) {
            courtOfferedPaymentIntention.paymentOption = paymentOption_1.PaymentOption.INSTALMENTS;
            if (claimResponse.paymentIntention.paymentOption === paymentOption_1.PaymentOption.INSTALMENTS) {
                const claimantRepaymentPlanStartDate = draft.alternatePaymentMethod.toDomainInstance().repaymentPlan.firstPaymentDate;
                const defendantFrequency = frequency_1.Frequency.of(claimResponse.paymentIntention.repaymentPlan.paymentSchedule);
                const courtOfferedStartDate = paymentPlanFromDefendantFinancialStatement.startDate < claimantRepaymentPlanStartDate ? claimantRepaymentPlanStartDate : paymentPlanFromDefendantFinancialStatement.startDate;
                const paymentPlanConvertedToDefendantFrequency = paymentPlanFromDefendantFinancialStatement.convertTo(defendantFrequency, courtOfferedStartDate);
                courtOfferedPaymentIntention.repaymentPlan = {
                    firstPaymentDate: paymentPlanConvertedToDefendantFrequency.startDate,
                    instalmentAmount: paymentPlanConvertedToDefendantFrequency.instalmentAmount > admittedClaimAmount ?
                        admittedClaimAmount : _.round(paymentPlanConvertedToDefendantFrequency.instalmentAmount, 2),
                    paymentSchedule: frequency_1.Frequency.toPaymentSchedule(paymentPlanConvertedToDefendantFrequency.frequency),
                    completionDate: paymentPlanConvertedToDefendantFrequency.calculateLastPaymentDate(),
                    paymentLength: paymentPlanConvertedToDefendantFrequency.calculatePaymentLength()
                };
            }
            else {
                const paymentPlanConvertedToMonthlyFrequency = paymentPlanFromDefendantFinancialStatement.convertTo(frequency_1.Frequency.MONTHLY);
                courtOfferedPaymentIntention.repaymentPlan = {
                    firstPaymentDate: paymentPlanConvertedToMonthlyFrequency.startDate,
                    instalmentAmount: paymentPlanConvertedToMonthlyFrequency.instalmentAmount > admittedClaimAmount ?
                        admittedClaimAmount : _.round(paymentPlanConvertedToMonthlyFrequency.instalmentAmount, 2),
                    paymentSchedule: frequency_1.Frequency.toPaymentSchedule(paymentPlanConvertedToMonthlyFrequency.frequency),
                    completionDate: paymentPlanConvertedToMonthlyFrequency.calculateLastPaymentDate(),
                    paymentLength: paymentPlanConvertedToMonthlyFrequency.calculatePaymentLength()
                };
            }
        }
        if (decisionType === decisionType_1.DecisionType.DEFENDANT) {
            if (claimResponse.paymentIntention.paymentOption === paymentOption_1.PaymentOption.INSTALMENTS) {
                courtOfferedPaymentIntention.paymentOption = paymentOption_1.PaymentOption.INSTALMENTS;
                courtOfferedPaymentIntention.repaymentPlan = claimResponse.paymentIntention.repaymentPlan;
            }
            if (claimResponse.paymentIntention.paymentOption === paymentOption_1.PaymentOption.BY_SPECIFIED_DATE) {
                courtOfferedPaymentIntention.paymentDate = claimResponse.paymentIntention.paymentDate;
                courtOfferedPaymentIntention.paymentOption = paymentOption_1.PaymentOption.BY_SPECIFIED_DATE;
            }
        }
        return courtOfferedPaymentIntention;
    }
    static generateCourtCalculatedPaymentIntention(draft, claim) {
        const courtCalculatedPaymentIntention = new paymentIntention_1.PaymentIntention();
        const paymentPlanFromDefendantFinancialStatement = paymentPlanHelper_1.PaymentPlanHelper.createPaymentPlanFromDefendantFinancialStatement(claim, draft);
        if (!paymentPlanFromDefendantFinancialStatement) {
            return undefined;
        }
        if (paymentPlanFromDefendantFinancialStatement.startDate.isSame(momentFactory_1.MomentFactory.maxDate())) {
            courtCalculatedPaymentIntention.paymentOption = paymentOption_1.PaymentOption.BY_SPECIFIED_DATE;
            courtCalculatedPaymentIntention.paymentDate = momentFactory_1.MomentFactory.maxDate();
        }
        else {
            courtCalculatedPaymentIntention.paymentOption = paymentOption_1.PaymentOption.INSTALMENTS;
            courtCalculatedPaymentIntention.repaymentPlan = {
                firstPaymentDate: paymentPlanFromDefendantFinancialStatement.startDate,
                instalmentAmount: _.round(paymentPlanFromDefendantFinancialStatement.instalmentAmount, 2),
                paymentSchedule: frequency_1.Frequency.toPaymentSchedule(paymentPlanFromDefendantFinancialStatement.frequency),
                completionDate: paymentPlanFromDefendantFinancialStatement.calculateLastPaymentDate(),
                paymentLength: paymentPlanFromDefendantFinancialStatement.calculatePaymentLength()
            };
        }
        return courtCalculatedPaymentIntention;
    }
    getView() {
        return 'claimant-response/views/payment-plan';
    }
    getHeading() {
        return 'Suggest instalments for the defendant';
    }
    createModelAccessor() {
        return new model_accessor_1.DefaultModelAccessor('alternatePaymentMethod');
    }
    async saveDraft(locals) {
        const decisionType = CourtDecisionHelper_1.CourtDecisionHelper.createCourtDecision(locals.claim, locals.draft.document);
        if (decisionType !== decisionType_1.DecisionType.NOT_APPLICABLE_IS_BUSINESS) {
            locals.draft.document.courtDetermination.decisionType = decisionType;
            const courtCalculatedPaymentIntention = PaymentPlanPage.generateCourtCalculatedPaymentIntention(locals.draft.document, locals.claim);
            if (courtCalculatedPaymentIntention) {
                locals.draft.document.courtDetermination.courtPaymentIntention = courtCalculatedPaymentIntention;
            }
            locals.draft.document.courtDetermination.courtDecision = PaymentPlanPage.generateCourtOfferedPaymentIntention(locals.draft.document, locals.claim, decisionType);
        }
        return super.saveDraft(locals);
    }
    buildPostSubmissionUri(req, res) {
        const claim = res.locals.claim;
        const draft = res.locals.draft.document;
        const courtDecision = CourtDecisionHelper_1.CourtDecisionHelper.createCourtDecision(claim, draft);
        const claimResponse = claim.response;
        const externalId = req.params.externalId;
        switch (courtDecision) {
            case decisionType_1.DecisionType.NOT_APPLICABLE_IS_BUSINESS:
                return paths_1.Paths.taskListPage.evaluateUri({ externalId: externalId });
            case decisionType_1.DecisionType.COURT: {
                return paths_1.Paths.courtOfferedInstalmentsPage.evaluateUri({ externalId: externalId });
            }
            case decisionType_1.DecisionType.DEFENDANT: {
                if (claimResponse.paymentIntention.paymentOption === paymentOption_1.PaymentOption.INSTALMENTS) {
                    return paths_1.Paths.courtOfferedInstalmentsPage.evaluateUri({ externalId: externalId });
                }
                if (claimResponse.paymentIntention.paymentOption === paymentOption_1.PaymentOption.BY_SPECIFIED_DATE) {
                    return paths_1.Paths.courtOfferedSetDatePage.evaluateUri({ externalId: externalId });
                }
                break;
            }
            case decisionType_1.DecisionType.CLAIMANT:
            case decisionType_1.DecisionType.CLAIMANT_IN_FAVOUR_OF_DEFENDANT: {
                return paths_1.Paths.counterOfferAcceptedPage.evaluateUri({ externalId: externalId });
            }
        }
    }
    postValidation(req, res) {
        const model = req.body.model;
        if (model.firstPaymentDate) {
            const validDate = paydateHelper_1.getEarliestPaymentDateForPaymentPlan(res.locals.claim, model.firstPaymentDate.toMoment());
            if (validDate && validDate > model.firstPaymentDate.toMoment()) {
                const error = {
                    target: model,
                    property: 'firstPaymentDate',
                    value: model.firstPaymentDate.toMoment(),
                    constraints: { 'Failed': 'Enter a date of  ' + validDate.format('DD MM YYYY') + ' or later for the first instalment' },
                    children: undefined
                };
                return new form_1.FormValidationError(error);
            }
        }
        return undefined;
    }
}
exports.PaymentPlanPage = PaymentPlanPage;
/* tslint:disable:no-default-export */
exports.default = new PaymentPlanPage()
    .buildRouter(paths_1.claimantResponsePath, (req, res, next) => {
    const claim = res.locals.claim;
    const response = claim.response;
    if (!claim.claimData.defendant.isBusiness()) {
        if (response.statementOfMeans === undefined) {
            return next(new Error('Page cannot be rendered because response does not have statement of means'));
        }
    }
    next();
}, (req, res, next) => {
    const claim = res.locals.claim;
    const response = claim.response;
    res.locals.monthlyIncomeAmount = response.statementOfMeans && response.statementOfMeans.incomes ? calculateMonthlyIncomeExpense_1.CalculateMonthlyIncomeExpense.calculateTotalAmount(response.statementOfMeans.incomes.map(income => incomeExpenseSource_1.IncomeExpenseSource.fromClaimIncome(income))) : 0;
    res.locals.monthlyExpensesAmount = response.statementOfMeans && response.statementOfMeans.expenses ? calculateMonthlyIncomeExpense_1.CalculateMonthlyIncomeExpense.calculateTotalAmount(response.statementOfMeans.expenses.map(expense => incomeExpenseSource_1.IncomeExpenseSource.fromClaimExpense(expense))) : 0;
    res.locals.statementOfMeans = response.statementOfMeans;
    next();
});
