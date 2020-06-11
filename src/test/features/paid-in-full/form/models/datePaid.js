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
const datePaid_1 = require("paid-in-full/form/models/datePaid");
const validationErrors_1 = require("forms/validation/validationErrors");
const localDate_1 = require("forms/models/localDate");
describe('DatePaid', () => {
    describe('form object deserialization', () => {
        it('should return undefined when value is undefined', () => {
            chai_1.expect(datePaid_1.DatePaid.fromObject(undefined)).to.be.undefined;
        });
        it('should return null when value is null', () => {
            chai_1.expect(datePaid_1.DatePaid.fromObject(null)).to.be.equal(null);
        });
        it('should deserialize all fields', () => {
            chai_1.expect(datePaid_1.DatePaid.fromObject({
                date: {
                    year: 2017,
                    month: 12,
                    day: 31
                }
            })).to.deep.equal(datePaid(2017, 12, 31));
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        context('when date is known', () => {
            it('should reject non existing date', () => {
                const errors = validator.validateSync(datePaid(2017, 2, 29));
                chai_1.expect(datePaid_1.DatePaid.fromObject(null)).to.be.equal(null);
                validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.DATE_NOT_VALID);
            });
            it('should accept current date', () => {
                const today = moment();
                const errors = validator.validateSync(datePaid(today.year(), today.month() + 1, today.date()));
                chai_1.expect(errors.length).to.equal(0);
            });
            it('should accept past date', () => {
                const yesterday = moment().subtract(1, 'days');
                const errors = validator.validateSync(datePaid(yesterday.year(), yesterday.month() + 1, yesterday.date()));
                chai_1.expect(errors.length).to.equal(0);
            });
            it('should reject date in future', () => {
                const tomorrow = moment().add(1, 'days');
                const errors = validator.validateSync(datePaid(tomorrow.year(), tomorrow.month() + 1, tomorrow.date()));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.DATE_IN_FUTURE);
            });
            it('should reject date with invalid digits in year', () => {
                const errors = validator.validateSync(datePaid(90, 12, 31));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, localDate_1.ValidationErrors.YEAR_FORMAT_NOT_VALID);
            });
        });
        context('when date is unknown', () => {
            it('should accept undefined date', () => {
                const errors = validator.validateSync(new datePaid_1.DatePaid(undefined));
                chai_1.expect(errors.length).to.equal(0);
            });
        });
    });
    describe('constructor', () => {
        it('should set fields to undefined', () => {
            let datePaid = new datePaid_1.DatePaid();
            chai_1.expect(datePaid.date).to.be.undefined;
        });
    });
    describe('deserialize', () => {
        it('should return a DatePaid instance initialised with defaults for undefined', () => {
            chai_1.expect(new datePaid_1.DatePaid().deserialize(undefined)).to.eql(new datePaid_1.DatePaid());
        });
        it('should return a DatePaid instance initialised with defaults for null', () => {
            chai_1.expect(new datePaid_1.DatePaid().deserialize(null)).to.eql(new datePaid_1.DatePaid());
        });
        it('should set the values of given json on the deserialized instance', () => {
            let deserialized = new datePaid_1.DatePaid().deserialize({
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
function datePaid(year, month, day) {
    return new datePaid_1.DatePaid(new localDate_1.LocalDate(year, month, day));
}
