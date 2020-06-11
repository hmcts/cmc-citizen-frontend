"use strict";
/* tslint:disable:no-unused-expression */
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const interestRateOption_1 = require("claim/form/models/interestRateOption");
const interestHowMuch_1 = require("claim/form/models/interestHowMuch");
const validationErrors_1 = require("forms/validation/validationErrors");
describe('InterestHowMuch', () => {
    describe('form object deserialization', () => {
        it('should return undefined when value is undefined', () => {
            chai_1.expect(interestHowMuch_1.InterestHowMuch.fromObject(undefined)).to.be.equal(undefined);
        });
        it('should leave missing fields undefined', () => {
            chai_1.expect(interestHowMuch_1.InterestHowMuch.fromObject({})).to.deep.equal(new interestHowMuch_1.InterestHowMuch());
        });
        it('should deserialize all fields', () => {
            chai_1.expect(interestHowMuch_1.InterestHowMuch.fromObject({
                type: interestRateOption_1.InterestRateOption.DIFFERENT,
                dailyAmount: 10.50
            })).to.deep.equal(new interestHowMuch_1.InterestHowMuch(interestRateOption_1.InterestRateOption.DIFFERENT, 10.5));
        });
        it('should convert non numeric rate into numeric type', () => {
            const interest = interestHowMuch_1.InterestHowMuch.fromObject({
                type: interestRateOption_1.InterestRateOption.DIFFERENT,
                dailyAmount: '10.50'
            });
            chai_1.expect(interest).to.deep.equal(new interestHowMuch_1.InterestHowMuch(interestRateOption_1.InterestRateOption.DIFFERENT, 10.5));
        });
    });
    describe('deserialize', () => {
        it('should return a InterestHowMuch instance', () => {
            const deserialized = new interestHowMuch_1.InterestHowMuch().deserialize({});
            chai_1.expect(deserialized).to.be.instanceof(interestHowMuch_1.InterestHowMuch);
        });
        it('should return a InterestHowMuch instance with fields set to default values when given "undefined"', () => {
            const deserialized = new interestHowMuch_1.InterestHowMuch().deserialize(undefined);
            chai_1.expect(deserialized.type).to.be.undefined;
            chai_1.expect(deserialized.dailyAmount).to.be.undefined;
        });
        it('should return a InterestRate instance with fields set to default values when given "null"', () => {
            const deserialized = new interestHowMuch_1.InterestHowMuch().deserialize(null);
            chai_1.expect(deserialized.type).to.be.undefined;
            chai_1.expect(deserialized.dailyAmount).to.be.undefined;
        });
        it('should return a InterestRate instance with fields set to undefined when given an empty object', () => {
            const deserialized = new interestHowMuch_1.InterestHowMuch().deserialize({});
            chai_1.expect(deserialized.type).to.be.undefined;
            chai_1.expect(deserialized.dailyAmount).to.be.undefined;
        });
        it('should return a InterestRate instance with fields set when given an object with value', () => {
            const deserialized = new interestHowMuch_1.InterestHowMuch().deserialize({ type: 'type', dailyAmount: 8.00 });
            chai_1.expect(deserialized.type).to.be.eq('type');
            chai_1.expect(deserialized.dailyAmount).to.be.eq(8.00);
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        it('should reject InterestHowMuch with undefined type', () => {
            const errors = validator.validateSync(new interestHowMuch_1.InterestHowMuch(undefined));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, interestHowMuch_1.ValidationErrors.TYPE_REQUIRED);
        });
        it('should reject InterestHowMuch with unrecognised type', () => {
            const errors = validator.validateSync(new interestHowMuch_1.InterestHowMuch('unrecognised-type'));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, interestHowMuch_1.ValidationErrors.TYPE_REQUIRED);
        });
        it('should accept InterestHowMuch with recognised type', () => {
            interestRateOption_1.InterestRateOption.all().forEach(type => {
                const errors = validator.validateSync(new interestHowMuch_1.InterestHowMuch(type, 10));
                chai_1.expect(errors.length).to.equal(0);
            });
        });
        it('should reject custom InterestHowMuch without dailyAmount', () => {
            const errors = validator.validateSync(new interestHowMuch_1.InterestHowMuch(interestRateOption_1.InterestRateOption.DIFFERENT, undefined));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.AMOUNT_REQUIRED);
        });
        it('should reject custom InterestHowMuch with zero dailyAmount', () => {
            const errors = validator.validateSync(new interestHowMuch_1.InterestHowMuch(interestRateOption_1.InterestRateOption.DIFFERENT, 0));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.AMOUNT_NOT_VALID);
        });
        it('should reject custom InterestHowMuch with negative dailyAmount', () => {
            const errors = validator.validateSync(new interestHowMuch_1.InterestHowMuch(interestRateOption_1.InterestRateOption.DIFFERENT, -1));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.AMOUNT_NOT_VALID);
        });
        it('should reject dailyAmount with more than two decimal places in amount', () => {
            const errors = validator.validateSync(new interestHowMuch_1.InterestHowMuch(interestRateOption_1.InterestRateOption.DIFFERENT, 10.123));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.AMOUNT_INVALID_DECIMALS);
        });
        it('should accept valid standard interest', () => {
            const errors = validator.validateSync(new interestHowMuch_1.InterestHowMuch(interestRateOption_1.InterestRateOption.STANDARD));
            chai_1.expect(errors.length).to.equal(0);
        });
        it('should accept valid dailyAmount', () => {
            const errors = validator.validateSync(new interestHowMuch_1.InterestHowMuch(interestRateOption_1.InterestRateOption.DIFFERENT, 10));
            chai_1.expect(errors.length).to.equal(0);
        });
    });
});
