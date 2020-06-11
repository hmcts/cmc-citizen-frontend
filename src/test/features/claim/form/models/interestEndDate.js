"use strict";
/* tslint:disable:no-unused-expression */
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const interestEndDate_1 = require("claim/form/models/interestEndDate");
describe('InterestEndDate', () => {
    describe('form object deserialization', () => {
        it('should return undefined when value is undefined', () => {
            chai_1.expect(interestEndDate_1.InterestEndDate.fromObject(undefined)).to.be.equal(undefined);
        });
        it('should return null when value is null', () => {
            chai_1.expect(interestEndDate_1.InterestEndDate.fromObject(null)).to.be.equal(null);
        });
        it('should leave missing fields undefined', () => {
            chai_1.expect(interestEndDate_1.InterestEndDate.fromObject({})).to.deep.equal(new interestEndDate_1.InterestEndDate());
        });
        it('should deserialize all fields', () => {
            chai_1.expect(interestEndDate_1.InterestEndDate.fromObject({
                option: interestEndDate_1.InterestEndDateOption.SUBMISSION
            })).to.deep.equal(new interestEndDate_1.InterestEndDate(interestEndDate_1.InterestEndDateOption.SUBMISSION));
        });
    });
    describe('deserialize', () => {
        it('should return an InterestEndDate instance', () => {
            const deserialized = new interestEndDate_1.InterestEndDate().deserialize({});
            chai_1.expect(deserialized).to.be.instanceof(interestEndDate_1.InterestEndDate);
        });
        it('should return a InterestEndDate instance with fields set to default values when given "undefined"', () => {
            const deserialized = new interestEndDate_1.InterestEndDate().deserialize(undefined);
            chai_1.expect(deserialized.option).to.be.undefined;
        });
        it('should return a InterestEndDate instance with fields set to default values when given "null"', () => {
            const deserialized = new interestEndDate_1.InterestEndDate().deserialize(null);
            chai_1.expect(deserialized.option).to.be.undefined;
        });
        it('should return a InterestEndDate instance with fields set when given an object with value', () => {
            const deserialized = new interestEndDate_1.InterestEndDate().deserialize({ option: interestEndDate_1.InterestEndDateOption.SETTLED_OR_JUDGMENT });
            chai_1.expect(deserialized.option).to.be.eq(interestEndDate_1.InterestEndDateOption.SETTLED_OR_JUDGMENT);
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        it('should reject InterestEndDate with undefined type', () => {
            const errors = validator.validateSync(new interestEndDate_1.InterestEndDate(undefined));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, interestEndDate_1.ValidationErrors.INTEREST_END_DATE_REQUIRED);
        });
        it('should reject InterestEndDate with unrecognised type', () => {
            const errors = validator.validateSync(new interestEndDate_1.InterestEndDate('unrecognised-type'));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, interestEndDate_1.ValidationErrors.INTEREST_END_DATE_REQUIRED);
        });
        it('should accept InterestEndDate with recognised type', () => {
            interestEndDate_1.InterestEndDateOption.all().forEach(option => {
                const errors = validator.validateSync(new interestEndDate_1.InterestEndDate(option));
                chai_1.expect(errors.length).to.equal(0);
            });
        });
    });
});
