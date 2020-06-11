"use strict";
/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const validationErrors_1 = require("forms/validation/validationErrors");
const validationConstraints_1 = require("forms/validation/validationConstraints");
const disagreeReason_1 = require("orders/form/models/disagreeReason");
describe('DisagreeReason', () => {
    describe('constructor', () => {
        it('should set the primitive fields to undefined', () => {
            const reason = new disagreeReason_1.DisagreeReason();
            chai_1.expect(reason.reason).to.be.undefined;
        });
    });
    describe('deserialize', () => {
        it('should return an instance initialised with defaults for undefined', () => {
            chai_1.expect(new disagreeReason_1.DisagreeReason().deserialize(undefined)).to.eql(new disagreeReason_1.DisagreeReason());
        });
        it('should return an instance initialised with defaults for null', () => {
            chai_1.expect(new disagreeReason_1.DisagreeReason().deserialize(null)).to.eql(new disagreeReason_1.DisagreeReason());
        });
        it('should return an instance from given object', () => {
            const description = 'I want a judge to review the order';
            const result = new disagreeReason_1.DisagreeReason().deserialize({
                reason: description
            });
            chai_1.expect(result.reason).to.be.equals(description);
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        it('should accept reason with empty string', () => {
            const errors = validator.validateSync(new disagreeReason_1.DisagreeReason(''));
            chai_1.expect(errors).to.be.empty;
        });
        it('should accept reason with white spaces string', () => {
            const errors = validator.validateSync(new disagreeReason_1.DisagreeReason('   '));
            chai_1.expect(errors).to.be.empty;
        });
        it('should reject claim reason with more than max allowed characters', () => {
            const errors = validator.validateSync(new disagreeReason_1.DisagreeReason(validationUtils_1.generateString(validationConstraints_1.ValidationConstraints.FREE_TEXT_MAX_LENGTH_1000 + 1)));
            chai_1.expect(errors).to.have.lengthOf(1);
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.TEXT_TOO_LONG);
        });
        it('should accept claim reason with max allowed characters', () => {
            const errors = validator.validateSync(new disagreeReason_1.DisagreeReason(validationUtils_1.generateString(validationConstraints_1.ValidationConstraints.FREE_TEXT_MAX_LENGTH_1000)));
            chai_1.expect(errors).to.be.empty;
        });
        it('should accept valid claim reason', () => {
            const errors = validator.validateSync(new disagreeReason_1.DisagreeReason('i am owed money £300'));
            chai_1.expect(errors).to.be.empty;
        });
    });
});
