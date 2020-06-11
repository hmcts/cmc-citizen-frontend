"use strict";
/* tslint:disable:no-unused-expression */
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const validationErrors_1 = require("forms/validation/validationErrors");
const interest_1 = require("claim/form/models/interest");
const yesNoOption_1 = require("models/yesNoOption");
describe('Interest', () => {
    describe('form object deserialization', () => {
        it('should return undefined when value is undefined', () => {
            chai_1.expect(interest_1.Interest.fromObject(undefined)).to.be.equal(undefined);
        });
        it('should leave missing fields undefined', () => {
            chai_1.expect(interest_1.Interest.fromObject({})).to.deep.equal(new interest_1.Interest());
        });
        it('should deserialize all fields', () => {
            chai_1.expect(interest_1.Interest.fromObject({
                option: yesNoOption_1.YesNoOption.YES.option
            })).to.deep.equal(new interest_1.Interest(yesNoOption_1.YesNoOption.YES));
        });
    });
    describe('deserialize', () => {
        it('should return an Interest instance', () => {
            const deserialized = new interest_1.Interest().deserialize({});
            chai_1.expect(deserialized).to.be.instanceof(interest_1.Interest);
        });
        it('should return a Interest instance with fields set to default values when given "undefined"', () => {
            const deserialized = new interest_1.Interest().deserialize(undefined);
            chai_1.expect(deserialized.option).to.be.undefined;
        });
        it('should return a Interest instance with fields set to default values when given "null"', () => {
            const deserialized = new interest_1.Interest().deserialize(null);
            chai_1.expect(deserialized.option).to.be.undefined;
        });
        it('should return a Interest instance with fields set when given an object with value', () => {
            const deserialized = new interest_1.Interest().deserialize({ option: yesNoOption_1.YesNoOption.YES });
            chai_1.expect(deserialized.option).to.be.eq(yesNoOption_1.YesNoOption.YES);
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        it('should reject interest with undefined type', () => {
            const errors = validator.validateSync(new interest_1.Interest(undefined));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.YES_NO_REQUIRED);
        });
        it('should accept interest with recognised type', () => {
            yesNoOption_1.YesNoOption.all().forEach(option => {
                const errors = validator.validateSync(new interest_1.Interest(option));
                chai_1.expect(errors.length).to.equal(0);
            });
        });
    });
});
