"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const amountDescriptionRow_1 = require("response/form/models/statement-of-means/amountDescriptionRow");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const validationConstraints_1 = require("forms/validation/validationConstraints");
describe('AmountDescriptionRow', () => {
    describe('deserialize', () => {
        it('should return empty object for undefined', () => {
            const actual = new amountDescriptionRow_1.AmountDescriptionRow().deserialize(undefined);
            chai_1.expect(actual).instanceof(amountDescriptionRow_1.AmountDescriptionRow);
            chai_1.expect(actual.description).to.eq(undefined);
            chai_1.expect(actual.amount).to.eq(undefined);
        });
        it('should return populated object', () => {
            const actual = new amountDescriptionRow_1.AmountDescriptionRow().deserialize({
                debt: 'credit card', totalOwed: 100, monthlyPayments: 10
            });
            chai_1.expect(actual).instanceof(amountDescriptionRow_1.AmountDescriptionRow);
            chai_1.expect(actual.description).to.eq(undefined);
            chai_1.expect(actual.amount).to.eq(undefined);
        });
    });
    describe('fromObject', () => {
        it('should return undefined when undefined given', () => {
            const actual = amountDescriptionRow_1.AmountDescriptionRow.fromObject(undefined);
            chai_1.expect(actual).to.be.eq(undefined);
        });
        it('should return populated object', () => {
            const actual = amountDescriptionRow_1.AmountDescriptionRow.fromObject({
                debt: 'credit card', totalOwed: 100, monthlyPayments: 10
            });
            chai_1.expect(actual).instanceof(amountDescriptionRow_1.AmountDescriptionRow);
            chai_1.expect(actual.description).to.eq(undefined);
            chai_1.expect(actual.amount).to.eq(undefined);
        });
    });
    describe('empty', () => {
        it('should return empty instances of AmountDescriptionRow', () => {
            const actual = amountDescriptionRow_1.AmountDescriptionRow.empty();
            chai_1.expect(actual).instanceof(amountDescriptionRow_1.AmountDescriptionRow);
            chai_1.expect(actual.description).to.eq(undefined);
            chai_1.expect(actual.amount).to.eq(undefined);
        });
    });
    describe('isAtLeastOnePopulated', () => {
        context('should return true', () => {
            it('when all populated (valid values)', () => {
                const actual = new amountDescriptionRow_1.AmountDescriptionRow('offence', 1);
                chai_1.expect(actual.isAtLeastOneFieldPopulated()).to.be.eq(true);
            });
            it('when all populated (invalid values)', () => {
                const actual = new amountDescriptionRow_1.AmountDescriptionRow(validationUtils_1.generateString(validationConstraints_1.ValidationConstraints.STANDARD_TEXT_INPUT_MAX_LENGTH + 1), -1);
                chai_1.expect(actual.isAtLeastOneFieldPopulated()).to.be.eq(true);
            });
            it('when details populated', () => {
                const actual = new amountDescriptionRow_1.AmountDescriptionRow('abc', undefined);
                chai_1.expect(actual.isAtLeastOneFieldPopulated()).to.be.eq(true);
            });
            it('when amount populated', () => {
                const actual = new amountDescriptionRow_1.AmountDescriptionRow(undefined, 1);
                chai_1.expect(actual.isAtLeastOneFieldPopulated()).to.be.eq(true);
            });
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        context('should accept', () => {
            it('when all fields undefined', () => {
                const errors = validator.validateSync(new amountDescriptionRow_1.AmountDescriptionRow(undefined, undefined));
                chai_1.expect(errors.length).to.equal(0);
            });
            it('when all are valid', () => {
                const errors = validator.validateSync(new amountDescriptionRow_1.AmountDescriptionRow('abc', 100));
                chai_1.expect(errors.length).to.equal(0);
            });
        });
        context('should reject', () => {
            it('when invalid amount', () => {
                const errors = validator.validateSync(new amountDescriptionRow_1.AmountDescriptionRow('abc', 10.111));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, amountDescriptionRow_1.ValidationErrors.AMOUNT_INVALID_DECIMALS);
            });
            it('when negative amount', () => {
                const errors = validator.validateSync(new amountDescriptionRow_1.AmountDescriptionRow('abc', -10));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, amountDescriptionRow_1.ValidationErrors.POSITIVE_NUMBER_REQUIRED);
            });
            it('when amount = 0', () => {
                const errors = validator.validateSync(new amountDescriptionRow_1.AmountDescriptionRow('abc', 0));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, amountDescriptionRow_1.ValidationErrors.POSITIVE_NUMBER_REQUIRED);
            });
            it('when empty amount', () => {
                const errors = validator.validateSync(new amountDescriptionRow_1.AmountDescriptionRow('card', undefined));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, amountDescriptionRow_1.ValidationErrors.POSITIVE_NUMBER_REQUIRED);
            });
            it('when empty details', () => {
                const errors = validator.validateSync(new amountDescriptionRow_1.AmountDescriptionRow('', 10));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, amountDescriptionRow_1.ValidationErrors.DESCRIPTION_REQUIRED);
            });
            it('when too long details', () => {
                const errors = validator.validateSync(new amountDescriptionRow_1.AmountDescriptionRow(validationUtils_1.generateString(validationConstraints_1.ValidationConstraints.STANDARD_TEXT_INPUT_MAX_LENGTH + 1), 10));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, amountDescriptionRow_1.ValidationErrors.DESCRIPTION_TOO_LONG);
            });
        });
    });
});
