"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const multiRowForm_1 = require("forms/models/multiRowForm");
const bankAccountRow_1 = require("response/form/models/statement-of-means/bankAccountRow");
exports.MAX_NUMBER_OF_ROWS = 10;
exports.INIT_ROW_COUNT = 2;
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.AT_LEAST_ONE_ROW_REQUIRED = 'Enter at least one account';
class BankAccounts extends multiRowForm_1.MultiRowForm {
    static fromObject(value) {
        if (!value) {
            return value;
        }
        return new BankAccounts(value.rows ? value.rows.map(bankAccountRow_1.BankAccountRow.fromObject) : []);
    }
    createEmptyRow() {
        return bankAccountRow_1.BankAccountRow.empty();
    }
    getInitialNumberOfRows() {
        return exports.INIT_ROW_COUNT;
    }
    getMaxNumberOfRows() {
        return exports.MAX_NUMBER_OF_ROWS;
    }
}
exports.BankAccounts = BankAccounts;
