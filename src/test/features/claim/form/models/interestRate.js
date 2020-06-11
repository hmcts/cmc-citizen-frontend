"use strict";
/* tslint:disable:no-unused-expression */
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _ = require("lodash");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const interestRate_1 = require("claim/form/models/interestRate");
const interestRateOption_1 = require("claim/form/models/interestRateOption");
const validationErrors_1 = require("forms/validation/validationErrors");
const interestUtils_1 = require("shared/interestUtils");
describe('InterestRate', () => {
    describe('form object deserialization', () => {
        it('should return undefined when value is undefined', () => {
            chai_1.expect(interestRate_1.InterestRate.fromObject(undefined)).to.be.equal(undefined);
        });
        it('should return null when value is null', () => {
            chai_1.expect(interestRate_1.InterestRate.fromObject(null)).to.be.equal(null);
        });
        it('should leave missing fields undefined', () => {
            chai_1.expect(interestRate_1.InterestRate.fromObject({})).to.deep.equal(new interestRate_1.InterestRate());
        });
        it('should deserialize all fields', () => {
            chai_1.expect(interestRate_1.InterestRate.fromObject({
                type: interestRateOption_1.InterestRateOption.DIFFERENT,
                rate: 10,
                reason: 'Special case'
            })).to.deep.equal(new interestRate_1.InterestRate(interestRateOption_1.InterestRateOption.DIFFERENT, 10, 'Special case'));
        });
        it('should convert non numeric rate into numeric type', () => {
            const interest = interestRate_1.InterestRate.fromObject({
                type: interestRateOption_1.InterestRateOption.DIFFERENT,
                rate: '10',
                reason: 'Special case'
            });
            chai_1.expect(interest).to.deep.equal(new interestRate_1.InterestRate(interestRateOption_1.InterestRateOption.DIFFERENT, 10, 'Special case'));
        });
        it('should set standard rate and unset reason when standard type is set', () => {
            chai_1.expect(interestRate_1.InterestRate.fromObject({
                type: interestRateOption_1.InterestRateOption.STANDARD,
                rate: 100,
                reason: 'Special case'
            })).to.deep.equal(new interestRate_1.InterestRate(interestRateOption_1.InterestRateOption.STANDARD, interestUtils_1.getStandardInterestRate(), undefined));
        });
    });
    describe('deserialize', () => {
        it('should return a InterestRate instance', () => {
            const deserialized = new interestRate_1.InterestRate().deserialize({});
            chai_1.expect(deserialized).to.be.instanceof(interestRate_1.InterestRate);
        });
        it('should return a InterestRate instance with fields set to default values when given "undefined"', () => {
            const deserialized = new interestRate_1.InterestRate().deserialize(undefined);
            chai_1.expect(deserialized.type).to.be.undefined;
            chai_1.expect(deserialized.rate).to.be.undefined;
            chai_1.expect(deserialized.reason).to.be.undefined;
        });
        it('should return a InterestRate instance with fields set to default values when given "null"', () => {
            const deserialized = new interestRate_1.InterestRate().deserialize(null);
            chai_1.expect(deserialized.type).to.be.undefined;
            chai_1.expect(deserialized.rate).to.be.undefined;
            chai_1.expect(deserialized.reason).to.be.undefined;
        });
        it('should return a InterestRate instance with fields set to undefined when given an empty object', () => {
            const deserialized = new interestRate_1.InterestRate().deserialize({});
            chai_1.expect(deserialized.type).to.be.undefined;
            chai_1.expect(deserialized.rate).to.be.undefined;
            chai_1.expect(deserialized.reason).to.be.undefined;
        });
        it('should return a InterestRate instance with fields set when given an object with value', () => {
            const deserialized = new interestRate_1.InterestRate().deserialize({ type: 'type', rate: 8.00, reason: 'reason' });
            chai_1.expect(deserialized.type).to.be.eq('type');
            chai_1.expect(deserialized.rate).to.be.eq(8.00);
            chai_1.expect(deserialized.reason).to.be.eq('reason');
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        it('should reject InterestRate with undefined type', () => {
            const errors = validator.validateSync(new interestRate_1.InterestRate(undefined));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, interestRate_1.ValidationErrors.TYPE_REQUIRED);
        });
        it('should reject InterestRate with unrecognised type', () => {
            const errors = validator.validateSync(new interestRate_1.InterestRate('unrecognised-type'));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, interestRate_1.ValidationErrors.TYPE_REQUIRED);
        });
        it('should reject InterestRate with a rate with a comma', () => {
            const errors = validator.validateSync(interestRate_1.InterestRate.fromObject({
                type: interestRateOption_1.InterestRateOption.DIFFERENT,
                rate: '1,1',
                reason: 'Special case'
            }));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, interestRate_1.ValidationErrors.RATE_NOT_VALID);
        });
        it('should accept InterestRate with recognised type', () => {
            interestRateOption_1.InterestRateOption.all().forEach(type => {
                const errors = validator.validateSync(new interestRate_1.InterestRate(type, 10, 'Privileged'));
                chai_1.expect(errors.length).to.equal(0);
            });
        });
        it('should reject custom InterestRate without rate and reason', () => {
            const errors = validator.validateSync(new interestRate_1.InterestRate(interestRateOption_1.InterestRateOption.DIFFERENT, undefined, undefined));
            chai_1.expect(errors.length).to.equal(2);
            validationUtils_1.expectValidationError(errors, interestRate_1.ValidationErrors.RATE_REQUIRED);
            validationUtils_1.expectValidationError(errors, interestRate_1.ValidationErrors.REASON_REQUIRED);
        });
        it('should reject custom InterestRate with zero rate', () => {
            const errors = validator.validateSync(new interestRate_1.InterestRate(interestRateOption_1.InterestRateOption.DIFFERENT, 0, 'Privileged'));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, interestRate_1.ValidationErrors.RATE_NOT_VALID);
        });
        it('should reject custom InterestRate with negative rate', () => {
            const errors = validator.validateSync(new interestRate_1.InterestRate(interestRateOption_1.InterestRateOption.DIFFERENT, -1, 'Privileged'));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, interestRate_1.ValidationErrors.RATE_NOT_VALID);
        });
        it('should reject custom InterestRate with reason longer then upper limit', () => {
            const errors = validator.validateSync(new interestRate_1.InterestRate(interestRateOption_1.InterestRateOption.DIFFERENT, 10, _.repeat('*', 251)));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.REASON_TOO_LONG.replace('$constraint1', '250'));
        });
        it('should accept valid standard interest', () => {
            const errors = validator.validateSync(new interestRate_1.InterestRate(interestRateOption_1.InterestRateOption.STANDARD));
            chai_1.expect(errors.length).to.equal(0);
        });
        it('should accept valid custom interest', () => {
            const errors = validator.validateSync(new interestRate_1.InterestRate(interestRateOption_1.InterestRateOption.DIFFERENT, 10, 'Privileged'));
            chai_1.expect(errors.length).to.equal(0);
        });
    });
});
