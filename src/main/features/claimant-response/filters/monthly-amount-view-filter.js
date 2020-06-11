"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const incomeExpenseSchedule_1 = require("common/calculate-monthly-income-expense/incomeExpenseSchedule");
var MonthlyAmountViewFilter;
(function (MonthlyAmountViewFilter) {
    function render(income) {
        if (!income || !income.frequency || !(income.amount >= 0)) {
            throw new Error('Must be a valid FrequencyBasedAmount');
        }
        switch (income.frequency) {
            case incomeExpenseSchedule_1.IncomeExpenseSchedule.WEEK.value:
                return income.amount * incomeExpenseSchedule_1.IncomeExpenseSchedule.WEEK.valueInMonths;
            case incomeExpenseSchedule_1.IncomeExpenseSchedule.TWO_WEEKS.value:
                return income.amount * incomeExpenseSchedule_1.IncomeExpenseSchedule.TWO_WEEKS.valueInMonths;
            case incomeExpenseSchedule_1.IncomeExpenseSchedule.FOUR_WEEKS.value:
                return income.amount * incomeExpenseSchedule_1.IncomeExpenseSchedule.FOUR_WEEKS.valueInMonths;
            case incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH.value:
                return income.amount;
        }
    }
    MonthlyAmountViewFilter.render = render;
})(MonthlyAmountViewFilter = exports.MonthlyAmountViewFilter || (exports.MonthlyAmountViewFilter = {}));
