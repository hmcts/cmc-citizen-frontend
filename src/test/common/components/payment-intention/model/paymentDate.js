"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const moment = require("moment");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const paymentDate_1 = require("shared/components/payment-intention/model/paymentDate");
const localDate_1 = require("forms/models/localDate");
describe('PaymentDate', () => {
    const validDateInThePastObj = { date: { day: 1, month: 1, year: 2000 } };
    const validDateInTheFutureObj = { date: { day: 1, month: 1, year: 2100 } };
    describe('deserialize', () => {
        it('should not populate fields when object not given', () => {
            const paymentDate = new paymentDate_1.PaymentDate().deserialize({});
            chai_1.expect(paymentDate.date instanceof localDate_1.LocalDate).to.equal(true);
            chai_1.expect(paymentDate.date.day).to.equal(undefined);
            chai_1.expect(paymentDate.date.month).to.equal(undefined);
            chai_1.expect(paymentDate.date.year).to.equal(undefined);
        });
        it('should not populate fields when object not given', () => {
            const paymentDate = new paymentDate_1.PaymentDate().deserialize(validDateInThePastObj);
            chai_1.expect(paymentDate.date instanceof localDate_1.LocalDate).to.equal(true);
            chai_1.expect(paymentDate.date.day).to.equal(validDateInThePastObj.date.day);
            chai_1.expect(paymentDate.date.month).to.equal(validDateInThePastObj.date.month);
            chai_1.expect(paymentDate.date.year).to.equal(validDateInThePastObj.date.year);
        });
    });
    describe('fromObject', () => {
        it('empty object should return unpopulated PaymentDate', () => {
            const paymentDate = paymentDate_1.PaymentDate.fromObject({});
            chai_1.expect(paymentDate.date).to.equal(undefined);
        });
        it('for valid input should return populated instance of PaymentDate', () => {
            const paymentDate = paymentDate_1.PaymentDate.fromObject(validDateInThePastObj);
            chai_1.expect(paymentDate.date instanceof localDate_1.LocalDate).to.equal(true);
            chai_1.expect(paymentDate.date.day).to.equal(validDateInThePastObj.date.day);
            chai_1.expect(paymentDate.date.month).to.equal(validDateInThePastObj.date.month);
            chai_1.expect(paymentDate.date.year).to.equal(validDateInThePastObj.date.year);
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        describe('should reject when', () => {
            context('invalid date', () => {
                it('when date in the past', () => {
                    const errors = validator.validateSync(new paymentDate_1.PaymentDate(new localDate_1.LocalDate().deserialize(validDateInThePastObj.date)));
                    chai_1.expect(errors.length).to.equal(1);
                    validationUtils_1.expectValidationError(errors, paymentDate_1.ValidationErrors.DATE_TODAY_OR_IN_FUTURE);
                });
                it('when invalid format of year (not 4 digits)', () => {
                    const errors = validator.validateSync(new paymentDate_1.PaymentDate(new localDate_1.LocalDate().deserialize({
                        day: 1,
                        month: 1,
                        year: 40
                    })));
                    chai_1.expect(errors.length).to.equal(1);
                    validationUtils_1.expectValidationError(errors, localDate_1.ValidationErrors.YEAR_FORMAT_NOT_VALID);
                });
            });
            context('when pay by set date is known', () => {
                it('should reject non existing date', () => {
                    const errors = validator.validateSync(new paymentDate_1.PaymentDate(new localDate_1.LocalDate(2017, 2, 29)));
                    chai_1.expect(errors.length).to.equal(1);
                    validationUtils_1.expectValidationError(errors, paymentDate_1.ValidationErrors.DATE_NOT_VALID);
                });
                it('should reject past date', () => {
                    const dayBeforeToday = moment().subtract(1, 'days');
                    const errors = validator.validateSync(new paymentDate_1.PaymentDate(new localDate_1.LocalDate(dayBeforeToday.year(), dayBeforeToday.month() + 1, dayBeforeToday.date())));
                    chai_1.expect(errors.length).to.equal(1);
                    validationUtils_1.expectValidationError(errors, paymentDate_1.ValidationErrors.DATE_TODAY_OR_IN_FUTURE);
                });
                it('should reject date with invalid digits in year', () => {
                    const errors = validator.validateSync(new paymentDate_1.PaymentDate(new localDate_1.LocalDate(90, 12, 31)));
                    chai_1.expect(errors.length).to.equal(1);
                    validationUtils_1.expectValidationError(errors, localDate_1.ValidationErrors.YEAR_FORMAT_NOT_VALID);
                });
            });
        });
        describe('should accept when', () => {
            it('valid input', () => {
                const errors = validator.validateSync(new paymentDate_1.PaymentDate().deserialize(validDateInTheFutureObj));
                chai_1.expect(errors.length).to.equal(0);
            });
        });
    });
});
