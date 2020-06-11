"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-unused-expression */
const chai_1 = require("chai");
const selfEmployment_1 = require("response/form/models/statement-of-means/selfEmployment");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const validationConstraints_1 = require("forms/validation/validationConstraints");
const validationErrors_1 = require("forms/validation/validationErrors");
describe('SelfEmployment', () => {
    context('deserialize()', () => {
        it('should return empty SelfEmployment for undefined given as input', () => {
            const actual = new selfEmployment_1.SelfEmployment().deserialize(undefined);
            chai_1.expect(actual).to.be.instanceof(selfEmployment_1.SelfEmployment);
            chai_1.expect(actual.jobTitle).to.be.undefined;
            chai_1.expect(actual.annualTurnover).to.be.undefined;
        });
        it('should return fully populated SelfEmployment', () => {
            const actual = new selfEmployment_1.SelfEmployment().deserialize({
                jobTitle: 'my role', annualTurnover: 10
            });
            chai_1.expect(actual.jobTitle).to.equal('my role');
            chai_1.expect(actual.annualTurnover).to.equal(10);
        });
    });
    context('fromObject()', () => {
        it('should return undefined when undefined given', () => {
            const actual = selfEmployment_1.SelfEmployment.fromObject(undefined);
            chai_1.expect(actual).to.be.undefined;
        });
        it('should return fully populated SelfEmployed', () => {
            const actual = selfEmployment_1.SelfEmployment.fromObject({
                jobTitle: 'my role', annualTurnover: 10
            });
            chai_1.expect(actual.jobTitle).to.equal('my role');
            chai_1.expect(actual.annualTurnover).to.equal(10);
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        context('should accept', () => {
            it('all fields given with valid values', () => {
                const errors = validator.validateSync(new selfEmployment_1.SelfEmployment('My role', 1000));
                chai_1.expect(errors).to.be.empty;
            });
        });
        context('should reject when', () => {
            it('empty object', () => {
                const errors = validator.validateSync(new selfEmployment_1.SelfEmployment());
                chai_1.expect(errors).to.have.length(2);
                validationUtils_1.expectValidationError(errors, selfEmployment_1.ValidationErrors.JOB_TITLE_REQUIRED);
                validationUtils_1.expectValidationError(errors, selfEmployment_1.ValidationErrors.ANNUAL_TURNOVER_REQUIRED);
            });
            it('too long role name', () => {
                const errors = validator.validateSync(new selfEmployment_1.SelfEmployment(validationUtils_1.generateString(validationConstraints_1.ValidationConstraints.STANDARD_TEXT_INPUT_MAX_LENGTH + 1), 1000));
                chai_1.expect(errors).to.have.length(1);
                validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.TEXT_TOO_LONG);
            });
            it('too many decimal digits for annualTurnover', () => {
                const errors = validator.validateSync(new selfEmployment_1.SelfEmployment('my role', 10.111));
                chai_1.expect(errors).to.have.length(1);
                validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.AMOUNT_INVALID_DECIMALS);
            });
            it('too much annualTurnover', () => {
                const errors = validator.validateSync(new selfEmployment_1.SelfEmployment('my role', validationConstraints_1.ValidationConstraints.MAX_VALUE + 1));
                chai_1.expect(errors).to.have.length(1);
                validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.AMOUNT_TOO_HIGH);
            });
            it('negative annualTurnover', () => {
                const errors = validator.validateSync(new selfEmployment_1.SelfEmployment('my role', -1));
                chai_1.expect(errors).to.have.length(1);
                validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED);
            });
        });
    });
});
