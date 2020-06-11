"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const monthlyExpenseType_1 = require("response/form/models/statement-of-means/monthlyExpenseType");
var ExpenseTypeViewFilter;
(function (ExpenseTypeViewFilter) {
    function render(value) {
        return monthlyExpenseType_1.MonthlyExpenseType.valueOf(value).displayValue;
    }
    ExpenseTypeViewFilter.render = render;
})(ExpenseTypeViewFilter = exports.ExpenseTypeViewFilter || (exports.ExpenseTypeViewFilter = {}));
