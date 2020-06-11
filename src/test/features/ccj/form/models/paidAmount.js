"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const paidAmount_1 = require("ccj/form/models/paidAmount");
const yesNoOption_1 = require("ccj/form/models/yesNoOption");
describe('PaidAmount', () => {
    describe('deserialize', () => {
        it('should not populate fields when object not given', () => {
            const paidAmount = new paidAmount_1.PaidAmount().deserialize({});
            chai_1.expect(paidAmount.amount).to.equal(undefined);
            chai_1.expect(paidAmount.option).to.equal(undefined);
        });
        it('should populate only option for "NO"', () => {
            const paidAmount = new paidAmount_1.PaidAmount().deserialize({ option: yesNoOption_1.PaidAmountOption.NO });
            chai_1.expect(paidAmount.amount).to.equal(undefined);
            chai_1.expect(paidAmount.option).to.equal(yesNoOption_1.PaidAmountOption.NO);
        });
        it('should populate all fields', () => {
            const paidAmount = new paidAmount_1.PaidAmount().deserialize({ option: yesNoOption_1.PaidAmountOption.YES, amount: 10 });
            chai_1.expect(paidAmount.amount).to.equal(10);
            chai_1.expect(paidAmount.option).to.equal(yesNoOption_1.PaidAmountOption.YES);
        });
    });
    describe('fromObject', () => {
        it('empty object should return unpopulated PaidAmount', () => {
            const paidAmount = paidAmount_1.PaidAmount.fromObject({});
            chai_1.expect(paidAmount.amount).to.equal(undefined);
            chai_1.expect(paidAmount.option).to.equal(undefined);
        });
        it('should not populate amount for option NO', () => {
            const paidAmount = paidAmount_1.PaidAmount.fromObject({ option: yesNoOption_1.PaidAmountOption.NO.value });
            chai_1.expect(paidAmount.amount).to.equal(undefined);
            chai_1.expect(paidAmount.option).to.equal(yesNoOption_1.PaidAmountOption.NO);
        });
        it('should populate amount for option YES', () => {
            const paidAmount = paidAmount_1.PaidAmount.fromObject({ option: yesNoOption_1.PaidAmountOption.YES.value, amount: 10 });
            chai_1.expect(paidAmount.amount).to.equal(10);
            chai_1.expect(paidAmount.option).to.equal(yesNoOption_1.PaidAmountOption.YES);
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        describe('should reject when', () => {
            it('undefined option', () => {
                const errors = validator.validateSync(new paidAmount_1.PaidAmount(undefined));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, paidAmount_1.ValidationErrors.OPTION_REQUIRED);
            });
            it('invalid option', () => {
                const errors = validator.validateSync(new paidAmount_1.PaidAmount(new yesNoOption_1.PaidAmountOption('maybe')));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, paidAmount_1.ValidationErrors.OPTION_REQUIRED);
            });
            it('valid option, but undefined amount', () => {
                const errors = validator.validateSync(new paidAmount_1.PaidAmount(yesNoOption_1.PaidAmountOption.YES, undefined));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, paidAmount_1.ValidationErrors.AMOUNT_REQUIRED);
            });
            it('valid option, but invalid amount (negative)', () => {
                const errors = validator.validateSync(new paidAmount_1.PaidAmount(yesNoOption_1.PaidAmountOption.YES, -10));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, paidAmount_1.ValidationErrors.AMOUNT_NOT_VALID);
            });
            it('valid option, but invalid amount (invalid decimals)', () => {
                const errors = validator.validateSync(new paidAmount_1.PaidAmount(yesNoOption_1.PaidAmountOption.YES, 10.523));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, paidAmount_1.ValidationErrors.AMOUNT_INVALID_DECIMALS);
            });
            it('valid option, but invalid amount (zero)', () => {
                const errors = validator.validateSync(new paidAmount_1.PaidAmount(yesNoOption_1.PaidAmountOption.YES, 0));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, paidAmount_1.ValidationErrors.AMOUNT_NOT_VALID);
            });
            it('valid option, valid amount, but greater that total amount', () => {
                const errors = validator.validateSync(new paidAmount_1.PaidAmount(yesNoOption_1.PaidAmountOption.YES, 100, 10));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, paidAmount_1.ValidationErrors.PAID_AMOUNT_GREATER_THAN_TOTAL_AMOUNT);
            });
            it('valid option, valid amount, but equal total amount', () => {
                const errors = validator.validateSync(new paidAmount_1.PaidAmount(yesNoOption_1.PaidAmountOption.YES, 100, 100));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, paidAmount_1.ValidationErrors.PAID_AMOUNT_GREATER_THAN_TOTAL_AMOUNT);
            });
        });
        describe('should accept when', () => {
            it('option is NO', () => {
                const errors = validator.validateSync(new paidAmount_1.PaidAmount(yesNoOption_1.PaidAmountOption.NO));
                chai_1.expect(errors.length).to.equal(0);
            });
            it('option is YES and amount is valid', () => {
                const errors = validator.validateSync(new paidAmount_1.PaidAmount(yesNoOption_1.PaidAmountOption.YES, 100, 1000));
                chai_1.expect(errors.length).to.equal(0);
            });
        });
    });
});
