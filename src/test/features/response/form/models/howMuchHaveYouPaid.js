"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-unused-expression */
const chai_1 = require("chai");
const howMuchHaveYouPaid_1 = require("response/form/models/howMuchHaveYouPaid");
const validationErrors_1 = require("forms/validation/validationErrors");
const localDate_1 = require("forms/models/localDate");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const validationConstraints_1 = require("forms/validation/validationConstraints");
const class_validator_1 = require("@hmcts/class-validator");
const validLocalDate = localDate_1.LocalDate.fromObject({ day: 1, month: 1, year: 2010 });
const validAmount = 100;
const validText = 'valid';
describe('HowMuchHaveYouPaid', () => {
    const validator = new class_validator_1.Validator();
    context('should not be valid when', () => {
        context('amount is', () => {
            it('eq 0', () => {
                const errors = validator.validateSync(new howMuchHaveYouPaid_1.HowMuchHaveYouPaid(0, validLocalDate, validText));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, howMuchHaveYouPaid_1.ValidationErrors.AMOUNT_NOT_VALID);
            });
            it('less than 0', () => {
                const errors = validator.validateSync(new howMuchHaveYouPaid_1.HowMuchHaveYouPaid(-10, validLocalDate, validText));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, howMuchHaveYouPaid_1.ValidationErrors.AMOUNT_NOT_VALID);
            });
        });
        context('date is', () => {
            it('in the future', () => {
                const dateInThePast = localDate_1.LocalDate.fromObject({ day: 10, month: 10, year: 2200 });
                const errors = validator.validateSync(new howMuchHaveYouPaid_1.HowMuchHaveYouPaid(validAmount, dateInThePast, validText));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, howMuchHaveYouPaid_1.ValidationErrors.VALID_PAST_DATE);
            });
            it('invalid', () => {
                const dateInThePast = localDate_1.LocalDate.fromObject({ day: 33, month: 13, year: 1990 });
                const errors = validator.validateSync(new howMuchHaveYouPaid_1.HowMuchHaveYouPaid(validAmount, dateInThePast, validText));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, localDate_1.ValidationErrors.DAY_NOT_VALID);
            });
            it('undefined', () => {
                const errors = validator.validateSync(new howMuchHaveYouPaid_1.HowMuchHaveYouPaid(validAmount, undefined, validText));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.DATE_REQUIRED);
            });
        });
        context('text is', () => {
            it('empty', () => {
                const errors = validator.validateSync(new howMuchHaveYouPaid_1.HowMuchHaveYouPaid(validAmount, validLocalDate, ''));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, howMuchHaveYouPaid_1.ValidationErrors.EXPLANATION_REQUIRED);
            });
            it('undefined', () => {
                const errors = validator.validateSync(new howMuchHaveYouPaid_1.HowMuchHaveYouPaid(validAmount, validLocalDate, undefined));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, howMuchHaveYouPaid_1.ValidationErrors.EXPLANATION_REQUIRED);
            });
            it('too long', () => {
                const errors = validator.validateSync(new howMuchHaveYouPaid_1.HowMuchHaveYouPaid(validAmount, validLocalDate, validationUtils_1.generateString(validationConstraints_1.ValidationConstraints.FREE_TEXT_MAX_LENGTH + 1)));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.TEXT_TOO_LONG);
            });
        });
    });
});
