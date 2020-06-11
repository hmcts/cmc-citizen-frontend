"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const courtOrderRow_1 = require("response/form/models/statement-of-means/courtOrderRow");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const validationErrors_1 = require("forms/validation/validationErrors");
describe('CourtOrderRow', () => {
    describe('deserialize', () => {
        it('should return empty object for undefined', () => {
            const actual = new courtOrderRow_1.CourtOrderRow().deserialize(undefined);
            chai_1.expect(actual).instanceof(courtOrderRow_1.CourtOrderRow);
            chai_1.expect(actual.claimNumber).to.eq(undefined);
            chai_1.expect(actual.amount).to.eq(undefined);
            chai_1.expect(actual.instalmentAmount).to.eq(undefined);
        });
        it('should return populated object', () => {
            const actual = new courtOrderRow_1.CourtOrderRow().deserialize({
                debt: 'credit card', totalOwed: 100, monthlyPayments: 10
            });
            chai_1.expect(actual).instanceof(courtOrderRow_1.CourtOrderRow);
            chai_1.expect(actual.instalmentAmount).to.eq(undefined);
            chai_1.expect(actual.amount).to.eq(undefined);
            chai_1.expect(actual.claimNumber).to.eq(undefined);
        });
    });
    describe('fromObject', () => {
        it('should return undefined when undefined given', () => {
            const actual = courtOrderRow_1.CourtOrderRow.fromObject(undefined);
            chai_1.expect(actual).to.be.eq(undefined);
        });
        it('should return populated object', () => {
            const actual = courtOrderRow_1.CourtOrderRow.fromObject({
                debt: 'credit card', totalOwed: 100, monthlyPayments: 10
            });
            chai_1.expect(actual).instanceof(courtOrderRow_1.CourtOrderRow);
            chai_1.expect(actual.instalmentAmount).to.eq(undefined);
            chai_1.expect(actual.amount).to.eq(undefined);
            chai_1.expect(actual.claimNumber).to.eq(undefined);
        });
    });
    describe('empty', () => {
        it('should return empty instances of CourtOrderRow', () => {
            const actual = courtOrderRow_1.CourtOrderRow.empty();
            chai_1.expect(actual).instanceof(courtOrderRow_1.CourtOrderRow);
            chai_1.expect(actual.instalmentAmount).to.eq(undefined);
            chai_1.expect(actual.amount).to.eq(undefined);
            chai_1.expect(actual.claimNumber).to.eq(undefined);
        });
    });
    describe('isAtLeastOnePopulated', () => {
        context('should return true', () => {
            it('when all populated (valid values)', () => {
                const actual = new courtOrderRow_1.CourtOrderRow(1, 1, 'abc');
                chai_1.expect(actual.isAtLeastOneFieldPopulated()).to.be.eq(true);
            });
            it('when amount populated and instalmentAmount', () => {
                const actual = new courtOrderRow_1.CourtOrderRow(1, 1, undefined);
                chai_1.expect(actual.isAtLeastOneFieldPopulated()).to.be.eq(true);
            });
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        context('should accept', () => {
            it('when all fields undefined', () => {
                const errors = validator.validateSync(new courtOrderRow_1.CourtOrderRow(undefined, undefined, undefined));
                chai_1.expect(errors.length).to.equal(0);
            });
            it('when all are valid', () => {
                const errors = validator.validateSync(new courtOrderRow_1.CourtOrderRow(100, 100, 'abc'));
                chai_1.expect(errors.length).to.equal(0);
            });
            it('when amount has minimal value of £1 pound', () => {
                const errors = validator.validateSync(new courtOrderRow_1.CourtOrderRow(1.00, 0, 'abc'));
                chai_1.expect(errors.length).to.equal(0);
            });
        });
        context('should reject', () => {
            it('when invalid amount and instalmentAmount', () => {
                const errors = validator.validateSync(new courtOrderRow_1.CourtOrderRow(10.111, 10.111, 'abc'));
                chai_1.expect(errors.length).to.equal(2);
                validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.AMOUNT_INVALID_DECIMALS);
            });
            it('when negative amount and instalmentAmount', () => {
                const errors = validator.validateSync(new courtOrderRow_1.CourtOrderRow(-10, -10, 'abc'));
                chai_1.expect(errors.length).to.equal(2);
                validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.AMOUNT_INVALID_LESS_THAN_ONE_POUND);
            });
            it('when amount equal £0', () => {
                const errors = validator.validateSync(new courtOrderRow_1.CourtOrderRow(0, 0, 'abc'));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.AMOUNT_INVALID_LESS_THAN_ONE_POUND);
            });
            it('when amount equal £0.99', () => {
                const errors = validator.validateSync(new courtOrderRow_1.CourtOrderRow(0.99, 0, 'abc'));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.AMOUNT_INVALID_LESS_THAN_ONE_POUND);
            });
            it('when empty amount and instalmentAmount', () => {
                const errors = validator.validateSync(new courtOrderRow_1.CourtOrderRow(undefined, undefined, 'abc'));
                chai_1.expect(errors.length).to.equal(2);
                validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.AMOUNT_INVALID_LESS_THAN_ONE_POUND);
            });
        });
    });
});
