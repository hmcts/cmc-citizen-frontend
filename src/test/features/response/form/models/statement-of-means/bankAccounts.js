"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const bankAccounts_1 = require("response/form/models/statement-of-means/bankAccounts");
const bankAccountRow_1 = require("response/form/models/statement-of-means/bankAccountRow");
const bankAccountType_1 = require("response/form/models/statement-of-means/bankAccountType");
describe('BankAccounts', () => {
    describe('on init', () => {
        it(`should create array of ${bankAccounts_1.INIT_ROW_COUNT} empty instances of BankAccountRow`, () => {
            const actual = (new bankAccounts_1.BankAccounts()).rows;
            chai_1.expect(actual.length).to.equal(bankAccounts_1.INIT_ROW_COUNT);
            expectAllRowsToBeEmpty(actual);
        });
    });
    describe('fromObject', () => {
        it('should return undefined value when undefined provided', () => {
            const actual = bankAccounts_1.BankAccounts.fromObject(undefined);
            chai_1.expect(actual).to.eql(undefined);
        });
        it('should return BankAccounts with list of empty BankAccountRow[] when empty input given', () => {
            const actual = bankAccounts_1.BankAccounts.fromObject([]);
            expectAllRowsToBeEmpty(actual.rows);
        });
        it('should return BankAccounts with first element on list populated', () => {
            const actual = bankAccounts_1.BankAccounts.fromObject({
                rows: [
                    { typeOfAccount: bankAccountType_1.BankAccountType.SAVING_ACCOUNT.value, joint: true, balance: 100 }
                ]
            });
            const populatedItem = actual.rows.pop();
            chai_1.expect(populatedItem.typeOfAccount).to.eq(bankAccountType_1.BankAccountType.SAVING_ACCOUNT);
            chai_1.expect(populatedItem.joint).to.eq(true);
            chai_1.expect(populatedItem.balance).to.eq(100);
            expectAllRowsToBeEmpty(actual.rows);
        });
    });
});
function expectAllRowsToBeEmpty(rows) {
    rows.forEach(item => {
        chai_1.expect(item).instanceof(bankAccountRow_1.BankAccountRow);
        chai_1.expect(item.typeOfAccount).to.eq(undefined);
        chai_1.expect(item.joint).to.eq(undefined);
        chai_1.expect(item.balance).to.eq(undefined);
    });
}
