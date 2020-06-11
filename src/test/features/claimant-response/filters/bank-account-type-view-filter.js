"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bankAccountType_1 = require("features/response/form/models/statement-of-means/bankAccountType");
const chai_1 = require("chai");
const bank_account_type_view_filter_1 = require("claimant-response/filters/bank-account-type-view-filter");
describe('Bank account type view filter', () => {
    bankAccountType_1.BankAccountType.all()
        .forEach(type => {
        it(`should map '${type.value}' to '${type.displayValue}'`, () => {
            chai_1.expect(bank_account_type_view_filter_1.BankAccountTypeViewFilter.render(type.value)).to.equal(type.displayValue);
        });
    });
    it('should throw an error for anything else', () => {
        chai_1.expect(() => bank_account_type_view_filter_1.BankAccountTypeViewFilter.render('RIVER_BANK')).to.throw(TypeError);
    });
    it('should throw and error for null', () => {
        chai_1.expect(() => bank_account_type_view_filter_1.BankAccountTypeViewFilter.render(null)).to.throw(TypeError);
    });
});
