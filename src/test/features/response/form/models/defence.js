"use strict";
/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const validationConstraints_1 = require("forms/validation/validationConstraints");
const defence_1 = require("response/form/models/defence");
const validationErrors_1 = require("forms/validation/validationErrors");
describe('Defence', () => {
    describe('constructor', () => {
        it('should set the primitive fields to undefined', () => {
            const defence = new defence_1.Defence();
            chai_1.expect(defence.text).to.be.undefined;
        });
    });
    describe('deserialize', () => {
        it('should return an instance initialised with defaults for undefined', () => {
            chai_1.expect(new defence_1.Defence().deserialize(undefined)).to.eql(new defence_1.Defence());
        });
        it('should return an instance initialised with defaults for null', () => {
            chai_1.expect(new defence_1.Defence().deserialize(null)).to.eql(new defence_1.Defence());
        });
        it('should return an instance from given object', () => {
            const description = 'I do not owe this money';
            const result = new defence_1.Defence().deserialize({
                text: description
            });
            chai_1.expect(result.text).to.be.equals(description);
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        it('should reject defence text with undefined', () => {
            const errors = validator.validateSync(new defence_1.Defence(undefined));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, defence_1.ValidationErrors.DEFENCE_REQUIRED);
        });
        it('should reject defence text with null type', () => {
            const errors = validator.validateSync(new defence_1.Defence(null));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, defence_1.ValidationErrors.DEFENCE_REQUIRED);
        });
        it('should reject defence text with empty string', () => {
            const errors = validator.validateSync(new defence_1.Defence(''));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, defence_1.ValidationErrors.DEFENCE_REQUIRED);
        });
        it('should reject defence text with white spaces string', () => {
            const errors = validator.validateSync(new defence_1.Defence('   '));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, defence_1.ValidationErrors.DEFENCE_REQUIRED);
        });
        it('should reject defence text with more than max allowed characters', () => {
            const text = validationUtils_1.generateString(validationConstraints_1.ValidationConstraints.FREE_TEXT_MAX_LENGTH + 1);
            const errors = validator.validateSync(new defence_1.Defence(text));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.TEXT_TOO_LONG);
        });
        it('should accept defence text with max allowed characters', () => {
            const errors = validator.validateSync(new defence_1.Defence(validationUtils_1.generateString(validationConstraints_1.ValidationConstraints.FREE_TEXT_MAX_LENGTH)));
            chai_1.expect(errors.length).to.equal(0);
        });
        it('should accept valid defence text', () => {
            const errors = validator.validateSync(new defence_1.Defence('i am owed money £300'));
            chai_1.expect(errors.length).to.equal(0);
        });
    });
});
