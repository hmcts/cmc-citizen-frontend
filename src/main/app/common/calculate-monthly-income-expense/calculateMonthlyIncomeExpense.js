"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
class CalculateMonthlyIncomeExpense {
    static calculateTotalAmount(sources) {
        const totalMonthlyAmount = _.reduce(sources, function (total, source) {
            const monthlyAmount = source.amount * source.schedule.valueInMonths;
            return total + monthlyAmount;
        }, 0);
        return _.round(totalMonthlyAmount, 2);
    }
}
exports.CalculateMonthlyIncomeExpense = CalculateMonthlyIncomeExpense;
