"use strict";
/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const reason_1 = require("claim/form/models/reason");
const validationErrors_1 = require("forms/validation/validationErrors");
const validationConstraints_1 = require("forms/validation/validationConstraints");
describe('Reason', () => {
    describe('constructor', () => {
        it('should set the primitive fields to undefined', () => {
            const reason = new reason_1.Reason();
            chai_1.expect(reason.reason).to.be.undefined;
        });
    });
    describe('deserialize', () => {
        it('should return an instance initialised with defaults for undefined', () => {
            chai_1.expect(new reason_1.Reason().deserialize(undefined)).to.eql(new reason_1.Reason());
        });
        it('should return an instance initialised with defaults for null', () => {
            chai_1.expect(new reason_1.Reason().deserialize(null)).to.eql(new reason_1.Reason());
        });
        it('should return an instance from given object', () => {
            const description = 'I am owed money 300';
            const result = new reason_1.Reason().deserialize({
                reason: description
            });
            chai_1.expect(result.reason).to.be.equals(description);
        });
    });
    describe('isCompleted', () => {
        it('should return false for the undefined', () => {
            const reason = new reason_1.Reason();
            chai_1.expect(reason.isCompleted()).to.be.false;
        });
        it('should return false for the empty string', () => {
            const reason = new reason_1.Reason('');
            chai_1.expect(reason.isCompleted()).to.be.false;
        });
        it('should return true for the a given reason', () => {
            const reason = new reason_1.Reason('Some reason');
            chai_1.expect(reason.isCompleted()).to.be.true;
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        it('should reject claim reason with undefined reason', () => {
            const errors = validator.validateSync(new reason_1.Reason(undefined));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, reason_1.ValidationErrors.REASON_REQUIRED);
        });
        it('should reject claim reason with null type', () => {
            const errors = validator.validateSync(new reason_1.Reason(null));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, reason_1.ValidationErrors.REASON_REQUIRED);
        });
        it('should reject claim reason with empty string', () => {
            const errors = validator.validateSync(new reason_1.Reason(''));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, reason_1.ValidationErrors.REASON_REQUIRED);
        });
        it('should reject claim reason with white spaces string', () => {
            const errors = validator.validateSync(new reason_1.Reason('   '));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, reason_1.ValidationErrors.REASON_REQUIRED);
        });
        it('should reject claim reason with more than max allowed characters', () => {
            const errors = validator.validateSync(new reason_1.Reason(validationUtils_1.generateString(validationConstraints_1.ValidationConstraints.FREE_TEXT_MAX_LENGTH + 1)));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.TEXT_TOO_LONG);
        });
        it('should accept claim reason with max allowed characters', () => {
            const errors = validator.validateSync(new reason_1.Reason(validationUtils_1.generateString(validationConstraints_1.ValidationConstraints.FREE_TEXT_MAX_LENGTH)));
            chai_1.expect(errors.length).to.equal(0);
        });
        it('should accept valid claim reason', () => {
            const errors = validator.validateSync(new reason_1.Reason('i am owed money £300'));
            chai_1.expect(errors.length).to.equal(0);
        });
    });
});
