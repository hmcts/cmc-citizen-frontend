"use strict";
/* tslint:disable:no-unused-expression */
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _ = require("lodash");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const interestStartDate_1 = require("claim/form/models/interestStartDate");
const localDate_1 = require("forms/models/localDate");
const interestDateType_1 = require("common/interestDateType");
const validationErrors_1 = require("forms/validation/validationErrors");
describe('InterestStartDate', () => {
    describe('form object deserialization', () => {
        it('should return undefined when value is undefined', () => {
            chai_1.expect(interestStartDate_1.InterestStartDate.fromObject(undefined)).to.be.equal(undefined);
        });
        it('should return null when value is null', () => {
            chai_1.expect(interestStartDate_1.InterestStartDate.fromObject(null)).to.be.equal(null);
        });
        it('should leave missing fields undefined', () => {
            chai_1.expect(interestStartDate_1.InterestStartDate.fromObject({})).to.deep.equal(new interestStartDate_1.InterestStartDate());
        });
        it('should deserialize all fields', () => {
            chai_1.expect(interestStartDate_1.InterestStartDate.fromObject({
                date: {
                    year: 2016,
                    month: 12,
                    day: 31
                },
                reason: 'Special case'
            })).to.deep.equal(new interestStartDate_1.InterestStartDate(new localDate_1.LocalDate(2016, 12, 31), 'Special case'));
        });
    });
    describe('deserialize', () => {
        it('should return a InterestStartDate instance with fields set to default values when given "undefined"', () => {
            const deserialized = new interestStartDate_1.InterestStartDate().deserialize(undefined);
            chai_1.expect(deserialized.date).to.be.undefined;
            chai_1.expect(deserialized.reason).to.be.undefined;
        });
        it('should return a InterestStartDate instance with fields set to default values when given "null"', () => {
            const deserialized = new interestStartDate_1.InterestStartDate().deserialize(null);
            chai_1.expect(deserialized.date).to.be.undefined;
            chai_1.expect(deserialized.reason).to.be.undefined;
        });
        it('should return a InterestStartDate instance with fields set when given an object with value', () => {
            const deserialized = new interestStartDate_1.InterestStartDate().deserialize({
                date: {
                    day: 10,
                    month: 12,
                    year: 2016
                },
                reason: 'reason'
            });
            chai_1.expect(deserialized.reason).to.equal('reason');
            chai_1.expect(deserialized.date.day).to.equal(10);
            chai_1.expect(deserialized.date.month).to.equal(12);
            chai_1.expect(deserialized.date.year).to.equal(2016);
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        it('should accept interest date with recognised type', () => {
            interestDateType_1.InterestDateType.all().forEach(type => {
                const errors = validator.validateSync(new interestStartDate_1.InterestStartDate(new localDate_1.LocalDate(2016, 12, 24), 'Privileged'));
                chai_1.expect(errors.length).to.equal(0);
            });
        });
        it('should reject custom InterestStartDate date without date and reason', () => {
            const errors = validator.validateSync(new interestStartDate_1.InterestStartDate(undefined, undefined));
            chai_1.expect(errors.length).to.equal(2);
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.DATE_REQUIRED);
            validationUtils_1.expectValidationError(errors, interestStartDate_1.ValidationErrors.REASON_REQUIRED);
        });
        it('should reject custom InterestStartDate date with invalid date', () => {
            const errors = validator.validateSync(new interestStartDate_1.InterestStartDate(new localDate_1.LocalDate(2016, 2, 30), 'Privileged'));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.DATE_NOT_VALID);
        });
        it('should reject custom InterestStartDate date with invalid digits in year', () => {
            const errors = validator.validateSync(new interestStartDate_1.InterestStartDate(new localDate_1.LocalDate(80, 12, 30), 'Privileged'));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, localDate_1.ValidationErrors.YEAR_FORMAT_NOT_VALID);
        });
        it('should reject custom InterestStartDate date with reason longer then upper limit', () => {
            const errors = validator.validateSync(new interestStartDate_1.InterestStartDate(new localDate_1.LocalDate(2016, 12, 24), _.repeat('*', 10001)));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.REASON_TOO_LONG.replace('$constraint1', '10000'));
        });
        it('should accept valid custom interest date', () => {
            const errors = validator.validateSync(new interestStartDate_1.InterestStartDate(new localDate_1.LocalDate(2016, 12, 24), 'Privileged'));
            chai_1.expect(errors.length).to.equal(0);
        });
    });
});
