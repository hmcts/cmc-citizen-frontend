"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const monthlyIncomeType_1 = require("response/form/models/statement-of-means/monthlyIncomeType");
var IncomeTypeViewFilter;
(function (IncomeTypeViewFilter) {
    function render(value) {
        return monthlyIncomeType_1.MonthlyIncomeType.valueOf(value).displayValue;
    }
    IncomeTypeViewFilter.render = render;
})(IncomeTypeViewFilter = exports.IncomeTypeViewFilter || (exports.IncomeTypeViewFilter = {}));
