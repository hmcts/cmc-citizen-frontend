"use strict";
/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const randomstring = require("randomstring");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const howMuchOwed_1 = require("features/response/form/models/howMuchOwed");
const validationErrors_1 = require("forms/validation/validationErrors");
const validationConstraints_1 = require("forms/validation/validationConstraints");
describe('HowMuchOwed', () => {
    describe('constructor', () => {
        it('should set the primitive fields to undefined', () => {
            const howMuchOwed = new howMuchOwed_1.HowMuchOwed();
            chai_1.expect(howMuchOwed.amount).to.be.undefined;
            chai_1.expect(howMuchOwed.text).to.be.undefined;
        });
    });
    describe('deserialize', () => {
        it('should return an instance initialised with defaults for undefined', () => {
            chai_1.expect(new howMuchOwed_1.HowMuchOwed().deserialize(undefined)).to.eql(new howMuchOwed_1.HowMuchOwed());
        });
        it('should return an instance from given object', () => {
            const description = 'I do not owe full amount';
            const amount = 300;
            const result = new howMuchOwed_1.HowMuchOwed().deserialize({
                amount: amount,
                text: description
            });
            chai_1.expect(result.amount).to.be.equal(amount);
            chai_1.expect(result.text).to.be.equal(description);
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        it('should reject how much owed text with undefined', () => {
            const errors = validator.validateSync(new howMuchOwed_1.HowMuchOwed(300, undefined));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.WHY_NOT_OWE_FULL_AMOUNT_REQUIRED);
        });
        it('should reject how much owed text with text not defined', () => {
            const errors = validator.validateSync(new howMuchOwed_1.HowMuchOwed(300));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.WHY_NOT_OWE_FULL_AMOUNT_REQUIRED);
        });
        it('should reject how much owed text with empty string', () => {
            const errors = validator.validateSync(new howMuchOwed_1.HowMuchOwed(300, ''));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.WHY_NOT_OWE_FULL_AMOUNT_REQUIRED);
        });
        it('should reject how much owed text with white spaces string', () => {
            const errors = validator.validateSync(new howMuchOwed_1.HowMuchOwed(300, '    '));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.WHY_NOT_OWE_FULL_AMOUNT_REQUIRED);
        });
        it('should reject when amount not specified', () => {
            const errors = validator.validateSync(new howMuchOwed_1.HowMuchOwed(undefined, 'i don’t full the amount of £300'));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.AMOUNT_REQUIRED);
        });
        it('should reject when negative amount specified', () => {
            const errors = validator.validateSync(new howMuchOwed_1.HowMuchOwed(-300, 'i don’t owe full amount of £300'));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.VALID_OWED_AMOUNT_REQUIRED);
        });
        it('should reject how much owed text with more than max allowed characters', () => {
            const text = randomstring.generate({
                length: validationConstraints_1.ValidationConstraints.FREE_TEXT_MAX_LENGTH + 1,
                charset: 'alphabetic'
            });
            const errors = validator.validateSync(new howMuchOwed_1.HowMuchOwed(300, text));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.TEXT_TOO_LONG);
        });
        it('should accept how much owed text with max allowed characters', () => {
            const errors = validator.validateSync(new howMuchOwed_1.HowMuchOwed(300, randomstring.generate(validationConstraints_1.ValidationConstraints.FREE_TEXT_MAX_LENGTH)));
            chai_1.expect(errors.length).to.equal(0);
        });
        it('should accept valid how much owed text', () => {
            const errors = validator.validateSync(new howMuchOwed_1.HowMuchOwed(300, 'i don’t owe full amount of £300'));
            chai_1.expect(errors.length).to.equal(0);
        });
    });
});
