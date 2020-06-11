"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const debtRow_1 = require("response/form/models/statement-of-means/debtRow");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const validationErrors_1 = require("forms/validation/validationErrors");
const validationConstraints_1 = require("forms/validation/validationConstraints");
describe('DebtRow', () => {
    describe('deserialize', () => {
        it('should return empty object for undefined', () => {
            const actual = new debtRow_1.DebtRow().deserialize(undefined);
            chai_1.expect(actual).instanceof(debtRow_1.DebtRow);
            chai_1.expect(actual.debt).to.eq(undefined);
            chai_1.expect(actual.totalOwed).to.eq(undefined);
            chai_1.expect(actual.monthlyPayments).to.eq(undefined);
        });
        it('should return populated object', () => {
            const actual = new debtRow_1.DebtRow().deserialize({
                debt: 'credit card', totalOwed: 100, monthlyPayments: 10
            });
            chai_1.expect(actual).instanceof(debtRow_1.DebtRow);
            chai_1.expect(actual.debt).to.eq('credit card');
            chai_1.expect(actual.totalOwed).to.eq(100);
            chai_1.expect(actual.monthlyPayments).to.eq(10);
        });
    });
    describe('fromObject', () => {
        it('should return undefined when undefined given', () => {
            const actual = debtRow_1.DebtRow.fromObject(undefined);
            chai_1.expect(actual).to.be.eq(undefined);
        });
        it('should return populated object', () => {
            const actual = debtRow_1.DebtRow.fromObject({
                debt: 'credit card', totalOwed: 100, monthlyPayments: 10
            });
            chai_1.expect(actual).instanceof(debtRow_1.DebtRow);
            chai_1.expect(actual.debt).to.eq('credit card');
            chai_1.expect(actual.totalOwed).to.eq(100);
            chai_1.expect(actual.monthlyPayments).to.eq(10);
        });
    });
    describe('empty', () => {
        it('should return empty instances of DebtRow', () => {
            const actual = debtRow_1.DebtRow.empty();
            chai_1.expect(actual).instanceof(debtRow_1.DebtRow);
            chai_1.expect(actual.debt).to.eq(undefined);
            chai_1.expect(actual.totalOwed).to.eq(undefined);
            chai_1.expect(actual.monthlyPayments).to.eq(undefined);
        });
    });
    describe('isAtLeastOnePopulated', () => {
        context('should return true', () => {
            it('when all populated (valid values)', () => {
                const actual = new debtRow_1.DebtRow('credit', 1, 1);
                chai_1.expect(actual.isAtLeastOneFieldPopulated()).to.be.eq(true);
            });
            it('when all populated (invalid values)', () => {
                const actual = new debtRow_1.DebtRow(validationUtils_1.generateString(validationConstraints_1.ValidationConstraints.STANDARD_TEXT_INPUT_MAX_LENGTH + 1), -1, 1.111);
                chai_1.expect(actual.isAtLeastOneFieldPopulated()).to.be.eq(true);
            });
            it('when description populated', () => {
                const actual = new debtRow_1.DebtRow('credit', undefined, undefined);
                chai_1.expect(actual.isAtLeastOneFieldPopulated()).to.be.eq(true);
            });
            it('when description populated', () => {
                const actual = new debtRow_1.DebtRow(undefined, 1, undefined);
                chai_1.expect(actual.isAtLeastOneFieldPopulated()).to.be.eq(true);
            });
            it('when totalOwed populated', () => {
                const actual = new debtRow_1.DebtRow(undefined, 1, undefined);
                chai_1.expect(actual.isAtLeastOneFieldPopulated()).to.be.eq(true);
            });
            it('when monthlyPayments populated', () => {
                const actual = new debtRow_1.DebtRow(undefined, undefined, 1);
                chai_1.expect(actual.isAtLeastOneFieldPopulated()).to.be.eq(true);
            });
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        context('should accept', () => {
            it('when all fields undefined', () => {
                const errors = validator.validateSync(new debtRow_1.DebtRow(undefined, undefined, undefined));
                chai_1.expect(errors.length).to.equal(0);
            });
            it('when all are valid', () => {
                const errors = validator.validateSync(new debtRow_1.DebtRow('credit card', 100, 10));
                chai_1.expect(errors.length).to.equal(0);
            });
            it('when total owed has minimal value of 1 penny', () => {
                const errors = validator.validateSync(new debtRow_1.DebtRow('credit card', 0.01, 0));
                chai_1.expect(errors.length).to.equal(0);
            });
        });
        context('should reject', () => {
            it('when invalid totalOwed', () => {
                const errors = validator.validateSync(new debtRow_1.DebtRow('credit card', 10.111, 1));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.AMOUNT_INVALID_DECIMALS);
            });
            it('when invalid monthlyPayments', () => {
                const errors = validator.validateSync(new debtRow_1.DebtRow('credit card', 100, 10.111));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.AMOUNT_INVALID_DECIMALS);
            });
            it('when negative totalOwed', () => {
                const errors = validator.validateSync(new debtRow_1.DebtRow('credit card', -10, 1));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.POSITIVE_NUMBER_REQUIRED);
            });
            it('when negative monthlyPayments', () => {
                const errors = validator.validateSync(new debtRow_1.DebtRow('credit card', -10, 1));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.POSITIVE_NUMBER_REQUIRED);
            });
            it('when total owed equal zero', () => {
                const errors = validator.validateSync(new debtRow_1.DebtRow('card', 0, 1));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.POSITIVE_NUMBER_REQUIRED);
            });
            it('when empty total owed', () => {
                const errors = validator.validateSync(new debtRow_1.DebtRow('card', undefined, 1));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, debtRow_1.ValidationErrors.TOTAL_OWED_REQUIRED);
            });
            it('when empty monthly payments', () => {
                const errors = validator.validateSync(new debtRow_1.DebtRow('card', 1, undefined));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, debtRow_1.ValidationErrors.MONTHLY_PAYMENT_REQUIRED);
            });
            it('when empty description', () => {
                const errors = validator.validateSync(new debtRow_1.DebtRow('', 10, 1));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, debtRow_1.ValidationErrors.DEBT_REQUIRED);
            });
            it('when too long description', () => {
                const errors = validator.validateSync(new debtRow_1.DebtRow(validationUtils_1.generateString(validationConstraints_1.ValidationConstraints.STANDARD_TEXT_INPUT_MAX_LENGTH + 1), 10, 1));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.TEXT_TOO_LONG);
            });
        });
    });
});
