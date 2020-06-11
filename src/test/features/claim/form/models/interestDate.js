"use strict";
/* tslint:disable:no-unused-expression */
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const interestDate_1 = require("claim/form/models/interestDate");
const interestDateType_1 = require("common/interestDateType");
describe('InterestDate', () => {
    describe('form object deserialization', () => {
        it('should return undefined when value is undefined', () => {
            chai_1.expect(interestDate_1.InterestDate.fromObject(undefined)).to.be.equal(undefined);
        });
        it('should return null when value is null', () => {
            chai_1.expect(interestDate_1.InterestDate.fromObject(null)).to.be.equal(null);
        });
        it('should leave missing fields undefined', () => {
            chai_1.expect(interestDate_1.InterestDate.fromObject({})).to.deep.equal(new interestDate_1.InterestDate());
        });
        it('should deserialize all fields', () => {
            chai_1.expect(interestDate_1.InterestDate.fromObject({
                type: interestDateType_1.InterestDateType.SUBMISSION
            })).to.deep.equal(new interestDate_1.InterestDate(interestDateType_1.InterestDateType.SUBMISSION));
        });
    });
    describe('deserialize', () => {
        it('should return an InterestDate instance', () => {
            const deserialized = new interestDate_1.InterestDate().deserialize({});
            chai_1.expect(deserialized).to.be.instanceof(interestDate_1.InterestDate);
        });
        it('should return a InterestDate instance with fields set to default values when given "undefined"', () => {
            const deserialized = new interestDate_1.InterestDate().deserialize(undefined);
            chai_1.expect(deserialized.type).to.be.undefined;
        });
        it('should return a InterestDate instance with fields set to default values when given "null"', () => {
            const deserialized = new interestDate_1.InterestDate().deserialize(null);
            chai_1.expect(deserialized.type).to.be.undefined;
        });
        it('should return a InterestDate instance with fields set when given an object with value', () => {
            const deserialized = new interestDate_1.InterestDate().deserialize({ type: interestDateType_1.InterestDateType.CUSTOM });
            chai_1.expect(deserialized.type).to.be.eq(interestDateType_1.InterestDateType.CUSTOM);
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        it('should reject InterestDate with undefined type', () => {
            const errors = validator.validateSync(new interestDate_1.InterestDate(undefined));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, interestDate_1.ValidationErrors.TYPE_REQUIRED);
        });
        it('should reject InterestDate with unrecognised type', () => {
            const errors = validator.validateSync(new interestDate_1.InterestDate('unrecognised-type'));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, interestDate_1.ValidationErrors.TYPE_REQUIRED);
        });
        it('should accept InterestDate with recognised type', () => {
            interestDateType_1.InterestDateType.all().forEach(type => {
                const errors = validator.validateSync(new interestDate_1.InterestDate(type));
                chai_1.expect(errors.length).to.equal(0);
            });
        });
    });
});
