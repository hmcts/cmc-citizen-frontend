"use strict";
/* tslint:disable:no-unused-expression */
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const validationErrors_1 = require("forms/validation/validationErrors");
const interestContinueClaiming_1 = require("claim/form/models/interestContinueClaiming");
const yesNoOption_1 = require("models/yesNoOption");
describe('InterestContinueClaiming', () => {
    describe('form object deserialization', () => {
        it('should return undefined when value is undefined', () => {
            chai_1.expect(interestContinueClaiming_1.InterestContinueClaiming.fromObject(undefined)).to.be.equal(undefined);
        });
        it('should leave missing fields undefined', () => {
            chai_1.expect(interestContinueClaiming_1.InterestContinueClaiming.fromObject({})).to.deep.equal(new interestContinueClaiming_1.InterestContinueClaiming());
        });
        it('should deserialize all fields', () => {
            chai_1.expect(interestContinueClaiming_1.InterestContinueClaiming.fromObject({
                option: yesNoOption_1.YesNoOption.NO.option
            })).to.deep.equal(new interestContinueClaiming_1.InterestContinueClaiming(yesNoOption_1.YesNoOption.NO));
        });
    });
    describe('deserialize', () => {
        it('should return a InterestContinueClaiming instance', () => {
            const deserialized = new interestContinueClaiming_1.InterestContinueClaiming().deserialize({});
            chai_1.expect(deserialized).to.be.instanceof(interestContinueClaiming_1.InterestContinueClaiming);
        });
        it('should return a InterestContinueClaiming instance with fields set to default values when given "undefined"', () => {
            const deserialized = new interestContinueClaiming_1.InterestContinueClaiming().deserialize(undefined);
            chai_1.expect(deserialized.option).to.be.undefined;
        });
        it('should return a InterestContinueClaiming instance with fields set to undefined when given an empty object', () => {
            const deserialized = new interestContinueClaiming_1.InterestContinueClaiming().deserialize({});
            chai_1.expect(deserialized.option).to.be.undefined;
        });
        it('should return a InterestRate instance with fields set when given an object with value', () => {
            const deserialized = new interestContinueClaiming_1.InterestContinueClaiming().deserialize({ option: yesNoOption_1.YesNoOption.NO });
            chai_1.expect(deserialized.option).to.be.eq(yesNoOption_1.YesNoOption.NO);
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        it('should reject InterestContinueClaiming with undefined type', () => {
            const errors = validator.validateSync(new interestContinueClaiming_1.InterestContinueClaiming(undefined));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.YES_NO_REQUIRED);
        });
        it('should accept InterestContinueClaiming with recognised type', () => {
            yesNoOption_1.YesNoOption.all().forEach(option => {
                const errors = validator.validateSync(new interestContinueClaiming_1.InterestContinueClaiming(option));
                chai_1.expect(errors.length).to.equal(0);
            });
        });
    });
});
