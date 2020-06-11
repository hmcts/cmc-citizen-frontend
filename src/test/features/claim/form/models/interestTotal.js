"use strict";
/* tslint:disable:no-unused-expression */
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _ = require("lodash");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const validationErrors_1 = require("forms/validation/validationErrors");
const interestTotal_1 = require("claim/form/models/interestTotal");
describe('InterestTotal', () => {
    describe('form object deserialization', () => {
        it('should return undefined when value is undefined', () => {
            chai_1.expect(interestTotal_1.InterestTotal.fromObject(undefined)).to.be.equal(undefined);
        });
        it('should leave missing fields undefined', () => {
            chai_1.expect(interestTotal_1.InterestTotal.fromObject({})).to.deep.equal(new interestTotal_1.InterestTotal());
        });
        it('should deserialize all fields', () => {
            chai_1.expect(interestTotal_1.InterestTotal.fromObject({
                amount: 1000,
                reason: 'Special case'
            })).to.deep.equal(new interestTotal_1.InterestTotal(1000, 'Special case'));
        });
        it('should convert non numeric amount into numeric type', () => {
            const interest = interestTotal_1.InterestTotal.fromObject({
                amount: '10',
                reason: 'Special case'
            });
            chai_1.expect(interest).to.deep.equal(new interestTotal_1.InterestTotal(10, 'Special case'));
        });
    });
    describe('deserialize', () => {
        it('should return a InterestTotal instance', () => {
            const deserialized = new interestTotal_1.InterestTotal().deserialize({});
            chai_1.expect(deserialized).to.be.instanceof(interestTotal_1.InterestTotal);
        });
        it('should return a InterestTotal instance with fields set to default values when given "undefined"', () => {
            const deserialized = new interestTotal_1.InterestTotal().deserialize(undefined);
            chai_1.expect(deserialized.amount).to.be.undefined;
            chai_1.expect(deserialized.reason).to.be.undefined;
        });
        it('should return a InterestTotal instance with fields set to undefined when given an empty object', () => {
            const deserialized = new interestTotal_1.InterestTotal().deserialize({});
            chai_1.expect(deserialized.amount).to.be.undefined;
            chai_1.expect(deserialized.reason).to.be.undefined;
        });
        it('should return a InterestRate instance with fields set when given an object with value', () => {
            const deserialized = new interestTotal_1.InterestTotal().deserialize({ amount: 1000, reason: 'reason' });
            chai_1.expect(deserialized.amount).to.be.eq(1000);
            chai_1.expect(deserialized.reason).to.be.eq('reason');
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        it('should reject InterestTotal with undefined type', () => {
            const errors = validator.validateSync(new interestTotal_1.InterestTotal(undefined));
            chai_1.expect(errors.length).to.equal(2);
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.AMOUNT_REQUIRED);
            validationUtils_1.expectValidationError(errors, interestTotal_1.ValidationErrors.REASON_REQUIRED);
        });
        it('should reject custom InterestTotal with zero rate', () => {
            const errors = validator.validateSync(new interestTotal_1.InterestTotal(0, 'Privileged'));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.AMOUNT_NOT_VALID);
        });
        it('should reject custom InterestTotal with negative rate', () => {
            const errors = validator.validateSync(new interestTotal_1.InterestTotal(-1, 'Privileged'));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.AMOUNT_NOT_VALID);
        });
        it('should reject custom InterestTotal with reason longer then upper limit', () => {
            const errors = validator.validateSync(new interestTotal_1.InterestTotal(10, _.repeat('*', 10001)));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.REASON_TOO_LONG.replace('$constraint1', '10000'));
        });
        it('should accept valid amount and reason', () => {
            const errors = validator.validateSync(new interestTotal_1.InterestTotal(1000, 'Privileged'));
            chai_1.expect(errors.length).to.equal(0);
        });
    });
});
