"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const priorityDebtType_1 = require("response/form/models/statement-of-means/priorityDebtType");
var PriorityDebtTypeViewFilter;
(function (PriorityDebtTypeViewFilter) {
    function render(value) {
        if (!value) {
            throw new Error('Must be a valid priority debt type');
        }
        return priorityDebtType_1.PriorityDebtType.valueOf(value).displayValue;
    }
    PriorityDebtTypeViewFilter.render = render;
})(PriorityDebtTypeViewFilter = exports.PriorityDebtTypeViewFilter || (exports.PriorityDebtTypeViewFilter = {}));
