"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const bankAccountRow_1 = require("response/form/models/statement-of-means/bankAccountRow");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const validationErrors_1 = require("forms/validation/validationErrors");
const bankAccountType_1 = require("response/form/models/statement-of-means/bankAccountType");
describe('BankAccountRow', () => {
    describe('deserialize', () => {
        it('should return empty object for undefined', () => {
            const actual = new bankAccountRow_1.BankAccountRow().deserialize(undefined);
            chai_1.expect(actual).instanceof(bankAccountRow_1.BankAccountRow);
            chai_1.expect(actual.typeOfAccount).to.eq(undefined);
            chai_1.expect(actual.joint).to.eq(undefined);
            chai_1.expect(actual.balance).to.eq(undefined);
        });
        it('should return populated object', () => {
            const actual = new bankAccountRow_1.BankAccountRow().deserialize({
                typeOfAccount: bankAccountType_1.BankAccountType.SAVING_ACCOUNT, joint: false, balance: 10
            });
            chai_1.expect(actual).instanceof(bankAccountRow_1.BankAccountRow);
            chai_1.expect(actual.typeOfAccount).to.eq(bankAccountType_1.BankAccountType.SAVING_ACCOUNT);
            chai_1.expect(actual.joint).to.eq(false);
            chai_1.expect(actual.balance).to.eq(10);
        });
    });
    describe('fromObject', () => {
        it('should return undefined when undefined given', () => {
            const actual = bankAccountRow_1.BankAccountRow.fromObject(undefined);
            chai_1.expect(actual).to.be.eq(undefined);
        });
        it('should return populated object', () => {
            const actual = bankAccountRow_1.BankAccountRow.fromObject({
                typeOfAccount: bankAccountType_1.BankAccountType.SAVING_ACCOUNT.value, joint: false, balance: 10
            });
            chai_1.expect(actual).instanceof(bankAccountRow_1.BankAccountRow);
            chai_1.expect(actual.typeOfAccount).to.eq(bankAccountType_1.BankAccountType.SAVING_ACCOUNT);
            chai_1.expect(actual.joint).to.eq(false);
            chai_1.expect(actual.balance).to.eq(10);
        });
    });
    describe('empty', () => {
        it('should return empty instances of BankAccountRow', () => {
            const actual = bankAccountRow_1.BankAccountRow.empty();
            chai_1.expect(actual).instanceof(bankAccountRow_1.BankAccountRow);
            chai_1.expect(actual.typeOfAccount).to.eq(undefined);
            chai_1.expect(actual.joint).to.eq(undefined);
            chai_1.expect(actual.balance).to.eq(undefined);
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        context('should accept', () => {
            it('when all fields undefined', () => {
                const errors = validator.validateSync(new bankAccountRow_1.BankAccountRow(undefined, undefined, undefined));
                chai_1.expect(errors.length).to.equal(0);
            });
            it('when all are valid', () => {
                const errors = validator.validateSync(new bankAccountRow_1.BankAccountRow(bankAccountType_1.BankAccountType.SAVING_ACCOUNT, true, 10));
                chai_1.expect(errors.length).to.equal(0);
            });
        });
        context('should reject', () => {
            it('when invalid balance', () => {
                const errors = validator.validateSync(new bankAccountRow_1.BankAccountRow(bankAccountType_1.BankAccountType.SAVING_ACCOUNT, true, 10.111));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.AMOUNT_INVALID_DECIMALS);
            });
        });
    });
});
