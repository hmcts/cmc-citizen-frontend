"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const education_1 = require("response/form/models/statement-of-means/education");
const validationErrors_1 = require("forms/validation/validationErrors");
describe('Education', () => {
    describe('deserialize', () => {
        it('should return empty Education for undefined given as input', () => {
            const actual = new education_1.Education().deserialize(undefined);
            chai_1.expect(actual).to.be.instanceof(education_1.Education);
            chai_1.expect(actual.value).to.be.eq(undefined);
        });
        it('should return populated Education', () => {
            const actual = new education_1.Education().deserialize({ value: 1 });
            chai_1.expect(actual.value).to.be.eq(1);
        });
    });
    describe('fromObject', () => {
        it('should return undefined when undefined given as input', () => {
            const actual = education_1.Education.fromObject(undefined);
            chai_1.expect(actual).to.be.eq(undefined);
        });
        it('should return populated Education', () => {
            const actual = education_1.Education.fromObject({ value: '2' });
            chai_1.expect(actual.value).to.be.eq(2);
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        describe('valid when', () => {
            it('0 given', () => {
                const errors = validator.validateSync(new education_1.Education(0, 1));
                chai_1.expect(errors.length).to.equal(0);
            });
            it('positive number given', () => {
                const errors = validator.validateSync(new education_1.Education(10, 11));
                chai_1.expect(errors.length).to.equal(0);
            });
            it('number is equal maxValue given', () => {
                const errors = validator.validateSync(new education_1.Education(2, 2));
                chai_1.expect(errors.length).to.equal(0);
            });
        });
        describe('invalid when', () => {
            it('empty string given', () => {
                const errors = validator.validateSync(new education_1.Education(''));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.INTEGER_REQUIRED);
            });
            it('blank string given', () => {
                const errors = validator.validateSync(new education_1.Education('    '));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.INTEGER_REQUIRED);
            });
            it('string given', () => {
                const errors = validator.validateSync(new education_1.Education('this is invalid value!'));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.INTEGER_REQUIRED);
            });
            it('decimal number given', () => {
                const errors = validator.validateSync(new education_1.Education(1.1));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.INTEGER_REQUIRED);
            });
            it('negative number given', () => {
                const errors = validator.validateSync(new education_1.Education(-1));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED);
            });
            it('negative decimal number given', () => {
                const errors = validator.validateSync(new education_1.Education(-1.1));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.INTEGER_REQUIRED);
            });
            it('valid value but is greater than maxValue', () => {
                const errors = validator.validateSync(new education_1.Education(2, 1));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, education_1.ValidationErrors.INVALID_NUMBER_OF_CHILDREN);
            });
        });
    });
});
