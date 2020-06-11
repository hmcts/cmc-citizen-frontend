"use strict";
/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const statementOfTruth_1 = require("forms/models/statementOfTruth");
describe('StatementOfTruth', () => {
    describe('constructor', () => {
        it('should set the primitive fields to undefined', () => {
            const statementOfTruth = new statementOfTruth_1.StatementOfTruth();
            chai_1.expect(statementOfTruth.signed).to.be.undefined;
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        it('should reject claim statement of truth with null type', () => {
            const errors = validator.validateSync(new statementOfTruth_1.StatementOfTruth(null));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, statementOfTruth_1.ValidationErrors.STATEMENT_OF_TRUTH_REQUIRED_MESSAGE);
        });
        it('should reject claim statement of truth with empty string', () => {
            const errors = validator.validateSync(new statementOfTruth_1.StatementOfTruth());
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, statementOfTruth_1.ValidationErrors.STATEMENT_OF_TRUTH_REQUIRED_MESSAGE);
        });
        it('should reject claim statement of truth without accepting the facts stated in the claim', () => {
            const errors = validator.validateSync(new statementOfTruth_1.StatementOfTruth(undefined));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, statementOfTruth_1.ValidationErrors.STATEMENT_OF_TRUTH_REQUIRED_MESSAGE);
        });
        it('should accept claim statement of truth accepting the facts stated in the claim', () => {
            const errors = validator.validateSync(new statementOfTruth_1.StatementOfTruth(true));
            chai_1.expect(errors.length).to.equal(0);
        });
    });
});
