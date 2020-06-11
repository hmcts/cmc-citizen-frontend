"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const employerRow_1 = require("response/form/models/statement-of-means/employerRow");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const validationConstraints_1 = require("forms/validation/validationConstraints");
const validationErrors_1 = require("forms/validation/validationErrors");
describe('EmployerRow', () => {
    describe('empty', () => {
        it('should return empty instances of EmployerRow', () => {
            const actual = employerRow_1.EmployerRow.empty();
            chai_1.expect(actual).instanceof(employerRow_1.EmployerRow);
            chai_1.expect(actual.jobTitle).to.eq(undefined);
            chai_1.expect(actual.employerName).to.eq(undefined);
        });
    });
    describe('isEmpty', () => {
        context('should return true when', () => {
            it('both fields are undefined', () => {
                const actual = employerRow_1.EmployerRow.fromObject({ employerName: undefined, jobTitle: undefined });
                chai_1.expect(actual.isEmpty()).to.eq(true);
            });
            it('both fields are empty string', () => {
                const actual = employerRow_1.EmployerRow.fromObject({ employerName: '', jobTitle: '' });
                chai_1.expect(actual.isEmpty()).to.eq(true);
            });
        });
        context('should return false when', () => {
            it('both fields are populated', () => {
                const actual = new employerRow_1.EmployerRow('a', 'b');
                chai_1.expect(actual.isEmpty()).to.eq(false);
            });
            it('only employerName is populated', () => {
                const actual = new employerRow_1.EmployerRow('a', 'b');
                chai_1.expect(actual.isEmpty()).to.eq(false);
            });
            it('only jobTitle is populated', () => {
                const actual = new employerRow_1.EmployerRow('', 'a');
                chai_1.expect(actual.isEmpty()).to.eq(false);
            });
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        context('should accept', () => {
            it('when both undefined', () => {
                const errors = validator.validateSync(new employerRow_1.EmployerRow(undefined, undefined));
                chai_1.expect(errors.length).to.equal(0);
            });
            it('when both are valid strings', () => {
                const errors = validator.validateSync(new employerRow_1.EmployerRow('employerName', 'jobTitle'));
                chai_1.expect(errors.length).to.equal(0);
            });
        });
        context('should reject', () => {
            it('when employerName given, but no jobTitle', () => {
                const errors = validator.validateSync(new employerRow_1.EmployerRow('employerName', ''));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, employerRow_1.ValidationErrors.JOB_TITLE_REQUIRED);
            });
            it('when jobTitle given, but no employerName', () => {
                const errors = validator.validateSync(new employerRow_1.EmployerRow('', 'director'));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, employerRow_1.ValidationErrors.EMPLOYER_NAME_REQUIRED);
            });
            it('when both args are empty strings', () => {
                const errors = validator.validateSync(new employerRow_1.EmployerRow('', ''));
                chai_1.expect(errors.length).to.equal(2);
                validationUtils_1.expectValidationError(errors, employerRow_1.ValidationErrors.EMPLOYER_NAME_REQUIRED);
                validationUtils_1.expectValidationError(errors, employerRow_1.ValidationErrors.JOB_TITLE_REQUIRED);
            });
            it('when employerName is too long', () => {
                const errors = validator.validateSync(new employerRow_1.EmployerRow(validationUtils_1.generateString(validationConstraints_1.ValidationConstraints.STANDARD_TEXT_INPUT_MAX_LENGTH + 1), 'dev'));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.TEXT_TOO_LONG);
            });
            it('when jobTitle is too long', () => {
                const errors = validator.validateSync(new employerRow_1.EmployerRow('employer', validationUtils_1.generateString(validationConstraints_1.ValidationConstraints.FREE_TEXT_MAX_LENGTH + 1)));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.TEXT_TOO_LONG);
            });
        });
    });
});
