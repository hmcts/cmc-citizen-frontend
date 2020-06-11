"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bankAccountType_1 = require("response/form/models/statement-of-means/bankAccountType");
var BankAccountTypeViewFilter;
(function (BankAccountTypeViewFilter) {
    function render(value) {
        return bankAccountType_1.BankAccountType.valueOf(value).displayValue;
    }
    BankAccountTypeViewFilter.render = render;
})(BankAccountTypeViewFilter = exports.BankAccountTypeViewFilter || (exports.BankAccountTypeViewFilter = {}));
