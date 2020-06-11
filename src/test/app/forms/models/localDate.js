"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const localDate_1 = require("forms/models/localDate");
const moment = require("moment");
describe('LocalDate', () => {
    describe('form object deserialization', () => {
        it('should return undefined when value is undefined', () => {
            chai_1.expect(localDate_1.LocalDate.fromObject(undefined)).to.be.equal(undefined);
        });
        it('should return null when value is null', () => {
            chai_1.expect(localDate_1.LocalDate.fromObject(null)).to.be.equal(null);
        });
        it('should leave missing fields undefined', () => {
            chai_1.expect(localDate_1.LocalDate.fromObject({ a: 1, b: 1, c: 2 })).to.deep.equal(new localDate_1.LocalDate());
        });
        it('should deserialize all fields', () => {
            chai_1.expect(localDate_1.LocalDate.fromObject({ year: 2017, month: 12, day: 31 })).to.deep.equal(new localDate_1.LocalDate(2017, 12, 31));
        });
        it('should convert non numeric field values into numeric type', () => {
            chai_1.expect(localDate_1.LocalDate.fromObject({ year: '2017', month: '12', day: '31' })).to.deep.equal(new localDate_1.LocalDate(2017, 12, 31));
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        it('should reject empty date', () => {
            const errors = validator.validateSync(new localDate_1.LocalDate());
            chai_1.expect(errors.length).to.equal(3);
            validationUtils_1.expectValidationError(errors, localDate_1.ValidationErrors.YEAR_NOT_VALID);
            validationUtils_1.expectValidationError(errors, localDate_1.ValidationErrors.MONTH_NOT_VALID);
            validationUtils_1.expectValidationError(errors, localDate_1.ValidationErrors.DAY_NOT_VALID);
        });
        it('should reject date with negative values', () => {
            const errors = validator.validateSync(new localDate_1.LocalDate(-1, -1, -1));
            chai_1.expect(errors.length).to.equal(3);
            validationUtils_1.expectValidationError(errors, localDate_1.ValidationErrors.YEAR_NOT_VALID);
            validationUtils_1.expectValidationError(errors, localDate_1.ValidationErrors.MONTH_NOT_VALID);
            validationUtils_1.expectValidationError(errors, localDate_1.ValidationErrors.DAY_NOT_VALID);
        });
        it('should reject date with values greater then upper limit', () => {
            const errors = validator.validateSync(new localDate_1.LocalDate(10000, 13, 32));
            chai_1.expect(errors.length).to.equal(3);
            validationUtils_1.expectValidationError(errors, localDate_1.ValidationErrors.YEAR_NOT_VALID);
            validationUtils_1.expectValidationError(errors, localDate_1.ValidationErrors.MONTH_NOT_VALID);
            validationUtils_1.expectValidationError(errors, localDate_1.ValidationErrors.DAY_NOT_VALID);
        });
        it('should accept date withing the range limit', () => {
            chai_1.expect(validator.validateSync(new localDate_1.LocalDate(1000, 1, 1)).length).to.equal(0);
            chai_1.expect(validator.validateSync(new localDate_1.LocalDate(9999, 12, 31)).length).to.equal(0);
        });
        it('should accept valid date', () => {
            chai_1.expect(validator.validateSync(new localDate_1.LocalDate(2017, 12, 31)).length).to.equal(0);
        });
    });
    describe('fromMoment', () => {
        it('should return LocalDate from moment object', () => {
            chai_1.expect(localDate_1.LocalDate.fromMoment(moment('2018-01-01'))).to.deep.equal(new localDate_1.LocalDate(2018, 1, 1));
            chai_1.expect(localDate_1.LocalDate.fromMoment(moment('2018-12-01'))).to.deep.equal(new localDate_1.LocalDate(2018, 12, 1));
        });
    });
    describe('toMoment method', () => {
        it('should return Moment instance', () => {
            const moment = new localDate_1.LocalDate(2017, 12, 31).toMoment();
            chai_1.expect(moment.year()).to.be.equal(2017);
            chai_1.expect(moment.month()).to.be.equal(11); // Moment months are zero indexed
            chai_1.expect(moment.date()).to.be.equal(31);
        });
    });
    describe('asString method', () => {
        it('should return empty string for undefined year, month and day', () => {
            chai_1.expect(new localDate_1.LocalDate().asString()).to.be.equal('');
        });
        it('should return string containing year, month and day', () => {
            chai_1.expect(new localDate_1.LocalDate(2017, 12, 31).asString()).to.be.equal('2017-12-31');
        });
        it('should return padded string', () => {
            chai_1.expect(new localDate_1.LocalDate(2017, 5, 6).asString()).to.be.equal('2017-05-06');
        });
    });
});
