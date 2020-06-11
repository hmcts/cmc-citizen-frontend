"use strict";
/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const randomstring = require("randomstring");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const whenDidYouPay_1 = require("response/form/models/whenDidYouPay");
const moment = require("moment");
const validationConstraints_1 = require("forms/validation/validationConstraints");
const validationErrors_1 = require("forms/validation/validationErrors");
const momentFactory_1 = require("shared/momentFactory");
const localDate_1 = require("forms/models/localDate");
describe('WhenDidYouPay', () => {
    describe('deserialize', () => {
        it('should return an instance initialised with defaults for undefined', () => {
            chai_1.expect(new whenDidYouPay_1.WhenDidYouPay().deserialize(undefined)).to.deep.equal(new whenDidYouPay_1.WhenDidYouPay());
        });
        it('should return an instance from given object', () => {
            const description = 'Paid by cheque';
            const result = new whenDidYouPay_1.WhenDidYouPay().deserialize({
                text: description
            });
            chai_1.expect(result.text).to.be.equals(description);
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        it('should reject how much to pay text with undefined', () => {
            const aDayBeforeNow = moment().subtract(1, 'days');
            const pastDate = new localDate_1.LocalDate(aDayBeforeNow.year(), aDayBeforeNow.month() + 1, aDayBeforeNow.date());
            const errors = validator.validateSync(new whenDidYouPay_1.WhenDidYouPay(pastDate, undefined));
            validationUtils_1.expectNumberOfValidationErrors(errors, 1);
            validationUtils_1.expectValidationError(errors, whenDidYouPay_1.ValidationErrors.EXPLANATION_REQUIRED);
        });
        it('should reject how much to pay text with empty string', () => {
            const aDayBeforeNow = moment().subtract(1, 'days');
            const pastDate = new localDate_1.LocalDate(aDayBeforeNow.year(), aDayBeforeNow.month() + 1, aDayBeforeNow.date());
            const errors = validator.validateSync(new whenDidYouPay_1.WhenDidYouPay(pastDate, ''));
            validationUtils_1.expectNumberOfValidationErrors(errors, 1);
            validationUtils_1.expectValidationError(errors, whenDidYouPay_1.ValidationErrors.EXPLANATION_REQUIRED);
        });
        it('should reject how much to pay text with white spaces string', () => {
            const aDayBeforeNow = moment().subtract(1, 'days');
            const pastDate = new localDate_1.LocalDate(aDayBeforeNow.year(), aDayBeforeNow.month() + 1, aDayBeforeNow.date());
            const errors = validator.validateSync(new whenDidYouPay_1.WhenDidYouPay(pastDate, '    '));
            validationUtils_1.expectNumberOfValidationErrors(errors, 1);
            validationUtils_1.expectValidationError(errors, whenDidYouPay_1.ValidationErrors.EXPLANATION_REQUIRED);
        });
        it('should reject how much to pay text with more than max allowed characters', () => {
            const text = randomstring.generate({
                length: validationConstraints_1.ValidationConstraints.FREE_TEXT_MAX_LENGTH + 1,
                charset: 'alphabetic'
            });
            const aDayBeforeNow = moment().subtract(1, 'days');
            const pastDate = new localDate_1.LocalDate(aDayBeforeNow.year(), aDayBeforeNow.month() + 1, aDayBeforeNow.date());
            const errors = validator.validateSync(new whenDidYouPay_1.WhenDidYouPay(pastDate, text));
            validationUtils_1.expectNumberOfValidationErrors(errors, 1);
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.TEXT_TOO_LONG);
        });
        it('should accept how much to pay text with max allowed characters', () => {
            const aDayBeforeNow = moment().subtract(1, 'days');
            const pastDate = new localDate_1.LocalDate(aDayBeforeNow.year(), aDayBeforeNow.month() + 1, aDayBeforeNow.date());
            const errors = validator.validateSync(new whenDidYouPay_1.WhenDidYouPay(pastDate), randomstring.generate(validationConstraints_1.ValidationConstraints.FREE_TEXT_MAX_LENGTH));
            validationUtils_1.expectNumberOfValidationErrors(errors, 1);
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.TEXT_TOO_LONG);
        });
        context('when pay by set date is known', () => {
            it('should pass with past date and text', () => {
                const aDayBeforeNow = moment().subtract(1, 'days');
                const pastDate = new localDate_1.LocalDate(aDayBeforeNow.year(), aDayBeforeNow.month() + 1, aDayBeforeNow.date());
                const errors = validator.validateSync(new whenDidYouPay_1.WhenDidYouPay(pastDate, 'Paid by cheque'));
                validationUtils_1.expectNumberOfValidationErrors(errors, 0);
            });
            it('should reject date not defined', () => {
                const errors = validator.validateSync(new whenDidYouPay_1.WhenDidYouPay(undefined, 'Paid by cheque'));
                validationUtils_1.expectNumberOfValidationErrors(errors, 1);
                validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.DATE_REQUIRED);
            });
            it('should reject date with invalid digits in year', () => {
                const errors = validator.validateSync(new whenDidYouPay_1.WhenDidYouPay(new localDate_1.LocalDate(20, 2, 29), 'Paid by cheque'));
                validationUtils_1.expectNumberOfValidationErrors(errors, 1);
                validationUtils_1.expectValidationError(errors, localDate_1.ValidationErrors.YEAR_FORMAT_NOT_VALID);
            });
            it('should reject a future date', () => {
                const inFuture = momentFactory_1.MomentFactory.currentDate().add(1, 'years');
                const errors = validator.validateSync(new whenDidYouPay_1.WhenDidYouPay(new localDate_1.LocalDate(inFuture.year(), 1, 1), 'Paid by cheque'));
                validationUtils_1.expectNumberOfValidationErrors(errors, 1);
                validationUtils_1.expectValidationError(errors, whenDidYouPay_1.ValidationErrors.DATE_OUTSIDE_RANGE());
            });
            it('should reject a current date', () => {
                const today = momentFactory_1.MomentFactory.currentDate();
                const errors = validator.validateSync(new whenDidYouPay_1.WhenDidYouPay(new localDate_1.LocalDate(today.year(), today.month() + 1, today.date()), 'Paid by cheque'));
                validationUtils_1.expectNumberOfValidationErrors(errors, 1);
                validationUtils_1.expectValidationError(errors, whenDidYouPay_1.ValidationErrors.DATE_OUTSIDE_RANGE());
            });
            it('should reject date with negative values', () => {
                const errors = validator.validateSync(new whenDidYouPay_1.WhenDidYouPay(new localDate_1.LocalDate(-1, -1, -1), 'Paid by cheque'));
                validationUtils_1.expectNumberOfValidationErrors(errors, 1);
                validationUtils_1.expectValidationError(errors, localDate_1.ValidationErrors.YEAR_NOT_VALID);
                validationUtils_1.expectValidationError(errors, localDate_1.ValidationErrors.MONTH_NOT_VALID);
                validationUtils_1.expectValidationError(errors, localDate_1.ValidationErrors.DAY_NOT_VALID);
            });
        });
    });
});
