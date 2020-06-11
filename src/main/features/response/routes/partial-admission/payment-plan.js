"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const payment_plan_1 = require("shared/components/payment-intention/payment-plan");
const model_accessor_1 = require("shared/components/model-accessor");
const optInFeatureToggleGuard_1 = require("guards/optInFeatureToggleGuard");
const calculateMonthlyIncomeExpense_1 = require("common/calculate-monthly-income-expense/calculateMonthlyIncomeExpense");
const incomeExpenseSources_1 = require("common/calculate-monthly-income-expense/incomeExpenseSources");
const paths_1 = require("response/paths");
class ModelAccessor extends model_accessor_1.AbstractModelAccessor {
    get(draft) {
        return draft.partialAdmission.paymentIntention;
    }
    set(draft, model) {
        draft.partialAdmission.paymentIntention = model;
    }
}
class PaymentPlanPage extends payment_plan_1.AbstractPaymentPlanPage {
    getHeading() {
        return 'Your repayment plan';
    }
    createModelAccessor() {
        return new ModelAccessor();
    }
    buildPostSubmissionUri(req, res) {
        const { externalId } = req.params;
        return paths_1.Paths.taskListPage.evaluateUri({ externalId: externalId });
    }
}
/* tslint:disable:no-default-export */
exports.default = new PaymentPlanPage()
    .buildRouter(paths_1.partialAdmissionPath, optInFeatureToggleGuard_1.OptInFeatureToggleGuard.featureEnabledGuard('admissions'), (req, res, next) => {
    const draft = res.locals.draft;
    res.locals.monthlyIncomeAmount = draft.document.statementOfMeans ? calculateMonthlyIncomeExpense_1.CalculateMonthlyIncomeExpense.calculateTotalAmount(incomeExpenseSources_1.IncomeExpenseSources.fromMonthlyIncomeFormModel(draft.document.statementOfMeans.monthlyIncome).incomeExpenseSources) : 0;
    res.locals.monthlyExpensesAmount = draft.document.statementOfMeans ? calculateMonthlyIncomeExpense_1.CalculateMonthlyIncomeExpense.calculateTotalAmount(incomeExpenseSources_1.IncomeExpenseSources.fromMonthlyExpensesFormModel(draft.document.statementOfMeans.monthlyExpenses).incomeExpenseSources) : 0;
    next();
});
