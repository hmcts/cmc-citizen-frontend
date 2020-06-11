"use strict";
/* tslint:disable:no-unused-expression */
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const interestType_1 = require("claim/form/models/interestType");
describe('InterestType', () => {
    describe('form object deserialization', () => {
        it('should return undefined when value is undefined', () => {
            chai_1.expect(interestType_1.InterestType.fromObject(undefined)).to.be.equal(undefined);
        });
        it('should return null when value is null', () => {
            chai_1.expect(interestType_1.InterestType.fromObject(null)).to.be.equal(null);
        });
        it('should leave missing fields undefined', () => {
            chai_1.expect(interestType_1.InterestType.fromObject({})).to.deep.equal(new interestType_1.InterestType());
        });
        it('should deserialize all fields', () => {
            chai_1.expect(interestType_1.InterestType.fromObject({
                option: interestType_1.InterestTypeOption.SAME_RATE
            })).to.deep.equal(new interestType_1.InterestType(interestType_1.InterestTypeOption.SAME_RATE));
        });
    });
    describe('deserialize', () => {
        it('should return an InterestType instance', () => {
            const deserialized = new interestType_1.InterestType().deserialize({});
            chai_1.expect(deserialized).to.be.instanceof(interestType_1.InterestType);
        });
        it('should return a InterestType instance with fields set to default values when given "undefined"', () => {
            const deserialized = new interestType_1.InterestType().deserialize(undefined);
            chai_1.expect(deserialized.option).to.be.undefined;
        });
        it('should return a InterestType instance with fields set to default values when given "null"', () => {
            const deserialized = new interestType_1.InterestType().deserialize(null);
            chai_1.expect(deserialized.option).to.be.undefined;
        });
        it('should return a InterestType instance with fields set when given an object with value', () => {
            const deserialized = new interestType_1.InterestType().deserialize({ option: interestType_1.InterestTypeOption.SAME_RATE });
            chai_1.expect(deserialized.option).to.be.eq(interestType_1.InterestTypeOption.SAME_RATE);
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        it('should reject InterestType with undefined type', () => {
            const errors = validator.validateSync(new interestType_1.InterestType(undefined));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, interestType_1.ValidationErrors.INTEREST_TYPE_REQUIRED);
        });
        it('should reject InterestType with unrecognised type', () => {
            const errors = validator.validateSync(new interestType_1.InterestType('unrecognised-type'));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, interestType_1.ValidationErrors.INTEREST_TYPE_REQUIRED);
        });
        it('should accept InterestType with recognised type', () => {
            interestType_1.InterestTypeOption.all().forEach(option => {
                const errors = validator.validateSync(new interestType_1.InterestType(option));
                chai_1.expect(errors.length).to.equal(0);
            });
        });
    });
});
