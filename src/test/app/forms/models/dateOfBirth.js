"use strict";
/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */
Object.defineProperty(exports, "__esModule", { value: true });
const i18next = require("i18next");
const postProcessor = require("i18next-sprintf-postprocessor");
i18next.use(postProcessor).init();
const chai_1 = require("chai");
const moment = require("moment");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const dateOfBirth_1 = require("forms/models/dateOfBirth");
const localDate_1 = require("forms/models/localDate");
const momentFormatter_1 = require("utils/momentFormatter");
describe('DateOfBirth', () => {
    describe('form object deserialization', () => {
        it('should return undefined when value is undefined', () => {
            chai_1.expect(dateOfBirth_1.DateOfBirth.fromObject(undefined)).to.be.equal(undefined);
        });
        it('should return null when value is null', () => {
            chai_1.expect(dateOfBirth_1.DateOfBirth.fromObject(null)).to.be.equal(null);
        });
        it('should leave missing fields undefined', () => {
            chai_1.expect(dateOfBirth_1.DateOfBirth.fromObject({})).to.deep.equal(new dateOfBirth_1.DateOfBirth());
        });
        it('should deserialize all fields', () => {
            chai_1.expect(dateOfBirth_1.DateOfBirth.fromObject({
                known: 'true',
                date: {
                    year: 2017,
                    month: 12,
                    day: 31
                }
            })).to.deep.equal(dateOfBirth(2017, 12, 31));
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        context('when date is known', () => {
            it('should reject non existing date', () => {
                const errors = validator.validateSync(dateOfBirth(2017, 2, 29));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, dateOfBirth_1.ValidationErrors.DATE_NOT_VALID);
            });
            it('should reject current date', () => {
                const today = moment();
                const errors = validator.validateSync(dateOfBirth(today.year(), today.month() + 1, today.date()));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, dateOfBirth_1.ValidationErrors.DATE_UNDER_18.replace('%s', momentFormatter_1.MomentFormatter.formatLongDate(ageLimit())));
            });
            it('should reject future date', () => {
                const tomorrow = moment().add(1, 'days');
                const errors = validator.validateSync(dateOfBirth(tomorrow.year(), tomorrow.month() + 1, tomorrow.date()));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, dateOfBirth_1.ValidationErrors.DATE_UNDER_18.replace('%s', momentFormatter_1.MomentFormatter.formatLongDate(ageLimit())));
            });
            it('should reject date of birth below 18', () => {
                const almost18YearsAgo = moment().subtract(18, 'years').add(1, 'days');
                const errors = validator.validateSync(dateOfBirth(almost18YearsAgo.year(), almost18YearsAgo.month() + 1, almost18YearsAgo.date()));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, dateOfBirth_1.ValidationErrors.DATE_UNDER_18.replace('%s', momentFormatter_1.MomentFormatter.formatLongDate(ageLimit())));
            });
            it('should reject date of birth with age over 150', () => {
                const over150YearsAgo = moment().subtract(151, 'years');
                const errors = validator.validateSync(dateOfBirth(over150YearsAgo.year(), over150YearsAgo.month() + 1, over150YearsAgo.date()));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, dateOfBirth_1.ValidationErrors.DATE_NOT_VALID);
            });
            it('should accept date of birth of 18 and over', () => {
                const exactly18YearsAgo = moment().subtract(18, 'years');
                const errors = validator.validateSync(dateOfBirth(exactly18YearsAgo.year(), exactly18YearsAgo.month() + 1, exactly18YearsAgo.date()));
                chai_1.expect(errors.length).to.equal(0);
            });
            it('should reject date of birth with invalid digits in year', () => {
                const errors = validator.validateSync(dateOfBirth(90, 12, 31));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, localDate_1.ValidationErrors.YEAR_FORMAT_NOT_VALID);
            });
        });
        context('when date is unknown', () => {
            it('should accept undefined date', () => {
                const errors = validator.validateSync(new dateOfBirth_1.DateOfBirth(false, undefined));
                chai_1.expect(errors.length).to.equal(0);
            });
        });
    });
    describe('constructor', () => {
        it('should set fields to undefined', () => {
            let dateOfBirth = new dateOfBirth_1.DateOfBirth();
            chai_1.expect(dateOfBirth.known).to.be.undefined;
            chai_1.expect(dateOfBirth.date).to.be.undefined;
        });
    });
    describe('deserialize', () => {
        it('should return a DateOfBirth instance initialised with defaults for undefined', () => {
            chai_1.expect(new dateOfBirth_1.DateOfBirth().deserialize(undefined)).to.eql(new dateOfBirth_1.DateOfBirth());
        });
        it('should return a DateOfBirth instance initialised with defaults for null', () => {
            chai_1.expect(new dateOfBirth_1.DateOfBirth().deserialize(null)).to.eql(new dateOfBirth_1.DateOfBirth());
        });
        it('should set the values of given json on the deserialized instance', () => {
            let deserialized = new dateOfBirth_1.DateOfBirth().deserialize({
                known: true,
                date: {
                    day: 10,
                    month: 11,
                    year: 2000
                }
            });
            chai_1.expect(deserialized.date.day).to.equal(10);
            chai_1.expect(deserialized.date.month).to.equal(11);
            chai_1.expect(deserialized.date.year).to.equal(2000);
        });
    });
});
function dateOfBirth(year, month, day) {
    return new dateOfBirth_1.DateOfBirth(true, new localDate_1.LocalDate(year, month, day));
}
function ageLimit() {
    return moment().subtract(18, 'years').add(1, 'day');
}
